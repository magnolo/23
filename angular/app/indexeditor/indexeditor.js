(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', function ($filter,DataService) {
		//
		var vm = this;

		vm.indicators = [];

		activate();

		function activate(){
			loadAll();
		}

		function loadAll(){
			vm.indicators = DataService.getAll('indicators').$object
		}
	});

})();
