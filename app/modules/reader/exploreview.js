﻿define(['marionette', 'mustache', 'jquery', 'text!modules/reader/explore.html','modules/reader/streamview','modules/reader/exploremodel', 'modules/reader/cellview', 'dropdown', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel', 'modules/reader/emptyview'],
    function(Marionette, Mustache, $, template, StreamView, ExploreModel, CellView, DropDownControl, FilterBarView, FilterBarModel, EmptyView) {

        return StreamView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'streamWrapper': '.streamWrapper',
                'topBar': '.topBar',
                'filterBar': '.filterBar',
                'filterSwitch': '#exploreTopBar-category-switch',
                'filterMenu': '#exploreTopBar-category-menu',
                'filterMenuItem': '.dropDown-menu-item'
            },
            events: {
                'select @ui.filterMenuItem': 'onTapMenuItem',
                'scroll @ui.streamWrapper': 'onScroll'
            },
            modelEvents: {
                'sync': 'modelSynced',
                'gotNewPosts': 'onGotNewPosts',
                'gotHistoryPosts': 'onGotHistoryPosts',
                'resetPosts': 'onResetPosts'
            },
            initialize: function() {
                this.model = new ExploreModel();
                this.model.tryFetchFromLocalStorage();
                this.modelSynced();
            },
            clearNotification: function() {
                if(this.timeout) clearTimeout(this.timeout);
                if(this.ui.streamWrapper) this.ui.streamWrapper.find('.notification').remove();
            },
            onGotNewPosts: function(postsData) {
                this.stopLoadingNew();
                if ( postsData && postsData.length>0 ) {
                    this.collection.unshift(postsData);
                    this.ui.streamWrapper.prepend('<div class="notification notification-info">为你准备了' + postsData.length + '篇新文章</div>');
                    var self = this;
                    this.timeout = setTimeout(function() {
                        self.clearNotification();
                    }, 2000);
                }
                
                this.ui.streamWrapper.prepend('<div class="pullDown loading"><i class="icon icon-refresh"></i></div>');
                this.ui.streamWrapper.scrollTop(50);
            },
            onGotHistoryPosts: function(postsData) {
                this.stopLoadingHistory();
                if( postsData&& postsData.length>0 ) {
                    this.collection.add(postsData);
                    this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
                } else {
                    this.ui.streamWrapper.append('<div class="pullUp loading">没有更早的文章了</div>');
                }
                this.ui.streamWrapper.scrollTop( this.ui.streamWrapper.scrollTop() + 50);

            },
            startLoadingNew: function() {
                if( !this.isLoadingNew ) {
                    this.isLoadingNew = true;
                    
                    this.model.fetchNewPosts();
                    this.clearNotification();
                }
            },
            stopLoadingNew: function() {
                this.ui.streamWrapper.find('.pullDown').remove();
                this.isLoadingNew = false;
            },
            startLoadingHistory: function() {
                if( !this.isLoadingHistory ) {
                    this.isLoadingHistory = true;
                    
                    this.model.fetchHistoryPosts();
                }
            },
            stopLoadingHistory: function() {
                this.ui.streamWrapper.find('.pullUp').remove();
                this.isLoadingHistory = false;
            },
            afterOnShow: function() {

                this.filterModel = new FilterBarModel({ data : this.model.get('categories')});
                this.filterView = new FilterBarView({model: this.filterModel});
                this.listenTo(this.filterModel, 'changeFilter', this.onChangeFilter);
                
                this.ui.streamWrapper.css({
                    'height': this.$el.height(),
                    'top'   : 0 - this.ui.topBar.height() - this.ui.filterBar.height() - 2
                });
                this.updateTopPadding();
                this.ui.streamWrapper.prepend('<div class="pullDown loading"><i class="icon icon-refresh"></i></div>');
                this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');

                
                if (this.collection.size()<1) {
                    this.$el.find('.empty').height(this.ui.streamWrapper.height());
                    this.ui.streamWrapper.scrollTop(50);
                }

                this.startLoadingNew();
                
                
            },
            afterOnDestroy: function() {
                this.filterView.destroy();
                this.filterModel.destroy();
                if(this.timeout) clearTimeout(this.timeout);
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
                this.ui.filterBar.removeClass('hide');

                if(this.ui.streamWrapper.scrollTop() < 1) {
                    this.startLoadingNew();
                }
            },
            onScrollDown: function(ev) {
                this.ui.topBar.addClass('hide');
                this.ui.filterBar.addClass('hide');


                var maxScrollTop = this.ui.streamWrapper.find('#cells').height() - this.ui.streamWrapper.height();
                if(this.ui.streamWrapper.scrollTop() > (maxScrollTop-1) ) {
                    this.startLoadingHistory();
                }
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                this.filterModel.updateFilterDataByCategoryId(id);

                this.updateTopPadding();
            },
            onChangeFilter: function() {
                this.model.setFilter(this.filterModel.getFilterStr());
                this.model.resetPosts();
                this.collection.reset([]);
            },
            onResetPosts: function(postsData) {
                this.collection.reset(postsData);
                this.ui.streamWrapper.scrollTop(50);
            },
            updateTopPadding: function(ev) {
                var topPadding = this.ui.topBar.height() + 1;
                if (!this.ui.filterBar.hasClass('noFilter')) {
                    topPadding += this.ui.filterBar.height() + 1;
                }
                this.ui.streamWrapper.css('padding-top', topPadding);
            },
            id: 'explore',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView,
            emptyView: EmptyView
        });
    });