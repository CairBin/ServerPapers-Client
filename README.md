# ServerPapers-Client
This is the client of ServerPapers, used to send device status data to the server.

## Deployment

### pm2

```shell
git clone https://github.com/CairBin/ServerPapers-Client.git
```

Deploying projects using **pm2**,first you should install it.
```shell
npm install -g pm2
```
Enter project directory and edit `config.js` to set relevant configurations.
```shell
cd ServerPapers-Client
```

* config.js
```js
//config.js
export default{
    "serverUrl":"http://127.0.0.1:8244",    //server url
    "loginInfo":{                           //verify information
        "user":"test",                      //user
        "pwd":"123456"                      //password
    },
    "encryInfo":{
        "algorithm":"aes-256-gcm"           //encryption algorithm
    }
}
```
Currently,this project only supports `aes-256-gcm`.

Enter commands to start the project.
```shell
npm install
pm2 start ecosystem.config.cjs
```
If you want to stop this program,you can execute this command.
```shell
pm2 stop ecosystem.config.cjs
```

