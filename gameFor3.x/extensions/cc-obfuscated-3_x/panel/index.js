/*
 * @Author: your name
 * @Date: 2022-04-24 09:28:14
 * @LastEditTime: 2022-10-28 14:40:39
 * @LastEditors: fileheader
 * @Description: 打开koroFileHeader查看配置
 * @FilePath: index.js
 */
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const Fs = require('fs');
// const { shell } = require('electron');

var path_1 = __importStar(require("path"));

module.exports = Editor.Panel.define({
  listeners: {
    show: function () { console.log('显示面板'); },
    hide: function () { console.log('隐藏面板'); },
  },
  // template: Fs.readFileSync(Editor.url('packages://cc-obfuscated-3_x/panel/index.html'), 'utf8'),
  // style: Fs.readFileSync(Editor.url('packages://cc-obfuscated-3_x/panel/index.css'), 'utf8'),
  // template: Fs.readFileSync(path_1.join(__dirname, './index.html'), 'utf8'),
  // style: Fs.readFileSync(path_1.join(__dirname, './index.css'), 'utf8'),
  // style: Fs.readFileSync(path_1.join(__dirname, './preview/toc/index.css'), 'utf8'),

  // style: Fs.readFileSync(path_1.join(__dirname, './index.css'), 'utf8'),
  // template: Fs.readFileSync(path_1.join(__dirname, './README.html'), 'utf8'),

  style: Fs.readFileSync(path_1.join(__dirname, './index.css'), 'utf8'),
  template: Fs.readFileSync(path_1.join(__dirname, './index.html'), 'utf8'),
  $: {
    app: '#app',
    text: '#titleText',
    getPath: '#getFilePath',
    getType: '#getObType',
    beginOb: '#startEncodeJsBtn',
  },
  // async ready: function () {
  async ready() {
    console.log("[CC]", "[✅]" + "已打开手动选择 .js 文件混淆面板");

    this.$.beginOb.addEventListener('confirm', () => {
      // console.log("开始混淆 JS 代码 =>", [this.$.getPath.value, this.$.getType.value]);
      // (this.$.getPath.value.split(".js").length > 0)
      // if (strRegex.test(str.toLowerCase())){
      var strRegexJS = /\.(js)$/;
      var getThePath = this.$.getPath.value;
      if ((getThePath.length > 0) && (getThePath.match(".js")) && strRegexJS.test(getThePath)) {
        // 'AST' 'JSob'
        var obMixType = '[AST]', obMixTypePost = "AST";
        if (this.$.getType.value == "AST") {
          obMixType = '[AST]'; obMixTypePost = "AST";
        } else if (this.$.getType.value == "JSob") {
          obMixType = '[JS-Ob]'; obMixTypePost = "JSob";
        };
        // console.log("[CC]", "[✅]" + obMixType + " 正在开始混淆 JS 代码=>\n", [getThePath.match(".js"), getThePath]);
        console.log("[CC]", "[✅]" + obMixType + " 正在开始混淆 JS 代码=>\n",
          [obMixTypePost, getThePath]);

        // 发送全局事件, 开始混淆
        var paramsObj = {
          path: getThePath || "",
          type: obMixTypePost || "AST",
        };
        Editor.Message.send('cc-obfuscated-3_x', 'selectAST_jsOb', paramsObj);
      } else {
        // ✅☑✔✖❌❎➕➖➗
        console.error("[CC]", "[❌]" + " 请选择一个需要混淆的 JS 文件 !");
      };
    });

    // if (this.$.app) {
    //   // console.log("混淆代码 => ready load =>", this.$.app);
    // } else {
    //   // console.log("混淆代码 =1> window.Vue =>", window.Vue);
    // };

    // this.$.zipRateSlider.value = parseInt(await Editor.Profile.getConfig(packageCfg.name, 'zipRate')) || 30;
    // this.$.zipModeTab.value = await getMode();
    // this.$.zipModeTab.value == 1 ? this.$.zipRateSlider.disabled = true : this.$.zipRateSlider.removeAttribute('disabled');
    // this.$.zipModeTab.addEventListener('click', () => {
    //   let mode = this.$.zipModeTab.value;
    //   if (!tools.isX64() && mode == 0) {
    //     this.$.zipModeTab.value = 1;
    //     this.$.zipRateSlider.disabled = true
    //     alert('CPU不支持该模式');
    //   } else {
    //     this.$.zipModeTab.value == 1 ? this.$.zipRateSlider.disabled = true : this.$.zipRateSlider.removeAttribute('disabled');
    //     saveConfig(this.$);
    //   }
    // }, 0);
    // this.$.saveBtn.addEventListener('click', () => {
    //   console.log("packageCfg.name 保存成功==", [packageCfg.name, Editor.Profile]);
    //   console.log("packageCfg 保存成功==", [packageCfg]);
    //   saveConfig(this.$);
    // }, 0);

    // console.log("混淆代码 =2> Vue =>", Vue); 
  },
  beforeClose: function () { },
  close: function () { },
});