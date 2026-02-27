import pg from 'pg'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '../generated/prisma/index.js'
import env from '../config/env.js';
export const pool = new pg.Pool({
    host:env.DATABASE_HOST,
    port:env.DATABASE_PORT,
    user:env.DATABASE_USER,
    password:env.DATABASE_PASSWORD,
    database:env.DATABASE_DATABASE
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({adapter});
export const testConnection = async () => {
    try{
        //physical connection check(only postgres)
        const client = await pool.connect();
        client.release();
        //with prisma check(prisma + postgres)
        await db.$connect();
        console.log('Postgres+prisma connection successful');
    }catch(err){
        console.error("Postgres+prisma connection failed, exiting...");
        process.exit(1);
    }
}
export default db;