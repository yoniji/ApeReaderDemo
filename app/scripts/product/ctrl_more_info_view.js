define(['backbone', 
    'marionette', 
    'mustache', 
    'jquery', 
    'text!templates/ctrl_more_info.html',
    'hammerjs',
    'jquery-hammerjs'],
    function(Backbone, 
        Marionette, 
        Mustache, 
        $, 
        template,
        Hammer) {

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
                this.$el.addClass('slideInUp');
                    var self = this;
                    var to = setTimeout(function() {
                        self.$el.removeClass('slideInUp');
                        clearTimeout(to);
                }, 300);

                $('body').append(this.$el);
                 //hammer
                this.ui.close.hammer({ recognizers:[[Hammer.Tap]]});

                this.$el.focus();

                this.ui.content.css('height', this.$el.height() - this.ui.close.height() );
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOutDown');
                this.outTimer = setTimeout(function() {
                    if(self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 300);
                $('.productWrapper').last().focus();

            },
            onTap: function(ev) {
                this.slideOut();
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                this.stopListening();
                this.ui.close.destroyHammer();
                this.$el.remove();
            },
            className: 'moreTextWrapper overlay'
        });
    });