define(['marionette', 'mustache', 'jquery', 'text!modules/reader/page.html'],
    function(Marionette, Mustache, $, template) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'cover':'.cover',
                'info':'.info'
            },
            events: {
                'panstart':'onPanStart',
                'panmove':'onPanMove',
                'panend': 'onPanEnd'
            },
            initialize: function() {


            },
            onPanStart:function(ev){
                this.rotateDegree = 0;
                this.$currentPage = $('<div class="tempCurrentPage"></div>');
                this.$currentPageTop = $('<div class="tempCurrentPageTop"></div>');
                this.$currentPage.append(this.$el.html());
                this.$currentPageTop.append(this.$el.html());
                this.$el.append(this.$currentPageTop);
                this.$el.append(this.$currentPage);

                if(this.$el.prev().size()>0) {
                    this.$nextPage = $('<div class="tempNextPage"></div>');
                    this.$nextPage.append(this.$el.prev().html());
                    this.$el.append(this.$nextPage);
                }

                this.ui.cover.hide();
                this.ui.info.hide();
            },
            onPanMove: function(ev) {
                var angle = ev.originalEvent.gesture.angle;
                var distance = ev.originalEvent.gesture.distance;
                
                    this.rotateDegree = Math.round(distance/2);
                    var currentRotateStr = 'rotate3d(1,0,0,' + this.rotateDegree + 'deg)';
                    var nextRotateStr = 'rotate3d(1,0,0,' + (this.rotateDegree-180) + 'deg)';
                    this.$currentPage[0].style.webkitTransform = currentRotateStr;
                    if(this.$nextPage) {
                        this.$nextPage[0].style.webkitTransform = nextRotateStr;
                    }
                
            },
            onPanEnd: function(ev) {
                if(this.$currentPage)  this.$currentPage.remove();
                if(this.$nextPage)  this.$nextPage.remove();
                if(this.$currentPageTop)  this.$currentPageTop.remove();
                this.$currentPage = null;
                this.$nextPage = null;

                if(this.rotateDegree>90) {
                    this.$el.hide();
                }
                this.ui.cover.show();
                this.ui.info.show();
            },
            templateHelpers: function() {
                var self = this;
                return {
                    getCoverImageUrl: function() {
                        return this.image.original.url;
                    },
                    getCoverImageStyleString: function() {
                        var parent = $(window);
                        var parentWidth = parent.width();
                        var parentHeight = parent.height()-40;
                        var image = this.image.original;

                        var width = 0;
                        var height = 0;

                        if ( image.width > image.height ) {
                            height = parentHeight;
                            width = Math.ceil( image.width * parentHeight / image.height );
                        } else {
                            width = parentWidth;
                            height = Math.ceil( image.height * parentWidth / image.width );
                        }

                        var left = Math.round( (parentWidth-width)/2);
                        var top = Math.round( (parentHeight-height)/2);
                        

                        return 'width:' + width + 'px;height:' + height + 'px;left:' + left + 'px;top:' + top + 'px';
                    }
                };
            },
            onShow: function() {

            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'pageWrapper'
        });
    });