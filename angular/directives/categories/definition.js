/**
 * @ngdoc directive
 * @name app.directive:categories
 * @scope
 * @restrict E
 * @description
 * Provides an interface for choosing categories and creating them
 *
 * @param {object} item Item object to be added to categories
 * @param {object} categories contains all categories
 * @param {object} options contains options for item
 * @param {function} save function for saving of item
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'categories', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/categories/categories.html',
			controller: 'CategoriesCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				categories: '=',
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
