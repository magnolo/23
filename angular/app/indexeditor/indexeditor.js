(function() {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', function($filter, indicators) {
		//
		var vm = this;

		vm.indicators = indicators;
		vm.selection = [];
		vm.filter = {
			list: 0,
			types: {
				title: true,
				style: true,
				categories: false,
				infographic: false,
				description: true
			}
		}
		vm.openMenu = openMenu;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;

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

		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}

	});

})();