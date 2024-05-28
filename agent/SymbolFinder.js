import {logHHex} from "./logger";


export let SymbolFinder = {
    parserBlIns: function (address) {
        let opcode = address.readU32();
        // 检查是否是 BL 指令 (操作码100101)
        if ((opcode >>> 26) === 0b100101) {
            console.log("BL instruction found at: " + address);
            // 提取26位偏移量，并进行符号扩展
            var offset = opcode & 0x03FFFFFF;
            if (offset & 0x02000000) {  // 如果偏移量的最高位是1，进行符号扩展
                offset |= ~0x03FFFFFF;
            }
            offset <<= 2;  // 左移2位，因为ARM指令是4字节对齐
            // 计算目标地址
            var targetAddress = address.add(offset);  // 当前指令地址加上4 再加上偏移量
            let module = Process.findModuleByName("libil2cpp.so");
            console.log("BL instruction at " + address + " jumps to " + (targetAddress - module.base).toString(16).toUpperCase()
                + " offset " + offset);
            return targetAddress;
        }
    },

    findEnterFrameFromInterpreter: function (callback) {
        let module = Process.findModuleByName("libil2cpp.so");
        Memory.scan(module.base, module.size, "E0 03 1A AA ?? ?? ?? ?? FB 03 00 AA ?? ?? ?? ?? E1 03 1B AA E2 03 19 AA", {
            onMatch: function (address, size) {
                let symbol = DebugSymbol.fromAddress(address);
                console.log("find findNative  symbol address : " + (address - module.base).toString(16).toUpperCase());
                //指令解析
                let arrayBuffer = address.add(0x18);
                logHHex(arrayBuffer);
                let parserBlIns = SymbolFinder.parserBlIns(arrayBuffer);
                callback(parserBlIns);
                return 'stop';
            }
        })
    },

    findNative: function (callback) {
        let module = Process.findModuleByName("libil2cpp.so");
        Memory.scan(module.base, module.size, "E1 03 1B AA E2 03 14 AA ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? 08 01 40 B2", {
            onMatch: function (address, size) {
                let symbol = DebugSymbol.fromAddress(address);
                console.log("find findNative  symbol address : " + (address - module.base).toString(16).toUpperCase());
                //指令解析
                let arrayBuffer = address.add(0x8);
                logHHex(arrayBuffer);
                let parserBlIns = SymbolFinder.parserBlIns(arrayBuffer);
                callback(parserBlIns);
                return 'stop';
            }
        })
    },

}