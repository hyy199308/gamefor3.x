/*
 * @FilePath: deepToCopyFileJs.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-27 09:41:13
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-03 11:33:00
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

/**
 * 共有的日志输出函数
 * @param  {...any} msg 多个日志内容 
 */
function clog(...msg) {
    console.log(...msg);
};
console.time("代码执行总耗时");

const fs = require("fs");
const reqPath = require("path");
const req_md5 = require("md5");

let nowTimeMins = new Date().getTime() + 142857;
let sourceDir = "Assets" || "./unityAssets";
let targetDir = sourceDir + ".Clone" || "Assets.Clone" || "./unityAssets_clone";
//源目录
let SOURCES_DIRECTORY = sourceDir || "Assets" || "./unityAssets1";
let TARGETS_DIRECTORY = SOURCES_DIRECTORY + ".Clone" || "Assets.Clone" || "./unityAssets_clone";
let getAllMsgAndString = "", outMsgFilePath = "./README-操作日志记录.txt";
//获取文件的后缀名
var extname = reqPath.extname(sourceDir);
// 只复制指定的  ".dll",  .cs 文件, 其它的都不要, 保留文件的原始目录结构 dir 
let saveFileDir = true, saveExtenName = ".meta" || ".dll" || ".cs" || ".unity",
    dontSaveFileName = [".font", ".mp3", ".wav", ".exe", ".aspx", ".assets", ".xml", ".resS", ".map", ".config", ".browser", ".resource", ".meta", ".jpg", ".png", ".unity", ".mat", ".asset", ".lighting", ".csproj", ".gitignore", ".user", ".DotSettings"];
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
    // clog("getNowTimeNum=>", getNowTimeNum);
    var nowTimeMd5 = function_md5(getNowTimeNum);
    // clog("nowTimeMd5=>", nowTimeMd5);
    var getTimeMd5Val = getMd5_length(nowTimeMd5, 6);
    // clog("getTimeMd5Val=>", getTimeMd5Val);
    return getTimeMd5Val;
};

// 标记个 md5 的值, 让复制的文件夹不重名
targetDir += "." + getNowTimeMd5();
TARGETS_DIRECTORY += "." + getNowTimeMd5();
// 复制文件夹
// clog("[" + getNowRandTime() + "] 开始\n复制文件夹=>" + sourceDir + "\n复制到=>", targetDir);
clog("[" + getNowRandTime() + "] 开始\n复制文件夹=>" + SOURCES_DIRECTORY + "\n复制到=>", TARGETS_DIRECTORY);


