(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportStyleCtrl', function($scope, $timeout, $state, ContentService, ExportService, IndizesService, leafletData, leafletMapEvents, VectorlayerService, CountriesService, ColorHandleService, DialogService) {
		var vm = this;
		vm.ColorHandle = ColorHandleService;
		vm.addColorRange = addColorRange;
		vm.removeColorRange = removeColorRange;
		vm.exporter = {};
		vm.item = {};
		vm.colorHandles = [];
		vm.continentOptions = {
			onlyWithChildren: true
		};


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
						countries: [],
						color_range: [new vm.ColorHandle('rgba(0, 0, 0, 0.60)', 0.00), new vm.ColorHandle('rgba(255, 0, 0, 0.60)', 1.00)]
					};
				} else {
					if (typeof vm.item.style.color_range == "string") {
						vm.item.style.color_range = JSON.parse(vm.item.style.color_range);
					}
				}

				ContentService.fetchIndicatorWithData(vm.item.indicator_id, function(indicator) {
					vm.data = indicator.data;
					vm.structure = indicator;

					VectorlayerService.setData(indicator.data, indicator, vm.item.style.color_range || vm.item.style.base_color, true);
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

		function addColorRange() {
			vm.item.style.color_range = [
				new vm.ColorHandle('rgba(102,102,102,0.6)', 0.00),
				new vm.ColorHandle(vm.item.style.base_color, 0.53),
				new vm.ColorHandle('rgba(255,255,255,0.6)', 1.00)
			];
			VectorlayerService.paint(vm.item.style.color_range);
		}

		function removeColorRange() {
			vm.item.style.color_range = undefined;
			VectorlayerService.paint(vm.item.style.base_color);
		}

		var timeoutPromise;
		var delayInMs = 500;
		$scope.$watch('vm.item.style', function(n, o) {
			$timeout.cancel(timeoutPromise);
			timeoutPromise = $timeout(function() {
				if (n === o || !n.basemap) return;
				VectorlayerService.setBaseLayer(n.basemap);
				//Choose between color and range
				VectorlayerService.paint(n.color_range || n.base_color);
			}, delayInMs);
		}, true);


		//Stuff for the Gradient Designer
		//should move to its own Controller/Component
		vm.addColorHandle = addColorHandle;
		vm.deleteColorHandle = deleteColorHandle;
		vm.setLabels = setLabels;

		function addColorHandle(stop) {
			vm.item.style.color_range.push(new vm.ColorHandle('rgba(255,255,255,0.6)', stop));
		}

		function deleteColorHandle(colorHandle) {
			vm.item.style.color_range.splice(vm.item.style.color_range.indexOf(colorHandle), 1);
		}
		function setLabels(){
			DialogService.fromTemplate('gradientLabels', $scope);
		}
	});

})();
