import { MOVE_TYPE } from "../../game/enum/MoveEnum";
import EventDispatcher from "./EventDispatcher";

/** 事件派发器 */
export const ED = new EventDispatcher<ClientEventDef>();

/** 客户端事件 */
export const enum ClientEvent {
    POWER_ADD,                              /** 增加体力*/
    GOLD_CHANGE,                            /** 货币变动*/
    SKIN_CHANGE,                            /** 皮肤变动*/
    SKIN_LIST_CHANGE,                       /** 皮肤变动*/
    ONLINE_CHANGE,                          /** 皮肤变动*/
    NEW_PLAYER_CHANGE,                      /** 新手礼包变动*/
    SIGN_CHANGE,                            /** 签到变动*/
    ONLINE_CHANGE_REWARD,                   /** 在线变动*/
    BOX_NUM_CHANGE,

    SHOP_SELECT,

    PLAY_MOVE,                              /** 玩家移动*/
    RESTART,
    ADD_SPEED,
    HIT_I,
    TARGET_CHANGE,                         
    
    CHANGE_MAIN_CUSTOM,
    OPEN_ALL_BOX,
    
    // 需要保留
    SHOW_RESIDENT_BANNER_AD,                /** 展示驻留banner*/
}

/** 客户端事件携带参数定义 */
export type ClientEventDef = {
    [ClientEvent.POWER_ADD]: null,
    [ClientEvent.GOLD_CHANGE]: null,
    [ClientEvent.SKIN_CHANGE]: null,
    [ClientEvent.SKIN_LIST_CHANGE]: null,
    [ClientEvent.ONLINE_CHANGE]: null,
    [ClientEvent.NEW_PLAYER_CHANGE]: null,
    [ClientEvent.SIGN_CHANGE]: null,
    [ClientEvent.ONLINE_CHANGE_REWARD]: null,
    [ClientEvent.BOX_NUM_CHANGE]: null,

    [ClientEvent.SHOP_SELECT]: null,

    [ClientEvent.PLAY_MOVE]: MOVE_TYPE,
    [ClientEvent.RESTART]: null,
    [ClientEvent.ADD_SPEED]: number,
    [ClientEvent.HIT_I]: string,
    [ClientEvent.TARGET_CHANGE]: null,

    [ClientEvent.CHANGE_MAIN_CUSTOM]: boolean,
    [ClientEvent.OPEN_ALL_BOX]: null,

     // 需要保留
    [ClientEvent.SHOW_RESIDENT_BANNER_AD]: IRESIDENT_BANNERT,
}

/** 宽高(正整型) */
export interface IRESIDENT_BANNERT {
    adUnitId: string                           
    adConfigKey: string                           
    positionTag: string
}
