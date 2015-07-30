define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/card.html'],
    function(Marionette, Mustache, $,CellView, template) {

        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var containerWidth = Math.round(windowWidth * 0.48);
                var containerHeight = Math.round(windowWidth * 0.382);
                return {
                    'getCoverHtml':function() {
                        var outStr = '';
                        if(this.images&&this.images.length>0) {
                            var img = this.images[0];
                            var imageWidth = containerWidth,
                            imageHeight = Math.round(img.height * containerWidth/img.width);

                            if(imageHeight < containerHeight) {
                                imageHeight = containerHeight;
                                imageWidth = Math.round(img.width * imageHeight/img.height);
                            }

                            var left = Math.round( (containerWidth - imageWidth) / 2 );
                            var top = Math.round( (containerHeight - imageHeight) / 2 );

                            outStr+= '<div class="coverImage" style="width:100%;height:' + containerHeight + 'px"><img style="width:' + imageWidth + 'px;height:' + imageHeight + 'px;left:' + left + 'px;top:' + top + 'px" src="' + this.images[0].url + '"></div>';
                        }
                        return outStr;

                    }
                };
            },
            className: 'cellWrapper cardWrapper'
        });
    });