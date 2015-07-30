define(['marionette', 'mustache', 'jquery', 'text!modules/reader/cell.html', 'modules/reader/articleshellview'],
    function(Marionette, Mustache, $, template, ArticleShellView) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {

            },
            events: {
                'tap': 'onTap'
            },
            initialize: function() {


            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);
                return {
                    'getCoverType': function() {

                        if (this.images && this.images.length > 0) {
                            //has cover
                            if (this.images.length > 1) {
                                return 'multiCover';
                            } else {
                                return 'sigleCover';
                            }
                        } else {
                            return 'noCover';
                        }

                    },
                    'getCoverHtml': function() {

                        var outStr = '';
                        if (this.images && this.images.length > 0) {

                            var imageWidth = Math.floor(windowWidth / this.images.length);
                            var imageHeight = maxHeight;

                            for (var i = 0; i < this.images.length; i++) {
                                var img = this.images[i];
                                var outHeight = Math.floor(imageWidth / img.width * img.height);
                                imageHeight = Math.min(outHeight, imageHeight);
                            }

                            for (i = 0; i < this.images.length; i++) {
                                outStr += '<div class="coverImage" style="width:' + imageWidth + 'px;height:' + imageHeight + 'px"><img src="' + this.images[i].url + '"></div>';
                            }

                        }
                        return outStr;

                    },
                    'getRecommendReasonHtml': function() {
                        var outStr = '';
                        var i = 0;
                        if (this.recommend_reason && this.recommend_reason.type) {
                            switch (this.recommend_reason.type) {
                                case 'tag':
                                    outStr += '<i class="icon icon-tag"></i>';
                                    for (i = 0; i < this.recommend_reason.relate_tags.length; i++) {
                                        outStr += ' ' + this.recommend_reason.relate_tags[i].name;
                                        if (i !== this.recommend_reason.relate_tags.length - 1) outStr += ',';
                                    }
                                    break;
                                case 'friend':
                                    outStr += '<i class="icon icon-heart2"></i> ';
                                    for (i = 0; i < this.recommend_reason.relate_friends.length; i++) {
                                        if (i === 1) outStr += ',';
                                        if (i === 2) {
                                            outStr += '等人';
                                            break;
                                        }
                                        outStr += ' ' + this.recommend_reason.relate_friends[i].name;
                                    }
                                    
                                    break;
                                default:
                                    break;
                            }
                        }
                        return outStr;
                    }
                };
            },
            onShow: function() {

            },
            onTap: function(ev) {
                new ArticleShellView({
                    model: this.model
                });
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cellWrapper'
        });
    });