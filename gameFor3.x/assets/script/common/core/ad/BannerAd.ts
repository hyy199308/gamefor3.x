import { Component, Enum, screen, view, _decorator } from "cc";
import Global from "../../game/data/Global";
import { ClientEvent, ED } from "../event/ClientEvent";

/** 调试结果枚举 */
enum EBannerStyleType {
    NONE = 0,
    LANDSCAPE = 1,
    LANDSCAPE_CENTER = 2,
    PORTRAIT_TOP = 3,
    LANDSCAPE_BOTTOM_CENTER = 4,
    LANDSCAPE_BOTTOM_RIGHT = 5,
}

const { ccclass, property } = _decorator;

@ccclass('BannerAd')
export class BannerAd extends Component {

    @property({ tooltip: '是否动态广告ID，动态广告id会从window.platform.bannerIdList里面随机一个广告ID使用' })
    dynamicId: boolean = true;
    @property({ tooltip: 'Banner广告单元ID，由微信官方提供', visible() { return !this.dynamicId; } })
    adUnitId: string = 'adunit-18f17afeb75e655a';
    @property({ tooltip: '广告单元ID预埋Key，用于从服务端获取的配置中读取广告单元，该配置会覆盖默认的adUnitId属性', visible() { return !this.dynamicId; } })
    adConfigKey: string = '';
    @property({ tooltip: '是否驻留，驻留的Banner会在其它广告被移除时自动显示' })
    resident: boolean = false;
    @property({ tooltip: '是否在组件运行时自动显示' })
    showOnStart: boolean = true;
    @property({ tooltip: '是否属于误触类型' })
    isTouchByMistake: boolean = false;
    @property({ tooltip: '是否自动刷新' })
    isAutoUpdate: boolean = false;
    @property({ tooltip: '是否快速刷新', visible() { return this.isAutoUpdate; } })
    isQuickUpdate: boolean = false;
    @property({ tooltip: '广告位置标记，用于统计' })
    positionTag: string = '';
    @property({ type: Enum(EBannerStyleType), tooltip: '是否横屏' })
    styleType: EBannerStyleType = EBannerStyleType.NONE;
    @property({ tooltip: 'Banner广告的宽度（广告高度会根据宽度进行缩放适配）', visible() { return this.styleType === EBannerStyleType.LANDSCAPE || this.styleType === EBannerStyleType.LANDSCAPE_CENTER; } })
    width: number = 300;
    @property({ tooltip: 'Banner广告的位置Top', visible() { return this.styleType === EBannerStyleType.LANDSCAPE || this.styleType === EBannerStyleType.LANDSCAPE_CENTER; } })
    top: number = 270;
    @property({ tooltip: 'Banner广告的位置Left', visible() { return this.styleType === EBannerStyleType.LANDSCAPE; } })
    left: number = 0;

    // =======================================
    // 静态属性定义(以static修饰)
    // =======================================

    /** 游戏事件对象 */
    public static EEventName = {
        // 在这里定义事件(key-value形式，key必须全大写下划线分隔，value必须是字符串)
        // 隐藏所有的Banner广告
        HIDE_ALL_BANNER_AD: 'HIDE_ALL_BANNER_AD',
        // 显示驻留Banner广告
        SHOW_RESIDENT_BANNER_AD: 'SHOW_RESIDENT_BANNER_AD',
        // 加载Banner成功
        LOAD_SUCCESSED_BANNER_AD: 'LOAD_SUCCESSED_BANNER_AD'
    };
    /** 广告benner集合对象缓存 */
    static banners = {};
    /** 加载广告成功的次数 */
    static loadSuccCount = 0;

    // =======================================
    // 外部/内部属性定义(以public/private修饰)
    // =======================================
    // 数据对象缓存
    // private data = null;
    // private datas = [];
    // 广告加载次数
    private loadCount: number = 0;
    // 广告加载失败次数
    private loadErrorCount: number = 0;

    // 更新时间缓存
    private autoUpdateTimeCache: number = 0;
    // 自动更新banner时间间隔
    private updateBannerInterval: number = 60;
    // banner拉取成功次数
    private loadBannerMaxCount: number = 20;

    /** 快速刷新广告次数 */
    private quickUpdateCount: number = 0;

    listener1 = null;

