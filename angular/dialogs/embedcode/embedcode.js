(function() {
	"use strict";

	angular.module('app.controllers').controller('EmbedcodeCtrl', function($scope, $sce, DialogService) {
		$scope.vm.url = $sce.trustAsResourceUrl('https://dev.23degree.org/#/export/' + $scope.vm.item.id + '/' + $scope.vm.item.name);
		$scope.save = function() {
			//
			console.log($scope.vm);
		};

		$scope.hide = function() {
			DialogService.hide();
		};

	});

})();
