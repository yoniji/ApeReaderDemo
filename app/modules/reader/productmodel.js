define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('products') + '/detail';
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
        	}
        });
    });