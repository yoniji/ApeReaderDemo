define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/topitem.html'],
    function(Marionette, Mustache, $,CellView, template, ArticleShellView) {

        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {


            },
            className: 'cellWrapper topItemWrapper'
        });
    });