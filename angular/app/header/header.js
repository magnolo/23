(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', function($scope, $rootScope){

		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});
		$scope.isOpen = false;
		 $scope.demo = {
			 isOpen: false,
			 count: 0,
			 selectedDirection: 'right'
		 };

	});

})();