// nodejs 拷贝目录下所有文件 目录
var deepCopy = function (srcPath, dstPath) {
    let paths = fs.readdirSync(srcPath); //同步读取当前目录
    paths.forEach(function (path) {
        var _srcPath = srcPath + '/' + path;
        var _dstPath = dstPath + '/' + path;
        // extname = reqPath.extname(srcPath);
        fs.stat(_srcPath, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;
            // extname = reqPath.extname(srcPath);
            // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
            // getAllMsgAndString += "\n复制 deepCopy forEach stat extname 文件的后缀名=>\n" + srcPath + "\n" + dstPath + "\n" + extname + "\n\n";
            // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";

            if (stats.isFile()) { //如果是个文件则拷贝 

                extname = reqPath.extname(_srcPath);
                // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
                // getAllMsgAndString += "\n复制 deepCopy forEach stat extname 文件的后缀名=>\n" + _srcPath + "\n" + srcPath + "\n" + dstPath + "\n" + extname + "\n\n";
                // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
                // getAllMsgAndString += "\n复制 deepCopy forEach stat extname 文件的后缀名=>\n" + _srcPath + "\n" + srcPath + "\n" + dstPath + "\n" + extname + "\n\n";
                // 这个日志就不输出了, 都是过滤掉的文件类型
                // getAllMsgAndString += "\n复制 deepCopy forEach stat extname 文件的后缀名=>\n" + _srcPath + "\n" + extname + "\n\n";
                /**
                 * // 单层目录的读取
                 * copyFolder(_srcPath, _dstPath);
                 */
                // 根据规定保存指定后缀名类型的文件
                if (saveFileDir) {
                    var isCanSave = true;
                    for (var ii = 0; ii < dontSaveFileName.length; ii++) {
                        if (dontSaveFileName[ii] == extname) {
                            isCanSave = false;
                        };
                    };
                    if (isCanSave) {
                        getAllMsgAndString += "\n" + _srcPath + "\t 复制 deepCopy forEach stat [复制子文件] extname 文件的后缀名=> \t" + extname + "\n";
                        let readable = fs.createReadStream(_srcPath);//创建读取流
                        let writable = fs.createWriteStream(_dstPath);//创建写入流
                        readable.pipe(writable);
                    };
                } else {
                    // 这样写就没有文件目录的文件夹了
                    if (extname == saveExtenName) {
                        getAllMsgAndString += "\n" + _srcPath + "\t 复制 deepCopy forEach stat [复制子文件] extname 文件的后缀名=> \t" + extname + "\n";
                        let readable = fs.createReadStream(_srcPath);//创建读取流
                        let writable = fs.createWriteStream(_dstPath);//创建写入流
                        readable.pipe(writable);
                    };
                };

                // // 全部保存
                // let readable = fs.createReadStream(_srcPath);//创建读取流
                // let writable = fs.createWriteStream(_dstPath);//创建写入流
                // readable.pipe(writable);
            } else if (stats.isDirectory()) { //是目录则 递归 
                checkDirectory(_srcPath, _dstPath, deepCopy);
            }
        });
    });
};
var checkDirectory = function (srcPath, dstPath, callback) {
    extname = reqPath.extname(srcPath);
    // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
    // getAllMsgAndString += "\n复制 checkDirectory extname 文件的后缀名=>\n" + extname + "\n\n";
    // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
    fs.access(dstPath, fs.constants.F_OK, (err) => {
        if (err) {
            // extname = reqPath.extname(srcPath);
            // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
            // getAllMsgAndString += "\n复制 checkDirectory extname 文件的后缀名=>\n" + srcPath + "\n" + dstPath + "\n" + extname + "\n\n";
            // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
            fs.mkdirSync(dstPath);
            callback(srcPath, dstPath);
        } else {
            callback(srcPath, dstPath);
        }
    });
};
// __dirname 是放在同路径下
// checkDirectory(SOURCES_DIRECTORY, __dirname, deepCopy);
checkDirectory(SOURCES_DIRECTORY, TARGETS_DIRECTORY, deepCopy);

clog("正在写入操作日志文件....");
setTimeout(() => {
    // 写入操作日志文件
    fs.writeFileSync(outMsgFilePath, getAllMsgAndString, 'utf8');
}, 1233 / 5);


console.timeEnd("代码执行总耗时");




















// /**
//  * 读取文件目录, 开始复制文件
//  * @param {*} srcPath 传入路径
//  * @param {*} tarPath 复制的新路径
//  * @param {*} cb 执行函数
//  */
// var copyFolder = (srcDir, tarDir, cb) => {
//     var isExit = fs.existsSync(tarDir);
//     // //获取文件的后缀名
//     // extname =reqPath.extname(tarDir);

//     // //打印出来
//     // // clog("文件的后缀名=>" + extname);
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     // getAllMsgAndString += "\n复制 copyFolder extname 文件的后缀名=>\n" + extname + "\n\n";
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";

//     // 创建目录文件
//     if (!isExit) {
//         // clog("复制 copyFolder=>", [isExit, tarDir]);
//         // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//         // getAllMsgAndString += "\n复制 copyFolder=>\n" + isExit + "\n" + tarDir + "\n\n";
//         // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//         fs.mkdirSync(tarDir, 777);
//     };
//     fs.readdir(srcDir, function (err, files) {
//         if (err) {
//             // clog("复制 copyFolder readdir=>", [srcDir, err, files]);
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//             // getAllMsgAndString += "\n复制 copyFolder readdir=>\n" + srcDir + "\n" + err + "\n" + files + "\n\n";
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//             return;
//         };
//         files.forEach((file) => {
//             var srcPath = path.join(srcDir, file);
//             var tarPath = path.join(tarDir, file);
//             // clog("复制 copyFolder forEach=>", [srcDir, file, files]);
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//             // getAllMsgAndString += "\n复制 copyFolder forEach=>\n" + srcDir + "\n" + file + "\n" + files + "\n\n";
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";

