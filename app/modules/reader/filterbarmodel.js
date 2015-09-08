define(['backbone', 'underscore'],
    function(Backbone, _) {

        var data = {};
        var selectedData = {
            'level1':[],
            'level2':[]
        };

        function getFiltersByCategoryId(categoryId) {
            if (!categoryId) {
                return [];
            } else {

                var categoryItem = _.findWhere(data, {id: categoryId});

                if (!categoryItem || !categoryItem.children || categoryItem.children.length < 1) {
                    return [];
                } else {
                    return categoryItem.children;
                }

            }
        }

        return Backbone.Model.extend({
            initialize: function(options) {
                if(options) {
                    data = options.data;
                    this.updateFilterDataByCategoryId();
                }
            },
            updateFilterDataByCategoryId: function(categoryId) {
                
                if(categoryId) {
                    selectedData.level1 = [categoryId];
                } else {
                    selectedData.level1 = [];
                }
                selectedData.level2 = [];
                this.trigger('changeFilter');

                var filters = getFiltersByCategoryId(categoryId);
                this.set({'filters': filters});

            },
            setFilters: function(ids) {
                selectedData.level2 = ids;
                this.trigger('changeFilter');
            },
            onDestroy: function() {
                this.stopListening();
            },
            getCategoryStr: function() {
                if ( selectedData.level1.length > 0 ) {
                    return selectedData.level1.join(',');
                } else {
                    return '';
                }
            },
            getFilterStr: function () {
                if ( selectedData.level2.length > 0 ) {
                    return selectedData.level2.join(',');
                } else {
                    return '';
                }
            }
        });
    });