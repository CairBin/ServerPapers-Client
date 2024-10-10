/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/status/StateFormat.ts - 硬件信息格式，用于规范消息传递格式
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

// 系统信息
export interface SystemInfo{
    platform:string;    // 平台
    distro:string;      // 发行版
    codename:string;    // 代号
    hostname:string;    // 主机名
    arch:string;        // 架构
}

// 内存信息，单位应当为GBytes
export interface MemoryInfo{
    freeMemory:string;  // 空闲内存大小
    totalMemory:string; // 总内存容量
    usedMemory:string;  // 已使用内存大小
}

// 时间格式
export interface ITime{
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
}

//时间信息
export interface TimeInfo{
    systemUpTime:ITime;
    processUpTime:ITime;
    systemTIme:string;
}

// CPU信息
export interface CpuInfo{
    usage:string;   // 百分比
    number:string;  // 核心数
}

// 单个网卡信息
export interface NetworkInterface{
    name:string;
    rxSec:string;
    txSec:string;
    rxBytes:string;
    txBytes:string;
}

// 这个才是用于返回所有网卡信息的接口
export interface NetworkInfo{
    device:Array<NetworkInterface>;
}

// 磁盘分区信息
export interface DiskArea{
    fs:string;      // 分区
    mount:string;   // 挂载点
    type:string;    // 文件系统类型
    total:string;   // 总容量
    used:string;    // 已使用容量
}

// 这个才是用于返回所有磁盘分区信息的接口
export interface DiskInfo{
    areas:Array<DiskArea>;
}