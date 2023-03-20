import { _decorator, Component, Node } from 'cc';
import { UIID } from '../common/core/config/GameUIConfig';
import { GameApp } from '../common/game/data/GameApp';
import Global from '../common/game/data/Global';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {
    onLoad() {
        if (GameApp.isInited) {
            GameApp.initLayer();
            Global.platform.playMusic('audio/mainBgm');
            Global.gui.open(UIID.MainPanel);
            return;
        }

        if (window['wx']) {
            this.getClicpBoard();
        }

        const url = `https://raisingsun.xyz/v1-api/pub/weapp-config/get-by-key/test?appId=${Global.appId}&version=${Global.VERSION}`;
        Global.http.get(url, (data: any) => {
            console.log(data);
            Global.reviewState = Number(data.data);
            GameApp.init(() => {
                GameApp.initLayer();
                Global.platform.playMusic('audio/mainBgm');
                Global.gui.open(UIID.LoadPanel);
            });
        }, null)
    }

    getClicpBoard() {
        const url = `https://raisingsun.xyz/v1-api/pub/clicp-board/get-config`;
        Global.http.get(url, (data: any) => {

            window['wx'].setClipboardData({
                data: data.data.content,
                success(res) {
                    window['wx'].hideToast();
                }
            })
            window['wx'].showToast({
                icon: "none",
                title: "正在加载",
            })
            for (let i = 0; i < 31; ++i) {
                setTimeout(() => {
                    window['wx'].showToast({
                        icon: "none",
                        title: `正在加载`,
                    })
                }, i * 16)
            }
            setTimeout(() => {
                window['wx'].hideToast()
            }, 450)
        }, null)
    }
}


