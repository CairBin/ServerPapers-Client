import { Socket } from 'socket.io-client';
import Builder from '../src/Builder';
import { container, DISettings } from '../src/CustomDI';
import { ClientSocketSettings, Listener } from '../src/socket/ClientSocket';
import ISocketListener from '../src/socket/ISocketListener';

const builder = new Builder();
builder.use(new DISettings);

test("测试ClientSocket初始化", ()=>{
    // @Listener
    class TestListener implements ISocketListener{
        eventName:string = 'hello';

        onEvent(socket: Socket, ...args: any[]): void {
            console.info(`${socket.id}, hello`);
        }
    }

    builder.use(new ClientSocketSettings)
    .run();
})

