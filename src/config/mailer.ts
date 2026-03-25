import nodemailer from 'nodemailer'
import env from './env';
import { logger } from './logger';
import db, { pool } from '../db';

export const mailer = nodemailer.createTransport({
    host: env.MAIL_SMTP_HOST,
    port:env.MAIL_SMTP_PORT,
    secure:env.MAIL_SMTP_PORT === 465,
    auth:{
        user:env.APP_MAIL,
        pass:env.APP_MAIL_PASSWORD
    }
});

export const checkMailerConnectivity = async () => {
    try{
        await mailer.verify();
        logger.info('[MAILER CONNECTION CHECK] SMTP connection is successful');
    }catch(err){
        logger.error(`[MAILER CONNECTION CHECK] SMTP connection failed`,err);        
        await Promise.allSettled([
            db.$disconnect(),
            pool.end()
        ]);
        logger.info('[DB CONNECTION] closed');
        process.exit(1);
    }
}