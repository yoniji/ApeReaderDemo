﻿define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productsearch.html', 'modules/reader/productsearchmodel', 'modules/reader/productcollection', 'modules/reader/productitemview', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel', 'modules/reader/emptyview','modules/reader/selectbrandview'],
    function(Marionette, Mustache, $, template, ProductSearchModel, ProductCollection, ProductItemView, FilterBarView, FilterBarModel, EmptyView, SelectBrandView) {

        var limit = 20,startPage = 0;
        var filters = {};
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
                this.model = new ProductSearchModel();
                this.collection = new ProductCollection();
                if (options) {
                    if(options.filters) filters = options.filters;
                }

                this.render();
                this.model.fetch({
                    data: this.getSearchFilter()
                });
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
                stratPage = 0;
                if ( !this.model.get('products') && this.model.get('products').length < 1 ) {
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
                    this.ui.filterBar.find('#filterMenu-item-' + filters.roomId).trigger('tap');
                }

                if(filters.typeId) {
                    this.ui.filterBar.find('#filterMenu-item-' + filters.typeId).trigger('tap');
                } 

                //根据传入参数，更新品牌栏
                if(filters.brand) { 
                    this.model.set('selectedBrand', filters.brand.id);
                    this.updateToolBarBrand(filters.brand);
                }
                this.enalbeFilters = true;

            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop < currentScrollTop ? 1 : -1;
                if (currentScrollTop < this.ui.filterBar.height()) {
                    this.onScrollUp();
                    this.lastScrollDirection = -1;
                } else if (currentScrollDirection != this.lastScrollDirection) {
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
                    stratPage = 0;
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
                        stratPage = 0;
                        this.emptyViewType = 'loading';
                        self.collection.reset([]);
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
                    stratPage = 0;
                    this.collection.reset([]);
                    this.model.set('selectedBrand','');
                    this.model.search(this.getSearchFilter());
                }
            },
            updateToolBarBrand: function(brand) {
                if(brand) {
                    this.$el.find('.toolBar-filter').text('已选');
                    this.$el.find('.toolBar-clear').show();
                    this.$el.find('.toolBar-brand').html('<img src="' + brand.logo.url + '" style="width:36px;height:36px;">');
                }
            },
            clearToolBarBrand: function() {
                this.$el.find('.toolBar-clear').hide();
                this.$el.find('.toolBar-filter').text('');
                this.$el.find('.toolBar-brand').html('全部品牌');
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