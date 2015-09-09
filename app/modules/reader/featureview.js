define(['marionette', 'mustache', 'jquery', 'text!modules/reader/feature.html', 'modules/reader/streamview', 'modules/reader/featuremodel', 'modules/reader/postcollection', 'modules/reader/rankcellview', 'dropdown', 'modules/reader/emptyview'],
    function(Marionette, Mustache, $, template, StreamView, FeatureModel, PostCollection, RankCellView, DropDownControl, EmptyView) {

        return StreamView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            modelEvents: {
                'sync': 'modelSynced',
                'gotMorePosts': 'onGotMorePosts',
                'resetPosts': 'onResetPosts'
            },
            initialize: function() {
                this.model = new FeatureModel();
                this.modelSynced();
                this.model.fetch();
            },
            onGotMorePosts: function(postsData) {
                this.stopLoadingMore();
                if( postsData&& postsData.length>0 ) {
                    this.collection.add(postsData);
                    this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
                } else {
                    this.ui.streamWrapper.append('<div class="pullUp loading">没有文章了</div>');
                }
                this.ui.streamWrapper.scrollTop( this.ui.streamWrapper.scrollTop() + 50);

            },
            startLoadingMore: function() {
                if( !this.isLoadingMore ) {
                    this.isLoadingMore = true;
                    
                    this.model.fetchMorePosts();
                }
            },
            stopLoadingMore: function() {
                this.ui.streamWrapper.find('.pullUp').remove();
                this.isLoadingMore = false;
            },
            afterOnShow: function() {
                this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
                this.updateEmptyView();
            },
            updateEmptyView: function() {
                if (this.collection.size()<1) {
                    this.$el.find('.empty').css('height',this.ui.streamWrapper.css('height'));
                    this.$el.find('.pullUp').css('visibility', 'hidden');
                }
            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop<currentScrollTop?1:-1;
                if (currentScrollTop - 50 <this.ui.topBar.height()) {
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

                var maxScrollTop = this.ui.streamWrapper.find('#rankCells').height() - this.ui.streamWrapper.height();
                if(this.ui.streamWrapper.scrollTop() > (maxScrollTop-1) ) {
                    this.startLoadingMore();
                }
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                if (id) {
                    this.model.changeType(id);
                    
                    this.collection.reset([]);
                    this.updateEmptyView();
                }

            },
            onResetPosts: function(posts) {
                this.collection.reset(posts);
                this.ui.streamWrapper.scrollTop(0);
            },
            id: 'feature',
            className: 'rootWrapper',
            childViewContainer: '#rankCells',
            childView: RankCellView,
            emptyView: EmptyView
        });
    });