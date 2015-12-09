(function () {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', function (leafletData, VectorlayerService) {
		//
		var vm = this;
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
		vm.defaults = {
			scrollWheelZoom: false
		};
		vm.center = {
			lat: 0,
			lng: 0,
			zoom: 3
		};
		vm.layers = {
			baselayers: {
				xyz: {
					name: 'MapBox Outdoors Mod',
					url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=' + apiKey,
					type: 'xyz',
				}
			}
		}
		leafletData.getMap('map').then(function(map) {
			var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/'+VectorlayerService.getName()+'/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long'; //
			var layer = new L.TileLayer.MVTSource({
				url: url,
				debug: false,
				clickableLayers: [VectorlayerService.getName()+'_geom'],
				mutexToggle: true,
				getIDForLayerFeature: function(feature) {

					return feature.properties.iso_a2;
				},
				filter: function(feature, context) {

					return true;
				}
			});
			 map.addLayer(VectorlayerService.setLayer(layer));
			 var labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + apiKey);
			 map.addLayer(labelsLayer);
			 labelsLayer.bringToFront();
		});
	});
})();
