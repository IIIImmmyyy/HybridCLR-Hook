import {NativeStruct} from "./NativeStruct";

export class Il2CppMetadataUsagePair extends NativeStruct{

    destinationIndex(){
        return this.readU32();
    }

    encodedSourceIndex(){
        return this.add(0x4).readU32();
    }
}