define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productitem.html', 'modules/reader/productview' ],
    function(Marionette, Mustache, $, template, ProductView) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap': 'onTap'
            },
            initialize: function() {


            },
            onTap: function(ev) {
                var productView = new ProductView({
                    'id': 3
                });
            },
            modelEvents: {
                'change': 'render'
            },
            className: 'productItem'
        });
    });