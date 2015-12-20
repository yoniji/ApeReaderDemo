define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('products');
            },
            search: function(filterJSON) {
                var self = this;
                util.ajax({
                    url: this.url(),
                    data: filterJSON,
                    success: function(response) {

                        var data = {};
                        data.products = response.data;

                        self.set(data);
                        self.trigger('sync');
                    }
                });
            },
            loadMore: function(filterJSON) {
                var self = this;
                util.ajax({
                    url: this.url(),
                    data: filterJSON,
                    success: function(response) {
                        self.trigger('gotMore',response.data);
                    }
                });
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });