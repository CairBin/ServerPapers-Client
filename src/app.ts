/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/app.ts - 程序入口
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { container, DISettings } from './CustomDI';
import Builder from './Builder';
import IStateHelper from './status/IStateHelper';
import { ClientSocketSettings } from './socket/ClientSocket';
import ConnectListener from './listener/ConnectListener';
const builder = new Builder();
builder.use(new DISettings);
builder.use(new ClientSocketSettings)
builder.run();
