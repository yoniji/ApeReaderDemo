require(['backbone', 'marionette', 'modules/common/router', 'modules/common/controller','modules/common/mainview','urls', 'util'], function (Backbone,Marionette, Router, Controller, MainView, Urls, Util) {
	window.urls = Urls;
    window.util = Util;
	window.app = new Marionette.Application();
	app.appController = new Controller();
    app.appRouter = new Router({controller: app.appController });
    app.rootView = new MainView();
    app.start();
    Backbone.history.start({ pushState: false, root: '/' });

});