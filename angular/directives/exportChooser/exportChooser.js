(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportChooserCtrl', function($scope, $timeout) {
		//
		var vm = this;
		vm.index = 0;
		vm.activeList = [];
		$timeout(function() {
			if (vm.chapters) {
				if (vm.selected.parent_id) {
					angular.forEach(vm.chapters, function(chapter) {
						if (chapter.id == vm.selected.parent_id) {
							vm.activeList = chapter.children;
						}
					});
				} else {
					vm.activeList = vm.chapters;
				}
				vm.index = vm.activeList.indexOf(vm.selected);
			}
		});

		$scope.$watch('vm.index', function(n, o) {
			if (n === o) return false;
			// if(vm.activeList[vm.index] != "undefined")
			vm.selected = vm.activeList[vm.index];
		})
	});
})();
