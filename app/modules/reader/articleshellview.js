define(['marionette', 'mustache', 'jquery', 'text!modules/reader/articleshell.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'shell':'.articleShell',
                'toolBar':'.toolBar',
                'back': '.toolBar-back'
            },
            events: {
                'tap @ui.back': 'onTapBack'
            },
            initialize: function(options) {
                this.render();
                $('body').append(this.$el);

                this.ui.shell.height($(window).height()- this.ui.toolBar.height());
            },
            modelEvents:{

            },
            templateHelpers: function() {

            },
            onTapBack: function() {
                this.destroy();
            },
            onShow: function() {
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'articleShellWrapper'
        });
    });