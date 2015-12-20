define(['marionette','backbone', 'underscore', 'mustache', 'jquery', 'text!modules/reader/ctrlfeatureslides.html', 
    'carousel', 'modules/reader/brandmodel', 'modules/reader/productsearchmodel'],
    function(Marionette, Backbone,  _, Mustache, $, template, 
        Carousel, BrandSearchModel, ProductSearchModel) {


        var data = { 'slides': []};

        return Marionette.ItemView.extend({
            template: function(serialized_model) {

                return Mustache.render(template, serialized_model);
            },
            initialize: function(options) {
                if (options && options.container) {
                    this.$el = options.container;
                }
                this.brands = new BrandSearchModel();
                this.products = new ProductSearchModel();

                this.listenToOnce(this.brands, 'sync', this.onBrandsSync);
                this.listenToOnce(this.products, 'sync', this.onProductsSync);

                this.brands.search({
                    page:1,limit:10
                });
                this.products.search({
                    page:1,limit:10
                });


            },
            templateHelpers: function() {
                var windowWidth = $(window).width();
                var slideHeight = Math.round(windowWidth * 0.667);

                return {
                    getSlideHeight: function() {
                        return slideHeight;
                    },
                    getSlideSmallWidth: function() {
                        return windowWidth - slideHeight;
                    },
                    getLargeSlideImgStr: function() {
                        return '@' + 3 * slideHeight + 'h_' + 3 * slideHeight + 'w_1e_1c';
                    },
                    getSmallSlideImgStyle: function() {
                        var imgSize = slideHeight * 2;
                        var containerWidth = windowWidth - slideHeight;
                        var left = Math.round((containerWidth - imgSize) / 2);
                        var top = Math.round((slideHeight - imgSize) / 2);
                        return 'position:absolute;width:' + imgSize + 'px;height:' + imgSize + 'px;left:' + left + 'px;top:' + top + 'px';
                    },
                    isBrand: function() {
                        return !!this.logo;
                    },
                    isProduct: function() {
                        return !this.logo;
                    }
                };
            },
            onBrandsSync: function() {
                data.slides = data.slides.concat( _.sample(this.brands.toJSON().brands, 2) );

                if ( this.isSynced) {
                    this.model = new Backbone.Model(data);
                    this.render();
                } else {
                    this.isSynced = true;
                }
                
                
            },
            onProductsSync: function() {
                data.slides = data.slides.concat( _.sample(this.products.toJSON().products, 2) );
                
                if ( this.isSynced) {
                    this.model = new Backbone.Model(data);
                    this.render();
                } else {
                    this.isSynced = true;
                }
            },
            onRender: function() {
                 //初始化顶部幻灯片
                this.carousel = new Carousel(this.$el.parent());
                this.carousel.init();
            },
            onDestroy: function() {
                if (this.carousel) this.carousel.destroy();
            }
        });
    });