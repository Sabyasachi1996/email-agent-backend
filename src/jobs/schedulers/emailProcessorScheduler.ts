import cron from "node-cron";
import db from "../../db";
import { logger } from "../../config/logger";
import { EmailProcessingPayload } from "../types";
import env from "../../config/env";
import { getEmailProcessingQueue } from "../queues/emailProcessingQueue";
const BATCH_SIZE = 100;
const enqueueEmailJobsForAllUsers = async () => {
    try{
        let emailProcessingQueue = getEmailProcessingQueue();
        let skip = 0;
        let hasMore = true;
        while(hasMore){
            const allUsersWithEmailAndCalendarAccounts = await db.user.findMany(
                {
                    where:{
                        isAutomationActive:true
                    },
                    take:BATCH_SIZE,
                    skip,
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        phone:true,
                        isActive:true,
                        isAutomationActive:true,
                        aiResponseTone:true,
                        lastAutomationRanAt:true,
                        emailAccounts:{
                            where:{isActive:true},
                            select:{
                                id:true,
                                emailAddress:true,
                                appPassword:true,
                                accessToken:true,
                                refreshToken:true,
                                smtpHost:true,
                                smtpPort:true,
                                imapHost:true,
                                imapPort:true,
                                provider:true
                            }
                        },
                        calendarAccounts:{
                            where:{isActive:true},
                            select:{
                                id:true,
                                emailAddress:true,
                                accessToken:true,
                                refreshToken:true,
                                provider:true,
                                isActive:true
                            }
                        }
                    }
                },
            );
            //if no users found, just stop there
            if(allUsersWithEmailAndCalendarAccounts.length === 0){            
                logger.info(`[EMAIL-PROCESSING-SCHEDULING] No users found to process, skipping schedular...`);
                hasMore=false;
                break;
            }
            for(let eachUser of allUsersWithEmailAndCalendarAccounts){
                if(eachUser.calendarAccounts.length === 0){
                    logger.info(`[EMAIL-PROCESSING-SCHEDULING] No calendar account found for user with id ${eachUser.id}, skipping user...`);
                    continue;
                }
                const queuAdditionJobs = eachUser.emailAccounts.map((eachEmailAccount)=>{
                    const emailProcessingQueueData:EmailProcessingPayload = {
                        user_id:eachUser.id,
                        calendar_mail:eachUser.calendarAccounts[0].emailAddress,
                        calendar_refresh_token:eachUser.calendarAccounts[0].refreshToken ?? '',
                        calendar_provider:eachUser.calendarAccounts[0].provider, 
                        subscription_date:new Date('2023-01-01T23:59:59.111Z'),//TODO:will come from table when the subscription is added
                        google_project_client_id:env.GOOGLE_CLIENT_ID,
                        google_project_client_secret:env.GOOGLE_CLIENT_SECRET,
                        microsoft_project_client_id:env.MICROSOFT_CLIENT_ID,
                        microsoft_project_client_secret:env.MICROSOFT_CLIENT_SECRET,
                        microsoft_project_object_id:env.MICROSOFT_OBJECT_ID,             
                        subject_email:eachEmailAccount.emailAddress,
                        subject_provider:eachEmailAccount.provider,
                        subject_password:eachEmailAccount.appPassword ?? '',
                        subject_refresh_token:eachEmailAccount.refreshToken ?? '',
                        subject_imap_url:eachEmailAccount.imapHost ?? '',
                        subject_imap_port:eachEmailAccount.imapPort ?? 0,
                        subject_smtp_url:eachEmailAccount.smtpHost ?? '',
                        subject_smtp_port:eachEmailAccount.smtpPort ?? 0  
                    }
                    return emailProcessingQueue.add('email-processing',emailProcessingQueueData,{
                        jobId:`${eachUser.id}-${eachEmailAccount.id}-${Date.now()}`
                    });
                });
                const queueAdditionResult = await Promise.allSettled(queuAdditionJobs);
                queueAdditionResult.forEach((res,idx)=>{
                    if(res.status === 'rejected'){
                        logger.error(`[EMAIL-PROCESSING-SCHEDULING] unable to add to email processing queue`,{
                            userId:eachUser.id,
                            emailAccountId:eachUser.emailAccounts[idx].emailAddress,
                            reason:res.reason
                        });   
                    }                    
                });       
            }
            skip+=BATCH_SIZE;
        }       
    }catch(err){
        logger.error(`[EMAIL-PROCESSING-SCHEDULING] Error while scheduling job`,{
            stack:err instanceof Error?err.stack:null
        });               
    }    
}

export const initEmailProcessorSchedular = () => {
    cron.schedule("*/5 * * * *",enqueueEmailJobsForAllUsers);
    logger.info('[EMAIL-PROCESSOR-SCHEDULAR] scheduled');
}