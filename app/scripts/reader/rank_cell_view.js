define(['marionette', 
    'mustache', 
    'jquery', 
    'scripts/reader/cell_view', 
    'text!templates/rank_cell.html'],
    function(Marionette, Mustache, $, CellView, template) {

        return CellView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            modelEvents: {
                'change': 'onChange'
            },
            className: 'cell rankCell waves-effect'
        });
    });