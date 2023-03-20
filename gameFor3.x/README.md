# GameFor3.x

### 框架目录结构
```
core               - 框加核心技术库
    common             - 游戏公共模块
        ad                 - 广告（现有微信广告）
        audio              - 音频模块
        bundle             - 模块化加载资源
        config             - 配置（panel配置）
        data               - 静态数据
        display            - 通用组件
        event              - 全局事件
        gui                - 游戏界面类
            layer              - 多层界面、窗口管理
            prompt             - 公共提示窗口
        network            - 网络模块（http请求）
        platform           - 平台模块
        res                - 加载模块
        storage            - 本地存储
        timer              - 时间管理
        util               - 游戏各类工具库
```

### 游戏初始化
```
const url = `https://weapp-hub.raisedsun.com/v1-api/pub/weapp-config/get-by-key/test?appId=${Global.appId}&version=${Global.VERSION}`;
Global.http.get(url, (data: any) => {                       // 获取审核标志
    console.log(data);                  
    Global.reviewState = Number(data.data);
    GameApp.init(() => {                                    // 初始化
        GameApp.initLayer();                                // 加载界面管理模块 多场景需要加载多次
        Global.gui.open(UIID.LoadPanel);
    });
}, null)
```


### GUI功能说明
界面管理模块，主要实现游戏中不同类型的窗口管理，例如常住主界面窗口、弹出窗口、模式窗口，系统提示窗口等。

### 使用说明
##### 窗口配置字段
| 字段   | 介绍     |
| ------ | -------- |
| layer  | 窗口层级 |
| prefab | 预制资源相对路径 |
| bundle | 远程包名 |

##### 窗口配置数据
```
/** 界面唯一标识 */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
}

/** 打开界面方式的配置数据 */
export const UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading", bundle: "resources" },
}
```

##### 打开一个窗口
```
const uic: UICallbacks = {
    // 窗口添加到界面完成事件
    onAdded: (node: Node, params: any) => {
        const comp = node.getComponent(LoadingViewComp) as ecs.Comp;
    }
    
    // 窗口节点 destroy 之后回调
    onRemoved:(node: Node | null, params: any) => {
        
    }
};
Global.gui.open(UIID.Loading, null, uic);
```

##### 异步函数打开一个窗口
```
const node = await Global.gui.openAsync(UIID.Loading);
```

##### 关闭一个窗口
```
Global.gui.remove(UIID.Loading);
```

##### 指定一个节点来删除窗口
```
Global.gui.removeByNode(cc.Node);
```
注：这里的Node必须是通过Global.gui.open或openAsync打开的才会执行关闭

##### 缓存中是否存在指定标识的窗口
```
Global.gui.has(UIID.Loading);
```

##### 渐隐飘过提示
```
Global.gui.toast("提示内容");
```

##### 清除所有窗口
```
Global.gui.clear();
```


### audio功能说明
音频管理模块主要处理游戏背景音乐、游戏音效两大类功能。

### 使用说明
##### 播放背景音乐
```
Global.audio.playMusic("audios/nocturne");
```
注：调用此方法后，后台会异步下载音乐资源，完成后开始播放音乐

##### 背景音乐播放完成回调设置
```
Global.audio.setMusicComplete(() => {
    console.log("音乐播放完成");
});
```
   
##### 获取或设置背景音乐音量
```
Global.audio.musicVolume = 0.5;
```
注：音量范围 (0 ~ 1)

##### 背景音乐开关
```
Global.audio.switchMusic = false;
```

##### 获取或设置音乐播放进度
```
Global.audio.progressMusic = 0.5;
```
注：音量进度 (0 ~ 1)

##### 播放音效
```
Global.audio.playEffect("audios/Gravel");
```
注：调用此方法后，后台会异步下载音乐资源，完成后开始播放音乐
   
##### 获取或设置音效音量
```
Global.audio.volumeEffect = 0.5;
```
注：音量范围 (0 ~ 1)

##### 音效音乐开关
```
Global.audio.switchEffect = false;
```

##### 恢复暂停的所有音乐播放
```
Global.audio.resumeAll();
```

##### 暂停当前音乐与音效的播放
```
Global.audio.pauseAll();
```

##### 停止当前音乐与音效的播放
```
Global.audio.stopAll();
```

##### 停止当前音乐与音效的播放
```
Global.audio.stopAll();
```

##### 保存音乐音效的音量、开关配置数据到本地
```
Global.audio.save();
```

##### 本地加载音乐音效的音量、开关配置数据并设置到游戏中
```
Global.audio.load();
```


### Res功能说明
资源管理模块主要处理游戏各种类型的资源的加载与释放功能。

### 使用说明
##### 加载远程资源
```
const opt: IRemoteOptions = { ext: ".png" };
const onComplete = (err: Error | null, data: ImageAsset) => {
    const texture = new Texture2D();
    texture.image = data;
    
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    
    const sprite = this.sprite.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;
}
ResMgr.loadRemote<ImageAsset>(this.url, opt, onComplete);
```

##### 加载资源包配置信息
```
const serverUrl = "http://192.168.1.13:8082/";        // 服务器地址
const md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
await ResMgr.loadBundle(serverUrl,md5);
```

##### 加载单个资源
```
const path = "model";
ResMgr.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    if (err) {
        console.error(`资源不存在`);
        return;
    }

    this.spine.skeletonData = sd;
});
```

加载其它bundle中资源
```
const path = "model";
ResMgr.load("bundleName", path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
    if (err) {
        console.error(`资源不存在`);
        return;
    }

    this.spine.skeletonData = sd;
});
```

##### 加载一个文件夹中的资源
```
/** 加载进度事件 */
const onProgressCallback = (finished: number, total: number, item: any) => {
    console.log("资源加载进度", finished, total);
}

/** 加载完成事件 */
const onCompleteCallback = () => {
    console.log("资源加载完成");
}
ResMgr.loadDir("game", onProgressCallback, onCompleteCallback);
```

##### 释放一个资源
```
ResMgr.release("model", "resources");
```
注：第二个参数"resources"为默认值，为引擎默认bundle。如果需要释放其它bundle里的资源修改此参数即可

##### 释放一个文件夹的资源
```
ResMgr.releaseDir("model", "resources");
```
注：第二个参数"resources"为默认值，为引擎默认bundle。如果需要释放其它bundle里的资源修改此参数即可

##### 获取缓存中资源
```
ResMgr.get("common/anim/button_scale_start", AnimationClip, "resources")
```
注：第三个参数"resources"为默认值，为引擎默认bundle。如果需要获取其它bundle里的资源修改此参数即可


##### 打印缓存中所有资源信息
```
ResMgr.dump();   
```
注：用于调试时观察是资源是否正确释放
