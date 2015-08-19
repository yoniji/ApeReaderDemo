define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productlibrary.html', 'modules/reader/productlibrarymodel', 'carousel', 'iscroll'],
    function(Marionette, Mustache, $, template, ProductLibraryModel, Carousel) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap .tabItem': 'onTapTab'
            },
            initialize: function() {
                this.model = new ProductLibraryModel();
                app.rootView.updatePrimaryRegion(this);
            },
            onShow: function() {
                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();

                var productList = this.$el.find('.productItem');
                var productListWidth = ( productList.width() + 5 ) * productList.size();
                this.$el.find('.horizontalProductListInner').width(productListWidth + 'px');

                this.scroller = new IScroll(this.$el.find('.horizontalProductList')[0], {
                    'scrollX':true,
                    'scrollY':false
                });
            },
            templateHelpers: function() {
                var windowWidth = $(window).width();
                var slideHeight = Math.round(windowWidth  * 0.667);

                return {
                    getSlideHeight: function() {
                        return slideHeight;
                    },
                    getSlideSmallWidth: function() {
                        return windowWidth - slideHeight;
                    },
                    getLargeSlideImgStr: function() {
                        return '@' + 3*slideHeight + 'h_'+ 3*slideHeight + 'w_1e_1c';
                    },
                    getSmallSlideImgStyle: function() {
                        var imgSize = slideHeight*2;
                        var containerWidth = windowWidth - slideHeight;
                        var left = Math.round((containerWidth - imgSize)/2);
                        var top = Math.round((slideHeight - imgSize)/2);
                        return 'position:absolute;width:' + imgSize + 'px;height:' + imgSize + 'px;left:' + left + 'px;top:' + top +  'px';
                    }
                };
            },
            onTapTab: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var target = $(ev.currentTarget);
                rel = target.attr('rel');
                

                if ( rel ) {
                    this.$el.find('.pane.current').removeClass('current');
                    $('#'+rel).addClass('current');

                    this.$el.find('.tabItem.current').removeClass('current');
                    target.addClass('current');
                }
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
            },
            id: 'productLibrary',
            className: 'rootWrapper'
        });
    });