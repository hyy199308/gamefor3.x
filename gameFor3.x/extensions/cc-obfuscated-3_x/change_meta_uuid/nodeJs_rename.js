/*
 * @FilePath: nodeJs_rename.js
 * @Author: koroFileHeader xx
 * @Date: 2022-11-23 09:53:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-24 19:10:45
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion:  
 */
const fs = require("fs");
const readGetPath = require("path");
let allFilesPath = 'D:/cocosEditor/cc_workPro/renameFilesPath';
// // 判断是不是文件夹, 是就传入数据
// var fsStats = fs.statSync("renameFilesPath.ts");
// if (fsStats.isFile()) {
//     // rootFileList.push(files);
//     console.log("isFile=>\n");
// } else if (fsStats.isDirectory()) {
//     // rootDirList.push(files);
//     console.log("isDirectory=>\n");
// };
/**
 * 重命名文件夹或者文件, 准备后续拓展使用在构建后改 uuid 的 md5 名称 .
 * @param {*} postFilesPathName 文件夹名字或者文件名字
 */
function renamerFiles(postFilesPathName) {
    let oldPath = postFilesPathName;
    // 直接获取文件名称, 指定字符修改
    let newPath = readGetPath.basename(oldPath) || oldPath;
    // // 如果是数字开头的, 改用字母开头
    newPath = newPath.replace(/[0-9]{1}/i, 'A');
    // 去除所有的 "-" 的文件名称
    newPath = newPath.replace(/\-/g, '_');
    // 替换去除所有的 "副本" 字样名称(复制文件就会出现)
    newPath = newPath.replace(/副本/g, 'BeiFen');
    newPath = newPath.replace(new RegExp('副本', 'g'), 'BeiFen');
    // 去除文件名称中所有的空格符
    newPath = newPath.replace(/ /g, '');
    newPath = newPath.replace(/\s/g, '');
    newPath = readGetPath.join(readGetPath.dirname(oldPath), newPath);
    fs.rename(oldPath, newPath, function (err) {
        if (!err) {
            console.log("改名完毕=>\n", readGetPath.basename(newPath));
        } else {
            console.log("执行报错=>\n", err);
        };
    });
};

/**
 * 递归读取文件夹内容
 * @param {*} srcPath 传入路径
 */
var startDeepReadPath = function (srcPath, pathList) {
    let getpaths = fs.readdirSync(srcPath); //同步读取当前目录
    getpaths.forEach(function (item, index) {
        var nowPath = readGetPath.join(srcPath, item);
        var fsStats = fs.statSync(nowPath);
        if (fsStats.isFile()) {
            // 仅递归遍历文件夹, 文件不需要递归
            pathList.push(nowPath);
            console.log("已读取到文件=> ", readGetPath.basename(nowPath));
        } else if (fsStats.isDirectory()) {
            // 递归遍历文件夹
            // 暂时不改文件夹的名字
            // pathList.push(nowPath);
            startDeepReadPath(nowPath, pathList);
        };
    });

    // 测试代码 1
    // let getpaths = fs.readdirSync(srcPath); //同步读取当前目录
    // getpaths.forEach(function (item, index) {
    //     console.log(1, item);
    //     fs.stat(item, function (err, stats) {
    //         console.log(2, stats);
    //     });

    //     var fsStats = fs.statSync(getPath.join(srcPath, item));
    //     if (fsStats.isFile()) {
    //         getpaths.push(item);
    //     } else if (fsStats.isDirectory()) {
    //         getpaths.push(item);
    //     };
    // });

    // 测试代码 2
    // getpaths.forEach(function (pathItem) {
    //     var _srcPath = srcPath + '/' + pathItem;
    //     // var fsStats = fs.statSync(_srcPath);
    //     var fsStats = fs.statSync(_srcPath);
    //     if (fsStats.isFile()) {
    //         // console.log("isFile=>\s", fsStats['birthtime']);
    //     } else if (fsStats.isDirectory()) {
    //         // console.log(_srcPath, getpaths, "\tisDirectory=>\s", fsStats.mtime);
    //         // console.log(pathItem, "\tisDirectory=>\s", fsStats.mtime);
    //         console.log(pathItem, "\t isDirectory=> ", fsStats);
    //     };
    // });
};
var getPathList = [];
startDeepReadPath(allFilesPath, getPathList);
// 开始重命名
getPathList.forEach((item, ind, arr) => {
    renamerFiles(item);
    // console.log(ind,"重命名=>", [item, ind, arr.length]);
});

let isSignReadFilePath = false;
if (isSignReadFilePath) {
    // 单层读取更改文件名称
    fs.readdir(allFilesPath, function (err, files) {
        files.forEach(function (filename, index, postArray) {
            let oldPath = allFilesPath + '/' + filename;

            // let newPath = oldPath.replace(/\Zh[0-9]*\_/g, 'Zh1_');
            // let newPath = oldPath.replace(/[0-9]*\_/g, 'n');
            // console.log("newPath=0=>",getPath.basename(newPath));
            // 直接获取文件名称, 指定字符修改
            let newPath = readGetPath.basename(oldPath) || oldPath;
            // // 如果是数字开头的, 改用字母开头
            newPath = newPath.replace(/[0-9]{1}/i, 'A');
            // 去除所有的 "-" 的文件名称
            newPath = newPath.replace(/\-/g, '_');
            // 替换去除所有的 "副本" 字样名称(复制文件就会出现)
            newPath = newPath.replace(/副本/g, 'BeiFen');
            // console.log("newPath=1=>",getPath.basename(newPath));
            newPath = newPath.replace(new RegExp('副本', 'g'), 'BeiFen');
            // console.log("newPath=2=>",newPath);
            // console.log("newPath=2=>",getPath.basename(newPath));
            // 去除文件名称中所有的空格符
            newPath = newPath.replace(/ /g, '');
            newPath = newPath.replace(/\s/g, '');
            // End 替换文件名称 dirname extname
            // newPath = getPath.dirname(oldPath) + "/renameFilesPath/" + newPath;
            newPath = readGetPath.join(readGetPath.dirname(oldPath), newPath);
            // console.log("newPath=3=>",getPath.basename(newPath),"\n",oldPath,"\n",newPath);
            // console.log(getPath.basename(oldPath), '---------->>', getPath.basename(newPath));
            // console.log(oldPath, '---------->>', newPath);
            fs.rename(oldPath, newPath, function (err) {
                if (!err) {
                    // console.log("修改完成-文件名=>\noldPath=" + oldPath + "\nnewPath=" + newPath + "\nfilename=" + filename + '\n!')
                    // console.log("修改完成-文件名=>\noldPath=" + "\nfilename=" + filename + '\n!');
                    console.log(readGetPath.basename(newPath) + "\t<=修改完成-" + index + "-" + postArray.length + "文件名=>\s\t" + readGetPath.basename(newPath) + "\n");
                    if (index == postArray.length - 1) {
                        console.log("改名完毕=>\n", postArray);
                    };
                } else {
                    console.log("执行报错=>\n", err);
                };
            });
        });
    });
};