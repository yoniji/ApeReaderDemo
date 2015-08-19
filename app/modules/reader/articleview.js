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
                'like': '.toolBar-like',
                'share': '.toolBar-share',
                'block': '.toolBar-block',
                'next': '.toolBar-next',
                'article': '.article',
                'credit': '.creditItem'
            },
            events: {
                'tap @ui.back': 'onTapBack',
                'tap @ui.like': 'onToggleLike',
                'tap @ui.share': 'onTapShare',
                'tap @ui.block': 'onTapBlock',
                'tap @ui.next': 'onTapNext'
            },
            modelEvents: {
                'sync': 'onModelSync',
                'change:metadata': 'onMetadataChange'
            },
            initialize: function(options) {
                if (this.model && !this.model.isNew()) {
                    this.onModelSync();
                } else {
                    this.model = new PostModel();
                    this.model.set('id', options.id);
                    this.model.fetch();
                }

            },
            templateHelpers: {
                'getTagsHtml': function() {
                    var outStr = '';
                    if (this.tags && this.tags.length > 0) {
                        outStr += '<i class="icon icon-pricetags"></i> ';
                        for (var i = 0; i < this.tags.length; i++) {
                            outStr += this.tags[i].name + ' ';
                        }
                    }

                    return outStr;
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
                this.ui.article.height(articleHeight);
            },
            onTapBack: function() {
                this.destroy();
            },
            onToggleLike: function() {
                util.setIconToLoading(this.ui.like.find('.icon'));
                this.model.toggleLike();
            },
            onMetadataChange: function() {
                console.log('here');
            },
            onTapShare: function() {
                this.model.markShared();
            },
            onTapNext: function() {

            },
            onTapBlock: function() {
                util.setIconToLoading(this.ui.block.find('.icon'));
                this.model.block();
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