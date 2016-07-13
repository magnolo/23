/**
 * @ngdoc directive
 * @name app.directive:subindex
 * @restrict E
 * @description
 * UI Element, shows information about current index/composite measurement and compare fields etc.
 * PROBABLY UNUSED
 *
 */
(function () {
	"use strict";

	angular.module('app.directives').directive('subindex', subindex);

	subindex.$inject = ['$timeout', 'smoothScroll'];

	function subindex($timeout, smoothScroll) {
		return {
			restrict: 'E',
			replace: true,
			controller: 'SubindexCtrl',
			templateUrl: 'views/directives/subindex/subindex.html',
			link: subindexLinkFunction
		};

		function subindexLinkFunction($scope, element, $attrs) {
		}
	}
})();
