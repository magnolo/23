(function() {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', function($scope, $rootScope, $mdMenu, $state, VectorlayerService) {
		//


		var vm = this;
		mapboxgl.accessToken = VectorlayerService.keys.mapbox;
		vm.VectorlayerService = VectorlayerService;
		vm.VectorlayerService.createMap();

		
	});
})();
