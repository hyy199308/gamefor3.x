import { Component, find, Label, tween, Tween, v2, Vec3, _decorator } from "cc";

const { ccclass, property } = _decorator;

/** 滚动消息提示组件  */
@ccclass('Notify')
export class Notify extends Component {
    private lblTip: Label | null = null;
    onLoad() {
        this.lblTip = find('lblTip', this.node).getComponent(Label);
        this.lblTip.node.position = new Vec3(0, 0, 0);
        Tween.stopAllByTarget(this.lblTip.node);
        tween(this.lblTip.node)
            .to(1, { position: new Vec3(0, 200, 0) })
            .call(() => { this.node.destroy(); })
            .start()
    }

    /**
     * 显示提示
     * @param msg       文本
     * @param useI18n   设置为 true 时，使用多语言功能 msg 参数为多语言 key
     */
    toast(msg: string, useI18n?: boolean) {
        this.lblTip.string = msg;
    }
}