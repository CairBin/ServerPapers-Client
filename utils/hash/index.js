import crypto from 'crypto'

export class SymEncryption{
    static encode(text,alg,key){
        var iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(alg,key,iv)
        var sign = cipher.update(text,'utf8','hex')
        sign += cipher.final('hex')
        var tag = cipher.getAuthTag()

        return {
            data:sign,
            iv:iv,
            tag:tag
        }
    }
}

export class Hash{
    static Md5(text){
        return crypto.createHash('md5').update(text).digest('hex')
    }
}