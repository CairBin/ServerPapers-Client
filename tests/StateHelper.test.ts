import {DISettings} from '../src/CustomDI';
import Builder from '../src/Builder';
import { container } from '../src/CustomDI';
import IStateHelper from '../src/status/IStateHelper';

const builder = new Builder();
builder.use(new DISettings).run();
const helper = container.get<IStateHelper>("IStateHelper");

test("获取CPU信息", async ()=>{
    const data = await helper.getCpuInfo();
    console.info(data);
})

test("获取内存信息", async ()=>{
    const data = await helper.getMemoryInfo();
    console.info(data);
})

test("获取系统信息", async ()=>{
    const data = await helper.getSystemInfo();
    console.info(data);
})

test("获取网卡信息", async ()=>{
    const data = await helper.getNetworkInfo();
    console.info(data);
})

test("获取硬盘信息", async()=>{
    const data = await helper.getDiskInfo();
    console.info(data);
})