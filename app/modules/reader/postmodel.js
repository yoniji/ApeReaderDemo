define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
        	url: function() {
        		return urls.getServiceUrlByName('post');
        	},
            setMetadata: function(key, value) {
                var meta = this.get('metadata');
                if(meta) {
                    meta[key] = value;
                    this.set('metadata', meta);
                }

                
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
                    //var before = '<p>这是一段强制加上的文字</p><p>这是一张单独出现的图片，它会很大👇</p><div class="image"><img src="http://imgopt.apecrafts.com/99352b5338d1ee3223201811169ce758"></div><p>W3C标准中对CSS3的transition这是样描述的:“CSS的transition允许CSS的属性值在一定的时间区间内平滑地过渡。这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变CSS的属性值。”</p><p>下面是两张图片，它们应该并排显示</p><div class="image"><img src="http://imgopt.apecrafts.com/99352b5338d1ee3223201811169ce758"></div><div class="image"><img src="http://imgopt.apecrafts.com/99352b5338d1ee3223201811169ce758"></div>';
                    //response.data.content = before + response.data.content + before;
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