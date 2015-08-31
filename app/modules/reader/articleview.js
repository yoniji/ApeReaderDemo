define(['underscore', 'marionette', 'mustache', 'jquery', 'text!modules/reader/article.html', 'text!modules/reader/articleshell.html', 'modules/reader/postmodel','text!modules/reader/error.html','text!modules/reader/notfound.html', 'modules/reader/shareview', 'modules/reader/imageactionview'],
    function(_, Marionette, Mustache, $, coreTemplate, shellTemplate, PostModel, errorTemplate, notFoundTemplate, ShareView, ImageActionView) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                if (serialized_model.error) {
                    if (serialized_model.code === 404) {
                        return Mustache.render(notFoundTemplate, serialized_model);
                    } else {
                        return Mustache.render(errorTemplate, serialized_model);
                    }
                } else if (serialized_model.metadata.formated) {
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
                'tap .thumbSwitch': 'showLargeImages',
                'panleft': 'onPanMove',
                'panright': 'onPanMove',
                'panend': 'onPanEnd',
                'pancancel': 'onPanEnd'
            },
            modelEvents: {
                'sync': 'onModelSync',
                'toggleLikeSuccess': 'onToggleLikeSuccess',
                'blockSuccess': 'onBlockSuccess'
            },
            initialize: function(options) {
                
                if (options) {
                    this.directShow = !!options.directShow;
                    this.delay = !!options.delay;
                    if (options.triggerFrom) {
                        this.startBox = {
                            width: options.triggerFrom.$el.width(),
                            height: options.triggerFrom.$el.height(),
                            left: options.triggerFrom.$el.offset().left,
                            top: options.triggerFrom.$el.offset().top
                        };
                    }
                }

                if (this.model && !this.model.isNew()) {
                    this.originalRouter = window.location.hash;
                    this.onModelSync();
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
                    this.$el.removeClass('delayShow');
                    this.$el.removeClass('animate');
                }
            },
            onPanMove: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var gesture = ev.originalEvent.gesture;

                if (this.isPanStarted) {
                    util.setElementTransform(this.$el, 'translate3d(' + (gesture.deltaX - 10) + 'px,0,0)');
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
                    this.slideOut();
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
                var src = $img.attr('src');
                if ($el.hasClass('thumb')) src = $img.attr('originalSrc');
                var current = src;

                if ($el.hasClass('gridThumb')) {

                    //网格模式下，启用微信图片浏览器
                    var urls = [];
                    this.$el.find('.articleBody .image img').each(function(index, el) {
                        var img = $(el);
                        if (img.parent().hasClass('thumb')) {
                            urls.push(img.attr('originalSrc'));
                        } else {
                            urls.push(img.attr('src'));
                        }
                            
                    });
                    util.previewImages(urls, current);
                    util.trackEvent('Image', '浏览相册', 1);

                } else if($el.hasClass('thumb')) {

                    //缩略图模式下，切换为大图
                    $img.attr('src', $img.attr('originalSrc'));
                    $el.removeClass('thumb').attr('style', '');

                    util.trackEvent('Image', '放大', 1);

                } else {
                    
                    //大图模式下，显示上下文toolbox
                    var pointer = ev.originalEvent.gesture.pointers[0];
                    var imageAction = new ImageActionView({
                        model: this.model,
                        toggleOffset: {
                            left: pointer.pageX,
                            top: pointer.pageY
                        },
                        current: current
                    });

                    util.trackEvent('Image', '查看选项', 1);

                }



            },
            showLargeImages: function() {
                this.$el.find('.thumbSwitch').hide();

                this.$el.find('.thumb').each(function(index, el) {
                    var $el = $(el);
                    var $img = $el.find('img');
                    $img.attr('src', $img.attr('originalSrc')).attr('style', '');
                    $el.removeClass('thumb gridThumb').attr('style', '');
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

                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;
                share_info.timeline_title = this.model.get('title');
                share_info.message_title = this.model.get('title');
                share_info.message_description = this.model.get('excerpt');

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#share/posts/' + this.model.get('id'));
                share_info.link =url;

                if (this.model.hasCoverImage()) {
                    var img = _.clone(this.model.get('images')[0]);
                    img.url = img.url + '@180w_180h_1e_1c';
                    share_info.image = img;
                }

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null ,null);
            },
            isFormated: function() {
                return (this.model.has('metadata') && this.model.get('metadata').formated);
            },
            shouldShowThumb: function() {
                return (appConfig.networkType !== 'wifi') && this.isFormated();
            },
            onRender: function() {

                if (this.shouldShowThumb()) this.processImage();
                if (!this.directShow) this.$el.addClass('animate');
                if (this.delay) {
                    this.initTransform();
                    this.$el.addClass('delayShow');
                    var self = this;
                    var to = setTimeout(function() {
                        util.setElementTransform(self.$el, '');
                        self.$el.removeClass('delayShow');
                        clearTimeout(to);
                    }, 800);
                }


                $('body').append(this.$el);



                var articleHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.article.css('height', articleHeight);
                this.$el.focus();
                this.model.markViewed();
                

            },
            initTransform: function() {
                var width = $(window).width();
                var height = $(window).height();
                var scaleX = this.startBox.width / width;
                var scaleY = this.startBox.height / height;
                var transformOriginX = Math.round(this.startBox.width / 2) + this.startBox.left;
                var transformOriginY = Math.round(this.startBox.height / 2) + this.startBox.top;

                var transformStr = 'scale3d(' + scaleX + ',' + scaleY +',' + '1) translate3d(0,0,0)';
                util.setElementTransform(this.$el, transformStr);
                util.setElementTransformOrigin( this.$el, transformOriginX + 'px ' + transformOriginY + 'px');
            },
            processImage: function() {
                var thumbWidth = 180;

                var ratio = Math.min(2, util.getDeviceRatio());
                if (appConfig.networkType === '2g') ratio = 1;

                this.$el.find('.articleBody .image').each(function(index, el) {
                    var $el = $(el);
                    var $img = $el.find('img');
                    var src = $img.attr('src');

                    $el.css('width', thumbWidth).addClass('thumb');
                    $img.attr({
                        'src': src + '@_' + Math.round(thumbWidth * ratio) + 'w',
                        'originalSrc': src
                    }).css({
                        'width':thumbWidth
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
                util.setElementTransform(this.$el, '');
                this.slideOut();
                
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOut');
                this.outTimer = setTimeout(function() {
                    if(self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 500);

                app.appRouter.navigate(this.originalRouter, {
                    trigger: false,
                    replace: false
                });
                $('.streamWrapper,.feedsWrapper').focus();
                util.trackEvent('Close', 'Post', 1);
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
                var shareView = new ShareView({ 
                    shareInfo: this.shareInfo,
                 });
                util.trackEvent('Share', 'Post', 1);
            },
            onTapNext: function() {

            },
            onTapBlock: function() {
                util.setIconToLoading(this.ui.block.find('.icon'));
                this.model.block();
                util.trackEvent('Block', 'Post', 1);
            },
            onBlockSuccess: function() {
                this.onTapBack();
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
                if (this.outTimer) clearTimeout(this.outTimer);
                if (this.timeout) clearTimeout(this.timeout);

                
                window.appConfig.share_info = _.clone(this.originalShare);
                util.setWechatShare(window.appConfig.share_info);
            },
            className: 'articleWrapper'
        });
    });