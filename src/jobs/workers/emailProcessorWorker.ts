import { Worker, Job } from "bullmq";
import { EmailProcessingPayload } from "../types";
import { logger } from "../../config/logger";
import {redisConnection} from "../../config/redis";

const N8N_WEBHOOK_URL = '127.0.0.1:5678/webhook-test/handle-unread-mail';
const WORKER_CONCURRENCY = 5;
const REQUEST_TIMEOUT_MS = 30_000 * 10;
//function that define the worker's actual work
const processEmailJobs = async (job:Job<EmailProcessingPayload>):Promise<void> => {
    const abortController = new AbortController();  
    const timeout = setTimeout(()=>abortController.abort(),REQUEST_TIMEOUT_MS);
    try{             
        const response = await fetch(N8N_WEBHOOK_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(job.data),
            signal:abortController.signal
        });
        if(!response.ok){
            logger.error(`[EMAIL-PROCESSING-WORKER] n8n responded with a status ${response.status}`);
            throw new Error(`n8n responded with a status ${response.status}`);
        }
        const result =await response.json();
        logger.info(`[EMAIL-PROCESSING-WORKER] job of ID ${job.id} for user ID ${job.data.user_id} successfully processed`,result);
    }catch(err){        
        if(err instanceof Error){
            logger.error(`[EMAIL-PROCESSING-WORKER] worker error`,{
                jobId:job.id,
                userId:job.data.user_id,
                message:err.message
            });
        }else{
            logger.error(`[EMAIL-PROCESSING-WORKER] Error processing job of ID ${job.id} for user of ID ${job.data.user_id}`,{
                jobId:job.id,
                userId:job.data.user_id
            });
        }
        throw err;
    }finally{
        clearTimeout(timeout);
    }
}
//init the worker variable with null value
let emailProcessorWorker:Worker<EmailProcessingPayload>|null = null;
//function to initialize the worker
export const initEmailProcessorWorker = () => {
    if(emailProcessorWorker) return emailProcessorWorker;
    emailProcessorWorker = new Worker<EmailProcessingPayload>(
        'email-processing',
        processEmailJobs,
        {
            connection:redisConnection,
            concurrency:WORKER_CONCURRENCY
        }
    )
    emailProcessorWorker.on('completed',(job)=>{
        logger.info(`[EMAIL-PROCESSING-WORKER] worker successfully completed a job`,{
            jobId:job.id,
            user_id:job.data.user_id
        });
    });
    emailProcessorWorker.on('failed',(job,err)=>{
        logger.error('[EMAIL-PROCESSING-WORKER] worker failed',{
            jobId:job?.id,
            userId:job?.data.user_id,
            message:err.message
        });
    });
    emailProcessorWorker.on('error',(err)=>{
        logger.error('[EMAIL-PROCESSING-WORKER] worker error',{
            message:err.message
        });
    });
    return emailProcessorWorker;
}
//function to close the worker and make the variable null again
export const closeEmailProcessorWorker = async () => {
    if(emailProcessorWorker){
        await emailProcessorWorker.close();
        emailProcessorWorker = null;
    }
}