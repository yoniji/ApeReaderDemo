define(['backbone', 'marionette','modules/reader/exploreview','modules/reader/featureview','modules/reader/profileview','modules/reader/articleview','modules/reader/productview'],
    function (Backbone, Marionette, ExploreView, FeatureView, ProfileView, ArticleView, ProductView) {

    	function setCurrentNavigationById(targetId) {
    		$('.homeNavigation-item.current').removeClass('current');
    		$('#navigation-' + targetId).addClass('current');
    	}
        return Marionette.Controller.extend({
            initialize: function (options) {
            	
            },
            explore: function() {
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            },
            feature: function() {
            	var featureView = new FeatureView();
            	setCurrentNavigationById('feature');
            },
            me: function() {
            	var profileView = new ProfileView();
            	setCurrentNavigationById('me');
            },
            post: function(id) {
                var articleView = new ArticleView({'id':id});
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            },
            product: function(id) {
                var productView = new ProductView({'id':id});
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            }
        });
});