    init() {
        this.updateBannerInterval = 60;
        this.loadBannerMaxCount = 20;

        this.positionTag === '' && (this.positionTag = this.adConfigKey.trim());
        // 如果清理为0，每次进入该面板都会快速刷新，太浪费了点
        // this.quickUpdateCount = 0;
        BannerAd.hideAllBannerAd();
        this.scheduleOnce(() => {
            this.createBanner();
            this.showOnStart && this.show();
        }, 0.05);

        if (this.resident) {
            this.listener1 = ED.on(ClientEvent.SHOW_RESIDENT_BANNER_AD, data => {
                this.onShowResidentBannerAd(data);
            })
        }
    }

    onEnabled() {
        console.log(`BannerAd onEnabled`);
        // 更新banner的自动刷新间隔
        this.updateBannerInterval = 60;
        this.loadBannerMaxCount = 20;

        this.positionTag === '' && (this.positionTag = this.adConfigKey.trim());
        // 如果清理为0，每次进入该面板都会快速刷新，太浪费了点
        // this.quickUpdateCount = 0;
        BannerAd.hideAllBannerAd();
        this.scheduleOnce(() => {
            this.createBanner();
            this.showOnStart && this.show();
        }, 0.05);

        if (this.resident) {
            this.listener1 = ED.on(ClientEvent.SHOW_RESIDENT_BANNER_AD, data => {
                this.onShowResidentBannerAd(data);
            })
        }
    }

    onDisable() {
        this.hide();
        if (this.listener1) {
            ED.off(this.listener1);
        }
        BannerAd.hideAllBannerAd();
        ED.send(ClientEvent.SHOW_RESIDENT_BANNER_AD, {
            adUnitId: this.adUnitId,
            adConfigKey: this.adConfigKey,
            positionTag: this.positionTag,
        });
    }

    /**
     * 场景动画更新前回调
     * @param dt 游戏帧时长
     */
    onUpdate(dt) {
        if (!this.isAutoUpdate || BannerAd.loadSuccCount > this.loadBannerMaxCount) {
            //this.update = () => { };
            return;
        }

        this.autoUpdateTimeCache += dt;
        if (this.autoUpdateTimeCache < 1) { return; }
        // 每隔1s进来一次
        this.autoUpdateTimeCache -= 1;

        try {
            let cache = BannerAd.banners[this.adUnitId];
            if (cache && cache.view && cache.view.show && cache.isShow) {
                cache.showTime += 1;

                if (this.updateBannerInterval < cache.showTime || this.checkQuickUpdate(cache)) {
                    // this.updateBanner();
                }
            }
        } catch (error) { }
    }

    // =======================================
    // 自定义事件回调(以on开头)
    // =======================================

    // 广告被点击
    private onTouchBannerAd(data) {
        const adUnitId = this.adUnitId;
        let cache = BannerAd.banners[adUnitId];
        if (!cache.isShow) { return; }
        if (BannerAd.loadSuccCount < this.loadBannerMaxCount) {
            this.destroyBanner();
            try {
                this.createBanner();
                this.show();
            } catch (error) { }
        }

        console.log('点击banner成功', adUnitId);
    }

    /** 显示驻留广告 */
    private onShowResidentBannerAd(data) {
        if (!this.node.active || !this.node.activeInHierarchy || !this.enabled) { return; }
        if (data.adConfigKey !== '' && data.adConfigKey === this.adConfigKey) { return; }
        if (data.positionTag !== '' && data.positionTag === this.positionTag) { return; }

        this.createBanner(true);
    }

    // =======================================
    // 游戏逻辑方法(内部调用的用private修饰，外部调用和编辑器绑定的public修饰，废弃的方法不加修饰符方便后期移除)
    // =======================================

