import { Component, _decorator, Node, Enum, sys, view, screen } from "cc";
import { Util } from "../../util/Util";

export enum EBannerStyleType {
    NONE = 0,
    OUT_SCREEN = 1,
    LEFT_TOP = 2,
    RIGHT_TOP = 3,
    LEFT_BOTTOM = 4,
    CENTER_TOP = 5,

    TOP = 6,
    BOTTOM = 7,
    LEFT = 8,
    RIGHT = 9,
    CENTRAL = 10,
}

export const matrixSize = [{ width: 375, height: 200 }, { width: 375, height: 285 }, { width: 375, height: 370 }, { width: 375, height: 460 }] // 285,370,460

export interface CustomInfo {
    adUnitId: string,
    node: Node,
    showOnStart: boolean,//this.showOnStart;
    costomType: ECostomType,
    isVertical: boolean,
    isClose: boolean,
    rows: number,
    width: number,
    styleTypeVertical: EBannerStyleType,
    styleTypeHorizontal: EBannerStyleType,
    positionTag: string,
    bClose: boolean,
    leftOffset: number,
    topOffset: number,
    bottomOffset: number,
    rightOffset: number,
    bindADViewEvents: Function,
    x: number,
    y: number,
}

export enum ECostomType {
    SINGLE = 0,
    ROW = 1,
    MATRIX = 2,
}

const { ccclass, property } = _decorator;
@ccclass('CustomAd')
export class CustomAd extends Component {

    // =======================================
    // 编辑器属性定义(以@property修饰)
    // =======================================

    @property({ tooltip: 'Banner广告单元ID，由微信官方提供' })
    adUnitId: string = 'adunit-96874d3906ddf80c';
    @property({ tooltip: '广告单元ID预埋Key，用于从服务端获取的配置中读取广告单元', visible() { return !this.dynamicId; } })
    adConfigKey: string = '';
    @property({ type: Enum({ "默认（单格）": 0, "单排": 1, "矩阵": 2 }), tooltip: '原生格子类型', displayName: "原生格子类型" })
    costomType: ECostomType = ECostomType.MATRIX;
    @property({ tooltip: "是否垂直", visible() { return this.costomType == ECostomType.ROW } })
    isVertical: boolean = false
    @property({ tooltip: "是否有开关", displayName: "是否有开关", visible() { return this.costomType == ECostomType.MATRIX } })
    isClose: boolean = false
    @property({ tooltip: "行数/个数", displayName: "行数/个数", range: [2, 5, 1], visible() { return this.costomType == ECostomType.MATRIX || this.costomType == ECostomType.ROW } })
    rows: number = 5;
    @property({ tooltip: "宽度", displayName: "宽度", visible() { return this.costomType == ECostomType.MATRIX } })
    width: number = 0;
    @property({ type: Enum({ "居中": 10, "上": 6, "下": 7 }), displayName: "垂直方向", tooltip: '广告类型' })
    styleTypeVertical: EBannerStyleType = EBannerStyleType.CENTRAL;
    @property({ type: Enum({ "居中": 10, "左": 8, "右": 9 }), displayName: "水平方向", tooltip: '广告类型' })
    styleTypeHorizontal: EBannerStyleType = EBannerStyleType.CENTRAL;
    @property({ tooltip: '广告位置标记，用于统计' })
    positionTag: string = '';
    @property({ tooltip: '是否在组件运行时自动显示' })
    showOnStart: boolean = false;
    @property({ tooltip: '是否销毁(方案1)' })
    isDestory = false;
    @property({ tooltip: '相对屏幕左边，往右偏移的设备像素值' })
    leftOffset: number = 0;
    @property({ tooltip: '相对屏幕顶部,往下偏移的设备像素值' })
    topOffset: number = 0;
    @property({ tooltip: '相对屏幕右边，往左偏移的设备像素值' })
    rightOffset: number = 0;
    @property({ tooltip: '相对屏幕底部，往上偏移的设备像素值' })
    bottomOffset: number = 0;
    @property({ tooltip: '是否关闭', displayName: '是否关闭' })
    bClose: boolean = true;

