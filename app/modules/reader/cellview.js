﻿define(['marionette', 'underscore','mustache', 'jquery', 'text!modules/reader/cellsmall.html', 'text!modules/reader/cellmedium.html', 'text!modules/reader/celllarge.html', 'text!modules/reader/cellfull.html', 'modules/reader/articleview', 'modules/reader/cellactionsview', 'waves'],
    function(Marionette, _, Mustache, $, smallCellTemplate, mediumCellTemplate, largeCellTemplate, fullCellTemplate, ArticleView, CellActionsView, Waves) {

        function isTargetAMoreButton($target) {
            return $target.hasClass('more') || $target.hasClass('more-line-1') || $target.hasClass('more-line-2');
        }

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                var targetTemplate = smallCellTemplate;
                switch (serialized_model.metadata.display_type) {
                    case 'medium':
                        targetTemplate = mediumCellTemplate;
                        break;
                    case 'large':
                        targetTemplate = largeCellTemplate;
                        break;
                    case 'full':
                        targetTemplate = fullCellTemplate;
                        break;
                    default:
                        targetTemplate = smallCellTemplate;
                }

                return Mustache.render(targetTemplate, serialized_model);

            },
            ui: {
                'inner': '.inner',
                'more': '.more'
            },
            events: {
                'touchstart': 'onTouchStart',
                'tap @ui.more': 'onTapMore',
                'tap':'onTap'
            },
            modelEvents: {
                'change': 'onChange'
            },
            initialize: function() {
                this.lastPageY = -1;
            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);



                var hasCoverImage = this.model.hasCoverImage();

                return {
                    'getSmallCellCoverHtml': function() {
                        if (hasCoverImage) return util.generateImageHtml(this.images[0], {
                            width: 72,
                            height: 72
                        });
                    },
                    'getMediumCellCoverHtml': function() {

                        var outStr = '<div class="cellCover">';

                        if (hasCoverImage && this.images.length < 3) {
                            outStr += this.getLargeCellCoverHtml();
                        } else if (hasCoverImage) {

                            var imgWidth = Math.round((windowWidth - 32 - 8) / 3);
                            var imgHeight = Math.round(imgWidth * 0.667);

                            for (var i = 0; i < 3; i++) {
                                outStr += util.generateImageHtml(this.images[i], {
                                    width: imgWidth,
                                    height: imgHeight
                                });
                            }

                        }

                        outStr += '</div>';
                        return outStr;
                    },
                    'getLargeCellCoverHtml': function() {
                        if (hasCoverImage) return util.generateImageHtml(this.images[0], {
                            width: (windowWidth - 32),
                            height: Math.round(windowWidth * 0.382)
                        });
                    },
                    'getFullCellCoverHtml': function() {
                        var outStr = '';
                        if (hasCoverImage) {
                            outStr += '<div class="cellCover">';
                            outStr += this.getLargeCellCoverHtml();
                            outStr += '</div>';

                            if (this.images.length > 2) {
                                outStr += '<div class="cellMoreImages">';
                                var imgWidth = Math.round((windowWidth - 32 - 8) / 3);
                                var imgHeight = Math.round(imgWidth * 0.667);

                                for (var i = 1; i < this.images.length && i < 4; i++) {
                                    outStr += util.generateImageHtml(this.images[i], {
                                        width: imgWidth,
                                        height: imgHeight
                                    });
                                }
                                outStr += '</div>';
                            }
                        }

                        return outStr;
                    },
                    'getTagsHtml': function() {
                        var outStr = '';
                        var seen = [];
                        var result = [];

                        _.each(this.tags, function(value, i, array) {
                            if (!_.findWhere(seen, value, { 'id': value.id })) {
                              seen.push(value);
                              result.push(value);
                            }
                        });

                        if (result && result.length > 0) {
                            outStr += '<i class="icon icon-pricetags"></i> ';
                            for (var i = 0; i < result.length && i < 3; i++) {
                                outStr += result[i].name + ' ';
                            }
                            if (result.length > 3) outStr += '...';
                        }

                        return outStr;
                    },
                    'getCreateTimeString': function() {
                        if (this.created_at) {
                            return util.getDateString(this.created_at);
                        }
                    },
                    'isTextCell': function() {
                        if (!this.images || this.images.length<1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            },
            onShow: function() {

            },
            onRender: function() {
                //Waves.attach(this.$el[0], ['waves-block']);

            },
            onTapMore: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var actionsView = new CellActionsView({
                    model: this.model,
                    toggleOffset: this.ui.more.offset()
                });
            },
            onChange: function() {
                var self = this;
                //等待article动画播放完毕再进行刷新
                if ( this.model.collection.hasOpenedArticle ) {
                    var timeout = setTimeout(function() {
                        if (self) {
                            self.render();
                            clearTimeout(timeout);
                            self = null;
                            timeout =null;
                        }
                    }, 800);
                } else {
                    this.render();
                }
                
            },
            onTouchStart: function(ev) {
               var streamWrapperEl = this.$el.parent().parent().parent();
               this.lastPageY = streamWrapperEl.scrollTop();
            },
            onTap: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var isScrolling = false;
                var streamWrapperEl = this.$el.parent().parent().parent();
                var currentPageY = streamWrapperEl.scrollTop();
                if ( Math.abs(currentPageY - this.lastPageY) > 50 ) {
                    isScrolling = true;
                }
                
                if ( !isScrolling && !this.model.collection.hasOpenedArticle ) {
                    Waves.ripple(this.$el[0]);
                    
                    this.model.collection.hasOpenedArticle = true;
                    app.appController.articleView = new ArticleView({
                        model: this.model,
                        delay: true,
                        triggerFrom: this
                    });
                }
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cell waves-effect'
        });
    });