define(['marionette', 
    'underscore', 
    'mustache', 
    'jquery', 
    'text!templates/product_detail.html', 
    'scripts/product/product_model', 
    'scripts/product/ctrl_more_info_view', 
    'scripts/product/design_info_view', 
    'scripts/common/share_view', 
    'scripts/product/ctrl_product_list_view', 
    'carousel',
    'hammerjs',
    'jquery-hammerjs',
    'iscroll'],
    function(
        Marionette, 
        _, 
        Mustache, 
        $, 
        template, 
        ProductModel, 
        MoreTextView, 
        DesignInfoView, 
        ShareView, 
        CtrlProductListView, 
        Carousel,
        Hammer
    ) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'toolBar': '.toolBar',
                'back': '.toolBar-back',
                'like': '.toolBar-like',
                'share': '.toolBar-share',
                'brand': '.toolBar-brand',
                'product': '.product'
            },
            events: {
                'tap @ui.back': 'onTapBack',
                'tap .toolBar-like': 'onToggleLike',
                'tap .toolBar-share': 'onTapShare',
                'tap .toolBar-brand': 'onTapBrand',
                'tap .readMoreDescription': 'onTapReadMoreDesc',
                'tap .readMoreDescriptionOriginal': 'onTapReadMoreDescOriginal',
                'tap .readMoreBrand': 'onTapReadMoreBrand',
                'tap .readMoreBrandOriginal': 'onTapReadMoreBrandOriginal',
                'tap .readMoreDesignInfo': 'onTapDesignInfo',
                'tap .productGallarySlide': 'onTapGallary',
                'tap .productGallary .gridThumb': 'onTapGallary',
                'tap .moreAlternatives': 'onTapMoreAlternatives',
                'touchmove': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'onModelSync'
            },
            placeholder: {

            },
            initialize: function(options) {
                if (options) {
                    this.delay = !!options.delay;
                    this.placeholder = options.placeholder;
                }


                this.model = new ProductModel();

                this.model.set({
                    'id': options.id,
                    'isSynced': false,
                    'placeholder': this.placeholder
                });

                this.render();

                if (this.delay) {
                    this.$el.addClass('delayShow');
                    var self = this;
                    var to = setTimeout(function() {
                        self.$el.removeClass('delayShow');
                        clearTimeout(to);
                    }, 800);
                }

                $('.rootWrapper').last().removeClass('moveBackTransition').addClass('moveLeftTransition');
                $('.rootWrapper').last().addClass('moveLeft');

                var productHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.product.css('height', productHeight);

                $('body').append(this.$el);
                this.$el.focus();


                this.originalRouter = window.location.hash;

                app.appRouter.navigate('products/' + this.model.get('id'), {
                    trigger: false
                });

                this.model.fetch({
                    data: {
                        'id': this.model.get('id')
                    }
                });


            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
                var windowWidth = $(window).width();
                var brandIconSize = 36;
                var gridSize = Math.floor(($(window).width() - 32 - 8) / 3);
                var avatarSize = 64;
                var listThumbSize = 72;
                var horizontalProductListThumbSize = 140;

                var images = this.model.get('images');
                var slideImages = [];
                if (images) {
                    slideImages = images.design_images
                    .concat( images.basic_images )
                    .concat( images.detail_images )
                    .slice(0, 4);
                }

                return {
                    'getBannerSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(windowWidth * ratio) + 'w_' + Math.round(windowWidth * ratio) + 'h_1e_1c_1pr';
                        return outStr;
                    },
                    'getBannerSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + windowWidth + 'px;height:' + windowWidth + 'px;';
                        return outStr;
                    },
                    'getBrandSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(brandIconSize * ratio) + 'w_' + Math.round(brandIconSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getBrandSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + brandIconSize + 'px;height:' + brandIconSize + 'px;';
                        return outStr;
                    },
                    'getGridSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(gridSize * ratio) + 'w_' + Math.round(gridSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getListThumbSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(listThumbSize * ratio) + 'w_' + Math.round(listThumbSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getHorizontalThumbSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(horizontalProductListThumbSize * ratio) + 'w_' + Math.round(horizontalProductListThumbSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getGridSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + gridSize + 'px;height:' + gridSize + 'px;';
                        return outStr;
                    },
                    'getAvatarSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(avatarSize * ratio) + 'w_' + Math.round(avatarSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getAvatarSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + avatarSize + 'px;height:' + avatarSize + 'px;';
                        return outStr;
                    },
                    'getSlidesImages': function() {
                        return slideImages;
                    },
                    'getThumbs': function() {
                        var thumbs = [];
                        var length = 0;
                        if (this.allImages && this.allImages.length > slideImages.length) {
                            thumbs = this.allImages.slice(slideImages.length);
                            //缩略图数量必须为3的倍数，不大于9
                            length = 3 * Math.floor(thumbs.length / 3);
                            length = Math.min(9, length);
                            if ( length === 0 ) length  = thumbs.length;

                            thumbs = thumbs.slice(0, length);
                            thumbs[length - 1].isLast = true;
                            thumbs[length - 1].imagesCount = this.allImages.length;

                        }
                        return thumbs;
                    },
                    'isThumbsVisible': function() {
                        return this.allImages && this.allImages.length > 4;
                    },
                    'getProductDivImageHtml': function() {

                        var result = '';

                        if (this.allImages.length > 0) {
                            var image = this.allImages[0].url;
                            var imageWidth = windowWidth * ratio;
                            var imageHeight = 120 * ratio;
                            var suffix = '@' + imageWidth + 'w_' + imageHeight + 'h_1e_1c';
                            result = '<img src="' + image + suffix + '">';
                        }

                        return result;
                    },
                    'isDesignerVisible': function() {
                        if ( !this.designer || this.designer.length < 1) {
                            return false;
                        }
                        if (this.designer[0].id === 0) {
                            return false;
                        }
                        return true;
                    },
                    'getFirstDesigner': function() {
                        return this.designer[0];
                    },
                    'getYearOfDesignCode': function() {
                        if (this.year_of_design < 1) {
                            return '00s';
                        }

                        if (this.year_of_design < 1930) {
                            return '20s';
                        }

                        if (this.year_of_design < 1950) {
                            return '30s40s';
                        }

                        if (this.year_of_design < 1960) {
                            return '50s';
                        }

                        if (this.year_of_design < 1970) {
                            return '60s';
                        }

                        if (this.year_of_design < 1980) {
                            return '70s';
                        }

                        if (this.year_of_design < 1990) {
                            return '80s';
                        }

                        return '00s';

                    },
                    'getBrandOriginalName': function() {
                        if (this.brand && (this.brand.name != this.brand.original_name) ) {
                            return '(' + this.brand.original_name + ')';
                        }
                    },
                    'getShortDescription': function() {
                        if (this.description && this.description.length > 64) {
                            return this.description.substr(0,64) + '...';
                        } else {
                            return this.description;
                        }
                    },
                    'isMoreDescriptionVisible': function() {
                        return this.description && this.description.length > 64;
                    }
                };
            },
            onModelSync: function() {
                this.model.set('isSynced', true);
                //render again
                this.render();

                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();

                var productHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.product.css('height', productHeight);


                var collectionFilter = {
                    limit:10,
                    sample:4
                };
                if ( this.model.has('collection') && this.model.get('collection').id ) {
                    collectionFilter.collection = this.model.get('collection').id;
                } else {
                    collectionFilter.brand = this.model.get('brand').id;
                }

                this.productsInSameCollection = new CtrlProductListView({
                    filterJSON: collectionFilter,
                    container: this.$el.find('.horizontalProductListInner'),
                    withoutId: this.model.get('id')
                });

                this.productOfSameType = new CtrlProductListView({
                    filterJSON: {
                        type: this.model.get('product_type').id,
                        limit: 10,
                        sample: 4
                    },
                    container: this.$el.find('.productAlternatives .product-list'),
                    type: 'vertical',
                    withoutId: this.model.get('id')
                });


                //init share info
                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;

                var metaString = "";
                if (this.model.has('brand') && this.model.get('brand').name) {
                    metaString += this.model.get('brand').name;
                }

                if (this.model.has('collection') && this.model.get('collection').name) {
                    metaString += ' | ' + this.model.get('collection').name;
                }

                if (this.model.has('product_type') && this.model.get('product_type').name) {
                    metaString += ' ' + this.model.get('product_type').name;
                }

                if (this.model.has('room') && this.model.get('room').name) {
                    metaString += ' ' + this.model.get('room').name;
                }

                share_info.timeline_title = this.model.get('name') + ', ' + metaString + '「悟空家装」';
                share_info.message_title = this.model.get('name') + ' 「悟空家装」';
                share_info.message_description = metaString;

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#products/' + this.model.get('id'));
                share_info.link = url;

                share_info.image = {
                    url: this.model.get('display_image').url + '@180w_180h_1e_1c',
                    type: 'oss'
                };

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null, null);


                this.$el.find('.tapEnable').each(function(index, el) {
                    $(el).hammer({ recognizers:[[Hammer.Tap]]});
                });

            },
            onTapReadMoreDesc: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({
                    content: this.model.get('description')
                });
            },
            onTapReadMoreDescOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({
                    content: this.model.get('original_description')
                });
            },
            onTapReadMoreBrand: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({
                    content: this.model.get('brand').description
                });
            },
            onTapReadMoreBrandOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({
                    content: this.model.get('brand').original_description
                });
            },
            onTapDesignInfo: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new DesignInfoView({
                    model: this.model
                });
            },
            onTapBack: function() {
                this.slideOut();
            },
            onTapShare: function() {
                //this.model.markShare();
                var shareView = new ShareView({
                    shareInfo: this.shareInfo,
                });
                util.trackEvent('Share', 'Product', 1);
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onToggleLike: function() {
                //util.setIconToLoading(this.ui.like.find('.icon'));
                //this.model.toggleLike();

                this.onToggleLikeSuccess();
            },
            onToggleLikeSuccess: function() {
                if (this.ui.like.find('.icon').hasClass('icon-heart2')) {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart3 main-color');
                    util.trackEvent('Like', 'Product', 1);
                } else {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart2');
                    util.trackEvent('Dislike', 'Product', 1);
                }
            },
            onTapGallary: function(ev) {

                var current = $(ev.currentTarget).find('img').attr('originalsrc');
                if (!current) current = '';

                var images = _.pluck(this.model.get('allImages'), 'url');
                util.previewImages(images, '');
            },
            onTapMoreAlternatives: function(ev) {
                this.slideOut();
            },
            onTapBrand: function(ev) {
                this.slideOut();
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOut');
                this.outTimer = setTimeout(function() {
                    if (self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 500);

                app.appRouter.navigate(this.originalRouter, {
                    trigger: false,
                    replace: false
                });
                $('.rootWrapper').last().removeClass('moveLeftTransition').addClass('moveBackTransition');
                $('.rootWrapper').last().focus().removeClass('moveLeft');

                util.trackEvent('Close', 'Product', 1);
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                if (this.carousel) this.carousel.destroy();

                this.$el.find('.tapEnable').each(function(index, el){
                    $(el).destroyHammer();
                });

                this.stopListening();
                this.$el.remove();

                if (this.originalShare) window.appConfig.share_info = _.clone(this.originalShare);
                util.setWechatShare(window.appConfig.share_info);
            },
            className: 'productWrapper'
        });
    });