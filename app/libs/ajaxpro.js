define(["jquery", "backbone"],
    function($, Backbone) {
        var STATUS_SUCCESS = 0;

        return function(options) {

            options = options || {};
            var url, data, type, success, networkError, complete;
            url             = options.url;
            data            = options.data || {};
            type            = options.type || 'GET';
            success         = options.success;
            networkError    = options.error;
            complete        = options.complete;
            
            $.ajax({
                url: url,
                data: data,
                type: type,
                success: function(data, textStatus, jqXHR) {
                    if (data && data.statusCode === STATUS_SUCCESS) {
                        if (success) success(data);
                    } else {
                        var globalChannel = Backbone.Wreqr.radio.channel('global');
                        if(data && data.errorMessage) {
                            globalChannel.vent.trigger( 'alert', data.errorMessage );
                        } else {
                            globalChannel.vent.trigger( 'alert', '请稍后再试' );
                        }
                    }
                    if(complete) {complete();}

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (networkError) {
                        networkError();
                    } else {
                        var globalChannel = Backbone.Wreqr.radio.channel('global');
                        globalChannel.vent.trigger( 'alert', '您的网络情况不太好，请稍后再试' );
                    }
                    if(complete) {complete();}
                }
            });

        };
    }
);