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
