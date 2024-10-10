/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/utils/DateFormate.ts - 时间格式工具
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import { ITime } from "../status/StateFormat";

// 将秒转化为ITime
export function formatSecond(second:number):ITime{
    return {
        days:Math.floor(second / 86400),
        hours:Math.floor((second % 86400) / 3600),
        minutes:Math.floor(((second % 86400) % 3600) / 60),
        seconds:Math.floor(((second % 86400) % 3600) % 60)
    };
    
}