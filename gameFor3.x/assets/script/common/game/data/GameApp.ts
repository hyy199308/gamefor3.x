import { Canvas, director, math, SpriteFrame, UITransform, Node, sys, JsonAsset } from "cc";
import { BundleManager } from "../../core/bundle/BundleManager";
import { UIConfigData } from "../../core/config/GameUIConfig";
import { LayerManager } from "../../core/gui/layer/LayerManager";
import LocalPlatform from "../../core/platform/LocalPlatform";
import WechatPlatform from "../../core/platform/WechatPlatform";
import { ResMgr } from "../../core/res/ResMgr";
import { AStar } from "../../util/AStar";
import Global from "./Global";
import UserData from "./UserData";

/** 游戏应用全局 */
export default class GameAppCls {

    private constructor() { }                                       /** 单例 */
    static readonly ins = new GameAppCls();                         /** 实例 */

    isInited = false;                                               /** 是否已经初始化了 */
    starting = false;                                               /** 是否正在开始中 */

    private _myNode: Node = null;
    get myNode() { return this._myNode; }
    set myNode(cv: Node) { this._myNode = cv }

    private _myRow: number = null;
    get myRow() { return this._myRow; }
    set myRow(cv: number) { this._myRow = cv }

    private _mycolumn: number = null;
    get mycolumn() { return this._mycolumn; }
    set mycolumn(cv: number) { this._mycolumn = cv }

    private _startState: boolean = null;
    get startState() { return this._startState; }
    set startState(cv: boolean) { this._startState = cv }

    _rowData: any[] = [];
    get rowData() { return this._rowData; }
    set rowData(cv: any[]) {
        this._rowData = cv;
    }

    playerId: number = 1;

    /** 初始化 */
    async init(cb: Function) {
        if (this.isInited) {
            cb();
            return;
        }

        // ResMgr.preloadDir('game', 'texture', SpriteFrame);
        if (sys.platform === sys.Platform.DESKTOP_BROWSER || sys.platform === sys.Platform.MOBILE_BROWSER) {
            Global.platform = new LocalPlatform();
        } else if (sys.platform === sys.Platform.WECHAT_GAME) {
            Global.platform = new WechatPlatform();
        } else {
            Global.platform = new LocalPlatform();
        }

        await ResMgr.loadBundle('game');

        this.login(cb);

        if (!this.mapData) {
            this.mapData = await BundleManager.loadAsset('game', `preload/data/data`, JsonAsset);
        }

        this.isInited = true;
    }

    protected login(cb: Function) {
        Global.platform.login((data) => {
            Global.user = UserData.instance;
            Global.user.decode();

            if (Global.user.date != Global.user.day) {          // 更新日期
                Global.user.date = Global.user.day;
                Global.user.newDate();
            }
            Global.user.startOnline();

            if (data) {
                Global.user.nickName = data.userInfo.nickName;
                Global.user.avatarUrl = data.userInfo.avatarUrl;
                Global.user.gender = data.userInfo.gender;
            } else {
                Global.user.nickName = '我';
            }
            cb();
        });
    }

    initLayer() {
        Global.gui = new LayerManager(director.getScene().getChildByName('UICanvas'));
        Global.gui.init(UIConfigData);
    }

    mapData = null;
    async loadMap(lv: number = Global.user.level) {
        Global.user.tryLevel = lv;
        Global.user.mapData = this.mapData.json[Global.user.tryLevel - 1].data;
    }
}

/** 游戏应用全局 */
export const GameApp = GameAppCls.ins;