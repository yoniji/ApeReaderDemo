define(['marionette', 
    'underscore', 
    'mustache', 
    'jquery', 
    'text!modules/reader/recommendcell.html',
    'waves'],
    function(Marionette,
     _, 
     Mustache, 
     $, 
     template, 
     Waves) {
        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'inner': '.inner',
                'more': '.more'
            },
            events: {
                'touchstart': 'onTouchStart',
                'tap': 'onTap'
            },
            modelEvents: {
                'change': 'onChange'
            },
            initialize: function() {
                this.lastPageY = -1;
            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var defaultCoverHeight = Math.round(windowWidth * 0.382);
                var maxHeight = Math.round(windowWidth * 0.618);



                var hasCoverImage = this.model.hasCoverImage();

                return {
                    'getMediumCellCoverHtml': function() {

                        var outStr = '';
                        if (hasCoverImage && this.images.length < 3) {
                            outStr += '<div class="cellCover">';
                            outStr += this.getLargeCellCoverHtml();
                            outStr += '</div>';
                        } else if(hasCoverImage){
                            outStr += '<div class="cellMoreImages">';
                            var imgWidth = Math.round((windowWidth - 32 - 8) / 3);
                            var imgHeight = Math.round(imgWidth * 0.667);

                            for (var i = 0; i < 3; i++) {
                                outStr += util.generateImageHtml(this.images[i], {
                                    width: imgWidth,
                                    height: imgHeight
                                });
                            }
                            outStr += '</div>';

                        }
                        
                        return outStr;
                    },
                    generateRankCellCoverHtml: function() {
                        return this.getMediumCellCoverHtml();
                    },
                    'getTagsHtml': function() {
                        var outStr = '';
                        var seen = [];
                        var result = [];

                        _.each(this.tags, function(value, i, array) {
                            if (!_.findWhere(seen, value, { 'id': value.id })) {
                              seen.push(value);
                              result.push(value);
                            }
                        });

                        if (result && result.length > 0) {
                            outStr += '<i class="icon icon-pricetags"></i> ';
                            for (var i = 0; i < result.length && i < 3; i++) {
                                outStr += result[i].name + ' ';
                            }
                            if (result.length > 3) outStr += '...';
                        }

                        return outStr;
                    }
                };
            },
            onChange: function() {
                var self = this;
                //等待article动画播放完毕再进行刷新
                if (this.model.collection.hasOpenedArticle) {
                    var timeout = setTimeout(function() {
                        if (self) {
                            self.render();
                            clearTimeout(timeout);
                            self = null;
                            timeout = null;
                        }
                    }, 800);
                } else {
                    this.render();
                }

            },
            onTouchStart: function(ev) {
                var streamWrapperEl = this.$el.parent().parent().parent();
                this.lastPageY = streamWrapperEl.scrollTop();
            },
            onTap: function(ev) {
                //util.preventDefault(ev);
                //util.stopPropagation(ev);

                var isScrolling = false;
                var streamWrapperEl = this.$el.parent().parent().parent();
                var currentPageY = streamWrapperEl.scrollTop();
                if (Math.abs(currentPageY - this.lastPageY) > 50) {
                    isScrolling = true;
                }

                if (!isScrolling ) {
                    Waves.ripple(this.$el[0]);

                    var url = util.generateShareUrlWithCurrentLocation('#posts/' + this.model.get('id'));

                    if ( util.isMKApp() ) {
                       url = util.getUrlWithoutHash() + '#posts/' + this.model.get('id');
                    } 

                    util.navigationTo(url);
                }
            },
            onDestroy: function() {
                this.stopListening();
            },
            className: 'cell recommendCell waves-effect'
        });
    });