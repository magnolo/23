(function() {
	"use strict";

	angular.module('app.controllers').controller('BasemapCtrl', function() {
		//

		var vm = this;
		vm.original = angular.copy(vm.item);
		vm.containsSpecial = containsSpecial;
		vm.baseOptions = {
			drag: false,
			allowDrop: false,
			allowDrag: false,
			allowMove: false,
			allowDelete: false,
			allowAddContainer: false,
			allowAdd: false,
			allowSave: true,
			editable: false,
			assigments: false,
			saveClick: vm.options.save,
			deleteClick: vm.options.deleteClick
		};

		function containsSpecial(type) {
			var found = false;
			if(typeof vm.item.url == "undefined"){
				return false;
			}
			if (typeof type == 'object') {
				angular.forEach(type, function(t) {
					if (vm.item.url.indexOf(t) > -1) {
						found = true;
					}
				});
			} else {
				if (vm.item.url.indexOf(type) > -1) {
					found = true;
				}
			}
			return found;
		}
	});

})();
