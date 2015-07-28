define(function(require, exports, module) {


    var useTestServer = true;
    var testBaseUrl = 'app/modules/reader/';
    var releaseBaseUrl = 'https://shiliujishi.com/';

    var testServiceUrls = {
        'feeds': testBaseUrl + 'feeds.json'
    };

    var releaseServiceUrls = {
        'feeds': testBaseUrl + 'mock/feeds.js'
    };


    exports.getServiceUrlByName = function(serviceName) {
        if (useTestServer) {
            return testServiceUrls[serviceName];
        } else {
            return releaseServiceUrls[serviceName];
        }

    };

});