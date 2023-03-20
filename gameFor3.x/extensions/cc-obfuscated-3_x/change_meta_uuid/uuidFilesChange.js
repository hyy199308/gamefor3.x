/*
 * @FilePath: uuidFilesChange.js
 * @Author: koroFileHeader xx
 * @Date: 2022-11-02 09:53:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-24 23:38:51
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */


// @Copyright: [版权] xp
// Alt+R 启动正则搜索
// 包含文件->
// .meta,.js..ts,.prefab,.fire,.anim,.mtl,.json
// vscode 我自建的正则匹配搜索-限定在22~36位的uuid和短码范围
// (")[0-9a-zA-Z]{22,36}
// vscode 我自建的正则匹配搜索-指定字符串匹配, 不限长度
// (")[0-9a-zA-Z]+?

// const GETcc_set_get_uuid = require('./setUuidGetUid22');
// npm i deep-dir
var deepDIR = require("deep-dir");
var fs = require("fs");
var fileGetPath = require('path');
var uuidUtils = require('./uuidUtils')
// projUuidMetaAllList 仅仅是提取 assets 里面所有 .meta 文件的 UUID
var projUuidMetaAllList = {};
var uuidShortLongList = {};
var EnterReg_Uuid = /^[0-9a-fA-F-]{36}$/;
var EnterReg_CompressedUuid = /^[0-9a-zA-Z+/]{22,23}$/;
module.exports = {
    /**
     * 读取文件, 这个速度快
     * @param {*} path 
     * @returns 
     */
    readFileSync: function (path) {
        return fs.readFileSync(path, 'utf-8');
    },
    writeFile: function (_path, _msg) {
        fs.writeFile(_path, _msg, function (err) {
            if (err) throw err;
        })
    },
    /**
     * 写入文件, 这个好用点
     * @param {*} _path 
     * @param {*} _msg 
     */
    writeFileSync: function (_path, _msg) {
        fs.writeFileSync(_path, _msg)
    },
    cleanFile: function (_path) {
        fs.unlink(_path, function (err) {
            if (err) throw err;
        })
    },
    cleanFileSync: function (_path) {
        fs.unlinkSync(_path); // Sync 表示是同步方法
    },
    deleteall: function (path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteall(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    /**
     * 创建目录
     * @param {*} _path 
     */
    createMkdir: function (_path) {
        // console.log('createMkdir:' + _path);
        if (!fs.existsSync(_path)) {
            try {
                fs.mkdirSync(_path);
            } catch (e) {
                if (e.code != 'EEXIST') throw e;
            }
        }
    },
    isPath: function (path) {
        return fs.existsSync(path);
    },
    /**
     * 递归读取文件夹
     * @param {*} dir 
     * @returns 
     */
    deepLoopReadFiles: function (dir) {
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            };
            subpath = fileGetPath.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                this.deepLoopReadFiles(subpath);
            }
            else if (stat.isFile()) {
                var getThis = this;
                getThis.RegExpMatchFileUUID(subpath);
            }
        }
    },
    /**
     * 高级正则匹配 uuid , 高性能
     * @method _upUUIDList
     * @param {getItemPath} 传入文件夹的路径
     */
    RegExpMatchFileUUID(getItemPath) {
        // var filesStat = fs.statSync(getItemPath);
        // 获取文件内容, utf-8 格式的好用点
        // var subpaths = fs.readFileSync(getItemPath);
        var getFileExtName = fileGetPath.extname(getItemPath);
        var getFileBasename = fileGetPath.basename(getItemPath);
        // 仅仅读取指定的文件类型 '.anim', '.prefab', '.fire', '.meta', '.mtl',
        // if (getFileExtName == ".js"||".ts"||".fire") {
        if (getFileExtName == ".js" || getFileExtName == ".ts" || getFileExtName == ".anim" || getFileExtName == ".json" ||
            getFileExtName == ".prefab" || getFileExtName == ".fire" || getFileExtName == ".meta" || getFileExtName == ".mtl") {
            var getFileContent = fs.readFileSync(getItemPath, 'utf-8');
            var getUuidStr = "", allUuidArr = [];
            // var Reg_Uuid = new RegExp(/[\d\w+\-]{9}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+]{12}/, 'g') || /^[0-9a-fA-F-]{36}$/;
            // var Reg_NormalizedUuid = new RegExp(/^[0-9a-fA-F]{32}$/, 'g') || /^[0-9a-fA-F]{32}$/;
            // var Reg_CompressedUuid = new RegExp(/[\d\w+\+\/]{22,23}/, 'g') || /^[0-9a-zA-Z+/]{22,23}$/;

            var Reg_Uuid = new RegExp(/[0-9a-fA-F-]{9}[0-9a-fA-F-]{5}[0-9a-fA-F-]{5}[0-9a-fA-F-]{5}[0-9a-fA-F]{12}/, 'g');
            var Reg_NormalizedUuid = new RegExp(/^[0-9a-fA-F]{32}$/, 'g');
            var Reg_CompressedUuid = new RegExp(/[0-9a-zA-Z+\+\/]{22,23}/, 'g');
            var reg36Arr = [], reg32Arr = [], reg22Arr = [];
            // reg36Arr = getFileContent.match(Reg_Uuid, 'g');
            // reg32Arr = getFileContent.match(Reg_NormalizedUuid, 'g');
            // reg22Arr = getFileContent.match(Reg_CompressedUuid, 'g');
            reg36Arr = getFileContent.match(Reg_Uuid);
            reg32Arr = getFileContent.match(Reg_NormalizedUuid);
            reg22Arr = getFileContent.match(Reg_CompressedUuid);
            // console.log("[修改版本][匹配数据] getNowList=>\n", [getFileContent.length, reg36Arr, reg32Arr, reg22Arr]);
            // allUuidArr = reg36Arr.concat(reg32Arr, reg22Arr);
            // allUuidArr = allUuidArr.concat(reg36Arr, reg32Arr, reg22Arr);
            // 差异化处理, 分类判断是否存在
            if (reg36Arr) { allUuidArr = allUuidArr.concat(reg36Arr); };
            if (reg32Arr) { allUuidArr = allUuidArr.concat(reg32Arr); };
            if (reg22Arr) { allUuidArr = allUuidArr.concat(reg22Arr); };
            for (var ii = 0; ii < allUuidArr.length; ii++) {
                getUuidStr = allUuidArr[ii];
                this._upAddUuidList(getUuidStr, getFileBasename);
            };
        };
        // if (!filesStat.isDirectory()) {
        //     // 不操作文件夹
        // } else {
        // };
        // console.log("\n[END][getAllFileArrPath] getNowList=>\n", getAllFileArrPath);
    },
    /**
     * 更新读取所有文件的 UUID , 魔改版本-提高性能，深度遍历
     * @param {*} dir 
     * @returns 
     */
    updateAllFilesContainUuid(dir) {
        // 高级正则处理性能
        // 匹配 22~23 位 uuid
        // "7dfl39XAZ/mrqC+zonXlpT".match(new RegExp(/[\d\w+\+\/]{22,23}/,'g'))
        // 匹配 36 位 uuid
        // "7d7e5dfd-5c06-429a-ba82-333a275e5a53@6c48a".match(new RegExp(/[\d\w+\-]{9}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+]{12}/,'g'))[0].length;
        // 匹配 42 位 uuid
        // "7d7e5dfd-5c06-429a-ba82-333a275e5a53@6c48a".match(new RegExp(/[\d\w+\-]{9}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+\@]{18}/,'g'))[0].length;

        // 深度遍历文件夹(急速读取，省略递归过程)
        let getThis = this;
        // // Promise 按顺序执行 js
        // new Promise((resolve) => {
        //     // var getAllFileArrPath = [];
        //     // var deepDIRreturn = deepDIR(dir, (getFileItem, b, c, d) => {
        //     // // 高性能库文件递归
        //     // deepDIR(dir, (getFileItem) => {
        //     //     // getAllFileArrPath.push([getFileItem.base, getFileItem.path]);
        //     //     // console.log([getFileItem, b, c, d]);
        //     //     // console.log(getFileItem.base, getFileItem.path);
        //     //     // console.log(getFileItem);

        //     //     var getItemPath = getFileItem.path;
        //     //     getThis.RegExpMatchFileUUID(getItemPath);
        //     // });

        //     // 自定义递归方式
        //     getThis.deepLoopReadFiles(dir);
        //     // console.log("\n[END][deepDIRreturn] getNowList=>\n", deepDIRreturn);
        //     resolve();
        // }).then(() => {
        //     // setTimeout(() => {
        //     //     var getNowList = getThis.getAllUUIDList();
        //     //     // console.log(dir + "\n[END][修改版本] getNowList=>\n", getNowList);
        //     //     console.log("\n[END][修改版本] getNowList=>\n", getNowList);
        //     // }, 233);
        //     var getNowList = getThis.getAllUUIDList();
        //     // console.log(dir + "\n[END][修改版本] getNowList=>\n", getNowList);
        //     // console.log("\n[END][修改版本] getNowList=>\n", getNowList);
        //     return getNowList;
        // });

        // 自定义递归方式
        getThis.deepLoopReadFiles(dir);
        var getNowList = getThis.getAllUUIDList();
        // console.log(dir + "\n[END][修改版本] getNowList=>\n", getNowList);
        // console.log("\n[END][修改版本] getNowList=>\n", getNowList);
        return getNowList;
    },
    /**
     * 添加 UUID 到列表里面, 过滤已加入的
     */
    _upAddUuidList(matchUuidStr, postFileName) {
        // .js 和 .ts 拼接的文件里面还是有这个数据,  所以稳妥起见, 最好不要在此处使用
        // 'seb5179a-94f8-b17a-545e-b2896eb62a27': {
        //     filename: '[短码] cocos2d-js-min.js',
        //     suuid: 'setRealPixelResolution',
        //     luuid: '6026a120-24be-42c8-c525-6a70ca19dcb1'
        //   },
        //   'ad6a9b42-a27b-5a8a-77ab-4adadab5e832': {
        //     filename: '[短码] cocos2d-js-min.js',
        //     suuid: 'adaptContainerStrategy',
        //     luuid: '6026a120-24be-42c8-c525-6a70ca19dcb1'

        if (uuidUtils.isUuid(matchUuidStr) && !uuidShortLongList[matchUuidStr]) {
            var Reg_CompressedUuidMatch = /^[0-9a-zA-Z+/]{22,23}$/;
            var isnShortUuidBool = Reg_CompressedUuidMatch.test(matchUuidStr);
            var Reg_UuidMatch = /^[0-9a-fA-F-]{36}$/;
            var Reg_NormalizedUuidMatch = /^[0-9a-fA-F]{32}$/;
            var getUuidName = "", getShortUuid = "";
            // 判断传入的是短码还是长码, 指定添加
            if (Reg_UuidMatch.test(matchUuidStr) || Reg_NormalizedUuidMatch.test(matchUuidStr)) {
                getUuidName = matchUuidStr;
                // 长码需要压缩一下弄成短码形式
                getShortUuid = uuidUtils.compressUuid(matchUuidStr);
                // 必须判断出来的是正确的才进行下一步操作
                if (getShortUuid.length != matchUuidStr.length) {
                    uuidShortLongList[getUuidName] = {
                        filename: "[长码] [" + postFileName + "]",
                        // 短码 UUID 
                        suuid: getShortUuid || "",
                        // uuid: uuidUtils.uuidv4(),
                        // 采取自定义的 UUID 来赋值
                        luuid: uuidUtils.uuid_vip(),
                    };
                };

                // uuidlist[getUuidName] = {
                //     filename: "[长码] [" + postFileName+"]",
                //     // 短码 UUID 
                //     suuid: getShortUuid || "",
                //     // uuid: uuidUtils.uuidv4(),
                //     // 采取自定义的 UUID 来赋值
                //     luuid: uuidUtils.uuid_vip(),
                // };
            };
            if (isnShortUuidBool) {
                // 短码名称解压缩
                getUuidName = uuidUtils.decompressUuid(matchUuidStr);
                // 必须判断出来的是正确的才进行下一步操作
                if (getUuidName.length != matchUuidStr.length) {
                    // 传入的就是短码, 就不用改了
                    getShortUuid = matchUuidStr;
                    uuidShortLongList[getUuidName] = {
                        filename: "[短码] [" + postFileName + "]",
                        // 短码 UUID 
                        suuid: getShortUuid || "",
                        // uuid: uuidUtils.uuidv4(),
                        // 采取自定义的 UUID 来赋值
                        luuid: uuidUtils.uuid_vip(),
                    };
                };

                // // 传入的就是短码, 就不用改了
                // getShortUuid = matchUuidStr;
                // uuidlist[getUuidName] = {
                //     filename: "[短码] [" + postFileName+"]",
                //     // 短码 UUID 
                //     suuid: getShortUuid || "",
                //     // uuid: uuidUtils.uuidv4(),
                //     // 采取自定义的 UUID 来赋值
                //     luuid: uuidUtils.uuid_vip(),
                // };
            };
        };
        return uuidShortLongList;
    },
    /**
     * 读取所有的 .meta 的长码 uuid (用于过滤非 assets 项目内的 uuid (这种就针对图片处理的, 防止有些图片丢失))
     * 比如项目内用到了 Cocos internal 里面的默认资源的 UUID, 都可以通过这个来进行过滤从而不替换这个 UUID 
     * @param {*} dir 
     * @returns 
     */
    getProjMetaFileUuid: function (dir) {
        // projUuidMetaAllList["UUID"] = {};
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        };
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = fileGetPath.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                this.getProjMetaFileUuid(subpath);
            }
            else if (stat.isFile()) {
                var getFileExtName = fileGetPath.extname(subpath);
                var getFileBasename = fileGetPath.basename(subpath);
                if (getFileExtName == '.meta') {
                    var jstrGetMeta = this.readFileSync(subpath);
                    var Metajson = JSON.parse(jstrGetMeta);
                    this.getAllProjMetaFileUuid(Metajson, "[metaJson 长码] [" + getFileBasename + "]");
                };
            }
        };
    },
    /**
     * 更新所有 JSON 数据里面的 .meta 的 uuid
     */
    getAllProjMetaFileUuid(json, getFileBasename) {
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        // // 3.x 的图片的 .meta 的 uuid 有所变化=>
        // 不用收录这个类型的 UUID // 不用收录这个类型的 UUID // 不用收录这个类型的 UUID 
        // // subMetas=>@6c48a=>@f9941 =>uuid =>605a86b5-7ea8-6d72-aa61-8e8da09a3b60@f9961
        // if (json['uuid'] && uuidUtils.isUuid_3xSubMetas(json['uuid'])) {
        //     var getLongUuid1 = uuidUtils.get_3xSubMetas(json['uuid'])[0];
        //     var getShortUuid1 = uuidUtils.compressUuid(getLongUuid1);
        //     var getRandUUIDStr1 = uuidUtils.uuid_vip();
        //     projUuidMetaAllList[getLongUuid1] = {
        //         filename: "[普通 长码] -> [" + getFileBasename + "]",
        //         // 长码 UUID 
        //         suuid: getShortUuid1,
        //         // uuid: uuidUtils.uuid_vip(),
        //         newuuid: {
        //             luuid: getRandUUIDStr1,
        //             suuid: uuidUtils.compressUuid(getRandUUIDStr1),
        //         },
        //     };
        // };

        // 2.x,3.x 的 uuid 的兼容写法 (.meta 文件), 必须是 uuid 格式才进入
        if (json['uuid'] && uuidUtils.isUuid(json['uuid'])) {
            var getLongUuid8 = json['uuid'];
            var getShortUuid8 = uuidUtils.compressUuid(getLongUuid8);
            var getRandUUIDStr8 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['uuid'])) {
                getLongUuid8 = uuidUtils.decompressUuid(json['uuid']);
                getShortUuid8 = getLongUuid8;
            } else {
                getLongUuid8 = json['uuid'];
                getShortUuid8 = uuidUtils.compressUuid(getLongUuid8);
            };
            projUuidMetaAllList[getLongUuid8] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid8,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr8,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr8),
                },
            };
        };

        // // 没必要循环执行
        // //  2.x,3.x 深度递归调用, 防止漏改
        // if (Object.prototype.toString.call(json) === '[object Array]') {
        //     for (var prebidx = 0; prebidx < json.length; prebidx++) {
        //         if (json[prebidx] && typeof json[prebidx] == 'object') {
        //             this.getAllProjMetaFileUuid(json[prebidx], getFileBasename);
        //         }
        //     }
        // } else if (Object.prototype.toString.call(json) === '[object Object]') {
        //     for (var prebidx in json) {
        //         if (json[prebidx] && typeof json[prebidx] == 'object') {
        //             this.getAllProjMetaFileUuid(json[prebidx], getFileBasename);
        //         }
        //     }
        // };
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
    },
    /**
     * 更新添加所有的长短码 uuid, 过滤下(非.meta里面的图片的 uuid 不添加,因为有些默认图片之类的用的是那个)
     * @param {*} dir 
     * @returns 
     */
    getAllCreateUUIDlist: function (dir) {
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = fileGetPath.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                this.getAllCreateUUIDlist(subpath);
            }
            else if (stat.isFile()) {
                // Size in Bytes
                // var metastr = subpath.substr(subpath.length - 5, 5);
                // if (metastr == '.meta') {
                //     var jstr = this.readFileSync(subpath);
                //     var json = JSON.parse(jstr);
                //     if (uuidUtils.isUuid(json['uuid'])) {
                //         this._upAllUUIDList(json);
                //         if (json['subMetas'] && typeof json['subMetas'] == 'object') {
                //             for (var bb in json['subMetas']) {
                //                 this._upAllUUIDList(json['subMetas'][bb]);
                //             }
                //         }
                //     }
                // }

                var getFileExtName = fileGetPath.extname(subpath);
                var getFileBasename = fileGetPath.basename(subpath);
                // console.log("当前文件类型=>\t", getFileExtName);
                // console.log("当前文件名称=>\t", getFileBasename);
                if (getFileExtName == '.meta' || getFileExtName == '.json') {
                    var jstr = this.readFileSync(subpath);
                    var json = JSON.parse(jstr);
                    // // "fileId"
                    // // "_id"
                    // // "_sourceId"
                    // // "_storeId"
                    // if (uuidUtils.isUuid(json['uuid'])) {
                    //     this._upAllUUIDList(json, "[metaJson 长码] [" + getFileBasename+"]");
                    //     if (json['subMetas'] && typeof json['subMetas'] == 'object') {
                    //         for (var bb in json['subMetas']) {
                    //             this._upAllUUIDList(json['subMetas'][bb], "[metaJson 长码] [" + getFileBasename+"]");
                    //         };
                    //     };
                    // };
                    // // if (getFileBasename == "project.json") {
                    // //     console.log("当前文件 json 数据=>\t", json);
                    // // };
                    this._updateNormalUuidList(json, "[metaJson 长码] [" + getFileBasename + "]");
                    if (getFileExtName == '.json') {
                        this.updateIdFileIdShortLongUuid(json, getFileBasename);
                    };
                } else if (getFileExtName == '.ani' || getFileExtName == '.prefab' || getFileExtName == '.fire' || getFileExtName == '.mtl') {
                    var jstr_show = this.readFileSync(subpath);
                    try {
                        var json = JSON.parse(jstr_show);
                        // "_id"
                        // "fileId"
                        // "_sourceId"
                        // "_storeId"
                        if (json) {
                            this.updateIdFileIdShortLongUuid(json, getFileBasename);
                        };
                    } catch (e) {
                        // console.log(subpath, jstr_show);
                        // console.log("执行路径==" + subpath + "\n" + typeof jstr_show + "执行报错=>\n" + e + "\n");
                    };
                };
            }
        }
    },
    /**
     * 更新uuid列表(废弃)
     * @param {*} json 
     * @returns 
     */
    _upAllUUIDList: function (json, postFileName) {
        if (uuidUtils.isUuid(json['uuid']) && !uuidShortLongList[json['uuid']]) {
            var getShortUuid = uuidUtils.compressUuid(json['uuid']);
            var getRandUUIDStrMeta1 = uuidUtils.uuid_vip();
            uuidShortLongList[json['uuid']] = {
                filename: postFileName,
                // 短码 UUID 
                suuid: getShortUuid,
                // uuid: uuidUtils.uuidv4(),
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStrMeta1,
                    suuid: uuidUtils.compressUuid(getRandUUIDStrMeta1),
                },
            };
            if (uuidUtils.isUuid(json['rawTextureUuid'])) {
                getShortUuid = uuidUtils.compressUuid(json['rawTextureUuid']);
                var getRandUUIDStrMeta2 = uuidUtils.uuid_vip();
                uuidShortLongList[json['rawTextureUuid']] = {
                    filename: postFileName,
                    // 短码 UUID 
                    suuid: getShortUuid,
                    // uuid: uuidUtils.uuidv4(),
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStrMeta2,
                        suuid: uuidUtils.compressUuid(getRandUUIDStrMeta2),
                    },
                }
            };
        } else {
            // this._updateNormalUuidList(json, getFileBasename);
        };
    },
    /**
     * 判断 .meta 文件里面是否有该 uuid, 用于校验图片的 uuid
     * @param {*} postUuid 
     * @returns 
     */
    isnMetaHaveUUIDbool(postUuid) {
        if (projUuidMetaAllList[postUuid]) {
            // console.log("是否有值?=>\n", projUuidMetaAllList[postUuid], postUuid);
            return true;
        } else {
            return false;
        };
    },
    /**
     * 更新 .meta,.ani,.prefab,.fire,.mtl 里面普通的 uuid 列表(共用)
     * @param {*} json 
     * @param {*} getFileBasename 
     */
    _updateNormalUuidList(json, getFileBasename) {
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        // 3.x 的图片的 .meta 的 uuid 有所变化=>
        // subMetas=>@6c48a=>@f9941 =>uuid =>605a86b5-7ea8-6d72-aa61-8e8da09a3b60@f9961
        if (json['uuid'] && uuidUtils.isUuid_3xSubMetas(json['uuid'])) {
            var getLongUuid1 = uuidUtils.get_3xSubMetas(json['uuid'])[0];
            var getShortUuid1 = uuidUtils.compressUuid(getLongUuid1);
            var getRandUUIDStr1 = uuidUtils.uuid_vip();
            uuidShortLongList[getLongUuid1] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid1,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr1,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr1),
                },
            };
        };


        // 3.x 的图片的 => imageUuidOrDatabaseUri 兼容写法
        if (this.isnMetaHaveUUIDbool(json['imageUuidOrDatabaseUri']) && json['imageUuidOrDatabaseUri'] && uuidUtils.isUuid(json['imageUuidOrDatabaseUri'])) {
            var getLongUuid2 = json['imageUuidOrDatabaseUri'];
            var getShortUuid2 = uuidUtils.compressUuid(getLongUuid2);
            var getRandUUIDStr2 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['imageUuidOrDatabaseUri'])) {
                getLongUuid2 = uuidUtils.decompressUuid(json['imageUuidOrDatabaseUri']);
                getShortUuid2 = json['imageUuidOrDatabaseUri'];
            } else {
                getLongUuid2 = json['imageUuidOrDatabaseUri'];
                getShortUuid2 = uuidUtils.compressUuid(getLongUuid2);
            };
            uuidShortLongList[getLongUuid2] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid2,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr2,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr2),
                },
            };
        };
        if (this.isnMetaHaveUUIDbool(json['imageUuidOrDatabaseUri']) && json['imageUuidOrDatabaseUri'] && uuidUtils.isUuid_3xSubMetas(json['imageUuidOrDatabaseUri'])) {
            var getLongUuid3 = uuidUtils.get_3xSubMetas(json['imageUuidOrDatabaseUri'])[0];
            var getShortUuid3 = uuidUtils.compressUuid(getLongUuid3);
            var getRandUUIDStr3 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(getLongUuid3)) {
                getLongUuid3 = uuidUtils.decompressUuid(getLongUuid3);
                getShortUuid3 = getLongUuid3;
            } else {
                getLongUuid3 = getLongUuid3;
                getShortUuid3 = uuidUtils.compressUuid(getLongUuid3);
            };
            uuidShortLongList[getLongUuid3] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid3,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr3,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr3),
                },
            };
        };

        // 3.x 的图片的 => redirect 兼容写法
        if (this.isnMetaHaveUUIDbool(json['redirect']) && json['redirect'] && uuidUtils.isUuid(json['redirect'])) {
            var getLongUuid4 = json['redirect'];
            var getShortUuid4 = uuidUtils.compressUuid(getLongUuid4);
            var getRandUUIDStr4 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['redirect'])) {
                getLongUuid4 = uuidUtils.decompressUuid(json['redirect']);
                getShortUuid4 = getLongUuid4;
            } else {
                getLongUuid4 = json['redirect'];
                getShortUuid4 = uuidUtils.compressUuid(getLongUuid4);
            };
            uuidShortLongList[getLongUuid4] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid4,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr4,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr4),
                },
            };
        };
        if (this.isnMetaHaveUUIDbool(json['redirect']) && json['redirect'] && uuidUtils.isUuid_3xSubMetas(json['redirect'])) {
            var getLongUuid5 = uuidUtils.get_3xSubMetas(json['redirect'])[0];
            var getShortUuid5 = uuidUtils.compressUuid(getLongUuid5);
            var getRandUUIDStr5 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['redirect'])) {
                getLongUuid5 = uuidUtils.decompressUuid(json['redirect']);
                getShortUuid5 = getLongUuid5;
            } else {
                getLongUuid5 = json['redirect'];
                getShortUuid5 = uuidUtils.compressUuid(getLongUuid5);
            };
            uuidShortLongList[getLongUuid5] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid5,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr5,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr5),
                },
            };
        };

        // 测试 library 库的读取
        // if (json['texture']) {
        //     console.log("__uuid__ texture 的值==>", json['texture']);
        // };

        //  3.x 的 .anim 的 animation 动画资源关联的 __uuid__
        var __uuid__3x = json['__uuid__'];
        if (this.isnMetaHaveUUIDbool(__uuid__3x) && __uuid__3x && uuidUtils.isUuid_3xSubMetas(__uuid__3x)) {
            var getMoreUuid = uuidUtils.get_3xSubMetas(__uuid__3x);
            if (getMoreUuid.length > 0) {
                if (EnterReg_Uuid.test(getMoreUuid[0])) {
                    var getLongUuid6 = getMoreUuid[0];
                    var getShortUuid6 = uuidUtils.compressUuid(getLongUuid6);
                    var getRandUUIDStr6 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid6] = {
                        filename: "[普通 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid6,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr6,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr6),
                        },
                    };
                } else {
                    // 短码解码处理
                    var __uuid__3xShort = uuidUtils.decompressUuid(getMoreUuid[0]);
                    var getLongUuid7 = __uuid__3xShort;
                    var getShortUuid7 = getMoreUuid[0];
                    var getRandUUIDStr7 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid7] = {
                        filename: "[普通 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid7,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr7,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr7),
                        },
                    };
                };
            };
        };


        // 2.x 的 uuid 的兼容写法 (.meta 文件), 必须是 uuid 格式才进入
        if (json['uuid'] && uuidUtils.isUuid(json['uuid'])) {
            var getLongUuid8 = json['uuid'];
            var getShortUuid8 = uuidUtils.compressUuid(getLongUuid8);
            var getRandUUIDStr8 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['uuid'])) {
                getLongUuid8 = uuidUtils.decompressUuid(json['uuid']);
                getShortUuid8 = getLongUuid8;
            } else {
                getLongUuid8 = json['uuid'];
                getShortUuid8 = uuidUtils.compressUuid(getLongUuid8);
            };
            uuidShortLongList[getLongUuid8] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid8,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr8,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr8),
                },
            };
        };
        // 2.x 的图片兼容写法-raw 1 (.meta 文件)
        if (this.isnMetaHaveUUIDbool(json['rawTextureUuid']) && json['rawTextureUuid'] && uuidUtils.isUuid(json['rawTextureUuid'])) {
            var getLongUuid9 = json['rawTextureUuid'];
            var getShortUuid9 = uuidUtils.compressUuid(getLongUuid9);
            var getRandUUIDStr9 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['rawTextureUuid'])) {
                getLongUuid9 = uuidUtils.decompressUuid(json['rawTextureUuid']);
                getShortUuid9 = getLongUuid9;
            } else {
                getLongUuid9 = json['rawTextureUuid'];
                getShortUuid9 = uuidUtils.compressUuid(getLongUuid9);
            };
            uuidShortLongList[getLongUuid9] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid9,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr9,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr9),
                },
            };
        };
        // 2.x 的图片兼容写法-texture 2 (.meta 文件)
        if (this.isnMetaHaveUUIDbool(json['textureUuid']) && json['textureUuid'] && uuidUtils.isUuid(json['textureUuid'])) {
            var getLongUuid10 = json['textureUuid'];
            var getShortUuid10 = uuidUtils.compressUuid(getLongUuid10);
            var getRandUUIDStr10 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['textureUuid'])) {
                getLongUuid10 = uuidUtils.decompressUuid(json['textureUuid']);
                getShortUuid10 = getLongUuid10;
            } else {
                getLongUuid10 = json['textureUuid'];
                getShortUuid10 = uuidUtils.compressUuid(getLongUuid10);
            };
            uuidShortLongList[getLongUuid10] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid10,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr10,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr10),
                },
            };
        };
        // 2.x 的图片兼容写法-texture 3 (.meta 文件)[兼容 spine 骨骼动画的uuid]
        if (this.isnMetaHaveUUIDbool(json['textures']) && json['textures'] && uuidUtils.isUuid(json['textures'])) {
            var getLongUuid10_3 = json['textures'];
            var getShortUuid10_3 = uuidUtils.compressUuid(getLongUuid10_3);
            var getRandUUIDStr10_3 = uuidUtils.uuid_vip();
            // 判断是不是短码
            if (EnterReg_CompressedUuid.test(json['textures'])) {
                getLongUuid10_3 = uuidUtils.decompressUuid(json['textures']);
                getShortUuid10_3 = getLongUuid10_3;
            } else {
                getLongUuid10_3 = json['textures'];
                getShortUuid10_3 = uuidUtils.compressUuid(getLongUuid10_3);
            };
            uuidShortLongList[getLongUuid10_3] = {
                filename: "[普通 长码] -> [" + getFileBasename + "]",
                // 长码 UUID 
                suuid: getShortUuid10_3,
                // uuid: uuidUtils.uuid_vip(),
                newuuid: {
                    luuid: getRandUUIDStr10_3,
                    suuid: uuidUtils.compressUuid(getRandUUIDStr10_3),
                },
            };
        };

        // 2.x 的兼容写法,(后续拓展可以参考 .meta 文件的数据格式进行拓展更改)
        var __type__ = json['__type__'];
        if (__type__ && uuidUtils.isUuid(__type__)) {
            if (EnterReg_Uuid.test(__type__)) {
                var getLongUuid11 = json['__type__'];
                var getShortUuid11 = uuidUtils.compressUuid(getLongUuid11);
                var getRandUUIDStr11 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid11] = {
                    filename: "[普通 长码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid11,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr11,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr11),
                    },
                };
            } else {
                var de__type__ = uuidUtils.decompressUuid(__type__);
                var getLongUuid12 = de__type__;
                var getShortUuid12 = __type__;
                var getRandUUIDStr12 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid12] = {
                    filename: "[普通 短码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid12,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr12,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr12),
                    },
                };
            };
        };

        // 已插入正则: "帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合" 
        //  /^[a-zA-Z]\w{4,15}$/
        // 宽松匹配 /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/
        // /^(?=.*[a-zA-Z])(?=.*\d).+$/
        // 后续准备的, 节点短码兼容修改
        // 2.x 短码
        // 预制体 .prefab
        // "fileId": "e53DTMPHVDBYxs69rdhuJ8",
        // 场景 .fire
        // "_id": "d1YsrKyctC7LPHYrcOY+xB"
        // 最外部的项目 package.json 文件
        // "_sourceId": "a9deea5f-705f-730d-a75f-b6f0c8db8d0f",
        // "_storeId": "b1c793ee99a87ada70f0a0a0e3dcad03"
        // project.json
        // "id": "d1136766-0858-7ee5-8f32-3eb352a9f370",

        //  2.x 的 .fire 的 scene 场景加入 _componentId 的修改，保证组件绑定事件不丢失
        var _componentId = json['_componentId'];
        if (_componentId && uuidUtils.isUuid(_componentId)) {
            if (EnterReg_Uuid.test(_componentId)) {
                // json['_componentId'] = uuidlist[_componentId].uuid;
                var getLongUuid13 = _componentId;
                var getShortUuid13 = uuidUtils.compressUuid(_componentId);
                var getRandUUIDStr13 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid13] = {
                    filename: "[普通 长码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid13,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr13,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr13),
                    },
                };
            } else {
                var de_componentId = uuidUtils.decompressUuid(_componentId);
                // json['_componentId'] = uuidUtils.compressUuid(uuidlist[de_componentId].uuid, false);
                var getLongUuid14 = de_componentId;
                var getShortUuid14 = _componentId;
                var getRandUUIDStr14 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid14] = {
                    filename: "[普通 长码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid14,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr14,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr14),
                    },
                };
            }
        };

        //  2.x 的 .fire 的 scene 场景 __uuid__
        var __uuid__ = json['__uuid__'];
        if (this.isnMetaHaveUUIDbool(__uuid__) && __uuid__ && uuidUtils.isUuid(__uuid__)) {
            if (EnterReg_Uuid.test(__uuid__)) {
                // json['__uuid__'] = uuidlist[__uuid__].uuid; 
                var getLongUuid15 = __uuid__;
                var getShortUuid15 = uuidUtils.compressUuid(__uuid__);
                var getRandUUIDStr15 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid15] = {
                    filename: "[普通 长码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid15,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr15,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr15),
                    },
                };
            } else {
                var __uuid__2 = uuidUtils.decompressUuid(__uuid__);
                // json['__uuid__'] = UuidUtils.compressUuid(uuidlist[__uuid__2], false); 
                var getLongUuid16 = __uuid__2;
                var getShortUuid16 = __uuid__;
                var getRandUUIDStr16 = uuidUtils.uuid_vip();
                uuidShortLongList[getLongUuid16] = {
                    filename: "[普通 短码] -> [" + getFileBasename + "]",
                    // 长码 UUID 
                    suuid: getShortUuid16,
                    // uuid: uuidUtils.uuid_vip(),
                    newuuid: {
                        luuid: getRandUUIDStr16,
                        suuid: uuidUtils.compressUuid(getRandUUIDStr16),
                    },
                };
            }
        };

        //  2.x,3.x 深度递归调用, 防止漏改
        if (Object.prototype.toString.call(json) === '[object Array]') {
            for (var prebidx = 0; prebidx < json.length; prebidx++) {
                if (json[prebidx] && typeof json[prebidx] == 'object') {
                    this._updateNormalUuidList(json[prebidx], getFileBasename);
                }
            }
        } else if (Object.prototype.toString.call(json) === '[object Object]') {
            for (var prebidx in json) {
                if (json[prebidx] && typeof json[prebidx] == 'object') {
                    this._updateNormalUuidList(json[prebidx], getFileBasename);
                }
            }
        };
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
        ////////////////////////////// 普通 uuid 长短码处理////////////////////////////////
    },
    /**
     * 读取 .fire .ani .mtl .prefab 里面的长uuid和短uuid, 合并到uuid对象内去
     * @param {*} json 
     */
    updateIdFileIdShortLongUuid: function (json, getFileBasename) {
        // 确认项目文件内容是否是 JSON 或者是深度 JSON, 提高读取速度
        if (json && typeof json == 'object') {
            this._updateNormalUuidList(json, getFileBasename);

            // 特殊处理
            // 最外层的JSON "id"
            // "_id"
            // "fileId"
            // "_sourceId"
            // "_storeId"
            // 2.x,3.x 的 uuid 的 "id" 的兼容写法 , 必须是 uuid 格式才进入
            if (json['id'] && uuidUtils.isUuid(json['id'])) {
                if (json['id'].length > 23) {
                    // 长码
                    var getShortUuid00 = uuidUtils.compressUuid(json['id']);
                    var getRandUUIDStr00 = uuidUtils.uuid_vip();
                    uuidShortLongList[json['id']] = {
                        filename: "[id 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid00,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr00,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr00),
                        },
                    };
                } else {
                    // 短码
                    var getLongUuid01 = uuidUtils.decompressUuid(json['id']);
                    var getRandUUIDStr01 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid01] = {
                        filename: "[id 短码] -> [" + getFileBasename + "]",
                        // 短码 UUID 
                        suuid: json['id'],
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr01,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr01),
                        },
                    };
                };
            };

            // 2.x,3.x 的 uuid 的 "_id" 的兼容写法 , 必须是 uuid 格式才进入
            if (json['_id'] && uuidUtils.isUuid(json['_id'])) {
                if (json['_id'].length > 23) {
                    // 长码
                    var getShortUuid = uuidUtils.compressUuid(json['_id']);
                    var getRandUUIDStr1 = uuidUtils.uuid_vip();
                    uuidShortLongList[json['_id']] = {
                        filename: "[_id 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr1,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr1),
                        },
                    };
                } else {
                    // 短码
                    var getLongUuid = uuidUtils.decompressUuid(json['_id']);
                    // console.log("[_id 短码] -> getLongUuid=", getLongUuid);
                    var getRandUUIDStr2 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid] = {
                        filename: "[_id 短码] -> [" + getFileBasename + "]",
                        // 短码 UUID 
                        suuid: json['_id'],
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr2,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr2),
                        },
                    };
                };
            };

            // 2.x,3.x 的 uuid 的 "fileId" 的兼容写法 , 必须是 uuid 格式才进入
            if (json['fileId'] && uuidUtils.isUuid(json['fileId'])) {
                if (json['fileId'].length > 23) {
                    // 长码
                    var getShortUuid = uuidUtils.compressUuid(json['fileId']);
                    var getRandUUIDStr3 = uuidUtils.uuid_vip();
                    uuidShortLongList[json['fileId']] = {
                        filename: "[fileId 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr3,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr3),
                        },
                    };
                } else {
                    // 短码
                    var getLongUuid = uuidUtils.decompressUuid(json['fileId']);
                    var getRandUUIDStr4 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid] = {
                        filename: "[fileId 短码] -> [" + getFileBasename + "]",
                        // 短码 UUID 
                        suuid: json['fileId'],
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr4,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr4),
                        },
                    };
                };
            };
            if (json['_sourceId'] && uuidUtils.isUuid(json['_sourceId'])) {
                if (json['_sourceId'].length > 23) {
                    // 长码
                    var getShortUuid = uuidUtils.compressUuid(json['_sourceId']);
                    var getRandUUIDStr5 = uuidUtils.uuid_vip();
                    uuidShortLongList[json['_sourceId']] = {
                        filename: "[_sourceId 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr5,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr5),
                        },
                    };
                } else {
                    // 短码
                    var getLongUuid = uuidUtils.decompressUuid(json['_sourceId']);
                    var getRandUUIDStr6 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid] = {
                        filename: "[_sourceId 短码] -> [" + getFileBasename + "]",
                        // 短码 UUID 
                        suuid: json['_sourceId'],
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr6,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr6),
                        },
                    };
                };
            };
            if (json['_storeId'] && uuidUtils.isUuid(json['_storeId'])) {
                if (json['_storeId'].length > 23) {
                    // 长码
                    var getShortUuid = uuidUtils.compressUuid(json['_storeId']);
                    var getRandUUIDStr7 = uuidUtils.uuid_vip();
                    uuidShortLongList[json['_storeId']] = {
                        filename: "[_storeId 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr7,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr7),
                        },
                    };
                } else {
                    // 短码
                    var getLongUuid = uuidUtils.decompressUuid(json['_storeId']);
                    var getRandUUIDStr8 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongUuid] = {
                        filename: "[_storeId 短码] -> [" + getFileBasename + "]",
                        // 短码 UUID 
                        suuid: json['_storeId'],
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr8,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr8),
                        },
                    };
                };
            };

            // 3.x 的图片的超长度uuid
            // subMetas=>@6c48a=>@f9941 =>uuid =>605a86b5-7ea8-6d72-aa61-8e8da09a3b60@f9961
            if (json['_id'] && uuidUtils.isUuid_3xSubMetas(json['_id'])) {
                var getLongLongUuid = uuidUtils.get_3xSubMetas(json['_id']);
                if (json['_id'].length > 23) {
                    // 超级长码
                    var getShortUuid = uuidUtils.compressUuid(getLongLongUuid[0]);
                    var getRandUUIDStr9 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongLongUuid[0]] = {
                        filename: "[_id Long 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr9,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr9),
                        },
                    };
                };
            };
            // 3.x 的图片的超长度uuid
            // subMetas=>@6c48a=>@f9941 =>uuid =>605a86b5-7ea8-6d72-aa61-8e8da09a3b60@f9961
            if (json['fileId'] && uuidUtils.isUuid_3xSubMetas(json['fileId'])) {
                var getLongLongUuid = uuidUtils.get_3xSubMetas(json['fileId']);
                if (json['fileId'].length > 23) {
                    // 超级长码
                    var getShortUuid = uuidUtils.compressUuid(getLongLongUuid[0]);
                    var getRandUUIDStr10 = uuidUtils.uuid_vip();
                    uuidShortLongList[getLongLongUuid[0]] = {
                        filename: "[fileId Long 长码] -> [" + getFileBasename + "]",
                        // 长码 UUID 
                        suuid: getShortUuid,
                        // uuid: uuidUtils.uuid_vip(),
                        newuuid: {
                            luuid: getRandUUIDStr10,
                            suuid: uuidUtils.compressUuid(getRandUUIDStr10),
                        },
                    };
                };
            };


            //  2.x,3.x 深度递归调用, 防止漏改
            if (Object.prototype.toString.call(json) === '[object Array]') {
                for (var prebidx = 0; prebidx < json.length; prebidx++) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this.updateIdFileIdShortLongUuid(json[prebidx], getFileBasename);
                    }
                }
            } else if (Object.prototype.toString.call(json) === '[object Object]') {
                for (var prebidx in json) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this.updateIdFileIdShortLongUuid(json[prebidx], getFileBasename);
                    }
                }
            };
        };
    },
    /**
     * 获取uuid列表,长码和短码 22~23位的 UUID
     * @returns 
     */
    getAllUUIDList: function () {
        return uuidShortLongList;
    },
    /**
     * 获取 Meta 的 uuid 列表,长码 36 位的 UUID
     * @returns 
     */
    getAllMetaUUIDList: function () {
        return projUuidMetaAllList;
    },
    /**
     * 替换uuid
     * @param {*} dir 
     * @param {*} isnRegOpenBool 
     * @returns 
     */
    replaceUUID: function (dir, isnRegOpenBool) {
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        };
        var subpaths = fs.readdirSync(dir), subpath;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = fileGetPath.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                // 递归循环替换 uuid 的值
                this.replaceUUID(subpath, isnRegOpenBool);
            }
            else if (stat.isFile()) {
                if (this._isReplaceFile(subpath)) {
                    var jstr = this.readFileSync(subpath);
                    // 这个写法不兼容 3.x, 此处改写为兼容型写法 ::=> 正则替换
                    // var opeRegBool = isnRegOpenBool || !true;
                    // 持续开启
                    var opeRegBool = true;
                    var json = null;
                    // console.log("\x1b[33m", "\x1b[46m", "当前正则匹配的启用状态为=>", opeRegBool, '\x1b[0m');
                    if (opeRegBool) {
                        // var getEndJsonString = this._replaceAllMetaUuid(jstr);
                        // if (getEndJsonString) {
                        //     this.writeFileSync(subpath, getEndJsonString);
                        // };

                        // 是否是构建过的项目路径, 此处为固定写法 ::todo
                        var isnBuildEndBool = false;
                        if (!isnBuildEndBool) {
                            // 项目内的 .meta 文件混淆 uuid, 兼容(2.x和3.x写法)
                            try {
                                json = JSON.parse(jstr);
                            } catch (error) {
                                // console.log(subpath);
                            };
                            if (json) {
                                this._replaceFileUUID_Cocos2And3(json);
                                var getFilesName = fileGetPath.basename(subpath);
                                // console.log("\x1b[33m", "\x1b[45m", "json=>已处理 " + getFilesName + " 文件=>", jstr.length, " => ", JSON.stringify(json, null, 2).length, '\x1b[0m');
                                this.writeFileSync(subpath, JSON.stringify(json, null, 2));
                            };
                        } else {
                            // 构建后的文件混淆
                            try {
                                json = JSON.parse(jstr);
                            } catch (error) {
                                // console.log("_replaceAllMetaUuid 读取文件报错=>", subpath, "123456789098765432112345678909876543211234567890987654321");
                            };
                            if (json) {
                                var getThis = this;
                                var getEndJsonString = this._replaceAllMetaUuid(jstr, subpath, getThis);
                                if (getEndJsonString) {
                                    // console.log("\x1b[33m", "\x1b[46m", subpath.length, jstr.length, " <=当前输出文件的长度=> ", getEndJsonString.length, '\x1b[0m');
                                    var getFilesName = fileGetPath.basename(subpath);
                                    // console.log("\x1b[33m", "\x1b[45m", "reg=>已处理 " + getFilesName + " 文件=>", jstr.length, " => ", getEndJsonString.length, '\x1b[0m');
                                    this.writeFileSync(subpath, getEndJsonString);
                                } else {
                                    // console.log(subpath, jstr.length, " <=当前文件的长度=> 未返回任何值");
                                    // console.log(subpath.length, jstr.length, " <=当前文件的长度=> 未返回任何值");
                                };
                            };
                            // console.log(typeof jstr, replaceReg_Uuid.test(jstr), jstr.match(/"uuid"/g), jstr.match(replaceReg_Uuid));
                        };
                    } else {
                        try {
                            json = JSON.parse(jstr);
                        } catch (error) {
                            // console.log(subpath);
                        };
                        if (json) {
                            this._replacePrefabFileUUID(json);
                            var getFilesName = fileGetPath.basename(subpath);
                            // console.log("\x1b[33m", "\x1b[45m", "json=>已处理 " + getFilesName + " 文件=>", jstr.length, " => ", JSON.stringify(json, null, 2).length, '\x1b[0m');
                            this.writeFileSync(subpath, JSON.stringify(json, null, 2));
                        };
                    };
                };
            };
        };
    },
    /**
     * 需要读取的指定类型的文件, 可以提高读写速度
     * @param {*} subpath 
     * @returns 是否是指定的类型的文件的布尔值
     */
    _isReplaceFile: function (subpath) {
        let conf = [
            '.anim',
            '.prefab',
            '.fire',
            '.meta',
            '.mtl',
        ]
        for (let i = 0; i < conf.length; i++) {
            let count = conf[i].length;
            if (subpath.substr(subpath.length - count, count) == conf[i]) {
                return true;
            };
        };
        return false;
    },
    /**
     * 失败品, 仅参考
     * 递归替换文件->替换 .meta 文件的 uuid 
     * @param {*} json 
     */
    _replaceMetaFileUUID: function (json) {
        if (json && typeof json == 'object') {
            if (Object.prototype.toString.call(json) === '[object Array]') {
                for (var prebidx = 0; prebidx < json.length; prebidx++) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replaceMetaFileUUID(json[prebidx]);
                    }
                }
            } else if (Object.prototype.toString.call(json) === '[object Object]') {
                for (var prebidx in json) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replaceMetaFileUUID(json[prebidx]);
                    }
                }
            }
        }
    },
    /**
     * 1.我们拿到的数是一个十六进制的数值。例如: 417AA7EF
     * 转化为二进制是 01000001011110101010011111101111共32位，其中第0位是符号位（0表示正数，1表示负数，在js中正数的浮点数一般为31位，负数的浮点数才是32位。记作s。
     * 2.第1～8位为幂数，其读数值用 e 表示。也就是 10000010,记作e。
     * 3.第9～31位共23位是十六进制的小数部分（11110101010011111101111），计算公式为
     * 1* 2^(-1)+1 * 2^(-2) +1 * 2^(-3)······+1*+1 * 2^(-23)。记作sum
     * 4.最后利用公式 Math.pow(-1, s) * (1 + sum) * Math.pow(2, (e - 127)) 得到 15.666
     * @example floatToHex('617E7FFC')  // 293418452553698380000
     * @param {*} num 
     * @returns 解码十进制
     */
    floatToHex: function (num) {
        //将数据源转化为十六进制   
        let to016 = parseInt(num, 16);
        //转化为2进制，并补零。
        let to0b2 = to016.toString(2).padStart(32, 0)
        //截取符号位
        let s = to0b2.slice(0, 1);
        //截取幂数并转化为二进制
        let e = parseInt(to0b2.slice(1, 9), 2)
        //将幂数转化为二进制。
        let newe = e.toString(2)
        //截取9~-31的小数点的数据位
        let A = to0b2.toString().slice(newe.length + 1)
        //存贮小数值
        let sum = 0;
        for (let i = 0; i < A.length; i++) {
            //取出每个值及逆行计算
            sum += A.charAt(i) * Math.pow(2, -1 * (i + 1))
        }
        //最后利用公式生生成对应的数值
        let x = Math.pow(-1, s) * (1 + sum) * Math.pow(2, (e - 127))
        return x
    },
    /**
    * 两个指针i,j同时变, 极速匹配字符串
    * @param str1 主串
    * @param str2 模式串
    */
    matchFindIndex2: function (str1, str2) {
        // 73kb 文件匹配查找速度在 1.03ms
        let i = 0, // 主串的位置
            j = 0, // 模式串的位置
            len1 = str1.length,
            len2 = str2.length;

        while (i < len1 && j < len2) {
            if (str1[i] === str2[j]) { // 当两个字符相同，就比较下一个
                i++;
                j++;
            } else {
                i = i - j + 1; // 一旦不匹配，i后退
                j = 0; // j归0
            }
        }
        if (j === str2.length) {
            return i - j;
        } else {
            return -1;
        };
    },
    /**
     * 兼容所有的情况, 2.x , 3.x (但是因为递归, 文件一多容易卡顿)
     * (采用正则已解决此问题,运算速度提高50~200倍)
     * testStr=testStr.replace(/[\d\w+\-]{9}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+\-]{5}[\d\w+]{12}/g,"替换UUID");
     * 目前考虑是用来做构建后的自动更改 uuid
     * @param {*} jsonData 
     */
    // _replaceAllMetaUuid: function (replaceUuidEnd, subpath, jsonData, jstr) {
    // _replaceAllMetaUuid: function (replaceUuidEnd, jsonData, jstr) {
    _replaceAllMetaUuid: function (jstr, subpath, gthis) {
        // console.time("_replaceAllMetaUuid 耗时1");
        // try {
        // if (jstr) {
        // // 获取替换后的 uuid , 构建后的短码后续补充上去
        var getAllMetaUuid = this.getAllUUIDList(), getJstr = jstr;
        if (getAllMetaUuid) {
            var loopReadObj = getAllMetaUuid || {
                'd13475c7-b37e-45d6-b6c5-25929e8a0925': { uuid: '7c25ada7-bd9d-45bc-a287-e84fe1f5fcce' }
            };
            Object.keys(loopReadObj).forEach(function (indexStr) {
                // console.time("_replaceAllMetaUuid 耗时2");
                // // console.log(indexStr, loopReadObj[indexStr]);
                // var nowUuidStr = indexStr;
                // var regMatchUuid = new RegExp(nowUuidStr + "", "g");
                // //  || new RegExp(nowUuidStr, "g") || new RegExp("" + nowUuidStr + "", "g");
                // // console.log(typeof getJstr, replaceReg_Uuid.test(getJstr), getJstr.match(nowUuidStr));/
                // // console.log(typeof getJstr, regMatchUuid.test(getJstr), getJstr.match(regMatchUuid));
                // // 开始替换 uuid , 普通的匹配 36 位的
                // if (regMatchUuid.test(getJstr)) {
                //     getJstr = getJstr.replace(regMatchUuid, loopReadObj[indexStr]["uuid"]);
                // };
                // // 开始替换 uuid , 匹配 22,23 位的
                // var getShortUuid = uuidUtils.compressUuid(indexStr);
                // // 替换短码
                // var getShortUuidEnd = uuidUtils.compressUuid(loopReadObj[indexStr]["uuid"]);
                // // var getDeShortUuid = uuidUtils.decompressUuid(getShortUuid);
                // // console.log("\x1b[33m", "\x1b[46m", getShortUuid, " <=当前正则匹配短码替换1=> ", '\x1b[0m');
                // // /5c76flVH2xGQp08++cZIOlX/ 正则报错=>得改 /5c76flVH2xGQp08\\+\\+cZIOlX/
                // // for getShortUuid.length replace=>getShortUuid
                // // getShortUuid = getShortUuid.replaceAll('+', "\\+").replaceAll('/', "\\/");
                // console.timeEnd("_replaceAllMetaUuid 耗时2");
                // console.log(indexStr, loopReadObj[indexStr]);
                // var nowUuidStr = indexStr;
                // var regMatchUuid = new RegExp(nowUuidStr + "", "g");
                // // 开始替换 uuid , 普通的匹配 36 位的
                // if (regMatchUuid.test(getJstr)) {
                //     getJstr = getJstr.replace(regMatchUuid, loopReadObj[indexStr]["uuid"]);
                // };
                function matchFindIndex0(str1, str2) {
                    // 73kb 文件匹配查找速度在 1.03ms
                    let i = 0, // 主串的位置
                        j = 0, // 模式串的位置
                        len1 = str1.length,
                        len2 = str2.length;

                    while (i < len1 && j < len2) {
                        if (str1[i] === str2[j]) { // 当两个字符相同，就比较下一个
                            i++;
                            j++;
                        } else {
                            i = i - j + 1; // 一旦不匹配，i后退
                            j = 0; // j归0
                        }
                    };
                    if (j === str2.length) {
                        getJstr = getJstr.replace(indexStr, loopReadObj[indexStr]["uuid"]);
                        if (gthis.matchFindIndex2(getJstr, indexStr) > 0) {
                            // getJstr = getJstr.replace(indexStr, loopReadObj[indexStr]["uuid"]);
                            matchFindIndex0(getJstr, indexStr);
                        };
                        return i - j;
                    } else {
                        return -1;
                    };
                };
                matchFindIndex0(getJstr, indexStr);

                // 开始替换 uuid , 匹配 22,23 位的
                var getShortUuid = uuidUtils.compressUuid(indexStr);
                // 替换短码
                var getShortUuidEnd = uuidUtils.compressUuid(loopReadObj[indexStr]["uuid"]);

                // console.time("_replaceAllMetaUuid 耗时3");
                function matchFindIndex1(str1, str2) {
                    // 73kb 文件匹配查找速度在 1.03ms
                    let i = 0, // 主串的位置
                        j = 0, // 模式串的位置
                        len1 = str1.length,
                        len2 = str2.length;

                    while (i < len1 && j < len2) {
                        if (str1[i] === str2[j]) { // 当两个字符相同，就比较下一个
                            i++;
                            j++;
                        } else {
                            i = i - j + 1; // 一旦不匹配，i后退
                            j = 0; // j归0
                        }
                    };
                    if (j === str2.length) {
                        getJstr = getJstr.replace(getShortUuid, getShortUuidEnd);
                        if (gthis.matchFindIndex2(getJstr, getShortUuid) > 0) {
                            // getJstr = getJstr.replace(getShortUuid, getShortUuidEnd);
                            matchFindIndex1(getJstr, getShortUuid);
                        };
                        return i - j;
                    } else {
                        return -1;
                    };
                };
                matchFindIndex1(getJstr, getShortUuid);
                // console.timeEnd("_replaceAllMetaUuid 耗时3");

                // for (var ij = 0; ij < uuidUtils.compressUuid(indexStr).length; ij++) {
                //     getShortUuid = getShortUuid.replace('+', "\\+").replace('/', "\\/");
                // };
                // var regMatchUuid2 = new RegExp(getShortUuid + "", "g");
                // if (regMatchUuid2.test(getJstr)) {
                //     // console.log("\x1b[33m", "\x1b[46m", regMatchUuid2, " <=当前正则匹配短码替换=2> ", getShortUuidEnd, '\x1b[0m');
                //     getJstr = getJstr.replace(regMatchUuid2, getShortUuidEnd);
                // };
            });
            // console.timeEnd("_replaceAllMetaUuid 耗时1");
            return getJstr;
            // return null;
        };
        return null;

        // var replaceUuidEnd = null;
        // if (jsonData['uuid'] && uuidUtils.isUuid(jsonData['uuid'])) {
        //     replaceUuidEnd = uuidlist[jsonData['uuid']].uuid;
        // }
        // if (jsonData['rawTextureUuid'] && uuidUtils.isUuid(jsonData['rawTextureUuid'])) {
        //     replaceUuidEnd = uuidlist[jsonData['rawTextureUuid']].uuid;
        // }
        // if (jsonData['textureUuid'] && uuidUtils.isUuid(jsonData['textureUuid'])) {
        //     replaceUuidEnd = uuidlist[jsonData['textureUuid']].uuid;
        // };

        // if (replaceUuidEnd) {
        //     var nowUuidStr = jsonData['uuid'];
        //     var regMatchUuid = new RegExp(nowUuidStr + "", "g") || new RegExp(nowUuidStr, "g") || new RegExp("" + nowUuidStr + "", "g");
        //     // console.log(typeof jstr, replaceReg_Uuid.test(jstr), jstr.match(nowUuidStr));/
        //     // console.log(typeof jstr, regMatchUuid.test(jstr), jstr.match(regMatchUuid));
        //     // 开始替换 uuid 
        //     // var replaceEndJstr = jstr.replace(regMatchUuid, replaceUuidEnd);
        //     jstr = jstr.replace(regMatchUuid, replaceUuidEnd);
        // };
        // return jstr; 
        // };
        // } catch (error) {
        //     // console.log("_replaceAllMetaUuid 执行报错=>", error);
        // };
        // return null;
    },
    /**
     * [Cocos Creator 2.x + Cocos Creator 3.x]
     * 该写法仅 Cocos 2.x 和 3.x 的项目内的数据
     * @param {*} json JSON格式的数据
     */
    _replaceFileUUID_Cocos2And3: function (json) {
        // 确认项目文件内容是否是 JSON 或者是深度 JSON, 提高读取速度
        if (json && typeof json == 'object') {
            // 3.x 的图片的 .meta 的 uuid 有所变化=>
            // subMetas=>@6c48a=>@f9941 =>uuid =>605a86b5-7ea8-6d72-aa61-8e8da09a3b60@f9961
            if (json['uuid'] && uuidUtils.isUuid_3xSubMetas(json['uuid'])) {
                json['uuid'] = uuidShortLongList[json['uuid']].uuid + "@" + uuidUtils.get_3xSubMetas(json['uuid'])[1];
            };

            // 3.x 的图片的 => imageUuidOrDatabaseUri 兼容写法
            if (json['imageUuidOrDatabaseUri'] && uuidUtils.isUuid(json['imageUuidOrDatabaseUri'])) {
                json['imageUuidOrDatabaseUri'] = uuidShortLongList[json['imageUuidOrDatabaseUri']].uuid;
            };
            if (json['imageUuidOrDatabaseUri'] && uuidUtils.isUuid_3xSubMetas(json['imageUuidOrDatabaseUri'])) {
                json['imageUuidOrDatabaseUri'] = uuidShortLongList[json['imageUuidOrDatabaseUri']].uuid + "@" + uuidUtils.get_3xSubMetas(json['imageUuidOrDatabaseUri'])[1];
            };

            // 3.x 的图片的 => redirect 兼容写法
            if (json['redirect'] && uuidUtils.isUuid(json['redirect'])) {
                json['redirect'] = uuidShortLongList[json['redirect']].uuid;
            };
            if (json['redirect'] && uuidUtils.isUuid_3xSubMetas(json['redirect'])) {
                json['redirect'] = uuidShortLongList[json['redirect']].uuid + "@" + uuidUtils.get_3xSubMetas(json['redirect'])[1];
            };

            //  3.x 的 .anim 的 animation 动画资源关联的 __uuid__
            var __uuid__3x = json['__uuid__'];
            if (__uuid__3x && uuidUtils.isUuid_3xSubMetas(__uuid__3x)) {
                var getMoreUuid = uuidUtils.get_3xSubMetas(__uuid__3x);
                if (getMoreUuid.length > 0) {
                    if (EnterReg_Uuid.test(getMoreUuid[0])) {
                        if (uuidShortLongList[getMoreUuid[0]]) {
                            // json['__uuid__'] = uuidlist[getMoreUuid[0]].uuid;
                            json['__uuid__'] = uuidShortLongList[getMoreUuid[0]].uuid + "@" + uuidShortLongList[getMoreUuid[1]];
                        };
                    } else {
                        // 短码解码处理
                        var __uuid__3xShort = uuidUtils.decompressUuid(getMoreUuid[0]);
                        if (uuidShortLongList[__uuid__3xShort]) {
                            json['__uuid__'] = uuidUtils.compressUuid(uuidShortLongList[__uuid__3xShort], false);
                        };
                    };
                };
            };


            // 2.x 的 uuid 的兼容写法 (.meta 文件), 必须是 uuid 格式才进入
            if (json['uuid'] && uuidUtils.isUuid(json['uuid'])) {
                json['uuid'] = uuidShortLongList[json['uuid']].uuid;
            };
            // 2.x 的图片兼容写法-raw 1 (.meta 文件)
            if (json['rawTextureUuid'] && uuidUtils.isUuid(json['rawTextureUuid'])) {
                json['rawTextureUuid'] = uuidShortLongList[json['rawTextureUuid']].uuid;
            };
            // 2.x 的图片兼容写法-texture 2 (.meta 文件)
            if (json['textureUuid'] && uuidUtils.isUuid(json['textureUuid'])) {
                json['textureUuid'] = uuidShortLongList[json['textureUuid']].uuid;
            };

            // 2.x 的兼容写法,(后续拓展可以参考 .meta 文件的数据格式进行拓展更改)
            var __type__ = json['__type__'];
            if (__type__ && uuidUtils.isUuid(__type__)) {
                if (EnterReg_Uuid.test(__type__)) {
                    if (uuidShortLongList[__type__]) {
                        json['__type__'] = uuidShortLongList[__type__].uuid;
                    }
                } else {
                    var de__type__ = uuidUtils.decompressUuid(__type__);
                    if (uuidShortLongList[de__type__]) {
                        json['__type__'] = uuidUtils.compressUuid(uuidShortLongList[de__type__].uuid, false);
                    }
                }
            };

            // 已插入正则: "帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合" 
            //  /^[a-zA-Z]\w{4,15}$/
            // 宽松匹配 /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/
            // /^(?=.*[a-zA-Z])(?=.*\d).+$/
            // 后续准备的, 节点短码兼容修改
            // 2.x 短码
            // 预制体 .prefab
            // "fileId": "e53DTMPHVDBYxs69rdhuJ8",
            // 场景 .fire
            // "_id": "d1YsrKyctC7LPHYrcOY+xB"
            // 最外部的项目 package.json 文件
            // "_sourceId": "a9deea5f-705f-730d-a75f-b6f0c8db8d0f",
            // "_storeId": "b1c793ee99a87ada70f0a0a0e3dcad03"
            // project.json
            // "id": "d1136766-0858-7ee5-8f32-3eb352a9f370",

            //  2.x 的 .fire 的 scene 场景加入 _componentId 的修改，保证组件绑定事件不丢失
            var _componentId = json['_componentId'];
            if (_componentId && uuidUtils.isUuid(_componentId)) {
                if (EnterReg_Uuid.test(_componentId)) {
                    if (uuidShortLongList[_componentId]) {
                        json['_componentId'] = uuidShortLongList[_componentId].uuid;
                    }
                } else {
                    var de_componentId = uuidUtils.decompressUuid(_componentId);
                    if (uuidShortLongList[de_componentId]) {
                        json['_componentId'] = uuidUtils.compressUuid(uuidShortLongList[de_componentId].uuid, false);
                    }
                }
            };

            //  2.x 的 .fire 的 scene 场景 __uuid__
            var __uuid__ = json['__uuid__'];
            if (__uuid__ && uuidUtils.isUuid(__uuid__)) {
                if (EnterReg_Uuid.test(__uuid__)) {
                    if (uuidShortLongList[__uuid__]) {
                        json['__uuid__'] = uuidShortLongList[__uuid__].uuid;
                    }
                } else {
                    var __uuid__2 = uuidUtils.decompressUuid(__uuid__);
                    if (uuidShortLongList[__uuid__2]) {
                        json['__uuid__'] = UuidUtils.compressUuid(uuidShortLongList[__uuid__2], false);
                    }
                }
            };

            //  2.x,3.x 深度递归调用, 防止漏改
            if (Object.prototype.toString.call(json) === '[object Array]') {
                for (var prebidx = 0; prebidx < json.length; prebidx++) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replaceFileUUID_Cocos2And3(json[prebidx]);
                    }
                }
            } else if (Object.prototype.toString.call(json) === '[object Object]') {
                for (var prebidx in json) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replaceFileUUID_Cocos2And3(json[prebidx]);
                    }
                }
            };
        };
    },
    /**
     * 该写法仅兼容 2.x , 全部兼容的已写在前方
     * @param {*} json 
     */
    _replacePrefabFileUUID: function (json) {
        if (json && typeof json == 'object') {
            if (json['uuid'] && uuidUtils.isUuid(json['uuid'])) {
                json['uuid'] = uuidShortLongList[json['uuid']].uuid;
            }
            if (json['rawTextureUuid'] && uuidUtils.isUuid(json['rawTextureUuid'])) {
                json['rawTextureUuid'] = uuidShortLongList[json['rawTextureUuid']].uuid;
            }
            if (json['textureUuid'] && uuidUtils.isUuid(json['textureUuid'])) {
                json['textureUuid'] = uuidShortLongList[json['textureUuid']].uuid;
            };
            var __type__ = json['__type__'];
            if (__type__ && uuidUtils.isUuid(__type__)) {
                if (EnterReg_Uuid.test(__type__)) {
                    if (uuidShortLongList[__type__]) {
                        json['__type__'] = uuidShortLongList[__type__].uuid;
                    }
                } else {
                    var de__type__ = uuidUtils.decompressUuid(__type__);
                    if (uuidShortLongList[de__type__]) {
                        json['__type__'] = uuidUtils.compressUuid(uuidShortLongList[de__type__].uuid, false);
                    }
                }
            };

            // 加入 _componentId 的修改，保证组件绑定事件不丢失
            var _componentId = json['_componentId'];
            if (_componentId && uuidUtils.isUuid(_componentId)) {
                if (EnterReg_Uuid.test(_componentId)) {
                    if (uuidShortLongList[_componentId]) {
                        json['_componentId'] = uuidShortLongList[_componentId].uuid;
                    }
                } else {
                    var de_componentId = uuidUtils.decompressUuid(_componentId);
                    if (uuidShortLongList[de_componentId]) {
                        json['_componentId'] = uuidUtils.compressUuid(uuidShortLongList[de_componentId].uuid, false);
                    }
                }
            };


            var __uuid__ = json['__uuid__'];
            if (__uuid__ && uuidUtils.isUuid(__uuid__)) {
                if (EnterReg_Uuid.test(__uuid__)) {
                    if (uuidShortLongList[__uuid__]) {
                        json['__uuid__'] = uuidShortLongList[__uuid__].uuid;
                    }
                } else {
                    var __uuid__ = uuidUtils.decompressUuid(__uuid__);
                    if (uuidShortLongList[__uuid__]) {
                        json['__uuid__'] = UuidUtils.compressUuid(uuidShortLongList[__uuid__], false);
                    }
                }
            }
            if (Object.prototype.toString.call(json) === '[object Array]') {
                for (var prebidx = 0; prebidx < json.length; prebidx++) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replacePrefabFileUUID(json[prebidx]);
                    }
                }
            } else if (Object.prototype.toString.call(json) === '[object Object]') {
                for (var prebidx in json) {
                    if (json[prebidx] && typeof json[prebidx] == 'object') {
                        this._replacePrefabFileUUID(json[prebidx]);
                    }
                }
            }
        }
    },
};

