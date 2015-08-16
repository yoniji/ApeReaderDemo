define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/rankcell.html'],
    function(Marionette, Mustache, $, CellView, template) {

        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);

                var coverType = 'noCover';
                if (this.model.get('images') && this.model.get('images').length > 0) {
                    coverType = 'singleCover';
                }

                return {
                    'getCellDisplayType': function() {
                        if (coverType === 'singleCover' ) {
                            return 'small';
                        } else if (coverType === 'noCover') {
                            return 'textonly';
                        } 
                    },
                    'getCoverType': function() {
                        return coverType;
                    },
                    'getCoverHtml': function() {
                        var outStr = '';
                        var imageWidth, imageHeight, img, outHeight;
                        var type = this.metadata.type;
                        var i = 0;
                        imageHeight = Math.round(windowWidth*0.618);
                        if (this.images && this.images.length > 0) {
                            outStr += '<div class="coverImage" style="height:' + imageHeight + 'px"><img src="' + this.images[0].url + '"></div>';
                        }
                        return outStr;
                    }
                };
            },
            className: 'cell rankCell'
        });
    });