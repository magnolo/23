/**
 * @ngdoc directive
 * @name app.directive:history
 * @scope
 * @restrict E
 * @description
 * Timeline chart of provided chart data
 *
 * @param {object} options options for history chart
 * @param {object} chartdata data that will be charted
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'history', function() {
		var defaults = function(){
			return {
				field: 'score',
				color: ''
			}
		};
		return {
			restrict: 'E',
			templateUrl: 'views/directives/history/history.html',
			controller: 'HistoryCtrl',
			scope:{
				options:'=',
				chartdata: '='
			},
			link: function( $scope, element, $attrs, ngModel){
					var options = angular.extend(defaults(), $scope.options);
			}
		};

	});

})();
