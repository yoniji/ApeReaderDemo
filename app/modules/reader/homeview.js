﻿define(['marionette', 'mustache', 'jquery', 'text!modules/reader/home.html', 'modules/reader/home', 'modules/reader/feeds', 'modules/reader/cellview', 'dropdown', 'iscroll-pullupdown'],
    function(Marionette, Mustache, $, template, Home, Feeds, CellView, DropDown, IScrollPullUpDown) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '.feedsWrapper',
                'topBar': '.topBar',
                'filterSwitch': '#feedsTopBar-category-switch',
                'filterMenu': '#feedsTopBar-category-menu'
            },
            events: {

            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            collectionEvents: {
                'add': 'pageAdded'
            },
            initialize: function() {

                this.model = new Home();
                //this.model.fetch();
                this.modelSynced();

            },
            modelSynced: function() {

                this.collection = new Feeds(this.model.get('data'));
                app.rootView.updatePrimaryRegion(this);

            },
            pageAdded: function() {

            },
            onShow: function() {
                this.ui.feedsWrapper.height(this.$el.height() - this.ui.topBar.height());
                this.scroller = new IScrollPullUpDown(this.ui.feedsWrapper[0], null , this.pullDownActionHandler, this.pullUpActionHandler);
                this.menu = new DropDown(this.ui.filterSwitch, this.ui.filterMenu);
            },
            pullDownActionHandler: function(scroller) {

            },
            pullUpActionHandler: function(scroller) {

            },
            onDestroy: function() {

                if (this.scroller) this.scroller.destroy();
                if (this.menu) this.menu.destroy();
                this.stopListening();

            },
            id: 'homeWrapper',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView
        });
    });