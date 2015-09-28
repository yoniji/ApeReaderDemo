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
                        self.set(response);
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
                        self.trigger('gotMore',response.products);
                    }
                });
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });