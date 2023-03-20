/*
 * @FilePath: ccPluginsDeepToCopyFileJs.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-27 09:41:13
 * @LastEditors: fileheader
 * @LastEditTime: 2022-12-07 13:35:10
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */

// npm i md5
// npm install -g pkg
// pkg server.js 
// pkg -t win server.js 
// npm install -g pkg :全局安装pkg
// pkg server.js ： 将 api.js 编译成 api.exe 可执行文件
// pkg -t win server.js ： 上面的命令会同时编译出 linux 、windows 、mac 版的 exe，加 -t win 就可以只编译 windows 下的
// 改改颜色, 视觉效果研究
var Reset = "\x1b[0m";
var Bright = "\x1b[1m";
var Dim = "\x1b[2m";
var Underscore = "\x1b[4m";
var Blink = "\x1b[5m";
var Reverse = "\x1b[7m";
var Hidden = "\x1b[8m";

var FgBlack = "\x1b[30m";
var FgRed = "\x1b[31m";
var FgGreen = "\x1b[32m";
var FgYellow = "\x1b[33m";
var FgBlue = "\x1b[34m";
var FgMagenta = "\x1b[35m";
var FgCyan = "\x1b[36m";
var FgWhite = "\x1b[37m";

var BgBlack = "\x1b[40m";
var BgRed = "\x1b[41m";
var BgGreen = "\x1b[42m";
var BgYellow = "\x1b[43m";
var BgBlue = "\x1b[44m";
var BgMagenta = "\x1b[45m";
var BgCyan = "\x1b[46m";
var BgWhite = "\x1b[47m";
/**
 * 共有的日志输出函数1
 * @param  {...any} msg 多个日志内容 
 */
function clog(...msg) {
    if (Editor) {
        Editor.log(...msg);
        // Editor.log(BgBlack, FgGreen, ...msg, '\x1b[0m');
    } else {
        console.log(...msg);
        // console.log(BgBlack, FgGreen, ...msg, '\x1b[0m');
    };
};
// console.time("代码执行总耗时");

const Fs = require("fs");
const reqPath = require("path");
const req_md5 = require("md5");
// const exec = require('child_process').exec;
// const GETcc_set_get_uuid = require('./setUuidGetUid22');
let uuidFilesChangeJS = require('./uuidFilesChange');
// npm i replaceall
let replaceallJS = require('replaceall');
// var deepDIR = require("deep-dir");
// npm i dir-to-files
var readDirFile = require("dir-to-files");


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 获取当前目录的路径->
let cocosStoreDashboard_zh = "Cocos 一键更改 UUID";
let cocosStoreDashboard_en = "Cocos UUID Change";
let getRunTimeJson_zh = "/extensions/" + cocosStoreDashboard_zh + "/assets_clone";
let getRunTimeJson_en = "/extensions/" + cocosStoreDashboard_en + "/assets_clone";
// 获取 需要备份的文件路径->
let configFilePath = "", getRunTimeJson = "/extensions/cc-obfuscated-3_x/assets_clone";
const prsPath = (Editor.Project && Editor.Project.path ? Editor.Project.path : Editor.remote.projectPath).replace(/\\/g, '/');

