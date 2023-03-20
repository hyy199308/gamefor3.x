import { LayerManager } from "../../core/gui/layer/LayerManager";
import { HttpRequest } from "../../core/network/HttpRequest";
import PlatformBase from "../../core/platform/PlatformBase";
import UserData from "./UserData";

export default class Global {
    public static loginSuccess: boolean = false;                                        /** 登录标志 */
    public static playerId: string = '2';                                               /** 玩家id */
    public static VERSION: string = '1.0.0';                                            /** 版本号 */
    public static appId: string = 'wxaf984c6e6635c870';                                 /** appId */
    public static url: string = '';
    public static platform: PlatformBase;                                               /** 发布平台 */
    public static user: UserData;                                                       /** 玩家数据 */
    public static gui: LayerManager;                                                    /** 界面管理 */
    public static http: HttpRequest = new HttpRequest();                                /** http请求 */
    public static reviewState: number = 0;                                              /** 审核状态 0 非审核状态 1 审核状态 */
}