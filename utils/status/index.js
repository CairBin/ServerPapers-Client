import { rejects } from 'assert'
import os from 'os'
import osUtils from 'os-utils'
import { resolve } from 'path'
import { clearInterval } from 'timers'
import diskinfo from 'node-disk-info'
import si from 'systeminformation'
import sd from 'silly-datetime'

const formatSecond = (second)=>{
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second % 86400) / 3600);
    const minutes = Math.floor(((second % 86400) % 3600) / 60);
    const seconds = Math.floor(((second % 86400) % 3600) % 60);

    return {
        days,hours,minutes,seconds
    }
}

class Status{
    constructor(){
        this.memory = null
        this.cpu = null
        this.time = null
        this.disk = null
        this.interval = null
        this.network = null
        this.system = null

        this.updateAsync()
        this.systemInfoAsync()
        
    }

    async updateAsync(){
        this.interval = setInterval(()=>{
            this.memoryInfoAsync()
            this.cpuInfoAsync()
            this.upTimeAsync()
            this.diskInfoAsync()
            this.networkInfoAsync()
        },500)
    }

    async systemInfoAsync() {
        si.osInfo().then(data => {
            this.system = {
                platform: data.platform,
                distro: data.distro,
                codename: data.codename,
                hostname: data.hostname,
                arch:data.arch
            }
        })
    }

    async memoryInfoAsync(){
        var freeMemory = os.freemem()/1024/1024/1024;
        var totalMemory = os.totalmem()/1024/1024/1024;
        var usedMemory = (totalMemory-freeMemory)
        var data = {
            freeMemory:freeMemory.toFixed(2)+'G',
            totalMemory:totalMemory.toFixed(2)+'G',
            usedMemory:usedMemory.toFixed(2)+'G'
        }

        this.memory = data
    }

    async upTimeAsync(){
        
        var data = {
            sysUpTime:formatSecond(osUtils.sysUptime()),
            processUpTime: formatSecond(osUtils.processUptime()),
            sysTime:sd.format(new Date(),'YYYY-MM-DD HH:mm:ss')
        }
    
        this.time = data
    }

    async cpuInfoAsync(){
        osUtils.cpuUsage((val)=>{
            this.cpu = {
                usage:(val*100.0).toFixed(2)+'%',
                number:osUtils.cpuCount()
            }
        })
    }

    async getInfoAsync(){
        return new Promise((res,rej)=>{
            if(this.cpu && this.memory && this.time && this.disk && this.system && this.network)
            {
                var data = {
                    cpu:this.cpu,
                    memory:this.memory,
                    time: this.time,
                    system: this.system,
                    disk: this.disk,
                    network:this.network
                }
                res(data)
            }else{
                rej('Undefined field')
            }
        })
    }

    async diskInfoAsync() {
        si.fsSize().then(data => {
            this.disk = data
        })
    }

    async networkInfoAsync() {
        si.networkStats().then(data => {
            this.network = data
        })
    }

    stop(callback){
        clearInterval(this.interval)
        callback()
    }
}

export default Status
