define(['marionette', 'mustache', 'jquery', 'text!modules/reader/product.html', 'modules/reader/productmodel', 'carousel', 'iscroll'],
    function(Marionette, Mustache, $, template, ProductModel, Carousel) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'toolBar': '.toolBar',
                'back': '.toolBar-back',
                'product': '.product'
            },
            events: {
                'tap @ui.back': 'onTapBack',
                'tap .toolBar-like': 'onToggleLike',
                'tap .toolBar-share': 'onTapShare',
                'tap .toolBar-next': 'onTapNext'
            },
            modelEvents: {
                'sync': 'onModelSync'
            },
            initialize: function(options) {
                if (this.model && !this.model.isNew()) {
                    this.onModelSync();
                } else {
                    this.model = new ProductModel();
                    this.model.set('id', options.id);
                    /*this.model.fetch({
                        'data': options.id
                    });
                    */
                    this.onModelSync();
                }

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
            },
            onRender: function() {
                $('body').append(this.$el);

               

                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();


                var productList = this.$el.find('.horizontalProductListInner .productItem');
                var productListWidth = (productList.width() + 5) * productList.size();
                this.$el.find('.horizontalProductListInner').width(productListWidth + 'px');
                
                this.scroller = new IScroll(this.$el.find('.horizontalProductList')[0], {
                    'scrollX': true,
                    'scrollY': false,
                    'bindToWrapper':true
                });


                 var productHeight = $(window).height() - this.ui.toolBar.height();
                 this.ui.product.height(productHeight);
            },
            onTapBack: function() {
                this.destroy();
            },
            onToggleLike: function() {
                this.model.like();
            },
            onTapShare: function() {
                this.model.share();
            },
            onTapNext: function() {

            },
            onShow: function() {

            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'productWrapper'
        });
    });