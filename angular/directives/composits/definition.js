/**
 * @ngdoc directive
 * @name app.directive:composits
 * @scope
 * @restrict EA
 * @description
 * Provides a way to create composit measures out of indicators
 * 
 * @param {object[]} items Array of indices
 * @param {object} item Composit item to be created
 * @param {object} options DOM releated options
 */
(function(){
	"use strict";

	angular.module('app.directives').directive( 'composits', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/composits/composits.html',
			controller: 'CompositsCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				items: '=',
				item: '=',
				options:'='
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
