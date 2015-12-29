define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('products');
            },
            initialize: function() {
                this.set('rooms', appConfig.product_menu[1].children);
            },
            parse: function(response) {
                if(appConfig) response.categories = appConfig.product_menu;
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });