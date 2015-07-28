require.config({
    paths: {
        "underscore": "../vendor/bower/lodash/dist/lodash.underscore",
        "almond": "../vendor/bower/almond/almond",
        "lodash": "../vendor/bower/lodash/dist/lodash",
        "template": "../vendor/bower/lodash-template-loader/loader",
        "jquery": "../vendor/bower/jquery/dist/jquery",
        "backbone": "../vendor/bower/backbone/backbone",
        "marionette": "../vendor/bower/marionette/lib/backbone.marionette",
        "mustache": "../vendor/bower/mustache/mustache",
        "text": "../vendor/bower/text/text",
        "hammerjs":"../vendor/bower/hammerjs/hammer",
        "jquery-hammerjs":"../vendor/bower/jquery-hammerjs/jquery.hammer",
        "iscroll":"../vendor/bower/iscroll/build/iscroll",
        "waitforimages":"../vendor/bower/waitForImages/dist/jquery.waitforimages.min",
        "ajaxpro": "libs/ajaxpro",
        "util": 'libs/util',
        "flytoeffect": "libs/effectflyto",
        "urls": "modules/common/urls"
    },

    deps: ["main"],
    shim: {
        "jquery.hammerjs":{
            deps:["hammerjs","jquery"]
        }
    }
});
