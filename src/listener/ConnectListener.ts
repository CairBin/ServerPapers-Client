/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/listener/ConnectListener.ts - 用于监听 'connect' 事件
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { Socket } from "socket.io-client";
import ISocketListener from "../socket/ISocketListener";
import { Listener } from "../socket/ClientSocket";
import ILogger from "../logger/ILogger";
import { inject, injectable } from "inversify";

import config from 'config';
import IHash from "../crypto/IHash";

interface LoginInfo{
    user:string;
    pwd:string;
}

interface HelloMessage{
    flag:string;
    token:string;
    data:string;
    user:string;
}

@injectable()
@Listener
export default class ConnectListener implements ISocketListener{
    @inject("ILogger")
    private logger!:ILogger;

    @inject("IHash")
    private hash!:IHash;

    private loginInfo!: LoginInfo;
    
    constructor(){
        this.loginInfo = {
            user: config.get<string>('user'),
            pwd: config.get<string>('pwd')
        };
    }

    eventName: string = 'connect';
    onEvent(socket: Socket, ...args: any[]): void {
        this.logger.info('Connection has been established.');
        const data:HelloMessage = {
            flag: "client",
            token: this.hash.hash(this.loginInfo.pwd),
            data: "",
            user: this.loginInfo.user
        }
        socket.emit('hello', data);
    }
}


