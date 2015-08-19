define(['backbone', 'underscore'],
    function(Backbone, _) {

        var data = {};

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
                var filters = getFiltersByCategoryId(categoryId);
                this.set({'filters': filters});
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });