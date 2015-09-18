define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productsearch.html', 'modules/reader/productsearchmodel', 'modules/reader/productcollection', 'modules/reader/productitemview', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel', 'modules/reader/emptyview','modules/reader/selectbrandview'],
    function(Marionette, Mustache, $, template, ProductSearchModel, ProductCollection, ProductItemView, FilterBarView, FilterBarModel, EmptyView, SelectBrandView) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'filterBar': '.filterBar',
                'back': '.toolBar-back'
            },
            events: {
                'scroll @ui.streamWrapper': 'onScroll',
                'tap @ui.back': 'onTapBack',
                'tap .toolBar-filter': 'onChangeBrand',
                'tap .toolBar-brand': 'onChangeBrand'
            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            initialize: function(options) {

                this.model = new ProductSearchModel();
                this.collection = new ProductCollection();
                if (options) {
                    if(options.filters) this.model.setFilters(options.filters);
                }

                this.render();
                this.model.fetch();
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
                this.collection.reset(this.model.get('products'));
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
                    'height': this.$el.height(),
                    'top': 0 - this.ui.filterBar.height() - 1
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
            },
            onTapBack: function() {
                this.slideOut();
            },
            onChangeBrand: function() {
                this.brandView = new SelectBrandView({
                    selectedBrand: this.model.get('selectedBrand')
                });
                var self = this;
                this.listenToOnce( this.brandView, 'selected', function(data) {
                    self.updateSelectedBrand(data);
                    self.model.set('selectedBrand',data.id);
                });
                this.listenToOnce( this.brandView, 'destroy', function() {
                    self.stopListening(self.brandView);
                    self.brandView = null;
                });
            },
            updateSelectedBrand: function(brand) {
                this.$el.find('.toolBar-brand').html('<img src="' + brand.logo.url + '" style="width:36px;height:36px;">');
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOut');
                this.outTimer = setTimeout(function() {
                    if (self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 500);

                app.appRouter.navigate(this.originalRouter, {
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
                this.afterOnDestroy();
            },
            afterOnDestroy: function() {

            },
            emptyViewOptions: function() {
                return {
                    type : this.emptyViewType
                };
            },
            emptyViewType: 'loading',
            emptyView: EmptyView,
            className: 'rootWrapper productSearchWrapper',
            childViewContainer: '.products',
            childView: ProductItemView
        });
    });