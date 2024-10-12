/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/listener/ReadyListener.ts - 用于监听 'ready' 事件
 * 该事件用于启用定时器以向服务器发送硬件信息
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { Socket } from "socket.io-client";
import ISocketListener from "../socket/ISocketListener";
import { Listener } from "../socket/ClientSocket";
import ILogger from "../logger/ILogger";
import { inject, injectable } from "inversify";
import IStateHelper from "../status/IStateHelper";
import config from 'config';
import IHash from "../crypto/IHash";

// 发送信息的格式
interface ClientMessage{
    user:string;
    token:string;
    data:Object;
}

@injectable()
@Listener
export default class ReadyListener implements ISocketListener{
    @inject("ILogger")
    private logger!:ILogger;

    @inject("IHash")
    hash!:IHash;

    @inject("IStateHelper")
    private stateHelper!: IStateHelper;

    private interval:NodeJS.Timer | null = null;
    
    eventName: string = 'ready';
    onEvent(socket: Socket, ...args: any[]): void {
        this.logger.info('Ready send device information');
        if(this.interval !== null) return;  // 如果定时器已经启动就直接返回

        // 若定时器不存在则启用一个，每个1000ms返回发送一次信息
        this.interval = setInterval(async ()=>{
            const sendMsg:ClientMessage = {
                data:{
                    cpu: await this.stateHelper.getCpuInfo(),
                    system: await this.stateHelper.getSystemInfo(),
                    memory: await this.stateHelper.getMemoryInfo(),
                    network: await this.stateHelper.getNetworkInfo(),
                    disk: await this.stateHelper.getDiskInfo(),
                    time: await this.stateHelper.getTimeInfo()
                },
                user:config.get<string>('user'),
                token: this.hash.hash(config.get<string>('pwd')),
            }
            socket.emit('clientData',sendMsg);
        }, 1000);
    }
}