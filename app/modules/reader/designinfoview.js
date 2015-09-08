define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/reader/designinfo.html'],
    function(Backbone, Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'close': '.close'
            },
            events: {
                'tap @ui.close': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {
                this.render();
            },
            templateHelpers: function() {
                var widthPerYear = 15;
                return {
                    getTimelineLength: function() {
                        
                    }
                };
            },
            onRender: function() {
                $('body').append(this.$el);
            },
            onTap: function(ev) {
                this.onDestroy();
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onTouchMove: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'designInfoWrapper'
        });
    });