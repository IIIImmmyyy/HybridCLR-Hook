import {NativeStruct} from "./NativeStruct";
import {Il2CppGenericInst} from "./Il2CppGenericInst";

export class Il2CppGenericContext extends NativeStruct{


    method_inst(){
        return new Il2CppGenericInst(this.add(0x8));
    }
}