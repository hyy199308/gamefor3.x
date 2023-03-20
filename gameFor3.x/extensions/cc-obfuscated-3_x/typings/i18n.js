/*
 * @FilePath: i18n.js
 * @Author: koroFileHeader xx
 * @Date: 2022-10-06 17:16:54
 * @LastEditors: fileheader
 * @LastEditTime: 2022-10-06 17:17:25
 * @Copyright: [版权] 2022  Creator CO.LTD. All Rights Reserved.
 * @Descripttion: 
 */
const zh = require('../i18n/zh');
const en = require('../i18n/en');

/**
 * 多语言-后续补上, 先加一点点
 */
const I18n = {
    /**
     * 中文
     */
    zh,
    /**
     * 英文
     */
    en,

    /**
     * 多语言文本
     * @param {string} lang 语言
     * @param {string} key 关键字
     * @returns {string}
     */
    translate(lang, key) {
        if (I18n[lang] && I18n[lang][key]) {
            return I18n[lang][key];
        }
        return key;
    },

};
module.exports = I18n;
