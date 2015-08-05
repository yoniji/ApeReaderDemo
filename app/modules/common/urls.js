define(function(require, exports, module) {


    var useTestServer = true;
    var testBaseUrl = 'http://private-7f3f9-apereader.apiary-mock.com/reader/';
    var releaseBaseUrl = 'https://shiliujishi.com/';

    var testServiceUrls = {
        'explore': testBaseUrl + 'posts/',
        'feature': testBaseUrl + 'feature/posts/'
    };

    var releaseServiceUrls = {
        'explore': testBaseUrl + 'posts/',
        'feature': testBaseUrl + 'feature/posts/'
    };


    exports.getServiceUrlByName = function(serviceName) {
        if (useTestServer) {
            return testServiceUrls[serviceName];
        } else {
            return releaseServiceUrls[serviceName];
        }

    };

});