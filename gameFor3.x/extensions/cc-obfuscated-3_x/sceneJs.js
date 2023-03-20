/*
 * @Author: your name
 * @Date: 2022-10-01 16:02:46 
 * @LastEditTime: 2022-10-13 22:00:06
 * @LastEditors: fileheader
 * @Description: 查看配置文件
 * @FilePath: sceneJs.js
 */
const { join } = require('path');
// 加载 'cc' 需要设置搜索路径
module.paths.push(join(Editor.App.path, 'node_modules'));

// 模块加载的时候触发的函数
exports.load = function () {
  // const getEndAsset_Some = await Editor.Message.request("asset-db", 'query-asset-info', urlOrUUID);
  // console.log("insert_a_model_node_into_scene+===>getEndAsset_Some=3>", getEndAsset_Some.name);

  // console.log("sceneJs.js 输出版本=load>", [Editor.App.version, Editor.App.dev, Editor.App.userAgent]);
};
// 模块卸载的时候触发的函数
exports.unload = function () {

  // console.log("sceneJs.js 输出版本=unload>", [Editor.App.version, Editor.App.dev, Editor.App.userAgent]);
};

// 后续判断是否为编辑器的预览环境
// 2.x CC_PREVIEW
// 3.x PREVIEW
// if(CC_PREVIEW){}
// if(PREVIEW){}
// https://docs.cocos.com/creator/manual/zh/editor/extension/api/app.html

// 使用的用户代理信息
// Editor.App.userAgent

// Creator 版本号
// Editor.App.version

// 是否是开发模式
// Editor.App.dev

let EDITOR_BOOL = true;

// 模块更新的时候触发的函数
exports.methods = {
  get_cc_engine_version() {
    const { director, Node, Camera, ENGINE_VERSION, renderer, v3, v2, Vec3, Vec2, UITransform, Sprite, Canvas, MeshRenderer, winSize, log, game, gfx } = require('cc');
    let getENGINE_VERSION = ENGINE_VERSION;
    return cc.ENGINE_VERSION || getENGINE_VERSION;
  },
  insert_canvas_children_0() {
    return this.insert_a_model_node_into_scene(node_name_show_arr[0], menu_show_arr[0]);
  },

  on_obfu_value_change() {
    this.clog("on_obfu_value_change 输出版本=on_obfu_value_change>", [Editor.App.version, Editor.App.dev, Editor.App.userAgent]);
  },
  /**
   * @zh 共用一个 log ,方便修改
   * @param args log 的内容
   */
  clog(...args) {
    console.log(...args);
  },
  /**
   * 自动定位选中当前组件节点,高亮+闪动
   */
  select_node_type_uuid(selectType, selectUuid) {
    // Editor is not defined in the editor-preview window.
    // Editor.Selection.clear(selectType);
    // this.clog("select_node_type_uuid selectType=>", selectType, selectUuid);
    Editor.Selection.unselect(selectType, selectUuid);
    Editor.Selection.select(selectType, selectUuid);
    // 闪动
    // Editor.Selection.select("asset", selectUuid);
    Editor.Message.broadcast('selection:select', selectUuid);
    Editor.Message.broadcast('selection:activated', selectUuid);
    // Editor.Message.send(selectType, "ui-kit:touch-asset", selectUuid);
    Editor.Message.send(selectType, "ui-kit", selectUuid);
    Editor.Message.send(selectType, "touch-asset", selectUuid);
    Editor.Message.broadcast('ui-kit:touch-asset', selectUuid);
    Editor.Message.broadcast('assets:hint', selectUuid);
    // 高亮资产
    Editor.Message.send(selectType, "twinkle", selectUuid);
    Editor.Message.broadcast('twinkle', selectUuid);
  },
  insert_a_model_node_into_scene(postNewNodeName, fbx_mesh_name) {
    const { director, Node, Camera, renderer, v3, v2, Vec3, Vec2, UITransform, Sprite, Canvas, MeshRenderer, winSize, log, game, gfx } = require('cc');
    var getCanvasTheNode = (director.getScene().getComponentInChildren("cc.Canvas")) || (cc.director.getScene().getComponentsInChildren("cc.Canvas")[0]);
    if (getCanvasTheNode) {
      var canvasNode = getCanvasTheNode.node || cc.director.getScene().getComponentsInChildren("cc.Canvas")[0].node || getCanvasTheNode.node || cc.find('Canvas');
      var obfuVideoNode = new Node();
      let endOutResultJson = {
        "showNodeName": obfuVideoNode.name,
      };
      return endOutResultJson;
    } else {
      // 没找到 Canvas 节点, 此处新建一个 Canvas 节点
      let newCanvasNode = new Node();
      let endOutResultJson = {
        "showNodeName": obfuVideoNode.name,
      };
      return endOutResultJson;
      // return { "showNodeType": null, "showNodeName": null };
    };
  },
  // 获取scene的所有子节点
  get_scene_children() {
    // var canvas = cc.director.getScene().children[0] || cc.find('Canvas');
    // console.log('Canvas children length == ', [canvas.children, canvas.children.length]);
    const { director } = require('cc');
    // 获取所有的子节点
    let getSceneAll = director.getScene().children;
    // getSceneAll = director.getScene().children.length;
    // cc.director.getScene().children.length;
    return getSceneAll;
  }
};