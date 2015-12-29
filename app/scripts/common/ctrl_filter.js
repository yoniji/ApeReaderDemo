define(['jquery', 'hammerjs', 'jquery-hammerjs'], function($, Hammer) {

    var DropDown = function($toggle, $menu) {
        var self = this;

        var $menuItems = $menu.find('>.dropDown-menu-item');
        var $switchText = $toggle.find('>.dropDown-text');


        /**
         * initial
         */
        this.init = function() {
            if (!this.isInitialized) {
                this.isInitialized = true;
                $toggle.on("tap", onTapToggle);
                $menuItems.on("tap", onTapMenuItem);
            }
        };

        this.destroy = function() {
            $toggle.off("tap", onTapToggle);
            $menuItems.off("tap", onTapMenuItem);

        };
        /**
         * set the pane dimensions and scale the container
         */
        function onTapToggle(ev) {
            
            if ($toggle.hasClass('dropDown-open')) {
                closeMenu();
            } else {
                openMenu();
            }
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
            ev.originalEvent.preventDefault();
            ev.originalEvent.stopPropagation();
            
        }

        function openMenu() {
            $toggle.addClass('dropDown-open');
        }

        function closeMenu() {
            $toggle.removeClass('dropDown-open');
        }

        this.init();

    };


    return DropDown;

});