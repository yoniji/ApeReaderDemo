define(['backbone', 'jquery', 'modules/reader/postmodel'],
    function(Backbone, $, PostModel) {

        return Backbone.Collection.extend({
            initialize: function(options) {
                
            },
            onDestroy: function() {
                this.stopListening();
            },
            model:PostModel
        });
    });