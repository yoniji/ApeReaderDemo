define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/reader/subscribe.html'],
    function(Backbone, Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'code': '.qrcode',
                'count': '.countDown'
            },
            events: {
                'tap': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {
                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);
                $('.articleWrapper').addClass('blur');

                this.$el.find('.qrcode').focus();
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
            stopCountDown: function() {
                this.ui.count.text(5);
            },
            startCountDown: function() {
                var seconds = 5;
                var self = this;
                this.timmer = setInterval(function() {
                    seconds--;
                    self.ui.count.text(seconds);
                    if (seconds<1) {
                        clearInterval(self.timmer);
                        self.timmer = null;
                        self.stopCountDown();

                    }
                }, 1000);
            },
            onDestroy: function() {
                if(this.timmer) clearInterval(this.timmer);
                this.timmer = null;

                if (this.originalShareInfo) util.setWechatShare(this.originalShareInfo);
                this.stopListening();
                this.$el.remove();
                $('.articleWrapper').removeClass('blur');

            },
            className: 'shareWrapper shareOverlay overlay'
        });
    });