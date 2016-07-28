/**
 * @ngdoc directive
 * @name app.directive:category
 * @scope
 * @restrict EA
 * @description
 * Provides a form for saving detailed information about a category
 * 
 * @param {object} item item to be saved
 * @param {object} categories object containing all categories
 * @param {object} options object containing options for category item
 * @param {function} save save function
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'category', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/category/category.html',
			controller: 'CategoryCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				categories: '=',
				options:'=?',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
