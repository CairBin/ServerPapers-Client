import { rejects } from 'assert'
import os from 'os'
import osUtils from 'os-utils'
import { resolve } from 'path'
import { clearInterval } from 'timers'
import diskinfo from 'node-disk-info'

const formatSecond = (second)=>{
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second % 86400) / 3600);
    const minutes = Math.floor(((second % 86400) % 3600) / 60);
    const seconds = Math.floor(((second % 86400) % 3600) % 60);

    return days+'day'+hours+'h'+minutes+'min'+seconds+'s'
}

class Status{
    constructor(){
        this.memory = null
        this.cpu = null
        this.time = null
        this.disk = null
        this.interval = null

        this.updateAsync()
        this.diskInfoAsync()
        
    }

    async updateAsync(){
        this.interval = setInterval(()=>{
            this.memoryInfoAsync()
            this.cpuInfoAsync()
            this.upTimeAsync()
        },500)
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
            processUpTime:formatSecond(osUtils.processUptime()),
        }
    
        this.time = data
    }

    async cpuInfoAsync(){
        osUtils.cpuUsage((val)=>{
            this.cpu = {
                usage:(val*100.0).toFixed(2)+'%',
                number:osUtils.cpuCount(),
                platform:osUtils.platform()
            }
        })
    }

    async getInfoAsync(){
        return new Promise((res,rej)=>{
            if(this.cpu && this.memory && this.time)
            {
                var data = {
                    cpu:this.cpu,
                    memory:this.memory,
                    time:this.time
                }
                res(data)
            }else{
                rej('Undefined field')
            }
        })
    }

    async diskInfoAsync(){
        diskinfo.getDiskInfo().then(disks=>{
            var total = 0
            var used = 0
            var free = 0
            
            for(const disk of disks){
                console.log(disk.mounted)
                total+=disk.blocks
                used+=disk.used
                free+=disk.available
            }

            this.disk={
                total:total/1024/1024,
                used:used/1024/1024,
                free:free/1024/1024
            }
            console.log(this.disk)

        }).catch((err)=>{
            console.log(err)
        })
    }

    stop(callback){
        clearInterval(this.interval)
        callback()
    }
}

export default Status
