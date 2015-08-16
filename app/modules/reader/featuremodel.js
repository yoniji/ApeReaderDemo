define(['backbone', 'jquery'],
    function(Backbone, $) {

        function setRankNumber(data) {
            for (var i = 0; i < data.length; i++ ) {
                data[i].rank = i+1;
            }
        }

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('feature') + 'today';
            },
            initialize: function() {

            },
            parse: function(response) {
                setRankNumber(response.posts);
                return response;
            },
            onDestroy: function() {
            }
        });
    });