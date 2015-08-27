define(function(require, exports, module) {


    var useTestServer = true;
    var testBaseUrl = 'http://private-7f3f9-apereader.apiary-mock.com/reader/';
    var releaseBaseUrl = 'http://mk.apecrafts.com/_/';

    var testServiceUrls = {
        'explore': releaseBaseUrl + 'explore/posts',
        'post': releaseBaseUrl + 'explore/post',
        'mark': releaseBaseUrl + 'explore/mark',
        'feature': releaseBaseUrl + 'feature',
        'user': releaseBaseUrl + 'user',
        'brands': testBaseUrl + 'brands',
        'products': testBaseUrl + 'products',
        'productlib': testBaseUrl + 'productlib',
        'wechat': releaseBaseUrl + 'api/jsconfig'
    };

    var releaseServiceUrls = {
        'explore': releaseBaseUrl + 'explore/posts',
        'post': releaseBaseUrl + 'explore/post',
        'mark': releaseBaseUrl + 'explore/mark',
        'feature': releaseBaseUrl + 'feature',
        'brands': testBaseUrl + 'brands',
        'products': testBaseUrl + 'products',
        'productlib': testBaseUrl + 'productlib',
        'wechat': releaseBaseUrl + 'api/jsconfig'
    };


    exports.getServiceUrlByName = function(serviceName) {
        if (useTestServer) {
            return testServiceUrls[serviceName];
        } else {
            return releaseServiceUrls[serviceName];
        }

    };

});