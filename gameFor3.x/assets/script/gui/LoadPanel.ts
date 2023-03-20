import { _decorator, Component, find, ProgressBar, director, UI } from 'cc';
import { UIID } from '../common/core/config/GameUIConfig';
import { grid_type } from '../common/core/platform/PlatformBase';
import { ResMgr } from '../common/core/res/ResMgr';
import Global from '../common/game/data/Global';
const { ccclass, property } = _decorator;

@ccclass('LoadPanel')
export class LoadPanel extends Component {

    progressBar: ProgressBar = null;

    progress: number = 0;

    preLoadState = false;
    continueClose = true;
    onLoad() {
        director.preloadScene('Game');
        this.progressBar = find('progressBar', this.node).getComponent(ProgressBar);
        ResMgr.loadDir('game', 'preload', this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
        this.preloadCustomAd();
    }

    onDestroy() {
        console.log('loadPanel destroy');
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, _item: any) {
        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.progressBar.progress = progress;
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        this.preLoadState = true;
        this.openMainPanel();
    }

    openMainPanel() {
        if (this.preLoadState && this.continueClose) {
            Global.gui.remove(UIID.LoadPanel);
            Global.gui.open(UIID.MainPanel);
        }
    }

    preloadCustomAd() {
        Global.platform.preloadCustomAd(grid_type['grid-3-1'], -370, 450);
        Global.platform.preloadCustomAd(grid_type['grid-3-1'], 255, 450);
    }
}


