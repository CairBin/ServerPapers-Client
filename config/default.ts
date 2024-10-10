import { HashType } from "../src/crypto/IHash"

export default {
    // 服务端URL，可为https
    url: 'http://127.0.0.1:8892/',
    // CA的证书，http模式可以不填下面数组
    ca:[
        '/Users/cairbin/Others/program/nodejs/sp/client/certificate/cert.pem',
    ],
    /* http模式此字段无效https
    *  https如果为false容易受到中间人攻击
    *  为false一般用于自签名证书
    */
    rejectUnauthorized:true,
    user: 'test',       // 用于标识Client
    pwd: '123456',      // 验证口令
    hash: HashType.SM3  // 口令所使用的Hash算法
}