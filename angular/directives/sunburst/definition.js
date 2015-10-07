(function(){
	"use strict";

	angular.module('app.directives').directive( 'sunburst', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/sunburst/sunburst.html',
			controller: 'SunburstCtrl',
			scope:{
				data:'='
			},
			link: function( $scope, element, $attrs ){
				$scope.setChart();
				$scope.calculateGraph();
			}
		};

	});

})();
