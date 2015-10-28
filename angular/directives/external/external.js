(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ExternalCtrl', function($scope, $sce){
		//
		$scope.extUrl = $sce.trustAsResourceUrl('http://'+ decodeURI($scope.url));

		});

})();
