/**
 * @ngdoc directiv
 * @name app.directive:styleSingle
 * @scope
 * @restrict E
 * @description
 * Single style creation and editing User Interface
 * TODO editing
 *
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'styleSingle', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/styleSingle/styleSingle.html',
			controller: 'StyleSingleCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				item: '=',
				styles: '=',
				options: '=',
				close:'=',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
