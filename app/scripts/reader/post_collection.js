define(['backbone', 'jquery', 'scripts/reader/post_model'],
    function(Backbone, $, PostModel) {

        return Backbone.Collection.extend({
            initialize: function(options) {
                
            },
            onDestroy: function() {
                this.stopListening();
            },
            model:PostModel,
            comparator:false
        });
    });