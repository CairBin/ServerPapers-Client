/**
 * THIS FILE IS PART OF THE ServerPapers PROJECT
 * THIS PROGRAM IS FREE SOFTWARE AND IS LICENSED UNDER THE MIT LICENSE
 * 
 * ./src/status/StateHelper.ts - 获取硬件信息接口的实现
 * 
 * Copyright (c) 2024 Xinyi Liu(CairBin) cairbin@aliyun.com
 */

import IStateHelper from "./IStateHelper";
import os from 'os';
import si from 'systeminformation';
import { CpuInfo, SystemInfo, MemoryInfo, NetworkInfo, DiskInfo, NetworkInterface, DiskArea, TimeInfo } from "./StateFormat";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import osUtils from 'os-utils';
import ILogger, {LogDebug} from "../logger/ILogger";
import { formatSecond } from "../utils/DateFormat";
import dayjs from "dayjs";

function cpuUsage():Promise<number>{
    return new Promise((resolve,rejects)=>{
        osUtils.cpuUsage((val)=>{
            resolve(val);
        });
    });
}


@injectable()
export default class StateHelper implements IStateHelper{
    @inject("ILogger")
    private logger!: ILogger;
    
    @LogDebug
    async getCpuInfo(): Promise<CpuInfo> {
        let usage = await cpuUsage();
        return {
            usage:(usage*100.0).toFixed(2)+'%',
            number:osUtils.cpuCount().toString()
        }
    }

    @LogDebug
    getSystemInfo(): Promise<SystemInfo> {
        return new Promise((resolve,reject)=>{
            si.osInfo().then(data=>{
                resolve({
                    platform:data.platform,
                    distro:data.distro,
                    codename:data.codename,
                    hostname:data.hostname,
                    arch:data.arch
                })
            })
        })
    }

    @LogDebug
    async getMemoryInfo(): Promise<MemoryInfo> {
        var freeMemory = os.freemem()/1024/1024/1024;
        var totalMemory = os.totalmem()/1024/1024/1024;
        var usedMemory = (totalMemory-freeMemory)
        var data = {
            freeMemory:freeMemory.toFixed(2)+'G',
            totalMemory:totalMemory.toFixed(2)+'G',
            usedMemory:usedMemory.toFixed(2)+'G'
        }
        return data;
    }
    
    @LogDebug
    getNetworkInfo(): Promise<NetworkInfo> {
        return new Promise((resolve,reject)=>{
            si.networkStats().then((data)=>{
                let array = new Array<NetworkInterface>();

                data.forEach((info)=>{
                    this.logger.debug('', info)
                    array.push({
                        name:info.iface,
                        rxSec:info.rx_sec?info.rx_sec.toString():'null',
                        rxBytes:info.rx_bytes?info.rx_bytes.toString():'null',
                        txSec:info.tx_sec?info.tx_sec.toString():'null',
                        txBytes:info.tx_bytes?info.tx_bytes.toString():'null',
                    });
                });

                resolve({
                    device:array
                })

            }).catch((err)=>{
                reject(err);
            });
        });
    }


    @LogDebug
    getDiskInfo(): Promise<DiskInfo> {
        return new Promise((resolve,reject)=>{
            si.fsSize().then((data)=>{
                let array = new Array<DiskArea>();
                data.forEach((info)=>{
                    array.push({
                        fs:info.fs,
                        mount:info.mount,
                        type:info.type,
                        total:(info.size/1024/1024/1024).toFixed(2)+'G',
                        used:(info.used/1024/1024/1024).toFixed(2)+'G'
                    });
                });
                resolve({
                    areas:array
                })
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    
    @LogDebug
    async getTimeInfo(): Promise<TimeInfo> {
        const data:TimeInfo = {
            systemUpTime: formatSecond(osUtils.sysUptime()),
            processUpTime: formatSecond(osUtils.processUptime()),
            systemTIme: dayjs(new Date).format('YYYY-MM-DD HH:mm:ss'),
        }

        return data;
    }

}