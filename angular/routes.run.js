(function() {
	"use strict";

	angular.module('app.routes').run(function($rootScope, $mdSidenav, $timeout, $auth, $state, $localStorage, $window, leafletData, toastr, VectorlayerService) {
		$rootScope.sidebarOpen = true;
		$rootScope.greyed = false;
		$rootScope.fixLayout = false;
		$rootScope.looseLayout = $localStorage.fullView || false;
		$rootScope.started = true;
		$rootScope.goBack = function() {
			$window.history.back();
		}
		$rootScope.toggleMenu = function(menuId) {
			$mdSidenav(menuId).toggle();
		}

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

			if (toState.auth && !$auth.isAuthenticated()) {
				toastr.error('Your not allowed to go there buddy!', 'Access denied');
				event.preventDefault();
				return $state.go('app.home');
			}
			if (toState.data && toState.data.pageName) {
				$rootScope.current_page = toState.data.pageName;
			}
			if (toState.layout == "row") {
				$rootScope.rowed = true;
			} else {
				$rootScope.rowed = false;
			}
			if (toState.layout == "loose") {
				$rootScope.looseLayout = true;
			} else {
				$rootScope.looseLayout = false;
			}
			if (toState.additional == "full") {
				$rootScope.addFull = true;
			} else {
				$rootScope.addFull = false;
			}
			if (toState.fixLayout == true) {
				$rootScope.fixLayout = true;
			} else {
				$rootScope.fixLayout = false;
			}
			console.log(toState)
			if (typeof toState.views != "undefined") {

				if (toState.views.hasOwnProperty('sidebar@') || toState.views.hasOwnProperty('main@')) {
					$rootScope.sidebar = true;
				} else {
					$rootScope.sidebar = false;
				}
				if (toState.views.hasOwnProperty('main@') || toState.views.hasOwnProperty('additional@')) {
					$rootScope.mainView = true;
				} else {
					$rootScope.mainView = false;
				}
				if (toState.views.hasOwnProperty('additional@')) {
					$rootScope.additional = true;
				} else {
					$rootScope.additional = false;
				}
				if (toState.views.hasOwnProperty('items-menu@')) {
					$rootScope.itemMenu = true;
				} else {
					$rootScope.itemMenu = false;
				}
				if (toState.views.hasOwnProperty('logo@')) {
					$rootScope.logoView = true;
				} else {
					$rootScope.logoView = false;
				}
				if (toState.views.hasOwnProperty('fullscreen@')) {
					$rootScope.fullscreenView = true;
				} else {
					$rootScope.fullscreenView = false;
				}
			} else {
				if (!toState.avoidRoots) {
					$rootScope.additional = false;
					$rootScope.itemMenu = false;
					$rootScope.logoView = false;
					$rootScope.mainView = false;
					$rootScope.sidebar = true;
				} else {
					$rootScope.sidebar = true;
				}

			}
			if ((toState.name.indexOf('conflict') > -1 && toState.name != "app.conflict.import")) {
				$rootScope.noHeader = true;
			} else {
				$rootScope.noHeader = false;
			}
			if (toState.name == 'app.conflict.index.nation') {
				$rootScope.showItems = true;
			} else {
				$rootScope.showItems = false;
			}
			$rootScope.previousPage = {
				state: fromState,
				params: fromParams
			};
			$rootScope.stateIsLoading = true;
			$mdSidenav('left').close();


		});
		$rootScope.$on("$viewContentLoaded", function(event, toState) {

		});

		$rootScope.$on("$stateChangeSuccess", function(event, toState) {

			$rootScope.stateIsLoading = false;
			if ($auth.isAuthenticated()) {
				$mdSidenav('leftMenu').close();
			}
			resetMapSize();
		});

		function resetMapSize() {
			$timeout(function() {
				VectorlayerService.getMap().invalidateSize();
			}, 1000);
		}
		/*window.addEventListener('scroll', function(ev) {
    // avoids scrolling when the focused element is e.g. an input
    if (
        !document.activeElement
        || document.activeElement === document.body
    ) {
        document.body.scrollIntoViewIfNeeded(true);
    }
});*/
	});
})();
