import {NativeStruct} from "./NativeStruct";
import {il2cppApi} from "../il2cppApi";
import {Il2CppClass} from "./Il2CppClass";
import {Il2CppGenericMethod} from "./Il2CppGenericMethod";


const METHOD_INFO_OFFSET_SLOT=72;
export class MethodInfo extends NativeStruct{

    getGenericMethod(){
            return new Il2CppGenericMethod(this.add(0x38));
    }
    getFlags(){
        return il2cppApi.il2cpp_method_get_flags(this,0);
    }
    isHybridCLR(){
        let class1 = this.getClass();
        let il2CppImage = il2cppApi.il2cpp_class_get_image(class1);
        return il2CppImage.IsInterpreterImage();
    }
    getSlot(){
        return this.add(METHOD_INFO_OFFSET_SLOT).readU16();
    }
    getMethodPointer(){
        return il2cppApi.il2cpp_method_get_pointer(this);
    }
    getInvokePointer(){
        return this.add(0x8).readPointer();
    }

    getSlot(){
        return this.add(METHOD_INFO_OFFSET_SLOT).readU16();
    }
    name(){
        return il2cppApi.il2cpp_method_get_name(this).readCString();
    }

    getParamCount(){
        return il2cppApi.il2cpp_method_get_param_count(this);
    }
    getParam(index){
        return il2cppApi.il2cpp_method_get_param(this,index);
    }
    getParamName(index){
        return il2cppApi.il2cpp_method_get_param_name(this,index).readCString();
    }
    /**
     * 获取返回类型
     * @returns {Il2CppType}
     */
    getReturnType(){
        return il2cppApi.il2cpp_method_get_return_type(this);
    }
    is_generic(){
        return il2cppApi.il2cpp_method_is_generic(this);
    }
    is_inflated(){
        return il2cppApi.il2cpp_method_is_inflated(this);
    }
    getClass(){
        return new Il2CppClass(il2cppApi.il2cpp_method_get_class(this));
    }

    invoker_method() {
        return this.add(0x8).readPointer();
    }
}