import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError.utils";
import { fetchActiveSubscriptionPlan, fetchAllSubscriptionPlans, fetchSelectedSubscriptionPlan, generateSubscription } from "../../services/finance.service";
import { CreateSubscriptionInput, VerifySubscriptionInput } from "./types";
import razorpay from "../../config/razorpay";
import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { SubscriptionCreationDataset } from "../../services/types";
import env from "../../config/env";
import crypto from 'crypto'
import db from "../../db";
import { logger } from "../../config/logger";

//to get the profile details of a logged in user
export const getSubscriptionPlans = async (req:Request,res:Response,next:NextFunction)=>{
    try{        
        const plans = await fetchAllSubscriptionPlans();
        return res.status(200).json({
            error:false,
            message:'Subscription plans fetched',
            data:plans
        });
    }catch(err){
        next(err);
    }
}
export const getCurrentSubscriptionPlan = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        const activePlan = await fetchActiveSubscriptionPlan(userId);
        return res.status(200).json({
            error:false,
            message:"Active subscription plan fetched",
            data:activePlan
        });
    }catch(err){
        next(err);
    }
}
export const createSubscription =async (req:Request, res:Response,next:NextFunction) => {
    try{
        const input = req.body as CreateSubscriptionInput;
        const userId = req.user?.id;
        //check if a user id is there
        if(!userId) throw new AppError("Invalid user",400);
        //get the selected plan
        const selectedPlan = await fetchSelectedSubscriptionPlan(input.planId);
        if(!selectedPlan || !selectedPlan.gatewayPlanId) throw new AppError("Invalid plan selected",400);
        //no one should select the trial plan here
        if(selectedPlan.billingInterval === "TRIAL") throw new AppError("Invalid plan selected",400);
        //selected plan should have the total count, gateway plan id and customer notify values present
        if(!selectedPlan.gatewayPlanId || !selectedPlan.gatewayTotalCount || !selectedPlan.gatewayCustomerNotify){
            throw new AppError("Invalid plan selected",400);
        }        
        const newSubscriptionData = await razorpay.subscriptions.create({
            plan_id:selectedPlan.gatewayPlanId,
            total_count:selectedPlan.gatewayTotalCount,
            customer_notify: selectedPlan.gatewayCustomerNotify == 1,
        });;
        
        //generate subscription dataset        
        const startDate = new Date();
        const endDate = new Date();
        if(selectedPlan.billingInterval === 'YEAR'){
            endDate.setFullYear(startDate.getFullYear() + 1);
        }else if(selectedPlan.billingInterval === 'MONTH'){
            endDate.setMonth(startDate.getMonth() + 1);
        }else{
            throw new AppError("Invalid billing interval",400);
        }
        const subscriptionDataset:SubscriptionCreationDataset = {    
            userId:userId,
            planId:selectedPlan.id,
            gatewaySubscriptionId:newSubscriptionData.id,
            currentUsageCount:0,
            startDate:startDate,
            endDate:endDate,
            isActive:false    
        }
        const newSubscriptionTableData = await generateSubscription(subscriptionDataset);
        return res.status(200).json({
            error:false,
            message:"Subscription initialized",
            data:{
                gatewaySubscriptionId:newSubscriptionData.id,
                internalSubscriptionId:newSubscriptionTableData.id               
            }
        });
    }catch(err){
        console.log(err);
        next(err);
    }
}
export const verifySubscription = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as VerifySubscriptionInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const razorpaySecret = env.RAZORPAY_SECRET;
        if(!razorpaySecret) throw new AppError("Server Misconfiguration",500);
        const signature = crypto.createHmac("sha256",razorpaySecret)
        .update(`${input.razorpay_payment_id}|${input.razorpay_subscription_id}`)
        .digest("hex");
        if(input.razorpay_signature !== signature) throw new AppError("Signature mismatch",400);
        const result = await db.$transaction(async(tx)=>{
            //set an initial value of the rolledOver quota
            let rolledOverQuota = 0;
            let lastGatewaySubscriptionId = null;
           //check if internal subscription id is actually of any valid subscription or not
           const concernedSubscription = await tx.subscription.findUnique({
            where:{id:input.internal_subscription_id},
            include:{plan:true}
           });
           if(!concernedSubscription || concernedSubscription.userId !== userId || concernedSubscription.gatewaySubscriptionId !== input.razorpay_subscription_id) throw new AppError("Invalid current subscription, contact authority",400);
           //find last active plan if any(the one whose is_active is true and also endDate does not pass yet)
           const lastActiveSubscription = await tx.subscription.findFirst({
                where:{
                    isActive:true,
                    userId,
                    id: { not: input.internal_subscription_id },
                    endDate:{gt:new Date()}
                },
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    plan:true
                }
           });
           //if last active plan present, update the rolled over quota based on that plan's remaining quota
           if(lastActiveSubscription && lastActiveSubscription.plan.billingInterval !=="TRIAL"){
                rolledOverQuota = Math.max(0,(lastActiveSubscription.plan.monthlyQuota - lastActiveSubscription.currentUsageCount));
                lastGatewaySubscriptionId = lastActiveSubscription.gatewaySubscriptionId;                
           }          
           //mark all current active subscriptions as is_active false
           await tx.subscription.updateMany({
                where:{
                    userId,
                    isActive:true
                },
                data:{
                    isActive:false
                }
           });
            //update your last created subscription that you created before going to payment gateway and mark it as is_active=true and adjust the quota too
            await tx.subscription.update({
                where:{
                    id:input.internal_subscription_id
                },
                data:{
                    currentUsageCount:(0 - rolledOverQuota),                    
                    isActive:true
                }
            });
            //create a payment table entry for the newly created subscription 
            await tx.payment.create({
                data:{
                    userId,
                    subscriptionId:input.internal_subscription_id,
                    amount:concernedSubscription.plan.price,
                    status:"SUCCESS",
                    gatewayOrderId:input.razorpay_subscription_id,
                    gatewayPaymentId:input.razorpay_payment_id,
                    gatewaySignature:input.razorpay_signature
                }
            });
            return lastGatewaySubscriptionId;
        });
        if(result){
           try{
            await razorpay.subscriptions.cancel(result);
           }catch(e){
            logger.warn("unable to cancel old subscription",{
                userId,result,
            });
           } 
        }        
        //send response
        return res.status(200).json({
            error:false,
            message:"Your plan is active now",
            data:result
        });
    }catch(err){
        next(err);
    }
}



