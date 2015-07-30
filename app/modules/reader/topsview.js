define(['marionette', 'mustache', 'jquery', 'text!modules/reader/tops.html', 'modules/reader/tops', 'modules/reader/feeds', 'modules/reader/topitemview', 'dropdown', 'iscroll-pullupdown'],
    function(Marionette, Mustache, $, template, Tops, Feeds, TopItemView, DropDown, IScrollPullUpDown) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '.feedsWrapper',
                'topBar': '.topBar',
                'filterSwitch': '.dropDown-switch',
                'filterMenu': '.dropDown-menu'
            },
            events: {

            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            initialize: function() {
                this.model = new Tops();
                this.modelSynced();
            },
            modelSynced: function() {

                this.collection = new Feeds(this.model.get('data'));
                app.rootView.updatePrimaryRegion(this);
                
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
            id: 'topsWrapper',
            className: 'rootWrapper',
            childViewContainer: '#topItems',
            childView: TopItemView
        });
    });