define(['marionette', 'mustache', 'jquery', 'text!modules/reader/product.html', 'modules/reader/productmodel', 'modules/reader/moretextview', 'modules/reader/designinfoview','modules/reader/shareview', 'carousel', 'iscroll'],
    function(Marionette, Mustache, $, template, ProductModel, MoreTextView, DesignInfoView,ShareView, Carousel) {

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
            initialize: function(options) {
                if (options) {
                    this.delay = !!options.delay;
                }

                if (this.model && !this.model.isNew()) {
                    this.originalRouter = window.location.hash;
                    this.onModelSync();
                } else {
                    this.model = new ProductModel();
                    this.model.set('id', options.id);
                    /*this.model.fetch({
                        'data': options.id
                    });
                    */
                    this.originalRouter = 'products';
                    this.onModelSync();
                }

                app.appRouter.navigate('products/' + this.model.get('id'), {
                    trigger: false
                });

            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
                var windowWidth = $(window).width();
                var brandIconSize = 36;
                var gridSize = Math.floor(($(window).width() - 32 - 8) / 3);
                var avatarSize = 64;

                return {
                    'getBannerSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(windowWidth * ratio) + 'w_' + Math.round(windowWidth * ratio) + 'h_1e_1c';
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
                    }
                };
            },
            onModelSync: function() {
                this.render();

                this.originalShare = _.clone(appConfig.share_info);
                var share_info = appConfig.share_info;
                share_info.timeline_title = '204 SCIGHERA, 卡西那 | 大师系列, 客厅和书房 沙发 约¥3.2万 - ¥3.8万 ' + '「悟空家装」';
                share_info.message_title = '204 SCIGHERA, 卡西那 | 大师系列' + '「悟空家装」';
                share_info.message_description = '客厅和书房 沙发 约¥3.2万 - ¥3.8万';

                var url = util.getUrlWithoutHashAndSearch();
                url = url + '?hash=' + encodeURIComponent('#products/3');
                share_info.link =url;

                share_info.image = {
                    url: 'http://imgopt.apecrafts.com/products/test-product-3.jpg@180w_180h_1e_1c',
                    type:'oss'
                };

                this.shareInfo = share_info;

                util.setWechatShare(share_info, null ,null);
            },
            onRender: function() {
                if (this.delay) {
                    this.$el.addClass('delayShow');
                    var self = this;
                    var to = setTimeout(function() {
                        self.$el.removeClass('delayShow');
                        clearTimeout(to);
                    }, 800);
                }
                $('.rootWrapper').addClass('moveLeftTransition');
                $('.rootWrapper').addClass('moveLeft');

                $('body').append(this.$el);

                this.$el.focus();

                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();


                var productList = this.$el.find('.horizontalProductListInner .productItem');
                var productListWidth = (productList.width() + 5) * productList.size();
                this.$el.find('.horizontalProductListInner').width(productListWidth + 'px');
                
                this.scroller = new IScroll(this.$el.find('.horizontalProductList')[0], {
                    'scrollX': true,
                    'scrollY': false,
                    'bindToWrapper':true,
                    'snap':true,
                    'eventPassthrough':true
                });


                 var productHeight = $(window).height() - this.ui.toolBar.height();
                 this.ui.product.height(productHeight);


            },
            onTapReadMoreDesc: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapReadMoreDescOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: 'Il sistema di sedute si compone di divano a due posti, elementi componibili angolari e terminali singoli o a due o tre posti (lato sinistro e destro), chaise longue componibili (lato sinistro o destro), cuscini opzionali.Le sedute sono caratterizzate da braccioli di dimensioni generose e da poggiatesta ribaltabile; il meccanismo di movimento consente differenti posizioni per un ottimale livello di comfort.'});
            },
            onTapReadMoreBrand: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapReadMoreBrandOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: 'Il sistema di sedute si compone di divano a due posti, elementi componibili angolari e terminali singoli o a due o tre posti (lato sinistro e destro), chaise longue componibili (lato sinistro o destro), cuscini opzionali.Le sedute sono caratterizzate da braccioli di dimensioni generose e da poggiatesta ribaltabile; il meccanismo di movimento consente differenti posizioni per un ottimale livello di comfort.'});
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
                $('.rootWrapper').removeClass('moveLeftTransition').addClass('moveBackTransition');
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