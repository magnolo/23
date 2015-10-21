(function(){
    "use strict";

    angular.module('app.controllers').controller('MainCtrl', function(leafletData){
        //
        leafletData.getMap('map').then(function(map) {
          angular.forEach(map._layers, function(layer, key){
            if(typeof layer._url == "undefined" || layer._url != 'https://{s}.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'){
              debugger;
              map.removeLayer(layer._leaflet_id);
            }
          })
        });
    });

})();
