import { error, warn } from "cc";

var urls: any = {};                      // 当前请求地址集合
var reqparams: any = {};                 // 请求参数

/** 请求事件 */
export enum HttpEvent {
    /** 断网 */
    NO_NETWORK = "http_request_no_network",
    /** 未知错误 */
    UNKNOWN_ERROR = "http_request_unknown_error",
    /** 请求超时 */
    TIMEOUT = "http_request_timout"
}

/** HTTP请求 */
export class HttpRequest {
    /** 服务器地址 */
    server: string = "http://127.0.0.1/";
    /** 请求超时时间 */
    timeout: number = 10000;

    /**
     * HTTP GET请求
     * @param name                  协议名
     * @param completeCallback      请求完整回调方法
     * @param errorCallback         请求失败回调方法
     * @example
    var complete = function(response){
        console.log(response);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.get(name, complete, error);
     */
    get(name: string, completeCallback: Function, errorCallback: Function, headers = []) {
        this.sendRequest(name, null, false, completeCallback, errorCallback, null, true, this.timeout, headers)
    }

    /**
     * HTTP GET请求
     * @param name                  协议名
     * @param params                查询参数
     * @param completeCallback      请求完整回调方法
     * @param errorCallback         请求失败回调方法
     * @example
    var param = '{"uid":12345}'
    var complete = function(response){
        var jsonData = JSON.parse(response);
        var data = JSON.parse(jsonData.Data);
        console.log(data.Id);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.getWithParams(name, param, complete, error);
     */
    getWithParams(name: string, params: any, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(name, params, false, completeCallback, errorCallback)
    }

    /**
     * HTTP GET请求非文本格式数据
     * @param name                  协议名
     * @param completeCallback      请求完整回调方法
     * @param errorCallback         请求失败回调方法
     */
    getByArraybuffer(name: string, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(name, null, false, completeCallback, errorCallback, 'arraybuffer', false);
    }

    /**
     * HTTP GET请求非文本格式数据
     * @param name                  协议名
     * @param params                查询参数
     * @param completeCallback      请求完整回调方法
     * @param errorCallback         请求失败回调方法
     */
    getWithParamsByArraybuffer(name: string, params: any, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(name, params, false, completeCallback, errorCallback, 'arraybuffer', false);
    }

    /**
     * HTTP POST请求
     * @param name                  协议名
     * @param params                查询参数
     * @param completeCallback      请求完整回调方法
     * @param errorCallback         请求失败回调方法
     * @example
    var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
    var complete = function(response){
        var jsonData = JSON.parse(response);
        var data = JSON.parse(jsonData.Data);
        console.log(data.Id);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.post(name, param, complete, error);
     */
    post(name: string, params: any, completeCallback?: Function, errorCallback?: Function, headers = []) {
        this.sendRequest(name, params, true, completeCallback, errorCallback, null, true, this.timeout, headers)
    }

    /** 取消请求中的请求 */
    abort(name: string) {
        var xhr = urls[this.server + name];
        if (xhr) {
            xhr.abort();
        }
    }

    /**
     * 获得字符串形式的参数
     */
    private getParamString(params: any) {
        var result = "";
        for (var name in params) {
            let data = params[name];
            if (data instanceof Object) {
                for (var key in data)
                    result += `${key}=${data[key]}&`;
            }
            else {
                result += `${name}=${data}&`;
            }
        }

        return result.substr(0, result.length - 1);
    }

    /** 
     * Http请求 
     * @param name(string)              请求地址
     * @param params(JSON)              请求参数
     * @param isPost(boolen)            是否为POST方式
     * @param callback(function)        请求成功回调
     * @param errorCallback(function)   请求失败回调
     * @param responseType(string)      响应类型
     */
    private sendRequest(name: string,
        params: any,
        isPost: boolean,
        completeCallback?: Function,
        errorCallback?: Function,
        responseType?: string,
        isOpenTimeout = true,
        timeout: number = this.timeout,
        headers = [],
        ) {
        if (name == null || name == '') {
            error("请求地址不能为空");
            return;
        }

        var url: string, newUrl: string, paramsStr: string;
        if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
        }
        else {
            url = this.server + name;
        }

        if (params) {
            paramsStr = this.getParamString(params);
            if (url.indexOf("?") > -1)
                newUrl = url + "&" + paramsStr;
            else
                newUrl = url + "?" + paramsStr;
        }
        else {
            newUrl = url;
        }

        if (urls[newUrl] != null && reqparams[newUrl] == paramsStr!) {
            warn(`地址【${url}】已正在请求中，不能重复请求`);
            return;
        }

        var xhr = new XMLHttpRequest();

        // 防重复请求功能
        urls[newUrl] = xhr;
        reqparams[newUrl] = paramsStr!;

        if (isPost) {
            xhr.open("POST", url);
        }
        else {
            xhr.open("GET", newUrl);
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        for (const temp of headers) {            
            xhr.setRequestHeader(temp.key, temp.value);
        }
        // xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        var data: any = {};
        data.url = url;
        data.params = params;

        // 请求超时
        if (isOpenTimeout) {
            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                this.deleteCache(newUrl);

                data.event = HttpEvent.TIMEOUT;

                if (errorCallback) errorCallback(data);
            }
        }

        xhr.onloadend = (a) => {
            if (xhr.status == 500) {
                this.deleteCache(newUrl);

                if (errorCallback == null) return;

                data.event = HttpEvent.NO_NETWORK;          // 断网

                if (errorCallback) errorCallback(data);
            }
        }

        xhr.onerror = () => {
            this.deleteCache(newUrl);

            if (errorCallback == null) return;

            if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
                data.event = HttpEvent.NO_NETWORK;          // 断网 
            }
            else {
                data.event = HttpEvent.UNKNOWN_ERROR;       // 未知错误
            }

            if (errorCallback) errorCallback(data);
        };

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            this.deleteCache(newUrl);

            if (xhr.status == 200) {
                if (completeCallback) {
                    if (responseType == 'arraybuffer') {
                        // 加载非文本格式
                        xhr.responseType = responseType;
                        if (completeCallback) completeCallback(xhr.response);
                    }
                    else {
                        // 加载非文本格式
                        var data: any = JSON.parse(xhr.response);
                        if (data.code != null) {
                            /** 服务器错误码处理 */
                            if (data.code == 0) {
                                if (completeCallback) completeCallback(data.data);
                            }
                            else {
                                if (errorCallback) errorCallback(data);
                            }
                        }
                        else {
                            if (completeCallback) completeCallback(data);
                        }
                    }
                }
            }
        };

        if (params == null || params == "") {
            xhr.send();
        }
        else {
            xhr.send(paramsStr!);                // 根据服务器接受数据方式做选择
            // xhr.send(JSON.stringify(params));
        }
    }

    private deleteCache(url: string) {
        delete urls[url];
        delete reqparams[url];
    }
}