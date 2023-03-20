const { shell } = require('electron');
// const RendererEvent = require('../../eazax/renderer-event');
// const PackageUtil = require('../../eazax/package-util');
const ConfigManager = require('./common/config-manager');

// 导入 Vue 工具函数
const { ref, watch, onMounted, onBeforeUnmount, createApp } = Vue;


// 构建 Vue 应用
const App = {

    /**
     * 设置
     * @param {*} props 
     * @param {*} context 
     */
    setup(props, context) {

        // // 可以直接打开的所有文件类型
        // const OPENABLE_LIST = ref([
        //     { ext: '.scene', type: t('scene') },
        //     { ext: '.prefab', type: t('prefab') },
        //     { ext: '.ts', type: t('typescript') },
        //     { ext: '.js', type: t('javascript') },
        //     { ext: '.json', type: t('json') },
        //     { ext: '.md', type: t('markdown') },
        //     { ext: '.txt', type: t('txt') },
        // ]);
        // // 可以直接打开的文件类型列表
        // const openable = ref([]);

        // // 预设快捷键
        // const presets = ref([
        //     { key: '', name: t('none') },
        //     { key: 'custom', name: t('customKey') },
        //     { key: 'F1', name: 'F1' },
        //     { key: 'F3', name: 'F3' },
        //     { key: 'F4', name: 'F4' },
        //     { key: 'F5', name: 'F5' },
        //     { key: 'F6', name: 'F6' },
        //     { key: 'CmdOrCtrl+F', name: 'Cmd/Ctrl + F' },
        //     { key: 'CmdOrCtrl+B', name: 'Cmd/Ctrl + B' },
        //     { key: 'CmdOrCtrl+Shift+F', name: 'Cmd/Ctrl + Shift + F' },
        // ]);
        // 选择
        const selectKey = ref('');
        // 自定义
        const customKey = ref('');

        // 监听选择快捷键
        watch(selectKey, (value) => {
            if (value !== 'custom') {
                customKey.value = '';
            }
        });

        // 监听自定义
        watch(customKey, (value) => {
            if (value !== '' && selectKey.value !== 'custom') {
                selectKey.value = 'custom';
            }
        });

        /**
         * 获取配置
         */
        function getConfig() {
            const config = ConfigManager.get();
            if (!config) return;
            // 可打开文件类型
            openable.value = config.openable;
            // 自动检查更新
            autoCheckUpdate.value = config.autoCheckUpdate;
            // 快捷键
            const hotkey = config.hotkey;
            if (!hotkey || hotkey === '') {
                selectKey.value = '';
                customKey.value = '';
                return;
            }
            // 预设快捷键
            for (let i = 0, l = presets.value.length; i < l; i++) {
                if (presets.value[i].key === hotkey) {
                    selectKey.value = hotkey;
                    customKey.value = '';
                    return;
                }
            }
            // 自定义快捷键
            selectKey.value = 'custom';
            customKey.value = hotkey;
        }

        /**
         * 保存配置
         */
        function setConfig() {
            const config = {
                openable: openable.value,
                hotkey: null,
                autoCheckUpdate: autoCheckUpdate.value,
            };
            if (selectKey.value === 'custom') {
                // 自定义输入是否有效
                if (customKey.value === '') {
                    return;
                }
                // 不可以使用双引号（避免 json 值中出现双引号而解析错误，导致插件加载失败）
                if (customKey.value.includes('"')) {
                    customKey.value = customKey.value.replace(/\"/g, '');
                    return;
                }
                config.hotkey = customKey.value;
            } else {
                config.hotkey = selectKey.value;
            }
            // 保存到本地
            ConfigManager.set(config);
            // // 重新加载扩展
            // RendererEvent.send('reload');

            // 重新加载扩展
            const { ipcRenderer } = require('electron');
            const args = [`${PACKAGE_NAME}:reload`];
            for (let i = 1, l = arguments.length; i < l; i++) {
                args.push(arguments[i]);
            };
            ipcRenderer.send.apply(ipcRenderer, args);
        }

        /**
         * 可打开文件类型勾选变化回调
         * @param {*} event 
         * @param {{ ext:string, type: string }} item 
         */
        function onOpenableChanged(event, item) {
            const { ext } = item,
                index = openable.value.indexOf(ext);
            if (event.target.checked) {
                if (index === -1) {
                    openable.value.push(ext);
                }
            } else {
                if (index !== -1) {
                    openable.value.splice(index, 1);
                }
            }
        }

        /**
         * 应用按钮点击回调
         * @param {*} event 
         */
        function onApplyBtnClick(event) {
            // 保存配置
            setConfig();
        }


        /**
         * 生命周期：挂载后
         */
        onMounted(() => {
            // 获取配置
            getConfig();
            // 覆盖 a 标签点击回调（使用默认浏览器打开网页）
            const links = document.querySelectorAll('a[href]');
            links.forEach((link) => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const url = link.getAttribute('href');
                    shell.openExternal(url);
                });
            });
        });

        /**
         * 生命周期：卸载前
         */
        onBeforeUnmount(() => {

        });

        return {
            OPENABLE_LIST,
            openable,
            presets,
            selectKey,
            customKey,
            autoCheckUpdate,
            onOpenableChanged,
            onApplyBtnClick,
            t,
        };

    },

};

// 创建实例
const app = createApp(App);
// console.log("设置面板->快速打开 [Vue]= ", [Vue]);
// console.log("设置面板->快速打开 [app]= ", [app]);
// console.log("设置面板->快速打开 [createApp]= ", [createApp]);
// 挂载
app.mount('#app');
