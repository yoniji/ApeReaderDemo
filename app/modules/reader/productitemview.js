define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productitem.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            modelEvents: {
                'change': 'render'
            },
            className: 'productItem'
        });
    });