import db from "../db";
import { ActiveSubscriptionPlanData, NewSubscriptionDataset, SubscriptionCreationDataset, SubscriptionPlanData } from "./types";

export const fetchAllSubscriptionPlans = async ():Promise<SubscriptionPlanData[]> => {
    try{
        const plans = await db.subscriptionPlan.findMany({
            select:{
                id:true,
                name:true,
                monthlyQuota:true,
                price:true,
                gatewayPlanId:true,
                billingInterval:true,
                gatewayCustomerNotify:true,
                gatewayTotalCount:true
            }
        });
        return plans;
    }catch(err){
        throw err;
    }
}
export const fetchActiveSubscriptionPlan = async (userId:string):Promise<ActiveSubscriptionPlanData | null> => {
    try{
        const activePlanData = await db.subscription.findFirst({
            orderBy:{
                createdAt:'desc'
            },
            where:{userId,isActive:true,endDate:{gte:new Date()}},
            select:{
                id:true,
                userId:true,
                planId:true,
                currentUsageCount:true,
                startDate:true,
                endDate:true,
                gatewaySubscriptionId:true,
                user:{
                    select:{
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        isActive: true,
                        isAutomationActive:true,
                        aiResponseTone:true,
                        lastAutomationRanAt:true,
                        createdAt: true  
                    }
                },
                plan:{
                    select:{
                        id:true,
                        name:true,
                        monthlyQuota:true,
                        price:true,
                        gatewayPlanId:true,
                        billingInterval:true,
                        gatewayCustomerNotify:true,
                        gatewayTotalCount:true
                    }
                },
            }
        });
        return activePlanData;
    }catch(err){
        throw err;
    }
}

export const fetchSelectedSubscriptionPlan = async (id:string):Promise<SubscriptionPlanData | null> => {
     try{
        const plan = await db.subscriptionPlan.findFirst({
            where:{id},
            select:{
                id:true,
                name:true,
                monthlyQuota:true,
                price:true,
                gatewayPlanId:true,
                billingInterval:true,
                gatewayCustomerNotify:true,
                gatewayTotalCount:true
            }
        });
        return plan;
    }catch(err){
        throw err;
    }
}

export const generateSubscription = async (subscriptionDataset:SubscriptionCreationDataset):Promise<NewSubscriptionDataset> => {
    try{
        const newSubscriptionData = await db.subscription.create({
            data:subscriptionDataset
        });
        return newSubscriptionData; 
    }catch(err){
        throw err;
    }
}