define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('productdetail');
        	},
        	like: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products') + '/like',
        			data: {
                        'id': this.model.get('id')
        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	dislike: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products')  + '/dislike',
        			data: {
                        'id': this.model.get('id')
        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	markShared: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products') + '/share',
        			data: {
                        'id': this.model.get('id')
        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
            parse: function(response) {
                var data = {};

                data = response.data;

                if (!data.display_image) {
                    //优先设置为搭配图
                    if ( data.images.design_images && data.images.design_images.length>0 ) {

                        data.display_image = data.images.design_images[0];

                    } else if ( data.images.basic_images && data.images.basic_images.length>0 ) {

                        data.display_image = data.images.basic_images[0];

                    } else if ( data.images.detail_images && data.images.detail_images.length>0 ) {
                        
                        data.display_image = data.images.detail_images[0];

                    } else if ( data.images.bim_images && data.images.bim_images.length>0 ) {
                       
                        data.display_image = data.images.bim_images[0];

                    } else {
                        //todo 设置为默认图片
                    }
                }

                var allImages = [];
                data.allImages = data.images.design_images
                .concat( data.images.basic_images )
                .concat( data.images.detail_images )
                .concat( data.images.bim_images );
                return data;
            }
        });
    });