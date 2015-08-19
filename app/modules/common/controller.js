define(['backbone', 'marionette','modules/reader/exploreview','modules/reader/featureview','modules/reader/profileview','modules/reader/articleview','modules/reader/productview','modules/reader/productlibraryview','modules/reader/productsearchview'],
    function (Backbone, Marionette, ExploreView, FeatureView, ProfileView, ArticleView, ProductView, ProductLibraryView, ProductSearchView) {

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
            products: function() {
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
            },
            searchProducts: function(filter) {
                var productLibraryView = new ProductLibraryView();
                setCurrentNavigationById('products');
                var productSearchView = new ProductSearchView(filter);
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
            productDetail: function(id) {
                var productView = new ProductView({'id':id});
                var exploreView = new ExploreView();
                setCurrentNavigationById('explore');
            }
        });
});