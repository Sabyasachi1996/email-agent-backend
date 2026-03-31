import { reqContext } from "./context.js";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const logFormat = winston.format.printf(({message,level,timestamp,...metadata})=>{
   const store = reqContext.getStore();
   const reqId = store?.get('requestId') || 'SYSTEM';
   return `[${timestamp}] [${reqId}] ${level}: ${message} ${Object.keys(metadata).length?JSON.stringify(metadata):''}`;
});

export const logger = winston.createLogger({
  level:'info',
  format:winston.format.combine(winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),logFormat),
  transports:[
    new winston.transports.Console({
      format:winston.format.combine(winston.format.colorize(),logFormat)
    }),
    new DailyRotateFile({
      dirname:'logs',
      filename:'application-%DATE%.log',
      datePattern:'YYYY-MM-DD',
      zippedArchive:true,
      maxSize:'20m',
      maxFiles:'14d'
    }),
    new DailyRotateFile({
      level:'error',
      dirname:'logs',
      filename:'error-%DATE%.log',
      datePattern:'YYYY-MM-DD',
      zippedArchive:true,
      maxSize:'20m',
      maxFiles:'30d'
    })
  ]
});