    /** 初始化广告id */
    private initBannerId() {
        if (this.isTouchByMistake) {
            const ids = [];
            let cache;
            // 筛选已创建并加载成功的广告id
            for (const key in BannerAd.banners) {
                cache = BannerAd.banners[key];
                cache && cache.isLoaded && ids.push(cache.adUnitId || key);
            }
            console.log('初始化bannerId', '缓存bannerId', ids);
            if (ids[0]) {
                // 随机一个id
                this.adUnitId = ids[Math.floor(Math.random() * ids.length)];
                return console.log('误触页使用缓存bannerId', this.adUnitId);
            }
        }


        const adBannerConfigs = Global.platform.bannerIdList;
        if (this.dynamicId && adBannerConfigs && adBannerConfigs[0]) {
            // 从全局随机一个广告id
            this.adUnitId = adBannerConfigs[Math.floor(Math.random() * adBannerConfigs.length)];
        } else if (this.adConfigKey.trim() !== '' && (window as any).adConfigs) {
            // 固定id
            this.adUnitId = this.adUnitId;
        }
        console.log('使用随机bannerId', this.adUnitId, '是否误触页', this.isTouchByMistake);
    }

    
    /** 创建广告 */
    private createBanner(isShow: boolean = false) {
        // this.hide();
        this.initBannerId();

        if (!this.adUnitId || this.adUnitId === '') { return; }
        const adUnitId = this.adUnitId;
        let cache = BannerAd.banners[adUnitId];

        if (cache && cache.view && cache.view.show) {
            this.bindADViewEvents(cache.view, cache, adUnitId, isShow);
            if (isShow) {
                cache.view.show();
                cache.isShow = true;
            }
            return console.log('使用缓存banner', adUnitId, '是否误触页', this.isTouchByMistake);
        }

        const frameSize = view.getFrameSize();
        const visibleSize = view.getVisibleSize();

        let width = frameSize.width;
        let left = 0;
        let top = BannerAd.getBannerTop();

        switch (this.styleType) {
            case EBannerStyleType.LANDSCAPE:
                width = this.width;
                left = BannerAd.getBannerLeft(this.left);
                top = this.top * frameSize.height / (visibleSize.height / 2);
                break;
            case EBannerStyleType.LANDSCAPE_CENTER:
                width = this.width;
                left = (frameSize.width - this.width) / 2;
                top = this.top * frameSize.height / (visibleSize.height / 2);
                break;
            case EBannerStyleType.PORTRAIT_TOP:
                left = 0;
                top = 0
                if (visibleSize.height / visibleSize.width >= 2) {
                    top = 0 + 45;
                    top *= frameSize.width / visibleSize.width;
                }
                break;
            case EBannerStyleType.LANDSCAPE_BOTTOM_CENTER:
                width = this.width;
                left = (frameSize.width - this.width) / 2;
                break;

            case EBannerStyleType.LANDSCAPE_BOTTOM_RIGHT:
                width = this.width;
                left = frameSize.width - 175;
                break;
            default:
                break;
        }
        const bannerView = window['wx'].createBannerAd({ adUnitId, style: { left, top, width }, });
        // 更新banner的自动刷新间隔
        this.updateBannerInterval = 60;
        this.loadBannerMaxCount = 20;

        cache = { bannerView, adUnitId, showTime: 0 };
        BannerAd.banners[adUnitId] = cache;
        ++this.loadCount;

        this.bindADViewEvents(bannerView, cache, adUnitId, isShow);

        if (isShow) {
            cache.view.show();
            cache.isShow = true;
        }
        console.log('使用新建banner', adUnitId, '是否误触页', this.isTouchByMistake);
    }

    /** 绑定广告事件 */
    private bindADViewEvents(view, cache, adUnitId, isShow) {
        cache.view = view;
        view.onLoad(() => {
            cache && (cache.isLoaded = true);
            BannerAd.loadSuccCount += 1;
        });
        view.onError((err) => {
            cache && (cache.isLoaded = false);
            ++this.loadErrorCount;
            if (this.loadErrorCount > 5) {
            } else {
                try {
                    view.hide();
                    view.offLoad();
                    view.offError();
                    view.destroy();
                } catch (error) {

                }

                try {
                    BannerAd.banners[adUnitId] = undefined;
                    this && this.scheduleOnce(this.createBanner.bind(this, isShow), 0.3);
                } catch (error) { }

                this.onErrorVideoAd(err);
            }
        });
    }

    /** 刷新banner */
    public updateBanner() {
        ++this.quickUpdateCount;

        // this.destroyBanner();
        try {
            // this.createBanner();
            // this.show();
        } catch (error) { }
    }

    // 验证是否快速刷新
    private checkQuickUpdate(cache) {
        if (!this.isQuickUpdate || (window as any).GameConfig.serverConfig.QUICK_UPDATE_BANNER_INTERVAL > cache.showTime) { return false; }
        if (this.quickUpdateCount > (window as any).GameConfig.serverConfig.QUICK_UPDATE_BANNER_COUNT) { return false; }
        if ((window as any).GameConfig.serverConfig.SWITCH_QUICK_UPDATE_BANNER === 3 || (window as any).GameConfig.serverConfig.SWITCH_QUICK_UPDATE_BANNER === 0) { return false; }

        return true;
    }

