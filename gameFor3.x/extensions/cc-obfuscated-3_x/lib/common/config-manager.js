const Path = require('path');
const Fs = require('fs');

/** 配置文件路径 */
// const CONFIG_PATH = Path.join(__dirname, './ob_config.json');
const CONFIG_PATH = Path.join(__dirname, '../../runtime_Ts/cc_obfuscated_js.json');

/** ob_package.json 的路径 */
const PACKAGE_PATH = Path.join(__dirname, './ob_package.json');

/**
 * 配置缓存
 */
let configCache = null;

// 预设置-插件配置 package.json
let preSetPackageJson = {
    "profile": {
        "editor": {
            "test.a": {
                "default": 0,
                "message": "editorTestAChanged",
                "label": "测试编辑器配置a"
            },
            "test.b": {
                "default": 0,
                "label": "测试编辑器配置b"
            }
        },
        "project": {
            "test.a": {
                "default": 1,
                "message": "projectTestAChanged",
                "label": "测试项目配置a"
            },
            "obfu_label_0": {
                "default": "调整小游戏的混淆参数-> 微信 + 抖音",
                "description": "调整小游戏的混淆参数-> 微信 + 抖音",
                "label": "混淆参数·小游戏·调整"
            },
            "obfu_label_1": {
                "default": "调整一般的混淆参数-> mobile + desktop",
                "description": "调整一般的混淆参数-> mobile + desktop",
                "label": "混淆参数·H5·调整"
            },
            "bind_defaultJson": {
                "default": "5571b22d-281e-41a6-b064-1a69b785fb0e",
                "message": "default-obfu-changed",
                "label": "保存混淆参数的 JSON 文件"
            },
            "uiprogress_start": {
                "default": "60",
                "label": "调整参数-当前进度"
            },
            "uiprogress_end": {
                "default": "100",
                "label": "调整参数-当前进度"
            },
            "is_auto_obfusJS": {
                "default": true,
                "message": "is_auto_obfusJsOpen",
                "description": "默认开启混淆功能, 开启后, 会在构建完成后自动混淆 JS 代码",
                "label": "构建后自动混淆"
            },
            "compact": {
                "default": true,
                "message": "message_compact",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.lab"
            },
            "controlFlowFlattening": {
                "default": false,
                "message": "message_controlFlowFlattening",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.lab"
            },
            "controlFlowFlatteningThreshold": {
                "default": 0.75,
                "message": "message_controlFlowFlatteningThreshold",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.lab"
            },
            "deadCodeInjection": {
                "default": false,
                "message": "message_deadCodeInjection",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.lab"
            },
            "deadCodeInjectionThreshold": {
                "default": 0.4,
                "message": "message_deadCodeInjectionThreshold",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.lab"
            },
            "identifierNamesGenerator": {
                "default": 2,
                "message": "message_identifierNamesGenerator",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.lab"
            },
            "identifiersPrefix": {
                "default": "",
                "message": "message_identifiersPrefix",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.lab"
            },
            "renameGlobals": {
                "default": false,
                "message": "message_renameGlobals",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.lab"
            },
            "seed": {
                "default": 0,
                "message": "message_seed",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.lab"
            },
            "splitStrings": {
                "default": false,
                "message": "message_splitStrings",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.lab"
            },
            "splitStringsChunkLength": {
                "default": 10,
                "message": "message_splitStringsChunkLength",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.lab"
            },
            "target": {
                "default": 0,
                "message": "message_target",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.lab"
            },
            "transformObjectKeys": {
                "default": false,
                "message": "message_transformObjectKeys",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.lab"
            },
            "unicodeEscapeSequence": {
                "default": false,
                "message": "message_unicodeEscapeSequence",
                "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des",
                "label": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.lab"
            },
            "jsObfus_qrCodes": {
                "label": "更多·参数解释",
                "description": "查看关于混淆参数的更多具体的内容",
                "default": "https://forum.cocos.org/uploads/default/original/3X/c/9/c9cfb28212173f169fda5e5ec52f02a33ce4b987.jpeg"
            }
        }
    },
    "project": {
        "comp-seelook-set": {
            "label": "小游戏参数",
            "content": {
                "obfu_label_0": {
                    "ui": "ui-label",
                    "attributes": {
                        "title": "调整小游戏的混淆参数",
                        "tooltip": "调整小游戏的混淆参数",
                        "value": "调整小游戏的混淆参数-> 微信 + 抖音"
                    }
                },
                "bind_defaultJson": {
                    "ui": "ui-asset",
                    "description": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                    "attributes": {
                        "title": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                        "tooltip": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                        "droppable": "cc.JsonAsset"
                    }
                },
                "uiprogress_start": {
                    "ui": "ui-progress",
                    "attributes": {
                        "title": "调整当前的混淆参数-当前进度",
                        "tooltip": "调整当前的混淆参数-当前进度"
                    }
                },
                "is_auto_obfusJS": {
                    "ui": "ui-checkbox",
                    "description": "默认开启混淆功能, 开启后, 会在构建完成后自动混淆 JS 代码"
                },
                "compact": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des"
                    }
                },
                "controlFlowFlattening": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des"
                    }
                },
                "controlFlowFlatteningThreshold": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
                        "min": 0,
                        "max": 1,
                        "step": 0.01
                    }
                },
                "deadCodeInjection": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des"
                    }
                },
                "deadCodeInjectionThreshold": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
                        "min": 0,
                        "max": 1,
                        "step": 0.01
                    }
                },
                "identifierNamesGenerator": {
                    "ui": "ui-select",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des"
                    },
                    "items": [
                        {
                            "value": 0,
                            "label": "dictionary(不建议)"
                        },
                        {
                            "value": 1,
                            "label": "hexadecimal"
                        },
                        {
                            "value": 2,
                            "label": "mangled(推荐使用)"
                        },
                        {
                            "value": 3,
                            "label": "mangled-shuffled"
                        }
                    ]
                },
                "identifiersPrefix": {
                    "ui": "ui-input",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des"
                    }
                },
                "renameGlobals": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des"
                    }
                },
                "seed": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
                        "min": 0,
                        "max": 1024,
                        "step": 0.01
                    }
                },
                "splitStrings": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des"
                    }
                },
                "splitStringsChunkLength": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
                        "min": 0,
                        "max": 128,
                        "step": 0.1
                    }
                },
                "target": {
                    "ui": "ui-select",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des"
                    },
                    "items": [
                        {
                            "value": 0,
                            "label": "browser(推荐使用)"
                        },
                        {
                            "value": 1,
                            "label": "browser-no-eval(考虑)"
                        },
                        {
                            "value": 2,
                            "label": "node"
                        }
                    ]
                },
                "transformObjectKeys": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des"
                    }
                },
                "unicodeEscapeSequence": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des"
                    }
                },
                "uiprogress_end": {
                    "ui": "ui-progress",
                    "attributes": {
                        "title": "调整当前的混淆参数-当前进度",
                        "tooltip": "调整当前的混淆参数-当前进度"
                    }
                },
                "jsObfus_qrCodes": {
                    "ui": "ui-qrcode",
                    "attributes": {
                        "title": "查看关于混淆参数的更多具体的内容",
                        "tooltip": "查看关于混淆参数的更多具体的内容"
                    }
                }
            }
        },
        "comp-obfuscated-setting": {
            "label": "混淆·一般参数",
            "content": {
                "obfu_label_1": {
                    "ui": "ui-label",
                    "attributes": {
                        "title": "调整 mobile 和 desktop 的 H5 的混淆参数",
                        "tooltip": "调整 mobile 和 desktop 的 H5 的混淆参数",
                        "value": "调整 mobile 和 desktop 的 H5 的混淆参数"
                    }
                },
                "bind_defaultJson": {
                    "ui": "ui-asset",
                    "description": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                    "attributes": {
                        "title": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                        "tooltip": "默认绑定用来保存混淆参数的 JSON 文件, 仅用于定位查看 JSON 文件 !",
                        "droppable": "cc.JsonAsset"
                    }
                },
                "uiprogress_start": {
                    "ui": "ui-progress",
                    "attributes": {
                        "title": "调整当前的混淆参数-当前进度",
                        "tooltip": "调整当前的混淆参数-当前进度"
                    }
                },
                "is_auto_obfusJS": {
                    "ui": "ui-checkbox",
                    "description": "默认开启混淆功能, 开启后, 会在构建完成后自动混淆 JS 代码"
                },
                "compact": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.compact.des"
                    }
                },
                "controlFlowFlattening": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlattening.des"
                    }
                },
                "controlFlowFlatteningThreshold": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.controlFlowFlatteningThreshold.des",
                        "min": 0,
                        "max": 1,
                        "step": 0.01
                    }
                },
                "deadCodeInjection": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjection.des"
                    }
                },
                "deadCodeInjectionThreshold": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.deadCodeInjectionThreshold.des",
                        "min": 0,
                        "max": 1,
                        "step": 0.01
                    }
                },
                "identifierNamesGenerator": {
                    "ui": "ui-select",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifierNamesGenerator.des"
                    },
                    "items": [
                        {
                            "value": 0,
                            "label": "dictionary(不建议)"
                        },
                        {
                            "value": 1,
                            "label": "hexadecimal"
                        },
                        {
                            "value": 2,
                            "label": "mangled(推荐使用)"
                        },
                        {
                            "value": 3,
                            "label": "mangled-shuffled"
                        }
                    ]
                },
                "identifiersPrefix": {
                    "ui": "ui-input",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.identifiersPrefix.des"
                    }
                },
                "renameGlobals": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.renameGlobals.des"
                    }
                },
                "seed": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.seed.des",
                        "min": 0,
                        "max": 1024,
                        "step": 0.01
                    }
                },
                "splitStrings": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStrings.des"
                    }
                },
                "splitStringsChunkLength": {
                    "ui": "ui-slider",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.splitStringsChunkLength.des",
                        "min": 0,
                        "max": 128,
                        "step": 0.1
                    }
                },
                "target": {
                    "ui": "ui-select",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.target.des"
                    },
                    "items": [
                        {
                            "value": 0,
                            "label": "browser(推荐使用)"
                        },
                        {
                            "value": 1,
                            "label": "browser-no-eval(考虑)"
                        },
                        {
                            "value": 2,
                            "label": "node"
                        }
                    ]
                },
                "transformObjectKeys": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.transformObjectKeys.des"
                    }
                },
                "unicodeEscapeSequence": {
                    "ui": "ui-checkbox",
                    "description": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des",
                    "attributes": {
                        "tooltip": "i18n:cc-obfuscated-3_x.obfus_option.obfus_option_config.unicodeEscapeSequence.des"
                    }
                },
                "uiprogress_end": {
                    "ui": "ui-progress",
                    "attributes": {
                        "title": "调整当前的混淆参数-当前进度",
                        "tooltip": "调整当前的混淆参数-当前进度"
                    }
                },
                "jsObfus_qrCodes": {
                    "ui": "ui-qrcode",
                    "attributes": {
                        "title": "查看关于混淆参数的更多具体的内容",
                        "tooltip": "查看关于混淆参数的更多具体的内容"
                    }
                }
            }
        }
    },
    "preferences": {
        "label": "代码混淆工具",
        "properties": {
            "test.b": {
                "ui": "ui-num-input"
            }
        }
    },
};
// 准备开放给用户使用的, 面板参数
let userReadySet =
    {
        "compact": true,
        "controlFlowFlattening": false,
        "controlFlowFlatteningThreshold": 0.75,
        "deadCodeInjection": false,
        "deadCodeInjectionThreshold": 0.4,
        "identifierNamesGenerator": "hexadecimal",
        "identifiersPrefix": "",
        "renameGlobals": false,
        "seed": 0,
        "splitStrings": false,
        "splitStringsChunkLength": 10,
        "target": "browser",
        "transformObjectKeys": false,
        "unicodeEscapeSequence": false
    }
    ||
    {
        "compact": true,
        "controlFlowFlattening": false,
        "controlFlowFlatteningThreshold": 0.75,
        "deadCodeInjection": false,
        "deadCodeInjectionThreshold": 0.4,
        "identifierNamesGenerator": "hexadecimal",
        "identifiersPrefix": "",
        "renameGlobals": false,
        "seed": 0,
        "splitStrings": false,
        "splitStringsChunkLength": 10,
        "target": "browser",
        "transformObjectKeys": false,
        "unicodeEscapeSequence": false
    };

