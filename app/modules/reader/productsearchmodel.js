define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('products');
            },
            initialize: function() {

            },
            parse: function(response) {
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });