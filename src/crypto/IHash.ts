/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/crypto/IHash.ts - 哈希算法接口和类型
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

// 本项目可提供的Hash算法种类，便于后期维护
export enum HashType{
    MD5,
    SHA256,
    SM3
}

// Hash算法的接口
// 该接口用于DI，理论上来讲其他模块用什么算法应当由容器决定
// 容器实际上根据配置文件的hash字段进行注入
// 特殊情况除外
export default interface IHash{
    // 用于比较hash(text)与hashVal是否相等
    compare(text?:string, hashVal?:string):boolean;

    hash(text:string):string;
}