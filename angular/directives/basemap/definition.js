/**
 * @ngdoc directive
 * @name app.directive:basemap
 * @scope
 * @restrict EA
 * @description
 * Provides a form/user-interface so basemaps can be added via url
 * 
 * @param {object} item basemap item to be added, {title:,url:,description:,attribution:,ext:extension,subdomains:,key}
 * @param {object} options options for basemap
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'basemap', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/basemap/basemap.html',
			controller: 'BasemapCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '='
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
