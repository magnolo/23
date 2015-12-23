(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', function ($filter,DataService) {
		//
		var vm = this;

		vm.indicators = [];
		vm.filter = {
			list: 0,
			types:{
				title: true,
				style: true,
				categories: true,
				infographic: false,
				description: true
			}
		}
		vm.openMenu = openMenu;

		activate();

		function activate(){
			loadAll();
		}

		function loadAll(){
			vm.indicators = DataService.getAll('indicators').$object
		}
		function openMenu($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    }
	});

})();
