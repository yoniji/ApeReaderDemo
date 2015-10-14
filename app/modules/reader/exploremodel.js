define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('explore');
            },
            initialize: function() {
                this.limit = 10;
                this.filterStr = '';
                this.categoryStr = '';
                this.set('categories', appConfig.post_menu);
            },
            tryFetchFromLocalStorage: function() {
                if ( util.supportLocalStorage() && localStorage.explore) {
                    this.set(JSON.parse(localStorage.explore));
                    this.isOld = true;
                }
            },
            parse: function(response) {
                this.isOld = false;
                if(!this.hasCategory()) this.saveNewPostsToLocalStorage(response);
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            },
            setFilter: function(filterStr) {
                this.filterStr = filterStr;
            },
            setCategory: function(categoryStr) {
                this.categoryStr = categoryStr;
            },
            hasOldData: function() {
                return !! this.isOld;
            },
            saveNewPostsToLocalStorage: function(jsonData) {
                if ( util.supportLocalStorage() ) {
                    localStorage.setItem('explore', JSON.stringify(jsonData));
                    localStorage.setItem('exploreTime', (new Date()).getTime());
                }
            },
            hasFilter: function() {
                return (this.filterStr!== '');
            },
            hasCategory: function() {
                return (this.categoryStr!== '');
            },
            resetPosts: function() {
                var data = {
                };
                if ( this.hasCategory() ) {
                    data.category = this.categoryStr;
                }
                if ( this.hasFilter()) {
                    data.filter = this.filterStr;
                }

                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.trigger('resetPosts', response.data);
                    },
                    method: 'GET'
                });
            },
            fetchHistoryPosts: function(currentArticleCount) {
                var startPage = Math.floor(currentArticleCount / this.limit) + 1;
                var data = {
                    page: startPage,
                    limit: this.limit
                };
                if ( this.hasCategory() ) {
                    data.category = this.categoryStr;
                }
                if ( this.hasFilter()) {
                    data.filter = this.filterStr;
                }
                var self = this;

                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.trigger('gotHistoryPosts', response.data);
                    }
                });
            },
            fetchNewPosts: function() {
                var data = {
                    limit: this.limit
                };
                if ( this.hasCategory() ) {
                    data.category = this.categoryStr;
                }
                if ( this.hasFilter()) {
                    data.filter = this.filterStr;
                }

                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.parse(response);
                        self.trigger('gotNewPosts', response.data.reverse());
                    },
                    method: 'GET'
                });
            }
        });
    });