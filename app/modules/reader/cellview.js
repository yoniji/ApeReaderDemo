define(['marionette', 'mustache', 'jquery', 'text!modules/reader/cell.html', 'modules/reader/articleview'],
    function(Marionette, Mustache, $, template, ArticleView) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'inner': '.inner'
            },
            events: {
                'tap .more': 'toggleActions',
                'tap': 'onTap',
                'panleft .more': 'showActions',
                'panright': 'hideActions'
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
                    //has cover
                    if (this.model.get('images').length > 1) {
                        if ( (this.model.get('metadata').type === 'article' || this.model.get('metadata').type === 'brand' || this.model.get('metadata').type === 'product') && this.model.get('images').length < 3) {
                            coverType = 'singleCover';
                        } else {
                            coverType =  'multiCover';
                        }
                    } else {
                        coverType = 'singleCover';
                    }
                }

                return {
                    'getCellDisplayType': function() {
                        if (this.metadata.type === 'article'  && coverType === 'singleCover' ) {
                            return 'small';
                        }
                    },
                    'getCoverType': function() {
                        return coverType;
                    },
                    'getCoverHtml': function() {

                        var outStr = '';
                        var windowWidth = $(window).width();
                        var imageWidth, imageHeight, img, outHeight;
                        var type = this.metadata.type;
                        var i = 0;

                        switch (type) {
                            case 'product3':
                                if (this.images && this.images.length > 0) {

                                    imageHeight = maxHeight;
                                    if (this.images.length < 2) {
                                        imageWidth = Math.floor(windowWidth / this.images.length);
                                    } else {
                                        imageWidth = Math.floor(windowWidth * 2 / this.images.length);
                                    }


                                    for (i = 0; i < this.images.length; i++) {
                                        img = this.images[i];
                                        outHeight = Math.floor(imageWidth / img.width * img.height);
                                        imageHeight = Math.min(outHeight, imageHeight);
                                    }

                                    for (i = 0; i < this.images.length; i++) {
                                        outStr += '<div class="coverImage" style="width:' + imageWidth + 'px;height:' + imageHeight + 'px"><img src="' + this.images[i].url + '"></div>';
                                    }


                                }
                                break;
                            case 'product':
                                imageHeight = Math.round(windowWidth*0.618);
                                if (this.images && this.images.length > 0) {
                                    if ( this.images.length > 2) {
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:imageHeight, height:imageHeight},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );
                                        console.log(innerSize);
                                        outStr += '<div class="coverImage" style="width:' + imageHeight + 'px;height:' + imageHeight + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px" src="' + this.images[0].url + '"></div>';
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:Math.round(windowWidth*0.382), height:Math.round(imageHeight*0.618)},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );

                                        outStr += '<div class="coverImage" style="width:' + Math.round(windowWidth*0.382) + 'px;height:' + Math.round(imageHeight*0.618) + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px"  src="' + this.images[1].url + '"></div>';
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:Math.round(windowWidth*0.382), height:Math.round(imageHeight*0.382)},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );
                                        outStr += '<div class="coverImage" style="width:' + Math.round(windowWidth*0.382) + 'px;height:' + Math.round(imageHeight*0.382) + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px"  src="' + this.images[2].url + '"></div>';
                                    } else {
                                        outStr += '<div class="coverImage" style="height:' + imageHeight + 'px"><img src="' + this.images[0].url + '"></div>';
                                    }

                                }
                                break;
                            case 'brand':
                                imageHeight = Math.round(windowWidth*0.618);
                                if (this.images && this.images.length > 0) {
                                    if ( this.images.length > 2) {
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:imageHeight, height:imageHeight},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );
                                        outStr += '<div class="coverImage" style="width:' + imageHeight + 'px;height:' + imageHeight + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px" src="' + this.images[0].url + '"></div>';
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:Math.round(windowWidth*0.382), height:Math.round(imageHeight*0.618)},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );

                                        outStr += '<div class="coverImage" style="width:' + Math.round(windowWidth*0.382) + 'px;height:' + Math.round(imageHeight*0.618) + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px"  src="' + this.images[1].url + '"></div>';
                                        innerSize = util.calculateSizeWithMinimumEdgeAdaptive(
                                            {width:Math.round(windowWidth*0.382), height:Math.round(imageHeight*0.382)},
                                            {width:this.images[0].width,height:this.images[0].height}
                                        );
                                        outStr += '<div class="coverImage" style="width:' + Math.round(windowWidth*0.382) + 'px;height:' + Math.round(imageHeight*0.382) + 'px"><img style="position:absolute;width:' + innerSize.width +'px;height:' + innerSize.height +'px;left:' + innerSize.left +'px;top:' + innerSize.top +'px"  src="' + this.images[2].url + '"></div>';
                                    } else {
                                        outStr += '<div class="coverImage" style="height:' + imageHeight + 'px"><img src="' + this.images[0].url + '"></div>';
                                    }

                                }
                                break;

                            case 'activity':

                                break;
                            default:
                                if (this.images && this.images.length > 0) {

                                    imageHeight = maxHeight;
                                    if (this.images.length < 3) {
                                        outStr += '<div class="coverImage"><img src="' + this.images[0].url + '"></div>';
                                    } else {
                                        imageHeight = Math.round(windowWidth / 3);
                                        imageWidth = '33.333%';

                                        for (i = 0; i < 3; i++) {
                                            outStr += '<div class="coverImage" style="width:' + imageWidth + ';height:' + imageHeight + 'px"><img src="' + this.images[i].url + '"></div>';
                                        }
                                    }

                                }
                                break;


                        }

                        return outStr;

                    },
                    'getRecommendReasonHtml': function() {
                        var outStr = '';
                        var i = 0;
                        var recommend_reason = '';
                        if (this.metadata.following_users && this.metadata.following_users.length > 0) {
                            recommend_reason = 'friend';
                        } else if (this.metadata.feature) {
                            recommend_reason = 'feature';
                        } else if (this.metadata.following_tags && this.metadata.following_tags.length > 0) {
                            recommend_reason = 'tag';
                        }


                        switch (recommend_reason) {
                            case 'tag':
                                outStr += '<i class="icon icon-tag"></i>';
                                for (i = 0; i < this.metadata.following_tags.length; i++) {
                                    outStr += ' ' + this.metadata.following_tags[i].name;
                                    if (i !== this.metadata.following_tags.length - 1) outStr += ',';
                                }
                                break;
                            case 'friend':
                                outStr += '<i class="icon icon-heart2"></i> ';
                                for (i = 0; i < this.metadata.following_users.length; i++) {
                                    if (i === 1) outStr += ',';
                                    if (i === 2) {
                                        outStr += '等人';
                                        break;
                                    }
                                    outStr += ' ' + this.metadata.following_users[i].name;
                                }

                                break;
                            case 'feature':
                                outStr += '<i class="icon icon-lightbulb"></i> ' + this.metadata.feature;
                                break;
                            default:
                                break;
                        }

                        return outStr;
                    }
                };
            },
            onShow: function() {

            },
            toggleActions: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                if (this.isActionsVisible()) {
                    this.hideActions();
                } else {
                    this.showActions();
                }
            },
            onTap: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                if (this.isActionsVisible()) {
                    this.hideActions();
                } else {
                    new ArticleView({
                        model: this.model
                    });
                }

            },
            onPanStart: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                if (this.isActionsVisible()) {
                    this.cellInnerPositionX = -64;
                } else {
                    this.cellInnerPositionX = 0;
                }
                this.$el.siblings().find('.showActions').removeClass('showActions');
            },
            onPanMove: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var deltaX = this.cellInnerPositionX + ev.originalEvent.gesture.deltaX;
                var translateStr = 'translate3d(' + deltaX + 'px,0,0)';
                var innerEl = this.ui.inner[0];
                innerEl.style.transition = 'none';
                innerEl.style.webkitTransition = 'none';
                innerEl.style.transform = translateStr;
                innerEl.style.webkitTransform = translateStr;
            },
            onPanEnd: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var deltaX = ev.originalEvent.gesture.deltaX;
                if (deltaX < 0) {
                    this.showActions();
                }
                if (deltaX > 0) {
                    this.hideActions();
                }

            },
            isActionsVisible: function() {
                return this.ui.inner.hasClass('showActions');
            },
            showActions: function() {
                var innerEl = this.ui.inner[0];
                this.$el.siblings().find('.showActions').removeClass('showActions');
                this.ui.inner.addClass('showActions');
                innerEl.style.transition = '';
                innerEl.style.webkitTransition = '';
                innerEl.style.transform = '';
                innerEl.style.webkitTransform = '';
                this.cellInnerPositionX = -64;
            },
            hideActions: function() {
                var innerEl = this.ui.inner[0];
                innerEl.style.transition = '';
                innerEl.style.webkitTransition = '';
                innerEl.style.transform = '';
                innerEl.style.webkitTransform = '';
                this.ui.inner.removeClass('showActions');
                this.cellInnerPositionX = -0;
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cell'
        });
    });