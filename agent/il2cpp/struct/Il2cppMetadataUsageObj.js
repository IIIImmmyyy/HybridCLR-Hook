import {NativeStruct} from "./NativeStruct";
import {Il2cppBridgeApi} from "../hacker/Il2cppBridgeApi";

export class Il2cppMetadataUsageObj extends NativeStruct{

    obj(){
        return Il2cppBridgeApi.il2cpp_usage_obj_get_obj(this);
    }
    metadataUsageIndex(){
        return Il2cppBridgeApi.il2cpp_usage_obj_get_metadataUsageIndex(this);
    }
    usage(){
       return  Il2cppBridgeApi.il2cpp_usage_obj_get_usage(this);
    }
    addr(){
        return Il2cppBridgeApi.il2cpp_usage_obj_get_addr(this);
    }
    stringLiteralIndex(){
        return Il2cppBridgeApi.il2cpp_usage_obj_get_stringLiteralIndex(this);
    }
    stringLiteral_string(){
        return Il2cppBridgeApi.il2cpp_usage_obj_get_stringLiteral(this).readCString();
    }
    getIl2cppConstantOffset(){
        return Il2cppBridgeApi.getIl2cppConstantOffset(this.addr());
    }
}