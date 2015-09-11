define(['marionette', 'mustache', 'jquery', 'text!modules/reader/loading.html', 'text!modules/reader/empty.html'],
    function(Marionette, Mustache, $, loadingTemplate, emptyTemplate) {
        var type = 'loading';
        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                if ( type === 'empty' ) {
                    return Mustache.render(emptyTemplate, serialized_model);
                } else {
                    return Mustache.render(loadingTemplate, serialized_model);
                }
            },
            initialize: function(options) {
                if (options && options.type) {
                    type = options.type;
                } else {
                    type = 'loading';
                }

            },
            onDestroy: function() {
                this.$el.parent().siblings('.loading').css('visibility','visible');
            },
            className: 'empty'
        });
    });