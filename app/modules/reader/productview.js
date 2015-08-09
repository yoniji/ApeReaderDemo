define(['marionette', 'mustache', 'jquery', 'text!modules/reader/product.html', 'modules/reader/productmodel'],
    function(Marionette, Mustache, $, template, ProductModel) {

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
                if (this.model&&!this.model.isNew()) {
                    this.onModelSync();
                } else {
                    this.model = new ProductModel();
                    this.model.set('id', options.id);
                    this.model.fetch();
                }
                
            },
            onModelSync: function() {
                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);

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