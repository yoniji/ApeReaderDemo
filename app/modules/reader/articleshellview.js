define(['modules/reader/articleview', 'mustache', 'jquery', 'text!modules/reader/articleshell.html'],
    function(ArticleView, Mustache, $, template) {

        return ArticleView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            initialize: function(options) {
                this.render();
            },
            onRender: function() {
                $('body').append(this.$el);
                this.ui.article.height($(window).height()- this.ui.toolBar.height());
            },
            onTapBack: function() {
                this.destroy();
            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'articleShellWrapper'
        });
    });