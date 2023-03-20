/** 二维向量 */
export default class Vec2Cls {

    /** 单例 */
    private constructor() { }
    /** 实例 */
    static readonly ins = new Vec2Cls();

    /** 设置坐标x */
    setX<T extends IPos>(pos: T, x: number) { pos.x = x; return pos; }
    /** 设置坐标y */
    setY<T extends IPos>(pos: T, y: number) { pos.y = y; return pos; }
    /** 设置宽度 */
    setW<T extends ISize>(size: T, w: number) { size.w = w; return size; }
    /** 设置高度 */
    setH<T extends ISize>(size: T, h: number) { size.h = h; return size; }
    /** 设置半径 */
    setR<T extends ICircle>(cir: T, r: number) { cir.r = r; return cir; }
    /** 设置角度 */
    setAng<T extends IAng>(obj: T, ang: number) { obj.ang = ang; return obj; }
    /** 设置坐标 */
    setPos<T extends IPos>(pos: T, x: number, y: number) { pos.x = x; pos.y = y; return pos; }
    /** 设置坐标和角度 */
    setAngPos<T extends IAngPos>(pos: T, x: number, y: number, ang: number) { pos.x = x; pos.y = y; pos.ang = ang; return pos; }
    /** 设置宽高 */
    setSize<T extends ISize>(size: T, w: number, h: number) { size.w = w; size.h = h; return size; }
    /** 将圆形2赋值给圆形1 */
    setCir<T extends ICircle>(cir: T, x: number, y: number, r: number) { cir.x = x; cir.y = y; cir.r = r; return cir; }
    /** 将圆形2赋值给圆形1(带角度) */
    setAngCir<T extends IAngCircle>(cir: T, x: number, y: number, r: number, ang: number) { cir.x = x; cir.y = y; cir.r = r; cir.ang = ang; return cir; }
    /** 将矩形2赋值给矩形1 */
    setRect<T extends IRect>(rect: T, x: number, y: number, w: number, h: number) { rect.x = x; rect.y = y; rect.w = w; rect.h = h; return rect; }
    /** 将矩形2赋值给矩形1(带角度) */
    setAngRect<T extends IAngRect>(rect: T, x: number, y: number, w: number, h: number, ang: number) { rect.x = x; rect.y = y; rect.w = w; rect.h = h; rect.ang = ang; return rect; }

    /** 将坐标点2赋值给坐标点1 */
    posAs<T extends IPos>(p1: T, p2: IPos) { return this.setPos(p1, p2.x, p2.y); }
    /** 将坐标点2赋值给坐标点1(带角度) */
    angPosAs<T extends IAngPos>(p1: T, p2: IAngPos) { return this.setAngPos(p1, p2.x, p2.y, p2.ang); }
    /** 将宽高2赋值给宽高1 */
    sizeAs<T extends ISize>(s1: T, s2: ISize) { return this.setSize(s1, s2.w, s2.h); }
    /** 将圆形2赋值给圆形1 */
    cirAs<T extends ICircle>(c1: T, c2: ICircle) { return this.setCir(c1, c2.x, c2.y, c2.r); }
    /** 将圆形2赋值给圆形1(带角度) */
    angCirAs<T extends IAngCircle>(c1: T, c2: IAngCircle) { return this.setAngCir(c1, c2.x, c2.y, c2.r, c2.ang); }
    /** 将矩形2赋值给矩形1 */
    rectAs<T extends IRect>(r1: T, r2: IRect) { return this.setRect(r1, r2.x, r2.y, r2.w, r2.h); }
    /** 将矩形2赋值给矩形1(带角度) */
    angRectAs<T extends IAngRect>(r1: T, r2: IAngRect) { return this.setAngRect(r1, r2.x, r2.y, r2.w, r2.h, r2.ang); }

    /** 复制坐标点 */
    cpPos(pos: IPos): IPos { return { x: pos.x, y: pos.y }; }
    /** 复制带角度坐标点 */
    cpAngPos(pos: IAngPos): IAngPos { return { x: pos.x, y: pos.y, ang: pos.ang }; }
    /** 复制圆形 */
    cpCir(cir: ICircle): ICircle { return { x: cir.x, y: cir.y, r: cir.r }; }
    /** 复制带角度圆形 */
    cpAngCir(cir: IAngCircle): IAngCircle { return { x: cir.x, y: cir.y, r: cir.r, ang: cir.ang }; }
    /** 复制矩形 */
    cpRect(rect: IRect): IRect { return { x: rect.x, y: rect.y, w: rect.w, h: rect.h }; }
    /** 复制带角度矩形 */
    cpAngRect(rect: IAngRect): IAngRect { return { x: rect.x, y: rect.y, w: rect.w, h: rect.h, ang: rect.ang }; }

