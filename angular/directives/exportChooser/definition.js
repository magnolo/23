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
				chapters: '=?',
				changed: '&',
				indicatorChange: '&?'
			},
			bindToController: true,
			replace: true,
			link: function(scope, element, attrs) {
				//
		
			}
		};

	});

})();
