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
            },
            tryFetchFromLocalStorage: function() {
                if ( util.supportLocalStorage && localStorage.explore) {
                    this.set(JSON.parse(localStorage.explore));
                    this.isOld = true;
                    this.startPage++;
                }
            },
            parse: function(response) {
                if(appConfig) response.categories = appConfig.post_menu;
                this.isOld = false;
                this.saveNewPostsToLocalStorage(response);
                this.startPage++;
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            },
            setFilter: function(filterStr) {
                this.filterStr = filterStr;

            },
            shouldLoadNew: function() {
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
            resetPosts: function() {
                var data = {
                };
                if ( this.hasFilter()) {
                    data.filter = encodeURIComponent(this.filterStr);
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
                if ( this.hasFilter()) {
                    data.filter = encodeURIComponent(this.filterStr);
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
                if ( this.hasFilter()) {
                    data.filter = encodeURIComponent(this.filterStr);
                }

                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.parse(response);
                        self.trigger('gotNewPosts', response.data);
                    },
                    method: 'GET'
                });
            }
        });
    });