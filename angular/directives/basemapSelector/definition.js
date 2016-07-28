/**
 * @ngdoc directive
 * @name app.directive:basemapSelector
 * @scope
 * @restrict EA
 * @description
 * Provides an interface for the selection of the basemap for the current chapter
 *
 * @param {object} ngModel Basemap Style
 *
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'basemapSelector', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/basemapSelector/basemapSelector.html',
			controller: 'BasemapSelectorCtrl',
			controllerAs: 'vm',
			scope:{
				style: '=ngModel',
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
