/**
 * @ngdoc directive
 * @name app.directive:weight
 * @scope
 * @restrict EA
 *
 * @description
 * UI element for setting weights
 *
 * @param {object[]} items Object array with items to add weight to
 * @param {object} item current item
 * @param {object} options options object
 */
(function() {
	"use strict";

	angular.module('app.directives').directive('weight', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/weight/weight.html',
			controller: 'WeightCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				items: '=',
				item: '=',
				options: '='
			},
			replace: true,
			link: function(scope, element, attrs) {
				//
			}
		};

	});

})();