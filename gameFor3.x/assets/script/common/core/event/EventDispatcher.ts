/** 事件派发器 */
export default class EventDispatcher<EventDef> {

    private _curId: number = 0;
    private _listenerMap: Map<keyof EventDef, Set<IEventListener<EventDef>>> = new Map();               /** 监听映射 EventType->Set<IEventListener> */

    /** 发送事件 */
    send<Event extends keyof EventDef>(e: Event, data?: EventDef[Event]) {
        let set = this._listenerMap.get(e);
        if (set) {
            set.forEach(cb => {
                cb.cb.call(cb.caller, data);
                //单次回调 执行完取消监听
                cb.once && cb.off();
            })
        }
    }

    /** 监听事件 返回监听对象 */
    on<Event extends keyof EventDef>(e: Event, cb: EventCb<EventDef[Event]>, caller?: any) {
        let set = this._listenerMap.get(e);
        !set && this._listenerMap.set(e, set = new Set());
        let listener: IEventListener<EventDef> = {
            id: this._curId++,
            event: e,
            cb,
            caller,
            off: () => { this.off(listener) },
        };
        set.add(listener);
        return listener;
    }

    /** 监听事件 只触发一次 返回监听对象 */
    once<Event extends keyof EventDef>(e: Event, cb: EventCb<EventDef[Event]>, caller?: any) {
        let listener = this.on(e, cb, caller);
        listener.once = true;
        return listener;
    }

    /** 取消监听 */
    off(listener: IEventListener<EventDef>) {
        let set = this._listenerMap.get(listener.event);
        if (set) {
            set.delete(listener);
            !set.size && this._listenerMap.delete(listener.event);
        }
    }
}

/** 事件回调方法 */
export type EventCb<EventData> = (data?: EventData) => any;

/** 事件监听 */
export interface IEventListener<EventDef> {
    readonly id: number                             /** 回调id */
    readonly event: keyof EventDef                  /** 监听的事件 */
    cb: EventCb<EventDef[keyof EventDef]>           /** 回调方法 */
    caller?: boolean                                /** 调用者 */
    off: () => void                                 /** 取消监听 */
    once?: boolean                                  /** 是否执行一次就取消监听 */
}