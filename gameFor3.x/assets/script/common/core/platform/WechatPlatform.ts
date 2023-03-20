import { error, Game, game, instantiate, Prefab, Node, view } from "cc";
import Global from "../../game/data/Global";
import UserData from "../../game/data/UserData";
import { Util } from "../../util/Util";
import { BannerAd } from "../ad/BannerAd";
import { CustomAd } from "../ad/CustomAd";
import { InterstitialAd } from "../ad/InterstitialAd";
import { RewardedVideoAd } from "../ad/RewardedVideoAd";
import ShareMgr from "../ad/ShareMgr";
import { ResMgr } from "../res/ResMgr";
import PlatformBase, { grid_type } from "./PlatformBase";

let shareSuccess = false;

interface IMULTI_TYPE_AD {
    data: IMULTI_TYPE_AD_DATA
    message: string
    status: number
}

interface IMULTI_TYPE_AD_DATA {
    bannerAdId: string
    intersAdId: string
    rewardAdId: string
}

interface IGRID_AD {
    data: IGRID_AD_DATA
    message: string
    status: number
}

interface IMULTI_CLICP_BOARD {
    data: IMULTI_CLICP_BOARD_INFO
    message: string
    status: number
}

interface IMULTI_CLICP_BOARD_INFO {
    content: string
    switch: number
}

interface IGRID_AD_DATA {
    'grid-1': IGRID_AD_DATA_Message[]
    'grid-1-2': IGRID_AD_DATA_Message[]
    'grid-1-3': IGRID_AD_DATA_Message[]
    'grid-1-3-s': IGRID_AD_DATA_Message[]
    'grid-1-4': IGRID_AD_DATA_Message[]
    'grid-1-4-s': IGRID_AD_DATA_Message[]
    'grid-1-s': IGRID_AD_DATA_Message[]
    'grid-2-1': IGRID_AD_DATA_Message[]
    'grid-2-5': IGRID_AD_DATA_Message[]
    'grid-2-s': IGRID_AD_DATA_Message[]
    'grid-3-1': IGRID_AD_DATA_Message[]
    'grid-3-1-s': IGRID_AD_DATA_Message[]
    'grid-4-1': IGRID_AD_DATA_Message[]
    'grid-4-1-s': IGRID_AD_DATA_Message[]
    'grid-5-1': IGRID_AD_DATA_Message[]
    'grid-5-1-s': IGRID_AD_DATA_Message[]
    'grid-5-5': IGRID_AD_DATA_Message[]
}

interface IGRID_AD_DATA_Message {
    adId: string
    adName: string
    appId: string
    createBy: string
    createTime: string
    id: string
    realName: string
    type: string
}

interface IREPORT_data {
    data: string
    message: string
    status: number
}

const UMKeyConfig = {
    "进入开始页": "HOME_WIN",
    "进入游戏页": "GAME_WIN",
    "进入结算页": "OVER_WIN",
    "进入新人礼包页": "GIFT_WIN",
    "进入体力页": "POWER_WIN",
    "进入商店页": "SHOP_WIN",
    "进入签到页": "SIGN_WIN",
    "进入转盘页": "WHEEL_WIN",
    "banner广告调用": "BANNER",
    "banner广告显示失败": "BANNER_FAIL",
    "插屏广告调用": "INITINTERSTITIAL",
    "插屏广告显示失败": "INITINTERSTITIAL_FAIL",
    "视频调用": "VIDEO",
    "视频完播": "VIDEO_FINISH",
    "原生广告调用": "CUSTOM",
    "原生广告显示失败": "CUSTOM_FAIL",
    "结算页点击打开宝箱": "RESULT_OPEN_BOX",
    "游戏页点击后退一步": "GAME_BACK",
    "游戏页点击增加空瓶": "GAME_ADD_BOTTLE",
    "游戏页点击重新开始": "GAME_RESTART",
    "新人礼包分享领取": "NEW_SHARE",
    "新人礼包视频领取": "NEW_VIDEO",
    "体力分享领取": "POWER_SHARE",
    "体力视频领取": "POWER_VIDEO",
    "购买背景或皮肤": "BUY",
    "签到视频领取": "SIGN_VIDEO",
    "签到直接领取": "SIGN_REVICE",
    "点击转盘分享": "WHEEL_SHARE",
}

