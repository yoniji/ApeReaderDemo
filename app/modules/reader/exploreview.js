define(['marionette', 'mustache', 'jquery', 'text!modules/reader/explore.html', 'modules/reader/streamview', 'modules/reader/exploremodel', 'modules/reader/postcollection', 'modules/reader/cellview', 'dropdown', 'modules/reader/filterbarview'],
    function(Marionette, Mustache, $, template, StreamView, ExploreModel, PostCollection, CellView, DropDownControl, FilterBarView) {

        return StreamView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'topBar': '.topBar',
                'filterSwitch': '#exploreTopBar-category-switch',
                'filterMenu': '#exploreTopBar-category-menu',
                'filterMenuItem': '.dropDown-menu-item'
            },
            events: {
                'select @ui.filterMenuItem': 'onTapMenuItem',
                'scroll @ui.streamWrapper': 'onScroll'
            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            initialize: function() {
                this.model = new ExploreModel();
                this.model.fetch();
            },
            afterShow: function() {
                var filter = new FilterBarView();
            },
            id: 'explore',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView
        });
    });