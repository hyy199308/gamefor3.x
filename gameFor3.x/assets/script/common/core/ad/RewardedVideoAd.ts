import { Component, Enum, sys, _decorator } from "cc";
import Global from "../../game/data/Global";

/** 调试结果枚举 */
enum EDebugVideoAdResult {
    PLAY_SUCCESSED = 1,
    PLAY_FAILED = 2,
    LOAD_FAILED = 3
}

enum EADPlatform {
    NORMAL,
    APP_STORE,
    GOOGLE_PLAY,
}

const { ccclass, property } = _decorator;

@ccclass('RewardedVideoAd')
export class RewardedVideoAd extends Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ type: Enum(EADPlatform), tooltip: '广告平台' })
    adPlatform: EADPlatform = EADPlatform.NORMAL;
    @property({ tooltip: '视频广告单元ID，由微信官方提供', visible() { return this.adPlatform === EADPlatform.NORMAL; } })
    adUnitId: string = 'adunit-4f25e8e5a99d390f';
    @property({ tooltip: '视频广告单元ID，由苹果商店提供', visible() { return this.adPlatform === EADPlatform.APP_STORE; } })
    adUnitIdAppStore: string = '';
    @property({ tooltip: '视频广告单元ID，由谷歌商店提供', visible() { return this.adPlatform === EADPlatform.GOOGLE_PLAY; } })
    adUnitIdGooglePlay: string = '';
    @property({ tooltip: '广告单元ID预埋Key，用于从服务端获取的配置中读取广告单元，服务端获取广告配置后要设置到ADRewardedVideo组件的adConfig属性上。该配置会覆盖默认的adUnitId属性', visible() { return this.adPlatform === EADPlatform.NORMAL; } })
    adConfigKey: string = '';
    @property({ tooltip: '播放标识，用于播放状态回调事件的识别' })
    positionTag: string = '';
    @property({ tooltip: '是否开启调试，调试用于在没有视频广告的时候验证回调逻辑是否正确' })
    debugVideoAd: boolean = false;
    @property({ type: Enum(EDebugVideoAdResult), tooltip: '调试结果设置。PLAY_SUCCESSED:播放成功, PLAY_FAILED:玩家中途关闭视频, LOAD_FAILED:视频加载失败', visible() { return this.debugVideoAd; } })
    debugVideoAdResult: EDebugVideoAdResult = EDebugVideoAdResult.PLAY_SUCCESSED;
    @property({ type: Function, tooltip: '视频关闭的回调。回调函数包含两个参数，第一个参数是error错误信息，第二个参数是result播放成功的信息' })
    closeCallbacks: Function = null;
    @property({ tooltip: '显示其它事件' })
    showOtherEvents: boolean = false;
    @property({ type: [Component.EventHandler], visible() { return this.showOtherEvents; }, tooltip: '视频拉起成功的回调。回调函数包含两个参数，第一个参数是error错误信息，第二个参数是result显示成功的信息' })
    showCallbacks: any[] = [];
    @property({ type: [Component.EventHandler], visible() { return this.showOtherEvents; }, tooltip: '视频加载成功的回调。回调函数包含两个参数，第一个参数是error错误信息，第二个参数是result显示成功的信息' })
    loadCallbacks: any[] = [];
    @property({ type: [Component.EventHandler], visible() { return this.showOtherEvents; }, tooltip: '视频发生错误的回调。回调函数包含一个error参数，error带有详细的错误信息' })
    errorCallbacks: any[] = [];

    // =======================================
    // 静态属性定义(以static修饰)
    // =======================================

    // 当前组件对应的微信广告视图对象，微信视频广告视图对象是一个全局单例
    private static _videoAd: any = null;
    // 当前视频组件对应的广告单元ID
    private static _currentAdUnitId: string = '';

    // =======================================
    // 外部/内部属性定义(以public/private修饰)
    // =======================================

    // 视频组件加载回调句柄
    private _onLoadVideoAdBind = null;
    // 视频组件关闭回调句柄
    private _onCloseVideoAdBind = null;
    // 视频组件报错回调句柄
    private _onErrorVideoAdBind = null;

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================

    init() {
        this.createRewardedVideoAd(this.adUnitId);
    }

    onEnable() {
        this.createRewardedVideoAd(this.adUnitId);
    }

    onDisable() {
        if (RewardedVideoAd._videoAd) {
            this.offVideoCallbackEvents();
        }
        RewardedVideoAd._videoAd = null;
    }

    // =======================================
    // 游戏逻辑方法(内部调用的用private修饰，外部调用和编辑器绑定的public修饰，废弃的方法不加修饰符方便后期移除)
    // =======================================

    public recreateRewardedVideoAd(adUnitId: string) {
        if (this.adPlatform === EADPlatform.NORMAL) {
            this.adUnitId = adUnitId;
        } else {
            this.adUnitId = this.adPlatform === EADPlatform.APP_STORE ? this.adUnitIdAppStore : this.adUnitIdGooglePlay;
        }

        this.createRewardedVideoAd(this.adUnitId);
    }

    /**
     * 创建激励视频广告组件（全局单例）
     * 
     * 用户观看完视频，系统触发 WechatMiniGameUtils.EEventType.AD_VIDEO_PLAYER_ENDED 
     * 用户中途退出，系统触发 WechatMiniGameUtils.EEventType.AD_VIDEO_PLAYER_CANCELLED 
     * 
     * @param adUnitd 广告ID
     */
    private createRewardedVideoAd(adUnitId: string) {
        if (sys.platform === sys.Platform.DESKTOP_BROWSER || sys.platform === sys.Platform.MOBILE_BROWSER) {
            return;
        }
        console.log('creator video', adUnitId)
        if (!adUnitId || adUnitId.length === 0) { return; }

        if (!RewardedVideoAd._videoAd || RewardedVideoAd._currentAdUnitId !== adUnitId) {
            console.log('creator video')
            RewardedVideoAd._videoAd = window['wx'].createRewardedVideoAd({ adUnitId, });
            RewardedVideoAd._videoAd.onError(err => {
                console.log(err, "video err")
            })
            RewardedVideoAd._currentAdUnitId = adUnitId;
        }
        if (!RewardedVideoAd._videoAd) { return; }

        this.offVideoCallbackEvents();
    }

    /**
     * 显示并播放激励广告视频
     */
    public showRewardVideoAd() {
        if (this.debugVideoAd || sys.platform === sys.Platform.DESKTOP_BROWSER || sys.platform === sys.Platform.MOBILE_BROWSER) {   //|| !AppConfig.isAd
            if (this.debugVideoAdResult === EDebugVideoAdResult.PLAY_SUCCESSED) {
                this.closeCallbacks(true, false, '视频调试模拟播放成功');
            } else if (this.debugVideoAdResult === EDebugVideoAdResult.PLAY_FAILED) {
                this.closeCallbacks(false, false, '视频调试模拟您关闭了视频');
            } else {
                this.closeCallbacks(false, false, '视频调试模拟加载视频失败');
            }
            return console.warn('激励视频广告开启了调试模式模拟结果回调，发布时必须关闭');
        }

        if (!RewardedVideoAd._videoAd) {
            let adUnitId = 'adunit-4f25e8e5a99d390f';
            this.createRewardedVideoAd(adUnitId);

            return this.closeCallbacks(false, false, '视频广告看光了，请稍后再试！');
            // this.createRewardedVideoAd(adUnitId: string)
        }

        this.offVideoCallbackEvents();
        this.onVideoCallbackEvents();
        RewardedVideoAd._videoAd.show().then(res => {
            Global.user.gameVideoTime++;
            this.showCallbacks.map(fn => fn.emit([undefined, { msg: '视频显示成功', positionTag: this.positionTag }]));
        }).catch(err => {
            // 重新加载
            RewardedVideoAd._videoAd.load().then(() => {
                RewardedVideoAd._videoAd.show().then(() => {
                    this.showCallbacks.map(fn => fn.emit([undefined, { msg: '视频显示成功', positionTag: this.positionTag }]));
                }).catch(err => {
                    this.closeCallbacks(false, false, '视频广告看光了，请稍后再试！');
                });
            }).catch(err => {
                this.closeCallbacks(false, false, '视频广告看光了，请稍后再试！');
            });
        });
    }

    private onVideoCallbackEvents() {
        this._onLoadVideoAdBind || (this._onLoadVideoAdBind = this.onLoadVideoAd.bind(this));
        this._onCloseVideoAdBind || (this._onCloseVideoAdBind = this.onCloseVideoAd.bind(this));
        this._onErrorVideoAdBind || (this._onErrorVideoAdBind = this.onErrorVideoAd.bind(this));

        RewardedVideoAd._videoAd.onLoad(this._onLoadVideoAdBind);
        RewardedVideoAd._videoAd.onClose(this._onCloseVideoAdBind);
        RewardedVideoAd._videoAd.onError(this._onErrorVideoAdBind);
    }

    private offVideoCallbackEvents() {
        try {
            this._onLoadVideoAdBind && RewardedVideoAd._videoAd.offLoad(this._onLoadVideoAdBind);
            this._onCloseVideoAdBind && RewardedVideoAd._videoAd.offClose(this._onCloseVideoAdBind);
            this._onErrorVideoAdBind && RewardedVideoAd._videoAd.offError(this._onErrorVideoAdBind);

            RewardedVideoAd._videoAd.offLoad();
            RewardedVideoAd._videoAd.offClose();
            RewardedVideoAd._videoAd.offError();
        } catch (error) {
            RewardedVideoAd._videoAd.offLoad();
            RewardedVideoAd._videoAd.offClose();
            RewardedVideoAd._videoAd.offError();
        }
    }

    // 广告加载回调
    private onLoadVideoAd(res) {
        console.log('广告加载成功', res);
        this.loadCallbacks.map(fn => fn.emit([undefined, { msg: '视频加载成功', positionTag: this.positionTag }]));
    }

    // 广告被关闭的回调
    private onCloseVideoAd(res) {
        console.log('广告关闭', res);
        Global.platform.pauseAll();
        Global.platform.resumeAll();
        // 字节平台不会自动加载视频
        // if (gg.isMiniGameTT) {ADRewardedVideo.videoAd.load();}

        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
            this.closeCallbacks(true, false);
            // 记录次数
        } else {
            // 播放中途退出，不下发游戏奖励
            this.closeCallbacks(false, false, '完整看完视频才有奖励哦!');
        }
    }

    // 广告错误
    private onErrorVideoAd(res) {
        console.log('广告错误', res);
        let msg: string;

        switch (res.errCode) {
            case 1000: msg = '后端接口调用失败，暂时无法观看'; break;
            case 1001: msg = '参数错误，暂时无法观看'; break;
            case 1002: msg = '广告单元无效，暂时无法观看'; break;
            case 1003: msg = '内部错误，暂时无法观看'; break;
            case 1004: msg = '无合适的广告，暂时无法观看'; break;
            case 1005: msg = '广告组件审核中，暂时无法观看'; break;
            case 1006: msg = '广告组件被驳回，暂时无法观看'; break;
            case 1007: msg = '广告组件被封禁，暂时无法观看'; break;
            case 1008: msg = '广告单元已关闭，暂时无法观看'; break;
            default: msg = '遇到未知错误，暂时无法观看'; break;
        }

        this.errorCallbacks.map(fn => fn.emit([{ ...res, msg, positionTag: this.positionTag }]));
        console.log(msg);
    }
}
