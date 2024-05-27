import {HybridCLR} from "./HybridCLR";
import {Il2CppString} from "./il2cpp/struct/Il2CppString";


export let TestJs={
    test:function(){
        HybridCLR.observe("HotUpdate.dll","HotUpdate","Hello",
            "add",2,function (methodInfo,runtimeArgs){
                console.log("args len "+runtimeArgs.length)
               let a = runtimeArgs[1].readU32();
               let b = runtimeArgs[2].readU32();
                console.log("add call a = "+a +" b= "+b)
                runtimeArgs[1].writeU32(100)
            });
        HybridCLR.attach();
    }
}