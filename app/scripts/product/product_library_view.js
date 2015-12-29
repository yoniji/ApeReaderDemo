define(['marionette', 'mustache', 'jquery', 
    'text!templates/product_library.html', 
    'scripts/product/product_library_model', 
    'scripts/product/product_search_view', 
    'scripts/product/product_detail_view',
    'waves',
    'scripts/product/ctrl_product_list_view', 
    'scripts/product/ctrl_brand_list_view', 
    'scripts/product/ctrl_featured_carousel_view', 
    'hammerjs',
    'jquery-hammerjs',
    'iscroll'],
    function(Marionette, Mustache, $, 
        template, 
        ProductLibraryModel, 
        ProductSearchView, 
        ProductView, 
        Waves, 
        CtrlProductListView, 
        CtrlBrandListView, 
        CtrlFeatureSlideView,
        Hammer) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap .tabItem': 'onTapTab',
                'tap .roomsNav-item': 'onTapRoom',
                'tap .brandItem': 'onTapBrand',
                'tap .brand-slide': 'onTapBrand',
                'touchmove':'onTouchMove'
            },
            ui: {
                'tabs': '.tabs'
            },
            initialize: function() {
                this.model = new ProductLibraryModel();
                app.rootView.updatePrimaryRegion(this);
                //init share info
                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;

                share_info.timeline_title =  '产品首页「悟空家装」';
                share_info.message_title = share_info.timeline_title;

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#products');
                share_info.link =url;

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null ,null);
            },
            onShow: function() {
               
               this.slides = new CtrlFeatureSlideView({
                container: this.$el.find('.carousel-inner')
               });

                //推荐产品
                this.featureProducts = new CtrlProductListView({
                    container: this.$el.find('.horizontalProductListInner'),
                    filterJSON: {
                        'limit':20,
                        'sample':4
                    }
                });


                this.brandsA = new CtrlBrandListView({
                    filterJSON: {
                        'initial':'a,b,c,d,e,f,g'
                    },
                    container: this.$el.find('#paneA')
                });

                this.brandsH = new CtrlBrandListView({
                    filterJSON: {
                        'initial':'h,i,j,k,l,m,n'
                    },
                    container: this.$el.find('#paneH')
                });

                this.brandsO = new CtrlBrandListView({
                    filterJSON: {
                        'initial':'o,p,q,r,s'
                    },
                    container: this.$el.find('#paneO')
                });

                this.brandsT = new CtrlBrandListView({
                    filterJSON: {
                        'initial':'t,u,v,w,x,y,z,0,#'
                    },
                    container: this.$el.find('#paneT')
                });
                
                //品牌tab固顶
                var self = this;
                this.lastScrollTop = 0;
                this.lastScrollDirection = -1; //DOWN
                this.tabTop = this.ui.tabs.position().top;
                this.$el.on('scroll', function(ev) {
                    self.onScroll(ev);
                });


                this.$el.find('.tapEnable').each(function(index, el) {
                    $(el).hammer({ recognizers:[[Hammer.Tap]]});
                });
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
                this.$el.find('.tapEnable').each(function(index, el){
                    $(el).destroyHammer();
                });
                this.stopListening();
            },
            id: 'productLibrary',
            className: 'rootWrapper'
        });
    });