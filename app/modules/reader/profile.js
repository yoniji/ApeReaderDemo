define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('explore');
            },
            initialize: function() {

            },
            onDestroy: function() {
            }
        });
    });