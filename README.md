


# [Android U3D手游安全中级篇] 
# [https://github.com/IIIImmmyyy/u3dCourse](https://github.com/IIIImmmyyy/U3DGameCourse)

# [https://iiiimmmyyy.github.io/IIIImmmyyy/2025/07/01/%E5%95%86%E4%B8%9A%E7%BA%A7HybridCLR-DLL%E6%B3%A8%E5%85%A5%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/](更好的解决方案)



## --------------------------------------------------------------------
## 功能说明
> #### 支持对使用了HybirdCLR 的热更游戏 进行函数的Hook（仅支持入参的替换）

## HybridCLR 工作原理
> #### HybridCLR 从原理上来说并不复杂，主要是Runtime下进行元数据的初始化和解析，同时实现了一个解释器，由于是动态的进行解析，基于元数据的Dump自然就失效了得到的偏移地址完全指向了解释器的占位入口 比如一个静态函数 :
> #### public static void Run(){} 指向的地址的符号表为  _ZL7__N2M_vPK10MethodInfo 这是因为在动态解析的过程中 生成的methodInfo最终需要解释器来执行，一些固定的函数自然需要固定的入口来进行跳转，HybridCLR 也是生成了非常多的符号表，对应各个类型函数的跳转；
> #### 根据原理和源码的查看，解释器也是有统一的入口，从此就可以找到一个锚点来进行Hook监控函数的执行。但是目前由于源码的限制，对于return 的参数没有很好的锚点，所以此版本对于return 是无法替换的
> #### 基于此的话 代码也就非常简单了 具体实现在HybridCLR.doAttach 实现对methodInfo的解析 从此找到真正想要监控的函数

## 使用说明 
> #### 查看示例代码 TestJs.test(); 
> #### 注意！！！该方式只适用与热更的dll 常规的il2cpp函数的无法使用该方式进行监听！

````javascript
    // CS函数函数对应
    // RVA: 0x52C7A0  VA: 0x6EDCF367A0
    public void add(int a, int b) {  }
````
````javascript
export let TestJs={


    test:function(){
        //参数分别是 dllName namespace className methodName methodCount
        HybridCLR.observe("HotUpdate.dll","HotUpdate","Hello",
            "add",2,function (methodInfo,runtimeArgs){
                console.log("args len "+runtimeArgs.length)
               let a = runtimeArgs[1].readU32();
               let b = runtimeArgs[2].readU32();
                console.log("add call a = "+a +" b= "+b)
            });
        HybridCLR.attach();
    }
    
}
````
> #### 如何修改？ 与frida attach 返回的args参数写法一致
````javascript
    test:function(){
        HybridCLR.observe("HotUpdate.dll","HotUpdate","Hello",
            "add",2,function (methodInfo,runtimeArgs){
                console.log("args len "+runtimeArgs.length)
               let a = runtimeArgs[1].readU32();
               let b = runtimeArgs[2].readU32();
                console.log("add call a = "+a +" b= "+b)
                runtimeArgs[1].writeU32(100) //把a值修改为100
            });
        HybridCLR.attach();
    }
    
````
> #### 如何获取热更新的cs文件？ 
> #### 请使用我的另外一个 项目frida-il2cppDumper
> #### [https://github.com/IIIImmmyyy/frida-il2cppDumper](https://github.com/IIIImmmyyy/frida-il2cppDumper)
> #### 如果该游戏使用了热更dll 将会在头部的dll 位置将其标志 （该判断可能有版本问题，不一定准确。）
````javascript
 // Image :0 mscorlib - 1282
 // Image :1 System.Configuration - 10
 // Image :2 Mono.Security - 5
 // Image :3 System.Xml - 3
 // Image :4 System - 119
 // Image :5 System.Core - 8
 // Image :6 UnityEngine.SharedInternalsModule - 26
 // Image :7 UnityEngine.CoreModule - 434
 // Image :8 UnityEngine.AndroidJNIModule - 24
 // Image :9 UnityEngine.AudioModule - 14
 // Image :10 UnityEngine.UnityAnalyticsModule - 11
 // Image :11 UnityEngine.UnityWebRequestModule - 4
 // Image :12 UnityEngine - 1
 // Image :13 UnityHook - 27
 // Image :14 Assembly-CSharp - 3
 // Image :15 HotUpdate - 4---> HybridCLR Dll 此即代表该dll为热更dll
````
## 如何编译
> #### clone 本项目
> #### 安装必要的npm包
> #### 执行命令 npm run watch
> #### 生成-agent.js 脚本
> #### frida命令运行 ： frida -U -l _agent.js -f com.DefaultCompany.TestHybridCLR

## 已知问题
> #### 1. 由于依赖特征码查找，函数inline的情况下 EnterFrameFromInterpreter有可能会找不到 导致大部分在函数内的循环调用无法监控，此时请屏蔽:
````javascript
SymbolFinder.findEnterFrameFromInterpreter(function (address) {
HybridCLR.doAttach(address);
});
````
> #### 2. 由于样本不多，特征码的查找可能会有问题，如果有问题请提issue，并提供样本

