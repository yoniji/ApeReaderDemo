define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('explore');
            },
            initialize: function() {
                this.startPage = 0;
                this.limit = 20;
                this.filterStr = '';
                this.categoryStr = '';
                this.set('categories', appConfig.post_menu);
            },
            tryFetchFromLocalStorage: function() {
                if ( util.supportLocalStorage && localStorage.explore) {
                    this.set(JSON.parse(localStorage.explore));
                    this.isOld = true;
                    this.startPage++;
                }
            },
            parse: function(response) {
                this.isOld = false;
                if(!this.hasCategory()) this.saveNewPostsToLocalStorage(response);
                this.startPage++;
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
                if ( util.supportLocalStorage ) {
                    localStorage.setItem('explore', JSON.stringify(jsonData));
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
                        self.startPage = 2;
                        self.trigger('resetPosts', response.data);
                    },
                    method: 'GET'
                });
            },
            fetchHistoryPosts: function() {
                var data = {
                    page: this.startPage,
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
                        self.startPage++;
                        self.trigger('gotHistoryPosts', response.data);
                    }
                });
            },
            fetchNewPosts: function() {
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
                        self.parse(response);
                        self.trigger('gotNewPosts', response.data.reverse());
                    },
                    method: 'GET'
                });
            }
        });
    });