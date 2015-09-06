define(['backbone', 'marionette'], function (Backbone, Marionette) {
    return Marionette.AppRouter.extend({
        //'index' must be a method in AppRouter's controller
        appRoutes: {
        	'feature(/)':'feature',
        	'posts/:id(/)':'post',

        	'products(/)':'products',
        	'products/search(/)':'searchProducts',  
        	'products/:id(/)':'productDetail',

            'share/posts/:id(/)':'sharePost',
            'share/products/:id(/)':'productDetail',

            'me(/)':'me',

            '': 'explore',
            '*action': 'explore'
        }
    });
});