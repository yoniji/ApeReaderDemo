define(['marionette', 
    'mustache', 
    'jquery', 
    'scripts/reader/cell_view', 
    'text!templates/card.html', 
    'text!templates/empty_card.html',
    'hammerjs',
    'jquery-hammerjs'],
    function(Marionette, 
        Mustache, 
        $, 
        CellView, 
        template, 
        emptyCardTemplate,
        Hammer) {

        return CellView.extend({
            template: function(serialized_model) {
                if (serialized_model.isAction) {
                    return Mustache.render(emptyCardTemplate, serialized_model);
                } else {
                    return Mustache.render(template, serialized_model);
                }
            },
            initialize: function() {
            },
            modelEvents: {
                'toggleLikeSuccess': 'onToggleLikeSuccess'
            },
            onRender: function() {
                if (this.model.get('isAction')) {
                    this.$el.addClass('actionCard');
                }
                this.$el.hammer({
                    recognizers:[[Hammer.Tap]]
                });
            },
            onToggleLikeSuccess: function() {
                if (!this.model.get('metadata').liked) {
                    if (this.model.collection) this.model.collection.remove(this.model);
                }
                appConfig.user_info.likes --;
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
            className: 'cellWrapper cardWrapper waves-effect'
        });
    });