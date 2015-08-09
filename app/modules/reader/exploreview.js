define(['marionette', 'mustache', 'jquery', 'text!modules/reader/explore.html','modules/reader/streamview','modules/reader/exploremodel', 'modules/reader/cellview', 'dropdown', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel'],
    function(Marionette, Mustache, $, template, StreamView, ExploreModel, CellView, DropDownControl, FilterBarView, FilterBarModel) {

        return StreamView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'topBar': '.topBar',
                'filterBar': '.filterBar',
                'filterSwitch': '#exploreTopBar-category-switch',
                'filterMenu': '#exploreTopBar-category-menu',
                'filterMenuItem': '.dropDown-menu-item'
            },
            events: {
                'select @ui.filterMenuItem': 'onTapMenuItem',
                'scroll @ui.streamWrapper': 'onScroll'
            },
            initialize: function() {
                this.model = new ExploreModel();
                this.model.fetch();
            },
            afterOnShow: function() {
                this.filterModel = new FilterBarModel({ data : this.model.get('categories')});
                this.filterView = new FilterBarView({model: this.filterModel});
                
                this.ui.streamWrapper.css({
                    'height': this.$el.height(),
                    'top'   : 0 - this.ui.topBar.height() - this.ui.filterBar.height() - 2
                });
                this.updateTopPadding();
            },
            afterOnDestroy: function() {
                this.filterView.destroy();
                this.filterModel.destroy();
            },
            onScrollUp: function() {
                this.ui.topBar.removeClass('hide');
                this.ui.filterBar.removeClass('hide');
            },
            onScrollDown: function() {
                this.ui.topBar.addClass('hide');
                 this.ui.filterBar.addClass('hide');
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                this.filterModel.updateFilterDataByCategoryId(id);

                this.updateTopPadding();
            },
            updateStream: function() {
                
            },
            updateTopPadding: function(ev) {
                var topPadding = this.ui.topBar.height() + 1;
                if (!this.ui.filterBar.hasClass('noFilter')) {
                    topPadding += this.ui.filterBar.height() + 1;
                }
                this.ui.streamWrapper.css('padding-top', topPadding);
            },
            id: 'explore',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView
        });
    });