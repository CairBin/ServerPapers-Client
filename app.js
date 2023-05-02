import Status from './utils/status/index.js'
import SockConn from './utils/socket/index.js'
import config from './config.js'

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms))
}

async function main(){
    const info = new Status()
    const sock = new SockConn(config.serverUrl,config.loginInfo,config.encryInfo)
    console.log('Client is loading...')
    await sleep(1000)
    setInterval(()=>{
        info.getInfoAsync().then((res)=>{
            sock.sendAsync(res)
        }).catch((err)=>{
            console.log(err)
            sock.stop(()=>{
                console.log('Socket disconnected!')
            })
            info.stop(()=>{
                console.log('Stopped getting information!')
            })
        })
    },1000)
}

main()
