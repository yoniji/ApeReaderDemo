define(['jquery', 'hammerjs', 'jquery-hammerjs'], function($, Hammer) {

    var DropDown = function($toggle, $menu, menuItemClass, switchTextClass, transparentOverlay) {
        var self = this;

        if (!menuItemClass) menuItemClass='dropDown-menu-item';
        if (!switchTextClass) switchTextClass='dropDown-text';

        var $menuItems = $menu.find('>.' + menuItemClass);
        var $switchText = $toggle.find('>.' + switchTextClass);
        var $overlay = $('<div class="menu-overlay"></div>');
        var windowHeight = $(window).height();

        if (transparentOverlay) $overlay.addClass('transparent');
        $overlay.css('height', windowHeight);

        /**
         * initial
         */
        this.init = function() {
            if (!this.isInitialized) {
                $toggle.after($overlay);
                this.isInitialized = true;
                $toggle.on("tap", onTapToggle);
                $menuItems.on("tap", onTapMenuItem);
                $overlay.on("touchstart", onTapToggle);
            }
        };

        this.destroy = function() {
            $toggle.off("tap", onTapToggle);
            $menuItems.off("tap", onTapMenuItem);
            $overlay.off("touchstart", onTapToggle);
            $overlay.remove();

        };

        this.close = function() {
            closeMenu();
        };

        /**
         * set the pane dimensions and scale the container
         */
        function onTapToggle(ev) {
            
            if ($toggle.hasClass('dropDown-open')) {
                closeMenu();
            } else {
                $(ev.currentTarget).trigger('beforeOpenMenu');
                openMenu();
            }

            ev.preventDefault();
            ev.stopPropagation();
            if(ev.originalEvent) ev.originalEvent.preventDefault();
            if(ev.originalEvent) ev.originalEvent.stopPropagation();
        }

        function onTapMenuItem(ev) {

            $menu.find('.checked').removeClass('checked');
            $(ev.currentTarget).addClass('checked');
            $switchText.text($(ev.currentTarget).text());
            $(ev.currentTarget).trigger('select');
            var timeout = setTimeout(function() {
              closeMenu();
              clearTimeout(timeout);
            }, 100);

            ev.preventDefault();
            ev.stopPropagation();
            if(ev.originalEvent) ev.originalEvent.preventDefault();
            if(ev.originalEvent) ev.originalEvent.stopPropagation();
            
        }

        function openMenu() {
            $toggle.addClass('dropDown-open');
            $overlay.show();
            $menu.addClass('menu-open');
            if( $menu.height() + $menu.offset().top > windowHeight) $menu.css('height', windowHeight - $menu.offset().top);
        }

        function closeMenu() {
            $toggle.removeClass('dropDown-open');
            $overlay.hide();
            $menu.removeClass('menu-open');
        }

        this.init();

    };


    return DropDown;

});