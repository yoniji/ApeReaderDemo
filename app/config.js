require.config({
    paths: {
        "underscore": "../vendor/bower/lodash/dist/lodash.underscore",
        "jquery": "../vendor/bower/jquery/dist/jquery",
        "backbone": "../vendor/bower/backbone/backbone",
        "marionette": "../vendor/bower/marionette/lib/backbone.marionette",
        "mustache": "../vendor/bower/mustache/mustache",
        "text": "../vendor/bower/text/text",
        "hammerjs":"../vendor/bower/hammerjs/hammer",
        "jquery-hammerjs":"../vendor/bower/jquery-hammerjs/jquery.hammer",
        "iscroll": "../vendor/bower/iscroll/build/iscroll",
        "util": 'libs/util',
        "urls": "modules/common/urls",
        "dropdown": "modules/ctrls/ctrldropdown",
        "carousel":"modules/ctrls/ctrlcarousel",
        "waves": "../vendor/bower/waves/dist/waves",
        "refresh": "../vendor/bower/material-refresh/material-refresh"
    },

    deps: ["main"],
    shim: {
        "jquery-hammerjs":{
            deps:["hammerjs","jquery"]
        },
        "refresh":{
            deps:["jquery"]
        }
    }
});
