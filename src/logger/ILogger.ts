/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/logger/ILogger.ts - 日志记录器接口，用于依赖注入
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { container } from "../CustomDI";

export default interface ILogger{
    debug(msg:string, ...args: any[]):void;
    info(msg:string, ...args:any[]):void;
    warn(msg:string, ...args:any[]):void;
    error(msg:string, ...args: any[]):void;
    fatal(msg:string, ...args: any[]):void;

    getLogger():any;
}

// 方法装饰器，实现环绕日志
// 级别为debug，可能不会打印（与具体Logger的日志级别有关）
export function LogDebug(target:Object, propertyKey:string, descriptor: TypedPropertyDescriptor<any>){
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        let logger = container.get<ILogger>("ILogger");
        logger.debug(`Excuting method ${propertyKey}`);
        logger.debug(`Arguments: ${JSON.stringify(args)}`);
        let result = originalMethod.apply(this, args);
        
        if(result instanceof Promise)
            result.then((val:any)=>{
                logger.debug(`Result: ${val}`);
            }).catch((error:any)=>{
                logger.error(`Error: ${error}`);
            })
        else
            logger.debug(`Result: ${result}`);
        return result;
    }
}