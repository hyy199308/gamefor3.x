/**
* constructor
* @param {array} map 传入地图的二维数组 记录地图块的类型
*/
export class AStar {

    map: any[] = [];
    ep: any;
    closeList: any;
    openList: any;
    message: any;
    sp: any;
    count: number = 0;

    constructor(map) {//地图  障碍物位置
        this.map = this.deepCopy(map);
        this.openList = [];
        this.closeList = [];
        this.count = 0;//记录递归次数
        this.message = {};
        this.message.UNABLE_TO_REACH = "无法到达指定位置";
    }

    /**
     * 核心算法
     * @param {array} p1 起点
     * @param {array} p2 终点
     *  td = spd + ped;
     * spd 起点s到p的距离
     * ped p到终点e的距离
     */
    getWayByTwoPoint(p1, p2) {
        //console.log("起点", p1, "终点", p2);
        this.openList = [];
        this.closeList = [];
        this.count = 0;//记录递归次数
        this.sp = p1;
        this.ep = p2;
        //获得起点的周边位置 并将可行的放入开放列表
        let openPos = this.getOpenPos(p1);
        let obj = {};
        obj['p'] = p1;
        obj['td'] = 0;
        let data = this.getDisToTargetPoint(obj, p2, p1);
        obj['td'] = data.td;
        obj['spd'] = data.spd;
        obj['epd'] = data.spd;
        obj['parent'] = null;

        if (openPos.length) this.addToOpenList(openPos, p2, obj);
        this.joinCLoseList(obj);

        // this.isOver(obj);  //处理起点终点重合
        let result = this.findTheWay(p1, p2);
        //console.log("result", result);
        if (result == this.message.UNABLE_TO_REACH) {
            console.log(result);
            return [];
        } else {
            let ways = [];
            while (result.parent) {
                ways.unshift(result.p);
                result = result.parent;
            }
            return ways;
        }
    }

    findTheWay(p1, p2) {//拿出的点符合要求时 放入closeList
        // 从开放列表找到最近的点
        if (this.openList.length == 0) {
            console.log("列表长度为0   count", this.count);
            return this.message.UNABLE_TO_REACH;
        }
        let obj = this.openList.pop();
        // console.log("obj", obj);
        let p = obj.p;
        let openPos = this.getOpenPos(p);
        // console.log("openPos",openPos);
        if (openPos.length) this.addToOpenList(openPos, p2, obj);
        this.joinCLoseList(obj);

        let flag = this.isOver(obj);
        if (flag) return flag;

        return this.findTheWay(p1, p2);
    }

    addToOpenList(arr, ep, par) {
        for (let i = 0; i < arr.length; i++) {
            let p = arr[i];
            let data = this.getDisToTargetPoint(par, ep, p);
            let { spd, ped, td } = data;
            //console.log("p",p,"td",td);
            this.joinOpenListByTd(p, td, spd, ped, par);
        }
    }

    joinOpenListByTd(p, td, spd, ped, par = null) {
        let obj = {};
        obj['p'] = p;
        obj['td'] = td;
        obj['spd'] = spd;
        obj['ped'] = ped;
        obj['parent'] = par;
        if (this.openList.length == 0) {
            this.openList.push(obj);
        } else {
            for (let i = this.openList.length - 1; i >= 0; i--) {
                let element = this.openList[i];
                if (element.td >= td) {
                    this.openList.splice(i + 1, 0, obj);
                    return;
                }
                if (i == 0 && element.td < td) this.openList.unshift(obj);
            }
        }
    }

    //加入关闭列表 并判断是否找到终点
    joinCLoseList(obj) {
        this.closeList.push(obj);
    }

    //获取通过某点到终点的理论距离
    getDisToTargetPoint(obj, ep, p) {
        let spd = obj.td + 1;
        let ped = this.getTwoPointDis(p, ep);
        let td = spd + ped;
        return { spd, ped, td };
    }

    //获取任意两点的理论距离
    getTwoPointDis(p1, p2) {
        return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
    }

    //获取某点可以周边可以加入openList的点
    getOpenPos(p) {
        let openPos = [];
        const indexRow = p[0];          // 游戏界面从1开始，A星从0开始做下转化
        const indexColumn = p[1];
        if (indexRow > 0) {
            //console.log("left");
            let point = [indexRow - 1, indexColumn];
            let valid = this.isValidPoint(point);//判断point是否是障碍物 或 已经存在于openList 或 closeList
            if (valid) openPos.push(point);//添加左
        }
        if (indexRow < this.map[0].length - 1) {
            //console.log("right");
            let point = [indexRow + 1, indexColumn]
            let valid = this.isValidPoint(point);//判断point是否是障碍物 或 已经存在于openList 或 closeList
            if (valid) openPos.push(point);//添加右
        }
        if (indexColumn < this.map.length - 1) {
            //console.log("down");
            let point = [indexRow, indexColumn + 1]
            let valid = this.isValidPoint(point);//判断point是否是障碍物 或 已经存在于openList 或 closeList
            if (valid) openPos.push(point);//添加下

        }
        if (indexColumn > 0) {
            //console.log("up");
            let point = [indexRow, indexColumn - 1];
            let valid = this.isValidPoint(point);//判断point是否是障碍物 或 已经存在于openList 或 closeList
            if (valid) openPos.push(point);//添加上
        }
        // //console.log("getOpenPos",openPos);
        return openPos;
    }

    possList = [0, 1, 2, 5, 6, 7, 10, 13];
    isValidPoint(p) {
        //判断是否p是否合法  1为障碍物 可配置障碍物数组
        if (this.possList.indexOf(this.map[p[1]][p[0]]) == -1) {
            // console.log("障碍物");
            return false;
        }
        // 判断是否已经在openList中
        for (let i = 0; i < this.openList.length; i++) {
            let element = this.openList[i].p;
            if (element[0] == p[0] && element[1] == p[1]) {
                // console.log("已存在openList中");
                return false;
            }
        }
        // 判断是否已经在closeList中
        for (let i = 0; i < this.closeList.length; i++) {
            let element = this.closeList[i].p;
            if (element[0] == p[0] && element[1] == p[1]) {
                // console.log("已存在closeList中");
                return false;
            }
        }
        return true;
    }

    isOver(obj) {
        this.count++;
        if (obj.p[0] == this.ep[0] && obj.p[1] == this.ep[1]) {
            console.log("count", this.count);
            return obj;
        } else return false;
    }

    deepCopy(obj: any[]): any[] {
        var result = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    result[key] = this.deepCopy(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
}