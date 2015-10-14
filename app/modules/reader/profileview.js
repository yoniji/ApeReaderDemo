define(['marionette', 'mustache', 'jquery', 'text!modules/reader/profile.html', 'modules/reader/profile', 'modules/reader/postcollection', 'modules/reader/cardview', 'dropdown', 'modules/reader/emptyview'],
    function(Marionette, Mustache, $, template, Profile, PostCollection, CardView, DropDown, EmptyView) {

        return Marionette.CompositeView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'feedsWrapper': '.streamWrapper',
                'profileHeader': '.profileHeader',
                'filterSwitch': '.dropDown-switch',
                'filterMenu': '.dropDown-menu',
                'filterMenuItem': '.dropDown-menu-item'
            },
            events: {
                'select @ui.filterMenuItem': 'onTapMenuItem',
                'touchmove @ui.feedsWrapper': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'modelSynced',
                'resetPosts': 'onResetPosts'
            },
            initialize: function() {
                this.model = new Profile();
                this.collection = new PostCollection();
                app.rootView.updatePrimaryRegion(this);

                this.model.fetch({
                    'data': {
                        userid: appConfig.user_info.id
                    }
                });

                util.setWechatShare(window.appConfig.share_info);
            },
            modelSynced: function() {
                this.collection.reset(this.model.get('data'));
                this.updateEmptyView();
            },
            updateEmptyView: function() {
                if (this.collection.size() < 1) {
                    this.$el.find('.empty').height(this.ui.feedsWrapper.height());
                    this.$el.find('.pullDown,.pullUp').css('visibility', 'hidden');
                }
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                var filterStr = '';
                if (id) {
                    filterStr = '' + id;
                }
                this.model.setFilter(filterStr);
                this.model.resetPosts();
                this.collection.reset([]);
                this.updateEmptyView();
            },
            onResetPosts: function(postsData) {
                this.collection.reset(postsData);
                this.updateEmptyView();
            },
            templateHelpers: function() {
                var nameList = [
                    '金角大王', '银角大王', '空空', '二师兄', '大师兄', '师傅'
                ];
                var iconList = [
                    'buddha', 'pig', 'cat', 'us'
                ];
                return {
                    'getRandomName': function() {
                        return util.getRandomItemInList(nameList);
                    },
                    'getRandomIcon': function() {
                        return util.getRandomItemInList(iconList);
                    }
                };
            },
            onShow: function() {
                this.ui.feedsWrapper.height(this.$el.height() - this.ui.profileHeader.height());
                this.menu = new DropDown(this.ui.filterSwitch, this.ui.filterMenu);
                this.updateEmptyView();
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                this.stopListening();
            },
            id: 'profileWrapper',
            className: 'rootWrapper',
            childViewContainer: '#cards',
            childView: CardView,
            emptyView: EmptyView
        });
    });