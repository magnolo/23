(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndicatorMenuCtrl', function(){
		//
		var vm = this;

		activate();

		function activate() {
			check();
		}
		function check(){
			if (vm.item.title && vm.item.measure_type_id && vm.item.dataprovider && vm.item.title.length >= 3) {
				vm.item.base = true;
				vm.item.full = vm.item.categories.length ? true : false;
			} else {
				vm.item.base = vm.item.full = false;
			};
		}
  });

})();
