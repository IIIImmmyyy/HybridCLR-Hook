import {NativeStruct} from "./NativeStruct";
import {Il2CppGenericContext} from "./Il2CppGenericContext";

export class Il2CppGenericMethod extends NativeStruct{


    context(){
        return new Il2CppGenericContext(this.add(0x8));
    }
}