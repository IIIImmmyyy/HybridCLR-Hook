import {NativeStruct} from "../NativeStruct";


export class  Il2CppString extends NativeStruct{
    static parserString(str){
        // 获取MonoString的长度
        if (str.isNull()){
            return "空";
        }
        // logHHex(str)
        let il2CppBase = Process.pointerSize*2;

        var length = Memory.readU32(str.add(il2CppBase));
        // 获取MonoString的字符数据的指针（UTF-16编码）
        var charsPtr = str.add(il2CppBase+0x4);
        // 从UTF-16编码的字符数据创建JavaScript字符串
        return Memory.readUtf16String(charsPtr, length);
    }
}