/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/socket/ISocketListener.ts - 事件监听器的接口
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */


import { Socket } from "socket.io-client";

export default interface ISocketListener{
    eventName:string;
    onEvent(socket:Socket, ...args: any[]):void;
}