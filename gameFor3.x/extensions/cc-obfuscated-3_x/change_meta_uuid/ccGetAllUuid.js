/*
 * @FilePath: ccGetAllUuid.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-27 09:41:13
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-07 23:21:23
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
const exec = require('child_process').exec;
const GETcc_set_get_uuid = require('./setUuidGetUid22');
let uuidFilesChangeJS = require('./uuidFilesChange');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let prsPath = "D:/workCocosCreator_Proj/cc_3dProjs/CC-2.4/cc-2.3.4-all-simp";
let nowTimeMins = new Date().getTime() + 142857;
//源目录
let SOURCES_DIRECTORY = prsPath + "/assets";
//获取文件的后缀名
var extname = reqPath.extname(SOURCES_DIRECTORY);
// 只复制指定的  ".meta" 文件, 其它的都不要, 保留文件的原始目录结构 dir 
let saveFileDir = true, saveExtenName = ".meta" || ".ts" || ".js", projName1 = ".anim", projName0 = ".json", projName2 = ".fire", projName3 = ".prefab", projName4 = ".mtl",
    dontSaveFileName = [".font", ".mp3", ".wav", ".exe", ".aspx", ".fnt", ".json", ".assets", ".xml", ".resS", ".map", ".config", ".browser", ".resource", ".meta", ".jpg", ".png", ".unity", ".mat", ".asset", ".lighting", ".csproj", ".gitignore", ".user", ".DotSettings"];
var readDirPath = SOURCES_DIRECTORY || "";
var startUpdateUuid = uuidFilesChangeJS.getAllCreateUUIDlist(readDirPath);
var getNewUUIDarr = uuidFilesChangeJS.getAllUUIDList();
// console.log('[CC][✅]', '已读取到的 .meta 文件列表[长短码]=> \n共计= ' + Object.keys(getNewUUIDarr).length + ' 个 =>\n', getNewUUIDarr);
console.log('[CC][✅]', '已读取到的 .meta 文件列表[长短码]=> \n共计= ' + Object.keys(getNewUUIDarr).length + ' 个 =>\n');
// 格式化保存
Fs.writeFileSync("./README_GET_ALL_UUID.json", JSON.stringify(getNewUUIDarr, null, 2));
// 压缩成一行
// Fs.writeFileSync("./README_GET_ALL_UUID.json", JSON.stringify(getNewUUIDarr));
