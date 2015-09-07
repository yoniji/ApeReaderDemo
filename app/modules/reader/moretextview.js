define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/reader/moretext.html'],
    function(Backbone, Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'content': '.moreText',
                'close': '.close'
            },
            events: {
                'tap @ui.close': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {

                this.model = new Backbone.Model({ content: options.content });
                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);
                this.ui.content.css('height', this.$el.height() - this.ui.close.height() );
            },
            onTap: function(ev) {
                this.onDestroy();
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onTouchMove: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'moreTextWrapper overlay'
        });
    });