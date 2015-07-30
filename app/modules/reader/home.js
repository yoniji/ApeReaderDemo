define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('feeds');
            },
            defaults: {
                "status": "success",
                "code": 0,
                "message": "",
                "data": [{
                    "id": "134392805842",
                    "link": "http://www.qdaily.com/articles/12477.html",
                    "images": [{
                        "url": "http://www.qdaily.com/uploads/image/201507/aae9288b5076.jpg",
                        "width": 1080,
                        "height": 740
                    }],
                    "title": "杂志 Wallpaper* 做的汽车旅馆是什么样子？",
                    "excerpt": "作为一本杂志，wallpaper* 试水电商后的一种新尝试。",
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
                        "name": "马梦涵"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "recommend_reason": {
                        "type":"friend",
                        "relate_friends":[{
                            "name":"Wuweining"
                        },{
                            "name":"可"
                        }],
                        "relate_tags":[{"name":"商业设计"}],
                    }

                },{
                    "id": "134392805843",
                    "link": "http://www.shejiben.com/sjs/1044214/case-2851898-1.html",
                    "images": [{
                        "url": "http://pic.shejiben.com/i/upload/2015/07/27/20150727152126-3e9bb792-2s.jpg",
                        "width": 660,
                        "height": 860
                    }, {
                        "url": "http://pic1.shejiben.com/i/upload/2015/07/27/20150727152233-729d15c1-2s.jpg",
                        "width": 660,
                        "height": 912
                    }],
                    "title": "台湾重庆双宝设计机构-半山公馆靳宅府",
                    "excerpt": "案例简介 Case description 非理性撞色，玩味私宅空间",
                    "tags": [],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.shejiben.com",
                        "name": "设计本",
                        "wechat": "shejiben",
                        "bio": "找设计师，上设计本!",
                        "image": {
                            "url": "https://s-media-cache-ak0.pinimg.com/upload/162833411466191429_board_thumbnail_2015-07-24-09-57-29_6715_60.jpg",
                            "width": 60,
                            "height": 60
                        }

                    },
                    "author": {
                        "name": "周书砚-台湾双宝"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "recommend_reason": {
                        "type":"friend",
                        "relate_friends":[{
                            "name":"可"
                        }],
                        "relate_tags":[{"name":"设计思想"}],
                    }

                }, {
                    "id": "134392805844",
                    "link": "http://www.shejipi.com/58148.html",
                    "images": [{
                        "url": "http://cdn.shejipi.com/wp-content/uploads/2015/05/%E9%BB%91%E5%B7%9D%E9%9B%85%E4%B9%8B.jpg",
                        "width": 600,
                        "height": 450
                    }],
                    "title": "关于黑川雅之你不得不知道的八大审美意识",
                    "excerpt": "当我们提到黑川雅之，会提到他是建筑师、工业设计师，但你有没有深入了解过他的设计思想？大师的背后都有一定的信仰，他的信仰又是什么？",
                    "tags": [],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.shejipi.com/",
                        "name": "设计癖",
                        "wechat": "Pinterest",
                        "bio": "I Love Pinterest!",
                        "image": {
                            "url": "http://cdn.shejipi.com/wp-content/uploads/2015/03/cropped-cropped-slogan1.png",
                            "width": 233,
                            "height": 100
                        }

                    },
                    "author": {
                        "name": "爱谁谁"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "recommend_reason": {
                        "type":"tag",
                        "relate_friends":[{
                            "name":"Wuweining"
                        },{
                            "name":"可"
                        }],
                        "relate_tags":[{"name":"设计思想"}],
                    }

                }, {
                    "id": "134392805845",
                    "link": "http://www.shejiben.com/sjs/6121/case-2850488-1.html",
                    "images": [{
                        "url": "http://pic.shejiben.com/i/upload/2015/07/25/20150725151418-f5570850-2s.jpg",
                        "width": 660,
                        "height": 396
                    }, {
                        "url": "http://pic.shejiben.com/i/upload/2015/07/25/20150725151420-9134ac05-2s.jpg",
                        "width": 660,
                        "height": 396
                    }, {
                        "url": "http://pic.shejiben.com/i/upload/2015/07/25/20150725151415-9a56769a-2s.jpg",
                        "width": 660,
                        "height": 396
                    }],
                    "title": "陈德坚作品—Resort Villa样板",
                    "excerpt": "案例简介 Case description 这个度假式的家是为了一个悠闲的生活。",
                    "tags": [],
                    "counts": {
                        "views": 134,
                        "likes": 4354,
                        "comments": 0
                    },
                    "source": {
                        "url": "http://www.shejiben.com/",
                        "name": "设计本",
                        "wechat": "Pinterest",
                        "bio": "找设计师，上设计本",
                        "image": {
                            "url": "http://pic.shejiben.com/user/21/headphoto_6121.jpg?1378092462",
                            "width": 200,
                            "height": 200
                        }

                    },
                    "author": {
                        "name": "陈德坚"
                    },
                    "metadata": {},
                    "created_at": 10325249054,
                    "recommend_reason": {
                    }

                }]
            },
            initialize: function() {

            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });