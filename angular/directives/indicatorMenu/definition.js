/**
 * @ngdoc directive
 * @name app.directive:indicatorMenu
 * @scope
 * @restrict EA
 * @description
 * Quicklinks in indicator list for configurationsteps: info/infographic/idizes/style/categories/ispublic
 * Shows status of configurationstep
 * Links directly to configstep <- NOT WORKING!
 *
 * @param {object} item indicator item on which menu is shown
 *
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indicatorMenu', function() {

		return {
			restrict: 'EA',
			scope: {
				item: '=item'
			},
			replace:true,
			templateUrl: 'views/directives/indicatorMenu/indicatorMenu.html',
			controller: 'IndicatorMenuCtrl',
			controllerAs: 'vm',
			bindToController: true,
			link: function( scope, element, attrs ){
				//
				var cl = 'active';
				var el = element[0];
				var parent = element.parent();
				parent.on('mouseenter', function(e){
					element.addClass(cl);
				}).on('mouseleave', function(e){
					element.removeClass(cl);
				});
				
			}
		};

	});

})();
