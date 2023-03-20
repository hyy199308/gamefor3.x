import { IPos, ICircle, IRect, IAngCircle, IAngRect, Vec2, IAngPos, ISize } from "./Vec2";
const [v2] = [Vec2];

/** 二维向量操作者 */
export default class Vec2Operator {

    /** 操作对象 */
    obj: any
    /** 0:IPos 1:ICircle 2:IRect */
    type = 0;

    /** 设置操作对象 */
    setObj(obj: any) { this.obj = obj; this.type = 0; return this; }
    /** 设置圆形操作对象(会替换相应方法) */
    setCirObj(cir: ICircle) {
        this.obj = cir;
        if (this.type != 1) {
            this.type = 1;
            this.getVertex = this.getCirVertex;
            this.isColCir = this.isCirColCir;
            this.isColRect = this.isCirColRect;
            this.isInCir = this.isCirInCir;
            this.isInRect = this.isCirInRect;
        }
        return this;
    }
    /** 设置矩形操作对象(会替换相应方法) */
    setRectObj(rect: IRect) {
        this.obj = rect;
        if (this.type != 2) {
            this.type = 2;
            this.getVertex = this.getRectVertex;
            this.isColCir = this.isRectColCir;
            this.isColRect = this.isRectColRect;
            this.isInCir = this.isRectInCir;
            this.isInRect = this.isRectInRect;
        }
        return this;
    }

    /** 复制当前操作对象 */
    cp() { switch (this.type) { default: return this.cpPos(this.obj); case 1: return this.cpCir(this.obj); case 2: return this.cpRect(this.obj); }; }
    /** 复制当前操作对象(带角度) */
    cpAng() { switch (this.type) { default: return this.cpAngPos(this.obj); case 1: return this.cpAngCir(this.obj); case 2: return this.cpAngRect(this.obj); }; }
    /** 复制坐标为操作对象 */
    cpPos(pos: IPos = this.obj) { this.obj = { x: pos.x, y: pos.y }; return this; }
    /** 复制坐标为操作对象 */
    cpAngPos(pos: IAngPos = this.obj) { this.obj = { x: pos.x, y: pos.y, ang: pos.ang }; return this; }
    /** 复制圆形为操作对象 */
    cpCir(cir: ICircle = this.obj) { this.setCirObj({ x: cir.x, y: cir.y, r: cir.r }); return this; }
    /** 复制矩形为操作对象 */
    cpRect(rect: IRect = this.obj) { this.setRectObj({ x: rect.x, y: rect.y, w: rect.w, h: rect.h }); return this; }
    /** 复制带角度圆形为操作对象 */
    cpAngCir(cir: IAngCircle = this.obj) { this.setCirObj({ x: cir.x, y: cir.y, r: cir.r, ang: cir.ang } as ICircle); return this; }
    /** 复制带角度矩形为操作对象 */
    cpAngRect(rect: IAngRect = this.obj) { this.setRectObj({ x: rect.x, y: rect.y, w: rect.w, h: rect.h, ang: rect.ang } as IRect); return this; }

    /** 设置坐标x */
    setX(x: number) { this.obj.x = x; return this; }
    /** 设置坐标y */
    setY(y: number) { this.obj.y = y; return this; }
    /** 设置宽度 */
    setW(w: number) { this.obj.w = w; return this; }
    /** 设置高度 */
    setH(h: number) { this.obj.h = h; return this; }
    /** 设置半径 */
    setR(r: number) { this.obj.r = r; return this; }
    /** 设置角度 */
    setAng(ang: number) { this.obj.ang = ang; return this; }
    /** 设置坐标 */
    setPos(x: number, y: number) { v2.setPos(this.obj, x, y); return this; }
    /** 设置坐标和角度 */
    setAngPos(x: number, y: number, ang: number) { v2.setAngPos(this.obj, x, y, ang); return this; }
    /** 设置宽高 */
    setSize(w: number, h: number) { v2.setSize(this.obj, w, h); return this; }
    /** 将圆形2赋值给圆形1 */
    setCir(x: number, y: number, r: number) { v2.setCir(this.obj, x, y, r); return this; }
    /** 将圆形2赋值给圆形1(带角度) */
    setAngCir(x: number, y: number, r: number, ang: number) { v2.setAngCir(this.obj, x, y, r, ang); return this; }
    /** 将矩形2赋值给矩形1 */
    setRect(x: number, y: number, w: number, h: number) { v2.setRect(this.obj, x, y, w, h); return this; }
    /** 将矩形2赋值给矩形1(带角度) */
    setAngRect(x: number, y: number, w: number, h: number, ang: number) { v2.setAngRect(this.obj, x, y, w, h, ang); return this; }