// configFilePath = prsPath + getRunTimeJson;
// 插件全局目录=> 主目录 Editor.App.home
// 编辑器的安装目录=> 编辑器程序文件夹 Editor.App.path
let global_path = "", local_path = "";
global_path = reqPath.join(Editor.App.home);
local_path = reqPath.join(prsPath);
if (Fs.existsSync(global_path + getRunTimeJson)) {
    configFilePath = global_path + getRunTimeJson;
} else if (Fs.existsSync(local_path + getRunTimeJson)) {
    configFilePath = local_path + getRunTimeJson || prsPath + getRunTimeJson;
} else if (Fs.existsSync(global_path + getRunTimeJson_zh)) {
    configFilePath = global_path + getRunTimeJson_zh;
} else if (Fs.existsSync(local_path + getRunTimeJson_zh)) {
    configFilePath = local_path + getRunTimeJson_zh;
} else if (Fs.existsSync(global_path + getRunTimeJson_en)) {
    // 判断 Cocos Dashboard 解压的是不是中文商品名称
    configFilePath = global_path + getRunTimeJson_en;
} else if (Fs.existsSync(local_path + getRunTimeJson_en)) {
    configFilePath = local_path + getRunTimeJson_en;
} else {
    configFilePath = prsPath + getRunTimeJson;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let nowTimeMins = new Date().getTime() + 142857;
//源目录
let SOURCES_DIRECTORY = prsPath + "/assets";
let TARGETS_DIRECTORY = configFilePath + "/assets.Clone" || "assets.Clone";
let getAllMsgAndString = "", outMsgFilePath = configFilePath + "/README-操作日志记录.txt";
//获取文件的后缀名
var getExtname = reqPath.extname(SOURCES_DIRECTORY);
// 只复制指定的  ".meta" 文件, 其它的都不要, 保留文件的原始目录结构 dir 
let saveFileDir = true, saveExtenName = ".meta" || ".ts" || ".js", projName1 = ".anim", projName0 = ".json", projName2 = ".fire", projName3 = ".prefab", projName4 = ".mtl",
    dontSaveFileName = [".font", ".mp3", ".wav", ".exe", ".aspx", ".fnt", ".json", ".assets", ".xml", ".resS", ".map", ".config", ".browser", ".resource", ".meta", ".jpg", ".png", ".unity", ".mat", ".asset", ".lighting", ".csproj", ".gitignore", ".user", ".DotSettings"];
/**
 * 传入的值转 md5 值
 * @param {*} value 传入的值
 * @returns 返回 md5 值
 */
function function_md5(value) {
    return req_md5(value);
};
/**
 * 返回当前时间的随机数
 * @returns 当前时间的随机数
 */
function getNowRandTime() {
    nowTimeMins = new Date().getTime() + 142857 + Math.floor(Math.random() * 142857);
    return nowTimeMins;
};
/**
 * 获取指定长度的 md5 的值
 * @param {*} md5_32_val 传入 md5 的值
 * @param {*} getLength 保留的长度
 * @returns 返回截取长度的结果
 */
function getMd5_length(md5_32_val, getLength) {
    if (getLength < md5_32_val.length) {
        return md5_32_val.slice(0, getLength);
    } else {
        return md5_32_val;
    };
};
/**
 * 获取当前时间的 md5 值, 保留六位数
 * @returns 当前的时间的 md5 的值, 长度六位数
 */
function getNowTimeMd5() {
    var getNowTimeNum = getNowRandTime();
    var nowTimeMd5 = function_md5(getNowTimeNum);
    var getTimeMd5Val = getMd5_length(nowTimeMd5, 6);
    // clog("getTimeMd5Val=>", getTimeMd5Val);
    return getTimeMd5Val;
};

// nodejs 拷贝目录下所有文件 目录
var deepCopyFiles = function (srcPath, dstPath) {
    let paths = Fs.readdirSync(srcPath); //同步读取当前目录
    paths.forEach(function (path) {
        var _srcPath = srcPath + '/' + path;
        var _dstPath = dstPath + '/' + path;
        Fs.stat(_srcPath, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;

            if (stats.isFile()) { //如果是个文件则拷贝 

                getExtname = reqPath.extname(_srcPath);
                /**
                 * // 单层目录的读取
                 * copyFolder(_srcPath, _dstPath);
                 */
                // 根据规定保存指定后缀名类型的文件
                if (saveFileDir) {
                    var isCanSave = true;
                    // 过滤文件, 其它的都不要, 保留文件的原始目录结构 dir, 略过不写
                    // for (var ii = 0; ii < dontSaveFileName.length; ii++) {
                    //     if (dontSaveFileName[ii] == extname) {
                    //         isCanSave = false;
                    //     };
                    // };
                    // 直接判断, 不过滤长数组后缀了
                    if (getExtname != saveExtenName) {
                        isCanSave = false;
                        // 备份保存 scene.fire prefab.prefab anim.ani material.mtl 四个项目内的类型文件 
                        if (getExtname == projName0) { isCanSave = true; };
                        if (getExtname == projName1) { isCanSave = true; };
                        if (getExtname == projName2) { isCanSave = true; };
                        if (getExtname == projName3) { isCanSave = true; };
                        if (getExtname == projName4) { isCanSave = true; };
                        if (isCanSave) {
                            getAllMsgAndString += "\n" + _srcPath + "\t 复制 deepCopy forEach stat [复制子文件] extname 文件的后缀名=> \t" + getExtname + "\n";
                            let readable = Fs.createReadStream(_srcPath);//创建读取流
                            let writable = Fs.createWriteStream(_dstPath);//创建写入流
                            readable.pipe(writable);
                        };
                    } else {
                        isCanSave = true;
                        if (isCanSave) {
                            getAllMsgAndString += "\n" + _srcPath + "\t 复制 deepCopy forEach stat [复制子文件] extname 文件的后缀名=> \t" + getExtname + "\n";
                            let readable = Fs.createReadStream(_srcPath);//创建读取流
                            let writable = Fs.createWriteStream(_dstPath);//创建写入流
                            readable.pipe(writable);
                        };
                    };

                } else {
                    // 这样写就没有文件目录的文件夹了
                    // 仅需读取 .meta 来拼接 uuid 的数组
                    if (getExtname == saveExtenName) {
                        getAllMsgAndString += "\n" + _srcPath + "\t 复制 deepCopy forEach stat [复制子文件] extname 文件的后缀名=> \t" + getExtname + "\n";
                        let readable = Fs.createReadStream(_srcPath);//创建读取流
                        let writable = Fs.createWriteStream(_dstPath);//创建写入流
                        readable.pipe(writable);
                    };
                };

            } else if (stats.isDirectory()) {
                //是目录则 递归 
                checkDirectory(_srcPath, _dstPath, deepCopyFiles);
            }
        });
    });
};
// 递归克隆目录内容
var checkDirectory = function (srcPath, dstPath, callback) {
    getExtname = reqPath.extname(srcPath);
    Fs.access(dstPath, Fs.constants.F_OK, (err) => {
        if (err) {
            Fs.mkdirSync(dstPath);
            callback(srcPath, dstPath);
        } else {
            callback(srcPath, dstPath);
        }
    });
};

