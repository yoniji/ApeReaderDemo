﻿define(['marionette', 'mustache', 'jquery', 'text!modules/reader/explore.html', 'modules/reader/streamview', 'modules/reader/exploremodel', 'modules/reader/postcollection', 'modules/reader/cellview', 'dropdown', 'modules/reader/filterbarview', 'modules/reader/filterbarmodel', 'modules/reader/emptyview'],
    function(Marionette, Mustache, $, template, StreamView, ExploreModel, PostCollection, CellView, DropDownControl, FilterBarView, FilterBarModel, EmptyView) {

        function shouldStartLoadingNew(posts) {
            if ( posts.length < 1 ) return true;
            var now = new Date();
            if (util.supportLocalStorage() && localStorage.exploreTime) {
                var exploreTime = parseInt(localStorage.exploreTime);
                var hours = Math.floor((now.getTime() - exploreTime) / 1000 / 60);
                if (hours < 5) return false;
            }
            return true;
        }

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
                'filterMenuItem': '.dropDown-menu-item',
                'cells': '#cells'
            },
            events: {
                'select @ui.filterMenuItem': 'onTapMenuItem',
                'scroll @ui.streamWrapper': 'onScroll',
                'beforeOpenMenu @ui.filterSwitch': 'beforeOpenMenu',
                'tap .readCursor': 'onTapReadCursor',
                'touchmove @ui.streamWrapper': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'modelSynced',
                'gotNewPosts': 'onGotNewPosts',
                'gotHistoryPosts': 'onGotHistoryPosts',
                'resetPosts': 'onResetPosts'
            },
            initialize: function(options) {
                this.model = new ExploreModel();
                if (options && options.delay) {} else {
                    this.model.tryFetchFromLocalStorage();
                }
                this.collection = new PostCollection(this.model.get('data'));
                app.rootView.updatePrimaryRegion(this);
            },
            modelSynced: function() {
                if (this.collection.size() < 1) {
                    this.emptyViewType = 'empty';
                }
                this.collection.reset(this.model.get('data'));
            },
            clearNotification: function() {
                if (this.timeout) clearTimeout(this.timeout);
                if (this.ui.streamWrapper) this.ui.streamWrapper.find('.notification').remove();
            },
            onTapReadCursor: function() {
                this.ui.streamWrapper.scrollTop(0);
            },
            showReadCursor: function(cellEl) {
                if (this.ui.streamWrapper.find('.readCursor').size() < 1 && cellEl.size() === 1 && !this.model.hasCategory()) {
                    cellEl.after('<div class="readCursor">上次你看到这里， 点此<span class="main-color">刷新</span></div>');
                }
            },
            removeReadCursor: function() {
                this.ui.streamWrapper.find('.readCursor').remove();
            },
            onGotNewPosts: function(postsData) {
                this.stopLoadingNew();
                if (postsData && postsData.length > 0) {

                    //var oldLength = this.collection.length;
                    this.collection.reset(postsData);
                    this.removeReadCursor();
                    this.lastCell = this.ui.streamWrapper.find('.cell').last();

                    this.ui.streamWrapper.prepend('<div class="notification notification-info">为你推荐' + this.collection.length + '篇新文章</div>');

                    var self = this;
                    this.timeout = setTimeout(function() {
                        self.clearNotification();
                    }, 2000);
                } else if (this.collection.size() < 1) {
                    this.emptyViewType = 'empty';
                    this.collection.reset([]);
                }

                this.ui.streamWrapper.prepend('<div class="pullDown loading"><i class="icon icon-refresh"></i></div>');
                this.ui.streamWrapper.find('.pullUp').html('<i class="icon icon-refresh"></i>');

                this.ui.streamWrapper.scrollTop(50);
                this.updateEmptyView();

                this.preventHistory = false;
            },
            onGotHistoryPosts: function(postsData) {
                this.stopLoadingHistory();
                if (postsData && postsData.length > 0) {
                    
                    if (this.lastCell && this.lastCell.size() > 0) this.showReadCursor(this.lastCell);
                    
                    var oldLength = this.collection.length;

                    this.collection.add(postsData);

                    if (this.collection.length > oldLength) {
                        this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');
                    } else {
                        this.ui.streamWrapper.append('<div class="pullUp loading">没有更早的文章了</div>');
                    }

                } else {
                    this.ui.streamWrapper.append('<div class="pullUp loading">没有更早的文章了</div>');
                }
                this.ui.streamWrapper.scrollTop(this.ui.streamWrapper.scrollTop() + 50);

                

            },
            startLoadingNew: function() {
                if (!this.isLoadingNew) {
                    this.isLoadingNew = true;
                    this.preventHistory = true;

                    this.model.fetchNewPosts();
                    this.clearNotification();
                }
            },
            stopLoadingNew: function() {
                this.ui.streamWrapper.find('.pullDown').remove();
                this.isLoadingNew = false;
                var self = this;
                self.preventRefresh = true;
                var coolTimeout = setTimeout(function() {
                    if(self.preventRefresh) self.preventRefresh = false;
                    clearTimeout(coolTimeout);
                }, 2500);

            },
            startLoadingHistory: function() {
                if (!this.isLoadingHistory && !this.preventHistory) {
                    this.isLoadingHistory = true;
                    this.model.fetchHistoryPosts(this.collection.length);
                }
            },
            stopLoadingHistory: function() {
                this.ui.streamWrapper.find('.pullUp').remove();
                this.isLoadingHistory = false;
            },
            afterOnShow: function() {

                this.filterModel = new FilterBarModel({
                    data: this.model.get('categories')
                });
                this.filterView = new FilterBarView({
                    model: this.filterModel
                });
                this.listenTo(this.filterModel, 'changeFilter', this.onChangeFilter);

                this.ui.streamWrapper.css({
                    'height': this.$el.height(),
                    'top': 0 - this.ui.topBar.height() - this.ui.filterBar.height() - 2
                });
                this.ui.cells.css({
                    'min-height': this.$el.height()
                });
                this.updateTopPadding();
                this.ui.streamWrapper.prepend('<div class="pullDown loading"><i class="icon icon-refresh"></i></div>');
                this.ui.streamWrapper.append('<div class="pullUp loading"><i class="icon icon-refresh"></i></div>');

                this.updateEmptyView();
                if (shouldStartLoadingNew(this.collection)) {
                    this.startLoadingNew();
                } else {
                    this.ui.streamWrapper.scrollTop(50);
                }

            },
            updateEmptyView: function() {
                if (this.collection.size() < 1) {
                    this.$el.find('.empty').height(this.ui.streamWrapper.height());
                    if (this.emptyViewType === 'loading') this.$el.find('.pullDown,.pullUp').css('visibility', 'hidden');
                    this.ui.streamWrapper.scrollTop(50);
                }
            },
            afterOnDestroy: function() {
                this.filterView.destroy();
                this.filterModel.destroy();
                if (this.timeout) clearTimeout(this.timeout);
            },
            onScroll: function(ev) {
                var currentScrollTop = this.ui.streamWrapper.scrollTop();
                var currentScrollDirection = this.lastScrollDirection;
                currentScrollDirection = this.lastScrollTop < currentScrollTop ? 1 : -1;


                    if (currentScrollTop - 50 < this.ui.topBar.height()) {
                        this.onScrollUp(ev);
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
                //显示fitlerbar
                this.ui.topBar.removeClass('hide');
                this.ui.filterBar.removeClass('hide');
                //检查新的新闻
                if ( this.preventRefresh && this.ui.streamWrapper.scrollTop() < 50 ) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.ui.streamWrapper.scrollTop(50);
                }  else if (this.ui.streamWrapper.scrollTop() < 1) {
                    this.startLoadingNew();
                }
            },
            onScrollDown: function(ev) {
                //隐藏fitlerbar
                this.ui.topBar.addClass('hide');
                this.ui.filterBar.addClass('hide');
                //加载更早的记录
                var maxScrollTop = this.ui.streamWrapper.find('#cells').height() - this.ui.streamWrapper.height();
                if (this.ui.streamWrapper.scrollTop() > (maxScrollTop - 1)) {
                    this.startLoadingHistory();
                }
            },
            beforeOpenMenu: function(ev) {
                this.filterView.closeMenu();
            },
            onTapMenuItem: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                this.filterModel.updateFilterDataByCategoryId(id);
                this.updateTopPadding();
            },
            onChangeFilter: function() {
                this.model.setCategory(this.filterModel.getCategoryStr());
                this.model.setFilter(this.filterModel.getFilterStr());
                this.model.resetPosts();
                this.emptyViewType = 'loading';
                this.collection.reset([]);
                this.updateEmptyView();
                this.ui.streamWrapper.find('.readCursor').remove();
            },
            onResetPosts: function(postsData) {
                if (!postsData || postsData.length < 1) {
                    this.emptyViewType = 'empty';
                }
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
            emptyViewOptions: function() {
                return {
                    type: this.emptyViewType
                };
            },
            emptyViewType: 'loading',
            id: 'explore',
            className: 'rootWrapper',
            childViewContainer: '#cells',
            childView: CellView,
            emptyView: EmptyView
        });
    });