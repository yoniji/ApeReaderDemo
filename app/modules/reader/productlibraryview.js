define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productlibrary.html', 'modules/reader/productlibrarymodel', 'carousel', 'modules/reader/productsearchview', 'modules/reader/productview','waves', 'iscroll'],
    function(Marionette, Mustache, $, template, ProductLibraryModel, Carousel, ProductSearchView, ProductView, Waves) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap .tabItem': 'onTapTab',
                'tap .roomsNav-item': 'onTapRoom',
                'tap .brandItem': 'onTapBrand',
                'tap .brand-slide': 'onTapBrand',
                'tap .product-slide': 'onTapProduct',
                'tap .productItem': 'onTapProduct',
                'touchmove':'onTouchMove'
            },
            ui: {
                'tabs': '.tabs'
            },
            initialize: function() {
                this.model = new ProductLibraryModel();
                app.rootView.updatePrimaryRegion(this);
                util.setWechatShare(window.appConfig.share_info);
            },
            onShow: function() {
                //初始化顶部幻灯片
                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();
                //推荐产品
                var productList = this.$el.find('.productItem');
                var productListWidth = (productList.width() + 5) * productList.size();
                this.$el.find('.horizontalProductListInner').width(productListWidth + 'px');
                
                this.scroller = new IScroll(this.$el.find('.horizontalProductList')[0], {
                    'scrollX': true,
                    'scrollY': false,
                    'bindToWrapper':true,
                    'snap':true,
                    'eventPassthrough':true
                });
                
                //品牌tab固顶
                var self = this;
                this.lastScrollTop = 0;
                this.lastScrollDirection = -1; //DOWN
                this.tabTop = this.ui.tabs.position().top;
                this.$el.on('scroll', function(ev) {
                    self.onScroll(ev);
                });


                 Waves.attach(this.$el.find('.productItem,.slide'),['waves-block']);
            },
            templateHelpers: function() {
                var windowWidth = $(window).width();
                var slideHeight = Math.round(windowWidth * 0.667);

                return {
                    getSlideHeight: function() {
                        return slideHeight;
                    },
                    getSlideSmallWidth: function() {
                        return windowWidth - slideHeight;
                    },
                    getLargeSlideImgStr: function() {
                        return '@' + 3 * slideHeight + 'h_' + 3 * slideHeight + 'w_1e_1c';
                    },
                    getSmallSlideImgStyle: function() {
                        var imgSize = slideHeight * 2;
                        var containerWidth = windowWidth - slideHeight;
                        var left = Math.round((containerWidth - imgSize) / 2);
                        var top = Math.round((slideHeight - imgSize) / 2);
                        return 'position:absolute;width:' + imgSize + 'px;height:' + imgSize + 'px;left:' + left + 'px;top:' + top + 'px';
                    }
                };
            },
            onTouchMove:function(ev) {
                util.stopPropagation(ev);
            },
            onTapTab: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var target = $(ev.currentTarget);
                rel = target.attr('rel');


                if (rel) {
                    this.$el.find('.pane.current').removeClass('current');
                    $('#' + rel).addClass('current');

                    this.$el.find('.tabItem.current').removeClass('current');
                    target.addClass('current');
                }
            },
            onTapRoom: function(ev) {
                var id = '';
                id = $(ev.currentTarget).attr('data-id');

                var productSearchView = new ProductSearchView({
                    'delay':true,
                    'filters': {
                        'roomId':id
                    }
                });
            },
            onTapBrand: function(ev) {
                var id = '',logo = '';
                id = $(ev.currentTarget).attr('data-id');
                logo = $(ev.currentTarget).attr('data-logo');

                var productSearchView = new ProductSearchView({
                    'delay':true,
                    'filters': {
                        'brand': {
                            id: id,
                            logo: {
                                url: logo
                            }
                        }
                    }
                });
            },
            onTapProduct: function(ev) {
                var productView = new ProductView({
                    'id': 3,
                    'delay':true
                });
            },
            onScroll: function(ev) {
                var currentScrollTop = this.$el.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop < currentScrollTop ? 1 : -1;

                if (currentScrollDirection === 1) {
                    this.onScrollDown();
                } else {
                    this.onScrollUp();
                }
                this.lastScrollDirection = currentScrollDirection;

                this.lastScrollTop = currentScrollTop;
            },
            onScrollUp: function(ev) {
                if (this.$el.scrollTop() < this.tabTop) {
                    this.stopFixedTop();
                }
            },
            onScrollDown: function(ev) {
                if (this.$el.scrollTop() > this.tabTop) {
                    this.startFixedTop();
                }
            },
            startFixedTop: function() {
                if (!this.ui.tabs.hasClass('fixedTop')) {
                    this.placeHolder = $('<div></div>');
                    this.placeHolder.css({
                        'width': this.ui.tabs.width(),
                        'height': this.ui.tabs.height()
                    });
                    this.ui.tabs.addClass('fixedTop');
                    this.ui.tabs.after(this.placeHolder);
                }
            },
            stopFixedTop: function() {
                if (this.ui.tabs.hasClass('fixedTop')) {
                    if (this.placeHolder) this.placeHolder.remove();
                    this.ui.tabs.removeClass('fixedTop');
                }
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                if (this.carousel) this.carousel.destroy();
                this.stopListening();
            },
            id: 'productLibrary',
            className: 'rootWrapper'
        });
    });