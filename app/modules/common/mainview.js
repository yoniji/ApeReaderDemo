define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/common/main.html','waves', 'hammerjs', 'jquery-hammerjs'],
    function(Backbone, Marionette, Mustache, $, template, Waves, Hammer) {
        return Marionette.LayoutView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            el:'#main',
            initialize: function() {
                $('body').on('touchmove', function(ev) {
                    util.preventDefault(ev);
                    util.stopPropagation(ev);
                });

                this.render();
            },
            events: {
                'tap a': 'onTapLink',
                'click a': 'onClickLink'
            },
            ui: {
                'primary': '#primary',
                'secondary': '#secondary',
                'tertiary': '#tertiary'
            },
            regions: {
                primaryRegion: '#primary',
                secondaryRegion: '#secondary',
                tertiaryRegion: '#tertiary'

            },
            onRender: function() {
                this.initHammer();
                this.windowHeight = $(window).height() - 56;
                this.ui.primary.height(this.windowHeight);
                this.ui.secondary.height(this.windowHeight);
                this.ui.tertiary.height(this.windowHeight);

                this.initWaves();

            },
            initWaves: function() {
                Waves.init({
                    delay: 100
                });
                this.$el.find('.homeNavigation-item>.icon').each(function(index,el){
                    Waves.attach(el);
                });
            },
            initHammer: function() {
                $('body').hammer({
                    domEvents: true
                });
                var mc = $('body').data('hammer');
                mc.get('tap').set({
                    time: 500,
                    threshold: 10
                });
                mc.get('pan').set({
                    threshold: 15
                });
                mc.remove('doubletap');
                mc.remove('rotate');
                mc.remove('pinch');
                mc.remove('swipe');
                mc.remove('press');
            },
            onTapLink: function(event) {
                event.preventDefault();
                event.stopPropagation();

                var $link = $(event.currentTarget);
                var href = $link.attr("href");

                if (href) {
                    //判断是否为外链
                    if (href.indexOf('http') > -1 || href.indexOf('tel') > -1) {
                        var timeout = setTimeout(function() {
                            window.location.href = href;
                            clearTimeout(timeout);
                        }, 0);

                    } else {
                        Backbone.history.navigate(href, {
                            trigger: true
                        });
                    }
                    return;
                } else if (href) {
                    Backbone.history.navigate(href, {
                        trigger: true
                    });
                }

            },
            onClickLink: function(event) {
                //prevent ghost click
                event.preventDefault();
                event.stopPropagation();
            },
            updatePrimaryRegion: function(view) {
                if (this.secondaryRegion.$el) this.secondaryRegion.reset();
                this.primaryRegion.show(view);
            },
            updateSecondaryRegion: function(view) {
                this.secondaryRegion.show(view);
                this.secondaryRegion.$el.addClass('active');
            },
            foldSecondaryRegion: function() {
                this.secondaryRegion.$el.removeClass('active');
                this.secondaryRegion.reset();
            },
            updateTertiaryRegion: function(view) {
                this.tertiaryRegion.show(view);
                this.tertiaryRegion.$el.addClass('active');
            },
            foldTertiaryRegion: function() {
                this.tertiaryRegion.$el.removeClass('active');
                this.tertiaryRegion.reset();
            },
            navigateBack: function(ev) {
                window.history.back();

            }
        });
    });