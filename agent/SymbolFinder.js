import {logHHex} from "./logger";
import {Debug, HybridCLR} from "./HybridCLR";


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
        Memory.scan(module.base, module.size, "E0 C3 21 91 E1 03 ?? ??", {
            onMatch: function (address, size) {
                let symbol = DebugSymbol.fromAddress(address);
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
        //find switch code
        Memory.scan(module.base, module.size, "C8 ?? ?? ?? 1F 21 00 71", {
            onMatch: function (address, size) {

                console.log("find findNative  symbol address : " + (address - module.base).toString(16).toUpperCase());
                //指令解析
                let lastIns = address;
                let i = 0;
                while (true) {
                    lastIns = lastIns.sub(4);
                    let opcode = lastIns.readU32();
                    if (opcode === 0xA9037BFD) {
                        if (Debug) {
                            console.log("find STP X29, X30, [SP, #0x30]  symbol address : " + (lastIns - module.base).toString(16).toUpperCase());
                        }
                        let nativePointer = lastIns.sub(0xc);
                        callback(nativePointer);
                        break
                    }
                }
                return 'stop';
            }
        })
    },

}