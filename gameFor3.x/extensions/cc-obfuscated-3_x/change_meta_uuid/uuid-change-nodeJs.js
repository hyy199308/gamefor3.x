/*
 * @FilePath: uuid-change-nodeJs.js
 * @Author: koroFileHeader xx
 * @Date: 2022-11-02 09:53:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-11-24 23:30:37
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */

let uuidFilesChangeJS = require('./uuidFilesChange');
const fs = require('fs');
// let uuid = UuidUtils.compressUuid('828e3a11-866f-6072-8e21-b0ee02212269', false);
// console.log('uuidUtils -> 1:' + uuid + '   ' + uuid.length)
// console.log('uuidUtils -> 2:' + UuidUtils.decompressUuid('82jjoRhm9gco4hsO4CISJp'))
// console.log('uuidUtils -> 3:' + UuidUtils.uuidv1())
// console.log('uuidUtils -> 4:' + UuidUtils.isUuid('e5GCSOfC9HiKxCodlqmxZ1'))

// 资源管理注意事项 --- meta 文件
// https://docs.cocos.com/creator/manual/zh/asset/meta.html?h=meta

// Creator 内置的一些工具函数
// https://docs.cocos.com/creator/manual/zh/editor/extension/api/utils.html?h=uuid%20
// const uuid = Editor.Utils.UUID.compressUUID('7bf9df40-4bc9-4e25-8cb0-9a500f949102');  // "7bf9d9AS8lOJYywmlAPlJEC"
// const uuid = Editor.Utils.UUID.decompressUUID('7bf9d9AS8lOJYywmlAPlJEC');  // "7bf9df40-4bc9-4e25-8cb0-9a500f949102"

/**
 * .meta 文件 uuid 规则
 * "uuid": "828e3a11-866f-6072-8e21-b0ee02212269",
 * "rawTextureUuid": "828e3a11-866f-6072-8e21-b0ee02212269",
 * "textureUuid": "828e3a11-866f-6072-8e21-b0ee02212269",
 * Cocos 2.x 图片规则
 * "subMetas": {"项目内的图片.png": {"uuid": "828e3a11-866f-6072-8e21-b0ee02212269","rawTextureUuid": "828e3a11-866f-6072-8e21-b0ee02212269",}
 *
 * Cocos 3.x 图片规则
 * "subMetas": {
    "6c48a": {
      "importer": "texture",
      "uuid": "828e3a11-866f-6072-8e21-b0ee02212269@6c48a",
      "displayName": "Sprite-0005",
      "id": "6c48a",
      "name": "texture",
      "userData": { 
        "imageUuidOrDatabaseUri": "828e3a11-866f-6072-8e21-b0ee02212269",
        "isUuid": true, 
      "files": [
        ".json"
      ],
      "subMetas": {}
    },
    "f9941": {
      "importer": "sprite-frame",
      "uuid": "828e3a11-866f-6072-8e21-b0ee02212269@f9941",
      "displayName": "Sprite-0005",
      "id": "f9941",
      "name": "spriteFrame", 
        "isUuid": true,
        "imageUuidOrDatabaseUri": "828e3a11-866f-6072-8e21-b0ee02212269@6c48a",
        "atlasUuid": ""
      },
      "ver": "1.0.11",
      "imported": true,
      "files": [
        ".json"
      ],
      "subMetas": {}
    }
 */
