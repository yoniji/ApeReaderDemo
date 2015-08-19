define(['backbone', 'jquery', 'modules/reader/productmodel'],
    function(Backbone, $, ProductModel) {

        return Backbone.Collection.extend({
            url: function() {
                return urls.getServiceUrlByName('products');
            },
            initialize: function(options) {
                
            },
            onDestroy: function() {
                this.stopListening();
            },
            model:ProductModel
        });
    });