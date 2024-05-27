import {NativeStruct} from "./NativeStruct";
import {log, logHHex} from "../../logger";
import {
    STRUCT_TYPE_IL2CPP_METADATA_USAGE_LIST,
    STRUCT_TYPE_IL2CPP_METADATA_USAGE_PAIR,
    StructSize
} from "../hacker/StructSize";
import {Il2CppMetadataUsageList} from "./Il2CppMetadataUsageList";
import {Il2CppMetadataUsagePair} from "./Il2CppMetadataUsagePair";
import {Tabledefs} from "../tabledefs";

export class Il2CppGlobalMetadataHeader extends NativeStruct {


    sanity() {
        return this.readU32().toString(16).toUpperCase();
    }

    version() {
        return this.add(0x4).readU32();
    }

    metadataUsagePairsCount() {
        return this.add(0xcc).readU32();
    }


    metadataUsagePairsOffset() {
        return this.add(0xc8).readU32();
    }

    metadataUsageListsOffset() {
        return this.add(0xc0).readU32();
    }

    exportedTypeDefinitionsOffset(){
        return this.add(256).readU32();
    }
     exportedTypeDefinitionsCount(){
        return this.add(260).readU32();
     }
    metadataOffset(globalMetadata, returnStructSize, sectionOffset, itemIndex) {

        // log("globalMetadata:" + globalMetadata + " size:" + returnStructSize + " offset:" + sectionOffset + " itemIndex:" + itemIndex);
        let number = returnStructSize * itemIndex;
        return globalMetadata.add(number).add(sectionOffset);
    }

    getEncodeIndexType(index){
        return ((index & 0xE0000000) >> 29);
    }
    getDecodedMethodIndex(index){
        return  index & 0x1FFFFFFF;
    }
}