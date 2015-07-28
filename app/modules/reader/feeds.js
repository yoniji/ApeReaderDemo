define(['backbone', 'jquery', 'modules/reader/singlefeed'],
    function(Backbone, $, SingleFeed) {

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
            model:SingleFeed
        });
    });