(function() {
	"use strict";

	angular.module('app.controllers').controller('FullListCtrl', function(indicators, indices) {
		//
		var vm = this;
		vm.indicators = indicators;
		vm.indices = indices;
	});
})();