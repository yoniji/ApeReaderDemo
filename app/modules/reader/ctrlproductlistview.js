define([
    'marionette', 
    'underscore', 
    'mustache', 
    'jquery', 
    'text!modules/reader/productlist.html', 
    'text!modules/reader/productitem.html', 
    'modules/reader/productsearchmodel', 
    'hammerjs',
    'jquery-hammerjs',
    'iscroll'
    ],
    function(
        Marionette, 
        _, 
        Mustache, 
        $, 
        template, 
        itemTemplate,
        SearchModel,
        Hammer
    ) {


        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model, { 'item': itemTemplate });
            },
            type: 'horizontal',
            modelEvents: {
                'sync': 'onModelSync'
            },
            events: {
                'tap .productItem': 'onTapProduct'
            },
            initialize: function(options) {

                if (options && options.container) {
                    this.$el = options.container;
                }

                if (options && options.type == 'vertical') {
                    this.type = 'vertical';
                }

                if (options && options.filterJSON) {
                    this.filterJSON = options.filterJSON;
                }

                if (options && options.withoutId) {
                    this.withoutId = options.withoutId;
                }

                if (!this.filterJSON) {
                    this.filterJSON = {};
                }

                if (!this.filterJSON.limit) {
                    this.filterJSON.limit = 4;
                }

                this.filterJSON.page = 1;
                
                this.model = new SearchModel();
                this.model.search(this.filterJSON);


            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
                var listThumbSize = 128;

                return {
                    'getImageSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(listThumbSize * ratio) + 'w_' + Math.round(listThumbSize * ratio) + 'h_1e_1c';
                        return outStr;
                    }
                };
            },
            onModelSync: function() {

                var self = this;
                if ( this.withoutId ) {
                    this.model.set('products', 
                        _.filter( this.model.get('products'), function(product) {
                            return product.id != self.withoutId;
                        }
                    ));
                }

                if ( this.filterJSON.sample && (this.filterJSON.sample < this.model.get('products').length) ) {
                    this.model.set('products', 
                        _.sample( this.model.get('products'), this.filterJSON.sample 
                    ));
                }

                this.render();

                //如果没有产品移除整个element
                if ( this.model.get('products').length === 0 ) {
                    //todo 这里如何确保parent是可以安全移除的
                    this.$el.parent().prev('.caption').remove();
                    this.$el.parent().remove();
                } else if (this.type == "horizontal") {
                    var productList = this.$el.find('.productItem');
                    var productListWidth = (productList.width() + 5) * productList.size();
                    this.$el.width(productListWidth + 'px');

                    this.scroller = new IScroll(this.$el.parent()[0], {
                        'scrollX': true,
                        'scrollY': false,
                        'bindToWrapper': true,
                        'snap': true,
                        'eventPassthrough': true
                    });
                }

                //hammer
                this.$el.find('.productItem').each(function(index, el){
                    $(el).hammer({ recognizers:[[Hammer.Tap]]});
                });
                

            },
            onTapProduct: function(ev) {
                var id = $(ev.currentTarget).attr('data-id');
                Backbone.history.navigate('#products/' + id, {
                    trigger: true
                });
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                this.$el.find('.productItem').each(function(index, el){
                    $(el).destroyHammer();
                });
            }
        });
    });