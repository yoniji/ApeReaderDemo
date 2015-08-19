define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productsearch.html', 'modules/reader/productsearchmodel', 'modules/reader/productcollection', 'modules/reader/productitemview', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel'],
    function(Marionette, Mustache, $, template, ProductSearchModel, ProductCollection, ProductItemView, FilterBarView, FilterBarModel) {

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
                'tap @ui.back': 'onTapBack'
            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            initialize: function() {
                this.model = new ProductSearchModel();
                this.modelSynced();
            },
            modelSynced: function() {
                this.collection = new ProductCollection(this.model.get('products'));
                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);
                this.ui.streamWrapper.css({
                    'height': this.$el.height(),
                    'top'   : 0 - this.ui.filterBar.height()- 1
                });
                this.updateTopPadding();

                var self = this;
                this.lastScrollTop = 0;
                this.lastScrollDirection = -1;//DOWN
                this.ui.streamWrapper.on('scroll', function(ev) {
                    self.onScroll(ev);
                });
                this.filterModel = new FilterBarModel();
                this.filterView = new FilterBarView({model: this.filterModel});
                this.filterModel.set('filters', appConfig.product_menu);
            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop<currentScrollTop?1:-1;
                if (currentScrollTop<this.ui.filterBar.height()) {
                    this.onScrollUp();
                    this.lastScrollDirection = -1;
                } else if (currentScrollDirection!= this.lastScrollDirection) {
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
                this.destroy();
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
            id: 'productSearch',
            className: 'rootWrapper',
            childViewContainer: '.products',
            childView: ProductItemView
        });
    });