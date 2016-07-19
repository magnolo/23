(function() {
	"use strict";

	angular.module('app.controllers').controller('ColorGradientCtrl', function($scope) {
		//
		var vm = this;
		vm.removeColor = removeColor;
		vm.active;
		vm.dragEvents = {
			dragMove : function (instance, event, pointer) {
        var percentage = 100  * instance.position.x / instance.containerSize.width;
				vm.active.pos = percentage;

    	},
			dragEnd : function (instance, event, pointer) {

			
    	}
		}

		function removeColor(idx) {
			vm.gradient.splice(idx, 1);
		}
	});

})();
