﻿define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('explore');
            },
            initialize: function() {

            },
            parse: function(response) {
                if(appConfig) response.categories = appConfig.post_menu;
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });