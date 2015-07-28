define(['marionette', 'mustache', 'jquery', 'text!modules/reader/cell.html', 'modules/reader/articleshellview'],
    function(Marionette, Mustache, $, template, ArticleShellView) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {

            },
            events: {
                'tap':'onTap'
            },
            initialize: function() {


            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);
                return {
                    'getCoverType':function() {

                        if(this.images&&this.images.length>0) {
                            //has cover
                            if(this.images.length>1) {
                                return 'multiCover';
                            } else {
                                return 'sigleCover';
                            }
                        } else {
                            return 'noCover';
                        }

                    },
                    'getCoverHtml':function() {

                        var outStr = '';
                        if ( this.images && this.images.length > 0) {

                            var imageWidth = Math.floor(windowWidth / this.images.length);
                            var imageHeight = maxHeight;

                            for (var i = 0;i < this.images.length;i++) {
                                var img = this.images[i];
                                var outHeight = Math.floor(imageWidth / img.width * img.height);
                                imageHeight = Math.min(outHeight,imageHeight);
                            }

                            for (i = 0;i < this.images.length;i++) {
                                outStr+= '<div class="coverImage" style="width:' + imageWidth +'px;height:' + imageHeight + 'px"><img src="' + this.images[i].url + '"></div>';
                            }

                        }
                        return outStr;

                    }
                };
            },
            onShow: function() {

            },
            onTap: function(ev) {
                console.log('here');
                new ArticleShellView({model:this.model});
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cellWrapper'
        });
    });