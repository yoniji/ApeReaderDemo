define(['jquery','hammer', 'jquery.hammer','modernizr'], function ($, Hammer) {

var Tab = function(tabsContainer, panesContainer)
{
  var self = this;

  var tabs = tabsContainer.find('>.tab-item');
  var panesInner = panesContainer.find('>.tab-content-inner');
  var panes = panesInner.find('>.tab-pane');
  
  
  var pane_width = 0;
  var pane_count = panes.length;
  
  var current_pane = 0;
  
  /**
   * initial
   */
  this.init = function() {
    if ( !this.isInitialized ) {
        tabs.each( function(index, el) {
          $(el).hammer({ recognizers:[[Hammer.Tap]]});
          console.log($(el).data('hammer'));
        });
        this.isInitialized = true;
        setPaneDimensions();
        $(window).on("load resize orientationchange", setPaneDimensions);
    }
  };      
  
  this.destory = function() {
    $(window).off('load resize orientationchange', setPaneDimensions);
  };
  /**
   * set the pane dimensions and scale the container
   */
  function setPaneDimensions() {
    pane_width = panesContainer.width();
    panes.each(function() {
      $(this).width(pane_width);
    });
    panesInner.width(pane_width*pane_count);
  }

  function setCurrentTab(index) {
      tabs.removeClass("active");
      $(tabs.get(index)).addClass("active");
  }
      
  /**
   * show pane by index
   * @param   {Number}    index
   */
  this.showPane = function(index, animate) {
    // between the bounds
    index = Math.max(0, Math.min(index, pane_count-1));

    if ( current_pane != index ) {
        current_pane = index;
        triggerEvent(current_pane, panes.get(current_pane));
    }
    
    var offset = -((100/pane_count)*current_pane);
    
    setContainerOffset(offset, animate);
    setCurrentTab(index);
  };              
  function triggerEvent(index, pane) {
    var e = jQuery.Event( "change",{"index":index} );
    $(pane).trigger( e );
  }
  function setContainerOffset(percent, animate) {
    panesInner.removeClass('animate');
    
    if(animate) {
      panesInner.addClass('animate');
    }
    
    var px = ((pane_width * pane_count) / 100) * percent;
    
    if(Modernizr.csstransforms3d) {
      panesInner.css('transform', 'translate3d('+ percent +'%,0,0) scale3d(1,1,1)');
    }
    else if(Modernizr.csstransforms) {
      panesInner.css('transform', 'translate('+ percent +'%,0)');
    }
      else {
        px = ((pane_width*pane_count) / 100) * percent;
        panesInner.css('left', px+'px');
      }
  }


  
  this.next = function() { return this.showPane(current_pane+1, true); };
  this.prev = function() { return this.showPane(current_pane-1, true); };
  
  
  
  function panesHandleHammer(ev) { 
    // disable browser scrolling
    
    switch(ev.type) {
      case 'panmove':
        // stick to the finger
        var pane_offset = -(100/pane_count) * current_pane;
        var drag_offset = ((100/pane_width) * ev.gesture.deltaX) / pane_count;
        
        // slow down at the first and last pane
        if((current_pane === 0  && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
           (current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
          drag_offset *= 0.4;
        }
        
        setContainerOffset(drag_offset + pane_offset);
        break;

      case 'panend':
        // Left & Right
        // more then 20% moved, navigate
        if(Math.abs(ev.gesture.deltaX) > pane_width/5) {
          if(ev.gesture.direction == Hammer.DIRECTION_RIGHT) {
            self.prev();
          } else {
            self.next();
          }     
        } else {
            self.showPane(current_pane, true);
        }                   
        break;

    }
  }
    function handleTapTab(ev) { 
        ev.preventDefault();
        ev.stopPropagation();
        var currentTab = $(ev.currentTarget).find(">a");
        var target = currentTab.attr("data-target");
        var targetPane = $(target);
        var paneIndex = panes.index(targetPane);
        self.showPane(paneIndex, true);
    
    }
  //panesContainer.hammer().on('panmove panend', panesHandleHammer);  
  tabs.on('tap', handleTapTab); 
};


    return Tab;

});