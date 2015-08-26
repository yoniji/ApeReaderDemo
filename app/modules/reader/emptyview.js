define(['marionette', 'mustache', 'jquery', 'text!modules/reader/loading.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            onRender: function() {

            },
            onDestroy: function() {
                this.$el.parent().siblings('.loading').css('visibility','visible');
            },
            className: 'empty'
        });
    });