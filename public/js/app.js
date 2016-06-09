(function(){
	"use strict";

	var app = angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config'
		]);


		angular.module('app.routes', ['ui.router','ui.router.state.events', 'ngStorage', 'satellizer']);
		angular.module('app.controllers', ['FBAngular','dndLists','angular.filter','angularMoment','ngScrollbar','mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
		angular.module('app.filters', []);
		angular.module('app.services', ['angular-cache','ui.router', 'ngStorage', 'restangular', 'toastr']);
		angular.module('app.directives', ['ngMaterial','ngPapaParse']);
		angular.module('app.config', []);

})();

(function() {
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
		//$locationProvider.html5Mode(true);
		var getView = function(viewName) {
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('header'),
						controller: 'HeaderCtrl',
						controllerAs: 'vm'
					},
					main: {},
					'map@': {
						templateUrl: getView('map'),
						controller: 'MapCtrl',
						controllerAs: 'vm'
					},
					'sidemenu@': {
						templateUrl: getView('sidemenu'),
						controller: 'SidemenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.home', {
				url: '/',
				views: {

					'sidebar@': {
						templateUrl: getView('home'),
						controller: 'HomeCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.user', {
				url: '/user',
				abstract: true

			})
			.state('app.user.login', {
				url: '/login',
				views: {
					'main@': {
						templateUrl: getView('login'),
						controller: 'LoginCtrl',
						controllerAs: 'vm'

					}
				}

			})
			.state('app.user.profile', {
				url: '/my-profile',
				auth: true,
				resolve: {
					profile: ["DataService", "$auth", function(DataService, $auth) {
						return DataService.getOne('me').$object;
					}]
				},
				views: {
					'main@': {
						templateUrl: getView('user'),
						controller: 'UserCtrl',
						controllerAs: 'vm'
					}
				}

			})
			.state('app.index', {
				abstract: true,
				url: '/index',
				resolve: {
					countries: ["CountriesService", function(CountriesService) {
						return CountriesService.getData();
					}]
				}
			})

		.state('app.index.mydata', {
				url: '/my-data',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: '/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@': {
						templateUrl: getView('indexMyData'),
						controller: 'IndexMyDataCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.mydata.entry', {
				url: '/:name',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: '/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@': {
						templateUrl: '/views/app/indexMyData/indexMyDataEntry.html',
						controller: 'IndexMyDataEntryCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor', {
				url: '/editor',
				auth: true,
				resolve: {
					indices: ["ContentService", function(ContentService) {
						return ContentService.getIndices();
					}],
					indicators: ["ContentService", function(ContentService) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					}],
					styles: ["ContentService", function(ContentService) {
						return ContentService.getStyles();
					}],
					categories: ["ContentService", function(ContentService) {
						return ContentService.getCategories({
							indicators: true,
							tree: true
						});
					}]
				},
				views: {
					'sidebar@': {
						templateUrl: getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.editor.indicators', {
				url: '/indicators',
				auth: true,
			})
			.state('app.index.editor.indicators.indicator', {
				url: '/:id',
				auth: true,
				layout: 'row',
				resolve: {
					indicator: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.getIndicator($stateParams.id)
					}]
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorindicator.html',
						controller: 'IndexeditorindicatorCtrl',
						controllerAs: 'vm'

					}
				}
				/*views:{
					'info':{

					},
					'menu':{
						templateUrl:getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm'
					}
				}*/
			})
			.state('app.index.editor.indizes', {
				url: '/indizes',
				auth: true,
			})
			.state('app.index.editor.indizes.data', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				resolve: {
					index: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						if ($stateParams.id == 0) return {};
						return ContentService.getItem($stateParams.id);
					}]
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorindizes.html',
						controller: 'IndexeditorindizesCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor.indizes.data.add', {
				url: '/add',
				layout: 'row',
				resolve: {
					indicators: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					}]
				},
				views: {
					'additional@': {
						templateUrl: '/views/app/indexeditor/indicators.html',
						controller: 'IndexinidcatorsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor.indicators.indicator.details', {
				url: '/:entry',
				auth: true,
				layout: 'row'
			})
			.state('app.index.editor.categories', {
				url: '/categories',
				auth: true,
			})
			.state('app.index.editor.categories.category', {
				url: '/:id',
				auth: true,
				layout: 'row',
				resolve: {
					category: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						if($stateParams.id == 'new'){
							return {};
						}
						return ContentService.getCategory($stateParams.id);
					}]
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorcategory.html',
						controller: 'IndexeditorcategoryCtrl',
						controllerAs: 'vm'
					}
				}
			})

			.state('app.index.create', {
				url: '/create',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: getView('indexcreator'),
						controller: 'IndexcreatorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.create.basic', {
				url: '/basic',
				auth: true
			})
			.state('app.index.check', {
				url: '/checking',
				auth: true,
				views: {
					'main@': {
						templateUrl: getView('indexCheck'),
						controller: 'IndexCheckCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexCheck/indexCheckSidebar.html',
						controller: 'IndexCheckSidebarCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.meta', {
				url: '/adding-meta-data',
				auth: true,
				layout: 'row',
				views: {
					'main@': {
						templateUrl: getView('indexMeta'),
						controller: 'IndexMetaCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexMeta/indexMetaMenu.html',
						controller: 'IndexMetaMenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.final', {
				url: '/final',
				auth: true,
				layout: 'row',
				views: {
					'main@': {
						templateUrl: getView('indexFinal'),
						controller: 'IndexFinalCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexFinal/indexFinalMenu.html',
						controller: 'IndexFinalMenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports', {
				url: '/exports',
				auth:true,
				data: {
					pageName: 'Export Data'
				},
				views: {
					'sidebar@': {
						templateUrl: getView('export'),
						controller: 'ExportCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				data: {
					pageName: 'Export Data'
				},
				views: {
					'main@':{
						templateUrl: '/views/app/export/exportDetails.html',
						controller: 'ExportDetailsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details.add', {
				url: '/add',
				layout: 'row',
				resolve: {
					indicators: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					}]
				},
				views: {
					'additional@': {
						templateUrl: '/views/app/indexeditor/indicators.html',
						controller: 'IndexinidcatorsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details.style', {
				url: '/style/:styleId/:styleName',
				layout: 'row',
				additional:'full',
				views: {
					'additional@': {
						templateUrl: getView('exportStyle'),
						controller: 'ExportStyleCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.basemaps', {
				url: '/basemaps',
				auth:true,
				data: {
					pageName: 'Export Data'
				},
				views: {
					'sidebar@': {
						templateUrl: getView('basemaps'),
						controller: 'BasemapsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.basemaps.details', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				data: {
					pageName: 'Basemaps'
				},
				views: {
					'main@':{
						templateUrl: '/views/app/basemaps/basemapDetails.html',
						controller: 'BasemapDetailsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.list', {
				url: '/list',
				resolve: {
					indicators: ["ContentService", function(ContentService) {
						return ContentService.getIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						})
					}],
					indices: ["ContentService", function(ContentService) {
						return ContentService.fetchIndices();
					}],
					categories: ["ContentService", function(ContentService){
							return ContentService.getCategories({
								indicators: true,
								tree: true
							});
					}]
				},
				views: {
					'sidebar@': {
						templateUrl: getView('fullList'),
						controller: 'FullListCtrl',
						controllerAs: 'vm',

					}
				}
			})
			.state('app.index.list.filter',{
				url:'/:filter',
				layout: 'row',
				views:{
					'main@':{
						templateUrl: '/views/app/fullList/filter.html',
						controller: 'FullListFitlerCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.indicator', {
				url: '/indicator/:id/:name/:year/:gender/:iso',
				resolve: {
					indicator: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.fetchIndicator($stateParams.id);
					}]
				},
				views: {
					'sidebar@': {
						templateUrl: getView('indicator'),
						controller: 'IndicatorShowCtrl',
						controllerAs: 'vm'
					}
				},
				params:{
					year:{
						squash:true,
						value:null,
						dynamic:true
					},
					gender:{
						squash:true,
						value:null,
						dynamic:true
					},
					iso:{
						squash:true,
						value:null,
						dynamic:true

					}
				}
			})
			.state('app.index.indicator.info', {
				url: '/details',
				layout: 'row',
				resolve: {
					data: ["ContentService", "$state", function(ContentService, $state) {

						return ContentService.getIndicatorData($state.params.id, $state.params.year, $state.params.gender);
					}]
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indicator/indicatorYearTable.html',
						controller: 'IndicatorYearTableCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.show', {
				url: '/:id/:name',
				resolve: {
					data: ["IndizesService", "$stateParams", function(IndizesService, $stateParams) {
						return IndizesService.fetchData($stateParams.id);
					}],
					countries: ["CountriesService", function(CountriesService) {
						return CountriesService.getData();
					}]
				},
				views: {
					'sidebar@': {
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm'
					},
					'selected': {
						templateUrl: '/views/app/index/selected.html',
					}
				}
			})
			.state('app.index.show.info', {
				url: '/info',
				views: {
					'main@': {
						controller: 'IndexinfoCtrl',
						controllerAs: 'vm',
						templateUrl: getView('indexinfo')
					}
				}
			})
			.state('app.index.show.selected', {
				url: '/:item',
				/*views:{
					'selected':{
						templateUrl: getView('selected'),
						controller: 'SelectedCtrl',
						controllerAs: 'vm',
						resolve:{
							getCountry: function(DataService, $stateParams){
								return DataService.getOne('nations', $stateParams.item).$object;
							}
						}
					}
				}*/
			})
			.state('app.index.show.selected.compare', {
				url: '/compare/:countries'
			})
			.state('app.conflict', {
				abstract: true,
				url: '/conflict',
			})
			.state('app.conflict.index', {
				url: '/index',
				resolve: {
					nations: ["Restangular", function(Restangular) {
						return Restangular.all('conflicts/nations');
					}],
					conflicts: ["Restangular", function(Restangular) {
						return Restangular.all('conflicts');
					}]
				},
				views: {
					'sidebar@': {
						controller: 'ConflictsCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflicts')
					},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.index.nation', {
				url: '/nation/:iso',
				resolve: {
					nation: ["Restangular", "$stateParams", function(Restangular, $stateParams) {
						return Restangular.one('/conflicts/nations/', $stateParams.iso).get();
					}]
				},
				views: {
					'sidebar@': {
						controller: 'ConflictnationCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictnation')
					},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.index.details', {
				url: '/:id',
				resolve: {
					conflict: ["Restangular", "$stateParams", function(Restangular, $stateParams) {
						return Restangular.one('/conflicts/events/', $stateParams.id).get();
					}]
				},
				views: {
					'sidebar@': {
						controller: 'ConflictdetailsCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictdetails')
					},
					'items-menu@': {},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.import', {
				url: '/import',
				auth: true,
				views: {
					'sidebar@': {
						controller: 'ConflictImportCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictImport')
					}
				}
			})
			.state('app.importcsv', {
				url: '/importer',
				data: {
					pageName: 'Import CSV'
				},
				views: {
					'main@': {
						templateUrl: getView('importcsv')
					},
					'map': {}
				}
			});
	}]);
})();

(function() {
	"use strict";

	angular.module('app.routes').run(["$rootScope", "$mdSidenav", "$timeout", "$auth", "$state", "$localStorage", "$window", "leafletData", "toastr", function($rootScope, $mdSidenav, $timeout, $auth, $state, $localStorage, $window, leafletData, toastr) {
		$rootScope.sidebarOpen = true;
		$rootScope.greyed = false;
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
			if (toState.additional == "full") {
				$rootScope.addFull = true;
			} else {
				$rootScope.addFull = false;
			}
			if (typeof toState.views != "undefined") {
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
			} else {
				$rootScope.additional = false;
				$rootScope.itemMenu = false;
				$rootScope.logoView = false;
				$rootScope.mainView = false;
			}
			if (toState.name.indexOf('conflict') > -1 && toState.name != "app.conflict.import") {
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
			if($auth.isAuthenticated()){
					$mdSidenav('leftMenu').close();
			}
			resetMapSize();
		});

		function resetMapSize() {
			$timeout(function() {
				leafletData.getMap('map').then(function(map) {
					console.log(map);
					map.invalidateSize();
				})
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
	}]);
})();

(function () {
	"use strict";

	angular.module('app.config').config(["$authProvider", function ($authProvider) {
		// Satellizer configuration that specifies which API
		// route the JWT should be retrieved from
		$authProvider.loginUrl = '/api/authenticate/auth';
    $authProvider.signupUrl = '/api/authenticate/auth/signup';
    $authProvider.unlinkUrl = '/api/authenticate/auth/unlink/';
		$authProvider.facebook({
			url: '/api/authenticate/facebook',
			clientId: '771961832910072'
		});
		$authProvider.google({
			url: '/api/authenticate/google',
			clientId: '276634537440-cgtt14qj2e8inp0vq5oq9b46k74jjs3e.apps.googleusercontent.com'
		});
	}]);

})();

(function(){
    "use strict";

    angular.module('app.config').config(["$logProvider", function($logProvider){
        $logProvider.debugEnabled(false);
    }]);

})();

(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function() {
	"use strict";

	angular.module('app.config').config(["RestangularProvider", function(RestangularProvider) {
		RestangularProvider
			.setBaseUrl('/api/')
			.setDefaultHeaders({
				accept: "application/x.laravel.v1+json"
			})
			.setDefaultHttpFields({
				cache: false
			})
			.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
				var extractedData;
				extractedData = data.data;
				if (data.meta) {
					extractedData._meta = data.meta;
				}
				if (data.included) {
					extractedData._included = data.included;
				}
				return extractedData;
			});
		/*	.setErrorInterceptor(function(response, deferred, responseHandler) {
			console.log('errro');
			if (response.status === 403) {

    		return false; // error handled
    	}

    	return true; // error not handled
		});*/
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", "$mdGestureProvider", function($mdThemingProvider,$mdGestureProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
/*	var neonTealMap = $mdThemingProvider.extendPalette('teal', {
    '500': '00ccaa',
		'A200': '00ccaa'
  });
	var whiteMap = $mdThemingProvider.extendPalette('teal', {
    '500': '00ccaa',
		'A200': '#fff'
  });
	var blueMap = $mdThemingProvider.extendPalette('blue', {
    '500': '#006bb9',
		'A200': '#006bb9'
  });
	$mdThemingProvider.definePalette('neonTeal', neonTealMap);
	$mdThemingProvider.definePalette('whiteTeal', whiteMap);
	$mdThemingProvider.definePalette('bluer', blueMap);
		$mdThemingProvider.theme('default')
		.primaryPalette('light-blue')
		.accentPalette('bluer');*/
		var blueMap = $mdThemingProvider.extendPalette('indigo', {
			'500': '#006bb9',
			'A200': '#006bb9'
		});
			$mdThemingProvider.definePalette('bluer', blueMap);

		$mdThemingProvider.theme('default')
		.primaryPalette('bluer')
		.accentPalette('grey')
		.warnPalette('red');

		 $mdGestureProvider.skipClickHijack();
	}]);

})();

(function(){
    "use strict";

    angular.module('app.config').config(["toastrConfig", function(toastrConfig){
        //
        angular.extend(toastrConfig, {
          autoDismiss: true,
          containerId: 'toast-container',
          maxOpened: 2,
          newestOnTop: true,
          positionClass: 'toast-bottom-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          target: 'body',
          closeButton: true,
          progressBar:true
        });
    }]);

})();

(function(){
    "use strict";

    angular.module('app.filters').filter( 'alphanum', function(){
        return function( input ){
            //
            if ( !input ){
              return null;
            }
            return input.replace(/([^0-9A-Z])/g,"");

        }
    });

})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'capitalize', function(){
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}) : '';
		};
	});
})();

(function () {
	"use strict";

	angular.module('app.filters').filter('findbyname', function () {
		return function (input, name, field) {
			//
      var founds = [];
			var i = 0,
				len = input.length;

			for (; i < len; i++) {
				if (input[i][field].toLowerCase().indexOf(name.toLowerCase()) > -1) {
					 founds.push(input[i]);
				}
			}
			return founds;
		}
	});

})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'humanReadable', function(){
		return function humanize(str) {
			if ( !str ){
				return '';
			}
			var frags = str.split('_');
			for (var i=0; i<frags.length; i++) {
				frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
			}
			return frags.join(' ');
		};
	});
})();
(function(){
    "use strict";

    angular.module('app.filters').filter( 'newline', function(){
        return function( text ){
            //
    
             return text.replace(/(\\r)?\\n/g, '<br /><br />');
        }
    });

})();

(function () {
	"use strict";

	angular.module('app.filters').filter('OrderObjectBy', function () {
		return function (input, attribute) {
			if (!angular.isObject(input)) return input;

			var array = [];
			for (var objectKey in input) {
				array.push(input[objectKey]);
			}

			array.sort(function (a, b) {
				a = parseInt(a[attribute]);
				b = parseInt(b[attribute]);
				return a - b;
			});
			return array;
		}
	});

})();

(function () {
	"use strict";

	angular.module('app.filters').filter('property', property);
	function property() {
		return function (array, year_field, value) {

      var items = [];
      for(var i = 0; i < array.length; i++){

        if(array[i].data[year_field] == value){
          items.push(array[i]);
        }
      }

			return items;
		}
	}
})();

(function(){
    'use strict';

    angular.module('app.filters').filter('truncateCharacters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length-1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    });
})();
(function(){
    'use strict';

    angular.module('app.filters').filter('truncateWords', function () {
        return function (input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    });
})();
(function(){
	"use strict";

	angular.module('app.filters').filter( 'trustHtml', ["$sce", function( $sce ){
		return function( html ){
			return $sce.trustAsHtml(html);
		};
	}]);
})();
(function(){
	"use strict";

	angular.module('app.filters').filter('ucfirst', function() {
		return function( input ) {
			if ( !input ){
				return null;
			}
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		};
	});

})();

(function() {
	"use strict";

	angular.module('app.services').factory('VectorlayerService', ["$timeout", function($timeout) {
		var that = this, _self = this;
		_self.basemap = {
			name: 'Outdoor',
			url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ',
			type: 'xyz',
			layerOptions: {
				noWrap: true,
				continuousWorld: false,
				detectRetina: true
			}
		};

		return {

			canvas: false,
			palette: [],
			ctx: '',
			keys: {
				mazpen: 'vector-tiles-Q3_Os5w',
				mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
			},
			data: {
				layer: '',
				name: 'countries_big',
				baseColor: '#06a99c',
				iso3: 'adm0_a3',
				iso2: 'iso_a2',
				iso: 'iso_a2',
				fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long",
				field:'score'
			},
			map: {
				data: [],
				current: [],
				structure: [],
				style: []
			},
			mapLayer: null,
			layers:{
				baselayers: {
					xyz: this.basemap
				}
			},
			center: {
				lat: 48.209206,
				lng: 16.372778,
				zoom: 3
			},
			maxbounds: {
				southWest: {
					lat: 90,
					lng: 180
				},
				northEast: {
					lat: -90,
					lng: -180
				}
			},
			setMap: function(map){
				return this.mapLayer = map;
			},
			setBaseLayer: function(basemap){
				this.layers.baselayers['xyz'] = {
					name: basemap.name,
					url: basemap.url,
					type: 'xyz',
					layerOptions: {
						noWrap: true,
						continuousWorld: false,
						detectRetina: true
					}
				}
			},
			resetBaseLayer: function(){
				this.layers.baselayers['xyz'] = this.baselayer;
			},
			setLayer: function(l) {
				return this.data.layer = l;
			},
			getLayer: function() {
				return this.data.layer;
			},
			getName: function() {
				return this.data.name;
			},
			fields: function() {
				return this.data.fields;
			},
			iso: function() {
				return this.data.iso;
			},
			iso3: function() {
				return this.data.iso3;
			},
			iso2: function() {
				return this.data.iso2;
			},
			createCanvas: function(color) {
				this.canvas = document.createElement('canvas');
				this.canvas.width = 280;
				this.canvas.height = 10;
				this.ctx = this.canvas.getContext('2d');
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
				gradient.addColorStop(1, 'rgba(255,255,255,0)');
				gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
				gradient.addColorStop(0, 'rgba(102,102,102,1)');
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
				//document.getElementsByTagName('body')[0].appendChild(this.canvas);
			},
			updateCanvas: function(color) {
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
				gradient.addColorStop(1, 'rgba(255,255,255,0)');
				gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
				gradient.addColorStop(0, 'rgba(102,102,102,1)');
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
				//document.getElementsByTagName('body')[0].appendChild(this.canvas);
			},
			createFixedCanvas: function(colorRange){

				this.canvas = document.createElement('canvas');
				this.canvas.width = 280;
				this.canvas.height = 10;
				this.ctx = this.canvas.getContext('2d');
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);

				for(var i = 0; i < colorRange.length; i++){
					gradient.addColorStop(1 / (colorRange.length -1) * i, colorRange[i]);
				}
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;

			},
			updateFixedCanvas: function(colorRange) {
				var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
				for(var i = 0; i < colorRange.length; i++){
					gradient.addColorStop(1 / (colorRange.length -1) * i, colorRange[i]);
				}
				this.ctx.fillStyle = gradient;
				this.ctx.fillRect(0, 0, 280, 10);
				this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
				//document.getElementsByTagName('body')[0].appendChild(this.canvas);
			},
			setBaseColor: function(color) {
				return this.data.baseColor = color;
			},
		/*	setStyle: function(style) {
				this.data.layer.setStyle(style)
			},*/
			countryClick: function(clickFunction) {
				var that = this;
				$timeout(function(){
						that.data.layer.options.onClick = clickFunction;
				})

			},
			getColor: function(value) {
				return this.palette[value];
			},
			setStyle: function(style){
				return this.map.style = style;
			},
			setData: function(data, color, drawIt) {
				this.map.data = data;
				if (typeof color != "undefined") {
					this.data.baseColor = color;
				}
				if (!this.canvas) {
					if(typeof this.data.baseColor == 'string'){
						this.createCanvas(this.data.baseColor);
					}
					else{
						this.createFixedCanvas(this.data.baseColor);
					}
				} else {
					if(typeof this.data.baseColor == 'string'){
						this.updateCanvas(this.data.baseColor);
					}
					else{
						this.updateFixedCanvas(this.data.baseColor);
					}
				}
				if (drawIt) {
					this.paintCountries();
				}
			},
			getNationByIso: function(iso, list) {
				if(typeof list !== "undefined"){
					if (list.length == 0) return false;
					var nation = {};
					angular.forEach(list, function(nat) {
						if (nat.iso == iso) {
							nation = nat;
						}
					});
				}
				else{
					if (this.map.data.length == 0) return false;
					var nation = {};
					angular.forEach(this.map.data, function(nat) {
						if (nat.iso == iso) {
							nation = nat;
						}
					});
				}
				return nation;
			},
			getNationByName: function(name) {
				if (this.map.data.length == 0) return false;
			},
			paintCountries: function(style, click, mutex) {
				var that = this;

				$timeout(function() {
					if (typeof style != "undefined" && style != null) {
						that.data.layer.setStyle(style);
					} else {
						that.data.layer.setStyle(that.map.style);
					}
					if (typeof click != "undefined") {
						that.data.layer.options.onClick = click
					}
					that.data.layer.redraw();
				});
			},
			resetSelected: function(iso){
				if(typeof this.data.layer.layers != "undefined"){
					angular.forEach(this.data.layer.layers[this.data.name+'_geom'].features, function(feature, key){
						if(iso){
							if(key != iso)
								feature.selected = false;
						}
						else{
							feature.selected = false;
						}

					});
					this.redraw();
				}

			},
			setSelectedFeature:function(iso, selected){
				if(typeof this.data.layer.layers[this.data.name+'_geom'].features[iso] == 'undefined'){
					console.log(iso);
					//debugger;
				}
				else{
					this.data.layer.layers[this.data.name+'_geom'].features[iso].selected = selected;
				}

			},
			redraw:function(){
				this.data.layer.redraw();
			},
			//FULL TO DO
			countriesStyle: function(feature) {
				debugger;
				var style = {};
				var iso = feature.properties[that.data.iso2];
				var nation = that.getNationByIso(iso);
				var field = that.data.field;
				var type = feature.type;
				feature.selected = false;

				switch (type) {
					case 3: //'Polygon'
						if (typeof nation[field] != "undefined" && nation[field] != null){
							var linearScale = d3.scale.linear().domain([vm.range.min,vm.range.max]).range([0,256]);

							var colorPos =  parseInt(linearScale(parseFloat(nation[field]))) * 4;// parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
							console.log(colorPos, iso,nation);
							var color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',' + that.palette[colorPos + 3] + ')';
							style.color = 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.6)'; //color;
							style.outline = {
								color: color,
								size: 1
							};
							style.selected = {
								color: 'rgba(' + that.palette[colorPos] + ', ' + that.palette[colorPos + 1] + ', ' + that.palette[colorPos + 2] + ',0.3)',
								outline: {
									color: 'rgba(66,66,66,0.9)',
									size: 2
								}
							};

						} else {
							style.color = 'rgba(255,255,255,0)';
							style.outline = {
								color: 'rgba(255,255,255,0)',
								size: 1
							};

						}
							break;
				}
				return style;
			}

		}
	}]);

})();

(function(){
    "use strict";

    angular.module('app.services').factory('BasemapsService', ["DataService", function(DataService){
        //
        return {
          basemaps:[],
          basemap:{},
          getBasemaps: function(success, error){
            var _that = this;
            DataService.getAll('basemaps').then(function(response){
              _that.basemaps = response;
              if(typeof success === 'function')
              success(_that.basemaps);
            }, error);
          },
          getBasemap: function(id, success, error){
            var _that = this;
            DataService.getOne('basemaps',id).then(function(response){
              _that.basemap = response;
              if(typeof success === 'function')
              success(_that.basemap);
            });
          },
          setBasemap: function(data){
            return this.basemap = data;
          },
          save: function(basemap, success, error){
            if(this.basemap.id == 0 || !this.basemap.id){
              DataService.post('basemaps', basemap).then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
            else{
              this.basemap.save().then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          removeItem: function(id, success, error){
            DataService.remove('basemaps', id).then(function(response){
              if(typeof success === 'function')
              success(response);
            }, function(response){
              if(typeof error === 'function')
              error(response);
            })
          }
        }
    }]);

})();

(function() {
	"use strict";

	angular.module('app.services').factory('ContentService', ["DataService", "$filter", function(DataService, $filter) {
		//
		function searchForItem(list,id){

			for(var i = 0; i < list.length;i++){
				var item = list[i];
				if(item.id == id){
					return item;
				}
				if(item.children){
					var subresult = searchForItem(item.children, id);
					if(subresult){
						return subresult;
					}

				}
			}
			return null;
		}
		return {
			content: {
				indicators: [],
				indicator: {},
				data: [],
				categories: [],
				category: {},
				styles: [],
				infographics: [],
				indices:[]
			},
			backup:{},
			fetchIndices: function(filter) {
				return this.content.indices = DataService.getAll('index').$object;
			},
			fetchIndicators: function(filter) {
				return this.content.indicators = DataService.getAll('indicators', filter).$object
			},
			fetchCategories: function(filter, withoutSave) {
				if(withoutSave){
					return DataService.getAll('categories', filter).$object;
				}
				return this.content.categories = DataService.getAll('categories', filter).$object;
			},
			fetchStyles: function(filter) {
				return this.content.styles = DataService.getAll('styles', filter).$object;
			},
			getIndices: function(filter){
				return this.fetchIndices(filter);

				return this.content.indices;
			},
			getCategories: function(filter, withoutSave) {
				if(withoutSave){
					return this.fetchCategories(filter, withoutSave);
				}
				if (this.content.categories.length == 0) {
					return this.fetchCategories(filter);
				}
				return this.content.categories;
			},
			getIndicators: function(filter) {
				if (this.content.indicators.length > 0) {
					return this.content.indicators;
				}
				return this.fetchIndicators(filter);

			},
			getStyles: function(filter) {
				if (this.content.styles.length == 0) {
					return this.fetchStyles(filter);
				}
				return this.content.styles;
			},
			getIndicator: function(id) {
				if (this.content.indicators.length > 0) {
					for (var i = 0; i < this.content.indicators.length; i++) {
						if (this.content.indicators[i].id == id) {
							return this.content.indicators[i];
						}
					}
				}
				return this.fetchIndicator(id);
			},
			fetchIndicator: function(id) {
				var that = this;
				return DataService.getOne('indicators/' + id).then(function(data){
					return that.content.indicator = data;
				});
			},
			fetchIndicatorPromise: function(id) {
				return DataService.getOne('indicators',id);
			},
			getIndicatorData: function(id, year, gender) {
				if(year && gender && gender != 'all'){
					return this.content.data = DataService.getAll('indicators/' + id + '/data/' + year + '/gender/' +gender );
				}
				else if (year) {
					return this.content.data = DataService.getAll('indicators/' + id + '/data/' + year);
				}
				return this.content.data = DataService.getAll('indicators/' + id + '/data');
			},
			getIndicatorHistory: function(id, iso, gender){
					return DataService.getAll('indicators/' + id + '/history/' + iso, {gender: gender});
			},
			getItem: function(id) {
			/*	if(this.content.indices.length > 0){
					 this.content.data = searchForItem(this.content.indices, id);
				}
				else{*/
					return this.content.data = DataService.getOne('index/', id)
				//}
			},
			removeContent:function(id, list){
				var that = this;
				angular.forEach(list, function(entry, key){
					if(entry.id == id){
						list.splice(key, 1);
						return true;
					}
					if(entry.children){
						var subresult = that.removeContent(id, entry.children);
						if(subresult){
							return subresult;
						}
					}
				});
				return false;
			},
			findContent:function(id, list){
				var found = null;
				var that = this;
				angular.forEach(list, function(entry, key){
					if(entry.id == id){
						found = entry;
					}
					if(entry.children && entry.children.length && !found){
						var subresult = that.findContent(id, entry.children);
						if(subresult){
							found = subresult;
						}
					}
				});
				return found;
			},
			addItem: function(item){
				this.content.indices.push(item)
			},
			removeItem: function(id){
				this.removeContent(id, this.content.indices);
				return DataService.remove('index/', id);
			},
			updateItem: function(item){
				var entry = this.findContent(item.id, this.content.indices);
				//console.log(entry, item);
				return entry = item;
			},
			getCategory: function(id) {
				if (this.content.categories.length) {
					return this.findContent(id, this.content.categories);
				} else {
					return this.content.category = DataService.getOne('categories/' + id).$object;
				}
			},
			removeCategory: function(id){
				this.removeContent(id, this.content.categories);
				return DataService.remove('categories/', id);
			},
			filterList: function(type, filter, list){
				if(list.length > 0){
					if(!this.backup[type]){
						this.backup[type] = angular.copy(this.content[type]);
					}
					else{
						this.content[type] = angular.copy(this.backup[type]);
					}
					return this.content[type] = $filter('filter')(this.content[type], filter)
				}
				this.content[type] = angular.copy(this.backup[type]);
				delete this.backup[type];
				return this.content[type];
			},
			resetFilter: function(type){
				if(!this.backup[type]) return this.content[type];
				this.content[type] = angular.copy(this.backup[type]);
				delete this.backup[type];
				return this.content[type];
			}

		}
	}]);

})();

(function(){
    "use strict";

    angular.module('app.services').factory('CountriesService', ["DataService", function(DataService){
        //
        return {
          countries: [],
          fetchData: function(){
            return this.countries = DataService.getOne('countries/isos').$object;
          },
          getData: function(){
            if(!this.countries.length){
              this.fetchData();
            }
            return this.countries;
          }
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.services').factory('DataService', DataService);
    DataService.$inject = ['Restangular','toastr'];

    function DataService(Restangular, toastr){
        return {
          getAll: getAll,
          getOne: getOne,
          post: post,
          put: put,
          update: update,
          remove: remove
        };

        function getAll(route, filter){
          var data = Restangular.all(route).getList(filter);
            data.then(function(){}, function(data){
              toastr.error(data.statusText, 'Connection Error');
            });
            return data;
        }
        function getOne(route, id){
          return Restangular.one(route, id).get();
        }
        function post(route, data){
          var data = Restangular.all(route).post(data);
          data.then(function(){}, function(data){
            toastr.error(data.data.error, 'Saving failed');
          });
          return data;
        }
        function put(route, data){
          return Restangular.all(route).put(data);
        }
        function update(route, id, data){
          return Restangular.one(route, id).put(data);
        }
        function remove(route, id){
          return Restangular.one(route, id).remove();
        }
    }

})();

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', ["$mdDialog", function($mdDialog){

		return {
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: './views/dialogs/' + template + '/' + template + '.html'
				};

				if ($scope){
					options.scope = $scope.$new();
				}

				return $mdDialog.show(options);
			},

			hide: function(){
				return $mdDialog.hide();
			},

			alert: function(title, content){
				$mdDialog.show(
					$mdDialog.alert()
						.title(title)
						.content(content)
						.ok('Ok')
				);
			},

			confirm: function(title, content) {
				return $mdDialog.show(
					$mdDialog.confirm()
						.title(title)
						.content(content)
						.ok('Ok')
						.cancel('Cancel')
				);
			}
		};
	}]);
})();
(function(){
    "use strict";

    angular.module('app.services').factory('ErrorCheckerService', ["DataService", "DialogService", "IndexService", function(DataService, DialogService, IndexService){
        //
        var vm = this;

        function checkMyData(data) {
    			vm.extendingChoices = [];
    			if (vm.data.length) {
    				vm.myData.then(function(imports) {
    					angular.forEach(imports, function(entry) {
    						var found = 0;
    						angular.forEach(vm.data[0].meta.fields, function(field) {
    							var columns = JSON.parse(entry.meta_data);
    							angular.forEach(columns, function(column) {
    								if (column.column == field) {
    									found++;
    								}
    							})
    						});
    						if (found >= vm.data[0].meta.fields.length - 3) {
    							vm.extendingChoices.push(entry);
    						}
    					})
    					if (vm.extendingChoices.length) {
    						if(vm.meta.year_field){
    							vm.meta.year = vm.data[0].data[0][vm.meta.year_field];
    						}
    						DialogService.fromTemplate('extendData', $scope);
    					}
    				});
    			}
          return extendedChoices;
    		}

    		function clearErrors() {
    			angular.forEach(vm.data, function(row, key) {
    				angular.forEach(row.data[0], function(item, k) {
    					if (isNaN(item) || item < 0) {
    						if ( item.toString().toUpperCase() == "#NA" || item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1) {
    							vm.data[key].data[0][k] = null;
    							row.errors.splice(0, 1);
    							vm.errors.splice(0, 1);
    						}
    					}
    				});
    				if (!row.data[0][vm.meta.iso_field]) {
    					var error = {
    						type: "2",
    						message: "Iso field is not valid!",
    						value: row.data[0][vm.meta.iso_field],
    						column: vm.meta.iso_field,
    						row: key
    					};
    					var errorFound = false;
    					angular.forEach(row.errors, function(error, key) {
    						if (error.type == 2) {
    							errorFound = true;
    						}
    					})
    					if (!errorFound) {
    						row.errors.push(error);
    						vm.iso_errors.push(error);
    					}
    				}
    			});
    		}

    		function fetchIso() {
    			if (!vm.meta.iso_field) {
    				toastr.error('Check your selection for the ISO field', 'Column not specified!');
    				return false;
    			}
    			if (!vm.meta.country_field) {
    				toastr.error('Check your selection for the COUNTRY field', 'Column not specified!');
    				return false;
    			}
    			if (vm.meta.country_field == vm.meta.iso_field) {
    				toastr.error('ISO field and COUNTRY field can not be the same', 'Selection error!');
    				return false;
    			}

    			vm.notFound = [];
    			var entries = [];
    			var isoCheck = 0;
    			var isoType = 'iso-3166-2';
    			angular.forEach(vm.data, function(item, key) {
    				if (item.data[0][vm.meta.iso_field]) {
    					isoCheck += item.data[0][vm.meta.iso_field].length == 3 ? 1 : 0;
    				}
    				switch (item.data[0][vm.meta.country_field]) {
    					case 'Cabo Verde':
    						item.data[0][vm.meta.country_field] = 'Cape Verde';
    						break;
    					case "Democratic Peoples Republic of Korea":
    						item.data[0][vm.meta.country_field] = "Democratic People's Republic of Korea";
    						break;
    					case "Cote d'Ivoire":
    						item.data[0][vm.meta.country_field] = "Ivory Coast";
    						break;
    					case "Lao Peoples Democratic Republic":
    						item.data[0][vm.meta.country_field] = "Lao People's Democratic Republic";
    						break;
    					default:
    						break;
    				}
    				entries.push({
    					iso: item.data[0][vm.meta.iso_field],
    					name: item.data[0][vm.meta.country_field]
    				});
    			});
    			var isoType = isoCheck >= (entries.length / 2) ? 'iso-3166-1' : 'iso-3166-2';
    			IndexService.resetToSelect();
    			DataService.post('countries/byIsoNames', {
    				data: entries,
    				iso: isoType
    			}).then(function(response) {
    				angular.forEach(response, function(country, key) {
    					angular.forEach(vm.data, function(item, k) {
    						if (country.name == item.data[0][vm.meta.country_field]) {
    							if (country.data.length > 1) {
    								var toSelect = {
    									entry: item,
    									options: country.data
    								};
    								IndexService.addToSelect(toSelect);
    							} else {
    								if (typeof country.data[0] != "undefined") {
    									vm.data[k].data[0][vm.meta.iso_field] = country.data[0].iso;
    									vm.data[k].data[0][vm.meta.country_field] = country.data[0].admin;
    									if (item.errors.length) {
    										angular.forEach(item.errors, function(error, e) {
    											if (error.type == 2 || error.type == 3) {
    												vm.iso_errors.splice(0, 1);
    												item.errors.splice(e, 1);
    											} else if (error.type == 1) {
    												if (error.column == vm.meta.iso_field) {
    													vm.errors.splice(0, 1);
    													item.errors.splice(e, 1);
    												}
    											}
    										});

    									}
    								} else {
    									//console.log(vm.data[k]);
    									var error = {
    										type: "3",
    										message: "Could not locate a valid iso name!",
    										column: vm.meta.country_field
    									};
    									var errorFound = false;
    									angular.forEach(vm.data[k].errors, function(error, i) {
    										console.log(error);
    										if (error.type == 3) {
    											errorFound = true;
    										}
    									})
    									if (!errorFound) {
    										IndexService.addIsoError(error);
    										item.errors.push(error);
    									}
    								}
    							}
    						}
    					});
    				});
    				vm.iso_checked = true;
    				if (IndexService.getToSelect().length) {
    					DialogService.fromTemplate('selectisofetchers');
    				}
    			}, function(response) {
    				toastr.error('Please check your field selections', response.data.message);
    			});

    		}
        return {
          checkMyData: checkMyData
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.services').factory('ExportService', ["DataService", function(DataService){

        return {
          exports:[],
          exporter:{},
          getExports: function(success, error){
            var _that = this;
            DataService.getAll('exports').then(function(response){
              _that.exports = response;
              if(typeof success === 'function')
              success(_that.exports);
            }, error);
          },
          getExport: function(id, success, error){
            var _that = this;
            DataService.getOne('exports', id).then(function(response){
              _that.exporter = response;
              if(typeof success === 'function')
              success(_that.exporter);
            });
          },
          setExport: function(data){
            return this.exporter = data;
          },
          save: function(success, error){
            if(this.exporter.id == 0 || !this.exporter.id){
              DataService.post('exports', this.exporter).then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
            else{
              
             this.exporter.save().then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          remove: function(id, success, error){
            DataService.remove('exports', id).then(function(response){
              if(typeof success === 'function')
              success(response);
            }, function(response){
              if(typeof error === 'function')
              error(response);
            })
          }
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.services').factory('IconsService', function(){
        var unicodes = {
          'empty': "\ue600",
          'agrar': "\ue600",
          'anchor': "\ue601",
          'butterfly': "\ue602",
          'energy':"\ue603",
          'sink': "\ue604",
          'man': "\ue605",
          'fabric': "\ue606",
          'tree':"\ue607",
          'water':"\ue608"
        };

        return {
          getUnicode: function(icon){
            return unicodes[icon];
          },
          getList:function(){
            return unicodes;
          }
        }
    });

})();

(function(){
    "use strict";

    angular.module('app.services').factory('IndexService', ["CacheFactory", "$state", function(CacheFactory,$state){
        //
        var serviceData = {
            data: [],
            errors: [],
            iso_errors:[],
            meta:{
              iso_field: '',
              country_field:'',
              year_field:'',
              gender_field:'',
              table:[]
            },
            indicators:{},
            toSelect:[]
        }, storage, importCache, indicator;

        if (!CacheFactory.get('importData')) {
          importCache = CacheFactory('importData', {
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
          });
          serviceData = importCache.get('dataToImport');
        }
        else{
          importCache = CacheFactory.get('importData');
          storage = importCache.get('dataToImport');
        }
        return {
          clear:function(){
            $state.go('app.index.create');
            if(CacheFactory.get('importData')){
                importCache.remove('dataToImport');
            }
            return serviceData= {
                data: [],
                errors: [],
                iso_errors:[],
                meta:{
                  iso_field: '',
                  country_field:'',
                  year_field:'',
                  gender_field:''
                },
                toSelect:[],
                indicators:{}
            };
          },
          addData:function(item){
            return serviceData.data.push(item);
          },
          addIndicator: function(item){
            return serviceData.indicators.push(item);
          },
          addToSelect: function(item){
            return serviceData.toSelect.push(item);
          },
          addIsoError: function(error){
            return serviceData.iso_errors.push(error);
          },
          removeToSelect: function(item){
            var index = serviceData.toSelect.indexOf(item);
            return index > -1 ? serviceData.toSelect.splice(index, 1) : false;
          },
          setData: function(data){
            return serviceData.data = data;
          },
          setIsoField: function(key){
            return serviceData.meta.iso_field = key;
          },
          setCountryField: function(key){
            return serviceData.meta.country_field = key;
          },
          setGenderField: function(key){
            return serviceData.meta.gender_field = key;
          },
          setYearField: function(key){
            return serviceData.meta.year_field = key;
          },
          setErrors: function(errors){
            return serviceData.errors = errors;
          },
          setToLocalStorage: function(){
            //console.log(serviceData);
          importCache.put('dataToImport',serviceData);
          },
          setIndicator: function(key, item){
            return serviceData.indicators[key] = item;
          },
          setActiveIndicatorData: function(item){
            return indicator = serviceData.indicators[item.column_name] = item;
          },
          getFromLocalStorage: function(){
            return serviceData = importCache.get('dataToImport');
          },
          getFullData: function(){
            return serviceData;
          },
          getData: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.data;
          },
          getMeta: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.meta;
          },
          getToSelect: function(){
            return serviceData.toSelect;
          },
          getIsoField: function(){
            return serviceData.meta.iso_field;
          },
          getCountryField: function(){
            return serviceData.meta.country_field;
          },
          getErrors: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.errors;
          },
          getIsoErrors: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.iso_errors;
          },
          getFirstEntry: function(){
            return serviceData.data[0];
          },
          getDataSize: function(){
            return serviceData.data.length;
          },
          getIndicator: function(key){
            return indicator = serviceData.indicators[key];
          },
          getIndicators: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.indicators;
          },
          activeIndicator: function(){
            return indicator;
          },
          resetIndicator:function(){
            return indicator = null;
          },
          reduceIsoError:function(){
            return serviceData.iso_errors.splice(0,1);
          },
          reduceError:function(){
            return serviceData.errors.splice(0,1);
          },
          resetToSelect: function(){
            return serviceData.toSelect = [];
          },
          resetLocalStorage: function(){
            if(CacheFactory.get('importData')){
                importCache.remove('dataToImport');
            }
            return serviceData= {
                data: [],
                errors: [],
                iso_errors:[],
                meta:{
                  iso_field: '',
                  country_field:'',
                  year_field:''
                },
                toSelect:[],
                indicators:{}
            };
          }
        }
    }]);

})();

(function () {
	"use strict";

	angular.module('app.services').factory('IndizesService', ["DataService", function (DataService) {
		//
		return {
			index: {
				data: {
					data: null,
					structure: null
				},
				promises: {
					data: null,
					structur: null
				}
			},
			fetchData: function(index) {
				this.index.promises.data = DataService.getAll('index/' + index + '/year/latest');
				this.index.promises.structure = DataService.getOne('index/' + index + '/structure');
				this.index.data.data = this.index.promises.data.$object;
				this.index.data.structure = this.index.promises.structure.$object;
				return this.index;
			},
			getData: function () {
				return this.index.data.data;
			},
			getStructure: function () {
				return this.index.data.structure;
			},
			getDataPromise: function () {
				return this.index.promises.data;
			},
			getStructurePromise: function () {
				return this.index.promises.structure;
			}
		}
	}]);

})();

(function () {
		"use strict";

		angular.module('app.services').factory('RecursionHelper', ["$compile", function ($compile) {
				//
				return {
					/**
					 * Manually compiles the element, fixing the recursion loop.
					 * @param element
					 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
					 * @returns An object containing the linking functions.
					 */
					compile: function (element, link) {
						// Normalize the link parameter
						if (angular.isFunction(link)) {
							link = {
								post: link
							};
						}

						// Break the recursion loop by removing the contents
						var contents = element.contents().remove();
						var compiledContents;
						return {
							pre: (link && link.pre) ? link.pre : null,
							/**
							 * Compiles and re-adds the contents
							 */
							post: function (scope, element) {
								// Compile the contents
								if (!compiledContents) {
									compiledContents = $compile(contents);
								}
								// Re-add the compiled contents to the element
								compiledContents(scope, function (clone) {
									element.append(clone);
								});

								// Call the post-linking function, if any
								if (link && link.post) {
									link.post.apply(null, arguments);
								}
							}
						};
					}
				}
				}]);

		})();

(function(){
	"use strict";

	angular.module("app.services").factory('ToastService', ["$mdToast", function($mdToast){

		var delay = 6000,
			position = 'top right',
			action = 'OK';

		return {
			show: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.action(action)
						.hideDelay(delay)
				);
			},
			error: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.theme('warn')
						.action(action)
						.hideDelay(delay)
				);
			}
		};
	}]);
})();
(function(){
    "use strict";

    angular.module('app.services').factory('UserService', ["DataService", function(DataService){
        //

        return {
          user:{
            data: []
          },
          myData: function(){
            return this.user.data = DataService.getAll('me/data');
          },
          myProfile: function(){

          },
          myFriends: function(){

          }
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('BasemapDetailsCtrl', ["$state", "BasemapsService", "VectorlayerService", function($state, BasemapsService, VectorlayerService){
        //
        var vm = this;
        vm.basemap = {}
        vm.selected = [];
        vm.options = {
          save: function(){
            console.log(vm.basemap);
            BasemapsService.save(vm.basemap);

          },
          withSave: true,
        };

        activate();

        function activate(){
          if($state.params.id != 0){
            BasemapsService.getBasemap($state.params.id, function(response){
              vm.basemap = response;
              VectorlayerService.setBaseLayer(vm.basemap);
            });
          }
        }
        function removeItem(item, list){
    			angular.forEach(list, function(entry, key){
    				if(entry.id == item.id){
    					list.splice(key, 1);
    					return true;
    				}
    				if(entry.children){
    					var subresult = removeItem(item, entry.children);
    					if(subresult){
    						return subresult;
    					}
    				}
    			});
    			return false;
    		}
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('BasemapsCtrl', ["$state", "BasemapsService", function($state, BasemapsService){
        //
        var vm = this;
        vm.basemaps = [];
        vm.selection = [];
    		vm.options = {
    			drag: false,
    			type: 'basemaps',
    			allowMove: false,
    			allowDrop: false,
    			allowAdd: true,
    			allowDelete: true,
    			itemClick: function(id, name) {
    				$state.go('app.index.basemaps.details', {
    					id: id,
    					name: name
    				})
    			},
    			addClick: function() {
    				$state.go('app.index.basemaps.details', {
    					id: 0,
    					name: 'new'
    				})
    			},
    			deleteClick: function() {
    				angular.forEach(vm.selection, function(item, key) {
    					BasemapsService.removeItem(item.id).then(function(data) {
    						if ($state.params.id == item.id) {
    							$state.go('app.index.basemaps');
    						}
    						vm.selection = [];
    					});
    				});

    			}
    		};

        activate();

        function activate(){
          BasemapsService.getBasemaps(function(response){
            vm.basemaps = response;
          });
        }
    }]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('ConflictImportCtrl', ["Restangular", "toastr", "$state", function(Restangular, toastr, $state) {
		//
		var vm = this;
		vm.nations = [];
		vm.events = [];
		vm.sum = 0;

		vm.saveToDb = saveToDb;

		function saveToDb() {
			var data = {
				nations: vm.nations,
				events: vm.events
			};
			Restangular.all('/conflicts/import').post(data).then(function(data) {
				$state.go('app.conflict.index')
			});
		}

	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('ConflictdetailsCtrl', ["$timeout", "$state", "$scope", "$rootScope", "VectorlayerService", "conflict", "conflicts", "nations", "DialogService", function($timeout, $state, $scope, $rootScope, VectorlayerService, conflict, conflicts, nations, DialogService) {
		//
		var vm = this;
		vm.conflict = conflict;
		vm.conflicts = nations;
		vm.conflictItems = [
			'territory',
			'secession',
			'autonomy',
			'system',
			'national_power',
			'international_power',
			'subnational_predominance',
			'resources',
			'other'
		];
		vm.showMethod = showMethod;
		vm.showCountries = false;
		vm.getTendency = getTendency;
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
		vm.relations = [];
		vm.countries = [];
		vm.showText = showText;
		vm.showCountriesButton = showCountriesButton;
		vm.circleOptions = {
			color: '#4fb0e5',
			field: 'int2015',
			size: 5,
			hideNumbering: true,
			width:65,
			height:65
		};

		activate();

		function activate() {
			//;
			$rootScope.greyed = true;
			nations.getList().then(function(response) {

				vm.conflicts = response;
				VectorlayerService.resetSelected();
				VectorlayerService.setData(vm.conflicts, vm.colors, true);
				VectorlayerService.setStyle(invertedStyle);
				VectorlayerService.countryClick(countryClick);
				VectorlayerService.resetSelected();

				//VectorlayerService.setSelectedFeature(vm.nation.iso, true);
				angular.forEach(vm.conflict.nations, function(nation) {
					var i = vm.relations.indexOf(nation.iso);
					if (i == -1) {
						vm.relations.push(nation.iso)
						vm.countries.push(nation);
						VectorlayerService.setSelectedFeature(nation.iso, true);
					}
				});


				VectorlayerService.paintCountries(invertedStyle);
				/*DataService.getOne('countries/bbox', vm.relations).then(function (data) {
					var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
						northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
						bounds = L.latLngBounds(southWest, northEast);

					var pad = [
						[0, 0],
						[50, 50]
					];

					VectorlayerService.mapLayer.fitBounds(bounds, {
						padding: pad[1],
						maxZoom: 4
					});
				});*/
			});

		}

		function countryClick(evt, t) {

			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {
				$state.go('app.conflict.index.nation', {
					iso: country.iso
				});
			}
		}

		function showText() {
			DialogService.fromTemplate('conflicttext', $scope);
		}

		function showMethod() {
			DialogService.fromTemplate('conflictmethode');
		}

		function invertedStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);
			var field = 'intensity';
			var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;

			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: color,
					size: 1
				}
			};
			return style;
		}

		function getTendency() {
			if (vm.conflict == null) return "remove";
			if (vm.conflict.int2015 == vm.conflict.int2014)
				return "remove";
			if (vm.conflict.int2015 < vm.conflict.int2014)
				return "trending_down";

			return "trending_up";
		}

		function showCountriesButton() {
			if (vm.showCountries) return "arrow_drop_up";
			return "arrow_drop_down";
		}
	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('ConflictitemsCtrl', ["$rootScope", function($rootScope) {
		//
		var vm = this;
		vm.showList = false;
		$rootScope.conflictItems = [
			'territory',
			'secession',
			'autonomy',
			'system',
			'national_power',
			'international_power',
			'subnational_predominace',
			'resources',
			'other'
		];
		vm.toggleItem = toggleItem;

		function toggleItem(item) {
			console.log(item, $rootScope.conflictItems);
			var i = $rootScope.conflictItems.indexOf(item);
			if (i > -1) {
				$rootScope.conflictItems.splice(i, 1);
			} else {
				$rootScope.conflictItems.push(item);
			}

			if ($rootScope.conflictItems.length == 0) {
				$rootScope.conflictItems = [
					'territory',
					'secession',
					'autonomy',
					'system',
					'national_power',
					'international_power',
					'subnational_predominace',
					'resources',
					'other'
				];
			}
		};
	}]);

})();
(function() {
	"use strict";

	angular.module('app.controllers').controller('ConflictnationCtrl', ["$timeout", "$state", "$rootScope", "nations", "nation", "VectorlayerService", "DataService", "DialogService", function($timeout, $state, $rootScope, nations, nation, VectorlayerService, DataService, DialogService) {
		//
		var vm = this;
		vm.nation = nation;
		vm.showMethod = showMethod;
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
		vm.relations = [];
		vm.featured = [];
		vm.conflict = null;
		vm.getTendency = getTendency;
		vm.circleOptions = {
			color: '#4fb0e5',
			field: 'intensity',
			size: 5,
			hideNumbering: true,
			width:65,
			height:65
		};
		activate();

		function activate() {

			$rootScope.greyed = true;
			$rootScope.featureItems = [];

			nations.getList().then(function(response) {
				vm.conflicts = response;
				vm.relations.push(vm.nation.iso);
				vm.featured = [];
				VectorlayerService.resetSelected(vm.nation.iso);
				VectorlayerService.setData(vm.conflicts, vm.colors, true);
				VectorlayerService.setStyle(invertedStyle);
				VectorlayerService.countryClick(countryClick);
				VectorlayerService.setSelectedFeature(vm.nation.iso, true);
				$rootScope.featureItems = [];
				angular.forEach(vm.nation.conflicts, function(conflict) {
					if (!vm.conflict) vm.conflict = conflict;
					if (conflict.int2015 > vm.conflict.int2015) {
						vm.conflict = conflict;
					}
					angular.forEach(conflict, function(item, key){
						if(item == 1 ){
							if(vm.featured.indexOf(key) == -1){
								vm.featured.push(key);
								$rootScope.featureItems = vm.featured;
							}
						}

					})
					angular.forEach(conflict.nations, function(nation) {
						var i = vm.relations.indexOf(nation.iso);
						if (i == -1 && nation.iso != vm.nation.iso) {
							vm.relations.push(nation.iso)
							VectorlayerService.setSelectedFeature(nation.iso, true);
						}
					});
				});

				VectorlayerService.paintCountries(invertedStyle);
				/*DataService.getOne('countries/bbox', vm.relations).then(function (data) {
					var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
						northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
						bounds = L.latLngBounds(southWest, northEast);

					var pad = [
						[0, 0],
						[50, 50]
					];

					VectorlayerService.mapLayer.fitBounds(bounds, {
						padding: pad[1],
						maxZoom: 4
					});
				});*/
			})



		}


		function showMethod() {
			DialogService.fromTemplate('conflictmethode');
		}

		function getTendency() {
			if (vm.conflict == null) return "remove";
			if (vm.conflict.int2015 == vm.conflict.int2014)
				return "remove";
			if (vm.conflict.int2015 < vm.conflict.int2014)
				return "trending_down";

			return "trending_up";
		}

		function countryClick(evt, t) {

			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {

				$state.go('app.conflict.index.nation', {
					iso: country.iso
				});
			}
		}

		function invertedStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);
			var field = 'intensity';
			var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;

			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)';
			var colorFull = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			var outline = {
				color: color,
				size: 1
			};
			if (iso == vm.nation.iso) {
				outline = {
					color: 'rgba(54,56,59,0.8)',
					size: 2
				};
				color = color;
			}
			style.selected = {
				color: color,
				outline: outline
			};
			return style;
		}
	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('ConflictsCtrl', ["$timeout", "$state", "$rootScope", "$scope", "conflicts", "nations", "VectorlayerService", "Restangular", "DialogService", "Fullscreen", function ($timeout, $state, $rootScope, $scope, conflicts, nations, VectorlayerService, Restangular, DialogService, Fullscreen) {
		//

		var vm = this;
		vm.ready = false;
		vm.relations = [];
		vm.showMethod = showMethod;
		vm.goFullscreen = goFullscreen;
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#add9f0', '#87cceb', '#36a8c6', '#268399', '#005573'];
		vm.typesColors = {
			interstate: '#69d4c3',
			intrastate: '#b7b7b7',
			substate: '#ff9d27'
		};
		vm.active = {
			conflict: [],
			type: [1, 2, 3]
		};
		vm.toggleConflictFilter = toggleConflictFilter;
		vm.conflictFilter = null;


		activate();

		function activate() {
			$rootScope.greyed = true;
			VectorlayerService.setStyle(countriesStyle);
			VectorlayerService.countryClick(countryClick);
			nations.getList().then(function (response) {
				vm.nations = response;
				VectorlayerService.setData(vm.nations, vm.colors, true);
			});
			conflicts.getList().then(function (response) {
				vm.conflicts = response;
				calcIntensities();
			});

			//	$timeout(function() {

			//});
		}

		function goFullscreen() {

		 if (Fullscreen.isEnabled())
				Fullscreen.cancel();
		 else
				Fullscreen.all();

		 // Set Fullscreen to a specific element (bad practice)
		 // Fullscreen.enable( document.getElementById('img') )

	}
		function setValues() {
			vm.relations = [];
			vm.conflictFilterCount = 0;
			vm.conflictIntensities = {
				veryLow: 0,
				low: 0,
				mid: 0,
				high: 0,
				veryHigh: 0
			};
			vm.chartData = [{
				label: 1,
				value: 0,
				color: vm.colors[0]
			}, {
				label: 2,
				value: 0,
				color: vm.colors[1]
			}, {
				label: 3,
				value: 0,
				color: vm.colors[2]
			}, {
				label: 4,
				value: 0,
				color: vm.colors[3]
			}, {
				label: 5,
				value: 0,
				color: vm.colors[4]
			}];

			vm.conflictTypes = [{
				type: 'interstate',
				type_id: 1,
				color: '#69d4c3',
				count: 0
			}, {
				type: 'intrastate',
				count: 0,
				type_id: 2,
				color: '#b7b7b7'
			}, {
				type: 'substate',
				count: 0,
				type_id: 3,
				color: '#ff9d27'
			}];

		}

		function showMethod() {
			DialogService.fromTemplate('conflictmethode');
		}

		function toggleConflictFilter(type) {

			var i = vm.active.type.indexOf(type);
			if (i > -1) {
				vm.active.type.splice(i, 1);
			} else {
				vm.active.type.push(type);
			}
			if (vm.active.type.length == 0) {
				vm.active.type = [1, 2, 3];
			}
			calcIntensities();
		}

		function calcConflict(conflict) {
			vm.conflictFilterCount++;
			switch (conflict.type_id) {
			case 1:
				vm.conflictTypes[0].count++;
				break;
			case 2:
				vm.conflictTypes[1].count++;
				break;
			case 3:
				vm.conflictTypes[2].count++;
				break;
			default:

			}
			switch (conflict.int2015) {
			case 1:
				vm.conflictIntensities.veryLow++;
				vm.chartData[0].value++;
				break;
			case 2:
				vm.conflictIntensities.low++;
				vm.chartData[1].value++;
				break;
			case 3:
				vm.conflictIntensities.mid++;
				vm.chartData[2].value++;
				break;
			case 4:
				vm.conflictIntensities.high++;
				vm.chartData[3].value++;
				break;
			case 5:
				vm.conflictIntensities.veryHigh++;
				vm.chartData[4].value++;
				break;
			default:
			}
			addCountries(conflict.nations);
		}
		function addCountries(nations){
			angular.forEach(nations, function(nat){
				if(vm.relations.indexOf(nat.iso) == -1){
					vm.relations.push(nat.iso);
				}
			});
		}
		function calcIntensities() {
			setValues();
			angular.forEach(vm.conflicts, function (conflict) {
				if (vm.active.type.length) {
					if (vm.active.type.indexOf(conflict.type_id) > -1) {
						calcConflict(conflict);
					}
				} else {
					calcConflict(conflict);
				}
			});
			vm.ready = true;
			//VectorlayerService.redraw();
			VectorlayerService.paintCountries();
		}

		function countryClick(evt, t) {
			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {
				$state.go('app.conflict.index.nation', {
					iso: country.iso
				});
			}
		}

		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);

			var field = 'intensity';
			var type = feature.type;
			feature.selected = false;
			if(vm.relations.indexOf(iso) == -1){
				style.color = 'rgba(255,255,255,0)';
				style.outline = {
					color: 'rgba(255,255,255,0)',
					size: 1
				};
			}
			else{
				switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined" && nation[field] != null && iso) {
						var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
						var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')',
							outline: {
								color: 'rgba(66,66,66,0.9)',
								size: 2
							}
						};

					} else {
						style.color = 'rgba(255,255,255,0)';
						style.outline = {
							color: 'rgba(255,255,255,0)',
							size: 1
						};

					}
					break;
				}
			}


			return style;
		};
	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportCtrl', ["$state", "ExportService", function($state, ExportService) {
		//
		var vm = this;
		vm.exports = [];

		vm.selection = [];
		vm.options = {
			drag: false,
			type: 'exports',
			allowMove: false,
			allowDrop: false,
			allowAdd: true,
			allowDelete: true,
			itemClick: function(id, name) {
				$state.go('app.index.exports.details', {
					id: id,
					name: name
				})
			},
			addClick: function() {
				$state.go('app.index.exports.details', {
					id: 0,
					name: 'new'
				})
			},
			deleteClick: function() {
				angular.forEach(vm.selection.indices, function(item, key) {
					ContentService.removeItem(item.id).then(function(data) {
						if ($state.params.id == item.id) {
							$state.go('app.index.editor.indizes');
						}
						vm.selection.indices = [];
					});
				});
				//$state.go('app.index.editor.indizes');
			}
		};

		activate();

		function activate() {
			ExportService.getExports(function(response){
					vm.exports = response;
			});
		}
	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportDetailsCtrl', ["$state", "ExportService", function($state, ExportService){
        //
        var vm = this;
        vm.export = {}
        vm.selected = [];
        vm.options = {
          exports:{
            onDrop: function(event, index, item, external){
              item.indicator_id = item.id;
              item.type = 'indicator';
            },
            inserted: function(event, index, item, external){

            },
            addClick: function(){
              $state.go('app.index.exports.details.add');
            },
    				addContainerClick:function(){
    					var item = {
    						title: 'I am a group... name me'
    					};
    					vm.export.items.push(item);
    				},
    				deleteClick:function(){
    					angular.forEach(vm.selected,function(item, key){
    							removeItem(item,vm.export.items);
                  ExportService.remove(vm,item.id);
    							vm.selected = [];
    					});
    				},
    				deleteDrop: function(event,item,external,type){
    						removeItem(item,vm.export.items);
    						vm.selection = [];
    				},
            save: function(){
              console.log('saving');
              ExportService.save(function(response){
                console.log('done saving', vm.export);
                if(vm.export.id == 0 || !vm.export.id){
                  $state.go('app.index.exports.details',{id:response.id, name:response.name});
                }
              });
              // if(vm.export.id == 0 || ! vm.export.id){
              //   DataService.post('exports', vm.export).then(function(){
              //
              //   });
              // }
              // else{
              //   vm.item.save().then(function(response){
              //
              //   });
              // }
            }
          },
          style:{
            click: function(item){
              $state.go('app.index.exports.details.style',{styleId:item.id, styleName:item.name})
            }
          },
          withSave: true,
          styleable: true
        };

        activate();

        function activate(){
          if($state.params.id != 0){
            ExportService.getExport($state.params.id, function(response){
              vm.export = response;
            });
          }
          else{
            vm.export = ExportService.setExport({
              items: []
            });
          }

        }
        function removeItem(item, list){
    			angular.forEach(list, function(entry, key){
    				if(entry.id == item.id){
    					list.splice(key, 1);
    					return true;
    				}
    				if(entry.children){
    					var subresult = removeItem(item, entry.children);
    					if(subresult){
    						return subresult;
    					}
    				}
    			});
    			return false;
    		}
    }]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportStyleCtrl', ["$scope", "$state", "$timeout", "ExportService", "leafletData", "leafletMapEvents", "VectorlayerService", function($scope, $state, $timeout, ExportService,  leafletData, leafletMapEvents, VectorlayerService) {
    var vm = this;
		vm.exporter = {};
    vm.item = {};

		activate();

		function activate() {
			$timeout(function() {
				vm.exporter = ExportService.exporter;
        // if(!vm.exporter.items.length) $state.go('app.index.exports.details',{
        //   id: $state.params.id,
        //   name: $state.params.name
        // })
				vm.item = getActiveItem(vm.exporter.items, $state.params.styleId);
				console.log(vm.item);
				if(typeof vm.item == "undefined") $state.go('app.index.exports.details',{
          id: $state.params.id,
          name: $state.params.name
        })
				if(!vm.item.style){
					vm.item.style = {
						basemap_id:0,
						fixed_title: false,
						fixed_description:false,
						search_box: true,
						share_options: true,
						zoom_controls: true,
						scroll_wheel_zoom: false,
						layer_selection: false,
						legends:true,
						full_screen: false
					};
				}
				
			});
		}

		function getActiveItem(list, id) {
			var found;
			angular.forEach(list, function(item) {
				if (item.id == id) {
					found = item;
				} else {
					if (item.children && !found)
						found = getActiveItem(item.children, id);
				}
			});
			return found;
		};


		$scope.$watch('vm.item.style', function(n, o){
			if(n === o || !n.basemap) return;
			VectorlayerService.setBaseLayer(n.basemap);
			// VectorlayerService.layers.baselayers['xyz'].url = n.basemap.url;
		}, true);
	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('FullListFitlerCtrl', ["categories", "ContentService", function(categories, ContentService) {
    var vm = this;
    vm.categories = categories;

    vm.filter = [];
    vm.options = {
      categories:{
        selectionChanged: function(){
          vm.filter =[];
          angular.forEach(vm.selection, function(item){
            listCategories(item);
          });
          ContentService.filterList('indicators',catFilter,vm.selection);
          ContentService.filterList('indices',catFilter,vm.selection);
        }
      }
    };
    function addToFilter(id){
      var idx = vm.filter.indexOf(id);
      if(idx == -1){
        vm.filter.push(id);
      }
    }
    function listCategories(cat){
      addToFilter(cat.id);
      if(cat.children){
        angular.forEach(cat.children, function(child){
          addToFilter(child.id);
          listCategories(child);
        });
      }
    };
    function catFilter(item){
				if(item.categories.length > 0 && vm.filter.length > 0){
					var found = false;
					angular.forEach(item.categories, function(cat){
						if(vm.filter.indexOf(cat.id) > -1){
							found = true;
						}
					});
					return found;
				}
				return true;
		}
  }]);
})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('FullListCtrl', ["$scope", "$state", "ContentService", "categories", "indicators", "indices", function($scope,$state, ContentService, categories, indicators, indices) {
		//
		var vm = this;
		vm.categories = categories;
		vm.indicators = indicators;
		vm.indices = indices;
		vm.filter = {
			sort: 'title',
			toggle: function(){
				if($state.current.name == 'app.index.list'){
					$state.go('app.index.list.filter',{filter:'categories'})
				}
				else{
					ContentService.resetFilter('indicators');
					ContentService.resetFilter('indices');
					$state.go('app.index.list')
				}
			}
		};
		
		$scope.$watch(function(){return ContentService.content.indicators}, function(n, o){
			if(n === o )return;
			vm.indicators = n;
		});
		$scope.$watch(function(){return ContentService.content.indices}, function(n, o){
			if(n === o )return;
			vm.indices = n;
		});
	}]);
})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "$mdMedia", "leafletData", "$state", "$localStorage", "$rootScope", "$auth", "toastr", "$timeout", function($scope,$mdMedia, leafletData, $state,$localStorage, $rootScope, $auth, toastr, $timeout){

		var vm = this;
		$rootScope.isAuthenticated = isAuthenticated;
		vm.doLogin = doLogin;
		vm.doLogout = doLogout;
		vm.openMenu = openMenu;
		vm.toggleView = toggleView;

		vm.authenticate = function(provider){
			$auth.authenticate(provider);
		};

		function isAuthenticated(){
			 return $auth.isAuthenticated();
		}
		function doLogin(){
			$auth.login(vm.user).then(function(response){
				toastr.success('You have successfully signed in');
				//$state.go($rootScope.previousPage.state.name || 'app.home', $rootScope.previousPage.params);
			}).catch(function(response){
				toastr.error('Please check your email and password', 'Something went wrong');
			})
		}
		function doLogout(){
			if($auth.isAuthenticated()){
				$auth.logout().then(function(data){
					if($state.current.auth){
						$state.go('app.home');
					}
					toastr.success('You have successfully logged out');
				}).catch(function(response){

				});
			}
		}

    function openMenu($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };
		function toggleView(){
			$rootScope.looseLayout = !$rootScope.looseLayout;
			$localStorage.fullView = $rootScope.looseLayout;
			resetMapSize();
		}
		function resetMapSize(){
			$timeout(function(){
				leafletData.getMap('map').then(function (map) {
					map.invalidateSize();
				})
			}, 300);
		}
		$rootScope.sidebarOpen = true;
		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});
		$scope.$watch('$root.sidebarOpen', function(n,o){
			if(n == o) return false;
			resetMapSize();
		});
		$scope.$watch(function() { return $mdMedia('sm') }, function(small) {
	    vm.smallScreen = small;
	  });

	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('HomeCtrl', ["DataService", function(DataService){
        var vm = this;
      
        DataService.getAll('index', {is_official: true}).then(function(response){
          vm.indizes = response;
        });

    }]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('ImportcsvCtrl', ["$mdDialog", function ($mdDialog) {
		this.settings = {
			printLayout: true,
			showRuler: true,
			showSpellingSuggestions: true,
			presentationMode: 'edit'
		};

		this.sampleAction = function (name, ev) {
			$mdDialog.show($mdDialog.alert()
				.title(name)
				.content('You triggered the "' + name + '" action')
				.ok('Great')
				.targetEvent(ev)
			);
		};

    this.openCsvUpload = function() {
			$mdDialog.show({
					//controller: DialogController,
					templateUrl: '/views/app/importcsv/csvUploadDialog.html',
	        bindToController: true,
				})
				.then(function (answer) {

				}, function () {

				});
		};
	}])


})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('IndexCtrl', ["$scope", "$window", "$mdSidenav", "$rootScope", "$filter", "$state", "$timeout", "toastr", "VectorlayerService", "data", "countries", "leafletData", "DataService", function($scope, $window,$mdSidenav, $rootScope, $filter, $state, $timeout, toastr, VectorlayerService, data, countries, leafletData, DataService) {
		// Variable definitions
		var vm = this;
		vm.map = null;

		vm.dataServer = data.promises.data;
		vm.structureServer = data.promises.structure;
		vm.countryList = countries;

		vm.structure = "";
		vm.mvtScource = VectorlayerService.getLayer();
		vm.mvtCountryLayer = VectorlayerService.getName();
		vm.mvtCountryLayerGeom = vm.mvtCountryLayer + "_geom";
		vm.iso_field = VectorlayerService.data.iso2;
		vm.nodeParent = {};
		vm.selectedTab = 0;
		vm.current = "";
		vm.tabContent = "";
		vm.toggleButton = 'arrow_drop_down';
		vm.menueOpen = true;
		vm.info = false;
		vm.closeIcon = 'close';
		vm.compare = {
			active: false,
			countries: []
		};
		vm.display = {
			selectedCat: ''
		};

		//Function definitons
		vm.showTabContent = showTabContent;
		vm.setTab = setTab;
		vm.setState = setState;
		vm.setCurrent = setCurrent;
		vm.setSelectedFeature = setSelectedFeature;
		vm.getRank = getRank;
		vm.getOffset = getOffset;
		vm.getTendency = getTendency;

		vm.checkComparison = checkComparison;
		vm.toggleOpen = toggleOpen;
		vm.toggleInfo = toggleInfo;
		vm.toggleDetails = toggleDetails;
		vm.toggleComparison = toggleComparison;
		vm.toggleCountrieList = toggleCountrieList;
		vm.mapGotoCountry = mapGotoCountry;
		vm.goBack = goBack;
		vm.goToIndex = goToIndex;

		vm.calcTree = calcTree;

		vm.isPrelast = isPrelast;

		activate();

		function activate() {

			vm.structureServer.then(function(structure) {
				vm.dataServer.then(function(data) {
					vm.data = data;
					vm.structure = structure;
					if (!vm.structure.style) {
						vm.structure.style = {
							'name': 'default',
							'title': 'Default',
							'base_color': 'rgba(128, 243, 198,1)'
						};
					}
					createCanvas(vm.structure.style.base_color);
					drawCountries();
					if ($state.params.item) {
						vm.setState($state.params.item);
						calcRank();
					}
					if ($state.params.countries) {
						vm.setTab(2);
						vm.compare.countries.push(vm.current);
						vm.compare.active = true;
						$rootScope.greyed = true;
						var countries = $state.params.countries.split('-vs-');
						angular.forEach(countries, function(iso) {
							vm.compare.countries.push(getNationByIso(iso));
						});
						//onsole.log(vm.compare.countries);
						countries.push(vm.current.iso);
						DataService.getOne('countries/bbox', countries).then(function(data) {
							vm.bbox = data;
						});
					}
				})
			});

		}
		// TODO: MOVE TO GLOBAL
		function goBack() {
			$window.history.back();
		}
		function goToIndex(item){

			$state.go('app.index.show.selected',{
				id:item.id,
				name:item.name,
				item:$state.params['item']
			});
		}
		function isPrelast(){
			var levelsFound = false;
			angular.forEach(vm.structure.children, function(child){
				if(child.children.length > 0){
					levelsFound = true;
				}
			});
			return levelsFound;
		}
		function showTabContent(content) {
			if (content == '' && vm.tabContent == '') {
				vm.tabContent = 'rank';
			} else {
				vm.tabContent = content;
			}
			vm.toggleButton = vm.tabContent ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		function setState(item) {
			vm.setCurrent(getNationByIso(item));
			fetchNationData(item);
		};

		function toggleOpen() {
			vm.menueOpen = !vm.menueOpen;
			vm.closeIcon = vm.menueOpen == true ? 'chevron_left' : 'chevron_right';
		}

		function setCurrent(nat) {
			vm.current = nat;

			vm.setSelectedFeature();

			$mdSidenav('left').open();
		};

		function setSelectedFeature(iso) {
			if (vm.mvtSource) {
				$timeout(function() {
					vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
				})
			}
		};

		//TODO: MOVE TO SERVICE
		function calcRank() {
			if (!vm.current) {
				return;
			}
			var rank = 0;
			var kack = [];
			angular.forEach(vm.data, function(item) {
				item[vm.structure.name] = parseFloat(item[vm.structure.name]);
				item['score'] = parseFloat(item[vm.structure.name]);
			});
			//vm.data = $filter('orderBy')(vm.data, 'score', 'iso', true);
			rank = vm.data.indexOf(vm.current) + 1;
			vm.current[vm.structure.name + '_rank'] = rank;
			vm.circleOptions = {
				color: vm.structure.style.base_color || '#00ccaa',
				field: vm.structure.name + '_rank',
				size: vm.data.length
			};

			return rank;
		}

		function getRank(country) {

			var rank = vm.data.indexOf(country) + 1;
			return rank;
		}

		//TODO: REMOVE, NOW GOT OWN URL
		function toggleInfo() {
			vm.info = !vm.info;
		};

		//TODO: PUT IN VIEW
		function toggleDetails() {
			return vm.details = !vm.details;
		};

		//TODO: MOVE TO SERVICE
		function fetchNationData(iso) {
			DataService.getOne('index/' + $state.params.id, iso).then(function(data) {
				vm.current.data = data;
				mapGotoCountry(iso);
			});
		}

		//TODO: MOVE TO MAP SERVICE
		function mapGotoCountry(iso) {
			if (!$state.params.countries) {
				DataService.getOne('countries/bbox', [iso]).then(function(data) {
					vm.bbox = data;
				});
			}

		}

		function checkComparison(want) {
			if (want && !vm.compare.active || !want && vm.compare.active) {
				vm.toggleComparison();
			}
		}

		function toggleComparison() {
			vm.compare.countries = [vm.current];
			vm.compare.active = !vm.compare.active;
			if (vm.compare.active) {
				vm.setTab(2);
				$rootScope.greyed = true;
				vm.mvtSource.options.mutexToggle = false;
				vm.mvtSource.setStyle(invertedStyle);

			} else {
				$rootScope.greyed = false;
				angular.forEach(vm.mvtSource.layers[vm.mvtCountryLayerGeom].features, function(feature) {
					feature.selected = false;
				});
				vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
				vm.mvtSource.options.mutexToggle = true;
				vm.mvtSource.setStyle(countriesStyle);
				DataService.getOne('countries/bbox', [vm.current.iso]).then(function(data) {
					vm.bbox = data;
				});
				$state.go('app.index.show.selected', {
					id: $state.params.id,
					name: $state.params.name,
					item: $state.params.item
				})
			}
			//vm.mvtSource.redraw();
		};

		function toggleCountrieList(country) {
			var found = false;
			angular.forEach(vm.compare.countries, function(nat, key) {
				if (country == nat && nat != vm.current) {
					vm.compare.countries.splice(key, 1);
					found = true;
				}
			});
			if (!found) {
				vm.compare.countries.push(country);
			};
			var isos = [];
			var compare = [];
			angular.forEach(vm.compare.countries, function(item, key) {
				isos.push(item.iso);
				if (item[vm.structure.iso] != vm.current.iso) {
					compare.push(item.iso);
				}
			});
			if (isos.length > 1) {
				DataService.getOne('countries/bbox', isos).then(function(data) {
					vm.bbox = data;
				});
				$state.go('app.index.show.selected.compare', {
					index: $state.params.index,
					item: $state.params.item,
					countries: compare.join('-vs-')
				});
			}

			return !found;
		};

		//TODO: MOVE TO OWN DIRECTIVE
		function getOffset() {
			if (!vm.current) {
				return 0;
			}
			//console.log(vm.getRank(vm.current));
			return (vm.getRank(vm.current) - 2) * 17;
		};

		//TODO: MOVE TO OWN DIRECTIVE
		function getTendency() {
			if (!vm.current) {
				return 'arrow_drop_down'
			}
			return vm.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		//TODO: MOVE TO VIEW
		function setTab(i) {
			//vm.activeTab = i;
		}

		function getParent(data) {
			var items = [];
			angular.forEach(data.children, function(item) {
				if (item.column_name == vm.display.selectedCat.type) {
					vm.nodeParent = data;
				}
				getParent(item);
			});
			return items;
		}

		function calcTree() {
			getParent(vm.structure);
		};

		//TODO: MOVE TO SERVICE COUNTRY
		function getNationByName(name) {
			var nation = {};
			angular.forEach(vm.data, function(nat) {
				if (nat.country == name) {
					nation = nat;
				}
			});
			return nation;
		};

		//TODO: MOVE TO SERVICE COUNTRY
		function getNationByIso(iso) {
			var nation = {};
			angular.forEach(vm.data, function(nat) {
				if (nat.iso == iso) {
					nation = nat;
				}
			});

			return nation;
		};

		//TODO: MOVE TO SERVICE MAP
		function createCanvas(color) {

			vm.canvas = document.createElement('canvas');
			vm.canvas.width = 280;
			vm.canvas.height = 10;
			vm.ctx = vm.canvas.getContext('2d');
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		}

		//TODO: MOVE TO SERVICE MAP
		function updateCanvas(color) {
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		};

		//TODO: MOVE TO SERVICE MAP
		function invertedStyle(feature) {
			var style = {};
			var iso = feature.properties[vm.iso_field];
			var nation = getNationByIso(iso);
			var field = vm.structure.name || 'score';

			//TODO: MAX VALUE INSTEAD OF 100
			var colorPos = parseInt(256 / 100 * nation[field]) * 4;

			var color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',' + vm.palette[colorPos + 3] + ')';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: 'rgba(0,0,0,0.3)',
					size: 2
				}
			};
			return style;
		};

		//TODO: MOVE TO SERVICE
		function countriesStyle(feature) {

			var style = {};
			var iso = feature.properties[vm.iso_field];

			var nation = getNationByIso(iso);
			var field = vm.structure.name || 'score';
			var type = feature.type;
			if (iso != vm.current.iso) {
				feature.selected = false;
			}

			switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined") {

						//TODO: MAX VALUE INSTEAD OF 100
						var colorPos = parseInt(256 / 100 * parseInt(nation[field])) * 4;

						var color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',' + vm.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.3)',
							outline: {
								color: 'rgba(66,66,66,0.9)',
								size: 2
							}
						};
						break;
					} else {

						style.color = 'rgba(255,255,255,0)';
						style.outline = {
							color: 'rgba(255,255,255,0)',
							size: 1
						};
					}
			}
			//console.log(feature.properties.name)
			if (feature.layer.name === VectorlayerService.getName() + '_geom') {
				style.staticLabel = function() {
					var style = {
						html: feature.properties.name,
						iconSize: [125, 30],
						cssClass: 'label-icon-text'
					};
					return style;
				};
			}
			return style;
		};

		$scope.$watch('vm.current', function(n, o) {
			if (n === o) {
				return;
			}

			if (n.iso) {
				if (o.iso) {
					vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[o.iso].selected = false;
				}
				calcRank();
				fetchNationData(n.iso);
				vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[n.iso].selected = true;
				if ($state.current.name == 'app.index.show.selected' || $state.current.name == 'app.index.show') {
					$state.go('app.index.show.selected', {
						id: $state.params.id,
						name: $state.params.name,
						item: n.iso
					});
				}
			} else {
				$state.go('app.index.show', {
					id: $state.params.id,
					name: $state.params.id
				});
			}
		});
		$scope.$watch('vm.display.selectedCat', function(n, o) {
			if (n === o) {
				return
			}
			console.log(n);
			if (n.color)
				updateCanvas(n.color);
			else {
				updateCanvas('rgba(128, 243, 198,1)');
			};
			vm.calcTree();
			/*if (vm.compare.active) {
				$timeout(function () {
					//vm.mvtSource.setStyle(invertedStyle);
					//vm.mvtSource.redraw();
				});
			} else {
				$timeout(function () {
					//vm.mvtSource.setStyle(countriesStyle);
					//vm.mvtSource.redraw();
				});
			}*/

			if (vm.current.iso) {
				if ($state.params.countries) {
					$state.go('app.index.show.selected.compare', {
						id: n.id,
						name: n.name,
						item: vm.current.iso,
						countries: $state.params.countries
					})
				} else {
					$state.go('app.index.show.selected', {
						id: n.id,
						name: n.name,
						item: vm.current.iso
					})
				}
			} else {
				$state.go('app.index.show', {
					id: n.id,
					name: n.name
				})
			}

		});

		//TODO: MOVE TO SERVICE MAP
		$scope.$watch('vm.bbox', function(n, o) {
			if (n === o) {
				return;
			}
			/*var lat = [n.coordinates[0][0][1],
					[n.coordinates[0][0][0]]
				],
				lng = [n.coordinates[0][2][1],
					[n.coordinates[0][2][0]]
				]*/
			var southWest = L.latLng(n.coordinates[0][0][1], n.coordinates[0][0][0]),
				northEast = L.latLng(n.coordinates[0][2][1], n.coordinates[0][2][0]),
				bounds = L.latLngBounds(southWest, northEast);

			var pad = [
				[0, 0],
				[100, 100]
			];
			if (vm.compare.active) {
				pad = [
					[0, 0],
					[0, 0]
				];
			}
			vm.map.fitBounds(bounds, {
				padding: pad[1],
				maxZoom: 6
			});
		});

		$scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

			/*console.log($)
			if (toState.name == "app.index.show") {
					vm.current = "";
			} else if (toState.name == "app.index.show.selected") {

				if(toParams.index != fromParams.index){
					console.log('anders')
				}
				console.log(toParams.item);
				vm.setState(toParams.item);
				calcRank();
				//vm.mvtSource.options.mutexToggle = true;
				DataService.getOne('nations', vm.current.iso).then(function (data) {
					vm.current.data = data;
					DataService.getOne('nations/bbox', [vm.current.iso]).then(function (data) {
						vm.bbox = data;
					});
				});
			} else if (toState.name == "app.index.show.selected.compare") {
				vm.setState(toParams.item);
				//$scope.activeTab = 2;
				/*DataService.getOne('nations', toParams.item).then(function (data) {
					vm.country = data;
					DataService.getOne('nations/bbox', [vm.country.iso]).then(function (data) {
						vm.bbox = data;
					});
				});
			} else {
				vm.current = "";
			}*/
		});

		//TODO: MOVE TO SERVICE MAP
		function drawCountries() {
			leafletData.getMap('map').then(function(map) {
				vm.map = map;
				vm.mvtSource = VectorlayerService.getLayer();
				$timeout(function() {
					if ($state.params.countries) {
						vm.mvtSource.options.mutexToggle = false;
						vm.mvtSource.setStyle(invertedStyle);
						vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
						var countries = $state.params.countries.split('-vs-');
						angular.forEach(countries, function(iso) {
							vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[iso].selected = true;
						});

					} else {
						vm.mvtSource.setStyle(countriesStyle);
						if ($state.params.item) {
							vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[$state.params.item].selected = true;
						}
					}
					//vm.mvtSource.redraw();
				});
				vm.mvtSource.options.onClick = function(evt, t) {

					if (!vm.compare.active) {
						var c = getNationByIso(evt.feature.properties[vm.iso_field]);
						if (typeof c[vm.structure.name] != "undefined") {
							$mdSidenav('left').open();
							vm.current = getNationByIso(evt.feature.properties[vm.iso_field]);
						} else {
							toastr.error('No info about this location!', evt.feature.properties.admin);
						}
					} else {
						var c = getNationByIso(evt.feature.properties[vm.iso_field]);
						if (typeof c[vm.structure.name] != "undefined") {
							vm.toggleCountrieList(c);
						} else {
							toastr.error('No info about this location!', evt.feature.properties.admin);
						}
					}
				}
			});
		}
	}]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexbaseCtrl', ["$scope", "$state", function ($scope,$state) {
		//
    $scope.$state = $state;
	}]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexCheckCtrl', ["$scope", "$state", "$filter", "$timeout", "toastr", "DialogService", "IndexService", function ($scope, $state, $filter, $timeout, toastr, DialogService, IndexService) {


		var vm = this;
		vm.data = IndexService.getData();
		vm.meta = IndexService.getMeta();
		vm.errors = IndexService.getErrors();
		vm.iso_errors = IndexService.getIsoErrors();
		vm.selected = [];
    vm.yearfilter = '';
		vm.deleteData = deleteData;
		vm.deleteSelected = deleteSelected;
		vm.deleteColumn = deleteColumn;
		vm.onOrderChange = onOrderChange;
		vm.onPaginationChange = onPaginationChange;
		vm.checkForErrors = checkForErrors;
		vm.selectErrors = selectErrors;
    vm.searchForErrors = searchForErrors;
		vm.showUploadContainer = false;
		//vm.editColumnData = editColumnData;
		vm.editRow = editRow;
    vm.years = [];
		vm.query = {
			filter: '',
			order: '-errors',
			limit: 15,
			page: 1
		};

		activate();

		function activate() {
			checkData();
    	getYears();
		}

		function checkData() {
			if (!vm.data) {
				$state.go('app.index.create');
			}
		}
    function getYears(){
			$timeout(function(){
				var dat = ($filter('groupBy')(vm.data, 'data.'+vm.meta.country_field ));
	      vm.years = [];
				var length = 0;
				var index = null;
			  angular.forEach(dat,function(entry, i){
					if(entry.length > length){
						index = i
					}
				});
	      angular.forEach(dat[index],function(entry){
	        vm.years.push(entry.data[vm.meta.year_field])
	      });
				vm.yearfilter = vm.years[0];
			});


    }
		function search(predicate) {
			vm.filter = predicate;
		};

		function onOrderChange(order) {
			return vm.data = $filter('orderBy')(vm.data, [order], true)
		};

		function onPaginationChange(page, limit) {
			//console.log(page, limit);
			//return $nutrition.desserts.get($scope.query, success).$promise;
		};

		function checkForErrors(item) {
			return item.errors.length > 0 ? 'md-warn' : '';
		}

		/*function editColumnData(e, key){
		  vm.toEdit = key;
		  DialogService.fromTemplate('editcolumn', $scope);
		}*/
		function deleteColumn(e, key) {
			angular.forEach(vm.data, function (item, k) {
				angular.forEach(item.data, function (field, l) {
					if (l == key) {
						angular.forEach(vm.data[k].errors, function(error, i){
							if(error.column == key){
								if (error.type == 2 || error.type == 3) {
									IndexService.reduceIsoError();
								}
								IndexService.reduceError();
								vm.data[k].errors.splice(i, 1);
							}
						})
						delete vm.data[k].data[key];
					}
				})
			});
			IndexService.setToLocalStorage();
			return false;
		}

		function deleteSelected() {
			angular.forEach(vm.selected, function (item, key) {
				angular.forEach(item.errors, function (error, k) {
					if (error.type == 2 || error.type == 3) {
						vm.iso_errors--;
						IndexService.reduceIsoError();
					}
					vm.errors--;
					IndexService.reduceError();
				})
				vm.data.splice(vm.data.indexOf(item), 1);
			});
			vm.selected = [];
			IndexService.setToLocalStorage();
			if (vm.data.length == 0) {
				vm.deleteData();
				$state.go('app.index.create');
			}
		}

		function selectErrors() {
			vm.selected = [];
			angular.forEach(vm.data, function (item, key) {
				if (item.errors.length) {
					vm.selected.push(item);
				}
			})
		}

		function editRow() {
			vm.row = vm.selected[0];
			DialogService.fromTemplate('editrow', $scope);
		}

		function deleteData() {
			vm.data = [];
		}

		function searchForErrors() {
			angular.forEach(vm.data, function (row, k) {
				angular.forEach(row.data, function (item, key) {
					if (isNaN(item) || item < 0) {
						if (item.toString().toUpperCase() == "#NA" || item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1) {
							var error = {
								type: "1",
								message: "Field in row is not valid for database use!",
								column: key,
								value: item
							};
							row.errors.push(error)
							vm.errors.push(error);
						}
					}
				});
			});
		}

	}]);


})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('IndexCheckSidebarCtrl', ["$rootScope", "$scope", "$state", "IndexService", "DataService", "DialogService", "toastr", function($rootScope, $scope, $state, IndexService, DataService, DialogService, toastr) {
		var vm = this;
		vm.data = IndexService.getData();
		vm.meta = IndexService.getMeta();
		vm.errors = IndexService.getErrors();
		vm.iso_errors = IndexService.getIsoErrors();
		vm.clearErrors = clearErrors;
		vm.fetchIso = fetchIso;

		activate();

		function activate() {

			//vm.myData = DataService.getAll('me/data');
			//checkMyData();
		}

		/*function checkMyData() {
			vm.extendingChoices = [];
			if (vm.data.length) {
				vm.myData.then(function(imports) {
					angular.forEach(imports, function(entry) {
						var found = 0;
						angular.forEach(vm.data[0].meta.fields, function(field) {
							var columns = JSON.parse(entry.meta_data);
							angular.forEach(columns, function(column) {
								if (column.column == field) {
									found++;
								}
							})
						});
						if (found >= vm.data[0].meta.fields.length - 3) {
							vm.extendingChoices.push(entry);
						}
					})
					if (vm.extendingChoices.length) {
						if(vm.meta.year_field){
							vm.meta.year = vm.data[0].data[0][vm.meta.year_field];
						}
						DialogService.fromTemplate('extendData', $scope);
					}
				});
			}
		}*/

		function clearErrors() {
			angular.forEach(vm.data, function(row, key) {
				angular.forEach(row.data, function(item, k) {
					if (isNaN(item) || item < 0) {
						if ( item.toString().toUpperCase() == "#NA"/* || item < 0*/ || item.toString().toUpperCase().indexOf('N/A') > -1) {
							vm.data[key].data[k] = null;
							row.errors.splice(0, 1);
							vm.errors.splice(0, 1);
						}
					}
				});
				if (!row.data[vm.meta.iso_field]) {
					var error = {
						type: "2",
						message: "Iso field is not valid!",
						value: row.data[vm.meta.iso_field],
						column: vm.meta.iso_field,
						row: key
					};
					var errorFound = false;
					angular.forEach(row.errors, function(error, key) {
						if (error.type == 2) {
							errorFound = true;
						}
					})
					if (!errorFound) {
						row.errors.push(error);
						vm.iso_errors.push(error);
					}
				}
			});
			IndexService.setToLocalStorage();
		}

		function fetchIso() {

			if (!vm.meta.iso_field) {
				toastr.error('Check your selection for the ISO field', 'Column not specified!');
				return false;
			}
			if (!vm.meta.country_field) {
				toastr.error('Check your selection for the COUNTRY field', 'Column not specified!');
				return false;
			}
			if (vm.meta.country_field == vm.meta.iso_field) {
				toastr.error('ISO field and COUNTRY field can not be the same', 'Selection error!');
				return false;
			}
			$rootScope.stateIsLoading = true;
			vm.notFound = [];
			var entries = [];
			var isoCheck = 0;
			var isoType = 'iso-3166-2';
			angular.forEach(vm.data, function(item, key) {
				if (item.data[vm.meta.iso_field]) {
					isoCheck += item.data[vm.meta.iso_field].length == 3 ? 1 : 0;
				}
				switch (item.data[vm.meta.country_field]) {
					case 'Cabo Verde':
						item.data[vm.meta.country_field] = 'Cape Verde';
						break;
					case "Democratic Peoples Republic of Korea":
						item.data[vm.meta.country_field] = "Democratic People's Republic of Korea";
						break;
					case "Cote d'Ivoire":
						item.data[vm.meta.country_field] = "Ivory Coast";
						break;
					case "Lao Peoples Democratic Republic":
						item.data[vm.meta.country_field] = "Lao People's Democratic Republic";
						break;
					default:
						break;
				}
				entries.push({
					iso: item.data[vm.meta.iso_field],
					name: item.data[vm.meta.country_field]
				});
			});
			var isoType = isoCheck >= (entries.length / 2) ? 'iso-3166-1' : 'iso-3166-2';
			IndexService.resetToSelect();
			DataService.post('countries/byIsoNames', {
				data: entries,
				iso: isoType
			}).then(function(response) {
				$rootScope.stateIsLoading = false;
				angular.forEach(response, function(country, key) {
					angular.forEach(vm.data, function(item, k) {
						if (country.name == item.data[vm.meta.country_field]) {
							if (country.data.length > 1) {
								var toSelect = {
									entry: item,
									options: country.data
								};
								IndexService.addToSelect(toSelect);
							} else if(country.data.length == 1){
								if (typeof country.data != "undefined") {
									vm.data[k].data[vm.meta.iso_field] = country.data[0].iso;
									vm.data[k].data[vm.meta.country_field] = country.data[0].admin;
									if (item.errors.length) {
										angular.forEach(item.errors, function(error, e) {
											if (error.type == 2 || error.type == 3) {
												vm.iso_errors.splice(0, 1);
												item.errors.splice(e, 1);
											} else if (error.type == 1) {
												if (error.column == vm.meta.iso_field) {
													vm.errors.splice(0, 1);
													item.errors.splice(e, 1);
												}
											}
										});

									}
								} else {
									//console.log(vm.data[k]);
									var error = {
										type: "3",
										message: "Could not locate a valid iso name!",
										column: vm.meta.country_field
									};
									var errorFound = false;
									angular.forEach(vm.data[k].errors, function(error, i) {
										console.log(error);
										if (error.type == 3) {
											errorFound = true;
										}
									})
									if (!errorFound) {
										IndexService.addIsoError(error);
										item.errors.push(error);
									}
								}
							}
						}
					});
				});
				vm.iso_checked = true;
				IndexService.setToLocalStorage();
				if (IndexService.getToSelect().length) {
					DialogService.fromTemplate('selectisofetchers');
				}
			}, function(response) {
				$rootScope.stateIsLoading = false;
				toastr.error('Please check your field selections', response.data.message);
			});

		}
		vm.extendData = extendData;

		function extendData() {
			var insertData = {
				data: []
			};
			var meta = [],
				fields = [];
			angular.forEach(vm.data, function(item, key) {
				if (item.errors.length == 0) {
					item.data[0].year = vm.meta.year;
					if(vm.meta.year_field && vm.meta.year_field != "year") {
						delete item.data[vm.meta.year_field];
					}
					insertData.data.push(item.data);
				} else {
					toastr.error('There are some errors left!', 'Huch!');
					return;
				}
			});
			console.log(insertData);
			DataService.post('data/tables/' + vm.addDataTo.table_name + '/insert', insertData).then(function(res) {
				if (res == true) {
					toastr.success(insertData.data.length + ' items importet to ' + vm.meta.name, 'Success');
					vm.data = IndexService.clear();
					$state.go('app.index.mydata');
				}
			});
		}

	}]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexFinalCtrl', ["$state", "IndexService", "DataService", "toastr", function ($state, IndexService, DataService, toastr) {
		//
		var vm = this;
		vm.data = IndexService.getData();
		vm.meta = IndexService.getMeta();
		vm.errors = IndexService.getErrors();
		vm.indicators = IndexService.getIndicators();
		vm.saveData = saveData;


		activate();

		function activate() {
			/*if (vm.meta.year_field) {
				vm.meta.year = vm.data[0].data[vm.meta.year_field];
			}*/
			checkData();
		}

		function checkData() {
			if (!vm.data) {
				$state.go('app.index.create');
			}
		}

		function saveData(valid) {
			if (valid) {
				var insertData = {
					data: []
				};
				var noYears = [];
				var insertMeta = [],
					fields = [];
				vm.loading = true;
				angular.forEach(vm.data, function (item, key) {
					if (item.errors.length == 0) {
						if(item.data[vm.meta.year_field]){
							item.data.year = item.data[vm.meta.year_field];

							if(vm.meta.year_field && vm.meta.year_field != "year") {
								delete item.data[vm.meta.year_field];
							}

							vm.meta.iso_type = item.data[vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
							insertData.data.push(item.data);
						}
						else{
							noYears.push(item);
						}


					} else {
						toastr.error('There are some errors left!', 'Huch!');
						return;
					}
				});
				angular.forEach(vm.indicators, function (item, key) {
					if (key != vm.meta.iso_field && key != vm.meta.country_field) {
						var style_id = 0;
						if (typeof vm.indicators[key].style != "undefined") {
							style_id = vm.indicators[key].style.id;
						}
						var field = {
							'column': key,
							'title': vm.indicators[key].title,
							'description': vm.indicators[key].description,
							'measure_type_id': vm.indicators[key].type.id || 0,
							'is_public': vm.indicators[key].is_public || 0,
							'style_id': style_id,
							'dataprovider_id': vm.indicators[key].dataprovider.id || 0
						};
						var categories = [];
						angular.forEach(vm.indicators[key].categories, function (cat) {
							categories.push(cat.id);
						});
						field.categories = categories;
						fields.push(field);
					}
				});
				vm.meta.fields = fields;
				if(noYears.length > 0){
					toastr.error("for "+noYears.length + " entries", 'No year value found!');
				}

				DataService.post('data/tables', vm.meta).then(function (response) {
					DataService.post('data/tables/' + response.table_name + '/insert', insertData).then(function (res) {
						if (res == true) {
							toastr.success(insertData.data.length + ' items importet to ' + vm.meta.name, 'Success');
							IndexService.clear();
							$state.go('app.index.mydata');
							vm.data = [];
							vm.step = 0;
						}
						vm.loading = false;
					});
				}, function (response) {
					if (response.message) {
						toastr.error(response.message, 'Ouch!');

					}
					vm.loading = false;
				})
			}
		}
	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexFinalMenuCtrl', ["IndexService", function(IndexService){
      var vm = this;
      vm.data = IndexService.getData();
      vm.meta = IndexService.getMeta();
      vm.indicators = IndexService.getIndicators();
      vm.indicatorsLength = Object.keys(vm.indicators).length;

    }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMetaCtrl', ["$scope", "$state", "VectorlayerService", "$timeout", "IndexService", "leafletData", "toastr", function($scope, $state, VectorlayerService,$timeout,IndexService,leafletData, toastr){
        //

        var vm = this;
        vm.min = 10000000;
        vm.max = 0;
        vm.indicators = [];
        vm.scale = "";
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.indicator = IndexService.activeIndicator();
        vm.countriesStyle = countriesStyle;
        VectorlayerService.createCanvas('#ff0000');

        activate();

        function activate(){
          checkData();
        }

        function checkData(){
          if(!vm.data){
            $state.go('app.index.create');
          }
        }

        $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
          if(n === o)return;
          vm.indicator = n;
          vm.min = 10000000;
          vm.max = 0;
          if(vm.indicator.style){
            VectorlayerService.updateCanvas(vm.indicator.style.base_color);
          }
          drawCountries();
            IndexService.setToLocalStorage();
        });

        $scope.$watch('vm.indicator', function(n,o){
          if(n === o) return;
          if(typeof n.style_id != "undefined" ){
            if(n.style_id != o.style_id){
              if(n.style){
                VectorlayerService.updateCanvas(n.style.base_color);
              }
              else{
                  VectorlayerService.updateCanvas('#ff0000');
              }
              drawCountries();
            }
          }
          else{
            if(typeof n.categories != "undefined"){
              if(n.categories.length){
                VectorlayerService.updateCanvas(n.categories[0].style.base_color);
              }
              else{
                VectorlayerService.updateCanvas('#ff0000');
              }
            }
            drawCountries();
          }
          IndexService.setActiveIndicatorData(n);
          IndexService.setToLocalStorage();
        },true);


        function minMax(){
          vm.min = 10000000;
          vm.max = 0;
          angular.forEach(vm.data, function(item, key){
              vm.min = Math.min(item.data[vm.indicator.column_name], vm.min);
              vm.max = Math.max(item.data[vm.indicator.column_name], vm.max);
          });
          vm.scale = d3.scale.linear().domain([vm.min,vm.max]).range([0,100]);
        }
        function getValueByIso(iso){
          var value = 0;
          angular.forEach(vm.data, function(item, key){
             if(item.data[vm.meta.iso_field] == iso){
               value = item.data[vm.indicator.column_name];
             }
          });
          return value;
        }
        function countriesStyle(feature) {
    			var style = {};
    			var iso = feature.properties.iso_a2;
    			var value = getValueByIso(iso) || vm.min;
    			var field = vm.indicator.column_name;
    			var type = feature.type;

    			switch (type) {
    			case 3: //'Polygon'

    					var colorPos = parseInt(256 / 100 * parseInt(vm.scale(value))) * 4;
    					var color = 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',' + VectorlayerService.getColor(colorPos + 3) + ')';
              style.color = 'rgba(' + VectorlayerService.getColor(colorPos)  + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.6)'; //color;
    					style.outline = {
    						color: color,
    						size: 1
    					};
    					style.selected = {
    						color: 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.3)',
    						outline: {
    							color: 'rgba(66,66,66,0.9)',
    							size: 2
    						}
    					};
    					break;

    			}

    			if (feature.layer.name === VectorlayerService.getName()+'_geom') {
    				style.staticLabel = function () {
    					var style = {
    						html: feature.properties.name,
    						iconSize: [125, 30],
    						cssClass: 'label-icon-text'
    					};
    					return style;
    				};
    			}
    			return style;
    		}
        function setCountries(){
          vm.mvtSource.setStyle(countriesStyle);
          vm.mvtSource.redraw();
        }
        function drawCountries() {
          minMax();
    			leafletData.getMap('map').then(function (map) {
    				vm.map = map;
    				vm.mvtSource = VectorlayerService.getLayer();
    				$timeout(function () {
    						setCountries();
    				});
    			});
    		}
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMetaMenuCtrl', ["$scope", "$state", "toastr", "DataService", "DialogService", "IndexService", function($scope,$state, toastr, DataService,DialogService, IndexService){
      var vm = this;
      vm.data = IndexService.getData();
      vm.meta = IndexService.getMeta();
      IndexService.resetIndicator();
      vm.indicators = IndexService.getIndicators();
      vm.selectForEditing = selectForEditing;
      vm.checkFull = checkFull;
      vm.checkBase = checkBase;
      vm.checkAll = checkAll;
      vm.saveData = saveData;


      function selectForEditing(key){
        if(typeof IndexService.getIndicator(key) == "undefined"){
          IndexService.setIndicator(key,{
            column_name:key,
            title:key
          });
        }
        vm.editingItem = key;
        vm.indicator = IndexService.getIndicator(key);
        IndexService.setToLocalStorage();
      }
      function checkBase(item){
        if(typeof item == "undefined") return false;
  			if (item.title && item.type && item.dataprovider && item.title.length >= 3) {
  				return true;
  			}
  			return false;
  		}
  		function checkFull(item){
        if(typeof item == "undefined" || typeof item.categories == "undefined") return false;
  			return checkBase(item) && item.categories.length ? true : false;
  		}
      function checkAll(){
        var done = 0;
        angular.forEach(vm.indicators, function(indicator){
          if(checkBase(indicator)){
            done ++;
          }
        });
        //console.log(done, Object.keys(vm.indicators).length);
        if(done == Object.keys(vm.indicators).length){
          return true;
        }
        return false;
      }
      function saveData() {

          if(!vm.meta.year_field && !vm.meta.year){
            DialogService.fromTemplate('addYear', $scope);
            return false;
          }
  				var insertData = {
  					data: []
  				};
  				var noYears = [];
  				var insertMeta = [],
  					fields = [];
  				vm.loading = true;
  				angular.forEach(vm.data, function (item, key) {
  					if (item.errors.length == 0) {
  						if(item.data[vm.meta.year_field]){
  							item.data.year = item.data[vm.meta.year_field];

  							if(vm.meta.year_field && vm.meta.year_field != "year") {
  								delete item.data[vm.meta.year_field];
  							}

  							vm.meta.iso_type = item.data[vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
  							insertData.data.push(item.data);
  						}
  						else{
                if(vm.meta.year){
                  item.data.year = vm.meta.year;
                  vm.meta.iso_type = item.data[vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
    							insertData.data.push(item.data);
                }
                else{
                  	noYears.push(item);
                }


  						}


  					} else {
  						toastr.error('There are some errors left!', 'Huch!');
  						return;
  					}
  				});
  				angular.forEach(vm.indicators, function (item, key) {
  					if (key != vm.meta.iso_field && key != vm.meta.country_field) {
  						var style_id = 0;
  						if (typeof vm.indicators[key].style != "undefined") {
  							style_id = vm.indicators[key].style.id;
  						}
  						var field = {
  							'column': key,
  							'title': vm.indicators[key].title,
  							'description': vm.indicators[key].description,
  							'measure_type_id': vm.indicators[key].type.id || 0,
  							'is_public': vm.indicators[key].is_public || 0,
  							'style_id': style_id,
  							'dataprovider_id': vm.indicators[key].dataprovider.id || 0
  						};
  						var categories = [];
  						angular.forEach(vm.indicators[key].categories, function (cat) {
  							categories.push(cat.id);
  						});
  						field.categories = categories;
  						fields.push(field);
  					}
  				});
  				vm.meta.fields = fields;
  				if(noYears.length > 0){
  					toastr.error("for "+noYears.length + " entries", 'No year value found!');
            return false;
  				}

  				DataService.post('data/tables', vm.meta).then(function (response) {
  					DataService.post('data/tables/' + response.table_name + '/insert', insertData).then(function (res) {
  						if (res == true) {
  							toastr.success(insertData.data.length + ' items importet to ' + vm.meta.name, 'Success');
  							IndexService.clear();
  							$state.go('app.index.mydata');
  							vm.data = [];
  							vm.step = 0;
  						}
  						vm.loading = false;
  					});
  				}, function (response) {
  					if (response.message) {
  						toastr.error(response.message, 'Ouch!');

  					}
  					vm.loading = false;
  				})

  		}
      function copyToOthers(){
      /*  vm.preProvider = vm.indicators[o.column_name].dataprovider;
        vm.preMeasure = vm.indicators[o.column_name].measure_type_id;
        vm.preType = vm.indicators[o.column_name].type;
        vm.preCategories = vm.indicators[o.column_name].categories;
        vm.prePublic = vm.indicators[o.column_name].is_public;
        vm.preStyle = vm.indicators[o.column_name].style;

        DialogService.fromTemplate('copyprovider', $scope);*/
      }
     $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
        if(n === o)return;
        vm.indicators[n.column_name] = n;
      },true);
      $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
        if (n === o || typeof o == "undefined" || o == null) return;
        if(!vm.askedToReplicate) {
          vm.preProvider = vm.indicators[o.column_name].dataprovider;
          vm.preMeasure = vm.indicators[o.column_name].measure_type_id;
          vm.preType = vm.indicators[o.column_name].type;
          vm.preCategories = vm.indicators[o.column_name].categories;
          vm.prePublic = vm.indicators[o.column_name].is_public;
          vm.preStyle = vm.indicators[o.column_name].style;

          DialogService.fromTemplate('copyprovider', $scope);
        } else {
          //n.dataprovider = vm.doProviders ? vm.preProvider : [];
          //n.measure_type_id = vm.doMeasures ? vm.preMeasure : 0;
          //n.categories = vm.doCategories ? vm.preCategories: [];
          //n.is_public = vm.doPublic ? vm.prePublic: false;
        }

      });
    }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMyDataCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMyDataEntryCtrl', ["UserService", function(UserService){
      var vm = this;
      vm.data = UserService.myData();
    }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMyDataMenuCtrl', ["UserService", function(UserService){
      var vm = this;

      vm.data = [];

      activate();

      function activate(){
        UserService.myData().then(function(data){
          vm.data = data;
            convertInfo();
        })

      }
      function convertInfo(){
        console.log(vm.data);
        angular.forEach(vm.data, function(item){
            item.meta = JSON.parse(item.meta_data);
        })

      }
    }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexcreatorCtrl', ["$scope", "DialogService", "DataService", "$timeout", "$state", "$filter", "leafletData", "toastr", "IconsService", "IndexService", "VectorlayerService", function($scope, DialogService,DataService, $timeout,$state, $filter, leafletData, toastr, IconsService,IndexService, VectorlayerService){

        //TODO: Check if there is data in storage to finish
      /*  console.log($state);
        if($state.current.name == 'app.index.create'){
          if(IndexService.getData().length){
            if(confirm('Existing Data. Go On?')){
              $state.go('app.index.check');
            }
            else{
              IndexService.clear();
            }
          }
        }*/

        var vm = this;
        vm.map = null;
        vm.data = [];
        vm.toSelect = [];
        vm.selected = [];
        vm.selectedRows = [];
        vm.selectedResources =[];
        vm.sortedResources = [];

        vm.groups = [];
        vm.myData = [];
        vm.addDataTo = {};
        vm.selectedForGroup = [];
        vm.iso_errors = 0;
        vm.iso_checked = false;
        vm.saveDisabled = false;
        vm.selectedIndex = 0;
        vm.step = 0;
        vm.openClose = openClose;
        //vm.search = search;

        vm.listResources = listResources;
        vm.toggleListResources = toggleListResources;
        vm.selectedResource = selectedResource;
        vm.toggleResource = toggleResource;
        vm.increasePercentage = increasePercentage;
        vm.decreasePercentage = decreasePercentage;
        vm.toggleGroupSelection = toggleGroupSelection;
        vm.existsInGroupSelection = existsInGroupSelection;
        vm.addGroup = addGroup;
        vm.cloneSelection = cloneSelection;
        vm.editEntry = editEntry;
        vm.removeEntry = removeEntry;
        vm.saveIndex = saveIndex;

        vm.icons = IconsService.getList();

        vm.meta = {
          iso_field: '',
          country_field:'',
          table:[]
        };
        vm.query = {
          filter: '',
          order: '-errors',
          limit: 15,
          page: 1
        };

        /*vm.treeOptions = {
          beforeDrop:function(event){
            if(event.dest.nodesScope != event.source.nodesScope){
              var idx = event.dest.nodesScope.$modelValue.indexOf(event.source.nodeScope.$modelValue);
              if(idx > -1){
                 event.source.nodeScope.$$apply = false;
                 toastr.error('Only one element of a kind per group possible!', 'Not allowed!')
              }
            }
          },
          dropped:function(event){
            calcPercentage(vm.groups);
          }
        };*/

        //Run Startup-Funcitons
        activate();

        function activate(){
          //clearMap();
          IndexService.resetLocalStorage();
        }
        function openClose(active){
          return active ? 'remove' : 'add';
        }
        function clearLayerStyle(feature){
      			var style = {
              color:'rgba(255,255,255,0)',
              outline: {
    						color: 'rgba(255,255,255,0)',
    						size: 1
    					}
            };
      			return style;
        }
        function clearMap(){
          	leafletData.getMap('map').then(function (map) {
              vm.mvtSource = VectorlayerService.getLayer();
              $timeout(function(){
                vm.mvtSource.setStyle(clearLayerStyle);
              })
            });
        }


        function toggleListResources(){
          vm.showResources = !vm.showResources;
          if(vm.showResources){
            vm.listResources();
          }
        }
        function listResources(){
          if(!vm.resources){
            DataService.getAll('data/tables').then(function(response){
              vm.resources = response;
              vm.selectedResources = [], vm.sortedResources = [];
            })
          }

        }
        function selectedResource(resource){
          return vm.selectedResources.indexOf(resource) > -1 ? true : false;
        }
        function deleteFromGroup(resource, list){
          angular.forEach(list, function(item, key){
              //if(typeof item.isGroup == "undefined"){
                if(item == resource){
                  list.splice(key, 1);
                  vm.selectedForGroup.splice(vm.selectedForGroup.indexOf(item), 1);
                  vm.selectedResources.splice(vm.selectedResources.indexOf(item),1);
                }
              //}
              deleteFromGroup(resource, item.nodes);
          });
        }
        function toggleResource(resource){
          var idx = vm.selectedResources.indexOf(resource);
          if( idx > -1){
            vm.selectedResources.splice(idx, 1);
            deleteFromGroup(resource, vm.groups);
          }
          else{
            vm.selectedResources.push(resource);
            if(vm.selectedForGroup.length == 1 && typeof vm.selectedForGroup[0].isGroup != "undefined"){
              vm.selectedForGroup[0].nodes.push(resource);
            }
            else{
                vm.groups.push(resource);
            }
          }

          //calcPercentage(vm.sortedResources);
        }
        function calcPercentage(nodes){
          angular.forEach(nodes, function(node, key){
            nodes[key].weight = parseInt(100 / nodes.length);
            calcPercentage(nodes.node);
          });
        }
        function increasePercentage(item){
          console.log(item);
        }
        function decreasePercentage(item){
          console.log(item)
        }
        function toggleGroupSelection(item){
          var idx = vm.selectedForGroup.indexOf(item);
          if( idx > -1){
            vm.selectedForGroup.splice(idx, 1);
          }
          else{
            vm.selectedForGroup.push(item);
          }
        }
        function existsInGroupSelection(item){
          return vm.selectedForGroup.indexOf(item) > -1;
        }
        function addGroup(){
          var newGroup = {
            title:'Group',
            isGroup:true,
            nodes:[]
          };

          if(vm.selectedForGroup.length == 1 && typeof vm.selectedForGroup[0].isGroup != "undefined"){
            vm.selectedForGroup[0].nodes.push(newGroup);
          }
          else if(vm.selectedForGroup.length > 0 ){
              angular.forEach(vm.selectedForGroup, function(item, key){
                  newGroup.nodes.push(item);
                  deleteFromGroup(item, vm.selectedForGroup);
              });
              vm.groups.push(newGroup);
              vm.selectedForGroup = [];
          }
          else{
            vm.groups.push(newGroup);
          }
        }
        function cloneSelection(){
          var newGroup = {
            title:'Cloned Elements',
            isGroup:true,
            nodes:[]
          };
          angular.forEach(vm.selectedForGroup, function(item, key){
            newGroup.nodes.push(item);
          });
          vm.groups.push(newGroup);
          vm.selectedForGroup = [];
        }
        function editEntry(item){
          vm.editItem = item;
        }
        function removeEntry(item, list){
            deleteFromGroup(item, list);
        }
        function saveIndex(){
          if(vm.saveDisabled){
            return;
          }
          vm.saveDisabled = true;
          if(typeof vm.newIndex == 'undefined'){
            toastr.error('You need to enter a title!','Info missing');
            vm.saveDisabled = false;
            return;
          }
          if(!vm.newIndex.title){
            toastr.error('You need to enter a title!','Info missing');
            vm.saveDisabled = false;
            return;
          }
          vm.newIndex.data = vm.groups;
          DataService.post('index', vm.newIndex).then(function(response){
            vm.saveDisabled = false;
            toastr.success('Your Index has been created', 'Success'),
            $state.go('app.index.show', {index:response.name});
          },function(response){
            vm.saveDisabled = false;
            toastr.error(response.message,'Upps!!');
          });
        }
        /*$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
          if(!vm.data.length){
            $state.go('app.index.create');
          }
          else{
            switch (toState.name) {
              case 'app.index.create':
                  vm.step = 0;
                break;
              case 'app.index.create.basic':
                  console.log(vm.data);
                    vm.step = 1;
                    checkMyData();
                  break;
              case 'app.index.create.check':
                  vm.step = 2;
                  vm.showUploadContainer = false;
                break;
              case 'app.index.create.meta':
                  vm.step = 3;
                    vm.showUploadContainer = false;
                  break;
              case 'app.index.create.final':
                  vm.step = 4;
                    vm.showUploadContainer = false;
                  break;
              default:
                break;
            }
          }
        });*/
    }]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorcategoryCtrl', ["$state", "category", "categories", "DataService", "ContentService", function ($state, category, categories, DataService,ContentService) {
    var vm = this;
    vm.category = category;
		vm.categories = categories;
		vm.options = {
			globalSave:true,
			postDone:function(data){
				$state.go('app.index.editor.categories.category', {id:data.id})
			},
		}
  }]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$scope", "$filter", "$timeout", "$state", "indicators", "indices", "styles", "categories", "DataService", "ContentService", "toastr", function ($scope, $filter, $timeout,$state, indicators, indices, styles, categories, DataService,ContentService, toastr) {
		//
		var vm = this;

		vm.categories = categories;
		vm.composits = indices;
		vm.styles = styles;
		vm.indicators = indicators;
		vm.checkTabContent = checkTabContent;

		vm.active = 0;
		vm.selectedTab = 0;
		vm.selection = {
			indices:[],
			indicators:[],
			styles:[],
			categories:[]
		};


		vm.options = {
			composits:{
				drag:false,
				type:'composits',
				allowMove:false,
				allowDrop:false,
				allowAdd:true,
				allowDelete:true,
				itemClick: function(id, name){
					$state.go('app.index.editor.indizes.data', {id:id, name:name})
				},
				addClick:function(){
					$state.go('app.index.editor.indizes.data', {id:0, name: 'new'})
				},
				deleteClick:function(){
					angular.forEach(vm.selection.indices,function(item, key){
						ContentService.removeItem(item.id).then(function(data){
							if($state.params.id == item.id){
								$state.go('app.index.editor.indizes');
							}
							vm.selection.indices = [];
						});
					});
					//$state.go('app.index.editor.indizes');
				}
			},
			categories:{
				drag:false,
				type:'categories',
				allowAdd:true,
				allowDelete:true,
				addClick:function(){
					$state.go('app.index.editor.categories.category', {id:'new'})
				},
				itemClick: function(id, name){

					$state.go('app.index.editor.categories.category', {id:id})
				},
				deleteClick:function(){
					angular.forEach(vm.selection.categories,function(item, key){
						ContentService.removeCategory(item.id).then(function(data){
							if($state.params.id == item.id){
								$state.go('app.index.editor.categories');
							}
							vm.selection.categories = [];
						});
					});
					//$state.go('app.index.editor.categories');
				}

			},
			styles:{
				drag:false,
				type:'styles',
				withColor:true
			}
		};


		function checkTabContent(index){
			switch (index) {
				case 1:
						$state.go('app.index.editor.indicators');
					break;
				case 2:
						$state.go('app.index.editor.categories');
					break;
				case 0:
						if(typeof $state.params.id != "undefined"){
								$state.go('app.index.editor.indizes.data',{
									id:$state.params.id
								});
						}
						else{
								$state.go('app.index.editor.indizes');
						}
					break;
				case 3:

					break;
				default:

			}
		}

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		  if(typeof toParams.id == "undefined"){
				vm.active = 0;
			}
			else{
				vm.active = toParams.id;
			}
			if(toState.name.indexOf('app.index.editor.indicators') != -1){
				vm.selectedTab = 1;
				//activate(toParams);
			}
			else if(toState.name.indexOf('app.index.editor.categories') != -1){
				vm.selectedTab = 2;
			}
			else if(toState.name.indexOf('app.index.editor.indizes') != -1){
				vm.selectedTab = 0;
			}
		});
	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorindicatorCtrl', ["$scope", "$state", "$timeout", "VectorlayerService", "leafletData", "ContentService", "indicator", function ($scope, $state,$timeout, VectorlayerService, leafletData, ContentService, indicator) {
		//
		var vm = this;
    vm.indicator = indicator;
		vm.scale = "";
		vm.min = 10000000;
		vm.max = 0;
		vm.selected = 0;
		setActive();

		ContentService.getIndicatorData($state.params.id).then(function(data){
			var base_color = '#ff0000';
			if(typeof vm.indicator.style == "undefined"){
				angular.forEach(vm.indicator.categories, function(cat){
					if(typeof cat.style != "undefined"){
						base_color = cat.style.base_color;
					}
				});
			}
			else if(vm.indicator.style){
				base_color = vm.indicator.style.base_color;
			}
			VectorlayerService.createCanvas(base_color );
			vm.data = data;
			minMax();
			drawCountries();
		});
		function setActive(){
			if($state.current.name == 'app.index.editor.indicator.details'){
				if($state.params.entry == "infographic"){
					vm.selected = 1;
				}
				else if($state.params.entry == "indizes"){
					vm.selected = 2;
				}
				else if($state.params.entry == "style"){
					vm.selected = 3;
				}
				else if($state.params.entry == "categories"){
					vm.selected = 4;
				}
				else{
					vm.selected = 0;
				}
			}
		}
		function minMax(){
			vm.min = 10000000;
			vm.max = 0;
			angular.forEach(vm.data, function(item, key){
					vm.min = Math.min(item.score, vm.min);
					vm.max = Math.max(item.score, vm.max);
			});
			vm.scale = d3.scale.linear().domain([vm.min,vm.max]).range([0,100]);
		}
		function getValueByIso(iso){
			var value = 0;
			angular.forEach(vm.data, function(item, key){
				 if(item.iso == iso){
					 value = item.score;
				 }
			});
			return value;
		}
		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties.iso_a2;
			var value = getValueByIso(iso) || vm.min;
			var type = feature.type;

			switch (type) {
				case 3: //'Polygon'
					var colorPos = parseInt(256 / 100 * parseInt(vm.scale(value))) * 4;
					var color = 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',' + VectorlayerService.getColor(colorPos + 3) + ')';
					style.color = 'rgba(' + VectorlayerService.getColor(colorPos)  + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.6)'; //color;
					style.outline = {
						color: color,
						size: 1
					};
					style.selected = {
						color: 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.3)',
						outline: {
							color: 'rgba(66,66,66,0.9)',
							size: 2
						}
					};
					break;

			}
			return style;
		}
		function drawCountries() {
			minMax();
			leafletData.getMap('map').then(function (map) {
				vm.map = map;
				vm.mvtSource = VectorlayerService.getLayer();
				$timeout(function () {
						vm.mvtSource.setStyle(countriesStyle);
					//vm.mvtSource.redraw();
				});
			});
		}

		$scope.$on('$stateChangeSuccess', function(){
			setActive();
		});

	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexinidcatorsCtrl', ["indicators", "DataService", "ContentService", function (indicators, DataService,ContentService) {
		//
    var vm = this;
    vm.indicators = indicators;


  }])
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorindizesCtrl', ["$scope", "$state", "$timeout", "VectorlayerService", "leafletData", "ContentService", "index", function ($scope, $state,$timeout, VectorlayerService, leafletData, ContentService, index) {
		//
		var vm = this;
    //vm.indicator = indicator;
    vm.index = index;
		vm.scale = "";
		vm.min = 10000000;
		vm.max = 0;
		vm.selected = [];
		setActive();
    vm.options = {
      indizes:{
        addClick: function(){
          $state.go('app.index.editor.indizes.data.add');
        },
				addContainerClick:function(){
					var item = {
						title: 'I am a group... name me'
					};
					vm.index.children.push(item);
				},
				deleteClick:function(){
					console.log(vm);
					angular.forEach(vm.selected,function(item, key){
						ContentService.removeItem(item.id).then(function(data){
							removeItem(item,vm.index.children);
							vm.selected = [];
						});
					});
				},
				deleteDrop: function(event,item,external,type){
					ContentService.removeItem(item.id).then(function(data){
						removeItem(item,vm.index.children);
						vm.selection = [];
					});
				}
      },
      withSave: true
    }

		active();


		function active(){

		}
		function removeItem(item, list){
			angular.forEach(list, function(entry, key){
				if(entry.id == item.id){
					list.splice(key, 1);
					return true;
				}
				if(entry.children){
					var subresult = removeItem(item, entry.children);
					if(subresult){
						return subresult;
					}
				}
			});
			return false;
		}
		/*ContentService.getIndicatorData($state.params.id).then(function(data){
			var base_color = '#ff0000';
			if(typeof vm.indicator.style == "undefined"){
				angular.forEach(vm.indicator.categories, function(cat){
					if(typeof cat.style != "undefined"){
						base_color = cat.style.base_color;
					}
				});
			}
			else if(vm.indicator.style){
				base_color = vm.indicator.style.base_color;
			}
			VectorlayerService.createCanvas(base_color );
			vm.data = data;
			minMax();
			drawCountries();
		});*/

		function setActive(){
		/*	if($state.current.name == 'app.index.editor.indicator.details'){
				if($state.params.entry == "infographic"){
					vm.selected = 1;
				}
				else if($state.params.entry == "indizes"){
					vm.selected = 2;
				}
				else if($state.params.entry == "style"){
					vm.selected = 3;
				}
				else if($state.params.entry == "categories"){
					vm.selected = 4;
				}
				else{
					vm.selected = 0;
				}
			}*/
		}
		function minMax(){
			vm.min = 10000000;
			vm.max = 0;
			angular.forEach(vm.data, function(item, key){
					vm.min = Math.min(item.score, vm.min);
					vm.max = Math.max(item.score, vm.max);
			});
			vm.scale = d3.scale.linear().domain([vm.min,vm.max]).range([0,100]);
		}
		function getValueByIso(iso){
			var value = 0;
			angular.forEach(vm.data, function(item, key){
				 if(item.iso == iso){
					 value = item.score;
				 }
			});
			return value;
		}
		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties.iso_a2;
			var value = getValueByIso(iso) || vm.min;
			var type = feature.type;

			switch (type) {
				case 3: //'Polygon'
					var colorPos = parseInt(256 / 100 * parseInt(vm.scale(value))) * 4;
					var color = 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',' + VectorlayerService.getColor(colorPos + 3) + ')';
					style.color = 'rgba(' + VectorlayerService.getColor(colorPos)  + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.6)'; //color;
					style.outline = {
						color: color,
						size: 1
					};
					style.selected = {
						color: 'rgba(' + VectorlayerService.getColor(colorPos) + ', ' + VectorlayerService.getColor(colorPos + 1) + ', ' + VectorlayerService.getColor(colorPos + 2) + ',0.3)',
						outline: {
							color: 'rgba(66,66,66,0.9)',
							size: 2
						}
					};
					break;

			}
			return style;
		}
		function drawCountries() {
			minMax();
			leafletData.getMap('map').then(function (map) {
				vm.map = map;
				vm.mvtSource = VectorlayerService.getLayer();
				$timeout(function () {
						vm.mvtSource.setStyle(countriesStyle);
					//vm.mvtSource.redraw();
				});
			});
		}

		$scope.$on('$stateChangeSuccess', function(){
			setActive();
		});

	}]);

})();

(function(){
    "use strict";
    angular.module('app.controllers').controller('IndexinfoCtrl', ["IndizesService", function(IndizesService){
        var vm = this;
        vm.structure = IndizesService.getStructure();
    }]);
})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('IndicatorShowCtrl', ["$state", "$filter", "$timeout", "indicator", "countries", "ContentService", "VectorlayerService", "toastr", function($state, $filter, $timeout, indicator, countries, ContentService, VectorlayerService, toastr) {
		//
		var vm = this;
		vm.current = null;
		vm.active = null, vm.activeGender = null;
		vm.countryList = countries;
		vm.indicator = indicator;
		vm.data = [];
		vm.year = null, vm.gender = 'all';
		vm.range = {
			max: -100000000,
			min: 100000000
		};
		vm.getData = getData;
		vm.getOffset = getOffset;
		vm.getRank = getRank;
		vm.goInfoState = goInfoState;
		vm.historyData = null;

		vm.setCurrent = setCurrent;
		vm.setYear = setYear;
		vm.setGender = setGender;

		activate();

		function activate() {
			resetRange();
			VectorlayerService.setStyle(countriesStyle);
			VectorlayerService.countryClick(countryClick);
			$timeout(function() {
				//	vm.year = $state.params.year;
				//	vm.gender = $state.params.gender;
				//getData($state.params.year, $state.params.gender);
				if ($state.params.year) {
					vm.year = $state.params.year;
					for (var i = 0; i < vm.indicator.years.length; i++) {
						if (vm.indicator.years[i].year == $state.params.year) {
							vm.active = i;
						}
					}
				} else if (!vm.active) {
					vm.active = 0;
				}

				if (vm.indicator.gender) {
					if ($state.params.gender != "all") {
						vm.gender = $state.params.gender;
						for (var i = 0; i < vm.indicator.gender.length; i++) {
							if (vm.indicator.gender[i].gender == $state.params.gender) {
								vm.activeGender = i;
							}
						}
					} else if (!vm.activeGender) {
						vm.activeGender = 0;
					}
				} else if (!vm.activeGender) {
					vm.activeGender = 0;
				}
				getData(vm.year, vm.gender);
			});
		}

		function resetRange() {
			vm.range = {
				max: -100000000,
				min: 100000000
			};
		}

		function goInfoState() {

			if ($state.current.name == 'app.index.indicator') {
				$state.go('app.index.indicator.info');
			} else {
				$state.go('app.index.indicator');
			}

		}

		function getRank(country) {
			var rank = vm.data.indexOf(country) + 1;
			return rank;
		}

		function getOffset() {
			if (!vm.current) {
				return 0;
			}
			//console.log(vm.getRank(vm.current));
			return (vm.getRank(vm.current) - 2) * 17;
		};

		function setCurrent(nat) {
			vm.current = nat;
			setSelectedFeature();
		};

		function setSelectedFeature() {
			$state.go('app.index.indicator', {
				iso: vm.current.iso,
			});
			$timeout(function(){
					getHistory();
			});

		};

		function countryClick(evt, t) {
			var c = VectorlayerService.getNationByIso(evt.feature.properties[VectorlayerService.data.iso2]);
			if (typeof c.score != "undefined") {
				vm.current = c;
				setSelectedFeature();
			} else {
				toastr.error('No info about this location!');
			}
		}

		function getHistory() {
			ContentService.getIndicatorHistory(vm.indicator.id, vm.current.iso, vm.gender).then(function(data) {
				vm.historyData = data;
			})
		}

		function setYear(year) {
			vm.year = year;
			$timeout(function() {
				$state.go('app.index.indicator', {
					year: year,
				});
			}, 250);

		}

		function setGender(gender) {
			vm.gender = gender || 'all';
			$timeout(function() {
				$state.go('app.index.indicator', {
					gender: vm.gender
				});
			}, 250);
		}

		function getData(year, gender) {
			ContentService.getIndicatorData(vm.indicator.id, vm.year, vm.gender).then(function(dat) {
				resetRange();
				vm.data = dat;
				var iso = null;
				if ($state.params.iso) {
					for (var i = 0; i < vm.data.length; i++) {
						if (vm.data[i].iso == $state.params.iso) {
							vm.current = vm.data[i];
							iso = vm.current.iso;
							//setSelectedFeature();
						}
					}
				}
				angular.forEach(vm.data, function(item) {
					item.rank = vm.data.indexOf(item) + 1;
					if (vm.current) {
						if (item.iso == vm.current.iso) {
							setCurrent(item);
						}
					}
					vm.range.max = d3.max([vm.range.max, parseFloat(item.score)]);
					vm.range.min = d3.min([vm.range.min, parseFloat(item.score)]);
				});

				vm.circleOptions = {
					color: vm.indicator.styled.base_color || '#00ccaa',
					field: 'rank',
					size: vm.data.length
				};

				getOffset();
				vm.linearScale = d3.scale.linear().domain([vm.range.min, vm.range.max]).range([0, 256]);
				VectorlayerService.setData(vm.data, vm.indicator.styled.base_color, true);
				//VectorlayerService.paintCountries(countriesStyle, countryClick);
			});


		}

		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);

			var field = 'score';
			var type = feature.type;
			feature.selected = false;
			if (vm.current) {
				if (vm.current.iso == iso) {
					feature.selected = true;
				}
			}



			switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined" && nation[field] != null) {

						var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
						var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.3)',
							outline: {
								color: 'rgba(66,66,66,0.9)',
								size: 2
							}
						};

					} else {
						style.color = 'rgba(255,255,255,0)';
						style.outline = {
							color: 'rgba(255,255,255,0)',
							size: 1
						};

					}
					break;
			}
			return style;
		};


		vm.uiOnParamsChanged = function(changedParams, $transition$) {
			//console.log(changedParams);
			getData(vm.year, vm.gender);
		}

	}]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndicatorYearTableCtrl', ["$filter", "data", function ($filter, data) {
		//
		var vm = this;
    vm.data = data;
    vm.onOrderChange = onOrderChange;
		vm.onPaginationChange = onPaginationChange;

    function onOrderChange(order) {
			return vm.data = $filter('orderBy')(vm.data, [order], true)
		};

		function onPaginationChange(page, limit) {
			//console.log(page, limit);
			//return $nutrition.desserts.get($scope.query, success).$promise;
		};


  }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', ["$rootScope", "$state", "$auth", "toastr", function($rootScope, $state, $auth, toastr){
        var vm = this;
        vm.prevState = null;
        vm.doLogin = doLogin;
        vm.checkLoggedIn = checkLoggedIn;
      
        vm.user = {
          email:'',
          password:''
        };

        activate();

        function activate(){
          vm.checkLoggedIn();
        }

        function checkLoggedIn(){

          if($auth.isAuthenticated()){
            //$state.go('app.index.show', {index:'epi'});
          }
        }
        function doLogin(){
          $auth.login(vm.user).then(function(response){
            toastr.success('You have successfully signed in');
            console.log($rootScope.previousPage);
            $state.go($rootScope.previousPage.state.name || 'app.home', $rootScope.previousPage.params);
          }).catch(function(response){
            toastr.error('Please check your email and password', 'Something went wrong');
          })
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('LogoCtrl', function(){
        //
    });

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', ["$scope", "leafletData", "leafletMapEvents", "VectorlayerService", function($scope, leafletData, leafletMapEvents, VectorlayerService) {
		//

		var zoom = 3,
			minZoom = 2;
		if (window.innerWidth < 600) {
			zoom = 2;
		}
		var vm = this;
		var apiKey = VectorlayerService.keys.mapbox;
		vm.VectorlayerService = VectorlayerService;
		vm.toggleLayers = toggleLayers;
		vm.defaults = {
			//scrollWheelZoom: false,
			minZoom: minZoom,
			maxZoom: 6
		};

		// vm.layers = {
		// 	baselayers: {
		// 		xyz: {
		// 			name: 'Outdoor',
		// 			url: VectorlayerService.baselayer.url,
		// 			type: 'xyz',
		// 			layerOptions: {
		// 				noWrap: true,
		// 				continuousWorld: false,
		// 				detectRetina: true
		// 			}
		// 		}
		// 	}
		// };
		vm.labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + apiKey, {
			noWrap: true,
			continuousWorld: false,
			name: 'labels',
			detectRetina: true
		});
		vm.maxbounds = {
			southWest: {
				lat: 90,
				lng: 180
			},
			northEast: {
				lat: -90,
				lng: -180
			}
		};
		vm.controls = {
			custom: []
		};
		vm.layercontrol = {
			icons: {
				uncheck: "fa fa-toggle-off",
				check: "fa fa-toggle-on"
			}
		}

		var MyControl = L.control();
		MyControl.setPosition('topleft');
		MyControl.initialize = function() {
			L.Util.setOptions(this, options);
		}
		MyControl.onAdd = function() {
			var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom');
			var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
			span.textContent = 'T';
			span.title = "Toggle Labels";
			L.DomEvent.disableClickPropagation(container);
			L.DomEvent.addListener(container, 'click', function() {
				leafletData.getMap('map').then(function(map) {
					if (vm.noLabel) {
						map.removeLayer(vm.labelsLayer);
						vm.noLabel = false;
					} else {
						map.addLayer(vm.labelsLayer);
						vm.labelsLayer.bringToFront();
						vm.noLabel = true;
					}
				});
			});
			return container;
		}
		var BackHome = L.control();
		BackHome.setPosition('topleft');
		BackHome.initialize = function() {
			L.Util.setOptions(this, options);
		}
		BackHome.onAdd = function() {
			var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom leaflet-control-home');
			var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
			var icon = L.DomUtil.create('md-icon', 'material-icons md-primary', span);
			span.title = "Center Map";
			icon.textContent = "home";
			L.DomEvent.disableClickPropagation(container);
			L.DomEvent.addListener(container, 'click', function() {
				leafletData.getMap('map').then(function(map) {
					map.setView([48.209206, 16.372778], zoom);
				});
			});
			return container;
		}


		function toggleLayers(overlayName) {
			leafletData.getMap('map').then(function(map) {
				console.log(map);
				if (vm.noLabel) {
					map.removeLayer(vm.labelsLayer);
					vm.noLabel = false;
				} else {
					map.addLayer(vm.labelsLayer);
					vm.labelsLayer.bringToFront();
					vm.noLabel = true;
				}
			});

		}
		leafletData.getMap('map').then(function(map) {
			VectorlayerService.setMap(map);
			//var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/' + VectorlayerService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + VectorlayerService.fields(); //
			var url = 'https://www.23degree.org:3001/services/postgis/' + VectorlayerService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + VectorlayerService.fields(); //
			var layer = new L.TileLayer.MVTSource({
				url: url,
				debug: false,
				detectRetina:true,
				clickableLayers: [VectorlayerService.getName() + '_geom'],
				mutexToggle: true,
				getIDForLayerFeature: function(feature) {
					return feature.properties.iso_a2;
				},
				filter: function(feature, context) {

					return true;
				},
				style: function(feature) {
					var style = {};
					style.color = 'rgba(0,0,0,0)';
					style.outline = {
						color: 'rgba(0,0,0,0)',
						size: 0
					};
					return style;
				}
			});

			map.addLayer(VectorlayerService.setLayer(layer));
			map.addControl(MyControl);
			map.addControl(BackHome);
			/*map.on('click', function(){
				alert('hello');
			});

            var mapEvents = leafletMapEvents.getAvailableMapEvents();
            for (var k in mapEvents){
                var eventName = 'leafletDirectiveMap.' + mapEvents[k];
                console.log(mapEvents[k])
                $scope.$on(eventName, function(event){
                    console.log(event.name);
                });
            }
		/*	map.addLayer(vm.labelsLayer);
			vm.labelsLayer.bringToFront();
				vm.noLabel = true;*/
		});
	}]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('SelectedCtrl', ["$scope", "getCountry", "VectorlayerService", "$filter", function($scope, getCountry, VectorlayerService, $filter){
        //
        var vm = this;
        vm.structure = $scope.$parent.vm.structure;
        vm.display = $scope.$parent.vm.display;
        vm.data = $scope.$parent.vm.data;
        vm.current = getCountry;
        vm.mvtSource = VectorlayerService.getLayer();
        vm.getRank = getRank;
        vm.getOffset = getOffset;
        vm.getTendency = getTendency;

        function calcRank() {
          var rank = 0;
          angular.forEach(vm.data, function(item) {
            item[vm.structure.score_field_name] = parseFloat(item[vm.structure.score_field_name]);
            item['score'] = parseInt(item['score']);
          })
          var filter = $filter('orderBy')(vm.data, [vm.structure.score_field_name, "score"], true);
          for (var i = 0; i < filter.length; i++) {
            if (filter[i].iso == vm.current.iso) {
              rank = i + 1;
            }
          }
          vm.current[vm.structure.score_field_name+'_rank'] = rank;
          vm.circleOptions = {
              color:vm.structure.color,
              field:vm.structure.score_field_name+'_rank'
          }
        }
        function getRank(country){
          var filter = $filter('orderBy')(vm.data, [vm.structure.score_field_name, "score"], true);
          var rank = 0;
          angular.forEach(filter, function(item, key){
            if(item.country == country.country){
              rank = key;
            }
          });
          return rank+1;
        }
        function getOffset() {
    			if (!vm.current) {
    				return 0;
    			}
    			return (vm.getRank(vm.current) - 2) * 16;
    		};

    		function getTendency() {
    			if (!vm.current) {
    				return 'arrow_drop_down'
    			}
    			return vm.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
    		};

        $scope.$watch('vm.current', function (n, o) {
          if (n === o) {
            return;
          }

            if(o.iso){
              vm.mvtSource.layers.countries_big_geom.features[o.iso].selected = false;
            }
            calcRank();
            fetchNationData(n.iso);


        });
        /*;*/
    }]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('SidebarCtrl', ["$scope", "$state", function($scope, $state){


	}]);

})();
(function(){
    "use strict";

    angular.module('app.controllers').controller('SidemenuCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('SignupCtrl', function(){
        //
    });

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('ToastsCtrl', ["$scope", "ToastService", function($scope, ToastService){

		$scope.toastSuccess = function(){
			ToastService.show('User added successfully!');
		};

		$scope.toastError = function(){
			ToastService.error('Connection interrupted!');
		};

	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('UnsupportedBrowserCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('UserCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddProviderCtrl', ["$scope", "DialogService", "DataService", function($scope, DialogService, DataService){
        var vm = this;
        vm.dataprovider = {};
        vm.dataprovider.title = $scope.$parent.vm.searchText;

        vm.save = function(){
            //
            DataService.post('/dataproviders', vm.dataprovider).then(function(data){
              $scope.$parent.vm.dataproviders.push(data);
              $scope.$parent.vm.item.dataprovider = data;
              DialogService.hide();
            });

        };

        vm.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddUnitCtrl', ["$scope", "DataService", "DialogService", function($scope, DataService,DialogService){

      var vm = this;
      vm.unit = {};
      vm.unit.title = $scope.$parent.vm.searchUnit;

      vm.save = function(){
          //
          DataService.post('/measure_types', vm.unit).then(function(data){
            $scope.$parent.vm.measureTypes.push(data);
            $scope.$parent.vm.item.type = data;
            DialogService.hide();
          });

      };

      vm.hide = function(){
        DialogService.hide();
      };


    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddYearCtrl', ["$scope", "DialogService", function($scope, DialogService){

        $scope.save = function(){
            console.log($scope.vm);
            $scope.vm.saveData();
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddUsersCtrl', ["$scope", "DialogService", function($scope, DialogService){

        $scope.save = function(){
	        //do something useful
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ConflictmethodeCtrl', ["$scope", "DialogService", function($scope, DialogService){

        $scope.save = function(){
            //
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ConflicttextCtrl', ["$scope", "DialogService", function($scope, DialogService){
  

        $scope.save = function(){
            //
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('CopyproviderCtrl', ["$scope", "IndexService", "DialogService", function ($scope, IndexService, DialogService) {
		$scope.$parent.vm.askedToReplicate = true;
		$scope.$parent.vm.doProviders = true;
		$scope.$parent.vm.doStyle = true;
		$scope.$parent.vm.doCategories = true;
		$scope.$parent.vm.doMeasures = true;
		$scope.$parent.vm.doPublic = true;
		$scope.save = function () {

			angular.forEach($scope.$parent.vm.data[0].data, function (data, key) {
				if (key != "year") {
					if (typeof IndexService.getIndicator(key) == "undefined") {
						IndexService.setIndicator(key, {
							column_name: key,
							title: key
						});
					}
					var item = IndexService.getIndicator(key);
					if ($scope.$parent.vm.doProviders) {
						item.dataprovider = $scope.$parent.vm.preProvider;
					}
					if ($scope.$parent.vm.doMeasures) {
						item.type = $scope.$parent.vm.preType;
					}
					if ($scope.$parent.vm.doCategories) {
						item.categories = $scope.$parent.vm.preCategories;
					}
					if ($scope.$parent.vm.doPublic) {
						item.is_public = $scope.$parent.vm.prePublic;
					}
					if ($scope.$parent.vm.doStyle) {

						if (typeof item.style != "undefined") {
							item.style = $scope.$parent.vm.preStyle;
							item.style_id = $scope.$parent.vm.preStyle.id;
						}

					}
				}
			});
			DialogService.hide();
			IndexService.setToLocalStorage();

		};

		$scope.hide = function () {
			$scope.$parent.vm.doProviders = false;
			$scope.$parent.vm.doCategories = false;
			$scope.$parent.vm.doMeasures = false;
			DialogService.hide();
		};

	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('EditcolumnCtrl', ["$scope", "DialogService", function($scope, DialogService){
        $scope.name = $scope.$parent.vm.toEdit;
        if(typeof $scope.$parent.vm.meta.table[$scope.name] == "undefined"){
          $scope.$parent.vm.meta.table[$scope.name] = {};
        }
        else{
          if($scope.$parent.vm.meta.table[$scope.name].title){
            $scope.title = $scope.$parent.vm.meta.table[$scope.name].title;
          }
          if($scope.$parent.vm.meta.table[$scope.name].description){
            $scope.description = $scope.$parent.vm.meta.table[$scope.name].description;
          }
        }

        $scope.save = function(){
          $scope.$parent.vm.meta.table[$scope.name].title = $scope.title;
          $scope.$parent.vm.meta.table[$scope.name].description = $scope.description;
          DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('EditrowCtrl', ["$scope", "DialogService", function($scope, DialogService){
        $scope.data = $scope.$parent.vm.selected[0];
        $scope.save = function(){
            //
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ExtendDataCtrl', ["$scope", "$state", "DialogService", function($scope,$state, DialogService){

        $scope.save = function(){
            $scope.vm.doExtend = true;
            $scope.vm.meta.iso_field = $scope.vm.addDataTo.iso_name;
            $scope.vm.meta.country_field = $scope.vm.addDataTo.country_name;
            $state.go('app.index.check');
          	DialogService.hide();
        };

        $scope.hide = function(){
          $state.go('app.index.check');
        	DialogService.hide();
        };

    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('LoosedataCtrl', ["$scope", "$state", "DialogService", function($scope, $state, DialogService){

        $scope.save = function(){
            //
            $scope.vm.deleteData();
            $state.go($scope.toState.name);
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('SelectisofetchersCtrl', ["$scope", "IndexService", "DialogService", function ($scope, IndexService, DialogService) {
		var vm = this;
		var meta = IndexService.getMeta();
		vm.iso = meta.iso_field;
		vm.list = IndexService.getToSelect();
		vm.save = function () {
			DialogService.hide();
		};

		vm.hide = function () {
			DialogService.hide();
		};
		$scope.$watch('vm.list', function (n, o) {
			if (n === o) {
				return;
			}
			angular.forEach(n, function (item, key) {
				if (item.entry.data[0][vm.iso]) {
					angular.forEach(item.entry.errors, function (error, e) {
						if (error.type == 2 || error.type == 3) {
							IndexService.reduceIsoError();
							item.entry.errors.splice(e, 1);
						} else if (error.type == 1) {
							if (error.column == vm.iso) {
								IndexService.reduceError();
								item.entry.errors.splice(e, 1);
							}
						}
					});
					vm.list.splice(key, 1);
				}
			});
			if (vm.list.length == 0) {
				DialogService.hide();
			}
		}, true);
	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'autoFocus', ["$timeout", function($timeout) {
		return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };

	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('BarsCtrl', function () {
		//
		var vm = this;
		vm.width = width;

		function width(item) {
			if(!vm.data) return;
			return vm.data[item.name];
		}
	});

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'bars', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/bars/bars.html',
			controller: 'BarsCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				data: '=',
				options: '=',
				structure: '='
			},
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BasemapCtrl', function(){
		//

		var vm = this;
		vm.original = angular.copy(vm.item);

		vm.baseOptions = {
			drag: false,
			allowDrop: false,
			allowDrag: false,
			allowMove: false,
			allowDelete: false,
			allowAddContainer: false,
			allowAdd: false,
			allowSave: true,
			editable: false,
			assigments: false,
			saveClick: vm.options.save,
			deleteClick: vm.options.deleteClick,

		};
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'basemap', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/basemap/basemap.html',
			controller: 'BasemapCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '='
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BasemapSelectorCtrl', ["BasemapsService", "VectorlayerService", function(BasemapsService, VectorlayerService){
		//
			var vm = this;
			vm.basemaps = [];
			vm.selected = {};
			vm.setMap = setMap;
			vm.viewTiles = viewTiles;
			vm.defaults = {
				scrollWheelZoom: false,
				minZoom: 1,
				maxZoom: 8,
				zoomControl: false,
			};
			vm.center = VectorlayerService.center;
			vm.maxbounds = VectorlayerService.maxbounds;

			activate();

			function activate(){
				if(!vm.style){
					vm.style = {
						basemap_id:0
					}
				}
				BasemapsService.getBasemaps(function(response){
					vm.basemaps = response;
					if(vm.style.basemap_id != 0){
						angular.forEach(vm.basemaps, function(map, key){
							if(map.id == vm.style.basemap_id){
								vm.selected = map;
							}
						})
					}
				});
			}

			function setMap(map){
				vm.selected = map;
				vm.style.basemap_id = map.id;
				vm.style.basemap = map;
			}
			function viewTiles(map){
				return {
					url:map.url,
					attribution:map.attribution,
					type:'xyz'
				}
			}

    }]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'basemapSelector', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/basemapSelector/basemapSelector.html',
			controller: 'BasemapSelectorCtrl',
			controllerAs: 'vm',
			scope:{
				style: '=ngModel',
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BubblesCtrl', function(){
		//

  });

})();

(function () {
	"use strict";

	function CustomTooltip(tooltipId, width) {
		var tooltipId = tooltipId;
		var elem = document.getElementById(tooltipId);
		if(elem == null){
			angular.element(document).find('body').append("<div class='tooltip md-whiteframe-z3' id='" + tooltipId + "'></div>");
		}
		hideTooltip();
		function showTooltip(content, data, event, element) {
			angular.element(document.querySelector('#' + tooltipId)).html(content);
			angular.element(document.querySelector('#' + tooltipId)).css('display', 'block');

			return updatePosition(event, data, element);
		}
		function hideTooltip() {
			angular.element(document.querySelector('#' + tooltipId)).css('display', 'none');
		}
		function updatePosition(event, d, element) {
			var ttid = "#" + tooltipId;
			var xOffset = 20;
			var yOffset = 10;
			var svg = element.find('svg')[0];//document.querySelector('#svg_vis');
			var wscrY = window.scrollY;
			var ttw = angular.element(document.querySelector(ttid)).offsetWidth;
			var tth = document.querySelector(ttid).offsetHeight;
			var tttop = svg.getBoundingClientRect().top + d.y - tth / 2;
			var ttleft = svg.getBoundingClientRect().left + d.x + d.radius + 12;
			return angular.element(document.querySelector(ttid)).css('top', tttop + 'px').css('left', ttleft + 'px');
		}
		return {
			showTooltip: showTooltip,
			hideTooltip: hideTooltip,
			updatePosition: updatePosition
		}
	}
	angular.module('app.directives').directive('bubbles', ["$compile", "IconsService", function ($compile, IconsService) {
		var defaults;
		defaults = function () {
			return {
				width: 300,
				height: 300,
				layout_gravity: 0,
				sizefactor:3,
				vis: null,
				force: null,
				damper: 0.085,
				circles: null,
				borders: true,
				labels: true,
				fill_color: d3.scale.ordinal().domain(["eh", "ev"]).range(["#a31031", "#beccae"]),
				max_amount: '',
				radius_scale: '',
				duration: 1000,
				tooltip: CustomTooltip("bubbles_tooltip", 240)
			};
		};
		return {
			restrict: 'E',
			scope: {
				chartdata: '=',
				direction: '=',
				gravity: '=',
				sizefactor: '=',
				indexer: '=',
				borders: '@'
			},
			require: 'ngModel',
			link: function (scope, elem, attrs, ngModel) {
				var options = angular.extend(defaults(), attrs);
				var nodes = [],
					links = [],
					labels = [],
					groups = [];

				var max_amount = d3.max(scope.chartdata, function (d) {
					return parseFloat(d.value);
				});
				//options.height = options.width * 1.1;
				options.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
				options.center = {
					x: options.width / 2,
					y: options.height / 2
				};
				options.cat_centers = {};

				var create_nodes = function () {
					if(scope.indexer.children.length == 2 && scope.indexer.children[0].children.length > 0){
						angular.forEach(scope.indexer.children, function (group, index) {
							var mColor = group.color;
							if(group.style_id != 0){
								mColor = group.style.base_color;
							}

							var d = {
								type: group.name,
								name: group.title,
								group: group.name,
								color: mColor,
								icon: group.icon,
								unicode: IconsService.getUnicode(group.icon),
								data: group,
								children:group.children
							};
							labels.push(d);
							angular.forEach(group.children, function (item) {
								if (scope.chartdata[item.name]) {
									var color = item.color;
									if(item.style_id != 0){
										color = item.style.base_color;
									}
									else if(group.style_id != 0){
										color = group.style.base_color;
									}
									var node = {
										type: item.name,
										radius: scope.chartdata[item.name] / scope.sizefactor,
										value: scope.chartdata[item.name],
										name: item.title,
										group: group.name,
										x: options.center.x,
										y: options.center.y,
										color: color,
										icon: item.icon,
										unicode: IconsService.getUnicode(item.icon),
										data: item,
										children:item
									};
									nodes.push(node);
								}
							});
						});
						create_groups();

					}
					else{

						var d = {
							type: scope.indexer.name,
							name: scope.indexer.title,
							group: scope.indexer.name,
							color: scope.indexer.style.base_color || scope.indexer.color,
							icon: scope.indexer.icon,
							unicode: scope.indexer.unicode,
							data: scope.indexer.data,
							children: scope.indexer.children
						};
						labels.push(d);
						angular.forEach(scope.indexer.children, function (item) {
							if (scope.chartdata[item.name]) {

								var node = {
									type: item.name,
									radius: scope.chartdata[item.name] / scope.sizefactor,
									value: scope.chartdata[item.name] / scope.sizefactor,
									name: item.title,
									group: scope.indexer.name,
									x: options.center.x,
									y: options.center.y,
									color: item.color,
									icon: item.icon,
									unicode: IconsService.getUnicode(item.icon),
									data: item,
									children:item
								};
								nodes.push(node);
							}
						});
					}
				};
				var clear_nodes = function(){
					nodes = [];
					labels = [];
				}
				var create_groups = function(){
					angular.forEach(nodes, function(node, key){
							options.cat_centers[node.group] = {
								x: options.width / 2,
								y: options.height / 2 + (1 - key),
								damper: 0.085,
							};
					});
				};
				var create_vis = function () {
					angular.element(elem).html('');
					options.vis = d3.select(elem[0]).append("svg").attr("width", options.width).attr("height", options.height).attr("id", "svg_vis");

					if (!options.borders) {
						var pi = Math.PI;
						if(labels.length == 2){
							var arcTop = d3.svg.arc()
								.innerRadius(109)
								.outerRadius(110)
								.startAngle(-90 * (pi / 180)) //converting from degs to radians
								.endAngle(90 * (pi / 180)); //just radians
							var arcBottom = d3.svg.arc()
								.innerRadius(134)
								.outerRadius(135)
								.startAngle(90 * (pi / 180)) //converting from degs to radians
								.endAngle(270 * (pi / 180)); //just radians

							options.arcTop = options.vis.append("path")
								.attr("d", arcTop)
								.attr("fill", function(d){
									return labels[0].color || "#be5f00";
								})
								.attr("id", "arcTop")
								.attr("transform", "translate("+(options.width/2)+","+(options.height/2 - options.height/12)+")");
							options.arcBottom = options.vis.append("path")
								.attr("d", arcBottom)
								.attr("id", "arcBottom")
								.attr("fill", function(d){
									return labels[1].color || "#006bb6";
								} )
								.attr("transform", "translate("+(options.width/2)+","+(options.height/2)+")");
						}
						else{
							var arc = d3.svg.arc()
								.innerRadius(options.width/3 - 1)
								.outerRadius(options.width/3)
								.startAngle(0 * (pi / 180)) //converting from degs to radians
								.endAngle(360 * (pi / 180)); //just radians


							options.arc = options.vis.append("path")
								.attr("d", arc)
								.attr("fill", labels[0].color)
								.attr("id", "arcTop")
								.attr("transform", "translate("+(options.width/2)+","+(options.height/2)+")");

						}
					}
				if(options.labels == true && labels.length == 2){
						var textLabels = options.vis.selectAll('text.labels').data(labels).enter().append("text")
							.attr('class', 'labels')
							.attr('fill', function(d){
								return d.color;
							})
						/*	.attr('transform', function(d){
								var index = labels.indexOf(d);
								if(index > 0){
									return 'rotate(90, 100, 100)';
								}
							})*/
							.attr('x', "50%")
							.style('font-size', '1.2em')
							.style('cursor', 'pointer')

							.attr('width', options.width)
							.attr('text-anchor', 'middle')
							.on('click', function(d){
								ngModel.$setViewValue(d.data);
								ngModel.$render();
							})
							.attr("y", function(d){
								var index = labels.indexOf(d);
								if(index == 0){
									return 15;
								}
								else{
									return options.height - 6;
								}
							})
							.text(function(d){
								return d.name;
							})

					}
					options.containers = options.vis.selectAll('g.node').data(nodes).enter().append('g').attr('transform', 'translate(' + (options.width / 2) + ',' + (options.height / 2) + ')').attr('class', 'node');

					/*options.circles = options.containers.selectAll("circle").data(nodes, function (d) {
						return d.id;
					});*/

					options.circles = options.containers.append("circle").attr("r", 0).attr("fill", (function (d) {
						return d.color || options.fill_color(d.group);
					})).attr("stroke-width", 0).attr("stroke", function (d) {
						return d3.rgb(options.fill_color(d.group)).darker();
					}).attr("id", function (d) {

						return "bubble_" + d.type;
					});
					options.icons = options.containers.append("text")
						.attr('font-family', 'EPI')
						.attr('font-size', function (d) {

						})
						.attr("text-anchor", "middle")
						.attr('fill', function(d){
							return d.unicode ? '#fff' : d.color;
						})
						.style('opacity', function(d){
							if(d.unicode){
								return 1;
							}
							else{
								return 0;
							}
						})
						.text(function (d) {
							return d.unicode || '1'
						});
					options.icons.on("mouseover", function (d, i) {

						return show_details(d, i, this);
					}).on("mouseout", function (d, i) {
						return hide_details(d, i, this);
					}).on("click", function (d, i) {

						ngModel.$setViewValue(d.data);
						ngModel.$render();
					});
					options.circles.transition().duration(options.duration).attr("r", function (d) {
						return d.radius;
					});
					options.icons.transition().duration(options.duration).attr("font-size", function (d) {
						return d.radius * 1.75 + 'px';
					}).attr('y', function (d) {
						return d.radius * .75 + 'px';
					});
				};
				var update_vis = function () {

					nodes.forEach(function (d, i) {
						options.circles.transition().duration(options.duration).delay(i * options.duration)
							.attr("r", function (d) {
								d.radius = d.value = scope.chartdata[d.type] / scope.sizefactor;
								return scope.chartdata[d.type] / scope.sizefactor;
							});
						options.icons.transition().duration(options.duration).delay(i * options.duration)
							.attr("font-size", function (d) {
								return (scope.chartdata[d.type] / scope.sizefactor) * 1.75 + 'px'
							})
							.attr('y', function (d) {
								return (scope.chartdata[d.type] / scope.sizefactor) * .75 + 'px';
							})
					});
				};
				var charge = function (d) {
					return -Math.pow(d.radius, 2.0) / 4;
				};
				var start = function () {
					return options.force = d3.layout.force().nodes(nodes).size([options.width, options.height]).links(links);
				};
				var display_group_all = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.85).on("tick", function (e) {
						options.containers.each(move_towards_center(e.alpha)).attr("transform", function (d) {
							return 'translate(' + d.x + ',' + d.y + ')';
						});
					});
					options.force.start();
				};
				var display_by_cat = function () {
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", function (e) {
						options.containers.each(move_towards_cat(e.alpha)).attr("transform", function (d) {
							return 'translate(' + d.x + ',' + d.y + ')';
						});
					});
					options.force.start();
				};
				var move_towards_center = function (alpha) {
					return (function (_this) {
						return function (d) {
							d.x = d.x + (options.width/2 - d.x) * (options.damper + 0.02) * alpha *1.25;
							d.y = d.y + (options.height/2 - d.y) * (options.damper + 0.02) * alpha * 1.25;
						}
					})(this);
				};
				var move_towards_top = function (alpha) {
					return (function (_this) {
						return function (d) {
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha * 1.1;
							d.y = d.y + (200 - d.y) * (options.damper + 0.02) * alpha * 1.1;
						}
					})(this);
				};
				var move_towards_cat = function (alpha) {
					return (function (_this) {
						return function (d) {

							var target;
							target = options.cat_centers[d.group];
							d.x = d.x + (target.x - d.x) * (target.damper + 0.02) * alpha * 1;
							return d.y = d.y + (target.y - d.y) * (target.damper + 0.02) * alpha * 1;
						}
					})(this);
				};
				var show_details = function (data, i, element) {
					var content;
					var	barOptions = {
						titled:true
					};
					content = '<md-progress-linear md-mode="determinate" value="'+data.value+'"></md-progress-linear>'
					content += "<span class=\"title\">"+ data.name + "</span><br/>";
					angular.forEach(data.data.children, function (info) {
						if(scope.chartdata[info.name] > 0 ){
							content += '<div class="sub">';
							content += '<md-progress-linear md-mode="determinate" value="'+scope.chartdata[info.name]+'"></md-progress-linear>'
							content += "<span class=\"name\" style=\"color:" + (info.color || data.color) + "\"> "+scope.chartdata[info.name]+' - ' + (info.title) + "</span><br/>";
							content += '</div>';
						}

					});
					//content = '<bars options="barOptions" structure="data.data.children" data="data"></bars>';

					$compile(options.tooltip.showTooltip(content, data, d3.event, elem).contents())(scope);
				};

				var hide_details = function (data, i, element) {
					return options.tooltip.hideTooltip();
				};

				scope.$watch('chartdata', function (data, oldData) {
					options.tooltip.hideTooltip();

					if (options.circles == null) {
						create_nodes();
						create_vis();
						start();
					} else {
						update_vis();
					}
					if(labels.length == 1 || options.labels != true){
							display_group_all();
					}
					else{
							display_by_cat();
					}

				});
				scope.$watch('indexer', function (n, o) {
					if(n === o){
						return
					}
					if(typeof n[0].children != "undefined"){
						options.tooltip.hideTooltip();
						clear_nodes();
						create_nodes();
						create_vis();
						start();

						if(labels.length == 1 || options.labels != true){
								display_group_all();
								//console.log('all');
						}
						else{
								//display_by_cat();
								display_group_all();
								//console.log('all');
						}
					}
				});
				scope.$watch('direction', function (oldD, newD) {
					if (oldD === newD) {
						return;
					}
					if (oldD == "all") {
						display_group_all();
					} else {
						display_by_cat();
					}
				})
			}
		};
	}]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('CategoriesCtrl', ["$filter", "toastr", "DataService", function ($filter, toastr, DataService) {
		//
		var vm = this;
		vm.catOptions = {
			abort: function(){
				vm.createCategory = false;
			},
			postDone:function(category){
				vm.createCategory = false;
			}
		}

	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'categories', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/categories/categories.html',
			controller: 'CategoriesCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				categories: '=',
				options:'=',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'CategoryCtrl', ["$scope", "$filter", "toastr", "DataService", "ContentService", function($scope, $filter, toastr, DataService, ContentService){
		//
		var vm = this;

		vm.saveCategory = saveCategory;
		vm.querySearchCategory = querySearchCategory;
		vm.parentChanged = parentChanged;
		vm.checkBase = checkBase;
		vm.styles = ContentService.getStyles();
		vm.flattened = [];
		vm.copy = {};
		activate();

		function activate(){
			flattenWithChildren(vm.categories);
			if(vm.item.parent_id){
				vm.parent = getParent(vm.item, vm.categories);
				vm.copy = angular.copy(vm.item);
			}
		}
		function flattenWithChildren(list){
			angular.forEach(list, function(item){
				vm.flattened.push(item);
				if(item.children){
					flattenWithChildren(item.children)
				}
			})
		}
		function querySearchCategory(query) {
			return $filter('findbyname')($filter('orderBy')(vm.flattened, 'title'), query, 'title');
			//return $filter('findbyname')($filter('flatten')(vm.categories), query, 'title');
		}
		function checkBase(){
			if (vm.item.title && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function parentChanged(item){
			if(typeof item == "undefined"){
				vm.item.parent_id = null;
				vm.item.parent = null;
				return false;
			}
			if(item.id == vm.item.id){
				toastr.error('The Parent cannot be the same', 'Invalid selection');
				return false;
			}
			vm.parent = item;
			vm.item.parent_id = item.id;
			vm.item.parent = item;
		}
		function getParent(item,list){
			var found = null
			angular.forEach(list, function(entry, key){
				if(entry.id == item.parent_id){
					found = entry;
				}
				if(entry.children && !found){
					var subresult = getParent(item, entry.children);
					if(subresult){
						found = subresult;
					}
				}
			});
			return found;
		}
		function moveItem(){
			if(vm.copy.parent_id){
					var oldParent = getParent(vm.copy, vm.categories);
					for(var i = 0; i < oldParent.children.length; i++ ){
						if(oldParent.children[i].id == vm.item.id){
							oldParent.children.splice(i,1);
						}
					}
			}
			else{
				for(var i = 0; i < vm.categories.length; i++ ){
					if(vm.categories[i].id == vm.item.id){
						vm.categories.splice(i,1);
					}
				}
			}
			if(vm.item.parent_id){
				var newParent = getParent(vm.item, vm.categories);
				newParent.children.push(vm.item);

			}
			else{
				vm.categories.push(vm.item);
			}
		}
		function successAction(data){
			console.log(vm.copy.parent_id, vm.item.parent_id);
			if(vm.copy.parent_id != vm.item.parent_id){
				//if(vm.copy.parent_id && vm.item.parent_id){
					moveItem();
			//	}
			}
			toastr.success('Category has been updated', 'Success');
			$scope.categoryForm.$setSubmitted();
			vm.copy = angular.copy(vm.item);
		}
		function saveCategory(valid) {
			if(valid){
				if(vm.item.id){
					if(vm.item.restangularized){
						vm.item.save().then(successAction);
					}
					else{
						DataService.update('categories', vm.item.id, vm.item).then(successAction);
					}

				}
				else{
					DataService.post('categories', vm.item).then(function (data) {
						if(data.parent_id ){
								 var parent = getParent(data, vm.categories);
								 if(!parent.children){
									 parent.children = [];
								 }
								 parent.children.push(data);
								 parent.expanded = true;
						}
						else{
							vm.categories.push(data);
						}
						toastr.success('New Category has been saved', 'Success');
						vm.options.postDone(data);
					});
				}

			}
		}
    }]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'category', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/category/category.html',
			controller: 'CategoryCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				categories: '=',
				options:'=?',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'CirclegraphCtrl', function(){
		//
    });

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('circlegraph', ["$timeout", function ($timeout) {
		var defaults = function () {
			return {
				width: 80,
				height: 80,
				color: '#00ccaa',
				size: 178,
				field: 'rank'
			}
		}
		return {
			restrict: 'E',
			controller: 'CirclegraphCtrl',
			scope: {
				options: '=',
				item: '='
			},
			link: function ($scope, element, $attrs) {
				//Fetching Options

				$scope.options = angular.extend(defaults(), $scope.options);
				var  τ = 2 * Math.PI;
				//Creating the Scale
				var rotate = d3.scale.linear()
					.domain([1, $scope.options.size])
					.range([1, 0])
					.clamp(true);

				//Creating Elements
				var svg = d3.select(element[0]).append('svg')
					.attr('width', $scope.options.width)
					.attr('height', $scope.options.height)
					.append('g');

				var container = svg.append('g')
					.attr('transform', 'translate(' + $scope.options.width / 2 + ',' + $scope.options.height / 2 + ')');

				var circleBack = container.append('circle')
					.attr('r', $scope.options.width / 2 - 2)
					.attr('stroke-width', 2)
					.attr('stroke', $scope.options.color)
					.style('opacity', '0.6')
					.attr('fill', 'none');

				var arc = d3.svg.arc()
					.startAngle(0)
					.innerRadius(function (d) {
						return $scope.options.width / 2 - 4;
					})
					.outerRadius(function (d) {
						return $scope.options.width / 2;
					});

				var circleGraph = container.append('path')
					.datum({
						endAngle: 2 * Math.PI * 0
					})
					.style("fill", $scope.options.color)
					.attr('d', arc);
				var text = container.selectAll('text')
					.data([0])
					.enter()
					.append('text')
					.text(function (d) {
						if(!$scope.options.hideNumbering)
							return 'N°' + d;
						return d;
					})
					.style("fill", $scope.options.color)
					.style('font-weight', 'bold')
					.style('font-size', function(){
						if(!$scope.options.hideNumbering)
						return '1em';
						return '1.5em';
					})
					.attr('text-anchor', 'middle')
					.attr('y', function(d){
						if(!$scope.options.hideNumbering)
							return '0.35em';
						return '0.37em'
					});

				//Transition if selection has changed
				function animateIt(radius) {
					circleGraph.transition()
							.duration(750)
							.call(arcTween, rotate(radius) * 2 * Math.PI);

					text.transition().duration(750).tween('text', function (d) {
						if(!$scope.options.hideNumbering){
							var data = this.textContent.split('N°');
							var i = d3.interpolate(parseInt(data[1]), radius);
							return function (t) {
								this.textContent = 'N°' + (Math.round(i(t) * 1) / 1);
							};
						}
						else{
							var i = d3.interpolate(parseInt(d), radius);
							return function (t) {
								this.textContent = (Math.round(i(t) * 1) / 1);
							};
						}
					})
				}

				//Tween animation for the Arc
				function arcTween(transition, newAngle) {
					transition.attrTween("d", function (d) {
						var interpolate = d3.interpolate(d.endAngle, newAngle);
						return function (t) {
							d.endAngle = interpolate(t);
							return arc(d);
						};
					});
				}

				/*$scope.$watch('options', function (n, o) {
					if (n === o) {
						return;
					}
					circleBack.style('stroke', n.color);
					circleGraph.style('fill', n.color);
					text.style('fill', n.color);
					$timeout(function () {
						animateIt($scope.item[n.field])
					});
				});*/

				//Watching if selection has changed from another UI element
				$scope.$watch('item',	function (n, o) {
						//if(n === o) return;
						if (!n) {
							n[$scope.options.field] = $scope.options.size;
						}
						$timeout(function () {
								animateIt(n[$scope.options.field]);
						});
					});
				$scope.$watch('options', function(n,o){
					if(n === o || !n) return;
					$timeout(function () {
							animateIt($scope.item[$scope.options.field]);
					});
				},true);
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'CompositsCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'composits', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/composits/composits.html',
			controller: 'CompositsCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				items: '=',
				item: '=',
				options:'='
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ConflictitemsCtrl', function(){
		//
    });

})();

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

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ContenteditableCtrl', function(){
		//
    });

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('contenteditable', function () {

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ngModel) {

				//if (!ngModel) return;
				ngModel.$render = function () {
					element.html(ngModel.$viewValue || '');
				};

				// Listen for change events to enable binding
				element.on('blur keyup change', function () {
					scope.$apply(readViewText);
				});
				
				// No need to initialize, AngularJS will initialize the text based on ng-model attribute

				// Write data to the model
				function readViewText() {
					var html = element.html();
					// When we clear the content editable the browser leaves a <br> behind
					// If strip-br attribute is provided then we strip this out
					if (attrs.stripBr && html == '<br>') {
						html = '';
					}
					ngModel.$setViewValue(html);
				}
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'export', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/export/export.html',
			controller: 'ExportDirectiveCtrl',
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

(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportDirectiveCtrl', ["DataService", function(DataService) {
		//
		var vm = this;
		vm.original = angular.copy(vm.item);
		vm.checkBase = checkBase;
		vm.checkFull = checkFull;


		vm.baseOptions = {
			drag: true,
			allowDrop: true,
			allowDrag: true,
			allowMove: true,
			allowSave: true,
			allowDelete: true,
			allowAddContainer: true,
			allowAdd: true,
			editable: true,
			assigments: false,
			saveClick: vm.options.exports.save,
			addClick: vm.options.exports.addClick,
			addContainerClick: vm.options.exports.addContainerClick,
			deleteDrop: vm.options.exports.deleteDrop,
			deleteClick: vm.options.exports.deleteClick,
			onDrop: vm.options.exports.onDrop,
			inserted: vm.options.exports.inserted,
			styleable: vm.options.styleable,
			styleClick: vm.options.style.click,
			hideExpansionOnItem:true
		};
		activate();


		function activate() {
			//loadAll();
		}

		function checkBase() {

		}

		function checkFull() {

		}

	}]);

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('fileDropzone', ["toastr", function (toastr) {

		return {
			restrict: 'EA',
			scope: {
        file: '=',
        fileName: '='
      },
			link: function (scope, element, attrs) {
				var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
				processDragOverOrEnter = function (event) {
					if (event != null) {
						event.preventDefault();
					}
					event.dataTransfer.effectAllowed = 'copy';
					return false;
				};
				validMimeTypes = attrs.fileDropzone;
				checkSize = function (size) {
					var _ref;
					if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
						return true;
					} else {
						alert("File must be smaller than " + attrs.maxFileSize + " MB");
						return false;
					}
				};
				isTypeValid = function (type) {
					if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
						return true;
					} else {
						toastr.error("File must be one of following types " + validMimeTypes, 'Invalid file type!');

						return false;
					}
				};
				element.bind('dragover', processDragOverOrEnter);
				element.bind('dragenter', processDragOverOrEnter);
				return element.bind('drop', function (event) {
					var file, name, reader, size, type;
					if (event != null) {
						event.preventDefault();
					}
					reader = new FileReader();
					reader.onload = function (evt) {
						if (checkSize(size) && isTypeValid(type)) {
							return scope.$apply(function () {
								scope.file = evt.target.result;
								if (angular.isString(scope.fileName)) {
									return scope.fileName = name;
								}
							});
						}
					};
					file = event.dataTransfer.files[0];
					/*name = file.name;
					type = file.type;
					size = file.size;
					reader.readAsDataURL(file);*/
					scope.file = file;
					return false;
				});
			}
		};
	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'FileDropzoneCtrl', function(){
		//
    });

})();

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

(function () {
	"use strict";

	angular.module('app.controllers').controller('HistoryCtrl', ["$scope", function ($scope) {
		$scope.setData = setData;
		activate();
	
		function activate(){
			$scope.setData();
			$scope.$watch('options', function(n,o){
				if(n === 0){
					return;
				}
				$scope.setData();
			})
		}
		function setData(){
			$scope.display = {
				selectedCat: '',
				rank: [{
					fields: {
						x: 'year',
						y: 'rank'
					},
					title: 'Rank',
					color: '#52b695'
				}],
				score: [{
					fields: {
						x: 'year',
						y: $scope.options.field
					},
					title: 'Score',
					color: $scope.options.color
				}]
			};
		}
	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indicator', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/indicator/indicator.html',
			controller: 'IndicatorCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '=',
				selected: '='
			},
			bindToController: true,
			replace:true,
			//require: 'item',
			link: function( scope, element, attrs, itemModel ){
				//
				/*scope.$watch(
					function () {
						return itemModel.$modelValue;
					},
					function (n, o) {
						console.log(n);
					});*/
			}
		};

	});

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndicatorCtrl', ["$scope", "DataService", "ContentService", "DialogService", "$filter", "toastr", "VectorlayerService", function ($scope, DataService, ContentService, DialogService, $filter, toastr, VectorlayerService) {
		//
		var vm = this;

		vm.original = angular.copy(vm.item);

		vm.checkBase = checkBase;
		vm.checkFull = checkFull;

		vm.categories = [];
		vm.dataproviders = [];
		vm.selectedItem = null;
		vm.searchText = null;
		vm.searchUnit = null;
		vm.querySearch = querySearch;
		vm.queryUnit = queryUnit;

		vm.save = save;

		vm.createProvider = createProvider;
		vm.createUnit = createUnit;

		activate();

		function activate() {
			loadAll();
		}

		function querySearch(query) {
			return $filter('findbyname')(vm.dataproviders, query, 'title');
		}
		function queryUnit(query) {
			return $filter('findbyname')(vm.measureTypes, query, 'title');
		}

		function loadAll() {
			vm.dataproviders = DataService.getAll('dataproviders').$object;
			vm.categories = ContentService.getCategories({tree:true});
			vm.measureTypes = DataService.getAll('measure_types').$object;
			vm.styles = DataService.getAll('styles').$object;
		}

		function checkBase(){
			if (vm.item.title && vm.item.type && vm.item.dataprovider && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function checkFull(){
			if(typeof vm.item.categories == "undefined") return false;
			return checkBase() && vm.item.categories.length ? true : false;
		}
		function save(){
			vm.item.save().then(function(response){
				if(response){
					toastr.success('Data successfully updated!', 'Successfully saved');
					vm.item.isDirty = false;
					vm.original = angular.copy(vm.item);
				}
			});
		}

		//TODO: ITS A HACK TO GET IT WORK: ng-click vs ng-mousedown
		function createProvider(text){
			DialogService.fromTemplate('addProvider', $scope);
		}
		function createUnit(text){
			DialogService.fromTemplate('addUnit', $scope);
		}

		$scope.$watch('vm.item', function(n, o){
			if(n != o) {
		    vm.item.isDirty = !angular.equals(vm.item, vm.original);
		  }
		},true);
	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indicatorMenu', function() {

		return {
			restrict: 'EA',
			scope: {
				item: '=item'
			},
			replace:true,
			templateUrl: 'views/directives/indicatorMenu/indicatorMenu.html',
			controller: 'IndicatorMenuCtrl',
			controllerAs: 'vm',
			bindToController: true,
			link: function( scope, element, attrs ){
				//
				var cl = 'active';
				var el = element[0];
				var parent = element.parent();
				parent.on('mouseenter', function(e){
					element.addClass(cl);
				}).on('mouseleave', function(e){
					element.removeClass(cl);
				});
				
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndicatorMenuCtrl', function(){
		//
		var vm = this;
		vm.checkBase = checkBase;
		vm.locked = locked;
		vm.changeOfficial = changeOfficial;

		function locked(){
			return vm.item.is_official ? 'lock_open' : 'lock';
		}
		function changeOfficial(){
			vm.item.is_official = !vm.item.is_official;
			vm.item.save();
		}
		function checkBase(item){
			if (item.title && item.measure_type_id && item.dataprovider && item.title.length >= 3) {
				return true;
			}
			return false;
		}
  });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'indicators', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/indicators/indicators.html',
			controller: 'IndicatorsCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=?',
				indicators: '=items',
				selection: '=?',
				options:'=?',
				active: '=?'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndicatorsCtrl', ["DataService", function(DataService){
		//
		var vm = this;
		vm.selectAllGroup = selectAllGroup;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;
		vm.deleteSelected = deleteSelected;

		vm.filter = {
			sort:'title',
			reverse:false,
			list: 0,
			published: false,
			types: {
				title: true,
				style: false,
				categories: false,
				infographic: false,
				description: false,
			}
		};
		vm.search = {
			query: '',
			show: false
		};
		vm.openMenu = openMenu;
		vm.toggleList = toggleList;



		function toggleList(key){
			if(vm.visibleList == key){
				vm.visibleList = '';
			}
			else{
				vm.visibleList = key;
			}
		}

		function selectedItem(item) {
			return vm.selection.indexOf(item) > -1 ? true : false;
		}
		function selectAll(){
			if(vm.selection.length){
				vm.selection = [];
			}
			else{
				angular.forEach(vm.indicators, function(item){
					if(vm.selection.indexOf(item) == -1){
						vm.selection.push(item);
					}
				});
			}
		}

		function toggleSelection(item) {
			var index = vm.selection.indexOf(item);
			if (index > -1) {
				return vm.selection.splice(index, 1);
			} else {
				return vm.selection.push(item);
			}
		}
		function selectAllGroup(group){
			if(vm.selection.length){
					vm.selection = [];
					return false;
			}
			vm.selection = [];
			angular.forEach(group, function(item){
				vm.selection.push(item);
			});

		}
		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}

		function deleteSelected(){
			if(vm.selection.length){
				angular.forEach(vm.selection, function(item){
						DataService.remove('indicators', item.id).then(function(response){
							vm.indicators.splice(vm.indicators.indexOf(item),1);
						})
				})
				vm.selection = [];
			}
		}
		/*$scope.$watch('vm.search.query', function (query, oldQuery) {
			if(query === oldQuery) return false;
			vm.query = vm.filter.types;
			vm.query.q = query;
			vm.items = ContentService.fetchIndicators(vm.query);
		});*/
    }]);

})();

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

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndizesCtrl', ["$scope", "$state", "$filter", "$timeout", "toastr", "DataService", "ContentService", function($scope, $state, $filter, $timeout, toastr, DataService, ContentService){
		//
		var vm = this;
		vm.original = angular.copy(vm.item);
		vm.checkBase = checkBase;
		vm.checkFull = checkFull;
		vm.save = save;

		vm.baseOptions = {
			drag:true,
			allowDrop:true,
			allowDrag:true,
			allowMove:true,
			allowSave:true,
			allowDelete:true,
			allowAddContainer:true,
			allowAdd:true,
			editable:true,
			assigments: true,
			saveClick: save,
			addClick: vm.options.indizes.addClick,
			addContainerClick: vm.options.indizes.addContainerClick,
			deleteDrop: vm.options.indizes.deleteDrop,
			deleteClick: vm.options.indizes.deleteClick
		};
		activate();


		function activate() {
			loadAll();
		}

		function loadAll() {
			vm.categories = ContentService.getCategories({tree:true});
			vm.styles = DataService.getAll('styles').$object;
			vm.types = DataService.getAll('index/types').$object;

			if(typeof vm.item.id == "undefined"){
				vm.item.item_type_id = 1;
				vm.item.children = [];
			}
		}
		function checkBase(){
			if (vm.item.title && vm.item.item_type_id && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function checkFull(){
			if(typeof vm.item.categories == "undefined") return false;
			return checkBase() && vm.item.categories.length ? true : false;
		}
		function save(){
			if(vm.item.id){
				vm.item.save().then(function(response){
					if(response){
						toastr.success('Data successfully updated!', 'Successfully saved');
						vm.item.isDirty = false;
						vm.original = angular.copy(vm.item);
						ContentService.updateItem(response);
						$state.go('app.index.editor.indizes.data',{id:vm.item.id,name:response.name})
					}
				});
			}
			else{
				DataService.post('index', vm.item).then(function(response){
					if(response){
						toastr.success('Data successfully saved!', 'Successfully saved');
						vm.item.isDirty = false;
						vm.original = angular.copy(vm.item);
						ContentService.addItem(response);
						$state.go('app.index.editor.indizes.data',{id:response.id, name:response.name})
					}
				});
			}

		}

		function removeItems(event, item){
		//	console.log(vm.item, item);

		}
		$scope.$watch('vm.item', function(n, o){
			if(n != o) {
				vm.item.isDirty = !angular.equals(vm.item, vm.original);
			}
		},true);
    }]);

})();

(function() {
	"use strict";

	angular.module('app.directives').directive('median', ["$timeout", function($timeout) {
		var defaults = function() {
			return {
				id: 'gradient',
				width: 300,
				height: 40,
				info: true,
				field: 'score',
				handling: true,
				margin: {
					left: 20,
					right: 20,
					top: 10,
					bottom: 10
				},
				colors: [{
					position: 0,
					color: 'rgba(102,102,102,1)',
					opacity: 1
				}, {
					position: 53,
					color: 'rgba(128, 243, 198,1)',
					opacity: 1
				}, {
					position: 100,
					color: 'rgba(255,255,255,1)',
					opacity: 0
				}]
			};
		}
		return {
			restrict: 'E',
			scope: {
				data: '=',
				options: '='
			},
			require: 'ngModel',
			link: function($scope, element, $attrs, ngModel) {

				var options = angular.extend(defaults(), $attrs);
				var max = 0,
					min = 0;
				options = angular.extend(options, $scope.options);

				options.unique = new Date().getTime();
				if (options.color) {
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');


				angular.forEach($scope.data, function(nat, key) {
					max = d3.max([max, parseInt(nat[options.field])]);
					min = d3.min([min, parseInt(nat[options.field])]);
				});

				var x = d3.scale.linear()
					.domain([min, max])
					.range([options.margin.left, options.width - options.margin.left])
					.clamp(true);

				var brush = d3.svg.brush()
					.x(x)
					.extent([0, 0])
					.on("brush", brush)
					.on("brushend", brushed);

				var svg = d3.select(element[0]).append("svg")
					.attr("width", options.width)
					.attr("height", options.height)
					.append("g");
				//.attr("transform", "translate(0," + options.margin.top / 2 + ")");


				var effects = svg.append('svg:defs')
				var gradient = effects.append("svg:linearGradient")
					.attr('id', options.field + options.unique)
					.attr('x1', '0%')
					.attr('y1', '0%')
					.attr('x2', '100%')
					.attr('y2', '0%')
					.attr('spreadMethod', 'pad');

				angular.forEach(options.colors, function(color) {
					gradient.append('svg:stop')
						.attr('offset', color.position + '%')
						.attr('stop-color', color.color)
						.attr('stop-opacity', color.opacity);
				});

				var shadow = effects.append("filter")
					.attr("id", "drop-shadow")
					.attr("height", "150%");
				var shadowIntensity = shadow.append("feGaussianBlur")
					.attr("in", "SourceAlpha")
					.attr("stdDeviation", 1)
					.attr("result", "blur");
				var shadowPos = shadow.append("feOffset")
					.attr("in", "blur")
					.attr("dx", 0)
					.attr("dy", 0)
					.attr("result", "offsetBlur");

				var feMerge = shadow.append("feMerge");
				feMerge.append("feMergeNode")
					.attr("in", "offsetBlur")
				feMerge.append("feMergeNode")
					.attr("in", "SourceGraphic");

				var bckgrnd = svg.append('g');
				var rect = bckgrnd.append('path')
					.attr('d', rounded_rect(0, 0, options.width, options.height, options.height / 2, true, true, true, true))
					.attr('width', options.width)
					.attr('height', options.height)
					.style('fill', 'url(#' + (options.field + options.unique) + ')');
				var legend = svg.append('g').attr('transform', 'translate(' + options.height / 2 + ', ' + options.height / 2 + ')')
					.attr('class', 'startLabel')

				if (options.info === true) {

					legend.append('circle')
						.attr('r', options.height / 2);
					legend.append('text')
						.text(min)
						.style('font-size', options.height / 2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'lowerValue');
					var legend2 = svg.append('g').attr('transform', 'translate(' + (options.width - (options.height / 2)) + ', ' + options.height / 2 + ')')
						.attr('class', 'endLabel')
					legend2.append('circle')
						.attr('r', options.height / 2)
					legend2.append('text')
						.text(function() {
							//TDODO: CHckick if no comma there
							if (max > 1000) {
								var v = (parseInt(max) / 1000).toString();
								return v.substr(0, v.indexOf('.')) + "k";
							}
							return max
						})
						.style('font-size', options.height / 2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'upperValue');
				}
				var slider = svg.append("g")
					.attr("class", "slider");
				if (options.handling == true) {
					slider.call(brush);
				}

				slider.select(".background")
					.attr("height", options.height);

				if (options.info === true) {
					slider.append('line')
						.attr('x1', options.width / 2)
						.attr('y1', 0)
						.attr('x2', options.width / 2)
						.attr('y2', options.height)
						.attr('stroke-dasharray', '3,3')
						.attr('stroke-width', 1)
						.attr('stroke', 'rgba(0,0,0,87)');
				}
				var handleCont = slider.append('g')
					.attr("transform", "translate(0," + options.height / 2 + ")")
					.on('mouseover', function(){
							shadowIntensity.transition().duration(200).attr('stdDeviation', 2);

					})
					.on('mouseout', function(){
						shadowIntensity.transition().duration(200).attr('stdDeviation', 1);

					});
				var handle = handleCont.append("circle")
					.attr("class", "handle")
					.style("filter", "url(#drop-shadow)")
					.attr("r", ((options.height / 2) + options.height / 10));
				if (options.color) {
					handle.style('fill', '#fff' /*options.color*/ );
				}
				var handleLabel = handleCont.append('text')
					.text(0)
					.style('font-size', options.height / 2.5)
					.attr("text-anchor", "middle").attr('y', '0.35em');

				//slider
				//.call(brush.extent([0, 0]))
				//.call(brush.event);
				function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
					var retval;
					retval = "M" + (x + r) + "," + y;
					retval += "h" + (w - 2 * r);
					if (tr) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
					} else {
						retval += "h" + r;
						retval += "v" + r;
					}
					retval += "v" + (h - 2 * r);
					if (br) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
					} else {
						retval += "v" + r;
						retval += "h" + -r;
					}
					retval += "h" + (2 * r - w);
					if (bl) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
					} else {
						retval += "h" + -r;
						retval += "v" + -r;
					}
					retval += "v" + (2 * r - h);
					if (tl) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
					} else {
						retval += "v" + -r;
						retval += "h" + r;
					}
					retval += "z";
					return retval;
				}

				function labeling(value) {
					if (parseInt(value) > 1000) {
						var v = (parseInt(value) / 1000).toString();
						return v.substr(0, v.indexOf('.')) + "k";
					} else {
						return parseInt(value);
					}
				}

				function brush() {
					var value = brush.extent()[0];

					if (d3.event.sourceEvent) {
						value = x.invert(d3.mouse(this)[0]);
						brush.extent([value, value]);
					}
					handleLabel.text(labeling(value));
					handleCont.attr("transform", 'translate(' + x(value) + ',' + options.height / 2 + ')');
				}

				function brushed() {
					var count = 0;
				 	var found = false;
				 	var final = "";
					var value = brush.extent()[0];
					angular.forEach($scope.data, function(nat, key) {
						if (parseInt(nat[options.field]) == parseInt(value)) {
							final = nat;
							found = true;
						}
					});

					//
					// if(!final){
					// 	do {
					// 		angular.forEach($scope.data, function (nat, key) {
					// 			if (parseInt(nat[options.field]) == parseInt(value)) {
					// 				final = nat;
					// 				found = true;
					// 			}
					// 		});
					// 		count++;
					// 		value = value > (max / 2) ? value - 1 : value + 1;
					// 	} while (!found && count < max);
					// }


					if(final){
						ngModel.$setViewValue(final);
						ngModel.$render();
					}

				}


				$scope.$watch('options', function(n, o) {
					if (n === o) {
						return;
					}
					options.colors[1].color = n.color;
					gradient = svg.append('svg:defs')
						.append("svg:linearGradient")
						.attr('id', options.field + "_" + n.color)
						.attr('x1', '0%')
						.attr('y1', '0%')
						.attr('x2', '100%')
						.attr('y2', '0%')
						.attr('spreadMethod', 'pad')
					angular.forEach(options.colors, function(color) {
						gradient.append('svg:stop')
							.attr('offset', color.position + '%')
							.attr('stop-color', color.color)
							.attr('stop-opacity', color.opacity);
					});
					rect.style('fill', 'url(#' + options.field + '_' + n.color + ')');
					handle.style('fill', n.color);
					if (ngModel.$modelValue) {
						handleLabel.text(labeling(ngModel.$modelValue[n.field]));
						handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue[n.field]) + ',' + options.height / 2 + ')');
					} else {
						handleLabel.text(0);
					}
				});
				$scope.$watch(
					function() {
						return ngModel.$modelValue;
					},
					function(newValue, oldValue) {
						if (!newValue) {
							handleLabel.text(parseInt(0));
							handleCont.attr("transform", 'translate(' + x(0) + ',' + options.height / 2 + ')');
							return;
						}

							handleLabel.text(labeling(newValue[options.field]));
							if (newValue == oldValue) {
								handleCont.attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');
							} else {
								handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');

							}


					});
				$scope.$watch('data', function(n, o) {
					if (n === o) return false;
					//	console.log(n);
					min = 0;
					max = 0;
					angular.forEach($scope.data, function(nat, key) {
						max = d3.max([max, parseInt(nat[options.field])]);
						min = d3.min([min, parseInt(nat[options.field])]);
						if (nat.iso == ngModel.$modelValue.iso) {
							handleLabel.text(labeling(nat[options.field]));
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat[options.field]) + ',' + options.height / 2 + ')');

						}
					});

					x = d3.scale.linear()
						.domain([min, max])
						.range([options.margin.left, options.width - options.margin.left])
						.clamp(true);
					brush.x(x)
						.extent([0, 0])
						.on("brush", brush)
						.on("brushend", brushed);
					legend.select('#lowerValue').text(min);
					legend2.select('#upperValue').text(function() {
						//TDODO: CHckick if no comma there
						if (max > 1000) {
							var v = (parseInt(max) / 1000).toString();
							return v.substr(0, v.indexOf('.')) + "k";
						}
						return max
					});
					angular.forEach($scope.data, function(nat, key) {
						if (nat.iso == ngModel.$modelValue.iso) {
							handleLabel.text(labeling(nat[options.field]));
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat[options.field]) + ',' + options.height / 2 + ')');
						}
					});

				});
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'MedianCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'parseConflictCsv', ["$state", "$timeout", "toastr", function($state, $timeout, toastr) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parseConflictCsv/parseConflictCsv.html',
			controller: 'ParseConflictCsvCtrl',
			scope: {
				nations: '=',
				sum: '='
			},
			link: function( scope, element, attrs ){
				//
				var errors = 0;
				var stepped = 0,
					rowCount = 0,
					errorCount = 0,
					firstError;
				var start, end;
				var firstRun = true;
				var maxUnparseLength = 10000;
				var button = element.find('button');
				var input = element.find('input');
				var isVertical = false;
				var raw = [];
				var rawList = {};
				input.css({
					display: 'none'
				});
				button.bind('click', function () {
					input[0].click();
				});
				input.bind('change', function (e) {
					isVertical = false;
					raw = [];
					rawList = {};

					errors = [];
					stepped = 0, rowCount = 0, errorCount = 0, firstError;
					start, end;
					firstRun = true;
					scope.nations = [];
					$timeout(function () {

						var size = input[0].files[0].size;
						var csv = Papa.parse(input[0].files[0], {
							skipEmptyLines: true,
							header: true,
							dynamicTyping: true,
							fastMode: true,
							step: function (row) {
								var numbers = row.data[0].conflicts.match(/[0-9]+/g).map(function(n)
								{//just coerce to numbers
								    return +(n);
								});
								row.data[0].events = numbers;
								scope.sum += numbers.length;
								scope.nations.push(row.data[0]);

							},
							complete:function(){
								scope.$apply();
							}
						});

					});

				});
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ParseConflictCsvCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'parseConflictEventsCsv', ["$state", "$timeout", "toastr", function($state, $timeout, toastr) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parseConflictEventsCsv/parseConflictEventsCsv.html',
			controller: 'ParseConflictEventsCsvCtrl',
			scope: {
				events: '=',
			},
			link: function( scope, element, attrs ){
				//
				var errors = 0;
				var stepped = 0,
					rowCount = 0,
					errorCount = 0,
					firstError;
				var start, end;
				var firstRun = true;
				var maxUnparseLength = 10000;
				var button = element.find('button');
				var input = element.find('input');
				var isVertical = false;
				var raw = [];
				var rawList = {};
				input.css({
					display: 'none'
				});
				button.bind('click', function () {
					input[0].click();
				});
				input.bind('change', function (e) {
					isVertical = false;
					raw = [];
					rawList = {};
	scope.events = [];
					errors = [];
					stepped = 0, rowCount = 0, errorCount = 0, firstError;
					start, end;
					firstRun = true;
					$timeout(function () {

						var size = input[0].files[0].size;
						var csv = Papa.parse(input[0].files[0], {
							skipEmptyLines: true,
							header: true,
							dynamicTyping: true,
							fastMode: true,
							step: function (row) {
								switch (row.data[0].type) {
									case 'interstate':
										row.data[0].type_id = 1;
										break;
									case 'intrastate':
										row.data[0].type_id = 2;
										break;
									case 'substate':
										row.data[0].type_id = 3;
										break;
									default:

								}
								if(row.errors.length == 0){
									scope.events.push(row.data[0]);
								}
								else{
									console.log(row);
								}
							},
							complete:function(){
								scope.$apply();
							}
						});

					});

				});
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ParseConflictEventsCsvCtrl', function(){
		//
    });

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('parsecsv', ["$state", "$timeout", "toastr", "IndexService", function ($state, $timeout, toastr, IndexService) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parsecsv/parsecsv.html',
			controller: 'ParsecsvCtrl',
			replace: true,
			link: function ($scope, element, $attrs) {
				//
				var errors = 0;
				var stepped = 0,
					rowCount = 0,
					errorCount = 0,
					firstError;
				var start, end;
				var firstRun = true;
				var maxUnparseLength = 10000;
				var button = element.find('button');
				var input = element.find('input');
				var isVertical = false;
				var raw = [];
				var rawList = {};
				input.css({
					display: 'none'
				});
				button.bind('click', function () {
					input[0].click();
				});
				input.bind('change', function (e) {
					isVertical = false;
					raw = [];
					rawList = {};

					errors = [];
					stepped = 0, rowCount = 0, errorCount = 0, firstError;
					start, end;
					firstRun = true;
					$timeout(function () {
						IndexService.clear();
						//console.log(Papa);
						var size = input[0].files[0].size;
						var csv = Papa.parse(input[0].files[0], {
							skipEmptyLines: true,
							header: true,
							dynamicTyping: true,
							fastMode: true,
							worker: false,
							//IF "step" instead of "chunk" > chunk = row and chunk.data = row.data[0]
							chunk: function (chunk) {
								angular.forEach(chunk.data, function (row, index) {

									var r = {
										data:{},
										errors:[]
									};
									angular.forEach(row, function (item, key) {
										if (isNaN(item) || item < 0) {
											if (item.toString().toUpperCase() == "#NA" /*|| item < 0*/ || item.toString().toUpperCase().indexOf('N/A') > -1) {
												var error = {
													type: "1",
													message: "Field in row is not valid for database use!",
													column: key,
													value: item
												};
												r.errors.push(error);
												errors.push(error);
											}
										}
									});
									if (isVertical) {
										angular.forEach(row, function (item, key) {
											if (key.length == 3) {
												if (typeof rawList[key].data == "undefined") {
													rawList[key].data = [];
												}
												rawList[key].data.push(item);
											}
										});
										//rawList[key].errors = row.errors;
									} else {
										//IF "step" instead of "chunk": r > row.data = row.data[0]
										r.data = row;

										IndexService.addData(r);
									}

								})

							},
							beforeFirstChunk: function (chunk) {

								//Check if there are points in the headers
								var index = chunk.match(/\r\n|\r|\n/).index;
								var delimiter = ',';
								var headings = chunk.substr(0, index).split(',');

								if (headings.length < 2) {
									headings = chunk.substr(0, index).split("\t");
									delimiter = '\t';
								}
								var isIso = [];

								for (var i = 0; i <= headings.length; i++) {
									if (headings[i]) {

										headings[i] = headings[i].replace(/[^a-z0-9]/gi, '_').toLowerCase();
										if (headings[i].indexOf('.') > -1) {
											headings[i] = headings[i].substr(0, headings[i].indexOf('.'));

										}
										var head = headings[i].split('_');
										if (head.length > 1) {
											headings[i] = '';
											for (var j = 0; j < head.length; j++) {
												if (isNaN(head[j])) {
													if (j > 0) {
														headings[i] += '_';
													}
													headings[i] += head[j];
												}
											}
										}

										if (headings[i].length == 3) {
											isIso.push(true);
										}
									}
								}
								if (headings.length == isIso.length) {
									isVertical = true;
									for (var i = 0; i <= headings.length; i++) {
										if (typeof rawList[headings[i]] == "undefined") {
											rawList[headings[i]] = {};
										}
										rawList[headings[i]].data = [];
									}
								}

								return headings.join(delimiter) + chunk.substr(index);
							},
							error: function (err, file) {
								ToastService.error(err);
							},
							complete: function (results) {

								IndexService.setErrors(errors);

								//See if there is an field name "iso" in the headings;
								if (!isVertical) {
									angular.forEach(IndexService.getFirstEntry().data, function (item, key) {

										if (key.toLowerCase().indexOf('iso') != -1 || key.toLowerCase().indexOf('code') != -1) {
											IndexService.setIsoField(key);
										}
										if (key.toLowerCase().indexOf('country') != -1) {
											IndexService.setCountryField(key);
										}
										if (key.toLowerCase().indexOf('year') != -1 && item.toString().length == 4) {
											IndexService.setYearField(key);
										}
										if (key.toLowerCase().indexOf('gender') != -1 || key.toLowerCase().indexOf('sex') != -1) {
											IndexService.setGenderField(key);
										}
									});
								} else {
									angular.forEach(rawList, function (item, key) {
										item.errors = [];
										if (item.toLowerCase() != "undefined" && typeof key != "undefined") {
											var r = {
												iso: key.toUpperCase()
											};
											angular.forEach(item.data, function (column, i) {
												r['column_' + i] = column;
												if (isNaN(column) || column < 0) {
													if (column.toString().toUpperCase() == "NA" || column < 0 || column.toString().toUpperCase().indexOf('N/A') > -1) {
														item.errors.push({
															type: "1",
															message: "Field in row is not valid for database use!",
															column: item
														})
														errors++;
													}
												}
											});

											IndexService.addData({
												data: [r],
												errors: item.errors
											});
										}
									});
									IndexService.setIsoField('iso');
								}
								IndexService.setToLocalStorage();
								
								$timeout(function(){
									toastr.info(IndexService.getDataSize() + ' lines importet!', 'Information');
									$state.go('app.index.check');
								});

							}
						});

					});

				});
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'ParsecsvCtrl', function(){
		//

    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'piechart', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/piechart/piechart.html',
			controller: 'PiechartCtrl',
			scope:{
				data: '=chartData',
				activeType: '=',
				activeConflict: '=',
				clickIt:'&'
			},
			link: function( scope, element, attrs ){
				//
				 function segColor(c){ return {interstate:"#807dba", intrastate:"#e08214",substate:"#41ab5d"}[c]; }

				var pC ={}, pieDim ={w:150, h: 150};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

				var piesvg = d3.select(element[0]).append("svg")
            .attr("width", pieDim.w)
						.attr("height", pieDim.h)
						.attr('class', 'outer-pie')
						.append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
				var piesvg2 = d3.select(element[0]).append("svg")
            .attr("width", pieDim.w)
						.attr("height", pieDim.h)
						.attr('class', 'inner-pie')
						.append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg
					.arc()
					.outerRadius(pieDim.r - 10)
					.innerRadius(pieDim.r - 23);
        var arc2 = d3.svg
					.arc()
					.outerRadius(pieDim.r - 23)
					.innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout
					.pie()
					.sort(null)
					.value(function(d) { return d.count; });

        // Draw the pie slices.
        var c1 = piesvg
						.datum(scope.data)
						.selectAll("path")
						.data(pie)
						.enter()
						.append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return d.data.color; })
            .on("mouseover",mouseover).on("mouseout",mouseout);
				var c2 = piesvg2
						.datum(scope.data)
						.selectAll("path")
						.data(pie)
						.enter()
						.append("path")
						.attr("d", arc2)
		        .each(function(d) { this._current = d; })
		        .style("fill", function(d) { return d.data.color; })
						.style('cursor', 'pointer')
		        .on('click', mouseclick);
        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
				var typeus = angular.copy(scope.activeType);
				function mouseclick(d){
					scope.clickIt({type_id:d.data.type_id});
				}
        function mouseover(d){
            // call the update function of histogram with new data.
						typeus = angular.copy(scope.activeType);
            scope.activeType = [d.data.type_id];
						scope.$apply();
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            scope.activeType = typeus;
						scope.$apply();
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
				function arcTween2(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc2(i(t));    };
        }

				scope.$watch('data', function(n, o){
					if(n === o) return false;
					piesvg.selectAll("path").data(pie(n)).transition().duration(500)
							.attrTween("d", arcTween);
					piesvg2.selectAll("path").data(pie(n)).transition().duration(500)
							.attrTween("d", arcTween2);
				})
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'PiechartCtrl', function(){
		//
    });

})();

(function() {
	"use strict";

	angular.module('app.directives').directive('roundbar', function() {

		return {
			restrict: 'EA',
			//templateUrl: 'views/directives/roundbar/roundbar.html',
			controller: 'RoundbarCtrl',
			scope: {
				data: '=chartData',
				activeType: '=',
				activeConflict: '='
			},
			link: function(scope, element, attrs) {

				var margin = {
						top: 40,
						right: 20,
						bottom: 30,
						left: 40
					},
					width = 300 - margin.left - margin.right,
					height = 200 - margin.top - margin.bottom,
					barWidth = 20,
					space = 25;


				var scale = {
					y: d3.scale.linear()
				};
				scale.y.domain([0, 220]);
				scale.y.range([height, 0]);
				var svg = d3.select(element[0]).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(0," + margin.top + ")");

				//x.domain(scope.data.map(function(d) { return d.letter; }));
				//y.domain([0, d3.max(scope.data, function(d) { return d.frequency; })]);
				var bars = svg.selectAll('.bars').data(scope.data).enter().append("g").attr('class', 'bars'); //.attr("transform", function(d, i) { return "translate(" + i * 20 + ", 0)"; });;

				var barsBg = bars
					.append('path')
					.attr('d', function(d, i) {
						return rounded_rect((i * (barWidth + space)), 0, barWidth, (height), barWidth / 2, true, true, false, false)
					})
					.attr('class', 'bg');
				var valueBars = bars
					.append('path')
					.attr('d', function(d, i) {
						return rounded_rect((i * (barWidth + space)), (scale.y(d.value)), barWidth, (height - scale.y(d.value)), barWidth / 2, true, true, false, false)
					})
					/*.attr('x', function(d, i) {
						return i * (barWidth + space);
					})
					.attr('y', function(d) {
						return scale.y(d.value);
					})
					.attr("width", function(d) {
						return barWidth
					})*/

				.style("fill", function(d) {
						return d.color
					})
					/*.transition()
					.duration(3000)
					.ease("quad")
					.attr("height", function(d) {
						return height - scale.y(d.value)
					})*/
				;

				var valueText = bars
					.append("text");

				valueText.text(function(d) {
						return d.value
					}).attr("x", function(d, i) {
						return i * (barWidth + space);
					})
					.attr("y", -8)
					.attr("width", function(d) {
						return barWidth
					})
					.style('fill','#4fb0e5');

				var labelsText = bars
					.append("text")
				labelsText.text(function(d){
						return d.label
					})
					.attr("x", function(d, i) {
						return i * (barWidth + space);
					})
					.attr("y", height + 20)
					.attr("width", function(d) {
						return barWidth
					})
					.style('fill', function(d){
						return d.color
					});


				function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
					var retval;
					retval = "M" + (x + r) + "," + y;
					retval += "h" + (w - 2 * r);
					if (tr) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
					} else {
						retval += "h" + r;
						retval += "v" + r;
					}
					retval += "v" + (h - 2 * r);
					if (br) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
					} else {
						retval += "v" + r;
						retval += "h" + -r;
					}
					retval += "h" + (2 * r - w);
					if (bl) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
					} else {
						retval += "h" + -r;
						retval += "v" + -r;
					}
					retval += "v" + (2 * r - h);
					if (tl) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
					} else {
						retval += "v" + -r;
						retval += "h" + r;
					}
					retval += "z";
					return retval;
				}
				scope.$watch('data', function(n, o){
					if(n === o) return false;
					//scale.y.domain([0, 50]);

						valueBars.transition().duration(500).attr('d', function(d, i) {
								var borders = barWidth / 2;
								if(scope.data[i].value <= 10){
									borders = 0;
								}
								return rounded_rect((i * (barWidth + space)), (scale.y(scope.data[i].value)), barWidth, (height - scale.y(scope.data[i].value)), borders, true, true, false, false)
						});
						valueText.transition().duration(500).tween('text', function (d,i) {
								var i = d3.interpolate(parseInt(d.value), parseInt(scope.data[i].value));
								return function (t) {
									this.textContent = (Math.round(i(t) * 1) / 1);
								};

						}).each('end', function(d, i){
								d.value = scope.data[i].value;
						});


				})
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'RoundbarCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'simplelinechart', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/simplelinechart/simplelinechart.html',
			controller: 'SimplelinechartCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				data:'=',
				selection:'=',
				options:'='
			},
			link: function( $scope, element, $attrs ){


			}
		};

	});

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('SimplelinechartCtrl', ["$scope", function ($scope) {
		var vm = this;
		var defaults = function(){
			return {
				invert:false
			}
		}
		vm.options = angular.extend(defaults(), vm.options);
		vm.config = {
			visible: true, // default: true
			extended: false, // default: false
			disabled: false, // default: false
			autorefresh: true, // default: true
			refreshDataOnly: false, // default: false
			deepWatchOptions: true, // default: true
			deepWatchData: true, // default: false
			deepWatchConfig: true, // default: true
			debounce: 10 // default: 10
		};
		vm.chart = {
			options: {
				chart: {}
			},
			data: []
		};

		activate();

		function activate(){
			calculateGraph();
			setChart();
		}
		function updateChart(){
			vm.chart.options.chart.forceY = [vm.range.max, vm.range.min];
		}
	 	function setChart() {
			vm.chart.options.chart = {
				type: 'lineChart',
				legendPosition: 'left',
				duration:0,
				margin: {
					top: 20,
					right: 20,
					bottom: 20,
					left: 20
				},
				x: function (d) {
					return d.x;
				},
				y: function (d) {
					return d.y;
				},
				showLegend: false,
				showValues: false,
				//showYAxis: false,

				transitionDuration: 500,
				//useInteractiveGuideline: true,
				forceY: [vm.range.max, vm.range.min],
				//yDomain:[parseInt(vm.range.min), vm.range.max],
				xAxis: {
					axisLabel: 'Year',
					axisLabelDistance: 30
				},
				yAxis: {
					axisLabel: '',
					axisLabelDistance: 30
				},
				legend: {
					rightAlign: false
				},
				lines: {
					interpolate: 'cardinal'
				}

			};

			if (vm.options.invert == true) {
				vm.chart.options.chart.forceY = [parseInt(vm.range.max), vm.range.min];
			}

			return vm.chart;
		}
		function calculateGraph() {
			var chartData = [];
			vm.range = {
				max: 0,
				min: 1000
			};

			angular.forEach(vm.selection, function (item, key) {
				var graph = {
					id: key,
					key: item.title,
					color: item.color,
					values: []
				};
				angular.forEach(vm.data, function (data, k) {
					graph.values.push({
						id: k,
						x: data[item.fields.x],
						y: data[item.fields.y]
					});
					vm.range.max = Math.max(vm.range.max, data[item.fields.y]);
					vm.range.min = Math.min(vm.range.min, data[item.fields.y]);
				});
				chartData.push(graph);
			});
			vm.range.max++;
			vm.range.min--;
			vm.chart.data = chartData;
			if (vm.options.invert == "true") {
				vm.chart.options.chart.yDomain = [parseInt(vm.range.max), vm.range.min];
			}
			return chartData;
		};
		$scope.$watch('vm.data', function (n, o) {
			if (!n) {
				return;
			}

				calculateGraph();
				updateChart();


		});
		$scope.$watch('vm.selection', function (n, o) {
			if (n === o) {
				return;
			}
		//	updateChart();
			//calculateGraph();
		})
	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').animation('.slide-toggles', ['$animateCss', function($animateCss) {

		var lastId = 0;
        var _cache = {};

        function getId(el) {
            var id = el[0].getAttribute("data-slide-toggle");
            if (!id) {
                id = ++lastId;
                el[0].setAttribute("data-slide-toggle", id);
            }
            return id;
        }
        function getState(id) {
            var state = _cache[id];
            if (!state) {
                state = {};
                _cache[id] = state;
            }
            return state;
        }

        function generateRunner(closing, state, animator, element, doneFn) {
            return function() {
                state.animating = true;
                state.animator = animator;
                state.doneFn = doneFn;
                animator.start().finally(function() {
                    if (closing && state.doneFn === doneFn) {
                        element[0].style.height = '';
                    }
                    state.animating = false;
                    state.animator = undefined;
                    state.doneFn();
                });
            }
        }

        return {
            leave: function(element, doneFn) {

                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ?
                        state.height : element[0].offsetHeight;
                    var animator = $animateCss(element, {
                        from: {height: height + 'px', opacity: 1},
                        to: {height: '0px', opacity: 0}
                    });
                    if (animator) {
                        if (state.animating) {
                            state.doneFn =
                              generateRunner(true,
                                             state,
                                             animator,
                                             element,
                                             doneFn);
                            return state.animator.end();
                        }
                        else {
                            state.height = height;
                            return generateRunner(true,
                                                  state,
                                                  animator,
                                                  element,
                                                  doneFn)();
                        }
                    }

                doneFn();
            },
            enter: function(element, doneFn) {

                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ?
                        state.height : element[0].offsetHeight;

                    var animator = $animateCss(element, {
                        from: {height: '0px', opacity: 0},
                        to: {height: height + 'px', opacity: 1}
                    });
                    if (animator) {
                        if (state.animating) {
                            state.doneFn = generateRunner(false,
                                                          state,
                                                          animator,
                                                          element,
                                                          doneFn);
                            return state.animator.end();
                        }
                        else {
                            state.height = height;
                            return generateRunner(false,
                                                  state,
                                                  animator,
                                                  element,
                                                  doneFn)();
                        }
                    }

                doneFn();
            }
        };
    }]);
})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'SlideToggleCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'styles', function() {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/styles/styles.html',
			controller: 'StylesCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				item: '=',
				styles: '=',
				options:'=',
				save: '&'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('StylesCtrl', ["toastr", "DataService", function (toastr, DataService) {
		//
		var vm = this;
		vm.toggleStyle = toggleStyle;
		vm.selectedStyle = selectedStyle;
		vm.saveStyle = saveStyle;
		vm.style = [];

		function toggleStyle(style) {
			if (vm.item.style_id == style.id) {
				vm.item.style_id = 0;
			} else {
				vm.item.style_id = style.id
				vm.item.style = style;
			}
		}
		function selectedStyle(item, style) {
			return vm.item.style_id == style.id ? true : false;
		}
		function saveStyle() {
			DataService.post('styles', vm.style).then(function (data) {
				vm.styles.push(data);
				vm.createStyle = false;
					vm.style = [];
				vm.item.style = data;
				toastr.success('New Style has been saved', 'Success');
			});
		}
	}]);

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('subindex', subindex);

	subindex.$inject = ['$timeout', 'smoothScroll'];

	function subindex($timeout, smoothScroll) {
		return {
			restrict: 'E',
			replace: true,
			controller: 'SubindexCtrl',
			templateUrl: 'views/directives/subindex/subindex.html',
			link: subindexLinkFunction
		};

		function subindexLinkFunction($scope, element, $attrs) {
		}
	}
})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('SubindexCtrl', ["$scope", "$filter", "$timeout", function($scope, $filter, $timeout) {
		$scope.info = false;
		$scope.setChart = setChart;
		$scope.calculateGraph = calculateGraph;
		$scope.createIndexer = createIndexer;
		$scope.calcSubRank = calcSubRank;
		$scope.toggleInfo = toggleInfo;
		$scope.createOptions = createOptions;
		$scope.getSubRank = getSubRank;
		activate();

		function activate() {
			$scope.calcSubRank();
			$scope.setChart();
			$scope.calculateGraph();
			$scope.createIndexer();
			$scope.createOptions();
			$scope.$watch('display.selectedCat', function(newItem, oldItem) {
				if (newItem === oldItem) {
					return false;
				}
				$scope.createIndexer();
				$scope.calculateGraph();
				$scope.createOptions();
				$scope.calcSubRank();
			});
			$scope.$watch('current', function(n, o) {
				if (n === o) {
					return;
				}
				$scope.calcSubRank();
			});
		}

		function toggleInfo() {
			$scope.info = !$scope.info;
		};

		function calcSubRank() {
			var rank = 0;
			angular.forEach($scope.data, function(item) {
				item[$scope.display.selectedCat.type] = parseFloat(item[$scope.display.selectedCat.type]);
				item['score'] = parseInt(item['score']);
			})
			var filter = $filter('orderBy')($scope.epi, [$scope.display.selectedCat.type, "score"], true);
			for (var i = 0; i < filter.length; i++) {
				if (filter[i].iso == $scope.current.iso) {
					rank = i + 1;
				}
			}
			$scope.current[$scope.display.selectedCat.type+'_rank'] = rank;
		}
		function getSubRank(country){
			var filter = $filter('orderBy')($scope.epi, [$scope.display.selectedCat.type, "score"], true);
			var rank = 0;
			angular.forEach(filter, function(item, key){
				if(item.country == country.country){
					rank = key;
				}
			});
			return rank+1;
		}
		function createIndexer() {
			$scope.indexer = [$scope.$parent.display.selectedCat.data];
		}

		function createOptions() {
			$scope.medianOptions = {
				color: $scope.$parent.display.selectedCat.color,
				field: $scope.$parent.display.selectedCat.type,
				handling: false,
				margin:{
					left:10
				}
			};
			$scope.medianOptionsBig = {
				color: $scope.$parent.display.selectedCat.color,
				field: $scope.$parent.display.selectedCat.type,
				handling: false,
				margin:{
					left:20
				}
			};
		}

		function setChart() {
			$scope.chart = {
				options: {
					chart: {
						type: 'lineChart',
						//height: 200,
						legendPosition: 'left',
						margin: {
							top: 20,
							right: 20,
							bottom: 20,
							left: 20
						},
						x: function(d) {
							return d.x;
						},
						y: function(d) {
							return d.y;
						},
						showValues: false,
						showYAxis: false,
						transitionDuration: 500,
						useInteractiveGuideline: true,
						forceY: [100, 0],
						xAxis: {
							axisLabel: ''
						},
						yAxis: {
							axisLabel: '',
							axisLabelDistance: 30
						},
						legend: {
							rightAlign: false,
							margin: {
								bottom: 30
							}
						},
						lines: {
							interpolate: 'cardinal'
						}
					}
				},
				data: []
			};
			return $scope.chart;
		}

		function calculateGraph() {
			var chartData = [];
			angular.forEach($scope.display.selectedCat.children, function(item, key) {
				var graph = {
					key: item.title,
					color: item.color,
					values: []
				};
				angular.forEach($scope.country.epi, function(data) {
					graph.values.push({
						x: data.year,
						y: data[item.column_name]
					});
				});
				chartData.push(graph);
			});
			$scope.chart.data = chartData;
		}
	}]);

})();

(function () {
	"use strict";

	angular.module('app.directives').directive('sunburst', function () {
		var defaults = function(){
				return {
					 mode: 'size'
				}
		};
		return {
			restrict: 'E',
			//templateUrl: 'views/directives/sunburst/sunburst.html',
			controller: 'SunburstCtrl',
			scope: {
				data: '='
			},
			link: function ($scope, element, $attrs) {
				var options = angular.extend(defaults(), $attrs);
				$scope.setChart();
				$scope.calculateGraph();
				var width = 610,
					height = width,
					radius = (width) / 2,
					x = d3.scale.linear().range([0, 2 * Math.PI]),
					y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),

					padding = 0,
					duration = 1000,
					circPadding = 10;

				var div = d3.select(element[0]);


				var vis = div.append("svg")
					.attr("width", width + padding * 2)
					.attr("height", height + padding * 2)
					.append("g")
					.attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

				/*
				div.append("p")
						.attr("id", "intro")
						.text("Click to zoom!");
				*/

				var partition = d3.layout.partition()
					.sort(null)
					.value(function (d) {
						return 1;
					});

				var arc = d3.svg.arc()
					.startAngle(function (d) {
						return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
					})
					.endAngle(function (d) {
						return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
					})
					.innerRadius(function (d) {
						return Math.max(0, d.y ? y(d.y) : d.y);
					})
					.outerRadius(function (d) {
						return Math.max(0, y(d.y + d.dy));
					});

				var special1 = "Wastewater Treatment",
					special2 = "Air Pollution PM2.5 Exceedance",
					special3 = "Agricultural Subsidies",
					special4 = "Pesticide Regulation";


				var nodes = partition.nodes($scope.calculateGraph());

				var path = vis.selectAll("path").data(nodes);
				path.enter().append("path")
					.attr("id", function (d, i) {
						return "path-" + i;
					})
					.attr("d", arc)
					.attr("fill-rule", "evenodd")
					.attr("class", function (d) {
						return d.depth ? "branch" : "root";
					})
					.style("fill", setColor)
					.on("click", click);

				var text = vis.selectAll("text").data(nodes);
				var textEnter = text.enter().append("text")
					.style("fill-opacity", 1)
					.attr("text-anchor", function (d) {
						if (d.depth)
							return "middle";
						//~ return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
						else
							return "middle";
					})
					.attr("id", function (d) {
						return "depth" + d.depth;
					})
					.attr("class", function (d) {
						return "sector"
					})
					.attr("dy", function (d) {
						return d.depth ? ".2em" : "0.35em";
					})
					.attr("transform", function (d) {
						var multiline = (d.name || "").split(" ").length > 2,
							angleAlign = (d.x > 0.5 ? 2 : -2),
							angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90 + (multiline ? angleAlign : 0),
							rotate = angle + (multiline ? -.5 : 0),
							transl = (y(d.y) + circPadding) + 35,
							secAngle = (angle > 90 ? -180 : 0);
						if (d.name == special3 || d.name == special4) rotate += 1;
						if (d.depth == 0) {
							transl = -2.50;
							rotate = 0;
							secAngle = 0;
						} else if (d.depth == 1) transl += -9;
						else if (d.depth == 2) transl += -5;
						else if (d.depth == 3) transl += 4;
						return "rotate(" + rotate + ")translate(" + transl + ")rotate(" + secAngle + ")";
					})
					.on("click", click);

				textEnter.append("tspan")
					.attr("x", 0)
					.text(function (d) {

						if (d.depth == 3 && d.name != special1 && d.name != special2 && d.name != special3 && d.name != special4)
							return d.name.split(" ")[0] + " " + (d.name.split(" ")[1] || "");
						else
							return d.name.split(" ")[0];
					});
				textEnter.append("tspan")
					.attr("x", 0)
					.attr("dy", "1em")
					.text(function (d) {

						if (d.depth == 3 && d.name != special1 && d.name != special2 && d.name != special3 && d.name != special4)
							return (d.name.split(" ")[2] || "") + " " + (d.name.split(" ")[3] || "");
						else
							return (d.name.split(" ")[1] || "") + " " + (d.name.split(" ")[2] || "");
					});
				textEnter.append("tspan")
					.attr("x", 0)
					.attr("dy", "1em")
					.text(function (d) {
						if (d.depth == 3 && d.name != special1 && d.name != special2 && d.name != special3 && d.name != special4)
							return (d.name.split(" ")[4] || "") + " " + (d.name.split(" ")[5] || "");
						else
							return (d.name.split(" ")[3] || "") + " " + (d.name.split(" ")[4] || "");;
					});

				function click(d) {
					// Control arc transition
					path.transition()
						.duration(duration)
						.attrTween("d", arcTween(d));

					// Somewhat of a hack as we rely on arcTween updating the scales.
					// Control the text transition
					text.style("visibility", function (e) {
							return isParentOf(d, e) ? null : d3.select(this).style("visibility");
						})
						.transition()
						.duration(duration)
						.attrTween("text-anchor", function (d) {
							return function () {
								if (d.depth)
									return "middle";
								//~ return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
								else
									return "middle";
							};
						})
						.attrTween("transform", function (d) {
							var multiline = (d.name || "").split(" ").length > 2;
							return function () {
								var multiline = (d.name || "").split(" ").length > 2,
									angleAlign = (d.x > 0.5 ? 2 : -2),
									angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90 + (multiline ? angleAlign : 0),
									rotate = angle + (multiline ? -.5 : 0),
									transl = (y(d.y) + circPadding) + 35,
									secAngle = (angle > 90 ? -180 : 0);
								if (d.name == special3 || d.name == special4) rotate += 1;
								if (d.depth == 0) {
									transl = -2.50;
									rotate = 0;
									secAngle = 0;
								} else if (d.depth == 1) transl += -9;
								else if (d.depth == 2) transl += -5;
								else if (d.depth == 3) transl += 4;
								return "rotate(" + rotate + ")translate(" + transl + ")rotate(" + secAngle + ")";
							};
						})
						.style("fill-opacity", function (e) {
							return isParentOf(d, e) ? 1 : 1e-6;
						})
						.each("end", function (e) {
							d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
						});
				}


				function isParentOf(p, c) {
					if (p === c) return true;
					if (p.children) {
						return p.children.some(function (d) {
							return isParentOf(d, c);
						});
					}
					return false;
				}

				function setColor(d) {

					//return ;
					if (d.color)
						return d.color;
					else {
						return '#ccc';
						/*var tintDecay = 0.20;
						// Find child number
						var x = 0;
						while (d.parent.children[x] != d)
							x++;
						var tintChange = (tintDecay * (x + 1)).toString();
						return pusher.color(d.parent.color).tint(tintChange).html('hex6');*/
					}
				}

				// Interpolate the scales!
				function arcTween(d) {
					var my = maxY(d),
						xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx - 0.0009]),
						yd = d3.interpolate(y.domain(), [d.y, my]),
						yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

					return function (d) {
						return function (t) {
							x.domain(xd(t));
							y.domain(yd(t)).range(yr(t));
							return arc(d);
						};
					};
				}

				function maxY(d) {
					return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
				}
			}
		}
	});
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('SunburstCtrl', ["$scope", function ($scope) {

		$scope.setChart = function () {
			$scope.chart = {
				options: {
					chart: {
						type: 'sunburst',
						height: 700,
						"sunburst": {
							"dispatch": {},
							"width": null,
							"height": null,
							"mode": "size",
							"id": 2088,
							"duration": 500,
							"margin": {
								"top": 0,
								"right": 0,
								"bottom": 0,
								"left": 0
							}
						},
						"tooltip": {
							"duration": 0,
							"gravity": "w",
							"distance": 25,
							"snapDistance": 0,
							"classes": null,
							"chartContainer": null,
							"fixedTop": null,
							"enabled": true,
							"hideDelay": 400,
							"headerEnabled": false,

							"offset": {
								"left": 0,
								"top": 0
							},
							"hidden": true,
							"data": null,
							"tooltipElem": null,
							"id": "nvtooltip-99347"
						},
					}
				},
				data: []
			};
			return $scope.chart;
		}
		var buildTree = function (data) {
			var children = [];
			angular.forEach(data, function (item) {
				var child = {
					'name': item.title,
					'size': item.size,
					'color': item.color,
					'children': buildTree(item.children)
				};
				if(item.color){
					child.color = item.color
				}
				if(item.size){
					child.size = item.size
				}
				children.push(child);
			});
			return children;
		};
		$scope.calculateGraph = function () {
			var chartData = {
				"name": $scope.data.title,
				"color": $scope.data.style.base_color || '#000',
				"children": buildTree($scope.data.children),
				"size": 1
			};
			$scope.chart.data = chartData;
			return chartData;
		};
		$scope.$watch('data', function (n, o) {
			if (!n) {
				return;
			}
			$scope.calculateGraph();
		})
	}]);

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'treemenu', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/treemenu/treemenu.html',
			controller: 'TreemenuCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				options:'=',
				item:'=?',
				selection: '=?'
			},
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'TreemenuCtrl', function(){

	})
})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'treeview', ["RecursionHelper", function(RecursionHelper) {
		var options = {
			editWeight:false,
			drag: false,
			edit: false,
			children:'children'
		};
		return {
			restrict: 'E',
			templateUrl: 'views/directives/treeview/treeview.html',
			controller: 'TreeviewCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				items: '=',
				item: '=?',
				selection: '=?',
				options:'=?',
				active: '=?',
				click: '&'
			},
			replace:true,
			compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
								angular.extend(options, scope.vm.options)
								// Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with
                // a 'pre'- and 'post'-link function.
            });
        }
		};

	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('TreeviewCtrl', ["$filter", function($filter) {
		//
		var vm = this;
		vm.selectedItem = selectedItem;
		vm.childSelected = childSelected;
		vm.toggleSelection = toggleSelection;
		vm.onDragOver = onDragOver;
		vm.onDropComplete = onDropComplete;
		vm.onMovedComplete = onMovedComplete;
		vm.addChildren = addChildren;

		activate();

		function activate(){
			if(typeof vm.selection == "undefined"){
				vm.selection = [];
			}
		}

		function onDragOver(event, index, external, type) {
			return true;
		}

		function onDropComplete(event, index, item, external) {
			angular.forEach(vm.items, function(entry, key){
				if(entry.id == 0){
					vm.items.splice(key, 1);
				}
			})
			return item;
		}

		function onMovedComplete(index, data, evt) {
			if(vm.options.allowMove){
				return vm.items.splice(index, 1);
			}
		}
		function toggleSelection(item){
			var index = -1;
			angular.forEach(vm.selection, function(selected, i){
				if(selected.id == item.id){
					index = i;
				}
			});
			if(index > -1){
				vm.selection.splice(index, 1);
			}
			else{
				vm.selection.push(item);
			}
			if(typeof vm.options.selectionChanged == 'function' )
				vm.options.selectionChanged();
		}
		function addChildren(item) {

			item.children = [];
			item.expanded = true;
		}

		function selectedItem(item) {
			var found = false;
			angular.forEach(vm.selection, function(selected){
				if(selected.id == item.id){
					found = true;
				}
			});
			return found;
		/*	if(vm.selection.indexOf(angular.copy(item)) > -1){
				return true;
			}
			return false;*/
		}

		function childSelected(item) {
			var found = false;
			angular.forEach(item.children, function(child){
				if(vm.selection.indexOf(child)> -1){
					found = true;
				}
				if(!found){
					found =  childSelected(child);

				}
			})
			return found;
		}

		/*function toggleItem(item) {
			if (typeof vm.item[vm.options.type] === "undefined") vm.item[vm.options.type] = [];
			var found = false,
				index = -1;
			angular.forEach(vm.item[vm.options.type], function(entry, i) {
				if (entry.id == item.id) {
					found = true;
					index = i;
				}
			})
			index === -1 ? vm.item[vm.options.type].push(item) : vm.item[vm.options.type].splice(index, 1);
		}*/
	}]);

})();

(function() {
	"use strict";

	angular.module('app.directives').directive('weight', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/weight/weight.html',
			controller: 'WeightCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				items: '=',
				item: '=',
				options: '='
			},
			replace: true,
			link: function(scope, element, attrs) {
				//
			}
		};

	});

})();
(function() {
	"use strict";

	angular.module('app.controllers').controller('WeightCtrl', ["$scope", function($scope) {
		//
		var vm = this;
		vm.raiseWeight = raiseWeight;
		vm.lowerWeight = lowerWeight;

		activate();

		function activate() {
			calcStart();
		}

		function calcStart() {

			if (typeof vm.item.weight == "undefined" || !vm.item.weight) {
				angular.forEach(vm.items, function(entry) {
					entry.weight = 100 / vm.items.length;
				})
			}
		}

		function calcValues() {
			var fixed = vm.item.weight;
			var rest = (100 - fixed) / (vm.items.length - 1);
			angular.forEach(vm.items, function(entry) {
				if (entry !== vm.item) {
					entry.weight = rest;
				}
			});
			return rest;
		}

		function raiseWeight() {
			if(vm.item.weight >= 95) return false;
			if (vm.item.weight % 5 != 0) {
				vm.item.weight = 5 * Math.round(vm.item.weight / 5);
			} else {
				vm.item.weight += 5;
			}
			calcValues();
		}

		function lowerWeight() {
			if(vm.item.weight <= 5) return false;
			if (vm.item.weight % 5 != 0) {
				vm.item.weight = 5 * Math.round(vm.item.weight / 5) - 5;
			} else {
				vm.item.weight -= 5;
			}
			calcValues();
		}


	}]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9iYXNlbWFwcy5qcyIsInNlcnZpY2VzL2NvbnRlbnQuanMiLCJzZXJ2aWNlcy9jb3VudHJpZXMuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvZXJyb3JDaGVja2VyLmpzIiwic2VydmljZXMvZXhwb3J0LmpzIiwic2VydmljZXMvaWNvbnMuanMiLCJzZXJ2aWNlcy9pbmRleC5qcyIsInNlcnZpY2VzL2luZGl6ZXMuanMiLCJzZXJ2aWNlcy9yZWN1cnNpb25oZWxwZXIuanMiLCJzZXJ2aWNlcy90b2FzdC5qcyIsInNlcnZpY2VzL3VzZXIuanMiLCJhcHAvYmFzZW1hcHMvYmFzZW1hcERldGFpbHMuanMiLCJhcHAvYmFzZW1hcHMvYmFzZW1hcHMuanMiLCJhcHAvY29uZmxpY3RJbXBvcnQvY29uZmxpY3RJbXBvcnQuanMiLCJhcHAvY29uZmxpY3RkZXRhaWxzL2NvbmZsaWN0ZGV0YWlscy5qcyIsImFwcC9jb25mbGljdGl0ZW1zL2NvbmZsaWN0aXRlbXMuanMiLCJhcHAvY29uZmxpY3RuYXRpb24vY29uZmxpY3RuYXRpb24uanMiLCJhcHAvY29uZmxpY3RzL2NvbmZsaWN0cy5qcyIsImFwcC9leHBvcnQvZXhwb3J0LmpzIiwiYXBwL2V4cG9ydC9leHBvcnREZXRhaWxzLmpzIiwiYXBwL2V4cG9ydFN0eWxlL2V4cG9ydFN0eWxlLmpzIiwiYXBwL2Z1bGxMaXN0L2ZpbHRlci5qcyIsImFwcC9mdWxsTGlzdC9mdWxsTGlzdC5qcyIsImFwcC9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2hvbWUvaG9tZS5qcyIsImFwcC9pbXBvcnRjc3YvaW1wb3J0Y3N2LmpzIiwiYXBwL2luZGV4L2luZGV4LmpzIiwiYXBwL2luZGV4L2luZGV4YmFzZS5qcyIsImFwcC9pbmRleENoZWNrL0luZGV4Q2hlY2suanMiLCJhcHAvaW5kZXhDaGVjay9pbmRleENoZWNrU2lkZWJhci5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWwuanMiLCJhcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhLmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhLmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51LmpzIiwiYXBwL2luZGV4Y3JlYXRvci9pbmRleGNyZWF0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvY2F0ZWdvcnkuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaXplcy5qcyIsImFwcC9pbmRleGluZm8vaW5kZXhpbmZvLmpzIiwiYXBwL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJhcHAvaW5kaWNhdG9yL2luZGljYXRvclllYXJUYWJsZS5qcyIsImFwcC9sb2dpbi9sb2dpbi5qcyIsImFwcC9sb2dvL2xvZ28uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lkZW1lbnUvc2lkZW1lbnUuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZFByb3ZpZGVyL2FkZFByb3ZpZGVyLmpzIiwiZGlhbG9ncy9hZGRVbml0L2FkZFVuaXQuanMiLCJkaWFsb2dzL2FkZFllYXIvYWRkWWVhci5qcyIsImRpYWxvZ3MvYWRkX3VzZXJzL2FkZF91c2Vycy5qcyIsImRpYWxvZ3MvY29uZmxpY3RtZXRob2RlL2NvbmZsaWN0bWV0aG9kZS5qcyIsImRpYWxvZ3MvY29uZmxpY3R0ZXh0L2NvbmZsaWN0dGV4dC5qcyIsImRpYWxvZ3MvY29weXByb3ZpZGVyL2NvcHlwcm92aWRlci5qcyIsImRpYWxvZ3MvZWRpdGNvbHVtbi9lZGl0Y29sdW1uLmpzIiwiZGlhbG9ncy9lZGl0cm93L2VkaXRyb3cuanMiLCJkaWFsb2dzL2V4dGVuZERhdGEvZXh0ZW5kRGF0YS5qcyIsImRpYWxvZ3MvbG9vc2VkYXRhL2xvb3NlZGF0YS5qcyIsImRpYWxvZ3Mvc2VsZWN0aXNvZmV0Y2hlcnMvc2VsZWN0aXNvZmV0Y2hlcnMuanMiLCJkaXJlY3RpdmVzL2F1dG9Gb2N1cy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9iYXJzL2JhcnMuanMiLCJkaXJlY3RpdmVzL2JhcnMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYmFzZW1hcC9iYXNlbWFwLmpzIiwiZGlyZWN0aXZlcy9iYXNlbWFwL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2Jhc2VtYXBTZWxlY3Rvci9iYXNlbWFwU2VsZWN0b3IuanMiLCJkaXJlY3RpdmVzL2Jhc2VtYXBTZWxlY3Rvci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2NhdGVnb3J5LmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvY29udGVudGVkaXRhYmxlLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZXhwb3J0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2V4cG9ydC9leHBvcnQuanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZmlsZURyb3B6b25lLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51LmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvcnMvaW5kaWNhdG9ycy5qcyIsImRpcmVjdGl2ZXMvaW5kaXplcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpemVzL2luZGl6ZXMuanMiLCJkaXJlY3RpdmVzL21lZGlhbi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vbWVkaWFuLmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvcGFyc2VDb25mbGljdENzdi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L3BhcnNlQ29uZmxpY3RFdmVudHNDc3YuanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2LmpzIiwiZGlyZWN0aXZlcy9waWVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9waWVjaGFydC9waWVjaGFydC5qcyIsImRpcmVjdGl2ZXMvcm91bmRiYXIvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcm91bmRiYXIvcm91bmRiYXIuanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N0eWxlcy9zdHlsZXMuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyIsImRpcmVjdGl2ZXMvdHJlZW1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZW1lbnUvdHJlZW1lbnUuanMiLCJkaXJlY3RpdmVzL3RyZWV2aWV3L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3RyZWV2aWV3L3RyZWV2aWV3LmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvd2VpZ2h0L3dlaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7RUFJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLFlBQUEsMEJBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLFlBQUEsV0FBQSxpQkFBQSxnQkFBQSxjQUFBLGdCQUFBLFlBQUEsVUFBQSxTQUFBLGFBQUEsaUJBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLGNBQUEsb0JBQUE7RUFDQSxRQUFBLE9BQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGdCQUFBLGFBQUEsYUFBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDbkJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFFQUFBLFNBQUEsZ0JBQUEsb0JBQUEsbUJBQUE7O0VBRUEsSUFBQSxVQUFBLFNBQUEsVUFBQTtHQUNBLE9BQUEsZ0JBQUEsV0FBQSxNQUFBLFdBQUE7OztFQUdBLG1CQUFBLFVBQUE7O0VBRUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLGFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7SUFHQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7OztJQU1BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7S0FDQSxrQ0FBQSxTQUFBLGFBQUEsT0FBQTtNQUNBLE9BQUEsWUFBQSxPQUFBLE1BQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7O0lBS0EsTUFBQSxhQUFBO0lBQ0EsVUFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsZ0NBQUEsU0FBQSxrQkFBQTtNQUNBLE9BQUEsaUJBQUE7Ozs7O0dBS0EsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7S0FDQSw0QkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBOztLQUVBLCtCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUEsZ0JBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBOzs7S0FHQSwyQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBOztLQUVBLCtCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUEsY0FBQTtPQUNBLFlBQUE7T0FDQSxNQUFBOzs7O0lBSUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsK0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLHlDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLDhDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxhQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7Ozs7Ozs7Ozs7SUFlQSxNQUFBLDRCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7S0FDQSwwQ0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxJQUFBLGFBQUEsTUFBQSxHQUFBLE9BQUE7TUFDQSxPQUFBLGVBQUEsUUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEscUNBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7S0FDQSwrQ0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsZ0JBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBOzs7O0lBSUEsT0FBQTtLQUNBLGVBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGlEQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBOztJQUVBLE1BQUEsK0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLHdDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLDZDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLEdBQUEsYUFBQSxNQUFBLE1BQUE7T0FDQSxPQUFBOztNQUVBLE9BQUEsZUFBQSxZQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7OztJQUtBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLHFCQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7S0FDQSxVQUFBOztJQUVBLE9BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLCtDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxnQkFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsZUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsbUNBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLFdBQUE7SUFDQSxPQUFBO0tBQ0EsZUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxzQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLFVBQUE7O0lBRUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsOEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLCtCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUEsY0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7OztLQUdBLDRCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxlQUFBO09BQ0EsT0FBQSxlQUFBLGNBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTs7OztJQUlBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7O0lBS0EsTUFBQSx3QkFBQTtJQUNBLElBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsZUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7SUFHQSxPQUFBO0tBQ0EsS0FBQTtNQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTs7S0FFQSxPQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBOztLQUVBLElBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7Ozs7O0lBS0EsTUFBQSw0QkFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLG1DQUFBLFNBQUEsZ0JBQUEsUUFBQTs7TUFFQSxPQUFBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxPQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxVQUFBLGFBQUE7O0tBRUEsZ0NBQUEsU0FBQSxrQkFBQTtNQUNBLE9BQUEsaUJBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxnQkFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsc0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHlCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOztLQUVBLDJCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDZCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSx3Q0FBQSxTQUFBLGFBQUEsY0FBQTtNQUNBLE9BQUEsWUFBQSxJQUFBLHVCQUFBLGFBQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw4QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsMENBQUEsU0FBQSxhQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQSxzQkFBQSxhQUFBLElBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsZUFBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7QUM1bkJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFIQUFBLFNBQUEsWUFBQSxZQUFBLFVBQUEsT0FBQSxRQUFBLGVBQUEsU0FBQSxhQUFBLFFBQUE7RUFDQSxXQUFBLGNBQUE7RUFDQSxXQUFBLFNBQUE7RUFDQSxXQUFBLGNBQUEsY0FBQSxZQUFBO0VBQ0EsV0FBQSxVQUFBO0VBQ0EsV0FBQSxTQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsV0FBQSxhQUFBLFNBQUEsUUFBQTtHQUNBLFdBQUEsUUFBQTs7O0VBR0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLENBQUEsTUFBQSxtQkFBQTtJQUNBLE9BQUEsTUFBQSx1Q0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBLE9BQUEsR0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsVUFBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLFdBQUEsUUFBQTtVQUNBO0lBQ0EsV0FBQSxRQUFBOztHQUVBLElBQUEsUUFBQSxjQUFBLFFBQUE7SUFDQSxXQUFBLFVBQUE7VUFDQTtJQUNBLFdBQUEsVUFBQTs7R0FFQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGFBQUE7SUFDQSxJQUFBLFFBQUEsTUFBQSxlQUFBLFlBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLFdBQUE7V0FDQTtLQUNBLFdBQUEsV0FBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxhQUFBO1dBQ0E7S0FDQSxXQUFBLGFBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsVUFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztVQUVBO0lBQ0EsV0FBQSxhQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLElBQUEsUUFBQSxLQUFBLFFBQUEsY0FBQSxDQUFBLEtBQUEsUUFBQSxRQUFBLHVCQUFBO0lBQ0EsV0FBQSxXQUFBO1VBQ0E7SUFDQSxXQUFBLFdBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsNkJBQUE7SUFDQSxXQUFBLFlBQUE7VUFDQTtJQUNBLFdBQUEsWUFBQTs7R0FFQSxXQUFBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTs7R0FFQSxXQUFBLGlCQUFBO0dBQ0EsV0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxTQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7S0FDQSxXQUFBLFlBQUE7O0dBRUE7OztFQUdBLFNBQUEsZUFBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsUUFBQSxJQUFBO0tBQ0EsSUFBQTs7TUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNwR0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxlQUFBOzs7RUFHQSxjQUFBLFdBQUE7SUFDQSxjQUFBLFlBQUE7SUFDQSxjQUFBLFlBQUE7RUFDQSxjQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7RUFFQSxjQUFBLE9BQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBO1FBQ0EsYUFBQSxhQUFBOzs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwrQkFBQSxTQUFBLHFCQUFBO0VBQ0E7SUFDQSxXQUFBO0lBQ0Esa0JBQUE7SUFDQSxRQUFBOztJQUVBLHFCQUFBO0lBQ0EsT0FBQTs7SUFFQSx1QkFBQSxTQUFBLE1BQUEsV0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQTtJQUNBLGdCQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQTtLQUNBLGNBQUEsUUFBQSxLQUFBOztJQUVBLElBQUEsS0FBQSxVQUFBO0tBQ0EsY0FBQSxZQUFBLEtBQUE7O0lBRUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDckJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG9EQUFBLFNBQUEsbUJBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7R0FFQSxtQkFBQTs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7VUFDQSxZQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFlBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBOztZQUVBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQTs7WUFFQSxPQUFBLE1BQUEsUUFBQSxlQUFBOzs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxjQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7O01BRUEsSUFBQSxTQUFBO0dBQ0EsSUFBQSxJQUFBO0lBQ0EsTUFBQSxNQUFBOztHQUVBLE9BQUEsSUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLGNBQUEsUUFBQSxLQUFBLGlCQUFBLENBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxNQUFBOzs7R0FHQSxPQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE1BQUE7OzthQUdBLE9BQUEsS0FBQSxRQUFBLGNBQUE7Ozs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsaUJBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxLQUFBLElBQUEsYUFBQSxPQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUE7OztHQUdBLE1BQUEsS0FBQSxVQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsSUFBQSxTQUFBLEVBQUE7SUFDQSxPQUFBLElBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsWUFBQTtDQUNBLFNBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFlBQUEsT0FBQTs7TUFFQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxRQUFBLElBQUE7O1FBRUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxNQUFBLEtBQUEsTUFBQTs7OztHQUlBLE9BQUE7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG1DQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLFFBQUE7RUFDQSxNQUFBLFVBQUE7R0FDQSxNQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7R0FDQSxjQUFBO0lBQ0EsUUFBQTtJQUNBLGlCQUFBO0lBQ0EsY0FBQTs7OztFQUlBLE9BQUE7O0dBRUEsUUFBQTtHQUNBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBO0lBQ0EsT0FBQTs7R0FFQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFlBQUE7S0FDQSxLQUFBLEtBQUE7OztHQUdBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0dBRUEsV0FBQTtJQUNBLFdBQUE7S0FDQSxLQUFBO0tBQ0EsS0FBQTs7SUFFQSxXQUFBO0tBQ0EsS0FBQSxDQUFBO0tBQ0EsS0FBQSxDQUFBOzs7R0FHQSxRQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsS0FBQSxXQUFBOztHQUVBLGNBQUEsU0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFdBQUEsU0FBQTtLQUNBLE1BQUEsUUFBQTtLQUNBLEtBQUEsUUFBQTtLQUNBLE1BQUE7S0FDQSxjQUFBO01BQ0EsUUFBQTtNQUNBLGlCQUFBO01BQ0EsY0FBQTs7OztHQUlBLGdCQUFBLFVBQUE7SUFDQSxLQUFBLE9BQUEsV0FBQSxTQUFBLEtBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFNBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFFBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLEtBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxtQkFBQSxTQUFBLFdBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsWUFBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxRQUFBLElBQUE7S0FDQSxTQUFBLGFBQUEsS0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBLFdBQUE7O0lBRUEsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxjQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFlBQUE7Ozs7O0dBS0EsY0FBQSxTQUFBLGVBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLFVBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7Ozs7R0FJQSxVQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxLQUFBLEtBQUEsWUFBQTs7SUFFQSxJQUFBLENBQUEsS0FBQSxRQUFBO0tBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsS0FBQSxLQUFBOztTQUVBO01BQ0EsS0FBQSxrQkFBQSxLQUFBLEtBQUE7O1dBRUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsS0FBQTs7O0dBR0EsZ0JBQUEsU0FBQSxLQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxZQUFBO0tBQ0EsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7UUFJQTtLQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxJQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLGlCQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7O0dBRUEsZ0JBQUEsU0FBQSxPQUFBLE9BQUEsT0FBQTtJQUNBLElBQUEsT0FBQTs7SUFFQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsU0FBQSxlQUFBLFNBQUEsTUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUE7WUFDQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxJQUFBOztLQUVBLElBQUEsT0FBQSxTQUFBLGFBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7O0tBRUEsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGVBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLFVBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsSUFBQTtPQUNBLEdBQUEsT0FBQTtRQUNBLFFBQUEsV0FBQTs7VUFFQTtPQUNBLFFBQUEsV0FBQTs7OztLQUlBLEtBQUE7Ozs7R0FJQSxtQkFBQSxTQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUE7S0FDQSxRQUFBLElBQUE7OztRQUdBO0tBQ0EsS0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxXQUFBOzs7O0dBSUEsT0FBQSxVQUFBO0lBQ0EsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGdCQUFBLFNBQUEsU0FBQTtJQUNBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUEsS0FBQSxlQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0lBQ0EsUUFBQSxXQUFBOztJQUVBLFFBQUE7S0FDQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxLQUFBO09BQ0EsSUFBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7T0FFQSxJQUFBLFlBQUEsU0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO09BQ0EsUUFBQSxJQUFBLFVBQUEsSUFBQTtPQUNBLElBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOztPQUVBLE1BQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO1FBQ0EsU0FBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOzs7O2FBSUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztPQUlBOztJQUVBLE9BQUE7Ozs7Ozs7O0FDL1NBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG1DQUFBLFNBQUEsWUFBQTs7UUFFQSxPQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxhQUFBLFNBQUEsU0FBQSxNQUFBO1lBQ0EsSUFBQSxRQUFBO1lBQ0EsWUFBQSxPQUFBLFlBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxNQUFBLFdBQUE7Y0FDQSxHQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUEsTUFBQTtlQUNBOztVQUVBLFlBQUEsU0FBQSxJQUFBLFNBQUEsTUFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLFlBQUEsT0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxNQUFBLFVBQUE7Y0FDQSxHQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUEsTUFBQTs7O1VBR0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLEtBQUEsVUFBQTs7VUFFQSxNQUFBLFNBQUEsU0FBQSxTQUFBLE1BQUE7WUFDQSxHQUFBLEtBQUEsUUFBQSxNQUFBLEtBQUEsQ0FBQSxLQUFBLFFBQUEsR0FBQTtjQUNBLFlBQUEsS0FBQSxZQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFlBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFVBQUE7Z0JBQ0EsTUFBQTs7O2dCQUdBO2NBQ0EsS0FBQSxRQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFlBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFVBQUE7Z0JBQ0EsTUFBQTs7OztVQUlBLFlBQUEsU0FBQSxJQUFBLFNBQUEsTUFBQTtZQUNBLFlBQUEsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUE7ZUFDQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLE9BQUEsVUFBQTtjQUNBLE1BQUE7Ozs7Ozs7O0FDckRBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZDQUFBLFNBQUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsT0FBQSxJQUFBO0lBQ0EsSUFBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsTUFBQSxHQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLEtBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxjQUFBLEtBQUEsVUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7O0dBS0EsT0FBQTs7RUFFQSxPQUFBO0dBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtJQUNBLGNBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFVBQUEsWUFBQSxPQUFBLFNBQUE7O0dBRUEsaUJBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxPQUFBLFVBQUEsUUFBQTs7R0FFQSxZQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxhQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGVBQUEsU0FBQSxRQUFBLGFBQUE7SUFDQSxHQUFBLFlBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUEsUUFBQTs7SUFFQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxnQkFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFFBQUE7O0lBRUEsT0FBQSxLQUFBLGdCQUFBOzs7R0FHQSxXQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFlBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUE7O0dBRUEsY0FBQSxTQUFBLElBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsV0FBQSxRQUFBLEtBQUE7TUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQTs7OztJQUlBLE9BQUEsS0FBQSxlQUFBOztHQUVBLGdCQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxZQUFBOzs7R0FHQSx1QkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxhQUFBOztHQUVBLGtCQUFBLFNBQUEsSUFBQSxNQUFBLFFBQUE7SUFDQSxHQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLFdBQUEsT0FBQSxZQUFBOztTQUVBLElBQUEsTUFBQTtLQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUEsV0FBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBOztHQUVBLHFCQUFBLFNBQUEsSUFBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLGNBQUEsS0FBQSxDQUFBLFFBQUE7O0dBRUEsU0FBQSxTQUFBLElBQUE7Ozs7O0tBS0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsVUFBQTs7O0dBR0EsY0FBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLEtBQUEsT0FBQSxLQUFBO01BQ0EsT0FBQTs7S0FFQSxHQUFBLE1BQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxLQUFBLGNBQUEsSUFBQSxNQUFBO01BQ0EsR0FBQSxVQUFBO09BQ0EsT0FBQTs7OztJQUlBLE9BQUE7O0dBRUEsWUFBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLFFBQUE7O0tBRUEsR0FBQSxNQUFBLFlBQUEsTUFBQSxTQUFBLFVBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsWUFBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxRQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxTQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxRQUFBLEtBQUE7O0dBRUEsWUFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxVQUFBOztHQUVBLFlBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsWUFBQSxLQUFBLElBQUEsS0FBQSxRQUFBOztJQUVBLE9BQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQTtLQUNBLE9BQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxRQUFBO1dBQ0E7S0FDQSxPQUFBLEtBQUEsUUFBQSxXQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOzs7R0FHQSxnQkFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxlQUFBOztHQUVBLFlBQUEsU0FBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxTQUFBLEVBQUE7S0FDQSxHQUFBLENBQUEsS0FBQSxPQUFBLE1BQUE7TUFDQSxLQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxRQUFBOztTQUVBO01BQ0EsS0FBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLEtBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQTs7SUFFQSxLQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUEsUUFBQTtJQUNBLEtBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7OztBQzVMQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxvQ0FBQSxTQUFBLFlBQUE7O1FBRUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxXQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsWUFBQSxZQUFBLE9BQUEsa0JBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxDQUFBLEtBQUEsVUFBQSxPQUFBO2NBQ0EsS0FBQTs7WUFFQSxPQUFBLEtBQUE7Ozs7Ozs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBO0lBQ0EsWUFBQSxVQUFBLENBQUEsY0FBQTs7SUFFQSxTQUFBLFlBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLEtBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTs7O1FBR0EsU0FBQSxPQUFBLE9BQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxRQUFBO1lBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLE1BQUEsS0FBQSxZQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLEtBQUEsT0FBQTs7VUFFQSxPQUFBOztRQUVBLFNBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBLElBQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLHFCQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7O0dBSUEsU0FBQSxTQUFBLE9BQUEsU0FBQTtJQUNBLE9BQUEsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7T0FDQSxPQUFBOzs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsd0VBQUEsU0FBQSxhQUFBLGVBQUEsYUFBQTs7UUFFQSxJQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBLE1BQUE7T0FDQSxHQUFBLG1CQUFBO09BQ0EsSUFBQSxHQUFBLEtBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtTQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBO1dBQ0EsSUFBQSxVQUFBLEtBQUEsTUFBQSxNQUFBO1dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBO1lBQ0EsSUFBQSxPQUFBLFVBQUEsT0FBQTthQUNBOzs7O1VBSUEsSUFBQSxTQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7V0FDQSxHQUFBLGlCQUFBLEtBQUE7OztTQUdBLElBQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsR0FBQSxHQUFBLEtBQUEsV0FBQTtXQUNBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7O1VBRUEsY0FBQSxhQUFBLGNBQUE7Ozs7VUFJQSxPQUFBOzs7TUFHQSxTQUFBLGNBQUE7T0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO1FBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxHQUFBO1NBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEsU0FBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtXQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO1dBQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtXQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7UUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxJQUFBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtVQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1VBQ0EsUUFBQSxHQUFBLEtBQUE7VUFDQSxLQUFBOztTQUVBLElBQUEsYUFBQTtTQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1dBQ0EsYUFBQTs7O1NBR0EsSUFBQSxDQUFBLFlBQUE7VUFDQSxJQUFBLE9BQUEsS0FBQTtVQUNBLEdBQUEsV0FBQSxLQUFBOzs7Ozs7TUFNQSxTQUFBLFdBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxLQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsMENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsZUFBQTtRQUNBLE9BQUEsTUFBQSw4Q0FBQTtRQUNBLE9BQUE7O09BRUEsSUFBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsbURBQUE7UUFDQSxPQUFBOzs7T0FHQSxHQUFBLFdBQUE7T0FDQSxJQUFBLFVBQUE7T0FDQSxJQUFBLFdBQUE7T0FDQSxJQUFBLFVBQUE7T0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO1FBQ0EsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTtTQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLElBQUE7O1FBRUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQTtVQUNBOztRQUVBLFFBQUEsS0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7OztPQUdBLElBQUEsVUFBQSxhQUFBLFFBQUEsU0FBQSxLQUFBLGVBQUE7T0FDQSxhQUFBO09BQ0EsWUFBQSxLQUFBLHdCQUFBO1FBQ0EsTUFBQTtRQUNBLEtBQUE7VUFDQSxLQUFBLFNBQUEsVUFBQTtRQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO1NBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtVQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQTtXQUNBLElBQUEsUUFBQSxLQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsV0FBQTthQUNBLE9BQUE7YUFDQSxTQUFBLFFBQUE7O1lBRUEsYUFBQSxZQUFBO2tCQUNBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxNQUFBLGFBQUE7YUFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7YUFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtjQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7ZUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO2dCQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUE7Z0JBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTtzQkFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO2dCQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQSxXQUFBO2lCQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7aUJBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7O21CQU1BOzthQUVBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsUUFBQSxHQUFBLEtBQUE7O2FBRUEsSUFBQSxhQUFBO2FBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7Y0FDQSxRQUFBLElBQUE7Y0FDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO2VBQ0EsYUFBQTs7O2FBR0EsSUFBQSxDQUFBLFlBQUE7Y0FDQSxhQUFBLFlBQUE7Y0FDQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQTtRQUNBLElBQUEsYUFBQSxjQUFBLFFBQUE7U0FDQSxjQUFBLGFBQUE7O1VBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztRQUlBLE9BQUE7VUFDQSxhQUFBOzs7Ozs7QUNsTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsaUNBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsU0FBQTtVQUNBLFlBQUEsU0FBQSxTQUFBLE1BQUE7WUFDQSxJQUFBLFFBQUE7WUFDQSxZQUFBLE9BQUEsV0FBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLE1BQUEsVUFBQTtjQUNBLEdBQUEsT0FBQSxZQUFBO2NBQ0EsUUFBQSxNQUFBO2VBQ0E7O1VBRUEsV0FBQSxTQUFBLElBQUEsU0FBQSxNQUFBO1lBQ0EsSUFBQSxRQUFBO1lBQ0EsWUFBQSxPQUFBLFdBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLE1BQUEsV0FBQTtjQUNBLEdBQUEsT0FBQSxZQUFBO2NBQ0EsUUFBQSxNQUFBOzs7VUFHQSxXQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsS0FBQSxXQUFBOztVQUVBLE1BQUEsU0FBQSxTQUFBLE1BQUE7WUFDQSxHQUFBLEtBQUEsU0FBQSxNQUFBLEtBQUEsQ0FBQSxLQUFBLFNBQUEsR0FBQTtjQUNBLFlBQUEsS0FBQSxXQUFBLEtBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtnQkFDQSxHQUFBLE9BQUEsWUFBQTtnQkFDQSxRQUFBO2dCQUNBLFNBQUEsU0FBQTtnQkFDQSxHQUFBLE9BQUEsVUFBQTtnQkFDQSxNQUFBOzs7Z0JBR0E7O2FBRUEsS0FBQSxTQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFlBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxPQUFBLFVBQUE7Z0JBQ0EsTUFBQTs7OztVQUlBLFFBQUEsU0FBQSxJQUFBLFNBQUEsTUFBQTtZQUNBLFlBQUEsT0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUE7ZUFDQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLE9BQUEsVUFBQTtjQUNBLE1BQUE7Ozs7Ozs7O0FDdERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsYUFBQTtjQUNBLE1BQUE7O1lBRUEsV0FBQTtZQUNBLFNBQUE7V0FDQSxTQUFBLGFBQUE7O1FBRUEsSUFBQSxDQUFBLGFBQUEsSUFBQSxlQUFBO1VBQ0EsY0FBQSxhQUFBLGNBQUE7WUFDQSxvQkFBQSxLQUFBLEtBQUE7WUFDQSxnQkFBQTtZQUNBLGFBQUE7O1VBRUEsY0FBQSxZQUFBLElBQUE7O1lBRUE7VUFDQSxjQUFBLGFBQUEsSUFBQTtVQUNBLFVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7VUFDQSxNQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTtrQkFDQSxhQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxnQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsYUFBQTs7VUFFQSxXQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBOztVQUVBLG1CQUFBLFVBQUE7O1VBRUEsWUFBQSxJQUFBLGVBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLE9BQUE7O1VBRUEsd0JBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFlBQUEsV0FBQSxLQUFBLGVBQUE7O1VBRUEscUJBQUEsVUFBQTtZQUNBLE9BQUEsY0FBQSxZQUFBLElBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsV0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGlCQUFBLFVBQUE7WUFDQSxPQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBLEVBQUE7O1VBRUEsWUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLE9BQUEsT0FBQSxFQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBOztVQUVBLG1CQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTs7Z0JBRUEsU0FBQTtnQkFDQSxXQUFBOzs7Ozs7OztBQ3pLQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxVQUFBLGFBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0tBQ0EsTUFBQTtLQUNBLFdBQUE7O0lBRUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOzs7R0FHQSxXQUFBLFNBQUEsT0FBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLE9BQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLFlBQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsVUFBQTtJQUNBLE9BQUEsS0FBQTs7R0FFQSxTQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGNBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLEtBQUE7O0dBRUEsZ0JBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7O0dBRUEscUJBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7Ozs7Ozs7QUNqQ0EsQ0FBQSxZQUFBO0VBQ0E7O0VBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0NBQUEsVUFBQSxVQUFBOztJQUVBLE9BQUE7Ozs7Ozs7S0FPQSxTQUFBLFVBQUEsU0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxPQUFBO1FBQ0EsTUFBQTs7Ozs7TUFLQSxJQUFBLFdBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQTtNQUNBLE9BQUE7T0FDQSxLQUFBLENBQUEsUUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBOzs7O09BSUEsTUFBQSxVQUFBLE9BQUEsU0FBQTs7UUFFQSxJQUFBLENBQUEsa0JBQUE7U0FDQSxtQkFBQSxTQUFBOzs7UUFHQSxpQkFBQSxPQUFBLFVBQUEsT0FBQTtTQUNBLFFBQUEsT0FBQTs7OztRQUlBLElBQUEsUUFBQSxLQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxNQUFBOzs7Ozs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxZQUFBOzs7UUFHQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUE7O1VBRUEsV0FBQSxVQUFBOzs7VUFHQSxXQUFBLFVBQUE7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBFQUFBLFNBQUEsUUFBQSxpQkFBQSxtQkFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFVBQUE7VUFDQSxNQUFBLFVBQUE7WUFDQSxRQUFBLElBQUEsR0FBQTtZQUNBLGdCQUFBLEtBQUEsR0FBQTs7O1VBR0EsVUFBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxFQUFBO1lBQ0EsZ0JBQUEsV0FBQSxPQUFBLE9BQUEsSUFBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLFVBQUE7Y0FDQSxtQkFBQSxhQUFBLEdBQUE7Ozs7UUFJQSxTQUFBLFdBQUEsTUFBQSxLQUFBO09BQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7UUFDQSxHQUFBLE1BQUEsTUFBQSxLQUFBLEdBQUE7U0FDQSxLQUFBLE9BQUEsS0FBQTtTQUNBLE9BQUE7O1FBRUEsR0FBQSxNQUFBLFNBQUE7U0FDQSxJQUFBLFlBQUEsV0FBQSxNQUFBLE1BQUE7U0FDQSxHQUFBLFVBQUE7VUFDQSxPQUFBOzs7O09BSUEsT0FBQTs7Ozs7O0FDeENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxnQkFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxNQUFBO09BQ0EsTUFBQTtPQUNBLFdBQUE7T0FDQSxXQUFBO09BQ0EsVUFBQTtPQUNBLGFBQUE7T0FDQSxXQUFBLFNBQUEsSUFBQSxNQUFBO1FBQ0EsT0FBQSxHQUFBLDhCQUFBO1NBQ0EsSUFBQTtTQUNBLE1BQUE7OztPQUdBLFVBQUEsV0FBQTtRQUNBLE9BQUEsR0FBQSw4QkFBQTtTQUNBLElBQUE7U0FDQSxNQUFBOzs7T0FHQSxhQUFBLFdBQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsTUFBQSxLQUFBO1NBQ0EsZ0JBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLE1BQUE7VUFDQSxJQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsSUFBQTtXQUNBLE9BQUEsR0FBQTs7VUFFQSxHQUFBLFlBQUE7Ozs7Ozs7UUFPQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxnQkFBQSxZQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsV0FBQTs7Ozs7OztBQzVDQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwREFBQSxTQUFBLGFBQUEsUUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsU0FBQSxHQUFBO0lBQ0EsUUFBQSxHQUFBOztHQUVBLFlBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDbEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlKQUFBLFNBQUEsVUFBQSxRQUFBLFFBQUEsWUFBQSxvQkFBQSxVQUFBLFdBQUEsU0FBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsc0JBQUE7RUFDQSxHQUFBLGdCQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLE1BQUE7R0FDQSxPQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsV0FBQSxTQUFBO0dBQ0EsUUFBQSxVQUFBLEtBQUEsU0FBQSxVQUFBOztJQUVBLEdBQUEsWUFBQTtJQUNBLG1CQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLFdBQUEsR0FBQSxRQUFBO0lBQ0EsbUJBQUEsU0FBQTtJQUNBLG1CQUFBLGFBQUE7SUFDQSxtQkFBQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLFNBQUEsUUFBQTtLQUNBLElBQUEsSUFBQSxHQUFBLFVBQUEsUUFBQSxPQUFBO0tBQ0EsSUFBQSxLQUFBLENBQUEsR0FBQTtNQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLFVBQUEsS0FBQTtNQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTtJQUNBLE9BQUEsR0FBQSw2QkFBQTtLQUNBLEtBQUEsUUFBQTs7Ozs7RUFLQSxTQUFBLFdBQUE7R0FDQSxjQUFBLGFBQUEsZ0JBQUE7OztFQUdBLFNBQUEsYUFBQTtHQUNBLGNBQUEsYUFBQTs7O0VBR0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsSUFBQSxHQUFBLFlBQUEsTUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFNBQUEsV0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7OztFQUdBLFNBQUEsc0JBQUE7R0FDQSxJQUFBLEdBQUEsZUFBQSxPQUFBO0dBQ0EsT0FBQTs7Ozs7O0FDdklBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxXQUFBLGdCQUFBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBOztFQUVBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLFdBQUEsTUFBQTtHQUNBLFFBQUEsSUFBQSxNQUFBLFdBQUE7R0FDQSxJQUFBLElBQUEsV0FBQSxjQUFBLFFBQUE7R0FDQSxJQUFBLElBQUEsQ0FBQSxHQUFBO0lBQ0EsV0FBQSxjQUFBLE9BQUEsR0FBQTtVQUNBO0lBQ0EsV0FBQSxjQUFBLEtBQUE7OztHQUdBLElBQUEsV0FBQSxjQUFBLFVBQUEsR0FBQTtJQUNBLFdBQUEsZ0JBQUE7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7OztHQUdBOzs7O0FDMUNBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNJQUFBLFNBQUEsVUFBQSxRQUFBLFlBQUEsU0FBQSxRQUFBLG9CQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLE1BQUE7R0FDQSxPQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxXQUFBLFNBQUE7R0FDQSxXQUFBLGVBQUE7O0dBRUEsUUFBQSxVQUFBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsR0FBQSxZQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUEsR0FBQSxPQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsbUJBQUEsY0FBQSxHQUFBLE9BQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7SUFDQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsYUFBQTtJQUNBLG1CQUFBLG1CQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsV0FBQSxlQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxXQUFBLFNBQUEsVUFBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQSxXQUFBO0tBQ0EsSUFBQSxTQUFBLFVBQUEsR0FBQSxTQUFBLFNBQUE7TUFDQSxHQUFBLFdBQUE7O0tBRUEsUUFBQSxRQUFBLFVBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxHQUFBLFFBQUEsR0FBQTtPQUNBLEdBQUEsR0FBQSxTQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7UUFDQSxHQUFBLFNBQUEsS0FBQTtRQUNBLFdBQUEsZUFBQSxHQUFBOzs7OztLQUtBLFFBQUEsUUFBQSxTQUFBLFNBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7TUFDQSxJQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7T0FDQSxtQkFBQSxtQkFBQSxPQUFBLEtBQUE7Ozs7O0lBS0EsbUJBQUEsZUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QkEsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLEdBQUEsWUFBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxhQUFBLEtBQUEsR0FBQTs7R0FFQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7O0lBRUEsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLElBQUEsWUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTtJQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7SUFFQSxRQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBOztHQUVBLE9BQUE7Ozs7OztBQzNJQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0SkFBQSxVQUFBLFVBQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxTQUFBLG9CQUFBLGFBQUEsZUFBQSxZQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLGNBQUE7R0FDQSxZQUFBO0dBQ0EsWUFBQTtHQUNBLFVBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUEsQ0FBQSxHQUFBLEdBQUE7O0VBRUEsR0FBQSx1QkFBQTtFQUNBLEdBQUEsaUJBQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBLFdBQUEsU0FBQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsUUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOztHQUVBLFVBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQTtJQUNBLEdBQUEsWUFBQTtJQUNBOzs7Ozs7OztFQVFBLFNBQUEsZUFBQTs7R0FFQSxJQUFBLFdBQUE7SUFDQSxXQUFBOztJQUVBLFdBQUE7Ozs7OztFQU1BLFNBQUEsWUFBQTtHQUNBLEdBQUEsWUFBQTtHQUNBLEdBQUEsc0JBQUE7R0FDQSxHQUFBLHNCQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFVBQUE7O0dBRUEsR0FBQSxZQUFBLENBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBOzs7R0FHQSxHQUFBLGdCQUFBLENBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLGNBQUEsYUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxNQUFBOztHQUVBLElBQUEsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0dBQ0EsSUFBQSxJQUFBLENBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLE9BQUEsR0FBQTtVQUNBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQTs7R0FFQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGFBQUEsVUFBQTtHQUNBLEdBQUE7R0FDQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQTs7O0dBR0EsUUFBQSxTQUFBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0E7O0dBRUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsYUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBO0tBQ0EsR0FBQSxVQUFBLEtBQUEsSUFBQTs7OztFQUlBLFNBQUEsa0JBQUE7R0FDQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0tBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLEdBQUE7TUFDQSxhQUFBOztXQUVBO0tBQ0EsYUFBQTs7O0dBR0EsR0FBQSxRQUFBOztHQUVBLG1CQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBO0dBQ0EsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxFQUFBO0lBQ0EsTUFBQSxRQUFBO0lBQ0EsTUFBQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztPQUdBO0lBQ0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztLQUlBOzs7OztHQUtBLE9BQUE7R0FDQTs7Ozs7QUN0UEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMENBQUEsU0FBQSxRQUFBLGVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLE1BQUE7R0FDQSxNQUFBO0dBQ0EsV0FBQTtHQUNBLFdBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFdBQUEsU0FBQSxJQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxJQUFBO0tBQ0EsTUFBQTs7O0dBR0EsVUFBQSxXQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsSUFBQTtLQUNBLE1BQUE7OztHQUdBLGFBQUEsV0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsU0FBQSxTQUFBLE1BQUEsS0FBQTtLQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsSUFBQTtPQUNBLE9BQUEsR0FBQTs7TUFFQSxHQUFBLFVBQUEsVUFBQTs7Ozs7OztFQU9BOztFQUVBLFNBQUEsV0FBQTtHQUNBLGNBQUEsV0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFVBQUE7Ozs7Ozs7QUM3Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaURBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBO1VBQ0EsUUFBQTtZQUNBLFFBQUEsU0FBQSxPQUFBLE9BQUEsTUFBQSxTQUFBO2NBQ0EsS0FBQSxlQUFBLEtBQUE7Y0FDQSxLQUFBLE9BQUE7O1lBRUEsVUFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFNBQUE7OztZQUdBLFVBQUEsVUFBQTtjQUNBLE9BQUEsR0FBQTs7UUFFQSxrQkFBQSxVQUFBO1NBQ0EsSUFBQSxPQUFBO1VBQ0EsT0FBQTs7U0FFQSxHQUFBLE9BQUEsTUFBQSxLQUFBOztRQUVBLFlBQUEsVUFBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLFNBQUEsU0FBQSxNQUFBLElBQUE7V0FDQSxXQUFBLEtBQUEsR0FBQSxPQUFBO2tCQUNBLGNBQUEsT0FBQSxHQUFBLEtBQUE7V0FDQSxHQUFBLFdBQUE7OztRQUdBLFlBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0EsV0FBQSxLQUFBLEdBQUEsT0FBQTtVQUNBLEdBQUEsWUFBQTs7WUFFQSxNQUFBLFVBQUE7Y0FDQSxRQUFBLElBQUE7Y0FDQSxjQUFBLEtBQUEsU0FBQSxTQUFBO2dCQUNBLFFBQUEsSUFBQSxlQUFBLEdBQUE7Z0JBQ0EsR0FBQSxHQUFBLE9BQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxPQUFBLEdBQUE7a0JBQ0EsT0FBQSxHQUFBLDRCQUFBLENBQUEsR0FBQSxTQUFBLElBQUEsS0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7VUFlQSxNQUFBO1lBQ0EsT0FBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLEdBQUEsa0NBQUEsQ0FBQSxRQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUE7OztVQUdBLFVBQUE7VUFDQSxXQUFBOzs7UUFHQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBLE9BQUEsT0FBQSxNQUFBLEVBQUE7WUFDQSxjQUFBLFVBQUEsT0FBQSxPQUFBLElBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxTQUFBOzs7Y0FHQTtZQUNBLEdBQUEsU0FBQSxjQUFBLFVBQUE7Y0FDQSxPQUFBOzs7OztRQUtBLFNBQUEsV0FBQSxNQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsSUFBQTtRQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsR0FBQTtTQUNBLEtBQUEsT0FBQSxLQUFBO1NBQ0EsT0FBQTs7UUFFQSxHQUFBLE1BQUEsU0FBQTtTQUNBLElBQUEsWUFBQSxXQUFBLE1BQUEsTUFBQTtTQUNBLEdBQUEsVUFBQTtVQUNBLE9BQUE7Ozs7T0FJQSxPQUFBOzs7Ozs7QUM5RkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOEhBQUEsU0FBQSxRQUFBLFFBQUEsVUFBQSxnQkFBQSxhQUFBLGtCQUFBLG9CQUFBO0lBQ0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxPQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLEdBQUEsV0FBQSxjQUFBOzs7OztJQUtBLEdBQUEsT0FBQSxjQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsT0FBQTtJQUNBLFFBQUEsSUFBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLEdBQUEsUUFBQSxhQUFBLE9BQUEsR0FBQSw0QkFBQTtVQUNBLElBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQSxPQUFBLE9BQUE7O0lBRUEsR0FBQSxDQUFBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsR0FBQSxLQUFBLFFBQUE7TUFDQSxXQUFBO01BQ0EsYUFBQTtNQUNBLGtCQUFBO01BQ0EsWUFBQTtNQUNBLGVBQUE7TUFDQSxlQUFBO01BQ0EsbUJBQUE7TUFDQSxpQkFBQTtNQUNBLFFBQUE7TUFDQSxhQUFBOzs7Ozs7O0VBT0EsU0FBQSxjQUFBLE1BQUEsSUFBQTtHQUNBLElBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsTUFBQSxJQUFBO0tBQ0EsUUFBQTtXQUNBO0tBQ0EsSUFBQSxLQUFBLFlBQUEsQ0FBQTtNQUNBLFFBQUEsY0FBQSxLQUFBLFVBQUE7OztHQUdBLE9BQUE7R0FDQTs7O0VBR0EsT0FBQSxPQUFBLGlCQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxFQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBLEVBQUE7O0tBRUE7Ozs7O0FDM0RBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsWUFBQSxnQkFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsYUFBQTs7SUFFQSxHQUFBLFNBQUE7SUFDQSxHQUFBLFVBQUE7TUFDQSxXQUFBO1FBQ0Esa0JBQUEsVUFBQTtVQUNBLEdBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsU0FBQSxLQUFBO1lBQ0EsZUFBQTs7VUFFQSxlQUFBLFdBQUEsYUFBQSxVQUFBLEdBQUE7VUFDQSxlQUFBLFdBQUEsVUFBQSxVQUFBLEdBQUE7Ozs7SUFJQSxTQUFBLFlBQUEsR0FBQTtNQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTtNQUNBLEdBQUEsT0FBQSxDQUFBLEVBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQTs7O0lBR0EsU0FBQSxlQUFBLElBQUE7TUFDQSxZQUFBLElBQUE7TUFDQSxHQUFBLElBQUEsU0FBQTtRQUNBLFFBQUEsUUFBQSxJQUFBLFVBQUEsU0FBQSxNQUFBO1VBQ0EsWUFBQSxNQUFBO1VBQ0EsZUFBQTs7O0tBR0E7SUFDQSxTQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxXQUFBLFNBQUEsS0FBQSxHQUFBLE9BQUEsU0FBQSxFQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLElBQUE7TUFDQSxHQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxDQUFBLEVBQUE7T0FDQSxRQUFBOzs7S0FHQSxPQUFBOztJQUVBLE9BQUE7Ozs7O0FDN0NBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhGQUFBLFNBQUEsT0FBQSxRQUFBLGdCQUFBLFlBQUEsWUFBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLE1BQUE7R0FDQSxRQUFBLFVBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLGlCQUFBO0tBQ0EsT0FBQSxHQUFBLHdCQUFBLENBQUEsT0FBQTs7UUFFQTtLQUNBLGVBQUEsWUFBQTtLQUNBLGVBQUEsWUFBQTtLQUNBLE9BQUEsR0FBQTs7Ozs7RUFLQSxPQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsZUFBQSxRQUFBLGFBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQTtHQUNBLEdBQUEsYUFBQTs7RUFFQSxPQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsZUFBQSxRQUFBLFVBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQTtHQUNBLEdBQUEsVUFBQTs7Ozs7QUM3QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEhBQUEsU0FBQSxPQUFBLFVBQUEsYUFBQSxPQUFBLGVBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxXQUFBLGtCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBOztFQUVBLEdBQUEsZUFBQSxTQUFBLFNBQUE7R0FDQSxNQUFBLGFBQUE7OztFQUdBLFNBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxTQUFBO0dBQ0EsTUFBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtJQUNBLE9BQUEsUUFBQTs7TUFFQSxNQUFBLFNBQUEsU0FBQTtJQUNBLE9BQUEsTUFBQSx3Q0FBQTs7O0VBR0EsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLGtCQUFBO0lBQ0EsTUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQTtNQUNBLE9BQUEsR0FBQTs7S0FFQSxPQUFBLFFBQUE7T0FDQSxNQUFBLFNBQUEsU0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLGFBQUEsSUFBQTtNQUNBLFlBQUE7S0FDQTtFQUNBLFNBQUEsWUFBQTtHQUNBLFdBQUEsY0FBQSxDQUFBLFdBQUE7R0FDQSxjQUFBLFdBQUEsV0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7RUFFQSxXQUFBLGNBQUE7RUFDQSxPQUFBLE9BQUEsVUFBQTtHQUNBLE9BQUEsV0FBQTtLQUNBLFNBQUEsUUFBQTtHQUNBLE9BQUEsZUFBQSxXQUFBOztFQUVBLE9BQUEsT0FBQSxxQkFBQSxTQUFBLEVBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLE9BQUEsV0FBQSxFQUFBLE9BQUEsU0FBQSxTQUFBLFNBQUEsT0FBQTtLQUNBLEdBQUEsY0FBQTs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFlBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsWUFBQSxPQUFBLFNBQUEsQ0FBQSxhQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7Ozs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUxBQUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxZQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUEsb0JBQUEsTUFBQSxXQUFBLGFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE1BQUE7O0VBRUEsR0FBQSxhQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsa0JBQUEsS0FBQSxTQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQSxtQkFBQTtFQUNBLEdBQUEsa0JBQUEsbUJBQUE7RUFDQSxHQUFBLHNCQUFBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLFlBQUEsbUJBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBOztFQUVBLEdBQUEsVUFBQTtHQUNBLGFBQUE7Ozs7RUFJQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsbUJBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsR0FBQSxZQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxHQUFBLGdCQUFBLEtBQUEsU0FBQSxXQUFBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxPQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLGNBQUE7OztLQUdBLGFBQUEsR0FBQSxVQUFBLE1BQUE7S0FDQTtLQUNBLElBQUEsT0FBQSxPQUFBLE1BQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxHQUFBLDBCQUFBO0lBQ0EsR0FBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBO0lBQ0EsS0FBQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsU0FBQSxTQUFBLEVBQUE7S0FDQSxjQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxTQUFBLE1BQUE7R0FDQSxHQUFBLFdBQUEsZUFBQTtHQUNBLGdCQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsWUFBQSxHQUFBLGFBQUEsT0FBQSxpQkFBQTs7O0VBR0EsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7O0dBRUEsR0FBQTs7R0FFQSxXQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLEdBQUEsV0FBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBOzs7R0FHQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7OztHQUdBLE9BQUEsR0FBQSxLQUFBLFFBQUEsR0FBQSxXQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxHQUFBLGdCQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsTUFBQSxjQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQTtJQUNBLE1BQUEsR0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLFFBQUEsU0FBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsWUFBQSxPQUFBLFdBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsUUFBQSxPQUFBO0lBQ0EsZUFBQTs7Ozs7RUFLQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLE9BQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxVQUFBLENBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUE7Ozs7RUFJQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBLFFBQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBOztVQUVBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsVUFBQSxTQUFBLFNBQUE7S0FDQSxRQUFBLFdBQUE7O0lBRUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMkJBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBLFFBQUEsR0FBQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUEsS0FBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxtQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxXQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7OztFQUdBLFNBQUEsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxlQUFBLEdBQUEsUUFBQSxZQUFBLE1BQUE7S0FDQSxHQUFBLGFBQUE7O0lBRUEsVUFBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxVQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsYUFBQSxPQUFBOztHQUVBLEdBQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxTQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7OztFQUtBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBOzs7R0FHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsT0FBQSxVQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7O0dBRUEsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7OztNQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTs7TUFFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O01BR0E7WUFDQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7Ozs7R0FLQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFlBQUEsU0FBQTtJQUNBLE1BQUEsY0FBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7O0dBR0EsSUFBQSxFQUFBLEtBQUE7SUFDQSxJQUFBLEVBQUEsS0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUE7SUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGtCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBOzs7O0VBSUEsT0FBQSxPQUFBLDBCQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLElBQUE7R0FDQSxJQUFBLEVBQUE7SUFDQSxhQUFBLEVBQUE7UUFDQTtJQUNBLGFBQUE7SUFDQTtHQUNBLEdBQUE7Ozs7Ozs7Ozs7Ozs7R0FhQSxJQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtLQUNBLE9BQUEsR0FBQSxtQ0FBQTtNQUNBLElBQUEsRUFBQTtNQUNBLE1BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7O1dBRUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxJQUFBLEVBQUE7TUFDQSxNQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLEVBQUE7S0FDQSxNQUFBLEVBQUE7Ozs7Ozs7RUFPQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7O0dBUUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEdBQUE7SUFDQSxDQUFBLEtBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEdBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxTQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DQSxTQUFBLGdCQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxXQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxLQUFBLFdBQUE7OztZQUdBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxTQUFBLEtBQUEsR0FBQTs7S0FFQSxJQUFBLENBQUEsR0FBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsUUFBQTtPQUNBLEdBQUEsVUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7WUFFQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxtQkFBQTthQUNBO09BQ0EsT0FBQSxNQUFBLGdDQUFBLElBQUEsUUFBQSxXQUFBOzs7Ozs7Ozs7QUNsbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlHQUFBLFVBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGVBQUEsY0FBQTs7O0VBR0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxlQUFBO0lBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsc0JBQUE7O0VBRUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxRQUFBO0dBQ0EsUUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7S0FDQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7O0lBR0EsU0FBQSxVQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxTQUFBLE9BQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUE7TUFDQSxRQUFBOzs7T0FHQSxRQUFBLFFBQUEsSUFBQSxPQUFBLFNBQUEsTUFBQTtTQUNBLEdBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEtBQUE7O0lBRUEsR0FBQSxhQUFBLEdBQUEsTUFBQTs7Ozs7RUFLQSxTQUFBLE9BQUEsV0FBQTtHQUNBLEdBQUEsU0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O0dBR0E7O0VBRUEsU0FBQSxlQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsYUFBQSxHQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7T0FDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO1FBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtTQUNBLGFBQUE7O1FBRUEsYUFBQTtRQUNBLEdBQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7TUFHQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUE7Ozs7R0FJQSxhQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtNQUNBLEdBQUE7TUFDQSxhQUFBOztLQUVBLEdBQUE7S0FDQSxhQUFBOztJQUVBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7O0dBRUEsR0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGVBQUE7R0FDQSxHQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtLQUNBLEdBQUEsU0FBQSxLQUFBOzs7OztFQUtBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLFNBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBOzs7RUFHQSxTQUFBLGtCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUEsR0FBQTtJQUNBLFFBQUEsUUFBQSxJQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLEtBQUEsV0FBQSxpQkFBQSxTQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO09BQ0EsSUFBQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7QUMzSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0hBQUEsU0FBQSxZQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsZUFBQSxRQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFdBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0lBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLElBQUEsUUFBQTtNQUNBLE1BQUE7TUFDQSxTQUFBO01BQ0EsT0FBQSxJQUFBLEtBQUEsR0FBQSxLQUFBO01BQ0EsUUFBQSxHQUFBLEtBQUE7TUFDQSxLQUFBOztLQUVBLElBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTs7O0tBR0EsSUFBQSxDQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOzs7O0dBSUEsYUFBQTs7O0VBR0EsU0FBQSxXQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSwwQ0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsT0FBQSxNQUFBLDhDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLEdBQUEsS0FBQSxpQkFBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSxtREFBQTtJQUNBLE9BQUE7O0dBRUEsV0FBQSxpQkFBQTtHQUNBLEdBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztJQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQTtNQUNBOztJQUVBLFFBQUEsS0FBQTtLQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O0dBR0EsSUFBQSxVQUFBLGFBQUEsUUFBQSxTQUFBLEtBQUEsZUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBLEtBQUEsd0JBQUE7SUFDQSxNQUFBO0lBQ0EsS0FBQTtNQUNBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsV0FBQSxpQkFBQTtJQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtNQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsZ0JBQUE7T0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFdBQUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxRQUFBOztRQUVBLGFBQUEsWUFBQTtjQUNBLEdBQUEsUUFBQSxLQUFBLFVBQUEsRUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFFBQUEsYUFBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUE7WUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBO2tCQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTthQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBOzs7Ozs7ZUFNQTs7U0FFQSxJQUFBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBOztTQUVBLElBQUEsYUFBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsUUFBQSxJQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsYUFBQSxZQUFBO1VBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7SUFPQSxHQUFBLGNBQUE7SUFDQSxhQUFBO0lBQ0EsSUFBQSxhQUFBLGNBQUEsUUFBQTtLQUNBLGNBQUEsYUFBQTs7TUFFQSxTQUFBLFVBQUE7SUFDQSxXQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztFQUlBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxJQUFBLGFBQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQTtJQUNBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsS0FBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7TUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O0tBRUEsV0FBQSxLQUFBLEtBQUEsS0FBQTtXQUNBO0tBQ0EsT0FBQSxNQUFBLCtCQUFBO0tBQ0E7OztHQUdBLFFBQUEsSUFBQTtHQUNBLFlBQUEsS0FBQSxpQkFBQSxHQUFBLFVBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsTUFBQTtLQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQSxhQUFBO0tBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQzNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRUFBQSxVQUFBLFFBQUEsY0FBQSxhQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLFdBQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTs7OztHQUlBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxNQUFBO0lBQ0EsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxTQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLGFBQUE7S0FDQSxNQUFBOztJQUVBLElBQUEsVUFBQTtJQUNBLElBQUEsYUFBQTtLQUNBLFNBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7T0FDQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztPQUVBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtRQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O09BR0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO09BQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7VUFFQTtPQUNBLFFBQUEsS0FBQTs7OztZQUlBO01BQ0EsT0FBQSxNQUFBLCtCQUFBO01BQ0E7OztJQUdBLFFBQUEsUUFBQSxHQUFBLFlBQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsZUFBQTtNQUNBLElBQUEsV0FBQTtNQUNBLElBQUEsT0FBQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxXQUFBLEdBQUEsV0FBQSxLQUFBLE1BQUE7O01BRUEsSUFBQSxRQUFBO09BQ0EsVUFBQTtPQUNBLFNBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxlQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsS0FBQSxNQUFBO09BQ0EsYUFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBO09BQ0EsWUFBQTtPQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUEsTUFBQTs7TUFFQSxJQUFBLGFBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLEtBQUE7T0FDQSxXQUFBLEtBQUEsSUFBQTs7TUFFQSxNQUFBLGFBQUE7TUFDQSxPQUFBLEtBQUE7OztJQUdBLEdBQUEsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFNBQUEsRUFBQTtLQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxZQUFBOzs7SUFHQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7S0FDQSxZQUFBLEtBQUEsaUJBQUEsU0FBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFVBQUEsS0FBQTtNQUNBLElBQUEsT0FBQSxNQUFBO09BQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO09BQ0EsYUFBQTtPQUNBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQTtPQUNBLEdBQUEsT0FBQTs7TUFFQSxHQUFBLFVBQUE7O09BRUEsVUFBQSxVQUFBO0tBQ0EsSUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7S0FHQSxHQUFBLFVBQUE7Ozs7Ozs7O0FDdkdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUEsT0FBQSxLQUFBLEdBQUEsWUFBQTs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSEFBQSxTQUFBLFFBQUEsUUFBQSxtQkFBQSxTQUFBLGFBQUEsYUFBQSxPQUFBOzs7UUFHQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxTQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxtQkFBQSxhQUFBOztRQUVBOztRQUVBLFNBQUEsVUFBQTtVQUNBOzs7UUFHQSxTQUFBLFdBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBO1lBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsRUFBQTtVQUNBLEdBQUEsWUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxtQkFBQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztVQUVBO1lBQ0EsYUFBQTs7O1FBR0EsT0FBQSxPQUFBLGdCQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUE7VUFDQSxHQUFBLE9BQUEsRUFBQSxZQUFBLGFBQUE7WUFDQSxHQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUE7Y0FDQSxHQUFBLEVBQUEsTUFBQTtnQkFDQSxtQkFBQSxhQUFBLEVBQUEsTUFBQTs7a0JBRUE7a0JBQ0EsbUJBQUEsYUFBQTs7Y0FFQTs7O2NBR0E7WUFDQSxHQUFBLE9BQUEsRUFBQSxjQUFBLFlBQUE7Y0FDQSxHQUFBLEVBQUEsV0FBQSxPQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxXQUFBLEdBQUEsTUFBQTs7a0JBRUE7Z0JBQ0EsbUJBQUEsYUFBQTs7O1lBR0E7O1VBRUEsYUFBQSx1QkFBQTtVQUNBLGFBQUE7VUFDQTs7O1FBR0EsU0FBQSxRQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtjQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQSxjQUFBLEdBQUE7Y0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBOztVQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7UUFFQSxTQUFBLGNBQUEsSUFBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7YUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsY0FBQSxJQUFBO2VBQ0EsUUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBOzs7VUFHQSxPQUFBOztRQUVBLFNBQUEsZUFBQSxTQUFBO09BQ0EsSUFBQSxRQUFBO09BQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtPQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtPQUNBLElBQUEsUUFBQSxHQUFBLFVBQUE7T0FDQSxJQUFBLE9BQUEsUUFBQTs7T0FFQSxRQUFBO09BQ0EsS0FBQTs7U0FFQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtTQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtjQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7U0FDQSxNQUFBLFVBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7U0FFQSxNQUFBLFdBQUE7VUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtVQUNBLFNBQUE7V0FDQSxPQUFBO1dBQ0EsTUFBQTs7O1NBR0E7Ozs7T0FJQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFVBQUEsU0FBQTtRQUNBLE1BQUEsY0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQSxRQUFBLFdBQUE7VUFDQSxVQUFBLENBQUEsS0FBQTtVQUNBLFVBQUE7O1NBRUEsT0FBQTs7O09BR0EsT0FBQTs7UUFFQSxTQUFBLGNBQUE7VUFDQSxHQUFBLFVBQUEsU0FBQTtVQUNBLEdBQUEsVUFBQTs7UUFFQSxTQUFBLGdCQUFBO1VBQ0E7T0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLFNBQUEsWUFBQTtVQUNBOzs7Ozs7OztBQzNJQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvR0FBQSxTQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUEsZUFBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFdBQUE7TUFDQSxHQUFBLFdBQUE7OztNQUdBLFNBQUEsaUJBQUEsSUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxZQUFBO1VBQ0EsYUFBQSxhQUFBLElBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTs7O1FBR0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUEsYUFBQTtRQUNBLGFBQUE7O01BRUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxhQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsU0FBQSxLQUFBLFFBQUEsS0FBQSxnQkFBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7S0FFQSxPQUFBOztJQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsZUFBQSxPQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7S0FDQSxPQUFBLFVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztNQUVBLFNBQUEsVUFBQTtRQUNBLElBQUEsT0FBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLFlBQUEsU0FBQSxVQUFBO1VBQ0EsR0FBQSxVQUFBLFdBQUE7WUFDQTs7OztRQUlBLEdBQUEsUUFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBLE9BQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7O01BRUEsU0FBQSxXQUFBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsY0FBQSxDQUFBLEdBQUEsS0FBQSxLQUFBO1lBQ0EsY0FBQSxhQUFBLFdBQUE7WUFDQSxPQUFBOztNQUVBLElBQUEsYUFBQTtPQUNBLE1BQUE7O01BRUEsSUFBQSxVQUFBO01BQ0EsSUFBQSxhQUFBO09BQ0EsU0FBQTtNQUNBLEdBQUEsVUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtTQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O1NBRUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO1VBQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7U0FHQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7U0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztZQUVBO2dCQUNBLEdBQUEsR0FBQSxLQUFBLEtBQUE7a0JBQ0EsS0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBO2tCQUNBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtXQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O29CQUVBO21CQUNBLFFBQUEsS0FBQTs7Ozs7OztjQU9BO1FBQ0EsT0FBQSxNQUFBLCtCQUFBO1FBQ0E7OztNQUdBLFFBQUEsUUFBQSxHQUFBLFlBQUEsVUFBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsZUFBQTtRQUNBLElBQUEsV0FBQTtRQUNBLElBQUEsT0FBQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGFBQUE7U0FDQSxXQUFBLEdBQUEsV0FBQSxLQUFBLE1BQUE7O1FBRUEsSUFBQSxRQUFBO1NBQ0EsVUFBQTtTQUNBLFNBQUEsR0FBQSxXQUFBLEtBQUE7U0FDQSxlQUFBLEdBQUEsV0FBQSxLQUFBO1NBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsS0FBQSxNQUFBO1NBQ0EsYUFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBO1NBQ0EsWUFBQTtTQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUEsTUFBQTs7UUFFQSxJQUFBLGFBQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLEtBQUE7U0FDQSxXQUFBLEtBQUEsSUFBQTs7UUFFQSxNQUFBLGFBQUE7UUFDQSxPQUFBLEtBQUE7OztNQUdBLEdBQUEsS0FBQSxTQUFBO01BQ0EsR0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQTs7O01BR0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLGlCQUFBLFNBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxJQUFBLE9BQUEsTUFBQTtTQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtTQUNBLGFBQUE7U0FDQSxPQUFBLEdBQUE7U0FDQSxHQUFBLE9BQUE7U0FDQSxHQUFBLE9BQUE7O1FBRUEsR0FBQSxVQUFBOztTQUVBLFVBQUEsVUFBQTtPQUNBLElBQUEsU0FBQSxTQUFBO1FBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O09BR0EsR0FBQSxVQUFBOzs7O01BSUEsU0FBQSxjQUFBOzs7Ozs7Ozs7O0tBVUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxHQUFBLE1BQUEsRUFBQTtRQUNBLEdBQUEsV0FBQSxFQUFBLGVBQUE7UUFDQTtNQUNBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1FBQ0EsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsS0FBQSxNQUFBO1FBQ0EsR0FBQSxDQUFBLEdBQUEsa0JBQUE7VUFDQSxHQUFBLGNBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsYUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxVQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLGdCQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFlBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsV0FBQSxHQUFBLFdBQUEsRUFBQSxhQUFBOztVQUVBLGNBQUEsYUFBQSxnQkFBQTtlQUNBOzs7Ozs7Ozs7OztBQ3pLQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxTQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTs7TUFFQSxHQUFBLE9BQUE7O01BRUE7O01BRUEsU0FBQSxVQUFBO1FBQ0EsWUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0EsR0FBQSxPQUFBO1lBQ0E7Ozs7TUFJQSxTQUFBLGFBQUE7UUFDQSxRQUFBLElBQUEsR0FBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsS0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBOzs7Ozs7O0FDcEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtLQUFBLFNBQUEsUUFBQSxjQUFBLGFBQUEsU0FBQSxRQUFBLFNBQUEsYUFBQSxRQUFBLGFBQUEsY0FBQSxtQkFBQTs7Ozs7Ozs7Ozs7Ozs7O1FBZUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsa0JBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHNCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEsdUJBQUE7UUFDQSxHQUFBLHlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQTs7UUFFQSxHQUFBLFFBQUEsYUFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsY0FBQTtVQUNBLE1BQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1CQTs7UUFFQSxTQUFBLFVBQUE7O1VBRUEsYUFBQTs7UUFFQSxTQUFBLFVBQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxXQUFBOztRQUVBLFNBQUEsZ0JBQUEsUUFBQTtTQUNBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztTQUdBLE9BQUE7O1FBRUEsU0FBQSxVQUFBO1dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7Y0FDQSxHQUFBLFlBQUEsbUJBQUE7Y0FDQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztRQU1BLFNBQUEscUJBQUE7VUFDQSxHQUFBLGdCQUFBLENBQUEsR0FBQTtVQUNBLEdBQUEsR0FBQSxjQUFBO1lBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsVUFBQTtZQUNBLFlBQUEsT0FBQSxlQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxZQUFBO2NBQ0EsR0FBQSxvQkFBQSxJQUFBLEdBQUEsa0JBQUE7Ozs7O1FBS0EsU0FBQSxpQkFBQSxTQUFBO1VBQ0EsT0FBQSxHQUFBLGtCQUFBLFFBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTs7UUFFQSxTQUFBLGdCQUFBLFVBQUEsS0FBQTtVQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsTUFBQSxJQUFBOztnQkFFQSxHQUFBLFFBQUEsU0FBQTtrQkFDQSxLQUFBLE9BQUEsS0FBQTtrQkFDQSxHQUFBLGlCQUFBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLE9BQUE7a0JBQ0EsR0FBQSxrQkFBQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxNQUFBOzs7Y0FHQSxnQkFBQSxVQUFBLEtBQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsa0JBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGtCQUFBLE9BQUEsS0FBQTtZQUNBLGdCQUFBLFVBQUEsR0FBQTs7Y0FFQTtZQUNBLEdBQUEsa0JBQUEsS0FBQTtZQUNBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO2NBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7Z0JBRUE7Z0JBQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7OztRQU1BLFNBQUEsZUFBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxNQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQTtZQUNBLGVBQUEsTUFBQTs7O1FBR0EsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLHFCQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsaUJBQUEsT0FBQSxLQUFBOztjQUVBO1lBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7UUFHQSxTQUFBLHVCQUFBLEtBQUE7VUFDQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxRQUFBLENBQUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7VUFHQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtZQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2VBRUEsR0FBQSxHQUFBLGlCQUFBLFNBQUEsR0FBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO2tCQUNBLFNBQUEsTUFBQSxLQUFBO2tCQUNBLGdCQUFBLE1BQUEsR0FBQTs7Y0FFQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEdBQUEsbUJBQUE7O2NBRUE7WUFDQSxHQUFBLE9BQUEsS0FBQTs7O1FBR0EsU0FBQSxnQkFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFNBQUEsTUFBQSxLQUFBOztVQUVBLEdBQUEsT0FBQSxLQUFBO1VBQ0EsR0FBQSxtQkFBQTs7UUFFQSxTQUFBLFVBQUEsS0FBQTtVQUNBLEdBQUEsV0FBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQSxLQUFBO1lBQ0EsZ0JBQUEsTUFBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxHQUFBLEdBQUEsYUFBQTtZQUNBOztVQUVBLEdBQUEsZUFBQTtVQUNBLEdBQUEsT0FBQSxHQUFBLFlBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLFFBQUEsK0JBQUE7WUFDQSxPQUFBLEdBQUEsa0JBQUEsQ0FBQSxNQUFBLFNBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpR0FBQSxVQUFBLFFBQUEsVUFBQSxZQUFBLFlBQUEsZ0JBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQSxTQUFBLEtBQUE7SUFDQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBLEtBQUE7Ozs7OztBQ1ZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJKQUFBLFVBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQSxZQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsZ0JBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxrQkFBQTs7RUFFQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLE9BQUE7R0FDQSxXQUFBOzs7O0VBSUEsR0FBQSxVQUFBO0dBQ0EsVUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFVBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUEsU0FBQSxJQUFBLEtBQUE7S0FDQSxPQUFBLEdBQUEsaUNBQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTs7SUFFQSxTQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsaUNBQUEsQ0FBQSxHQUFBLEdBQUEsTUFBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLEdBQUE7O09BRUEsR0FBQSxVQUFBLFVBQUE7Ozs7OztHQU1BLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQTs7SUFFQSxXQUFBLFNBQUEsSUFBQSxLQUFBOztLQUVBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxXQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxlQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBOztPQUVBLEdBQUEsVUFBQSxhQUFBOzs7Ozs7O0dBT0EsT0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7Ozs7RUFLQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxRQUFBO0lBQ0EsS0FBQTtNQUNBLE9BQUEsR0FBQTtLQUNBO0lBQ0EsS0FBQTtNQUNBLE9BQUEsR0FBQTtLQUNBO0lBQ0EsS0FBQTtNQUNBLEdBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBLGdDQUFBO1NBQ0EsR0FBQSxPQUFBLE9BQUE7OztVQUdBO1FBQ0EsT0FBQSxHQUFBOztLQUVBO0lBQ0EsS0FBQTs7S0FFQTtJQUNBOzs7OztFQUtBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsV0FBQTtJQUNBLEdBQUEsT0FBQSxTQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsU0FBQTs7T0FFQTtJQUNBLEdBQUEsU0FBQSxTQUFBOztHQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOzs7UUFHQSxHQUFBLFFBQUEsS0FBQSxRQUFBLGtDQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7UUFFQSxHQUFBLFFBQUEsS0FBQSxRQUFBLCtCQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7Ozs7OztBQzNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLG9CQUFBLGFBQUEsZ0JBQUEsV0FBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLFdBQUE7RUFDQTs7RUFFQSxlQUFBLGlCQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO0dBQ0EsSUFBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLEdBQUEsVUFBQSxTQUFBLFlBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFlBQUEsU0FBQSxJQUFBO0tBQ0EsR0FBQSxPQUFBLElBQUEsU0FBQSxZQUFBO01BQ0EsYUFBQSxJQUFBLE1BQUE7Ozs7UUFJQSxHQUFBLEdBQUEsVUFBQSxNQUFBO0lBQ0EsYUFBQSxHQUFBLFVBQUEsTUFBQTs7R0FFQSxtQkFBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLHFDQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsU0FBQSxjQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsVUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLFFBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxhQUFBO0tBQ0EsR0FBQSxXQUFBOztRQUVBO0tBQ0EsR0FBQSxXQUFBOzs7O0VBSUEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUMzR0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUVBQUEsVUFBQSxZQUFBLFlBQUEsZ0JBQUE7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxhQUFBOzs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwySEFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLG9CQUFBLGFBQUEsZ0JBQUEsT0FBQTs7RUFFQSxJQUFBLEtBQUE7O0lBRUEsR0FBQSxRQUFBO0VBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0E7SUFDQSxHQUFBLFVBQUE7TUFDQSxRQUFBO1FBQ0EsVUFBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBOztJQUVBLGtCQUFBLFVBQUE7S0FDQSxJQUFBLE9BQUE7TUFDQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxTQUFBLEtBQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxJQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxXQUFBLEtBQUEsR0FBQSxNQUFBO09BQ0EsR0FBQSxXQUFBOzs7O0lBSUEsWUFBQSxTQUFBLE1BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxlQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO01BQ0EsV0FBQSxLQUFBLEdBQUEsTUFBQTtNQUNBLEdBQUEsWUFBQTs7OztNQUlBLFVBQUE7OztFQUdBOzs7RUFHQSxTQUFBLFFBQUE7OztFQUdBLFNBQUEsV0FBQSxNQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLEtBQUEsT0FBQSxLQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLE1BQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxXQUFBLE1BQUEsTUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxTQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUMvSkEsQ0FBQSxVQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLGVBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsZUFBQTs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1JQUFBLFNBQUEsUUFBQSxTQUFBLFVBQUEsV0FBQSxXQUFBLGdCQUFBLG9CQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBLE1BQUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxPQUFBO0VBQ0EsR0FBQSxPQUFBLE1BQUEsR0FBQSxTQUFBO0VBQ0EsR0FBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBO0dBQ0EsS0FBQTs7RUFFQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxZQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxJQUFBLE9BQUEsT0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFVBQUEsTUFBQSxRQUFBLEtBQUE7TUFDQSxJQUFBLEdBQUEsVUFBQSxNQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsTUFBQTtPQUNBLEdBQUEsU0FBQTs7O1dBR0EsSUFBQSxDQUFBLEdBQUEsUUFBQTtLQUNBLEdBQUEsU0FBQTs7O0lBR0EsSUFBQSxHQUFBLFVBQUEsUUFBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQTtNQUNBLEdBQUEsU0FBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxVQUFBLE9BQUEsUUFBQSxLQUFBO09BQ0EsSUFBQSxHQUFBLFVBQUEsT0FBQSxHQUFBLFVBQUEsT0FBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLGVBQUE7OztZQUdBLElBQUEsQ0FBQSxHQUFBLGNBQUE7TUFDQSxHQUFBLGVBQUE7O1dBRUEsSUFBQSxDQUFBLEdBQUEsY0FBQTtLQUNBLEdBQUEsZUFBQTs7SUFFQSxRQUFBLEdBQUEsTUFBQSxHQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxRQUFBO0lBQ0EsS0FBQSxDQUFBO0lBQ0EsS0FBQTs7OztFQUlBLFNBQUEsY0FBQTs7R0FFQSxJQUFBLE9BQUEsUUFBQSxRQUFBLHVCQUFBO0lBQ0EsT0FBQSxHQUFBO1VBQ0E7SUFDQSxPQUFBLEdBQUE7Ozs7O0VBS0EsU0FBQSxRQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEscUJBQUE7R0FDQSxPQUFBLEdBQUEsdUJBQUE7SUFDQSxLQUFBLEdBQUEsUUFBQTs7R0FFQSxTQUFBLFVBQUE7S0FDQTs7O0dBR0E7O0VBRUEsU0FBQSxhQUFBLEtBQUEsR0FBQTtHQUNBLElBQUEsSUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxTQUFBLGFBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQTtVQUNBO0lBQ0EsT0FBQSxNQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsZUFBQSxvQkFBQSxHQUFBLFVBQUEsSUFBQSxHQUFBLFFBQUEsS0FBQSxHQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLFFBQUEsTUFBQTtHQUNBLEdBQUEsT0FBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLE9BQUEsR0FBQSx1QkFBQTtLQUNBLE1BQUE7O01BRUE7Ozs7RUFJQSxTQUFBLFVBQUEsUUFBQTtHQUNBLEdBQUEsU0FBQSxVQUFBO0dBQ0EsU0FBQSxXQUFBO0lBQ0EsT0FBQSxHQUFBLHVCQUFBO0tBQ0EsUUFBQSxHQUFBOztNQUVBOzs7RUFHQSxTQUFBLFFBQUEsTUFBQSxRQUFBO0dBQ0EsZUFBQSxpQkFBQSxHQUFBLFVBQUEsSUFBQSxHQUFBLE1BQUEsR0FBQSxRQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0E7SUFDQSxHQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxLQUFBO0tBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQSxRQUFBLEtBQUE7TUFDQSxJQUFBLEdBQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUE7T0FDQSxHQUFBLFVBQUEsR0FBQSxLQUFBO09BQ0EsTUFBQSxHQUFBLFFBQUE7Ozs7O0lBS0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7S0FDQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsUUFBQTtLQUNBLElBQUEsR0FBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7T0FDQSxXQUFBOzs7S0FHQSxHQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxXQUFBLEtBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxXQUFBLEtBQUE7OztJQUdBLEdBQUEsZ0JBQUE7S0FDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLGNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQSxHQUFBLEtBQUE7OztJQUdBO0lBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxNQUFBLEdBQUEsVUFBQSxPQUFBLFlBQUE7Ozs7Ozs7RUFPQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsU0FBQSxtQkFBQSxlQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLFNBQUE7SUFDQSxJQUFBLEdBQUEsUUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBLFdBQUE7Ozs7OztHQU1BLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxNQUFBOztNQUVBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztZQUlBO01BQ0EsTUFBQSxRQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7Ozs7S0FJQTs7R0FFQSxPQUFBO0dBQ0E7OztFQUdBLEdBQUEsb0JBQUEsU0FBQSxlQUFBLGNBQUE7O0dBRUEsUUFBQSxHQUFBLE1BQUEsR0FBQTs7Ozs7O0FDNU9BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFVBQUEsU0FBQSxNQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLHFCQUFBOztJQUVBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O0dBR0E7Ozs7OztBQ2pCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5REFBQSxTQUFBLFlBQUEsUUFBQSxPQUFBLE9BQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGdCQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBOzs7UUFHQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7O1VBRUEsR0FBQSxNQUFBLGtCQUFBOzs7O1FBSUEsU0FBQSxTQUFBO1VBQ0EsTUFBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLFFBQUEsSUFBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLFdBQUEsYUFBQSxNQUFBLFFBQUEsWUFBQSxXQUFBLGFBQUE7YUFDQSxNQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsTUFBQSx3Q0FBQTs7Ozs7OztBQ2hDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtFQUFBLFNBQUEsUUFBQSxhQUFBLGtCQUFBLG9CQUFBOzs7RUFHQSxJQUFBLE9BQUE7R0FDQSxVQUFBO0VBQ0EsSUFBQSxPQUFBLGFBQUEsS0FBQTtHQUNBLE9BQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsSUFBQSxTQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxXQUFBOztHQUVBLFNBQUE7R0FDQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztFQWlCQSxHQUFBLGNBQUEsRUFBQSxVQUFBLG1GQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsaUJBQUE7R0FDQSxNQUFBO0dBQ0EsY0FBQTs7RUFFQSxHQUFBLFlBQUE7R0FDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7O0dBRUEsV0FBQTtJQUNBLEtBQUEsQ0FBQTtJQUNBLEtBQUEsQ0FBQTs7O0VBR0EsR0FBQSxXQUFBO0dBQ0EsUUFBQTs7RUFFQSxHQUFBLGVBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7Ozs7RUFJQSxJQUFBLFlBQUEsRUFBQTtFQUNBLFVBQUEsWUFBQTtFQUNBLFVBQUEsYUFBQSxXQUFBO0dBQ0EsRUFBQSxLQUFBLFdBQUEsTUFBQTs7RUFFQSxVQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsWUFBQSxFQUFBLFFBQUEsT0FBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsUUFBQSxPQUFBLEtBQUEsa0NBQUE7R0FDQSxLQUFBLGNBQUE7R0FDQSxLQUFBLFFBQUE7R0FDQSxFQUFBLFNBQUEsd0JBQUE7R0FDQSxFQUFBLFNBQUEsWUFBQSxXQUFBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLFNBQUE7TUFDQSxJQUFBLFlBQUEsR0FBQTtNQUNBLEdBQUEsVUFBQTtZQUNBO01BQ0EsSUFBQSxTQUFBLEdBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUE7Ozs7R0FJQSxPQUFBOztFQUVBLElBQUEsV0FBQSxFQUFBO0VBQ0EsU0FBQSxZQUFBO0VBQ0EsU0FBQSxhQUFBLFdBQUE7R0FDQSxFQUFBLEtBQUEsV0FBQSxNQUFBOztFQUVBLFNBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxZQUFBLEVBQUEsUUFBQSxPQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxRQUFBLE9BQUEsS0FBQSxrQ0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFFBQUEsT0FBQSxXQUFBLDZCQUFBO0dBQ0EsS0FBQSxRQUFBO0dBQ0EsS0FBQSxjQUFBO0dBQ0EsRUFBQSxTQUFBLHdCQUFBO0dBQ0EsRUFBQSxTQUFBLFlBQUEsV0FBQSxTQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLElBQUEsUUFBQSxDQUFBLFdBQUEsWUFBQTs7O0dBR0EsT0FBQTs7OztFQUlBLFNBQUEsYUFBQSxhQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxRQUFBLElBQUE7SUFDQSxJQUFBLEdBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxHQUFBO0tBQ0EsR0FBQSxVQUFBO1dBQ0E7S0FDQSxJQUFBLFNBQUEsR0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLEdBQUEsVUFBQTs7Ozs7RUFLQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLG1CQUFBLE9BQUE7O0dBRUEsSUFBQSxNQUFBLG9EQUFBLG1CQUFBLFlBQUEsK0NBQUEsbUJBQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsYUFBQTtJQUNBLGlCQUFBLENBQUEsbUJBQUEsWUFBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsV0FBQTs7SUFFQSxRQUFBLFNBQUEsU0FBQSxTQUFBOztLQUVBLE9BQUE7O0lBRUEsT0FBQSxTQUFBLFNBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxNQUFBLFFBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxPQUFBOzs7O0dBSUEsSUFBQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkpBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBFQUFBLFNBQUEsUUFBQSxZQUFBLG9CQUFBLFFBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO1lBQ0EsS0FBQSxHQUFBLFVBQUEsb0JBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLElBQUE7OztVQUdBLEdBQUEsUUFBQSxHQUFBLFVBQUEsaUJBQUEsV0FBQTtVQUNBLEdBQUEsZ0JBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBLGlCQUFBOzs7UUFHQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtjQUNBLE9BQUE7OztVQUdBLE9BQUEsS0FBQTs7UUFFQSxTQUFBLFlBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0E7O01BRUEsU0FBQSxjQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtPQUNBOztRQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUE7WUFDQTs7O1lBR0EsR0FBQSxFQUFBLElBQUE7Y0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztZQUVBO1lBQ0EsZ0JBQUEsRUFBQTs7Ozs7Ozs7O0FDbEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsUUFBQSxPQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOERBQUEsU0FBQSxRQUFBLGVBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsYUFBQSxRQUFBLE9BQUEsUUFBQSxHQUFBOztRQUVBLEdBQUEsT0FBQSxVQUFBOztZQUVBLFlBQUEsS0FBQSxrQkFBQSxHQUFBLGNBQUEsS0FBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQSxjQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLGVBQUE7Y0FDQSxjQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ25CQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwREFBQSxTQUFBLFFBQUEsWUFBQSxjQUFBOztNQUVBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBOztNQUVBLEdBQUEsT0FBQSxVQUFBOztVQUVBLFlBQUEsS0FBQSxrQkFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUE7WUFDQSxjQUFBOzs7OztNQUtBLEdBQUEsT0FBQSxVQUFBO1FBQ0EsY0FBQTs7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxRQUFBLElBQUEsT0FBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1EQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0RBQUEsU0FBQSxRQUFBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0VBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLG1CQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFdBQUE7RUFDQSxPQUFBLE9BQUEsWUFBQTs7R0FFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTtLQUNBLElBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxhQUFBO01BQ0EsYUFBQSxhQUFBLEtBQUE7T0FDQSxhQUFBO09BQ0EsT0FBQTs7O0tBR0EsSUFBQSxPQUFBLGFBQUEsYUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBLEdBQUEsYUFBQTtNQUNBLEtBQUEsZUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFlBQUE7TUFDQSxLQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxjQUFBO01BQ0EsS0FBQSxhQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsVUFBQTtNQUNBLEtBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7O01BRUEsSUFBQSxPQUFBLEtBQUEsU0FBQSxhQUFBO09BQ0EsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBO09BQ0EsS0FBQSxXQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7Ozs7OztHQU1BLGNBQUE7R0FDQSxhQUFBOzs7O0VBSUEsT0FBQSxPQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7R0FDQSxjQUFBOzs7Ozs7O0FDcERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdEQUFBLFNBQUEsT0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsT0FBQSxHQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtXQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxHQUFBO1lBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFFQUFBLFVBQUEsUUFBQSxjQUFBLGVBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsTUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsWUFBQTtHQUNBLGNBQUE7OztFQUdBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7RUFFQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxNQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLGFBQUE7T0FDQSxLQUFBLE1BQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTs7OztLQUlBLEdBQUEsS0FBQSxPQUFBLEtBQUE7OztHQUdBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLGNBQUE7O0tBRUE7Ozs7O0FDdENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDBCQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsVUFBQTtZQUNBLFNBQUEsVUFBQTtnQkFDQSxTQUFBLEdBQUE7ZUFDQTs7Ozs7Ozs7QUNUQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFlBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsTUFBQSxNQUFBO0dBQ0EsR0FBQSxDQUFBLEdBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLEtBQUE7Ozs7OztBQ1ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFFBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLGNBQUE7R0FDQSxNQUFBO0dBQ0EsV0FBQTtHQUNBLFdBQUE7R0FDQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLG1CQUFBO0dBQ0EsVUFBQTtHQUNBLFdBQUE7R0FDQSxVQUFBO0dBQ0EsWUFBQTtHQUNBLFdBQUEsR0FBQSxRQUFBO0dBQ0EsYUFBQSxHQUFBLFFBQUE7Ozs7Ozs7QUNyQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsV0FBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGlFQUFBLFNBQUEsaUJBQUEsbUJBQUE7O0dBRUEsSUFBQSxLQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsR0FBQSxTQUFBO0dBQ0EsR0FBQSxZQUFBO0dBQ0EsR0FBQSxXQUFBO0lBQ0EsaUJBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLGFBQUE7O0dBRUEsR0FBQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxZQUFBLG1CQUFBOztHQUVBOztHQUVBLFNBQUEsVUFBQTtJQUNBLEdBQUEsQ0FBQSxHQUFBLE1BQUE7S0FDQSxHQUFBLFFBQUE7TUFDQSxXQUFBOzs7SUFHQSxnQkFBQSxZQUFBLFNBQUEsU0FBQTtLQUNBLEdBQUEsV0FBQTtLQUNBLEdBQUEsR0FBQSxNQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLElBQUE7T0FDQSxHQUFBLElBQUEsTUFBQSxHQUFBLE1BQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7Ozs7OztHQU9BLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxNQUFBLGFBQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxVQUFBOztHQUVBLFNBQUEsVUFBQSxJQUFBO0lBQ0EsT0FBQTtLQUNBLElBQUEsSUFBQTtLQUNBLFlBQUEsSUFBQTtLQUNBLEtBQUE7Ozs7Ozs7O0FDaERBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsT0FBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG9CQUFBLEdBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsb0JBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7S0FDQSxvQkFBQSxLQUFBOzs7O0VBSUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsV0FBQSxVQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsT0FBQSxNQUFBLGlDQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLFNBQUE7R0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBLFNBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUEsS0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxVQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLE1BQUEsWUFBQSxDQUFBLE1BQUE7S0FDQSxJQUFBLFlBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0dBSUEsT0FBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtPQUNBLFVBQUEsU0FBQSxPQUFBLEVBQUE7Ozs7T0FJQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxXQUFBLE9BQUEsRUFBQTs7OztHQUlBLEdBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxJQUFBLFlBQUEsVUFBQSxHQUFBLE1BQUEsR0FBQTtJQUNBLFVBQUEsU0FBQSxLQUFBLEdBQUE7OztPQUdBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBLEtBQUE7R0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsYUFBQSxHQUFBLEtBQUEsVUFBQTs7S0FFQTs7O0dBR0EsT0FBQSxRQUFBLDZCQUFBO0dBQ0EsT0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQTs7U0FFQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBOzs7O1FBSUE7S0FDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLEtBQUEsV0FBQTtTQUNBLElBQUEsU0FBQSxVQUFBLE1BQUEsR0FBQTtTQUNBLEdBQUEsQ0FBQSxPQUFBLFNBQUE7VUFDQSxPQUFBLFdBQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQSxPQUFBLFdBQUE7O1VBRUE7T0FDQSxHQUFBLFdBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUEsK0JBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7OztBQ25JQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxLQUFBLElBQUEsSUFBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7T0FDQSxPQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxNQUFBLGFBQUEsVUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUE7TUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO1FBQ0EsU0FBQTtRQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBOztLQUVBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsY0FBQTtPQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7O1VBR0E7T0FDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsSUFBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7OztJQU9BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBO0tBQ0EsU0FBQSxZQUFBO09BQ0EsVUFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBOztNQUVBOzs7Ozs7OztBQ2xKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtJQUNBLFVBQUE7O0dBRUEsa0JBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTs7O0VBR0EsR0FBQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLFdBQUE7R0FDQSxXQUFBO0dBQ0EsV0FBQTtHQUNBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsbUJBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxXQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7R0FDQSxRQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLFdBQUEsR0FBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsTUFBQTtHQUNBLG9CQUFBOztFQUVBOzs7RUFHQSxTQUFBLFdBQUE7Ozs7RUFJQSxTQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFlBQUE7Ozs7Ozs7O0FDNUNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsa0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsSUFBQTtHQUNBLEdBQUEsR0FBQSxlQUFBLElBQUE7SUFDQSxHQUFBLGNBQUE7O09BRUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsR0FBQSxZQUFBOztPQUVBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7OztFQUdBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUE7O0dBRUEsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQTtPQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUEsV0FBQSxRQUFBLE1BQUE7OztJQUdBLEdBQUEsWUFBQTs7Ozs7Ozs7Ozs7OztBQ3hGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7O0VBRUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsS0FBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLE9BQUEsZUFBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0dBQ0EsT0FBQSxlQUFBLEdBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsOEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsV0FBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBOzs7O09BSUE7SUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsNEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsUUFBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsU0FBQSxJQUFBLEtBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsWUFBQSxPQUFBLEtBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDekZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsQ0FBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxNQUFBO0tBQ0EsTUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxRQUFBLE9BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7O0lBR0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxLQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOzs7O0lBSUEsSUFBQSxVQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBOztJQUVBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOzs7SUFHQSxJQUFBLFNBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBO0lBQ0EsSUFBQSxrQkFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBO0lBQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLFVBQUEsT0FBQSxPQUFBO0lBQ0EsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBO0lBQ0EsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsVUFBQSxJQUFBLE9BQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBLGFBQUEsR0FBQSxHQUFBLFFBQUEsT0FBQSxRQUFBLFFBQUEsUUFBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7O0tBRUEsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxTQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLFdBQUE7O09BRUEsSUFBQSxNQUFBLE1BQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFFBQUE7O09BRUEsT0FBQTs7T0FFQSxNQUFBLGFBQUEsUUFBQSxTQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7T0FDQSxLQUFBLE1BQUEsUUFBQTtPQUNBLEtBQUEsb0JBQUE7T0FDQSxLQUFBLGdCQUFBO09BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7TUFDQSxHQUFBLGFBQUEsVUFBQTtPQUNBLGdCQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsZ0JBQUE7OztNQUdBLEdBQUEsWUFBQSxVQUFBO01BQ0EsZ0JBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxnQkFBQTs7O0lBR0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLE1BQUEsVUFBQTtNQUNBLEtBQUEsTUFBQSxDQUFBLFFBQUEsU0FBQSxLQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsUUFBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxTQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7OztJQUtBLFNBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtLQUNBLElBQUE7S0FDQSxTQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUE7S0FDQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQTtZQUNBO01BQ0EsVUFBQSxNQUFBLENBQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUE7S0FDQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxTQUFBLE1BQUE7TUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFFBQUE7WUFDQTtNQUNBLE9BQUEsU0FBQTs7OztJQUlBLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7S0FFQSxZQUFBLEtBQUEsU0FBQTtLQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTtLQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO01BQ0EsSUFBQSxTQUFBLElBQUEsUUFBQSxXQUFBLFNBQUEsUUFBQTtPQUNBLFFBQUE7T0FDQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBbUJBLEdBQUEsTUFBQTtNQUNBLFFBQUEsY0FBQTtNQUNBLFFBQUE7Ozs7OztJQU1BLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUE7TUFDQTs7S0FFQSxRQUFBLE9BQUEsR0FBQSxRQUFBLEVBQUE7S0FDQSxXQUFBLElBQUEsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBLE1BQUEsUUFBQSxRQUFBLE1BQUEsRUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUE7S0FDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFNBQUEsT0FBQTtNQUNBLFNBQUEsT0FBQTtRQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7UUFDQSxLQUFBLGNBQUEsTUFBQTtRQUNBLEtBQUEsZ0JBQUEsTUFBQTs7S0FFQSxLQUFBLE1BQUEsUUFBQSxVQUFBLFFBQUEsUUFBQSxNQUFBLEVBQUEsUUFBQTtLQUNBLE9BQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxJQUFBLFFBQUEsYUFBQTtNQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO01BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7WUFDQTtNQUNBLFlBQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOzs7T0FHQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7T0FDQSxJQUFBLFlBQUEsVUFBQTtRQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2NBQ0E7UUFDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7OztJQU1BLE9BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTs7S0FFQSxNQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7TUFDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7TUFDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsT0FBQSxRQUFBLFlBQUEsS0FBQTtPQUNBLFlBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsSUFBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7S0FLQSxJQUFBLEdBQUEsTUFBQTtPQUNBLE9BQUEsQ0FBQSxLQUFBO09BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7T0FDQSxNQUFBO0tBQ0EsTUFBQSxFQUFBO09BQ0EsT0FBQSxDQUFBLEdBQUE7T0FDQSxHQUFBLFNBQUE7T0FDQSxHQUFBLFlBQUE7S0FDQSxPQUFBLE9BQUEsZUFBQSxLQUFBO0tBQ0EsUUFBQSxPQUFBLGVBQUEsS0FBQSxXQUFBOztNQUVBLElBQUEsTUFBQSxNQUFBO09BQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxPQUFBLE1BQUE7T0FDQSxPQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxRQUFBOztNQUVBLE9BQUE7O0tBRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtNQUNBLElBQUEsSUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxJQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7Ozs7Ozs7Ozs7QUMvV0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOztLQUVBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsTUFBQSxVQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsVUFBQSxJQUFBLEtBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUE7UUFDQTtZQUNBLE9BQUEsRUFBQTs7UUFFQSxJQUFBLEtBQUEsR0FBQSxTQUFBO1FBQ0EsTUFBQSxPQUFBLFFBQUE7UUFDQSxNQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDJEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTtDQUNBLE1BQUEsU0FBQTtLQUNBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxLQUFBLEdBQUE7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQTs7O1FBR0EsR0FBQSxJQUFBLE9BQUEsVUFBQSxFQUFBO1NBQ0EsTUFBQSxPQUFBLEtBQUEsSUFBQSxLQUFBOztZQUVBO1NBQ0EsUUFBQSxJQUFBOzs7T0FHQSxTQUFBLFVBQUE7UUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7OztBQ3hFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSw4QkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw2REFBQSxVQUFBLFFBQUEsVUFBQSxRQUFBLGNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7TUFDQSxhQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxRQUFBOztPQUVBLE9BQUEsVUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLE1BQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTs7U0FFQSxJQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsT0FBQTs7U0FFQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsS0FBQSxXQUFBLGlCQUFBLHlCQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7WUFDQSxJQUFBLFFBQUE7YUFDQSxNQUFBO2FBQ0EsU0FBQTthQUNBLFFBQUE7YUFDQSxPQUFBOztZQUVBLEVBQUEsT0FBQSxLQUFBO1lBQ0EsT0FBQSxLQUFBOzs7O1NBSUEsSUFBQSxZQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUE7V0FDQSxJQUFBLElBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxRQUFBLGFBQUE7YUFDQSxRQUFBLEtBQUEsT0FBQTs7WUFFQSxRQUFBLEtBQUEsS0FBQSxLQUFBOzs7O2dCQUlBOztVQUVBLEVBQUEsT0FBQTs7VUFFQSxhQUFBLFFBQUE7Ozs7OztPQU1BLGtCQUFBLFVBQUEsT0FBQTs7O1FBR0EsSUFBQSxRQUFBLE1BQUEsTUFBQSxjQUFBO1FBQ0EsSUFBQSxZQUFBO1FBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTs7UUFFQSxJQUFBLFNBQUEsU0FBQSxHQUFBO1NBQ0EsV0FBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUE7U0FDQSxZQUFBOztRQUVBLElBQUEsUUFBQTs7UUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7U0FDQSxJQUFBLFNBQUEsSUFBQTs7VUFFQSxTQUFBLEtBQUEsU0FBQSxHQUFBLFFBQUEsZUFBQSxLQUFBO1VBQ0EsSUFBQSxTQUFBLEdBQUEsUUFBQSxPQUFBLENBQUEsR0FBQTtXQUNBLFNBQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOzs7VUFHQSxJQUFBLE9BQUEsU0FBQSxHQUFBLE1BQUE7VUFDQSxJQUFBLEtBQUEsU0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBO1dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsS0FBQTthQUNBLElBQUEsSUFBQSxHQUFBO2NBQ0EsU0FBQSxNQUFBOzthQUVBLFNBQUEsTUFBQSxLQUFBOzs7OztVQUtBLElBQUEsU0FBQSxHQUFBLFVBQUEsR0FBQTtXQUNBLE1BQUEsS0FBQTs7OztRQUlBLElBQUEsU0FBQSxVQUFBLE1BQUEsUUFBQTtTQUNBLGFBQUE7U0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7VUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsYUFBQTtXQUNBLFFBQUEsU0FBQSxNQUFBOztVQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7Ozs7UUFJQSxPQUFBLFNBQUEsS0FBQSxhQUFBLE1BQUEsT0FBQTs7T0FFQSxPQUFBLFVBQUEsS0FBQSxNQUFBO1FBQ0EsYUFBQSxNQUFBOztPQUVBLFVBQUEsVUFBQSxTQUFBOztRQUVBLGFBQUEsVUFBQTs7O1FBR0EsSUFBQSxDQUFBLFlBQUE7U0FDQSxRQUFBLFFBQUEsYUFBQSxnQkFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLFlBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxjQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsZ0JBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsS0FBQSxLQUFBLFdBQUEsVUFBQSxHQUFBO1dBQ0EsYUFBQSxhQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsYUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLGVBQUE7OztlQUdBO1NBQ0EsUUFBQSxRQUFBLFNBQUEsVUFBQSxNQUFBLEtBQUE7VUFDQSxLQUFBLFNBQUE7VUFDQSxJQUFBLEtBQUEsaUJBQUEsZUFBQSxPQUFBLE9BQUEsYUFBQTtXQUNBLElBQUEsSUFBQTtZQUNBLEtBQUEsSUFBQTs7V0FFQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsUUFBQSxHQUFBO1lBQ0EsRUFBQSxZQUFBLEtBQUE7WUFDQSxJQUFBLE1BQUEsV0FBQSxTQUFBLEdBQUE7YUFDQSxJQUFBLE9BQUEsV0FBQSxpQkFBQSxRQUFBLFNBQUEsS0FBQSxPQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsU0FBQTtlQUNBLFFBQUE7O2NBRUE7Ozs7O1dBS0EsYUFBQSxRQUFBO1lBQ0EsTUFBQSxDQUFBO1lBQ0EsUUFBQSxLQUFBOzs7O1NBSUEsYUFBQSxZQUFBOztRQUVBLGFBQUE7O1FBRUEsU0FBQSxVQUFBO1NBQ0EsT0FBQSxLQUFBLGFBQUEsZ0JBQUEsb0JBQUE7U0FDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7S0FFQSxTQUFBLFNBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsV0FBQTs7SUFFQSxJQUFBLElBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLElBQUEsS0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxTQUFBO09BQ0EsT0FBQTthQUNBLEtBQUEsYUFBQSxhQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLEVBQUE7OztRQUdBLElBQUEsTUFBQSxHQUFBO01BQ0E7TUFDQSxZQUFBLE9BQUEsSUFBQTtNQUNBLFlBQUEsT0FBQSxJQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTs7O1FBR0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUEsUUFBQSxLQUFBLEtBQUE7YUFDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTthQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTthQUNBLEdBQUEsWUFBQSxXQUFBLEdBQUEsV0FBQTtJQUNBLElBQUEsS0FBQTtPQUNBLE1BQUEsTUFBQTtPQUNBLFVBQUE7T0FDQSxLQUFBO09BQ0E7T0FDQSxPQUFBO09BQ0EsS0FBQSxLQUFBO1dBQ0EsS0FBQSxTQUFBLEdBQUEsRUFBQSxLQUFBLFdBQUE7V0FDQSxNQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7T0FDQSxNQUFBLFVBQUE7V0FDQSxHQUFBLFNBQUE7O1FBRUEsR0FBQSxTQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLGFBQUEsU0FBQTtpQkFDQSxVQUFBLEtBQUE7OztJQUdBLElBQUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtJQUNBLFNBQUEsV0FBQSxFQUFBO0tBQ0EsTUFBQSxRQUFBLENBQUEsUUFBQSxFQUFBLEtBQUE7O1FBRUEsU0FBQSxVQUFBLEVBQUE7O01BRUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtZQUNBLE1BQUEsYUFBQSxDQUFBLEVBQUEsS0FBQTtNQUNBLE1BQUE7OztRQUdBLFNBQUEsU0FBQSxFQUFBOztZQUVBLE1BQUEsYUFBQTtNQUNBLE1BQUE7Ozs7UUFJQSxTQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLEVBQUE7WUFDQSxPQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsSUFBQSxFQUFBOztJQUVBLFNBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLEVBQUE7OztJQUdBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTs7Ozs7Ozs7O0FDaEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7O0dBRUEsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLEtBQUE7TUFDQSxPQUFBO01BQ0EsUUFBQTtNQUNBLE1BQUE7O0tBRUEsUUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsU0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFFBQUE7OztJQUdBLElBQUEsUUFBQTtLQUNBLEdBQUEsR0FBQSxNQUFBOztJQUVBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQTtJQUNBLE1BQUEsRUFBQSxNQUFBLENBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxPQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxPQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxTQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQSxXQUFBLFNBQUEsV0FBQSxHQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLEtBQUEsU0FBQTtJQUNBLElBQUEsWUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLFNBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7OztLQVlBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7Ozs7Ozs7SUFVQSxJQUFBLFlBQUE7TUFDQSxPQUFBOztJQUVBLFVBQUEsS0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7UUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsQ0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLGFBQUE7TUFDQSxPQUFBO0lBQ0EsV0FBQSxLQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxTQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7SUFJQSxTQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7S0FDQSxJQUFBO0tBQ0EsU0FBQSxPQUFBLElBQUEsS0FBQSxNQUFBO0tBQ0EsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxDQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxDQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUEsQ0FBQTtNQUNBLFVBQUEsTUFBQTs7S0FFQSxVQUFBO0tBQ0EsT0FBQTs7SUFFQSxNQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUE7OztNQUdBLFVBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO1FBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxHQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsR0FBQTtTQUNBLFVBQUE7O1FBRUEsT0FBQSxjQUFBLEtBQUEsV0FBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLFVBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsRUFBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxVQUFBLEdBQUE7U0FDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7U0FHQSxLQUFBLE9BQUEsU0FBQSxHQUFBLEVBQUE7UUFDQSxFQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUE7Ozs7Ozs7Ozs7OztBQzlKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxHQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQTs7R0FFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE1BQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBOzs7SUFHQSxvQkFBQTs7SUFFQSxRQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxRQUFBO0tBQ0EsWUFBQTs7SUFFQSxPQUFBO0tBQ0EsYUFBQTs7Ozs7R0FLQSxJQUFBLEdBQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7O0dBR0EsT0FBQSxHQUFBOztFQUVBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxHQUFBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7O0dBR0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxHQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOztHQUVBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsVUFBQSxRQUFBO0lBQ0EsR0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQTtHQUNBO0VBQ0EsT0FBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOzs7SUFHQTtJQUNBOzs7O0VBSUEsT0FBQSxPQUFBLGdCQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7Ozs7Ozs7O0FDbklBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGtCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsVUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0NBQUEsVUFBQSxRQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTs7RUFFQSxTQUFBLFlBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFlBQUEsTUFBQSxJQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7VUFDQTtJQUNBLEdBQUEsS0FBQSxXQUFBLE1BQUE7SUFDQSxHQUFBLEtBQUEsUUFBQTs7O0VBR0EsU0FBQSxjQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsTUFBQSxLQUFBLE9BQUE7O0VBRUEsU0FBQSxZQUFBO0dBQ0EsWUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBLEtBQUEsVUFBQSxNQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLGNBQUE7S0FDQSxHQUFBLFFBQUE7SUFDQSxHQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsUUFBQSw0QkFBQTs7Ozs7OztBQzVCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBOztDQUVBLFNBQUEsVUFBQSxDQUFBLFlBQUE7O0NBRUEsU0FBQSxTQUFBLFVBQUEsY0FBQTtFQUNBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxhQUFBO0dBQ0EsTUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7QUNoQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0RBQUEsU0FBQSxRQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUEsT0FBQTtFQUNBLE9BQUEsV0FBQTtFQUNBLE9BQUEsaUJBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsYUFBQTtFQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLHVCQUFBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBLFNBQUE7S0FDQSxPQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQTtLQUNBOztJQUVBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxPQUFBLE9BQUEsQ0FBQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLE9BQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsUUFBQSxZQUFBO0lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7R0FFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEtBQUE7S0FDQSxPQUFBLElBQUE7OztHQUdBLE9BQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBLFFBQUE7R0FDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO0tBQ0EsT0FBQTs7O0dBR0EsT0FBQSxLQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxnQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7O0dBR0EsT0FBQSxtQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7RUFLQSxTQUFBLFdBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7O01BRUEsZ0JBQUE7TUFDQSxRQUFBO09BQ0EsS0FBQTtPQUNBLE9BQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7TUFDQSxRQUFBLENBQUEsS0FBQTtNQUNBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsUUFBQTtPQUNBLFlBQUE7T0FDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0EsT0FBQTtPQUNBLGFBQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQTs7O0lBR0EsVUFBQSxLQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7QUN2SkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxZQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7SUFDQSxPQUFBO01BQ0EsTUFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUEsQ0FBQSxTQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBOztLQUVBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsY0FBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7OztJQUdBLElBQUEsTUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFdBQUE7Ozs7Ozs7O0lBUUEsSUFBQSxZQUFBLEdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztJQUdBLElBQUEsUUFBQSxVQUFBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLEtBQUEsS0FBQTtNQUNBLEtBQUEsYUFBQTtNQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztNQUVBLE1BQUEsUUFBQTtNQUNBLEdBQUEsU0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUEsZ0JBQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBO09BQ0EsT0FBQTs7O09BR0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEVBQUE7O01BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O01BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO09BQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO09BQ0EsU0FBQSxDQUFBO09BQ0EsU0FBQTtPQUNBLFdBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO01BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O01BRUEsR0FBQSxTQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7SUFHQSxTQUFBLE1BQUEsR0FBQTs7S0FFQSxLQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUEsS0FBQSxTQUFBOzs7O0tBSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O09BRUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsRUFBQTtTQUNBLE9BQUE7OztTQUdBLE9BQUE7OztPQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1NBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1NBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7UUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1NBQ0EsU0FBQSxDQUFBO1NBQ0EsU0FBQTtTQUNBLFdBQUE7ZUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7OztPQUdBLE1BQUEsZ0JBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxJQUFBOztPQUVBLEtBQUEsT0FBQSxVQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsTUFBQSxNQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQTs7O0tBR0EsT0FBQTs7O0lBR0EsU0FBQSxTQUFBLEdBQUE7OztLQUdBLElBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTtVQUNBO01BQ0EsT0FBQTs7Ozs7Ozs7Ozs7O0lBWUEsU0FBQSxTQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBQTs7S0FFQSxPQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQSxJQUFBLE1BQUEsR0FBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxTQUFBLEtBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQSxXQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxTQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsRUFBQTs7Ozs7OztBQ3hQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBO01BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7T0FDQSxNQUFBO09BQ0EsWUFBQTtPQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxRQUFBOzs7TUFHQSxXQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxZQUFBO09BQ0EsZ0JBQUE7T0FDQSxXQUFBO09BQ0Esa0JBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLGFBQUE7T0FDQSxpQkFBQTs7T0FFQSxVQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsVUFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsTUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7S0FDQSxZQUFBLFVBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsTUFBQTtLQUNBLE1BQUEsUUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7O0lBRUEsU0FBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0lBQ0EsUUFBQSxPQUFBLEtBQUE7SUFDQSxTQUFBLE9BQUEsS0FBQSxNQUFBLGNBQUE7SUFDQSxZQUFBLFVBQUEsT0FBQSxLQUFBO0lBQ0EsUUFBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3JGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLFdBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsZ0NBQUEsU0FBQSxpQkFBQTtFQUNBLElBQUEsVUFBQTtHQUNBLFdBQUE7R0FDQSxNQUFBO0dBQ0EsTUFBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7O0dBRUEsUUFBQTtHQUNBLFNBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxnQkFBQSxRQUFBLFNBQUEsU0FBQSxPQUFBLFVBQUEsUUFBQSxZQUFBLGFBQUE7UUFDQSxRQUFBLE9BQUEsU0FBQSxNQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7QUMzQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsR0FBQSxPQUFBLEdBQUEsYUFBQSxZQUFBO0lBQ0EsR0FBQSxZQUFBOzs7O0VBSUEsU0FBQSxXQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLGVBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBLElBQUE7SUFDQSxHQUFBLE1BQUEsTUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLE9BQUEsS0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxPQUFBLE1BQUEsS0FBQTtHQUNBLEdBQUEsR0FBQSxRQUFBLFVBQUE7SUFDQSxPQUFBLEdBQUEsTUFBQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsZ0JBQUEsS0FBQTtHQUNBLElBQUEsUUFBQSxDQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxTQUFBLFVBQUEsRUFBQTtJQUNBLEdBQUEsU0FBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLFFBQUE7OztHQUdBLEdBQUEsUUFBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLFVBQUEsT0FBQSxPQUFBOztPQUVBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7O0dBRUEsR0FBQSxPQUFBLEdBQUEsUUFBQSxvQkFBQTtJQUNBLEdBQUEsUUFBQTs7RUFFQSxTQUFBLFlBQUEsTUFBQTs7R0FFQSxLQUFBLFdBQUE7R0FDQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxTQUFBLFNBQUE7SUFDQSxHQUFBLFNBQUEsTUFBQSxLQUFBLEdBQUE7S0FDQSxRQUFBOzs7R0FHQSxPQUFBOzs7Ozs7O0VBT0EsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7S0FDQSxRQUFBOztJQUVBLEdBQUEsQ0FBQSxNQUFBO0tBQ0EsU0FBQSxjQUFBOzs7O0dBSUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZGQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxPQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7QUNqQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUJBQUEsU0FBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLEtBQUEsVUFBQSxlQUFBLENBQUEsR0FBQSxLQUFBLFFBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtLQUNBLE1BQUEsU0FBQSxNQUFBLEdBQUEsTUFBQTs7Ozs7RUFLQSxTQUFBLGFBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxLQUFBO0dBQ0EsSUFBQSxPQUFBLENBQUEsTUFBQSxVQUFBLEdBQUEsTUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFVBQUEsR0FBQSxNQUFBO0tBQ0EsTUFBQSxTQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBLElBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUE7VUFDQTtJQUNBLEdBQUEsS0FBQSxVQUFBOztHQUVBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUEsS0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7Ozs7Ozs7QUFPQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywndWkucm91dGVyLnN0YXRlLmV2ZW50cycsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWydGQkFuZ3VsYXInLCdkbmRMaXN0cycsJ2FuZ3VsYXIuZmlsdGVyJywnYW5ndWxhck1vbWVudCcsJ25nU2Nyb2xsYmFyJywnbWRDb2xvclBpY2tlcicsJ25nQW5pbWF0ZScsJ3VpLnRyZWUnLCd0b2FzdHInLCd1aS5yb3V0ZXInLCAnbWQuZGF0YS50YWJsZScsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICduZ01kSWNvbnMnLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICduZ01lc3NhZ2VzJywgJ25nU2FuaXRpemUnLCBcImxlYWZsZXQtZGlyZWN0aXZlXCIsJ252ZDMnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ2FuZ3VsYXItY2FjaGUnLCd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ3RvYXN0ciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ25nTWF0ZXJpYWwnLCduZ1BhcGFQYXJzZSddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblx0XHQvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKSB7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hlYWRlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fSxcblx0XHRcdFx0XHQnbWFwQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXAnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdNYXBDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGVtZW51QCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzaWRlbWVudScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NpZGVtZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5ob21lJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0dmlld3M6IHtcblxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdob21lJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0cHJvZmlsZTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdtZScpLiRvYmplY3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy9teS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNeURhdGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubXlkYXRhLmVudHJ5Jywge1xuXHRcdFx0XHR1cmw6ICcvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhRW50cnlDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2VkaXRvcicsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljZXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHtcblx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdGxpbWl0OiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0eWxlczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRTdHlsZXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNhdGVnb3JpZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHRyZWU6IHRydWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJywge1xuXHRcdFx0XHR1cmw6ICcvaW5kaWNhdG9ycycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMuaW5kaWNhdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcjogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGljYXRvci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J2luZm8nOntcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21lbnUnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4ZWRpdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpemVzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkLzpuYW1lJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGV4OiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRpZiAoJHN0YXRlUGFyYW1zLmlkID09IDApIHJldHVybiB7fTtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJdGVtKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGl6ZXMuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JpbmRpemVzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhLmFkZCcsIHtcblx0XHRcdFx0dXJsOiAnL2FkZCcsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHtcblx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdGxpbWl0OiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J2FkZGl0aW9uYWxAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhpbmlkY2F0b3JzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3IuZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzplbnRyeScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3Jvdydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycsIHtcblx0XHRcdFx0dXJsOiAnL2NhdGVnb3JpZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGNhdGVnb3J5OiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRpZigkc3RhdGVQYXJhbXMuaWQgPT0gJ25ldycpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcnkoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JjYXRlZ29yeUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUnLCB7XG5cdFx0XHRcdHVybDogJy9jcmVhdGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2ljJyxcblx0XHRcdFx0YXV0aDogdHJ1ZVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNoZWNrJywge1xuXHRcdFx0XHR1cmw6ICcvY2hlY2tpbmcnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleENoZWNrJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhDaGVjay9pbmRleENoZWNrU2lkZWJhci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleENoZWNrU2lkZWJhckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubWV0YScsIHtcblx0XHRcdFx0dXJsOiAnL2FkZGluZy1tZXRhLWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE1ldGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmZpbmFsJywge1xuXHRcdFx0XHR1cmw6ICcvZmluYWwnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleEZpbmFsJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZXhwb3J0cycsIHtcblx0XHRcdFx0dXJsOiAnL2V4cG9ydHMnLFxuXHRcdFx0XHRhdXRoOnRydWUsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwYWdlTmFtZTogJ0V4cG9ydCBEYXRhJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdleHBvcnQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdFeHBvcnRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmV4cG9ydHMuZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwYWdlTmFtZTogJ0V4cG9ydCBEYXRhJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2V4cG9ydC9leHBvcnREZXRhaWxzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0V4cG9ydERldGFpbHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmV4cG9ydHMuZGV0YWlscy5hZGQnLCB7XG5cdFx0XHRcdHVybDogJy9hZGQnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdhZGRpdGlvbmFsQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRpY2F0b3JzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5pZGNhdG9yc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZXhwb3J0cy5kZXRhaWxzLnN0eWxlJywge1xuXHRcdFx0XHR1cmw6ICcvc3R5bGUvOnN0eWxlSWQvOnN0eWxlTmFtZScsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdGFkZGl0aW9uYWw6J2Z1bGwnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdhZGRpdGlvbmFsQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdleHBvcnRTdHlsZScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0V4cG9ydFN0eWxlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5iYXNlbWFwcycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2VtYXBzJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdFeHBvcnQgRGF0YSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnYmFzZW1hcHMnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdCYXNlbWFwc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguYmFzZW1hcHMuZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwYWdlTmFtZTogJ0Jhc2VtYXBzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2Jhc2VtYXBzL2Jhc2VtYXBEZXRhaWxzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Jhc2VtYXBEZXRhaWxzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5saXN0Jywge1xuXHRcdFx0XHR1cmw6ICcvbGlzdCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7XG5cdFx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHR0cmVlOiB0cnVlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZnVsbExpc3QnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGdWxsTGlzdEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubGlzdC5maWx0ZXInLHtcblx0XHRcdFx0dXJsOicvOmZpbHRlcicsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9mdWxsTGlzdC9maWx0ZXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRnVsbExpc3RGaXRsZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3IvOmlkLzpuYW1lLzp5ZWFyLzpnZW5kZXIvOmlzbycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3I6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kaWNhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yU2hvd0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXJhbXM6e1xuXHRcdFx0XHRcdHllYXI6e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZW5kZXI6e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpc286e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2RldGFpbHMnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSgkc3RhdGUucGFyYW1zLmlkLCAkc3RhdGUucGFyYW1zLnllYXIsICRzdGF0ZS5wYXJhbXMuZ2VuZGVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBmdW5jdGlvbihJbmRpemVzU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gSW5kaXplc1NlcnZpY2UuZmV0Y2hEYXRhKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2luZm8nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluZm9DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGluZm8nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdHVybDogJy86aXRlbScsXG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdzZWxlY3RlZCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NlbGVjdGVkJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VsZWN0ZWRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdFx0XHRnZXRDb3VudHJ5OiBmdW5jdGlvbihEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgJHN0YXRlUGFyYW1zLml0ZW0pLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0dXJsOiAnL2NvbXBhcmUvOmNvdW50cmllcydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9jb25mbGljdCcsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXgnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb25zOiBmdW5jdGlvbihSZXN0YW5ndWxhcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzL25hdGlvbnMnKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbmZsaWN0czogZnVuY3Rpb24oUmVzdGFuZ3VsYXIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NvbmZsaWN0cycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RzJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdsb2dvQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdHVybDogJy9uYXRpb24vOmlzbycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb246IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvbmF0aW9ucy8nLCAkc3RhdGVQYXJhbXMuaXNvKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0bmF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RuYXRpb24nKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4LmRldGFpbHMnLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y29uZmxpY3Q6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvZXZlbnRzLycsICRzdGF0ZVBhcmFtcy5pZCkuZ2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGRldGFpbHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdGRldGFpbHMnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2l0ZW1zLW1lbnVAJzoge30sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmltcG9ydCcsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0SW1wb3J0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RJbXBvcnQnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmltcG9ydGNzdicsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydGVyJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHBhZ2VOYW1lOiAnSW1wb3J0IENTVidcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2LCAkdGltZW91dCwgJGF1dGgsICRzdGF0ZSwgJGxvY2FsU3RvcmFnZSwgJHdpbmRvdywgbGVhZmxldERhdGEsIHRvYXN0cikge1xuXHRcdCRyb290U2NvcGUuc2lkZWJhck9wZW4gPSB0cnVlO1xuXHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgfHwgZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5zdGFydGVkID0gdHJ1ZTtcblx0XHQkcm9vdFNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0JHJvb3RTY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24obWVudUlkKSB7XG5cdFx0XHQkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XG5cdFx0fVxuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXG5cdFx0XHRpZiAodG9TdGF0ZS5hdXRoICYmICEkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1lvdXIgbm90IGFsbG93ZWQgdG8gZ28gdGhlcmUgYnVkZHkhJywgJ0FjY2VzcyBkZW5pZWQnKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0cmV0dXJuICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubGF5b3V0ID09IFwicm93XCIpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5hZGRpdGlvbmFsID09IFwiZnVsbFwiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuYWRkRnVsbCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmFkZEZ1bGwgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgdG9TdGF0ZS52aWV3cyAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdtYWluQCcpIHx8IHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2FkZGl0aW9uYWxAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLm1haW5WaWV3ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLm1haW5WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2FkZGl0aW9uYWxAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdpdGVtcy1tZW51QCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdsb2dvQCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5sb2dvVmlldyA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5sb2dvVmlldyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLm5hbWUuaW5kZXhPZignY29uZmxpY3QnKSA+IC0xICYmIHRvU3RhdGUubmFtZSAhPSBcImFwcC5jb25mbGljdC5pbXBvcnRcIikge1xuXHRcdFx0XHQkcm9vdFNjb3BlLm5vSGVhZGVyID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUubm9IZWFkZXIgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc2hvd0l0ZW1zID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc2hvd0l0ZW1zID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtcblx0XHRcdFx0c3RhdGU6IGZyb21TdGF0ZSxcblx0XHRcdFx0cGFyYW1zOiBmcm9tUGFyYW1zXG5cdFx0XHR9O1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKTtcblxuXG5cdFx0fSk7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpIHtcblxuXHRcdH0pO1xuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKSB7XG5cblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0XHQkbWRTaWRlbmF2KCdsZWZ0TWVudScpLmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIHJlc2V0TWFwU2l6ZSgpIHtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobWFwKTtcblx0XHRcdFx0XHRtYXAuaW52YWxpZGF0ZVNpemUoKTtcblx0XHRcdFx0fSlcblx0XHRcdH0sIDEwMDApO1xuXHRcdH1cblx0XHQvKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihldikge1xuICAgIC8vIGF2b2lkcyBzY3JvbGxpbmcgd2hlbiB0aGUgZm9jdXNlZCBlbGVtZW50IGlzIGUuZy4gYW4gaW5wdXRcbiAgICBpZiAoXG4gICAgICAgICFkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHlcbiAgICApIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKHRydWUpO1xuICAgIH1cbn0pOyovXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKSB7XG5cdFx0Ly8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuXHRcdC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG5cdFx0JGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoJztcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoL3NpZ251cCc7XG4gICAgJGF1dGhQcm92aWRlci51bmxpbmtVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC91bmxpbmsvJztcblx0XHQkYXV0aFByb3ZpZGVyLmZhY2Vib29rKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2ZhY2Vib29rJyxcblx0XHRcdGNsaWVudElkOiAnNzcxOTYxODMyOTEwMDcyJ1xuXHRcdH0pO1xuXHRcdCRhdXRoUHJvdmlkZXIuZ29vZ2xlKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2dvb2dsZScsXG5cdFx0XHRjbGllbnRJZDogJzI3NjYzNDUzNzQ0MC1jZ3R0MTRxajJlOGlucDB2cTVvcTliNDZrNzRqanMzZS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRsb2dQcm92aWRlcil7XG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKHtcblx0XHRcdFx0YWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCJcblx0XHRcdH0pXG5cdFx0XHQuc2V0RGVmYXVsdEh0dHBGaWVsZHMoe1xuXHRcdFx0XHRjYWNoZTogZmFsc2Vcblx0XHRcdH0pXG5cdFx0XHQuYWRkUmVzcG9uc2VJbnRlcmNlcHRvcihmdW5jdGlvbihkYXRhLCBvcGVyYXRpb24sIHdoYXQsIHVybCwgcmVzcG9uc2UsIGRlZmVycmVkKSB7XG5cdFx0XHRcdHZhciBleHRyYWN0ZWREYXRhO1xuXHRcdFx0XHRleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuXHRcdFx0XHRpZiAoZGF0YS5tZXRhKSB7XG5cdFx0XHRcdFx0ZXh0cmFjdGVkRGF0YS5fbWV0YSA9IGRhdGEubWV0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YS5pbmNsdWRlZCkge1xuXHRcdFx0XHRcdGV4dHJhY3RlZERhdGEuX2luY2x1ZGVkID0gZGF0YS5pbmNsdWRlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZXh0cmFjdGVkRGF0YTtcblx0XHRcdH0pO1xuXHRcdC8qXHQuc2V0RXJyb3JJbnRlcmNlcHRvcihmdW5jdGlvbihyZXNwb25zZSwgZGVmZXJyZWQsIHJlc3BvbnNlSGFuZGxlcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2VycnJvJyk7XG5cdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcblxuICAgIFx0XHRyZXR1cm4gZmFsc2U7IC8vIGVycm9yIGhhbmRsZWRcbiAgICBcdH1cblxuICAgIFx0cmV0dXJuIHRydWU7IC8vIGVycm9yIG5vdCBoYW5kbGVkXG5cdFx0fSk7Ki9cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyLCRtZEdlc3R1cmVQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG4vKlx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdsaWdodC1ibHVlJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnYmx1ZXInKTsqL1xuXHRcdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2luZGlnbycsIHtcblx0XHRcdCc1MDAnOiAnIzAwNmJiOScsXG5cdFx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuXHRcdH0pO1xuXHRcdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnYmx1ZXInKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXG5cdFx0ICRtZEdlc3R1cmVQcm92aWRlci5za2lwQ2xpY2tIaWphY2soKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKHRvYXN0ckNvbmZpZyl7XG4gICAgICAgIC8vXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgIGF1dG9EaXNtaXNzOiB0cnVlLFxuICAgICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgICBtYXhPcGVuZWQ6IDIsXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LWJvdHRvbS1yaWdodCcsXG4gICAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHByZXZlbnRPcGVuRHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgcHJvZ3Jlc3NCYXI6dHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcignZmluZGJ5bmFtZScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBuYW1lLCBmaWVsZCkge1xuXHRcdFx0Ly9cbiAgICAgIHZhciBmb3VuZHMgPSBbXTtcblx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0bGVuID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpbnB1dFtpXVtmaWVsZF0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuXHRcdFx0XHRcdCBmb3VuZHMucHVzaChpbnB1dFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3VuZHM7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICduZXdsaW5lJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB0ZXh0ICl7XG4gICAgICAgICAgICAvL1xuICAgIFxuICAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyhcXFxccik/XFxcXG4vZywgJzxiciAvPjxiciAvPicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ09yZGVyT2JqZWN0QnknLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG5cblx0XHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgb2JqZWN0S2V5IGluIGlucHV0KSB7XG5cdFx0XHRcdGFycmF5LnB1c2goaW5wdXRbb2JqZWN0S2V5XSk7XG5cdFx0XHR9XG5cblx0XHRcdGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0YSA9IHBhcnNlSW50KGFbYXR0cmlidXRlXSk7XG5cdFx0XHRcdGIgPSBwYXJzZUludChiW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRyZXR1cm4gYSAtIGI7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhcnJheTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdwcm9wZXJ0eScsIHByb3BlcnR5KTtcblx0ZnVuY3Rpb24gcHJvcGVydHkoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChhcnJheSwgeWVhcl9maWVsZCwgdmFsdWUpIHtcblxuICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xuXG4gICAgICAgIGlmKGFycmF5W2ldLmRhdGFbeWVhcl9maWVsZF0gPT0gdmFsdWUpe1xuICAgICAgICAgIGl0ZW1zLnB1c2goYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdWZWN0b3JsYXllclNlcnZpY2UnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHZhciB0aGF0ID0gdGhpcywgX3NlbGYgPSB0aGlzO1xuXHRcdF9zZWxmLmJhc2VtYXAgPSB7XG5cdFx0XHRuYW1lOiAnT3V0ZG9vcicsXG5cdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L3ZhbGRlcnJhbWEuZDg2MTE0YjYve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj1way5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUScsXG5cdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdGxheWVyT3B0aW9uczoge1xuXHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXG5cdFx0XHRcdGRldGVjdFJldGluYTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4ge1xuXG5cdFx0XHRjYW52YXM6IGZhbHNlLFxuXHRcdFx0cGFsZXR0ZTogW10sXG5cdFx0XHRjdHg6ICcnLFxuXHRcdFx0a2V5czoge1xuXHRcdFx0XHRtYXpwZW46ICd2ZWN0b3ItdGlsZXMtUTNfT3M1dycsXG5cdFx0XHRcdG1hcGJveDogJ3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJ1xuXHRcdFx0fSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bGF5ZXI6ICcnLFxuXHRcdFx0XHRuYW1lOiAnY291bnRyaWVzX2JpZycsXG5cdFx0XHRcdGJhc2VDb2xvcjogJyMwNmE5OWMnLFxuXHRcdFx0XHRpc28zOiAnYWRtMF9hMycsXG5cdFx0XHRcdGlzbzI6ICdpc29fYTInLFxuXHRcdFx0XHRpc286ICdpc29fYTInLFxuXHRcdFx0XHRmaWVsZHM6IFwiaWQsYWRtaW4sYWRtMF9hMyx3Yl9hMyxzdV9hMyxpc29fYTMsaXNvX2EyLG5hbWUsbmFtZV9sb25nXCIsXG5cdFx0XHRcdGZpZWxkOidzY29yZSdcblx0XHRcdH0sXG5cdFx0XHRtYXA6IHtcblx0XHRcdFx0ZGF0YTogW10sXG5cdFx0XHRcdGN1cnJlbnQ6IFtdLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6IFtdLFxuXHRcdFx0XHRzdHlsZTogW11cblx0XHRcdH0sXG5cdFx0XHRtYXBMYXllcjogbnVsbCxcblx0XHRcdGxheWVyczp7XG5cdFx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0XHR4eXo6IHRoaXMuYmFzZW1hcFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y2VudGVyOiB7XG5cdFx0XHRcdGxhdDogNDguMjA5MjA2LFxuXHRcdFx0XHRsbmc6IDE2LjM3Mjc3OCxcblx0XHRcdFx0em9vbTogM1xuXHRcdFx0fSxcblx0XHRcdG1heGJvdW5kczoge1xuXHRcdFx0XHRzb3V0aFdlc3Q6IHtcblx0XHRcdFx0XHRsYXQ6IDkwLFxuXHRcdFx0XHRcdGxuZzogMTgwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG5vcnRoRWFzdDoge1xuXHRcdFx0XHRcdGxhdDogLTkwLFxuXHRcdFx0XHRcdGxuZzogLTE4MFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2V0TWFwOiBmdW5jdGlvbihtYXApe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXBMYXllciA9IG1hcDtcblx0XHRcdH0sXG5cdFx0XHRzZXRCYXNlTGF5ZXI6IGZ1bmN0aW9uKGJhc2VtYXApe1xuXHRcdFx0XHR0aGlzLmxheWVycy5iYXNlbGF5ZXJzWyd4eXonXSA9IHtcblx0XHRcdFx0XHRuYW1lOiBiYXNlbWFwLm5hbWUsXG5cdFx0XHRcdFx0dXJsOiBiYXNlbWFwLnVybCxcblx0XHRcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdFx0XHRsYXllck9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdG5vV3JhcDogdHJ1ZSxcblx0XHRcdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRkZXRlY3RSZXRpbmE6IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZXNldEJhc2VMYXllcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy5sYXllcnMuYmFzZWxheWVyc1sneHl6J10gPSB0aGlzLmJhc2VsYXllcjtcblx0XHRcdH0sXG5cdFx0XHRzZXRMYXllcjogZnVuY3Rpb24obCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmxheWVyID0gbDtcblx0XHRcdH0sXG5cdFx0XHRnZXRMYXllcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubmFtZTtcblx0XHRcdH0sXG5cdFx0XHRmaWVsZHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmZpZWxkcztcblx0XHRcdH0sXG5cdFx0XHRpc286IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbztcblx0XHRcdH0sXG5cdFx0XHRpc28zOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5pc28zO1xuXHRcdFx0fSxcblx0XHRcdGlzbzI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzI7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUNhbnZhczogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdGNyZWF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKXtcblxuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNvbG9yUmFuZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxIC8gKGNvbG9yUmFuZ2UubGVuZ3RoIC0xKSAqIGksIGNvbG9yUmFuZ2VbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblxuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKSB7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHNldEJhc2VDb2xvcjogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5iYXNlQ29sb3IgPSBjb2xvcjtcblx0XHRcdH0sXG5cdFx0LypcdHNldFN0eWxlOiBmdW5jdGlvbihzdHlsZSkge1xuXHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpXG5cdFx0XHR9LCovXG5cdFx0XHRjb3VudHJ5Q2xpY2s6IGZ1bmN0aW9uKGNsaWNrRnVuY3Rpb24pIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrRnVuY3Rpb247XG5cdFx0XHRcdH0pXG5cblx0XHRcdH0sXG5cdFx0XHRnZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFsZXR0ZVt2YWx1ZV07XG5cdFx0XHR9LFxuXHRcdFx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFwLnN0eWxlID0gc3R5bGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSwgY29sb3IsIGRyYXdJdCkge1xuXHRcdFx0XHR0aGlzLm1hcC5kYXRhID0gZGF0YTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjb2xvciAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0dGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5jYW52YXMpIHtcblx0XHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmJhc2VDb2xvciA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlRml4ZWRDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRyYXdJdCkge1xuXHRcdFx0XHRcdHRoaXMucGFpbnRDb3VudHJpZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldE5hdGlvbkJ5SXNvOiBmdW5jdGlvbihpc28sIGxpc3QpIHtcblx0XHRcdFx0aWYodHlwZW9mIGxpc3QgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGlmIChsaXN0Lmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRpZiAodGhpcy5tYXAuZGF0YS5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5tYXAuZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmF0aW9uQnlOYW1lOiBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRcdGlmICh0aGlzLm1hcC5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cGFpbnRDb3VudHJpZXM6IGZ1bmN0aW9uKHN0eWxlLCBjbGljaywgbXV0ZXgpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2Ygc3R5bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBzdHlsZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUodGhhdC5tYXAuc3R5bGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZW9mIGNsaWNrICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5vcHRpb25zLm9uQ2xpY2sgPSBjbGlja1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdHJlc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzLCBmdW5jdGlvbihmZWF0dXJlLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXNvKXtcblx0XHRcdFx0XHRcdFx0aWYoa2V5ICE9IGlzbylcblx0XHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmU6ZnVuY3Rpb24oaXNvLCBzZWxlY3RlZCl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzW2lzb10gPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGlzbyk7XG5cdFx0XHRcdFx0Ly9kZWJ1Z2dlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRyZWRyYXc6ZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLnJlZHJhdygpO1xuXHRcdFx0fSxcblx0XHRcdC8vRlVMTCBUTyBET1xuXHRcdFx0Y291bnRyaWVzU3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0ZGVidWdnZXI7XG5cdFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3RoYXQuZGF0YS5pc28yXTtcblx0XHRcdFx0dmFyIG5hdGlvbiA9IHRoYXQuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdFx0dmFyIGZpZWxkID0gdGhhdC5kYXRhLmZpZWxkO1xuXHRcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCl7XG5cdFx0XHRcdFx0XHRcdHZhciBsaW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLHZtLnJhbmdlLm1heF0pLnJhbmdlKFswLDI1Nl0pO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9ICBwYXJzZUludChsaW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0Oy8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNvbG9yUG9zLCBpc28sbmF0aW9uKTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQmFzZW1hcHNTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGJhc2VtYXBzOltdLFxuICAgICAgICAgIGJhc2VtYXA6e30sXG4gICAgICAgICAgZ2V0QmFzZW1hcHM6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKXtcbiAgICAgICAgICAgIHZhciBfdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2Jhc2VtYXBzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIF90aGF0LmJhc2VtYXBzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiBzdWNjZXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICBzdWNjZXNzKF90aGF0LmJhc2VtYXBzKTtcbiAgICAgICAgICAgIH0sIGVycm9yKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEJhc2VtYXA6IGZ1bmN0aW9uKGlkLCBzdWNjZXNzLCBlcnJvcil7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0T25lKCdiYXNlbWFwcycsaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBfdGhhdC5iYXNlbWFwID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiBzdWNjZXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICBzdWNjZXNzKF90aGF0LmJhc2VtYXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRCYXNlbWFwOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VtYXAgPSBkYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2F2ZTogZnVuY3Rpb24oYmFzZW1hcCwgc3VjY2VzcywgZXJyb3Ipe1xuICAgICAgICAgICAgaWYodGhpcy5iYXNlbWFwLmlkID09IDAgfHwgIXRoaXMuYmFzZW1hcC5pZCl7XG4gICAgICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2Jhc2VtYXBzJywgYmFzZW1hcCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBlcnJvcihyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5iYXNlbWFwLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGVycm9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVJdGVtOiBmdW5jdGlvbihpZCwgc3VjY2VzcywgZXJyb3Ipe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UucmVtb3ZlKCdiYXNlbWFwcycsIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgaWYodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBpZih0eXBlb2YgZXJyb3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdDb250ZW50U2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JJdGVtKGxpc3QsaWQpe1xuXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdFx0XHRpZihpdGVtLmlkID09IGlkKXtcblx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gc2VhcmNoRm9ySXRlbShpdGVtLmNoaWxkcmVuLCBpZCk7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29udGVudDoge1xuXHRcdFx0XHRpbmRpY2F0b3JzOiBbXSxcblx0XHRcdFx0aW5kaWNhdG9yOiB7fSxcblx0XHRcdFx0ZGF0YTogW10sXG5cdFx0XHRcdGNhdGVnb3JpZXM6IFtdLFxuXHRcdFx0XHRjYXRlZ29yeToge30sXG5cdFx0XHRcdHN0eWxlczogW10sXG5cdFx0XHRcdGluZm9ncmFwaGljczogW10sXG5cdFx0XHRcdGluZGljZXM6W11cblx0XHRcdH0sXG5cdFx0XHRiYWNrdXA6e30sXG5cdFx0XHRmZXRjaEluZGljZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4JykuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcnM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMnLCBmaWx0ZXIpLiRvYmplY3Rcblx0XHRcdH0sXG5cdFx0XHRmZXRjaENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlciwgd2l0aG91dFNhdmUpIHtcblx0XHRcdFx0aWYod2l0aG91dFNhdmUpe1xuXHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2NhdGVnb3JpZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yaWVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoU3R5bGVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljZXMoZmlsdGVyKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0Q2F0ZWdvcmllczogZnVuY3Rpb24oZmlsdGVyLCB3aXRob3V0U2F2ZSkge1xuXHRcdFx0XHRpZih3aXRob3V0U2F2ZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hDYXRlZ29yaWVzKGZpbHRlciwgd2l0aG91dFNhdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoQ2F0ZWdvcmllcyhmaWx0ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcztcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2F0b3JzKGZpbHRlcik7XG5cblx0XHRcdH0sXG5cdFx0XHRnZXRTdHlsZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LnN0eWxlcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoU3R5bGVzKGZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9yc1tpXS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNhdG9yKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcjogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzLycgKyBpZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRyZXR1cm4gdGhhdC5jb250ZW50LmluZGljYXRvciA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yUHJvbWlzZTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kaWNhdG9ycycsaWQpO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGlkLCB5ZWFyLCBnZW5kZXIpIHtcblx0XHRcdFx0aWYoeWVhciAmJiBnZW5kZXIgJiYgZ2VuZGVyICE9ICdhbGwnKXtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhLycgKyB5ZWFyICsgJy9nZW5kZXIvJyArZ2VuZGVyICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoeWVhcikge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEvJyArIHllYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEnKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JIaXN0b3J5OiBmdW5jdGlvbihpZCwgaXNvLCBnZW5kZXIpe1xuXHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9oaXN0b3J5LycgKyBpc28sIHtnZW5kZXI6IGdlbmRlcn0pO1xuXHRcdFx0fSxcblx0XHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHQvKlx0aWYodGhpcy5jb250ZW50LmluZGljZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0IHRoaXMuY29udGVudC5kYXRhID0gc2VhcmNoRm9ySXRlbSh0aGlzLmNvbnRlbnQuaW5kaWNlcywgaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7Ki9cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycsIGlkKVxuXHRcdFx0XHQvL31cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDb250ZW50OmZ1bmN0aW9uKGlkLCBsaXN0KXtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaWQpe1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gdGhhdC5yZW1vdmVDb250ZW50KGlkLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRmaW5kQ29udGVudDpmdW5jdGlvbihpZCwgbGlzdCl7XG5cdFx0XHRcdHZhciBmb3VuZCA9IG51bGw7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5LmlkID09IGlkKXtcblx0XHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuICYmIGVudHJ5LmNoaWxkcmVuLmxlbmd0aCAmJiAhZm91bmQpe1xuXHRcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHRoYXQuZmluZENvbnRlbnQoaWQsIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmb3VuZDtcblx0XHRcdH0sXG5cdFx0XHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dGhpcy5jb250ZW50LmluZGljZXMucHVzaChpdGVtKVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0dGhpcy5yZW1vdmVDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5yZW1vdmUoJ2luZGV4LycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIGVudHJ5ID0gdGhpcy5maW5kQ29udGVudChpdGVtLmlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coZW50cnksIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gZW50cnkgPSBpdGVtO1xuXHRcdFx0fSxcblx0XHRcdGdldENhdGVnb3J5OiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmluZENvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3J5ID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdjYXRlZ29yaWVzLycgKyBpZCkuJG9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUNhdGVnb3J5OiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ29udGVudChpZCwgdGhpcy5jb250ZW50LmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UucmVtb3ZlKCdjYXRlZ29yaWVzLycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHRmaWx0ZXJMaXN0OiBmdW5jdGlvbih0eXBlLCBmaWx0ZXIsIGxpc3Qpe1xuXHRcdFx0XHRpZihsaXN0Lmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdGlmKCF0aGlzLmJhY2t1cFt0eXBlXSl7XG5cdFx0XHRcdFx0XHR0aGlzLmJhY2t1cFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmNvbnRlbnRbdHlwZV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5jb250ZW50W3R5cGVdID0gYW5ndWxhci5jb3B5KHRoaXMuYmFja3VwW3R5cGVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXSA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHRoaXMuY29udGVudFt0eXBlXSwgZmlsdGVyKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmJhY2t1cFt0eXBlXTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdH0sXG5cdFx0XHRyZXNldEZpbHRlcjogZnVuY3Rpb24odHlwZSl7XG5cdFx0XHRcdGlmKCF0aGlzLmJhY2t1cFt0eXBlXSkgcmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdFx0dGhpcy5jb250ZW50W3R5cGVdID0gYW5ndWxhci5jb3B5KHRoaXMuYmFja3VwW3R5cGVdKTtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuYmFja3VwW3R5cGVdO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50W3R5cGVdO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NvdW50cmllc1NlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY291bnRyaWVzOiBbXSxcbiAgICAgICAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXMgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9pc29zJykuJG9iamVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighdGhpcy5jb3VudHJpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJywndG9hc3RyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhciwgdG9hc3RyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZSxcbiAgICAgICAgICBwb3N0OiBwb3N0LFxuICAgICAgICAgIHB1dDogcHV0LFxuICAgICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgIHJlbW92ZTogcmVtb3ZlXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsKHJvdXRlLCBmaWx0ZXIpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5nZXRMaXN0KGZpbHRlcik7XG4gICAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEuc3RhdHVzVGV4dCwgJ0Nvbm5lY3Rpb24gRXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0T25lKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLmdldCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBvc3Qocm91dGUsIGRhdGEpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5wb3N0KGRhdGEpO1xuICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEuZGF0YS5lcnJvciwgJ1NhdmluZyBmYWlsZWQnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwdXQocm91dGUsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwocm91dGUpLnB1dChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUocm91dGUsIGlkLCBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkucHV0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0Vycm9yQ2hlY2tlclNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBmdW5jdGlvbiBjaGVja015RGF0YShkYXRhKSB7XG4gICAgXHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuICAgIFx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0dm0ubXlEYXRhLnRoZW4oZnVuY3Rpb24oaW1wb3J0cykge1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpIHtcbiAgICBcdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuICAgIFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhWzBdLm1ldGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0dmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG4gICAgXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdGlmIChjb2x1bW4uY29sdW1uID09IGZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0Zm91bmQrKztcbiAgICBcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzLnB1c2goZW50cnkpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0aWYgKHZtLmV4dGVuZGluZ0Nob2ljZXMubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkKXtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZXh0ZW5kRGF0YScsICRzY29wZSk7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH1cbiAgICAgICAgICByZXR1cm4gZXh0ZW5kZWRDaG9pY2VzO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0ZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG4gICAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGspIHtcbiAgICBcdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdID0gbnVsbDtcbiAgICBcdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0aWYgKCFyb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuICAgIFx0XHRcdFx0XHRcdHR5cGU6IFwiMlwiLFxuICAgIFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcbiAgICBcdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgIFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGQsXG4gICAgXHRcdFx0XHRcdFx0cm93OiBrZXlcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrZXkpIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuICAgIFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH0pO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBDT1VOVFJZIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZiAodm0ubWV0YS5jb3VudHJ5X2ZpZWxkID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG5cbiAgICBcdFx0XHR2bS5ub3RGb3VuZCA9IFtdO1xuICAgIFx0XHRcdHZhciBlbnRyaWVzID0gW107XG4gICAgXHRcdFx0dmFyIGlzb0NoZWNrID0gMDtcbiAgICBcdFx0XHR2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG4gICAgXHRcdFx0XHRpZiAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRpc29DaGVjayArPSBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gMSA6IDA7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0XHRzd2l0Y2ggKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdGNhc2UgJ0NhYm8gVmVyZGUnOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0ZGVmYXVsdDpcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdGVudHJpZXMucHVzaCh7XG4gICAgXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcbiAgICBcdFx0XHRcdFx0bmFtZTogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH0pO1xuICAgIFx0XHRcdHZhciBpc29UeXBlID0gaXNvQ2hlY2sgPj0gKGVudHJpZXMubGVuZ3RoIC8gMikgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0SW5kZXhTZXJ2aWNlLnJlc2V0VG9TZWxlY3QoKTtcbiAgICBcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcbiAgICBcdFx0XHRcdGRhdGE6IGVudHJpZXMsXG4gICAgXHRcdFx0XHRpc286IGlzb1R5cGVcbiAgICBcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuICAgIFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHR2YXIgdG9TZWxlY3QgPSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0ZW50cnk6IGl0ZW0sXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG4gICAgXHRcdFx0XHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRUb1NlbGVjdCh0b1NlbGVjdCk7XG4gICAgXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvdW50cnkuZGF0YVswXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uYWRtaW47XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5kYXRhW2tdKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjNcIixcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ291bGQgbm90IGxvY2F0ZSBhIHZhbGlkIGlzbyBuYW1lIVwiLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmNvdW50cnlfZmllbGRcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZElzb0Vycm9yKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcbiAgICBcdFx0XHRcdGlmIChJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKS5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgXHRcdFx0fSk7XG5cbiAgICBcdFx0fVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNoZWNrTXlEYXRhOiBjaGVja015RGF0YVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdFeHBvcnRTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXhwb3J0czpbXSxcbiAgICAgICAgICBleHBvcnRlcjp7fSxcbiAgICAgICAgICBnZXRFeHBvcnRzOiBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcil7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdleHBvcnRzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIF90aGF0LmV4cG9ydHMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgaWYodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgIHN1Y2Nlc3MoX3RoYXQuZXhwb3J0cyk7XG4gICAgICAgICAgICB9LCBlcnJvcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRFeHBvcnQ6IGZ1bmN0aW9uKGlkLCBzdWNjZXNzLCBlcnJvcil7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0T25lKCdleHBvcnRzJywgaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBfdGhhdC5leHBvcnRlciA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICBpZih0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgc3VjY2VzcyhfdGhhdC5leHBvcnRlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEV4cG9ydDogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5leHBvcnRlciA9IGRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzYXZlOiBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcil7XG4gICAgICAgICAgICBpZih0aGlzLmV4cG9ydGVyLmlkID09IDAgfHwgIXRoaXMuZXhwb3J0ZXIuaWQpe1xuICAgICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdleHBvcnRzJywgdGhpcy5leHBvcnRlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBlcnJvcihyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgdGhpcy5leHBvcnRlci5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBlcnJvcihyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihpZCwgc3VjY2VzcywgZXJyb3Ipe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UucmVtb3ZlKCdleHBvcnRzJywgaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBpZih0eXBlb2Ygc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgZXJyb3IocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICBnZW5kZXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kaWNhdG9yczp7fSxcbiAgICAgICAgICAgIHRvU2VsZWN0OltdXG4gICAgICAgIH0sIHN0b3JhZ2UsIGltcG9ydENhY2hlLCBpbmRpY2F0b3I7XG5cbiAgICAgICAgaWYgKCFDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpIHtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeSgnaW1wb3J0RGF0YScsIHtcbiAgICAgICAgICAgIGNhY2hlRmx1c2hJbnRlcnZhbDogNjAgKiA2MCAqIDEwMDAsIC8vIFRoaXMgY2FjaGUgd2lsbCBjbGVhciBpdHNlbGYgZXZlcnkgaG91ci5cbiAgICAgICAgICAgIGRlbGV0ZU9uRXhwaXJlOiAnYWdncmVzc2l2ZScsIC8vIEl0ZW1zIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoaXMgY2FjaGUgcmlnaHQgd2hlbiB0aGV5IGV4cGlyZS5cbiAgICAgICAgICAgIHN0b3JhZ2VNb2RlOiAnbG9jYWxTdG9yYWdlJyAvLyBUaGlzIGNhY2hlIHdpbGwgdXNlIGBsb2NhbFN0b3JhZ2VgLlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpO1xuICAgICAgICAgIHN0b3JhZ2UgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xlYXI6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgICAgaWYoQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKXtcbiAgICAgICAgICAgICAgICBpbXBvcnRDYWNoZS5yZW1vdmUoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgZ2VuZGVyX2ZpZWxkOicnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b1NlbGVjdDpbXSxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOnt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkRGF0YTpmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJbmRpY2F0b3I6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnMucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZFRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSXNvRXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3ZlVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VydmljZURhdGEudG9TZWxlY3QuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA+IC0xID8gc2VydmljZURhdGEudG9TZWxlY3Quc3BsaWNlKGluZGV4LCAxKSA6IGZhbHNlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJc29GaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldENvdW50cnlGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRHZW5kZXJGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmdlbmRlcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFllYXJGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLnllYXJfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycyl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0VG9Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICBpbXBvcnRDYWNoZS5wdXQoJ2RhdGFUb0ltcG9ydCcsc2VydmljZURhdGEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXksIGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRBY3RpdmVJbmRpY2F0b3JEYXRhOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2l0ZW0uY29sdW1uX25hbWVdID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZyb21Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnVsbERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TWV0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29FcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGaXJzdEVudHJ5OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGFbMF07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhU2l6ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLmxlbmd0aDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcjogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWN0aXZlSW5kaWNhdG9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvcjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0SW5kaWNhdG9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUlzb0Vycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUVycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdCA9IFtdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kaXplc1NlcnZpY2UnLCBmdW5jdGlvbiAoRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmRleDoge1xuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0ZGF0YTogbnVsbCxcblx0XHRcdFx0XHRzdHJ1Y3R1cmU6IG51bGxcblx0XHRcdFx0fSxcblx0XHRcdFx0cHJvbWlzZXM6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyOiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmZXRjaERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgvJyArIGluZGV4ICsgJy95ZWFyL2xhdGVzdCcpO1xuXHRcdFx0XHR0aGlzLmluZGV4LnByb21pc2VzLnN0cnVjdHVyZSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArIGluZGV4ICsgJy9zdHJ1Y3R1cmUnKTtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLmRhdGEgPSB0aGlzLmluZGV4LnByb21pc2VzLmRhdGEuJG9iamVjdDtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlLiRvYmplY3Q7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4O1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXguZGF0YS5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZTtcblx0XHRcdH0sXG5cdFx0XHRnZXREYXRhUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZVByb21pc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1JlY3Vyc2lvbkhlbHBlcicsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuXHRcdFx0XHQvL1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIE1hbnVhbGx5IGNvbXBpbGVzIHRoZSBlbGVtZW50LCBmaXhpbmcgdGhlIHJlY3Vyc2lvbiBsb29wLlxuXHRcdFx0XHRcdCAqIEBwYXJhbSBlbGVtZW50XG5cdFx0XHRcdFx0ICogQHBhcmFtIFtsaW5rXSBBIHBvc3QtbGluayBmdW5jdGlvbiwgb3IgYW4gb2JqZWN0IHdpdGggZnVuY3Rpb24ocykgcmVnaXN0ZXJlZCB2aWEgcHJlIGFuZCBwb3N0IHByb3BlcnRpZXMuXG5cdFx0XHRcdFx0ICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGxpbmtpbmcgZnVuY3Rpb25zLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uIChlbGVtZW50LCBsaW5rKSB7XG5cdFx0XHRcdFx0XHQvLyBOb3JtYWxpemUgdGhlIGxpbmsgcGFyYW1ldGVyXG5cdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGxpbmspKSB7XG5cdFx0XHRcdFx0XHRcdGxpbmsgPSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zdDogbGlua1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBCcmVhayB0aGUgcmVjdXJzaW9uIGxvb3AgYnkgcmVtb3ZpbmcgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHR2YXIgY29udGVudHMgPSBlbGVtZW50LmNvbnRlbnRzKCkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR2YXIgY29tcGlsZWRDb250ZW50cztcblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHByZTogKGxpbmsgJiYgbGluay5wcmUpID8gbGluay5wcmUgOiBudWxsLFxuXHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0ICogQ29tcGlsZXMgYW5kIHJlLWFkZHMgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBDb21waWxlIHRoZSBjb250ZW50c1xuXHRcdFx0XHRcdFx0XHRcdGlmICghY29tcGlsZWRDb250ZW50cykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyA9ICRjb21waWxlKGNvbnRlbnRzKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmUtYWRkIHRoZSBjb21waWxlZCBjb250ZW50cyB0byB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBpbGVkQ29udGVudHMoc2NvcGUsIGZ1bmN0aW9uIChjbG9uZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5hcHBlbmQoY2xvbmUpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2FsbCB0aGUgcG9zdC1saW5raW5nIGZ1bmN0aW9uLCBpZiBhbnlcblx0XHRcdFx0XHRcdFx0XHRpZiAobGluayAmJiBsaW5rLnBvc3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxpbmsucG9zdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHR9KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdVc2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6e1xuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXIuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlQcm9maWxlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteUZyaWVuZHM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Jhc2VtYXBEZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwgQmFzZW1hcHNTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5iYXNlbWFwID0ge31cbiAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgICAgICBzYXZlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0uYmFzZW1hcCk7XG4gICAgICAgICAgICBCYXNlbWFwc1NlcnZpY2Uuc2F2ZSh2bS5iYXNlbWFwKTtcblxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2l0aFNhdmU6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIGlmKCRzdGF0ZS5wYXJhbXMuaWQgIT0gMCl7XG4gICAgICAgICAgICBCYXNlbWFwc1NlcnZpY2UuZ2V0QmFzZW1hcCgkc3RhdGUucGFyYW1zLmlkLCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIHZtLmJhc2VtYXAgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldEJhc2VMYXllcih2bS5iYXNlbWFwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcbiAgICBcdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0uaWQpe1xuICAgIFx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcbiAgICBcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHJlbW92ZUl0ZW0oaXRlbSwgZW50cnkuY2hpbGRyZW4pO1xuICAgIFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuICAgIFx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Jhc2VtYXBzQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwgQmFzZW1hcHNTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uYmFzZW1hcHMgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0aW9uID0gW107XG4gICAgXHRcdHZtLm9wdGlvbnMgPSB7XG4gICAgXHRcdFx0ZHJhZzogZmFsc2UsXG4gICAgXHRcdFx0dHlwZTogJ2Jhc2VtYXBzJyxcbiAgICBcdFx0XHRhbGxvd01vdmU6IGZhbHNlLFxuICAgIFx0XHRcdGFsbG93RHJvcDogZmFsc2UsXG4gICAgXHRcdFx0YWxsb3dBZGQ6IHRydWUsXG4gICAgXHRcdFx0YWxsb3dEZWxldGU6IHRydWUsXG4gICAgXHRcdFx0aXRlbUNsaWNrOiBmdW5jdGlvbihpZCwgbmFtZSkge1xuICAgIFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguYmFzZW1hcHMuZGV0YWlscycsIHtcbiAgICBcdFx0XHRcdFx0aWQ6IGlkLFxuICAgIFx0XHRcdFx0XHRuYW1lOiBuYW1lXG4gICAgXHRcdFx0XHR9KVxuICAgIFx0XHRcdH0sXG4gICAgXHRcdFx0YWRkQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguYmFzZW1hcHMuZGV0YWlscycsIHtcbiAgICBcdFx0XHRcdFx0aWQ6IDAsXG4gICAgXHRcdFx0XHRcdG5hbWU6ICduZXcnXG4gICAgXHRcdFx0XHR9KVxuICAgIFx0XHRcdH0sXG4gICAgXHRcdFx0ZGVsZXRlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG4gICAgXHRcdFx0XHRcdEJhc2VtYXBzU2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgIFx0XHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmlkID09IGl0ZW0uaWQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmJhc2VtYXBzJyk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuICAgIFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdH0pO1xuXG4gICAgXHRcdFx0fVxuICAgIFx0XHR9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBCYXNlbWFwc1NlcnZpY2UuZ2V0QmFzZW1hcHMoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uYmFzZW1hcHMgPSByZXNwb25zZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RJbXBvcnRDdHJsJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXIsIHRvYXN0ciwgJHN0YXRlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm5hdGlvbnMgPSBbXTtcblx0XHR2bS5ldmVudHMgPSBbXTtcblx0XHR2bS5zdW0gPSAwO1xuXG5cdFx0dm0uc2F2ZVRvRGIgPSBzYXZlVG9EYjtcblxuXHRcdGZ1bmN0aW9uIHNhdmVUb0RiKCkge1xuXHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdG5hdGlvbnM6IHZtLm5hdGlvbnMsXG5cdFx0XHRcdGV2ZW50czogdm0uZXZlbnRzXG5cdFx0XHR9O1xuXHRcdFx0UmVzdGFuZ3VsYXIuYWxsKCcvY29uZmxpY3RzL2ltcG9ydCcpLnBvc3QoZGF0YSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Jylcblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0ZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkdGltZW91dCwgJHN0YXRlLCAkc2NvcGUsICRyb290U2NvcGUsIFZlY3RvcmxheWVyU2VydmljZSwgY29uZmxpY3QsIGNvbmZsaWN0cywgbmF0aW9ucywgRGlhbG9nU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdHZtLmNvbmZsaWN0cyA9IG5hdGlvbnM7XG5cdFx0dm0uY29uZmxpY3RJdGVtcyA9IFtcblx0XHRcdCd0ZXJyaXRvcnknLFxuXHRcdFx0J3NlY2Vzc2lvbicsXG5cdFx0XHQnYXV0b25vbXknLFxuXHRcdFx0J3N5c3RlbScsXG5cdFx0XHQnbmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0J2ludGVybmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0J3N1Ym5hdGlvbmFsX3ByZWRvbWluYW5jZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLnNob3dDb3VudHJpZXMgPSBmYWxzZTtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uY291bnRyaWVzID0gW107XG5cdFx0dm0uc2hvd1RleHQgPSBzaG93VGV4dDtcblx0XHR2bS5zaG93Q291bnRyaWVzQnV0dG9uID0gc2hvd0NvdW50cmllc0J1dHRvbjtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50MjAxNScsXG5cdFx0XHRzaXplOiA1LFxuXHRcdFx0aGlkZU51bWJlcmluZzogdHJ1ZSxcblx0XHRcdHdpZHRoOjY1LFxuXHRcdFx0aGVpZ2h0OjY1XG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdC8vO1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZSh2bS5uYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdHZhciBpID0gdm0ucmVsYXRpb25zLmluZGV4T2YobmF0aW9uLmlzbyk7XG5cdFx0XHRcdFx0aWYgKGkgPT0gLTEpIHtcblx0XHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdGlvbi5pc28pXG5cdFx0XHRcdFx0XHR2bS5jb3VudHJpZXMucHVzaChuYXRpb24pO1xuXHRcdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZShuYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVswXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0XHRbNTAsIDUwXVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UubWFwTGF5ZXIuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93VGV4dCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdHRleHQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPT0gdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA8IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInRyZW5kaW5nX2Rvd25cIjtcblxuXHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfdXBcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93Q291bnRyaWVzQnV0dG9uKCkge1xuXHRcdFx0aWYgKHZtLnNob3dDb3VudHJpZXMpIHJldHVybiBcImFycm93X2Ryb3BfdXBcIjtcblx0XHRcdHJldHVybiBcImFycm93X2Ryb3BfZG93blwiO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGl0ZW1zQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2hvd0xpc3QgPSBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdCdzZWNlc3Npb24nLFxuXHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0J25hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnRvZ2dsZUl0ZW0gPSB0b2dnbGVJdGVtO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhpdGVtLCAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMpO1xuXHRcdFx0dmFyIGkgPSAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMuaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcyA9IFtcblx0XHRcdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdFx0XHQnYXV0b25vbXknLFxuXHRcdFx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHRcdFx0J2ludGVybmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHRcdFx0J290aGVyJ1xuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bmF0aW9uQ3RybCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkc3RhdGUsICRyb290U2NvcGUsIG5hdGlvbnMsIG5hdGlvbiwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5uYXRpb24gPSBuYXRpb247XG5cdFx0dm0uc2hvd01ldGhvZCA9IHNob3dNZXRob2Q7XG5cdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDVdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0dm0uY29sb3JzID0gWycjZDRlYmY3JywgJyM4N2NjZWInLCAnIzM2YThjNicsICcjMjY4Mzk5JywgJyMwZTYzNzcnXTtcblx0XHR2bS5yZWxhdGlvbnMgPSBbXTtcblx0XHR2bS5mZWF0dXJlZCA9IFtdO1xuXHRcdHZtLmNvbmZsaWN0ID0gbnVsbDtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRjb2xvcjogJyM0ZmIwZTUnLFxuXHRcdFx0ZmllbGQ6ICdpbnRlbnNpdHknLFxuXHRcdFx0c2l6ZTogNSxcblx0XHRcdGhpZGVOdW1iZXJpbmc6IHRydWUsXG5cdFx0XHR3aWR0aDo2NSxcblx0XHRcdGhlaWdodDo2NVxuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IFtdO1xuXG5cdFx0XHRuYXRpb25zLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaCh2bS5uYXRpb24uaXNvKTtcblx0XHRcdFx0dm0uZmVhdHVyZWQgPSBbXTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQodm0ubmF0aW9uLmlzbyk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmNvbmZsaWN0cywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuY291bnRyeUNsaWNrKGNvdW50cnlDbGljayk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gW107XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5uYXRpb24uY29uZmxpY3RzLCBmdW5jdGlvbihjb25mbGljdCkge1xuXHRcdFx0XHRcdGlmICghdm0uY29uZmxpY3QpIHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG5cdFx0XHRcdFx0aWYgKGNvbmZsaWN0LmludDIwMTUgPiB2bS5jb25mbGljdC5pbnQyMDE1KSB7XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29uZmxpY3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRpZihpdGVtID09IDEgKXtcblx0XHRcdFx0XHRcdFx0aWYodm0uZmVhdHVyZWQuaW5kZXhPZihrZXkpID09IC0xKXtcblx0XHRcdFx0XHRcdFx0XHR2bS5mZWF0dXJlZC5wdXNoKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSB2bS5mZWF0dXJlZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29uZmxpY3QubmF0aW9ucywgZnVuY3Rpb24obmF0aW9uKSB7XG5cdFx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuXHRcdFx0XHRcdFx0aWYgKGkgPT0gLTEgJiYgbmF0aW9uLmlzbyAhPSB2bS5uYXRpb24uaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdGlvbi5pc28pXG5cdFx0XHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUobmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94Jywgdm0ucmVsYXRpb25zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVsyXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFx0WzUwLCA1MF1cblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLm1hcExheWVyLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdH0pXG5cblxuXG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPT0gdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA8IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInRyZW5kaW5nX2Rvd25cIjtcblxuXHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfdXBcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0XHRpc286IGNvdW50cnkuaXNvXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7XG5cdFx0XHR2YXIgY29sb3JGdWxsID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0dmFyIG91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc28gPT0gdm0ubmF0aW9uLmlzbykge1xuXHRcdFx0XHRvdXRsaW5lID0ge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSg1NCw1Niw1OSwwLjgpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbG9yID0gY29sb3I7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiBvdXRsaW5lXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RzQ3RybCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJHN0YXRlLCAkcm9vdFNjb3BlLCAkc2NvcGUsIGNvbmZsaWN0cywgbmF0aW9ucywgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBSZXN0YW5ndWxhciwgRGlhbG9nU2VydmljZSwgRnVsbHNjcmVlbikge1xuXHRcdC8vXG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnJlYWR5ID0gZmFsc2U7XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uc2hvd01ldGhvZCA9IHNob3dNZXRob2Q7XG5cdFx0dm0uZ29GdWxsc2NyZWVuID0gZ29GdWxsc2NyZWVuO1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2FkZDlmMCcsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMDA1NTczJ107XG5cdFx0dm0udHlwZXNDb2xvcnMgPSB7XG5cdFx0XHRpbnRlcnN0YXRlOiAnIzY5ZDRjMycsXG5cdFx0XHRpbnRyYXN0YXRlOiAnI2I3YjdiNycsXG5cdFx0XHRzdWJzdGF0ZTogJyNmZjlkMjcnXG5cdFx0fTtcblx0XHR2bS5hY3RpdmUgPSB7XG5cdFx0XHRjb25mbGljdDogW10sXG5cdFx0XHR0eXBlOiBbMSwgMiwgM11cblx0XHR9O1xuXHRcdHZtLnRvZ2dsZUNvbmZsaWN0RmlsdGVyID0gdG9nZ2xlQ29uZmxpY3RGaWx0ZXI7XG5cdFx0dm0uY29uZmxpY3RGaWx0ZXIgPSBudWxsO1xuXG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0dm0ubmF0aW9ucyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5uYXRpb25zLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25mbGljdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRjYWxjSW50ZW5zaXRpZXMoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvL1x0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vfSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ29GdWxsc2NyZWVuKCkge1xuXG5cdFx0IGlmIChGdWxsc2NyZWVuLmlzRW5hYmxlZCgpKVxuXHRcdFx0XHRGdWxsc2NyZWVuLmNhbmNlbCgpO1xuXHRcdCBlbHNlXG5cdFx0XHRcdEZ1bGxzY3JlZW4uYWxsKCk7XG5cblx0XHQgLy8gU2V0IEZ1bGxzY3JlZW4gdG8gYSBzcGVjaWZpYyBlbGVtZW50IChiYWQgcHJhY3RpY2UpXG5cdFx0IC8vIEZ1bGxzY3JlZW4uZW5hYmxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nJykgKVxuXG5cdH1cblx0XHRmdW5jdGlvbiBzZXRWYWx1ZXMoKSB7XG5cdFx0XHR2bS5yZWxhdGlvbnMgPSBbXTtcblx0XHRcdHZtLmNvbmZsaWN0RmlsdGVyQ291bnQgPSAwO1xuXHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcyA9IHtcblx0XHRcdFx0dmVyeUxvdzogMCxcblx0XHRcdFx0bG93OiAwLFxuXHRcdFx0XHRtaWQ6IDAsXG5cdFx0XHRcdGhpZ2g6IDAsXG5cdFx0XHRcdHZlcnlIaWdoOiAwXG5cdFx0XHR9O1xuXHRcdFx0dm0uY2hhcnREYXRhID0gW3tcblx0XHRcdFx0bGFiZWw6IDEsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzBdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiAyLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1sxXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogMyxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMl1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDQsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzNdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiA1LFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1s0XVxuXHRcdFx0fV07XG5cblx0XHRcdHZtLmNvbmZsaWN0VHlwZXMgPSBbe1xuXHRcdFx0XHR0eXBlOiAnaW50ZXJzdGF0ZScsXG5cdFx0XHRcdHR5cGVfaWQ6IDEsXG5cdFx0XHRcdGNvbG9yOiAnIzY5ZDRjMycsXG5cdFx0XHRcdGNvdW50OiAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHR5cGU6ICdpbnRyYXN0YXRlJyxcblx0XHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRcdHR5cGVfaWQ6IDIsXG5cdFx0XHRcdGNvbG9yOiAnI2I3YjdiNydcblx0XHRcdH0sIHtcblx0XHRcdFx0dHlwZTogJ3N1YnN0YXRlJyxcblx0XHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRcdHR5cGVfaWQ6IDMsXG5cdFx0XHRcdGNvbG9yOiAnI2ZmOWQyNydcblx0XHRcdH1dO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd01ldGhvZCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdG1ldGhvZGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb25mbGljdEZpbHRlcih0eXBlKSB7XG5cblx0XHRcdHZhciBpID0gdm0uYWN0aXZlLnR5cGUuaW5kZXhPZih0eXBlKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUuc3BsaWNlKGksIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUucHVzaCh0eXBlKTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5hY3RpdmUudHlwZS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHR2bS5hY3RpdmUudHlwZSA9IFsxLCAyLCAzXTtcblx0XHRcdH1cblx0XHRcdGNhbGNJbnRlbnNpdGllcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNDb25mbGljdChjb25mbGljdCkge1xuXHRcdFx0dm0uY29uZmxpY3RGaWx0ZXJDb3VudCsrO1xuXHRcdFx0c3dpdGNoIChjb25mbGljdC50eXBlX2lkKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMF0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMV0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMl0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKGNvbmZsaWN0LmludDIwMTUpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy52ZXJ5TG93Kys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVswXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5sb3crKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzFdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLm1pZCsrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMl0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMuaGlnaCsrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbM10udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUhpZ2grKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzRdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdH1cblx0XHRcdGFkZENvdW50cmllcyhjb25mbGljdC5uYXRpb25zKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gYWRkQ291bnRyaWVzKG5hdGlvbnMpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKG5hdGlvbnMsIGZ1bmN0aW9uKG5hdCl7XG5cdFx0XHRcdGlmKHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdC5pc28pID09IC0xKXtcblx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXQuaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhbGNJbnRlbnNpdGllcygpIHtcblx0XHRcdHNldFZhbHVlcygpO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0cywgZnVuY3Rpb24gKGNvbmZsaWN0KSB7XG5cdFx0XHRcdGlmICh2bS5hY3RpdmUudHlwZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUuaW5kZXhPZihjb25mbGljdC50eXBlX2lkKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRjYWxjQ29uZmxpY3QoY29uZmxpY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjYWxjQ29uZmxpY3QoY29uZmxpY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHZtLnJlYWR5ID0gdHJ1ZTtcblx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnJlZHJhdygpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuXHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5WydpbnRlbnNpdHknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0XHRpc286IGNvdW50cnkuaXNvXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdGlmKHZtLnJlbGF0aW9ucy5pbmRleE9mKGlzbykgPT0gLTEpe1xuXHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsICYmIGlzbykge1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsgLy8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4cG9ydEN0cmwnLCBmdW5jdGlvbigkc3RhdGUsIEV4cG9ydFNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZXhwb3J0cyA9IFtdO1xuXG5cdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0dm0ub3B0aW9ucyA9IHtcblx0XHRcdGRyYWc6IGZhbHNlLFxuXHRcdFx0dHlwZTogJ2V4cG9ydHMnLFxuXHRcdFx0YWxsb3dNb3ZlOiBmYWxzZSxcblx0XHRcdGFsbG93RHJvcDogZmFsc2UsXG5cdFx0XHRhbGxvd0FkZDogdHJ1ZSxcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlLFxuXHRcdFx0aXRlbUNsaWNrOiBmdW5jdGlvbihpZCwgbmFtZSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5leHBvcnRzLmRldGFpbHMnLCB7XG5cdFx0XHRcdFx0aWQ6IGlkLFxuXHRcdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdFx0fSlcblx0XHRcdH0sXG5cdFx0XHRhZGRDbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmV4cG9ydHMuZGV0YWlscycsIHtcblx0XHRcdFx0XHRpZDogMCxcblx0XHRcdFx0XHRuYW1lOiAnbmV3J1xuXHRcdFx0XHR9KVxuXHRcdFx0fSxcblx0XHRcdGRlbGV0ZUNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbi5pbmRpY2VzLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaWQgPT0gaXRlbS5pZCkge1xuXHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLmluZGljZXMgPSBbXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0RXhwb3J0U2VydmljZS5nZXRFeHBvcnRzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR2bS5leHBvcnRzID0gcmVzcG9uc2U7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXhwb3J0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc3RhdGUsIEV4cG9ydFNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5leHBvcnQgPSB7fVxuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5vcHRpb25zID0ge1xuICAgICAgICAgIGV4cG9ydHM6e1xuICAgICAgICAgICAgb25Ecm9wOiBmdW5jdGlvbihldmVudCwgaW5kZXgsIGl0ZW0sIGV4dGVybmFsKXtcbiAgICAgICAgICAgICAgaXRlbS5pbmRpY2F0b3JfaWQgPSBpdGVtLmlkO1xuICAgICAgICAgICAgICBpdGVtLnR5cGUgPSAnaW5kaWNhdG9yJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnNlcnRlZDogZnVuY3Rpb24oZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCl7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRDbGljazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguZXhwb3J0cy5kZXRhaWxzLmFkZCcpO1xuICAgICAgICAgICAgfSxcbiAgICBcdFx0XHRcdGFkZENvbnRhaW5lckNsaWNrOmZ1bmN0aW9uKCl7XG4gICAgXHRcdFx0XHRcdHZhciBpdGVtID0ge1xuICAgIFx0XHRcdFx0XHRcdHRpdGxlOiAnSSBhbSBhIGdyb3VwLi4uIG5hbWUgbWUnXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHZtLmV4cG9ydC5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgIFx0XHRcdFx0fSxcbiAgICBcdFx0XHRcdGRlbGV0ZUNsaWNrOmZ1bmN0aW9uKCl7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZCxmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgIFx0XHRcdFx0XHRcdFx0cmVtb3ZlSXRlbShpdGVtLHZtLmV4cG9ydC5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICBFeHBvcnRTZXJ2aWNlLnJlbW92ZSh2bSxpdGVtLmlkKTtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gW107XG4gICAgXHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0fSxcbiAgICBcdFx0XHRcdGRlbGV0ZURyb3A6IGZ1bmN0aW9uKGV2ZW50LGl0ZW0sZXh0ZXJuYWwsdHlwZSl7XG4gICAgXHRcdFx0XHRcdFx0cmVtb3ZlSXRlbShpdGVtLHZtLmV4cG9ydC5pdGVtcyk7XG4gICAgXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG4gICAgXHRcdFx0XHR9LFxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NhdmluZycpO1xuICAgICAgICAgICAgICBFeHBvcnRTZXJ2aWNlLnNhdmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkb25lIHNhdmluZycsIHZtLmV4cG9ydCk7XG4gICAgICAgICAgICAgICAgaWYodm0uZXhwb3J0LmlkID09IDAgfHwgIXZtLmV4cG9ydC5pZCl7XG4gICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5leHBvcnRzLmRldGFpbHMnLHtpZDpyZXNwb25zZS5pZCwgbmFtZTpyZXNwb25zZS5uYW1lfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgLy8gaWYodm0uZXhwb3J0LmlkID09IDAgfHwgISB2bS5leHBvcnQuaWQpe1xuICAgICAgICAgICAgICAvLyAgIERhdGFTZXJ2aWNlLnBvc3QoJ2V4cG9ydHMnLCB2bS5leHBvcnQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgLy8gICB9KTtcbiAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAvLyBlbHNle1xuICAgICAgICAgICAgICAvLyAgIHZtLml0ZW0uc2F2ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAvLyAgIH0pO1xuICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdHlsZTp7XG4gICAgICAgICAgICBjbGljazogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmV4cG9ydHMuZGV0YWlscy5zdHlsZScse3N0eWxlSWQ6aXRlbS5pZCwgc3R5bGVOYW1lOml0ZW0ubmFtZX0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB3aXRoU2F2ZTogdHJ1ZSxcbiAgICAgICAgICBzdHlsZWFibGU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgaWYoJHN0YXRlLnBhcmFtcy5pZCAhPSAwKXtcbiAgICAgICAgICAgIEV4cG9ydFNlcnZpY2UuZ2V0RXhwb3J0KCRzdGF0ZS5wYXJhbXMuaWQsIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgdm0uZXhwb3J0ID0gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLmV4cG9ydCA9IEV4cG9ydFNlcnZpY2Uuc2V0RXhwb3J0KHtcbiAgICAgICAgICAgICAgaXRlbXM6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcbiAgICBcdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0uaWQpe1xuICAgIFx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcbiAgICBcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHJlbW92ZUl0ZW0oaXRlbSwgZW50cnkuY2hpbGRyZW4pO1xuICAgIFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuICAgIFx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4cG9ydFN0eWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgRXhwb3J0U2VydmljZSwgIGxlYWZsZXREYXRhLCBsZWFmbGV0TWFwRXZlbnRzLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmV4cG9ydGVyID0ge307XG4gICAgdm0uaXRlbSA9IHt9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZtLmV4cG9ydGVyID0gRXhwb3J0U2VydmljZS5leHBvcnRlcjtcbiAgICAgICAgLy8gaWYoIXZtLmV4cG9ydGVyLml0ZW1zLmxlbmd0aCkgJHN0YXRlLmdvKCdhcHAuaW5kZXguZXhwb3J0cy5kZXRhaWxzJyx7XG4gICAgICAgIC8vICAgaWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG4gICAgICAgIC8vICAgbmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lXG4gICAgICAgIC8vIH0pXG5cdFx0XHRcdHZtLml0ZW0gPSBnZXRBY3RpdmVJdGVtKHZtLmV4cG9ydGVyLml0ZW1zLCAkc3RhdGUucGFyYW1zLnN0eWxlSWQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh2bS5pdGVtKTtcblx0XHRcdFx0aWYodHlwZW9mIHZtLml0ZW0gPT0gXCJ1bmRlZmluZWRcIikgJHN0YXRlLmdvKCdhcHAuaW5kZXguZXhwb3J0cy5kZXRhaWxzJyx7XG4gICAgICAgICAgaWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG4gICAgICAgICAgbmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lXG4gICAgICAgIH0pXG5cdFx0XHRcdGlmKCF2bS5pdGVtLnN0eWxlKXtcblx0XHRcdFx0XHR2bS5pdGVtLnN0eWxlID0ge1xuXHRcdFx0XHRcdFx0YmFzZW1hcF9pZDowLFxuXHRcdFx0XHRcdFx0Zml4ZWRfdGl0bGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Zml4ZWRfZGVzY3JpcHRpb246ZmFsc2UsXG5cdFx0XHRcdFx0XHRzZWFyY2hfYm94OiB0cnVlLFxuXHRcdFx0XHRcdFx0c2hhcmVfb3B0aW9uczogdHJ1ZSxcblx0XHRcdFx0XHRcdHpvb21fY29udHJvbHM6IHRydWUsXG5cdFx0XHRcdFx0XHRzY3JvbGxfd2hlZWxfem9vbTogZmFsc2UsXG5cdFx0XHRcdFx0XHRsYXllcl9zZWxlY3Rpb246IGZhbHNlLFxuXHRcdFx0XHRcdFx0bGVnZW5kczp0cnVlLFxuXHRcdFx0XHRcdFx0ZnVsbF9zY3JlZW46IGZhbHNlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldEFjdGl2ZUl0ZW0obGlzdCwgaWQpIHtcblx0XHRcdHZhciBmb3VuZDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSBpdGVtO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChpdGVtLmNoaWxkcmVuICYmICFmb3VuZClcblx0XHRcdFx0XHRcdGZvdW5kID0gZ2V0QWN0aXZlSXRlbShpdGVtLmNoaWxkcmVuLCBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH07XG5cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0uc3R5bGUnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gPT09IG8gfHwgIW4uYmFzZW1hcCkgcmV0dXJuO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldEJhc2VMYXllcihuLmJhc2VtYXApO1xuXHRcdFx0Ly8gVmVjdG9ybGF5ZXJTZXJ2aWNlLmxheWVycy5iYXNlbGF5ZXJzWyd4eXonXS51cmwgPSBuLmJhc2VtYXAudXJsO1xuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Z1bGxMaXN0Rml0bGVyQ3RybCcsIGZ1bmN0aW9uKGNhdGVnb3JpZXMsIENvbnRlbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblxuICAgIHZtLmZpbHRlciA9IFtdO1xuICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICBjYXRlZ29yaWVzOntcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2bS5maWx0ZXIgPVtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgbGlzdENhdGVnb3JpZXMoaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgQ29udGVudFNlcnZpY2UuZmlsdGVyTGlzdCgnaW5kaWNhdG9ycycsY2F0RmlsdGVyLHZtLnNlbGVjdGlvbik7XG4gICAgICAgICAgQ29udGVudFNlcnZpY2UuZmlsdGVyTGlzdCgnaW5kaWNlcycsY2F0RmlsdGVyLHZtLnNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGFkZFRvRmlsdGVyKGlkKXtcbiAgICAgIHZhciBpZHggPSB2bS5maWx0ZXIuaW5kZXhPZihpZCk7XG4gICAgICBpZihpZHggPT0gLTEpe1xuICAgICAgICB2bS5maWx0ZXIucHVzaChpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpc3RDYXRlZ29yaWVzKGNhdCl7XG4gICAgICBhZGRUb0ZpbHRlcihjYXQuaWQpO1xuICAgICAgaWYoY2F0LmNoaWxkcmVuKXtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGNhdC5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgIGFkZFRvRmlsdGVyKGNoaWxkLmlkKTtcbiAgICAgICAgICBsaXN0Q2F0ZWdvcmllcyhjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gY2F0RmlsdGVyKGl0ZW0pe1xuXHRcdFx0XHRpZihpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID4gMCAmJiB2bS5maWx0ZXIubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRcdGlmKHZtLmZpbHRlci5pbmRleE9mKGNhdC5pZCkgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGdWxsTGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCBDb250ZW50U2VydmljZSwgY2F0ZWdvcmllcywgaW5kaWNhdG9ycywgaW5kaWNlcykge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHR2bS5pbmRpY2F0b3JzID0gaW5kaWNhdG9ycztcblx0XHR2bS5pbmRpY2VzID0gaW5kaWNlcztcblx0XHR2bS5maWx0ZXIgPSB7XG5cdFx0XHRzb3J0OiAndGl0bGUnLFxuXHRcdFx0dG9nZ2xlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXgubGlzdCcpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lmxpc3QuZmlsdGVyJyx7ZmlsdGVyOidjYXRlZ29yaWVzJ30pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZXNldEZpbHRlcignaW5kaWNhdG9ycycpO1xuXHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlc2V0RmlsdGVyKCdpbmRpY2VzJyk7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubGlzdCcpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtyZXR1cm4gQ29udGVudFNlcnZpY2UuY29udGVudC5pbmRpY2F0b3JzfSwgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuID09PSBvIClyZXR1cm47XG5cdFx0XHR2bS5pbmRpY2F0b3JzID0gbjtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmNvbnRlbnQuaW5kaWNlc30sIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiA9PT0gbyApcmV0dXJuO1xuXHRcdFx0dm0uaW5kaWNlcyA9IG47XG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkbWRNZWRpYSwgbGVhZmxldERhdGEsICRzdGF0ZSwkbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyLCAkdGltZW91dCl7XG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdCRyb290U2NvcGUuaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9naW4gPSBkb0xvZ2luO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVWaWV3ID0gdG9nZ2xlVmlldztcblxuXHRcdHZtLmF1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKHByb3ZpZGVyKXtcblx0XHRcdCRhdXRoLmF1dGhlbnRpY2F0ZShwcm92aWRlcik7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dpbigpe1xuXHRcdFx0JGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9nb3V0KCl7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdCRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHRmdW5jdGlvbiB0b2dnbGVWaWV3KCl7XG5cdFx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gISRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHQkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3ID0gJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCckcm9vdC5zaWRlYmFyT3BlbicsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRpZihuID09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7IHJldHVybiAkbWRNZWRpYSgnc20nKSB9LCBmdW5jdGlvbihzbWFsbCkge1xuXHQgICAgdm0uc21hbGxTY3JlZW4gPSBzbWFsbDtcblx0ICB9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgnLCB7aXNfb2ZmaWNpYWw6IHRydWV9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICB2bS5pbmRpemVzID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csJG1kU2lkZW5hdiwgJHJvb3RTY29wZSwgJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UsIGRhdGEsIGNvdW50cmllcywgbGVhZmxldERhdGEsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly8gVmFyaWFibGUgZGVmaW5pdGlvbnNcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm1hcCA9IG51bGw7XG5cblx0XHR2bS5kYXRhU2VydmVyID0gZGF0YS5wcm9taXNlcy5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGRhdGEucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tID0gdm0ubXZ0Q291bnRyeUxheWVyICsgXCJfZ2VvbVwiO1xuXHRcdHZtLmlzb19maWVsZCA9IFZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzI7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cdFx0dm0uZ29Ub0luZGV4ID0gZ29Ub0luZGV4O1xuXG5cdFx0dm0uY2FsY1RyZWUgPSBjYWxjVHJlZTtcblxuXHRcdHZtLmlzUHJlbGFzdCA9IGlzUHJlbGFzdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0dm0uc3RydWN0dXJlU2VydmVyLnRoZW4oZnVuY3Rpb24oc3RydWN0dXJlKSB7XG5cdFx0XHRcdHZtLmRhdGFTZXJ2ZXIudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGlmICghdm0uc3RydWN0dXJlLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUuc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRcdCduYW1lJzogJ2RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiAnRGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCdiYXNlX2NvbG9yJzogJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKSdcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcyh2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvcik7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdHZtLnNldFN0YXRlKCRzdGF0ZS5wYXJhbXMuaXRlbSk7XG5cdFx0XHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGdldE5hdGlvbkJ5SXNvKGlzbykpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvL29uc29sZS5sb2codm0uY29tcGFyZS5jb3VudHJpZXMpO1xuXHRcdFx0XHRcdFx0Y291bnRyaWVzLnB1c2godm0uY3VycmVudC5pc28pO1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGNvdW50cmllcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0Ly8gVE9ETzogTU9WRSBUTyBHTE9CQUxcblx0XHRmdW5jdGlvbiBnb0JhY2soKSB7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnb1RvSW5kZXgoaXRlbSl7XG5cblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLHtcblx0XHRcdFx0aWQ6aXRlbS5pZCxcblx0XHRcdFx0bmFtZTppdGVtLm5hbWUsXG5cdFx0XHRcdGl0ZW06JHN0YXRlLnBhcmFtc1snaXRlbSddXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaXNQcmVsYXN0KCl7XG5cdFx0XHR2YXIgbGV2ZWxzRm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zdHJ1Y3R1cmUuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcblx0XHRcdFx0aWYoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0bGV2ZWxzRm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsZXZlbHNGb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2hvd1RhYkNvbnRlbnQoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQgPT0gJycgJiYgdm0udGFiQ29udGVudCA9PSAnJykge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHR2bS50b2dnbGVCdXR0b24gPSB2bS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGl0ZW0pIHtcblx0XHRcdHZtLnNldEN1cnJlbnQoZ2V0TmF0aW9uQnlJc28oaXRlbSkpO1xuXHRcdFx0ZmV0Y2hOYXRpb25EYXRhKGl0ZW0pO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVPcGVuKCkge1xuXHRcdFx0dm0ubWVudWVPcGVuID0gIXZtLm1lbnVlT3Blbjtcblx0XHRcdHZtLmNsb3NlSWNvbiA9IHZtLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cblx0XHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoaXNvKSB7XG5cdFx0XHRpZiAodm0ubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjYWxjUmFuaygpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHR2YXIga2FjayA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0XHQvL3ZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgJ3Njb3JlJywgJ2lzbycsIHRydWUpO1xuXHRcdFx0cmFuayA9IHZtLmRhdGEuaW5kZXhPZih2bS5jdXJyZW50KSArIDE7XG5cdFx0XHR2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6IHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0ZmllbGQ6IHZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJyxcblx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSkge1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHQvL1RPRE86IFJFTU9WRSwgTk9XIEdPVCBPV04gVVJMXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBQVVQgSU4gVklFV1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZURldGFpbHMoKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGV0YWlscyA9ICF2bS5kZXRhaWxzO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGZldGNoTmF0aW9uRGF0YShpc28pIHtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArICRzdGF0ZS5wYXJhbXMuaWQsIGlzbykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gTUFQIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmICghJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0NvbXBhcmlzb24od2FudCkge1xuXHRcdFx0aWYgKHdhbnQgJiYgIXZtLmNvbXBhcmUuYWN0aXZlIHx8ICF3YW50ICYmIHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb21wYXJpc29uKCkge1xuXHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMgPSBbdm0uY3VycmVudF07XG5cdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9ICF2bS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdGlmIChjb3VudHJ5ID09IG5hdCAmJiBuYXQgIT0gdm0uY3VycmVudCkge1xuXHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goY291bnRyeSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzb3MgPSBbXTtcblx0XHRcdHZhciBjb21wYXJlID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpc29zLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHRpZiAoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdGNvbXBhcmUucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgaXNvcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTogJHN0YXRlLnBhcmFtcy5pdGVtLFxuXHRcdFx0XHRcdGNvdW50cmllczogY29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpKTtcblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTc7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFZJRVdcblx0XHRmdW5jdGlvbiBzZXRUYWIoaSkge1xuXHRcdFx0Ly92bS5hY3RpdmVUYWIgPSBpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChkYXRhKSB7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmNvbHVtbl9uYW1lID09IHZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSkge1xuXHRcdFx0XHRcdHZtLm5vZGVQYXJlbnQgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdldFBhcmVudChpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNUcmVlKCkge1xuXHRcdFx0Z2V0UGFyZW50KHZtLnN0cnVjdHVyZSk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeU5hbWUobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBDT1VOVFJZXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlJc28oaXNvKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhjb2xvcikge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiB1cGRhdGVDYW52YXMoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cblx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblxuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZiAoaXNvICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKGZlYXR1cmUucHJvcGVydGllcy5uYW1lKVxuXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbScpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG4uaXNvKSB7XG5cdFx0XHRcdGlmIChvLmlzbykge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbby5pc29dLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0ZmV0Y2hOYXRpb25EYXRhKG4uaXNvKTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tuLmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnIHx8ICRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93Jykge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IG4uaXNvXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmIChuLmNvbG9yKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpZDogbi5pZCxcblx0XHRcdFx0XHRcdG5hbWU6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0XHRcdFx0Y291bnRyaWVzOiAkc3RhdGUucGFyYW1zLmNvdW50cmllc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc29cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdG5hbWU6IG4ubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Lyp2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXVxuXHRcdFx0XHRdKi9cblx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVsyXVsxXSwgbi5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRbMTAwLCAxMDBdXG5cdFx0XHRdO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHBhZCA9IFtcblx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdG1heFpvb206IDZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24oZXZ0LCB0KSB7XG5cblx0XHRcdFx0XHRpZiAoIXZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLm9wZW4oKTtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnLCBldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdChjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDaGVja0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSkge1xuXG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLnNlbGVjdGVkID0gW107XG4gICAgdm0ueWVhcmZpbHRlciA9ICcnO1xuXHRcdHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuXHRcdHZtLmRlbGV0ZVNlbGVjdGVkID0gZGVsZXRlU2VsZWN0ZWQ7XG5cdFx0dm0uZGVsZXRlQ29sdW1uID0gZGVsZXRlQ29sdW1uO1xuXHRcdHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblx0XHR2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuXHRcdHZtLnNlbGVjdEVycm9ycyA9IHNlbGVjdEVycm9ycztcbiAgICB2bS5zZWFyY2hGb3JFcnJvcnMgPSBzZWFyY2hGb3JFcnJvcnM7XG5cdFx0dm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuXHRcdC8vdm0uZWRpdENvbHVtbkRhdGEgPSBlZGl0Q29sdW1uRGF0YTtcblx0XHR2bS5lZGl0Um93ID0gZWRpdFJvdztcbiAgICB2bS55ZWFycyA9IFtdO1xuXHRcdHZtLnF1ZXJ5ID0ge1xuXHRcdFx0ZmlsdGVyOiAnJyxcblx0XHRcdG9yZGVyOiAnLWVycm9ycycsXG5cdFx0XHRsaW1pdDogMTUsXG5cdFx0XHRwYWdlOiAxXG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGNoZWNrRGF0YSgpO1xuICAgIFx0Z2V0WWVhcnMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuICAgIGZ1bmN0aW9uIGdldFllYXJzKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgZGF0ID0gKCRmaWx0ZXIoJ2dyb3VwQnknKSh2bS5kYXRhLCAnZGF0YS4nK3ZtLm1ldGEuY291bnRyeV9maWVsZCApKTtcblx0ICAgICAgdm0ueWVhcnMgPSBbXTtcblx0XHRcdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0XHRcdHZhciBpbmRleCA9IG51bGw7XG5cdFx0XHQgIGFuZ3VsYXIuZm9yRWFjaChkYXQsZnVuY3Rpb24oZW50cnksIGkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5Lmxlbmd0aCA+IGxlbmd0aCl7XG5cdFx0XHRcdFx0XHRpbmRleCA9IGlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHQgICAgICBhbmd1bGFyLmZvckVhY2goZGF0W2luZGV4XSxmdW5jdGlvbihlbnRyeSl7XG5cdCAgICAgICAgdm0ueWVhcnMucHVzaChlbnRyeS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pXG5cdCAgICAgIH0pO1xuXHRcdFx0XHR2bS55ZWFyZmlsdGVyID0gdm0ueWVhcnNbMF07XG5cdFx0XHR9KTtcblxuXG4gICAgfVxuXHRcdGZ1bmN0aW9uIHNlYXJjaChwcmVkaWNhdGUpIHtcblx0XHRcdHZtLmZpbHRlciA9IHByZWRpY2F0ZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuXHRcdFx0cmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcblx0XHRcdC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNoZWNrRm9yRXJyb3JzKGl0ZW0pIHtcblx0XHRcdHJldHVybiBpdGVtLmVycm9ycy5sZW5ndGggPiAwID8gJ21kLXdhcm4nIDogJyc7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuXHRcdCAgdm0udG9FZGl0ID0ga2V5O1xuXHRcdCAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRjb2x1bW4nLCAkc2NvcGUpO1xuXHRcdH0qL1xuXHRcdGZ1bmN0aW9uIGRlbGV0ZUNvbHVtbihlLCBrZXkpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoZmllbGQsIGwpIHtcblx0XHRcdFx0XHRpZiAobCA9PSBrZXkpIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpe1xuXHRcdFx0XHRcdFx0XHRpZihlcnJvci5jb2x1bW4gPT0ga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZXJyb3JzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdGRlbGV0ZSB2bS5kYXRhW2tdLmRhdGFba2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBrKSB7XG5cdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMtLTtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5lcnJvcnMtLTtcblx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0dm0uZGF0YS5zcGxpY2Uodm0uZGF0YS5pbmRleE9mKGl0ZW0pLCAxKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uZGVsZXRlRGF0YSgpO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RFcnJvcnMoKSB7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZWRpdFJvdygpIHtcblx0XHRcdHZtLnJvdyA9IHZtLnNlbGVjdGVkWzBdO1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRyb3cnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZURhdGEoKSB7XG5cdFx0XHR2bS5kYXRhID0gW107XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9yRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChyb3csIGspIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogaXRlbVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpXG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuXHRcdHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdC8vdm0ubXlEYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG5cdFx0XHQvL2NoZWNrTXlEYXRhKCk7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBjaGVja015RGF0YSgpIHtcblx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSovXG5cblx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmICggaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIi8qIHx8IGl0ZW0gPCAwKi8gfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcblx0XHRcdFx0XHRcdHJvdzoga2V5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG5cblx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcblx0XHRcdHZhciBlbnRyaWVzID0gW107XG5cdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcblx0XHRcdFx0ZGF0YTogZW50cmllcyxcblx0XHRcdFx0aXNvOiBpc29UeXBlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5kYXRhLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdG9TZWxlY3QgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmKGNvdW50cnkuZGF0YS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGEgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjNcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZElzb0Vycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5pc29fY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdHZtLmV4dGVuZERhdGEgPSBleHRlbmREYXRhO1xuXG5cdFx0ZnVuY3Rpb24gZXh0ZW5kRGF0YSgpIHtcblx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHZhciBtZXRhID0gW10sXG5cdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcblx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Y29uc29sZS5sb2coaW5zZXJ0RGF0YSk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgdm0uYWRkRGF0YVRvLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcblx0XHR2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvKmlmICh2bS5tZXRhLnllYXJfZmllbGQpIHtcblx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHR9Ki9cblx0XHRcdGNoZWNrRGF0YSgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrRGF0YSgpIHtcblx0XHRcdGlmICghdm0uZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzYXZlRGF0YSh2YWxpZCkge1xuXHRcdFx0aWYgKHZhbGlkKSB7XG5cdFx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBub1llYXJzID0gW107XG5cdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG5cdFx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdFx0aWYoaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pe1xuXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdG5vWWVhcnMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZtLmluZGljYXRvcnNba2V5XS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIGZpZWxkID0ge1xuXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdCdkZXNjcmlwdGlvbic6IHZtLmluZGljYXRvcnNba2V5XS5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdzdHlsZV9pZCc6IHN0eWxlX2lkLFxuXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0dmFyIGNhdGVnb3JpZXMgPSBbXTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG5cdFx0XHRcdGlmKG5vWWVhcnMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbE1lbnVDdHJsJywgZnVuY3Rpb24oSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzTGVuZ3RoID0gT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoO1xuXG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBWZWN0b3JsYXllclNlcnZpY2UsJHRpbWVvdXQsSW5kZXhTZXJ2aWNlLGxlYWZsZXREYXRhLCB0b2FzdHIpe1xuICAgICAgICAvL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICB2bS5pbmRpY2F0b3JzID0gW107XG4gICAgICAgIHZtLnNjYWxlID0gXCJcIjtcbiAgICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgICB2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKTtcbiAgICAgICAgdm0uY291bnRyaWVzU3R5bGUgPSBjb3VudHJpZXNTdHlsZTtcbiAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjaGVja0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRGF0YSgpe1xuICAgICAgICAgIGlmKCF2bS5kYXRhKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgICAgdm0uaW5kaWNhdG9yID0gbjtcbiAgICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICAgIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG4gICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmluZGljYXRvcicsIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbykgcmV0dXJuO1xuICAgICAgICAgIGlmKHR5cGVvZiBuLnN0eWxlX2lkICE9IFwidW5kZWZpbmVkXCIgKXtcbiAgICAgICAgICAgIGlmKG4uc3R5bGVfaWQgIT0gby5zdHlsZV9pZCl7XG4gICAgICAgICAgICAgIGlmKG4uc3R5bGUpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBuLmNhdGVnb3JpZXMgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIGlmKG4uY2F0ZWdvcmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5jYXRlZ29yaWVzWzBdLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRBY3RpdmVJbmRpY2F0b3JEYXRhKG4pO1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9LHRydWUpO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gbWluTWF4KCl7XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgdm0ubWluID0gTWF0aC5taW4oaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV0sIHZtLm1pbik7XG4gICAgICAgICAgICAgIHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5tYXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuICAgICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgaWYoaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9PSBpc28pe1xuICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcbiAgICBcdFx0XHR2YXIgc3R5bGUgPSB7fTtcbiAgICBcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcbiAgICBcdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuICAgIFx0XHRcdHZhciBmaWVsZCA9IHZtLmluZGljYXRvci5jb2x1bW5fbmFtZTtcbiAgICBcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuICAgIFx0XHRcdHN3aXRjaCAodHlwZSkge1xuICAgIFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblxuICAgIFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG4gICAgXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG4gICAgICAgICAgICAgIHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcbiAgICBcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuICAgIFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcbiAgICBcdFx0XHRcdFx0XHRcdHNpemU6IDJcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdGJyZWFrO1xuXG4gICAgXHRcdFx0fVxuXG4gICAgXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSsnX2dlb20nKSB7XG4gICAgXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuICAgIFx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuICAgIFx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG4gICAgXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0XHRcdH07XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0fVxuICAgICAgICBmdW5jdGlvbiBzZXRDb3VudHJpZXMoKXtcbiAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuICAgICAgICAgIHZtLm12dFNvdXJjZS5yZWRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuICAgICAgICAgIG1pbk1heCgpO1xuICAgIFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG4gICAgXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICBcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0XHRzZXRDb3VudHJpZXMoKTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH0pO1xuICAgIFx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkc3RhdGUsIHRvYXN0ciwgRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgSW5kZXhTZXJ2aWNlLnJlc2V0SW5kaWNhdG9yKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgIHZtLnNlbGVjdEZvckVkaXRpbmcgPSBzZWxlY3RGb3JFZGl0aW5nO1xuICAgICAgdm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuICAgICAgdm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuICAgICAgdm0uY2hlY2tBbGwgPSBjaGVja0FsbDtcbiAgICAgIHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuICAgICAgZnVuY3Rpb24gc2VsZWN0Rm9yRWRpdGluZyhrZXkpe1xuICAgICAgICBpZih0eXBlb2YgSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LHtcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOmtleSxcbiAgICAgICAgICAgIHRpdGxlOmtleVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZtLmVkaXRpbmdJdGVtID0ga2V5O1xuICAgICAgICB2bS5pbmRpY2F0b3IgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG4gICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdGlmIChpdGVtLnRpdGxlICYmIGl0ZW0udHlwZSAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG4gIFx0XHRcdFx0cmV0dXJuIHRydWU7XG4gIFx0XHRcdH1cbiAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICBcdFx0fVxuICBcdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBpdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRyZXR1cm4gY2hlY2tCYXNlKGl0ZW0pICYmIGl0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gIFx0XHR9XG4gICAgICBmdW5jdGlvbiBjaGVja0FsbCgpe1xuICAgICAgICB2YXIgZG9uZSA9IDA7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbihpbmRpY2F0b3Ipe1xuICAgICAgICAgIGlmKGNoZWNrQmFzZShpbmRpY2F0b3IpKXtcbiAgICAgICAgICAgIGRvbmUgKys7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkb25lLCBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpO1xuICAgICAgICBpZihkb25lID09IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aCl7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gc2F2ZURhdGEoKSB7XG5cbiAgICAgICAgICBpZighdm0ubWV0YS55ZWFyX2ZpZWxkICYmICF2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFllYXInLCAkc2NvcGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcbiAgXHRcdFx0XHRcdGRhdGE6IFtdXG4gIFx0XHRcdFx0fTtcbiAgXHRcdFx0XHR2YXIgbm9ZZWFycyA9IFtdO1xuICBcdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG4gIFx0XHRcdFx0XHRmaWVsZHMgPSBbXTtcbiAgXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG4gIFx0XHRcdFx0XHRcdGlmKGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKXtcbiAgXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG4gIFx0XHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuICBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuICBcdFx0XHRcdFx0XHRcdH1cblxuICBcdFx0XHRcdFx0XHRcdHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gIFx0XHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdFx0ZWxzZXtcbiAgICAgICAgICAgICAgICBpZih2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgICAgICAgaXRlbS5kYXRhLnllYXIgPSB2bS5tZXRhLnllYXI7XG4gICAgICAgICAgICAgICAgICB2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICBcdG5vWWVhcnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICBcdFx0XHRcdFx0XHR9XG5cblxuICBcdFx0XHRcdFx0fSBlbHNlIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcbiAgXHRcdFx0XHRcdFx0cmV0dXJuO1xuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdH0pO1xuICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gIFx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcbiAgXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcbiAgXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuICBcdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZhciBmaWVsZCA9IHtcbiAgXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuICBcdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcbiAgXHRcdFx0XHRcdFx0XHQnZGVzY3JpcHRpb24nOiB2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG4gIFx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcbiAgXHRcdFx0XHRcdFx0XHQnc3R5bGVfaWQnOiBzdHlsZV9pZCxcbiAgXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG4gIFx0XHRcdFx0XHRcdH07XG4gIFx0XHRcdFx0XHRcdHZhciBjYXRlZ29yaWVzID0gW107XG4gIFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuICBcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuICBcdFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIFx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgXHRcdFx0XHRpZihub1llYXJzLmxlbmd0aCA+IDApe1xuICBcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0XHR9XG5cbiAgXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIFx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gIFx0XHRcdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuICBcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG4gIFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gIFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG4gIFx0XHRcdFx0XHRcdFx0dm0uZGF0YSA9IFtdO1xuICBcdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgXHRcdFx0XHRcdH0pO1xuICBcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0fSlcblxuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY29weVRvT3RoZXJzKCl7XG4gICAgICAvKiAgdm0ucHJlUHJvdmlkZXIgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmRhdGFwcm92aWRlcjtcbiAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb3B5cHJvdmlkZXInLCAkc2NvcGUpOyovXG4gICAgICB9XG4gICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICB2bS5pbmRpY2F0b3JzW24uY29sdW1uX25hbWVdID0gbjtcbiAgICAgIH0sdHJ1ZSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZiAobiA9PT0gbyB8fCB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiIHx8IG8gPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZighdm0uYXNrZWRUb1JlcGxpY2F0ZSkge1xuICAgICAgICAgIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICAgIHZtLnByZVR5cGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnR5cGU7XG4gICAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgICB2bS5wcmVTdHlsZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uc3R5bGU7XG5cbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL24uZGF0YXByb3ZpZGVyID0gdm0uZG9Qcm92aWRlcnMgPyB2bS5wcmVQcm92aWRlciA6IFtdO1xuICAgICAgICAgIC8vbi5tZWFzdXJlX3R5cGVfaWQgPSB2bS5kb01lYXN1cmVzID8gdm0ucHJlTWVhc3VyZSA6IDA7XG4gICAgICAgICAgLy9uLmNhdGVnb3JpZXMgPSB2bS5kb0NhdGVnb3JpZXMgPyB2bS5wcmVDYXRlZ29yaWVzOiBbXTtcbiAgICAgICAgICAvL24uaXNfcHVibGljID0gdm0uZG9QdWJsaWMgPyB2bS5wcmVQdWJsaWM6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUVudHJ5Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gVXNlclNlcnZpY2UubXlEYXRhKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFNZW51Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLmRhdGEgPSBbXTtcblxuICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgVXNlclNlcnZpY2UubXlEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB2bS5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnZlcnRJbmZvKCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRJbmZvKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBpdGVtLm1ldGEgPSBKU09OLnBhcnNlKGl0ZW0ubWV0YV9kYXRhKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Y3JlYXRvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2UsRGF0YVNlcnZpY2UsICR0aW1lb3V0LCRzdGF0ZSwgJGZpbHRlciwgbGVhZmxldERhdGEsIHRvYXN0ciwgSWNvbnNTZXJ2aWNlLEluZGV4U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlKXtcblxuICAgICAgICAvL1RPRE86IENoZWNrIGlmIHRoZXJlIGlzIGRhdGEgaW4gc3RvcmFnZSB0byBmaW5pc2hcbiAgICAgIC8qICBjb25zb2xlLmxvZygkc3RhdGUpO1xuICAgICAgICBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguY3JlYXRlJyl7XG4gICAgICAgICAgaWYoSW5kZXhTZXJ2aWNlLmdldERhdGEoKS5sZW5ndGgpe1xuICAgICAgICAgICAgaWYoY29uZmlybSgnRXhpc3RpbmcgRGF0YS4gR28gT24/Jykpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9Ki9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYXAgPSBudWxsO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9W107XG4gICAgICAgIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuXG4gICAgICAgIHZtLmdyb3VwcyA9IFtdO1xuICAgICAgICB2bS5teURhdGEgPSBbXTtcbiAgICAgICAgdm0uYWRkRGF0YVRvID0ge307XG4gICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgdm0uaXNvX2Vycm9ycyA9IDA7XG4gICAgICAgIHZtLmlzb19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgLy92bS5zZWFyY2ggPSBzZWFyY2g7XG5cbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnRvZ2dsZUxpc3RSZXNvdXJjZXMgPSB0b2dnbGVMaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlID0gc2VsZWN0ZWRSZXNvdXJjZTtcbiAgICAgICAgdm0udG9nZ2xlUmVzb3VyY2UgPSB0b2dnbGVSZXNvdXJjZTtcbiAgICAgICAgdm0uaW5jcmVhc2VQZXJjZW50YWdlID0gaW5jcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS5kZWNyZWFzZVBlcmNlbnRhZ2UgPSBkZWNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLnRvZ2dsZUdyb3VwU2VsZWN0aW9uID0gdG9nZ2xlR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmV4aXN0c0luR3JvdXBTZWxlY3Rpb24gPSBleGlzdHNJbkdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5hZGRHcm91cCA9IGFkZEdyb3VwO1xuICAgICAgICB2bS5jbG9uZVNlbGVjdGlvbiA9IGNsb25lU2VsZWN0aW9uO1xuICAgICAgICB2bS5lZGl0RW50cnkgPSBlZGl0RW50cnk7XG4gICAgICAgIHZtLnJlbW92ZUVudHJ5ID0gcmVtb3ZlRW50cnk7XG4gICAgICAgIHZtLnNhdmVJbmRleCA9IHNhdmVJbmRleDtcblxuICAgICAgICB2bS5pY29ucyA9IEljb25zU2VydmljZS5nZXRMaXN0KCk7XG5cbiAgICAgICAgdm0ubWV0YSA9IHtcbiAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgdGFibGU6W11cbiAgICAgICAgfTtcbiAgICAgICAgdm0ucXVlcnkgPSB7XG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBvcmRlcjogJy1lcnJvcnMnLFxuICAgICAgICAgIGxpbWl0OiAxNSxcbiAgICAgICAgICBwYWdlOiAxXG4gICAgICAgIH07XG5cbiAgICAgICAgLyp2bS50cmVlT3B0aW9ucyA9IHtcbiAgICAgICAgICBiZWZvcmVEcm9wOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGlmKGV2ZW50LmRlc3Qubm9kZXNTY29wZSAhPSBldmVudC5zb3VyY2Uubm9kZXNTY29wZSl7XG4gICAgICAgICAgICAgIHZhciBpZHggPSBldmVudC5kZXN0Lm5vZGVzU2NvcGUuJG1vZGVsVmFsdWUuaW5kZXhPZihldmVudC5zb3VyY2Uubm9kZVNjb3BlLiRtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgICAgaWYoaWR4ID4gLTEpe1xuICAgICAgICAgICAgICAgICBldmVudC5zb3VyY2Uubm9kZVNjb3BlLiQkYXBwbHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdPbmx5IG9uZSBlbGVtZW50IG9mIGEga2luZCBwZXIgZ3JvdXAgcG9zc2libGUhJywgJ05vdCBhbGxvd2VkIScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRyb3BwZWQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uodm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07Ki9cblxuICAgICAgICAvL1J1biBTdGFydHVwLUZ1bmNpdG9uc1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgLy9jbGVhck1hcCgpO1xuICAgICAgICAgIEluZGV4U2VydmljZS5yZXNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DbG9zZShhY3RpdmUpe1xuICAgICAgICAgIHJldHVybiBhY3RpdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTGF5ZXJTdHlsZShmZWF0dXJlKXtcbiAgICAgIFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgY29sb3I6J3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgICAgICAgICAgICBvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgIH07XG4gICAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJNYXAoKXtcbiAgICAgICAgICBcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjbGVhckxheWVyU3R5bGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICB2bS5zaG93UmVzb3VyY2VzID0gIXZtLnNob3dSZXNvdXJjZXM7XG4gICAgICAgICAgaWYodm0uc2hvd1Jlc291cmNlcyl7XG4gICAgICAgICAgICB2bS5saXN0UmVzb3VyY2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICBpZighdm0ucmVzb3VyY2VzKXtcbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YS90YWJsZXMnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgdm0ucmVzb3VyY2VzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID0gW10sIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGxpc3Qpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAvL2lmKHR5cGVvZiBpdGVtLmlzR3JvdXAgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PSByZXNvdXJjZSl7XG4gICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShrZXksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2Uodm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZSh2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKGl0ZW0pLDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgaXRlbS5ub2Rlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vY2FsY1BlcmNlbnRhZ2Uodm0uc29ydGVkUmVzb3VyY2VzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjYWxjUGVyY2VudGFnZShub2Rlcyl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuICAgICAgICAgICAgbm9kZXNba2V5XS53ZWlnaHQgPSBwYXJzZUludCgxMDAgLyBub2Rlcy5sZW5ndGgpO1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uobm9kZXMubm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5jcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4aXN0c0luR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSA+IC0xO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFkZEdyb3VwKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0dyb3VwJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCB2bS5zZWxlY3RlZEZvckdyb3VwKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbG9uZVNlbGVjdGlvbigpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidDbG9uZWQgRWxlbWVudHMnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRFbnRyeShpdGVtKXtcbiAgICAgICAgICB2bS5lZGl0SXRlbSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRW50cnkoaXRlbSwgbGlzdCl7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgbGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2F2ZUluZGV4KCl7XG4gICAgICAgICAgaWYodm0uc2F2ZURpc2FibGVkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZih0eXBlb2Ygdm0ubmV3SW5kZXggPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCF2bS5uZXdJbmRleC50aXRsZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0ubmV3SW5kZXguZGF0YSA9IHZtLmdyb3VwcztcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLm5ld0luZGV4KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdXIgSW5kZXggaGFzIGJlZW4gY3JlYXRlZCcsICdTdWNjZXNzJyksXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OnJlc3BvbnNlLm5hbWV9KTtcbiAgICAgICAgICB9LGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsJ1VwcHMhIScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgaWYoIXZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgc3dpdGNoICh0b1N0YXRlLm5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYyc6XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTXlEYXRhKCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5jaGVjayc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMjtcbiAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAzO1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5maW5hbCc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gNDtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTsqL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yY2F0ZWdvcnlDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgY2F0ZWdvcnksIGNhdGVnb3JpZXMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRnbG9iYWxTYXZlOnRydWUsXG5cdFx0XHRwb3N0RG9uZTpmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6ZGF0YS5pZH0pXG5cdFx0XHR9LFxuXHRcdH1cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0LCRzdGF0ZSwgaW5kaWNhdG9ycywgaW5kaWNlcywgc3R5bGVzLCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uY29tcG9zaXRzID0gaW5kaWNlcztcblx0XHR2bS5zdHlsZXMgPSBzdHlsZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uY2hlY2tUYWJDb250ZW50ID0gY2hlY2tUYWJDb250ZW50O1xuXG5cdFx0dm0uYWN0aXZlID0gMDtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uc2VsZWN0aW9uID0ge1xuXHRcdFx0aW5kaWNlczpbXSxcblx0XHRcdGluZGljYXRvcnM6W10sXG5cdFx0XHRzdHlsZXM6W10sXG5cdFx0XHRjYXRlZ29yaWVzOltdXG5cdFx0fTtcblxuXG5cdFx0dm0ub3B0aW9ucyA9IHtcblx0XHRcdGNvbXBvc2l0czp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J2NvbXBvc2l0cycsXG5cdFx0XHRcdGFsbG93TW92ZTpmYWxzZSxcblx0XHRcdFx0YWxsb3dEcm9wOmZhbHNlLFxuXHRcdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0XHRhbGxvd0RlbGV0ZTp0cnVlLFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOmlkLCBuYW1lOm5hbWV9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZGRDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7aWQ6MCwgbmFtZTogJ25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uaW5kaWNlcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlSXRlbShpdGVtLmlkKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLmluZGljZXMgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNhdGVnb3JpZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjYXRlZ29yaWVzJyxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcy5jYXRlZ29yeScsIHtpZDonbmV3J30pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1DbGljazogZnVuY3Rpb24oaWQsIG5hbWUpe1xuXG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6aWR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlQ2F0ZWdvcnkoaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5jYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHN0eWxlczp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J3N0eWxlcycsXG5cdFx0XHRcdHdpdGhDb2xvcjp0cnVlXG5cdFx0XHR9XG5cdFx0fTtcblxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tUYWJDb250ZW50KGluZGV4KXtcblx0XHRcdHN3aXRjaCAoaW5kZXgpIHtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0aWYodHlwZW9mICRzdGF0ZS5wYXJhbXMuaWQgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse1xuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6JHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG5cdFx0ICBpZih0eXBlb2YgdG9QYXJhbXMuaWQgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5hY3RpdmUgPSB0b1BhcmFtcy5pZDtcblx0XHRcdH1cblx0XHRcdGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMTtcblx0XHRcdFx0Ly9hY3RpdmF0ZSh0b1BhcmFtcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpICE9IC0xKXtcblx0XHRcdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsJHRpbWVvdXQsIFZlY3RvcmxheWVyU2VydmljZSwgbGVhZmxldERhdGEsIENvbnRlbnRTZXJ2aWNlLCBpbmRpY2F0b3IpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLnNjYWxlID0gXCJcIjtcblx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHR2bS5tYXggPSAwO1xuXHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRzZXRBY3RpdmUoKTtcblxuXHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pO1xuXHRcdGZ1bmN0aW9uIHNldEFjdGl2ZSgpe1xuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5pZGNhdG9yc0N0cmwnLCBmdW5jdGlvbiAoaW5kaWNhdG9ycywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cblxuICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kZXgpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgLy92bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG4gICAgdm0uaW5kZXggPSBpbmRleDtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdHNldEFjdGl2ZSgpO1xuICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICBpbmRpemVzOntcbiAgICAgICAgYWRkQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YS5hZGQnKTtcbiAgICAgICAgfSxcblx0XHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaXRlbSA9IHtcblx0XHRcdFx0XHRcdHRpdGxlOiAnSSBhbSBhIGdyb3VwLi4uIG5hbWUgbWUnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2bS5pbmRleC5jaGlsZHJlbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHZtKTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0cmVtb3ZlSXRlbShpdGVtLHZtLmluZGV4LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVEcm9wOiBmdW5jdGlvbihldmVudCxpdGVtLGV4dGVybmFsLHR5cGUpe1xuXHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuICAgICAgfSxcbiAgICAgIHdpdGhTYXZlOiB0cnVlXG4gICAgfVxuXG5cdFx0YWN0aXZlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW0oaXRlbSwgbGlzdCl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSByZW1vdmVJdGVtKGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQvKkNvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pOyovXG5cblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHQvKlx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yU2hvd0N0cmwnLCBmdW5jdGlvbigkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCBpbmRpY2F0b3IsIGNvdW50cmllcywgQ29udGVudFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmN1cnJlbnQgPSBudWxsO1xuXHRcdHZtLmFjdGl2ZSA9IG51bGwsIHZtLmFjdGl2ZUdlbmRlciA9IG51bGw7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cdFx0dm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLmRhdGEgPSBbXTtcblx0XHR2bS55ZWFyID0gbnVsbCwgdm0uZ2VuZGVyID0gJ2FsbCc7XG5cdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRtYXg6IC0xMDAwMDAwMDAsXG5cdFx0XHRtaW46IDEwMDAwMDAwMFxuXHRcdH07XG5cdFx0dm0uZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdvSW5mb1N0YXRlID0gZ29JbmZvU3RhdGU7XG5cdFx0dm0uaGlzdG9yeURhdGEgPSBudWxsO1xuXG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uc2V0WWVhciA9IHNldFllYXI7XG5cdFx0dm0uc2V0R2VuZGVyID0gc2V0R2VuZGVyO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0cmVzZXRSYW5nZSgpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL1x0dm0ueWVhciA9ICRzdGF0ZS5wYXJhbXMueWVhcjtcblx0XHRcdFx0Ly9cdHZtLmdlbmRlciA9ICRzdGF0ZS5wYXJhbXMuZ2VuZGVyO1xuXHRcdFx0XHQvL2dldERhdGEoJHN0YXRlLnBhcmFtcy55ZWFyLCAkc3RhdGUucGFyYW1zLmdlbmRlcik7XG5cdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLnllYXIpIHtcblx0XHRcdFx0XHR2bS55ZWFyID0gJHN0YXRlLnBhcmFtcy55ZWFyO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm0uaW5kaWNhdG9yLnllYXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodm0uaW5kaWNhdG9yLnllYXJzW2ldLnllYXIgPT0gJHN0YXRlLnBhcmFtcy55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmFjdGl2ZSA9IGk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCF2bS5hY3RpdmUpIHtcblx0XHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZtLmluZGljYXRvci5nZW5kZXIpIHtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5nZW5kZXIgIT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0dm0uZ2VuZGVyID0gJHN0YXRlLnBhcmFtcy5nZW5kZXI7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZtLmluZGljYXRvci5nZW5kZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHZtLmluZGljYXRvci5nZW5kZXJbaV0uZ2VuZGVyID09ICRzdGF0ZS5wYXJhbXMuZ2VuZGVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0dm0uYWN0aXZlR2VuZGVyID0gaTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIXZtLmFjdGl2ZUdlbmRlcikge1xuXHRcdFx0XHRcdFx0dm0uYWN0aXZlR2VuZGVyID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoIXZtLmFjdGl2ZUdlbmRlcikge1xuXHRcdFx0XHRcdHZtLmFjdGl2ZUdlbmRlciA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0RGF0YSh2bS55ZWFyLCB2bS5nZW5kZXIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzZXRSYW5nZSgpIHtcblx0XHRcdHZtLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IC0xMDAwMDAwMDAsXG5cdFx0XHRcdG1pbjogMTAwMDAwMDAwXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvSW5mb1N0YXRlKCkge1xuXG5cdFx0XHRpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvcicpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLmluZm8nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKCkge1xuXHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0XHRpc286IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0fSk7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGdldEhpc3RvcnkoKTtcblx0XHRcdH0pO1xuXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblx0XHRcdHZhciBjID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl0pO1xuXHRcdFx0aWYgKHR5cGVvZiBjLnNjb3JlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IGM7XG5cdFx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0SGlzdG9yeSgpIHtcblx0XHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckhpc3Rvcnkodm0uaW5kaWNhdG9yLmlkLCB2bS5jdXJyZW50Lmlzbywgdm0uZ2VuZGVyKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dm0uaGlzdG9yeURhdGEgPSBkYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRZZWFyKHllYXIpIHtcblx0XHRcdHZtLnllYXIgPSB5ZWFyO1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0XHR5ZWFyOiB5ZWFyLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDI1MCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRHZW5kZXIoZ2VuZGVyKSB7XG5cdFx0XHR2bS5nZW5kZXIgPSBnZW5kZXIgfHwgJ2FsbCc7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0XHRcdGdlbmRlcjogdm0uZ2VuZGVyXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgMjUwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREYXRhKHllYXIsIGdlbmRlcikge1xuXHRcdFx0Q29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSh2bS5pbmRpY2F0b3IuaWQsIHZtLnllYXIsIHZtLmdlbmRlcikudGhlbihmdW5jdGlvbihkYXQpIHtcblx0XHRcdFx0cmVzZXRSYW5nZSgpO1xuXHRcdFx0XHR2bS5kYXRhID0gZGF0O1xuXHRcdFx0XHR2YXIgaXNvID0gbnVsbDtcblx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXNvKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodm0uZGF0YVtpXS5pc28gPT0gJHN0YXRlLnBhcmFtcy5pc28pIHtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IHZtLmRhdGFbaV07XG5cdFx0XHRcdFx0XHRcdGlzbyA9IHZtLmN1cnJlbnQuaXNvO1xuXHRcdFx0XHRcdFx0XHQvL3NldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdGl0ZW0ucmFuayA9IHZtLmRhdGEuaW5kZXhPZihpdGVtKSArIDE7XG5cdFx0XHRcdFx0aWYgKHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLmlzbyA9PSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdFx0XHRzZXRDdXJyZW50KGl0ZW0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSBkMy5tYXgoW3ZtLnJhbmdlLm1heCwgcGFyc2VGbG9hdChpdGVtLnNjb3JlKV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IGQzLm1pbihbdm0ucmFuZ2UubWluLCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0Y29sb3I6IHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdFx0ZmllbGQ6ICdyYW5rJyxcblx0XHRcdFx0XHRzaXplOiB2bS5kYXRhLmxlbmd0aFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGdldE9mZnNldCgpO1xuXHRcdFx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLCB2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmRhdGEsIHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciwgdHJ1ZSk7XG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGNvdW50cmllc1N0eWxlLCBjb3VudHJ5Q2xpY2spO1xuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0aWYgKHZtLmN1cnJlbnQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblxuXHRcdHZtLnVpT25QYXJhbXNDaGFuZ2VkID0gZnVuY3Rpb24oY2hhbmdlZFBhcmFtcywgJHRyYW5zaXRpb24kKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGNoYW5nZWRQYXJhbXMpO1xuXHRcdFx0Z2V0RGF0YSh2bS55ZWFyLCB2bS5nZW5kZXIpO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsIGZ1bmN0aW9uICgkZmlsdGVyLCBkYXRhKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmRhdGEgPSBkYXRhO1xuICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblxuICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcblx0XHRcdHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG5cdFx0XHQvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuXHRcdH07XG5cblxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5wcmV2U3RhdGUgPSBudWxsO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICBcbiAgICAgICAgdm0udXNlciA9IHtcbiAgICAgICAgICBlbWFpbDonJyxcbiAgICAgICAgICBwYXNzd29yZDonJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICB2bS5jaGVja0xvZ2dlZEluKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0xvZ2dlZEluKCl7XG5cbiAgICAgICAgICBpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6J2VwaSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9Mb2dpbigpe1xuICAgICAgICAgICRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUucHJldmlvdXNQYWdlKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dvQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBsZWFmbGV0RGF0YSwgbGVhZmxldE1hcEV2ZW50cywgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB6b29tID0gMyxcblx0XHRcdG1pblpvb20gPSAyO1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCkge1xuXHRcdFx0em9vbSA9IDI7XG5cdFx0fVxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGFwaUtleSA9IFZlY3RvcmxheWVyU2VydmljZS5rZXlzLm1hcGJveDtcblx0XHR2bS5WZWN0b3JsYXllclNlcnZpY2UgPSBWZWN0b3JsYXllclNlcnZpY2U7XG5cdFx0dm0udG9nZ2xlTGF5ZXJzID0gdG9nZ2xlTGF5ZXJzO1xuXHRcdHZtLmRlZmF1bHRzID0ge1xuXHRcdFx0Ly9zY3JvbGxXaGVlbFpvb206IGZhbHNlLFxuXHRcdFx0bWluWm9vbTogbWluWm9vbSxcblx0XHRcdG1heFpvb206IDZcblx0XHR9O1xuXG5cdFx0Ly8gdm0ubGF5ZXJzID0ge1xuXHRcdC8vIFx0YmFzZWxheWVyczoge1xuXHRcdC8vIFx0XHR4eXo6IHtcblx0XHQvLyBcdFx0XHRuYW1lOiAnT3V0ZG9vcicsXG5cdFx0Ly8gXHRcdFx0dXJsOiBWZWN0b3JsYXllclNlcnZpY2UuYmFzZWxheWVyLnVybCxcblx0XHQvLyBcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHQvLyBcdFx0XHRsYXllck9wdGlvbnM6IHtcblx0XHQvLyBcdFx0XHRcdG5vV3JhcDogdHJ1ZSxcblx0XHQvLyBcdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXG5cdFx0Ly8gXHRcdFx0XHRkZXRlY3RSZXRpbmE6IHRydWVcblx0XHQvLyBcdFx0XHR9XG5cdFx0Ly8gXHRcdH1cblx0XHQvLyBcdH1cblx0XHQvLyB9O1xuXHRcdHZtLmxhYmVsc0xheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFnbm9sby4wNjAyOWE5Yy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksIHtcblx0XHRcdG5vV3JhcDogdHJ1ZSxcblx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXG5cdFx0XHRuYW1lOiAnbGFiZWxzJyxcblx0XHRcdGRldGVjdFJldGluYTogdHJ1ZVxuXHRcdH0pO1xuXHRcdHZtLm1heGJvdW5kcyA9IHtcblx0XHRcdHNvdXRoV2VzdDoge1xuXHRcdFx0XHRsYXQ6IDkwLFxuXHRcdFx0XHRsbmc6IDE4MFxuXHRcdFx0fSxcblx0XHRcdG5vcnRoRWFzdDoge1xuXHRcdFx0XHRsYXQ6IC05MCxcblx0XHRcdFx0bG5nOiAtMTgwXG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5jb250cm9scyA9IHtcblx0XHRcdGN1c3RvbTogW11cblx0XHR9O1xuXHRcdHZtLmxheWVyY29udHJvbCA9IHtcblx0XHRcdGljb25zOiB7XG5cdFx0XHRcdHVuY2hlY2s6IFwiZmEgZmEtdG9nZ2xlLW9mZlwiLFxuXHRcdFx0XHRjaGVjazogXCJmYSBmYS10b2dnbGUtb25cIlxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBNeUNvbnRyb2wgPSBMLmNvbnRyb2woKTtcblx0XHRNeUNvbnRyb2wuc2V0UG9zaXRpb24oJ3RvcGxlZnQnKTtcblx0XHRNeUNvbnRyb2wuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0TC5VdGlsLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdE15Q29udHJvbC5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhciBsZWFmbGV0LWNvbnRyb2wtem9vbScpO1xuXHRcdFx0dmFyIHNwYW4gPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJ2xlYWZsZXQtY29udHJvbC16b29tLWluIGN1cnNvcicsIGNvbnRhaW5lcik7XG5cdFx0XHRzcGFuLnRleHRDb250ZW50ID0gJ1QnO1xuXHRcdFx0c3Bhbi50aXRsZSA9IFwiVG9nZ2xlIExhYmVsc1wiO1xuXHRcdFx0TC5Eb21FdmVudC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbihjb250YWluZXIpO1xuXHRcdFx0TC5Eb21FdmVudC5hZGRMaXN0ZW5lcihjb250YWluZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0aWYgKHZtLm5vTGFiZWwpIHtcblx0XHRcdFx0XHRcdG1hcC5yZW1vdmVMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0XHR2bS5ub0xhYmVsID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0XHRcdHZtLm5vTGFiZWwgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb250YWluZXI7XG5cdFx0fVxuXHRcdHZhciBCYWNrSG9tZSA9IEwuY29udHJvbCgpO1xuXHRcdEJhY2tIb21lLnNldFBvc2l0aW9uKCd0b3BsZWZ0Jyk7XG5cdFx0QmFja0hvbWUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0TC5VdGlsLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdEJhY2tIb21lLm9uQWRkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtYmFyIGxlYWZsZXQtY29udHJvbC16b29tIGxlYWZsZXQtY29udHJvbC1ob21lJyk7XG5cdFx0XHR2YXIgc3BhbiA9IEwuRG9tVXRpbC5jcmVhdGUoJ2EnLCAnbGVhZmxldC1jb250cm9sLXpvb20taW4gY3Vyc29yJywgY29udGFpbmVyKTtcblx0XHRcdHZhciBpY29uID0gTC5Eb21VdGlsLmNyZWF0ZSgnbWQtaWNvbicsICdtYXRlcmlhbC1pY29ucyBtZC1wcmltYXJ5Jywgc3Bhbik7XG5cdFx0XHRzcGFuLnRpdGxlID0gXCJDZW50ZXIgTWFwXCI7XG5cdFx0XHRpY29uLnRleHRDb250ZW50ID0gXCJob21lXCI7XG5cdFx0XHRMLkRvbUV2ZW50LmRpc2FibGVDbGlja1Byb3BhZ2F0aW9uKGNvbnRhaW5lcik7XG5cdFx0XHRMLkRvbUV2ZW50LmFkZExpc3RlbmVyKGNvbnRhaW5lciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0XHRtYXAuc2V0VmlldyhbNDguMjA5MjA2LCAxNi4zNzI3NzhdLCB6b29tKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb250YWluZXI7XG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiB0b2dnbGVMYXllcnMob3ZlcmxheU5hbWUpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0Y29uc29sZS5sb2cobWFwKTtcblx0XHRcdFx0aWYgKHZtLm5vTGFiZWwpIHtcblx0XHRcdFx0XHRtYXAucmVtb3ZlTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdHZtLm5vTGFiZWwgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdHZtLmxhYmVsc0xheWVyLmJyaW5nVG9Gcm9udCgpO1xuXHRcdFx0XHRcdHZtLm5vTGFiZWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0TWFwKG1hcCk7XG5cdFx0XHQvL3ZhciB1cmwgPSAnaHR0cDovL3YyMjAxNTA1MjgzNTgyNTM1OC55b3VydnNlcnZlci5uZXQ6MzAwMS9zZXJ2aWNlcy9wb3N0Z2lzLycgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPScgKyBWZWN0b3JsYXllclNlcnZpY2UuZmllbGRzKCk7IC8vXG5cdFx0XHR2YXIgdXJsID0gJ2h0dHBzOi8vd3d3LjIzZGVncmVlLm9yZzozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRkZXRlY3RSZXRpbmE6dHJ1ZSxcblx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbSddLFxuXHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdG1hcC5hZGRDb250cm9sKE15Q29udHJvbCk7XG5cdFx0XHRtYXAuYWRkQ29udHJvbChCYWNrSG9tZSk7XG5cdFx0XHQvKm1hcC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRhbGVydCgnaGVsbG8nKTtcblx0XHRcdH0pO1xuXG4gICAgICAgICAgICB2YXIgbWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gbWFwRXZlbnRzKXtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuJyArIG1hcEV2ZW50c1trXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtYXBFdmVudHNba10pXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cdFx0LypcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7Ki9cblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWRlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSwgRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIgPSB7fTtcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVGV4dDtcblxuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvZGF0YXByb3ZpZGVycycsIHZtLmRhdGFwcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZGF0YXByb3ZpZGVycy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLmRhdGFwcm92aWRlciA9IGRhdGE7XG4gICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVW5pdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0udW5pdCA9IHt9O1xuICAgICAgdm0udW5pdC50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFVuaXQ7XG5cbiAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vXG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL21lYXN1cmVfdHlwZXMnLCB2bS51bml0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWVhc3VyZVR5cGVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLnR5cGUgPSBkYXRhO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgIH07XG5cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkWWVhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52bSk7XG4gICAgICAgICAgICAkc2NvcGUudm0uc2F2ZURhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bWV0aG9kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdHRleHRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgXG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3B5cHJvdmlkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uYXNrZWRUb1JlcGxpY2F0ZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMgPSB0cnVlO1xuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLiRwYXJlbnQudm0uZGF0YVswXS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG5cdFx0XHRcdGlmIChrZXkgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSwge1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZToga2V5LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToga2V5XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFwcm92aWRlciA9ICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcykge1xuXHRcdFx0XHRcdFx0aXRlbS50eXBlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlVHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcykge1xuXHRcdFx0XHRcdFx0aXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlQ2F0ZWdvcmllcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmlzX3B1YmxpYyA9ICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlO1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlX2lkID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblxuXHRcdH07XG5cblx0XHQkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSBmYWxzZTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQmFyc0N0cmwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLndpZHRoID0gd2lkdGg7XG5cblx0XHRmdW5jdGlvbiB3aWR0aChpdGVtKSB7XG5cdFx0XHRpZighdm0uZGF0YSkgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIHZtLmRhdGFbaXRlbS5uYW1lXTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2JhcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9iYXJzL2JhcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCYXNlbWFwQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cblx0XHR2bS5iYXNlT3B0aW9ucyA9IHtcblx0XHRcdGRyYWc6IGZhbHNlLFxuXHRcdFx0YWxsb3dEcm9wOiBmYWxzZSxcblx0XHRcdGFsbG93RHJhZzogZmFsc2UsXG5cdFx0XHRhbGxvd01vdmU6IGZhbHNlLFxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlLFxuXHRcdFx0YWxsb3dBZGRDb250YWluZXI6IGZhbHNlLFxuXHRcdFx0YWxsb3dBZGQ6IGZhbHNlLFxuXHRcdFx0YWxsb3dTYXZlOiB0cnVlLFxuXHRcdFx0ZWRpdGFibGU6IGZhbHNlLFxuXHRcdFx0YXNzaWdtZW50czogZmFsc2UsXG5cdFx0XHRzYXZlQ2xpY2s6IHZtLm9wdGlvbnMuc2F2ZSxcblx0XHRcdGRlbGV0ZUNsaWNrOiB2bS5vcHRpb25zLmRlbGV0ZUNsaWNrLFxuXG5cdFx0fTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdiYXNlbWFwJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvYmFzZW1hcC9iYXNlbWFwLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0Jhc2VtYXBDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0Jhc2VtYXBTZWxlY3RvckN0cmwnLCBmdW5jdGlvbihCYXNlbWFwc1NlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG5cdFx0Ly9cblx0XHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0XHR2bS5iYXNlbWFwcyA9IFtdO1xuXHRcdFx0dm0uc2VsZWN0ZWQgPSB7fTtcblx0XHRcdHZtLnNldE1hcCA9IHNldE1hcDtcblx0XHRcdHZtLnZpZXdUaWxlcyA9IHZpZXdUaWxlcztcblx0XHRcdHZtLmRlZmF1bHRzID0ge1xuXHRcdFx0XHRzY3JvbGxXaGVlbFpvb206IGZhbHNlLFxuXHRcdFx0XHRtaW5ab29tOiAxLFxuXHRcdFx0XHRtYXhab29tOiA4LFxuXHRcdFx0XHR6b29tQ29udHJvbDogZmFsc2UsXG5cdFx0XHR9O1xuXHRcdFx0dm0uY2VudGVyID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmNlbnRlcjtcblx0XHRcdHZtLm1heGJvdW5kcyA9IFZlY3RvcmxheWVyU2VydmljZS5tYXhib3VuZHM7XG5cblx0XHRcdGFjdGl2YXRlKCk7XG5cblx0XHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRcdGlmKCF2bS5zdHlsZSl7XG5cdFx0XHRcdFx0dm0uc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRiYXNlbWFwX2lkOjBcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0QmFzZW1hcHNTZXJ2aWNlLmdldEJhc2VtYXBzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR2bS5iYXNlbWFwcyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRcdGlmKHZtLnN0eWxlLmJhc2VtYXBfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uYmFzZW1hcHMsIGZ1bmN0aW9uKG1hcCwga2V5KXtcblx0XHRcdFx0XHRcdFx0aWYobWFwLmlkID09IHZtLnN0eWxlLmJhc2VtYXBfaWQpe1xuXHRcdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gbWFwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNldE1hcChtYXApe1xuXHRcdFx0XHR2bS5zZWxlY3RlZCA9IG1hcDtcblx0XHRcdFx0dm0uc3R5bGUuYmFzZW1hcF9pZCA9IG1hcC5pZDtcblx0XHRcdFx0dm0uc3R5bGUuYmFzZW1hcCA9IG1hcDtcblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIHZpZXdUaWxlcyhtYXApe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHVybDptYXAudXJsLFxuXHRcdFx0XHRcdGF0dHJpYnV0aW9uOm1hcC5hdHRyaWJ1dGlvbixcblx0XHRcdFx0XHR0eXBlOid4eXonXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2Jhc2VtYXBTZWxlY3RvcicsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2Jhc2VtYXBTZWxlY3Rvci9iYXNlbWFwU2VsZWN0b3IuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFzZW1hcFNlbGVjdG9yQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdHN0eWxlOiAnPW5nTW9kZWwnLFxuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSwgSWNvbnNTZXJ2aWNlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGxhYmVsczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0bGFiZWxzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7fTtcblxuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4ubGVuZ3RoID09IDIgJiYgc2NvcGUuaW5kZXhlci5jaGlsZHJlblswXS5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoZ3JvdXAsIGluZGV4KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtQ29sb3IgPSBncm91cC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0aWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0bUNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZ3JvdXAudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IG1Db2xvcixcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBncm91cC5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGdyb3VwLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdyb3VwLFxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOmdyb3VwLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY29sb3IgPSBpdGVtLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoaXRlbS5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3IgPSBpdGVtLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmKGdyb3VwLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGdyb3VwLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ncm91cHMoKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXG5cdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBzY29wZS5pbmRleGVyLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogc2NvcGUuaW5kZXhlci5zdHlsZS5iYXNlX2NvbG9yIHx8IHNjb3BlLmluZGV4ZXIuY29sb3IsXG5cdFx0XHRcdFx0XHRcdGljb246IHNjb3BlLmluZGV4ZXIuaWNvbixcblx0XHRcdFx0XHRcdFx0dW5pY29kZTogc2NvcGUuaW5kZXhlci51bmljb2RlLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBzY29wZS5pbmRleGVyLmRhdGEsXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuOiBzY29wZS5pbmRleGVyLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0ubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2xlYXJfbm9kZXMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdG5vZGVzID0gW107XG5cdFx0XHRcdFx0bGFiZWxzID0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVyc1tub2RlLmdyb3VwXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDIgKyAoMSAtIGtleSksXG5cdFx0XHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDExMClcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0dmFyIGFyY0JvdHRvbSA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSg5MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMF0uY29sb3IgfHwgXCIjYmU1ZjAwXCI7XG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIgLSBvcHRpb25zLmhlaWdodC8xMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjQm90dG9tKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNCb3R0b21cIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbGFiZWxzWzFdLmNvbG9yIHx8IFwiIzAwNmJiNlwiO1xuXHRcdFx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMyAtIDEpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMylcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDM2MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmMgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgbGFiZWxzWzBdLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRpZihvcHRpb25zLmxhYmVscyA9PSB0cnVlICYmIGxhYmVscy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0XHR2YXIgdGV4dExhYmVscyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgndGV4dC5sYWJlbHMnKS5kYXRhKGxhYmVscykuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYWJlbHMnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LypcdC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuICdyb3RhdGUoOTAsIDEwMCwgMTAwKSc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd4JywgXCI1MCVcIilcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMS4yZW0nKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcblxuXHRcdFx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5oZWlnaHQgLSA2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZTtcblx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ2cubm9kZScpLmRhdGEobm9kZXMpLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLyAyKSArICcsJyArIChvcHRpb25zLmhlaWdodCAvIDIpICsgJyknKS5hdHRyKCdjbGFzcycsICdub2RlJyk7XG5cblx0XHRcdFx0XHQvKm9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShub2RlcywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmlkO1xuXHRcdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDApLmF0dHIoXCJmaWxsXCIsIChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3IgfHwgb3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApO1xuXHRcdFx0XHRcdH0pKS5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5yZ2Iob3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApKS5kYXJrZXIoKTtcblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC50eXBlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgPyAnI2ZmZicgOiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRpZihkLnVuaWNvZGUpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlIHx8ICcxJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogMS43NSArICdweCdcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjaGFyZ2UgPSBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiAtTWF0aC5wb3coZC5yYWRpdXMsIDIuMCkgLyA0O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKS5saW5rcyhsaW5rcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2dyb3VwX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC44NSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLndpZHRoLzIgLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqMS4yNTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuaGVpZ2h0LzIgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMjU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRcdHZhciB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdHZhclx0YmFyT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdHRpdGxlZDp0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRjb250ZW50ID0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK2RhdGEudmFsdWUrJ1wiPjwvbWQtcHJvZ3Jlc3MtbGluZWFyPidcblx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj5cIisgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0aWYoc2NvcGUuY2hhcnRkYXRhW2luZm8ubmFtZV0gPiAwICl7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxkaXYgY2xhc3M9XCJzdWJcIj4nO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9ICc8bWQtcHJvZ3Jlc3MtbGluZWFyIG1kLW1vZGU9XCJkZXRlcm1pbmF0ZVwiIHZhbHVlPVwiJytzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiIHN0eWxlPVxcXCJjb2xvcjpcIiArIChpbmZvLmNvbG9yIHx8IGRhdGEuY29sb3IpICsgXCJcXFwiPiBcIitzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSsnIC0gJyArIChpbmZvLnRpdGxlKSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzwvZGl2Pic7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvL2NvbnRlbnQgPSAnPGJhcnMgb3B0aW9ucz1cImJhck9wdGlvbnNcIiBzdHJ1Y3R1cmU9XCJkYXRhLmRhdGEuY2hpbGRyZW5cIiBkYXRhPVwiZGF0YVwiPjwvYmFycz4nO1xuXG5cdFx0XHRcdFx0JGNvbXBpbGUob3B0aW9ucy50b29sdGlwLnNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGQzLmV2ZW50LCBlbGVtKS5jb250ZW50cygpKShzY29wZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGhpZGVfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnY2hhcnRkYXRhJywgZnVuY3Rpb24gKGRhdGEsIG9sZERhdGEpIHtcblx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnaW5kZXhlcicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIG5bMF0uY2hpbGRyZW4gIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0XHRcdGNsZWFyX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL2Rpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uIChvbGRELCBuZXdEKSB7XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT09IG5ld0QpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NhdGVnb3JpZXNDdHJsJywgZnVuY3Rpb24gKCRmaWx0ZXIsIHRvYXN0ciwgRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2F0T3B0aW9ucyA9IHtcblx0XHRcdGFib3J0OiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHBvc3REb25lOmZ1bmN0aW9uKGNhdGVnb3J5KXtcblx0XHRcdFx0dm0uY3JlYXRlQ2F0ZWdvcnkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY2F0ZWdvcmllcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NhdGVnb3JpZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDYXRlZ29yeUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsIHRvYXN0ciwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5zYXZlQ2F0ZWdvcnkgPSBzYXZlQ2F0ZWdvcnk7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cdFx0dm0ucGFyZW50Q2hhbmdlZCA9IHBhcmVudENoYW5nZWQ7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLnN0eWxlcyA9IENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXHRcdHZtLmZsYXR0ZW5lZCA9IFtdO1xuXHRcdHZtLmNvcHkgPSB7fTtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGZsYXR0ZW5XaXRoQ2hpbGRyZW4odm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRpZih2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdHZtLnBhcmVudCA9IGdldFBhcmVudCh2bS5pdGVtLCB2bS5jYXRlZ29yaWVzKTtcblx0XHRcdFx0dm0uY29weSA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZmxhdHRlbldpdGhDaGlsZHJlbihsaXN0KXtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uZmxhdHRlbmVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdGlmKGl0ZW0uY2hpbGRyZW4pe1xuXHRcdFx0XHRcdGZsYXR0ZW5XaXRoQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2hDYXRlZ29yeShxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSgkZmlsdGVyKCdvcmRlckJ5Jykodm0uZmxhdHRlbmVkLCAndGl0bGUnKSwgcXVlcnksICd0aXRsZScpO1xuXHRcdFx0Ly9yZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKCRmaWx0ZXIoJ2ZsYXR0ZW4nKSh2bS5jYXRlZ29yaWVzKSwgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHBhcmVudENoYW5nZWQoaXRlbSl7XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uaXRlbS5wYXJlbnRfaWQgPSBudWxsO1xuXHRcdFx0XHR2bS5pdGVtLnBhcmVudCA9IG51bGw7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKGl0ZW0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlIFBhcmVudCBjYW5ub3QgYmUgdGhlIHNhbWUnLCAnSW52YWxpZCBzZWxlY3Rpb24nKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dm0ucGFyZW50ID0gaXRlbTtcblx0XHRcdHZtLml0ZW0ucGFyZW50X2lkID0gaXRlbS5pZDtcblx0XHRcdHZtLml0ZW0ucGFyZW50ID0gaXRlbTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGl0ZW0sbGlzdCl7XG5cdFx0XHR2YXIgZm91bmQgPSBudWxsXG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0XHRmb3VuZCA9IGVudHJ5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuICYmICFmb3VuZCl7XG5cdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IGdldFBhcmVudChpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdGZvdW5kID0gc3VicmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1vdmVJdGVtKCl7XG5cdFx0XHRpZih2bS5jb3B5LnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0dmFyIG9sZFBhcmVudCA9IGdldFBhcmVudCh2bS5jb3B5LCB2bS5jYXRlZ29yaWVzKTtcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb2xkUGFyZW50LmNoaWxkcmVuLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRcdFx0XHRpZihvbGRQYXJlbnQuY2hpbGRyZW5baV0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHRcdG9sZFBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaSwxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm0uY2F0ZWdvcmllcy5sZW5ndGg7IGkrKyApe1xuXHRcdFx0XHRcdGlmKHZtLmNhdGVnb3JpZXNbaV0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHR2bS5jYXRlZ29yaWVzLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHR2YXIgbmV3UGFyZW50ID0gZ2V0UGFyZW50KHZtLml0ZW0sIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRuZXdQYXJlbnQuY2hpbGRyZW4ucHVzaCh2bS5pdGVtKTtcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKHZtLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzdWNjZXNzQWN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2codm0uY29weS5wYXJlbnRfaWQsIHZtLml0ZW0ucGFyZW50X2lkKTtcblx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkICE9IHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0Ly9pZih2bS5jb3B5LnBhcmVudF9pZCAmJiB2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0bW92ZUl0ZW0oKTtcblx0XHRcdC8vXHR9XG5cdFx0XHR9XG5cdFx0XHR0b2FzdHIuc3VjY2VzcygnQ2F0ZWdvcnkgaGFzIGJlZW4gdXBkYXRlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHQkc2NvcGUuY2F0ZWdvcnlGb3JtLiRzZXRTdWJtaXR0ZWQoKTtcblx0XHRcdHZtLmNvcHkgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVDYXRlZ29yeSh2YWxpZCkge1xuXHRcdFx0aWYodmFsaWQpe1xuXHRcdFx0XHRpZih2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRpZih2bS5pdGVtLnJlc3Rhbmd1bGFyaXplZCl7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKHN1Y2Nlc3NBY3Rpb24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UudXBkYXRlKCdjYXRlZ29yaWVzJywgdm0uaXRlbS5pZCwgdm0uaXRlbSkudGhlbihzdWNjZXNzQWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NhdGVnb3JpZXMnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihkYXRhLnBhcmVudF9pZCApe1xuXHRcdFx0XHRcdFx0XHRcdCB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGRhdGEsIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdFx0XHRcdCBpZighcGFyZW50LmNoaWxkcmVuKXtcblx0XHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4ucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHQgcGFyZW50LmV4cGFuZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgQ2F0ZWdvcnkgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0dm0ub3B0aW9ucy5wb3N0RG9uZShkYXRhKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3J5JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcnlDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblxuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0dmFyICDPhCA9IDIgKiBNYXRoLlBJO1xuXHRcdFx0XHQvL0NyZWF0aW5nIHRoZSBTY2FsZVxuXHRcdFx0XHR2YXIgcm90YXRlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFsxLCAkc2NvcGUub3B0aW9ucy5zaXplXSlcblx0XHRcdFx0XHQucmFuZ2UoWzEsIDBdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHQvL0NyZWF0aW5nIEVsZW1lbnRzXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKCdzdmcnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsICRzY29wZS5vcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCAkc2NvcGUub3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyICsgJywnICsgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICdOwrAnICsgZDtcblx0XHRcdFx0XHRcdHJldHVybiBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0cmV0dXJuICcxZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcxLjVlbSc7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnMC4zNWVtJztcblx0XHRcdFx0XHRcdHJldHVybiAnMC4zN2VtJ1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKXtcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShwYXJzZUludChkYXRhWzFdKSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGQpLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5hdHRyVHdlZW4oXCJkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qJHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2lyY2xlQmFjay5zdHlsZSgnc3Ryb2tlJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHR0ZXh0LnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtW24uZmllbGRdKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2l0ZW0nLFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdC8vaWYobiA9PT0gbykgcmV0dXJuO1xuXHRcdFx0XHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdFx0XHRcdG5bJHNjb3BlLm9wdGlvbnMuZmllbGRdID0gJHNjb3BlLm9wdGlvbnMuc2l6ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRlSXQoblskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8gfHwgIW4pIHJldHVybjtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdCgkc2NvcGUuaXRlbVskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LHRydWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbXBvc2l0c0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29tcG9zaXRzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb21wb3NpdHNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbmZsaWN0aXRlbXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NvbmZsaWN0aXRlbXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb25mbGljdGl0ZW1zL2NvbmZsaWN0aXRlbXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RpdGVtc0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbnRlbnRlZGl0YWJsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NvbnRlbnRlZGl0YWJsZScsIGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0cmVxdWlyZTogJz9uZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHQvL2lmICghbmdNb2RlbCkgcmV0dXJuO1xuXHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5odG1sKG5nTW9kZWwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gTGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIHRvIGVuYWJsZSBiaW5kaW5nXG5cdFx0XHRcdGVsZW1lbnQub24oJ2JsdXIga2V5dXAgY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNjb3BlLiRhcHBseShyZWFkVmlld1RleHQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIE5vIG5lZWQgdG8gaW5pdGlhbGl6ZSwgQW5ndWxhckpTIHdpbGwgaW5pdGlhbGl6ZSB0aGUgdGV4dCBiYXNlZCBvbiBuZy1tb2RlbCBhdHRyaWJ1dGVcblxuXHRcdFx0XHQvLyBXcml0ZSBkYXRhIHRvIHRoZSBtb2RlbFxuXHRcdFx0XHRmdW5jdGlvbiByZWFkVmlld1RleHQoKSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBlbGVtZW50Lmh0bWwoKTtcblx0XHRcdFx0XHQvLyBXaGVuIHdlIGNsZWFyIHRoZSBjb250ZW50IGVkaXRhYmxlIHRoZSBicm93c2VyIGxlYXZlcyBhIDxicj4gYmVoaW5kXG5cdFx0XHRcdFx0Ly8gSWYgc3RyaXAtYnIgYXR0cmlidXRlIGlzIHByb3ZpZGVkIHRoZW4gd2Ugc3RyaXAgdGhpcyBvdXRcblx0XHRcdFx0XHRpZiAoYXR0cnMuc3RyaXBCciAmJiBodG1sID09ICc8YnI+Jykge1xuXHRcdFx0XHRcdFx0aHRtbCA9ICcnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoaHRtbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2V4cG9ydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2V4cG9ydC9leHBvcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnRXhwb3J0RGlyZWN0aXZlQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXhwb3J0RGlyZWN0aXZlQ3RybCcsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cblxuXHRcdHZtLmJhc2VPcHRpb25zID0ge1xuXHRcdFx0ZHJhZzogdHJ1ZSxcblx0XHRcdGFsbG93RHJvcDogdHJ1ZSxcblx0XHRcdGFsbG93RHJhZzogdHJ1ZSxcblx0XHRcdGFsbG93TW92ZTogdHJ1ZSxcblx0XHRcdGFsbG93U2F2ZTogdHJ1ZSxcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlLFxuXHRcdFx0YWxsb3dBZGRDb250YWluZXI6IHRydWUsXG5cdFx0XHRhbGxvd0FkZDogdHJ1ZSxcblx0XHRcdGVkaXRhYmxlOiB0cnVlLFxuXHRcdFx0YXNzaWdtZW50czogZmFsc2UsXG5cdFx0XHRzYXZlQ2xpY2s6IHZtLm9wdGlvbnMuZXhwb3J0cy5zYXZlLFxuXHRcdFx0YWRkQ2xpY2s6IHZtLm9wdGlvbnMuZXhwb3J0cy5hZGRDbGljayxcblx0XHRcdGFkZENvbnRhaW5lckNsaWNrOiB2bS5vcHRpb25zLmV4cG9ydHMuYWRkQ29udGFpbmVyQ2xpY2ssXG5cdFx0XHRkZWxldGVEcm9wOiB2bS5vcHRpb25zLmV4cG9ydHMuZGVsZXRlRHJvcCxcblx0XHRcdGRlbGV0ZUNsaWNrOiB2bS5vcHRpb25zLmV4cG9ydHMuZGVsZXRlQ2xpY2ssXG5cdFx0XHRvbkRyb3A6IHZtLm9wdGlvbnMuZXhwb3J0cy5vbkRyb3AsXG5cdFx0XHRpbnNlcnRlZDogdm0ub3B0aW9ucy5leHBvcnRzLmluc2VydGVkLFxuXHRcdFx0c3R5bGVhYmxlOiB2bS5vcHRpb25zLnN0eWxlYWJsZSxcblx0XHRcdHN0eWxlQ2xpY2s6IHZtLm9wdGlvbnMuc3R5bGUuY2xpY2ssXG5cdFx0XHRoaWRlRXhwYW5zaW9uT25JdGVtOnRydWVcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0Ly9sb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCkge1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKCkge1xuXG5cdFx0fVxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmaWxlRHJvcHpvbmUnLCBmdW5jdGlvbiAodG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuICAgICAgICBmaWxlOiAnPScsXG4gICAgICAgIGZpbGVOYW1lOiAnPSdcbiAgICAgIH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdHZhciBjaGVja1NpemUsIGlzVHlwZVZhbGlkLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyLCB2YWxpZE1pbWVUeXBlcztcblx0XHRcdFx0cHJvY2Vzc0RyYWdPdmVyT3JFbnRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdjb3B5Jztcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhbGlkTWltZVR5cGVzID0gYXR0cnMuZmlsZURyb3B6b25lO1xuXHRcdFx0XHRjaGVja1NpemUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuXHRcdFx0XHRcdHZhciBfcmVmO1xuXHRcdFx0XHRcdGlmICgoKF9yZWYgPSBhdHRycy5tYXhGaWxlU2l6ZSkgPT09ICh2b2lkIDApIHx8IF9yZWYgPT09ICcnKSB8fCAoc2l6ZSAvIDEwMjQpIC8gMTAyNCA8IGF0dHJzLm1heEZpbGVTaXplKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJGaWxlIG11c3QgYmUgc21hbGxlciB0aGFuIFwiICsgYXR0cnMubWF4RmlsZVNpemUgKyBcIiBNQlwiKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlzVHlwZVZhbGlkID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdFx0XHRpZiAoKHZhbGlkTWltZVR5cGVzID09PSAodm9pZCAwKSB8fCB2YWxpZE1pbWVUeXBlcyA9PT0gJycpIHx8IHZhbGlkTWltZVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcIkZpbGUgbXVzdCBiZSBvbmUgb2YgZm9sbG93aW5nIHR5cGVzIFwiICsgdmFsaWRNaW1lVHlwZXMsICdJbnZhbGlkIGZpbGUgdHlwZSEnKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0ZWxlbWVudC5iaW5kKCdkcmFnb3ZlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdlbnRlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5iaW5kKCdkcm9wJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0dmFyIGZpbGUsIG5hbWUsIHJlYWRlciwgc2l6ZSwgdHlwZTtcblx0XHRcdFx0XHRpZiAoZXZlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0aWYgKGNoZWNrU2l6ZShzaXplKSAmJiBpc1R5cGVWYWxpZCh0eXBlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5maWxlID0gZXZ0LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcoc2NvcGUuZmlsZU5hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuZmlsZU5hbWUgPSBuYW1lO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzWzBdO1xuXHRcdFx0XHRcdC8qbmFtZSA9IGZpbGUubmFtZTtcblx0XHRcdFx0XHR0eXBlID0gZmlsZS50eXBlO1xuXHRcdFx0XHRcdHNpemUgPSBmaWxlLnNpemU7XG5cdFx0XHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7Ki9cblx0XHRcdFx0XHRzY29wZS5maWxlID0gZmlsZTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdGaWxlRHJvcHpvbmVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Ly9yZXF1aXJlOiAnaXRlbScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpdGVtTW9kZWwgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0LypzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW1Nb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHR9KTsqL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSwgRGlhbG9nU2VydmljZSwgJGZpbHRlciwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblxuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cblx0XHR2bS5jYXRlZ29yaWVzID0gW107XG5cdFx0dm0uZGF0YXByb3ZpZGVycyA9IFtdO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVGV4dCA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVW5pdCA9IG51bGw7XG5cdFx0dm0ucXVlcnlTZWFyY2ggPSBxdWVyeVNlYXJjaDtcblx0XHR2bS5xdWVyeVVuaXQgPSBxdWVyeVVuaXQ7XG5cblx0XHR2bS5zYXZlID0gc2F2ZTtcblxuXHRcdHZtLmNyZWF0ZVByb3ZpZGVyID0gY3JlYXRlUHJvdmlkZXI7XG5cdFx0dm0uY3JlYXRlVW5pdCA9IGNyZWF0ZVVuaXQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2gocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0uZGF0YXByb3ZpZGVycywgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVVuaXQocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0ubWVhc3VyZVR5cGVzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmRhdGFwcm92aWRlcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uY2F0ZWdvcmllcyA9IENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3JpZXMoe3RyZWU6dHJ1ZX0pO1xuXHRcdFx0dm0ubWVhc3VyZVR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZWFzdXJlX3R5cGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0udHlwZSAmJiB2bS5pdGVtLmRhdGFwcm92aWRlciAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IElUUyBBIEhBQ0sgVE8gR0VUIElUIFdPUks6IG5nLWNsaWNrIHZzIG5nLW1vdXNlZG93blxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyKHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFByb3ZpZGVyJywgJHNjb3BlKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlVW5pdCh0ZXh0KXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRVbml0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHQgICAgdm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHQgIH1cblx0XHR9LHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3JNZW51JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRpdGVtOiAnPWl0ZW0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JNZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgY2wgPSAnYWN0aXZlJztcblx0XHRcdFx0dmFyIGVsID0gZWxlbWVudFswXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50KCk7XG5cdFx0XHRcdHBhcmVudC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yTWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0ubG9ja2VkID0gbG9ja2VkO1xuXHRcdHZtLmNoYW5nZU9mZmljaWFsID0gY2hhbmdlT2ZmaWNpYWw7XG5cblx0XHRmdW5jdGlvbiBsb2NrZWQoKXtcblx0XHRcdHJldHVybiB2bS5pdGVtLmlzX29mZmljaWFsID8gJ2xvY2tfb3BlbicgOiAnbG9jayc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoYW5nZU9mZmljaWFsKCl7XG5cdFx0XHR2bS5pdGVtLmlzX29mZmljaWFsID0gIXZtLml0ZW0uaXNfb2ZmaWNpYWw7XG5cdFx0XHR2bS5pdGVtLnNhdmUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS5tZWFzdXJlX3R5cGVfaWQgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9PycsXG5cdFx0XHRcdGluZGljYXRvcnM6ICc9aXRlbXMnLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RBbGxHcm91cCA9IHNlbGVjdEFsbEdyb3VwO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcblxuXHRcdHZtLmZpbHRlciA9IHtcblx0XHRcdHNvcnQ6J3RpdGxlJyxcblx0XHRcdHJldmVyc2U6ZmFsc2UsXG5cdFx0XHRsaXN0OiAwLFxuXHRcdFx0cHVibGlzaGVkOiBmYWxzZSxcblx0XHRcdHR5cGVzOiB7XG5cdFx0XHRcdHRpdGxlOiB0cnVlLFxuXHRcdFx0XHRzdHlsZTogZmFsc2UsXG5cdFx0XHRcdGNhdGVnb3JpZXM6IGZhbHNlLFxuXHRcdFx0XHRpbmZvZ3JhcGhpYzogZmFsc2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBmYWxzZSxcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLnNlYXJjaCA9IHtcblx0XHRcdHF1ZXJ5OiAnJyxcblx0XHRcdHNob3c6IGZhbHNlXG5cdFx0fTtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXHRcdHZtLnRvZ2dsZUxpc3QgPSB0b2dnbGVMaXN0O1xuXG5cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUxpc3Qoa2V5KXtcblx0XHRcdGlmKHZtLnZpc2libGVMaXN0ID09IGtleSl7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS52aXNpYmxlTGlzdCA9IGtleTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09IC0xKXtcblx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pIHtcblx0XHRcdHZhciBpbmRleCA9IHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pO1xuXHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RBbGxHcm91cChncm91cCl7XG5cdFx0XHRpZih2bS5zZWxlY3Rpb24ubGVuZ3RoKXtcblx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cCwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG5cdFx0XHQkbWRPcGVuTWVudShldik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLnJlbW92ZSgnaW5kaWNhdG9ycycsIGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHR2bS5pbmRpY2F0b3JzLnNwbGljZSh2bS5pbmRpY2F0b3JzLmluZGV4T2YoaXRlbSksMSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Lyokc2NvcGUuJHdhdGNoKCd2bS5zZWFyY2gucXVlcnknLCBmdW5jdGlvbiAocXVlcnksIG9sZFF1ZXJ5KSB7XG5cdFx0XHRpZihxdWVyeSA9PT0gb2xkUXVlcnkpIHJldHVybiBmYWxzZTtcblx0XHRcdHZtLnF1ZXJ5ID0gdm0uZmlsdGVyLnR5cGVzO1xuXHRcdFx0dm0ucXVlcnkucSA9IHF1ZXJ5O1xuXHRcdFx0dm0uaXRlbXMgPSBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnModm0ucXVlcnkpO1xuXHRcdH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaXplcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpemVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpemVzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCAkdGltZW91dCwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uYmFzZU9wdGlvbnMgPSB7XG5cdFx0XHRkcmFnOnRydWUsXG5cdFx0XHRhbGxvd0Ryb3A6dHJ1ZSxcblx0XHRcdGFsbG93RHJhZzp0cnVlLFxuXHRcdFx0YWxsb3dNb3ZlOnRydWUsXG5cdFx0XHRhbGxvd1NhdmU6dHJ1ZSxcblx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRhbGxvd0FkZENvbnRhaW5lcjp0cnVlLFxuXHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdGVkaXRhYmxlOnRydWUsXG5cdFx0XHRhc3NpZ21lbnRzOiB0cnVlLFxuXHRcdFx0c2F2ZUNsaWNrOiBzYXZlLFxuXHRcdFx0YWRkQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDbGljayxcblx0XHRcdGFkZENvbnRhaW5lckNsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuYWRkQ29udGFpbmVyQ2xpY2ssXG5cdFx0XHRkZWxldGVEcm9wOiB2bS5vcHRpb25zLmluZGl6ZXMuZGVsZXRlRHJvcCxcblx0XHRcdGRlbGV0ZUNsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuZGVsZXRlQ2xpY2tcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0bG9hZEFsbCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxvYWRBbGwoKSB7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycpLiRvYmplY3Q7XG5cdFx0XHR2bS50eXBlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgvdHlwZXMnKS4kb2JqZWN0O1xuXG5cdFx0XHRpZih0eXBlb2Ygdm0uaXRlbS5pZCA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uaXRlbS5pdGVtX3R5cGVfaWQgPSAxO1xuXHRcdFx0XHR2bS5pdGVtLmNoaWxkcmVuID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS5pdGVtX3R5cGVfaWQgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKCl7XG5cdFx0XHRpZih0eXBlb2Ygdm0uaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdHJldHVybiBjaGVja0Jhc2UoKSAmJiB2bS5pdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlKCl7XG5cdFx0XHRpZih2bS5pdGVtLmlkKXtcblx0XHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0aWYocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnVwZGF0ZUl0ZW0ocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse2lkOnZtLml0ZW0uaWQsbmFtZTpyZXNwb25zZS5uYW1lfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgc2F2ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLmFkZEl0ZW0ocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse2lkOnJlc3BvbnNlLmlkLCBuYW1lOnJlc3BvbnNlLm5hbWV9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtcyhldmVudCwgaXRlbSl7XG5cdFx0Ly9cdGNvbnNvbGUubG9nKHZtLml0ZW0sIGl0ZW0pO1xuXG5cdFx0fVxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdFx0fVxuXHRcdH0sdHJ1ZSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiAnZ3JhZGllbnQnLFxuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDQwLFxuXHRcdFx0XHRpbmZvOiB0cnVlLFxuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0aGFuZGxpbmc6IHRydWUsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdGxlZnQ6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHR0b3A6IDEwLFxuXHRcdFx0XHRcdGJvdHRvbTogMTBcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29sb3JzOiBbe1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR9XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHR2YXIgbWF4ID0gMCxcblx0XHRcdFx0XHRtaW4gPSAwO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXG5cdFx0XHRcdG9wdGlvbnMudW5pcXVlID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdGlmIChvcHRpb25zLmNvbG9yKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihuYXQsIGtleSkge1xuXHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0bWluID0gZDMubWluKFttaW4sIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oW21pbiwgbWF4XSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXG5cblx0XHRcdFx0dmFyIGVmZmVjdHMgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdHZhciBncmFkaWVudCA9IGVmZmVjdHMuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCArIG9wdGlvbnMudW5pcXVlKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzaGFkb3cgPSBlZmZlY3RzLmFwcGVuZChcImZpbHRlclwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJkcm9wLXNoYWRvd1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIFwiMTUwJVwiKTtcblx0XHRcdFx0dmFyIHNoYWRvd0ludGVuc2l0eSA9IHNoYWRvdy5hcHBlbmQoXCJmZUdhdXNzaWFuQmx1clwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaW5cIiwgXCJTb3VyY2VBbHBoYVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwic3RkRGV2aWF0aW9uXCIsIDEpXG5cdFx0XHRcdFx0LmF0dHIoXCJyZXN1bHRcIiwgXCJibHVyXCIpO1xuXHRcdFx0XHR2YXIgc2hhZG93UG9zID0gc2hhZG93LmFwcGVuZChcImZlT2Zmc2V0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpblwiLCBcImJsdXJcIilcblx0XHRcdFx0XHQuYXR0cihcImR4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwicmVzdWx0XCIsIFwib2Zmc2V0Qmx1clwiKTtcblxuXHRcdFx0XHR2YXIgZmVNZXJnZSA9IHNoYWRvdy5hcHBlbmQoXCJmZU1lcmdlXCIpO1xuXHRcdFx0XHRmZU1lcmdlLmFwcGVuZChcImZlTWVyZ2VOb2RlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpblwiLCBcIm9mZnNldEJsdXJcIilcblx0XHRcdFx0ZmVNZXJnZS5hcHBlbmQoXCJmZU1lcmdlTm9kZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaW5cIiwgXCJTb3VyY2VHcmFwaGljXCIpO1xuXG5cdFx0XHRcdHZhciBiY2tncm5kID0gc3ZnLmFwcGVuZCgnZycpO1xuXHRcdFx0XHR2YXIgcmVjdCA9IGJja2dybmQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIHJvdW5kZWRfcmVjdCgwLCAwLCBvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCwgb3B0aW9ucy5oZWlnaHQgLyAyLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSlcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQgKyBvcHRpb25zLnVuaXF1ZSkgKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblxuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChtaW4pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0IC8gMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCAnbG93ZXJWYWx1ZScpO1xuXHRcdFx0XHRcdHZhciBsZWdlbmQyID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC0gKG9wdGlvbnMuaGVpZ2h0IC8gMikpICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdlbmRMYWJlbCcpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMilcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0XHRpZiAobWF4ID4gMTAwMCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSkgKyBcImtcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWF4XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodCAvIDIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgJ3VwcGVyVmFsdWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0c2xpZGVyLmNhbGwoYnJ1c2gpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLnNlbGVjdChcIi5iYWNrZ3JvdW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kxJywgMClcblx0XHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsICczLDMnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRzaGFkb3dJbnRlbnNpdHkudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMCkuYXR0cignc3RkRGV2aWF0aW9uJywgMik7XG5cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbignbW91c2VvdXQnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0c2hhZG93SW50ZW5zaXR5LnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLmF0dHIoJ3N0ZERldmlhdGlvbicsIDEpO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBoYW5kbGUgPSBoYW5kbGVDb250LmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJoYW5kbGVcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWx0ZXJcIiwgXCJ1cmwoI2Ryb3Atc2hhZG93KVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCAoKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyBvcHRpb25zLmhlaWdodCAvIDEwKSk7XG5cdFx0XHRcdGlmIChvcHRpb25zLmNvbG9yKSB7XG5cdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgJyNmZmYnIC8qb3B0aW9ucy5jb2xvciovICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUxhYmVsID0gaGFuZGxlQ29udC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodCAvIDIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cdFx0XHRcdGZ1bmN0aW9uIHJvdW5kZWRfcmVjdCh4LCB5LCB3LCBoLCByLCB0bCwgdHIsIGJsLCBicikge1xuXHRcdFx0XHRcdHZhciByZXR2YWw7XG5cdFx0XHRcdFx0cmV0dmFsID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5O1xuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICh3IC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmICh0cikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIChoIC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmIChicikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKDIgKiByIC0gdyk7XG5cdFx0XHRcdFx0aWYgKGJsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArICgyICogciAtIGgpO1xuXHRcdFx0XHRcdGlmICh0bCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwielwiO1xuXHRcdFx0XHRcdHJldHVybiByZXR2YWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBsYWJlbGluZyh2YWx1ZSkge1xuXHRcdFx0XHRcdGlmIChwYXJzZUludCh2YWx1ZSkgPiAxMDAwKSB7XG5cdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludCh2YWx1ZSkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpKSArIFwia1wiO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdO1xuXG5cdFx0XHRcdFx0aWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQobGFiZWxpbmcodmFsdWUpKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0XHQgXHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdFx0IFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vXG5cdFx0XHRcdFx0Ly8gaWYoIWZpbmFsKXtcblx0XHRcdFx0XHQvLyBcdGRvIHtcblx0XHRcdFx0XHQvLyBcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHQvLyBcdFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdGZpbmFsID0gbmF0O1xuXHRcdFx0XHRcdC8vIFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdC8vIFx0XHRcdH1cblx0XHRcdFx0XHQvLyBcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gXHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0Ly8gXHRcdHZhbHVlID0gdmFsdWUgPiAobWF4IC8gMikgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0Ly8gXHR9IHdoaWxlICghZm91bmQgJiYgY291bnQgPCBtYXgpO1xuXHRcdFx0XHRcdC8vIH1cblxuXG5cdFx0XHRcdFx0aWYoZmluYWwpe1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gbi5jb2xvcjtcblx0XHRcdFx0XHRncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQgKyBcIl9cIiArIG4uY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlY3Quc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICdfJyArIG4uY29sb3IgKyAnKScpO1xuXHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdGlmIChuZ01vZGVsLiRtb2RlbFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KGxhYmVsaW5nKG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQoMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQoMCkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCgwKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KGxhYmVsaW5nKG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PSBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHRtaW4gPSAwO1xuXHRcdFx0XHRcdG1heCA9IDA7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRcdG1pbiA9IGQzLm1pbihbbWluLCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlLmlzbykge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KGxhYmVsaW5nKG5hdFtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdFx0LnJhbmdlKFtvcHRpb25zLm1hcmdpbi5sZWZ0LCBvcHRpb25zLndpZHRoIC0gb3B0aW9ucy5tYXJnaW4ubGVmdF0pXG5cdFx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cdFx0XHRcdFx0YnJ1c2gueCh4KVxuXHRcdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0XHQub24oXCJicnVzaFwiLCBicnVzaClcblx0XHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXHRcdFx0XHRcdGxlZ2VuZC5zZWxlY3QoJyNsb3dlclZhbHVlJykudGV4dChtaW4pO1xuXHRcdFx0XHRcdGxlZ2VuZDIuc2VsZWN0KCcjdXBwZXJWYWx1ZScpLnRleHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvL1RET0RPOiBDSGNraWNrIGlmIG5vIGNvbW1hIHRoZXJlXG5cdFx0XHRcdFx0XHRpZiAobWF4ID4gMTAwMCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludChtYXgpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpKSArIFwia1wiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIG1heFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24obmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IG5nTW9kZWwuJG1vZGVsVmFsdWUuaXNvKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQobGFiZWxpbmcobmF0W29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuYXRbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdNZWRpYW5DdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L3BhcnNlQ29uZmxpY3RDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdENzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0bmF0aW9uczogJz0nLFxuXHRcdFx0XHRzdW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0c2NvcGUubmF0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbnVtYmVycyA9IHJvdy5kYXRhWzBdLmNvbmZsaWN0cy5tYXRjaCgvWzAtOV0rL2cpLm1hcChmdW5jdGlvbihuKVxuXHRcdFx0XHRcdFx0XHRcdHsvL2p1c3QgY29lcmNlIHRvIG51bWJlcnNcblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuICsobik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0uZXZlbnRzID0gbnVtYmVycztcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5zdW0gKz0gbnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUubmF0aW9ucy5wdXNoKHJvdy5kYXRhWzBdKTtcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RFdmVudHNDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L3BhcnNlQ29uZmxpY3RFdmVudHNDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZXZlbnRzOiAnPScsXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cdHNjb3BlLmV2ZW50cyA9IFtdO1xuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHJvdy5kYXRhWzBdLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2ludGVyc3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnRyYXN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnc3Vic3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMztcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5lcnJvcnMubGVuZ3RoID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcGUuZXZlbnRzLnB1c2gocm93LmRhdGFbMF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocm93KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3BhcnNlY3N2JywgZnVuY3Rpb24gKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgSW5kZXhTZXJ2aWNlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2Vjc3ZDdHJsJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFBhcGEpO1xuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHdvcmtlcjogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCIgPiBjaHVuayA9IHJvdyBhbmQgY2h1bmsuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdGNodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY2h1bmsuZGF0YSwgZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6e30sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yczpbXVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgLyp8fCBpdGVtIDwgMCovIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzVmVydGljYWwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL3Jhd0xpc3Rba2V5XS5lcnJvcnMgPSByb3cuZXJyb3JzO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9JRiBcInN0ZXBcIiBpbnN0ZWFkIG9mIFwiY2h1bmtcIjogciA+IHJvdy5kYXRhID0gcm93LmRhdGFbMF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ci5kYXRhID0gcm93O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vQ2hlY2sgaWYgdGhlcmUgYXJlIHBvaW50cyBpbiB0aGUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKC9cXHJcXG58XFxyfFxcbi8pLmluZGV4O1xuXHRcdFx0XHRcdFx0XHRcdHZhciBkZWxpbWl0ZXIgPSAnLCc7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCgnLCcpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCA8IDIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdChcIlxcdFwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdGRlbGltaXRlciA9ICdcXHQnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YXIgaXNJc28gPSBbXTtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0pIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnJlcGxhY2UoL1teYS16MC05XS9naSwgJ18nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0uaW5kZXhPZignLicpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnN1YnN0cigwLCBoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWQgPSBoZWFkaW5nc1tpXS5zcGxpdCgnXycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSAnJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGhlYWQubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihoZWFkW2pdKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaiA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSArPSAnXyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gaGVhZFtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0ubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0lzby5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPT0gaXNJc28ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtoZWFkaW5nc1tpXV0gPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBoZWFkaW5ncy5qb2luKGRlbGltaXRlcikgKyBjaHVuay5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKGVyciwgZmlsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKHJlc3VsdHMpIHtcblxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRFcnJvcnMoZXJyb3JzKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goSW5kZXhTZXJ2aWNlLmdldEZpcnN0RW50cnkoKS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0Q291bnRyeUZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3llYXInKSAhPSAtMSAmJiBpdGVtLnRvU3RyaW5nKCkubGVuZ3RoID09IDQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0WWVhckZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2dlbmRlcicpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3NleCcpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEdlbmRlckZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmF3TGlzdCwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS50b0xvd2VyQ2FzZSgpICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGtleSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc286IGtleS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoY29sdW1uLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyWydjb2x1bW5fJyArIGldID0gY29sdW1uO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGNvbHVtbikgfHwgY29sdW1uIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIk5BXCIgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbcl0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6IGl0ZW0uZXJyb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKCdpc28nKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5pbmZvKEluZGV4U2VydmljZS5nZXREYXRhU2l6ZSgpICsgJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZWNzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwaWVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BpZWNoYXJ0Q3RybCcsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6ICc9Y2hhcnREYXRhJyxcblx0XHRcdFx0YWN0aXZlVHlwZTogJz0nLFxuXHRcdFx0XHRhY3RpdmVDb25mbGljdDogJz0nLFxuXHRcdFx0XHRjbGlja0l0OicmJ1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0IGZ1bmN0aW9uIHNlZ0NvbG9yKGMpeyByZXR1cm4ge2ludGVyc3RhdGU6XCIjODA3ZGJhXCIsIGludHJhc3RhdGU6XCIjZTA4MjE0XCIsc3Vic3RhdGU6XCIjNDFhYjVkXCJ9W2NdOyB9XG5cblx0XHRcdFx0dmFyIHBDID17fSwgcGllRGltID17dzoxNTAsIGg6IDE1MH07XG4gICAgICAgIHBpZURpbS5yID0gTWF0aC5taW4ocGllRGltLncsIHBpZURpbS5oKSAvIDI7XG5cblx0XHRcdFx0dmFyIHBpZXN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGllRGltLncpXG5cdFx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdvdXRlci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cdFx0XHRcdHZhciBwaWVzdmcyID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwaWVEaW0udylcblx0XHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIHBpZURpbS5oKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2lubmVyLXBpZScpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrcGllRGltLncvMitcIixcIitwaWVEaW0uaC8yK1wiKVwiKTtcblxuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gZHJhdyB0aGUgYXJjcyBvZiB0aGUgcGllIHNsaWNlcy5cbiAgICAgICAgdmFyIGFyYyA9IGQzLnN2Z1xuXHRcdFx0XHRcdC5hcmMoKVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhwaWVEaW0uciAtIDEwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhwaWVEaW0uciAtIDIzKTtcbiAgICAgICAgdmFyIGFyYzIgPSBkMy5zdmdcblx0XHRcdFx0XHQuYXJjKClcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMocGllRGltLnIgLSAyMylcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgcGllIHNsaWNlIGFuZ2xlcy5cbiAgICAgICAgdmFyIHBpZSA9IGQzLmxheW91dFxuXHRcdFx0XHRcdC5waWUoKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuY291bnQ7IH0pO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBjMSA9IHBpZXN2Z1xuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpLmF0dHIoXCJkXCIsIGFyYylcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLG1vdXNlb3Zlcikub24oXCJtb3VzZW91dFwiLG1vdXNlb3V0KTtcblx0XHRcdFx0dmFyIGMyID0gcGllc3ZnMlxuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjMilcblx0XHQgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG5cdFx0ICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXHRcdCAgICAgICAgLm9uKCdjbGljaycsIG1vdXNlY2xpY2spO1xuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gdXBkYXRlIHBpZS1jaGFydC4gVGhpcyB3aWxsIGJlIHVzZWQgYnkgaGlzdG9ncmFtLlxuICAgICAgICBwQy51cGRhdGUgPSBmdW5jdGlvbihuRCl7XG4gICAgICAgICAgICBwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuRCkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFV0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3ZlciBhIHBpZSBzbGljZS5cblx0XHRcdFx0dmFyIHR5cGV1cyA9IGFuZ3VsYXIuY29weShzY29wZS5hY3RpdmVUeXBlKTtcblx0XHRcdFx0ZnVuY3Rpb24gbW91c2VjbGljayhkKXtcblx0XHRcdFx0XHRzY29wZS5jbGlja0l0KHt0eXBlX2lkOmQuZGF0YS50eXBlX2lkfSk7XG5cdFx0XHRcdH1cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdmVyKGQpe1xuICAgICAgICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIG9mIGhpc3RvZ3JhbSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0XHRcdFx0dHlwZXVzID0gYW5ndWxhci5jb3B5KHNjb3BlLmFjdGl2ZVR5cGUpO1xuICAgICAgICAgICAgc2NvcGUuYWN0aXZlVHlwZSA9IFtkLmRhdGEudHlwZV9pZF07XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvL1V0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3V0IGEgcGllIHNsaWNlLlxuICAgICAgICBmdW5jdGlvbiBtb3VzZW91dChkKXtcbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBvZiBoaXN0b2dyYW0gd2l0aCBhbGwgZGF0YS5cbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZVR5cGUgPSB0eXBldXM7XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbmltYXRpbmcgdGhlIHBpZS1zbGljZSByZXF1aXJpbmcgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggc3BlY2lmaWVzXG4gICAgICAgIC8vIGhvdyB0aGUgaW50ZXJtZWRpYXRlIHBhdGhzIHNob3VsZCBiZSBkcmF3bi5cbiAgICAgICAgZnVuY3Rpb24gYXJjVHdlZW4oYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYyhpKHQpKTsgICAgfTtcbiAgICAgICAgfVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbjIoYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYzIoaSh0KSk7ICAgIH07XG4gICAgICAgIH1cblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0cGllc3ZnLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKTtcblx0XHRcdFx0XHRwaWVzdmcyLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuMik7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGllY2hhcnRDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3JvdW5kYmFyJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdSb3VuZGJhckN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuXHRcdFx0XHR2YXIgbWFyZ2luID0ge1xuXHRcdFx0XHRcdFx0dG9wOiA0MCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdGJvdHRvbTogMzAsXG5cdFx0XHRcdFx0XHRsZWZ0OiA0MFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0d2lkdGggPSAzMDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcblx0XHRcdFx0XHRoZWlnaHQgPSAyMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcblx0XHRcdFx0XHRiYXJXaWR0aCA9IDIwLFxuXHRcdFx0XHRcdHNwYWNlID0gMjU7XG5cblxuXHRcdFx0XHR2YXIgc2NhbGUgPSB7XG5cdFx0XHRcdFx0eTogZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0fTtcblx0XHRcdFx0c2NhbGUueS5kb21haW4oWzAsIDIyMF0pO1xuXHRcdFx0XHRzY2FsZS55LnJhbmdlKFtoZWlnaHQsIDBdKTtcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcblxuXHRcdFx0XHQvL3guZG9tYWluKHNjb3BlLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGV0dGVyOyB9KSk7XG5cdFx0XHRcdC8veS5kb21haW4oWzAsIGQzLm1heChzY29wZS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZyZXF1ZW5jeTsgfSldKTtcblx0XHRcdFx0dmFyIGJhcnMgPSBzdmcuc2VsZWN0QWxsKCcuYmFycycpLmRhdGEoc2NvcGUuZGF0YSkuZW50ZXIoKS5hcHBlbmQoXCJnXCIpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTsgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGkgKiAyMCArIFwiLCAwKVwiOyB9KTs7XG5cblx0XHRcdFx0dmFyIGJhcnNCZyA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAwLCBiYXJXaWR0aCwgKGhlaWdodCksIGJhcldpZHRoIC8gMiwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2JnJyk7XG5cdFx0XHRcdHZhciB2YWx1ZUJhcnMgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8qLmF0dHIoJ3gnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNjYWxlLnkoZC52YWx1ZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pKi9cblxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi50cmFuc2l0aW9uKClcblx0XHRcdFx0XHQuZHVyYXRpb24oMzAwMClcblx0XHRcdFx0XHQuZWFzZShcInF1YWRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVpZ2h0IC0gc2NhbGUueShkLnZhbHVlKVxuXHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0O1xuXG5cdFx0XHRcdHZhciB2YWx1ZVRleHQgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZChcInRleHRcIik7XG5cblx0XHRcdFx0dmFsdWVUZXh0LnRleHQoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQudmFsdWVcblx0XHRcdFx0XHR9KS5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAtOClcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywnIzRmYjBlNScpO1xuXG5cdFx0XHRcdHZhciBsYWJlbHNUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdGxhYmVsc1RleHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmxhYmVsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgaGVpZ2h0ICsgMjApXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3Jcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdGZ1bmN0aW9uIHJvdW5kZWRfcmVjdCh4LCB5LCB3LCBoLCByLCB0bCwgdHIsIGJsLCBicikge1xuXHRcdFx0XHRcdHZhciByZXR2YWw7XG5cdFx0XHRcdFx0cmV0dmFsID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5O1xuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICh3IC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmICh0cikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIChoIC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmIChicikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKDIgKiByIC0gdyk7XG5cdFx0XHRcdFx0aWYgKGJsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArICgyICogciAtIGgpO1xuXHRcdFx0XHRcdGlmICh0bCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwielwiO1xuXHRcdFx0XHRcdHJldHVybiByZXR2YWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vc2NhbGUueS5kb21haW4oWzAsIDUwXSk7XG5cblx0XHRcdFx0XHRcdHZhbHVlQmFycy50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBib3JkZXJzID0gYmFyV2lkdGggLyAyO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHNjb3BlLmRhdGFbaV0udmFsdWUgPD0gMTApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVycyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAoc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJhcldpZHRoLCAoaGVpZ2h0IC0gc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJvcmRlcnMsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dmFsdWVUZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQsaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZC52YWx1ZSksIHBhcnNlSW50KHNjb3BlLmRhdGFbaV0udmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9KS5lYWNoKCdlbmQnLCBmdW5jdGlvbihkLCBpKXtcblx0XHRcdFx0XHRcdFx0XHRkLnZhbHVlID0gc2NvcGUuZGF0YVtpXS52YWx1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdSb3VuZGJhckN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW52ZXJ0OmZhbHNlXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZtLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCB2bS5vcHRpb25zKTtcblx0XHR2bS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IHRydWUsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHRcdH07XG5cdFx0dm0uY2hhcnQgPSB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdGNoYXJ0OiB7fVxuXHRcdFx0fSxcblx0XHRcdGRhdGE6IFtdXG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0Y2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdHNldENoYXJ0KCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KCl7XG5cdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFt2bS5yYW5nZS5tYXgsIHZtLnJhbmdlLm1pbl07XG5cdFx0fVxuXHQgXHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRkdXJhdGlvbjowLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHg6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0fSxcblx0XHRcdFx0eTogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaG93TGVnZW5kOiBmYWxzZSxcblx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdC8vc2hvd1lBeGlzOiBmYWxzZSxcblxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0Ly91c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0Zm9yY2VZOiBbdm0ucmFuZ2UubWF4LCB2bS5yYW5nZS5taW5dLFxuXHRcdFx0XHQvL3lEb21haW46W3BhcnNlSW50KHZtLnJhbmdlLm1pbiksIHZtLnJhbmdlLm1heF0sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnWWVhcicsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdGlmICh2bS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQuZm9yY2VZID0gW3BhcnNlSW50KHZtLnJhbmdlLm1heCksIHZtLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2bS5jaGFydDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlR3JhcGgoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHR2bS5yYW5nZSA9IHtcblx0XHRcdFx0bWF4OiAwLFxuXHRcdFx0XHRtaW46IDEwMDBcblx0XHRcdH07XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGlkOiBrZXksXG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChkYXRhLCBrKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWQ6IGssXG5cdFx0XHRcdFx0XHR4OiBkYXRhW2l0ZW0uZmllbGRzLnhdLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmZpZWxkcy55XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1heCA9IE1hdGgubWF4KHZtLnJhbmdlLm1heCwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWluID0gTWF0aC5taW4odm0ucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0ucmFuZ2UubWF4Kys7XG5cdFx0XHR2bS5yYW5nZS5taW4tLTtcblx0XHRcdHZtLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRpZiAodm0ub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC55RG9tYWluID0gW3BhcnNlSW50KHZtLnJhbmdlLm1heCksIHZtLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRcdGNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdHVwZGF0ZUNoYXJ0KCk7XG5cblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLnNlbGVjdGlvbicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0Ly9cdHVwZGF0ZUNoYXJ0KCk7XG5cdFx0XHQvL2NhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlcycsIFsnJGFuaW1hdGVDc3MnLCBmdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuXG5cdFx0dmFyIGxhc3RJZCA9IDA7XG4gICAgICAgIHZhciBfY2FjaGUgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRJZChlbCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIik7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgaWQgPSArK2xhc3RJZDtcbiAgICAgICAgICAgICAgICBlbFswXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoaWQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IF9jYWNoZVtpZF07XG4gICAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICBfY2FjaGVbaWRdID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVJ1bm5lcihjbG9zaW5nLCBzdGF0ZSwgYW5pbWF0b3IsIGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSBhbmltYXRvcjtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBkb25lRm47XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RhcnQoKS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2luZyAmJiBzdGF0ZS5kb25lRm4gPT09IGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnU2xpZGVUb2dnbGVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3N0eWxlcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdHlsZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdHN0eWxlczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3R5bGVzQ3RybCcsIGZ1bmN0aW9uICh0b2FzdHIsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnRvZ2dsZVN0eWxlID0gdG9nZ2xlU3R5bGU7XG5cdFx0dm0uc2VsZWN0ZWRTdHlsZSA9IHNlbGVjdGVkU3R5bGU7XG5cdFx0dm0uc2F2ZVN0eWxlID0gc2F2ZVN0eWxlO1xuXHRcdHZtLnN0eWxlID0gW107XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTdHlsZShzdHlsZSkge1xuXHRcdFx0aWYgKHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQpIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlX2lkID0gc3R5bGUuaWRcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RlZFN0eWxlKGl0ZW0sIHN0eWxlKSB7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZVN0eWxlKCkge1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnc3R5bGVzJywgdm0uc3R5bGUpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uc3R5bGVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdHZtLmNyZWF0ZVN0eWxlID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0uc3R5bGUgPSBbXTtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IGRhdGE7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgU3R5bGUgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdWJpbmRleEN0cmwnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4Lmh0bWwnLFxuXHRcdFx0bGluazogc3ViaW5kZXhMaW5rRnVuY3Rpb25cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3ViaW5kZXhMaW5rRnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0KSB7XG5cdFx0JHNjb3BlLmluZm8gPSBmYWxzZTtcblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBzZXRDaGFydDtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBjYWxjdWxhdGVHcmFwaDtcblx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlciA9IGNyZWF0ZUluZGV4ZXI7XG5cdFx0JHNjb3BlLmNhbGNTdWJSYW5rID0gY2FsY1N1YlJhbms7XG5cdFx0JHNjb3BlLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdCRzY29wZS5jcmVhdGVPcHRpb25zID0gY3JlYXRlT3B0aW9ucztcblx0XHQkc2NvcGUuZ2V0U3ViUmFuayA9IGdldFN1YlJhbms7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obmV3SXRlbSwgb2xkSXRlbSkge1xuXHRcdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2N1cnJlbnQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdCRzY29wZS5pbmZvID0gISRzY29wZS5pbmZvO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjYWxjU3ViUmFuaygpIHtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdID0gcGFyc2VGbG9hdChpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlSW50KGl0ZW1bJ3Njb3JlJ10pO1xuXHRcdFx0fSlcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpbHRlcltpXS5pc28gPT0gJHNjb3BlLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0cmFuayA9IGkgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY3VycmVudFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKydfcmFuayddID0gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0U3ViUmFuayhjb3VudHJ5KXtcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGZpbHRlciwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0aWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG5cdFx0XHRcdFx0cmFuayA9IGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmFuaysxO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVJbmRleGVyKCkge1xuXHRcdFx0JHNjb3BlLmluZGV4ZXIgPSBbJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5kYXRhXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVPcHRpb25zKCkge1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnMgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoxMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnNCaWcgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoyMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0Ly9oZWlnaHQ6IDIwMCxcblx0XHRcdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHg6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0XHRib3R0b206IDMwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY291bnRyeS5lcGksIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBkYXRhLnllYXIsXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uY29sdW1uX25hbWVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1bmJ1cnN0JywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0IG1vZGU6ICdzaXplJ1xuXHRcdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1bmJ1cnN0Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdHZhciB3aWR0aCA9IDYxMCxcblx0XHRcdFx0XHRoZWlnaHQgPSB3aWR0aCxcblx0XHRcdFx0XHRyYWRpdXMgPSAod2lkdGgpIC8gMixcblx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzAsIDIgKiBNYXRoLlBJXSksXG5cdFx0XHRcdFx0eSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAxXSkucmFuZ2UoWzAsIHJhZGl1c10pLFxuXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIik7O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsaWNrKGQpIHtcblx0XHRcdFx0XHQvLyBDb250cm9sIGFyYyB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0cGF0aC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKGQpKTtcblxuXHRcdFx0XHRcdC8vIFNvbWV3aGF0IG9mIGEgaGFjayBhcyB3ZSByZWx5IG9uIGFyY1R3ZWVuIHVwZGF0aW5nIHRoZSBzY2FsZXMuXG5cdFx0XHRcdFx0Ly8gQ29udHJvbCB0aGUgdGV4dCB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0dGV4dC5zdHlsZShcInZpc2liaWxpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyAxIDogMWUtNjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuZWFjaChcImVuZFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0ZnVuY3Rpb24gaXNQYXJlbnRPZihwLCBjKSB7XG5cdFx0XHRcdFx0aWYgKHAgPT09IGMpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGlmIChwLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcC5jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHNldENvbG9yKGQpIHtcblxuXHRcdFx0XHRcdC8vcmV0dXJuIDtcblx0XHRcdFx0XHRpZiAoZC5jb2xvcilcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuICcjY2NjJztcblx0XHRcdFx0XHRcdC8qdmFyIHRpbnREZWNheSA9IDAuMjA7XG5cdFx0XHRcdFx0XHQvLyBGaW5kIGNoaWxkIG51bWJlclxuXHRcdFx0XHRcdFx0dmFyIHggPSAwO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGQucGFyZW50LmNoaWxkcmVuW3hdICE9IGQpXG5cdFx0XHRcdFx0XHRcdHgrKztcblx0XHRcdFx0XHRcdHZhciB0aW50Q2hhbmdlID0gKHRpbnREZWNheSAqICh4ICsgMSkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHVzaGVyLmNvbG9yKGQucGFyZW50LmNvbG9yKS50aW50KHRpbnRDaGFuZ2UpLmh0bWwoJ2hleDYnKTsqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEudGl0bGUsXG5cdFx0XHRcdFwiY29sb3JcIjogJHNjb3BlLmRhdGEuc3R5bGUuYmFzZV9jb2xvciB8fCAnIzAwMCcsXG5cdFx0XHRcdFwiY2hpbGRyZW5cIjogYnVpbGRUcmVlKCRzY29wZS5kYXRhLmNoaWxkcmVuKSxcblx0XHRcdFx0XCJzaXplXCI6IDFcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICd0cmVlbWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWVtZW51L3RyZWVtZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWVtZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGl0ZW06Jz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1RyZWVtZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cblx0fSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZXZpZXcnLCBmdW5jdGlvbihSZWN1cnNpb25IZWxwZXIpIHtcblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdGVkaXRXZWlnaHQ6ZmFsc2UsXG5cdFx0XHRkcmFnOiBmYWxzZSxcblx0XHRcdGVkaXQ6IGZhbHNlLFxuXHRcdFx0Y2hpbGRyZW46J2NoaWxkcmVuJ1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnVHJlZXZpZXdDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPT8nLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nLFxuXHRcdFx0XHRjbGljazogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Y29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlY3Vyc2lvbkhlbHBlci5jb21waWxlKGVsZW1lbnQsIGZ1bmN0aW9uKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlRm4pe1xuXHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsIHNjb3BlLnZtLm9wdGlvbnMpXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmaW5lIHlvdXIgbm9ybWFsIGxpbmsgZnVuY3Rpb24gaGVyZS5cbiAgICAgICAgICAgICAgICAvLyBBbHRlcm5hdGl2ZTogaW5zdGVhZCBvZiBwYXNzaW5nIGEgZnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgLy8geW91IGNhbiBhbHNvIHBhc3MgYW4gb2JqZWN0IHdpdGhcbiAgICAgICAgICAgICAgICAvLyBhICdwcmUnLSBhbmQgJ3Bvc3QnLWxpbmsgZnVuY3Rpb24uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUcmVldmlld0N0cmwnLCBmdW5jdGlvbigkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS5jaGlsZFNlbGVjdGVkID0gY2hpbGRTZWxlY3RlZDtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0ub25EcmFnT3ZlciA9IG9uRHJhZ092ZXI7XG5cdFx0dm0ub25Ecm9wQ29tcGxldGUgPSBvbkRyb3BDb21wbGV0ZTtcblx0XHR2bS5vbk1vdmVkQ29tcGxldGUgPSBvbk1vdmVkQ29tcGxldGU7XG5cdFx0dm0uYWRkQ2hpbGRyZW4gPSBhZGRDaGlsZHJlbjtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLnNlbGVjdGlvbiA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25EcmFnT3ZlcihldmVudCwgaW5kZXgsIGV4dGVybmFsLCB0eXBlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbkRyb3BDb21wbGV0ZShldmVudCwgaW5kZXgsIGl0ZW0sIGV4dGVybmFsKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSAwKXtcblx0XHRcdFx0XHR2bS5pdGVtcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uTW92ZWRDb21wbGV0ZShpbmRleCwgZGF0YSwgZXZ0KSB7XG5cdFx0XHRpZih2bS5vcHRpb25zLmFsbG93TW92ZSl7XG5cdFx0XHRcdHJldHVybiB2bS5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKHNlbGVjdGVkLCBpKXtcblx0XHRcdFx0aWYoc2VsZWN0ZWQuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmKGluZGV4ID4gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHZtLm9wdGlvbnMuc2VsZWN0aW9uQ2hhbmdlZCA9PSAnZnVuY3Rpb24nIClcblx0XHRcdFx0dm0ub3B0aW9ucy5zZWxlY3Rpb25DaGFuZ2VkKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENoaWxkcmVuKGl0ZW0pIHtcblxuXHRcdFx0aXRlbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0aXRlbS5leHBhbmRlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oc2VsZWN0ZWQpe1xuXHRcdFx0XHRpZihzZWxlY3RlZC5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdC8qXHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihhbmd1bGFyLmNvcHkoaXRlbSkpID4gLTEpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTsqL1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoaWxkU2VsZWN0ZWQoaXRlbSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihjaGlsZCk+IC0xKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWZvdW5kKXtcblx0XHRcdFx0XHRmb3VuZCA9ICBjaGlsZFNlbGVjdGVkKGNoaWxkKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikgdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID0gW107XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZSxcblx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0sIGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pZCA9PSBpdGVtLmlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5wdXNoKGl0ZW0pIDogdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fSovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbS53ZWlnaHQgPT0gXCJ1bmRlZmluZWRcIiB8fCAhdm0uaXRlbS53ZWlnaHQpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA+PSA5NSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ICs9IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG93ZXJXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA8PSA1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpIC0gNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0IC09IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
