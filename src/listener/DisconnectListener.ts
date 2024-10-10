/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/listener/DisconnectListener.ts - 用于监听 'disconnect' 事件
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { Socket } from "socket.io-client";
import ISocketListener from "../socket/ISocketListener";
import { Listener } from "../socket/ClientSocket";
import ILogger from "../logger/ILogger";
import { inject, injectable } from "inversify";

@injectable()
@Listener
export default class DisonnectListener implements ISocketListener{
    @inject("ILogger")
    private logger!:ILogger;
    
    eventName: string = 'disconnect';
    onEvent(socket: Socket, ...args: any[]): void {
        this.logger.info('Connection has been closed');
    }
}