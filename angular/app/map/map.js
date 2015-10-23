(function () {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', function ($scope, $rootScope, $timeout, MapService, leafletData, $http) {
		//
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
		$scope.center = {
			lat: 0,
			lng: 0,
			zoom: 3
		};
		$scope.defaults = {
			scrollWheelZoom: false
		};
		angular.extend($rootScope, {
			center: {
				lat: 0,
				lng: 0,
				zoom: 3
			},
			layers: {
				baselayers: {
					xyz: {
						name: 'MapBox Pencil',
						url: 'https://{s}.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + apiKey,
						type: 'xyz',
					}
				},
				overlays: {
					demosutfgrid: {
						name: 'UTFGrid Interactivity',
						type: 'utfGrid',
						url: 'http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}',
						visible: true
					},
				}
			}
		});


/*mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
mapboxgl.util.getJSON('https://api.mapbox.com/styles/v1/mapbox/streets-v8?access_token=' + mapboxgl.accessToken, function (err, style) {
    if (err) throw err;

    style.layers.forEach(function (layer) {
				if(layer['source-layer'] == "admin"){
        layer.interactive = true;
				console.log(layer);
			}
    });

    var map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: [-96, 37.8],
        zoom: 3
    });

    map.on('mousemove', function (e) {
        map.featuresAt(e.point, {radius: 5}, function (err, features) {
            if (err) throw err;
            console.log(JSON.stringify(features, null, 2));
        });
    });
});*/
		$scope.interactivity = "";
		$scope.flag = "";
		$scope.$on('leafletDirectiveMap.utfgridMouseover', function (event, leafletEvent) {
			//$scope.interactivity = leafletEvent.data.admin;
			//$scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;

		});
		$scope.$on('leafletDirectiveMap.utfgridMouseout', function (event, leafletEvent) {
			$scope.interactivity = "";
			$scope.flag = "";
		});
		MapService.setLeafletData(leafletData.getMap('map'));

	});
})();
