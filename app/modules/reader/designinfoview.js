define(['backbone', 
    'underscore', 
    'marionette', 
    'mustache', 
    'jquery', 
    'text!modules/reader/designinfo.html', 
    'iscroll'],
    function(
        Backbone,
        _ , 
        Marionette, 
        Mustache, 
        $, 
        template) {

        var styleList = ['20s','30s40s', '50s', '60s', '70s', '80s', '90s', '00s'];
        var countryData = [
            {
                "code": "italy",
                "description": "必须有一件大师设计的家具。<br>不打隔断，保持宽敞通风的感觉。<br>每一件配饰都要既有型又有用。<br>最后，一定要有华丽的绘画，提升房间的格调。"
            },
            {
                "code": "france",
                "description": "所有织物上都要有精致的图案，特别是沙发。<br>看起来温暖而可爱的乡村风小饰品。<br>要有华丽精美的光照，树枝型的吊灯就是很好的选择。<br>颜色绝不能中规中矩，要混搭。"
            },
            {
                "code": "japan",
                "description": "用推拉门构造灵活的居住空间。<br>选择最自然的纸质灯罩和竹制家具。<br>东方风格的装饰：用关键配饰上的细致图案提升房间的品味。<br>养一些小型绿植，增加一抹平静而自然的色彩，为房间带来生气。"
            },
            {
                "code": "sweden",
                "description": "保持简单：为墙壁和家具选择基本的图案和自然的颜色。<br>自然光：用木制百叶窗替代厚重的窗帘。<br>不要混乱：保持表面干净整洁，强调极简。<br>环保生活：践行地道的北欧文化。"
            },
            {
                "code": "denmark",
                "description": "保持简单：为墙壁和家具选择基本的图案和自然的颜色。<br>自然光：用木制百叶窗替代厚重的窗帘。<br>不要混乱：保持表面干净整洁，强调极简。<br>环保生活：践行地道的北欧文化。"
            },
            {
                "code": "china",
                "description": "极简布局：平静而放松的环境。<br>天花板：精雕细琢的木结构天花板，给人传统的感觉。<br>对称：家具直线排列，对称有序。<br>屏风：用屏风分隔空间，给人充满细节的装饰感。"
            },
            {
                "code": "us",
                "description": "设计巧妙的隐藏储物空间，把乱糟糟的东西收起来。<br>选择深色木制家具，为房间创造更丰富的观感。<br>乡村风&淡色的织物可以让空间看起来更宽敞。<br>固定的照明：增加高贵的感觉。"
            },
            {
                "code": "spain",
                "description": "很容易掌握的一种热情洋溢的地中海风格。<br>墙面：用海绵和刷子，把灰泥刷出笔触的感觉。很多传统的西班牙家中还会有木制窗户、带浮雕的天花板、瓷砖装饰的横梁。<br>地面：最传统的地面会用硬木，也可以用石板、陶瓷砖或者深色的灌浆，再铺上一大块编织地毯。<br>家具：直背的皮革扶手椅，深色的木质长椅。木头椅子上搭配棉织的软垫。"
            }
        ];

        function getDescriptionByCountryCode(code) {
            var result = _.findWhere(countryData, { 'code': code });
            if ( result && result.description ) {
                return result.description;
            }
            return false;
        }

        var decadesData = [{
            "styleName": "装饰主义",
            "styleNameEn": "Art Deco",
            "code":"20s",
            "title":"20年代",
            "startYear":"00s",
            "description":"大胆的色彩和图案。清晰的折角。深红，亮蓝，黑色，青色和橙色。",
            "duration":"three-decade"
        },
        {
            "styleName": "现代主义",
            "styleNameEn": "Modernist",
            "code":"30s40s",
            "title":"30-40年代",
            "startYear":"30s",
            "description":"简单干净。对比强烈的颜色和材质。灰色，红色，黑色，白色，橙色。",
            "duration":"two-decade"
        },
        {
            "styleName": "中世纪现代",
            "styleNameEn": "Mid-century Modern",
            "code":"50s",
            "title":"50年代",
            "startYear":"50s",
            "description":"干净，极简的线条。预料不到的色彩。蓝色、绿色、赭色、粉色。",
            "duration":""
        },
        {
            "styleName": "极简主义",
            "styleNameEn": "Minimalist",
            "code":"60s",
            "title":"60年代",
            "startYear":"60s",
            "description":"深受日本设计的影响，强调负空间。红色、黄色、蓝色、黑色、白色。",
            "duration":""
        },
        {
            "styleName": "自我表现",
            "styleNameEn": "Self Expression",
            "code":"70s",
            "title":"70年代",
            "startYear":"70s",
            "description":"高科技和自然元素有机结合结合。大胆的图案。砖红，金色，绿色，粉红和赭色。",
            "duration":""
        },
        {
            "styleName": "新现代",
            "styleNameEn": "The New Modern",
            "code":"80s",
            "title":"80年代",
            "startYear":"80s",
            "description":"印花图案，垫得又软又厚的家具。酒红色，金色，粉色，米黄色和淡紫色。",
            "duration":""
        },
        {
            "styleName": "个人主义",
            "styleNameEn": "Individualist",
            "code":"90s",
            "title":"90年代",
            "startYear":"90s",
            "description":"受装饰艺术，极简和现代主义的影响。金属和玻璃的装饰。灰色，米黄色，狩猎绿，桃红，薄荷绿。",
            "duration":""
        },
        {
            "styleName": "折衷主义",
            "styleNameEn": "Eclecticism",
            "code":"00s",
            "title":"2000年之后",
            "startYear":"00s",
            "description":"兼具功能性和纯熟的舒适感。既结合了不同风格的元素，又有统一的主题。海军蓝，亮蓝，棕色，橙色，琥珀黄，紫色和橄榄绿。",
            "duration":"two-decade"
        }];
         var widthPerYear = 20;
        return Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {
                'close': '.close',
                'inner': '.designInfoInner'
            },
            events: {
                'tap @ui.close': 'onTap',
                'touchmove': 'onTouchMove'
            },
            initialize: function(options) {
                this.render();
            },
            templateHelpers: function() {
                var ratio = util.getDeviceRatio();
               var avatarSize = 64;
               var listThumbSize = 72;
                return {
                    getYearOfDesignStyle: function() {
                        var year = this.year_of_design;
                        return 'left:' + (year - 1900) *widthPerYear + 'px';
                    },
                    getTimelineStyle: function() {
                        var year = 2020-1900;
                        return 'width:' + year * widthPerYear + 'px';
                    },
                    'isDesignerVisible': function() {
                        if ( !this.designer || this.designer.length < 1) {
                            return false;
                        }
                        if (this.designer[0].id === 0) {
                            return false;
                        }
                        return true;
                    },
                    'getFirstDesigner': function() {
                        return this.designer[0];
                    },
                    'getAvatarSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(avatarSize * ratio) + 'w_' + Math.round(avatarSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getAvatarSizeCss': function() {
                        var outStr = '';
                        outStr += 'width:' + avatarSize + 'px;height:' + avatarSize + 'px;';
                        return outStr;
                    },
                    'getListThumbSuffix': function() {
                        var outStr = '';
                        outStr += '@' + Math.round(listThumbSize * ratio) + 'w_' + Math.round(listThumbSize * ratio) + 'h_1e_1c';
                        return outStr;
                    },
                    'getYearOfDesignCode': function() {
                        if ( this.year_of_design < 1900 ) {return '00s';}

                        if ( this.year_of_design < 1930 ) {return '20s';}

                        if ( this.year_of_design < 1950 ) {return '30s40s';}

                        if ( this.year_of_design < 1960 ) {return '50s';}

                        if ( this.year_of_design < 1970 ) {return '60s';}

                        if ( this.year_of_design < 1980 ) {return '70s';}

                        if ( this.year_of_design < 1990 ) {return '80s';}

                        return '00s';

                    },
                    'isYearsBlockVisible': function() {
                        if ( this.year_of_design && this.year_of_design > 1900) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    'isCountryBlockVisible': function() {
                        if ( this.country && getDescriptionByCountryCode(this.country.code)) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    'getDecadesData': function() {
                        return decadesData;
                    },
                    'getDotsHtml': function() {
                        var outStr = '';
                        for (var i = 1; i < 6; i++ ) {
                            outStr += '<div class="net-dot">';
                            outStr += '<img class="net-dot-img" src="http://imgopt.apecrafts.com/design/style-';
                            outStr += this.style.code;
                            outStr += '-' + i +'.jpg@112w_112h_1e_1c">';
                            outStr += '</div>';
                        }
                        return outStr;
                    },
                    'getYearsGallaryHtml': function() {
                        var outStr = '';
                        for (var i = 1; i < 5; i++ ) {
                            outStr += '<div class="years-gallary-thumb">';
                            outStr += '<img src="http://imgopt.apecrafts.com/design/years-';
                            outStr += this.code;
                            outStr += '-' + i +'.jpg@128w_128h_1e_1c">';
                            outStr += '</div>';
                        }
                        return outStr;
                    },
                    getCountryDescription: function() {
                        return getDescriptionByCountryCode(this.country.code);
                    }
                };
            },
            onRender: function() {
                var self = this;

                this.$el.addClass('slideInUp');
                    var to = setTimeout(function() {
                        self.$el.removeClass('slideInUp');
                        clearTimeout(to);
                }, 300);

                $('body').append(this.$el);
                this.$el.focus();

                this.ui.inner.css('height', $(window).height());


                if ( this.model.has('year_of_design') && this.model.get('year_of_design')>1900) {

                    var designYear = this.model.get('year_of_design');

                    this.scroller = new IScroll(this.$el.find('.designInfo-years')[0], {
                        'scrollX': true,
                        'scrollY': false,
                        'bindToWrapper':true,
                        'snap':'.timeline-item',
                        'eventPassthrough':true
                    });
                    
                    this.scroller.on('scrollEnd', function() {
                        var index = this.currentPage.pageX;

                        if (index===0 && this.x === this.maxScrollX ) return;

                        if (index < styleList.length) {
                            self.$el.find('.designInfo-years').attr('class', 'designInfo-years designInfo-block years-' + styleList[index]);
                        }
                    });

                    var scrollToX = (designYear - 1900) *widthPerYear - $(window).width()/2;

                    scrollToX = Math.max( this.scroller.maxScrollX - 1 , -scrollToX );

                    this.scroller.scrollTo(scrollToX,0);
                }
            },
            slideOut: function() {
                var self = this;
                this.$el.addClass('slideOutDown');
                this.outTimer = setTimeout(function() {
                    if(self.outTimer) clearTimeout(self.outTimer);
                    self.destroy();
                }, 300);
                $('.productWrapper').last().focus();

            },
            onTap: function(ev) {
                this.slideOut();
                util.preventDefault(ev);
                util.stopPropagation(ev);
            },
            onTouchMove: function(ev) {
                util.stopPropagation(ev);
            },
            onDestroy: function() {
                if (this.scroller) this.scroller.destroy();
                this.stopListening();
                this.$el.remove();
            },
            className: 'designInfoWrapper'
        });
    });