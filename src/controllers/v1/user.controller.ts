import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError.utils";
import { createEmailAccount, getAccounts, getUserProfile } from "../../services/user.service";
import { LinkAccountInput } from "./types";
import { LinkAccountFactory } from "../../services/link-account/factory";

export const getUserAccounts = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',401);
        const accounts = await getAccounts(userId);
        return res.status(200).json({
            error:false,
            message:'accounts fetched',
            data:accounts
        });
    }catch(err){
        //throwing error to the next middleware(global error handling middleware in this case)
        next(err);
    }
}

export const linkAccount = async (req:Request,res:Response,next:NextFunction)=>{
    try{
       const userId = req.user?.id;
       if(!userId) throw new AppError('invalid user',400); 
       const input = req.body as LinkAccountInput;      
       const providerName = input.provider.toLowerCase();
       const provider =  LinkAccountFactory.getProvider(providerName);
       const providerResponse = await provider.link(input);
       await createEmailAccount(providerResponse,userId);
       return res.status(200).json({
        error:false,
        message:"Email account created for the user"
       }); 
    }catch(err){
        next(err);
    }
}

export const getProfile = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',400);
        const profile = await getUserProfile(userId);
        return res.status(200).json({
            error:false,
            message:'profile fetched',
            data:profile
        });
    }catch(err){
        next(err);
    }
}