// 改成用户输入文件夹的路径, 请记得输入完整路径 .../assets/...
var uuidFilePath = '';
// pkg -t win main.js
const readline = require("readline");
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
function cclog(...msg) {
  // console.log(BgBlack, FgGreen, ...msg, '\x1b[0m');
  // console.log(BgCyan, FgYellow, ...msg, '\x1b[0m');
  console.log(BgCyan, FgMagenta, ...msg, '\x1b[0m');
  // console.log(BgYellow, ...msg, '\x1b[0m');
};
// var testPath = "D:/assets/";
var testPath = "../assets_clone/assets.Clone.710b32/" || "D:/build/wechatgame";
// var getNewUUIDarr = uuidFilesChangeJS.updateAllFilesContainUuid(testPath);
// [【获取 .meta 的 UUID 】]
var getAllProjUpdateUuid = uuidFilesChangeJS.getProjMetaFileUuid(testPath);
// 获取 .meta 的所有的短码和长码
var getNewMetaUUIDarr = uuidFilesChangeJS.getAllMetaUUIDList();
// 创建一个崭新的组合式 uuid ,包括所有文件的长短码, 已过滤默认图片的 uuid
var startUpdateUuid = uuidFilesChangeJS.getAllCreateUUIDlist(testPath);
console.log("uuidFilesChangeJS getNewMetaUUIDarr=> " + Object.keys(getNewMetaUUIDarr).length + "\n", getNewMetaUUIDarr);
cclog("uuidFilesChangeJS getNewMetaUUIDarr=> \t" + Object.keys(getNewMetaUUIDarr).length + " =>> " + Object.values(getNewMetaUUIDarr).length + "\n");
fs.writeFileSync("./README_GET_ALL_UUID.json", JSON.stringify(getNewMetaUUIDarr, null, 2));
/**
 * 
// 获取所有的短码和长码
var getNewUUIDarr = uuidFilesChangeJS.getAllUUIDList();
console.log("uuidFilesChangeJS getNewUUIDarr=> " + Object.keys(getNewUUIDarr).length + "\n", getNewUUIDarr);
cclog("uuidFilesChangeJS getNewUUIDarr=> \t" + Object.keys(getNewUUIDarr).length + " =>> " + Object.values(getNewUUIDarr).length + "\n");
fs.writeFileSync("./README_GET_ALL_UUID.json", JSON.stringify(getNewUUIDarr, null, 2));
 */

// var deepDIR = require("deep-dir");
// deepDIR(testPath, (getFileItem) => {
//   cclog("[测试遍历文件夹】=》\n", [getFileItem, b, c, d]);
// });

var openInputBool = false;
if (openInputBool) {
  // 暂停再恢复, 防止过快闪过
  process.stdin.pause();
  process.stdin.resume();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("[CC][混淆xx][UUID] 请输入要更改 uuid 的文件夹的完整路径=", function (filesPath) {
    // rl.close();
    rl.question("[CC][混淆xx][UUID] 请确认是否更改! y 就是确定,n 是取消 \n(y 或者 n), 直接回车表示默认 y执行\n输入操作=", function (country) {
      // rl.close();
      cclog(FgCyan, BgMagenta, "[CC][混淆xx[UUID] 开始执行程序....");
      if (country == "y" || country == "") {
        uuidFilePath = filesPath;
        console.time("运行耗时");
        cclog(`输入文件路径= ${filesPath} \n 输入的操作指令= ${country}\n正在更改文件夹内所有文件的 UUID ......`);

        var changeBeforeUUID = uuidFilesChangeJS.getAllUUIDList();
        cclog("改前的 uuid =>\n", changeBeforeUUID);
        var openBestReplaceBool = !true;
        if (openBestReplaceBool) {
          // 高效率读写拼接所有的 UUID , 容易重名
          // uuidFilesChangeJS.updateAllFilesContainUuid(uuidFilePath);
          var testPath = "../assets_clone/assets.Clone.799d79/prefabs" || "D:/prefabs";
          uuidFilesChangeJS.updateAllFilesContainUuid(testPath);
        } else {
          // 开始更改文件目录
          uuidFilesChangeJS.getAllCreateUUIDlist(uuidFilePath);
          var isnRegOpenBool = (country != "y") ? (true) : (false);
          uuidFilesChangeJS.replaceUUID(uuidFilePath, isnRegOpenBool);
        };
        var changeAfterUUID = uuidFilesChangeJS.getAllUUIDList();
        cclog("改后的 uuid =>\n", changeAfterUUID);
      } else {
        cclog(`输入文件路径= ${filesPath} \n 输入的操作指令= ${country}\n已取消操作!!!\n已取消操作!!!\n已取消操作!!!`);
      };
      rl.close();
    });
  });

  rl.on("close", function () {
    // cclog("\n[CC][混淆xx[UUID] 执行完毕, 正在退出程序....");
    console.timeEnd("运行耗时");
    cclog(FgYellow, BgBlue, "[CC][混淆xx[UUID] 执行完毕, 正在退出程序....");
    process.exit(0);
  });
};