    /** 点1到点2的距离 */
    dis(p1: IPos, p2: IPos) { let x = p2.x - p1.x, y = p2.y - p1.y; return Math.sqrt(x * x + y * y); }
    /** 将角度转为360度制 */
    ang360(ang: number) { return ang < 0 ? 360 + ang % 360 : ang % 360; }
    /** 将对象的角度转为360度制 */
    setAng360<T extends IAng>(obj: T) { obj.ang = this.ang360(obj.ang); return obj; }
    /** 角度转弧度 */
    ang2rad(ang: number) { return ang * constNum.PI_RAD; }
    /** 弧度转角度 */
    rad2ang(rad: number) { return rad * constNum.PI_ANG; }
    /** 坐标点1朝向坐标点2的角度 */
    angTo(p1: IPos, p2: IPos) { return this.rad2ang(Math.atan2(p2.y - p1.y, p2.x - p1.x)); }
    /** 坐标点1朝向坐标点2的弧度 */
    radTo(p1: IPos, p2: IPos) { return Math.atan2(p2.y - p1.y, p2.x - p1.x); }

    /** 角1与角2的角度差 */
    angDiff(a1: number, a2: number) {
        let diff = this.ang360(a2 - a1);
        return diff > 180 ? diff - 360 : diff;
    }

    /** 点朝弧度方向移动后的坐标 out:赋值属性到对象上 */
    move<T extends IPos>(pos: IPos, rad: number, dis: number, out: T = {} as T) {
        out.x = pos.x + Math.cos(rad) * dis;
        out.y = pos.y + Math.sin(rad) * dis;
        return out;
    }

    /** 点1朝点2方向移动后的坐标 out:赋值属性到对象上 */
    moveTo<T extends IPos>(p1: IPos, p2: IPos, dis: number, out: T = {} as T) {
        return this.move(p1, this.radTo(p1, p2), dis, out);
    }

    /** 坐标点朝自身角度方向移动后的坐标 out:赋值属性到对象上 */
    moveForward<T extends IPos>(pos: IAngPos, dis: number, out: T = {} as T) {
        return this.move(pos, this.ang2rad(pos.ang), dis, out);
    }

    /** 点1在点2的象限 0:右上 */
    quadTo(p1: IPos, p2: IPos) { return p1.x > p2.x ? (p1.y > p2.y ? 0 : 3) : (p1.y > p2.y ? 1 : 2); }

    /** 点1转换到点2右上象限后的坐标 out:赋值属性到对象上 */
    toFirstQuad<T extends IPos>(p1: IPos, p2: IPos, out: T = {} as T): T {
        switch (this.quadTo(p1, p2)) {
            case 0: return this.posAs(out, p1);
            case 1:
                out.x = p2.x + Math.abs(p1.x - p2.x);
                out.y = p1.y;
                return out;
            case 2:
                out.x = p2.x + Math.abs(p1.x - p2.x);
                out.y = p2.y + Math.abs(p1.y - p2.y);
                return out;
            case 3:
                out.x = p1.x;
                out.y = p2.y + Math.abs(p1.y - p2.y);
                return out;
        }
    }

    /** 获取圆形在某象限的矩形顶点 0:右上 out:赋值属性到对象上*/
    getCirVertex<T extends IPos>(rect: ICircle, quad: 0 | 1 | 2 | 3, out: T = {} as T): T {
        switch (quad) {
            case 0:
                out.x = rect.x + rect.r;
                out.y = rect.y + rect.r;
                return out;
            case 1:
                out.x = rect.x - rect.r;
                out.y = rect.y + rect.r;
                return out;
            case 2:
                out.x = rect.x - rect.r;
                out.y = rect.y - rect.r;
                return out;
            case 3:
                out.x = rect.x + rect.r;
                out.y = rect.y - rect.r;
                return out;
        }
    }

    /** 获取矩形在某象限的顶点 0:右上 out:赋值属性到对象上*/
    getRectVertex<T extends IPos>(rect: IRect, quad: 0 | 1 | 2 | 3, out: T = {} as T): T {
        switch (quad) {
            case 0:
                out.x = rect.x + rect.w * 0.5;
                out.y = rect.y + rect.h * 0.5;
                return out;
            case 1:
                out.x = rect.x - rect.w * 0.5;
                out.y = rect.y + rect.h * 0.5;
                return out;
            case 2:
                out.x = rect.x - rect.w * 0.5;
                out.y = rect.y - rect.h * 0.5;
                return out;
            case 3:
                out.x = rect.x + rect.w * 0.5;
                out.y = rect.y - rect.h * 0.5;
                return out;
        }
    }

    /** 圆形1是否碰撞到圆形2 */
    isCirColCir(c1: ICircle, c2: ICircle) {
        return this.dis(c1, c2) < c1.r + c2.r;
    }

