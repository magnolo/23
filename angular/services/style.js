/**
 * @ngdoc service
 * @name app.StyleService
 * @requires DataService
 * @requires $filter
 *
 * @description
 * CRUD for Styles, uses DataService.
 * TODO Move content into this service ,away from the content service
 */

(function(){
    "use strict";

    angular.module('app.services').factory('StyleService', function(DataService, $filter){
        //
        return {
            content: {
                styles:[]    
            },
            fetchStyles: function(filter) {
                return this.content.styles = DataService.getAll('styles', filter).$object;
            },
            getStyles: function(filter) {
                if (this.content.styles.length == 0) {
                    return this.fetchStyles(filter);
                }
                return this.content.styles;
            },
            saveStyle: function (item) {
                return DataService.post('styles', item);
            },
            updateStyle: function (id, item) {
                return DataService.update('styles/', id, item);
            },
            removeStyle: function (id) {
                return DataService.remove('styles/', id);
            }
        }
    });

})();
