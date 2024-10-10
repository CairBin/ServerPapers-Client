import { injectable } from 'inversify';
import Builder, { ISettings } from '../src/Builder';
import { container } from '../src/CustomDI';

interface IHello{
    sayHello():string;
}

@injectable()
class Hello implements IHello{
    sayHello():string{
        return 'hello';
    }
}

@injectable()
class HelloWorld implements IHello{
    sayHello():string{
        return 'hello,world';
    }
}

const builder = new Builder();

test('应当返回hello', ()=>{
    class DISettings implements ISettings{
        loadSettings(builder: Builder): void {
            container.bind<IHello>("IHello")
                .to(Hello);
        }
    }
    builder.use(new DISettings).run();
    
    expect(
            container.get<IHello>('IHello')
            .sayHello()
        ).toBe('hello');
})

