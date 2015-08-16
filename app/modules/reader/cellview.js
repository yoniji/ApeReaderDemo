define(['marionette', 'mustache', 'jquery', 'text!modules/reader/cellsmall.html', 'text!modules/reader/cellmedium.html', 'text!modules/reader/celllarge.html', 'text!modules/reader/cellfull.html', 'modules/reader/articleview', 'modules/reader/cellactionsview'],
    function(Marionette, Mustache, $, smallCellTemplate, mediumCellTemplate, largeCellTemplate, fullCellTemplate, ArticleView, CellActionsView) {

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
                'tap @ui.more': 'onTapMore',
                'tap': 'onTap'
            },
            initialize: function() {


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
                        if(this.tags && this.tags.length > 0) {
                            outStr += '<i class="icon icon-pricetags"></i> ';
                            for (var i = 0; i < this.tags.length; i++) {
                                outStr += this.tags[i].name + ' ';
                            }
                        }
                        
                        return outStr;
                    }
                };
            },
            onShow: function() {

            },
            onTapMore: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.actionsView = new CellActionsView({
                    model:this.model,
                    toggleOffset: this.ui.more.offset()
                });
            },
            onTap: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new ArticleView({
                    model: this.model
                });
                this.model.markViewed();

            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cell'
        });
    });