define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/reader/share.html'],
    function(Backbone, Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {
                var shareInfo = appConfig.share_info;
                var hash = '';
                if (options&&options.shareInfo) shareInfo = options.shareInfo;
                if (options&&options.hash) hash = options.hash;
                if (options&&options.originalShareInfo) this.originalShareInfo = options.originalShareInfo;

                this.model = new Backbone.Model(shareInfo);

                var self = this;
                util.setWechatShare(shareInfo, function() {
                    self.destroy();
                }, null, hash);

                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);
                $('.articleWrapper').addClass('blur');
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
                if (this.originalShareInfo) util.setWechatShare(this.originalShareInfo);
                this.stopListening();
                this.$el.remove();
                $('.articleWrapper').removeClass('blur');
            },
            className: 'shareWrapper shareOverlay overlay'
        });
    });