/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/listener/ConnectErrorListener.ts - 用于监听 'connect_error' 事件
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { inject, injectable } from "inversify";
import { Listener } from "../socket/ClientSocket";
import ILogger from "../logger/ILogger";
import { Socket } from "socket.io-client";
import ISocketListener from "../socket/ISocketListener";


@Listener
@injectable()
export default class ConnectErrorListener implements ISocketListener{
    @inject("ILogger")
    private logger!:ILogger;
    
    eventName: string = 'connect_error';
    onEvent(socket: Socket, ...args: any[]): void {
        this.logger.error(`connection error ${args[0]}`);
    }
}