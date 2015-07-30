define(['backbone', 'marionette','modules/reader/homeview','modules/reader/topsview','modules/reader/profileview'],
    function (Backbone, Marionette, HomeView, TopsView, ProfileView) {

    	function setCurrentNavigationById(targetId) {
    		$('.homeNavigation-item.current').removeClass('current');
    		$('#navigation-' + targetId).addClass('current');
    	}
        return Marionette.Controller.extend({
            initialize: function (options) {
            	
            },
            welcome: function() {
                var homeView = new HomeView();
                setCurrentNavigationById('home');
            },
            tops: function() {
            	var topsView = new TopsView();
            	setCurrentNavigationById('tops');
            },
            me: function() {
            	var profileView = new ProfileView();
            	setCurrentNavigationById('me');
            }
        });
});