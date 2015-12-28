define([
    'marionette', 
    'mustache', 
    'jquery', 
    'text!modules/reader/productitem.html', 
    'modules/reader/productview', 
    'waves',
    'hammerjs',
    'jquery-hammerjs' ],
    function(Marionette, 
        Mustache, 
        $, 
        template, 
        ProductView, 
        Waves,
        Hammer) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            events: {
                'tap': 'onTap'
            },
            templateHelpers: function() {
                var windowWidth = $(window).width();
                var width = windowWidth/2;
                var ratio = util.getDeviceRatio();
                var imgWidth = Math.round(width * ratio);
                return {
                    getHeightCss: function() {
                        var outStr = '';
                        outStr += 'height:' + width + 'px;';
                        return outStr;
                    },
                    getImageSuffix: function() {
                        var outStr = '';
                        outStr += '@' + imgWidth + 'w_' + imgWidth + 'h_1e_1c';
                        return outStr;
                    },
                    getImageSizeCss: function() {
                        var outStr = '';
                        outStr += 'width:' + width + 'px;height:' + width + 'px;';
                        return outStr;
                    }
                };
            },
            onRender: function() {
                this.$el.hammer({ recognizers:[[Hammer.Tap]]});
            },
            onDestroy: function() {
                this.$el.destroyHammer();
            },
            onTap: function(ev) {
                Waves.ripple(this.$el[0]);
                var productView = new ProductView({
                    'id': this.model.get('id'),
                    'delay':true,
                    'placeholder': {
                        'display_image': this.model.get('display_image'),
                        'name': this.model.get('name')
                    }
                });
            },
            modelEvents: {
                'change': 'render'
            },
            className: 'productItem  waves-effect'
        });
    });