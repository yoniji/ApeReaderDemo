﻿define(['backbone', 
    'marionette', 
    'scripts/reader/explore_view', 
    'scripts/reader/feature_view', 
    'scripts/reader/profile_view', 
    'scripts/reader/article_view', 
    'scripts/reader/shared_article_view', 
    'scripts/product/product_detail_view', 
    'scripts/product/product_library_view', 
    'scripts/product/product_search_view'],
    function(
        Backbone, 
        Marionette, 
        ExploreView, 
        FeatureView, 
        ProfileView, 
        ArticleView, 
        ShareArticleView, 
        ProductView, 
        ProductLibraryView, 
        ProductSearchView) {

        function setCurrentNavigationById(targetId) {
            $('.homeNavigation-item.current').removeClass('current');
            $('#navigation-' + targetId).addClass('current');
        }
        return Marionette.Controller.extend({
            initialize: function(options) {

                var urlParams = util.getUrlParamMap();

                if (!window.location.hash && urlParams.state) {
                    var hash = decodeURIComponent(urlParams.state);
                    window.location.hash = hash;
                }

                //全部请求都加上用户id
                if (appConfig && appConfig.user_info && appConfig.user_info.id) {

                    var headerData = {
                        "X-SESSION-ID": appConfig.user_info.id
                    };

                    if ( util.isMKApp() ) {
                        headerData['X-APERLUERAPP-ID'] = appConfig.user_info.app_code;
                    }
                    $.ajaxSetup({
                        headers: headerData,
                        cache: false
                    });
                }

                if (window.wx) {
                    //微信Config成功后执行
                    wx.ready(function() {
                        //设置微信分享接口
                        util.setWechatShare(window.appConfig.share_info);
                        //获取网络状态接口
                        wx.getNetworkType({
                            success: function(res) {
                                appConfig.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                                util.trackEvent('NetworkType', res.networkType, 1);
                            }
                        });
                    });

                    //通过config接口注入权限验证配置
                    util.ajax({
                        url: urls.getServiceUrlByName('wechat'),
                        data: {
                            url: util.getUrlWithoutHash()
                        },
                        success: function(response) {
                            util.configWechat(response.data);
                        },
                        method: 'GET'
                    });
                }


            },
            explore: function() {
                if (this.articleView) {

                    this.articleView.destroy();
                    this.articleView = null;
                }
                var exploreView = new ExploreView();
                util.setWechatShare(window.appConfig.share_info);
                setCurrentNavigationById('explore');
            },
            feature: function() {
                if (this.articleView) {
                    this.articleView.destroy();
                    this.articleView = null;
                }
                var featureView = new FeatureView();
                util.setWechatShare(window.appConfig.share_info);
                setCurrentNavigationById('feature');
            },
            post: function(id) {
                if (this.articleView) {
                    this.articleView.destroy();
                    this.articleView = null;
                }
                
                this.articleView = new ArticleView({
                    'id': id,
                    'directShow': true
                });
                
                var exploreView = new ExploreView({
                    'delay':true
                });
                
                setCurrentNavigationById('explore');
            },
            sharePost: function(id) {
                if (this.articleView) {
                    this.articleView.destroy();
                    this.articleView = null;
                }

                var shareArticleView = new ShareArticleView({
                     'id': id,
                    'directShow': true
                });
            },
            products: function() {
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
                util.setWechatShare(window.appConfig.share_info, null, null, 'products');
            },
            searchProducts: function(filter) {
                if (this.productSearchView) {
                    this.productSearchView.destroy();
                    this.productSearchView = null;
                }
                this.productSearchView = new ProductSearchView({originalFilterStr:filter});
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
            },
            productDetail: function(id) {
                if (this.productView) {
                    this.productView.destroy();
                    this.productView = null;
                }
                this.productView = new ProductView({
                    'id': id
                });
                var productLibraryView = new ProductLibraryView({'delay':true});
                setCurrentNavigationById('products');
            },
            me: function() {
                var profileView = new ProfileView();
                setCurrentNavigationById('me');
                
                util.setWechatShare(window.appConfig.share_info);
            }
        });
    });