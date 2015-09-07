define(['marionette', 'mustache', 'jquery', 'text!modules/reader/product.html', 'modules/reader/productmodel', 'modules/reader/moretextview', 'modules/reader/designinfoview', 'carousel', 'iscroll'],
    function(Marionette, Mustache, $, template, ProductModel, MoreTextView, DesignInfoView, Carousel) {

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
                'tap .readMoreDescription': 'onTapReadMoreDesc',
                'tap .readMoreDescriptionOriginal': 'onTapReadMoreDescOriginal',
                'tap .readMoreBrand': 'onTapReadMoreBrand',
                'tap .readMoreBrandOriginal': 'onTapReadMoreBrandOriginal',
                'tap .readMoreDesignInfo': 'onTapDesignInfo',
                'touchmove':'onTouchMove'
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

                this.$el.focus();

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
            onTapReadMoreDesc: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapReadMoreDescOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapReadMoreBrand: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapReadMoreBrandOriginal: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new MoreTextView({ content: '座椅系列包括两人位沙发、模块化角落单元、单人位或双人位单元，模块化躺椅和可选的坐垫。 座椅有大尺寸的扶手和可折叠的头枕，座椅的可移动性可用于不同位置，确保了超级舒适度。 折叠起来时，头枕与扶手齐平，从而强调了简约设计的线性性质。 超级品质的罗缎针脚，四色可选：米黄色、烟草色、咖啡色和灰色。 座椅框架采用弹性绷带。 坐垫、头枕和扶手使用不同密度的聚氨酯海绵和羽绒棉填充。 使用布艺面料或皮革进行可拆卸的软包。 金属光泽或哑光金属珐琅底座，两种颜色：煤灰色或栗褐色。 该系列搭配众多大理石或玻璃桌面的方形、椭圆形或长方形靠墙的桌子。'});
            },
            onTapDesignInfo: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                new DesignInfoView({ model:this.model });
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
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                if (this.carousel) this.carousel.destroy();
                this.stopListening();
                this.$el.remove();
            },
            className: 'productWrapper'
        });
    });