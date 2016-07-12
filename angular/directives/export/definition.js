/**
 * @ngdoc directive
 * @name app.directive:export
 * @scope
 * @restrict EA
 * @description
 * Exporter Directive, provides central UI element for the iframe exporter
 *
 * @param {object} item item that will be exported, if it's a new item it'll be created 
 * @param {object} options exporter functions
 * @param {object} selected selected indicator after drag and drop
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'export', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/export/export.html',
			controller: 'ExportDirectiveCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '=',
				selected: '='
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
