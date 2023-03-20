/*
 * @FilePath: ast_codeing_do.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-06 17:04:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-12-07 16:14:16
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
// const { BrowserWindow } = require('electron');
// const { join } = require('path');
const md5 = require('md5');
var Fs = require('fs');
var parse = require('esprima').parse;
var toString = require('escodegen').generate;
var confusion = require('confusion');
var JsConfuser = require("js-confuser");

// 高效版：
// // (1)随机乱序排序算法-洗牌算法
// var testArray = [-2, 23, 34, 300, 500, 1000];
// if (!Array.prototype.derangedArray) {
//   Array.prototype.derangedArray = function () {
//     for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
//     return this;
//   };
// };
// //结果不唯一
// console.log(testArray.derangedArray());
function shuffleCardArr(arr) {
    // console.log("shuffleCardArr 开始", arr);
    var len = arr.length;
    for (var sind = 0; sind < len - 1; sind++) {
        var index = parseInt(Math.random() * (len - sind));
        var temp = arr[index];
        arr[index] = arr[len - sind - 1];
        arr[len - sind - 1] = temp;
    };
    // console.log("shuffleCardArr 结束", arr);
    return arr;
};
// var arr = [-2,1,3,4,5,6,7,8,9];
// //结果不唯一
// console.log(shuffleCardArr(arr));
/**
 * AST 抽象语法树结构, 一小部分
 */
