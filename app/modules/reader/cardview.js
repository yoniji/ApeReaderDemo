define(['marionette', 'mustache', 'jquery', 'modules/reader/cellview', 'text!modules/reader/card.html', 'text!modules/reader/cardaction.html'],
    function(Marionette, Mustache, $, CellView, template, actionTemplate) {

        return CellView.extend({
            template: function(serialized_model) {
                if (serialized_model.isAction) {
                    return Mustache.render(actionTemplate, serialized_model);
                } else {
                    return Mustache.render(template, serialized_model);
                }
            },
            initialize: function() {
            },
            onRender: function() {
                if (this.model.get('isAction')) {
                    this.$el.addClass('actionCard');
                }
            },
            templateHelpers: function() {
                var self = this;
                var windowWidth = $(window).width();
                var containerWidth = Math.round(windowWidth * 0.48);
                var containerHeight = Math.round(windowWidth * 0.382);
                return {
                    'getCoverHtml': function() {
                        var outStr = '';
                        outStr += '<div class="coverImage" style="width:100%;height:' + containerHeight + 'px">';
                        if (this.images && this.images.length > 0) {
                            outStr += util.generateImageHtml(this.images[0], {
                                width: containerWidth,
                                height: containerHeight
                            });
                        }
                        outStr += '</div>';

                        return outStr;

                    },
                    'getCreateTimeString': function() {
                        if (this.created_at) {
                            return util.getDateString(this.created_at);
                        }
                    }
                };
            },
            className: 'cellWrapper cardWrapper'
        });
    });