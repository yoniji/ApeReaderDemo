define(['marionette', 'mustache', 'jquery', 'text!modules/reader/selectbrand.html', 'modules/reader/brandmodel'],
    function(Marionette, Mustache, $, template, Brand) {
        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap .brand-close': 'onTapClose',
                'tap .brandItem': 'onTapBrand',
                'tap': 'onTapClose',
                'touchmove': 'onTouchMove'
            },
            modelEvents: {
                'sync': 'render'
            },
            initialize: function(options) {
                if (options&&options.selectedBrand) {
                    this.model = new Brand({ selectedBrand: options.selectedBrand});
                } else {
                    this.model = new Brand();
                }
                this.model.search();
                
                this.render();
                $('body').append(this.$el);
            },
            onRender: function() {
                
            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
                var imgWidth = 40 * ratio;
                return {
                    getImageSuffix: function() {
                        var outStr = '';
                        outStr += '@' + imgWidth + 'w_' + imgWidth + 'h_1e_1c';
                        return outStr;
                    }
                };
            },
            onTapBrand: function(ev) {
                var id = $(ev.currentTarget).attr('data-id');
                var brandData = this.model.getBrandById(id);
                this.trigger('selected', brandData);
                //select this brand
                this.$el.find('.selected').removeClass('selected');
                $(ev.currentTarget).addClass('selected');

                this.onTapClose(ev);
            },
            onTapClose: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.onDestroy();
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                this.$el.remove();
                this.model.destroy();
            },
            className: 'brandWrapperOverlay overlay'
        });
    });