    /** 圆形是否碰撞到矩形 */
    isCirColRect(cir: ICircle, rect: IRect) {
        //先算出矩形左上xy
        // this.getRectVertex(rect, 2, tmpPos);
        //圆与矩形的最近点距离小于圆的半径则碰撞
        // tmpPos2.x = cir.x < tmpPos.x ? tmpPos.x : cir.x > (tmpPos.x += rect.w) ? tmpPos.x : cir.x;
        // tmpPos2.y = cir.y < tmpPos.y ? tmpPos.y : cir.y > (tmpPos.y += rect.h) ? tmpPos.y : cir.y;
        // return this.dis(tmpPos2, cir) < cir.r;
        const maxX = cir.x >= 0 ? cir.x + cir.r : cir.x - cir.r;
        const maxY = cir.y >= 0 ? cir.y + cir.r : cir.y - cir.r;
        const maxRectX = cir.x >= 0 ? rect.w / 2 : -rect.w / 2;
        const maxRectY = cir.y >= 0 ? rect.h / 2 : -rect.h / 2;
        if ((cir.x > 0 && maxX >= maxRectX) || (cir.x < 0 && maxX <= maxRectX)) {
            return true;
        }
        if ((cir.y > 0 && maxY >= maxRectY) || (cir.y < 0 && maxY <= maxRectY)) {
            return true;
        }
        return false;
    }

    /** 矩形1是否碰撞到矩形2 */
    isRectColRect(r1: IRect, r2: IRect) {
        //两个矩形的左上顶点进行对比
        this.getRectVertex(r1, 2, tmpPos);
        this.getRectVertex(r2, 2, tmpPos2);
        return tmpPos.x < tmpPos2.x + r2.w && tmpPos.y < tmpPos2.y + r2.h &&
            tmpPos.x + r1.w > tmpPos2.x && tmpPos.y + r1.h > tmpPos2.y;
    }

    /** 圆形1是否在圆形2内 */
    isCirInCir(c1: ICircle, c2: ICircle) {
        return this.dis(c1, c2) < c2.r - c1.r;
    }

    /** 圆形是否在矩形内 */
    isCirInRect(cir: ICircle, rect: IRect) {
        //圆在矩形第一象限的右上xy小于矩形第一象限顶点的xy则为被包含
        this.toFirstQuad(cir, rect, tmpPos);
        this.getRectVertex(rect, 0, tmpPos2);
        return tmpPos.x + cir.r < tmpPos2.x && tmpPos.y + cir.r < tmpPos2.y;
    }

    /** 矩形是否在圆形内 */
    isRectInCir(rect: IRect, cir: ICircle) {
        //未用到暂不实现...
        return false;
    }

    /** 矩形是否在矩形内 */
    isRectInRect(r1: IRect, r2: IRect) {
        //r1转换到r2右上象限
        let rect = Vec2.toFirstQuad(r1, r2, Vec2.cpRect(r1));
        //r1在r2右上象限的右上、左下象限顶点
        let r1v1 = Vec2.getRectVertex(rect, 0)
        let r1v3 = Vec2.getRectVertex(rect, 2)
        //r2的右上、左下象限顶点
        let r2v1 = Vec2.getRectVertex(r2, 0)
        let r2v3 = Vec2.getRectVertex(r2, 2)
        return r1v1.x < r2v1.x && r1v1.y < r2v1.y &&
            r1v3.x > r2v3.x && r1v3.y > r2v3.y
    }
}
/** 角度 */
export interface IAng {
    /** 角度 */
    ang: number
}
/** 二维坐标点 */
export interface IPos {
    /** 坐标x */
    x: number
    /** 坐标y */
    y: number
}
/** 带角度二维坐标点 */
export interface IAngPos extends IPos, IAng { }
/** 宽高 */
export interface ISize {
    /** 宽度 */
    w: number
    /** 高度 */
    h: number
}
/** 圆形 */
export interface ICircle extends IPos {
    /** 半径 */
    r: number
}
/** 有角度圆形 */
export interface IAngCircle extends ICircle, IAng { }
/** 矩形 */
export interface IRect extends IPos, ISize { }
/** 有角度矩形 */
export interface IAngRect extends IRect, IAng { }
/** 二维向量 */
export const Vec2 = Vec2Cls.ins;
/** 原点坐标 */
export const ZERO_POS: Readonly<IPos> = { x: 0, y: 0 };

/** 常量值 */
const enum constNum {
    PI = 3.141592653589793,
    PI2 = PI * 2,
    PI_2 = PI / 2,
    PI_RAD = PI / 180,
    PI_ANG = 180 / PI,
}
const tmpPos: IPos = { x: 0, y: 0 };
const tmpPos2: IPos = { x: 0, y: 0 };