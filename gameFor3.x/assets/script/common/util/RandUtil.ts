/** 随机工具 */
export default class RandUtilCls {

    /** 单例 */
    private constructor() { }
    /** 实例 */
    static readonly ins = new RandUtilCls();

    /** 返回 [最小值 , 最大值) 之间的随机值 */
    rand(min: number, max: number, floor = true) {
        let r = min + Math.random() * (max - min);
        return floor ? Math.floor(r) : r;
    }

    /** 返回 min_max[0]最小值 , min_max[1]最大值 之间的随机值*/
    rand2(min_max: number[], floor = true) {
        return this.rand(min_max[0], min_max[1], floor)
    }

    /** 根据几率输出 true false */
    chance(c: number) {
        return c > Math.random()
    }

    /** 从数组中随机挑选一个元素 */
    choice<T>(arr: Array<T> | Set<T>) {
        if (arr instanceof Set) {
            arr = Array.from(arr);
        }
        return arr[this.rand(0, arr.length, true)]
    }

    /** 随机颜色字符串 */
    randColor() {
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += this.rand(0, 16, true).toString(16);
        }
        return color
    }

    /** 随机颜色整型 */
    randRgb() {
        return this.rand(0, 16777217, true)
    }
}
/** 随机工具 */
export const RandUtil = RandUtilCls.ins;