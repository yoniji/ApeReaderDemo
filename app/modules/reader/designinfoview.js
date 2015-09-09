define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/reader/designinfo.html', 'iscroll'],
    function(Backbone, Marionette, Mustache, $, template) {
        var styleList = ['20s','30s40s', '50s', '60s', '70s', '80s', '90s', '00s'];
         var widthPerYear = 15;
        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'close': '.close',
                'inner': '.designInfoInner'
            },
            events: {
                'tap @ui.close': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {
                this.render();
            },
            templateHelpers: function() {
               
                return {
                    getYearOfDesignStyle: function() {
                        var year = 1962;
                        return 'left:' + (year - 1900) *widthPerYear + 'px';
                    },
                    getTimelineStyle: function() {
                        var year = 2020-1900;
                        return 'width:' + year * widthPerYear + 'px';
                    }
                };
            },
            onRender: function() {
                $('body').append(this.$el);
                this.ui.inner.css('height', $(window).height());

                //如果有设计信息
                this.scroller = new IScroll(this.$el.find('.designInfo-years')[0], {
                    'scrollX': true,
                    'scrollY': false,
                    'bindToWrapper':true,
                    'snap':'.timeline-item',
                    'eventPassthrough':true
                });
                var self = this;
                this.scroller.on('scrollEnd', function() {
                    var index = this.currentPage.pageX;
                    if (typeof(index)==='number'&&index>-1&&index<styleList.length) {
                        self.$el.find('.designInfo-years').attr('class', 'designInfo-years designInfo-block years-' + styleList[index]);
                    }
                });

                var scrollToX = (1962 - 1900) *widthPerYear - $(window).width()/2;
                this.scroller.scrollTo(-scrollToX,0);
            },
            onTap: function(ev) {
                this.onDestroy();
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                this.stopListening();
                this.$el.remove();
            },
            className: 'designInfoWrapper'
        });
    });