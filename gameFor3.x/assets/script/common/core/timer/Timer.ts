/** 定时器 */
export default class Timer {

    /** 当前定时器时间 */
    private _time: number = 0;
    private _timers: {
        [tickName: string]: {
            time: number,
            end: number
        }
    } = {}

    /** 当前定时器时间 */
    get time() { return this._time };

    /** 增加定时器时间 */
    addTime(dt: number) {
        this._time += dt;
    }

    /** 是否存在key对应的定时器 */
    has(key: string) {
        return this._timers[key] ? true : false;
    }

    /** 获取对应key的定时器 */
    get(key: string) {
        return this._timers[key];
    }

    /** 设置对应key的定时器 */
    set(key: string, time: number, delay: number = time) {
        this._timers[key] = { time, end: this._time + delay };
    }

    /** 清除对应key的定时器 */
    clear(key: string) {
        delete this._timers[key];
    }

    /** 检测到达end时间时执行回调(返回超出的时间) */
    check(key: string, cb: (time: number, rest: number) => any, addDelay?: (rest: number) => number) {
        let timer = this._timers[key];
        let rest = this._time - timer.end;
        if (rest >= 0) {
            cb(this._time, rest);
            timer.end = this._time + timer.time;
            addDelay && (timer.end += addDelay(rest));
        }
    }
}