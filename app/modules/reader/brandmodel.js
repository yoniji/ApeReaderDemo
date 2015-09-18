define(['backbone', 'jquery', 'underscore'],
    function(Backbone, $, _) {
        function markSelected(array, selectedId) {
            if (selectedId) {
                var selectedBrand = _.findWhere(array,{'id': selectedId});
                selectedBrand.selected = true;
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
                if (options && options.brands && options.brands.length > 0) {
                    markSelected(options.brands, this.selectedBrand);
                    this.set({
                        'brands':options.brands
                    });
                } else if ( !this.tryFetchFromSession() ){
                    this.fetch();
                }
            },
            parse: function(response) {
                markSelected(response, this.selectedBrand);

                if (util.supportSessionStorage()) {
                    sessionStorage.brands = JSON.stringify(response);
                }
                
                return response;
            },
            tryFetchFromSession: function() {
                if (util.supportSessionStorage()) {
                    if (sessionStorage.brands) {
                        var brands = JSON.parse(sessionStorage.brands);
                        markSelected(brands.brands, this.selectedBrand);
                        this.set(brands);
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
                    var selectedBrand = _.findWhere(this.get('brands'),{'id': id});
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