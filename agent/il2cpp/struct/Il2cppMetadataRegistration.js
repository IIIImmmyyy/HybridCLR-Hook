import {NativeStruct} from "./NativeStruct";
import {UNITY_VER, UnityVer} from "../../config";

export class Il2cppMetadataRegistration extends NativeStruct{

   metadataUsagesCount() {
        return this.add(112).readU32();
    }

    genericInstsCount(){
       return this.add(0x10).readU32();
    }
    genericMethodTableCount(){
        return this.add(0x20).readU32();
    }
    metadataUsagesCount(){
       return this.add(0x70).readU32();
    }
    metadataUsages(){
        return this.add(0x78).readPointer();
    }
}