var request = require("request"),
    http = require('http'),
    url = require("url"),
    config = require('../config'),
    querystring = require('querystring'),
    log = require("../common/log").logger("netWork");

var tools = {
    url: function (type) {
        switch (type) {
            case "jp_server":
                if (config.isDev) {
                    return config.dev["jp_server"];
                } else {
                    return config.production["jp_server"];
                }
            default:
                if (config.isDev) {
                    return config.dev["server"];
                } else {
                    return config.production["server"];
                }
        }
    },
    debugLog: function (url, method) {
        if (config.isDebug) {
            log.info('使用[' + method + ']方式，调用远程接口:' + url);
        }
    },
    objToQuery: function (obj) {
        if (obj) {
            var result = ''
            for (var d in obj) {
                if (obj[d] instanceof Function)
                    continue
                result += d + '=' + obj[d] + '&'
            }
            return result.substring(0, result.length - 1)
        }
        return ''
    },
    handlerResult: function (url, result, sFn, fFn) {
        var json = result;
        try {
            if (typeof json === "string") {
                json = JSON.parse(result);
            }
        } catch (err) {
            log.error("JAVA接口JSON转换失败URL:" + url, result);
            if (fFn) {
                fFn(new Error("JAVA接口JSON转换失败"));
                return;
            } else {
                process.nextTick(process.domain.intercept(function () {
                    throw new Error("JAVA接口JSON转换失败:" + result);
                }));
            }
        }
        if (json.code != 0) {
            log.info("JAVA接口:[" + url + "]异常返回值", json);
            process.nextTick(process.domain.intercept(function () {
                throw json;
            }));
        } else {
            sFn && sFn(json);
        }
    }
};

function NetWork() {

};

NetWork.prototype.ajax = function (opts) {
    var self = this;
    var other = false;
    var type = opts.method.toLocaleUpperCase();
    var path = url.resolve(tools.url(opts.netType), opts.url);
    var accessToken = "";
    if (opts.data && opts.data.token) {
        accessToken = opts.data.token;
    }
    if (!opts.headers) opts.headers = {accessToken: accessToken};
    else opts.headers["accessToken"] = accessToken;
    delete opts.data.token;
    var reqOps = {
        method: type,
        headers: opts.headers,
        timeout: 20000
    }
    switch (type) {
        case "GET":
            reqOps["url"] = path.concat("?req=", JSON.stringify(opts.data));
            break;
        case "POST":
            reqOps["url"] = path.concat("?req=", JSON.stringify(opts.data));
            break;
        case "LOAD":
            other = true;
            break;
    }
    var startTime = new Date().getTime();
    if (other) {
        var params = tools.objToQuery(opts.data);
        var u = opts.url.concat("?", params);
        log.info(type + ":" + "[" + u + "]");
        request(u, function (err, res, body) {
            var endTime = new Date().getTime();
            log.info(type + ":" + "请求[" + u + "] 响应时间:" + (endTime - startTime) + "ms");
            if (err) {
                if (opts.error) {
                    opts.error(err);
                } else {
                    log.error("nodejs 调用 外部接口发生错误！URL:" + u, err);
                    process.nextTick(process.domain.intercept(function () {
                        throw new Error("nodejs 调用 外部接口发生错误！URL:" + u);
                    }));
                }
            } else {
                opts.success && opts.success(body);
            }
        });
    } else {
        request(reqOps, function (err, res, body) {
            if (err) {
                log.error("nodejs 调用 java 发生错误！URL:" + reqOps.url, err);
                process.nextTick(process.domain.intercept(function () {
                    throw new Error("nodejs 调用 java 发生错误！URL:" + reqOps.url);
                }));
                //tools.handlerResult(reqOps.url, body, opts.success, opts.error);
            } else {
                var endTime = new Date().getTime();
                log.info(type + ":" + "请求[" + reqOps.url + "] 响应时间:" + (endTime - startTime) + "ms");
                tools.handlerResult(reqOps.url, body, opts.success, opts.error);
            }
        });
    }
    tools.debugLog(other ? opts.url : reqOps.url, other ? "GET" : reqOps.method);
}

NetWork.prototype.get = function (url, data, success, err, netType) {
    this.ajax({
        url: url,
        data: data,
        method: "GET",
        success: success,
        err: err,
        netType: netType
    });
}

NetWork.prototype.post = function (url, data, success, err, netType) {
    this.ajax({
        url: url,
        data: data,
        method: "POST",
        success: success,
        err: err,
        netType: netType
    });
}

NetWork.prototype.load = function (url, data, success, err) {
    this.ajax({
        url: url,
        data: data,
        method: "LOAD",
        success: success,
        err: err
    });
}

var netWork = new NetWork();

module.exports = {
    get: netWork.get,
    post: netWork.post,
    load: netWork.load,
    ajax: netWork.ajax
}
