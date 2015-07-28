define(['backbone', 'marionette','modules/reader/homeview'],
    function (Backbone, Marionette, HomeView) {
        return Marionette.Controller.extend({
            initialize: function (options) {
            	
            },
            welcome: function() {
                var homeView = new HomeView();
            }
        });
});