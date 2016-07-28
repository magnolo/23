/**
 * @ngdoc directive
 * @name app.directive:conflictitems
 * @restrict EA
 * @description
 * PROBABLY UNUSED AND DELETABLE
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'conflictitems', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/conflictitems/conflictitems.html',
			controller: 'ConflictitemsCtrl',
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
