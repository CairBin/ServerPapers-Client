/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/socket/ClientSocket.ts - 初始化并加载SocketIO客户端
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import {io, Socket} from 'socket.io-client';
import ISocketListener from './ISocketListener';
import config from 'config';
import Builder, { ISettings } from '../Builder';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import ILogger from '../logger/ILogger';
import ConnectListener from '../listener/ConnectListener';
import {container} from '../CustomDI';
import fs from 'fs';
import path from 'path';

@injectable()
export default class ClientSocket{
    private socket!:Socket;
    private listeners:Set<ISocketListener>;
    private logger!:ILogger;
    public isReady:boolean = false;

    constructor(@inject("ILogger") logger:ILogger){
        const ca:Array<string> = [];
        // 加载CA证书
        config.get<Array<string>>('ca')
        .forEach((item)=>{
            ca.push(fs.readFileSync(item).toString());
        });
        
        this.socket = io(config.get<string>('url'),{
            transports: ['websocket'],
            rejectUnauthorized:config.get<boolean>('rejectUnauthorized'),
            ca:ca
        });
        this.listeners = new Set();
        this.logger = logger;
    }

    public use(listener:ISocketListener){
        if(!this.listeners.has(listener))
            this.listeners.add(listener);
    }

    public ready():void{
        while(!this.isReady);   // 确保加载完毕
        // 调用监听器监听方法
        this.listeners.forEach((item)=>{
            if(!item || !item.eventName || item.eventName === '')
                throw new Error('Invalid listener');

            this.logger.info(`Bind event '${item.eventName}'`);
            this.socket.on(item.eventName, (...args:any[])=>{
                item.onEvent(this.socket, args);
            })
        });
    }
}



// @Listener装饰器，利用反射标识类是一个监听器
export function Listener<T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata('cus:Listener',true,constructor);
    return constructor;

}

// 初始化ClientSocket模块的接口
export class ClientSocketSettings implements ISettings {
    loadSettings(builder: Builder): void {
        const clientSocket = container.get<ClientSocket>(ClientSocket);
        // 获取事件监听器目录
        const listenerPath = path.resolve('./src/listener/');
        // 读取目录下所有模块
        fs.readdirSync(listenerPath).forEach(async (file)=>{
            const filePath = path.join(listenerPath, file);
            // 加载模块
            import(filePath).then((module)=>{
                for (const [key, value] of Object.entries(module)){
                    // 判断是否被@Listener修饰
                    let flag = Reflect.getMetadata('cus:Listener', value as any);
                    if(flag){
                        // 如果是则说明是一个监听器
                        const name = ((new (value as any)) as ISocketListener).eventName as string;
                        // 注入到IOC容器中
                        container.bind(name)
                            .to(value as any);
                        // 从容器中返回实例对象，并加载到clientSocket中去
                        // 注意此处不能用new关键字，必须从容器返回
                        // 如果使用new则无法进行依赖注入
                        clientSocket.use(
                            container.get<ISocketListener>(name)
                        );
                    }
                }
                clientSocket.isReady = true;
                clientSocket.ready();
            });
            
        });

    }
}