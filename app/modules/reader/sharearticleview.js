define(['marionette', 
    'underscore', 
    'modules/reader/articleview', 
    'mustache', 
    'jquery', 
    'text!modules/reader/articleshare.html', 
    'modules/reader/postmodel', 
    'text!modules/reader/error.html', 
    'text!modules/reader/notfound.html', 
    'modules/reader/shareview', 
    'modules/reader/imageactionview', 
    'modules/reader/subscribeview', 
    'modules/reader/relatedcellview', 
    'modules/reader/featuremodel',  
    'modules/reader/postcollection',
    'hammerjs',
    'jquery-hammerjs'],
    function(Marionette, 
        _, 
        ArticleView, 
        Mustache, 
        $, 
        shareTemplate, 
        PostModel, 
        errorTemplate, 
        notFoundTemplate, 
        ShareView, 
        ImageActionView, 
        SubscribeView, 
        CellView, 
        FeatureModel, 
        PostCollection,
        Hammer) {

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
                'tap .share-readMore': 'onTapMore',
                'tap .expandSwitch': 'onTapExpand',
                'tap .action-home': 'onTapMore',
                'tap .action-share': 'onTapShare',
                'touchmove @ui.article':'onTouchMove'
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
                        for (var i = 0; i < this.tags.length && i < 3; i++) {
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
                },
                getFirstTag: function() {
                    if (this.tags && this.tags.length > 1) {
                        return this.tags[0].name;
                    }
                }
            },
            onTapMore: function() {
                this.destroy();
                app.appRouter.navigate('#explore', {
                    trigger: true,
                    replace: false
                });
            },
            onTapCredit: function() {
                var sv = new SubscribeView();
                var self = this;
                this.listenToOnce(sv, 'explore', function() {
                    self.onTapMore();
                });
            },
            onTapExpand: function() {
                this.$el.find('.expand').hide();
                this.$el.find('.fold').removeClass('fold');
            },
            shouldShowGrid: function() {
                return this.isFormated() && this.$el.find('.articleBody .image').size() > 2;
            },
            processImageToGrid: function() {
                var width_1_3 = Math.floor(($(window).width() - 32 - 8) / 3);
                var width_1_2 = Math.floor(($(window).width() - 32 - 4) / 2);

                var ratio = util.getDeviceRatio();

                var startImg = this.$el.find('.articleBody .image').first();

                function processImageGroup(imgGroup) {
                    var width = width_1_2;
                    var gridClass = 'grid1-2';
                    if (imgGroup.size() > 2) {
                        width = width_1_3;
                        gridClass = 'grid1-3';
                    }
                    imgGroup.each(function(index, el) {
                        var $el = $(el);
                        var $img = $el.find('img');
                        var src = $img.attr('src');

                        $el.css({
                            'width': width,
                            'height': width
                        }).addClass('thumb gridThumb ' + gridClass);
                        $img.attr({
                            'src': src + '@' + width * ratio + 'w_' + width * ratio + 'h_1e_1c',
                            'originalSrc': src
                        }).css({
                            'width': width,
                            'height': width
                        });
                    });
                    var imgGroupContainer = $('<div class="grid"></div>');
                    
                    imgGroup.first().before(imgGroupContainer);
                    imgGroupContainer.append(imgGroup);
                }

                while (startImg.size() > 0) {
                    //将图片拆分成连续的组，分别处理
                    var imgGroup = startImg.nextUntil('p', '.image').andSelf();
                    //先找下一组的起点图片，再处理imgGroup
                    startImg = imgGroup.last().nextAll('.image').first();
                    //因为处理后imgGroup在DOM中的层级会发生变化，应放在最后执行
                    if (imgGroup.size() > 1) processImageGroup(imgGroup);
                }

            },
            onRender: function() {
                if (this.shouldShowGrid()) {
                    this.processImageToGrid();
                } else if (this.shouldShowThumb()) {
                    this.processImage();
                }
                if (!this.directShow) this.$el.addClass('animate');



                $('body').append(this.$el);



                var articleHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.article.css('height', articleHeight);
                this.$el.focus();
                this.model.markViewed();

                this.initRelatedArticleRegion();

                /*
                'tap @ui.like': 'onToggleLike',
                'tap @ui.share': 'onTapShare',
                'tap @ui.block': 'onTapBlock',
                'tap .articleBody .image': 'onTapImage',
                'tap .thumbSwitch': 'showLargeImages',
                'tap .creditItem': 'onTapCredit',
                'tap .share-readMore': 'onTapMore',
                'tap .expandSwitch': 'onTapExpand',
                'tap .action-home': 'onTapMore',
                'tap .action-share': 'onTapShare',
                'touchmove @ui.article':'onTouchMove'
                */


                this.ui.share.hammer({
                    recognizers:[[Hammer.Tap]]
                });
                this.ui.like.hammer({
                    recognizers:[[Hammer.Tap]]
                });
                this.ui.block.hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.articleBody .image').each(function(index, el) {
                    var $el = $(el);
                    $el.hammer({recognizers:[[Hammer.Tap]]});

                });

                this.$el.find('.thumbSwitch').hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.creditItem').hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.share-readMore').hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.expandSwitch').hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.action-home').hammer({
                    recognizers:[[Hammer.Tap]]
                });

                this.$el.find('.action-share').hammer({
                    recognizers:[[Hammer.Tap]]
                });



            },
            className: 'articleWrapper shareArticleWrapper'
        });
    });