export default class WechatPlatform extends PlatformBase {
    private _sdk: any;
    private _automation: boolean = true;
    private _needLogin: boolean = true;

    rewardVideoAd: RewardedVideoAd = null;
    bannerAd: BannerAd = null;
    interstitialAd: InterstitialAd = null;
    customAdMap = new Map<grid_type, CustomAd>();

    bannerIdList = [
        'adunit-18f17afeb75e655a',
        'adunit-f8730cfa0d907925',
    ];

    interstitialIdList = [
        'adunit-0dc7c51cc8a84afe',
        'adunit-79578fe9a11bc5ce',
    ];

    customObj = {};
    constructor() {
        super();
        this._sdk = window['wx'];
        Global.appId = this._sdk.getAccountInfoSync().miniProgram.appId;
        this.checkVersion();
        this.onShow();
        this._sdk.showShareMenu();
        this._sdk.onShareAppMessage(() => { return this.shareData });
        // this.initReport();
        // this.getClicpBoard();
        if (this._automation && !Global.reviewState) {
            const bundle = "resources";
            const url = `https://raisingsun.xyz/v1-api/pub/multi-type-ad/${Global.appId}`;
            Global.http.get(url, (data: IMULTI_TYPE_AD) => {
                ResMgr.load(bundle, 'common/prefab/adNode', (err: Error | null, res: Prefab) => {
                    if (err) {
                        error(err);
                        return;
                    }
                    const childNode: Node = instantiate(res);
                    this.persistRootNode.addChild(childNode);
                    const customUrl = `https://raisingsun.xyz/v1-api/pub/ad/grid-all/${Global.appId}`;
                    Global.http.get(customUrl, (data: IGRID_AD) => {
                        if (data.status != 1) {
                            return;
                        }
                        this.customObj = data.data;
                        const mainKey = ['grid-5-5', 'grid-3-1', 'grid-1', 'grid-4-1-s'];
                        const obj = {};
                        for (let i = 0; i < mainKey.length; ++i) {
                            obj[mainKey[i]] = data.data[mainKey[i]];
                        }
                        this.setCustomAd(obj, childNode);
                    }, null)

                    this.rewardVideoAd = childNode.getChildByName('rewardedVideoAd').getComponent(RewardedVideoAd);
                    this.rewardVideoAd.adUnitId = data?.data?.rewardAdId ? data?.data?.rewardAdId : this.rewardVideoAd.adUnitId;
                    childNode.getChildByName('rewardedVideoAd').active = true;
                    this.rewardVideoAd.adUnitId && this.rewardVideoAd.init();  // 持久节点不会执行生命周期

                    this.bannerAd = childNode.getChildByName('bannerAd').getComponent(BannerAd);
                    this.bannerAd.adUnitId = data?.data?.bannerAdId ? data?.data?.bannerAdId : this.bannerAd.adUnitId;
                    childNode.getChildByName('bannerAd').active = true;
                    this.bannerAd.adUnitId && this.bannerAd.init();

                    this.interstitialAd = childNode.getChildByName('interstitialAd').getComponent(InterstitialAd);
                    this.interstitialAd.adUnitId = data?.data?.intersAdId ? data?.data?.intersAdId : this.interstitialAd.adUnitId;
                    childNode.getChildByName('interstitialAd').active = true;
                    this.interstitialAd.adUnitId && this.interstitialAd.init();
                });
            }, null)
        }
    }

    setCustomAd(data: any, childNode: Node, ignoreList = []) {
        for (let key in data) {
            if (data[key].length > 0 && ignoreList.indexOf(key) == -1) {
                const id = `customAd_${key}`;
                let node = childNode.getChildByName(id);
                if (!node) {
                    node = new Node(id);
                    node.addComponent(CustomAd);
                }
                let scrip = node.getComponent(CustomAd);
                node.active = true;
                scrip.adUnitId = data[key][0].adId;
                scrip.init();
                let customAd = this.customAdMap.get(key as grid_type);
                if (!customAd) {
                    this.customAdMap.set(key as grid_type, scrip);
                }
            }
        }
    }

