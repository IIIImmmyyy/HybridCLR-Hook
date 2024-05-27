import {NativeStruct} from "../il2cpp/NativeStruct";
import {MethodInfo} from "../il2cpp/struct/MethodInfo";
import {il2cppApi} from "../il2cpp/il2cppApi";
import {Il2CppClass} from "../il2cpp/struct/Il2CppClass";


export class InterpMethodInfo extends NativeStruct{


    get_argCount(){
        return this.add(0x10).readU32()
    }
    get_methodInfo(){
        return new MethodInfo(this.readPointer());
    }

}