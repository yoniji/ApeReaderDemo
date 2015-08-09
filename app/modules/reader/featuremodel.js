define(['backbone', 'jquery'],
    function(Backbone, $) {

        function setRankNumber(data) {
            for (var i = 0; i < data.length; i++ ) {
                data[i].rank = i+1;
            }
        }

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('feature') + 'today';
            },
            defaults: {
                "status": "success",
                "code": 0,
                "message": "",
                "data": [{
                    "id": "134392805842",
                    "link": "http://www.qdaily.com/articles/12693.html",
                    "images": [{
                        "url": "http://www.qdaily.com/uploads/image/201507/b82f98b81f08.jpg",
                        "width": 655,
                        "height": 437
                    }],
                    "title": "50平米的小店要做出大感觉，一个扇形货架就能做到",
                    "excerpt": "小空间的店铺可以使用这样的柜子。",
                    "tags": [{},{}],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.qdaily.com",
                        "name": "好奇心日报",
                        "wechat": "Qdaily",
                        "bio": "你感兴趣的商业新闻",
                        "image": {
                            "url": "http://www.qdaily.com/img/display2/logo-q.png",
                            "width": 61,
                            "height": 129
                        }

                    },
                    "author": {
                        "name": "石玉"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "rank":1

                },{
                    "id": "134392805843",
                    "link": "http://www.archdaily.cn/cn/624501/wilhelminiangong-yu-berlinrodeo",
                    "images": [{
                        "url": "http://images.adsttc.com.quantil.com/media/images/5012/f887/28ba/0d06/5800/0913/medium_jpg/stringio.jpg?1414047050",
                        "width": 528,
                        "height": 302
                    }],
                    "title": "Wilhelminian公寓 / BERLINRODEO",
                    "excerpt": "来自建筑师。BERLINRODEO，一个位于柏林的室内设计概念公司向我们分享了他们关于Wilhelminian公寓的创新构想。后面有建筑师带来的更多图片及描述。",
                    "tags": [],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.archdaily.cn/cn",
                        "name": "Arch Daily",
                        "wechat": "archdailycn",
                        "bio": "世界最受欢迎的建筑网站",
                        "image": {
                            "url": "http://assets.adsttc.com/doodles/archdaily.png",
                            "width": 290,
                            "height": 150
                        }

                    },
                    "author": {
                        "name": "BERLINRODEO"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "rank":2

                }, {
                    "id": "134392805844",
                    "link": "http://www.qdaily.com/articles/12122.html",
                    "images": [{
                        "url": "http://www.qdaily.com/uploads/image/201507/ee6f115da58b.jpg",
                        "width": 1080,
                        "height": 720
                    }],
                    "title": "做设计师不是比谁聪明，有时候，这是个笨活|100个有想法的人",
                    "excerpt": "建筑师周维说，做设计就像做寿司一样，当你的手对片鱼这件事情有了感觉，把简纯的事情做到极致，自然会发现你的寿司已经和别人的不一样。",
                    "tags": [],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.qdaily.com",
                        "name": "好奇心日报",
                        "wechat": "Qdaily",
                        "bio": "你感兴趣的商业新闻",
                        "image": {
                            "url": "http://www.qdaily.com/img/display2/logo-q.png",
                            "width": 61,
                            "height": 129
                        }

                    },
                    "author": {
                        "name": "爱谁谁"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "rank":3

                }]
            },
            initialize: function() {

            },
            onDestroy: function() {
            }
        });
    });