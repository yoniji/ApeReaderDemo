define(['marionette', 
    'mustache', 
    'jquery', 
    'text!modules/reader/filterbar.html', 
    'dropdown', 
    'underscore',
    'hammerjs',
    'jquery-hammerjs'],
    function(Marionette, 
        Mustache, 
        $, 
        template, 
        DropDownControl, 
        _,
        Hammer) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            el: '.filterBar',
            ui: {
                'filterMenuItem':'.filterMenu-item',
                'leafFilter':'.leafFilter',
                'filter':'.filter'
                
            },
            events: {
                'select @ui.filterMenuItem': 'onSelectFilterMenu',
                'tap @ui.leafFilter': 'onTapLeafFilter',
                'beforeOpenMenu @ui.filter': 'beforeOpenMenu'
            },
            modelEvents: {
                'change': 'onModelChange'
            },
            initialize: function() {
                this.filterMenus = {};
                this.render();
            },
            templateHelpers: {
                isLeafFilter : function() {
                    return (!this.children || this.children.length < 1);
                },
                getFilterMenuClass: function() {
                    if (this.children && this.children.length > 20) {

                    } else {
                        
                    }
                }
            },
            onSelectFilterMenu: function(ev) {
                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                var parentFilter = item.parent().prev().prev();

                if (id) {
                    parentFilter.addClass('selected');
                    parentFilter.attr('data-child-id', id);
                } else {
                    parentFilter.removeClass('selected');
                    parentFilter.attr('data-child-id', '');
                }
                this.model.setFilters(this.getSelectedFilterIds());
            },
            getSelectedFilterIds: function() {
                var ids = [];
                this.ui.filter.each(function(index, el){
                    var id = $(el).attr('data-child-id');
                    if(id) ids.push(id);
                });
                return ids;
            },
            onTapLeafFilter: function(ev) {

                var item = $(ev.currentTarget);
                var id = item.attr('data-id');
                if ( item.hasClass('selected') ) {
                    item.removeClass('selected');
                    item.attr('data-child-id', '');
                } else {
                    item.addClass('selected');
                    if (id) {
                        item.attr('data-child-id', id);
                    } else {
                        item.attr('data-child-id', '');
                    }
                }

                this.model.setFilters(this.getSelectedFilterIds());

                //关闭其他子菜单
                this.closeMenu();

            },
            beforeOpenMenu: function(ev) {
                this.closeMenu();
            },
            onRender: function() {
                var filterSize = this.ui.filter.size();
                
                if (filterSize > 0) {
                    var filterWidth = Math.floor(100 / filterSize);
                    var self = this;

                    this.ui.filter.each(function(index, fitlerItem){
                        var filter = $(fitlerItem);
                        var id = filter.attr('data-id');
                        filter.css('width', filterWidth + '%');
                        if (filter.hasClass('leafFilter')) {
                            //todo 销毁
                            fitler.hammer({
                                recognizers:[[Hammer.Tap]]
                            });
                        } else {
                            self.filterMenus[id] = new DropDownControl(
                                filter, filter.next(), 'filterMenu-item', 'fitlerSelection', true
                            );
                        }
                    });
                    this.$el.removeClass('noFilter');
                } else {
                    this.$el.addClass('noFilter');
                }
                

            },
            closeMenu: function() {
                $.each(this.filterMenus, function(index, el) {
                    el.close();
                });
            },
            destroyMenu: function() {
                $.each(this.filterMenus, function(index, el) {
                    el.destroy();
                });
            },
            onModelChange: function() {
                this.destroyMenu();
                this.render();
            },
            onDestroy: function() {
                this.$el.find('.leafFilter').destroyHammer();
                this.destroyMenu();
            }
        });
    });