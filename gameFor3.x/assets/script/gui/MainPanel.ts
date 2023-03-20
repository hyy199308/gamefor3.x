import { Button, Component, director, find, Label, Node, Sprite, Tween, tween, Vec3, _decorator } from 'cc';
import { StaticData } from '../../resources/data/StaticData';
import { BundleManager } from '../common/core/bundle/BundleManager';
import { UIID } from '../common/core/config/GameUIConfig';
import { ClientEvent, ED } from '../common/core/event/ClientEvent';
import { grid_type } from '../common/core/platform/PlatformBase';
import { GameApp } from '../common/game/data/GameApp';
import Global from '../common/game/data/Global';
import { Util } from '../common/util/Util';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends Component {

    goldAddBtn: Node = null;
    powerAddBtn: Node = null;
    gameTitle: Node = null;
    moreGameBtn: Node = null;
    startGameBtn: Node = null;
    powerPrivilegeBtn: Node = null;
    selectLevelBtn: Node = null;
    upgradeBtn: Node = null;
    boxBtn: Node = null;
    skinBtn: Node = null;
    goldLabel: Label = null;
    powerLabel: Label = null;
    timeLabel: Label = null;

    onLoad() {
        this.goldAddBtn = find('goldAddBtn', this.node);
        this.powerAddBtn = find('powerAddBtn', this.node);
        this.gameTitle = find('gameTitle', this.node);
        this.moreGameBtn = find('moreGameBtn', this.node);
        this.startGameBtn = find('startGameBtn', this.node);
        this.powerPrivilegeBtn = find('powerPrivilegeBtn', this.node);
        this.selectLevelBtn = find('selectLevelBtn', this.node);
        this.upgradeBtn = find('upgradeBtn', this.node);
        this.boxBtn = find('boxBtn', this.node);
        this.skinBtn = find('skinBtn', this.node);
        this.goldLabel = find('goldLabel', this.node).getComponent(Label);
        this.powerLabel = find('powerLabel', this.node).getComponent(Label);
        this.timeLabel = find('timeLabel', this.node).getComponent(Label);

        this.btnAnimation();
        this.updateGold();
        this.updatePower();
    }

    listenerList = [];
    onEnable() {
        this.showCustom();

        this.goldAddBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.powerAddBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.moreGameBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.startGameBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.powerPrivilegeBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.selectLevelBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.upgradeBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.boxBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.skinBtn.on(Node.EventType.TOUCH_END, this.buttonClick, this);

        this.listenerList.push(ED.on(ClientEvent.GOLD_CHANGE, this.updateGold, this));
        this.listenerList.push(ED.on(ClientEvent.POWER_ADD, this.updatePower, this));
        this.listenerList.push(ED.on(ClientEvent.CHANGE_MAIN_CUSTOM, (state: boolean) => {
            if (state) {
                this.showCustom();
            } else {
                this.hideCustom();
            }
        }, this));
        
        this.preloadCustomAd();
    }

    onDisable() {
        this.hideCustom();

        if (this.timer) {
            clearInterval(this.timer);
        }

        this.goldAddBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.powerAddBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.moreGameBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.startGameBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.powerPrivilegeBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.selectLevelBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.upgradeBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.boxBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);
        this.skinBtn.off(Node.EventType.TOUCH_END, this.buttonClick, this);

        for (let i = 0; i < this.listenerList.length; ++i) {
            ED.off(this.listenerList[i]);
        }
    }

    buttonClick(event) {
        switch (event.target.name) {
            case 'startGameBtn':
                GameApp.loadMap();
                if (Global.user.power >= StaticData.powerStaticData.cost) {
                    Global.user.power -= StaticData.powerStaticData.cost;
                    director.loadScene('Game');
                } else {
                    // Global.gui.open(UIID.PowerAddPanel);
                }
                break;
        }
    }

    showCustom() {
        Global.platform.showCustomAd(grid_type['grid-3-1'], -370, 450);
        Global.platform.showCustomAd(grid_type['grid-3-1'], 255, 450);
        Global.platform.showBannerAd();
    }

    hideCustom() {
        Global.platform.hideCustomAd(grid_type['grid-3-1'], -370, 450);
        Global.platform.hideCustomAd(grid_type['grid-3-1'], 255, 450);
        Global.platform.hideBanner();
    }

    updateGold() {
        this.goldLabel.string = `${Global.user.gold}`;
    }

    timer = null;
    updatePower() {
        const nowTime = Global.user.serverTime;
        const powerTime = Global.user.powerTime;
        const powerIn = Global.user.power;
        const powerLimit = Global.user.powerLimit;
        if (powerTime && nowTime > powerTime) {
            if (powerIn < powerLimit) {
                const addPower = Math.floor((nowTime - powerTime) / StaticData.powerStaticData.coolTime) + 1;
                let power = powerIn + addPower;
                power = power > powerLimit ? powerLimit : power;
                Global.user.power = power;
                if (power >= powerLimit) {
                    Global.user.powerTime = 0;
                } else {
                    Global.user.powerTime = nowTime + StaticData.powerStaticData.coolTime - (nowTime - powerTime) % StaticData.powerStaticData.coolTime;
                }
            } else {
                Global.user.powerTime = 0;
            }
        } else if (!powerTime && powerIn < powerLimit) {
            Global.user.powerTime = nowTime + StaticData.powerStaticData.coolTime;
        }
        this.powerLabel.string = `${Global.user.power}`;
        if (Global.user.power < powerLimit) {
            this.changeTime();
            this.timeLabel.node.active = true;
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.changeTime();
            }, 1000);
        } else {
            this.timeLabel.node.active = false;
        }
    }

    changeTime() {
        const nowTime = Global.user.serverTime;
        const time = Global.user.powerTime - nowTime;
        this.timeLabel.string = Util.timeTransitionString(time);
        if (time <= 0) {
            if (this.timer) {
                clearInterval(this.timer);
            }
            Global.user.powerTime = 0;
            Global.user.power += 1;
        }
    }

    btnAnimation() {
        Tween.stopAllByTarget(this.gameTitle);
        let embedTween = tween(this.gameTitle)
            .by(1, { position: new Vec3(0, -30, 0), })
            .by(2, { position: new Vec3(0, 60, 0), })
            .by(1, { position: new Vec3(0, -30, 0), })
        tween(this.gameTitle)
            .repeatForever(embedTween)
            .start()

        Tween.stopAllByTarget(this.moreGameBtn);
        const animation = tween(this.moreGameBtn)
            .to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.5, { scale: new Vec3(1, 1, 1) })
        tween(this.moreGameBtn)
            .repeatForever(animation)
            .start()
    }

    preloadCustomAd() {
        Global.platform.preloadCustomAd(grid_type['grid-1'], -370, 450);
        Global.platform.preloadCustomAd(grid_type['grid-1'], 245, 450);
    }
}


