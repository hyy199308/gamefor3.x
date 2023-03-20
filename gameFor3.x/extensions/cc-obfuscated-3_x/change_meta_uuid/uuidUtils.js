/*
 * @FilePath: uuidUtils.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-31 16:53:46
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-07 23:45:45
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
var Uuid = (typeof CC_EDITOR !== 'undefined' ? CC_EDITOR : true) && require('node-uuid');
var Base64KeyChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var AsciiTo64 = new Array(128);
for (var i = 0; i < 128; ++i) { AsciiTo64[i] = 0; }
for (i = 0; i < 64; ++i) { AsciiTo64[Base64KeyChars.charCodeAt(i)] = i; }

var Reg_Dash = /-/g;
var Reg_Uuid = /^[0-9a-fA-F-]{36}$/;
var Reg_NormalizedUuid = /^[0-9a-fA-F]{32}$/;
var Reg_CompressedUuid = /^[0-9a-zA-Z+/]{22,23}$/;

// @Copyright: [版权] xp
// Alt+R 启动正则搜索
// 包含文件->
// .meta,.js..ts,.prefab,.fire,.anim,.mtl,.json
// vscode 我自建的正则匹配搜索-限定在22~36位的uuid和短码范围
// (")[0-9a-zA-Z]{22,36}
// vscode 我自建的正则匹配搜索-指定字符串匹配, 不限长度
// (")[0-9a-zA-Z]+?

var UuidUtils = {

    // 加了这个标记后，字符串就不可能会是 uuid 了。
    NonUuidMark: '.',

    // 压缩后的 uuid 可以减小保存时的尺寸，但不能做为文件名（因为无法区分大小写并且包含非法字符）。
    // 默认将 uuid 的后面 27 位压缩成 18 位，前 5 位保留下来，方便调试。
    // 828e3a11-866f-6072-8e21-b0ee02212269 -> 82jjoRhm9gco4hsO4CISJp3
    // 如果启用 min 则将 uuid 的后面 30 位压缩成 20 位，前 2 位保留不变。
    //  
    /**
     * 长码压缩成短码 
     * 828e3a11-866f-6072-8e21-b0ee02212269 -> 82jjoRhm9gco4hsO4CISJp
     * @param {Boolean} [min=false]
     */
    compressUuid: function (uuid, min) {
        // 有些编码编不了
        // "71edbel3TRPe5aECV9Y39xt": {
        //     "filename": "[_id 短码] -> [AtlasSprite.fire]",
        //     "suuid": "71edbel3TRPe5aECV9Y39xt",
        // // console.log("uuid=>", uuid);
        // if (Reg_Uuid.test(uuid)) {
        //     return GETcc_set_get_uuid.getEncodeUuidvalue(uuid);
        // }
        // else if (!Reg_NormalizedUuid.test(uuid)) {
        //     return uuid;
        // };
        // // 修正算法解析问题
        // return GETcc_set_get_uuid.getEncodeUuidvalue(uuid);

        if (Reg_Uuid.test(uuid)) {
            uuid = uuid.replace(Reg_Dash, '');
        }
        else if (!Reg_NormalizedUuid.test(uuid)) {
            return uuid;
        }
        var reserved = (min === true) ? 2 : 5;
        return UuidUtils.compressHex(uuid, reserved);
    },

    compressHex: function (hexString, reservedHeadLength) {
        var length = hexString.length;
        var i;
        if (typeof reservedHeadLength !== 'undefined') {
            i = reservedHeadLength;
        }
        else {
            i = length % 3;
        }
        var head = hexString.slice(0, i);
        var base64Chars = [];
        while (i < length) {
            var hexVal1 = parseInt(hexString[i], 16);
            var hexVal2 = parseInt(hexString[i + 1], 16);
            var hexVal3 = parseInt(hexString[i + 2], 16);
            base64Chars.push(Base64KeyChars[(hexVal1 << 2) | (hexVal2 >> 2)]);
            base64Chars.push(Base64KeyChars[((hexVal2 & 3) << 4) | hexVal3]);
            i += 3;
        }
        return head + base64Chars.join('');
    },
    /**
     * 解压缩 
     * 82jjoRhm9gco4hsO4CISJp -> 828e3a11-866f-6072-8e21-b0ee02212269
     * @param {*} str 
     * @returns 
     */
    decompressUuid: function (str) {
        // 有些短码解不了
        // "71edbel3TRPe5aECV9Y39xt": {
        //     "filename": "[_id 短码] -> [AtlasSprite.fire]",
        //     "suuid": "71edbel3TRPe5aECV9Y39xt",
        // if (str.length === 22 || str.length === 23) {
        //     return GETcc_set_get_uuid.getDecodeUuidvalue(str);
        // };
        // // 修正算法解析问题
        // return GETcc_set_get_uuid.getDecodeUuidvalue(str);


        // 'creat788-9e77-ab02-e762-a02a27b5ec6d': {
        //     filename: '[短码] adapter-min.js',
        //     suuid: 'createInnerAudioContext',
        //     luuid: '8f10f4b0-a29e-4ea9-dca9-2528d5e3384b'

        if (str.length === 23) {
            // decode base64
            var hexChars = [];
            for (var i = 5; i < 23; i += 2) {
                var lhs = AsciiTo64[str.charCodeAt(i)];
                var rhs = AsciiTo64[str.charCodeAt(i + 1)];
                hexChars.push((lhs >> 2).toString(16));
                hexChars.push((((lhs & 3) << 2) | rhs >> 4).toString(16));
                hexChars.push((rhs & 0xF).toString(16));
            }
            //
            str = str.slice(0, 5) + hexChars.join('');
        }
        else if (str.length === 22) {
            // decode base64
            var hexChars = [];
            for (var i = 2; i < 22; i += 2) {
                var lhs = AsciiTo64[str.charCodeAt(i)];
                var rhs = AsciiTo64[str.charCodeAt(i + 1)];
                hexChars.push((lhs >> 2).toString(16));
                hexChars.push((((lhs & 3) << 2) | rhs >> 4).toString(16));
                hexChars.push((rhs & 0xF).toString(16));
            }
            //
            str = str.slice(0, 2) + hexChars.join('');
        }
        return [str.slice(0, 8), str.slice(8, 12), str.slice(12, 16), str.slice(16, 20), str.slice(20)].join('-');
    },
    /**
     * 判断 3.x 里面的字符串是否是 uuid 
     * @param {*} postStr 
     * @returns 
     */
    isUuid_3xSubMetas: function (postStr) {
        if (typeof postStr == 'string') {
            // @6c48a=>@f9941 做个截取
            var postStrSplits = postStr.split("@")[0];
            if (postStrSplits) {
                return Reg_CompressedUuid.test(postStrSplits) || Reg_NormalizedUuid.test(postStrSplits) || Reg_Uuid.test(postStrSplits);
            } else {
                return Reg_CompressedUuid.test(postStr) || Reg_NormalizedUuid.test(postStr) || Reg_Uuid.test(postStr);
            };
        } else {
            return false;
        };
    },
    /**
     * 获取截断的图片的 uuid 字符串拼接数组
     * @param {*} postStr 
     * @returns 
     */
    get_3xSubMetas: function (postStr) {
        if (typeof postStr == 'string') {
            // @6c48a => @f9941 做个截取
            var postStrSplits = postStr.split("@");
            if (postStrSplits) {
                return postStrSplits;
            } else {
                return null;
            };
        } else {
            return null;
        };
    },
    /**
     * 判断字符串是否是 uuid 
     * @param {*} str 
     * @returns 
     */
    isUuid: function (str) {
        if (typeof str == 'string') {
            return Reg_CompressedUuid.test(str) || Reg_NormalizedUuid.test(str) || Reg_Uuid.test(str);
        } else {
            return false;
        }
    },
    uuid: function () {
        var uuid = Uuid.v4();
        return UuidUtils.compressUuid(uuid, true);
    },

    /**
     * 采取混沌值里面的自定义的 MD5 的 UUID 的值
     * @returns 自定义的 MD5 的 UUID 的值
     */
    uuid_vip: function () {
        var uuid = Uuid.v4();
        return uuid;
        // // 不能用自定义的
        // var uuidVip = Ast_Codeing_Do.ast_md5_uuid() || "7d7e5dfd-5c06-929a-ba82-333a275e5a53@6454a";
        // var postEndUUID = "";
        // if (uuidVip.length > 0) {
        //     // ca7c2a15f35de48b44c5711900d2e5bd
        //     // postEndUUID = 'ca7c2a15-f35d-e48b-44c5-711900d2e5bd'
        //     // postEndUUID = uuidVip.slice(0, 8) + "-" + uuidVip.slice(8, 12) + "-" + uuidVip.slice(12, 16) + "-" + uuidVip.slice(16, 20) + "-" + uuidVip.slice(20, 32);
        //     // postEndUUID = [uuidVip.slice(0, 8), uuidVip.slice(8, 12), uuidVip.slice(12, 16), uuidVip.slice(16, 20), uuidVip.slice(20,32)].join('-');
        //     postEndUUID = [uuidVip.slice(0, 8), uuidVip.slice(8, 12), uuidVip.slice(12, 16), uuidVip.slice(16, 20), uuidVip.slice(20)].join('-');
        // };
        // return postEndUUID;
    },
    /**
      * 生成激活码
      * UUID.v1 基于时间戳生成(time based)
      * UUID.v4 随机生成(random), 有一定几率重复
      * cocoscreator 使用的是v4 uuid生成器
      */
    uuidv4: function () {
        var uuid = Uuid.v4();
        return uuid;
    },
    uuidv1: function () {
        var uuid = Uuid.v1();
        return uuid;
    }
};
// 参考论坛帖子 : https://forum.cocos.org/t/prefab---type--/54978/9
// 用 Editor.Utils.UuidUtils.compressUuid(uuid, true) 生成
module.exports = UuidUtils;