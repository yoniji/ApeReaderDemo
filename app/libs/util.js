define(function(require, exports, module) {

    exports.getUrlParamMap = function() {
        if (!location.search) return {};
        var params = {};
        var fragments = location.search.substr(1).split('&');
        for (var i = 0; i < fragments.length; i++) {
            var pairs = fragments[i].split('=');
            params[pairs[0]] = pairs[1];
        }
        return params;
    };

    exports.toJSONString = function(jsonObj) {
        try {
            return JSON.stringify(jsonObj);
        } catch (e) {
            console.log(e.message);
            console.log(e.description);
            return null;
        }
    };

    exports.parseJSON = function(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.log("[JSON]:" + e.message);
            console.log("[JSON]:" + e.description);
            return null;
        }
    };



    exports.setupWechat = function() {
        var onBridgeReady = function() {
            var b = window.WeixinJSBridge;
            // tag session network type
            b.invoke("getNetworkType", {}, function(e) {
                if (window._hmt) {
                    _hmt.push(['_setCustomVar', 2, 'network', e.err_msg, 2]);
                }
            });
            var onShare = function(action) {
                if (!App || !Player.brain) return;
                var data = App.shareData();
                b.invoke(action, {
                    "appid": App.wechatAppId,
                    "img_url": "http://brain.hortorgames.com/img/appicon.png",
                    "img_width": data.iconSize,
                    "img_height": data.iconSize,
                    "link": data.url,
                    "desc": data.desc,
                    "title": data.title
                }, function(res) {
                    if (/ok|confirm/.test(res.err_msg)) {
                        Player.isShared = true;
                        $(".content").trigger("share-success");
                        util.trackEvent(action + "-succ", location.hash || "#");
                    }
                });
            };
            b.on('menu:share:timeline', function() {
                util.trackEvent('shareTimeline', location.hash || "#");
                onShare("shareTimeline");
            });
            b.on('menu:share:appmessage', function() {
                util.trackEvent('sendAppMessage', location.hash || "#");
                onShare('sendAppMessage');
            });
            b.call('showOptionMenu');
            b.call('hideToolbar');
        };

        if (window.WeixinJSBridge) return onBridgeReady();
        var d = document;
        var msg = 'WeixinJSBridgeReady';
        if (d.addEventListener) {
            d.addEventListener(msg, onBridgeReady);
        } else if (d.attachEvent) {
            d.attachEvent(msg, onBridgeReady);
            d.attachEvent("on" + msg, onBridgeReady);
        }
    };


    exports.ajax = function(options) {
        var xhr = new XMLHttpRequest(),
            abortTimeout;
        xhr.open(options.method.toUpperCase(), options.url, options.async !== false);
        if (options.contentType) {
            xhr.setRequestHeader("Content-Type", options.contentType);
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Accept', '*/*');
        if (options.withCredentials) {
            xhr.withCredentials = true;
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = function() {};
                clearTimeout(abortTimeout);
                var cb = options.callback;
                if (!_.isFunction(cb)) return;
                if (xhr.status == 200) {
                    cb(xhr.status, xhr.responseText);
                } else {
                    console.log("[ajax] " + options.url + " response status error :" + xhr.status);
                    if (xhr.status <= 0) {
                        cb(xhr.status, null);
                    } else {
                        cb(xhr.status, xhr.responseText);
                    }
                }
            }
        };
        if (options.timeout > 0)
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = function() {};
                xhr.abort();
                if (options.callback) options.callback("timeout", null);
            }, options.timeout);
        xhr.send(options.body ? options.body : null);
    };

    var getUserTag = function() {
        return "goose";
    };

    exports.trackEvent = function(category, event, p1, p2, p3, p4, p5) {
        var rec = {
            "event": event,
            time: new Date()
        };
        if (typeof p1 != "undefined") rec.p1 = p1;
        if (typeof p2 != "undefined") rec.p2 = p2;
        if (typeof p3 != "undefined") rec.p3 = p3;
        if (typeof p4 != "undefined") rec.p4 = p4;
        if (typeof p5 != "undefined") rec.p5 = p5;

        if (window._hmt) {
            var params = ['_trackEvent', category, event];
            _hmt.push(params);
        }
    };

    exports.trackPV = function() {
        if (window._hmt) {
            var page = location.hash.replace("#", "/");
            page = page || "/";
            _hmt.push(['_trackPageview', page]);
        }
    };

    exports.tagUser = function() {
        if (window._hmt) {
            _hmt.push(['_setCustomVar', 1, 'time', getUserTag(), 2]);
        }
    };

    exports.navigationTo = function(url) {
        var timeout = setTimeout(function() {
            window.location.href = url;
        }, 0);
    };


    exports.supportLocalStorage = function() {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };

    exports.clearLocalStorage = function() {
        if (util.supportLocalStorage()) localStorage.clear();
    };

    exports.seconds2time = function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        seconds = seconds - (hours * 3600) - (minutes * 60);
        var time = "";

        if (hours !== 0) {
            time = hours + ":";
        }
        if (minutes !== 0 || time !== "") {
            minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
            time += minutes + ":";
        }
        if (time === "") {
            time = seconds + "s";
        } else {
            time += (seconds < 10) ? "0" + seconds : String(seconds);
        }
        return time;
    };


});