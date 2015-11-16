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
    exports.isMKApp = function() {
        if ( window.appConfig && window.appConfig.user_info && window.appConfig.user_info.id === 'mkapp') {
            return true;
        } else {
            return false;
        }
    };
    exports.isNetworkSlow = function() {
        switch (appConfig.networkType) {
            case 'wifi':
            return false;
            case '4g':
            return false;
            case '3g+':
            return true;
            case '3g':
            return true;
            case '2g':
            return true;
            default:
            return true;
        }
    };

    exports.trim = function(str) {
        var result = '';
        if(str) {
            result = str.replace(/(^\s+)|(\s+$)/g, "");
        }
        return result;
    };

    exports.getUrlWithoutHash = function() {
        var url = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port) url += (':' + window.location.port);
        url = url + window.location.pathname + window.location.search;
        return url;
    };
    exports.getUrlWithoutHashAndSearch = function() {
        var url = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port) url += (':' + window.location.port);
        url = url + window.location.pathname;
        return url;
    };
    exports.generateShareUrlWithCurrentLocation = function(hash) {
        var url = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port) url += (':' + window.location.port);
        url = url + window.location.pathname;

        if (hash) url += '?hash=' + encodeURIComponent(hash);
        return url;
    };

    exports.configWechat = function(options) {
        if (window.wx) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: options.appId, // 必填，公众号的唯一标识
                timestamp: options.timestamp, // 必填，生成签名的时间戳
                nonceStr: options.nonceStr, // 必填，生成签名的随机串
                signature: options.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    };

    exports.mkAppShare = function(shareInfo, onSuccess, onCancel, hash) {
        var link = shareInfo.link;
        if (!link) {
            link = util.generateShareUrlWithCurrentLocation(hash);
        }
        var shareURL = "appruler://share/" + encodeURIComponent(link) + '/' + encodeURIComponent(shareInfo.image.url) + '/' + encodeURIComponent(shareInfo.message_title) + '/' + encodeURIComponent(shareInfo.message_description);
        if (onSuccess) onSuccess();
        window.open(shareURL);
    };

    exports.setWechatShare = function(shareInfo, onSuccess, onCancel, hash) {
        var link = shareInfo.link;
        if (!link) {
            link = util.generateShareUrlWithCurrentLocation(hash);
        }
        if (window.wx) {
            wx.onMenuShareTimeline({
                title: shareInfo.timeline_title, // 分享标题
                link: link, // 分享链接
                imgUrl: shareInfo.image.url, // 分享图标
                success: function() {
                    util.trackEvent('ShareSuccess', 'Timeline', 1);
                    if (onSuccess) onSuccess();
                },
                cancel: function() {
                    util.trackEvent('ShareCancel', 'Timeline', 1);
                    if (onCancel) onCancel();
                },
                complete: function() {
                    if (onComplete) onComplete();
                }
            });
            wx.onMenuShareAppMessage({
                title: shareInfo.message_title, // 分享标题
                desc: util.trim(shareInfo.message_description), // 分享描述
                link: link, // 分享链接
                imgUrl: shareInfo.image.url, // 分享图标
                success: function() {
                    util.trackEvent('ShareSuccess', 'AppMessage', 1);
                    if (onSuccess) onSuccess();
                },
                cancel: function() {
                    util.trackEvent('ShareCancel', 'AppMessage', 1);
                    if (onCancel) onCancel();
                },
                complete: function() {
                    if (onComplete) onComplete();
                }
            });

            wx.onMenuShareQQ({
                title: shareInfo.message_title, // 分享标题
                desc: shareInfo.message_description, // 分享描述
                link: link, // 分享链接
                imgUrl: shareInfo.image.url, // 分享图标
                success: function() {
                    util.trackEvent('ShareSuccess', 'QQ', 1);
                    if (onSuccess) onSuccess();
                },
                cancel: function() {
                    util.trackEvent('ShareCancel', 'QQ', 1);
                    if (onCancel) onCancel();
                },
                complete: function() {
                    if (onComplete) onComplete();
                }
            });

            wx.onMenuShareQZone({
                title: shareInfo.message_title, // 分享标题
                desc: shareInfo.message_description, // 分享描述
                link: link, // 分享链接
                imgUrl: shareInfo.image.url, // 分享图标
                success: function() {
                    util.trackEvent('ShareSuccess', 'QZone', 1);
                    if (onSuccess) onSuccess();
                },
                cancel: function() {
                    util.trackEvent('ShareCancel', 'QZone', 0);
                    if (onCancel) onCancel();
                },
                complete: function() {
                    if (onComplete) onComplete();
                }
            });


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

    exports.previewImages = function(urls, current) {
        if (window.wx) {
            if (!current) current = urls[0];
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            });
        }
    };


    exports.ajax = function(options) {
        var STATUS_SUCCESS = 0;

        options = options || {};
        var url, data, type, success, networkError, complete;
        url = options.url;
        data = options.data || {};
        type = options.method || 'GET';
        success = options.success;
        networkError = options.error;
        complete = options.complete;

        $.ajax({
            url: url,
            data: data,
            dataType: 'json',
            type: type,
            success: function(data, textStatus, jqXHR) {
                if (data && data.code === STATUS_SUCCESS) {
                    if (success) success(data);
                } else {
                    if (data && data.message) {
                        alert('errorMessage: ' + data.message);
                    } else {
                        alert('请稍后再试');
                    }
                }
                if (complete) {
                    complete();
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (networkError) {
                    networkError();
                } else {
                    alert('您的网络情况不太好，请稍后再试');
                }
                if (complete) {
                    complete();
                }
            }
        });

    };

    var getUserTag = function() {
        return "goose";
    };

    exports.trackEvent = function(eventID, label, mapKv) {

        if (window.TDAPP) {
            if (mapKv) {
                TDAPP.onEvent(eventID, label, mapKv);
            } else {
                TDAPP.onEvent(eventID, label);
            }
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

    exports.supportSessionStorage = function() {
        var mod = 'modernizr';
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };
    exports.clearSessionStorage = function() {
        if (util.supportSessionStorage()) sessionStorage.clear();
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

    exports.getDateString = function(seconds) {

        var timeStr = "";
        var now = (new Date()).getTime();
        var duration = Math.floor(now / 1000 - seconds);
        if (duration < 60) {
            timeStr = "刚刚";
        } else if (duration < 3600) {
            timeStr = Math.floor(duration / 60) + "分钟前";
        } else if (duration < 3600 * 24) {
            timeStr = Math.floor(duration / 3600) + "小时前";
        } else if (duration < 3600 * 24 * 2) {
            timeStr = Math.floor(duration / 3600 / 24) + "天前";
        } else if (duration < 3600 * 24 * 30 * 12) {
            //timeStr = Math.floor(duration / 3600 / 24 / 30) + "个月前";
        } else {
            //timeStr = "1年前";
        }
        return timeStr;

    };

    exports.getDeviceRatio = function() {
        var ratio = window.devicePixelRatio;
        if (!ratio) ratio = 1;
        if (ratio > 3) ratio = 3;

        if (util.isNetworkSlow()) ratio = Math.min(ratio, 2);
        
        return ratio;
    };
    exports.calculateSizeWithMinimumEdgeAdaptive = function(containerSize, originalImageSize) {
        var newSize = {
            width: 0,
            height: 0
        };
        var imageWidth = containerSize.width;
        var imageHeight = Math.round(originalImageSize.height * imageWidth / originalImageSize.width);
        if (imageHeight < containerSize.height) {
            imageHeight = containerSize.height;
            imageWidth = Math.round(originalImageSize.width * imageHeight / originalImageSize.height);
        }
        newSize.width = imageWidth;
        newSize.height = imageHeight;

        newSize.left = Math.round((containerSize.width - imageWidth) / 2);
        newSize.top = Math.round((containerSize.height - imageHeight) / 2);
        return newSize;
    };

    exports.generateImageHtml = function(imageObject, containerSize, containerClass) {
        var outStr = '';
        if (!containerClass) containerClass = '';
        outStr += '<div class="image ' + containerClass + '" style="width:' + containerSize.width + 'px;height:' + containerSize.height + 'px;">';

        if (imageObject.type === 'oss') {
            outStr += '<img src="' + imageObject.url + '@' + containerSize.width * util.getDeviceRatio() + 'w_' + containerSize.height * util.getDeviceRatio() + 'h_1e_1c' + '" style="width:' + containerSize.width + 'px;height:' + containerSize.height + 'px;">';
        } else {
            var newSize = util.calculateSizeWithMinimumEdgeAdaptive(containerSize, imageObject);
            outStr += '<img src="' + imageObject.url + '" style="position:absolute;width:' + newSize.width + 'px;height:' + newSize.height + 'px;left:' + newSize.left + 'px;top:' + newSize.top + 'px;" >';
        }
        outStr += '</div>';
        return outStr;
    };

    exports.preventDefault = function(event) {
        event.preventDefault();
        if(event.originalEvent) event.originalEvent.preventDefault();

    };
    exports.stopPropagation = function(event) {
        event.stopPropagation();
        if(event.originalEvent) event.originalEvent.stopPropagation();
    };
    exports.setIconToLoading = function(iconEl) {
        iconEl.attr('originalClass', iconEl.attr('class'));
        iconEl.attr('class', 'icon icon-refresh2 spin');
    };

    exports.revertIconFromLoading = function(iconEl, revertClass) {
        if (!revertClass) {
            revertClass = iconEl.attr('originalClass');
        }

        iconEl.attr('class', revertClass);
    };

    exports.setButtonToLoading = function(btnEl) {
        btnEl.attr('originalText', btnEl.text());
        btnEl.addClass('btn-loading');
        btnEl.html('<i class="icon icon-refresh2 spin"></i>');
    };

    exports.revertButtonFromLoading = function(btnEl) {
        btnEl.removeClass('btn-loading');
        btnEl.html(btnEl.attr('originalText'));
    };

    exports.setElementTransform = function(element, transformStr) {
        if (element && element.size() > 0) {
            element[0].style.webkitTransform = transformStr;
            element[0].style.transform = transformStr;
        }
    };

    exports.setElementTransformOrigin = function(element, transformOriginStr) {
        if (element && element.size() > 0) {
            element[0].style.webkitTransformOrigin = transformOriginStr;
            element[0].style.transformOrigin = transformOriginStr;
        }
    };

    exports.getRandomItemInList = function(list) {
        if (list && list.length > 0) {
            var index = Math.floor(Math.random() * list.length);
            return list[index];
        }
    };

});