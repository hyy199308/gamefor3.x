import { Vec3 } from "cc";
import { StaticData } from "../../../resources/data/StaticData";

/** 工具 */
export default class UtilCls {

    /** 单例 */
    private constructor() { }
    /** 实例 */
    static readonly ins = new UtilCls();

    /** 从数组中删除元素 */
    arrRemoveItem<T>(arr: Array<T>, item: any) {
        return arr.splice(arr.indexOf(item), 1);
    }

    /** 返回 [最小值 , 最大值] 之间的值 */
    range(value: number, min: number, max: number) {
        return Math.max(min, Math.min(value, max))
    }

    /** 补零 */
    zeroFill(num: number | string, length: number) {
        let str = num.toString();
        for (let i = length - str.length; i > 0; i--) {
            str = "0" + str;
        }
        return str;
    }

    /** 保留几位小数(四舍五入) 默认:一位小数 */
    fixed(num: number, count: number = 1) {
        return parseFloat(num.toFixed(count))
    }

    /** 数组连接Set */
    arrConcatSet<T>(arr: Array<T>, set: Set<T>) {
        return arr.concat(Array.from(set))
    }

    /** 颜色字符串转为rgb整型 */
    color2rgb(color: string) {
        color = color.replace("#", '')
        let r: number, g: number, b: number
        if (color.length == 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
        }
        r = parseInt(color.slice(0, 2), 16)
        g = parseInt(color.slice(2, 4), 16)
        b = parseInt(color.slice(4, 6), 16)
        return r * 65536 + g * 256 + b
    }

    /** rgb整型转为颜色字符串 */
    rgb2color(rgb: number) {
        let r = Math.floor(rgb / 65536)
        rgb -= r * 65536
        let g = Math.floor(rgb / 256)
        let b = rgb - g * 256
        return `#${this.zeroFill(r.toString(16), 2)}${this.zeroFill(g.toString(16), 2)}${this.zeroFill(b.toString(16), 2)}`
    }

    /**
     * 比较版本号
     *
     * @param v1 第一个版本号
     * @param v2 第二个版本号
     *
     * @return 如果版本号相等，返回 0,
     *         如果第一个版本号低于第二个，返回 -1，否则返回 1.
     */
    compareVersion(v1: any, v2: any) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }

    /** 数字转中文 */
    numChange(num: number) {
        let str = '';
        switch (num) {
            case 1:
                str = '一'
                break;
            case 2:
                str = '二'
                break;
            case 3:
                str = '三'
                break;
            case 4:
                str = '四'
                break;
            case 5:
                str = '五'
                break;
            case 6:
                str = '六'
                break;
            case 7:
                str = '七'
                break;
            case 8:
                str = '八'
                break;
            case 9:
                str = '九'
                break;
            case 10:
                str = '十'
                break;
            default:
                str = num.toString();
                break;
        }
        return str;
    }

    /** 对象转数组 */
    objectToArray(srcObj: any) {
        const resultArr = [];
        // to array
        for (const key in srcObj) {
            if (!srcObj.hasOwnProperty(key)) {
                continue;
            }

            resultArr.push(srcObj[key]);
        }

        return resultArr;
    }

    getPos(row: number, column: number, width: number = 60, maxWidth: number = 2400): Vec3 {
        const x = row * width + 0.5 * width - maxWidth / 2;
        const y = maxWidth / 2 - (column * width + 0.5 * width);
        const value = new Vec3(x, y, 0);
        return value;
    }

    pointDistance(pos1: Vec3, pos2: Vec3) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }

    /**
 * 秒转分钟小时
 * @param time 
 */
    timeTransitionString(time: number) {
        let sec = time % 60; //6 秒
        let min = Math.floor(time / 60) % 60; // 分
        let hour = Math.floor(time / 60 / 60) % 24; //时
        let day = Math.floor(time / 60 / 60 / 24); //时
        let str = '';
        if (day) {
            str += day + '天';
        }
        if (hour) {
            if (hour < 10) {
                str += '0' + hour + ':';
            } else {
                str += hour + ':';
            }
        }
        if (min < 10) {
            str += '0' + min + ':';
        } else {
            str += min + ':';
        }
        if (sec < 10) {
            str += '0' + Math.floor(sec);
        } else {
            str += Math.floor(sec);
        }
        return str;
    }
}
/** 工具 */
export const Util = UtilCls.ins