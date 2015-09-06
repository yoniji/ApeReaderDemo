define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/rankcell.html'],
    function(Marionette, Mustache, $, CellView, template) {

        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            modelEvents: {
                'change': 'render'
            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);



                var hasCoverImage = this.model.hasCoverImage();

                return {
                    'getMediumCellCoverHtml': function() {

                        var outStr = '';

                        if (hasCoverImage && this.images.length < 3) {
                            outStr += '<div class="cellCover">';
                            outStr += this.getLargeCellCoverHtml();
                            outStr += '</div>';
                        } else {
                            outStr += '<div class="cellMoreImages">';
                            var imgWidth = Math.round((windowWidth - 32 - 8) / 3);
                            var imgHeight = Math.round(imgWidth * 0.667);

                            for (var i = 0; i < 3; i++) {
                                outStr += util.generateImageHtml(this.images[i], {
                                    width: imgWidth,
                                    height: imgHeight
                                });
                            }
                            outStr += '</div>';

                        }
                        
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
                    generateRankCellCoverHtml: function() {
                        if (this.rank < 4) {
                            return this.getFullCellCoverHtml();
                        } else {
                            return this.getMediumCellCoverHtml();
                        }
                    },
                    'getTagsHtml': function() {
                        var outStr = '';
                        if (this.tags && this.tags.length > 0) {
                            outStr += '<i class="icon icon-pricetags"></i> ';
                            for (var i = 0; i < this.tags.length; i++) {
                                outStr += this.tags[i].name + ' ';
                            }
                        }

                        return outStr;
                    }
                };
            },
            className: 'cell rankCell'
        });
    });