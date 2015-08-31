define(['underscore', 'modules/reader/articleview', 'mustache', 'jquery', 'text!modules/reader/articleshare.html',  'modules/reader/postmodel', 'text!modules/reader/error.html', 'text!modules/reader/notfound.html', 'modules/reader/shareview', 'modules/reader/imageactionview', 'modules/reader/subscribeview'],
    function(_, ArticleView, Mustache, $, shareTemplate, PostModel, errorTemplate, notFoundTemplate, ShareView, ImageActionView, SubscribeView) {

        return ArticleView.extend({
            template: function(serialized_model) {
                if (serialized_model.error) {
                    if (serialized_model.code === 404) {
                        return Mustache.render(notFoundTemplate, serialized_model);
                    } else {
                        return Mustache.render(errorTemplate, serialized_model);
                    }
                } else {
                    return Mustache.render(shareTemplate, serialized_model);
                }
            },
            events: {
                'tap @ui.like': 'onToggleLike',
                'tap @ui.share': 'onTapShare',
                'tap @ui.block': 'onTapBlock',
                'tap .articleBody .image': 'onTapImage',
                'tap .thumbSwitch': 'showLargeImages',
                'tap .creditItem': 'onTapCredit',
                'tap .share-readMore' : 'onTapMore',
                'tap .expandSwitch': 'onTapExpand',
                'tap .action-home': 'onTapMore',
                'tap .action-share': 'onTapShare',
            },
            modelEvents: {
                'sync': 'onModelSync',
                'toggleLikeSuccess': 'onToggleLikeSuccess'
            },
            initialize: function(options) {

                this.model = new PostModel();
                this.model.set('id', options.id);
                this.model.fetch({
                    data: {
                        'id': this.model.get('id')
                    }
                });

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
                    return true;
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
                share_info.link = url;

                if (this.model.hasCoverImage()) {
                    var img = _.clone(this.model.get('images')[0]);
                    img.url = img.url + '@180w_180h_1e_1c';
                    share_info.image = img;
                }

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null, null);
            },
            onTapMore: function() {
                this.destroy();
                app.appRouter.navigate('#explore', {
                    trigger: true,
                    replace: false
                });
            },
            onTapCredit: function() {
                new SubscribeView();
            },
            onTapExpand: function() {
                this.$el.find('.expand').hide();
                this.$el.find('.fold').removeClass('fold');
            },
            shouldShowGrid: function() {
                return this.isFormated() && this.$el.find('.articleBody .image').size() > 5;
            },
            processImageToGrid: function() {
                var width = Math.floor(($(window).width() - 32 - 8 ) / 3);
                var ratio = Math.min(2, util.getDeviceRatio());
                if (appConfig.networkType === '2g') ratio = 1;

                this.$el.find('.articleBody .image').each(function(index, el) {
                    var $el = $(el);
                    var $img = $el.find('img');
                    var src = $img.attr('src');

                    $el.css({
                        'width': width,
                        'height': width
                    }).addClass('thumb gridThumb');
                    $img.attr({
                        'src': src + '@_' + width*ratio + 'w_' + width*ratio + 'h_1e_1c',
                        'originalSrc': src
                    }).css({
                        'width': width,
                        'height': width
                    });

                });
            },
            onRender: function() {
                if (this.shouldShowGrid()) {
                    this.processImageToGrid();
                } else if (this.shouldShowThumb()) {
                    this.processImage();
                }
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
            className: 'articleWrapper shareArticleWrapper'
        });
    });