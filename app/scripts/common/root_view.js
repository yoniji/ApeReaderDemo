define(['backbone', 
    'marionette', 
    'mustache', 
    'jquery', 
    'text!templates/root.html',
    'waves', 
    'hammerjs', 
    'jquery-hammerjs'],
    function(Backbone, 
        Marionette, 
        Mustache, 
        $, 
        template, 
        Waves, 
        Hammer) {
        return Marionette.LayoutView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            el:'#main',
            initialize: function() {
                $('html').on('touchmove', function(ev) {
                    util.preventDefault(ev);
                    util.stopPropagation(ev);
                });
                $('body').on('touchmove', function(ev) {
                    util.preventDefault(ev);
                    util.stopPropagation(ev);
                });


                this.render();
            },
            events: {
                'tap .homeNavigation-item': 'onTapNav'
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
                this.windowHeight = $(window).height() - 56;
                this.ui.primary.height(this.windowHeight);
                this.ui.secondary.height(this.windowHeight);
                this.ui.tertiary.height(this.windowHeight);

                var windowWidth = $(window).width();
                $('#main,html,body').css({
                    'width':windowWidth,
                    'min-width': windowWidth,
                    'max-width':windowWidth
                });

                this.$el.find('.homeNavigation-item').each(function(index, el) {
                    $(el).hammer({
                        recognizers:[[Hammer.Tap]]
                    });
                });

            },
            onTapNav: function(event) {
                Waves.ripple(event.currentTarget);
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