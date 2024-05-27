import {NativeStruct} from "./NativeStruct";
import {il2cppApi} from "../il2cppApi";
import {getStructOffset, StructItem} from "./structItem";
import {FromTypeDefinition_Addr, soName, UNITY_VER, UnityVer} from "../../config";
import {Il2CppClass} from "./Il2CppClass";
import {log} from "../../logger";

let il2CppImage_struct = new Array();
il2CppImage_struct.push(new StructItem("name", Process.pointerSize));
il2CppImage_struct.push(new StructItem("nameNoExt", Process.pointerSize));

    il2CppImage_struct.push(new StructItem("assemblyIndex", Process.pointerSize));

il2CppImage_struct.push(new StructItem("typeStart", 4));
il2CppImage_struct.push(new StructItem("typeCount", 4));
il2CppImage_struct.push(new StructItem("exportedTypeStart", 4));

let kMetadataIndexBits = 22;
let kMetadataImageIndexExtraShiftBitsA = 6;
let kMetadataImageIndexExtraShiftBitsB = 4;
let kMetadataImageIndexExtraShiftBitsC = 2;
let kMetadataImageIndexExtraShiftBitsD = 0;
let kInvalidIndex=-1;
let kMetadataIndexMaskA = (1 << (kMetadataIndexBits + kMetadataImageIndexExtraShiftBitsA)) - 1;
export class Il2CppImage extends NativeStruct {


    name() {
        return il2cppApi.il2cpp_image_get_name(this).readCString();
    }
    token(){
        return this.add(0x40).readU32();
    }
    IsInterpreterImage(){
        let index = this.token();
        // log("got token "+index);
        return index !== kInvalidIndex && (index & ~kMetadataIndexMaskA) !== 0;
    }
    nameNoExt() {
        let name1 = this.name();
        return name1.replace(".dll", "");
    }

    typeStart() {
        return this.get("typeStart").readPointer().toInt32();
    }

    typeCount() {
       return il2cppApi.il2cpp_image_get_class_count(this);
      // return  this.getOffsetTypeCount();
    }
    getOffsetTypeCount(){

        if (UNITY_VER===UnityVer.V_2020){
            return this.add(24).readPointer().toInt32();
        }else {
            return this.get("typeCount").readPointer().toInt32();
        }

    }

    getClass(index) {
        let soAddr = Module.findBaseAddress(soName);
        return il2cppApi.il2cpp_image_get_class(this, index);

    }

    get(params) {
        return this.add(getStructOffset(il2CppImage_struct, params));
    }
}