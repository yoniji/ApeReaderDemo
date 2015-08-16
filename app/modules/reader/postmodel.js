define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('posts') + this.get('id');
        	},
            setMetadata: function(key, value) {
                var meta = this.get('metadata');
                meta[key] = value;

                this.set('metadata', meta);
            },
            toggleLike: function() {
                if ( this.get('metadata').liked ) {
                    this.dislike();
                } else {
                    this.like();
                }
            },
        	like: function() {
                this.setMetadata('liked', true);

        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('posts') + this.get('id') + '/like',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	dislike: function() {
        		var self = this;
                this.setMetadata('liked', false);
        		util.ajax({
        			url: urls.getServiceUrlByName('posts') + this.get('id') + '/dislike',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
        	block: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('posts') + this.get('id') + '/block',
        			data: {

        			},
        			success: function(response) {
                        
        			},
        			method:'POST'
        		});
                if(this.collection) this.collection.remove(this);
        	},
        	markShared: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('posts') + this.get('id') + '/share',
        			data: {

        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
            markViewed: function() {
                this.setMetadata('viewed', true);
            },
            hasCoverImage: function() {
                return ( this.get('images') && this.get('images').length > 0);
            }
        });
    });