/**
 * 配置管理器
 */
const ConfigManager = {

    /**
     * 配置缓存
     */
    get cache() {
        if (!configCache) {
            ConfigManager.get();
        }
        return configCache;
    },

    /**
     * 默认配置
     */
    get defaultConfig() {
        return {
            version: '1.0.6',
            auto: true,
            defaultConfig: {
                "compact": true,
                "controlFlowFlattening": false,
                "controlFlowFlatteningThreshold": 0.75,
                "deadCodeInjection": false,
                "deadCodeInjectionThreshold": 0.4,
                "debugProtection": true,
                "debugProtectionInterval": true,
                "disableConsoleOutput": true,
                "domainLock": [],
                "identifierNamesGenerator": "mangled",
                "identifiersDictionary": [],
                "identifiersPrefix": "",
                "inputFileName": "",
                "log": false,
                "renameGlobals": true,
                "reservedNames": [],
                "reservedStrings": [],
                "rotateStringArray": true,
                "seed": 0,
                "selfDefending": true,
                "shuffleStringArray": true,
                "sourceMap": false,
                "sourceMapBaseUrl": "",
                "sourceMapFileName": "",
                "sourceMapMode": "separate",
                "splitStrings": false,
                "splitStringsChunkLength": 10,
                "stringArray": true,
                "stringArrayEncoding": true,
                "stringArrayThreshold": 0.75,
                "target": "browser",
                "transformObjectKeys": true,
                "unicodeEscapeSequence": true
            },
            wxDefaultConfig: {
                "compact": true,
                "controlFlowFlattening": false,
                "controlFlowFlatteningThreshold": 0.75,
                "deadCodeInjection": false,
                "deadCodeInjectionThreshold": 0.4,
                "debugProtection": false,
                "debugProtectionInterval": false,
                "disableConsoleOutput": false,
                "domainLock": [],
                "identifierNamesGenerator": "hexadecimal",
                "identifiersDictionary": [],
                "identifiersPrefix": "",
                "inputFileName": "",
                "log": false,
                "renameGlobals": false,
                "reservedNames": [],
                "reservedStrings": [],
                "rotateStringArray": true,
                "seed": 0,
                "selfDefending": false,
                "shuffleStringArray": true,
                "sourceMap": false,
                "sourceMapBaseUrl": "",
                "sourceMapFileName": "",
                "sourceMapMode": "separate",
                "splitStrings": false,
                "splitStringsChunkLength": 10,
                "stringArray": true,
                "stringArrayEncoding": false,
                "stringArrayThreshold": 0.8,
                "target": "browser",
                "transformObjectKeys": false,
                "unicodeEscapeSequence": false
            },
            preset: "self_ob_js",
        };
    },

    /**
     * 读取配置
     */
    get() {
        const config = ConfigManager.defaultConfig;
        // 配置
        if (Fs.existsSync(CONFIG_PATH)) {
            // const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH));
            const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH, 'utf8'));
            for (const key in config) {
                if (localConfig[key] !== undefined) {
                    config[key] = localConfig[key];
                }
            }
        }
        // 缓存起来
        configCache = JSON.parse(JSON.stringify(config));

        // // 快捷键
        // config.hotkey = ConfigManager.getAccelerator();

        // Done
        return config;
    },

    /**
     * 保存配置
     * @param {*} value 配置
     */
    set(value) {
        const config = ConfigManager.defaultConfig;
        // 配置
        for (const key in config) {
            if (value[key] !== undefined) {
                config[key] = value[key];
            };
        };
        // console.log("[CC] [😏] [混淆] [参数调整] config=>", config);
        Fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        // 缓存起来
        configCache = JSON.parse(JSON.stringify(config));

        // // 快捷键
        // ConfigManager.setAccelerator(value.hotkey);
    },

    /**
     * 获取快捷键
     * @returns {string}
     */
    getAccelerator() {
        const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            item = package['contributions']['shortcuts'][0];
        return item['win'] || '';
    },

    /**
     * 设置快捷键
     * @param {string} value 
     */
    setAccelerator(value) {
        const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            item = package['contributions']['shortcuts'][0];
        if (value != undefined && value !== '') {
            item['win'] = value;
            item['mac'] = value;
        } else {
            item['win'] = '';
            item['mac'] = '';
        }
        Fs.writeFileSync(PACKAGE_PATH, JSON.stringify(package, null, 2));
    },

};

module.exports = ConfigManager;
