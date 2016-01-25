(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', function ($scope, $filter, $timeout, indicators, ContentService) {
		//
		var vm = this;

		vm.indicators = indicators;
		vm.selection = [];
		vm.filter = {
			sort:0,
			list: 0,
			types: {
				title: true,
				style: false,
				categories: false,
				infographic: false,
				description: false
			}
		}
		vm.openMenu = openMenu;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;
		vm.loadIndicators = loadIndicators;

		function selectedItem(item) {
			return vm.selection.indexOf(item) > -1 ? true : false;
		}

		function toggleSelection(item) {
			var index = vm.selection.indexOf(item);
			if (index > -1) {
				return vm.selection.splice(index, 1);
			} else {
				return vm.selection.push(item);
			}
		}

		function loadIndicators() {

		}


		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}


		$scope.$watch('vm.search', function (query) {
			vm.query = vm.filter.types;
			vm.query.q = query;
			vm.indicators = ContentService.fetchIndicators(vm.query);
		});
	});

})();
