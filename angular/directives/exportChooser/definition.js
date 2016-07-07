(function() {
	"use strict";

	angular.module('app.directives').directive('exportChooser', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/exportChooser/exportChooser.html',
			controller: 'ExportChooserCtrl',
			controllerAs: 'vm',
			scope: {
				countries: '=',
				nation: '=',
				selected: '=?',
				changed: '&'
			},
			bindToController: true,
			replace: true,
			link: function(scope, element, attrs) {
				//
			}
		};

	});

})();
