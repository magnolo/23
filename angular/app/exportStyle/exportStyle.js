(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportStyleCtrl', function($state, $timeout, ExportService) {
    var vm = this;
		vm.exporter = {};
    vm.item = {};

		activate();

		function activate() {
			$timeout(function() {
				vm.exporter = ExportService.exporter;
        if(!vm.exporter.items.length) $state.go('app.index.exports.details',{
          id: $state.params.id,
          name: $state.params.name
        })
				vm.item = getActiveItem(vm.exporter.items, $state.params.styleId);
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

	});

})();
