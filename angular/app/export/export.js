(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportCtrl', function($state, ExportService) {
		//
		var vm = this;
		vm.exports = [];
		vm.ExportService = ExportService;
		vm.selection = [];
		vm.options = {
			drag: false,
			type: 'exports',
			allowMove: false,
			allowDrop: false,
			allowAdd: true,
			allowDelete: true,
			itemClick: function(id, name) {
				$state.go('app.index.exports.details', {
					id: id,
					name: name
				})
			},
			addClick: function() {
				$state.go('app.index.exports.details', {
					id: 0,
					name: 'new'
				})
			},
			deleteClick: function() {
				angular.forEach(vm.selection, function(item, key) {
					vm.ExportService.removeItem(item.id, function(data) {
						if ($state.params.id == item.id) {
							$state.go('app.index.exports');
						}
						var idx = vm.exports.indexOf(item);
						vm.ExportService.exports.splice(idx, 1);
						vm.selection = [];
					});
				});
				//$state.go('app.index.editor.indizes');
			}
		};




		vm.ExportService.getExports(function(data) {});

	});

})();