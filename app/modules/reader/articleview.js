define(['underscore','marionette', 'mustache', 'jquery', 'text!modules/reader/article.html', 'text!modules/reader/articleshell.html', 'modules/reader/postmodel'],
    function(_, Marionette, Mustache, $, coreTemplate, shellTemplate, PostModel) {

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
                'tap @ui.next': 'onTapNext',
                'tap .image': 'onTapImage',
                'panleft @ui.article': 'onPanMove',
                'panright @ui.article': 'onPanMove',
                'panend @ui.article': 'onPanEnd',
                'pancancel @ui.article': 'onPanEnd'
            },
            modelEvents: {
                'sync': 'onModelSync',
                'toggleLikeSuccess': 'onToggleLikeSuccess',
                'blockSuccess': 'onBlockSuccess'
            },
            initialize: function(options) {
                if (this.model && !this.model.isNew()) {
                    this.onModelSync();
                    this.originalRouter = window.location.hash;
                } else {
                    this.model = new PostModel();
                    this.model.set('id', options.id);
                    this.model.fetch({
                        data: {
                            'id': this.model.get('id')
                        }
                    });
                    this.originalRouter = 'explore';
                }
                
                app.appRouter.navigate('posts/' + this.model.get('id'), {
                    trigger:false,
                    replace:true
                });


            },
            onPanStart: function (ev) {
                if (!this.isPanStarted) {
                    this.isPanStarted = true;
                }
            },
            onPanMove: function (ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);

                var gesture = ev.originalEvent.gesture;

                if (this.isPanStarted) {
                    util.setElementTransform( this.$el, 'translate3d(' + (gesture.deltaX - 50) + 'px,0,0)');
                } else if ( gesture.deltaX > 50 ) {
                    this.onPanStart(ev);
                }
            },
            onPanEnd: function (ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                this.isPanStarted = false;
                var gesture = ev.originalEvent.gesture;
                
                if ( gesture && gesture.deltaX && gesture.deltaX > ($(window).width()/2) ) {
                    this.onTapBack();
                } else {
                    this.slideBack();
                }
            },
            slideBack: function(ev) {
                util.setElementTransform( this.$el, 'translate3d(0,0,0)');
            },
            onTapImage: function(ev) {
                util.preventDefault(ev);
                util.stopPropagation(ev);
                var src = $(ev.currentTarget).attr('src');
                var urls = [];
                var current = '';
                _.each( this.model.get('images'), function(img) {
                    urls.push(img.url);
                    if ( img.url.search(src) > -1 ) current = img.url;
                });
                util.previewImages(urls, current);
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
                },
                'getCreateTimeString': function() {
                    if (this.created_at) {
                        return util.getDateString(this.created_at);
                    }
                }
            },
            onModelSync: function() {
                this.render();
                var share_info = _.clone(appConfig.share_info);
                share_info.timeline_title = this.model.get('title');
                share_info.message_title = this.model.get('title');
                share_info.message_description = this.model.get('excerpt');
                if ( this.model.hasCoverImage()) {
                    var img = _.clone(this.model.get('images')[0]);
                    img.url = img.url + '@180w_180h_1e_1c';
                    share_info.image = img;
                }

                util.setWechatShare(share_info);
            },
            isFormated: function() {
                return !!this.model.get('metadata').formated;
            },
            onRender: function() {
                $('body').append(this.$el);

                var articleHeight = $(window).height() - this.ui.toolBar.height();
                this.ui.article.css('height', articleHeight);

                this.model.markViewed();
            },
            onTapBack: function() {
                this.destroy();
            },
            onToggleLike: function() {
                util.setIconToLoading(this.ui.like.find('.icon'));
                this.model.toggleLike();
            },
            onToggleLikeSuccess: function() {
                if( this.model.get('metadata').liked ) {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart3 main-color');
                } else {
                    util.revertIconFromLoading(this.ui.like.find('.icon'), 'icon icon-heart2');
                }
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
            onBlockSuccess: function () {
                this.onTapBack();
            },
            onShow: function() {

            },
            onDestroy: function() {
                this.stopListening();
                this.$el.remove();
                
                app.appRouter.navigate(this.originalRouter, {
                    trigger:false,
                    replace:true
                });

                util.setWechatShare(window.appConfig.share_info);
            },
            className: 'articleWrapper'
        });
    });