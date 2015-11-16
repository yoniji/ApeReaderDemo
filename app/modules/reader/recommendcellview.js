define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/recommendcell.html'],
    function(Marionette, Mustache, $, CellView, template) {
        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            modelEvents: {
                'change': 'onChange'
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
                        } else if(hasCoverImage){
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
                    generateRankCellCoverHtml: function() {
                        return this.getMediumCellCoverHtml();
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
                    }
                };
            },
            className: 'cell recommendCell waves-effect'
        });
    });