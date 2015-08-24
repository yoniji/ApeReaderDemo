define(['underscore', 'marionette', 'mustache', 'jquery', 'text!modules/reader/article.html', 'text!modules/reader/articleshell.html', 'modules/reader/postmodel'],
    function(_, Marionette, Mustache, $, coreTemplate, shellTemplate, PostModel) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                if (serialized_model.metadata.formated) {
                    return Mustache.render(coreTemplate, serialized_model);
                } else {
                    return Mustache.render(shellTemplate, serialized_model);
                }
            },
            ui: {
                'toolBar': '.toolBar',
                'back': '.toolBar-back',
                'like': '.toolBar-like',
                'share': '.toolBar-share',
                'block': '.toolBar-block',
                'next': '.toolBar-next',
                'article': '.article',
                'credit': '.creditItem'
            },
            events: {
                'tap @ui.back': 'onTapBack',
                'tap @ui.like': 'onToggleLike',
                'tap @ui.share': 'onTapShare',
                'tap @ui.block': 'onTapBlock',
                'tap @ui.next': 'onTapNext',
                'tap .articleBody .image': 'onTapImage',
                'panleft @ui.article': 'onPanMove',
                'panright @ui.article': 'onPanMove',
                'panend @ui.article': 'onPanEnd',
                'pancancel @ui.article': 'onPanEnd',
                'tap .thumbSwitch': 'showLargeImages'
            },
            modelEvents: {
                'sync': 'onModelSync',
                'toggleLikeSuccess': 'onToggleLikeSuccess',
                'blockSuccess': 'onBlockSuccess'
            },
            initialize: function(options) {
                if (this.model && !this.model.isNew()) {
                    this.onModelSync();
                    this.originalRouter = window.location.hash;
                } else {
                    this.model = new PostModel();
                    this.model.set('id', options.id);
                    this.model.fetch({
                        data: {
                            'id': this.model.get('id')
                        }
                    });
                    this.originalRouter = 'explore';
                }

                app.appRouter.navigate('posts/' + this.model.get('id'), {
                    trigger: false,
                    replace: false
                });




            },
            onPanStart: function(ev) {
                if (!this.isPanStarted) {
                    this.isPanStarted = true;
                }
            },
            onPanMove: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var gesture = ev.originalEvent.gesture;

                if (this.isPanStarted) {
                    util.setElementTransform(this.$el, 'translate3d(' + (gesture.deltaX - 50) + 'px,0,0)');
                } else if (gesture.deltaX > 50) {
                    this.onPanStart(ev);
                }
            },
            onPanEnd: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.isPanStarted = false;
                var gesture = ev.originalEvent.gesture;

                if (gesture && gesture.deltaX && gesture.deltaX > ($(window).width() / 2)) {
                    this.onTapBack();
                } else {
                    this.slideBack();
                }
            },
            slideBack: function(ev) {
                util.setElementTransform(this.$el, 'translate3d(0,0,0)');
            },
            onTapImage: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var $el = $(ev.currentTarget);
                var $img = $el.find('img');


                if ($el.hasClass('thumb')) {
                    $img.attr('src', $img.attr('originalSrc'));
                    $el.removeClass('thumb').attr('style', '');

                    util.trackEvent('Image', '放大', 1);

                } else {
                    var urls = [];
                    var src = $img.attr('src');
                    var current = src;

                    this.$el.find('.articleBody .image img').each(function(index, el) {
                        urls.push($(el).attr('src'));
                    });

                    util.previewImages(urls, current);

                    util.trackEvent('Image', '查看选项', 1);
                }



            },
            showLargeImages: function() {
                this.$el.find('.thumbSwitch').hide();

                this.$el.find('.thumb').each(function(index, el) {
                    var $el = $(el);
                    var $img = $el.find('img');
                    $img.attr('src', $img.attr('originalSrc'));
                    $el.removeClass('thumb').attr('style', '');
                });

                util.trackEvent('Image', '显示全部大图', 1);
            },
            templateHelpers: {
                'getTagsHtml': function() {
                    var outStr = '';
                    if (this.tags && this.tags.length > 0) {
                        outStr += '<i class="icon icon-pricetags"></i> ';
                        for (var i = 0; i < this.tags.length; i++) {
                            outStr += this.tags[i].name + ' ';
                        }
                    }

                    return outStr;
                },
                'getCreateTimeString': function() {
                    if (this.created_at) {
                        return util.getDateString(this.created_at);
                    }
                },
                'isThumbSwitchVisible': function() {
                    return (appConfig.networkType && appConfig.networkType !== 'wifi');
                }
            },
            onModelSync: function() {
                this.render();
                var share_info = _.clone(appConfig.share_info);
                share_info.timeline_title = this.model.get('title');
                share_info.message_title = this.model.get('title');
                share_info.message_description = this.model.get('excerpt');
                if (this.model.hasCoverImage()) {
                    var img = _.clone(this.model.get('images')[0]);
                    img.url = img.url + '@180w_180h_1e_1c';
                    share_info.image = img;
                }

                util.setWechatShare(share_info);
            },
            isFormated: function() {
                return !!this.model.get('metadata').formated;
            },
            shouldShowThumb: function() {
                return (appConfig.networkType !== 'wifi') && this.isFormated();
            },
            onRender: function() {

                if (this.shouldShowThumb()) this.processImage();

                $('body').append(this.$el);

                var articleHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.article.css('height', articleHeight);

                //this.model.markViewed();
                util.trackEvent('View', 'Post', 1);

            },
            processImage: function() {
                var thumbWidth = 180;

                var ratio = Math.min(1.5, util.getDeviceRatio());
                if (appConfig.networkType === '2g') ratio = 1;

                this.$el.find('.articleBody .image').each(function(index, el) {
                    var $el = $(el);
                    var $img = $el.find('img');
                    var src = $img.attr('src');

                    $el.css('width', thumbWidth).addClass('thumb');
                    $img.find('img').attr({
                        'src': src + '@_' + Math.round(thumbWidth * ratio),
                        'originalSrc': src
                    });

                });

                if (!appConfig.networkNotificationShown) {
 
                    this.ui.article.prepend('<div class="notification notification-info" style="margin-left:-16px;margin-right:-16px;">检测到您在' + appConfig.networkType + '网络下，已优化图片尺寸，节省流量</div>');
                    var self = this;
                    this.timeout = setTimeout(function() {
                        self.clearNotification();
                    }, 2000);
                    appConfig.networkNotificationShown = true;
                }
            },
            clearNotification: function() {
                if (this.timeout) clearTimeout(this.timeout);
                this.$el.find('.notification').remove();
            },
            onTapBack: function() {
                var self = this;
                this.$el.addClass('slideOut');
                this.outTimer = setTimeout(function() {
                    if(self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 1000);
                
            },
            onToggleLike: function() {
                util.setIconToLoading(this.ui.like.find('.icon'));
                this.model.toggleLike();
            },
            onToggleLikeSuccess: function() {
                if (this.model.get('metadata').liked) {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart3 main-color');
                    util.trackEvent('Like', 'Post', 1);
                } else {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart2');
                    util.trackEvent('Dislike', 'Post', 1);
                }
            },
            onTapShare: function() {
                this.model.markShared();
            },
            onTapNext: function() {

            },
            onTapBlock: function() {
                util.setIconToLoading(this.ui.block.find('.icon'));
                this.model.block();
                util.trackEvent('Close', 'Post', 1);
            },
            onBlockSuccess: function() {
                this.onTapBack();
                util.trackEvent('Block', 'Post', 1);
            },
            onShow: function() {

            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();

                if (this.outTimer) clearTimeout(this.outTimer);
                if (this.timeout) clearTimeout(this.timeout);

                app.appRouter.navigate(this.originalRouter, {
                    trigger: false,
                    replace: false
                });

                util.setWechatShare(window.appConfig.share_info);
            },
            className: 'articleWrapper'
        });
    });