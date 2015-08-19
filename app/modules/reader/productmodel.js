define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('products') + this.get('id');
        	},
        	like: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products') + this.get('id') + '/like',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	dislike: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products') + this.get('id') + '/dislike',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	markShared: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('products') + this.get('id') + '/share',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	}
        });
    });