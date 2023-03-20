import { director, Node } from "cc";
import Global from "../../game/data/Global";
import { AudioMgr } from "../audio/AudioMgr";
import { StorageMgr } from "../storage/StorageMgr";

export const enum grid_type {
    'grid-1' = 'grid-1',                           
    'grid-1-2' = 'grid-1-2',                          
    'grid-1-3' = 'grid-1-3', 
    'grid-1-3-s' = 'grid-1-3-s', 
    'grid-1-4' = 'grid-1-4',                           
    'grid-1-4-s' = 'grid-1-4-s',                           
    'grid-1-s' = 'grid-1-s', 
    'grid-2-1' = 'grid-2-1', 
    'grid-2-5' = 'grid-2-5',                           
    'grid-2-s' = 'grid-2-s',                           
    'grid-3-1' = 'grid-3-1', 
    'grid-3-1-s' = 'grid-3-1-s', 
    'grid-4-1' = 'grid-4-1',                           
    'grid-4-1-s' = 'grid-4-1-s',                           
    'grid-5-1' = 'grid-5-1', 
    'grid-5-1-s' = 'grid-5-1-s', 
    'grid-5-5' = 'grid-5-5', 
}

export default class PlatformBase {
    protected _enableMusic: boolean = true;
    protected _enabledEffect: boolean = true;
    protected _enabledShock: boolean = true;
    protected persistRootNode: Node = null;
    public adTime: number = 0;
    public audio: AudioMgr;                                                /** 游戏音乐管理 */
    public userCode: string;
    bannerIdList = [];
    interstitialIdList = [];

    constructor() {
        this.initNode();
        let audioShockData = StorageMgr.get('audioShockData');
        if (!audioShockData) {
            audioShockData = '1_1_1';
        }
        const dataList = audioShockData.split('_');
        this.enableMusic = dataList[0] == '1';
        this.enabledEffect = dataList[1] == '1';
        this.enabledShock = dataList[2] == '1';
    }

    initNode() {
        // 创建持久根节点
        this.persistRootNode = new Node("PersistRootNode");
        director.addPersistRootNode(this.persistRootNode);

        // 创建音频模块
        this.audio = this.persistRootNode.addComponent(AudioMgr);
        this.audio.load();
    }

    protected saveSetting() {
        const audioShockData = `${this.enableMusic ? 1 : 0}_${this._enabledEffect ? 1 : 0}_${this._enabledShock ? 1 : 0}`;
        StorageMgr.set('audioShockData', audioShockData);
    }

    public get enableMusic(): boolean {
        return this._enableMusic;
    }

    public set enableMusic(value: boolean) {
        this._enableMusic = value;
        this.saveSetting();
        this.audio.switchMusic = value;
    }

    public set enabledEffect(value: boolean) {
        this._enabledEffect = value;
        this.saveSetting();
        this.audio.switchEffect = value;
    }

    public get enabledEffect(): boolean {
        return this._enabledEffect;
    }

    public set enabledShock(value: boolean) {
        this._enabledShock = value;
        this.saveSetting();
    }

    public get enabledShock(): boolean {
        return this._enabledShock;
    }

    /**
     * 播放背景音乐
     */
    public playMusic(url: string) {
        this.audio.playMusic(url);
    }

    /**
     * 播放音效
     */
    public playEffect(url: string) {
        this.audio.playEffect(url);
    }

    public pauseAll() {
        console.log("pauseAll!");
        this.audio.pauseAll();
    }

    public resumeAll() {
        console.log("resumeAll!");
        this.audio.resumeAll();
    }

    /**
     * 登录
     */
    public login(callback: (data: any) => void): void {

    }
    /**
     * 分享
     * @param callback 分享回调 返回是否成功
     */
    public share(callback: (success: boolean) => void): void {

    }
    /**
     * 看广告
     * @param callback 回调 返回是否成功
     */
    public watchAd(callback: (success: boolean, shareState: boolean) => void, adID: string = "", eventId: number = 999): void {
    }

    public showInterstitialAd(callback?: Function) {

    }
    /**
     * 广告优先于分享
     * @param callback 回调 返回是否成功
     */
    public adShare(callback: (success: boolean) => void): void {

    }

    public showBannerAd(id?: string) {

    }

    public hideBanner() {

    }

    public StartRecorder() {

    }

    public stopRecorder() {

    }

    public shareViode(callback: (success: any) => void): void {

    }

    public name(): string {
        return "PlatformBase"
    }

    public playShock() {

    }

    public event(id: number) {

    }

    public eventValue(id: number, value: number) {

    }

    public pageStart(pageName: string) {

    }

    public pageEnd(pageName: string) {

    }

    public sdkEvent(name: string, params: any = {}) {

    }

    //浮标广告
    public getRecommendInfo(callBack?: Function) {
    }

    //猜你喜欢
    public getSuggestList(callBack?: Function, bool: boolean = true, num: number = 0) {
    }

    public getExcitationList(callBack?: Function) {
    }

    public click(ad) {
        return ad;
    }

    public subscribeAppMsg(callback: (success: boolean) => void) {

    }

    public preloadCustomAd(type: grid_type,  x: number = 0, y: number = 0) {

    }

    public showCustomAd(type: grid_type,  x: number = 0, y: number = 0) {
    }

    public hideCustomAd(type: grid_type,  x: number = 0, y: number = 0) {
    }

    public showGridAd(list: any, cb = null) {
    }

    public hideGridAd() {
    }

    public showFavoriteGuide(str: string) {
    }

    public canMistake() {
        return false;
    }

    topGameRankList = {};
    public getRankInfo(cb?: Function) {
        const url = `https://raisingsun.xyz/v1-api/pub/game-rank/top-rank/100?code=${this.userCode}&openId=${this.userCode}`;
        Global.http.get(url, (data: any) => {
            if (data.data) {
                this.topGameRankList = data.data;
                if (cb) {
                    cb(data.data);
                }
            }
        }, null, [{ key: 'appId', value: Global.appId }])
    }

    public submitScoreForRank(score: number) {
        
    }

    shareIamge: string = null;
    getShareImage() {
        
    }

    public shock(type = 0) {
        
    }
}