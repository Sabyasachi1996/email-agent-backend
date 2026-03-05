import db from "../db"
import AppError from "../utils/appError.utils";
import { LinkAccountResponse } from "./link-account/types";

export const getAccounts = async (userId:string)=> {
    try{
        const accounts =await db.emailAccount.findMany({
            where:{userId,isActive:true},
            select:{
                emailAddress:true,
                createdAt:true
            }
        });
        if(accounts.length === 0) throw new AppError('no profiles found',404);
        const accountData = accounts.map(function(account){
            return {
                email:account.emailAddress,
                createdAt:account.createdAt
            }
        });
        return accountData;
    }catch(err){
        throw err;
    }
}
export const createEmailAccount = async (providerResponse:LinkAccountResponse,userId:string):Promise<boolean> => {
    try{
        return await db.$transaction(async(tx)=>{
            const existingEmailAccount =await tx.emailAccount.findFirst({
                where:{emailAddress:providerResponse.email}
            });
            if(existingEmailAccount) throw new AppError('Email account already exists',409);
            await tx.emailAccount.create({
                data:{
                    emailAddress:providerResponse.email,
                    accessToken:providerResponse.accessToken,
                    refreshToken:providerResponse.refreshToken,
                    appPassword:providerResponse.password,
                    imapHost:providerResponse.imap_host,
                    imapPort:providerResponse.imap_port,
                    smtpHost:providerResponse.smtp_host,
                    smtpPort:providerResponse.smtp_port,
                    provider:providerResponse.provider,
                    userId,
                    isActive:true
                }            
            });
            return true;
        });        
    }catch(err){
        throw err;
    }
}