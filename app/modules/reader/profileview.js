define(['marionette', 'mustache', 'jquery', 'text!modules/reader/profile.html', 'modules/reader/profile','modules/reader/feeds', 'modules/reader/cardview', 'iscroll', 'dropdown', 'iscroll-pullupdown'],
    function(Marionette, Mustache, $, template, Profile, Feeds, CardView, DropDown, IScrollPullUpDown) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '.feedsWrapper',
                'profileHeader': '.profileHeader'
            },
            events: {

            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            initialize: function() {
                this.model = new Profile();
                //this.model.fetch();
                this.modelSynced();
            },
            modelSynced: function() {
                this.collection = new Feeds(this.model.get('feeds'));
                app.rootView.updatePrimaryRegion(this);
            },
            onShow: function() {
                this.ui.feedsWrapper.height( this.$el.height() - this.ui.profileHeader.height());
                this.scroller = new IScrollPullUpDown(this.ui.feedsWrapper[0], null , this.pullDownActionHandler, this.pullUpActionHandler);
            },
            pullDownActionHandler: function(scroller) {

            },
            pullUpActionHandler: function(scroller) {

            },
            onDestroy: function() {
                if(this.scroller) this.scroller.destroy();
                this.stopListening();
            },
            id: 'profileWrapper',
            className:'rootWrapper',
            childViewContainer: '#cards',
            childView: CardView
        });
    });