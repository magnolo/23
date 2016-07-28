/**
 * @ngdoc directive
 * @name app.directive:treemenu
 * @scope
 * @restrict EA
 * 
 * @description
 * Provides a menu with assignment save delete add and add note buttons for index/composit measure tree
 *
 * @param {object} item current selected item, to which the menu applies
 * @param {object} options options object
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'treemenu', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/treemenu/treemenu.html',
			controller: 'TreemenuCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				options:'=',
				item:'=?',
				selection: '=?'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
