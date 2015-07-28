define(['marionette', 'mustache', 'jquery', 'text!modules/reader/home.html', 'modules/reader/home','modules/reader/feeds', 'modules/reader/cellview', 'iscroll'],
    function(Marionette, Mustache, $, template, Home, Feeds, CellView) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '#feedsWrapper',
                'navigation':'#homeNavigation'
            },
            events: {

            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            collectionEvents: {
                'add':'pageAdded'
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
            pageAdded: function(){

            },
            onShow: function() {
                this.ui.feedsWrapper.height( this.$el.height() - 48);
                this.scroller = new IScroll(this.ui.feedsWrapper[0]);
            },
            onDestroy: function() {
                this.stopListening();
            },
            id: 'homeWrapper',
            childViewContainer: '#cells',
            childView: CellView
        });
    });