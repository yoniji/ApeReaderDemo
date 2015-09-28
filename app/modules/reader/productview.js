define(['marionette', 'underscore', 'mustache', 'jquery', 'text!modules/reader/product.html', 'modules/reader/productmodel', 'modules/reader/moretextview', 'modules/reader/designinfoview','modules/reader/shareview', 'carousel', 'iscroll'],
    function(Marionette, _,  Mustache, $, template, ProductModel, MoreTextView, DesignInfoView,ShareView, Carousel) {

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
                'tap .productItem': 'onTapProduct',
                'tap .productGallarySlide': 'onTapGallary',
                'tap .productGallary .gridThumb': 'onTapGallary',
                'tap .moreAlternatives': 'onTapMoreAlternatives',
                'touchmove':'onTouchMove'
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

                var allImages = this.model.getAllImagesArray();

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
                        if ( allImages && allImages > 0) {
                           return allImages.slice(0, 4);
                        }
                    },
                    'getThumbs': function(argument) {
                        if ( allImages && allImages > 4) {
                           return allImages.slice(4);
                        }
                    }
                };
            },
            onModelSync: function() {
                this.model.set('isSynced',true);
                //render again
                this.render();

                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();


                var productList = this.$el.find('.horizontalProductListInner .productItem');
                var productListWidth = (productList.width() + 5) * productList.size();
                this.$el.find('.horizontalProductListInner').width(productListWidth + 'px');
                
                 var productHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.product.css('height', productHeight);


                this.scroller = new IScroll(this.$el.find('.horizontalProductList')[0], {
                    'scrollX': true,
                    'scrollY': false,
                    'bindToWrapper':true,
                    'snap':true,
                    'eventPassthrough':true
                });

                //init share info
                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;
                share_info.timeline_title =  this.model.get('title') + ', ' + this.model.get('brand').name +' | ' + this.model.get('collection').name + ' ' + this.model.get('room').name + ' ' + this.model.get('type').name + '「悟空家装」';
                share_info.message_title = this.model.get('title') + ', ' + this.model.get('brand').name +' | ' + this.model.get('collection').name + '「悟空家装」';
                share_info.message_description = this.model.get('room').name + ' ' + this.model.get('type').name;

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#products/' + this.model.get('id'));
                share_info.link =url;

                share_info.image = {
                    url: this.model.get('display_image').url + '@180w_180h_1e_1c',
                    type:'oss'
                };

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null ,null);
                 


            },
            onTapReadMoreDesc: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: this.model.get('description')});
            },
            onTapReadMoreDescOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: this.model.get('original_description')});
            },
            onTapReadMoreBrand: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: this.model.get('brand').description });
            },
            onTapReadMoreBrandOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: this.model.get('brand').original_description });
            },
            onTapDesignInfo: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new DesignInfoView({ model:this.model });
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
            onTapProduct: function(ev) {
                var randomId = Math.round(Math.random() * 100);
                Backbone.history.navigate('#products/'+randomId, {
                    trigger: true
                });
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

                util.previewImages([
                    'http://imgopt.apecrafts.com/products/test-product-3.jpg',
                    'http://imgopt.apecrafts.com/products/test-product-5.jpg',
                    'http://imgopt.apecrafts.com/products/test-product-6.jpg',
                    'http://imgopt.apecrafts.com/products/test-product-7.jpg',
                    'http://imgopt.apecrafts.com/products/test-product-8.jpg'
                ], current);
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
                    if(self.outTimer) clearTimeout(self.outTimer);
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
                this.stopListening();
                this.$el.remove();

                if (this.originalShare) window.appConfig.share_info = _.clone(this.originalShare);
                util.setWechatShare(window.appConfig.share_info);
            },
            className: 'productWrapper'
        });
    });