(function(){
	"use strict";

	angular.module('app.routes').run(function($rootScope, $mdSidenav, $timeout, $auth, $state,$localStorage,leafletData, toastr){
		$rootScope.sidebarOpen = true;
		$rootScope.looseLayout = $localStorage.fullView || false;

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState,fromParams){
			if (toState.auth && !$auth.isAuthenticated()){
				toastr.error('Your not allowed to go there buddy!', 'Access denied');
		    event.preventDefault();
		    return $state.go('app.home');
		  }
			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}
			if(toState.layout == "row"){
				$rootScope.rowed = true;
			}
			else{
				$rootScope.rowed = false;
			}
			$rootScope.previousPage = {state:fromState, params:fromParams};
			$rootScope.stateIsLoading = true;
		});
		$rootScope.$on("$viewContentLoaded", function(event, toState){

		});

		$rootScope.$on("$stateChangeSuccess", function(event, toState){
			$rootScope.stateIsLoading = false;
			resetMapSize();
		});

		function resetMapSize(){
			$timeout(function(){
				leafletData.getMap('map').then(function (map) {
					map.invalidateSize();
				})
			}, 1000);
		}
	});
})();
