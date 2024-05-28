import {InterpMethodInfo} from "./hybridclr/InterpMethodInfo";
import {il2cppApi} from "./il2cpp/il2cppApi";
import {utils} from "./il2cpp/struct/utils";
import {logHHex} from "./logger";
import {SymbolFinder} from "./SymbolFinder";

let observes = new Map();

let  Debug=true;
export let HybridCLR = {

    doAttach: function (addr) {
        Interceptor.attach(addr, {
            onEnter: function (args) {
                let interpMethodInfo = new InterpMethodInfo(args[1]);
                let methodInfo = interpMethodInfo.get_methodInfo();
                let methodName = methodInfo.name();
                let klass = methodInfo.getClass();
                let il2CppImage = il2cppApi.il2cpp_class_get_image(klass);
                let klassName = klass.name();
                let dll = il2CppImage.name();
                let namespaze = klass.namespaze();
                let flags = methodInfo.getFlags();
                let methodStatic = utils.get_method_static(flags);
                // console.log("is methodStatic "+methodStatic)
                let argCount = interpMethodInfo.get_argCount();
                let key;
                if (methodStatic) {
                    key = dll + "_" + namespaze + "_" + klassName + "_" + methodName + "_" + argCount;
                } else {
                    key = dll + "_" + namespaze + "_" + klassName + "_" + methodName + "_" + (argCount - 1);
                }
                if (Debug) {
                    console.log(key+" call");
                }
                let callback = observes.get(key);
                if (callback) {
                    let argBase = args[2];
                    let runtimeArgs = [];
                    for (let i = 0; i < argCount; i++) {
                        let arg = argBase.add(i * Process.pointerSize);
                        runtimeArgs.push(arg);
                    }
                    callback(interpMethodInfo, runtimeArgs);
                }
            }
        })
    },
    attach: function () {
        let module = Process.findModuleByName("libil2cpp.so");
        if (module === null) {
            setTimeout(function () {
                HybridCLR.attach()
            }, 500);
            return
        }
        //debug test symbols
        // let moduleSymbolDetails = module.enumerateSymbols();
        // for (let i = 0; i < moduleSymbolDetails.length; i++) {
        //     let symbol = moduleSymbolDetails[i];
        //     if (symbol.name === "_ZN9hybridclr11interpreter16InterpFrameGroup25EnterFrameFromInterpreterEPKNS0_16InterpMethodInfoEPNS0_11StackObjectE"
        //         || symbol.name === "_ZN9hybridclr11interpreter16InterpFrameGroup20EnterFrameFromNativeEPKNS0_16InterpMethodInfoEPNS0_11StackObjectE") {
        //         HybridCLR.doAttach(symbol.address);
        //     }
        // }
        SymbolFinder.findEnterFrameFromInterpreter(function (address) {
            HybridCLR.doAttach(address);
        });
        SymbolFinder.findNative(function (address) {
                HybridCLR.doAttach(address);
        });
    },

    observe: function (dll, namespace, klass, method, methodCount, callBack) {
        let key = dll + "_" + namespace + "_" + klass + "_" + method + "_" + methodCount;
        console.log("put key : " + key)
        observes.set(key, callBack);
    }
}