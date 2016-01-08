define(['backbone', 'marionette'], function (Backbone, Marionette) {
    return Marionette.AppRouter.extend({
        //'index' must be a method in AppRouter's controller
        appRoutes: {
        	'feature(/)':'feature',
        	'posts/:id(/)':'post',

        	'products(/)':'products',
        	'products/search(/*filter)':'searchProducts',
        	'products/:id(/)':'productDetail',

            'share/posts/:id(/)':'sharePost',
            'share/products/:id(/)':'productDetail',

            'me(/)':'me',
            /*
            '': 'products',
            '*action': 'products'
            */
            '': 'explore',
            '*action': 'explore'
            
        }
    });
});