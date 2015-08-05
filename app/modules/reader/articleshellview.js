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
                'tap @ui.back': 'onTapBack',
                'tap .articleShell': 'onPanStart',
                'panmove .articleShell': 'onPanMove',
                'panend .articleShell': 'onPanEnd'
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
            onPanStart: function(ev) {
                console.log('here');
            },
            onPanMove: function(ev) {
                console.log('here');
            },
            onPanEnd: function(ev) {
                console.log('here');
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