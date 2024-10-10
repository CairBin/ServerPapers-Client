import {container, DISettings} from '../src/CustomDI';
import Builder from '../src/Builder';
import ILogger from '../src/logger/ILogger';

const builder = new Builder();
builder.use(new DISettings).run();
const logger = container.get<ILogger>("ILogger");

test('日志记录器debug方法', ()=>{
    logger.debug("debug Method");
})

test('日志记录器info方法', ()=>{
    logger.info("info Method");
})

test('日志记录器warn方法', ()=>{
    logger.warn("warn Method", 123);
})

test('日志记录器error方法', ()=>{
    logger.error("error Method");
})

test('日志记录器fatal方法', ()=>{
    logger.fatal("fatal Method");
})

test('获取记录器方法', ()=>{
    expect(logger.getLogger() != undefined)
        .toBe(true);
})