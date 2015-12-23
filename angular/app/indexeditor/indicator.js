(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorindicatorCtrl', function ($state,DataService) {
		//
		var vm = this;
    vm.indicator = DataService.getOne('indicators/'+$state.params.id).$object;
	});

})();
