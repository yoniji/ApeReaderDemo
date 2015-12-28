define(['marionette',
 'underscore', 
 'mustache', 
 'jquery', 
 'text!modules/reader/ctrlbrandlist.html', 
 'modules/reader/brandmodel',
 'hammerjs',
 'jquery-hammerjs'],
    function(Marionette, 
        _, 
        Mustache, 
        $, 
        template, 
        SearchModel,
        Hammer) {


        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            modelEvents: {
                'sync': 'onModelSync'
            },
            initialize: function(options) {

                if (options && options.container) {
                    this.$el = options.container;
                }
                if (options && options.filterJSON) {
                    this.filterJSON = options.filterJSON;
                }

                if (!this.filterJSON) {
                    this.filterJSON = {};
                }

                this.model = new SearchModel();
                this.model.search(this.filterJSON);
                this.render();

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
            onModelSync: function() {
                this.render();
                this.$el.find('.brandItem').each(function(index, el) {
                    $(el).hammer({ recognizers:[[Hammer.Tap]]});
                });
            },
            onDestroy: function() {
                this.$el.find('.brandItem').each(function(index, el){
                    $(el).destroyHammer();
                });
            }
        });
    });