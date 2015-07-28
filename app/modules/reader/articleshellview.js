define(['marionette', 'mustache', 'jquery', 'text!modules/reader/articleshell.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {

            },
            events: {

            },
            initialize: function(options) {
                this.render();
                $('body').append(this.$el);
            },
            modelEvents:{

            },
            templateHelpers: function() {

            },
            onShow: function() {
                console.log('here');
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'articleShellWrapper'
        });
    });