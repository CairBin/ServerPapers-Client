/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/status/IStateHelper.ts - 用于获取硬件信息类的接口，此接口用于依赖注入
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import {CpuInfo, SystemInfo, MemoryInfo, NetworkInfo, DiskInfo, TimeInfo} from './StateFormat';

// 每个方法都应该是通过Promise对象统一返回值
export default interface IStateHelper{
    getCpuInfo()    :   Promise<CpuInfo>;
    getSystemInfo() :   Promise<SystemInfo>;
    getMemoryInfo() :   Promise<MemoryInfo>;
    getNetworkInfo():   Promise<NetworkInfo>; 
    getDiskInfo()   :   Promise<DiskInfo>;
    getTimeInfo()   :   Promise<TimeInfo>;
}