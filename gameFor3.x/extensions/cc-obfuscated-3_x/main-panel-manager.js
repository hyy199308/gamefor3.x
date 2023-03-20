/*
 * @FilePath: main-panel-manager.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-06 17:04:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-10-20 13:26:45
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
const { BrowserWindow } = require('electron');
const { join } = require('path');
const { language, translate } = require('./typings/editor-main-util');
const { calcWindowPositionByFocused } = require('./typings/window-util');

/** 扩展名称 */
const EXTENSION_NAME = translate('name');

/**
 * 面板管理器 (主进程)
 */
const PanelManager = {
    /**
     * 面板实例
     * @type {BrowserWindow}
     */
    settings: null,
    /**
     * 打开设置面板-详情介绍
     */
    openSettingsDetailPanel() {
        // console.log("into openSettingsPanel 已打开则直接展示", 111111);
        // return;
        // 已打开则直接展示
        if (PanelManager.settings) {
            PanelManager.settings.show();
            return;
        }
        // 窗口尺寸和位置（macOS 标题栏高 28px）
        const winSize = [620, 910] || [856, 948], minWh = [620, 620],
            winPos = calcWindowPositionByFocused(winSize, 'center');
        // 创建窗口
        const win = PanelManager.settings = new BrowserWindow({
            width: winSize[0],
            height: winSize[1],
            minWidth: minWh[0],
            minHeight: minWh[1],
            x: winPos[0],
            y: winPos[1] + winSize[1] / 3 || winPos[1] - 100,
            frame: true,
            title: `${EXTENSION_NAME} | Cocos Creator`,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: false,
            alwaysOnTop: true,
            hasShadow: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // 就绪后（展示，避免闪烁）
        win.on('ready-to-show', () => win.show());
        // 关闭后
        win.on('closed', () => (PanelManager.settings = null));
        // 监听按键
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') PanelManager.closeSettingsPanel();
        });
        // 调试用的 devtools
        // win.webContents.openDevTools({ mode: 'detach' });
        // 加载页面
        const path = join(__dirname, './panel/README.html');
        // const path = join(__dirname, './panel/index.html');
        // console.log("get path=>", path);

        // win.loadURL(`file://${path}?lang=${language}`);
        win.loadURL(`file://${path}`);
    },

    /**
     * 关闭面板
     */
    closeSettingsPanel() {
        if (!PanelManager.settings) {
            return;
        }
        PanelManager.settings.hide();
        PanelManager.settings.close();
        PanelManager.settings = null;
    },

    /**
     * 放置默认的混淆参数, 方便调用
     */
    set_obfus_obj: {
        defaultConfig: {
            // 加入 AST 抽象语法树结构体函数+变量混淆(完善中)
            // 类型： boolean   默认值： true
            "autoAstObfusJs": true,

            // 自动混淆构建目录下的所有的 JSON 文件(采用 Unicode 编码形式, 其实还是能读取出来, 供参考吧)
            // 类型： boolean   默认值： true
            "autoObfusJson": true,

            // 紧凑的代码输出在一行上
            // 类型： boolean   默认值： true
            "compact": true,

            // 启用代码控制流扁平化。控制流扁平化是一种阻碍程序理解的源代码结构转换
            // 此选项极大地影响性能，运行时速度降低 1.5 倍。
            // 用于 controlFlowFlatteningThreshold 设置受控制流扁平化影响的节点百分比
            // 类型： boolean   默认值： false
            "controlFlowFlattening": false,

            // 此设置对于较大的代码量特别有用，因为大量的控制流转换会减慢您的代码并增加代码量
            // 类型：number   默认值： 0.75 最小值： 0 最大值： 1
            "controlFlowFlatteningThreshold": 0.75,

            // 显着增加混淆代码的大小（高达 200%），仅在混淆代码的大小无关紧要时使用
            // 用于 deadCodeInjectionThreshold 设置受死代码注入影响的节点百分比
            // 此选项强制启用 stringArray 选项。使用此选项，死代码的随机块将被添加到混淆代码中
            // 类型： boolean  默认值： false
            "deadCodeInjection": false,

            // 允许设置受 deadCodeInjection
            // 类型： number  默认值： 0.4 最小值： 0 最大值： 1
            "deadCodeInjectionThreshold": 0.4,

            // 禁止使用浏览器的 debugger 开发工具的功能(反调试)
            // 类型： boolean   默认值： false
            "debugProtection": true,

            // 此项会在进入开发者模式时卡住浏览器， 请谨慎使用
            // 如果设置，则以毫秒为单位的间隔用于强制控制台选项卡上的调试模式，
            // 从而更难使用开发人员工具的其他功能。如果 debugProtection 启用则工作。
            // 推荐值介于 2000 和 4000 毫秒之间
            // 类型： number|boolean   默认值： 0 || false
            "debugProtectionInterval": true,

            // 禁用 console.log , console.info , console.error , console.warn , 
            // console.debug , console.exception 和 console.trace 用空函数替换它们。
            // 这使得浏览器的调试器使用更加困难
            // 此选项 console 全局禁用所有脚本的调用
            // 类型： boolean   默认值： false
            "disableConsoleOutput": true,

            // 允许仅在特定域和/或子域上运行经过混淆的源代码。
            // 这使得人们很难复制和粘贴您的源代码并在其他地方运行它。
            // 如果源代码未在此选项指定的域上运行，
            // 浏览器将被重定向到传递给 domainLockRedirectUrl 选项的 URL。
            // 类型： string[]   默认值： []
            "domainLock": [],

            // 设置标识符名称生成器。
            // 可用值：
            // dictionary : identifiersDictionary 列表中的标识符名称
            // hexadecimal : 标识符名称如 _0xabc123
            // mangled : 短标识符名称，如 a , b , c
            // mangled-shuffled : 相同， mangled 但使用混洗字母
            // 类型： string   默认值： hexadecimal
            "identifierNamesGenerator": "mangled",

            // identifierNamesGenerator 为: dictionary 选项设置标识符字典。
            // 字典中的每个标识符都将用于几个变体，每个字符的大小写不同。
            // 因此，字典中标识符的数量应该取决于原始源代码中的标识符数量。
            // 类型： string[]   默认值： []
            "identifiersDictionary": [],

            // 当您想要混淆多个文件时使用此选项。
            // 此选项有助于避免这些文件的全局标识符之间的冲突。每个文件的前缀应该不同。
            // 为所有全局标识符设置前缀
            // 类型： string   默认值： ''
            "identifiersPrefix": "",

            // 允许使用源代码设置输入文件的名称。此名称将在内部用于源映射生成。
            // 使用 NodeJS API 并且 sourceMapSourcesMode 选项具有值时需要 sources
            // 类型： string   默认值： ''
            "inputFileName": "",

            // 允许将信息记录到控制台
            // 类型： boolean   默认值： false
            "log": false,

            // 此选项可能会破坏您的代码。仅当您知道它的作用时才启用它
            // 使用声明： 启用对全局变量和函数名称的混淆。
            // 类型： boolean   默认值： false
            "renameGlobals": true,

            // 禁用与传递的 RegExp 模式匹配的标识符的混淆和生成
            // 类型： string[]   默认值： []
            "reservedNames": [],

            // 禁用与传递的 RegExp 模式匹配的字符串文字的转换
            // 类型： string[]   默认值： []
            "reservedStrings": [],

            // 注意：要开启 stringArray 才有用
            // 根据一个固定和随机（混淆时生成）的位置变换stringArray。
            // 这会让人难以匹配字符串到他们原来的位置
            // 随机变换字符串列表中元素的位置
            // 类型：boolean   默认值：true
            "rotateStringArray": true,

            // 此选项为随机生成器设置种子。这对于创建可重复的结果很有用。
            // 如果种子是 0 - 随机生成器将在没有种子的情况下工作
            // 类型： string|number   默认值： 0
            "seed": 0,

            // 此选项强制将 compact 值设置为 true
            // 此选项使输出代码对格式化和变量重命名具有弹性。
            // 如果有人试图在混淆后的代码上使用 JavaScript 美化器，代码将不再工作，
            // 从而使其更难理解和修改
            // 使用此选项进行混淆后，请勿以任何方式更改混淆代码，
            // 因为任何像丑化代码这样的更改都会触发自我防御，代码将不再起作用！
            // 类型： boolean   默认值： false
            "selfDefending": true,

            // 要开启 stringArray 才有用
            // 对 stringArray 的内容随机洗牌，对字符串列表进行随机洗牌打乱
            // 类型：boolean  默认值：true
            "shuffleStringArray": true,

            // 为混淆代码启用源映射生成。
            // 源映射可以帮助您调试混淆的 JavaScript 源代码。
            // 如果您想要或需要在生产中进行调试，您可以将单独的源映射文件上传到一个秘密位置，
            // 然后将您的浏览器指向那里
            // 生成混淆后的代码的 source map
            // 类型：boolean  默认值：false
            "sourceMap": false,

            // 设置当sourceMapMode: 'separate'时的 source map 导入 url 的 BaseUrl
            // 类型：string  默认值：''
            "sourceMapBaseUrl": "",

            // 设置当sourceMapMode: 'separate'时的 source map 输出名称。
            // 类型：string  默认值：''
            "sourceMapFileName": "",

            // 设定 source map 的生成模式。
            // 设置输出源映射的文件名 sourceMapMode: 'separate' 。
            // inline - 发送包含 source map 的单个文件而不是生成单独的文件。
            // separate - 生成与 source map 对应的 '.map' 文件。
            // 类型：string  默认值：'separate'
            "sourceMapMode": "separate",

            // 根据 splitStringsChunkLength 将字符串分成指定长度的块。
            // 将文字字符串拆分为具有 splitStringsChunkLength 选项值长度的块。
            // 类型： boolean 默认值： false
            "splitStrings": false,

            // 设置 splitStrings 的块长度。
            // 类型：number  默认值：10
            "splitStringsChunkLength": 10,

            // 删除字符串文字并将它们放在一个特殊的数组中。
            // 例如，字符串 "Hello World" in var m = "Hello World";
            // 将被替换为类似 var m = _0x12c456[0x1];
            // 类型： boolean 默认值： true
            "stringArray": true,

            // 要开启 stringArray 才有用, 此选项会减慢您的脚本速度。
            // 用base64或者rc4来加密stringArray中的字符串，
            // 并且插入特定的代码用来运行时解密。
            // 可用值：
            // true（boolean）：用base64加密stringArray字符串
            // false（boolean）：不加密stringArray字符串
            // base64（string）：用base64加密stringArray字符串
            // rc4（string）：用rc4加密stringArray字符串, 比base64慢大概 30 - 50% ，但是让人更难获取初始值。
            // 类型：boolean|string 默认值：false
            "stringArrayEncoding": true,

            // 要开启 stringArray 才有用
            // 可以设置这个来调整字符串插入stringArray的概率。
            // 您可以使用此设置来调整将字符串文字插入到 stringArray 
            // 此设置对于大代码量特别有用，
            // 因为它反复调用 string array 并且会减慢您的代码。
            // stringArrayThreshold: 0 等于 stringArray: false 。
            // 类型：number   默认值：0.75 | 最小值：0 | 最大值：1
            "stringArrayThreshold": 0.75,

            // 允许为混淆代码设置目标环境。
            // 可用值：
            // browser
            // browser-no-eval
            // node
            // browser 当前和目标的输出代码 node 是相同的，
            // 但是某些特定于浏览器的选项不允许与 node 目标一起使用。
            // 目标的输出代码 browser-no-eval 未使用 eval
            // 类型： string 默认值： browser
            "target": "browser",

            // 启用对象键的转换
            // 将对象转换成多个复杂变量的组合（就是让代码变得难看）
            // 类型： boolean   默认值： false
            "transformObjectKeys": true,

            // 允许启用/禁用字符串转换为 unicode 转义序列。
            // Unicode 转义序列大大增加了代码大小，
            // 开启该选项会大大增加代码的体积，同时字符串也不难被恢复
            // 并且可以轻松地将字符串恢复为其原始视图。建议仅对小型源代码启用此选项。
            // 将字符转为 Unicode 格式，就是看起来更加复杂了，
            // 但是 Unicode 格式实际上很容易恢复。
            // 类型： boolean   默认值： false
            "unicodeEscapeSequence": true

        },
        wxDefaultConfig: {
            // 加入 AST 抽象语法树结构体函数+变量混淆(完善中)
            // 类型： boolean   默认值： true
            "autoAstObfusJs": true,

            // 自动混淆构建目录下的所有的 JSON 文件(采用 Unicode 编码形式, 其实还是能读取出来, 供参考吧)
            // 类型： boolean   默认值： true
            "autoObfusJson": true,

            // 紧凑的代码输出在一行上
            // 类型： boolean   默认值： true
            "compact": true,

            // 启用代码控制流扁平化。控制流扁平化是一种阻碍程序理解的源代码结构转换
            // 此选项极大地影响性能，运行时速度降低 1.5 倍。
            // 用于 controlFlowFlatteningThreshold 设置受控制流扁平化影响的节点百分比
            // 类型： boolean   默认值： false
            "controlFlowFlattening": false,

            // 此设置对于较大的代码量特别有用，因为大量的控制流转换会减慢您的代码并增加代码量
            // 类型：number   默认值： 0.75 最小值： 0 最大值： 1
            "controlFlowFlatteningThreshold": 0.75,

            // 显着增加混淆代码的大小（高达 200%），仅在混淆代码的大小无关紧要时使用
            // 用于 deadCodeInjectionThreshold 设置受死代码注入影响的节点百分比
            // 此选项强制启用 stringArray 选项。使用此选项，死代码的随机块将被添加到混淆代码中
            // 类型： boolean  默认值： false
            "deadCodeInjection": false,

            // 允许设置受 deadCodeInjection
            // 类型： number  默认值： 0.4 最小值： 0 最大值： 1
            "deadCodeInjectionThreshold": 0.4,

            // 禁止使用浏览器的 debugger 开发工具的功能(反调试)
            // 类型： boolean   默认值： false
            "debugProtection": false,

            // 此项会在进入开发者模式时卡住浏览器， 请谨慎使用
            // 如果设置，则以毫秒为单位的间隔用于强制控制台选项卡上的调试模式，
            // 从而更难使用开发人员工具的其他功能。如果 debugProtection 启用则工作。
            // 推荐值介于 2000 和 4000 毫秒之间
            // 类型： number|boolean   默认值： 0 || false
            "debugProtectionInterval": false,

            // 禁用 console.log , console.info , console.error , console.warn , 
            // console.debug , console.exception 和 console.trace 用空函数替换它们。
            // 这使得浏览器的调试器使用更加困难
            // 此选项 console 全局禁用所有脚本的调用
            // 类型： boolean   默认值： false
            "disableConsoleOutput": false,

            // 允许仅在特定域和/或子域上运行经过混淆的源代码。
            // 这使得人们很难复制和粘贴您的源代码并在其他地方运行它。
            // 如果源代码未在此选项指定的域上运行，
            // 浏览器将被重定向到传递给 domainLockRedirectUrl 选项的 URL。
            // 类型： string[]   默认值： []
            "domainLock": [],

            // 设置标识符名称生成器。
            // 可用值：
            // dictionary : identifiersDictionary 列表中的标识符名称
            // hexadecimal : 标识符名称如 _0xabc123
            // mangled : 短标识符名称，如 a , b , c
            // mangled-shuffled : 相同， mangled 但使用混洗字母
            // 类型： string   默认值： hexadecimal
            "identifierNamesGenerator": "hexadecimal",

            // identifierNamesGenerator 为: dictionary 选项设置标识符字典。
            // 字典中的每个标识符都将用于几个变体，每个字符的大小写不同。
            // 因此，字典中标识符的数量应该取决于原始源代码中的标识符数量。
            // 类型： string[]   默认值： []
            "identifiersDictionary": [],

            // 当您想要混淆多个文件时使用此选项。
            // 此选项有助于避免这些文件的全局标识符之间的冲突。每个文件的前缀应该不同。
            // 为所有全局标识符设置前缀
            // 类型： string   默认值： ''
            "identifiersPrefix": "",

            // 允许使用源代码设置输入文件的名称。此名称将在内部用于源映射生成。
            // 使用 NodeJS API 并且 sourceMapSourcesMode 选项具有值时需要 sources
            // 类型： string   默认值： ''
            "inputFileName": "",

            // 允许将信息记录到控制台
            // 类型： boolean   默认值： false
            "log": false,

            // 此选项可能会破坏您的代码。仅当您知道它的作用时才启用它
            // 使用声明： 启用对全局变量和函数名称的混淆。
            // 类型： boolean   默认值： false
            "renameGlobals": false,

            // 禁用与传递的 RegExp 模式匹配的标识符的混淆和生成
            // 类型： string[]   默认值： []
            "reservedNames": [],

            // 禁用与传递的 RegExp 模式匹配的字符串文字的转换
            // 类型： string[]   默认值： []
            "reservedStrings": [],

            // 注意：要开启 stringArray 才有用
            // 根据一个固定和随机（混淆时生成）的位置变换stringArray。
            // 这会让人难以匹配字符串到他们原来的位置
            // 随机变换字符串列表中元素的位置
            // 类型：boolean   默认值：true
            "rotateStringArray": true,

            // 此选项为随机生成器设置种子。这对于创建可重复的结果很有用。
            // 如果种子是 0 - 随机生成器将在没有种子的情况下工作
            // 类型： string|number   默认值： 0
            "seed": 0,

            // 此选项强制将 compact 值设置为 true
            // 此选项使输出代码对格式化和变量重命名具有弹性。
            // 如果有人试图在混淆后的代码上使用 JavaScript 美化器，代码将不再工作，
            // 从而使其更难理解和修改
            // 使用此选项进行混淆后，请勿以任何方式更改混淆代码，
            // 因为任何像丑化代码这样的更改都会触发自我防御，代码将不再起作用！
            // 类型： boolean   默认值： false
            "selfDefending": false,

            // 要开启 stringArray 才有用
            // 对 stringArray 的内容随机洗牌，对字符串列表进行随机洗牌打乱
            // 类型：boolean  默认值：true
            "shuffleStringArray": true,

            // 为混淆代码启用源映射生成。
            // 源映射可以帮助您调试混淆的 JavaScript 源代码。
            // 如果您想要或需要在生产中进行调试，您可以将单独的源映射文件上传到一个秘密位置，
            // 然后将您的浏览器指向那里
            // 生成混淆后的代码的 source map
            // 类型：boolean  默认值：false
            "sourceMap": false,

            // 设置当sourceMapMode: 'separate'时的 source map 导入 url 的 BaseUrl
            // 类型：string  默认值：''
            "sourceMapBaseUrl": "",

            // 设置当sourceMapMode: 'separate'时的 source map 输出名称。
            // 类型：string  默认值：''
            "sourceMapFileName": "",

            // 设定 source map 的生成模式。
            // 设置输出源映射的文件名 sourceMapMode: 'separate' 。
            // inline - 发送包含 source map 的单个文件而不是生成单独的文件。
            // separate - 生成与 source map 对应的 '.map' 文件。
            // 类型：string  默认值：'separate'
            "sourceMapMode": "separate",

            // 根据 splitStringsChunkLength 将字符串分成指定长度的块。
            // 将文字字符串拆分为具有 splitStringsChunkLength 选项值长度的块。
            // 类型： boolean 默认值： false
            "splitStrings": false,

            // 设置 splitStrings 的块长度。
            // 类型：number  默认值：10
            "splitStringsChunkLength": 10,

            // 删除字符串文字并将它们放在一个特殊的数组中。
            // 例如，字符串 "Hello World" in var m = "Hello World";
            // 将被替换为类似 var m = _0x12c456[0x1];
            // 类型： boolean 默认值： true
            "stringArray": true,

            // 要开启 stringArray 才有用, 此选项会减慢您的脚本速度。
            // 用base64或者rc4来加密stringArray中的字符串，
            // 并且插入特定的代码用来运行时解密。
            // 可用值：
            // true（boolean）：用base64加密stringArray字符串
            // false（boolean）：不加密stringArray字符串
            // base64（string）：用base64加密stringArray字符串
            // rc4（string）：用rc4加密stringArray字符串, 比base64慢大概 30 - 50% ，但是让人更难获取初始值。
            // 类型：boolean|string 默认值：false
            "stringArrayEncoding": false,

            // 要开启 stringArray 才有用
            // 可以设置这个来调整字符串插入stringArray的概率。
            // 您可以使用此设置来调整将字符串文字插入到 stringArray 
            // 此设置对于大代码量特别有用，
            // 因为它反复调用 string array 并且会减慢您的代码。
            // stringArrayThreshold: 0 等于 stringArray: false 。
            // 类型：number   默认值：0.75 | 最小值：0 | 最大值：1
            "stringArrayThreshold": 0.8,

            // 允许为混淆代码设置目标环境。
            // 可用值：
            // browser
            // browser-no-eval
            // node
            // browser 当前和目标的输出代码 node 是相同的，
            // 但是某些特定于浏览器的选项不允许与 node 目标一起使用。
            // 目标的输出代码 browser-no-eval 未使用 eval
            // 类型： string 默认值： browser
            "target": "browser",


            // 启用对象键的转换
            // 将对象转换成多个复杂变量的组合（就是让代码变得难看）
            // 类型： boolean   默认值： false
            "transformObjectKeys": false,

            // 允许启用/禁用字符串转换为 unicode 转义序列。
            // Unicode 转义序列大大增加了代码大小，
            // 开启该选项会大大增加代码的体积，同时字符串也不难被恢复
            // 并且可以轻松地将字符串恢复为其原始视图。建议仅对小型源代码启用此选项。
            // 将字符转为 Unicode 格式，就是看起来更加复杂了，
            // 但是 Unicode 格式实际上很容易恢复。
            // 类型： boolean   默认值： false
            "unicodeEscapeSequence": false
        }
    },

};

module.exports = PanelManager;
