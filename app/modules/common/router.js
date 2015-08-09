define(['backbone', 'marionette'], function (Backbone, Marionette) {
    return Marionette.AppRouter.extend({
        //'index' must be a method in AppRouter's controller
        appRoutes: {
        	'feature':'feature',
        	'me':'me',
        	'posts/:id':'post',
        	'products/:id':'product',
            '': 'explore',
            '*action': 'explore'
        }
    });
});