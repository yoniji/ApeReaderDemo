define(['marionette', 'mustache', 'jquery', 'text!modules/reader/productitem.html', 'modules/reader/productview', 'waves' ],
    function(Marionette, Mustache, $, template, ProductView, Waves) {

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
            initialize: function() {


            },
            onRender: function() {
                Waves.attach(this.$el[0],['waves-block']);
            },
            onTap: function(ev) {
                var productView = new ProductView({
                    'id': 3,
                    'delay':true
                });
            },
            modelEvents: {
                'change': 'render'
            },
            className: 'productItem'
        });
    });