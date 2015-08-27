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
        			url: urls.getServiceUrlByName('mark'),
        			data: {
                        'opt': 'like',
                        'postid': this.get('id')
        			},
        			success: function(response) {
                        self.trigger('toggleLikeSuccess');
        			},
        			method:'POST'
        		});

                appConfig.user_info.counts.likes ++;
                
        	},
        	dislike: function() {
        		var self = this;
                this.setMetadata('liked', false);
                this.trigger('change');
        		util.ajax({
        			url: urls.getServiceUrlByName('mark'),
        			data: {
                        'opt': 'dislike',
                        'postid': this.get('id')
                    },
        			success: function(response) {
                        self.trigger('toggleLikeSuccess');
        			},
        			method:'POST'
        		});
                appConfig.user_info.counts.likes --;
        	},
        	block: function() {
        		var self = this;
        		util.ajax({
        			url: urls.getServiceUrlByName('mark'),
        			data: {
                        'opt': 'block',
                        'postid': this.get('id')
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
        			url: urls.getServiceUrlByName('mark'),
        			data: {
                        'opt': 'share',
                        'postid': this.get('id')
        			},
        			success: function(response) {

        			},
        			method:'POST'
        		});
        	},
            markViewed: function() {
                this.setMetadata('viewed', true);
                this.trigger('change');

                var self = this;
                util.ajax({
                    url: urls.getServiceUrlByName('mark'),
                    data: {
                        'opt': 'view',
                        'postid': this.get('id')
                    },
                    success: function(response) {

                    },
                    method:'POST'
                });
                util.trackEvent('View', 'Post', 1);
            },
            hasCoverImage: function() {
                return ( this.get('images') && this.get('images').length > 0);
            },
            parse: function(response) {
                if (response && response.code === 0) {
                    return response.data;
                } else {
                    if (response.code === 1) {
                        return {error:true, code:404, message: response.message};
                    } else {
                        return {error:true, code:500, message: response.message };
                    }
                    
                }
                
            }
        });
    });