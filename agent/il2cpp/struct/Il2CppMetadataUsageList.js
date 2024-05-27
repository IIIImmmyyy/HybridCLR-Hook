import {NativeStruct} from "./NativeStruct";

export class Il2CppMetadataUsageList extends NativeStruct{


    start(){
        return this.readU32();
    }
    count(){
        return this.add(0x4).readU32();
    }
}