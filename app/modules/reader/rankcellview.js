define(['marionette', 
    'mustache', 
    'jquery', 
    'modules/reader/cellview', 
    'text!modules/reader/rankcell.html'],
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