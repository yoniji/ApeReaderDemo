define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('post');
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
                this.trigger('change');
        		var self = this;
        		util.ajax({
        			url: this.url() + '/like/',
        			data: {
                        'id': this.get('id')
        			},
        			success: function(response) {
                        self.trigger('toggleLikeSuccess');
        			},
        			method:'POST'
        		});
        	},
        	dislike: function() {
        		var self = this;
                this.setMetadata('liked', false);
                this.trigger('change');
        		util.ajax({
        			url: this.url() + '/dislike/',
        			data: {
                        'id': this.get('id')
                    },
        			success: function(response) {
                        self.trigger('toggleLikeSuccess');
        			},
        			method:'POST'
        		});
        	},
        	block: function() {
        		var self = this;
        		util.ajax({
        			url: this.url() + '/block/',
        			data: {
                        'id': this.get('id')
        			},
        			success: function(response) {
                        self.trigger('blockSuccess');
        			},
        			method:'POST'
        		});
                if(this.collection) this.collection.remove(this);
        	},
        	markShared: function() {
        		var self = this;
        		util.ajax({
        			url: this.url() + '/share/',
        			data: {
                        'id': this.get('id')
        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
            markViewed: function() {
                this.setMetadata('viewed', true);
                this.trigger('change');
            },
            hasCoverImage: function() {
                return ( this.get('images') && this.get('images').length > 0);
            },
            parse: function(response) {
                return response.data;
            }
        });
    });