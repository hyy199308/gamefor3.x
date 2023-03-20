import { ResMgr } from "../res/ResMgr";

export default class ShareMgr {
    private static _share: any = {
        base: [
            {
                shareid: 1,
                title: '这关太难了，快来帮帮我！',
                imageUrl: 'https://xxy.wdyou.top/client/master/share/shareImage1.png'
            },
        ]
    };

    private static _shareindex: number;

    public static randomShare() {
        this._shareindex = Math.floor(Math.random() * this._share.base.length);
    }

    public static get shareID() {
        if (!this._share) {
            return 0;
        }
        return this._share.base[this._shareindex].shareid;
    }

    public static get shareTitle() {
        if (!this._share) {
            return "分享加载失败";
        }
        return this._share.base[this._shareindex].title;
    }

    public static get shareImage() {
        if (!this._share) {
            return "";
        }
        return this._share.base[this._shareindex].imageUrl;
    }
}