/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/logger/PinoLogger.ts - pino日志库实现的ILogger
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import pino from "pino";
import ILogger from "./ILogger";
import dayjs from "dayjs";
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export default class PinoLogger implements ILogger{
    private logger = pino({
        transport:{
            target: 'pino-pretty',
        },
        base:{
            pid: false,
        },
        timestamp: () => dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    
    debug(msg: string, ...args: any[]): void {
        this.logger.debug(msg,...args);
    }
    info(msg: string, ...args: any[]): void {
        this.logger.info(msg,...args);
    }
    warn(msg: string, ...args: any[]): void {
        this.logger.warn(msg,...args);
    }
    error(msg: string, ...args: any[]): void {
        this.logger.error(msg,...args);
    }
    fatal(msg: string, ...args: any[]): void {
        this.logger.fatal(msg,...args);
    }
    getLogger() {
        return this.logger;
    }

}