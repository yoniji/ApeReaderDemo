define(['iscroll'], function() {

    // Functions to simulate "refresh" and "load" on pull-down/pull-up
    /*var generatedCount = 0;*/
    function pullDownAction(theScroller) {
        var el, li, i;
        //TODO: do your things
        theScroller.refresh(); //just in case
    }

    function pullUpAction(theScroller) {
        var el, li, i;
        //TODO: doYourThings();
        theScroller.refresh(); //just in case
    }


    var IScrollPullUpDown = function(wrapperObj, iScrollConfig, pullDownActionHandler, pullUpActionHandler) {
        var iScrollConfig, pullDownActionHandler, pullUpActionHandler, pullDownEl, pullDownOffset, pullUpEl, scrollStartPos;
        var pullThreshold = 5;
        var me = this;

        function showPullDownElNow(className) {
            // Shows pullDownEl with a given className
            pullDownEl.style.transitionDuration = '';
            pullDownEl.style.marginTop = '';
            pullDownEl.className = 'pullDown ' + className;
        }

        var hidePullDownEl = function(time, refresh) {
            // Hides pullDownEl
            pullDownEl.style.transitionDuration = (time > 0 ? time + 'ms' : '');
            pullDownEl.style.marginTop = '';
            pullDownEl.className = 'pullDown scrolledUp';

            // If refresh==true, refresh again after time+10 ms to update iScroll's "scroller.offsetHeight" after the pull-down-bar is really hidden...
            // Don't refresh when the user is still dragging, as this will cause the content to jump (i.e. don't refresh while dragging)
            if (refresh) setTimeout(function() {
                me.myScroll.refresh();
            }, time + 10);
        }

        function init() {
            var scrollerObj = wrapperObj.children[0];
            if (!iScrollConfig) {
                iScrollConfig = {
                    probeType: 2,
                    bounceTime: 250,
                    bounceEasing: 'quadratic',
                    mouseWheel: false,

                    click: true,
                    tap: true
                };
            }
            if (pullDownActionHandler) {
                // If a pullDownActionHandler-function is supplied, add a pull-down bar at the top and enable pull-down-to-refresh.
                // (if pullDownActionHandler==null this iScroll will have no pull-down-functionality)
                pullDownEl = document.createElement('div');
                pullDownEl.className = 'pullDown scrolledUp';
                pullDownEl.innerHTML = '<i class="icon icon-expand-more"></i> <span class="pullDownLabel"> 再拉 再拉就刷给你看</span>';
                scrollerObj.insertBefore(pullDownEl, scrollerObj.firstChild);
                pullDownOffset = pullDownEl.offsetHeight;
            }
            if (pullUpActionHandler) {
                // If a pullUpActionHandler-function is supplied, add a pull-up bar in the bottom and enable pull-up-to-load.
                // (if pullUpActionHandler==null this iScroll will have no pull-up-functionality)
                pullUpEl = document.createElement('div');
                pullUpEl.className = 'pullUp';
                pullUpEl.innerHTML = '<i class="icon icon-expand-less"></i> <span class="pullUpLabel">Pull up to load more...</span>';
                //scrollerObj.appendChild(pullUpEl);
            }

            me.myScroll = new IScroll(wrapperObj, iScrollConfig);

            me.myScroll.on('refresh', function() {
                if ((pullDownEl) && (pullDownEl.className.match('loading'))) {
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉加载更多...';
                    if (this.y >= 0) {
                        // The pull-down-bar is fully visible:
                        // Hide it with a simple 250ms animation
                        hidePullDownEl(250, true);
                    } else if (this.y > -pullDownOffset) {
                        // The pull-down-bar is PARTLY visible:
                        pullDownEl.style.marginTop = this.y + 'px';

                        // CSS-trick to force webkit to render/update any CSS-changes immediately: Access the offsetHeight property...
                        pullDownEl.offsetHeight;

                        var animTime = (250 * (pullDownOffset + this.y) / pullDownOffset);
                        this.scrollTo(0, 0, 0);
                        setTimeout(function() {
                            hidePullDownEl(animTime, true);
                        }, 0);

                    } else {
                        hidePullDownEl(0, true);
                        this.scrollBy(0, pullDownOffset, 0);
                    }
                }
                if ((pullUpEl) && (pullUpEl.className.match('loading'))) {
                    pullUpEl.className = 'pullUp';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                }
            });

            me.myScroll.on('scrollStart', function() {
                scrollStartPos = this.y; // Store the scroll starting point to be able to track movement in 'scroll' below
            });

            me.myScroll.on('scroll', function() {
                if (pullDownEl || pullUpEl) {
                    if ((scrollStartPos == 0) && (this.y == 0)) {
                        this.hasVerticalScroll = true;

                        // Set scrollStartPos to -1000 to be able to detect this state later...
                        scrollStartPos = -1000;
                    } else if ((scrollStartPos == -1000) &&
                        (((!pullUpEl) && (!pullDownEl.className.match('flip')) && (this.y < 0)) ||
                            ((!pullDownEl) && (!pullUpEl.className.match('flip')) && (this.y > 0)))) {
                        this.hasVerticalScroll = false;
                        scrollStartPos = 0;
                        this.scrollBy(0, -this.y, 0); // Adjust scrolling position to undo this "invalid" movement
                    }
                }

                if (pullDownEl) {
                    if (this.y > pullDownOffset + pullThreshold && !pullDownEl.className.match('flip')) {
                        showPullDownElNow('flip');
                        this.scrollBy(0, -pullDownOffset, 0); // Adjust scrolling position to match the change in pullDownEl's margin-top
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '够了啦 松开人家嘛';
                    } else if (this.y < 0 && pullDownEl.className.match('flip')) { // User changes his mind...
                        hidePullDownEl(0, false);
                        this.scrollBy(0, pullDownOffset, 0); // Adjust scrolling position to match the change in pullDownEl's margin-top
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '再拉 再拉就刷给你看...';
                    }
                }
                if (pullUpEl) {
                    if (this.y < (this.maxScrollY - pullThreshold) && !pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'pullUp flip';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to load more...';
                    } else if (this.y > (this.maxScrollY + pullThreshold) && pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'pullUp';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                    }
                }
            });

            me.myScroll.on('scrollEnd', function() {
                if ((pullDownEl) && (pullDownEl.className.match('flip'))) {
                    showPullDownElNow('loading');
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '小空刷的好累呀...';
                    pullDownActionHandler(this); // Execute custom function (ajax call?)
                }
                if ((pullUpEl) && (pullUpEl.className.match('flip'))) {
                    pullUpEl.className = 'pullUp loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '小空刷的好累呀...';
                    pullUpActionHandler(this); // Execute custom function (ajax call?)
                }
                if (scrollStartPos = -1000) {
                    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
                }
            });

            me.destroy = function() {
                me.myScroll.destroy();
            };

            me.myScroll.refresh();
        }

        init();
    };
    return IScrollPullUpDown;

});