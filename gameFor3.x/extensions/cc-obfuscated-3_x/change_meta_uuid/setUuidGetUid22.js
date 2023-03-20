/*
 * @FilePath: setUuidGetUid22.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-31 16:53:46
 * @LastEditors: fileheader
 * @LastEditTime: 2022-12-04 15:23:13
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
// const md5 = require('md5');
// // 读取混沌钟
// const Ast_Codeing_Do = require("../ast_codeing_do");

// fa66c7f9-f65b-76b0-b7b6-f9c12eb9acbe 
let UUID_BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
let SetNums = 128;
let UUID_BASE64_VALUES = new Array(SetNums);
for (let i = 0; i < SetNums; ++i) UUID_BASE64_VALUES[i] = 64;
for (let i = 0; i < 64; ++i) UUID_BASE64_VALUES[UUID_BASE64_KEYS.charCodeAt(i)] = i;
let HexChars = '0123456789abcdef'.split('');
let _t = ['', '', '', ''];
let UuidTemplate = _t.concat(_t, '-', _t, '-', _t, '-', _t, '-', _t, _t, _t);
let Indices = UuidTemplate.map(function (x, i) {
    return x === '-' ? NaN : i;
}).filter(isFinite);
let Uuid_Base64Values = UUID_BASE64_VALUES;
let UuidT = _t.concat(_t, _t, _t, _t, '', '');
let tmp = ['0', '0', '0', '0', '0', '0', '0', '0'];

function makeRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
};

//随机生成9位的字符串
function makeRandomStr(length, justNum = false) {
    let s = "";
    if (justNum) {
        let maxIdx = HexChars.length;
        if (justNum) {
            maxIdx = 10;
        };
        for (let i = 0; i < length; i++) {
            s += HexChars[makeRandomInt(maxIdx, 0)];
        };
    } else {
        // // 加入奇门遁甲混沌钟计时器
        // var encodeKey = "CocosCreator" + "_混沌钟_UUID_";
        // var zhexue_num = new Date().getTime() + Math.random() * 142857 + 1024 + Math.random() * 129600 + 540 * 2;
        // var getThis = Ast_Codeing_Do;
        // // 乱序
        // var mixSortOrderStr = getThis.ast_shuffleCardArr(encodeKey + "" + zhexue_num);
        // s = getThis.ast_getMd5_length(md5(mixSortOrderStr), length);
    };
    return s;
};

/** faZsf59ltGsLe2+cEuuay+ -> fa66c7f9-f65b-76b0-b7b6-f9c12eb9acbe */
function decodeUUid(base64) {
    if (base64.length !== 22) {
        return base64;
    }
    UuidTemplate[0] = base64[0];
    UuidTemplate[1] = base64[1];
    for (let i = 2, j = 2; i < 22; i += 2) {
        let lhs = Uuid_Base64Values[base64.charCodeAt(i)];
        let rhs = Uuid_Base64Values[base64.charCodeAt(i + 1)];
        UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
        UuidTemplate[Indices[j++]] = HexChars[((lhs & 3) << 2) | rhs >> 4];
        UuidTemplate[Indices[j++]] = HexChars[rhs & 0xF];
    }
    return UuidTemplate.join('');
};

/**36位uuid中的三位解出加密后的两位 */
function encode3to2(s3) {
    let c3 = HexChars.indexOf(s3[0]).toString(2);
    let c4 = HexChars.indexOf(s3[1]).toString(2);
    let c5 = HexChars.indexOf(s3[2]).toString(2);
    let lhs, rhs, c1, c2, s2;
    c3 = Object.assign([], tmp).splice(0, 8 - c3.length).concat(c3.split(''));
    c4 = Object.assign([], tmp).splice(0, 8 - c4.length).concat(c4.split(''));
    c5 = Object.assign([], tmp).splice(0, 8 - c5.length).concat(c5.split(''));
    lhs = Object.assign([], tmp, c3.slice(2));
    rhs = Object.assign([], c5, c4.slice(0, 4));
    lhs[6] = "" + (parseInt(c4[4]) & 1);
    lhs[7] = "" + (parseInt(c4[5]) & 1);
    rhs[2] = c4[6];
    rhs[3] = c4[7];

    lhs = parseInt(lhs.join(''), 2);
    rhs = parseInt(rhs.join(''), 2);
    c1 = Uuid_Base64Values.indexOf(lhs);
    c2 = Uuid_Base64Values.indexOf(rhs);
    s2 = String.fromCharCode(c1);
    s2 += String.fromCharCode(c2);
    return s2;
};

/** fa66c7f9-f65b-76b0-b7b6-f9c12eb9acbe -> faZsf59ltGsLe2+cEuuay+ */
function encodeUuid(uuid) {
    // console.log("uuid=>", uuid);
    if (uuid.length == 36) {
        uuid = uuid.replace(/-/g, '');
        UuidT[0] = uuid[0];
        UuidT[1] = uuid[1];
        let s2 = null;
        for (let i = 2, j = 2; i < uuid.length; i += 3) {
            s2 = encode3to2(uuid.slice(i, i + 3));
            UuidT[Indices[j++]] = s2[0];
            UuidT[Indices[j++]] = s2[1];
        }
        return UuidT.join('');
    }
};
/**
 * 输出日志
 */
function clog(...msg) {
    let isnCmdBool = !true;
    if (isnCmdBool) {
        console.log(...msg);
    } else {
        if (Editor) {
            Editor.log(...msg);
        } else {
            console.log(...msg);
        };
    };
};

/**
 * 随机个 UUID 的值出来
 * 随机生成(random), 有一定几率重复
 */
function newUuidValue32() {
    return makeRandomStr(8) + "-" + makeRandomStr(4) + "-" + makeRandomStr(4) + "-" + makeRandomStr(4) + "-" + makeRandomStr(12);
};


const cc_set_get_uuid = {
    /**
     * 共有的日志输出函数2
     * @param  {...any} msg 多个日志内容 
     */
    cclog(...msg) {
        if (Editor) {
            Editor.log(...msg);
        } else {
            console.log(...msg);
        };
    },
    /**
     * 获取一个时间戳的随机 md5 的 uuid 的 32 位数的值
     */
    getMd5UUIDvalue() {
        return newUuidValue32();
    },
    /**
     * 将 uuid 的 32 位数的值加密成 22 位的
     */
    getEncodeUuidvalue(uuidNum) {
        return encodeUuid(uuidNum);
    },
    /**
     * 将 22 位的值解密成 uuid 的 32 位数
     */
    getDecodeUuidvalue(uuidNum) {
        return decodeUUid(uuidNum);
    },
};

// 导出到混淆插件使用
module.exports = cc_set_get_uuid;