define(['backbone', 'jquery'],
    function(Backbone, $) {

        return Backbone.Model.extend({
            defaults: {
                'products': [{
                    'id':'4343543',
                    'name': '702 Lady',
                    'style': [{
                        'id':'1',
                        'name':'现代'
                    }],
                    'category': {
                        'id':1,
                        'name':'客厅/书房'
                    },
                    'sub_category': {
                        'id':5,
                        'name':'沙发和扶手椅'
                    },
                    'price': {
                        'rmb': {
                            'high':19500,
                            'low':14500
                        }
                    },
                    'description': 'Armchair with internal seat and backrest steel frame',
                    'translated_description': '􏰬􏰭􏰮􏰯􏰰􏰧与颞部作为和靠背扶手⼀一可定􏰨􏰩􏰱􏰲􏰬􏰳两􏰴􏰵后定􏰨􏰶',
                    
                    'brand': {
                        'id':'235420854',
                        'name': 'cassina',
                        'translated_name': '卡西那'
                    },
                    'collection':'Vifa',
                    'cover_image': {
                        'url': 'http://imgopt.apecrafts.com/products/test-product-1.jpg',
                        'width':1,
                        'height':1,
                        'type':'oss'

                    },
                    'images': [
                    ]
                },
                {
                    'id':'4343542',
                    'name': '702 Lady',
                    'style': [{
                        'id':'1',
                        'name':'现代'
                    }],
                    'category': {
                        'id':1,
                        'name':'客厅/书房'
                    },
                    'sub_category': {
                        'id':5,
                        'name':'沙发和扶手椅'
                    },
                    'price': {
                        'rmb': {
                            'high':19500,
                            'low':14500
                        }
                    },
                    'description': 'Armchair with internal seat and backrest steel frame',
                    'translated_description': '􏰬􏰭􏰮􏰯􏰰􏰧与颞部作为和靠背扶手⼀一可定􏰨􏰩􏰱􏰲􏰬􏰳两􏰴􏰵后定􏰨􏰶',
                    
                    'brand': {
                        'id':'235420854',
                        'name': 'cassina',
                        'translated_name': '卡西那'
                    },
                    'collection':'Vifa',
                    'cover_image': {
                        'url': 'http://imgopt.apecrafts.com/products/test-product-2.jpg',
                        'width':1,
                        'height':1,
                        'type':'oss'

                    },
                    'images': [
                    ]
                },
                {
                    'id':'4343549',
                    'name': '702 Lady',
                    'style': [{
                        'id':'1',
                        'name':'现代'
                    }],
                    'category': {
                        'id':1,
                        'name':'客厅/书房'
                    },
                    'sub_category': {
                        'id':5,
                        'name':'沙发和扶手椅'
                    },
                    'price': {
                        'rmb': {
                            'high':19500,
                            'low':14500
                        }
                    },
                    'description': 'Armchair with internal seat and backrest steel frame',
                    'translated_description': '􏰬􏰭􏰮􏰯􏰰􏰧与颞部作为和靠背扶手⼀一可定􏰨􏰩􏰱􏰲􏰬􏰳两􏰴􏰵后定􏰨􏰶',
                    
                    'brand': {
                        'id':'235420854',
                        'name': 'cassina',
                        'translated_name': '卡西那'
                    },
                    'collection':'Vifa',
                    'cover_image': {
                        'url': 'http://imgopt.apecrafts.com/products/test-product-3.jpg',
                        'width':1,
                        'height':1,
                        'type':'oss'

                    },
                    'images': [
                    ]
                }]
            },
            url: function() {
                return urls.getServiceUrlByName('products');
            },
            initialize: function() {

            },
            parse: function(response) {
                return response;
            },
            onDestroy: function() {
                this.stopListening();
            }
        });
    });