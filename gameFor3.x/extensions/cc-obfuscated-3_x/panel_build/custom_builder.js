/*
 * @FilePath: custom_builder.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-08 12:32:22
 * @LastEditors: fileheader
 * @LastEditTime: 2022-10-13 22:22:13
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
// var matReg = new RegExp();
var checkInputTime = new Date().getTime();
/**
 * 打开一个提示面板, 自定义的
 * tipType = info || warn || error
 * titleT = Cocos Creator 混淆代码·提示框
 * tipTitile = 混淆·提示
 * tipInfo = 已打开构建面板, 请在面板内调整混淆代码的参数
 */
async function open_msg_tipPage(tipType, titleT, tipTitile, tipInfo) {
    const tip_config = {
        title: titleT || tipType,
        detail: tipInfo || 'detail',
        buttons: ['请稍等一会', '好的'],
    };
    const tip_code = await Editor.Dialog[tipType](`${tipTitile}`, tip_config);
};
// /**
//  * 获取配置信息, 也可以用来刷新面板
//  * getConfig
//  * getProject
//  * packName  'cc-obfuscated-3_x'
//  * itemCanshu 'jsObfusTip'
//  */
// async function getConfig_getProject(packName, itemCanshu) {
//     var getItemParm = {
//         getConfigParm: "",
//         getConfigParm_default: "",
//         getConfigParm_local: "",
//         getConfigParm_global: "",
//         getProjectParm: "",
//         getProjectParm_default: "",
//         getProjectParm_local: "",
//         getProjectParm_global: "",
//     };
//     getItemParm.getConfigParm = await Editor.Profile.getConfig(packName, itemCanshu);
//     getItemParm.getConfigParm_default = await Editor.Profile.getConfig(packName, itemCanshu, 'default');
//     getItemParm.getConfigParm_local = await Editor.Profile.getConfig(packName, itemCanshu, 'local');
//     getItemParm.getConfigParm_global = await Editor.Profile.getConfig(packName, itemCanshu, 'global');

//     getItemParm.getProjectParm = await Editor.Profile.getProject(packName, itemCanshu);
//     getItemParm.getProjectParm_default = await Editor.Profile.getProject(packName, itemCanshu, 'default');
//     getItemParm.getProjectParm_local = await Editor.Profile.getProject(packName, itemCanshu, 'local');
//     getItemParm.getProjectParm_global = await Editor.Profile.getProject(packName, itemCanshu, 'global');

//     console.log("【" + packName + "】getConfig_getProject [构建面板] getItemParm=>", [getItemParm]);