    protected getClicpBoard() {
        const url = `https://raisingsun.xyz/v1-api/pub/clicp-board/get-config`;
        Global.http.get(url, (data: IMULTI_CLICP_BOARD) => {
            if (data.status != 1) {
                return;
            }
            if (data.data.switch === 1) {
                this._sdk.showToast({
                    icon: "none",
                    title: "正在加载",
                })
                for (let i = 0; i < 31; ++i) {
                    setTimeout(() => {
                        this._sdk.showToast({
                            icon: "none",
                            title: `正在加载`,
                        })
                    }, i * 16)
                }
                setTimeout(() => {
                    this._sdk.setClipboardData({
                        data: data.data.content,
                        success(res) {
                            this._sdk.hideToast();
                        }
                    })
                }, 100)
                setTimeout(() => {
                    this._sdk.hideToast()
                }, 550)
            }
        }, null)
    }

    getShareImage() {
        let canvas: any = game.canvas.getContext("webgl", { preserveDrawingBuffer: true }).canvas;
        const height = view.getVisibleSize().height;
        const width = view.getVisibleSize().width;
        let tempFile = canvas.toTempFilePathSync({
            width: width,
            height: height,
        })
        this.shareIamge = tempFile;
    }

    protected get shareData(): any {
        // ShareMgr.randomShare();
        // let query = "&shareid=" + ShareMgr.shareID;
        // let tempFile = Util.screenshot();
        this.getShareImage();
        let share = {
            title: '吃金豆',
            imageUrl: this.shareIamge,
        }
        let data = this._sdk.uma.trackShare(share);
        return data
    }

    protected checkVersion() {
        const updateManager = this._sdk.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            this._sdk.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    }

    public login(callback: (data: any) => void): void {
        if (this._needLogin) {
            var self: any = this;
            this._sdk.login({
                success(res) {
                    this.userCode = res.code;
                    self.authorize('userInfo', () => {
                        self._sdk.getUserInfo({
                            success(res) {
                                console.log(`nickName:${res.userInfo.nickName}`);
                                console.log(`avatarUrl:${res.userInfo.avatarUrl}`);
                                console.log(`gender:${res.userInfo.gender}`);
                                callback(res);
                            },
                            fail(res) {
                                callback(null);
                            }
                        });
                    });
                },
                fail(res) {
                    console.warn('微信登录失败信息');
                    console.warn(res);
                }
            })
        } else {
            callback(null);
        }
    }

    public authorize(scope, callback) {
        var self = this;
        self._sdk.getSetting({
            success(res) {
                if (!res.authSetting[`scope.${scope}`]) {
                    self._sdk.authorize({
                        scope: `scope.${scope}`,
                        success() {
                            if (callback) {
                                callback();
                            }
                        },
                        fail(err) {
                            if (callback) {
                                callback();
                            }
                        }
                    })
                } else {
                    if (callback) {
                        callback();
                    }
                }
            },
            fail(res) {
                console.log('get setting error');
            }
        });
    }

    protected onShow() {
        game.on(Game.EVENT_HIDE, () => {
            console.log('Game.EVENT_HIDE');
            this.pauseAll();
        });

        this._sdk.onShow((options) => {
            console.log('Game.EVENT_SHOW');
            this.resumeAll();
            if (shareSuccess) {
                shareSuccess = false; // 判断完毕后立即改回初始状态
            }

            if (this._shareCallback) {
                const time = 3000;
                let success: boolean = new Date().getTime() - this._shareTime >= time;
                this._shareCallback(success, true);
                this._shareCallback = null;
                if (success) {
                    Global.user.shareNum++;
                }
            }

            this.showInterstitialAd();
        });
    }

    private _shareTime: number;
    private _shareCallback: Function;

    public share(callback: (success: boolean) => void): void {
        this._shareCallback = callback;
        this._shareTime = new Date().getTime();
        ShareMgr.randomShare();
        const shareInfo = {
            serial: 1,//分享点序号
            title: ShareMgr.shareTitle,//当随机分享内容不可用时使用的默认分享标题
            image: ShareMgr.shareImage,//当随机分享内容不可用时使用的默认分享图片
        };
        this._sdk.shareAppMessage(shareInfo);
    }

