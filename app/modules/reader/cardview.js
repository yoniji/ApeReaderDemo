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


                            var newSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                {width: containerWidth, height:containerHeight},
                                {width: img.width, height:img.height}
                            );
                            

                            

                            outStr+= '<div class="coverImage" style="width:100%;height:' + containerHeight + 'px"><img style="width:' + newSize.width + 'px;height:' + newSize.height + 'px;left:' + newSize.left + 'px;top:' + newSize.top + 'px" src="' + this.images[0].url + '"></div>';
                        }
                        return outStr;

                    }
                };
            },
            className: 'cellWrapper cardWrapper'
        });
    });