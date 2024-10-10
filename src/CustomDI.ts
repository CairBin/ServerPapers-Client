/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/CustomDI.ts - 配置依赖注入
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import {Container} from 'inversify';
import 'reflect-metadata';
import Builder, { ISettings } from './Builder';
import ILogger from './logger/ILogger';
import PinoLogger from './logger/PinoLogger';
import IStateHelper from './status/IStateHelper';
import StateHelper from './status/StateHelper';
import IHash, { HashType } from './crypto/IHash';
import config from 'config';
import Md5Hash from './crypto/Md5Hash';
import Sha256Hash from './crypto/Sha256Hash';
import Sm3Hash from './crypto/Sm3Hash';
import ClientSocket from './socket/ClientSocket';

// 容器
export const container = new Container();

// 依赖注入初始化，通常来讲这应当是第一个被Builder加载的
export class DISettings implements ISettings{
    loadSettings(builder: Builder): void {
        container.bind<ILogger>("ILogger")
        .to(PinoLogger)
        .inSingletonScope();

        container.bind<IStateHelper>("IStateHelper")
        .to(StateHelper)
        .inSingletonScope();

        const hashType:HashType = config.get<HashType>('hash');
        switch(hashType){
            case HashType.MD5:
                container.bind<IHash>("IHash")
                .to(Md5Hash).inSingletonScope();
                break;
            case HashType.SHA256:
                container.bind<IHash>("IHash")
                .to(Sha256Hash).inSingletonScope();	
                break;
            default:
                container.bind<IHash>("IHash")
                .to(Sm3Hash).inSingletonScope();
                break;
        }

        container.bind<ClientSocket>(ClientSocket)
            .to(ClientSocket)
            .inSingletonScope();
    }

}
