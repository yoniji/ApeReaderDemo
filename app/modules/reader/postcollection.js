define(['backbone', 'jquery', 'modules/reader/postmodel'],
    function(Backbone, $, PostModel) {

        return Backbone.Collection.extend({
            url: function() {
                return urls.getServiceUrlByName('feeds');
            },
            initialize: function(options) {
                
            },
            parse: function(response){
                return response.data;
            },
            onDestroy: function() {
                this.stopListening();
            },
            model:PostModel
        });
    });