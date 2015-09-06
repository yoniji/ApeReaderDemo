define(['marionette', 'mustache', 'jquery', 'text!modules/reader/explore.html', 'modules/reader/exploremodel', 'modules/reader/postcollection', 'modules/reader/cellview', 'dropdown'],
    function(Marionette, Mustache, $, template, ExploreModel, PostCollection, CellView, DropDownControl) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'topBar': '.topBar',
                'filterSwitch': '.dropDown-switch',
                'filterMenu': '.dropDown-menu',
                'filterMenuItem': '.dropDown-menu-item'
            },
            events: {
                'select @ui.filterMenuItem':'onTapMenuItem',
                'touchmove @ui.streamWrapper': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'modelSynced'
            },
            modelSynced: function() {
                if(!this.collection) {
                    this.collection = new PostCollection(this.model.get('data'));
                } else {
                    this.collection.reset(this.model.get('data'));
                }
                app.rootView.updatePrimaryRegion(this);

            },
            onShow: function() {

                this.ui.streamWrapper.css({
                    'height': this.$el.height(),
                    'top'   : 0 - this.ui.topBar.height()- 1
                });
                this.updateTopPadding();
                this.menu = new DropDownControl(this.ui.filterSwitch, this.ui.filterMenu);


                var self = this;
                this.lastScrollTop = 0;
                this.lastScrollDirection = -1;//DOWN
                this.ui.streamWrapper.on('scroll', function(ev) {
                    self.onScroll(ev);
                });
                this.afterOnShow();
            },
            afterOnShow: function() {

            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop<currentScrollTop?1:-1;
                if (currentScrollTop<this.ui.topBar.height()) {
                    this.onScrollUp();
                    this.lastScrollDirection = -1;
                } else {
                    if (currentScrollDirection === 1) {
                        this.onScrollDown(ev);
                    } else {
                        this.onScrollUp(ev);
                    }
                    this.lastScrollDirection = currentScrollDirection;
                }
                
                this.lastScrollTop = currentScrollTop;
            },
            onScrollUp: function(ev) {
                this.ui.topBar.removeClass('hide');
            },
            onScrollDown: function(ev) {
                this.ui.topBar.addClass('hide');
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                console.log('tap '+ item.attr('data-id'));
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            afterOnDestroy: function() {

            },
            updateTopPadding: function(ev) {
                var topPadding = this.ui.topBar.height() + 1;
                this.ui.streamWrapper.css('padding-top', topPadding);
            },
            onDestroy: function() {
                this.stopListening();
                this.ui.streamWrapper.off('scroll');
                if (this.menu) this.menu.destroy();
                if (this.model) this.model.destroy();
                this.afterOnDestroy();
            },
            id: 'explore',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView
        });
    });