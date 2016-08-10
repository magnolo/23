(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportStyleCtrl', function($scope, $state, $timeout, ContentService, ExportService, IndizesService, leafletData, leafletMapEvents, VectorlayerService, CountriesService, ColorHandleService) {
		var vm = this;
		vm.ColorHandle = ColorHandleService;
		vm.exporter = {};
		vm.item = {};
		vm.colorHandles = [new vm.ColorHandle('rgba(0, 0, 0, 1.00)', 0.00), new vm.ColorHandle('rgba(0, 0, 0, 0.00)', 1.00)]
		vm.continentOptions = {
			onlyWithChildren: true
		};
		vm.gradient = [
			{
				color:'rgba(255,12,17,0.5)',
				pos: 0,
				alpha:1,
				id: Math.random()
			},
			{
				color:'#00ff00',
				pos: 50,
				alpha:1,
				id: Math.random()
			},
			{
				color:'#0000ff',
				pos: 100,
				alpha:1,
				id: Math.random()
			},
		]
		activate();

		function activate() {

			$timeout(function() {
				vm.exporter = ExportService.exporter;
				// if(!vm.exporter.items.length) $state.go('app.index.exports.details',{
				//   id: $state.params.id,
				//   name: $state.params.name
				// })
				vm.item = getActiveItem(vm.exporter.items, $state.params.styleId);
				if (typeof vm.item == "undefined") $state.go('app.index.exports.details', {
					id: $state.params.id,
					name: $state.params.name
				});
				if (!vm.item.style) {
					vm.item.style = {
						basemap_id: 0,
						fixed_title: false,
						fixed_description: false,
						search_box: true,
						share_options: true,
						zoom_controls: true,
						scroll_wheel_zoom: false,
						layer_selection: false,
						legends: true,
						full_screen: false,
						countries: []
					};
				}
				ContentService.fetchIndicatorWithData(vm.item.indicator_id, function(indicator) {
					vm.data = indicator.data;
					vm.structure = indicator;

					VectorlayerService.setData(indicator.data, indicator, vm.item.style.base_color, true);
					CountriesService.getContinents(function(continents) {
						vm.continents = continents
					}, vm.item.indicator_id);

				}, {
					data: true
				});
			});
		}

		function getActiveItem(list, id) {
			var found;
			angular.forEach(list, function(item) {
				if (item.id == id) {
					found = item;
				} else {
					if (item.children && !found)
						found = getActiveItem(item.children, id);
				}
			});
			return found;
		};


		$scope.$watch('vm.item.style', function(n, o) {
			if (n === o || !n.basemap) return;
			VectorlayerService.setBaseLayer(n.basemap);
			VectorlayerService.paint(n.base_color);
		}, true);
	});

})();
