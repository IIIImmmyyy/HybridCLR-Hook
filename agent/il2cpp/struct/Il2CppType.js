import {NativeStruct} from "./NativeStruct";
import {il2cppApi} from "../il2cppApi";

export class Il2CppType extends NativeStruct{

    getName(){
        let il2cppTypeGetName = il2cppApi.il2cpp_type_get_name(this);
        if (il2cppTypeGetName==null){
            return null;
        }else {
            return il2cppTypeGetName.readCString();
        }

    }

    getTypeEnum(){
        return il2cppApi.il2cpp_type_get_type(this);
    }
    byref(){
        return il2cppApi.il2cpp_type_is_byref(this);
    }
}