// console.timeEnd("代码执行总耗时");
const cc_deep_copy_meta = {
    /**
     * 共有的日志输出函数2
     * @param  {...any} msg 多个日志内容 
     */
    cclog(...msg) {
        console.log(...msg);
        // if (Editor) {
        //     Editor.log(...msg);
        //     // Editor.log(BgBlack, FgGreen, ...msg, '\x1b[0m');
        // } else {
        //     console.log(...msg);
        //     // console.log(BgBlack, FgGreen, ...msg, '\x1b[0m');
        // };
    },
    /**
     * 先备份所有的 .meta 文件, 再开始更改所有的 .meta 文件里面的 UUID 和所有场景+预制体关联的 uuid
     */
    ccUuidCopyChange(paramsPath) {
        // 复制文件夹  
        var getChangeDirPath = paramsPath || SOURCES_DIRECTORY;
        // 标记个 md5 的值, 让复制的文件夹不重名
        TARGETS_DIRECTORY = configFilePath + "/assets.Clone" + "." + getNowTimeMd5();
        this.cclog('[CC][✅]', '正在处理所有的 .meta|ani|fire|prefab|mtl|json 文件\n开始\n复制文件夹=>' + getChangeDirPath + "\n复制到=>", TARGETS_DIRECTORY);

        // return;
        try {
            let getThis = this;
            // Promise 按顺序执行 js
            new Promise((resolve) => {
                // __dirname 是放在同路径下
                checkDirectory(getChangeDirPath, TARGETS_DIRECTORY, deepCopyFiles);
                this.cclog('[CC][✅]', '所有的 .meta|ani|fire|prefab|mtl|json 文件已备份到目录=>\n', TARGETS_DIRECTORY);

                resolve();
            }).then(() => {
                getThis.cclog('[CC][✅][开始计时]', '= 启用高效率算法统计归纳所有[长短码] UUID [初始化] =>', uuidFilesChangeJS.getAllUUIDList());
                // 启用高效率算法
                try {
                    var startTime = new Date().getTime();
                    var readDirPath = getChangeDirPath || "";
                    // [【获取 .meta 的 UUID 】] 并且此时赋值到过滤 JSON object 里面去
                    var getAllProjUpdateUuid = uuidFilesChangeJS.getProjMetaFileUuid(readDirPath);
                    // 获取 .meta 的所有的短码和长码
                    var getNewMetaUUIDarr = uuidFilesChangeJS.getAllMetaUUIDList();
                    // 创建一个崭新的组合式 uuid ,包括所有文件的长短码, 已过滤默认图片的 uuid
                    var startUpdateUuid = uuidFilesChangeJS.getAllCreateUUIDlist(readDirPath);
                    var getNewUUIDarr = uuidFilesChangeJS.getAllUUIDList();
                    var EndTime = new Date().getTime();
                    var usingTime = EndTime - startTime;
                    usingTime = (usingTime / 1000).toFixed(2);
                    // getThis.cclog('[CC][✅]', '= 启用高效率算法统计归纳 UUID = getAllCreateUUIDlist =', uuidFilesChangeJS.getAllCreateUUIDlist);
                    var getAllUuidLength = Object.keys(getNewUUIDarr).length;
                    if (getAllUuidLength < 1000 / 2) {
                        getThis.cclog('[CC][✅][' + usingTime + 's]', '已读取到的 .meta 文件列表[长短码]=> \n共计= ' + getAllUuidLength + ' 个 =>\n', getNewUUIDarr);
                    } else {
                        getThis.cclog('[CC][✅][' + usingTime + 's]', '已读取到的 .meta 文件列表[长短码]=> 共计= ' + getAllUuidLength + ' 个');
                    };

                    // 深度遍历文件夹
                    startTime = new Date().getTime();
                    // 全部读取
                    var tempPath = "", getAllRwPathArr = [], endChangeUuidArr = [];
                    var getAllFilesMainArray = readDirFile.getFileList(readDirPath);
                    // "size": "name": "path":
                    if (getAllFilesMainArray.length > 0) {
                        for (var ii = 0; ii < getAllFilesMainArray.length; ii++) {
                            tempPath = getAllFilesMainArray[ii].path;
                            getAllRwPathArr.push(tempPath);
                        };
                    };
                    getThis.cclog('[CC][✅][递归读取到的] 总目录=>' + getAllRwPathArr.length + '个 =>\n', getAllRwPathArr);

                    var deepReadFileNum = 0;
                    for (var jj = 0; jj < getAllRwPathArr.length; jj++) {
                        // deepDIR(getPath, (a, b, c, d) => {
                        // deepDIR(readDirPath, (a) => {
                        // console.log([a, b, c, d]);
                        // console.log(a, a.base, a.path);
                        // console.log(a.base, a.path);
                        // getThis.cclog('[CC][✅][第' + deepReadFileNum + '个]\t 已读取到路径=>\n', a.path);
                        deepReadFileNum++;
                        // // if (deepReadFileNum > 1635) {
                        // var getFIlePath = a.path;
                        var getFIlePath = getAllRwPathArr[jj];
                        var getFileExtName = reqPath.extname(getFIlePath);
                        var getFileBasename = reqPath.basename(getFIlePath);
                        // getThis.cclog('[CC][✅][' + deepReadFileNum + '个]\t 已读取到 ' + getFileBasename + ' 路径=>\n', getFileExtName, getFIlePath);
                        if (getFileExtName == ".json" || getFileExtName == ".meta" || getFileExtName == ".ani"
                            || getFileExtName == ".fire" || getFileExtName == ".prefab" || getFileExtName == ".mtl") {
                            getThis.cclog('[CC][✅][第' + deepReadFileNum + '个]\t ' + getFileBasename + ' 已更改文件=>\n', getFIlePath);
                            endChangeUuidArr.push(getFIlePath);

                            let getFileContentStr = Fs.readFileSync(getFIlePath, 'UTF-8').toString();
                            // getThis.cclog('[CC][✅][' + deepReadFileNum + '个] 更改前长度=>\t' + getFileContentStr.length + "\n", getFileContentStr);
                            for (var kk in getNewUUIDarr) {
                                // kk == "8b49f918-c95b-4f8d-a8b9-0d1f0bc662ed"
                                // 替换长码 UUID 的值
                                getFileContentStr = replaceallJS.replaceall(kk, getNewUUIDarr[kk]["newuuid"]["luuid"], getFileContentStr);
                                // 替换短码 UUID 的值
                                getFileContentStr = replaceallJS.replaceall(getNewUUIDarr[kk]["suuid"], getNewUUIDarr[kk]["newuuid"]["suuid"], getFileContentStr);
                            };
                            // getThis.cclog('[CC][✅][' + deepReadFileNum + '个] 更改后长度=>\t' + getFileContentStr.length + "\n", getFileContentStr);
                            // 写入到项目内的文件中。。。。。。
                            Fs.writeFileSync(getFIlePath, getFileContentStr);
                        };
                        if (getAllRwPathArr.length == deepReadFileNum) {
                            getThis.cclog('[CC][✅][匹配到的文件已经修改完毕] 共计修改=> ' + endChangeUuidArr.length + '个 =>\n', endChangeUuidArr);
                        };
                        // };
                        // });
                    };
                    // EndTime = new Date().getTime();
                    // usingTime = EndTime - startTime;
                    // usingTime = (usingTime / 1000).toFixed(2);
                    // getThis.cclog('[CC][✅][' + usingTime + 's]', '【请重启 Cocos 编辑器】已更改完成所有的 UUID 【长短码】= ' + getAllUuidLength + ' 个');
                } catch (err) {
                    getThis.cclog('[CC][❌] 运行报错=>\n' + readDirPath + '\n', err);
                };

                var openSlowCalcUUIDbool = false;
                // 此算法效率过低， 忽略
                if (openSlowCalcUUIDbool) {
                    /**
                     * 递归读取文件夹内的文件的内容 =>
                     **/
                    function readFileList(dir, filesList = []) {
                        const files = Fs.readdirSync(dir);
                        // getThis.cclog('[CC][✅]', 'files=>', files);
                        files.forEach((item, index) => {
                            var fullPath = reqPath.join(dir, item);
                            const stat = Fs.statSync(fullPath);
                            if (stat.isDirectory()) {
                                readFileList(reqPath.join(dir, item), filesList);  //递归读取文件
                            } else {
                                if (reqPath.extname(fullPath) == '.meta') {
                                    // filesList.push(fullPath);

                                    // getThis.cclog('[CC][✅]', '当前的 .meta 文件路径为=>' + reqPath.extname(fullPath) + "\n" + fullPath);
                                    // getThis.cclog('[CC][✅]', '当前的 .meta 文件为=>' + reqPath.basename(fullPath) + "\n" + fullPath);

                                    // 读取 .meta 文件的内容(Json 格式的)
                                    let metaData = Fs.readFileSync(fullPath, 'UTF-8').toString();
                                    let metaParse = JSON.parse(metaData);
                                    // getThis.cclog('[CC][✅]', '当前的 .meta 文件为=>' + reqPath.basename(fullPath) + "\n" + metaParse["uuid"] + "\n" + fullPath);
                                    // 保存一份 UUID 的值
                                    filesList.push([metaParse["uuid"], fullPath]);

                                    // // 写入文件
                                    // try {
                                    //     Fs.writeFileSync(fullPath, JSON.stringify(metaParse))
                                    // }
                                    // catch (error) {
                                    //     getThis.cclog('[CC][❌]', '操作报错=>\n', error);
                                    // };
                                } else {
                                    // getThis.cclog('[CC][✅]', '读取的文件的后缀名=>' + reqPath.extname(fullPath) + "\n" + fullPath);
                                };
                            };
                        });
                        return filesList;
                    };
                    var getfilesList = [], getfilesListEnd = [];
                    // 读取同一目录下的文件
                    // readFileList(__dirname, filesList);
                    // readFileList(TARGETS_DIRECTORY, filesList);
                    getfilesListEnd = readFileList(getChangeDirPath, getfilesList);
                    // getThis.cclog('[CC][✅]', 'getfilesListEnd=>', getfilesListEnd);
                    // getThis.cclog('[CC][✅]', '读取克隆的备份 .meta 文件列表=>\n', getfilesListEnd);
                    getThis.cclog('[CC][✅]', '读取到的 .meta 文件列表=' + getfilesListEnd.length + '=>\n', getfilesListEnd);
                    // 保存下当前的 UUID 列表
                    var openSortStringBool = false, saveWriteBool = false;
                    if (openSortStringBool) {
                        var saveMetaListArr = "";
                        for (var ii = 0; ii < getfilesListEnd.length; ii++) {
                            saveMetaListArr += getfilesListEnd[ii][0] + "<==>" + getfilesListEnd[ii][1] + "\n";
                        };
                        Fs.writeFileSync(outMsgFilePath, saveMetaListArr, 'utf8');
                    } else if (saveWriteBool) {
                        Fs.writeFileSync(outMsgFilePath, getfilesListEnd.toString(), 'utf8');
                    };
                };
            });
            // .then(() => {
            //     // 输出操作日志文件
            //     Fs.writeFileSync(outMsgFilePath, getAllMsgAndString, 'utf8');
            // });


            // setTimeout(() => {
            //     getThis.cclog('[CC][✅]', '全部的操作日志文件=>\n', getAllMsgAndString);
            //     // 输出操作日志文件
            //     Fs.writeFileSync(outMsgFilePath, getAllMsgAndString, 'utf8');
            // }, 2333 / 5);
        } catch (e) {
            this.cclog('[CC][❌]', '操作报错=>\n', e);
        };
    },
};

// 导出到混淆插件使用
module.exports = cc_deep_copy_meta;