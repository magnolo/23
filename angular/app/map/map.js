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
						url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=' + apiKey,
						type: 'xyz',
					}
				}
			}
		});

		MapService.setLeafletData(leafletData.getMap('map'));

	});
})();
