import { Component, _decorator } from "cc";
import Global from "../../game/data/Global";

const { ccclass, property } = _decorator;

@ccclass('InterstitialAd')
export class InterstitialAd extends Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================
    @property({ tooltip: '是否动态广告ID，动态广告id会从WechatPlatform.interstitialIdList里面随机一个广告ID使用' })
    dynamicId: boolean = false;
    @property({ tooltip: '广告单元ID，由微信官方提供', visible() { return !this.dynamicId; } })
    adUnitId: string = 'adunit-0dc7c51cc8a84afe';
    @property({ tooltip: '广告单元ID预埋Key，用于从服务端获取的配置中读取广告单元', visible() { return !this.dynamicId; } })
    adConfigKey: string = '';
    @property({ tooltip: '是否在组件运行时自动显示' })
    showOnStart: boolean = false;
    @property({ tooltip: '广告位置标记，用于统计' })
    positionTag: string = '';
    @property({ type: Function, tooltip: '插屏关闭的回调。回调函数包含两个参数，第一个参数是error错误信息，第二个参数是result显示成功的信息' })
    closeCallbacks: Function = null;
    @property({ type: [Component.EventHandler], tooltip: '插屏关闭的回调。回调函数包含两个参数，第一个参数是error错误信息，第二个参数是result显示成功的信息' })
    errorCallbacks: any[] = [];

    // =======================================
    // 静态属性定义(以static修饰)
    // =======================================

    /** 游戏事件对象 */
    public static EEventName = {
        // 在这里定义事件(key-value形式，key必须全大写下划线分隔，value必须是字符串)
        LOAD_SUCCESSED_INTERSTITIAL_AD: 'LOAD_SUCCESSED_INTERSTITIAL_AD',
    };
    /** 广告集合对象缓存 */
    static interstitials = {};
    /** 加载广告成功的次数 */
    static loadSuccCount = 0;
    // 广告加载次数
    static loadCount: number = 0;

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================

    init() {
        this.positionTag === '' && (this.positionTag = this.adConfigKey.trim());

        this.createAd();
        this.showOnStart && this.show();
    }

    onEnabled() {
        this.positionTag === '' && (this.positionTag = this.adConfigKey.trim());

        this.createAd();
        this.showOnStart && this.show();
    }

    onDisable() {
        let cache = InterstitialAd.interstitials[this.adUnitId];
        if (cache && cache.view) {
            this.unbindADViewEvents(cache.view);
        }
    }

    // =======================================
    // 游戏逻辑方法(内部调用的用private修饰，外部调用和编辑器绑定的public修饰，废弃的方法不加修饰符方便后期移除)
    // =======================================

    /** 初始化广告id */
    private initInterstitialId() {
        const adInterstitialConfigs = Global.platform.interstitialIdList;
        if (this.dynamicId && adInterstitialConfigs && adInterstitialConfigs[0]) {
            // 从全局随机一个广告id
            this.adUnitId = adInterstitialConfigs[Math.floor(Math.random() * adInterstitialConfigs.length)];
        } else if (this.adConfigKey.trim() !== '' && (window as any).adConfigs) {
            // 固定id
            this.adUnitId = this.adUnitId;
        }
    }

    /** 创建广告 */
    private createAd(isShow: boolean = false) {
        this.initInterstitialId();

        if (!this.adUnitId || this.adUnitId === '') { return; }
        const adUnitId = this.adUnitId;
        let cache = InterstitialAd.interstitials[adUnitId];
        if (cache && cache.view && cache.view.show) {
            this.bindADViewEvents(cache, cache.view, adUnitId);
            isShow && cache.view.show().then(() => { }).catch((err) => {
                this.errorCallbacks.map(fn => { fn.emit([err]); });
            });
            return;
        }

        try {
            const view = window['wx'].createInterstitialAd({ adUnitId, });
            cache = { view, adUnitId };
            InterstitialAd.interstitials[adUnitId] = cache;
            ++InterstitialAd.loadCount;

            this.bindADViewEvents(cache, view, adUnitId);

            if (isShow) {
                cache.view.show().then(() => { }).catch((err) => {
                    this.errorCallbacks.map(fn => { fn.emit([err]); });
                });
                cache.isShow = true;
            }
        } catch (error) {
            const data = {
                msg: '插屏广告创建失败',
                adConfigKey: this.adConfigKey,
                adUnitId: this.adUnitId,
                positionTag: this.positionTag,
                ...error,
            };
            console.log(`插屏广告创建失败`);
        }
    }

    /** 绑定广告事件 */
    private bindADViewEvents(cache, view, adUnitId) {
        cache.view = view;
        this['onLoadBind'] = () => {
            InterstitialAd.loadSuccCount += 1;
        }
        view.onLoad(this['onLoadBind']);

        this['onErrorBind'] = (err) => {
            this.unbindADViewEvents(view);
            InterstitialAd.interstitials[adUnitId] = undefined;
            this.errorCallbacks.map(fn => { fn.emit([err]); });
        };
        view.onError(this['onErrorBind']);

        this['onCloseBind'] = (res) => {
            const data = {
                msg: '插屏广告关闭了',
                adConfigKey: this.adConfigKey,
                adUnitId: this.adUnitId,
                positionTag: this.positionTag,
                ...res,
            };
            console.log(`插屏广告关闭了`);
        };
        view.onClose(this['onCloseBind']);
    }

    private unbindADViewEvents(view) {
        try {
            this['onLoadBind'] && view.offLoad(this['onLoadBind']);
            this['onErrorBind'] && view.offError(this['onErrorBind']);
            this['onCloseBind'] && view.offClose(this['onCloseBind']);
        } catch (error) {
            view.offLoad();
            view.offError();
            view.offClose();
        }
    }

    /**
     * 显示Interstitial广告
     * 
     * 如果广告未创建，则临时创建并强制显示
     */
    public show() {
        let cache = InterstitialAd.interstitials[this.adUnitId];
        if (!cache || !cache.view || !cache.view.show) {
            return this.createAd(true);
        }
        cache.view.show().then(() => { }).catch((err) => {
            this.errorCallbacks.map(fn => { fn.emit([err]); });
        });
    }
}
