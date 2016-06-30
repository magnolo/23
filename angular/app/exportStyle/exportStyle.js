(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportStyleCtrl', function($scope, $state, $timeout, ExportService, IndizesService, leafletData, leafletMapEvents, VectorlayerService, CountriesService) {
		var vm = this;
		vm.exporter = {};
		vm.item = {};
		vm.continentOptions = {
			children: 'countries'
		};
		activate();

		function activate() {
			CountriesService.getContinents(function(continents) {
				vm.continents = continents
			});
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
						full_screen: false
					};
				}
				vm.index = IndizesService.fetchData(vm.item.indicator_id);
				vm.index.promises.data.then(function(structure) {
					vm.index.promises.structure.then(function(data) {
						vm.data = data;
						vm.structure = structure;
						VectorlayerService.setData(vm.structure, vm.data, vm.item.style.baseColor, true);

					});
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