    public watchAd(callback: (success: boolean, shareState: boolean, msg?: string) => void, adID: string = "", eventId: number = 999): void {
        if (Global.reviewState) {
            callback(true, false);
            return;
        }
        if (adID) {
            this.rewardVideoAd.recreateRewardedVideoAd(adID);
        }
        this.rewardVideoAd.closeCallbacks = null;
        this.rewardVideoAd.closeCallbacks = callback;
        this.rewardVideoAd.showRewardVideoAd();
    }

    public loadBanner(id?: string, intoView: string = "") {
    }

    public showBannerAd(intoView: string = "") {
        if (Global.reviewState) {
            return;
        }
        this.bannerAd.show();
    }

    public hideBanner() {
        if (Global.reviewState) {
            return;
        }
        this.bannerAd.hide();
    }

    public initInterstitialAd() {
    }

    public showInterstitialAd(callback?: Function) {
        if (Global.reviewState) {
            if (callback) {
                callback(true, false);
            }
            return;
        }
        this.interstitialAd.show();
    }

    public adShare(callback: (success: boolean) => void): void {
        callback(true);
    }

    public event(id: number) {
    }

    public eventValue(id: number, value: number) {
    }

    public sdkEvent(name: string, params: any = {}) {
        const event_id = UMKeyConfig[name];
        this._sdk.uma.trackEvent(event_id, params);
    }

    //浮标广告
    public getRecommendInfo(callBack?: Function) {
    }

    //猜你喜欢
    public getSuggestList(callBack?: Function, bool: boolean = true, num: number = 0) {
    }

    public getExcitationList(callBack?: Function) {
    }

    public click(appid) {
        this._sdk.navigateToMiniProgram({
            appId: appid,
            path: '',
            extraData: null,
            envVersion: 'release',
            success(res) {
                console.log('跳转成功');
            }
        })
    }

    public preloadCustomAd(type: grid_type,  x: number = 0, y: number = 0) {
        if (Global.reviewState) {
            return;
        }
        let customAd = this.customAdMap.get(type);
        if (!customAd) {
            const obj = {}
            obj[type] = this.customObj[type];
            this.setCustomAd(obj, this.persistRootNode.getChildByName('adNode'));
            customAd = this.customAdMap.get(type);
        }
        customAd.preload(x, y);
    }

    public showCustomAd(type: grid_type, x: number = 0, y: number = 0) {
        if (Global.reviewState) {
            return;
        }
        let customAd = this.customAdMap.get(type);
        if (!customAd) {
            const obj = {}
            obj[type] = this.customObj[type];
            this.setCustomAd(obj, this.persistRootNode.getChildByName('adNode'));
            customAd = this.customAdMap.get(type);
            setTimeout(() => {
                customAd.show(x, y);
            }, 500);
        } else {
            customAd.show(x, y);
        }
    }

    public hideCustomAd(type: grid_type, x: number = 0, y: number = 0) {
        if (Global.reviewState) {
            return;
        }
        const customAd = this.customAdMap.get(type);
        customAd.hide(x, y);
    }

    public showGridAd(list: any, cb = null) {
    }

    public hideGridAd() {
    }

    public canMistake() {
        return false;
    }

    public name(): string {
        return "weChatGame";
    }

    public getRankInfo(cb?: Function) {
        const url = `https://raisingsun.xyz/v1-api/pub/game-rank/top-rank/100?code=${this.userCode}&openId=${this.userCode}`;
        Global.http.get(url, (data: any) => {
            if (data.data) {
                this.topGameRankList = data.data;
                if (cb) {
                    cb(data.data);
                }
            }
        }, null, [{ key: 'appId', value: Global.appId }])
    }

    public submitScoreForRank(score: number) {
        const url = `https://raisingsun.xyz/v1-api/pub/game-rank/submit-score/${Global.appId}`;
        const data = {
            openId: this.userCode,
            code: this.userCode,
            avatarUrl: Global.user.avatarUrl,
            nickname: Global.user.nickName,
            score,
        }
        Global.http.post(url, data, (data: any) => {
            if (data.data.topGameRankList) {
                this.topGameRankList = data.data.topGameRankList;
            }
        }, null, [{ key: 'appId', value: Global.appId }])
    }

    public shock(type = 0) {
        if (type == 0) {
            this._sdk.vibrateShort();
        } else {
            this._sdk.vibrateLong();
        }
    }
}