    // =======================================
    // 静态属性定义(以static修饰)
    // =======================================

    public static customView = {};
    public static adUnitId = null;

    /** 游戏事件对象 */
    public static EEventName = {
        SHOW_CUSTOMAD: 'SHOW_CUSTOMAD', //显示原生广告
        HIDE_CUSTOMAD: 'HIDE_CUSTOMAD', //隐藏原生广告
        // 加载Banner失败
        LOAD_ERROR_BANNER_AD: 'LOAD_ERROR_BANNER_AD',
    };

    // =======================================
    // 外部/内部属性定义(以public/private修饰)
    // =======================================

    private customInfo: CustomInfo = null;

    // =======================================
    // 生命周期(模板方法，以on开头)
    // =======================================

    init(x = 0, y = 0) {
        if (sys.os == "iOS" && this.topOffset == 0) {
            this.topOffset = 0.5;
        }
        const height = view.getFrameSize().height;
        const width = view.getFrameSize().width;
        this.topOffset = this.topOffset * height / (view.getVisibleSize().height)
        this.bottomOffset = this.bottomOffset * height / (view.getVisibleSize().height)
        this.leftOffset = this.leftOffset * width / (view.getVisibleSize().width)
        this.rightOffset = this.rightOffset * width / (view.getVisibleSize().width)

        this.updateAdConfig(x, y);
    }

    /** onLoad结束的回调 */
    onLoaded() {
        //适配底部Bar
        if (sys.os == "iOS" && this.topOffset == 0) {
            this.topOffset = 0.5;
        }
        const height = view.getFrameSize().height;
        const width = view.getFrameSize().width;
        this.topOffset = this.topOffset * height / (view.getVisibleSize().height)
        this.bottomOffset = this.bottomOffset * height / (view.getVisibleSize().height)
        this.leftOffset = this.leftOffset * width / (view.getVisibleSize().width)
        this.rightOffset = this.rightOffset * width / (view.getVisibleSize().width)
    }

    onEnabled() {
        console.log(`CustomAd onEnabled`);
        // this.updateAdConfig();
    }

    onDisable() {
        if (this.bClose) {
            this.hide();
        }
    }

    onDestroy() {
        if (this.isDestory) {
            this.destroyBanner()
        }
    }

    // =======================================
    // 游戏逻辑方法(内部调用的用private修饰，外部调用和编辑器绑定的public修饰，废弃的方法不加修饰符方便后期移除)
    // =======================================

    private updateAdConfig(x = 0, y = 0) {
        this.initBannerId();
        let info: CustomInfo = {
            adUnitId: this.adUnitId,
            node: this.node,
            showOnStart: this.showOnStart,
            costomType: this.costomType,
            isVertical: this.isVertical,
            isClose: this.isClose,
            rows: this.rows,
            width: this.width,
            styleTypeVertical: this.styleTypeVertical,
            styleTypeHorizontal: this.styleTypeHorizontal,
            positionTag: this.positionTag,
            bClose: this.bClose,
            leftOffset: this.leftOffset,
            topOffset: this.topOffset,
            bottomOffset: this.bottomOffset,
            rightOffset: this.rightOffset,
            bindADViewEvents: CustomAd.bindADViewEvents(),
            x,
            y,
        };

        console.log('adUnitId', info)
        this.customInfo = info;

        let isLoad = CustomAd.addCustom(this.customInfo);
        if (isLoad && this.showOnStart) {
            this.show()
        }
        return;
    }

    /** 初始化广告id */
    private initBannerId() {
        if (this.adConfigKey.trim() !== '' && (window as any).adConfigs) {
            this.adUnitId = (window as any).adConfigs[this.adConfigKey] || this.adUnitId;
        }
        if (this.adUnitId) {
            CustomAd.adUnitId = this.adUnitId;
        }
    }

