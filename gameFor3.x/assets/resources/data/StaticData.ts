import Global from "../../script/common/game/data/Global"

const powerStaticData = {
    /** 60秒增加一点体力 */
    coolTime: 60,
    /** 体力特权列表 */
    oneDayAdd: [10, 20, 999],
    /** 广告体力加成 */
    adAdd: 20,
    /** 每局消耗体力 */
    cost: 5,
    /** 开宝箱最大体力 */
    boxMax: 10,
}

const goldStaticData = {
    /** 看广告获取金币 */
    adGetGold: 500,
    /** 开宝箱最大金币 */
    boxMax: 100,
}

const skinData = {
    1: { id: 1, add: 0, price: 0, name: '默认', des: '无' },
    10001: { id: 10001, add: 15, price: 1000, name: '靓', des: '关卡获得金币+15%点石成金持续时间+10%' },
    10002: { id: 10002, add: 15, price: 1000, name: '帅', des: '关卡获得金币+15%点石成金持续时间+25%' },
    10003: { id: 10003, add: 50, price: 1000, name: '富', des: '关卡获得金币+50%护盾持续时间+10%' },
    10004: { id: 10004, add: 20, price: 1000, name: '龍', des: '关卡获得金币+20%护盾持续时间+30%' },
    10005: { id: 10005, add: 25, price: 1000, name: '功夫', des: '关卡获得金币+25%护盾持续时间+25%' },
    10006: { id: 10006, add: 20, price: 1000, name: '儿', des: '关卡获得金币+20%点石成金持续时间+50%' },
    10007: { id: 10007, add: 35, price: 1000, name: '屎', des: '关卡获得金币+35%磁铁持续时间+45%' },
    10008: { id: 10008, add: 80, price: 1000, name: '穷', des: '关卡获得金币+80%点石成金持续时间+25%' },
    10009: { id: 10009, add: 30, price: 1000, name: '开火', des: '关卡获得金币+30%护盾持续时间+60%' },
}

export interface IItemResArgs {
    bundle: string;
    path: string;
}

export class StaticDataCls {

    private constructor() { }                                                       /** 单例 */
    static readonly ins = new StaticDataCls();                                      /** 实例 */
    powerStaticData = powerStaticData;
    goldStaticData = goldStaticData;
    skinStaticData = skinData;
    boxMax = 3;

    tps: number = 60;                                                               /** 逻辑帧频 */
    private _playerName = '我';                                                     /** 玩家名称 */
    get playerName() { return this._playerName; }
    set playerName(name: string) { this._playerName = name; }

    getItemPath(itemId: number): IItemResArgs {
        if (itemId <= 14) {
            return { bundle: 'game', path: `preload/texture/head/head${itemId}` };
        } else if (itemId == 10000) {
            return { bundle: 'game', path: `texture/${itemId}` };
        } else {
            return null;
        }
    }
}

export const StaticData = StaticDataCls.ins;