//             fs.stat(srcPath, (err, stats) => {
//                 extname = reqPath.extname(srcPath);
//                 getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//                 getAllMsgAndString += "\n复制 copyFolder readdir forEach stat extname 文件的后缀名=>\n" + extname + "\n" + srcPath + "\n" + tarPath + "\n\n";
//                 getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";

//                 // clog("复制 copyFolder stat=>", [stats, srcPath, tarPath]);
//                 // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//                 // getAllMsgAndString += "\n复制 copyFolder stat=>\n" + stats + "\n" + srcPath + "\n" + tarPath + "\n\n";
//                 // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";

//                 if (stats.isDirectory()) {
//                     fs.existsSync(tarPath)
//                         ? copyFolder(srcPath, tarPath)
//                         : fs.mkdirSync(tarPath, 777) && copyFolder(srcPath, tarPath);
//                 } else {
//                     extname = reqPath.extname(srcPath);

//                     if (saveFileDir) {
//                         var isCanSave = true;
//                         for (var ii = 0; ii < dontSaveFileName.length; ii++) {
//                             if (dontSaveFileName[ii] == extname) {
//                                 isCanSave = false;
//                             };
//                         };
//                         if (isCanSave) {
//                             signCopyFile(srcPath, tarPath);
//                         };
//                     } else {
//                         // 这样写就没有文件目录的文件夹了
//                         if (extname == saveExtenName) {
//                             signCopyFile(srcPath, tarPath);
//                         };
//                     };
//                 };
//             });
//         });

//         //为空时直接回调
//         files.length === 0 && cb && cb();
//     });
// };
// /**
//  * 复制传入文件夹目录的文件, 不进行递归深入的 !
//  * @param {*} srcPath 传入路径
//  * @param {*} tarPath 复制的新路径
//  * @param {*} cb 执行函数
//  */
// var signCopyFile = function (srcPath, tarPath, cb) {
//     // 只复制指定的后缀名的文件, 其它文件不复制
//     // dontSaveFileName
//     extname = reqPath.extname(srcPath);
//     getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     getAllMsgAndString += "\n复制 signCopyFile extname 文件的后缀名=>\n" + extname + "\n\n";
//     getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";


//     var rs = fs.createReadStream(srcPath);
//     // clog("复制 signCopyFile createReadStream rs=>", [rs, srcPath, tarPath]);
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     // getAllMsgAndString += "\n复制 signCopyFile createReadStream rs=>\n" + rs + "\n" + srcPath + "\n" + tarPath + "\n\n";
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     rs.on("error", function (err) {
//         if (err) {
//             console.log("read error", srcPath);
//         };
//         cb && cb(err);
//     });

//     var ws = fs.createWriteStream(tarPath);
//     // clog("复制 signCopyFile createWriteStream ws=>", [ws, srcPath, tarPath]);
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     // getAllMsgAndString += "\n复制 signCopyFile createWriteStream ws=>\n" + ws + "\n" + srcPath + "\n" + tarPath + "\n\n";
//     // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//     ws.on("error", function (err) {
//         if (err) {
//             console.log("write error", tarPath);
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//             // getAllMsgAndString += "\n复制 signCopyFile createWriteStream ws error=>\n" + err + "\n" + srcPath + "\n" + tarPath + "\n\n";
//             // getAllMsgAndString += "\n/////////////////////////////////////////////////////////////////////////////////////////////////";
//         };
//         cb && cb(err);
//     });
//     ws.on("close", function (ex) {
//         cb && cb(ex);
//     });
//     rs.pipe(ws);
// };

// // 单层目录的读取
// copyFolder(sourceDir, targetDir);
// if (fs.existsSync(outMsgFilePath)) {
//     // 写入操作日志文件
//     fs.writeFileSync(outMsgFilePath, getAllMsgAndString, 'utf8');
// };
