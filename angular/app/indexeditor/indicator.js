(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorindicatorCtrl', function ($state,ContentService) {
		//
		var vm = this;
    vm.indicator = ContentService.getIndicator($state.params.id);

	});

})();