    /**
     * 显示Banner广告
     * 
     * 如果广告未创建，则临时创建并强制显示
     */
    public show() {
        let cache = BannerAd.banners[this.adUnitId];
        if (!cache || !cache.view || !cache.view.show) {
            return this.createBanner(true);
        }

        const frameSize = view.getFrameSize();
        let width = frameSize.width;
        let left = 0;
        let top = BannerAd.getBannerTop();


        switch (this.styleType) {
            case EBannerStyleType.LANDSCAPE:
                width = this.width;
                left = BannerAd.getBannerLeft(this.left);
                top = this.top * frameSize.height / (view.getVisibleSize().height / 2);
                break;
            case EBannerStyleType.LANDSCAPE_CENTER:
                width = this.width;
                left = (view.getFrameSize().width - this.width) / 2;
                top = this.top * frameSize.height / (view.getVisibleSize().height / 2);
                break;
            case EBannerStyleType.PORTRAIT_TOP:
                left = 0;
                top = 0
                let visibleSize = view.getVisibleSize();
                if (visibleSize.height / visibleSize.width >= 2) {
                    top = 0 + 45;
                    top *= view.getFrameSize().width / visibleSize.width;
                }
                break;
            case EBannerStyleType.LANDSCAPE_BOTTOM_CENTER:
                width = this.width;
                left = (frameSize.width - this.width) / 2;
                top = frameSize.height * 0.75 * frameSize.height / (view.getVisibleSize().height / 2);
                break;

            case EBannerStyleType.LANDSCAPE_BOTTOM_RIGHT:
                width = this.width;
                left = frameSize.width - 175;
                top = frameSize.height * 0.75 * frameSize.height / (view.getVisibleSize().height / 2);
                break;
            default:
                break;
        }

        cache.view.style.left = left;
        cache.view.style.top = top;
        this.scheduleOnce(() => {
            cache.view.show();
            cache.isShow = true;
        }, 0)
    }

    /**
     * 隐藏Banner广告
     */
    public hide() {
        console.log("banner 隐藏");
        this.unscheduleAllCallbacks();
        try {
            let cache = BannerAd.banners[this.adUnitId];
            if (cache && cache.view) {
                cache.view.hide();
                cache.isShow = false;
                cache.view.offLoad();
                cache.view.offError();
            }
        } catch (error) { }
    }

    private destroyBanner() {
        this.unscheduleAllCallbacks();
        const adUnitId = this.adUnitId;
        try {
            let cache = BannerAd.banners[adUnitId];
            if (cache && cache.view) {
                cache.view.hide();
                cache.view.offLoad();
                cache.view.offError();
                cache.view.destroy();
                console.log('销毁banner', adUnitId);
            }
        } catch (error) { }
        BannerAd.banners[adUnitId] = undefined;
        return adUnitId;
    }

    /** 隐藏所有广告，包括驻留广告 */
    public static hideAllBannerAd() {
        let cache;
        for (const key in BannerAd.banners) {
            cache = BannerAd.banners[key];
            if (!cache || !cache.view || !cache.view.hide) {
                BannerAd.banners[key] = undefined;
                continue;
            }

            cache.view.hide();
            cache.isShow = false;
        }
    }

    /** 获取Banner的Top */
    public static getBannerTop() {
        let visibleSize = view.getVisibleSize();
        let top = visibleSize.height - 255;
        if (visibleSize.height / visibleSize.width >= 2) {
            top = visibleSize.height - 305;
        }
        top *= view.getFrameSize().width / visibleSize.width;
        // 全面屏-305
        // 非全面瓶-255
        return top;
    }

    /** 获取Banner的Left */
    public static getBannerLeft(left: number = 0) {
        let visibleSize = view.getVisibleSize();
        let result = 0;
        if (visibleSize.width / visibleSize.height >= 2) {
            result = 40;
        }
        result *= view.getFrameSize().width / visibleSize.width;
        // 全面屏-305
        // 非全面瓶-255
        return left + result;
    }

    // 广告错误
    private onErrorVideoAd(res) {
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
        console.log(msg);
    }
}
