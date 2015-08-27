define(['backbone', 'marionette', 'modules/reader/exploreview', 'modules/reader/featureview', 'modules/reader/profileview', 'modules/reader/articleview', 'modules/reader/productview', 'modules/reader/productlibraryview', 'modules/reader/productsearchview'],
    function(Backbone, Marionette, ExploreView, FeatureView, ProfileView, ArticleView, ProductView, ProductLibraryView, ProductSearchView) {

        function setCurrentNavigationById(targetId) {
            $('.homeNavigation-item.current').removeClass('current');
            $('#navigation-' + targetId).addClass('current');
        }
        return Marionette.Controller.extend({
            initialize: function(options) {

                //全部请求都加上用户id
                if (appConfig && appConfig.user_info && appConfig.user_info.id) {
                    $.ajaxSetup({
                        headers: {
                            "X-SESSION-ID": appConfig.user_info.id
                        },
                        cache: false
                    });
                }

                
                if (wx) {
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
                    this.articleView.onTapBack();
                } else {
                    var exploreView = new ExploreView();
                }

                setCurrentNavigationById('explore');
            },
            feature: function() {
                if (this.articleView) {
                    this.articleView.onTapBack();
                } else {
                    var featureView = new FeatureView();
                }

                setCurrentNavigationById('feature');
            },
            post: function(id) {
                if (this.articleView) {
                    this.articleView.onTapBack();
                }
                
                this.articleView = new ArticleView({
                    'id': id
                });
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            },
            products: function() {
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
            },
            searchProducts: function(filter) {
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
                var productSearchView = new ProductSearchView(filter);
            },
            productDetail: function(id) {
                var productView = new ProductView({
                    'id': id
                });
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            },
            me: function() {
                var profileView = new ProfileView();
                setCurrentNavigationById('me');
            }
        });
    });