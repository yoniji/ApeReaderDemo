define(['marionette', 'mustache', 'jquery', 'text!modules/reader/feature.html', 'modules/reader/streamview', 'modules/reader/featuremodel', 'modules/reader/postcollection', 'modules/reader/rankcellview', 'dropdown'],
    function(Marionette, Mustache, $, template, StreamView, FeatureModel, PostCollection, RankCellView, DropDownControl) {

        return StreamView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function() {
                this.model = new FeatureModel();
                this.model.fetch();
            },
            id: 'feature',
            className: 'rootWrapper',
            childViewContainer: '#rankCells',
            childView: RankCellView
        });
    });