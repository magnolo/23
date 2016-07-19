(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportChooserCtrl', function($scope, $timeout) {
		//
		var vm = this;
		vm.index = 0;

		$timeout(function(){
				if(vm.chapters){
					vm.index = vm.chapters.indexOf(vm.selected);
				}

		});

		$scope.$watch('vm.index', function(n, o){
			if(n === o) return false;
			vm.selected = vm.chapters[vm.index];
		})
	});
})();
