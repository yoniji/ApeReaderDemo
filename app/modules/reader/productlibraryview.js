define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productlibrary.html', 'modules/reader/productlibrarymodel', 'carousel'],
    function(Marionette, Mustache, $, template, ProductLibraryModel, Carousel) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {
                this.model = new ProductLibraryModel();
                app.rootView.updatePrimaryRegion(this);
            },
            onShow: function() {
                this.carousel = new Carousel(this.$el.find('.carousel'));
                this.carousel.init();
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
            id: 'productLibrary',
            className: 'rootWrapper'
        });
    });