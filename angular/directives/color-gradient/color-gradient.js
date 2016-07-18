(function() {
	"use strict";

	angular.module('app.controllers').controller('ColorGradientCtrl', function() {
		//
		var vm = this;
		vm.removeColor = removeColor;


		function removeColor(idx) {
			vm.gradient.splice(idx, 1);
		}
	});

})();
