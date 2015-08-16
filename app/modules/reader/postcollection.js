define(['backbone', 'jquery', 'modules/reader/postmodel'],
    function(Backbone, $, PostModel) {

        return Backbone.Collection.extend({
            url: function() {
                return urls.getServiceUrlByName('feeds');
            },
            initialize: function(options) {
                
            },
            onDestroy: function() {
                this.stopListening();
            },
            model:PostModel
        });
    });