define(['marionette', 'mustache', 'jquery', 'text!modules/reader/profile.html', 'modules/reader/profile','modules/reader/postcollection', 'modules/reader/cardview', 'iscroll-pullupdown','dropdown'],
    function(Marionette, Mustache, $, template, Profile, PostCollection, CardView, IScrollPullUpDown, DropDown) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '.feedsWrapper',
                'profileHeader': '.profileHeader',
                'filterSwitch': '.profileFilter',
                'filterMenu': '#profileFilter-menu'
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
                this.collection = new PostCollection(this.model.get('feeds'));
                app.rootView.updatePrimaryRegion(this);
            },
            onShow: function() {
                this.ui.feedsWrapper.height( this.$el.height() - this.ui.profileHeader.height());
                this.menu = new DropDown(this.ui.filterSwitch, this.ui.filterMenu);
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