//     // return "getConfig_getProject";
//     return getItemParm;
// };
exports.configs = {
    '*': {
        hooks: './custom_hooks',
        'options': {
            BUILD_jsObfus_des_main: {
                'label': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_des_main.lab',
                'description': "i18n:cc-obfuscated-3_x.build_des.jsObfus_des_main.des",
                'default': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_des_main.def',
                'render': {
                    'ui': 'ui-label'
                }
            },
            BUILD_jsObfus_des_child: {
                'label': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_des_child.lab',
                'description': "i18n:cc-obfuscated-3_x.build_des.jsObfus_des_child.des",
                'default': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_des_child.def',
                'render': {
                    'ui': 'ui-label',
                    'attributes': {
                        'tooltip': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_des_child.tip'
                    }
                }
            },


            BUILD_bind_defaultJson: {
                "label": "i18n:cc-obfuscated-3_x.build_des.bind_defaultJson.lab",
                'description': 'i18n:cc-obfuscated-3_x.build_des.bind_defaultJson.des',
                "default": "5571b22d-281e-41a6-b064-1a69b785fb0e",
                "message": "default-obfu-changed",
                'render': {
                    'ui': 'ui-asset',
                    'attributes': {
                        'tooltip': 'i18n:cc-obfuscated-3_x.build_des.bind_defaultJson.tip',
                        'title': "i18n:cc-obfuscated-3_x.build_des.bind_defaultJson.tip",
                        "droppable": "cc.JsonAsset",
                    }
                },
            },
            BUILD_ProjSetMoreParams: {
                "label": "点击右侧",
                'description': '点击此处选中设置更多, 就会跳转到项目设置, 设置更多的混淆参数,<br>如果不做更改, 就采取默认的 JSON 文件里面的参数数据做代码混淆',
                "default": 0,
                'verifyRules': ["jsObfusBuildRule"],
                'render': {
                    'ui': 'ui-select',
                    'attributes': {
                        'tooltip': '点击此处选中设置更多, 就会跳转到项目设置, 设置更多的混淆参数,<br>如果不做更改, 就采取默认的 JSON 文件里面的参数数据做代码混淆',
                        'title': "点击此处选中设置更多, 就会跳转到项目设置, 设置更多的混淆参数,<br>如果不做更改, 就采取默认的 JSON 文件里面的参数数据做代码混淆",
                    },
                    'items': [
                        {
                            'value': 0,
                            'label': '默认 JSON',
                        },
                        {
                            'value': 1,
                            'label': '设置更多',
                        },
                    ],
                },
            },
            // 因为数据面板测试后发现, 不能实时更新, 因此如下内容留待后续重启
            // 因为数据面板测试后发现, 不能实时更新, 因此如下内容留待后续重启
            // 因为数据面板测试后发现, 不能实时更新, 因此如下内容留待后续重启
            // BUILD_is_auto_obfusJS: {
            //     "default": true,
            //     "message": "is_auto_obfusJsOpen",
            //     "label": "i18n:cc-obfuscated-3_x.build_des.is_auto_obfusJS.lab",
            //     "description": "i18n:cc-obfuscated-3_x.build_des.is_auto_obfusJS.des",
            //     'verifyRules': ["jsObfusBuildRule"],
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.build_des.is_auto_obfusJS.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.build_des.is_auto_obfusJS.tip"
            //         }
            //     }
            // },
            // BUILD_compact: {
            //     "default": true,
            //     "message": "message_compact",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.lab",
            //     'verifyRules': ["jsObfusBuildRule"],
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des"
            //         }
            //     }
            // },
            // BUILD_controlFlowFlattening: {
            //     "default": false,
            //     "message": "message_controlFlowFlattening",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des"
            //         }
            //     }
            // },
            // BUILD_controlFlowFlatteningThreshold: {
            //     "default": 0.75,
            //     "message": "message_controlFlowFlatteningThreshold",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.lab",
            //     "render": {
            //         "ui": "ui-slider",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
            //             "min": 0,
            //             "max": 1,
            //             "step": 0.01
            //         }
            //     }
            // },
            // BUILD_deadCodeInjection: {
            //     "default": false,
            //     "message": "message_deadCodeInjection",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des"
            //         }
            //     }
            // },
            // BUILD_deadCodeInjectionThreshold: {
            //     "default": 0.4,
            //     "message": "message_deadCodeInjectionThreshold",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.lab",
            //     "render": {
            //         "ui": "ui-slider",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
            //             "min": 0,
            //             "max": 1,
            //             "step": 0.01
            //         }
            //     }
            // },
            // BUILD_identifierNamesGenerator: {
            //     "default": 2,
            //     "message": "message_identifierNamesGenerator",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.lab",
            //     "render": {
            //         "ui": "ui-select",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des"
            //         },
            //         "items": [
            //             {
            //                 "value": 0,
            //                 "label": "dictionary(不建议)"
            //             },
            //             {
            //                 "value": 1,
            //                 "label": "hexadecimal"
            //             },
            //             {
            //                 "value": 2,
            //                 "label": "mangled(推荐使用)"
            //             },
            //             {
            //                 "value": 3,
            //                 "label": "mangled-shuffled"
            //             }
            //         ]
            //     }
            // },
            // BUILD_identifiersPrefix: {
            //     "default": "",
            //     "message": "message_identifiersPrefix",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.lab",
            //     "render": {
            //         "ui": "ui-input",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des"
            //         }
            //     }
            // },
            // BUILD_renameGlobals: {
            //     "default": false,
            //     "message": "message_renameGlobals",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des"
            //         }
            //     }
            // },
            // BUILD_seed: {
            //     "default": 0,
            //     "message": "message_seed",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.lab",
            //     "render": {
            //         "ui": "ui-slider",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
            //             "min": 0,
            //             "max": 1024,
            //             "step": 0.01
            //         }
            //     }
            // },
            // BUILD_splitStrings: {
            //     "default": false,
            //     "message": "message_splitStrings",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des"
            //         }
            //     }
            // },
            // BUILD_splitStringsChunkLength: {
            //     "default": 10,
            //     "message": "message_splitStringsChunkLength",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.lab",
            //     "render": {
            //         "ui": "ui-slider",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
            //             "min": 0,
            //             "max": 128,
            //             "step": 0.1
            //         }
            //     }
            // },
            // BUILD_target: {
            //     "default": 0,
            //     "message": "message_target",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.lab",
            //     "render": {
            //         "ui": "ui-select",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des"
            //         },
            //         "items": [
            //             {
            //                 "value": 0,
            //                 "label": "browser(推荐使用)"
            //             },
            //             {
            //                 "value": 1,
            //                 "label": "browser-no-eval(考虑)"
            //             },
            //             {
            //                 "value": 2,
            //                 "label": "node"
            //             }
            //         ]
            //     }
            // },
            // BUILD_transformObjectKeys: {
            //     "default": false,
            //     "message": "message_transformObjectKeys",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des"
            //         }
            //     }
            // },
            // BUILD_unicodeEscapeSequence: {
            //     "default": false,
            //     "message": "message_unicodeEscapeSequence",
            //     "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des",
            //     "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.lab",
            //     "render": {
            //         "ui": "ui-checkbox",
            //         "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des",
            //         "attributes": {
            //             "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des"
            //         }
            //     }
            // },





            BUILD_jsObfus_qrCodes: {
                'label': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_qrCodes.lab',
                'description': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_qrCodes.des',
                // 'default': 'https://forum.cocos.org/uploads/default/original/3X/c/9/c9cfb28212173f169fda5e5ec52f02a33ce4b987.jpeg' || 'https://docs.cocos.com/creator/manual/zh/editor/publish/custom-build-plugin.html' || 'https://www.cocos.com/docs',
                'default': 'https://forum.cocos.org/uploads/default/original/3X/c/9/c9cfb28212173f169fda5e5ec52f02a33ce4b987.jpeg',
                'render': {
                    'ui': 'ui-qrcode',
                    'attributes': {
                        'tooltip': 'i18n:cc-obfuscated-3_x.build_des.jsObfus_qrCodes.tip'
                    }
                }
            },
            // jsObfus_checkInput: {
            //     'label': '调试 checkInput',
            //     'description': '查看 checkInput 的变换',
            //     'default': checkInputTime,
            //     'render': {
            //         'ui': 'ui-input'
            //     },
            // },
            // jsObfus_checkbox: {
            //     'label': '调试 checkbox',
            //     'description': '查看关于混淆参数的更多具体的内容',
            //     'default': false,
            //     'render': {
            //         'ui': 'ui-checkbox'
            //     },
            //     'verifyRules': ["jsObfus_Rule"],
            // },

            // jsObfusTip: {
            //     'label': '混淆代码',
            //     'description': "请认真核对您的选择, 本次验证只允许输入 md5 的数字或者字母的值",
            //     'default': '开启',
            //     'render': {
            //         'ui': 'ui-input',
            //         'attributes': {
            //             'tooltip': 'tooltip 请选择是否开启混淆',
            //             'title': "title 请选择是否开启混淆",
            //             'placeholder': "请选择是否开启混淆"
            //         }
            //     },
            //     'verifyRules': ["ruleTest"],
            //     'children': [
            //         {
            //             'label': 'web-mobile || web-desktop || wechatgame || bytedance-mini-game <br> 手机端 web || 桌面端 web || 微信小游戏 || 抖音小游戏',
            //             'default': 'web-mobile || web-desktop || wechatgame || bytedance-mini-game <br> 手机端 web || 桌面端 web || 微信小游戏 || 抖音小游戏',
            //             'render': {
            //                 'ui': 'ui-label'
            //             }
            //         }
            //     ]
            // },
            // jsObfusTip2: {
            //     'label': 'i18n:cc-obfuscated-3_x.name',
            //     'default': 'jsObfusTip2',
            //     'render': {
            //         'ui': 'ui-input',
            //         'attributes': {
            //             'readonly': true
            //         }
            //     },
            // },
        },
        verifyRuleMap: {
            'jsObfusBuildRule': {
                message: "修改参数后, 请自行构建运行查看",
                func: (inputInfo, compareInfo) => {
                    // let getParmTest = getConfig_getProject('cc-obfuscated-3_x', 'BUILD_is_auto_obfusJS');
                    // console.log("build 获取参数 BUILD_is_auto_obfusJS .getConfigParm, .getProjectParm=", [
                    //     getParmTest.getConfigParm,
                    //     getParmTest.getConfigParm_default,
                    //     getParmTest.getConfigParm_local,
                    //     getParmTest.getConfigParm_global,
                    // ], [
                    //     getParmTest.getProjectParm,
                    //     getParmTest.getProjectParm_default,
                    //     getParmTest.getProjectParm_local,
                    //     getParmTest.getProjectParm_global,
                    // ]);

                    let getBuildObj = compareInfo.packages["cc-obfuscated-3_x"];
                    let defaultSelect = ['默认 JSON', '设置更多'];
                    if (getBuildObj.BUILD_ProjSetMoreParams == 1) {
                        console.log("[CC] [😏] [混淆] 当前选中了 [" + defaultSelect[getBuildObj.BUILD_ProjSetMoreParams] + "]");
                        getBuildObj.BUILD_ProjSetMoreParams = 0;
                        compareInfo.packages["cc-obfuscated-3_x"].BUILD_ProjSetMoreParams = 0;
                        open_msg_tipPage("info", "Cocos Creator 混淆代码·提示框", "混淆·正在打开设置面板", "~~稍微会等一会会, 加载中...\n本提示框可以先关闭!");
                        Editor.Message.send('cc-obfuscated-3_x', 'open-setting-panel');
                    };


                    // // 试试能不能直接赋值同步数据面板当前状态
                    // compareInfo.packages["cc-obfuscated-3_x"].BUILD_compact = compareInfo.packages["cc-obfuscated-3_x"].BUILD_is_auto_obfusJS;


                    // console.log("[构建] getBuildObj==>", [getBuildObj.BUILD_compact, getBuildObj.BUILD_is_auto_obfusJS, typeof getBuildObj, getBuildObj]);
                    // console.log("[构建] typeof inputInfo, inputInfo, compareInfo==>", [typeof inputInfo, inputInfo, compareInfo]);
                    // true,
                    // {
                    //     name: [Getter/Setter],
                    //     platform: [Getter/Setter],
                    //     buildPath: [Getter/Setter],
                    //     debug: [Getter/Setter],
                    //     md5Cache: [Getter/Setter],
                    //     sourceMaps: [Getter/Setter],
                    //     replaceSplashScreen: [Getter/Setter],
                    //     mainBundleCompressionType: [Getter/Setter],
                    //     mainBundleIsRemote: [Getter/Setter],
                    //     mergeStartScene: [Getter/Setter],
                    //     experimentalEraseModules: [Getter/Setter],
                    //     compressTexture: [Getter/Setter],
                    //     packAutoAtlas: [Getter/Setter],
                    //     startScene: [Getter/Setter],
                    //     scenes: [Getter/Setter],
                    //     outputName: [Getter/Setter],
                    //     packages: [Getter/Setter]
                    // }
                    // return true;
                    return getBuildObj;
                },
            },
            'jsObfus_Rule': {
                message: "i18n:cc-obfuscated-3_x.build_des.verifyRuleMap.jsObfus_Rule.msg",
                func: (inputInfo, compareInfo) => {
                    // 清空下日志, 清空当前列表
                    // Editor.Message.broadcast('all', 'console:update-log-level'); 
                    Editor.Message.broadcast('', 'console:update-log-level');
                    checkInputTime = new Date().getTime();

                    // 打开构建面板
                    Editor.Message.send('about', 'open');

                    // 关闭混淆
                    Editor.Message.send('cc-obfuscated-3_x', 'close_ob_build');

                    // 开启混淆
                    Editor.Message.send('cc-obfuscated-3_x', 'open_ob_build');

                    console.log("message 打开关于页面, 调试 checkbox", [inputInfo, checkInputTime]);
                    // inputInfo.length 可以限制下
                    // 匹配纯字母或数字的字符串, 对应 md5 生成的字符串 key
                    var limitMd5Reg = new RegExp(/^[A-Za-z0-9]+$/, "g");
                    return (limitMd5Reg.test(inputInfo)) && (inputInfo.length <= 32);
                }
            },
            'ruleTest': {
                message: "i18n:cc-obfuscated-3_x.build_des.verifyRuleMap.ruleTest.msg",
                // func: (inputInfo, compareInfo) => "cocos" === inputInfo
                func: (inputInfo, compareInfo) => {

                    // inputInfo.length 可以限制下
                    // 匹配纯字母或数字的字符串, 对应 md5 生成的字符串 key
                    var limitMd5Reg = new RegExp(/^[A-Za-z0-9]+$/, "g");
                    // var reg2 = /^[A-Za-z0-9]+$/g;
                    // 匹配模式作为第二个参数。这个参数可以是：
                    // i 忽略大小写。这里的 i 指的是 ignore。
                    // g 全局匹配模式。这里的 g 指的是 global。
                    // var newStringInput = "您好123abc_CocosCreator";
                    // var newStringInput2 = "CocosCreator360";
                    // limitMd5Reg.test(newStringInput);
                    // newStringInput.match(limitMd5Reg);
                    // Boolean(newStringInput2.match(limitMd5Reg));
                    // limitMd5Reg.test(inputInfo);

                    // 对比的 Json 文件
                    // var temp_compareInfo = {
                    //     name: 'CocosCreatorProj_3.6.0',
                    //     platform: 'wechatgame',
                    //     buildPath: 'project://build',
                    //     debug: false,
                    //     md5Cache: true,
                    //     skipCompressTexture: false,
                    //     sourceMaps: false,
                    //     polyfills: { asyncFunctions: false },
                    //     experimentalEraseModules: false,
                    //     useBuiltinServer: false,
                    //     mainBundleIsRemote: false,
                    //     mainBundleCompressionType: 'merge_dep',
                    //     replaceSplashScreen: false,
                    //     compressTexture: true,
                    //     packAutoAtlas: true,
                    //     startScene: '17725a7c-f789-68d6-8f50-ff006736bb6d',
                    //     outputName: 'wechatgame',
                    //     scenes: [[Object], [Object], [Object]],
                    //     wechatgame: [],
                    //     packages: {
                    //         'cocos-service': [Object],
                    //         'cc-obfuscated-3_x': [Object],
                    //         'localization-editor': null,
                    //         wechatgame: [Object]
                    //     },
                    //     __version__: '1.3.3'
                    // };

                    // console.log("limitMd5Reg.test(inputInfo)==>", [limitMd5Reg.test(inputInfo), inputInfo, inputInfo]);

                    return (limitMd5Reg.test(inputInfo)) && (inputInfo.length <= 32);
                }
            }
        }
    },
};