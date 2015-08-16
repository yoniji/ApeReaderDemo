define(['jquery', 'hammerjs', 'jquery-hammerjs'], function($, Hammer) {


  /**
   * super simple carousel
   * animation between panes happens with css transitions
   */
  var Carousel = function(element) {
    var self = this;

    var container = element.find('>.carousel-inner');
    var panes = element.find('>.carousel-inner>.item');
    var indicator = element.find('>.carousel-indicator>.indicator');

    var pane_width = 0;
    var pane_height = $(window).width();
    var pane_count = panes.length;

    var current_pane = -1;
    var carousel_bottom = 0;
    var carousel_top = 0;
    var carousel_head = 0;

    var interval = 5000;
    var delay = 1000;
    var is_loading = true;

    var is_expanded;
    //高度固定
    var is_height_fixed = true;

    var _ypos;


    /**
     * initial
     */
    this.init = function() {
      if (!this.isInitialized) {
        this.isInitialized = true;

        element.addClass('loading');

        var self = this;

        if (pane_count > 0) {
          self.onLoad();
        } else {
          element.removeClass('loading').hide();
        }
      }

    };
    this.onLoad = function() {
      element.removeClass('loading');
      //根据第一张幻灯片的高度，设置整个幻灯片的高度
      if (is_height_fixed) {
          var height = panes.first().height();

          pane_height = Math.min( pane_height, height );
          container.height(pane_height);
          panes.height(pane_height);
          panes.find('img').addClass('fixed-height-img');
      }

      //前后各加上1个buffer
      panes.last().clone().prependTo(container);
      panes.first().clone().appendTo(container);
      panes = element.find('>.carousel-inner>.item');

      this.showPane(0, false);

      setPaneDimensions();

      
      $(window).on('load resize orientationchange', setPaneDimensions);
      if (pane_count > 1) {
        element.find('.carousel-indicator').show();
        startTimer();
      }
    };

    this.destory = function() {
      $(window).off('load resize orientationchange', setPaneDimensions);
      stopTimer();
    };
    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
      pane_width = element.width();
      panes.each(function() {
        $(this).width(pane_width);
      });
      container.width(pane_width * (pane_count + 2));
      indicator.width(pane_width / pane_count);

      updateContainerHeight();

    }

    function startTimer() {
      if (self.timer) {
        return;
      } else {
        self.timer = setInterval(function() {
          self.next();
        }, interval);
      }
    }

    function stopTimer() {
      clearInterval(self.timer);
      self.timer = null;
    }

    function restartTimer() {
      stopTimer();
      startTimer();

    }

    function updateContainerHeight(animate) {
      if (!is_height_fixed) {
        var height = $(panes[current_pane + 1]).find('img').height();
        if (animate) {
          container.animate({
            'height': height
          }, 200);
        } else {
          container.css('height', height);
        }
      }


    }



    /**
     * show pane by index
     * @param   {Number}    index
     */
    this.showPane = function(index, animate) {

      // between the bounds
      current_pane = index;

      var container_offset = -((100 / (pane_count + 2)) * (current_pane + 1));
      var indicator_offset = -((100 / pane_count) * (current_pane));

      updateContainerHeight(animate);
      setContainerOffset(container_offset, animate);
      setIndicatorOffset(indicator_offset, animate);

      var timeout;
      var self = this;
      if (index == pane_count) {
        timeout = setTimeout(function() {
          self.showPane(0, false);
          clearTimeout(timeout);
        }, 300);

      } else if (index == -1) {
        timeout = setTimeout(function() {
          self.showPane(pane_count - 1, false);
          clearTimeout(timeout);
        }, 300);
      }
    };

    function setIndicatorOffset(percent, animate) {
      indicator.removeClass('animate');
      if (animate) {
        indicator.addClass('animate');
      }
      var px = ((pane_width * pane_count) / 100) * percent;
      var transformStr = 'translate3d(' + (0 - percent) * pane_count + '%,0,0)';
      indicator[0].style.transform = transformStr;
      indicator[0].style.webkitTransform = transformStr;
    }

    function setContainerOffset(percent, animate) {
      container.removeClass('animate');

      if (animate) {
        container.addClass('animate');
      }
      var actual_pane_count = pane_count + 2;
      var px = ((pane_width * actual_pane_count) / 100) * percent;
      
      var transformStr = 'translate3d(' + percent + '%,0,0)';
      container[0].style.transform = transformStr;
      container[0].style.webkitTransform = transformStr;

    }


    this.next = function() {
      return this.showPane(current_pane + 1, true);
    };
    this.prev = function() {
      return this.showPane(current_pane - 1, true);
    };



    function onDragStart(ev) {
      // disable browser scrolling
      util.preventDefault(ev);
      util.stopPropagation(ev);
      stopTimer();
    }

    function onDragEnd(ev) {
      util.preventDefault(ev);
      util.stopPropagation(ev);
      var gesture = ev.originalEvent.gesture;

      if (gesture.direction == Hammer.DIRECTION_RIGHT) {
        self.prev();
      } else {
        self.next();
      }
      startTimer();
    }

    function onDraging(ev) {
      util.preventDefault(ev);
      util.stopPropagation(ev);

      var gesture = ev.originalEvent.gesture;
      // stick to the finger
      var pane_offset = -(100 / (pane_count + 2)) * (current_pane + 1);
      var drag_offset = ((100 / pane_width) * gesture.deltaX) / (pane_count + 2);

      // slow down at the first and last pane
      if ((current_pane === 0 && gesture.direction == Hammer.DIRECTION_RIGHT) ||
        (current_pane == pane_count - 1 && gesture.direction == Hammer.DIRECTION_LEFT)) {
        drag_offset *= 0.4;
      }

      setContainerOffset(drag_offset + pane_offset, false);
    }
    if (pane_count > 1) {
      element.on('panstart', onDragStart);
      element.on('panleft panright', onDraging);
      element.on('panend', onDragEnd);
    }


  };


  return Carousel;

});