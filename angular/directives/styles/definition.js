/**
 * @ngdoc directive
 * @name app.directive:styles
 * @scope
 * @restrict E
 * @description
 * Provides a UI for creating and editing styles
 *
 * @param {object} item current style
 * @param {object[]} object array with all styles
 * @param {option} options for style directive
 *
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'styles', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/styles/styles.html',
			controller: 'StylesCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				styles: '=',
				options:'=',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
