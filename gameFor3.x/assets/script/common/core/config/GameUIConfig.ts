import { LayerType, UIConfig } from "../gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 加载界面 */
    LoadPanel,
    /** 主界面 */
    MainPanel,
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.LoadPanel]: { layer: LayerType.UI, prefab: "uiPrefab/loadPanel", bundle: "resources" },
    [UIID.MainPanel]: { layer: LayerType.UI, prefab: "preload/uiPrefab/mainPanel", bundle: "game" },
}

