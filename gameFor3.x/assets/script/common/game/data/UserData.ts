import { StaticData } from "../../../../resources/data/StaticData";
import DataBase from "../../core/data/DataBase";
import { ClientEvent, ED } from "../../core/event/ClientEvent";
import Global from "./Global";

export interface IItemGet {
    itemId: number;
    num: number;
}

export default class UserData extends DataBase {

    // 单例
    private static _instance: UserData;
    public static get instance() {
        if (!this._instance) {
            this._instance = new UserData('UserInfo' + Global.playerId);

        }
        return this._instance;
    }

    private _gameVideoTime = 0;
    public set gameVideoTime(value) {
        this._gameVideoTime = value;
        this.delaySave();
    }
    public get gameVideoTime() {
        return this._gameVideoTime;
    }

    private _shareNum = 0;
    public set shareNum(value) {
        this._shareNum = value;
        this.delaySave();
    }
    public get shareNum() {
        return this._shareNum;
    }

    private _level = 1;
    public set level(value) {
        this._level = value;
        this.save();
    }
    public get level() {
        return this._level;
    }

    private _tryLevel = 1;
    public set tryLevel(value) {
        value = value > 10 ? value % 10 : value;
        this._tryLevel = value;
    }
    public get tryLevel() {
        return this._tryLevel;
    }

    private _mapData = [];
    public set mapData(value) {
        this._mapData = value;
    }
    public get mapData() {
        return this._mapData;
    }

    private _addGold = 0;
    public set addGold(value) {
        this._addGold = value;
    }
    public get addGold() {
        return this._addGold;
    }

    private _curStar = 0;
    public set curStar(value) {
        this._curStar = value;
    }
    public get curStar() {
        return this._curStar;
    }

    private _starList = [];
    public set starList(value) {
        this._starList = value;
    }
    public get starList() {
        return this._starList;
    }

    private _gold = 0;
    public set gold(value) {
        this._gold = value;
        ED.send(ClientEvent.GOLD_CHANGE);
    }
    public get gold() {
        return this._gold;
    }

    private _skin = 1;
    public set skin(value) {
        this._skin = value;
        ED.send(ClientEvent.SKIN_CHANGE);
        this.save();
    }
    public get skin() {
        return this._skin;
    }

    private _trySkin = 0;
    public set trySkin(value) {
        this._trySkin = value;
    }
    public get trySkin() {
        return this._trySkin;
    }

    private _skinList = [1];
    public set skinList(value) {
        this._skinList = value;
        this.save();
    }
    public get skinList() {
        return this._skinList;
    }

    private _startScore = 0;
    public set startScore(value) {
        this._startScore = value;
        this.delaySave();
    }
    public get startScore() {
        return this._startScore;
    }

    private _nickName: string = '';
    public set nickName(value) {
        this._nickName = value;
        this.delaySave();
    }
    public get nickName() {
        return this._nickName;
    }

    private _avatarUrl: string = '';
    public set avatarUrl(value) {
        this._avatarUrl = value;
        this.delaySave();
    }
    public get avatarUrl() {
        return this._avatarUrl;
    }

    private _gender = 0;
    public set gender(value) {
        this._gender = value;
        this.delaySave();
    }
    public get gender() {
        return this._gender;
    }

    private _power = 30;
    public set power(value) {
        this._power = value;
        this.delaySave();
        ED.send(ClientEvent.POWER_ADD);
    }
    public get power() {
        return this._power;
    }

    private _powerLimit = 30;
    public set powerLimit(value) {
        this._powerLimit = value;
        this.delaySave();
    }
    public get powerLimit() {
        return this._powerLimit;
    }

    private _powerTime = 0;
    public set powerTime(value) {
        this._powerTime = value;
        this.delaySave();
    }
    public get powerTime() {
        return this._powerTime;
    }

    private _powerVipLv = 0;
    public set powerVipLv(value) {
        this._powerVipLv = value;
        this.delaySave();
    }
    public get powerVipLv() {
        return this._powerVipLv;
    }

    private _newPlayer = 0;
    public set newPlayer(value) {
        this._newPlayer = value;
        this.delaySave();
        ED.send(ClientEvent.NEW_PLAYER_CHANGE);
    }
    public get newPlayer() {
        return this._newPlayer;
    }

    private _date = 0;                      // 日期用于更新签到
    public set date(value) {
        this._date = value;
        this.delaySave();
    }
    public get date() {
        return this._date;
    }

    public get day() {
        return new Date(this.serverTime * 1000).getDate();
    }

    public get serverTime() {
        return Math.floor(new Date().getTime() / 1000);
    }

    private _signState = 0;
    public get signState() {
        return this._signState;
    }
    public set signState(value) {
        this._signState = value;
        this.delaySave();
        ED.send(ClientEvent.SIGN_CHANGE);
    }

    private _signday = 1;
    public get signday() {
        return this._signday;
    }
    public set signday(value) {
        this._signday = value;
        this.delaySave();
    }

    private _onlineTime = 0;
    public get onlineTime() {
        return this._onlineTime;
    }
    public set onlineTime(value) {
        this._onlineTime = value;
        this.delaySave();
        ED.send(ClientEvent.ONLINE_CHANGE);
    }

    private _onlineRewardList = [];
    public get onlineRewardList() {
        return this._onlineRewardList;
    }
    public set onlineRewardList(value) {
        this._onlineRewardList = value;
        this.delaySave();
        ED.send(ClientEvent.ONLINE_CHANGE_REWARD);
    }

    private _boxOpenTime = 0;
    public get boxOpenTime() {
        return this._boxOpenTime;
    }
    public set boxOpenTime(value) {
        this._boxOpenTime = value;
        ED.send(ClientEvent.BOX_NUM_CHANGE);
    }

    /**
     * 新的一天
     * */
    public newDate() {
        this._date = new Date().getDate();
        this._signState = 0;
        if (this.signday == 8) this.signday = 1;
        this.power = this.power > this.powerLimit ? this.powerLimit : this.power;
        this.powerVipLv = 0;
        this.save();
    }

    public getItem(itemList: IItemGet[]) {
        for (let i = 0; i < itemList.length; ++i) {
            const data = itemList[i];
            if (data.itemId <= 14) {
                if (this.skinList.indexOf(data.itemId) == -1) {
                    this.skinList.push(data.itemId);
                    if (data.num > 1) {
                        this.gold += StaticData.skinStaticData[data.itemId].price;
                    }
                } else {
                    this.gold += StaticData.skinStaticData[data.itemId].price;
                }
            } else if (data.itemId == 10000) {
                this.gold += data.num;
            } else {
            }
        }
    }

    public startOnline() {
        setInterval(() => {
            this.onlineTime += 60;
        }, 60000);
    }
}