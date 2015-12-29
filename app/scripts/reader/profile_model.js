define(['backbone', 'jquery'],
    function(Backbone, $) {
        var actionCardData = {
            'id': '0',
            'isAction': true
        };
        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('user') + '/like';
            },
            initialize: function() {
                if (appConfig && appConfig.user_info) {
                    this.set('user_info', appConfig.user_info);
                    this.set('categories', appConfig.post_menu);
                }
                this.limit = 20;
                this.filterStr = '';
            },
            setFilter: function(filterStr) {
                this.filterStr = filterStr;

            },
            hasFilter: function() {
                return (this.filterStr !== '');
            },
            parse: function(response) {
                if (!response.data || response.data.length < 1) {
                    response.data = [actionCardData];
                }
                //测试用
                //response.data = [actionCardData];
                return response;
            },
            resetPosts: function() {
                var data = {};
                if (this.hasFilter()) {
                    data.filter = encodeURIComponent(this.filterStr);
                }

                var self = this;
                util.ajax({
                    url: this.url(),
                    data: data,
                    success: function(response) {
                        if (response.data && response.data.length > 0) {
                            self.trigger('resetPosts', response.data);
                        } else {
                            self.trigger('resetPosts', [actionCardData]);
                        }
                    },
                    method: 'GET'
                });
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });