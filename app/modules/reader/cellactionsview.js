define(['marionette', 'mustache', 'jquery', 'text!modules/reader/cellactions.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'dialog': '.cellActions',
                'overlay': '.overlay'
            },
            events: {
                'tap @ui.overlay': 'destroy',
                'tap .action-like': 'onToggleLike',
                'tap .action-block': 'onBlock'
            },
            initialize: function(options) {
                this.toggleOffset = options.toggleOffset;
                this.render();
            },
            onRender: function() {
                var windowHeight = $(window).height();
                if ( this.toggleOffset.top > (windowHeight * 0.618) ) {
                    this.ui.dialog.addClass('bottomCaret');
                    this.ui.dialog.css('bottom', Math.round( windowHeight - this.toggleOffset.top ));
                } else {
                    this.ui.dialog.addClass('topCaret');
                    this.ui.dialog.css('top', Math.round( this.toggleOffset.top ));
                }
                
                $('body').append(this.$el);

            },
            onToggleLike: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.model.toggleLike();
                this.destroy();
            },
            onBlock: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.model.block();
                this.destroy();
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'cellActionWrapper'
        });
    });