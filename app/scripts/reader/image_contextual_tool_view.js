define(['marionette', 
    'mustache', 
    'jquery', 
    'text!templates/image_contextual_tool.html', 
    'scripts/common/share_view',
    'hammerjs',
    'jquery-hammerjs'],
    function(Marionette, 
        Mustache, 
        $, 
        template, 
        ShareView,
        Hammer
        ) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'dialog': '.imageActions',
                'overlay': '.overlay'
            },
            events: {
                'touchstart @ui.overlay': 'destroy',
                'tap .action-gallary': 'onViewGallary',
                'tap .action-share': 'onShare'
            },
            initialize: function(options) {
                this.toggleOffset = options.toggleOffset;
                this.current = options.current;
                this.render();
            },
            onRender: function() {
                var windowHeight = $(window).height();
                var windowWidth = $(window).width();
                if ( this.toggleOffset.top > (windowHeight * 0.618) ) {
                    this.ui.dialog.addClass('bottomCaret');
                    this.ui.dialog.css('bottom', Math.round( windowHeight - this.toggleOffset.top + 16));
                } else {
                    this.ui.dialog.addClass('topCaret');
                    this.ui.dialog.css('top', Math.round( this.toggleOffset.top - 16));
                }
                if ( this.toggleOffset.left < windowWidth * 0.5 ) {
                    this.ui.dialog.addClass('leftCaret');
                    this.ui.dialog.css('left', Math.round( this.toggleOffset.left - 16));
                } else {
                    this.ui.dialog.css('right', Math.round( windowWidth - this.toggleOffset.left - 16 ));
                }
                
                $('body').append(this.$el);

                this.$el.find('.action-gallary').hammer({
                    recognizers:[[Hammer.Tap]]
                });
                this.$el.find('.action-share').hammer({
                    recognizers:[[Hammer.Tap]]
                });

            },
            onViewGallary: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var urls = [];

                $('.articleBody .image img').each(function(index, el) {
                    var img = $(el);
                    if (img.parent().hasClass('thumb')) {
                        urls.push(img.attr('originalSrc'));
                    } else {
                        urls.push(img.attr('src'));
                    }
                        
                });
                util.previewImages(urls, this.current);
                this.destroy();
                util.trackEvent('Image', '浏览相册', 1);

            },
            onShare: function(ev) {
                var share_info = _.clone(appConfig.share_info);
                share_info.timeline_title = this.model.get('title') + '「悟空家装」';
                share_info.message_title = this.model.get('title') + '「悟空家装」';
                share_info.message_description = this.model.get('excerpt');

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#share/posts/' + this.model.get('id'));
                share_info.link =url;
                share_info.image = { url: this.current, type:'oss' };


                if ( util.isMKApp() ) {
                    util.mkAppShare(share_info);
                } else {
                    var shareView = new ShareView({ 
                        shareInfo: share_info
                    });
                }
                
                util.trackEvent('Share', 'Image', 1);

                this.destroy();
                util.trackEvent('Image', '分享', 1);
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'imageActionWrapper'
        });
    });