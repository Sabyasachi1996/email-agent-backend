import pg from 'pg'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '../generated/prisma/index.js'
import env from '../config/env.js';
import { logger } from '../config/logger.js';
export const pool = new pg.Pool({
    host:env.DATABASE_HOST,
    port:env.DATABASE_PORT,
    user:env.DATABASE_USER,
    password:env.DATABASE_PASSWORD,
    database:env.DATABASE_DATABASE
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({adapter});
export const checkDBConnectivity = async () => {
    try{
        //physical connection check(only postgres)
        const client = await pool.connect();
        client.release();
        //with prisma check(prisma + postgres)
        await db.$connect();
        logger.info('[DB CONNECTION CHECK] connected');       
    }catch(err){
        logger.error('[DB CONNECTION CHECK] failed',{
            message:(err instanceof Error)?err.message:null,
            stack:(err instanceof Error)?err.stack:null
        });
        process.exit(1);
    }
}
export default db;