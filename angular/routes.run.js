(function(){
	"use strict";

	angular.module('app.routes').run(function($rootScope, $mdSidenav){
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState,fromParams){
			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}
			$rootScope.previousPage = {state:fromState, params:fromParams};
			$rootScope.stateIsLoading = true;
		});
		$rootScope.$on("$viewContentLoaded", function(event, toState){

		});
		$rootScope.$on("$stateChangeSuccess", function(event, toState){
			$rootScope.stateIsLoading = false;
		});
	});

})();
