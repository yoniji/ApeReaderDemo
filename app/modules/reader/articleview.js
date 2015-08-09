define(['marionette', 'mustache', 'jquery', 'text!modules/reader/article.html', 'text!modules/reader/articleshell.html', 'modules/reader/postmodel'],
    function(Marionette, Mustache, $, coreTemplate, shellTemplate, PostModel) {

        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                if (serialized_model.metadata.formated) {
                    return Mustache.render(coreTemplate, serialized_model);
                } else {
                    return Mustache.render(shellTemplate, serialized_model);
                }
            },
            ui: {
                'toolBar': '.toolBar',
                'back': '.toolBar-back',
                'article': '.article',
                'credit': '.creditItem'
            },
            events: {
                'tap @ui.back': 'onTapBack',
                'tap .toolBar-like': 'onToggleLike',
                'tap .toolBar-share': 'onTapShare',
                'tap .toolBar-next': 'onTapNext'
            },
            modelEvents: {
                'sync': 'onModelSync'
            },
            initialize: function(options) {
                if (this.model&&!this.model.isNew()) {
                    this.onModelSync();
                } else {
                    this.model = new PostModel();
                    this.model.set('id', options.id);
                    this.model.fetch();
                }
                
            },
            onModelSync: function() {
                this.render();
            },
            isFormated: function() {
                return !!this.model.get('metadata').formated;
            },
            onRender: function() {
                $('body').append(this.$el);

                var articleHeight = $(window).height() - this.ui.toolBar.height();
                if (this.isFormated())  articleHeight-=this.ui.credit.height();
                this.ui.article.height(articleHeight);
            },
            onTapBack: function() {
                this.destroy();
            },
            onToggleLike: function() {
                this.model.like();
            },
            onTapShare: function() {
                this.model.share();
            },
            onTapNext: function() {

            },
            onShow: function() {

            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
            },
            className: 'articleWrapper'
        });
    });