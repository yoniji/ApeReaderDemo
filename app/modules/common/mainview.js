define(['backbone', 'marionette', 'mustache', 'jquery', 'text!modules/common/main.html', 'hammerjs', 'jquery-hammerjs'],
    function(Backbone, Marionette, Mustache, $, template, Hammer) {
        return Marionette.LayoutView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            el:'#mainWrapper',
            initialize: function() {
                var self = this;
                var globalVent = Backbone.Wreqr.radio.channel('global').vent;

                globalVent.on('back', function(data) {

                });
                globalVent.on('alert', function(message) {
                    //todo alert something
                    console.log(message);
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

            },
            initHammer: function() {
                $('body').hammer({
                    direction: Hammer.DIRECTION_ALL,
                    domEvents: true
                });
                var mc = $('body').data('hammer');
                mc.get('tap').set({
                    time: 500,
                    threshold: 10
                });
                mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                
                mc.remove('doubletap');
                mc.remove('press');
                mc.remove('rotate');
                mc.remove('pinch');
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