    /** 将坐标赋值给操作对象 */
    posAs(pos: IPos) { v2.posAs(this.obj, pos); return this; }
    /** 将带角度坐标赋值给操作对象 */
    angPosAs(pos: IAngPos) { v2.angPosAs(this.obj, pos); return this; }
    /** 将宽高赋值给操作对象 */
    sizeAs(size: ISize) { v2.sizeAs(this.obj, size); return this; }
    /** 将圆形赋值给操作对象 */
    cirAs(cir: ICircle) { v2.cirAs(this.obj, cir); return this; }
    /** 将矩形赋值给操作对象 */
    rectAs(rect: IRect) { v2.rectAs(this.obj, rect); return this; }
    /** 将圆形赋值给操作对象 */
    angCirAs(cir: IAngCircle) { v2.angCirAs(this.obj, cir); return this; }
    /** 将矩形赋值给操作对象 */
    angRectAs(rect: IAngRect) { v2.angRectAs(this.obj, rect); return this; }

    /** 偏移坐标x */
    oX(x: number) { this.obj.x += x; return this; }
    /** 偏移坐标y */
    oY(y: number) { this.obj.y += y; return this; }
    /** 偏移宽度 */
    oW(w: number) { this.obj.w += w; return this; }
    /** 偏移高度 */
    oH(h: number) { this.obj.h += h; return this; }
    /** 偏移半径 */
    oR(r: number) { this.obj.r += r; return this; }
    /** 偏移角度 */
    oAng(ang: number) { this.obj.ang += ang; return this; }
    /** 偏移坐标 */
    oPos(x: number, y: number) { this.obj.x += x; this.obj.y += y; return this; }
    /** 偏移宽高 */
    oSize(w: number, h: number) { this.obj.w += w; this.obj.h += h; return this; }

    /** 朝弧度方向移动 */
    move(rad: number, dis: number) { v2.move(this.obj, rad, dis, this.obj); return this; }
    /** 朝坐标点方向移动 */
    moveTo(pos: IPos, dis: number) { v2.moveTo(this.obj, pos, dis, this.obj); return this; }
    /** 朝自身角度方向移动 */
    moveForward(dis: number) { v2.moveForward(this.obj, dis, this.obj); return this; }

    /** 与坐标点的距离 */
    dis(pos: IPos) { return v2.dis(this.obj, pos); }
    /** 朝向坐标点的角度 */
    angTo(pos: IPos) { return v2.angTo(this.obj, pos); }
    /** 朝向坐标点的弧度 */
    radTo(pos: IPos) { return v2.radTo(this.obj, pos); }

    /** 获取在某象限的矩形顶点 0:右上 out:赋值属性到对象上 */
    getVertex = this.getCirVertex;
    /** 获取圆形在某象限的矩形顶点 0:右上 out:赋值属性到对象上 */
    getCirVertex<T extends IPos>(quad: 0 | 1 | 2 | 3, out: T) { return v2.getCirVertex(this.obj, quad, out); }
    /** 获取矩形在某象限的顶点 0:右上 out:赋值属性到对象上 */
    getRectVertex<T extends IPos>(quad: 0 | 1 | 2 | 3, out: T) { return v2.getRectVertex(this.obj, quad, out); }

    /** 是否碰撞到圆形(使用前先setCir或setRect) */
    isColCir = this.isCirColCir;
    /** 是否碰撞到矩形(使用前先setCir或setRect) */
    isColRect = this.isCirColRect;
    /** 是否在圆形内(使用前先setCir或setRect) */
    isInCir = this.isRectColCir;
    /** 是否在矩形内(使用前先setCir或setRect) */
    isInRect = this.isRectColRect;

    /** 圆形是否碰撞到圆形 */
    isCirColCir(cir: ICircle) { return v2.isCirColCir(this.obj, cir); }
    /** 圆形是否碰撞到矩形 */
    isCirColRect(rect: IRect) { return v2.isCirColRect(this.obj, rect); }
    /** 矩形是否碰撞到圆形 */
    isRectColCir(cir: ICircle) { return v2.isCirColRect(cir, this.obj); }
    /** 矩形是否碰撞到矩形 */
    isRectColRect(rect: IRect) { return v2.isRectColRect(this.obj, rect); }
    /** 圆形是否在圆形内 */
    isCirInCir(cir: ICircle) { return v2.isCirInCir(this.obj, cir); }
    /** 圆形是否在矩形内 */
    isCirInRect(rect: IRect) { return v2.isCirInRect(this.obj, rect); }
    /** 矩形是否在圆形内 */
    isRectInCir(cir: ICircle) { return v2.isRectInCir(this.obj, cir); }
    /** 矩形是否在矩形内 */
    isRectInRect(rect: IRect) { return v2.isRectInRect(this.obj, rect); }

}