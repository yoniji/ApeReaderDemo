define(function(require, exports, module) {


    var useTestServer = true;
    var testBaseUrl = 'http://private-7f3f9-apereader.apiary-mock.com/reader/';
    var releaseBaseUrl = 'https://shiliujishi.com/';

    var testServiceUrls = {
        'explore': testBaseUrl + 'posts/',
        'posts': testBaseUrl + 'posts/',
        'products': testBaseUrl + 'products/',
        'feature': testBaseUrl + 'feature/'
    };

    var releaseServiceUrls = {
        'explore': testBaseUrl + 'posts/',
        'posts': testBaseUrl + 'posts/',
        'products': testBaseUrl + 'products/',
        'feature': testBaseUrl + 'feature/'
    };


    exports.getServiceUrlByName = function(serviceName) {
        if (useTestServer) {
            return testServiceUrls[serviceName];
        } else {
            return releaseServiceUrls[serviceName];
        }

    };

});