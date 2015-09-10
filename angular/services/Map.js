(function(){
    "use strict";

    angular.module('app.services').factory('MapService', function(leafletData){
        //
        var leaflet = {};
        return {
          setLeafletData: function(leaf){
            leaflet = leaflet;
          },
          getLeafletData: function(){
            return leaflet;
          }
        }
    });

})();
