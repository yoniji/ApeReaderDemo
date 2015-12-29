define(['backbone', 'jquery'],
    function(Backbone, $) {

        function setRankNumber(startRank, data) {
            for (var i = 0; i < data.length; i++ ) {
                data[i].rank = startRank + i+1;
            }
        }

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('feature');
            },
            initialize: function() {
                this.startPage = 0;
                this.limit = 20;
                this.type='24hour';
            },
            parse: function(response) {
                setRankNumber(this.startPage*this.limit, response.data);
                this.startPage++;
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            },
            fetchMorePosts: function() {
                var data = {
                    page: this.startPage + 1,
                    limit: this.limit,
                    type:this.type
                };
                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.parse(response);
                        self.trigger('gotMorePosts', response.data);
                    }
                });
            },
            changeType: function(type) {
                if (type) {
                    this.type = type;
                    this.startPage = 0;
                    this.resetPosts();
                }

            },
            resetPosts: function() {
                var data = {
                    page: this.startPage + 1,
                    limit: this.limit,
                    type:this.type
                };
                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        self.parse(response);
                        self.trigger('resetPosts', response.data);
                    },
                    method: 'GET'
                });
            }
        });
    });