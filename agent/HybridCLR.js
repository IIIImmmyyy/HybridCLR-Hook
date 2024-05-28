import {il2cppApi} from "./il2cpp/il2cppApi";
import {SymbolFinder} from "./SymbolFinder";
import {MethodInfo} from "./il2cpp/struct/MethodInfo";
import {utils} from "./il2cpp/struct/utils";
import {InterpMethodInfo} from "./hybridclr/InterpMethodInfo";

let observes = new Map();
let observesMethod = new Map();
export let Debug = false;
export let HybridCLR = {

    simpleCheck: function (arg) {
        if (Debug) {
            return true;
        }
        let nativePointer = arg.readPointer();
        let methodName = il2cppApi.il2cpp_method_get_name(nativePointer).readCString();
        if (observesMethod.has(methodName)) {
            return true;
        }
    },
    doAttach: function (addr) {


        Interceptor.attach(addr, {
            onEnter: function (args) {
                if (HybridCLR.simpleCheck(args[1])) {
                    let interpMethodInfo = new InterpMethodInfo(args[1]);
                    let methodInfo = interpMethodInfo.get_methodInfo();
                    let methodName = methodInfo.name();
                    //名称匹配的情况下 才继续 否则大量的调用容易卡死
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

        // SymbolFinder.findEnterFrameFromInterpreter(function (address) {
        //     HybridCLR.doAttach(address);
        // });
        SymbolFinder.findNative(function (address) {
            HybridCLR.doAttach(address);
        });
    },

    observe: function (dll, namespace, klass, method, methodCount, callBack) {
        let key = dll + "_" + namespace + "_" + klass + "_" + method + "_" + methodCount;
        console.log("put key : " + key)
        observesMethod.set(method, true);
        observes.set(key, callBack);
    }
}