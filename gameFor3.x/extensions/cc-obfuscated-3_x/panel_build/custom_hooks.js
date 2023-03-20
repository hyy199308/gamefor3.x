/*
 * @FilePath: custom_hooks.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-08 12:32:22
 * @LastEditors: fileheader
 * @LastEditTime: 2022-10-13 13:42:46
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
"use strict";
/* eslint-disable prefer-rest-params */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBeforeBuildAssets = void 0;
exports.onAfterBuildAssets = void 0;
// const fs_extra_1 = require("fs-extra");
// const path_1 = require("path");
// 构建完成之后调用
async function onAfterBuildAssets(options, result) {
    var _a, _b;
    if (options.packages) {
        const language = (_a = options.packages['cc-obfuscated-3_x']) === null || _a === void 0 ? void 0 : _a.language;
        const defaultDBProtocol = 'db://assets';
        const dbProtocol = `db://${(_b = options.packages['cc-obfuscated-3_x']) === null || _b === void 0 ? void 0 : _b.db}`;
        if (language) {
            const imageInfos = await Editor.Message.request('asset-db', 'query-assets', { type: 'image', pattern: 'db://assets/**/*' });
            console.log("混淆插件 => onAfterBuildAssets=>", [language, defaultDBProtocol, dbProtocol]);
            console.log(imageInfos);
            // for (let index = 0; index < imageInfos.length; index++) {
            //     const targetAsset = imageInfos[index];
            //     if (result.containsAsset(targetAsset.uuid)) {
            //         const extName = path_1.extname(targetAsset.file);
            //         const sourceAsset = (await Editor.Message.request('asset-db', 'query-assets', {
            //             type: 'image', 'pattern': `${targetAsset.path.replace(defaultDBProtocol, dbProtocol)}@${language}${extName}`,
            //         }))[0];
            //         if (sourceAsset) {
            //             const rawAssetPaths = result.getRawAssetPaths(targetAsset.uuid);
            //             const targetFile = rawAssetPaths[0].raw[0];
            //             if (fs_extra_1.existsSync(targetFile)) {
            //                 fs_extra_1.removeSync(targetFile);
            //             }
            //             const sourceFile = sourceAsset.file;
            //             fs_extra_1.copySync(sourceFile, targetFile);
            //             console.log('[i18n sprite] Replaced successfully.', sourceFile, 'to', targetFile);
            //         }
            //     }
            // }
        }
    }
};
exports.onAfterBuildAssets = onAfterBuildAssets;

// 构建开始之前调用
async function onBeforeBuildAssets(options, result) {
    console.log("构建开始之前调用 onBeforeBuildAssets==", [options, result]);
};
exports.onBeforeBuildAssets = onBeforeBuildAssets;
// 目前支持的钩子函数列表：
// https://docs.cocos.com/creator/manual/zh/editor/publish/custom-build-plugin.html?h=afterbuild
// onBeforeBuild - 构建开始之前调用
// onBeforeCompressSettings - 开始压缩相关的 JSON 文件前调用
// onAfterCompressSettings - 压缩完设置文件后调用
// onAfterBuild - 构建完成之后调用

// 要实现钩子函数，需要先在 builder.ts 中加入 hooks 字段，参考上文的 自定义构建脚本结构，并创建一个 src/hooks.ts 脚本文件写入如下代码：
// import { BuildHook } from "../@types/packages/builder/@types";
// const PACKAGE_NAME = 'custom-build-example';
// export const throwError: BuildHook.throwError = true;

// export const load: BuildHook.load = async function() {
//     console.log(PACKAGE_NAME,load);
// };

// export const onBeforeBuild: BuildHook.onBeforeBuild = async function(options) {
//     // Todo some thing
//     console.log(PACKAGE_NAME,'onBeforeBuild');
// };

// export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function(options, result) {
//     // Todo some thing
//     console.log(PACKAGE_NAME,'onBeforeCompressSettings');
// };

// export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function(options, result) {
//     // Todo some thing
//     console.log(PACKAGE_NAME, 'onAfterCompressSettings');
// };

// export const onAfterBuild: BuildHook.onAfterBuild = async function(options, result) {
//     console.log(PACKAGE_NAME, 'onAfterBuild');
// };

// export const unload: BuildHook.unload = async function() {
//     console.log(PACKAGE_NAME, 'unload');
// };