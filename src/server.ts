import http from 'http'
import {app} from './app.js'
import env from './config/env.js'
import { logger } from './config/logger.js';
import { testConnection } from './db/index.js';
// import { sequelize, testConnection } from './db/index.js';
//event handler if any uncaught exception occurs at global level
process.on('uncaughtException',(err:Error)=>{
    logger.error(`uncaught Exception has occurred while starting the server: ${err}`);
});
//event handler if any unhandled rejection occurs at global level
process.on('unhandledRejection',(reason:any)=>{
    logger.error(`unhandled rejection has occurred: ${reason}`);
});
//port definition
const port = env.APP_PORT || 3003;
//function to start the server
const startServer = async ()=>{
    try{
        //test the db connection
        await testConnection();
        logger.info('DB connected successfully!');
        //server starting and listening to port
        const server = http.createServer(app);
        server.listen(port,()=>{
            logger.info(`The server is listening to port ${port}`);
        });
        //event handlers for if any shutdown signal comes in the process ('SIGINT' and 'SIGTERM' these two are mainly shutdown signals)
        process.on('SIGINT',()=>gracefulShutdown('SIGINT'));
        process.on('SIGTERM',()=>gracefulShutdown('SIGTERM'));
        //function for shutting down the server gracefully
        async function gracefulShutdown(signal:string){
            try{
                logger.info(`signal ${signal} received for shutting down the server!`);
                // await sequelize.close();
                logger.info(`database connection closed successfully!`);
                server.close(async()=>{
                    logger.info(`server closed successfully! Bye Bye!`);
                    process.exit(0);
                });
                setTimeout(() => {
                    logger.warn('Forcing shutdown due to timeout!');
                    process.exit(1);
                }, 5000); // 5 seconds max           
            }catch(error){
                logger.error(`error shutting down the server: ${error}`);
                process.exit(1);
            }      
        }
    }catch(err){
        logger.error('error starting the server',err);
        process.exit(1);
    }    
}
//calling the startServer function
startServer();