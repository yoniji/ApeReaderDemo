define(['backbone', 'marionette'], function (Backbone, Marionette) {
    return Marionette.AppRouter.extend({
        //'index' must be a method in AppRouter's controller
        appRoutes: {
        	'feature(/)':'feature',
        	'me(/)':'me',
        	'posts/:id(/)':'post',
            'share/posts/:id(/)':'sharePost',
        	'products(/)':'products',
        	'products/search(/)':'searchProducts',  
        	'products/:id(/)':'productDetail',
            '': 'explore',
            '*action': 'explore'
        }
    });
});