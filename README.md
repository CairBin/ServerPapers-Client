# ServerPapers-Client

## 描述

这是SeverPapers的typescript版本的客户端，用于从被监听的主机上发送设备信息。

## 注意

此项目与之前JS版本不兼容，请配合相应版本的服务端。
在之前的JS版本中，客户端到服务端之间的链路使用对称加密，在

此版本中不再支持对称加密算法，其数据的机密性应当由HTTPS协议保证，如果使用HTTP协议将以明文发送数据。

关于TLS/SSL证书，可以在配置文件中进行设置。
可以使用加载文件的方式进行证书配置（主要为了支持自签名证书），或者使用HTTP协议然后通过Nginx反向代理后配置HTTPS。


## 配置文件

该项目使用了`config`库，在`./config/default.ts`中进行相关配置：

相关字段解释请参考注释

```ts
[...]

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
```

## 运行

请先安装`yarn`:
```sh
npm install yarn -g
```

首先安装项目所需依赖，此命令会安装`./package.json`中声明的所有包：

```sh
yarn install
```

### 开发环境

开发环境下你可以在项目根目录下使用以下命令启动项目:

```sh
yarn start
```

项目集成了jest框架，以下命令可进行单元测试:

```sh
yarn jest
```

### 正式环境

项目采用PM2进行部署，在此之前请确保PM2已被安装

``` sh
yarn global add pm2
```

如果yarn全局安装的包找不到，可以使用以下命令来查询目录
```sh
yarn global bin
```

**请手动并把输出的目录添加到系统环境变量中。**

将typescript添加到PM2
```sh
pm2 install typescript
```

使用PM2启动项目

```sh
pm2 start ecosystem.config.js
```

之后可以使用名称来管理项目状态
```sh
pm2 stop ServerPapersClient
pm2 start ServerPapersClient
```

## 开发

### 事件

客户端向服务端建立连接后，会发送一个`hello`事件，告知服务端上线，携带数据如下

```ts
interface LoginInfo{
    user:string;
    pwd:string;
}

interface HelloMessage{
    flag:string;    // 默认为client，标识客户端
    token:string;   // LoginInfo的pwd，配置文件中加载
    data:string;    // 传输的数据，目前为空字符串
    user:string;    // 用户名，用于区分客户端
}

```

同时，客户端监听来自服务端的`ready`事件，该事件不携带数据，监听到此事件后将启动`ReadyListener`的定时器，每1秒钟发送一次本机的硬件信息。

发送硬件信息的事件为`clientData`，格式封装如下：
```ts
interface ClientMessage{
    user:string;    // 用户名
    token:string;   // 同配置文件的pwd
    data:Object;    // 携带的硬件数据信息
}
```

### 硬件信息

关于硬件的数据通过`IStateHelper`类型的对象返回，其返回格式定义在`./src/status/StateFormat.ts`中。

```ts
export interface SystemInfo{
    platform:string;
    distro:string;
    codename:string;
    hostname:string;
    arch:string;
}

export interface MemoryInfo{
    freeMemory:string;
    totalMemory:string;
    usedMemory:string;
}

export interface TimeInfo{
    systemUpTime:string;
    processUpTime:string;
    systemTIme:string;
}

export interface CpuInfo{
    usage:string;   //百分比
    number:string;
}

export interface NetworkInterface{
    name:string;
    rxSec:string;
    txSec:string;
    rxBytes:string;
    txBytes:string;
}

export interface NetworkInfo{
    device:Array<NetworkInterface>;
}

export interface DiskArea{
    fs:string;
    mount:string;
    type:string;
    total:string;
    used:string;
}

export interface DiskInfo{
    areas:Array<DiskArea>;
}
```

### 监听器

`./src/socket/ClientSocket.ts`中代码会自动扫描`./listener/`下所有模块文件然后自动从容器中加载，请将新的监听起放置在该目录下，并实现`ISocketListener`接口，添加`@Listener`装饰器，并初始化`eventName`属性，该属性用于依赖注入和事件绑定（容器内的ID和SocketIO的事件名都会是`eventName`的值）。

如`DisonnectListener`:

```ts
@injectable()
@Listener
export default class DisonnectListener implements ISocketListener{
    @inject("ILogger")
    private logger!:ILogger;
    
    eventName: string = 'disconnect';   //事件名
    onEvent(socket: Socket, ...args: any[]): void {
        this.logger.info('Connection has been closed');
    }
}
```

### 依赖注入

本项目使用了inversifyJS框架用于以依赖注入的方式实现IOC，其注入相关的信息与`./src/CustomDI`下

详细请参考[inversifyJS-Github](https://github.com/inversify/InversifyJS
)

按照项目规范，服务提供者应当实现接口并在`./src/CustomDI`中进行注入配置。


### 模块初始化

本项目要求统一使用Builder来进行相关模块加载，`./src/Builder.ts`中定义了`ISettings`接口。

```ts
export interface ISettings{
    loadSettings(builder:Builder):void;
}
```

在需要初始化的模块文件中定义实现该接口的类
```ts
export class MySettings implements ISettings{
    loadSettings(builder:Builder):void{
        [...]
    }
}
```

然后在`./src/app.ts`中按照加载顺序调用

```ts
[...]
builder.use(new MySettings);
[...]
builder.run();
```

## 第三方库

列举主要使用的第三方库（并非全部）

* 获取硬件信息(systeminformation--www.npmjs.com)[https://www.npmjs.com/package/systeminformation]
* 依赖注入(inversifyJS--github.com)[https://github.com/inversify/InversifyJS]
* 获取系统信息(os-utils--github.com)[https://github.com/oscmejia/os-utils]
* 密码学相关算法crypto
* 配置文件管理(config--www.npmjs.com)[https://www.npmjs.com/package/config]
* 日志记录器(pino--github.com)[https://github.com/pinojs/pino]