define(['backbone', 'marionette', 'mustache', 'jquery', 'text!templates/ctrldialog.html'],
    function(Backbone, Marionette, Mustache, $, template) {
        return Marionette.ItemView.extend({
            initialize: function(options) {
                if (!options.icon_name) {
                    options.icon_name = 'bird';
                }
                this.model = new Backbone.Model( options );
                this.render();

            },
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'ok': '.btn-ok',
                'cancel': '.btn-cancel',
                'dialog': '.dialog',
                'close': '.dialog-close'
            },
            events: {
                'tap @ui.ok': 'onOk',
                'tap @ui.cancel': 'onCancel',
                'tap @ui.close': 'onCancel'
            },
            onOk: function(ev) {
                this.trigger('ok');
                this.destroy();
            },
            onCancel: function(ev) {
                this.trigger('cancel');
                this.destroy();
            },
            onRender: function() {
                $('body').append(this.$el);
                this.ui.dialog.css({
                    'marginTop': 0 - this.ui.dialog.height()/2
                });
                this.ui.dialog.addClass('bounceInDown animated');
            },
            onDestory: function() {
                this.$el.remove();
                this.model.destroy();
            },
            className: 'dialogContainer'
        });
    });