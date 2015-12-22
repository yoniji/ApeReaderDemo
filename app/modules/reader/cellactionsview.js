define(['marionette', 
    'mustache', 
    'jquery', 
    'text!modules/reader/cellactions.html', 
    'modules/reader/shareview'],
    function(
        Marionette, 
        Mustache, 
        $, 
        template, 
        ShareView
    ) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'dialog': '.cellActions',
                'overlay': '.overlay'
            },
            events: {
                'touchstart @ui.overlay': 'destroy',
                'tap .action-like': 'onToggleLike',
                'tap .action-block': 'onBlock',
                'tap .action-share': 'onShare'
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
                 this.ui.dialog.css('right', Math.round( $(window).width() - this.toggleOffset.left - 48 + 8 ));
                $('body').append(this.$el);

            },
            onToggleLike: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.model.toggleLike();
                if (this.model.get('metadata').liked) {
                    util.trackEvent('Like', 'Cell', 1);
                } else {
                    util.trackEvent('Dislike', 'Cell', 1);
                }
                this.destroy();
            },
            onBlock: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.model.block();
                util.trackEvent('Block', 'Cell', 1);
                this.destroy();
            },
            onShare: function(ev) {
                var share_info = _.clone(appConfig.share_info);
                share_info.timeline_title = this.model.get('title') + '「悟空家装」';
                share_info.message_title = this.model.get('title') + '「悟空家装」';
                share_info.message_description = this.model.get('excerpt');

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#share/posts/' + this.model.get('id'));
                share_info.link =url;

                if (this.model.hasCoverImage()) {
                    var img = _.clone(this.model.get('images')[0]);
                    img.url = img.url + '@180w_180h_1e_1c';
                    share_info.image = img;
                }

                if ( util.isMKApp() ) {

                    util.mkAppShare(share_info);

                } else {
                    var shareView = new ShareView({ 
                        shareInfo: share_info,
                        originalShareInfo: appConfig.share_info
                    });
                }

                
                util.trackEvent('Share', 'Cell', 1);

                this.destroy();
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'cellActionWrapper'
        });
    });