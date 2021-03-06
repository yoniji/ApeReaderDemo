﻿define(['marionette', 
    'mustache', 
    'jquery', 
    'text!templates/feature.html', 
    'scripts/reader/stream_view', 
    'scripts/reader/feature_model', 
    'scripts/reader/post_collection', 
    'scripts/reader/rank_cell_view', 
    'dropdown', 
    'scripts/common/empty_view'],
    function(
        Marionette, 
        Mustache, 
        $, 
        template, 
        StreamView, 
        FeatureModel, 
        PostCollection, 
        RankCellView, 
        DropDownControl, 
        EmptyView) {

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
                this.collection = new PostCollection();
                app.rootView.updatePrimaryRegion(this);
                this.model.fetch();
            },
            modelSynced: function() {
                if ( !this.model.get('data') || this.model.get('data').length < 1 ) {
                    this.emptyViewType = 'empty';
                }
                this.collection.reset(this.model.get('data'));
                this.updateEmptyView();
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
                this.$el.find('#rankCells').css({
                    'min-height': this.$el.height() - this.ui.topBar.height() - 1
                });
                this.updateEmptyView();
            },
            updateEmptyView: function() {
                if (this.collection.size()<1) {
                    if ( this.emptyViewType === 'loading') this.$el.find('.pullDown,.pullUp').css('visibility', 'hidden');

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
                    this.emptyViewType = 'loading';
                    this.collection.reset([]);
                    this.updateEmptyView();
                }

            },
            onResetPosts: function(posts) {
                if ( !posts || posts.length < 1 ) {
                    this.emptyViewType = 'empty';
                }
                this.collection.reset(posts);
                this.ui.streamWrapper.scrollTop(0);
                this.updateEmptyView();
            },
            emptyViewOptions: function() {
                return {
                    type : this.emptyViewType
                };
            },
            emptyViewType: 'loading',
            id: 'feature',
            className: 'rootWrapper',
            childViewContainer: '#rankCells',
            childView: RankCellView,
            emptyView: EmptyView
        });
    });