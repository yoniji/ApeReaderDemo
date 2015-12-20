define(['backbone', 'jquery', 'underscore'],
    function(Backbone, $, _) {
        function markSelected(array, selectedId) {
            if (selectedId) {
                var selectedBrand = _.findWhere(array, {
                    'id': selectedId
                });
                if (selectedBrand) selectedBrand.selected = true;
            }
        }
        return Backbone.Model.extend({
            url: function() {
                return urls.getServiceUrlByName('brands');
            },
            selectedBrand: '',
            initialize: function(options) {
                if (options && options.selectedBrand) {
                    this.selectedBrand = options.selectedBrand;
                }
            },
            setBrands: function(brands) {
                if (brands && brands.length > 0) {
                    markSelected(brands, this.selectedBrand);
                    this.set({
                        'brands': brands
                    });
                }
            },
            search: function(filterJSON) {
                var self = this;
                if (!filterJSON && this.tryFetchFromSession() ) {
                    return;
                }

                util.ajax({
                    url: this.url(),
                    data: filterJSON,
                    success: function(response) {

                        var data = {
                            "brands": []
                        };
                        data.brands = response.data;

                        if (!filterJSON && util.supportSessionStorage()) {
                            sessionStorage.brands = JSON.stringify(data);
                        }

                        markSelected(data, this.selectedBrand);
                        self.set(data);
                        self.trigger('sync');
                    }
                });
            },
            tryFetchFromSession: function() {
                if (util.supportSessionStorage()) {
                    if (sessionStorage.brands) {
                        var brands = JSON.parse(sessionStorage.brands);
                        markSelected(brands.brands, this.selectedBrand);
                        this.set(brands);
                        this.trigger('sync');
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            getBrandById: function(id) {
                if (this.has('brands') && this.get('brands').length > 0) {
                    var selectedBrand = _.findWhere(this.get('brands'), {
                        'id': id
                    });
                    return selectedBrand;
                } else {
                    return null;
                }
            },
            onDestroy: function() {
                this.trigger('destroy');
                this.stopListening();
            }
        });
    });