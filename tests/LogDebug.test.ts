import {DISettings} from '../src/CustomDI';
import Builder from '../src/Builder';
import { LogDebug } from '../src/logger/ILogger';


const builder = new Builder();
builder.use(new DISettings).run();

test("环绕日志", ()=>{
    class MyTest{
        @LogDebug
        public static hello(){
            console.log("hello");
        }
    }

    MyTest.hello();
})