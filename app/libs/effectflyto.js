define(['jquery', 'modernizr'], function($) {

    var FlyTo = function($sourceElement, $destElement) {
        var self = this;
        var $body = $('body');

        $srcEl = $sourceElement.clone();

        var srcPosition = $sourceElement.offset();
        var destPosition = $destElement.offset();
        var distantLeft = Math.floor(destPosition.left - srcPosition.left);
        var distantTop = Math.floor(destPosition.top - srcPosition.top);
        var width = $sourceElement.width();
        var height = $sourceElement.height();

        $srcEl.css({
            'position': 'absolute',
            'left': srcPosition.left,
            'top': srcPosition.top,
            'width': width,
            'height': height,
            'z-index': 999,
            'transition': 'transform .8s cubic-bezier(.36,0,.15,1)',
            '-webkit-transition': '-webkit-transform 1s cubic-bezier(.36,0,.15,1)',
            '-webkit-transform-style': 'preserve-3d'
        }).addClass('reset-transform');
        $body.append($srcEl);

        var animateTimeout = setTimeout(function() {
            if (Modernizr.csstransforms3d) {
                $srcEl.css({
                    'transform': 'translate3d(' + distantLeft + 'px,' + distantTop + 'px,0) scale3d(0.1,0.1,1)',
                    '-webkit-transform': 'translate3d(' + distantLeft + 'px,' + distantTop + 'px,0) scale3d(0.1,0.1,1)'
                });
            } else if (Modernizr.csstransforms) {
                $srcEl.css('transform', 'translate(' + distantLeft + 'px,' + distantTop + 'px) scale(0.1,0.1)');
            } else {
                $srcEl.css({
                    'left': distantLeft,
                    'top': distantTop
                });
            }

            clearTimeout(animateTimeout);
        }, 0);
        var timeout = setTimeout(function() {
            //$sourceElement.trigger('flyToFinished');
            $srcEl.remove();
            clearTimeout(timeout);
        }, 600);

    };

    return FlyTo;

});