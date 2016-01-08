define(['marionette', 
    'mustache', 
    'jquery', 
    'text!templates/product_search.html', 
    'scripts/product/product_search_model', 
    'scripts/product/product_collection', 
    'scripts/product/product_thumb_view', 
    'scripts/common/filterbar_view', 
    'scripts/common/filterbar_model', 
    'scripts/common/empty_view',
    'scripts/product/ctrl_brand_filter_view',
    'hammerjs',
    'jquery-hammerjs'],
    function(Marionette, 
        Mustache, 
        $, 
        template, 
        ProductSearchModel, 
        ProductCollection, 
        ProductItemView, 
        FilterBarView, 
        FilterBarModel, 
        EmptyView, 
        SelectBrandView,
        Hammer) {

        var limit = 20,startPage = 1;
        var filters = {};

        function parseFilterString(originalFilterStr) {
            var result = {};
            var filterArray = originalFilterStr.split('/');
            for (var i=0; i < filterArray.length - 1; i+=2 ) {
                switch ( filterArray[i] ) {
                    case 'brand':
                    result.brand = {
                        id : filterArray[i+1],
                        logo:{}
                    };
                    break;
                    case 'logo':
                    if (result.brand) {
                        result.brand.logo = { url: util.base64_decode(filterArray[i+1]) };
                    }
                    break;
                    case 'room':
                    result.roomId = filterArray[i+1];
                    break;
                    case 'type':
                    result.typeId = filterArray[i+1];
                    break;
                }

            }
            return result;
        }

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'filterBar': '.filterBar',
                'filterMenuItem': '.dropDown-menu-item',
                'toolBar': '.toolBar',
                'back': '.toolBar-back'
            },
            events: {
                'scroll @ui.streamWrapper': 'onScroll',
                'tap @ui.back': 'onTapBack',
                'tap .toolBar-filter': 'onChangeBrand',
                'tap .toolBar-brand': 'onChangeBrand',
                'tap .toolBar-clear': 'onClearBrand',
                'touchmove @ui.streamWrapper': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'modelSynced',
                'gotMore': 'onGotMore'
            },
            initialize: function(options) {
                startPage = 1;
                this.model = new ProductSearchModel();
                this.collection = new ProductCollection();
                if (options) {

                    if (options.originalFilterStr) {
                        filters = parseFilterString(options.originalFilterStr);
                    }

                    if(options.filters) filters = options.filters;

                }

                this.render();
                this.model.search(this.getSearchFilter());

                //init share info
                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;

                share_info.timeline_title =  '产品搜索「悟空家装」';
                share_info.message_title = share_info.timeline_title;

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#products/search');
                share_info.link =url;

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null ,null);
            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
                var windowWidth = $(window).width();
                var brandIconSize = 36;
                return {
                    'getBrandSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(brandIconSize * ratio) + 'w_' + Math.round(brandIconSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getBrandSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + brandIconSize + 'px;height:' + brandIconSize + 'px;';
                        return outStr;
                    }
                };
            },
            modelSynced: function() {
                this.stopLoadingMore();
                startPage = 1;

                if ( (!this.model.has('products')) || this.model.get('products').length < 1 ) {
                    this.emptyViewType = 'empty';

                }

                this.collection.reset(this.model.get('products'));


                this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
            },
            stopLoadingMore: function() {
                this.ui.streamWrapper.find('.pullUp').remove();
                this.isLoadingMore = false;
            },
            onRender: function() {
                var self = this;

                if (this.delay) {
                    this.$el.addClass('delayShow');

                    var to = setTimeout(function() {
                        self.$el.removeClass('delayShow');
                        clearTimeout(to);
                    }, 800);
                }

                $('#productLibrary').addClass('moveLeftTransition');
                $('#productLibrary').addClass('moveLeft');

                $('body').append(this.$el);
                this.$el.focus();

                this.ui.streamWrapper.css({
                    'height': this.$el.height() - this.ui.toolBar.height(),
                    'top': 0 - this.ui.filterBar.height() - 1
                });

                this.ui.streamWrapper.find('.products').css({
                    'min-height': this.$el.height()
                });

                this.updateTopPadding();

                this.lastScrollTop = 0;
                this.lastScrollDirection = -1; //DOWN
                this.ui.streamWrapper.on('scroll', function(ev) {
                    self.onScroll(ev);
                });
                this.filterModel = new FilterBarModel();
                this.filterView = new FilterBarView({
                    model: this.filterModel
                });
                this.filterModel.set('filters', appConfig.product_menu);
                this.listenTo(this.filterModel, 'changeFilter', this.onChangeFilter);

                if(filters.roomId) {
                    this.ui.filterBar.find('#filterMenu-room #filterMenu-item-' + filters.roomId).trigger('tap');
                }

                if(filters.typeId) {
                    this.ui.filterBar.find('#filterMenu-type #filterMenu-item-' + filters.typeId).trigger('tap');
                } 

                //根据传入参数，更新品牌栏
                if(filters.brand) { 
                    this.model.set('selectedBrand', filters.brand.id);
                    this.updateToolBarBrand(filters.brand);
                }
                this.enalbeFilters = true;

                this.$el.find('.tapEnable').each(function(index, el) {
                    $(el).hammer({ recognizers:[[Hammer.Tap]]});
                });

            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop < currentScrollTop ? 1 : -1;
                if (currentScrollTop < this.ui.filterBar.height()) {
                    this.onScrollUp();
                    this.lastScrollDirection = -1;
                } else {
                    if (currentScrollDirection === 1) {
                        this.onScrollDown();
                    } else {
                        this.onScrollUp();
                    }
                    this.lastScrollDirection = currentScrollDirection;
                }

                this.lastScrollTop = currentScrollTop;
            },
            onScrollUp: function() {
                this.ui.filterBar.removeClass('hide');
            },
            onScrollDown: function() {
                this.ui.filterBar.addClass('hide');

                var maxScrollTop = this.ui.streamWrapper.find('.products').height() - this.ui.streamWrapper.height();

                if(this.ui.streamWrapper.scrollTop() > (maxScrollTop-1) ) {
                    this.startLoadingMore();
                }
            },
            onTapBack: function() {
                this.slideOut();
            },
            onChangeFilter: function() {
                if (this.enalbeFilters) {
                    this.stopLoadingMore();
                    this.ui.streamWrapper.scrollTop(0);
                    startPage = 1;
                    this.emptyViewType = 'loading';
                    this.collection.reset([]);

                    this.model.search(this.getSearchFilter());
                }
            },
            getSearchFilter: function() {
                var type = this.$el.find('#filterMenu-type .checked');
                var room = this.$el.find('#filterMenu-room .checked');
                var typeId = '', roomId = '',brand = '';
                if (type.size() > 0 && type.attr('data-id')) {
                    typeId = type.attr('data-id');
                }
                if (room.size() > 0 && room.attr('data-id')) {
                    roomId = room.attr('data-id');
                }
                if (this.model.has('selectedBrand') && this.model.get('selectedBrand')) {
                    brand = this.model.get('selectedBrand');
                }
                return {
                    room: roomId,
                    type: typeId,
                    brand: brand,
                    limit: limit,
                    page: startPage
                };
            },
            startLoadingMore: function() {
                if( !this.isLoadingMore ) {
                    this.isLoadingMore = true;
                    startPage++;
                    this.model.loadMore(this.getSearchFilter());
                }
            },
            onChangeBrand: function() {
                if (this.enalbeFilters) {
                    this.brandView = new SelectBrandView({
                        selectedBrand: this.model.get('selectedBrand')
                    });
                    var self = this;
                    this.listenToOnce( this.brandView, 'selected', function(data) {
                        self.updateToolBarBrand(data);
                        self.model.set('selectedBrand',data.id);
                        self.stopLoadingMore();
                        startPage = 1;
                        this.emptyViewType = 'loading';
                        self.collection.reset([]);
                        this.ui.streamWrapper.scrollTop(0);
                        self.model.search(self.getSearchFilter());
                    });
                    this.listenToOnce( this.brandView, 'destroy', function() {
                        self.stopListening(self.brandView);
                        self.brandView = null;
                    });
                }
            },

            onClearBrand: function() {
                if (this.enalbeFilters) {
                    this.stopLoadingMore();
                    this.clearToolBarBrand();
                    startPage = 1;
                    this.collection.reset([]);
                    this.ui.streamWrapper.scrollTop(0);
                    this.model.set('selectedBrand','');
                    this.model.search(this.getSearchFilter());
                }
            },
            updateToolBarBrand: function(brand) {
                if(brand) {
                    this.$el.find('.toolBar-filter').text('已选');
                    this.$el.find('.toolBar-clear').show();

                    if (!brand.logo.url) brand.logo.url = "http://imgopt.apecrafts.com/design/placeholder.jpg";
                    this.$el.find('.toolBar-brand').html('<img src="' + brand.logo.url + '@72w_72h_1e_1c" style="width:36px;height:36px;">');
                }
            },
            clearToolBarBrand: function() {
                this.$el.find('.toolBar-clear').hide();
                this.$el.find('.toolBar-filter').text('品牌');
                this.$el.find('.toolBar-brand').html('全部');
            },
            onGotMore: function(data) {
                this.stopLoadingMore();
                if (data && data.length > 0) {
                    var oldLength = this.collection.length;
                    this.collection.add(data);
                    if (this.collection.length > oldLength) {
                        this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
                    } else {
                        startPage--;
                        this.ui.streamWrapper.append('<div class="pullUp loading">没有产品了</div>');
                    }
                } else {
                    startPage--;
                    this.ui.streamWrapper.append('<div class="pullUp loading">没有产品了</div>');
                }
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOut');
                this.outTimer = setTimeout(function() {
                    if (self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 500);

                app.appRouter.navigate('#products', {
                    trigger: false,
                    replace: false
                });
                $('#productLibrary').removeClass('moveLeftTransition').addClass('moveBackTransition');
                $('#productLibrary').focus().removeClass('moveLeft');

                util.trackEvent('Close', 'Product', 1);
            },
            updateTopPadding: function(ev) {
                var topPadding = this.ui.filterBar.height() + 1;
                this.ui.streamWrapper.css('padding-top', topPadding);
            },
            onDestroy: function() {
                this.$el.find('.tapEnable').each(function(index, el){
                    $(el).destroyHammer();
                });
                this.stopListening();
                this.ui.streamWrapper.off('scroll');
                if (this.model) this.model.destroy();
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            emptyViewOptions: function() {
                return {
                    type : this.emptyViewType
                };
            },
            enalbeFilters: false,
            emptyViewType: 'loading',
            emptyView: EmptyView,
            className: 'rootWrapper productSearchWrapper',
            childViewContainer: '.products',
            childView: ProductItemView
        });
    });