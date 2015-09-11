define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productitem.html', 'modules/reader/productview', 'waves' ],
    function(Marionette, Mustache, $, template, ProductView, Waves) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap': 'onTap'
            },
            initialize: function() {


            },
            onRender: function() {
                Waves.attach(this.$el[0],['waves-block']);
            },
            onTap: function(ev) {
                var productView = new ProductView({
                    'id': 3,
                    'delay':true
                });
            },
            modelEvents: {
                'change': 'render'
            },
            className: 'productItem'
        });
    });