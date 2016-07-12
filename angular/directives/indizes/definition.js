/**
 * @ngdoc directive
 * @name app.directive:indizes
 * @scope
 * @restrict EA
 * @description
 * Provides UI for creation of composite measure/index
 * 
 * @param {object} item Index object to be created or edited
 * @param {object} options options for index creation
 * @param {object} selected selected item
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indizes', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/indizes/indizes.html',
			controller: 'IndizesCtrl',
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
