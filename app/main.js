require(['backbone', 
	'marionette', 
	'scripts/common/router', 
	'scripts/common/controller',
	'scripts/common/root_view',
	'urls', 
	'util'], 
	function (Backbone,
		Marionette, 
		Router, 
		Controller, 
		RootView, 
		Urls, 
		Util) 
	{
	window.urls = Urls;
    window.util = Util;
	window.app = new Marionette.Application();
	app.appController = new Controller();
    app.appRouter = new Router({controller: app.appController });
    app.rootView = new RootView();
    app.start();
    Backbone.history.start({ pushState: false, root: '/' });

});