    /** 隐藏所有广告，包括驻留广告 */
    public static hideAllCustomAd() {
        return;
    }

    /** 绑定广告事件 */
    private static bindADViewEvents() {
        let bindADViewEvents = (cache, view) => {
            view.onLoad(() => {
                console.log('原生广告创建成功', cache.adUnitId);
                let isShow = cache.info.showOnStart
                CustomAd.isLoad = false;
                const x = cache.x ? cache.x : 0;
                const y = cache.y ? cache.y : 0;
                CustomAd.customView[`${cache.adUnitId}_${x}_${y}`].isLoad = true;
                if (CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`] && isShow) {
                    CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`].isShow = true;
                    view.show().then(() => { }).catch(() => {
                        CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`].isShow = false;
                    })
                }
                CustomAd.nextCustom();
            });

            view.onError((err) => {
                console.error('原生广告创建失败', err, cache.adUnitId)

                try {
                    Util.compareVersion(window['wx'].getSystemInfoSync().SDKVersion, '2.14.4') >= 0 && view.offHide()
                    view.offLoad();
                    view.offClose();
                    view.offError();
                    view.destroy();
                } catch (error) {

                }
                try {
                    CustomAd.isLoad = false;
                    CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`] = undefined;
                    CustomAd.nextCustom();
                } catch (error) { }
                CustomAd.onErrorCustomAd(err)
            });

            view.onClose((err) => {
                if (err) {
                    return console.error("close custom error ", err)
                }
                if (CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`]) {
                    CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`].isShow = false;
                }
            });

            if (Util.compareVersion(window['wx'].getSystemInfoSync().SDKVersion, '2.14.4') >= 0) {
                view.onHide((err) => {
                    //console.error
                    if (err) {
                        return console.error("hide custom error ", err)
                    }
                    if (CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`]) {
                        CustomAd.customView[`${cache.adUnitId}_${cache.x}_${cache.y}`].isShow = false;
                    }
                });
            }
        }

        return bindADViewEvents
    }

    private unBindADViewEvents(key: string) {
        const cache = CustomAd.customView[key];
        const view = cache.view
        if (cache) {
            try {
                view.offLoad();
                view.offClose();
                view.offError();
                Util.compareVersion(window['wx'].getSystemInfoSync().SDKVersion, '2.14.4') >= 0 && view.offHide()
            } catch (error) {
            }
        }
    }

    /**销毁广告 */
    private destroyBanner() {
        //this.initBannerId();
        if (!this.customInfo) {
            return
        }
        for (let key in CustomAd.customView) {
            if (CustomAd.customView[key]) {
                this.unBindADViewEvents(key)
                CustomAd.customView[key].view.destory();
                CustomAd.customView[key] = undefined;
            }
        }
    }

    /**隐藏广告 */
    public hide(x: number = 0, y: number = 0) {
        if (!this.customInfo) {
            return
        }
        const cache = CustomAd.customView[`${this.customInfo.adUnitId}_${x}_${y}`];
        if (cache) {
            if (cache.isShow) {
                CustomAd.customView[`${cache.adUnitId}_${x}_${y}`].isShow = false;
                cache.view.hide().then(() => { }).catch(() => {
                })
            } else {
                cache.info.showOnStart = false;
            }

        } else {
            this.customInfo.showOnStart = false;
            CustomAd.addCustom(this.customInfo)
        }
    }

    public preload(x: number = 0, y: number = 0) {
        if (!this.customInfo) {
            return
        }
        const cache = CustomAd.customView[`${this.customInfo.adUnitId}_${x}_${y}`]
        if (!cache) {
            this.customInfo.x = x;
            this.customInfo.y = y;
            CustomAd.addCustom(this.customInfo);
        }
    }

    /**显示广告（当游戏全局只挂一个banner组件时,可通过参数区分是否误触页） */
    public show(x: number = 0, y: number = 0) {
        if (!this.customInfo) {
            return
        }
        const cache = CustomAd.customView[`${this.customInfo.adUnitId}_${x}_${y}`]
        // console.log(cache);
        if (cache) {
            if (!cache.isLoad) {
                cache.info.showOnStart = true;
            } else if (!cache.isShow) {
                CustomAd.customView[`${cache.adUnitId}_${x}_${y}`].isShow = true;
                cache.view.show().then(() => { }).catch(() => {
                    CustomAd.customView[`${cache.adUnitId}_${x}_${y}`].isShow = false;
                })
            }
        } else {
            this.customInfo.showOnStart = true;
            this.customInfo.x = x;
            this.customInfo.y = y;
            CustomAd.addCustom(this.customInfo);
        }
        return;
    }

    public static getBannerTop(info: CustomInfo) {
        let visibleSize = view.getFrameSize();
        let top = 0;
        if (info.y) {
            top = visibleSize.height / 2 - info.y * visibleSize.height / (view.getVisibleSize().height);
        } else {
            switch (info.styleTypeVertical) {
                case EBannerStyleType.CENTRAL:
                    top = (visibleSize.height - 106) / 2;
                    if ((info.costomType == ECostomType.ROW && info.isVertical)) {
                        top = (visibleSize.height - info.rows * 82) / 2;
                    } else if (info.costomType == ECostomType.MATRIX) {
                        let _height = 0
                        let _width = 0
                        if (info.width != 0) {
                            _height = info.width / matrixSize[info.rows - 2].width * matrixSize[info.rows - 2].height
                            _width = info.width
                        } else {
                            _height = visibleSize.width / matrixSize[info.rows - 2].width * matrixSize[info.rows - 2].height
                            _width = visibleSize.width
                        }
                        top = (visibleSize.height - _height) / 2;
                        // (!info.isClose) && (top -= _width * 0.11 / 2);
                    }
                    top += info.topOffset;
                    top -= info.bottomOffset;
                    top -= 40; // 不是从屏幕最上方算起的
                    break;
                case EBannerStyleType.TOP:
                    if (visibleSize.height / visibleSize.width >= 2) {
                        top += 55 * visibleSize.height / (view.getVisibleSize().height);
                    }
                    // if (info.costomType == ECostomType.MATRIX && !info.isClose) {
                    //     top -= (info.width != 0 ? info.width : visibleSize.width) * 0.11;
                    // }
                    top += info.topOffset;
                    top -= info.bottomOffset;
                    break;
                case EBannerStyleType.BOTTOM:
                    top = visibleSize.height - 106;
                    if (info.costomType == ECostomType.ROW && info.isVertical) {
                        top = visibleSize.height - info.rows * 82;
                    } else if (info.costomType == ECostomType.MATRIX) {
                        let _height = 0
                        let _width = 0
                        if (info.width != 0) {
                            _width = info.width
                            _height = info.width / matrixSize[info.rows - 2].width * matrixSize[info.rows - 2].height
                        } else {
                            _width = visibleSize.width
                            _height = visibleSize.width / matrixSize[info.rows - 2].width * matrixSize[info.rows - 2].height
                        }
                        top = visibleSize.height - _height;
                        // (!info.isClose) && (top -= _width * 0.11);

                    }
                    if (visibleSize.height / visibleSize.width >= 2) {
                        top -= 55 * visibleSize.height / (view.getVisibleSize().height);;
                    }
                    top -= info.bottomOffset
                    top += info.topOffset;
                    top -= 40; // 不是从屏幕最上方算起的
                    break;
                default:
                    break;
            }
        }
        return top;
    }

    public static getBannerLeft(info: CustomInfo) {
        let left = 0;
        let visibleSize = view.getFrameSize();
        if (info.x) {
            left = visibleSize.width / 2 + info.x * visibleSize.width / (view.getVisibleSize().width);
        } else {
            switch (info.styleTypeHorizontal) {
                case EBannerStyleType.CENTRAL:
                    left = (visibleSize.width - 72 * info.rows) / 2;
                    if ((info.costomType == ECostomType.ROW && info.isVertical) || info.costomType == ECostomType.SINGLE) {
                        left = (visibleSize.width - 72) / 2;
                    } else if (info.costomType == ECostomType.MATRIX) {
                        left = info.width == 0 ? 0 : (visibleSize.width - info.width) / 2;
                    }
                    left += info.leftOffset;
                    left -= info.rightOffset;
                    break;
                case EBannerStyleType.LEFT:
                    if (visibleSize.width / visibleSize.height >= 2) {
                        left += 55 * visibleSize.width / view.getVisibleSize().width;
                    }
                    if (info.costomType == ECostomType.MATRIX && info.width == 0) {
                        left = 0;
                    }
                    left += info.leftOffset;
                    left -= info.rightOffset;
                    break;
                case EBannerStyleType.RIGHT:
                    left = visibleSize.width;
                    if (visibleSize.width / visibleSize.height >= 2) {
                        left -= 55 * visibleSize.width / view.getVisibleSize().width;
                    }
                    if ((info.costomType == ECostomType.ROW && info.isVertical) || info.costomType == ECostomType.SINGLE) {
                        left -= 72
                    } else if (info.costomType == ECostomType.MATRIX) {
                        left = info.width == 0 ? 0 : (left - info.width);
                    } else {
                        left -= 72 * info.rows;
                    }
                    left -= info.rightOffset
                    left += info.leftOffset;
                    break;
                default:
                    break;
            }
        }
        return left;
    }

    // 广告错误
    private static onErrorCustomAd(res) {
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
        console.log(msg)
    }

    private static customList = []
    private static isLoad = false;
    private static addCustom(info: CustomInfo) {
        if (this.customView[`${info.adUnitId}_${info.x}_${info.y}`]) {
            return true;
        }
        this.customList.push(info);
        if (!this.isLoad) {
            this.creatorCustom();
            return false;
        }
    };

    private static creatorCustom() {
        const info: CustomInfo = this.customList.shift();
        if (Util.compareVersion(window['wx'].getSystemInfoSync().SDKVersion, '2.11.1') < 0) {
            console.log('SDKVersion error')
            return;
        }
        console.log("creator custom", info.adUnitId)
        if (!info.adUnitId || info.adUnitId === '' || this.customView[`${info.adUnitId}_${info.x}_${info.y}`]) { return this.nextCustom(); }
        this.isLoad = true;
        let visibleSize = view.getFrameSize();
        let view1;
        if (info.costomType == ECostomType.MATRIX && info.width != 0) {
            info.width = 360;
            info.width = info.node.name.indexOf('s') != -1 ? info.width * 0.8 : info.width;
            view1 = window['wx'].createCustomAd({ adUnitId: info.adUnitId, style: { left: this.getBannerLeft(info), top: this.getBannerTop(info) }, width: info.width });
        } else if (info.costomType == ECostomType.SINGLE) {
            view1 = window['wx'].createCustomAd({ adUnitId: info.adUnitId, style: { left: this.getBannerLeft(info), top: this.getBannerTop(info) } });
        } else {
            view1 = window['wx'].createCustomAd({ adUnitId: info.adUnitId, style: { left: this.getBannerLeft(info), top: this.getBannerTop(info) } });
        }
        let cache = { view: view1, isLoad: false, isShow: false, adUnitId: info.adUnitId, info: info, x: info.x, y: info.y };
        CustomAd.customView[`${info.adUnitId}_${info.x}_${info.y}`] = cache;
        if (info && info.bindADViewEvents) {
            info.bindADViewEvents(cache, view1);
        } else {
            this.isLoad = false;
            CustomAd.customView[`${info.adUnitId}_${info.x}_${info.y}`] = undefined;
            this.nextCustom()
        }
    }


    private static nextCustom() {
        if (this.isLoad) {
            return;
        }

        setTimeout(() => {
            this.customList.length > 0 && this.creatorCustom();
        }, 500)

    }
}