const Ast_Codeing_Do = {
    ast_md5_val: null,
    /**
     * 随机乱序排序算法, 可以传数组或者字符串
    */
    ast_shuffleCardArr(arr) {
        // console.log("ast_shuffleCardArr 开始", arr);
        // var len = arr.length;
        // for (var astInd = 0; astInd < len - 1; astInd++) {
        //     var index = parseInt(Math.random() * (len - astInd));
        //     var temp = arr[index];
        //     arr[index] = arr[len - astInd - 1];
        //     arr[len - astInd - 1] = temp;
        // };
        // console.log("ast_shuffleCardArr 结束", arr);
        // return arr;


        // typeof []
        // 'object'
        // typeof ""
        // 'string'
        var getPostArr = arr;
        var getLen = getPostArr.length;
        if (typeof arr == 'object') {
            getPostArr = arr;
            getLen = getPostArr.length;
            for (var astInd = 0; astInd < getLen - 1; astInd++) {
                var index = parseInt(Math.random() * (getLen - astInd));
                var temp = getPostArr[index];
                getPostArr[index] = getPostArr[getLen - astInd - 1];
                getPostArr[getLen - astInd - 1] = temp;
            };
            return getPostArr;
        } else {
            getPostArr = arr.split("");
            getLen = getPostArr.length;
            for (var astInd = 0; astInd < getLen - 1; astInd++) {
                var index = parseInt(Math.random() * (getLen - astInd));
                var temp = getPostArr[index];
                getPostArr[index] = getPostArr[getLen - astInd - 1];
                getPostArr[getLen - astInd - 1] = temp;
            };
            return getPostArr.join("");
        };
    },

    /**
     * AST 获取混沌名称 [MAIN-2] 1.1
     * @postVal 加密的值
     * @getLength 要获取的长度值
    */
    ast_md5_func(postVal, getLength) {
        // 加入奇门遁甲混沌钟计时器
        var encodeKey = postVal || "CocosCreator" + "_AST_抽象语法树_";
        var zhexue_num = new Date().getTime() + Math.random() * 142857 + 1024 + Math.random() * 129600 + 540 * 2;
        var getThis = this;
        // 乱序
        var mixSortOrderStr = getThis.ast_shuffleCardArr(encodeKey + "" + zhexue_num);
        // console.log("mixSortOrderStr=>", mixSortOrderStr);
        // 获取乱序的 MD5 的值-> "ca7c2a15f35de48b44c5711900d2e5bd".length==32
        // this.ast_md5_val = md5(mixSortOrderStr);
        this.ast_md5_val = this.ast_getMd5_length(md5(mixSortOrderStr), 12);
        this.ast_md5_val = this.createVariableName(getThis.ast_md5_val) || this.ast_getMd5_length(md5(mixSortOrderStr), 8);
        // var getLength_get = getLength || 8;
        // this.ast_md5_val = "_c" + this.ast_getMd5_length(md5(mixSortOrderStr), getLength_get);

        // console.log("this.ast_md5_val=>", this.ast_md5_val);

        // this.ast_md5_val = encodeKey + md5(zhexue_num);
        // var getBeforeMd5 = this.ast_md5_val;
        // console.log("this.ast_md5_val [乱序前]=", getBeforeMd5);
        // console.log(this.ast_shuffleCardArr("获取到的 this.ast 的值") + "_md5=", this.ast_md5_val);
        // console.log("this.ast_md5_val [乱序后]=", this.ast_shuffleCardArr("" + this.ast_md5_val));

        return this.ast_md5_val;
    },
    /**
     * 异或加密代码里面的字符串内容(为了防止一些问题, 不加密 ``里面的字符串)
     * @param {*} postStr 
     * @param {*} encodeKey 1423328
     * @return
     */
    replace_encode_string(postStr, encodeKey = 1423328) {
        /**
         * 加解密代码逻辑-加密
         * @param {*} postCoddingStr 字符串代码格式
         * @returns 加密的字符串版本
         */
        function encodeJSstring(postCoddingStr) {
            postCoddingStr = postCoddingStr.toString();
            var getASCIIarr = [];
            for (var cStr = 0; cStr < postCoddingStr.length; cStr++) {
                getASCIIarr.push(postCoddingStr.charCodeAt(cStr) ^ encodeKey);
            };
            return getASCIIarr.join(',');
        };
        // /**
        //  * 加解密代码逻辑-解密
        //  * @param {*} postCoddingStr 加密的 ASCII 组合的字符串
        //  * @returns 解密的字符串(代码的原来样式)
        //  */
        // function decodeJSstring(postCoddingStr) {
        //     var getEnCodeArr = postCoddingStr.split(",");
        //     var getASCIIarr = [];
        //     for (var decStr = 0; decStr < getEnCodeArr.length; decStr++) {
        //         getASCIIarr.push(String.fromCharCode(Number(getEnCodeArr[decStr]) ^ encodeKey));
        //     };
        //     return getASCIIarr.join('');
        // };


        // 用来解密的
        var decode_ascii_str = `;function xor_de_d(s) { var a = s.split(","), r = []; for (var e = 0; e < a.length; e++) { r.push(String.fromCharCode(Number(a[e]) ^ ${encodeKey})); }; return r.join(""); };`;

        if (postStr.match(/`(.*)`/)) {
            console.log("[CC][混淆] 目前不支持加密 `` 之间的字符串!");
        } else if (postStr) {
            // 转换一下, 防止有什么非字符串出现
            postStr = postStr.toString();


            // 正则匹配内容
            var matArr_1 = [], matArr_2 = [], matArr_End = [];
            // matArr_1 = postStr.match(/'(.*)'/g) || [];
            // matArr_2 = postStr.match(/"(.*)"/g) || [];
            matArr_End = postStr.match(/"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g) || [];
            Fs.writeFileSync("已匹配到字符串.filePath" + ".txt", matArr_End.join(""));
            console.log("已匹配到字符串=>", [matArr_End.length]);

            // 开始加密
            // for (var ii = 0; ii < matArr_1.length; ii++) {
            //   postStr = postStr.replace(matArr_1[ii], "xor_de_d('" + encodeJSstring(matArr_1[ii]) + "')");
            // };
            // for (var jj = 0; jj < matArr_2.length; jj++) {
            //   postStr = postStr.replace(matArr_2[jj], "xor_de_d('" + encodeJSstring(matArr_2[jj]) + "')");
            // };
            for (var kk = 0; kk < matArr_End.length; kk++) {
                postStr = postStr.replace(matArr_End[kk], "xor_de_d('" + encodeJSstring(matArr_End[kk]) + "')");
            };

            // 载入解密函数
            if (matArr_1.length > 0 || matArr_2.length > 0 || matArr_End.length > 0) {
                postStr = decode_ascii_str + postStr;
            };
        };

        return postStr;

        // var matStr = "匹配字符串 ._/  \ '字符串2\f'\n`换行字符串\t结束`";
        // matStr = `
        //  "_0_匹配到字符串内容_0",
        //  '_1_匹配到字符串内容_1',
        //  "_2_匹配到字符串内容_2",
        //  '_3_匹配到字符串内容_3',
        //  "_4_匹配到字符串内容_4",
        //  '_5_匹配到字符串内容_5',
        // `;
        // var matStrTest = "`1`,`2`,4,`3`,5";
        // var matEnd = matStr.match(/匹(\S*)串/);
        // matEnd = matStr.match(/'(\s*)'/);
        // matEnd = matStr.match(/'(.*)'/);
        // matEnd = matStr.match(/`(.*)`/);
        // var matArr_1 = [], matArr_2 = [], matArr_3 = [], matArr_End = [];

        // // (matStr.match(/`(.*)`/).length>0?(matEnd=matEnd[1]):(matEnd=matEnd[0]));
        // matArr_1 = matStr.match(/'(.*)'/g);
        // matArr_2 = matStr.match(/"(.*)"/g);
        // matArr_3 = matStrTest.match(/`(.*)`/g);
    },
    /**
     * AST 混淆算法 [MAIN-1] 1.0
    */
    // ast_mix_jsMAIN(SourceCodePath) {
    ast_mix_jsMAIN(SourceCodePath, isn_open_buildOb, params, obfuscate, getWebMobilePath_subpackages_0, getWebMobilePath_subpackages_1, getWebMobilePath_subpackages_2, getWebMobilePath_main, temp_array, tmp_item, getCongif) {
        var postSourceCodeStr = Fs.readFileSync(SourceCodePath, 'utf8');
        var getThis = this;
        // let getMd5Val = getThis.ast_md5_func("Cocos抽象语法树加密ast_md5_func");

        // if (postSourceCodeStr) {
        //     console.log("[文件内容] postSourceCodeStr=>\n", postSourceCodeStr);
        // };
        if (!postSourceCodeStr || postSourceCodeStr.length === 0) {
            console.log("[CC]", "[x] [AST] 抽象语法树 - JS 文件读取失败");
            return false;
        };
        var sourceCode = postSourceCodeStr || `
        function fibonacci(num){   
          function abc(){};
        var a = 0, b = 1, c = num;
        while (num-- > 1) {
          function abc(){};
            c = a + b;
            a = b;
            b = c;
        }
        return c;
        }
        
        for ( var i = 1; i <= 25; i++ ) {
          function abc(){};
        console.log(i, fibonacci(i))
        }`;
        var startTime = new Date().getTime();
        var js_ast = parse(sourceCode);
        // var obfuscated = confusion.transformAst(js_ast, confusion.createVariableName);
        var obfuscated = confusion.transformAst(js_ast, (variableNames) => {
            return getThis.ast_md5_func("Cocos抽象语法树加密ast_md5_func", 8);
            // return "_c" + getThis.ast_md5_func("Cocos抽象语法树加密ast_md5_func", 8);
        });
        var confusEndString = toString(obfuscated);
        // console.log("confusion=>\n", confusEndString);
        // console.log("[CC]", "[👍] [AST] 抽象语法树-confusEndString-混淆完成=>\n", typeof obfuscated, confusEndString.length);
        // console.log("[CC]", "[👍] [AST] 抽象语法树-JsConfuser-混淆完成=>\n", typeof obfuscated, obfuscated.length);
        // 此项混淆容易卡住游戏逻辑, 注意谨慎使用
        // 必须先用 AST 混淆,然后用其它逻辑 否则逻辑落差会很大
        let debugMiniGameBool = !false;

        if (!debugMiniGameBool) {
            let getHunXiaoFile_0 = "index" || "game.js";
            let getHunXiaoFile_1 = SourceCodePath.split(getHunXiaoFile_0)[1];
            var EndTime = new Date().getTime();
            var usingTime = EndTime - startTime;
            usingTime = (usingTime / 1000).toFixed(2);
            console.log("[CC]", "[👍][" + usingTime + "s] [AST] 抽象语法树 -> 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n AST 混淆的 JS 文件路径为 => \n" + SourceCodePath);
            if (Fs.existsSync(SourceCodePath)) {
                Fs.writeFileSync(SourceCodePath, confusEndString, 'utf8');
            };
        } else if (debugMiniGameBool) {
            var counter = 0;
            var jsConfusString = postSourceCodeStr || `
        function fibonacci(num){   
          var a = 0, b = 1, c = num;
          while (num-- > 1) {
            c = a + b;
            a = b;
            b = c;
          }
          return c;
        }
        
        for ( var i = 1; i <= 25; i++ ) {
          console.log(i, fibonacci(i))
        }
        `;
            var getThis = this;
            JsConfuser.obfuscate(confusEndString, {
                target: "node",
                // preset: "low",
                // stringEncoding: false, // <- Normally enabled
                renameVariables: true,
                identifierGenerator: function () {
                    return "_" + (counter += Math.floor(Math.random() * 64)) + "C" + Math.random().toString(36).substring(7);
                },
            }).then(obfuscated => {
                // console.log("[CC]", "[👍] [AST] 抽象语法树-JsConfuser-混淆完成=>\n", typeof obfuscated, obfuscated.length);
                let getHunXiaoFile_0 = "index" || "game.js";
                let getHunXiaoFile_1 = SourceCodePath.split(getHunXiaoFile_0)[1];
                var EndTime = new Date().getTime();
                var usingTime = EndTime - startTime;
                usingTime = (usingTime / 1000).toFixed(2);
                console.log("[CC]", "[👍][" + usingTime + "s] [AST] 抽象语法树 => 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n AST 混淆的 JS 文件路径为 => \n" + SourceCodePath);
                if (Fs.existsSync(SourceCodePath)) {
                    //   Fs.writeFileSync(SourceCodePath, JSON.stringify(obfuscatedCode, null, 2));
                    // // 加密下字符串内容, 放在 main.js de  js-ob 前面吧,  不太兼容 // var ENCODE_string_obfuscated = getThis.replace_encode_string(obfuscated, 311527);

                    var ENCODE_string_obfuscated = obfuscated;
                    Fs.writeFileSync(SourceCodePath, ENCODE_string_obfuscated, 'utf8');
                    if (isn_open_buildOb) {
                        setTimeout(() => {
                            // AST 后使用 JS-OB 混淆
                            getThis.js_obAfterFunc(isn_open_buildOb, params, obfuscate, getWebMobilePath_subpackages_0, getWebMobilePath_subpackages_1, getWebMobilePath_subpackages_2, getWebMobilePath_main, temp_array, tmp_item, getCongif);
                        }, Number(usingTime) + 0.3);
                    };
                };
                // console.log("[SourceCodePath] 保存路径=>\n", SourceCodePath, typeof obfuscated, obfuscated.length);
            });
        };

        return true;


        // process.stdin.resume();
        // process.stdin.setEncoding('utf-8');
        // process.stdout.write('混淆index.d9945.js请输入1，混淆qu.min.js请输入2\n'); //标准输出
        // var getInputOutPut = [
        //     ['outGcodeAstTsJs', 'index.d9945', 'main.min'],
        //     ['outGcodeAstTsJs.2', 'index.d9945.2', 'main2'], 
        // ];
        // process.stdin.on('data', function (data) {
        //     process.stdin.pause();
        //     let inputFile;let outputFile; 
        //     data = data.toString().trim();
        //     if (data == 1) { } else if (data == 2) { } else { } 
        //     if (inputFile && outputFile) {
        //         try {
        //             const buffer = fs.readFileSync(`./${inputFile}.js`);
        //             process.stdout.write(outputFile + "混淆成功\n");
        //             const sourceCode = String(buffer); 
        //         } catch (err) {
        //             process.stdout.write("混淆失败！！！", err)
        //         }
        //     }
        // }); 
    },

    /**
     * JS-OB 混淆算法 [MAIN-2] 2.0
    */
    js_obAfterFunc(isn_open_buildOb, params, obfuscate, getWebMobilePath_subpackages_0, getWebMobilePath_subpackages_1, getWebMobilePath_subpackages_2, getWebMobilePath_main, temp_array, tmp_item, getCongif) {
        var startTime = new Date().getTime();
        if (isn_open_buildOb) {
            console.log("[CC]", "[⭐][JS-OB] 正在开始混淆 [" + params.options.platform + "] 里面的代码");
            // JavaScript-obfuscate 混淆
            if (Fs.existsSync(getWebMobilePath_subpackages_0) || Fs.existsSync(getWebMobilePath_subpackages_1) || Fs.existsSync(getWebMobilePath_subpackages_2)) {
                try {
                    let sourceCode_dir_arr = "";
                    let getHunXiaoFile_0 = "index" || "game.js";
                    let getHunXiaoFile_1 = ".js";
                    if (Fs.existsSync(getWebMobilePath_subpackages_0)) {
                        // console.log("[CC]", "[👇] 正在处理分包 [" + readMainJS_Path_sub_0 + "] 里面的代码"); 
                        // console.log("[CC]", "[👇] 正在处理分包 3 [" + readMainJS_Path_sub_0 + "]", temp_array);

                        if (temp_array.length > 0) {
                            // 此处读取数组的第一个文件
                            let sourceCode_0 = Fs.readFileSync(temp_array[0], 'utf8');
                            // 执行混淆=>已设置固定参数=>defaultConfig #TODO => #自定义配置
                            obfuscate(temp_array[0], getCongif);

                            getHunXiaoFile_0 = "index";
                            getHunXiaoFile_1 = temp_array[0].split(getHunXiaoFile_0)[1];
                            var EndTime = new Date().getTime();
                            var usingTime = EndTime - startTime;
                            usingTime = (usingTime / 1000).toFixed(2);
                            console.log("[CC]", "[👍][" + usingTime + "s][JS-OB] 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n文件路径为=>" + temp_array[0]);
                        };
                    } else if (Fs.existsSync(getWebMobilePath_subpackages_1)) {
                        console.log("[CC]", "[👇] 正在处理分包 [subpackages/main] 里面的代码");

                        if (temp_array.length > 0) {
                            // 此处读取数组的第一个文件
                            let sourceCode_0 = Fs.readFileSync(temp_array[0], 'utf8');
                            // 执行混淆=>已设置固定参数=>defaultConfig #TODO => #自定义配置
                            obfuscate(temp_array[0], getCongif);

                            getHunXiaoFile_0 = "game.";
                            getHunXiaoFile_1 = temp_array[0].split(getHunXiaoFile_0)[1];
                            var EndTime = new Date().getTime();
                            var usingTime = EndTime - startTime;
                            usingTime = (usingTime / 1000).toFixed(2);
                            console.log("[CC]", "[👍][" + usingTime + "s][JS-OB] 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n文件路径为=>" + temp_array[0]);
                        };
                    } if (Fs.existsSync(getWebMobilePath_subpackages_2)) {
                        console.log("[CC]", "[👇] 正在处理远程包 [src/bundle-scripts/main] 里面的代码");

                        if (temp_array.length > 0) {
                            // 此处读取数组的第一个文件
                            let sourceCode_0 = Fs.readFileSync(temp_array[0], 'utf8');
                            // 执行混淆=>已设置固定参数=>defaultConfig #TODO => #自定义配置
                            obfuscate(temp_array[0], getCongif);

                            getHunXiaoFile_0 = "index.";
                            getHunXiaoFile_1 = temp_array[0].split(getHunXiaoFile_0)[1];
                            var EndTime = new Date().getTime();
                            var usingTime = EndTime - startTime;
                            usingTime = (usingTime / 1000).toFixed(2);
                            console.log("[CC]", "[👍][" + usingTime + "s][JS-OB] 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n文件路径为=>" + temp_array[0]);
                        };
                    };

                } catch (error) { console.error("[CC]", "[🌟] 构建结束 error=>", error); };
            } else {
                try {
                    let sourceCode_dir_arr = Fs.readdirSync(getWebMobilePath_main, 'utf8');
                    // console.log("sourceCode_dir_arr=拿到的文件夹目录下的文件=>", [sourceCode_dir_arr]);
                    // sourceCode_dir_arr = 拿到的文件夹目录下的文件 => [['config.c6301.json', 'import', 'index.c6301.js', 'native']]
                    // let tmp_item = "", temp_array = [];
                    // 循环读取文件夹下的文件,分类,摘取需要的文件
                    sourceCode_dir_arr.forEach((getItem) => {
                        // 空格啥的删除一波??还是不删了,要读文件,此处注释::
                        // getItem = getItem.replace(/\s/g, "");
                        // 匹配主要代码js文件
                        if (getItem.indexOf(".js") > -1) {
                            if (getItem.match("index")) {
                                tmp_item = getItem;
                                // 确认路径可以正常读取到::
                                if (Fs.existsSync(getWebMobilePath_main + "/" + tmp_item)) {
                                    // 一般来说就只有一个 JS 文件,给这个数组赋值
                                    temp_array.push(getWebMobilePath_main + "/" + tmp_item);
                                };
                            };
                        };
                    });

                    if (temp_array.length > 0) {
                        // 此处读取数组的第一个文件
                        let sourceCode_0 = Fs.readFileSync(temp_array[0], 'utf8');
                        // 打印文件内容
                        // console.log("[CC]", "读取到的文件内容,第一个文件==>", sourceCode_0);
                        // 执行混淆=>已设置固定参数=>defaultConfig #TODO => #自定义配置
                        // obfuscate(temp_array[0], defaultConfig);
                        obfuscate(temp_array[0], getCongif);

                        // , sourceCode_0
                        let getHunXiaoFile_0 = "index" || "game.js";
                        let getHunXiaoFile_1 = temp_array[0].split(getHunXiaoFile_0)[1];
                        var EndTime = new Date().getTime();
                        var usingTime = EndTime - startTime;
                        usingTime = (usingTime / 1000).toFixed(2);
                        console.log("[CC]", "[👍][" + usingTime + "s][JS-OB] 混淆完成, 已写入 " + getHunXiaoFile_0 + getHunXiaoFile_1 + " 文件\n文件路径为=>" + temp_array[0]);
                        // // 写入文件
                        // Fs.writeFileSync(temp_array[0], sourceCode_0, 'utf8');
                        // console.log("[CC]", "写入文件完成!");
                    };
                } catch (error) { console.error("[CC]", "[🌟] 构建结束 error=>", error); };
            };
        };
    },

    /**
     * AST 内自定义的 MD5 算法实现, 供参考
    */
    ast_function_md5(value) {
        function b(a, b) {
            return a << b | a >>> 32 - b
        }

        function c(a, b) {
            var c, d, e, f, g;
            return e = 2147483648 & a,
                f = 2147483648 & b,
                c = 1073741824 & a,
                d = 1073741824 & b,
                g = (1073741823 & a) + (1073741823 & b),
                c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
        }

        function d(a, b, c) {
            return a & b | ~a & c
        }

        function e(a, b, c) {
            return a & c | b & ~c
        }

        function f(a, b, c) {
            return a ^ b ^ c
        }

        function g(a, b, c) {
            return b ^ (a | ~c)
        }

        function h(a, e, f, g, h, i, j) {
            return a = c(a, c(c(d(e, f, g), h), j)),
                c(b(a, i), e)
        }

        function i(a, d, f, g, h, i, j) {
            return a = c(a, c(c(e(d, f, g), h), j)),
                c(b(a, i), d)
        }

        function j(a, d, e, g, h, i, j) {
            return a = c(a, c(c(f(d, e, g), h), j)),
                c(b(a, i), d)
        }

        function k(a, d, e, f, h, i, j) {
            return a = c(a, c(c(g(d, e, f), h), j)),
                c(b(a, i), d)
        }

        function l(a) {
            for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)
                b = (i - i % 4) / 4,
                    h = i % 4 * 8,
                    g[b] = g[b] | a.charCodeAt(i) << h,
                    i++;
            return b = (i - i % 4) / 4,
                h = i % 4 * 8,
                g[b] = g[b] | 128 << h,
                g[f - 2] = c << 3,
                g[f - 1] = c >>> 29,
                g
        }

        function m(a) {
            var b, c, d = "", e = "";
            for (c = 0; 3 >= c; c++)
                b = a >>> 8 * c & 255,
                    e = "0" + b.toString(16),
                    d += e.substr(e.length - 2, 2);
            return d
        }

        function n(a) {
            a = a.replace(/\r\n/g, "\n");
            for (var b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                    b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                        b += String.fromCharCode(d >> 6 & 63 | 128),
                        b += String.fromCharCode(63 & d | 128))
            }
            return b
        }

        var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11,
            I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
        for (a = n(a),
            x = l(a),
            t = 1732584193,
            u = 4023233417,
            v = 2562383102,
            w = 271733878,
            o = 0; o < x.length; o += 16)
            p = t,
                q = u,
                r = v,
                s = w,
                t = h(t, u, v, w, x[o + 0], y, 3614090360),
                w = h(w, t, u, v, x[o + 1], z, 3905402710),
                v = h(v, w, t, u, x[o + 2], A, 606105819),
                u = h(u, v, w, t, x[o + 3], B, 3250441966),
                t = h(t, u, v, w, x[o + 4], y, 4118548399),
                w = h(w, t, u, v, x[o + 5], z, 1200080426),
                v = h(v, w, t, u, x[o + 6], A, 2821735955),
                u = h(u, v, w, t, x[o + 7], B, 4249261313),
                t = h(t, u, v, w, x[o + 8], y, 1770035416),
                w = h(w, t, u, v, x[o + 9], z, 2336552879),
                v = h(v, w, t, u, x[o + 10], A, 4294925233),
                u = h(u, v, w, t, x[o + 11], B, 2304563134),
                t = h(t, u, v, w, x[o + 12], y, 1804603682),
                w = h(w, t, u, v, x[o + 13], z, 4254626195),
                v = h(v, w, t, u, x[o + 14], A, 2792965006),
                u = h(u, v, w, t, x[o + 15], B, 1236535329),
                t = i(t, u, v, w, x[o + 1], C, 4129170786),
                w = i(w, t, u, v, x[o + 6], D, 3225465664),
                v = i(v, w, t, u, x[o + 11], E, 643717713),
                u = i(u, v, w, t, x[o + 0], F, 3921069994),
                t = i(t, u, v, w, x[o + 5], C, 3593408605),
                w = i(w, t, u, v, x[o + 10], D, 38016083),
                v = i(v, w, t, u, x[o + 15], E, 3634488961),
                u = i(u, v, w, t, x[o + 4], F, 3889429448),
                t = i(t, u, v, w, x[o + 9], C, 568446438),
                w = i(w, t, u, v, x[o + 14], D, 3275163606),
                v = i(v, w, t, u, x[o + 3], E, 4107603335),
                u = i(u, v, w, t, x[o + 8], F, 1163531501),
                t = i(t, u, v, w, x[o + 13], C, 2850285829),
                w = i(w, t, u, v, x[o + 2], D, 4243563512),
                v = i(v, w, t, u, x[o + 7], E, 1735328473),
                u = i(u, v, w, t, x[o + 12], F, 2368359562),
                t = j(t, u, v, w, x[o + 5], G, 4294588738),
                w = j(w, t, u, v, x[o + 8], H, 2272392833),
                v = j(v, w, t, u, x[o + 11], I, 1839030562),
                u = j(u, v, w, t, x[o + 14], J, 4259657740),
                t = j(t, u, v, w, x[o + 1], G, 2763975236),
                w = j(w, t, u, v, x[o + 4], H, 1272893353),
                v = j(v, w, t, u, x[o + 7], I, 4139469664),
                u = j(u, v, w, t, x[o + 10], J, 3200236656),
                t = j(t, u, v, w, x[o + 13], G, 681279174),
                w = j(w, t, u, v, x[o + 0], H, 3936430074),
                v = j(v, w, t, u, x[o + 3], I, 3572445317),
                u = j(u, v, w, t, x[o + 6], J, 76029189),
                t = j(t, u, v, w, x[o + 9], G, 3654602809),
                w = j(w, t, u, v, x[o + 12], H, 3873151461),
                v = j(v, w, t, u, x[o + 15], I, 530742520),
                u = j(u, v, w, t, x[o + 2], J, 3299628645),
                t = k(t, u, v, w, x[o + 0], K, 4096336452),
                w = k(w, t, u, v, x[o + 7], L, 1126891415),
                v = k(v, w, t, u, x[o + 14], M, 2878612391),
                u = k(u, v, w, t, x[o + 5], N, 4237533241),
                t = k(t, u, v, w, x[o + 12], K, 1700485571),
                w = k(w, t, u, v, x[o + 3], L, 2399980690),
                v = k(v, w, t, u, x[o + 10], M, 4293915773),
                u = k(u, v, w, t, x[o + 1], N, 2240044497),
                t = k(t, u, v, w, x[o + 8], K, 1873313359),
                w = k(w, t, u, v, x[o + 15], L, 4264355552),
                v = k(v, w, t, u, x[o + 6], M, 2734768916),
                u = k(u, v, w, t, x[o + 13], N, 1309151649),
                t = k(t, u, v, w, x[o + 4], K, 4149444226),
                w = k(w, t, u, v, x[o + 11], L, 3174756917),
                v = k(v, w, t, u, x[o + 2], M, 718787259),
                u = k(u, v, w, t, x[o + 9], N, 3951481745),
                t = c(t, p),
                u = c(u, q),
                v = c(v, r),
                w = c(w, s);
        var O = m(t) + m(u) + m(v) + m(w);
        return O.toLowerCase()
    },
    /**
     * 获取 md5 的 32 位值里面的指定位数, 每次获取的都是再次乱序的 md5 的值, 保证不唯一
    */
    ast_getMd5_length(md5_32_val, getLength) {
        if (getLength < md5_32_val.length) {
            return md5_32_val.slice(0, getLength);
        } else {
            return md5_32_val;
        };
    },

    /**
     * 创作一个随机名称, 这个仅供参考
     * @param {*} variableNames 
     * @returns 随机名称
     */
    createVariableName(variableNames) {
        var name = '_cc' || '_x'; do { name += (Math.random() * 0xffff) | 0; } while (variableNames.indexOf(name) !== -1);
        return name;
    },
};
// 发布给其它脚本使用
module.exports = Ast_Codeing_Do;
