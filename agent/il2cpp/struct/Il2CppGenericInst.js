import {NativeStruct} from "./NativeStruct";

export class Il2CppGenericInst extends NativeStruct{


    type_argc(){
        return this.readU32();
    }
}