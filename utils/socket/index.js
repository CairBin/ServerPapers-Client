import {io} from 'socket.io-client'
import {Hash,SymEncryption} from './../hash/index.js'

class SockConn{
    constructor(domain,loginInfo,encryInfo){
        this.sock = io(domain)
        this.loginInfo = loginInfo
        this.encryInfo = encryInfo

        this.sock.on('connect',()=>{
            console.log('Connection has been established!')
        })

        this.sock.on('disconnect',()=>{
            console.log('this connection has been disconnected!')
        })

        this.sock.on('connect_error',(err)=>{
            console.log(err)
        })
    }

    encode(text){
        return SymEncryption.encode(
            text,
            this.encryInfo.algorithm,
            Hash.Md5(this.loginInfo.pwd)
        )
    }

    async sendAsync(message){
        var data = {
            message:message,
            pwd:this.loginInfo.pwd
        }

        data = JSON.stringify(data)
        this.sock.emit('info',{
            user:this.loginInfo.user,
            pack:this.encode(data)
        })
    }

    stop(callback){
        this.sock.disconnect()
        callback()
    }
}

export default SockConn