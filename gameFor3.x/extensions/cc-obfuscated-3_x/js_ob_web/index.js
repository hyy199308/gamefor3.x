/*
 * @FilePath: index.js
 * @Author: koroFileHeader xx
 * @Date: 2022-12-03 16:20:50
 * @LastEditors: fileheader
 * @LastEditTime: 2022-12-07 13:14:21
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const fs_extra_1 = require("fs-extra");
const fs_extra_1 = require("fs");
const path_1 = require("path");

// npm i browser-sync
// npm install express -g
const getExpress = require('express');
const expApp = getExpress();
// const { webContents } = require('electron');
const node_exec = require('child_process').exec;

var showHttpDir = path_1.join(__dirname, '');
var serverPortNum = 1355;
expApp.use(getExpress.static(showHttpDir));

expApp.listen(serverPortNum, () => {
    console.log('[CC][混淆][✅][🤔] 已启动本地服务器::=>\n', "http://localhost:" + serverPortNum + "/jsObindex.html", "http://127.0.0.1:" + serverPortNum + "/jsObindex.html");
});

/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() {
            // console.log('[😉][CC][混淆] 显示面板');
        },
        hide() {
            // console.log('[😑][CC][混淆] 隐藏面板');
        },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, './index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, './index.css'), 'utf-8'),
    $: {
        app: '#app',
        cc_openSiglePage: "#openSiglePage",
        cc_sys_openURL_btn: "#openURL_btn",
    },
    methods: {
        hello() {
            // if (this.$.app) {
            //     this.$.app.innerHTML = 'hello';
            //     console.log('[cocos-panel-html.default]: hello');
            // };
        },
    },
    ready() {
        console.log("[CC][混淆][✅]" + "已打开自定义混淆参数的 JS 代码混淆面板 ");

        this.$.cc_sys_openURL_btn.addEventListener('confirm', () => {
            var jump_url = "http://127.0.0.1:1355/jsObindex.html";
            // const options = { extraHeaders: 'pragma: no-cache\n' };
            // webContents.loadURL('http://127.0.0.1:1355/', options);
            console.log("[CC][混淆][✅] 正在跳转到浏览器=>\n", jump_url);
            node_exec('start http://127.0.0.1:1355/jsObindex.html');
        });
        this.$.cc_openSiglePage.addEventListener('confirm', () => {
            console.log("[CC][混淆][✅] 正在打开独立窗口");
            // window.open("http://127.0.0.1:1355/", "_blank");
            // window.open("http://127.0.0.1:1355/", "_self");
            // window.open("http://127.0.0.1:1355/");

            // 仅可独立多开一个窗口
            // window.open("http://127.0.0.1:1355/", "_blank", "fullscreen:yes,width:1280,height:1280,top:0,left:0,menubar:no,location:no,resizable:yes,channelmode:yes,directories:yes,scrollbars:no,status:no,titlebar:no");

            // 可多开任意多个窗口
            window.open("http://127.0.0.1:1355/jsObindex.html");

            // open(url?: string | URL | undefined, target?: string | undefined, features?: string | undefined): Window | null
            // URL	可选。打开指定的页面的URL。如果没有指定URL，打开一个新的空白窗口
            // name	可选。指定target属性或窗口的名称。支持以下值：
            // _blank - URL加载到一个新的窗口。这是默认
            // _parent - URL加载到父框架
            // _self - URL替换当前页面
            // _top - URL替换任何可加载的框架集
            // name - 窗口名称
            // specs	可选。一个逗号分隔的项目列表。支持以下值：

            // channelmode=yes|no|1|0	是否要在影院模式显示 window。默认是没有的。仅限IE浏览器
            // directories=yes|no|1|0	是否添加目录按钮。默认是肯定的。仅限IE浏览器
            // fullscreen=yes|no|1|0	浏览器是否显示全屏模式。默认是没有的。在全屏模式下的 window，还必须在影院模式。仅限IE浏览器
            // height=pixels	窗口的高度。最小.值为100
            // left=pixels	该窗口的左侧位置
            // location=yes|no|1|0	是否显示地址字段.默认值是yes
            // menubar=yes|no|1|0	是否显示菜单栏.默认值是yes
            // resizable=yes|no|1|0	是否可调整窗口大小.默认值是yes
            // scrollbars=yes|no|1|0	是否显示滚动条.默认值是yes
            // status=yes|no|1|0	是否要添加一个状态栏.默认值是yes
            // titlebar=yes|no|1|0	是否显示标题栏.被忽略，除非调用HTML应用程序或一个值得信赖的对话框.默认值是yes
            // toolbar=yes|no|1|0	是否显示浏览器工具栏.默认值是yes
            // top=pixels	窗口顶部的位置.仅限IE浏览器
            // width=pixels	窗口的宽度.最小.值为100

            // replace	Optional.Specifies规定了装载到窗口的 URL 是在窗口的浏览历史中创建一个新条目，还是替换浏览历史中的当前条目。支持下面的值：
            // true - URL 替换浏览历史中的当前条目。
            // false - URL 在浏览历史中创建新的条目。

            // cc.sys.open("http://127.0.0.1:1355/");
        });

    },
    beforeClose() { },
    close() { },
});
