import {NativeStruct} from "./NativeStruct";
import {Il2cppBridgeApi} from "../hacker/Il2cppBridgeApi";

export class Il2cppGenericInstObj extends NativeStruct{


    addr(){
       return  Il2cppBridgeApi.il2cpp_genericInst_obj_get_method_addr(this);
    }

    className(){
        return Il2cppBridgeApi.il2cpp_genericInst_obj_get_class_name(this).readCString();
    }
    spaze(){
        return Il2cppBridgeApi.il2cpp_genericInst_obj_get_class_spaze(this).readCString();
    }
    methodName(){
        return Il2cppBridgeApi.il2cpp_genericInst_obj_get_method_name(this).readCString();
    }
}