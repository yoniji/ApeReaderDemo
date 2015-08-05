define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('explore');
            },
            initialize: function() {

            },
            parse: function(response) {
                if(appConfig) response.categories = appConfig.categories;
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });