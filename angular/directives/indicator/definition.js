/**
 * @ngdoc directive
 * @name app.directive:indicator
 * @scope
 * @restrict EA
 * @description
 * Provides UI for indicator edit/creation
 *
 * @param {object} item indicator, empty at initialisation if new indicator is created
 * @param {object} options options for indicator creation
 * @param {object} selected which item in creation is selected
 *
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indicator', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/indicator/indicator.html',
			controller: 'IndicatorCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '=',
				selected: '='
			},
			bindToController: true,
			replace:true,
			//require: 'item',
			link: function( scope, element, attrs, itemModel ){
				//
				/*scope.$watch(
					function () {
						return itemModel.$modelValue;
					},
					function (n, o) {
						console.log(n);
					});*/
			}
		};

	});

})();
