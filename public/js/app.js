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
		$rootScope.greyed = true;
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

(function() {
	"use strict";

	angular.module('app.services').factory('VectorlayerService', ["$timeout", function($timeout) {
		var that = this, _self = this;
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
				fields: "id,admin,adm0_a3,iso_a2,name,name_long", //su_a3,iso_a3,wb_a3,
				field:'score'
			},
			map: {
				data: [],
				current: [],
				structure: [],
				style: []
			},
			mapLayer: null,
			setMap: function(map){
				return this.mapLayer = map;
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
    vm.years = [], vm.gender = [];
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
			getGender();
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
					if(vm.years.indexOf(entry.data[vm.meta.year_field]) == -1){
						  vm.years.push(entry.data[vm.meta.year_field])
					}
	      });
				vm.yearfilter = vm.years[0];
			});
    }
		function getGender(){
			$timeout(function(){
				var dat = ($filter('groupBy')(vm.data, 'data.'+vm.meta.country_field ));
	      vm.gender = [];
				var length = 0;
				var index = null;
			  angular.forEach(dat,function(entry, i){
					if(entry.length > length){
						index = i
					}
				});
	      angular.forEach(dat[index],function(entry){
					if(vm.gender.indexOf(entry.data[vm.meta.gender_field]) == -1){
						  vm.gender.push(entry.data[vm.meta.gender_field])
					}
	      });
				vm.genderfilter = vm.gender[0];
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
		vm.toggleLayers = toggleLayers;
		vm.defaults = {
			//scrollWheelZoom: false,
			minZoom: minZoom,
			maxZoom: 6
		};
		vm.center = {
			lat: 48.209206,
			lng: 16.372778,
			zoom: zoom
		};
		vm.layers = {
			baselayers: {
				xyz: {
					name: 'Outdoor',
					url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=' + apiKey,
					type: 'xyz',
					layerOptions: {
						noWrap: true,
						continuousWorld: false,
						detectRetina: true
					}
				}
			}
		};
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
			var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/' + VectorlayerService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + VectorlayerService.fields(); //
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

					var value = brush.extent()[0];
					angular.forEach($scope.data, function(nat, key) {
						if (parseInt(nat[options.field]) == parseInt(value)) {
							final = nat;
							found = true;
						}
					});
					// 	count = 0,
					// 	found = false;
					// var final = "";
					// do {
					//
					// 	angular.forEach($scope.data, function (nat, key) {
					// 		if (parseInt(nat[options.field]) == parseInt(value)) {
					// 			final = nat;
					// 			found = true;
					// 		}
					// 	});
					// 	count++;
					// 	value = value > 50 ? value - 1 : value + 1;
					// } while (!found && count < max);
					//
					// ngModel.$setViewValue(final);
					// ngModel.$render();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvY29udGVudC5qcyIsInNlcnZpY2VzL2NvdW50cmllcy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lcnJvckNoZWNrZXIuanMiLCJzZXJ2aWNlcy9pY29ucy5qcyIsInNlcnZpY2VzL2luZGV4LmpzIiwic2VydmljZXMvaW5kaXplcy5qcyIsInNlcnZpY2VzL3JlY3Vyc2lvbmhlbHBlci5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL3ZlY3RvcmxheWVyLmpzIiwiYXBwL2NvbmZsaWN0SW1wb3J0L2NvbmZsaWN0SW1wb3J0LmpzIiwiYXBwL2NvbmZsaWN0ZGV0YWlscy9jb25mbGljdGRldGFpbHMuanMiLCJhcHAvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiYXBwL2NvbmZsaWN0bmF0aW9uL2NvbmZsaWN0bmF0aW9uLmpzIiwiYXBwL2NvbmZsaWN0cy9jb25mbGljdHMuanMiLCJhcHAvZnVsbExpc3QvZmlsdGVyLmpzIiwiYXBwL2Z1bGxMaXN0L2Z1bGxMaXN0LmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaG9tZS9ob21lLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVjay5qcyIsImFwcC9pbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbC5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWxNZW51LmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGEuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YU1lbnUuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGEuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFFbnRyeS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuanMiLCJhcHAvaW5kZXhlZGl0b3IvY2F0ZWdvcnkuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaXplcy5qcyIsImFwcC9pbmRleGNyZWF0b3IvaW5kZXhjcmVhdG9yLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImFwcC9pbmRpY2F0b3IvaW5kaWNhdG9yWWVhclRhYmxlLmpzIiwiYXBwL2xvZ2luL2xvZ2luLmpzIiwiYXBwL2xvZ28vbG9nby5qcyIsImFwcC9tYXAvbWFwLmpzIiwiYXBwL3NlbGVjdGVkL3NlbGVjdGVkLmpzIiwiYXBwL3NpZGViYXIvc2lkZWJhci5qcyIsImFwcC9zaWRlbWVudS9zaWRlbWVudS5qcyIsImFwcC9zaWdudXAvc2lnbnVwLmpzIiwiYXBwL3RvYXN0cy90b2FzdHMuanMiLCJhcHAvdW5zdXBwb3J0ZWRfYnJvd3Nlci91bnN1cHBvcnRlZF9icm93c2VyLmpzIiwiYXBwL3VzZXIvdXNlci5qcyIsImRpYWxvZ3MvYWRkUHJvdmlkZXIvYWRkUHJvdmlkZXIuanMiLCJkaWFsb2dzL2FkZFVuaXQvYWRkVW5pdC5qcyIsImRpYWxvZ3MvYWRkWWVhci9hZGRZZWFyLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlhbG9ncy9jb25mbGljdG1ldGhvZGUvY29uZmxpY3RtZXRob2RlLmpzIiwiZGlhbG9ncy9jb25mbGljdHRleHQvY29uZmxpY3R0ZXh0LmpzIiwiZGlhbG9ncy9jb3B5cHJvdmlkZXIvY29weXByb3ZpZGVyLmpzIiwiZGlhbG9ncy9lZGl0Y29sdW1uL2VkaXRjb2x1bW4uanMiLCJkaWFsb2dzL2VkaXRyb3cvZWRpdHJvdy5qcyIsImRpYWxvZ3MvZXh0ZW5kRGF0YS9leHRlbmREYXRhLmpzIiwiZGlhbG9ncy9sb29zZWRhdGEvbG9vc2VkYXRhLmpzIiwiZGlhbG9ncy9zZWxlY3Rpc29mZXRjaGVycy9zZWxlY3Rpc29mZXRjaGVycy5qcyIsImRpcmVjdGl2ZXMvYXV0b0ZvY3VzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2JhcnMvYmFycy5qcyIsImRpcmVjdGl2ZXMvYmFycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2NhdGVnb3J5LmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvY29udGVudGVkaXRhYmxlLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9maWxlRHJvcHpvbmUuanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5LmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2luZGljYXRvck1lbnUuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvcnMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9ycy9pbmRpY2F0b3JzLmpzIiwiZGlyZWN0aXZlcy9pbmRpemVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL3NsaWRlVG9nZ2xlLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuanMiLCJkaXJlY3RpdmVzL3dlaWdodC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsWUFBQSwwQkFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsWUFBQSxXQUFBLGlCQUFBLGdCQUFBLGNBQUEsZ0JBQUEsWUFBQSxVQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsZ0JBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEscUVBQUEsU0FBQSxnQkFBQSxvQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsYUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztJQUdBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7O0lBTUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtLQUNBLGtDQUFBLFNBQUEsYUFBQSxPQUFBO01BQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7SUFLQSxNQUFBLGFBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSxnQ0FBQSxTQUFBLGtCQUFBO01BQ0EsT0FBQSxpQkFBQTs7Ozs7R0FLQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtLQUNBLDRCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxnQkFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7OztLQUdBLDJCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxjQUFBO09BQ0EsWUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEseUNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsOENBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsT0FBQSxlQUFBLGFBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7Ozs7Ozs7Ozs7OztJQWVBLE1BQUEsNEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLGlDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLDBDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLElBQUEsYUFBQSxNQUFBLEdBQUEsT0FBQTtNQUNBLE9BQUEsZUFBQSxRQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxxQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLCtDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxnQkFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsZUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsaURBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0lBRUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEsd0NBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsNkNBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsR0FBQSxhQUFBLE1BQUEsTUFBQTtPQUNBLE9BQUE7O01BRUEsT0FBQSxlQUFBLFlBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7O0lBS0EsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLCtCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUEsY0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7OztLQUdBLDRCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxlQUFBO09BQ0EsT0FBQSxlQUFBLGNBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTs7OztJQUlBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7O0lBS0EsTUFBQSx3QkFBQTtJQUNBLElBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsZUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7SUFHQSxPQUFBO0tBQ0EsS0FBQTtNQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTs7S0FFQSxPQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBOztLQUVBLElBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7Ozs7O0lBS0EsTUFBQSw0QkFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLG1DQUFBLFNBQUEsZ0JBQUEsUUFBQTs7TUFFQSxPQUFBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxPQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxVQUFBLGFBQUE7O0tBRUEsZ0NBQUEsU0FBQSxrQkFBQTtNQUNBLE9BQUEsaUJBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxnQkFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsc0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHlCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOztLQUVBLDJCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDZCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSx3Q0FBQSxTQUFBLGFBQUEsY0FBQTtNQUNBLE9BQUEsWUFBQSxJQUFBLHVCQUFBLGFBQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw4QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsMENBQUEsU0FBQSxhQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQSxzQkFBQSxhQUFBLElBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsZUFBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7QUNqaUJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFIQUFBLFNBQUEsWUFBQSxZQUFBLFVBQUEsT0FBQSxRQUFBLGVBQUEsU0FBQSxhQUFBLFFBQUE7RUFDQSxXQUFBLGNBQUE7RUFDQSxXQUFBLFNBQUE7RUFDQSxXQUFBLGNBQUEsY0FBQSxZQUFBO0VBQ0EsV0FBQSxVQUFBO0VBQ0EsV0FBQSxTQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsV0FBQSxhQUFBLFNBQUEsUUFBQTtHQUNBLFdBQUEsUUFBQTs7O0VBR0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLENBQUEsTUFBQSxtQkFBQTtJQUNBLE9BQUEsTUFBQSx1Q0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBLE9BQUEsR0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsVUFBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLFdBQUEsUUFBQTtVQUNBO0lBQ0EsV0FBQSxRQUFBOzs7R0FHQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGFBQUE7SUFDQSxJQUFBLFFBQUEsTUFBQSxlQUFBLFlBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLFdBQUE7V0FDQTtLQUNBLFdBQUEsV0FBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxhQUFBO1dBQ0E7S0FDQSxXQUFBLGFBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsVUFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztVQUVBO0lBQ0EsV0FBQSxhQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLElBQUEsUUFBQSxLQUFBLFFBQUEsY0FBQSxDQUFBLEtBQUEsUUFBQSxRQUFBLHVCQUFBO0lBQ0EsV0FBQSxXQUFBO1VBQ0E7SUFDQSxXQUFBLFdBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsNkJBQUE7SUFDQSxXQUFBLFlBQUE7VUFDQTtJQUNBLFdBQUEsWUFBQTs7R0FFQSxXQUFBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTs7R0FFQSxXQUFBLGlCQUFBO0dBQ0EsV0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxTQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7S0FDQSxXQUFBLFlBQUE7O0dBRUE7OztFQUdBLFNBQUEsZUFBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMvRkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxlQUFBOzs7RUFHQSxjQUFBLFdBQUE7SUFDQSxjQUFBLFlBQUE7SUFDQSxjQUFBLFlBQUE7RUFDQSxjQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7RUFFQSxjQUFBLE9BQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBO1FBQ0EsYUFBQSxhQUFBOzs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwrQkFBQSxTQUFBLHFCQUFBO0VBQ0E7SUFDQSxXQUFBO0lBQ0Esa0JBQUE7SUFDQSxRQUFBOztJQUVBLHFCQUFBO0lBQ0EsT0FBQTs7SUFFQSx1QkFBQSxTQUFBLE1BQUEsV0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQTtJQUNBLGdCQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQTtLQUNBLGNBQUEsUUFBQSxLQUFBOztJQUVBLElBQUEsS0FBQSxVQUFBO0tBQ0EsY0FBQSxZQUFBLEtBQUE7O0lBRUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDckJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG9EQUFBLFNBQUEsbUJBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7R0FFQSxtQkFBQTs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7VUFDQSxZQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFlBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBOztZQUVBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQTs7WUFFQSxPQUFBLE1BQUEsUUFBQSxlQUFBOzs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxjQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7O01BRUEsSUFBQSxTQUFBO0dBQ0EsSUFBQSxJQUFBO0lBQ0EsTUFBQSxNQUFBOztHQUVBLE9BQUEsSUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLGNBQUEsUUFBQSxLQUFBLGlCQUFBLENBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxNQUFBOzs7R0FHQSxPQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE1BQUE7OzthQUdBLE9BQUEsS0FBQSxRQUFBLGNBQUE7Ozs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsaUJBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxLQUFBLElBQUEsYUFBQSxPQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUE7OztHQUdBLE1BQUEsS0FBQSxVQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsSUFBQSxTQUFBLEVBQUE7SUFDQSxPQUFBLElBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsWUFBQTtDQUNBLFNBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFlBQUEsT0FBQTs7TUFFQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxRQUFBLElBQUE7O1FBRUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxNQUFBLEtBQUEsTUFBQTs7OztHQUlBLE9BQUE7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZDQUFBLFNBQUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsT0FBQSxJQUFBO0lBQ0EsSUFBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsTUFBQSxHQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLEtBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxjQUFBLEtBQUEsVUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7O0dBS0EsT0FBQTs7RUFFQSxPQUFBO0dBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtJQUNBLGNBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFVBQUEsWUFBQSxPQUFBLFNBQUE7O0dBRUEsaUJBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxPQUFBLFVBQUEsUUFBQTs7R0FFQSxZQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxhQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGVBQUEsU0FBQSxRQUFBLGFBQUE7SUFDQSxHQUFBLFlBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUEsUUFBQTs7SUFFQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxnQkFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFFBQUE7O0lBRUEsT0FBQSxLQUFBLGdCQUFBOzs7R0FHQSxXQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFlBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUE7O0dBRUEsY0FBQSxTQUFBLElBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsV0FBQSxRQUFBLEtBQUE7TUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQTs7OztJQUlBLE9BQUEsS0FBQSxlQUFBOztHQUVBLGdCQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxZQUFBOzs7R0FHQSx1QkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxhQUFBOztHQUVBLGtCQUFBLFNBQUEsSUFBQSxNQUFBLFFBQUE7SUFDQSxHQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLFdBQUEsT0FBQSxZQUFBOztTQUVBLElBQUEsTUFBQTtLQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUEsV0FBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBOztHQUVBLHFCQUFBLFNBQUEsSUFBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLGNBQUEsS0FBQSxDQUFBLFFBQUE7O0dBRUEsU0FBQSxTQUFBLElBQUE7Ozs7O0tBS0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsVUFBQTs7O0dBR0EsY0FBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLEtBQUEsT0FBQSxLQUFBO01BQ0EsT0FBQTs7S0FFQSxHQUFBLE1BQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxLQUFBLGNBQUEsSUFBQSxNQUFBO01BQ0EsR0FBQSxVQUFBO09BQ0EsT0FBQTs7OztJQUlBLE9BQUE7O0dBRUEsWUFBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLFFBQUE7O0tBRUEsR0FBQSxNQUFBLFlBQUEsTUFBQSxTQUFBLFVBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsWUFBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxRQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxTQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxRQUFBLEtBQUE7O0dBRUEsWUFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxVQUFBOztHQUVBLFlBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsWUFBQSxLQUFBLElBQUEsS0FBQSxRQUFBOztJQUVBLE9BQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQTtLQUNBLE9BQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxRQUFBO1dBQ0E7S0FDQSxPQUFBLEtBQUEsUUFBQSxXQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOzs7R0FHQSxnQkFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxlQUFBOztHQUVBLFlBQUEsU0FBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxTQUFBLEVBQUE7S0FDQSxHQUFBLENBQUEsS0FBQSxPQUFBLE1BQUE7TUFDQSxLQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxRQUFBOztTQUVBO01BQ0EsS0FBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLEtBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQTs7SUFFQSxLQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUEsUUFBQTtJQUNBLEtBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7O0FDNUxBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG9DQUFBLFNBQUEsWUFBQTs7UUFFQSxPQUFBO1VBQ0EsV0FBQTtVQUNBLFdBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxZQUFBLFlBQUEsT0FBQSxrQkFBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLENBQUEsS0FBQSxVQUFBLE9BQUE7Y0FDQSxLQUFBOztZQUVBLE9BQUEsS0FBQTs7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQSxjQUFBOztJQUVBLFNBQUEsWUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsS0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBOzs7UUFHQSxTQUFBLE9BQUEsT0FBQSxPQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBLFFBQUE7WUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxHQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLEtBQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsS0FBQTtVQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBOztVQUVBLE9BQUE7O1FBRUEsU0FBQSxJQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUEsSUFBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxHQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOzs7Ozs7QUN4Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEscUJBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7R0FJQSxTQUFBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTtPQUNBLE9BQUE7Ozs7OztBQ3RDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSx3RUFBQSxTQUFBLGFBQUEsZUFBQSxhQUFBOztRQUVBLElBQUEsS0FBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQTtPQUNBLEdBQUEsbUJBQUE7T0FDQSxJQUFBLEdBQUEsS0FBQSxRQUFBO1FBQ0EsR0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO1NBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxPQUFBO1VBQ0EsSUFBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUE7V0FDQSxJQUFBLFVBQUEsS0FBQSxNQUFBLE1BQUE7V0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLFFBQUE7WUFDQSxJQUFBLE9BQUEsVUFBQSxPQUFBO2FBQ0E7Ozs7VUFJQSxJQUFBLFNBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxPQUFBLFNBQUEsR0FBQTtXQUNBLEdBQUEsaUJBQUEsS0FBQTs7O1NBR0EsSUFBQSxHQUFBLGlCQUFBLFFBQUE7VUFDQSxHQUFBLEdBQUEsS0FBQSxXQUFBO1dBQ0EsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTs7VUFFQSxjQUFBLGFBQUEsY0FBQTs7OztVQUlBLE9BQUE7OztNQUdBLFNBQUEsY0FBQTtPQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7UUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLEdBQUE7U0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxLQUFBLEtBQUEsV0FBQSxpQkFBQSxTQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO1dBQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7V0FDQSxJQUFBLE9BQUEsT0FBQSxHQUFBO1dBQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTs7OztRQUlBLElBQUEsQ0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTtTQUNBLElBQUEsUUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1VBQ0EsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7VUFDQSxRQUFBLEdBQUEsS0FBQTtVQUNBLEtBQUE7O1NBRUEsSUFBQSxhQUFBO1NBQ0EsUUFBQSxRQUFBLElBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7V0FDQSxhQUFBOzs7U0FHQSxJQUFBLENBQUEsWUFBQTtVQUNBLElBQUEsT0FBQSxLQUFBO1VBQ0EsR0FBQSxXQUFBLEtBQUE7Ozs7OztNQU1BLFNBQUEsV0FBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLEtBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSwwQ0FBQTtRQUNBLE9BQUE7O09BRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxlQUFBO1FBQ0EsT0FBQSxNQUFBLDhDQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLEdBQUEsS0FBQSxpQkFBQSxHQUFBLEtBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxtREFBQTtRQUNBLE9BQUE7OztPQUdBLEdBQUEsV0FBQTtPQUNBLElBQUEsVUFBQTtPQUNBLElBQUEsV0FBQTtPQUNBLElBQUEsVUFBQTtPQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsWUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsSUFBQTs7UUFFQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLEtBQUE7VUFDQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUE7VUFDQTtTQUNBO1VBQ0E7O1FBRUEsUUFBQSxLQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxNQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTs7O09BR0EsSUFBQSxVQUFBLGFBQUEsUUFBQSxTQUFBLEtBQUEsZUFBQTtPQUNBLGFBQUE7T0FDQSxZQUFBLEtBQUEsd0JBQUE7UUFDQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLEtBQUEsU0FBQSxVQUFBO1FBQ0EsUUFBQSxRQUFBLFVBQUEsU0FBQSxTQUFBLEtBQUE7U0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO1VBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO1dBQ0EsSUFBQSxRQUFBLEtBQUEsU0FBQSxHQUFBO1lBQ0EsSUFBQSxXQUFBO2FBQ0EsT0FBQTthQUNBLFNBQUEsUUFBQTs7WUFFQSxhQUFBLFlBQUE7a0JBQ0E7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBLE1BQUEsYUFBQTthQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsYUFBQSxRQUFBLEtBQUEsR0FBQTthQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsUUFBQSxLQUFBLEdBQUE7YUFDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO2NBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtlQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7Z0JBQ0EsR0FBQSxXQUFBLE9BQUEsR0FBQTtnQkFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBO3NCQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7Z0JBQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBLFdBQUE7aUJBQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTtpQkFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBOzs7Ozs7bUJBTUE7O2FBRUEsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxRQUFBLEdBQUEsS0FBQTs7YUFFQSxJQUFBLGFBQUE7YUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtjQUNBLFFBQUEsSUFBQTtjQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7ZUFDQSxhQUFBOzs7YUFHQSxJQUFBLENBQUEsWUFBQTtjQUNBLGFBQUEsWUFBQTtjQUNBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBO1FBQ0EsSUFBQSxhQUFBLGNBQUEsUUFBQTtTQUNBLGNBQUEsYUFBQTs7VUFFQSxTQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsc0NBQUEsU0FBQSxLQUFBOzs7O1FBSUEsT0FBQTtVQUNBLGFBQUE7Ozs7OztBQ2xMQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxnQkFBQSxVQUFBO1FBQ0EsSUFBQSxXQUFBO1VBQ0EsU0FBQTtVQUNBLFNBQUE7VUFDQSxVQUFBO1VBQ0EsYUFBQTtVQUNBLFNBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLFVBQUE7VUFDQSxPQUFBO1VBQ0EsUUFBQTs7O1FBR0EsT0FBQTtVQUNBLFlBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxTQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUE7Ozs7Ozs7QUN0QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsMkNBQUEsU0FBQSxhQUFBLE9BQUE7O1FBRUEsSUFBQSxjQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsS0FBQTtjQUNBLFdBQUE7Y0FDQSxjQUFBO2NBQ0EsV0FBQTtjQUNBLGFBQUE7Y0FDQSxNQUFBOztZQUVBLFdBQUE7WUFDQSxTQUFBO1dBQ0EsU0FBQSxhQUFBOztRQUVBLElBQUEsQ0FBQSxhQUFBLElBQUEsZUFBQTtVQUNBLGNBQUEsYUFBQSxjQUFBO1lBQ0Esb0JBQUEsS0FBQSxLQUFBO1lBQ0EsZ0JBQUE7WUFDQSxhQUFBOztVQUVBLGNBQUEsWUFBQSxJQUFBOztZQUVBO1VBQ0EsY0FBQSxhQUFBLElBQUE7VUFDQSxVQUFBLFlBQUEsSUFBQTs7UUFFQSxPQUFBO1VBQ0EsTUFBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7a0JBQ0EsYUFBQTs7Z0JBRUEsU0FBQTtnQkFDQSxXQUFBOzs7VUFHQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxhQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsZ0JBQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxRQUFBLFlBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxRQUFBLENBQUEsSUFBQSxZQUFBLFNBQUEsT0FBQSxPQUFBLEtBQUE7O1VBRUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsT0FBQTs7VUFFQSxhQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLFlBQUE7O1VBRUEsaUJBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsZ0JBQUE7O1VBRUEsZ0JBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsZUFBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLGFBQUE7O1VBRUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUEsU0FBQTs7VUFFQSxtQkFBQSxVQUFBOztVQUVBLFlBQUEsSUFBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxLQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBOztVQUVBLHdCQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUEsS0FBQSxlQUFBOztVQUVBLHFCQUFBLFVBQUE7WUFDQSxPQUFBLGNBQUEsWUFBQSxJQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLFdBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxjQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsWUFBQSxXQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQSxFQUFBOztVQUVBLFlBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUEsRUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQTs7VUFFQSxtQkFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7O2dCQUVBLFNBQUE7Z0JBQ0EsV0FBQTs7Ozs7Ozs7QUN6S0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxPQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxZQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxZQUFBLEtBQUEsTUFBQSxTQUFBLFVBQUE7SUFDQSxPQUFBLEtBQUE7O0dBRUEsU0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxjQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGdCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOztHQUVBLHFCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOzs7Ozs7O0FDakNBLENBQUEsWUFBQTtFQUNBOztFQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdDQUFBLFVBQUEsVUFBQTs7SUFFQSxPQUFBOzs7Ozs7O0tBT0EsU0FBQSxVQUFBLFNBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7O01BS0EsSUFBQSxXQUFBLFFBQUEsV0FBQTtNQUNBLElBQUE7TUFDQSxPQUFBO09BQ0EsS0FBQSxDQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQTs7OztPQUlBLE1BQUEsVUFBQSxPQUFBLFNBQUE7O1FBRUEsSUFBQSxDQUFBLGtCQUFBO1NBQ0EsbUJBQUEsU0FBQTs7O1FBR0EsaUJBQUEsT0FBQSxVQUFBLE9BQUE7U0FDQSxRQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLFFBQUEsS0FBQSxNQUFBO1NBQ0EsS0FBQSxLQUFBLE1BQUEsTUFBQTs7Ozs7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsWUFBQTs7O1FBR0EsT0FBQTtVQUNBLEtBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLE9BQUEsWUFBQSxPQUFBOztVQUVBLFdBQUEsVUFBQTs7O1VBR0EsV0FBQSxVQUFBOzs7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxtQ0FBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBO0VBQ0EsT0FBQTtHQUNBLFFBQUE7R0FDQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTtJQUNBLE9BQUE7O0dBRUEsVUFBQTtHQUNBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxLQUFBLFdBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFNBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFFBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLEtBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxtQkFBQSxTQUFBLFdBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsWUFBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxRQUFBLElBQUE7S0FDQSxTQUFBLGFBQUEsS0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBLFdBQUE7O0lBRUEsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxjQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFlBQUE7Ozs7O0dBS0EsY0FBQSxTQUFBLGVBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLFVBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7Ozs7R0FJQSxVQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxLQUFBLEtBQUEsWUFBQTs7SUFFQSxJQUFBLENBQUEsS0FBQSxRQUFBO0tBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsS0FBQSxLQUFBOztTQUVBO01BQ0EsS0FBQSxrQkFBQSxLQUFBLEtBQUE7O1dBRUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsS0FBQTs7O0dBR0EsZ0JBQUEsU0FBQSxLQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxZQUFBO0tBQ0EsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7UUFJQTtLQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxJQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLGlCQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7O0dBRUEsZ0JBQUEsU0FBQSxPQUFBLE9BQUEsT0FBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLElBQUEsT0FBQSxTQUFBLGVBQUEsU0FBQSxNQUFBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQTtZQUNBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLElBQUE7O0tBRUEsSUFBQSxPQUFBLFNBQUEsYUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQTs7O01BR0EsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGVBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLFVBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsSUFBQTtPQUNBLEdBQUEsT0FBQTtRQUNBLFFBQUEsV0FBQTs7VUFFQTtPQUNBLFFBQUEsV0FBQTs7OztLQUlBLEtBQUE7Ozs7R0FJQSxtQkFBQSxTQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUE7S0FDQSxRQUFBLElBQUE7OztRQUdBO0tBQ0EsS0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxXQUFBOzs7O0dBSUEsT0FBQSxVQUFBO0lBQ0EsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGdCQUFBLFNBQUEsU0FBQTtJQUNBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUEsS0FBQSxlQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0lBQ0EsUUFBQSxXQUFBOztJQUVBLFFBQUE7S0FDQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxLQUFBO09BQ0EsSUFBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7T0FFQSxJQUFBLFlBQUEsU0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO09BQ0EsUUFBQSxJQUFBLFVBQUEsSUFBQTtPQUNBLElBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOztPQUVBLE1BQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO1FBQ0EsU0FBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOzs7O2FBSUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztPQUlBOztJQUVBLE9BQUE7Ozs7Ozs7O0FDaFFBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsYUFBQSxRQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLEdBQUE7SUFDQSxRQUFBLEdBQUE7O0dBRUEsWUFBQSxJQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUNsQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUpBQUEsU0FBQSxVQUFBLFFBQUEsUUFBQSxZQUFBLG9CQUFBLFVBQUEsV0FBQSxTQUFBLGVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxnQkFBQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7RUFDQSxHQUFBLFNBQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxXQUFBLFNBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7O0lBRUEsR0FBQSxZQUFBO0lBQ0EsbUJBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7SUFDQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsYUFBQTtJQUNBLG1CQUFBOzs7SUFHQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxLQUFBO01BQ0EsbUJBQUEsbUJBQUEsT0FBQSxLQUFBOzs7OztJQUtBLG1CQUFBLGVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsYUFBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLGNBQUEsYUFBQSxnQkFBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsU0FBQSxtQkFBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLEdBQUEsWUFBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxzQkFBQTtHQUNBLElBQUEsR0FBQSxlQUFBLE9BQUE7R0FDQSxPQUFBOzs7Ozs7QUN2SUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLFdBQUEsZ0JBQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7O0VBRUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsV0FBQSxNQUFBO0dBQ0EsUUFBQSxJQUFBLE1BQUEsV0FBQTtHQUNBLElBQUEsSUFBQSxXQUFBLGNBQUEsUUFBQTtHQUNBLElBQUEsSUFBQSxDQUFBLEdBQUE7SUFDQSxXQUFBLGNBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxXQUFBLGNBQUEsS0FBQTs7O0dBR0EsSUFBQSxXQUFBLGNBQUEsVUFBQSxHQUFBO0lBQ0EsV0FBQSxnQkFBQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTs7O0dBR0E7Ozs7QUMxQ0EsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0lBQUEsU0FBQSxVQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsb0JBQUEsYUFBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLFdBQUEsU0FBQTtHQUNBLFdBQUEsZUFBQTs7R0FFQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxtQkFBQSxjQUFBLEdBQUEsT0FBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUEsUUFBQTtJQUNBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxhQUFBO0lBQ0EsbUJBQUEsbUJBQUEsR0FBQSxPQUFBLEtBQUE7SUFDQSxXQUFBLGVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFdBQUEsU0FBQSxVQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLFdBQUE7S0FDQSxJQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUEsU0FBQTtNQUNBLEdBQUEsV0FBQTs7S0FFQSxRQUFBLFFBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLEdBQUEsUUFBQSxHQUFBO09BQ0EsR0FBQSxHQUFBLFNBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsU0FBQSxLQUFBO1FBQ0EsV0FBQSxlQUFBLEdBQUE7Ozs7O0tBS0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsT0FBQTtNQUNBLElBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtPQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXVCQSxTQUFBLGFBQUE7R0FDQSxjQUFBLGFBQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTs7SUFFQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsSUFBQSxZQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOztJQUVBLFFBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDM0lBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRKQUFBLFVBQUEsVUFBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLFNBQUEsb0JBQUEsYUFBQSxlQUFBLFlBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtHQUNBLFlBQUE7R0FDQSxZQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQSxDQUFBLEdBQUEsR0FBQTs7RUFFQSxHQUFBLHVCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsV0FBQSxTQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7O0dBRUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxZQUFBO0lBQ0E7Ozs7Ozs7O0VBUUEsU0FBQSxlQUFBOztHQUVBLElBQUEsV0FBQTtJQUNBLFdBQUE7O0lBRUEsV0FBQTs7Ozs7O0VBTUEsU0FBQSxZQUFBO0dBQ0EsR0FBQSxZQUFBO0dBQ0EsR0FBQSxzQkFBQTtHQUNBLEdBQUEsc0JBQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsVUFBQTs7R0FFQSxHQUFBLFlBQUEsQ0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7OztHQUdBLEdBQUEsZ0JBQUEsQ0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7Ozs7O0VBS0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLHFCQUFBLE1BQUE7O0dBRUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7R0FDQSxJQUFBLElBQUEsQ0FBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxHQUFBLE9BQUEsS0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxPQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUE7O0dBRUE7OztFQUdBLFNBQUEsYUFBQSxVQUFBO0dBQ0EsR0FBQTtHQUNBLFFBQUEsU0FBQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBOzs7R0FHQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQTs7R0FFQSxhQUFBLFNBQUE7O0VBRUEsU0FBQSxhQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLElBQUE7SUFDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLElBQUEsUUFBQSxDQUFBLEVBQUE7S0FDQSxHQUFBLFVBQUEsS0FBQSxJQUFBOzs7O0VBSUEsU0FBQSxrQkFBQTtHQUNBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLFVBQUE7SUFDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7S0FDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsR0FBQTtNQUNBLGFBQUE7O1dBRUE7S0FDQSxhQUFBOzs7R0FHQSxHQUFBLFFBQUE7O0dBRUEsbUJBQUE7OztFQUdBLFNBQUEsYUFBQSxLQUFBLEdBQUE7R0FDQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7SUFDQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLFFBQUEsV0FBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7SUFDQSxNQUFBLFFBQUE7SUFDQSxNQUFBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O09BR0E7SUFDQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7WUFJQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O0tBSUE7Ozs7O0dBS0EsT0FBQTtHQUNBOzs7OztBQ3RQQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1REFBQSxTQUFBLFlBQUEsZ0JBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLGFBQUE7O0lBRUEsR0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBO01BQ0EsV0FBQTtRQUNBLGtCQUFBLFVBQUE7VUFDQSxHQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtZQUNBLGVBQUE7O1VBRUEsZUFBQSxXQUFBLGFBQUEsVUFBQSxHQUFBO1VBQ0EsZUFBQSxXQUFBLFVBQUEsVUFBQSxHQUFBOzs7O0lBSUEsU0FBQSxZQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxHQUFBLE9BQUEsQ0FBQSxFQUFBO1FBQ0EsR0FBQSxPQUFBLEtBQUE7OztJQUdBLFNBQUEsZUFBQSxJQUFBO01BQ0EsWUFBQSxJQUFBO01BQ0EsR0FBQSxJQUFBLFNBQUE7UUFDQSxRQUFBLFFBQUEsSUFBQSxVQUFBLFNBQUEsTUFBQTtVQUNBLFlBQUEsTUFBQTtVQUNBLGVBQUE7OztLQUdBO0lBQ0EsU0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxTQUFBLEtBQUEsR0FBQSxPQUFBLFNBQUEsRUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLFlBQUEsU0FBQSxJQUFBO01BQ0EsR0FBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO09BQ0EsUUFBQTs7O0tBR0EsT0FBQTs7SUFFQSxPQUFBOzs7OztBQzdDQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4RkFBQSxTQUFBLE9BQUEsUUFBQSxnQkFBQSxZQUFBLFlBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUE7R0FDQSxNQUFBO0dBQ0EsUUFBQSxVQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxpQkFBQTtLQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLE9BQUE7O1FBRUE7S0FDQSxlQUFBLFlBQUE7S0FDQSxlQUFBLFlBQUE7S0FDQSxPQUFBLEdBQUE7Ozs7O0VBS0EsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLGVBQUEsUUFBQSxhQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUE7R0FDQSxHQUFBLGFBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLGVBQUEsUUFBQSxVQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUE7R0FDQSxHQUFBLFVBQUE7Ozs7O0FDN0JBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRIQUFBLFNBQUEsT0FBQSxVQUFBLGFBQUEsT0FBQSxlQUFBLFlBQUEsT0FBQSxRQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsV0FBQSxrQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQSxHQUFBLGVBQUEsU0FBQSxTQUFBO0dBQ0EsTUFBQSxhQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBOztFQUVBLFNBQUEsU0FBQTtHQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLFFBQUE7O01BRUEsTUFBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsd0NBQUE7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxrQkFBQTtJQUNBLE1BQUEsU0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLEdBQUE7O0tBRUEsT0FBQSxRQUFBO09BQ0EsTUFBQSxTQUFBLFNBQUE7Ozs7OztJQU1BLFNBQUEsU0FBQSxhQUFBLElBQUE7TUFDQSxZQUFBO0tBQ0E7RUFDQSxTQUFBLFlBQUE7R0FDQSxXQUFBLGNBQUEsQ0FBQSxXQUFBO0dBQ0EsY0FBQSxXQUFBLFdBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtLQUNBLElBQUE7O01BRUE7O0VBRUEsV0FBQSxjQUFBO0VBQ0EsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBLE9BQUEscUJBQUEsU0FBQSxFQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLFdBQUEsRUFBQSxPQUFBLFNBQUEsU0FBQSxTQUFBLE9BQUE7S0FDQSxHQUFBLGNBQUE7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLFlBQUEsT0FBQSxTQUFBLENBQUEsYUFBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOzs7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0JBQUEsVUFBQSxXQUFBO0VBQ0EsS0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLFdBQUE7R0FDQSx5QkFBQTtHQUNBLGtCQUFBOzs7RUFHQSxLQUFBLGVBQUEsVUFBQSxNQUFBLElBQUE7R0FDQSxVQUFBLEtBQUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxRQUFBLHdCQUFBLE9BQUE7S0FDQSxHQUFBO0tBQ0EsWUFBQTs7OztJQUlBLEtBQUEsZ0JBQUEsV0FBQTtHQUNBLFVBQUEsS0FBQTs7S0FFQSxhQUFBO1NBQ0Esa0JBQUE7O0tBRUEsS0FBQSxVQUFBLFFBQUE7O09BRUEsWUFBQTs7Ozs7Ozs7O0FDNUJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1MQUFBLFNBQUEsUUFBQSxRQUFBLFlBQUEsWUFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBLG9CQUFBLE1BQUEsV0FBQSxhQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsYUFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGtCQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUEsbUJBQUE7RUFDQSxHQUFBLGtCQUFBLG1CQUFBO0VBQ0EsR0FBQSxzQkFBQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxZQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxHQUFBLFVBQUE7R0FDQSxhQUFBOzs7O0VBSUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLG1CQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBLEdBQUEsWUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsR0FBQSxnQkFBQSxLQUFBLFNBQUEsV0FBQTtJQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFVBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxjQUFBOzs7S0FHQSxhQUFBLEdBQUEsVUFBQSxNQUFBO0tBQ0E7S0FDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBOztLQUVBLElBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTtNQUNBLFdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxlQUFBOzs7TUFHQSxVQUFBLEtBQUEsR0FBQSxRQUFBO01BQ0EsWUFBQSxPQUFBLGtCQUFBLFdBQUEsS0FBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE9BQUE7Ozs7Ozs7O0VBUUEsU0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBOztHQUVBLE9BQUEsR0FBQSwwQkFBQTtJQUNBLEdBQUEsS0FBQTtJQUNBLEtBQUEsS0FBQTtJQUNBLEtBQUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxNQUFBLFNBQUEsU0FBQSxFQUFBO0tBQ0EsY0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsV0FBQSxNQUFBLEdBQUEsY0FBQSxJQUFBO0lBQ0EsR0FBQSxhQUFBO1VBQ0E7SUFDQSxHQUFBLGFBQUE7O0dBRUEsR0FBQSxlQUFBLEdBQUEsYUFBQSxrQkFBQTtHQUNBOztFQUVBLFNBQUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxXQUFBLGVBQUE7R0FDQSxnQkFBQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUEsR0FBQSxhQUFBLE9BQUEsaUJBQUE7OztFQUdBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBOztHQUVBLEdBQUE7O0dBRUEsV0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTs7O0dBR0E7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQTs7R0FFQSxJQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsR0FBQSxVQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtJQUNBLEtBQUEsV0FBQSxXQUFBLEtBQUEsR0FBQSxVQUFBOzs7R0FHQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE1BQUEsY0FBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxNQUFBLEdBQUEsS0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxRQUFBLFNBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUEsS0FBQTtHQUNBLFlBQUEsT0FBQSxXQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQTtJQUNBLGVBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxPQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFVBQUEsU0FBQSxTQUFBO0tBQ0EsUUFBQSxXQUFBOztJQUVBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLENBQUEsR0FBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLDJCQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBOzs7O0dBSUE7O0VBRUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxHQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBLEtBQUE7OztHQUdBLElBQUEsS0FBQSxTQUFBLEdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsbUNBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsV0FBQSxRQUFBLEtBQUE7Ozs7R0FJQSxPQUFBLENBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7OztHQUdBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtHQUNBOzs7RUFHQSxTQUFBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsZUFBQSxHQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsR0FBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsVUFBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLFdBQUEsTUFBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBOzs7O0dBSUEsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGFBQUEsT0FBQTs7R0FFQSxHQUFBLFNBQUEsU0FBQSxjQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUE7R0FDQSxHQUFBLE9BQUEsU0FBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLEdBQUEsSUFBQSxZQUFBO0dBQ0EsR0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUEsR0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7Ozs7RUFLQSxTQUFBLGFBQUEsT0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLEdBQUEsSUFBQSxZQUFBO0dBQ0EsR0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUEsR0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7R0FFQTs7O0VBR0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTs7O0dBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxlQUFBLFNBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxHQUFBOztHQUVBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7SUFDQSxRQUFBLFdBQUE7OztHQUdBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxhQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxPQUFBLFdBQUE7O01BRUEsSUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7O01BRUEsTUFBQSxXQUFBO09BQ0EsT0FBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztNQUdBO1lBQ0E7O01BRUEsTUFBQSxRQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7Ozs7O0dBS0EsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxZQUFBLFNBQUE7SUFDQSxNQUFBLGNBQUEsV0FBQTtLQUNBLElBQUEsUUFBQTtNQUNBLE1BQUEsUUFBQSxXQUFBO01BQ0EsVUFBQSxDQUFBLEtBQUE7TUFDQSxVQUFBOztLQUVBLE9BQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLE9BQUEsY0FBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7OztHQUdBLElBQUEsRUFBQSxLQUFBO0lBQ0EsSUFBQSxFQUFBLEtBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O0lBRUE7SUFDQSxnQkFBQSxFQUFBO0lBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQSw2QkFBQSxPQUFBLFFBQUEsUUFBQSxrQkFBQTtLQUNBLE9BQUEsR0FBQSwyQkFBQTtNQUNBLElBQUEsT0FBQSxPQUFBO01BQ0EsTUFBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEsT0FBQSwwQkFBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxJQUFBO0dBQ0EsSUFBQSxFQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxPQUFBLFdBQUE7S0FDQSxPQUFBLEdBQUEsbUNBQUE7TUFDQSxJQUFBLEVBQUE7TUFDQSxNQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTtNQUNBLFdBQUEsT0FBQSxPQUFBOztXQUVBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsSUFBQSxFQUFBO01BQ0EsTUFBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsSUFBQSxFQUFBO0tBQ0EsTUFBQSxFQUFBOzs7Ozs7O0VBT0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7OztHQVFBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7O0dBRUEsSUFBQSxNQUFBO0lBQ0EsQ0FBQSxHQUFBO0lBQ0EsQ0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsQ0FBQSxHQUFBO0tBQ0EsQ0FBQSxHQUFBOzs7R0FHQSxHQUFBLElBQUEsVUFBQSxRQUFBO0lBQ0EsU0FBQSxJQUFBO0lBQ0EsU0FBQTs7OztFQUlBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQ0EsU0FBQSxnQkFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxXQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsS0FBQSxXQUFBOzs7WUFHQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsTUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxPQUFBLE9BQUEsTUFBQSxXQUFBOzs7OztJQUtBLEdBQUEsVUFBQSxRQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUE7O0tBRUEsSUFBQSxDQUFBLEdBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxXQUFBLFFBQUE7T0FDQSxHQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO2FBQ0E7T0FDQSxPQUFBLE1BQUEsZ0NBQUEsSUFBQSxRQUFBLFdBQUE7O1lBRUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLEdBQUEsbUJBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7Ozs7Ozs7O0FDbG5CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQ0FBQSxVQUFBLE9BQUEsUUFBQTs7SUFFQSxPQUFBLFNBQUE7Ozs7QUNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5R0FBQSxVQUFBLFFBQUEsUUFBQSxTQUFBLFVBQUEsUUFBQSxlQUFBLGNBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtJQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLHNCQUFBOztFQUVBLEdBQUEsVUFBQTtJQUNBLEdBQUEsUUFBQSxJQUFBLEdBQUEsU0FBQTtFQUNBLEdBQUEsUUFBQTtHQUNBLFFBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBO0tBQ0E7R0FDQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7O0lBR0EsU0FBQSxVQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxTQUFBLE9BQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUE7TUFDQSxRQUFBOzs7T0FHQSxRQUFBLFFBQUEsSUFBQSxPQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsR0FBQSxNQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUEsS0FBQSxnQkFBQSxDQUFBLEVBQUE7UUFDQSxHQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxLQUFBOzs7SUFHQSxHQUFBLGFBQUEsR0FBQSxNQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQTtPQUNBLEdBQUEsU0FBQTtJQUNBLElBQUEsU0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFNBQUEsT0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLFNBQUEsT0FBQTtNQUNBLFFBQUE7OztPQUdBLFFBQUEsUUFBQSxJQUFBLE9BQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLEtBQUEsR0FBQSxLQUFBLGtCQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEtBQUE7OztJQUdBLEdBQUEsZUFBQSxHQUFBLE9BQUE7OztFQUdBLFNBQUEsT0FBQSxXQUFBO0dBQ0EsR0FBQSxTQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsUUFBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7R0FHQTs7RUFFQSxTQUFBLGVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxPQUFBLFNBQUEsSUFBQSxZQUFBOzs7Ozs7O0VBT0EsU0FBQSxhQUFBLEdBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7SUFDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsT0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsRUFBQTtPQUNBLEdBQUEsTUFBQSxVQUFBLElBQUE7UUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO1NBQ0EsYUFBQTs7UUFFQSxhQUFBO1FBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUE7OztNQUdBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQTs7OztHQUlBLGFBQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO01BQ0EsR0FBQTtNQUNBLGFBQUE7O0tBRUEsR0FBQTtLQUNBLGFBQUE7O0lBRUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQTs7R0FFQSxHQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsR0FBQTtJQUNBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsZUFBQTtHQUNBLEdBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO0tBQ0EsR0FBQSxTQUFBLEtBQUE7Ozs7O0VBS0EsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsU0FBQTtHQUNBLGNBQUEsYUFBQSxXQUFBOzs7RUFHQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7OztFQUdBLFNBQUEsa0JBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQSxHQUFBO0lBQ0EsUUFBQSxRQUFBLElBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtNQUNBLElBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7Ozs7Ozs7OztBQy9LQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzSEFBQSxTQUFBLFlBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxlQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsV0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQ0EsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtJQUNBLFFBQUEsUUFBQSxJQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxLQUFBLEtBQUEsV0FBQSxpQkFBQSx5QkFBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO09BQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7SUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQTtNQUNBLFNBQUE7TUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEtBQUE7TUFDQSxRQUFBLEdBQUEsS0FBQTtNQUNBLEtBQUE7O0tBRUEsSUFBQSxhQUFBO0tBQ0EsUUFBQSxRQUFBLElBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtNQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxhQUFBOzs7S0FHQSxJQUFBLENBQUEsWUFBQTtNQUNBLElBQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxXQUFBLEtBQUE7Ozs7R0FJQSxhQUFBOzs7RUFHQSxTQUFBLFdBQUE7O0dBRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLDBDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7SUFDQSxPQUFBLE1BQUEsOENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLG1EQUFBO0lBQ0EsT0FBQTs7R0FFQSxXQUFBLGlCQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO0tBQ0EsWUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLElBQUE7O0lBRUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBO01BQ0E7O0lBRUEsUUFBQSxLQUFBO0tBQ0EsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO0tBQ0EsTUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7R0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUEsS0FBQSx3QkFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUE7SUFDQSxXQUFBLGlCQUFBO0lBQ0EsUUFBQSxRQUFBLFVBQUEsU0FBQSxTQUFBLEtBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxnQkFBQTtPQUNBLElBQUEsUUFBQSxLQUFBLFNBQUEsR0FBQTtRQUNBLElBQUEsV0FBQTtTQUNBLE9BQUE7U0FDQSxTQUFBLFFBQUE7O1FBRUEsYUFBQSxZQUFBO2NBQ0EsR0FBQSxRQUFBLEtBQUEsVUFBQSxFQUFBO1FBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQSxhQUFBO1NBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsYUFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBO1NBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7V0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsR0FBQSxXQUFBLE9BQUEsR0FBQTtZQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7a0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQSxXQUFBO2FBQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTthQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OztlQU1BOztTQUVBLElBQUEsUUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQSxHQUFBLEtBQUE7O1NBRUEsSUFBQSxhQUFBO1NBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxRQUFBLElBQUE7VUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1dBQ0EsYUFBQTs7O1NBR0EsSUFBQSxDQUFBLFlBQUE7VUFDQSxhQUFBLFlBQUE7VUFDQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztJQU9BLEdBQUEsY0FBQTtJQUNBLGFBQUE7SUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO0tBQ0EsY0FBQSxhQUFBOztNQUVBLFNBQUEsVUFBQTtJQUNBLFdBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUEsc0NBQUEsU0FBQSxLQUFBOzs7O0VBSUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsYUFBQTtHQUNBLElBQUEsYUFBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBO0lBQ0EsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7S0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtNQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7S0FFQSxXQUFBLEtBQUEsS0FBQSxLQUFBO1dBQ0E7S0FDQSxPQUFBLE1BQUEsK0JBQUE7S0FDQTs7O0dBR0EsWUFBQSxLQUFBLGlCQUFBLEdBQUEsVUFBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxNQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBLGFBQUE7S0FDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDMU5BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNFQUFBLFVBQUEsUUFBQSxjQUFBLGFBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsV0FBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBOzs7O0dBSUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsYUFBQTtLQUNBLE1BQUE7O0lBRUEsSUFBQSxVQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsU0FBQTtJQUNBLEdBQUEsVUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtPQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O09BRUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO1FBQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7T0FHQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7T0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztVQUVBO09BQ0EsUUFBQSxLQUFBOzs7O1lBSUE7TUFDQSxPQUFBLE1BQUEsK0JBQUE7TUFDQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO01BQ0EsSUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUE7T0FDQSxVQUFBO09BQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7T0FDQSxZQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztNQUVBLElBQUEsYUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxJQUFBOztNQUVBLE1BQUEsYUFBQTtNQUNBLE9BQUEsS0FBQTs7O0lBR0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO0tBQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7OztJQUdBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtLQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUE7T0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBO09BQ0EsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBO09BQ0EsR0FBQSxPQUFBOztNQUVBLEdBQUEsVUFBQTs7T0FFQSxVQUFBLFVBQUE7S0FDQSxJQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztLQUdBLEdBQUEsVUFBQTs7Ozs7Ozs7QUN2R0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBOzs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlIQUFBLFNBQUEsUUFBQSxRQUFBLG1CQUFBLFNBQUEsYUFBQSxhQUFBLE9BQUE7OztRQUdBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLG1CQUFBLGFBQUE7O1FBRUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7OztRQUdBLFNBQUEsV0FBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUE7WUFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtVQUNBLEdBQUEsTUFBQSxFQUFBO1VBQ0EsR0FBQSxZQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxHQUFBLFVBQUEsTUFBQTtZQUNBLG1CQUFBLGFBQUEsR0FBQSxVQUFBLE1BQUE7O1VBRUE7WUFDQSxhQUFBOzs7UUFHQSxPQUFBLE9BQUEsZ0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQTtVQUNBLEdBQUEsT0FBQSxFQUFBLFlBQUEsYUFBQTtZQUNBLEdBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQTtjQUNBLEdBQUEsRUFBQSxNQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxNQUFBOztrQkFFQTtrQkFDQSxtQkFBQSxhQUFBOztjQUVBOzs7Y0FHQTtZQUNBLEdBQUEsT0FBQSxFQUFBLGNBQUEsWUFBQTtjQUNBLEdBQUEsRUFBQSxXQUFBLE9BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLFdBQUEsR0FBQSxNQUFBOztrQkFFQTtnQkFDQSxtQkFBQSxhQUFBOzs7WUFHQTs7VUFFQSxhQUFBLHVCQUFBO1VBQ0EsYUFBQTtVQUNBOzs7UUFHQSxTQUFBLFFBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBLGNBQUEsR0FBQTtjQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQSxjQUFBLEdBQUE7O1VBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztRQUVBLFNBQUEsY0FBQSxJQUFBO1VBQ0EsSUFBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTthQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxjQUFBLElBQUE7ZUFDQSxRQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUE7OztVQUdBLE9BQUE7O1FBRUEsU0FBQSxlQUFBLFNBQUE7T0FDQSxJQUFBLFFBQUE7T0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO09BQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQTtPQUNBLElBQUEsT0FBQSxRQUFBOztPQUVBLFFBQUE7T0FDQSxLQUFBOztTQUVBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO1NBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO2NBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUEsVUFBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOztTQUVBLE1BQUEsV0FBQTtVQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1VBQ0EsU0FBQTtXQUNBLE9BQUE7V0FDQSxNQUFBOzs7U0FHQTs7OztPQUlBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsVUFBQSxTQUFBO1FBQ0EsTUFBQSxjQUFBLFlBQUE7U0FDQSxJQUFBLFFBQUE7VUFDQSxNQUFBLFFBQUEsV0FBQTtVQUNBLFVBQUEsQ0FBQSxLQUFBO1VBQ0EsVUFBQTs7U0FFQSxPQUFBOzs7T0FHQSxPQUFBOztRQUVBLFNBQUEsY0FBQTtVQUNBLEdBQUEsVUFBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOztRQUVBLFNBQUEsZ0JBQUE7VUFDQTtPQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsU0FBQSxZQUFBO1VBQ0E7Ozs7Ozs7O0FDM0lBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9HQUFBLFNBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQSxlQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsV0FBQTtNQUNBLEdBQUEsV0FBQTs7O01BR0EsU0FBQSxpQkFBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLFlBQUE7VUFDQSxhQUFBLGFBQUEsSUFBQTtZQUNBLFlBQUE7WUFDQSxNQUFBOzs7UUFHQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQSxhQUFBO1FBQ0EsYUFBQTs7TUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGFBQUEsT0FBQTtLQUNBLElBQUEsS0FBQSxTQUFBLEtBQUEsUUFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztLQUVBLE9BQUE7O0lBRUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxlQUFBLE9BQUEsS0FBQSxjQUFBLGFBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxTQUFBLEtBQUEsV0FBQSxTQUFBLE9BQUE7O01BRUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLFVBQUE7VUFDQSxHQUFBLFVBQUEsV0FBQTtZQUNBOzs7O1FBSUEsR0FBQSxRQUFBLE9BQUEsS0FBQSxHQUFBLFlBQUEsT0FBQTtVQUNBLE9BQUE7O1FBRUEsT0FBQTs7TUFFQSxTQUFBLFdBQUE7O1VBRUEsR0FBQSxDQUFBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBLEtBQUE7WUFDQSxjQUFBLGFBQUEsV0FBQTtZQUNBLE9BQUE7O01BRUEsSUFBQSxhQUFBO09BQ0EsTUFBQTs7TUFFQSxJQUFBLFVBQUE7TUFDQSxJQUFBLGFBQUE7T0FDQSxTQUFBO01BQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7U0FFQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7VUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztTQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O1lBRUE7Z0JBQ0EsR0FBQSxHQUFBLEtBQUEsS0FBQTtrQkFDQSxLQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUE7a0JBQ0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO1dBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7b0JBRUE7bUJBQ0EsUUFBQSxLQUFBOzs7Ozs7O2NBT0E7UUFDQSxPQUFBLE1BQUEsK0JBQUE7UUFDQTs7O01BR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO1FBQ0EsSUFBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtTQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7UUFFQSxJQUFBLFFBQUE7U0FDQSxVQUFBO1NBQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtTQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7U0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7U0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7U0FDQSxZQUFBO1NBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztRQUVBLElBQUEsYUFBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtTQUNBLFdBQUEsS0FBQSxJQUFBOztRQUVBLE1BQUEsYUFBQTtRQUNBLE9BQUEsS0FBQTs7O01BR0EsR0FBQSxLQUFBLFNBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBOzs7TUFHQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsaUJBQUEsU0FBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsT0FBQSxNQUFBO1NBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO1NBQ0EsYUFBQTtTQUNBLE9BQUEsR0FBQTtTQUNBLEdBQUEsT0FBQTtTQUNBLEdBQUEsT0FBQTs7UUFFQSxHQUFBLFVBQUE7O1NBRUEsVUFBQSxVQUFBO09BQ0EsSUFBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7T0FHQSxHQUFBLFVBQUE7Ozs7TUFJQSxTQUFBLGNBQUE7Ozs7Ozs7Ozs7S0FVQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLEdBQUEsTUFBQSxFQUFBO1FBQ0EsR0FBQSxXQUFBLEVBQUEsZUFBQTtRQUNBO01BQ0EsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxLQUFBLE1BQUE7UUFDQSxHQUFBLENBQUEsR0FBQSxrQkFBQTtVQUNBLEdBQUEsY0FBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxhQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFVBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsZ0JBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsWUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxXQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7O1VBRUEsY0FBQSxhQUFBLGdCQUFBO2VBQ0E7Ozs7Ozs7Ozs7O0FDektBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBLEdBQUEsT0FBQTs7TUFFQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxZQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7VUFDQSxHQUFBLE9BQUE7WUFDQTs7OztNQUlBLFNBQUEsYUFBQTtRQUNBLFFBQUEsSUFBQSxHQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7QUNwQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUdBQUEsVUFBQSxRQUFBLFVBQUEsWUFBQSxZQUFBLGdCQUFBO0lBQ0EsSUFBQSxLQUFBO0lBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUEsU0FBQSxLQUFBO0lBQ0EsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQSxLQUFBOzs7Ozs7QUNWQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwySkFBQSxVQUFBLFFBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLGdCQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsYUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsa0JBQUE7O0VBRUEsR0FBQSxTQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxZQUFBO0dBQ0EsUUFBQTtHQUNBLFdBQUE7R0FDQSxPQUFBO0dBQ0EsV0FBQTs7OztFQUlBLEdBQUEsVUFBQTtHQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxVQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBLFNBQUEsSUFBQSxLQUFBO0tBQ0EsT0FBQSxHQUFBLGlDQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7O0lBRUEsU0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLGlDQUFBLENBQUEsR0FBQSxHQUFBLE1BQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBOztPQUVBLEdBQUEsVUFBQSxVQUFBOzs7Ozs7R0FNQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUEsVUFBQTtLQUNBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUE7O0lBRUEsV0FBQSxTQUFBLElBQUEsS0FBQTs7S0FFQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBOztJQUVBLFlBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsV0FBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsZUFBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsR0FBQTs7T0FFQSxHQUFBLFVBQUEsYUFBQTs7Ozs7OztHQU9BLE9BQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7Ozs7O0VBS0EsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7TUFDQSxPQUFBLEdBQUE7S0FDQTtJQUNBLEtBQUE7TUFDQSxPQUFBLEdBQUE7S0FDQTtJQUNBLEtBQUE7TUFDQSxHQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsWUFBQTtRQUNBLE9BQUEsR0FBQSxnQ0FBQTtTQUNBLEdBQUEsT0FBQSxPQUFBOzs7VUFHQTtRQUNBLE9BQUEsR0FBQTs7S0FFQTtJQUNBLEtBQUE7O0tBRUE7SUFDQTs7Ozs7RUFLQSxPQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFdBQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxNQUFBLFlBQUE7SUFDQSxHQUFBLFNBQUE7O09BRUE7SUFDQSxHQUFBLFNBQUEsU0FBQTs7R0FFQSxHQUFBLFFBQUEsS0FBQSxRQUFBLGtDQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7O1FBR0EsR0FBQSxRQUFBLEtBQUEsUUFBQSxrQ0FBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLGNBQUE7O1FBRUEsR0FBQSxRQUFBLEtBQUEsUUFBQSwrQkFBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLGNBQUE7Ozs7Ozs7QUMzSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUlBQUEsVUFBQSxRQUFBLE9BQUEsVUFBQSxvQkFBQSxhQUFBLGdCQUFBLFdBQUE7O0VBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0E7O0VBRUEsZUFBQSxpQkFBQSxPQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLElBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFVBQUEsU0FBQSxZQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxZQUFBLFNBQUEsSUFBQTtLQUNBLEdBQUEsT0FBQSxJQUFBLFNBQUEsWUFBQTtNQUNBLGFBQUEsSUFBQSxNQUFBOzs7O1FBSUEsR0FBQSxHQUFBLFVBQUEsTUFBQTtJQUNBLGFBQUEsR0FBQSxVQUFBLE1BQUE7O0dBRUEsbUJBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxxQ0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLFNBQUEsY0FBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxRQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsYUFBQTtLQUNBLEdBQUEsV0FBQTs7UUFFQTtLQUNBLEdBQUEsV0FBQTs7OztFQUlBLFNBQUEsUUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTs7R0FFQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O0VBRUEsU0FBQSxjQUFBLElBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxLQUFBLE9BQUEsSUFBQTtNQUNBLFFBQUEsS0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTs7R0FFQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0E7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtNQUNBLEdBQUEsVUFBQSxTQUFBOzs7Ozs7RUFNQSxPQUFBLElBQUEsdUJBQUEsVUFBQTtHQUNBOzs7Ozs7O0FDM0dBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVFQUFBLFVBQUEsWUFBQSxZQUFBLGdCQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsYUFBQTs7Ozs7O0FDTkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkhBQUEsVUFBQSxRQUFBLE9BQUEsVUFBQSxvQkFBQSxhQUFBLGdCQUFBLE9BQUE7O0VBRUEsSUFBQSxLQUFBOztJQUVBLEdBQUEsUUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBO0lBQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQTtRQUNBLFVBQUEsVUFBQTtVQUNBLE9BQUEsR0FBQTs7SUFFQSxrQkFBQSxVQUFBO0tBQ0EsSUFBQSxPQUFBO01BQ0EsT0FBQTs7S0FFQSxHQUFBLE1BQUEsU0FBQSxLQUFBOztJQUVBLFlBQUEsVUFBQTtLQUNBLFFBQUEsSUFBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLFNBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsV0FBQSxLQUFBLEdBQUEsTUFBQTtPQUNBLEdBQUEsV0FBQTs7OztJQUlBLFlBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtNQUNBLFdBQUEsS0FBQSxHQUFBLE1BQUE7TUFDQSxHQUFBLFlBQUE7Ozs7TUFJQSxVQUFBOzs7RUFHQTs7O0VBR0EsU0FBQSxRQUFBOzs7RUFHQSxTQUFBLFdBQUEsTUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7SUFDQSxHQUFBLE1BQUEsTUFBQSxLQUFBLEdBQUE7S0FDQSxLQUFBLE9BQUEsS0FBQTtLQUNBLE9BQUE7O0lBRUEsR0FBQSxNQUFBLFNBQUE7S0FDQSxJQUFBLFlBQUEsV0FBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxPQUFBOzs7O0dBSUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQkEsU0FBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJBLFNBQUEsUUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTs7R0FFQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O0VBRUEsU0FBQSxjQUFBLElBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxLQUFBLE9BQUEsSUFBQTtNQUNBLFFBQUEsS0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTs7R0FFQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0E7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtNQUNBLEdBQUEsVUFBQSxTQUFBOzs7Ozs7RUFNQSxPQUFBLElBQUEsdUJBQUEsVUFBQTtHQUNBOzs7Ozs7O0FDL0pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtLQUFBLFNBQUEsUUFBQSxjQUFBLGFBQUEsU0FBQSxRQUFBLFNBQUEsYUFBQSxRQUFBLGFBQUEsY0FBQSxtQkFBQTs7Ozs7Ozs7Ozs7Ozs7O1FBZUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsa0JBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHNCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEsdUJBQUE7UUFDQSxHQUFBLHlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQTs7UUFFQSxHQUFBLFFBQUEsYUFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsY0FBQTtVQUNBLE1BQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1CQTs7UUFFQSxTQUFBLFVBQUE7O1VBRUEsYUFBQTs7UUFFQSxTQUFBLFVBQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxXQUFBOztRQUVBLFNBQUEsZ0JBQUEsUUFBQTtTQUNBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztTQUdBLE9BQUE7O1FBRUEsU0FBQSxVQUFBO1dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7Y0FDQSxHQUFBLFlBQUEsbUJBQUE7Y0FDQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztRQU1BLFNBQUEscUJBQUE7VUFDQSxHQUFBLGdCQUFBLENBQUEsR0FBQTtVQUNBLEdBQUEsR0FBQSxjQUFBO1lBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsVUFBQTtZQUNBLFlBQUEsT0FBQSxlQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxZQUFBO2NBQ0EsR0FBQSxvQkFBQSxJQUFBLEdBQUEsa0JBQUE7Ozs7O1FBS0EsU0FBQSxpQkFBQSxTQUFBO1VBQ0EsT0FBQSxHQUFBLGtCQUFBLFFBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTs7UUFFQSxTQUFBLGdCQUFBLFVBQUEsS0FBQTtVQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsTUFBQSxJQUFBOztnQkFFQSxHQUFBLFFBQUEsU0FBQTtrQkFDQSxLQUFBLE9BQUEsS0FBQTtrQkFDQSxHQUFBLGlCQUFBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLE9BQUE7a0JBQ0EsR0FBQSxrQkFBQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxNQUFBOzs7Y0FHQSxnQkFBQSxVQUFBLEtBQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsa0JBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGtCQUFBLE9BQUEsS0FBQTtZQUNBLGdCQUFBLFVBQUEsR0FBQTs7Y0FFQTtZQUNBLEdBQUEsa0JBQUEsS0FBQTtZQUNBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO2NBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7Z0JBRUE7Z0JBQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7OztRQU1BLFNBQUEsZUFBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxNQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQTtZQUNBLGVBQUEsTUFBQTs7O1FBR0EsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLHFCQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsaUJBQUEsT0FBQSxLQUFBOztjQUVBO1lBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7UUFHQSxTQUFBLHVCQUFBLEtBQUE7VUFDQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxRQUFBLENBQUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7VUFHQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtZQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2VBRUEsR0FBQSxHQUFBLGlCQUFBLFNBQUEsR0FBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO2tCQUNBLFNBQUEsTUFBQSxLQUFBO2tCQUNBLGdCQUFBLE1BQUEsR0FBQTs7Y0FFQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEdBQUEsbUJBQUE7O2NBRUE7WUFDQSxHQUFBLE9BQUEsS0FBQTs7O1FBR0EsU0FBQSxnQkFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFNBQUEsTUFBQSxLQUFBOztVQUVBLEdBQUEsT0FBQSxLQUFBO1VBQ0EsR0FBQSxtQkFBQTs7UUFFQSxTQUFBLFVBQUEsS0FBQTtVQUNBLEdBQUEsV0FBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQSxLQUFBO1lBQ0EsZ0JBQUEsTUFBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxHQUFBLEdBQUEsYUFBQTtZQUNBOztVQUVBLEdBQUEsZUFBQTtVQUNBLEdBQUEsT0FBQSxHQUFBLFlBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLFFBQUEsK0JBQUE7WUFDQSxPQUFBLEdBQUEsa0JBQUEsQ0FBQSxNQUFBLFNBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RQQSxDQUFBLFVBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsZUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxlQUFBOzs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUlBQUEsU0FBQSxRQUFBLFNBQUEsVUFBQSxXQUFBLFdBQUEsZ0JBQUEsb0JBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUEsTUFBQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLE9BQUEsTUFBQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFFBQUE7R0FDQSxLQUFBLENBQUE7R0FDQSxLQUFBOztFQUVBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7R0FDQSxtQkFBQSxTQUFBO0dBQ0EsbUJBQUEsYUFBQTtHQUNBLFNBQUEsV0FBQTs7OztJQUlBLElBQUEsT0FBQSxPQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsVUFBQSxNQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsR0FBQSxVQUFBLE1BQUEsR0FBQSxRQUFBLE9BQUEsT0FBQSxNQUFBO09BQ0EsR0FBQSxTQUFBOzs7V0FHQSxJQUFBLENBQUEsR0FBQSxRQUFBO0tBQ0EsR0FBQSxTQUFBOzs7SUFHQSxJQUFBLEdBQUEsVUFBQSxRQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxPQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEtBQUE7T0FDQSxJQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUEsUUFBQTtRQUNBLEdBQUEsZUFBQTs7O1lBR0EsSUFBQSxDQUFBLEdBQUEsY0FBQTtNQUNBLEdBQUEsZUFBQTs7V0FFQSxJQUFBLENBQUEsR0FBQSxjQUFBO0tBQ0EsR0FBQSxlQUFBOztJQUVBLFFBQUEsR0FBQSxNQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxHQUFBLFFBQUE7SUFDQSxLQUFBLENBQUE7SUFDQSxLQUFBOzs7O0VBSUEsU0FBQSxjQUFBOztHQUVBLElBQUEsT0FBQSxRQUFBLFFBQUEsdUJBQUE7SUFDQSxPQUFBLEdBQUE7VUFDQTtJQUNBLE9BQUEsR0FBQTs7Ozs7RUFLQSxTQUFBLFFBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxXQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7OztHQUdBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7RUFFQSxTQUFBLFdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxxQkFBQTtHQUNBLE9BQUEsR0FBQSx1QkFBQTtJQUNBLEtBQUEsR0FBQSxRQUFBOztHQUVBLFNBQUEsVUFBQTtLQUNBOzs7R0FHQTs7RUFFQSxTQUFBLGFBQUEsS0FBQSxHQUFBO0dBQ0EsSUFBQSxJQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFNBQUEsYUFBQTtJQUNBLEdBQUEsVUFBQTtJQUNBO1VBQ0E7SUFDQSxPQUFBLE1BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxlQUFBLG9CQUFBLEdBQUEsVUFBQSxJQUFBLEdBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsY0FBQTs7OztFQUlBLFNBQUEsUUFBQSxNQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0EsU0FBQSxXQUFBO0lBQ0EsT0FBQSxHQUFBLHVCQUFBO0tBQ0EsTUFBQTs7TUFFQTs7OztFQUlBLFNBQUEsVUFBQSxRQUFBO0dBQ0EsR0FBQSxTQUFBLFVBQUE7R0FDQSxTQUFBLFdBQUE7SUFDQSxPQUFBLEdBQUEsdUJBQUE7S0FDQSxRQUFBLEdBQUE7O01BRUE7OztFQUdBLFNBQUEsUUFBQSxNQUFBLFFBQUE7R0FDQSxlQUFBLGlCQUFBLEdBQUEsVUFBQSxJQUFBLEdBQUEsTUFBQSxHQUFBLFFBQUEsS0FBQSxTQUFBLEtBQUE7SUFDQTtJQUNBLEdBQUEsT0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsT0FBQSxPQUFBLEtBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxLQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsR0FBQSxLQUFBLEdBQUEsT0FBQSxPQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxHQUFBLEtBQUE7T0FDQSxNQUFBLEdBQUEsUUFBQTs7Ozs7SUFLQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtLQUNBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxHQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtPQUNBLFdBQUE7OztLQUdBLEdBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTtLQUNBLEdBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTs7O0lBR0EsR0FBQSxnQkFBQTtLQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUEsY0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBLEdBQUEsS0FBQTs7O0lBR0E7SUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLE9BQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxJQUFBLEdBQUEsU0FBQTtJQUNBLElBQUEsR0FBQSxRQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUEsV0FBQTs7Ozs7O0dBTUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLE1BQUE7O01BRUEsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztLQUlBOztHQUVBLE9BQUE7R0FDQTs7O0VBR0EsR0FBQSxvQkFBQSxTQUFBLGVBQUEsY0FBQTs7R0FFQSxRQUFBLEdBQUEsTUFBQSxHQUFBOzs7Ozs7QUM1T0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsVUFBQSxTQUFBLE1BQUE7O0VBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEscUJBQUE7O0lBRUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsUUFBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7R0FHQTs7Ozs7O0FDakJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlEQUFBLFNBQUEsWUFBQSxRQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsZ0JBQUE7O1FBRUEsR0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTs7VUFFQSxHQUFBLE1BQUEsa0JBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7VUFDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQSxhQUFBLE1BQUEsUUFBQSxZQUFBLFdBQUEsYUFBQTthQUNBLE1BQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7Ozs7O0FDaENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0VBQUEsU0FBQSxRQUFBLGFBQUEsa0JBQUEsb0JBQUE7OztFQUdBLElBQUEsT0FBQTtHQUNBLFVBQUE7RUFDQSxJQUFBLE9BQUEsYUFBQSxLQUFBO0dBQ0EsT0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFNBQUEsbUJBQUEsS0FBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsV0FBQTs7R0FFQSxTQUFBO0dBQ0EsU0FBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsWUFBQTtJQUNBLEtBQUE7S0FDQSxNQUFBO0tBQ0EsS0FBQSxzRkFBQTtLQUNBLE1BQUE7S0FDQSxjQUFBO01BQ0EsUUFBQTtNQUNBLGlCQUFBO01BQ0EsY0FBQTs7Ozs7RUFLQSxHQUFBLGNBQUEsRUFBQSxVQUFBLG1GQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsaUJBQUE7R0FDQSxNQUFBO0dBQ0EsY0FBQTs7RUFFQSxHQUFBLFlBQUE7R0FDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7O0dBRUEsV0FBQTtJQUNBLEtBQUEsQ0FBQTtJQUNBLEtBQUEsQ0FBQTs7O0VBR0EsR0FBQSxXQUFBO0dBQ0EsUUFBQTs7RUFFQSxHQUFBLGVBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7Ozs7RUFJQSxJQUFBLFlBQUEsRUFBQTtFQUNBLFVBQUEsWUFBQTtFQUNBLFVBQUEsYUFBQSxXQUFBO0dBQ0EsRUFBQSxLQUFBLFdBQUEsTUFBQTs7RUFFQSxVQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsWUFBQSxFQUFBLFFBQUEsT0FBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsUUFBQSxPQUFBLEtBQUEsa0NBQUE7R0FDQSxLQUFBLGNBQUE7R0FDQSxLQUFBLFFBQUE7R0FDQSxFQUFBLFNBQUEsd0JBQUE7R0FDQSxFQUFBLFNBQUEsWUFBQSxXQUFBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLFNBQUE7TUFDQSxJQUFBLFlBQUEsR0FBQTtNQUNBLEdBQUEsVUFBQTtZQUNBO01BQ0EsSUFBQSxTQUFBLEdBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUE7Ozs7R0FJQSxPQUFBOztFQUVBLElBQUEsV0FBQSxFQUFBO0VBQ0EsU0FBQSxZQUFBO0VBQ0EsU0FBQSxhQUFBLFdBQUE7R0FDQSxFQUFBLEtBQUEsV0FBQSxNQUFBOztFQUVBLFNBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxZQUFBLEVBQUEsUUFBQSxPQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxRQUFBLE9BQUEsS0FBQSxrQ0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFFBQUEsT0FBQSxXQUFBLDZCQUFBO0dBQ0EsS0FBQSxRQUFBO0dBQ0EsS0FBQSxjQUFBO0dBQ0EsRUFBQSxTQUFBLHdCQUFBO0dBQ0EsRUFBQSxTQUFBLFlBQUEsV0FBQSxTQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLElBQUEsUUFBQSxDQUFBLFdBQUEsWUFBQTs7O0dBR0EsT0FBQTs7OztFQUlBLFNBQUEsYUFBQSxhQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLEdBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxHQUFBO0tBQ0EsR0FBQSxVQUFBO1dBQ0E7S0FDQSxJQUFBLFNBQUEsR0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLEdBQUEsVUFBQTs7Ozs7RUFLQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLG1CQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEscUVBQUEsbUJBQUEsWUFBQSwrQ0FBQSxtQkFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxhQUFBO0lBQ0EsaUJBQUEsQ0FBQSxtQkFBQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBLFNBQUEsU0FBQTtLQUNBLE9BQUEsUUFBQSxXQUFBOztJQUVBLFFBQUEsU0FBQSxTQUFBLFNBQUE7O0tBRUEsT0FBQTs7SUFFQSxPQUFBLFNBQUEsU0FBQTtLQUNBLElBQUEsUUFBQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE9BQUE7Ozs7R0FJQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsV0FBQTtHQUNBLElBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4SkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEVBQUEsU0FBQSxRQUFBLFlBQUEsb0JBQUEsUUFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsSUFBQTs7O1VBR0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO1VBQ0EsR0FBQSxnQkFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztRQUdBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQSxLQUFBOztRQUVBLFNBQUEsWUFBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQTs7TUFFQSxTQUFBLGNBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO09BQ0E7O1FBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQTtZQUNBOzs7WUFHQSxHQUFBLEVBQUEsSUFBQTtjQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O1lBRUE7WUFDQSxnQkFBQSxFQUFBOzs7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4REFBQSxTQUFBLFFBQUEsZUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxhQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxPQUFBLFVBQUE7O1lBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsY0FBQSxLQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQTtjQUNBLGNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDbkJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLGNBQUE7O01BRUEsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFVBQUE7O1VBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLGNBQUE7Ozs7O01BS0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxjQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLFFBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbURBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnREFBQSxTQUFBLFFBQUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnRUFBQSxVQUFBLFFBQUEsY0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsbUJBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsVUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsV0FBQTtFQUNBLE9BQUEsT0FBQSxZQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLGFBQUE7TUFDQSxhQUFBLGFBQUEsS0FBQTtPQUNBLGFBQUE7T0FDQSxPQUFBOzs7S0FHQSxJQUFBLE9BQUEsYUFBQSxhQUFBO0tBQ0EsSUFBQSxPQUFBLFFBQUEsR0FBQSxhQUFBO01BQ0EsS0FBQSxlQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtNQUNBLEtBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLGNBQUE7TUFDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsS0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7TUFFQSxJQUFBLE9BQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7T0FDQSxLQUFBLFdBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7Ozs7O0dBTUEsY0FBQTtHQUNBLGFBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsWUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtHQUNBLGNBQUE7Ozs7Ozs7QUNwREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsUUFBQTs7WUFFQTtVQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1VBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFlBQUE7WUFDQSxPQUFBLGNBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGNBQUEsT0FBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0RBQUEsU0FBQSxPQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1dBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLEdBQUE7WUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUVBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxNQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7O0VBR0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTtPQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTthQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0tBSUEsR0FBQSxLQUFBLE9BQUEsS0FBQTs7O0dBR0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsY0FBQTs7S0FFQTs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMEJBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxVQUFBO2dCQUNBLFNBQUEsR0FBQTtlQUNBOzs7Ozs7OztBQ1RBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxNQUFBLE1BQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG9CQUFBLEdBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsb0JBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7S0FDQSxvQkFBQSxLQUFBOzs7O0VBSUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsV0FBQSxVQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsT0FBQSxNQUFBLGlDQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLFNBQUE7R0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBLFNBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUEsS0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxVQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLE1BQUEsWUFBQSxDQUFBLE1BQUE7S0FDQSxJQUFBLFlBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0dBSUEsT0FBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtPQUNBLFVBQUEsU0FBQSxPQUFBLEVBQUE7Ozs7T0FJQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxXQUFBLE9BQUEsRUFBQTs7OztHQUlBLEdBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxJQUFBLFlBQUEsVUFBQSxHQUFBLE1BQUEsR0FBQTtJQUNBLFVBQUEsU0FBQSxLQUFBLEdBQUE7OztPQUdBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBLEtBQUE7R0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsYUFBQSxHQUFBLEtBQUEsVUFBQTs7S0FFQTs7O0dBR0EsT0FBQSxRQUFBLDZCQUFBO0dBQ0EsT0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQTs7U0FFQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBOzs7O1FBSUE7S0FDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLEtBQUEsV0FBQTtTQUNBLElBQUEsU0FBQSxVQUFBLE1BQUEsR0FBQTtTQUNBLEdBQUEsQ0FBQSxPQUFBLFNBQUE7VUFDQSxPQUFBLFdBQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQSxPQUFBLFdBQUE7O1VBRUE7T0FDQSxHQUFBLFdBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUEsK0JBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7OztBQ25JQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxLQUFBLElBQUEsSUFBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7T0FDQSxPQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxNQUFBLGFBQUEsVUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUE7TUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO1FBQ0EsU0FBQTtRQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBOztLQUVBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsY0FBQTtPQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7O1VBR0E7T0FDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsSUFBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7OztJQU9BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBO0tBQ0EsU0FBQSxZQUFBO09BQ0EsVUFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBOztNQUVBOzs7Ozs7OztBQ2xKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsa0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsSUFBQTtHQUNBLEdBQUEsR0FBQSxlQUFBLElBQUE7SUFDQSxHQUFBLGNBQUE7O09BRUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsR0FBQSxZQUFBOztPQUVBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7OztFQUdBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUE7O0dBRUEsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQTtPQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUEsV0FBQSxRQUFBLE1BQUE7OztJQUdBLEdBQUEsWUFBQTs7Ozs7Ozs7Ozs7OztBQ3hGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7O0VBRUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsS0FBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLE9BQUEsZUFBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0dBQ0EsT0FBQSxlQUFBLEdBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsOEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsV0FBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBOzs7O09BSUE7SUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsNEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsUUFBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsU0FBQSxJQUFBLEtBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsWUFBQSxPQUFBLEtBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDekZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsQ0FBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxNQUFBO0tBQ0EsTUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxRQUFBLE9BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7O0lBR0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxLQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOzs7O0lBSUEsSUFBQSxVQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBOztJQUVBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOzs7SUFHQSxJQUFBLFNBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBO0lBQ0EsSUFBQSxrQkFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBO0lBQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLFVBQUEsT0FBQSxPQUFBO0lBQ0EsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBO0lBQ0EsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsVUFBQSxJQUFBLE9BQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBLGFBQUEsR0FBQSxHQUFBLFFBQUEsT0FBQSxRQUFBLFFBQUEsUUFBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7O0tBRUEsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxTQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLFdBQUE7O09BRUEsSUFBQSxNQUFBLE1BQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFFBQUE7O09BRUEsT0FBQTs7T0FFQSxNQUFBLGFBQUEsUUFBQSxTQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7T0FDQSxLQUFBLE1BQUEsUUFBQTtPQUNBLEtBQUEsb0JBQUE7T0FDQSxLQUFBLGdCQUFBO09BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7TUFDQSxHQUFBLGFBQUEsVUFBQTtPQUNBLGdCQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsZ0JBQUE7OztNQUdBLEdBQUEsWUFBQSxVQUFBO01BQ0EsZ0JBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxnQkFBQTs7O0lBR0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLE1BQUEsVUFBQTtNQUNBLEtBQUEsTUFBQSxDQUFBLFFBQUEsU0FBQSxLQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsUUFBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxTQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7OztJQUtBLFNBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtLQUNBLElBQUE7S0FDQSxTQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUE7S0FDQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQTtZQUNBO01BQ0EsVUFBQSxNQUFBLENBQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUE7S0FDQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxTQUFBLE1BQUE7TUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFFBQUE7WUFDQTtNQUNBLE9BQUEsU0FBQTs7OztJQUlBLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7S0FFQSxZQUFBLEtBQUEsU0FBQTtLQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTs7S0FFQSxJQUFBLFFBQUEsTUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtNQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7T0FDQSxRQUFBO09BQ0EsUUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF1QkEsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUEsTUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLE1BQUEsRUFBQSxRQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLElBQUEsUUFBQSxhQUFBO01BQ0EsWUFBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLEVBQUE7TUFDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtZQUNBO01BQ0EsWUFBQSxLQUFBOzs7SUFHQSxPQUFBO0tBQ0EsV0FBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxTQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsQ0FBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0E7OztPQUdBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtPQUNBLElBQUEsWUFBQSxVQUFBO1FBQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Y0FDQTtRQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7O0lBTUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBOztLQUVBLE1BQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtNQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtNQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxJQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7OztLQUtBLElBQUEsR0FBQSxNQUFBO09BQ0EsT0FBQSxDQUFBLEtBQUE7T0FDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtPQUNBLE1BQUE7S0FDQSxNQUFBLEVBQUE7T0FDQSxPQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsU0FBQTtPQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUEsT0FBQSxlQUFBLEtBQUE7S0FDQSxRQUFBLE9BQUEsZUFBQSxLQUFBLFdBQUE7O01BRUEsSUFBQSxNQUFBLE1BQUE7T0FDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtPQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFFBQUE7O01BRUEsT0FBQTs7S0FFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLElBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7OztBQ3pXQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLHFEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxNQUFBLFVBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxVQUFBLElBQUEsS0FBQSxHQUFBLFVBQUEsTUFBQSxXQUFBLElBQUEsU0FBQTtRQUNBO1lBQ0EsT0FBQSxFQUFBOztRQUVBLElBQUEsS0FBQSxHQUFBLFNBQUE7UUFDQSxNQUFBLE9BQUEsUUFBQTtRQUNBLE1BQUEsUUFBQSxLQUFBLElBQUEsS0FBQTs7O09BR0EsU0FBQSxVQUFBO1FBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7QUMvREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsd0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMkRBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBO0NBQ0EsTUFBQSxTQUFBO0tBQ0EsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBLEtBQUEsR0FBQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBOzs7UUFHQSxHQUFBLElBQUEsT0FBQSxVQUFBLEVBQUE7U0FDQSxNQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUE7O1lBRUE7U0FDQSxRQUFBLElBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDeEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLDhCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDZEQUFBLFVBQUEsUUFBQSxVQUFBLFFBQUEsY0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7S0FFQSxTQUFBO0tBQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7S0FDQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFNBQUEsWUFBQTtNQUNBLGFBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7O09BRUEsT0FBQSxVQUFBLE9BQUE7UUFDQSxRQUFBLFFBQUEsTUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBOztTQUVBLElBQUEsSUFBQTtVQUNBLEtBQUE7VUFDQSxPQUFBOztTQUVBLFFBQUEsUUFBQSxLQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtZQUNBLElBQUEsUUFBQTthQUNBLE1BQUE7YUFDQSxTQUFBO2FBQ0EsUUFBQTthQUNBLE9BQUE7O1lBRUEsRUFBQSxPQUFBLEtBQUE7WUFDQSxPQUFBLEtBQUE7Ozs7U0FJQSxJQUFBLFlBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtXQUNBLElBQUEsSUFBQSxVQUFBLEdBQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBLFFBQUEsYUFBQTthQUNBLFFBQUEsS0FBQSxPQUFBOztZQUVBLFFBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7Z0JBSUE7O1VBRUEsRUFBQSxPQUFBOztVQUVBLGFBQUEsUUFBQTs7Ozs7O09BTUEsa0JBQUEsVUFBQSxPQUFBOzs7UUFHQSxJQUFBLFFBQUEsTUFBQSxNQUFBLGNBQUE7UUFDQSxJQUFBLFlBQUE7UUFDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxNQUFBOztRQUVBLElBQUEsU0FBQSxTQUFBLEdBQUE7U0FDQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTtTQUNBLFlBQUE7O1FBRUEsSUFBQSxRQUFBOztRQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsS0FBQTtTQUNBLElBQUEsU0FBQSxJQUFBOztVQUVBLFNBQUEsS0FBQSxTQUFBLEdBQUEsUUFBQSxlQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUEsR0FBQSxRQUFBLE9BQUEsQ0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7OztVQUdBLElBQUEsT0FBQSxTQUFBLEdBQUEsTUFBQTtVQUNBLElBQUEsS0FBQSxTQUFBLEdBQUE7V0FDQSxTQUFBLEtBQUE7V0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE1BQUEsS0FBQSxLQUFBO2FBQ0EsSUFBQSxJQUFBLEdBQUE7Y0FDQSxTQUFBLE1BQUE7O2FBRUEsU0FBQSxNQUFBLEtBQUE7Ozs7O1VBS0EsSUFBQSxTQUFBLEdBQUEsVUFBQSxHQUFBO1dBQ0EsTUFBQSxLQUFBOzs7O1FBSUEsSUFBQSxTQUFBLFVBQUEsTUFBQSxRQUFBO1NBQ0EsYUFBQTtTQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxhQUFBO1dBQ0EsUUFBQSxTQUFBLE1BQUE7O1VBRUEsUUFBQSxTQUFBLElBQUEsT0FBQTs7OztRQUlBLE9BQUEsU0FBQSxLQUFBLGFBQUEsTUFBQSxPQUFBOztPQUVBLE9BQUEsVUFBQSxLQUFBLE1BQUE7UUFDQSxhQUFBLE1BQUE7O09BRUEsVUFBQSxVQUFBLFNBQUE7O1FBRUEsYUFBQSxVQUFBOzs7UUFHQSxJQUFBLENBQUEsWUFBQTtTQUNBLFFBQUEsUUFBQSxhQUFBLGdCQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxVQUFBLENBQUEsS0FBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsWUFBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLGNBQUEsQ0FBQSxHQUFBO1dBQ0EsYUFBQSxnQkFBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxLQUFBLEtBQUEsV0FBQSxVQUFBLEdBQUE7V0FDQSxhQUFBLGFBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxhQUFBLENBQUEsS0FBQSxJQUFBLGNBQUEsUUFBQSxVQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsZUFBQTs7O2VBR0E7U0FDQSxRQUFBLFFBQUEsU0FBQSxVQUFBLE1BQUEsS0FBQTtVQUNBLEtBQUEsU0FBQTtVQUNBLElBQUEsS0FBQSxpQkFBQSxlQUFBLE9BQUEsT0FBQSxhQUFBO1dBQ0EsSUFBQSxJQUFBO1lBQ0EsS0FBQSxJQUFBOztXQUVBLFFBQUEsUUFBQSxLQUFBLE1BQUEsVUFBQSxRQUFBLEdBQUE7WUFDQSxFQUFBLFlBQUEsS0FBQTtZQUNBLElBQUEsTUFBQSxXQUFBLFNBQUEsR0FBQTthQUNBLElBQUEsT0FBQSxXQUFBLGlCQUFBLFFBQUEsU0FBQSxLQUFBLE9BQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7Y0FDQSxLQUFBLE9BQUEsS0FBQTtlQUNBLE1BQUE7ZUFDQSxTQUFBO2VBQ0EsUUFBQTs7Y0FFQTs7Ozs7V0FLQSxhQUFBLFFBQUE7WUFDQSxNQUFBLENBQUE7WUFDQSxRQUFBLEtBQUE7Ozs7U0FJQSxhQUFBLFlBQUE7O1FBRUEsYUFBQTs7UUFFQSxTQUFBLFVBQUE7U0FDQSxPQUFBLEtBQUEsYUFBQSxnQkFBQSxvQkFBQTtTQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3hNQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxnQkFBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztLQUVBLFNBQUEsU0FBQSxFQUFBLEVBQUEsT0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFVBQUEsU0FBQSxXQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsSUFBQSxLQUFBLElBQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO2FBQ0EsS0FBQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsT0FBQTtPQUNBLEtBQUEsU0FBQTtPQUNBLE9BQUE7YUFDQSxLQUFBLGFBQUEsYUFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBO0lBQ0EsSUFBQSxVQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQSxPQUFBLElBQUE7UUFDQSxJQUFBLE9BQUEsR0FBQTtNQUNBO01BQ0EsWUFBQSxPQUFBLElBQUE7TUFDQSxZQUFBOzs7UUFHQSxJQUFBLE1BQUEsR0FBQTtNQUNBO01BQ0EsS0FBQTtNQUNBLE1BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBOzs7UUFHQSxJQUFBLEtBQUE7T0FDQSxNQUFBLE1BQUE7T0FDQSxVQUFBO09BQ0EsS0FBQTtPQUNBO09BQ0EsT0FBQSxRQUFBLEtBQUEsS0FBQTthQUNBLEtBQUEsU0FBQSxHQUFBLEVBQUEsS0FBQSxXQUFBO2FBQ0EsTUFBQSxRQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO2FBQ0EsR0FBQSxZQUFBLFdBQUEsR0FBQSxXQUFBO0lBQ0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUE7T0FDQSxLQUFBLEtBQUE7V0FDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTtXQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtXQUNBLEdBQUEsU0FBQTs7UUFFQSxHQUFBLFNBQUEsU0FBQSxHQUFBO1lBQ0EsT0FBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUEsYUFBQSxTQUFBO2lCQUNBLFVBQUEsS0FBQTs7O0lBR0EsSUFBQSxTQUFBLFFBQUEsS0FBQSxNQUFBO0lBQ0EsU0FBQSxXQUFBLEVBQUE7S0FDQSxNQUFBLFFBQUEsQ0FBQSxRQUFBLEVBQUEsS0FBQTs7UUFFQSxTQUFBLFVBQUEsRUFBQTs7TUFFQSxTQUFBLFFBQUEsS0FBQSxNQUFBO1lBQ0EsTUFBQSxhQUFBLENBQUEsRUFBQSxLQUFBO01BQ0EsTUFBQTs7O1FBR0EsU0FBQSxTQUFBLEVBQUE7O1lBRUEsTUFBQSxhQUFBO01BQ0EsTUFBQTs7OztRQUlBLFNBQUEsU0FBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxJQUFBLEVBQUE7O0lBRUEsU0FBQSxVQUFBLEdBQUE7WUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxFQUFBO1lBQ0EsT0FBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQTs7O0lBR0EsTUFBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsT0FBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxTQUFBO1FBQ0EsVUFBQSxLQUFBO0tBQ0EsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxTQUFBO1FBQ0EsVUFBQSxLQUFBOzs7Ozs7Ozs7QUNoSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxnQkFBQTs7R0FFQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxTQUFBO01BQ0EsS0FBQTtNQUNBLE9BQUE7TUFDQSxRQUFBO01BQ0EsTUFBQTs7S0FFQSxRQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUE7S0FDQSxTQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsUUFBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsR0FBQSxHQUFBLE1BQUE7O0lBRUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBO0lBQ0EsTUFBQSxFQUFBLE1BQUEsQ0FBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsT0FBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLE9BQUEsTUFBQTs7OztJQUlBLElBQUEsT0FBQSxJQUFBLFVBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxRQUFBLE9BQUEsS0FBQSxLQUFBLFNBQUE7O0lBRUEsSUFBQSxTQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBLFdBQUEsU0FBQSxHQUFBLFdBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7O01BRUEsS0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBLFdBQUEsVUFBQSxNQUFBLEVBQUEsRUFBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsRUFBQSxTQUFBLFdBQUEsR0FBQSxNQUFBLE1BQUEsT0FBQTs7Ozs7Ozs7Ozs7O0tBWUEsTUFBQSxRQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7OztJQVVBLElBQUEsWUFBQTtNQUNBLE9BQUE7O0lBRUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTtRQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxXQUFBOztNQUVBLEtBQUEsS0FBQSxDQUFBO01BQ0EsS0FBQSxTQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxPQUFBOztJQUVBLElBQUEsYUFBQTtNQUNBLE9BQUE7SUFDQSxXQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsT0FBQSxFQUFBOztNQUVBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxXQUFBOztNQUVBLEtBQUEsS0FBQSxTQUFBO01BQ0EsS0FBQSxTQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxRQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7OztJQUlBLFNBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtLQUNBLElBQUE7S0FDQSxTQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUE7S0FDQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQTtZQUNBO01BQ0EsVUFBQSxNQUFBLENBQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUE7S0FDQSxPQUFBOztJQUVBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTs7O01BR0EsVUFBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7UUFDQSxJQUFBLFVBQUEsV0FBQTtRQUNBLEdBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxHQUFBO1NBQ0EsVUFBQTs7UUFFQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsV0FBQSxTQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUE7O01BRUEsVUFBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxFQUFBLEdBQUE7UUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsRUFBQSxRQUFBLFNBQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLFVBQUEsR0FBQTtTQUNBLEtBQUEsZUFBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLEtBQUE7OztTQUdBLEtBQUEsT0FBQSxTQUFBLEdBQUEsRUFBQTtRQUNBLEVBQUEsUUFBQSxNQUFBLEtBQUEsR0FBQTs7Ozs7Ozs7Ozs7O0FDOUpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7O0FDaEJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtDQUFBLFVBQUEsUUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLEdBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLGlCQUFBO0dBQ0Esa0JBQUE7R0FDQSxlQUFBO0dBQ0EsaUJBQUE7R0FDQSxVQUFBOztFQUVBLEdBQUEsUUFBQTtHQUNBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE1BQUE7OztFQUdBOztFQUVBLFNBQUEsVUFBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxNQUFBLFFBQUEsTUFBQSxTQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztHQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtLQUNBLEtBQUE7S0FDQSxPQUFBO0tBQ0EsUUFBQTtLQUNBLE1BQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsWUFBQTtJQUNBLFlBQUE7OztJQUdBLG9CQUFBOztJQUVBLFFBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxHQUFBLE1BQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7OztHQUtBLElBQUEsR0FBQSxRQUFBLFVBQUEsTUFBQTtJQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBOzs7R0FHQSxPQUFBLEdBQUE7O0VBRUEsU0FBQSxpQkFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLEdBQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOzs7R0FHQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsSUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsSUFBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTtLQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7SUFFQSxVQUFBLEtBQUE7O0dBRUEsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBO0dBQ0E7RUFDQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7OztJQUdBO0lBQ0E7Ozs7RUFJQSxPQUFBLE9BQUEsZ0JBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7Ozs7QUNuSUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsa0JBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxVQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsTUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBOzs7RUFHQSxTQUFBLGNBQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLEtBQUEsT0FBQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxZQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsS0FBQTtJQUNBLEdBQUEsY0FBQTtLQUNBLEdBQUEsUUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBLDRCQUFBOzs7Ozs7O0FDNUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7O0tBRUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTs7O0tBR0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7SUFZQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDeFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBLE1BQUEsY0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDckZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsV0FBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxnQ0FBQSxTQUFBLGlCQUFBO0VBQ0EsSUFBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLE1BQUE7R0FDQSxNQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsV0FBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTs7R0FFQSxRQUFBO0dBQ0EsU0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFlBQUEsYUFBQTtRQUNBLFFBQUEsT0FBQSxTQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7Ozs7OztBQzNCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxhQUFBLFlBQUE7SUFDQSxHQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsVUFBQSxFQUFBO0lBQ0EsR0FBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsUUFBQTs7O0dBR0EsR0FBQSxRQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLE9BQUE7O09BRUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxRQUFBLG9CQUFBO0lBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxNQUFBOztHQUVBLEtBQUEsV0FBQTtHQUNBLEtBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsU0FBQTtJQUNBLEdBQUEsU0FBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLFFBQUE7OztHQUdBLE9BQUE7Ozs7Ozs7RUFPQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtLQUNBLFFBQUE7O0lBRUEsR0FBQSxDQUFBLE1BQUE7S0FDQSxTQUFBLGNBQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE9BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ2pCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5QkFBQSxTQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxVQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0tBQ0EsTUFBQSxTQUFBLE1BQUEsR0FBQSxNQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsR0FBQSxNQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE1BQUE7S0FDQSxNQUFBLFNBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsSUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsVUFBQTs7R0FFQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCd1aS5yb3V0ZXIuc3RhdGUuZXZlbnRzJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ0ZCQW5ndWxhcicsJ2RuZExpc3RzJywnYW5ndWxhci5maWx0ZXInLCdhbmd1bGFyTW9tZW50JywnbmdTY3JvbGxiYXInLCdtZENvbG9yUGlja2VyJywnbmdBbmltYXRlJywndWkudHJlZScsJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsnYW5ndWxhci1jYWNoZScsJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAndG9hc3RyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnbmdNYXRlcmlhbCcsJ25nUGFwYVBhcnNlJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXHRcdC8vJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZW1lbnVAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NpZGVtZW51JyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2lkZW1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG5cdFx0XHRcdHVybDogJy8nLFxuXHRcdFx0XHR2aWV3czoge1xuXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hvbWUnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyJywge1xuXHRcdFx0XHR1cmw6ICcvdXNlcicsXG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlXG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLmxvZ2luJywge1xuXHRcdFx0XHR1cmw6ICcvbG9naW4nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5wcm9maWxlJywge1xuXHRcdFx0XHR1cmw6ICcvbXktcHJvZmlsZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbihEYXRhU2VydmljZSwgJGF1dGgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ21lJykuJG9iamVjdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VzZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2luZGV4Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGNvdW50cmllczogZnVuY3Rpb24oQ291bnRyaWVzU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YScsIHtcblx0XHRcdFx0dXJsOiAnL215LWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE15RGF0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEuZW50cnknLCB7XG5cdFx0XHRcdHVybDogJy86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFFbnRyeUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3R5bGVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0dHJlZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3JzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kaWNhdG9yOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yaW5kaWNhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycsIHtcblx0XHRcdFx0dXJsOiAnL2luZGl6ZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy86aWQvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kZXg6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGVQYXJhbXMuaWQgPT0gMCkgcmV0dXJuIHt9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEl0ZW0oJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yaW5kaXplcy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnYWRkaXRpb25hbEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9ycy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluaWRjYXRvcnNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzLmluZGljYXRvci5kZXRhaWxzJywge1xuXHRcdFx0XHR1cmw6ICcvOmVudHJ5Jyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93J1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJywge1xuXHRcdFx0XHR1cmw6ICcvY2F0ZWdvcmllcycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y2F0ZWdvcnk6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdGlmKCRzdGF0ZVBhcmFtcy5pZCA9PSAnbmV3Jyl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yeSgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JjYXRlZ29yeS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZScsIHtcblx0XHRcdFx0dXJsOiAnL2NyZWF0ZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4Y3JlYXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Y3JlYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJywge1xuXHRcdFx0XHR1cmw6ICcvYmFzaWMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY2hlY2snLCB7XG5cdFx0XHRcdHVybDogJy9jaGVja2luZycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4Q2hlY2snKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleENoZWNrQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tTaWRlYmFyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5tZXRhJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkaW5nLW1ldGEtZGF0YScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4TWV0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNZXRhL2luZGV4TWV0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNZXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZmluYWwnLCB7XG5cdFx0XHRcdHVybDogJy9maW5hbCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4RmluYWwnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleEZpbmFsL2luZGV4RmluYWxNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4RmluYWxNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5saXN0Jywge1xuXHRcdFx0XHR1cmw6ICcvbGlzdCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7XG5cdFx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHR0cmVlOiB0cnVlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZnVsbExpc3QnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGdWxsTGlzdEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubGlzdC5maWx0ZXInLHtcblx0XHRcdFx0dXJsOicvOmZpbHRlcicsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9mdWxsTGlzdC9maWx0ZXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRnVsbExpc3RGaXRsZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3IvOmlkLzpuYW1lLzp5ZWFyLzpnZW5kZXIvOmlzbycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3I6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kaWNhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yU2hvd0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXJhbXM6e1xuXHRcdFx0XHRcdHllYXI6e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZW5kZXI6e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpc286e1xuXHRcdFx0XHRcdFx0c3F1YXNoOnRydWUsXG5cdFx0XHRcdFx0XHR2YWx1ZTpudWxsLFxuXHRcdFx0XHRcdFx0ZHluYW1pYzp0cnVlXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2RldGFpbHMnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSgkc3RhdGUucGFyYW1zLmlkLCAkc3RhdGUucGFyYW1zLnllYXIsICRzdGF0ZS5wYXJhbXMuZ2VuZGVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBmdW5jdGlvbihJbmRpemVzU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gSW5kaXplc1NlcnZpY2UuZmV0Y2hEYXRhKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2luZm8nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluZm9DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGluZm8nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdHVybDogJy86aXRlbScsXG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdzZWxlY3RlZCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NlbGVjdGVkJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VsZWN0ZWRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdFx0XHRnZXRDb3VudHJ5OiBmdW5jdGlvbihEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgJHN0YXRlUGFyYW1zLml0ZW0pLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0dXJsOiAnL2NvbXBhcmUvOmNvdW50cmllcydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9jb25mbGljdCcsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXgnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb25zOiBmdW5jdGlvbihSZXN0YW5ndWxhcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzL25hdGlvbnMnKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbmZsaWN0czogZnVuY3Rpb24oUmVzdGFuZ3VsYXIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NvbmZsaWN0cycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RzJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdsb2dvQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdHVybDogJy9uYXRpb24vOmlzbycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb246IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvbmF0aW9ucy8nLCAkc3RhdGVQYXJhbXMuaXNvKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0bmF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RuYXRpb24nKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4LmRldGFpbHMnLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y29uZmxpY3Q6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvZXZlbnRzLycsICRzdGF0ZVBhcmFtcy5pZCkuZ2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGRldGFpbHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdGRldGFpbHMnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2l0ZW1zLW1lbnVAJzoge30sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmltcG9ydCcsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0SW1wb3J0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RJbXBvcnQnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmltcG9ydGNzdicsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydGVyJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHBhZ2VOYW1lOiAnSW1wb3J0IENTVidcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2LCAkdGltZW91dCwgJGF1dGgsICRzdGF0ZSwgJGxvY2FsU3RvcmFnZSwgJHdpbmRvdywgbGVhZmxldERhdGEsIHRvYXN0cikge1xuXHRcdCRyb290U2NvcGUuc2lkZWJhck9wZW4gPSB0cnVlO1xuXHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gJGxvY2FsU3RvcmFnZS5mdWxsVmlldyB8fCBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLnN0YXJ0ZWQgPSB0cnVlO1xuXHRcdCRyb290U2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbihtZW51SWQpIHtcblx0XHRcdCRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcblx0XHR9XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG5cblx0XHRcdGlmICh0b1N0YXRlLmF1dGggJiYgISRhdXRoLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignWW91ciBub3QgYWxsb3dlZCB0byBnbyB0aGVyZSBidWRkeSEnLCAnQWNjZXNzIGRlbmllZCcpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5sYXlvdXQgPT0gXCJyb3dcIikge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUucm93ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiB0b1N0YXRlLnZpZXdzICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ21haW5AJykgfHwgdG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2l0ZW1zLW1lbnVAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2xvZ29AJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUubG9nb1ZpZXcgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5tYWluVmlldyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZS5pbmRleE9mKCdjb25mbGljdCcpID4gLTEgJiYgdG9TdGF0ZS5uYW1lICE9IFwiYXBwLmNvbmZsaWN0LmltcG9ydFwiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUubm9IZWFkZXIgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ub0hlYWRlciA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSAnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUucHJldmlvdXNQYWdlID0ge1xuXHRcdFx0XHRzdGF0ZTogZnJvbVN0YXRlLFxuXHRcdFx0XHRwYXJhbXM6IGZyb21QYXJhbXNcblx0XHRcdH07XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpO1xuXG5cblx0XHR9KTtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiR2aWV3Q29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSkge1xuXG5cdFx0fSk7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpIHtcblxuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHRcdCRtZFNpZGVuYXYoJ2xlZnRNZW51JykuY2xvc2UoKTtcblx0XHRcdH1cblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCkge1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0XHRtYXAuaW52YWxpZGF0ZVNpemUoKTtcblx0XHRcdFx0fSlcblx0XHRcdH0sIDEwMDApO1xuXHRcdH1cblx0XHQvKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihldikge1xuICAgIC8vIGF2b2lkcyBzY3JvbGxpbmcgd2hlbiB0aGUgZm9jdXNlZCBlbGVtZW50IGlzIGUuZy4gYW4gaW5wdXRcbiAgICBpZiAoXG4gICAgICAgICFkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHlcbiAgICApIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKHRydWUpO1xuICAgIH1cbn0pOyovXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKSB7XG5cdFx0Ly8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuXHRcdC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG5cdFx0JGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoJztcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoL3NpZ251cCc7XG4gICAgJGF1dGhQcm92aWRlci51bmxpbmtVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC91bmxpbmsvJztcblx0XHQkYXV0aFByb3ZpZGVyLmZhY2Vib29rKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2ZhY2Vib29rJyxcblx0XHRcdGNsaWVudElkOiAnNzcxOTYxODMyOTEwMDcyJ1xuXHRcdH0pO1xuXHRcdCRhdXRoUHJvdmlkZXIuZ29vZ2xlKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2dvb2dsZScsXG5cdFx0XHRjbGllbnRJZDogJzI3NjYzNDUzNzQ0MC1jZ3R0MTRxajJlOGlucDB2cTVvcTliNDZrNzRqanMzZS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRsb2dQcm92aWRlcil7XG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKHtcblx0XHRcdFx0YWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCJcblx0XHRcdH0pXG5cdFx0XHQuc2V0RGVmYXVsdEh0dHBGaWVsZHMoe1xuXHRcdFx0XHRjYWNoZTogZmFsc2Vcblx0XHRcdH0pXG5cdFx0XHQuYWRkUmVzcG9uc2VJbnRlcmNlcHRvcihmdW5jdGlvbihkYXRhLCBvcGVyYXRpb24sIHdoYXQsIHVybCwgcmVzcG9uc2UsIGRlZmVycmVkKSB7XG5cdFx0XHRcdHZhciBleHRyYWN0ZWREYXRhO1xuXHRcdFx0XHRleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuXHRcdFx0XHRpZiAoZGF0YS5tZXRhKSB7XG5cdFx0XHRcdFx0ZXh0cmFjdGVkRGF0YS5fbWV0YSA9IGRhdGEubWV0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YS5pbmNsdWRlZCkge1xuXHRcdFx0XHRcdGV4dHJhY3RlZERhdGEuX2luY2x1ZGVkID0gZGF0YS5pbmNsdWRlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZXh0cmFjdGVkRGF0YTtcblx0XHRcdH0pO1xuXHRcdC8qXHQuc2V0RXJyb3JJbnRlcmNlcHRvcihmdW5jdGlvbihyZXNwb25zZSwgZGVmZXJyZWQsIHJlc3BvbnNlSGFuZGxlcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2VycnJvJyk7XG5cdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcblxuICAgIFx0XHRyZXR1cm4gZmFsc2U7IC8vIGVycm9yIGhhbmRsZWRcbiAgICBcdH1cblxuICAgIFx0cmV0dXJuIHRydWU7IC8vIGVycm9yIG5vdCBoYW5kbGVkXG5cdFx0fSk7Ki9cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyLCRtZEdlc3R1cmVQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG4vKlx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdsaWdodC1ibHVlJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnYmx1ZXInKTsqL1xuXHRcdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2luZGlnbycsIHtcblx0XHRcdCc1MDAnOiAnIzAwNmJiOScsXG5cdFx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuXHRcdH0pO1xuXHRcdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnYmx1ZXInKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXG5cdFx0ICRtZEdlc3R1cmVQcm92aWRlci5za2lwQ2xpY2tIaWphY2soKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKHRvYXN0ckNvbmZpZyl7XG4gICAgICAgIC8vXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgIGF1dG9EaXNtaXNzOiB0cnVlLFxuICAgICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgICBtYXhPcGVuZWQ6IDIsXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LWJvdHRvbS1yaWdodCcsXG4gICAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHByZXZlbnRPcGVuRHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgcHJvZ3Jlc3NCYXI6dHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcignZmluZGJ5bmFtZScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBuYW1lLCBmaWVsZCkge1xuXHRcdFx0Ly9cbiAgICAgIHZhciBmb3VuZHMgPSBbXTtcblx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0bGVuID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpbnB1dFtpXVtmaWVsZF0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuXHRcdFx0XHRcdCBmb3VuZHMucHVzaChpbnB1dFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3VuZHM7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICduZXdsaW5lJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB0ZXh0ICl7XG4gICAgICAgICAgICAvL1xuICAgIFxuICAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyhcXFxccik/XFxcXG4vZywgJzxiciAvPjxiciAvPicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ09yZGVyT2JqZWN0QnknLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG5cblx0XHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgb2JqZWN0S2V5IGluIGlucHV0KSB7XG5cdFx0XHRcdGFycmF5LnB1c2goaW5wdXRbb2JqZWN0S2V5XSk7XG5cdFx0XHR9XG5cblx0XHRcdGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0YSA9IHBhcnNlSW50KGFbYXR0cmlidXRlXSk7XG5cdFx0XHRcdGIgPSBwYXJzZUludChiW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRyZXR1cm4gYSAtIGI7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhcnJheTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdwcm9wZXJ0eScsIHByb3BlcnR5KTtcblx0ZnVuY3Rpb24gcHJvcGVydHkoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChhcnJheSwgeWVhcl9maWVsZCwgdmFsdWUpIHtcblxuICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xuXG4gICAgICAgIGlmKGFycmF5W2ldLmRhdGFbeWVhcl9maWVsZF0gPT0gdmFsdWUpe1xuICAgICAgICAgIGl0ZW1zLnB1c2goYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdDb250ZW50U2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JJdGVtKGxpc3QsaWQpe1xuXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdFx0XHRpZihpdGVtLmlkID09IGlkKXtcblx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gc2VhcmNoRm9ySXRlbShpdGVtLmNoaWxkcmVuLCBpZCk7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29udGVudDoge1xuXHRcdFx0XHRpbmRpY2F0b3JzOiBbXSxcblx0XHRcdFx0aW5kaWNhdG9yOiB7fSxcblx0XHRcdFx0ZGF0YTogW10sXG5cdFx0XHRcdGNhdGVnb3JpZXM6IFtdLFxuXHRcdFx0XHRjYXRlZ29yeToge30sXG5cdFx0XHRcdHN0eWxlczogW10sXG5cdFx0XHRcdGluZm9ncmFwaGljczogW10sXG5cdFx0XHRcdGluZGljZXM6W11cblx0XHRcdH0sXG5cdFx0XHRiYWNrdXA6e30sXG5cdFx0XHRmZXRjaEluZGljZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4JykuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcnM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMnLCBmaWx0ZXIpLiRvYmplY3Rcblx0XHRcdH0sXG5cdFx0XHRmZXRjaENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlciwgd2l0aG91dFNhdmUpIHtcblx0XHRcdFx0aWYod2l0aG91dFNhdmUpe1xuXHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2NhdGVnb3JpZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yaWVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoU3R5bGVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljZXMoZmlsdGVyKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0Q2F0ZWdvcmllczogZnVuY3Rpb24oZmlsdGVyLCB3aXRob3V0U2F2ZSkge1xuXHRcdFx0XHRpZih3aXRob3V0U2F2ZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hDYXRlZ29yaWVzKGZpbHRlciwgd2l0aG91dFNhdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoQ2F0ZWdvcmllcyhmaWx0ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcztcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2F0b3JzKGZpbHRlcik7XG5cblx0XHRcdH0sXG5cdFx0XHRnZXRTdHlsZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LnN0eWxlcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoU3R5bGVzKGZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9yc1tpXS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNhdG9yKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcjogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzLycgKyBpZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRyZXR1cm4gdGhhdC5jb250ZW50LmluZGljYXRvciA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yUHJvbWlzZTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kaWNhdG9ycycsaWQpO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGlkLCB5ZWFyLCBnZW5kZXIpIHtcblx0XHRcdFx0aWYoeWVhciAmJiBnZW5kZXIgJiYgZ2VuZGVyICE9ICdhbGwnKXtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhLycgKyB5ZWFyICsgJy9nZW5kZXIvJyArZ2VuZGVyICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoeWVhcikge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEvJyArIHllYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEnKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JIaXN0b3J5OiBmdW5jdGlvbihpZCwgaXNvLCBnZW5kZXIpe1xuXHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9oaXN0b3J5LycgKyBpc28sIHtnZW5kZXI6IGdlbmRlcn0pO1xuXHRcdFx0fSxcblx0XHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHQvKlx0aWYodGhpcy5jb250ZW50LmluZGljZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0IHRoaXMuY29udGVudC5kYXRhID0gc2VhcmNoRm9ySXRlbSh0aGlzLmNvbnRlbnQuaW5kaWNlcywgaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7Ki9cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycsIGlkKVxuXHRcdFx0XHQvL31cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDb250ZW50OmZ1bmN0aW9uKGlkLCBsaXN0KXtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaWQpe1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gdGhhdC5yZW1vdmVDb250ZW50KGlkLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRmaW5kQ29udGVudDpmdW5jdGlvbihpZCwgbGlzdCl7XG5cdFx0XHRcdHZhciBmb3VuZCA9IG51bGw7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5LmlkID09IGlkKXtcblx0XHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuICYmIGVudHJ5LmNoaWxkcmVuLmxlbmd0aCAmJiAhZm91bmQpe1xuXHRcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHRoYXQuZmluZENvbnRlbnQoaWQsIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmb3VuZDtcblx0XHRcdH0sXG5cdFx0XHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dGhpcy5jb250ZW50LmluZGljZXMucHVzaChpdGVtKVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0dGhpcy5yZW1vdmVDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5yZW1vdmUoJ2luZGV4LycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIGVudHJ5ID0gdGhpcy5maW5kQ29udGVudChpdGVtLmlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coZW50cnksIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gZW50cnkgPSBpdGVtO1xuXHRcdFx0fSxcblx0XHRcdGdldENhdGVnb3J5OiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmluZENvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3J5ID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdjYXRlZ29yaWVzLycgKyBpZCkuJG9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUNhdGVnb3J5OiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ29udGVudChpZCwgdGhpcy5jb250ZW50LmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UucmVtb3ZlKCdjYXRlZ29yaWVzLycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHRmaWx0ZXJMaXN0OiBmdW5jdGlvbih0eXBlLCBmaWx0ZXIsIGxpc3Qpe1xuXHRcdFx0XHRpZihsaXN0Lmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdGlmKCF0aGlzLmJhY2t1cFt0eXBlXSl7XG5cdFx0XHRcdFx0XHR0aGlzLmJhY2t1cFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmNvbnRlbnRbdHlwZV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5jb250ZW50W3R5cGVdID0gYW5ndWxhci5jb3B5KHRoaXMuYmFja3VwW3R5cGVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXSA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHRoaXMuY29udGVudFt0eXBlXSwgZmlsdGVyKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmJhY2t1cFt0eXBlXTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdH0sXG5cdFx0XHRyZXNldEZpbHRlcjogZnVuY3Rpb24odHlwZSl7XG5cdFx0XHRcdGlmKCF0aGlzLmJhY2t1cFt0eXBlXSkgcmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdFx0dGhpcy5jb250ZW50W3R5cGVdID0gYW5ndWxhci5jb3B5KHRoaXMuYmFja3VwW3R5cGVdKTtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuYmFja3VwW3R5cGVdO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50W3R5cGVdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdDb3VudHJpZXNTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvdW50cmllczogW10sXG4gICAgICAgICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvaXNvcycpLiRvYmplY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoIXRoaXMuY291bnRyaWVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdEYXRhU2VydmljZScsIERhdGFTZXJ2aWNlKTtcbiAgICBEYXRhU2VydmljZS4kaW5qZWN0ID0gWydSZXN0YW5ndWxhcicsJ3RvYXN0ciddO1xuXG4gICAgZnVuY3Rpb24gRGF0YVNlcnZpY2UoUmVzdGFuZ3VsYXIsIHRvYXN0cil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0QWxsOiBnZXRBbGwsXG4gICAgICAgICAgZ2V0T25lOiBnZXRPbmUsXG4gICAgICAgICAgcG9zdDogcG9zdCxcbiAgICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICByZW1vdmU6IHJlbW92ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbChyb3V0ZSwgZmlsdGVyKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkuZ2V0TGlzdChmaWx0ZXIpO1xuICAgICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLnN0YXR1c1RleHQsICdDb25uZWN0aW9uIEVycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9uZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5nZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwb3N0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucG9zdChkYXRhKTtcbiAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLmRhdGEuZXJyb3IsICdTYXZpbmcgZmFpbGVkJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcHV0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHJvdXRlLCBpZCwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLnB1dChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdFcnJvckNoZWNrZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tNeURhdGEoZGF0YSkge1xuICAgIFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcbiAgICBcdFx0XHRpZiAodm0uZGF0YS5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgXHRcdFx0XHRcdFx0dmFyIGZvdW5kID0gMDtcbiAgICBcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5tZXRhLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuICAgIFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLmNvbHVtbiA9PSBmaWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG4gICAgXHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGZvdW5kID49IHZtLmRhdGFbMF0ubWV0YS5maWVsZHMubGVuZ3RoIC0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcy5wdXNoKGVudHJ5KTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdGlmICh2bS5leHRlbmRpbmdDaG9pY2VzLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5tZXRhLnllYXIgPSB2bS5kYXRhWzBdLmRhdGFbMF1bdm0ubWV0YS55ZWFyX2ZpZWxkXTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9XG4gICAgICAgICAgcmV0dXJuIGV4dGVuZGVkQ2hvaWNlcztcbiAgICBcdFx0fVxuXG4gICAgXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSkge1xuICAgIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrKSB7XG4gICAgXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuICAgIFx0XHRcdFx0XHRcdGlmICggaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVswXVtrXSA9IG51bGw7XG4gICAgXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdGlmICghcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdHZhciBlcnJvciA9IHtcbiAgICBcdFx0XHRcdFx0XHR0eXBlOiBcIjJcIixcbiAgICBcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG4gICAgXHRcdFx0XHRcdFx0dmFsdWU6IHJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcbiAgICBcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkLFxuICAgIFx0XHRcdFx0XHRcdHJvdzoga2V5XG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMikge1xuICAgIFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcbiAgICBcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuXG4gICAgXHRcdGZ1bmN0aW9uIGZldGNoSXNvKCkge1xuICAgIFx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBJU08gZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdGlmICghdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0aWYgKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuXG4gICAgXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcbiAgICBcdFx0XHR2YXIgZW50cmllcyA9IFtdO1xuICAgIFx0XHRcdHZhciBpc29DaGVjayA9IDA7XG4gICAgXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuICAgIFx0XHRcdFx0aWYgKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0c3dpdGNoIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9ICdDYXBlIFZlcmRlJztcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJEZW1vY3JhdGljIFBlb3BsZSdzIFJlcHVibGljIG9mIEtvcmVhXCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkl2b3J5IENvYXN0XCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibGljXCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGRlZmF1bHQ6XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuICAgIFx0XHRcdFx0XHRpc286IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgXHRcdFx0XHRcdG5hbWU6IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdXG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHR2YXIgaXNvVHlwZSA9IGlzb0NoZWNrID49IChlbnRyaWVzLmxlbmd0aCAvIDIpID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG4gICAgXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY291bnRyaWVzL2J5SXNvTmFtZXMnLCB7XG4gICAgXHRcdFx0XHRkYXRhOiBlbnRyaWVzLFxuICAgIFx0XHRcdFx0aXNvOiBpc29UeXBlXG4gICAgXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpIHtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5kYXRhLmxlbmd0aCA+IDEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0dmFyIHRvU2VsZWN0ID0ge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuICAgIFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGFbMF0gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2codm0uZGF0YVtrXSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIzXCIsXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkNvdWxkIG5vdCBsb2NhdGUgYSB2YWxpZCBpc28gbmFtZSFcIixcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRJc29FcnJvcihlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHR2bS5pc29fY2hlY2tlZCA9IHRydWU7XG4gICAgXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdzZWxlY3Rpc29mZXRjaGVycycpO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGZpZWxkIHNlbGVjdGlvbnMnLCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuICAgIFx0XHRcdH0pO1xuXG4gICAgXHRcdH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjaGVja015RGF0YTogY2hlY2tNeURhdGFcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSWNvbnNTZXJ2aWNlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHVuaWNvZGVzID0ge1xuICAgICAgICAgICdlbXB0eSc6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhZ3Jhcic6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhbmNob3InOiBcIlxcdWU2MDFcIixcbiAgICAgICAgICAnYnV0dGVyZmx5JzogXCJcXHVlNjAyXCIsXG4gICAgICAgICAgJ2VuZXJneSc6XCJcXHVlNjAzXCIsXG4gICAgICAgICAgJ3NpbmsnOiBcIlxcdWU2MDRcIixcbiAgICAgICAgICAnbWFuJzogXCJcXHVlNjA1XCIsXG4gICAgICAgICAgJ2ZhYnJpYyc6IFwiXFx1ZTYwNlwiLFxuICAgICAgICAgICd0cmVlJzpcIlxcdWU2MDdcIixcbiAgICAgICAgICAnd2F0ZXInOlwiXFx1ZTYwOFwiXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRVbmljb2RlOiBmdW5jdGlvbihpY29uKXtcbiAgICAgICAgICAgIHJldHVybiB1bmljb2Rlc1tpY29uXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExpc3Q6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB1bmljb2RlcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0luZGV4U2VydmljZScsIGZ1bmN0aW9uKENhY2hlRmFjdG9yeSwkc3RhdGUpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgc2VydmljZURhdGEgPSB7XG4gICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHllYXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgIGdlbmRlcl9maWVsZDonJyxcbiAgICAgICAgICAgICAgdGFibGU6W11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnt9LFxuICAgICAgICAgICAgdG9TZWxlY3Q6W11cbiAgICAgICAgfSwgc3RvcmFnZSwgaW1wb3J0Q2FjaGUsIGluZGljYXRvcjtcblxuICAgICAgICBpZiAoIUNhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSkge1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5KCdpbXBvcnREYXRhJywge1xuICAgICAgICAgICAgY2FjaGVGbHVzaEludGVydmFsOiA2MCAqIDYwICogMTAwMCwgLy8gVGhpcyBjYWNoZSB3aWxsIGNsZWFyIGl0c2VsZiBldmVyeSBob3VyLlxuICAgICAgICAgICAgZGVsZXRlT25FeHBpcmU6ICdhZ2dyZXNzaXZlJywgLy8gSXRlbXMgd2lsbCBiZSBkZWxldGVkIGZyb20gdGhpcyBjYWNoZSByaWdodCB3aGVuIHRoZXkgZXhwaXJlLlxuICAgICAgICAgICAgc3RvcmFnZU1vZGU6ICdsb2NhbFN0b3JhZ2UnIC8vIFRoaXMgY2FjaGUgd2lsbCB1c2UgYGxvY2FsU3RvcmFnZWAuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJyk7XG4gICAgICAgICAgc3RvcmFnZSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbGVhcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICBnZW5kZXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGREYXRhOmZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZEluZGljYXRvcjogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJc29FcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZXJ2aWNlRGF0YS50b1NlbGVjdC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID4gLTEgPyBzZXJ2aWNlRGF0YS50b1NlbGVjdC5zcGxpY2UoaW5kZXgsIDEpIDogZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXREYXRhOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhID0gZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldElzb0ZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEdlbmRlckZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuZ2VuZGVyX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0WWVhckZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEueWVhcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VydmljZURhdGEpO1xuICAgICAgICAgIGltcG9ydENhY2hlLnB1dCgnZGF0YVRvSW1wb3J0JyxzZXJ2aWNlRGF0YSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSwgaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEFjdGl2ZUluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNbaXRlbS5jb2x1bW5fbmFtZV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnJvbUxvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGdWxsRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRNZXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29GaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvdW50cnlGaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRFcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0Vycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZpcnN0RW50cnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGFTaXplOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY3RpdmVJbmRpY2F0b3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRJbmRpY2F0b3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBudWxsO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlSXNvRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0ID0gW107XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldExvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRpemVzU2VydmljZScsIGZ1bmN0aW9uIChEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4OiB7XG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyZTogbnVsbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcm9taXNlczoge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXI6IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZldGNoRGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnUmVjdXJzaW9uSGVscGVyJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogTWFudWFsbHkgY29tcGlsZXMgdGhlIGVsZW1lbnQsIGZpeGluZyB0aGUgcmVjdXJzaW9uIGxvb3AuXG5cdFx0XHRcdFx0ICogQHBhcmFtIGVsZW1lbnRcblx0XHRcdFx0XHQgKiBAcGFyYW0gW2xpbmtdIEEgcG9zdC1saW5rIGZ1bmN0aW9uLCBvciBhbiBvYmplY3Qgd2l0aCBmdW5jdGlvbihzKSByZWdpc3RlcmVkIHZpYSBwcmUgYW5kIHBvc3QgcHJvcGVydGllcy5cblx0XHRcdFx0XHQgKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbGlua2luZyBmdW5jdGlvbnMuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0Y29tcGlsZTogZnVuY3Rpb24gKGVsZW1lbnQsIGxpbmspIHtcblx0XHRcdFx0XHRcdC8vIE5vcm1hbGl6ZSB0aGUgbGluayBwYXJhbWV0ZXJcblx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24obGluaykpIHtcblx0XHRcdFx0XHRcdFx0bGluayA9IHtcblx0XHRcdFx0XHRcdFx0XHRwb3N0OiBsaW5rXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEJyZWFrIHRoZSByZWN1cnNpb24gbG9vcCBieSByZW1vdmluZyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdHZhciBjb250ZW50cyA9IGVsZW1lbnQuY29udGVudHMoKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHZhciBjb21waWxlZENvbnRlbnRzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0cHJlOiAobGluayAmJiBsaW5rLnByZSkgPyBsaW5rLnByZSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHQgKiBDb21waWxlcyBhbmQgcmUtYWRkcyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdHBvc3Q6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIENvbXBpbGUgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjb21waWxlZENvbnRlbnRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBSZS1hZGQgdGhlIGNvbXBpbGVkIGNvbnRlbnRzIHRvIHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyhzY29wZSwgZnVuY3Rpb24gKGNsb25lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmFwcGVuZChjbG9uZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBDYWxsIHRoZSBwb3N0LWxpbmtpbmcgZnVuY3Rpb24sIGlmIGFueVxuXHRcdFx0XHRcdFx0XHRcdGlmIChsaW5rICYmIGxpbmsucG9zdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGluay5wb3N0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdH0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjp7XG4gICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlci5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBteVByb2ZpbGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RnJpZW5kczogZnVuY3Rpb24oKXtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVmVjdG9ybGF5ZXJTZXJ2aWNlJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXMsIF9zZWxmID0gdGhpcztcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2FudmFzOiBmYWxzZSxcblx0XHRcdHBhbGV0dGU6IFtdLFxuXHRcdFx0Y3R4OiAnJyxcblx0XHRcdGtleXM6IHtcblx0XHRcdFx0bWF6cGVuOiAndmVjdG9yLXRpbGVzLVEzX09zNXcnLFxuXHRcdFx0XHRtYXBib3g6ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSdcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGxheWVyOiAnJyxcblx0XHRcdFx0bmFtZTogJ2NvdW50cmllc19iaWcnLFxuXHRcdFx0XHRiYXNlQ29sb3I6ICcjMDZhOTljJyxcblx0XHRcdFx0aXNvMzogJ2FkbTBfYTMnLFxuXHRcdFx0XHRpc28yOiAnaXNvX2EyJyxcblx0XHRcdFx0aXNvOiAnaXNvX2EyJyxcblx0XHRcdFx0ZmllbGRzOiBcImlkLGFkbWluLGFkbTBfYTMsaXNvX2EyLG5hbWUsbmFtZV9sb25nXCIsIC8vc3VfYTMsaXNvX2EzLHdiX2EzLFxuXHRcdFx0XHRmaWVsZDonc2NvcmUnXG5cdFx0XHR9LFxuXHRcdFx0bWFwOiB7XG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjdXJyZW50OiBbXSxcblx0XHRcdFx0c3RydWN0dXJlOiBbXSxcblx0XHRcdFx0c3R5bGU6IFtdXG5cdFx0XHR9LFxuXHRcdFx0bWFwTGF5ZXI6IG51bGwsXG5cdFx0XHRzZXRNYXA6IGZ1bmN0aW9uKG1hcCl7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1hcExheWVyID0gbWFwO1xuXHRcdFx0fSxcblx0XHRcdHNldExheWVyOiBmdW5jdGlvbihsKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXIgPSBsO1xuXHRcdFx0fSxcblx0XHRcdGdldExheWVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5sYXllcjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYW1lOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5uYW1lO1xuXHRcdFx0fSxcblx0XHRcdGZpZWxkczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuZmllbGRzO1xuXHRcdFx0fSxcblx0XHRcdGlzbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvO1xuXHRcdFx0fSxcblx0XHRcdGlzbzM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzM7XG5cdFx0XHR9LFxuXHRcdFx0aXNvMjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvMjtcblx0XHRcdH0sXG5cdFx0XHRjcmVhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2Upe1xuXG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2UpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjb2xvclJhbmdlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSAvIChjb2xvclJhbmdlLmxlbmd0aCAtMSkgKiBpLCBjb2xvclJhbmdlW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0QmFzZUNvbG9yOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0fSxcblx0XHQvKlx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKSB7XG5cdFx0XHRcdHRoaXMuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSlcblx0XHRcdH0sKi9cblx0XHRcdGNvdW50cnlDbGljazogZnVuY3Rpb24oY2xpY2tGdW5jdGlvbikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIub3B0aW9ucy5vbkNsaWNrID0gY2xpY2tGdW5jdGlvbjtcblx0XHRcdFx0fSlcblxuXHRcdFx0fSxcblx0XHRcdGdldENvbG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWxldHRlW3ZhbHVlXTtcblx0XHRcdH0sXG5cdFx0XHRzZXRTdHlsZTogZnVuY3Rpb24oc3R5bGUpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXAuc3R5bGUgPSBzdHlsZTtcblx0XHRcdH0sXG5cdFx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhLCBjb2xvciwgZHJhd0l0KSB7XG5cdFx0XHRcdHRoaXMubWFwLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNvbG9yICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHR0aGlzLmRhdGEuYmFzZUNvbG9yID0gY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLmNhbnZhcykge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5jcmVhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5iYXNlQ29sb3IgPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUZpeGVkQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHJhd0l0KSB7XG5cdFx0XHRcdFx0dGhpcy5wYWludENvdW50cmllcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmF0aW9uQnlJc286IGZ1bmN0aW9uKGlzbywgbGlzdCkge1xuXHRcdFx0XHRpZih0eXBlb2YgbGlzdCAhPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdGlmICh0aGlzLm1hcC5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLm1hcC5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYXRpb25CeU5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0aWYgKHRoaXMubWFwLmRhdGEubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRwYWludENvdW50cmllczogZnVuY3Rpb24oc3R5bGUsIGNsaWNrLCBtdXRleCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2Ygc3R5bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBzdHlsZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUodGhhdC5tYXAuc3R5bGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZW9mIGNsaWNrICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5vcHRpb25zLm9uQ2xpY2sgPSBjbGlja1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQgXHR0aGF0LmRhdGEubGF5ZXIucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdHJlc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzLCBmdW5jdGlvbihmZWF0dXJlLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXNvKXtcblx0XHRcdFx0XHRcdFx0aWYoa2V5ICE9IGlzbylcblx0XHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmU6ZnVuY3Rpb24oaXNvLCBzZWxlY3RlZCl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzW2lzb10gPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGlzbyk7XG5cdFx0XHRcdFx0Ly9kZWJ1Z2dlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRyZWRyYXc6ZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLnJlZHJhdygpO1xuXHRcdFx0fSxcblx0XHRcdC8vRlVMTCBUTyBET1xuXHRcdFx0Y291bnRyaWVzU3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0ZGVidWdnZXI7XG5cdFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3RoYXQuZGF0YS5pc28yXTtcblx0XHRcdFx0dmFyIG5hdGlvbiA9IHRoYXQuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdFx0dmFyIGZpZWxkID0gdGhhdC5kYXRhLmZpZWxkO1xuXHRcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCl7XG5cdFx0XHRcdFx0XHRcdHZhciBsaW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLHZtLnJhbmdlLm1heF0pLnJhbmdlKFswLDI1Nl0pO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9ICBwYXJzZUludChsaW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0Oy8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNvbG9yUG9zLCBpc28sbmF0aW9uKTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RJbXBvcnRDdHJsJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXIsIHRvYXN0ciwgJHN0YXRlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm5hdGlvbnMgPSBbXTtcblx0XHR2bS5ldmVudHMgPSBbXTtcblx0XHR2bS5zdW0gPSAwO1xuXG5cdFx0dm0uc2F2ZVRvRGIgPSBzYXZlVG9EYjtcblxuXHRcdGZ1bmN0aW9uIHNhdmVUb0RiKCkge1xuXHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdG5hdGlvbnM6IHZtLm5hdGlvbnMsXG5cdFx0XHRcdGV2ZW50czogdm0uZXZlbnRzXG5cdFx0XHR9O1xuXHRcdFx0UmVzdGFuZ3VsYXIuYWxsKCcvY29uZmxpY3RzL2ltcG9ydCcpLnBvc3QoZGF0YSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Jylcblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0ZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkdGltZW91dCwgJHN0YXRlLCAkc2NvcGUsICRyb290U2NvcGUsIFZlY3RvcmxheWVyU2VydmljZSwgY29uZmxpY3QsIGNvbmZsaWN0cywgbmF0aW9ucywgRGlhbG9nU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdHZtLmNvbmZsaWN0cyA9IG5hdGlvbnM7XG5cdFx0dm0uY29uZmxpY3RJdGVtcyA9IFtcblx0XHRcdCd0ZXJyaXRvcnknLFxuXHRcdFx0J3NlY2Vzc2lvbicsXG5cdFx0XHQnYXV0b25vbXknLFxuXHRcdFx0J3N5c3RlbScsXG5cdFx0XHQnbmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0J2ludGVybmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0J3N1Ym5hdGlvbmFsX3ByZWRvbWluYW5jZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLnNob3dDb3VudHJpZXMgPSBmYWxzZTtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uY291bnRyaWVzID0gW107XG5cdFx0dm0uc2hvd1RleHQgPSBzaG93VGV4dDtcblx0XHR2bS5zaG93Q291bnRyaWVzQnV0dG9uID0gc2hvd0NvdW50cmllc0J1dHRvbjtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50MjAxNScsXG5cdFx0XHRzaXplOiA1LFxuXHRcdFx0aGlkZU51bWJlcmluZzogdHJ1ZSxcblx0XHRcdHdpZHRoOjY1LFxuXHRcdFx0aGVpZ2h0OjY1XG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdC8vO1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZSh2bS5uYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdHZhciBpID0gdm0ucmVsYXRpb25zLmluZGV4T2YobmF0aW9uLmlzbyk7XG5cdFx0XHRcdFx0aWYgKGkgPT0gLTEpIHtcblx0XHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdGlvbi5pc28pXG5cdFx0XHRcdFx0XHR2bS5jb3VudHJpZXMucHVzaChuYXRpb24pO1xuXHRcdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZShuYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVswXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0XHRbNTAsIDUwXVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UubWFwTGF5ZXIuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93VGV4dCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdHRleHQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPT0gdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA8IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInRyZW5kaW5nX2Rvd25cIjtcblxuXHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfdXBcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93Q291bnRyaWVzQnV0dG9uKCkge1xuXHRcdFx0aWYgKHZtLnNob3dDb3VudHJpZXMpIHJldHVybiBcImFycm93X2Ryb3BfdXBcIjtcblx0XHRcdHJldHVybiBcImFycm93X2Ryb3BfZG93blwiO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGl0ZW1zQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2hvd0xpc3QgPSBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdCdzZWNlc3Npb24nLFxuXHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0J25hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnRvZ2dsZUl0ZW0gPSB0b2dnbGVJdGVtO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhpdGVtLCAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMpO1xuXHRcdFx0dmFyIGkgPSAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMuaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcyA9IFtcblx0XHRcdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdFx0XHQnYXV0b25vbXknLFxuXHRcdFx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHRcdFx0J2ludGVybmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHRcdFx0J290aGVyJ1xuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bmF0aW9uQ3RybCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkc3RhdGUsICRyb290U2NvcGUsIG5hdGlvbnMsIG5hdGlvbiwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5uYXRpb24gPSBuYXRpb247XG5cdFx0dm0uc2hvd01ldGhvZCA9IHNob3dNZXRob2Q7XG5cdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDVdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0dm0uY29sb3JzID0gWycjZDRlYmY3JywgJyM4N2NjZWInLCAnIzM2YThjNicsICcjMjY4Mzk5JywgJyMwZTYzNzcnXTtcblx0XHR2bS5yZWxhdGlvbnMgPSBbXTtcblx0XHR2bS5mZWF0dXJlZCA9IFtdO1xuXHRcdHZtLmNvbmZsaWN0ID0gbnVsbDtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRjb2xvcjogJyM0ZmIwZTUnLFxuXHRcdFx0ZmllbGQ6ICdpbnRlbnNpdHknLFxuXHRcdFx0c2l6ZTogNSxcblx0XHRcdGhpZGVOdW1iZXJpbmc6IHRydWUsXG5cdFx0XHR3aWR0aDo2NSxcblx0XHRcdGhlaWdodDo2NVxuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IFtdO1xuXG5cdFx0XHRuYXRpb25zLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaCh2bS5uYXRpb24uaXNvKTtcblx0XHRcdFx0dm0uZmVhdHVyZWQgPSBbXTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQodm0ubmF0aW9uLmlzbyk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmNvbmZsaWN0cywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuY291bnRyeUNsaWNrKGNvdW50cnlDbGljayk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gW107XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5uYXRpb24uY29uZmxpY3RzLCBmdW5jdGlvbihjb25mbGljdCkge1xuXHRcdFx0XHRcdGlmICghdm0uY29uZmxpY3QpIHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG5cdFx0XHRcdFx0aWYgKGNvbmZsaWN0LmludDIwMTUgPiB2bS5jb25mbGljdC5pbnQyMDE1KSB7XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29uZmxpY3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRpZihpdGVtID09IDEgKXtcblx0XHRcdFx0XHRcdFx0aWYodm0uZmVhdHVyZWQuaW5kZXhPZihrZXkpID09IC0xKXtcblx0XHRcdFx0XHRcdFx0XHR2bS5mZWF0dXJlZC5wdXNoKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSB2bS5mZWF0dXJlZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29uZmxpY3QubmF0aW9ucywgZnVuY3Rpb24obmF0aW9uKSB7XG5cdFx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuXHRcdFx0XHRcdFx0aWYgKGkgPT0gLTEgJiYgbmF0aW9uLmlzbyAhPSB2bS5uYXRpb24uaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdGlvbi5pc28pXG5cdFx0XHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUobmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94Jywgdm0ucmVsYXRpb25zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVsyXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFx0WzUwLCA1MF1cblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLm1hcExheWVyLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdH0pXG5cblxuXG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPT0gdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA8IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInRyZW5kaW5nX2Rvd25cIjtcblxuXHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfdXBcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0XHRpc286IGNvdW50cnkuaXNvXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7XG5cdFx0XHR2YXIgY29sb3JGdWxsID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0dmFyIG91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc28gPT0gdm0ubmF0aW9uLmlzbykge1xuXHRcdFx0XHRvdXRsaW5lID0ge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSg1NCw1Niw1OSwwLjgpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbG9yID0gY29sb3I7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiBvdXRsaW5lXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RzQ3RybCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJHN0YXRlLCAkcm9vdFNjb3BlLCAkc2NvcGUsIGNvbmZsaWN0cywgbmF0aW9ucywgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBSZXN0YW5ndWxhciwgRGlhbG9nU2VydmljZSwgRnVsbHNjcmVlbikge1xuXHRcdC8vXG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnJlYWR5ID0gZmFsc2U7XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uc2hvd01ldGhvZCA9IHNob3dNZXRob2Q7XG5cdFx0dm0uZ29GdWxsc2NyZWVuID0gZ29GdWxsc2NyZWVuO1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2FkZDlmMCcsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMDA1NTczJ107XG5cdFx0dm0udHlwZXNDb2xvcnMgPSB7XG5cdFx0XHRpbnRlcnN0YXRlOiAnIzY5ZDRjMycsXG5cdFx0XHRpbnRyYXN0YXRlOiAnI2I3YjdiNycsXG5cdFx0XHRzdWJzdGF0ZTogJyNmZjlkMjcnXG5cdFx0fTtcblx0XHR2bS5hY3RpdmUgPSB7XG5cdFx0XHRjb25mbGljdDogW10sXG5cdFx0XHR0eXBlOiBbMSwgMiwgM11cblx0XHR9O1xuXHRcdHZtLnRvZ2dsZUNvbmZsaWN0RmlsdGVyID0gdG9nZ2xlQ29uZmxpY3RGaWx0ZXI7XG5cdFx0dm0uY29uZmxpY3RGaWx0ZXIgPSBudWxsO1xuXG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0dm0ubmF0aW9ucyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5uYXRpb25zLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25mbGljdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRjYWxjSW50ZW5zaXRpZXMoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvL1x0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vfSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ29GdWxsc2NyZWVuKCkge1xuXG5cdFx0IGlmIChGdWxsc2NyZWVuLmlzRW5hYmxlZCgpKVxuXHRcdFx0XHRGdWxsc2NyZWVuLmNhbmNlbCgpO1xuXHRcdCBlbHNlXG5cdFx0XHRcdEZ1bGxzY3JlZW4uYWxsKCk7XG5cblx0XHQgLy8gU2V0IEZ1bGxzY3JlZW4gdG8gYSBzcGVjaWZpYyBlbGVtZW50IChiYWQgcHJhY3RpY2UpXG5cdFx0IC8vIEZ1bGxzY3JlZW4uZW5hYmxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nJykgKVxuXG5cdH1cblx0XHRmdW5jdGlvbiBzZXRWYWx1ZXMoKSB7XG5cdFx0XHR2bS5yZWxhdGlvbnMgPSBbXTtcblx0XHRcdHZtLmNvbmZsaWN0RmlsdGVyQ291bnQgPSAwO1xuXHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcyA9IHtcblx0XHRcdFx0dmVyeUxvdzogMCxcblx0XHRcdFx0bG93OiAwLFxuXHRcdFx0XHRtaWQ6IDAsXG5cdFx0XHRcdGhpZ2g6IDAsXG5cdFx0XHRcdHZlcnlIaWdoOiAwXG5cdFx0XHR9O1xuXHRcdFx0dm0uY2hhcnREYXRhID0gW3tcblx0XHRcdFx0bGFiZWw6IDEsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzBdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiAyLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1sxXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogMyxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMl1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDQsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzNdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiA1LFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1s0XVxuXHRcdFx0fV07XG5cblx0XHRcdHZtLmNvbmZsaWN0VHlwZXMgPSBbe1xuXHRcdFx0XHR0eXBlOiAnaW50ZXJzdGF0ZScsXG5cdFx0XHRcdHR5cGVfaWQ6IDEsXG5cdFx0XHRcdGNvbG9yOiAnIzY5ZDRjMycsXG5cdFx0XHRcdGNvdW50OiAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHR5cGU6ICdpbnRyYXN0YXRlJyxcblx0XHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRcdHR5cGVfaWQ6IDIsXG5cdFx0XHRcdGNvbG9yOiAnI2I3YjdiNydcblx0XHRcdH0sIHtcblx0XHRcdFx0dHlwZTogJ3N1YnN0YXRlJyxcblx0XHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRcdHR5cGVfaWQ6IDMsXG5cdFx0XHRcdGNvbG9yOiAnI2ZmOWQyNydcblx0XHRcdH1dO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd01ldGhvZCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdG1ldGhvZGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb25mbGljdEZpbHRlcih0eXBlKSB7XG5cblx0XHRcdHZhciBpID0gdm0uYWN0aXZlLnR5cGUuaW5kZXhPZih0eXBlKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUuc3BsaWNlKGksIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUucHVzaCh0eXBlKTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5hY3RpdmUudHlwZS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHR2bS5hY3RpdmUudHlwZSA9IFsxLCAyLCAzXTtcblx0XHRcdH1cblx0XHRcdGNhbGNJbnRlbnNpdGllcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNDb25mbGljdChjb25mbGljdCkge1xuXHRcdFx0dm0uY29uZmxpY3RGaWx0ZXJDb3VudCsrO1xuXHRcdFx0c3dpdGNoIChjb25mbGljdC50eXBlX2lkKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMF0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMV0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHZtLmNvbmZsaWN0VHlwZXNbMl0uY291bnQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKGNvbmZsaWN0LmludDIwMTUpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy52ZXJ5TG93Kys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVswXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5sb3crKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzFdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLm1pZCsrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMl0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMuaGlnaCsrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbM10udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUhpZ2grKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzRdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdH1cblx0XHRcdGFkZENvdW50cmllcyhjb25mbGljdC5uYXRpb25zKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gYWRkQ291bnRyaWVzKG5hdGlvbnMpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKG5hdGlvbnMsIGZ1bmN0aW9uKG5hdCl7XG5cdFx0XHRcdGlmKHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdC5pc28pID09IC0xKXtcblx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXQuaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhbGNJbnRlbnNpdGllcygpIHtcblx0XHRcdHNldFZhbHVlcygpO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0cywgZnVuY3Rpb24gKGNvbmZsaWN0KSB7XG5cdFx0XHRcdGlmICh2bS5hY3RpdmUudHlwZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUuaW5kZXhPZihjb25mbGljdC50eXBlX2lkKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRjYWxjQ29uZmxpY3QoY29uZmxpY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjYWxjQ29uZmxpY3QoY29uZmxpY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHZtLnJlYWR5ID0gdHJ1ZTtcblx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnJlZHJhdygpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuXHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5WydpbnRlbnNpdHknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0XHRpc286IGNvdW50cnkuaXNvXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdGlmKHZtLnJlbGF0aW9ucy5pbmRleE9mKGlzbykgPT0gLTEpe1xuXHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsICYmIGlzbykge1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsgLy8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Z1bGxMaXN0Rml0bGVyQ3RybCcsIGZ1bmN0aW9uKGNhdGVnb3JpZXMsIENvbnRlbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblxuICAgIHZtLmZpbHRlciA9IFtdO1xuICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICBjYXRlZ29yaWVzOntcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2bS5maWx0ZXIgPVtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgbGlzdENhdGVnb3JpZXMoaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgQ29udGVudFNlcnZpY2UuZmlsdGVyTGlzdCgnaW5kaWNhdG9ycycsY2F0RmlsdGVyLHZtLnNlbGVjdGlvbik7XG4gICAgICAgICAgQ29udGVudFNlcnZpY2UuZmlsdGVyTGlzdCgnaW5kaWNlcycsY2F0RmlsdGVyLHZtLnNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGFkZFRvRmlsdGVyKGlkKXtcbiAgICAgIHZhciBpZHggPSB2bS5maWx0ZXIuaW5kZXhPZihpZCk7XG4gICAgICBpZihpZHggPT0gLTEpe1xuICAgICAgICB2bS5maWx0ZXIucHVzaChpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpc3RDYXRlZ29yaWVzKGNhdCl7XG4gICAgICBhZGRUb0ZpbHRlcihjYXQuaWQpO1xuICAgICAgaWYoY2F0LmNoaWxkcmVuKXtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGNhdC5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgIGFkZFRvRmlsdGVyKGNoaWxkLmlkKTtcbiAgICAgICAgICBsaXN0Q2F0ZWdvcmllcyhjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gY2F0RmlsdGVyKGl0ZW0pe1xuXHRcdFx0XHRpZihpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID4gMCAmJiB2bS5maWx0ZXIubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRcdGlmKHZtLmZpbHRlci5pbmRleE9mKGNhdC5pZCkgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGdWxsTGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCBDb250ZW50U2VydmljZSwgY2F0ZWdvcmllcywgaW5kaWNhdG9ycywgaW5kaWNlcykge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHR2bS5pbmRpY2F0b3JzID0gaW5kaWNhdG9ycztcblx0XHR2bS5pbmRpY2VzID0gaW5kaWNlcztcblx0XHR2bS5maWx0ZXIgPSB7XG5cdFx0XHRzb3J0OiAndGl0bGUnLFxuXHRcdFx0dG9nZ2xlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXgubGlzdCcpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lmxpc3QuZmlsdGVyJyx7ZmlsdGVyOidjYXRlZ29yaWVzJ30pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZXNldEZpbHRlcignaW5kaWNhdG9ycycpO1xuXHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlc2V0RmlsdGVyKCdpbmRpY2VzJyk7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubGlzdCcpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtyZXR1cm4gQ29udGVudFNlcnZpY2UuY29udGVudC5pbmRpY2F0b3JzfSwgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuID09PSBvIClyZXR1cm47XG5cdFx0XHR2bS5pbmRpY2F0b3JzID0gbjtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmNvbnRlbnQuaW5kaWNlc30sIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiA9PT0gbyApcmV0dXJuO1xuXHRcdFx0dm0uaW5kaWNlcyA9IG47XG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkbWRNZWRpYSwgbGVhZmxldERhdGEsICRzdGF0ZSwkbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyLCAkdGltZW91dCl7XG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdCRyb290U2NvcGUuaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9naW4gPSBkb0xvZ2luO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVWaWV3ID0gdG9nZ2xlVmlldztcblxuXHRcdHZtLmF1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKHByb3ZpZGVyKXtcblx0XHRcdCRhdXRoLmF1dGhlbnRpY2F0ZShwcm92aWRlcik7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dpbigpe1xuXHRcdFx0JGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9nb3V0KCl7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdCRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHRmdW5jdGlvbiB0b2dnbGVWaWV3KCl7XG5cdFx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gISRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHQkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3ID0gJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCckcm9vdC5zaWRlYmFyT3BlbicsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRpZihuID09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7IHJldHVybiAkbWRNZWRpYSgnc20nKSB9LCBmdW5jdGlvbihzbWFsbCkge1xuXHQgICAgdm0uc21hbGxTY3JlZW4gPSBzbWFsbDtcblx0ICB9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgXG4gICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgnLCB7aXNfb2ZmaWNpYWw6IHRydWV9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICB2bS5pbmRpemVzID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csJG1kU2lkZW5hdiwgJHJvb3RTY29wZSwgJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UsIGRhdGEsIGNvdW50cmllcywgbGVhZmxldERhdGEsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly8gVmFyaWFibGUgZGVmaW5pdGlvbnNcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm1hcCA9IG51bGw7XG5cblx0XHR2bS5kYXRhU2VydmVyID0gZGF0YS5wcm9taXNlcy5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGRhdGEucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tID0gdm0ubXZ0Q291bnRyeUxheWVyICsgXCJfZ2VvbVwiO1xuXHRcdHZtLmlzb19maWVsZCA9IFZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzI7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cdFx0dm0uZ29Ub0luZGV4ID0gZ29Ub0luZGV4O1xuXG5cdFx0dm0uY2FsY1RyZWUgPSBjYWxjVHJlZTtcblxuXHRcdHZtLmlzUHJlbGFzdCA9IGlzUHJlbGFzdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0dm0uc3RydWN0dXJlU2VydmVyLnRoZW4oZnVuY3Rpb24oc3RydWN0dXJlKSB7XG5cdFx0XHRcdHZtLmRhdGFTZXJ2ZXIudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGlmICghdm0uc3RydWN0dXJlLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUuc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRcdCduYW1lJzogJ2RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiAnRGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCdiYXNlX2NvbG9yJzogJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKSdcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcyh2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvcik7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdHZtLnNldFN0YXRlKCRzdGF0ZS5wYXJhbXMuaXRlbSk7XG5cdFx0XHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGdldE5hdGlvbkJ5SXNvKGlzbykpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvL29uc29sZS5sb2codm0uY29tcGFyZS5jb3VudHJpZXMpO1xuXHRcdFx0XHRcdFx0Y291bnRyaWVzLnB1c2godm0uY3VycmVudC5pc28pO1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGNvdW50cmllcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0Ly8gVE9ETzogTU9WRSBUTyBHTE9CQUxcblx0XHRmdW5jdGlvbiBnb0JhY2soKSB7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnb1RvSW5kZXgoaXRlbSl7XG5cblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLHtcblx0XHRcdFx0aWQ6aXRlbS5pZCxcblx0XHRcdFx0bmFtZTppdGVtLm5hbWUsXG5cdFx0XHRcdGl0ZW06JHN0YXRlLnBhcmFtc1snaXRlbSddXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaXNQcmVsYXN0KCl7XG5cdFx0XHR2YXIgbGV2ZWxzRm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zdHJ1Y3R1cmUuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcblx0XHRcdFx0aWYoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0bGV2ZWxzRm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsZXZlbHNGb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2hvd1RhYkNvbnRlbnQoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQgPT0gJycgJiYgdm0udGFiQ29udGVudCA9PSAnJykge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHR2bS50b2dnbGVCdXR0b24gPSB2bS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGl0ZW0pIHtcblx0XHRcdHZtLnNldEN1cnJlbnQoZ2V0TmF0aW9uQnlJc28oaXRlbSkpO1xuXHRcdFx0ZmV0Y2hOYXRpb25EYXRhKGl0ZW0pO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVPcGVuKCkge1xuXHRcdFx0dm0ubWVudWVPcGVuID0gIXZtLm1lbnVlT3Blbjtcblx0XHRcdHZtLmNsb3NlSWNvbiA9IHZtLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cblx0XHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoaXNvKSB7XG5cdFx0XHRpZiAodm0ubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjYWxjUmFuaygpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHR2YXIga2FjayA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0XHQvL3ZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgJ3Njb3JlJywgJ2lzbycsIHRydWUpO1xuXHRcdFx0cmFuayA9IHZtLmRhdGEuaW5kZXhPZih2bS5jdXJyZW50KSArIDE7XG5cdFx0XHR2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6IHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0ZmllbGQ6IHZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJyxcblx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSkge1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHQvL1RPRE86IFJFTU9WRSwgTk9XIEdPVCBPV04gVVJMXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBQVVQgSU4gVklFV1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZURldGFpbHMoKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGV0YWlscyA9ICF2bS5kZXRhaWxzO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGZldGNoTmF0aW9uRGF0YShpc28pIHtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArICRzdGF0ZS5wYXJhbXMuaWQsIGlzbykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gTUFQIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmICghJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0NvbXBhcmlzb24od2FudCkge1xuXHRcdFx0aWYgKHdhbnQgJiYgIXZtLmNvbXBhcmUuYWN0aXZlIHx8ICF3YW50ICYmIHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb21wYXJpc29uKCkge1xuXHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMgPSBbdm0uY3VycmVudF07XG5cdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9ICF2bS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdGlmIChjb3VudHJ5ID09IG5hdCAmJiBuYXQgIT0gdm0uY3VycmVudCkge1xuXHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goY291bnRyeSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzb3MgPSBbXTtcblx0XHRcdHZhciBjb21wYXJlID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpc29zLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHRpZiAoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdGNvbXBhcmUucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgaXNvcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTogJHN0YXRlLnBhcmFtcy5pdGVtLFxuXHRcdFx0XHRcdGNvdW50cmllczogY29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpKTtcblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTc7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFZJRVdcblx0XHRmdW5jdGlvbiBzZXRUYWIoaSkge1xuXHRcdFx0Ly92bS5hY3RpdmVUYWIgPSBpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChkYXRhKSB7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmNvbHVtbl9uYW1lID09IHZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSkge1xuXHRcdFx0XHRcdHZtLm5vZGVQYXJlbnQgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdldFBhcmVudChpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNUcmVlKCkge1xuXHRcdFx0Z2V0UGFyZW50KHZtLnN0cnVjdHVyZSk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeU5hbWUobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBDT1VOVFJZXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlJc28oaXNvKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhjb2xvcikge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiB1cGRhdGVDYW52YXMoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cblx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblxuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZiAoaXNvICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKGZlYXR1cmUucHJvcGVydGllcy5uYW1lKVxuXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbScpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG4uaXNvKSB7XG5cdFx0XHRcdGlmIChvLmlzbykge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbby5pc29dLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0ZmV0Y2hOYXRpb25EYXRhKG4uaXNvKTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tuLmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnIHx8ICRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93Jykge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IG4uaXNvXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmIChuLmNvbG9yKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpZDogbi5pZCxcblx0XHRcdFx0XHRcdG5hbWU6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0XHRcdFx0Y291bnRyaWVzOiAkc3RhdGUucGFyYW1zLmNvdW50cmllc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc29cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdG5hbWU6IG4ubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Lyp2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXVxuXHRcdFx0XHRdKi9cblx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVsyXVsxXSwgbi5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRbMTAwLCAxMDBdXG5cdFx0XHRdO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHBhZCA9IFtcblx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdG1heFpvb206IDZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24oZXZ0LCB0KSB7XG5cblx0XHRcdFx0XHRpZiAoIXZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLm9wZW4oKTtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnLCBldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdChjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDaGVja0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSkge1xuXG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLnNlbGVjdGVkID0gW107XG4gICAgdm0ueWVhcmZpbHRlciA9ICcnO1xuXHRcdHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuXHRcdHZtLmRlbGV0ZVNlbGVjdGVkID0gZGVsZXRlU2VsZWN0ZWQ7XG5cdFx0dm0uZGVsZXRlQ29sdW1uID0gZGVsZXRlQ29sdW1uO1xuXHRcdHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblx0XHR2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuXHRcdHZtLnNlbGVjdEVycm9ycyA9IHNlbGVjdEVycm9ycztcbiAgICB2bS5zZWFyY2hGb3JFcnJvcnMgPSBzZWFyY2hGb3JFcnJvcnM7XG5cdFx0dm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuXHRcdC8vdm0uZWRpdENvbHVtbkRhdGEgPSBlZGl0Q29sdW1uRGF0YTtcblx0XHR2bS5lZGl0Um93ID0gZWRpdFJvdztcbiAgICB2bS55ZWFycyA9IFtdLCB2bS5nZW5kZXIgPSBbXTtcblx0XHR2bS5xdWVyeSA9IHtcblx0XHRcdGZpbHRlcjogJycsXG5cdFx0XHRvcmRlcjogJy1lcnJvcnMnLFxuXHRcdFx0bGltaXQ6IDE1LFxuXHRcdFx0cGFnZTogMVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjaGVja0RhdGEoKTtcbiAgICBcdGdldFllYXJzKCk7XG5cdFx0XHRnZXRHZW5kZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuICAgIGZ1bmN0aW9uIGdldFllYXJzKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgZGF0ID0gKCRmaWx0ZXIoJ2dyb3VwQnknKSh2bS5kYXRhLCAnZGF0YS4nK3ZtLm1ldGEuY291bnRyeV9maWVsZCApKTtcblx0ICAgICAgdm0ueWVhcnMgPSBbXTtcblx0XHRcdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0XHRcdHZhciBpbmRleCA9IG51bGw7XG5cdFx0XHQgIGFuZ3VsYXIuZm9yRWFjaChkYXQsZnVuY3Rpb24oZW50cnksIGkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5Lmxlbmd0aCA+IGxlbmd0aCl7XG5cdFx0XHRcdFx0XHRpbmRleCA9IGlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHQgICAgICBhbmd1bGFyLmZvckVhY2goZGF0W2luZGV4XSxmdW5jdGlvbihlbnRyeSl7XG5cdFx0XHRcdFx0aWYodm0ueWVhcnMuaW5kZXhPZihlbnRyeS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pID09IC0xKXtcblx0XHRcdFx0XHRcdCAgdm0ueWVhcnMucHVzaChlbnRyeS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pXG5cdFx0XHRcdFx0fVxuXHQgICAgICB9KTtcblx0XHRcdFx0dm0ueWVhcmZpbHRlciA9IHZtLnllYXJzWzBdO1xuXHRcdFx0fSk7XG4gICAgfVxuXHRcdGZ1bmN0aW9uIGdldEdlbmRlcigpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGRhdCA9ICgkZmlsdGVyKCdncm91cEJ5Jykodm0uZGF0YSwgJ2RhdGEuJyt2bS5tZXRhLmNvdW50cnlfZmllbGQgKSk7XG5cdCAgICAgIHZtLmdlbmRlciA9IFtdO1xuXHRcdFx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHRcdFx0dmFyIGluZGV4ID0gbnVsbDtcblx0XHRcdCAgYW5ndWxhci5mb3JFYWNoKGRhdCxmdW5jdGlvbihlbnRyeSwgaSl7XG5cdFx0XHRcdFx0aWYoZW50cnkubGVuZ3RoID4gbGVuZ3RoKXtcblx0XHRcdFx0XHRcdGluZGV4ID0gaVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdCAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRbaW5kZXhdLGZ1bmN0aW9uKGVudHJ5KXtcblx0XHRcdFx0XHRpZih2bS5nZW5kZXIuaW5kZXhPZihlbnRyeS5kYXRhW3ZtLm1ldGEuZ2VuZGVyX2ZpZWxkXSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0ICB2bS5nZW5kZXIucHVzaChlbnRyeS5kYXRhW3ZtLm1ldGEuZ2VuZGVyX2ZpZWxkXSlcblx0XHRcdFx0XHR9XG5cdCAgICAgIH0pO1xuXHRcdFx0XHR2bS5nZW5kZXJmaWx0ZXIgPSB2bS5nZW5kZXJbMF07XG5cdFx0XHR9KTtcbiAgICB9XG5cdFx0ZnVuY3Rpb24gc2VhcmNoKHByZWRpY2F0ZSkge1xuXHRcdFx0dm0uZmlsdGVyID0gcHJlZGljYXRlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcblx0XHRcdC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuXHRcdFx0Ly9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2hlY2tGb3JFcnJvcnMoaXRlbSkge1xuXHRcdFx0cmV0dXJuIGl0ZW0uZXJyb3JzLmxlbmd0aCA+IDAgPyAnbWQtd2FybicgOiAnJztcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGVkaXRDb2x1bW5EYXRhKGUsIGtleSl7XG5cdFx0ICB2bS50b0VkaXQgPSBrZXk7XG5cdFx0ICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG5cdFx0fSovXG5cdFx0ZnVuY3Rpb24gZGVsZXRlQ29sdW1uKGUsIGtleSkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uIChmaWVsZCwgbCkge1xuXHRcdFx0XHRcdGlmIChsID09IGtleSkge1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSl7XG5cdFx0XHRcdFx0XHRcdGlmKGVycm9yLmNvbHVtbiA9PSBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5lcnJvcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmRhdGFba10uZGF0YVtrZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IsIGspIHtcblx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy0tO1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmVycm9ycy0tO1xuXHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRpZiAodm0uZGF0YS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHR2bS5kZWxldGVEYXRhKCk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdEVycm9ycygpIHtcblx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlZGl0Um93KCkge1xuXHRcdFx0dm0ucm93ID0gdm0uc2VsZWN0ZWRbMF07XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlRGF0YSgpIHtcblx0XHRcdHZtLmRhdGEgPSBbXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JFcnJvcnMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKHJvdywgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoga2V5LFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcilcblx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLmNsZWFyRXJyb3JzID0gY2xlYXJFcnJvcnM7XG5cdFx0dm0uZmV0Y2hJc28gPSBmZXRjaElzbztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0Ly92bS5teURhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKTtcblx0XHRcdC8vY2hlY2tNeURhdGEoKTtcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGNoZWNrTXlEYXRhKCkge1xuXHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5tZXRhLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLmNvbHVtbiA9PSBmaWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm91bmQrKztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcblx0XHRcdFx0XHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGlmICh2bS5leHRlbmRpbmdDaG9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkKXtcblx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZXh0ZW5kRGF0YScsICRzY29wZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9Ki9cblxuXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0aWYgKCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiLyogfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmRhdGFba2V5XS5kYXRhW2tdID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKCFyb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcIjJcIixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcblx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0sXG5cdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkLFxuXHRcdFx0XHRcdFx0cm93OiBrZXlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrZXkpIHtcblx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcblx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcblxuXHRcdFx0aWYgKCF2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0XHR2bS5ub3RGb3VuZCA9IFtdO1xuXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcblx0XHRcdHZhciBpc29DaGVjayA9IDA7XG5cdFx0XHR2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHRpc29DaGVjayArPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gMSA6IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdGNhc2UgJ0NhYm8gVmVyZGUnOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVudHJpZXMucHVzaCh7XG5cdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdG5hbWU6IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgaXNvVHlwZSA9IGlzb0NoZWNrID49IChlbnRyaWVzLmxlbmd0aCAvIDIpID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnJlc2V0VG9TZWxlY3QoKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuXHRcdFx0XHRkYXRhOiBlbnRyaWVzLFxuXHRcdFx0XHRpc286IGlzb1R5cGVcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoY291bnRyeS5kYXRhLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvdW50cnkuZGF0YSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcblx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2codm0uZGF0YVtrXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkNvdWxkIG5vdCBsb2NhdGUgYSB2YWxpZCBpc28gbmFtZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmNvdW50cnlfZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdGlmIChJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKS5sZW5ndGgpIHtcblx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGZpZWxkIHNlbGVjdGlvbnMnLCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0dm0uZXh0ZW5kRGF0YSA9IGV4dGVuZERhdGE7XG5cblx0XHRmdW5jdGlvbiBleHRlbmREYXRhKCkge1xuXHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0dmFyIG1ldGEgPSBbXSxcblx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuXHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgdm0uYWRkRGF0YVRvLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcblx0XHR2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvKmlmICh2bS5tZXRhLnllYXJfZmllbGQpIHtcblx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHR9Ki9cblx0XHRcdGNoZWNrRGF0YSgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrRGF0YSgpIHtcblx0XHRcdGlmICghdm0uZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzYXZlRGF0YSh2YWxpZCkge1xuXHRcdFx0aWYgKHZhbGlkKSB7XG5cdFx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBub1llYXJzID0gW107XG5cdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG5cdFx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdFx0aWYoaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pe1xuXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdG5vWWVhcnMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZtLmluZGljYXRvcnNba2V5XS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIGZpZWxkID0ge1xuXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdCdkZXNjcmlwdGlvbic6IHZtLmluZGljYXRvcnNba2V5XS5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdzdHlsZV9pZCc6IHN0eWxlX2lkLFxuXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0dmFyIGNhdGVnb3JpZXMgPSBbXTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG5cdFx0XHRcdGlmKG5vWWVhcnMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbE1lbnVDdHJsJywgZnVuY3Rpb24oSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzTGVuZ3RoID0gT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoO1xuXG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBWZWN0b3JsYXllclNlcnZpY2UsJHRpbWVvdXQsSW5kZXhTZXJ2aWNlLGxlYWZsZXREYXRhLCB0b2FzdHIpe1xuICAgICAgICAvL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICB2bS5pbmRpY2F0b3JzID0gW107XG4gICAgICAgIHZtLnNjYWxlID0gXCJcIjtcbiAgICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgICB2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKTtcbiAgICAgICAgdm0uY291bnRyaWVzU3R5bGUgPSBjb3VudHJpZXNTdHlsZTtcbiAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjaGVja0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRGF0YSgpe1xuICAgICAgICAgIGlmKCF2bS5kYXRhKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgICAgdm0uaW5kaWNhdG9yID0gbjtcbiAgICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICAgIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG4gICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmluZGljYXRvcicsIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbykgcmV0dXJuO1xuICAgICAgICAgIGlmKHR5cGVvZiBuLnN0eWxlX2lkICE9IFwidW5kZWZpbmVkXCIgKXtcbiAgICAgICAgICAgIGlmKG4uc3R5bGVfaWQgIT0gby5zdHlsZV9pZCl7XG4gICAgICAgICAgICAgIGlmKG4uc3R5bGUpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBuLmNhdGVnb3JpZXMgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIGlmKG4uY2F0ZWdvcmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5jYXRlZ29yaWVzWzBdLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRBY3RpdmVJbmRpY2F0b3JEYXRhKG4pO1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9LHRydWUpO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gbWluTWF4KCl7XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgdm0ubWluID0gTWF0aC5taW4oaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV0sIHZtLm1pbik7XG4gICAgICAgICAgICAgIHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5tYXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuICAgICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgaWYoaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9PSBpc28pe1xuICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcbiAgICBcdFx0XHR2YXIgc3R5bGUgPSB7fTtcbiAgICBcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcbiAgICBcdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuICAgIFx0XHRcdHZhciBmaWVsZCA9IHZtLmluZGljYXRvci5jb2x1bW5fbmFtZTtcbiAgICBcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuICAgIFx0XHRcdHN3aXRjaCAodHlwZSkge1xuICAgIFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblxuICAgIFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG4gICAgXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG4gICAgICAgICAgICAgIHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcbiAgICBcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuICAgIFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcbiAgICBcdFx0XHRcdFx0XHRcdHNpemU6IDJcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdGJyZWFrO1xuXG4gICAgXHRcdFx0fVxuXG4gICAgXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSsnX2dlb20nKSB7XG4gICAgXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuICAgIFx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuICAgIFx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG4gICAgXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0XHRcdH07XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0fVxuICAgICAgICBmdW5jdGlvbiBzZXRDb3VudHJpZXMoKXtcbiAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuICAgICAgICAgIHZtLm12dFNvdXJjZS5yZWRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuICAgICAgICAgIG1pbk1heCgpO1xuICAgIFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG4gICAgXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICBcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0XHRzZXRDb3VudHJpZXMoKTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH0pO1xuICAgIFx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkc3RhdGUsIHRvYXN0ciwgRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgSW5kZXhTZXJ2aWNlLnJlc2V0SW5kaWNhdG9yKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgIHZtLnNlbGVjdEZvckVkaXRpbmcgPSBzZWxlY3RGb3JFZGl0aW5nO1xuICAgICAgdm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuICAgICAgdm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuICAgICAgdm0uY2hlY2tBbGwgPSBjaGVja0FsbDtcbiAgICAgIHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuICAgICAgZnVuY3Rpb24gc2VsZWN0Rm9yRWRpdGluZyhrZXkpe1xuICAgICAgICBpZih0eXBlb2YgSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LHtcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOmtleSxcbiAgICAgICAgICAgIHRpdGxlOmtleVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZtLmVkaXRpbmdJdGVtID0ga2V5O1xuICAgICAgICB2bS5pbmRpY2F0b3IgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG4gICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdGlmIChpdGVtLnRpdGxlICYmIGl0ZW0udHlwZSAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG4gIFx0XHRcdFx0cmV0dXJuIHRydWU7XG4gIFx0XHRcdH1cbiAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICBcdFx0fVxuICBcdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBpdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRyZXR1cm4gY2hlY2tCYXNlKGl0ZW0pICYmIGl0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gIFx0XHR9XG4gICAgICBmdW5jdGlvbiBjaGVja0FsbCgpe1xuICAgICAgICB2YXIgZG9uZSA9IDA7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbihpbmRpY2F0b3Ipe1xuICAgICAgICAgIGlmKGNoZWNrQmFzZShpbmRpY2F0b3IpKXtcbiAgICAgICAgICAgIGRvbmUgKys7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkb25lLCBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpO1xuICAgICAgICBpZihkb25lID09IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aCl7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gc2F2ZURhdGEoKSB7XG5cbiAgICAgICAgICBpZighdm0ubWV0YS55ZWFyX2ZpZWxkICYmICF2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFllYXInLCAkc2NvcGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcbiAgXHRcdFx0XHRcdGRhdGE6IFtdXG4gIFx0XHRcdFx0fTtcbiAgXHRcdFx0XHR2YXIgbm9ZZWFycyA9IFtdO1xuICBcdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG4gIFx0XHRcdFx0XHRmaWVsZHMgPSBbXTtcbiAgXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG4gIFx0XHRcdFx0XHRcdGlmKGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKXtcbiAgXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG4gIFx0XHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuICBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuICBcdFx0XHRcdFx0XHRcdH1cblxuICBcdFx0XHRcdFx0XHRcdHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gIFx0XHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdFx0ZWxzZXtcbiAgICAgICAgICAgICAgICBpZih2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgICAgICAgaXRlbS5kYXRhLnllYXIgPSB2bS5tZXRhLnllYXI7XG4gICAgICAgICAgICAgICAgICB2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICBcdG5vWWVhcnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICBcdFx0XHRcdFx0XHR9XG5cblxuICBcdFx0XHRcdFx0fSBlbHNlIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcbiAgXHRcdFx0XHRcdFx0cmV0dXJuO1xuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdH0pO1xuICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gIFx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcbiAgXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcbiAgXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuICBcdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZhciBmaWVsZCA9IHtcbiAgXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuICBcdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcbiAgXHRcdFx0XHRcdFx0XHQnZGVzY3JpcHRpb24nOiB2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG4gIFx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcbiAgXHRcdFx0XHRcdFx0XHQnc3R5bGVfaWQnOiBzdHlsZV9pZCxcbiAgXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG4gIFx0XHRcdFx0XHRcdH07XG4gIFx0XHRcdFx0XHRcdHZhciBjYXRlZ29yaWVzID0gW107XG4gIFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuICBcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuICBcdFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIFx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgXHRcdFx0XHRpZihub1llYXJzLmxlbmd0aCA+IDApe1xuICBcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0XHR9XG5cbiAgXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIFx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gIFx0XHRcdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuICBcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG4gIFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gIFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG4gIFx0XHRcdFx0XHRcdFx0dm0uZGF0YSA9IFtdO1xuICBcdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgXHRcdFx0XHRcdH0pO1xuICBcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0fSlcblxuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY29weVRvT3RoZXJzKCl7XG4gICAgICAvKiAgdm0ucHJlUHJvdmlkZXIgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmRhdGFwcm92aWRlcjtcbiAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb3B5cHJvdmlkZXInLCAkc2NvcGUpOyovXG4gICAgICB9XG4gICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICB2bS5pbmRpY2F0b3JzW24uY29sdW1uX25hbWVdID0gbjtcbiAgICAgIH0sdHJ1ZSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZiAobiA9PT0gbyB8fCB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiIHx8IG8gPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZighdm0uYXNrZWRUb1JlcGxpY2F0ZSkge1xuICAgICAgICAgIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICAgIHZtLnByZVR5cGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnR5cGU7XG4gICAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgICB2bS5wcmVTdHlsZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uc3R5bGU7XG5cbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL24uZGF0YXByb3ZpZGVyID0gdm0uZG9Qcm92aWRlcnMgPyB2bS5wcmVQcm92aWRlciA6IFtdO1xuICAgICAgICAgIC8vbi5tZWFzdXJlX3R5cGVfaWQgPSB2bS5kb01lYXN1cmVzID8gdm0ucHJlTWVhc3VyZSA6IDA7XG4gICAgICAgICAgLy9uLmNhdGVnb3JpZXMgPSB2bS5kb0NhdGVnb3JpZXMgPyB2bS5wcmVDYXRlZ29yaWVzOiBbXTtcbiAgICAgICAgICAvL24uaXNfcHVibGljID0gdm0uZG9QdWJsaWMgPyB2bS5wcmVQdWJsaWM6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUVudHJ5Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gVXNlclNlcnZpY2UubXlEYXRhKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFNZW51Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLmRhdGEgPSBbXTtcblxuICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgVXNlclNlcnZpY2UubXlEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB2bS5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnZlcnRJbmZvKCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRJbmZvKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBpdGVtLm1ldGEgPSBKU09OLnBhcnNlKGl0ZW0ubWV0YV9kYXRhKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uICgkc3RhdGUsIGNhdGVnb3J5LCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uY2F0ZWdvcnkgPSBjYXRlZ29yeTtcblx0XHR2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHR2bS5vcHRpb25zID0ge1xuXHRcdFx0Z2xvYmFsU2F2ZTp0cnVlLFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmRhdGEuaWR9KVxuXHRcdFx0fSxcblx0XHR9XG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCwkc3RhdGUsIGluZGljYXRvcnMsIGluZGljZXMsIHN0eWxlcywgY2F0ZWdvcmllcywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLmNvbXBvc2l0cyA9IGluZGljZXM7XG5cdFx0dm0uc3R5bGVzID0gc3R5bGVzO1xuXHRcdHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXHRcdHZtLmNoZWNrVGFiQ29udGVudCA9IGNoZWNrVGFiQ29udGVudDtcblxuXHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLnNlbGVjdGlvbiA9IHtcblx0XHRcdGluZGljZXM6W10sXG5cdFx0XHRpbmRpY2F0b3JzOltdLFxuXHRcdFx0c3R5bGVzOltdLFxuXHRcdFx0Y2F0ZWdvcmllczpbXVxuXHRcdH07XG5cblxuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRjb21wb3NpdHM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjb21wb3NpdHMnLFxuXHRcdFx0XHRhbGxvd01vdmU6ZmFsc2UsXG5cdFx0XHRcdGFsbG93RHJvcDpmYWxzZSxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0aXRlbUNsaWNrOiBmdW5jdGlvbihpZCwgbmFtZSl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtpZDppZCwgbmFtZTpuYW1lfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOjAsIG5hbWU6ICduZXcnfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmluZGljZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5pbmRpY2VzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjYXRlZ29yaWVzOntcblx0XHRcdFx0ZHJhZzpmYWxzZSxcblx0XHRcdFx0dHlwZTonY2F0ZWdvcmllcycsXG5cdFx0XHRcdGFsbG93QWRkOnRydWUsXG5cdFx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRcdGFkZENsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6J25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblxuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmlkfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmNhdGVnb3JpZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUNhdGVnb3J5KGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzdHlsZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidzdHlsZXMnLFxuXHRcdFx0XHR3aXRoQ29sb3I6dHJ1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblxuXHRcdGZ1bmN0aW9uIGNoZWNrVGFiQ29udGVudChpbmRleCl7XG5cdFx0XHRzd2l0Y2ggKGluZGV4KSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiAkc3RhdGUucGFyYW1zLmlkICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiRzdGF0ZS5wYXJhbXMuaWRcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuXHRcdCAgaWYodHlwZW9mIHRvUGFyYW1zLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uYWN0aXZlID0gdG9QYXJhbXMuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDE7XG5cdFx0XHRcdC8vYWN0aXZhdGUodG9QYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kaWNhdG9yKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvciA9IGluZGljYXRvcjtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0c2V0QWN0aXZlKCk7XG5cblx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTtcblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWluTWF4KCl7XG5cdFx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHRcdHZtLm1heCA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHR2bS5taW4gPSBNYXRoLm1pbihpdGVtLnNjb3JlLCB2bS5taW4pO1xuXHRcdFx0XHRcdHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uc2NvcmUsIHZtLm1heCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcblx0XHRcdHZhciB2YWx1ZSA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0IGlmKGl0ZW0uaXNvID09IGlzbyl7XG5cdFx0XHRcdFx0IHZhbHVlID0gaXRlbS5zY29yZTtcblx0XHRcdFx0IH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KHZtLnNjYWxlKHZhbHVlKSkpICogNDtcblx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRzZXRBY3RpdmUoKTtcblx0XHR9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGluaWRjYXRvcnNDdHJsJywgZnVuY3Rpb24gKGluZGljYXRvcnMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0Ly9cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXG5cbiAgfSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpemVzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwkdGltZW91dCwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgQ29udGVudFNlcnZpY2UsIGluZGV4KSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIC8vdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuICAgIHZtLmluZGV4ID0gaW5kZXg7XG5cdFx0dm0uc2NhbGUgPSBcIlwiO1xuXHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdHZtLm1heCA9IDA7XG5cdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRzZXRBY3RpdmUoKTtcbiAgICB2bS5vcHRpb25zID0ge1xuICAgICAgaW5kaXplczp7XG4gICAgICAgIGFkZENsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJyk7XG4gICAgICAgIH0sXG5cdFx0XHRcdGFkZENvbnRhaW5lckNsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSB7XG5cdFx0XHRcdFx0XHR0aXRsZTogJ0kgYW0gYSBncm91cC4uLiBuYW1lIG1lJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dm0uaW5kZXguY2hpbGRyZW4ucHVzaChpdGVtKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bSk7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlRHJvcDogZnVuY3Rpb24oZXZlbnQsaXRlbSxleHRlcm5hbCx0eXBlKXtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZW1vdmVJdGVtKGl0ZW0sdm0uaW5kZXguY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cbiAgICAgIH0sXG4gICAgICB3aXRoU2F2ZTogdHJ1ZVxuICAgIH1cblxuXHRcdGFjdGl2ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gcmVtb3ZlSXRlbShpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0LypDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTsqL1xuXG5cdFx0ZnVuY3Rpb24gc2V0QWN0aXZlKCl7XG5cdFx0LypcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhjcmVhdG9yQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSxEYXRhU2VydmljZSwgJHRpbWVvdXQsJHN0YXRlLCAkZmlsdGVyLCBsZWFmbGV0RGF0YSwgdG9hc3RyLCBJY29uc1NlcnZpY2UsSW5kZXhTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2Upe1xuXG4gICAgICAgIC8vVE9ETzogQ2hlY2sgaWYgdGhlcmUgaXMgZGF0YSBpbiBzdG9yYWdlIHRvIGZpbmlzaFxuICAgICAgLyogIGNvbnNvbGUubG9nKCRzdGF0ZSk7XG4gICAgICAgIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5jcmVhdGUnKXtcbiAgICAgICAgICBpZihJbmRleFNlcnZpY2UuZ2V0RGF0YSgpLmxlbmd0aCl7XG4gICAgICAgICAgICBpZihjb25maXJtKCdFeGlzdGluZyBEYXRhLiBHbyBPbj8nKSl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBJbmRleFNlcnZpY2UuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1hcCA9IG51bGw7XG4gICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgdm0udG9TZWxlY3QgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSb3dzID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID1bXTtcbiAgICAgICAgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG5cbiAgICAgICAgdm0uZ3JvdXBzID0gW107XG4gICAgICAgIHZtLm15RGF0YSA9IFtdO1xuICAgICAgICB2bS5hZGREYXRhVG8gPSB7fTtcbiAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICB2bS5pc29fZXJyb3JzID0gMDtcbiAgICAgICAgdm0uaXNvX2NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHZtLnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgdm0ub3BlbkNsb3NlID0gb3BlbkNsb3NlO1xuICAgICAgICAvL3ZtLnNlYXJjaCA9IHNlYXJjaDtcblxuICAgICAgICB2bS5saXN0UmVzb3VyY2VzID0gbGlzdFJlc291cmNlcztcbiAgICAgICAgdm0udG9nZ2xlTGlzdFJlc291cmNlcyA9IHRvZ2dsZUxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2UgPSBzZWxlY3RlZFJlc291cmNlO1xuICAgICAgICB2bS50b2dnbGVSZXNvdXJjZSA9IHRvZ2dsZVJlc291cmNlO1xuICAgICAgICB2bS5pbmNyZWFzZVBlcmNlbnRhZ2UgPSBpbmNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLmRlY3JlYXNlUGVyY2VudGFnZSA9IGRlY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0udG9nZ2xlR3JvdXBTZWxlY3Rpb24gPSB0b2dnbGVHcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uZXhpc3RzSW5Hcm91cFNlbGVjdGlvbiA9IGV4aXN0c0luR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmFkZEdyb3VwID0gYWRkR3JvdXA7XG4gICAgICAgIHZtLmNsb25lU2VsZWN0aW9uID0gY2xvbmVTZWxlY3Rpb247XG4gICAgICAgIHZtLmVkaXRFbnRyeSA9IGVkaXRFbnRyeTtcbiAgICAgICAgdm0ucmVtb3ZlRW50cnkgPSByZW1vdmVFbnRyeTtcbiAgICAgICAgdm0uc2F2ZUluZGV4ID0gc2F2ZUluZGV4O1xuXG4gICAgICAgIHZtLmljb25zID0gSWNvbnNTZXJ2aWNlLmdldExpc3QoKTtcblxuICAgICAgICB2bS5tZXRhID0ge1xuICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICB9O1xuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcblxuICAgICAgICAvKnZtLnRyZWVPcHRpb25zID0ge1xuICAgICAgICAgIGJlZm9yZURyb3A6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgaWYoZXZlbnQuZGVzdC5ub2Rlc1Njb3BlICE9IGV2ZW50LnNvdXJjZS5ub2Rlc1Njb3BlKXtcbiAgICAgICAgICAgICAgdmFyIGlkeCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbW9kZWxWYWx1ZS5pbmRleE9mKGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICBpZihpZHggPiAtMSl7XG4gICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJCRhcHBseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ09ubHkgb25lIGVsZW1lbnQgb2YgYSBraW5kIHBlciBncm91cCBwb3NzaWJsZSEnLCAnTm90IGFsbG93ZWQhJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZHJvcHBlZDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTsqL1xuXG4gICAgICAgIC8vUnVuIFN0YXJ0dXAtRnVuY2l0b25zXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICAvL2NsZWFyTWFwKCk7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnJlc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb3BlbkNsb3NlKGFjdGl2ZSl7XG4gICAgICAgICAgcmV0dXJuIGFjdGl2ZSA/ICdyZW1vdmUnIDogJ2FkZCc7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJMYXllclN0eWxlKGZlYXR1cmUpe1xuICAgICAgXHRcdFx0dmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICBjb2xvcjoncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgICAgICAgIG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fVxuICAgICAgICAgICAgfTtcbiAgICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhck1hcCgpe1xuICAgICAgICAgIFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICAgICAgdm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNsZWFyTGF5ZXJTdHlsZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIHZtLnNob3dSZXNvdXJjZXMgPSAhdm0uc2hvd1Jlc291cmNlcztcbiAgICAgICAgICBpZih2bS5zaG93UmVzb3VyY2VzKXtcbiAgICAgICAgICAgIHZtLmxpc3RSZXNvdXJjZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIGlmKCF2bS5yZXNvdXJjZXMpe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICB2bS5yZXNvdXJjZXMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPSBbXSwgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgbGlzdCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIC8vaWYodHlwZW9mIGl0ZW0uaXNHcm91cCA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtID09IHJlc291cmNlKXtcbiAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZSh2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YoaXRlbSksMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBpdGVtLm5vZGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgdm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkR3JvdXAoKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonR3JvdXAnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIHZtLnNlbGVjdGVkRm9yR3JvdXApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsb25lU2VsZWN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0Nsb25lZCBFbGVtZW50cycsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdEVudHJ5KGl0ZW0pe1xuICAgICAgICAgIHZtLmVkaXRJdGVtID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVFbnRyeShpdGVtLCBsaXN0KXtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCBsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlSW5kZXgoKXtcbiAgICAgICAgICBpZih2bS5zYXZlRGlzYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmKHR5cGVvZiB2bS5uZXdJbmRleCA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXZtLm5ld0luZGV4LnRpdGxlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5uZXdJbmRleC5kYXRhID0gdm0uZ3JvdXBzO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2luZGV4Jywgdm0ubmV3SW5kZXgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91ciBJbmRleCBoYXMgYmVlbiBjcmVhdGVkJywgJ1N1Y2Nlc3MnKSxcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6cmVzcG9uc2UubmFtZX0pO1xuICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwnVXBwcyEhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyokc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICBpZighdm0uZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RhdGUubmFtZSkge1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJzpcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tNeURhdGEoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSA0O1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yU2hvd0N0cmwnLCBmdW5jdGlvbigkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCBpbmRpY2F0b3IsIGNvdW50cmllcywgQ29udGVudFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmN1cnJlbnQgPSBudWxsO1xuXHRcdHZtLmFjdGl2ZSA9IG51bGwsIHZtLmFjdGl2ZUdlbmRlciA9IG51bGw7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cdFx0dm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLmRhdGEgPSBbXTtcblx0XHR2bS55ZWFyID0gbnVsbCwgdm0uZ2VuZGVyID0gJ2FsbCc7XG5cdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRtYXg6IC0xMDAwMDAwMDAsXG5cdFx0XHRtaW46IDEwMDAwMDAwMFxuXHRcdH07XG5cdFx0dm0uZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdvSW5mb1N0YXRlID0gZ29JbmZvU3RhdGU7XG5cdFx0dm0uaGlzdG9yeURhdGEgPSBudWxsO1xuXG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uc2V0WWVhciA9IHNldFllYXI7XG5cdFx0dm0uc2V0R2VuZGVyID0gc2V0R2VuZGVyO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0cmVzZXRSYW5nZSgpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL1x0dm0ueWVhciA9ICRzdGF0ZS5wYXJhbXMueWVhcjtcblx0XHRcdFx0Ly9cdHZtLmdlbmRlciA9ICRzdGF0ZS5wYXJhbXMuZ2VuZGVyO1xuXHRcdFx0XHQvL2dldERhdGEoJHN0YXRlLnBhcmFtcy55ZWFyLCAkc3RhdGUucGFyYW1zLmdlbmRlcik7XG5cdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLnllYXIpIHtcblx0XHRcdFx0XHR2bS55ZWFyID0gJHN0YXRlLnBhcmFtcy55ZWFyO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm0uaW5kaWNhdG9yLnllYXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodm0uaW5kaWNhdG9yLnllYXJzW2ldLnllYXIgPT0gJHN0YXRlLnBhcmFtcy55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmFjdGl2ZSA9IGk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCF2bS5hY3RpdmUpIHtcblx0XHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZtLmluZGljYXRvci5nZW5kZXIpIHtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5nZW5kZXIgIT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0dm0uZ2VuZGVyID0gJHN0YXRlLnBhcmFtcy5nZW5kZXI7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZtLmluZGljYXRvci5nZW5kZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKHZtLmluZGljYXRvci5nZW5kZXJbaV0uZ2VuZGVyID09ICRzdGF0ZS5wYXJhbXMuZ2VuZGVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0dm0uYWN0aXZlR2VuZGVyID0gaTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIXZtLmFjdGl2ZUdlbmRlcikge1xuXHRcdFx0XHRcdFx0dm0uYWN0aXZlR2VuZGVyID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoIXZtLmFjdGl2ZUdlbmRlcikge1xuXHRcdFx0XHRcdHZtLmFjdGl2ZUdlbmRlciA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0RGF0YSh2bS55ZWFyLCB2bS5nZW5kZXIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzZXRSYW5nZSgpIHtcblx0XHRcdHZtLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IC0xMDAwMDAwMDAsXG5cdFx0XHRcdG1pbjogMTAwMDAwMDAwXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvSW5mb1N0YXRlKCkge1xuXG5cdFx0XHRpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvcicpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLmluZm8nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKCkge1xuXHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0XHRpc286IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0fSk7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGdldEhpc3RvcnkoKTtcblx0XHRcdH0pO1xuXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblx0XHRcdHZhciBjID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl0pO1xuXHRcdFx0aWYgKHR5cGVvZiBjLnNjb3JlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IGM7XG5cdFx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0SGlzdG9yeSgpIHtcblx0XHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckhpc3Rvcnkodm0uaW5kaWNhdG9yLmlkLCB2bS5jdXJyZW50Lmlzbywgdm0uZ2VuZGVyKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dm0uaGlzdG9yeURhdGEgPSBkYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRZZWFyKHllYXIpIHtcblx0XHRcdHZtLnllYXIgPSB5ZWFyO1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0XHR5ZWFyOiB5ZWFyLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDI1MCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRHZW5kZXIoZ2VuZGVyKSB7XG5cdFx0XHR2bS5nZW5kZXIgPSBnZW5kZXIgfHwgJ2FsbCc7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0XHRcdGdlbmRlcjogdm0uZ2VuZGVyXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgMjUwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREYXRhKHllYXIsIGdlbmRlcikge1xuXHRcdFx0Q29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSh2bS5pbmRpY2F0b3IuaWQsIHZtLnllYXIsIHZtLmdlbmRlcikudGhlbihmdW5jdGlvbihkYXQpIHtcblx0XHRcdFx0cmVzZXRSYW5nZSgpO1xuXHRcdFx0XHR2bS5kYXRhID0gZGF0O1xuXHRcdFx0XHR2YXIgaXNvID0gbnVsbDtcblx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXNvKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodm0uZGF0YVtpXS5pc28gPT0gJHN0YXRlLnBhcmFtcy5pc28pIHtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IHZtLmRhdGFbaV07XG5cdFx0XHRcdFx0XHRcdGlzbyA9IHZtLmN1cnJlbnQuaXNvO1xuXHRcdFx0XHRcdFx0XHQvL3NldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdGl0ZW0ucmFuayA9IHZtLmRhdGEuaW5kZXhPZihpdGVtKSArIDE7XG5cdFx0XHRcdFx0aWYgKHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLmlzbyA9PSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdFx0XHRzZXRDdXJyZW50KGl0ZW0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSBkMy5tYXgoW3ZtLnJhbmdlLm1heCwgcGFyc2VGbG9hdChpdGVtLnNjb3JlKV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IGQzLm1pbihbdm0ucmFuZ2UubWluLCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0Y29sb3I6IHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdFx0ZmllbGQ6ICdyYW5rJyxcblx0XHRcdFx0XHRzaXplOiB2bS5kYXRhLmxlbmd0aFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGdldE9mZnNldCgpO1xuXHRcdFx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLCB2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmRhdGEsIHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciwgdHJ1ZSk7XG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGNvdW50cmllc1N0eWxlLCBjb3VudHJ5Q2xpY2spO1xuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0aWYgKHZtLmN1cnJlbnQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblxuXHRcdHZtLnVpT25QYXJhbXNDaGFuZ2VkID0gZnVuY3Rpb24oY2hhbmdlZFBhcmFtcywgJHRyYW5zaXRpb24kKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGNoYW5nZWRQYXJhbXMpO1xuXHRcdFx0Z2V0RGF0YSh2bS55ZWFyLCB2bS5nZW5kZXIpO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsIGZ1bmN0aW9uICgkZmlsdGVyLCBkYXRhKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmRhdGEgPSBkYXRhO1xuICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblxuICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcblx0XHRcdHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG5cdFx0XHQvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuXHRcdH07XG5cblxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5wcmV2U3RhdGUgPSBudWxsO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICBcbiAgICAgICAgdm0udXNlciA9IHtcbiAgICAgICAgICBlbWFpbDonJyxcbiAgICAgICAgICBwYXNzd29yZDonJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICB2bS5jaGVja0xvZ2dlZEluKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0xvZ2dlZEluKCl7XG5cbiAgICAgICAgICBpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6J2VwaSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9Mb2dpbigpe1xuICAgICAgICAgICRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUucHJldmlvdXNQYWdlKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dvQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBsZWFmbGV0RGF0YSwgbGVhZmxldE1hcEV2ZW50cywgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB6b29tID0gMyxcblx0XHRcdG1pblpvb20gPSAyO1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCkge1xuXHRcdFx0em9vbSA9IDI7XG5cdFx0fVxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGFwaUtleSA9IFZlY3RvcmxheWVyU2VydmljZS5rZXlzLm1hcGJveDtcblx0XHR2bS50b2dnbGVMYXllcnMgPSB0b2dnbGVMYXllcnM7XG5cdFx0dm0uZGVmYXVsdHMgPSB7XG5cdFx0XHQvL3Njcm9sbFdoZWVsWm9vbTogZmFsc2UsXG5cdFx0XHRtaW5ab29tOiBtaW5ab29tLFxuXHRcdFx0bWF4Wm9vbTogNlxuXHRcdH07XG5cdFx0dm0uY2VudGVyID0ge1xuXHRcdFx0bGF0OiA0OC4yMDkyMDYsXG5cdFx0XHRsbmc6IDE2LjM3Mjc3OCxcblx0XHRcdHpvb206IHpvb21cblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ091dGRvb3InLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdFx0bGF5ZXJPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZGV0ZWN0UmV0aW5hOiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5sYWJlbHNMYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hZ25vbG8uMDYwMjlhOWMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LCB7XG5cdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0bmFtZTogJ2xhYmVscycsXG5cdFx0XHRkZXRlY3RSZXRpbmE6IHRydWVcblx0XHR9KTtcblx0XHR2bS5tYXhib3VuZHMgPSB7XG5cdFx0XHRzb3V0aFdlc3Q6IHtcblx0XHRcdFx0bGF0OiA5MCxcblx0XHRcdFx0bG5nOiAxODBcblx0XHRcdH0sXG5cdFx0XHRub3J0aEVhc3Q6IHtcblx0XHRcdFx0bGF0OiAtOTAsXG5cdFx0XHRcdGxuZzogLTE4MFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uY29udHJvbHMgPSB7XG5cdFx0XHRjdXN0b206IFtdXG5cdFx0fTtcblx0XHR2bS5sYXllcmNvbnRyb2wgPSB7XG5cdFx0XHRpY29uczoge1xuXHRcdFx0XHR1bmNoZWNrOiBcImZhIGZhLXRvZ2dsZS1vZmZcIixcblx0XHRcdFx0Y2hlY2s6IFwiZmEgZmEtdG9nZ2xlLW9uXCJcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgTXlDb250cm9sID0gTC5jb250cm9sKCk7XG5cdFx0TXlDb250cm9sLnNldFBvc2l0aW9uKCd0b3BsZWZ0Jyk7XG5cdFx0TXlDb250cm9sLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRNeUNvbnRyb2wub25BZGQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXIgbGVhZmxldC1jb250cm9sLXpvb20nKTtcblx0XHRcdHZhciBzcGFuID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICdsZWFmbGV0LWNvbnRyb2wtem9vbS1pbiBjdXJzb3InLCBjb250YWluZXIpO1xuXHRcdFx0c3Bhbi50ZXh0Q29udGVudCA9ICdUJztcblx0XHRcdHNwYW4udGl0bGUgPSBcIlRvZ2dsZSBMYWJlbHNcIjtcblx0XHRcdEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24oY29udGFpbmVyKTtcblx0XHRcdEwuRG9tRXZlbnQuYWRkTGlzdGVuZXIoY29udGFpbmVyLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0XHRtYXAucmVtb3ZlTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubm9MYWJlbCA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblx0XHR2YXIgQmFja0hvbWUgPSBMLmNvbnRyb2woKTtcblx0XHRCYWNrSG9tZS5zZXRQb3NpdGlvbigndG9wbGVmdCcpO1xuXHRcdEJhY2tIb21lLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRCYWNrSG9tZS5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhciBsZWFmbGV0LWNvbnRyb2wtem9vbSBsZWFmbGV0LWNvbnRyb2wtaG9tZScpO1xuXHRcdFx0dmFyIHNwYW4gPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJ2xlYWZsZXQtY29udHJvbC16b29tLWluIGN1cnNvcicsIGNvbnRhaW5lcik7XG5cdFx0XHR2YXIgaWNvbiA9IEwuRG9tVXRpbC5jcmVhdGUoJ21kLWljb24nLCAnbWF0ZXJpYWwtaWNvbnMgbWQtcHJpbWFyeScsIHNwYW4pO1xuXHRcdFx0c3Bhbi50aXRsZSA9IFwiQ2VudGVyIE1hcFwiO1xuXHRcdFx0aWNvbi50ZXh0Q29udGVudCA9IFwiaG9tZVwiO1xuXHRcdFx0TC5Eb21FdmVudC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbihjb250YWluZXIpO1xuXHRcdFx0TC5Eb21FdmVudC5hZGRMaXN0ZW5lcihjb250YWluZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0bWFwLnNldFZpZXcoWzQ4LjIwOTIwNiwgMTYuMzcyNzc4XSwgem9vbSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGF5ZXJzKG92ZXJsYXlOYW1lKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0bWFwLnJlbW92ZUxheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWFwLmFkZExheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldE1hcChtYXApO1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRkZXRlY3RSZXRpbmE6dHJ1ZSxcblx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbSddLFxuXHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdG1hcC5hZGRDb250cm9sKE15Q29udHJvbCk7XG5cdFx0XHRtYXAuYWRkQ29udHJvbChCYWNrSG9tZSk7XG5cdFx0XHQvKm1hcC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRhbGVydCgnaGVsbG8nKTtcblx0XHRcdH0pO1xuXG4gICAgICAgICAgICB2YXIgbWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gbWFwRXZlbnRzKXtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuJyArIG1hcEV2ZW50c1trXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtYXBFdmVudHNba10pXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cdFx0LypcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7Ki9cblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWRlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSwgRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIgPSB7fTtcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVGV4dDtcblxuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvZGF0YXByb3ZpZGVycycsIHZtLmRhdGFwcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZGF0YXByb3ZpZGVycy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLmRhdGFwcm92aWRlciA9IGRhdGE7XG4gICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVW5pdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0udW5pdCA9IHt9O1xuICAgICAgdm0udW5pdC50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFVuaXQ7XG5cbiAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vXG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL21lYXN1cmVfdHlwZXMnLCB2bS51bml0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWVhc3VyZVR5cGVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLnR5cGUgPSBkYXRhO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgIH07XG5cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkWWVhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52bSk7XG4gICAgICAgICAgICAkc2NvcGUudm0uc2F2ZURhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bWV0aG9kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdHRleHRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgXG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3B5cHJvdmlkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uYXNrZWRUb1JlcGxpY2F0ZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMgPSB0cnVlO1xuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLiRwYXJlbnQudm0uZGF0YVswXS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG5cdFx0XHRcdGlmIChrZXkgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSwge1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZToga2V5LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToga2V5XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFwcm92aWRlciA9ICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcykge1xuXHRcdFx0XHRcdFx0aXRlbS50eXBlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlVHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcykge1xuXHRcdFx0XHRcdFx0aXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlQ2F0ZWdvcmllcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmlzX3B1YmxpYyA9ICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlO1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlX2lkID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblxuXHRcdH07XG5cblx0XHQkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSBmYWxzZTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQmFyc0N0cmwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLndpZHRoID0gd2lkdGg7XG5cblx0XHRmdW5jdGlvbiB3aWR0aChpdGVtKSB7XG5cdFx0XHRpZighdm0uZGF0YSkgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIHZtLmRhdGFbaXRlbS5uYW1lXTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2JhcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9iYXJzL2JhcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL29wdGlvbnMuaGVpZ2h0ID0gb3B0aW9ucy53aWR0aCAqIDEuMTtcblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHt9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1Db2xvciA9IGdyb3VwLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRpZihncm91cC5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRtQ29sb3IgPSBncm91cC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogbUNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9IGl0ZW0uY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihpdGVtLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGl0ZW0uc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLnN0eWxlLmJhc2VfY29sb3IgfHwgc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLnR5cGU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSA/ICcjZmZmJyA6IGQuY29sb3I7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdGlmKGQudW5pY29kZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHNob3dfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQ7XG5cdFx0XHRcdFx0dmFyXHRiYXJPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0dGl0bGVkOnRydWVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSAnPG1kLXByb2dyZXNzLWxpbmVhciBtZC1tb2RlPVwiZGV0ZXJtaW5hdGVcIiB2YWx1ZT1cIicrZGF0YS52YWx1ZSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRpZihzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSA+IDAgKXtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPGRpdiBjbGFzcz1cInN1YlwiPic7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKydcIj48L21kLXByb2dyZXNzLWxpbmVhcj4nXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKycgLSAnICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPC9kaXY+Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vY29udGVudCA9ICc8YmFycyBvcHRpb25zPVwiYmFyT3B0aW9uc1wiIHN0cnVjdHVyZT1cImRhdGEuZGF0YS5jaGlsZHJlblwiIGRhdGE9XCJkYXRhXCI+PC9iYXJzPic7XG5cblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdpbmRleGVyJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgblswXS5jaGlsZHJlbiAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdFx0Y2xlYXJfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ2F0ZWdvcmllc0N0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRPcHRpb25zID0ge1xuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oY2F0ZWdvcnkpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjYXRlZ29yaWVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcmllc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLnNhdmVDYXRlZ29yeSA9IHNhdmVDYXRlZ29yeTtcblx0XHR2bS5xdWVyeVNlYXJjaENhdGVnb3J5ID0gcXVlcnlTZWFyY2hDYXRlZ29yeTtcblx0XHR2bS5wYXJlbnRDaGFuZ2VkID0gcGFyZW50Q2hhbmdlZDtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uc3R5bGVzID0gQ29udGVudFNlcnZpY2UuZ2V0U3R5bGVzKCk7XG5cdFx0dm0uZmxhdHRlbmVkID0gW107XG5cdFx0dm0uY29weSA9IHt9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbih2bS5jYXRlZ29yaWVzKTtcblx0XHRcdGlmKHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0dm0ucGFyZW50ID0gZ2V0UGFyZW50KHZtLml0ZW0sIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHR2bS5jb3B5ID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBmbGF0dGVuV2l0aENoaWxkcmVuKGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2bS5mbGF0dGVuZWQucHVzaChpdGVtKTtcblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbihpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaENhdGVnb3J5KHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKCRmaWx0ZXIoJ29yZGVyQnknKSh2bS5mbGF0dGVuZWQsICd0aXRsZScpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0XHQvL3JldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykoJGZpbHRlcignZmxhdHRlbicpKHZtLmNhdGVnb3JpZXMpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcGFyZW50Q2hhbmdlZChpdGVtKXtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLnBhcmVudF9pZCA9IG51bGw7XG5cdFx0XHRcdHZtLml0ZW0ucGFyZW50ID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoaXRlbS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGUgUGFyZW50IGNhbm5vdCBiZSB0aGUgc2FtZScsICdJbnZhbGlkIHNlbGVjdGlvbicpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5wYXJlbnQgPSBpdGVtO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnRfaWQgPSBpdGVtLmlkO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnQgPSBpdGVtO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoaXRlbSxsaXN0KXtcblx0XHRcdHZhciBmb3VuZCA9IG51bGxcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4gJiYgIWZvdW5kKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gZ2V0UGFyZW50KGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0Zm91bmQgPSBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbW92ZUl0ZW0oKXtcblx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkKXtcblx0XHRcdFx0XHR2YXIgb2xkUGFyZW50ID0gZ2V0UGFyZW50KHZtLmNvcHksIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvbGRQYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKXtcblx0XHRcdFx0XHRcdGlmKG9sZFBhcmVudC5jaGlsZHJlbltpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0b2xkUGFyZW50LmNoaWxkcmVuLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2bS5jYXRlZ29yaWVzLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRcdFx0aWYodm0uY2F0ZWdvcmllc1tpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMuc3BsaWNlKGksMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdHZhciBuZXdQYXJlbnQgPSBnZXRQYXJlbnQodm0uaXRlbSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdG5ld1BhcmVudC5jaGlsZHJlbi5wdXNoKHZtLml0ZW0pO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5jYXRlZ29yaWVzLnB1c2godm0uaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHN1Y2Nlc3NBY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5jb3B5LnBhcmVudF9pZCwgdm0uaXRlbS5wYXJlbnRfaWQpO1xuXHRcdFx0aWYodm0uY29weS5wYXJlbnRfaWQgIT0gdm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHQvL2lmKHZtLmNvcHkucGFyZW50X2lkICYmIHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0XHRtb3ZlSXRlbSgpO1xuXHRcdFx0Ly9cdH1cblx0XHRcdH1cblx0XHRcdHRvYXN0ci5zdWNjZXNzKCdDYXRlZ29yeSBoYXMgYmVlbiB1cGRhdGVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdCRzY29wZS5jYXRlZ29yeUZvcm0uJHNldFN1Ym1pdHRlZCgpO1xuXHRcdFx0dm0uY29weSA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZUNhdGVnb3J5KHZhbGlkKSB7XG5cdFx0XHRpZih2YWxpZCl7XG5cdFx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHRcdGlmKHZtLml0ZW0ucmVzdGFuZ3VsYXJpemVkKXtcblx0XHRcdFx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oc3VjY2Vzc0FjdGlvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS51cGRhdGUoJ2NhdGVnb3JpZXMnLCB2bS5pdGVtLmlkLCB2bS5pdGVtKS50aGVuKHN1Y2Nlc3NBY3Rpb24pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY2F0ZWdvcmllcycsIHZtLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKGRhdGEucGFyZW50X2lkICl7XG5cdFx0XHRcdFx0XHRcdFx0IHZhciBwYXJlbnQgPSBnZXRQYXJlbnQoZGF0YSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdFx0XHRcdFx0IGlmKCFwYXJlbnQuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbi5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuZXhwYW5kZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBDYXRlZ29yeSBoYXMgYmVlbiBzYXZlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0XHR2bS5vcHRpb25zLnBvc3REb25lKGRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY2F0ZWdvcnknLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yeS9jYXRlZ29yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDYXRlZ29yeUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9PycsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHR2YXIgIM+EID0gMiAqIE1hdGguUEk7XG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCAnMC42Jylcblx0XHRcdFx0XHQuYXR0cignZmlsbCcsICdub25lJyk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gJzFlbSc7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJzEuNWVtJztcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICcwLjM1ZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcwLjM3ZW0nXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblxuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHRoaXMudGV4dENvbnRlbnQuc3BsaXQoJ07CsCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZCksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lyokc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQoJHNjb3BlLml0ZW1bbi5maWVsZF0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnaXRlbScsXHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0Ly9pZihuID09PSBvKSByZXR1cm47XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0blskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyB8fCAhbikgcmV0dXJuO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29tcG9zaXRzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjb21wb3NpdHMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NvbXBvc2l0c0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29uZmxpY3RpdGVtcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGl0ZW1zQ3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29udGVudGVkaXRhYmxlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY29udGVudGVkaXRhYmxlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdC8vaWYgKCFuZ01vZGVsKSByZXR1cm47XG5cdFx0XHRcdG5nTW9kZWwuJHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRlbGVtZW50Lmh0bWwobmdNb2RlbC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBMaXN0ZW4gZm9yIGNoYW5nZSBldmVudHMgdG8gZW5hYmxlIGJpbmRpbmdcblx0XHRcdFx0ZWxlbWVudC5vbignYmx1ciBrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KHJlYWRWaWV3VGV4dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTm8gbmVlZCB0byBpbml0aWFsaXplLCBBbmd1bGFySlMgd2lsbCBpbml0aWFsaXplIHRoZSB0ZXh0IGJhc2VkIG9uIG5nLW1vZGVsIGF0dHJpYnV0ZVxuXG5cdFx0XHRcdC8vIFdyaXRlIGRhdGEgdG8gdGhlIG1vZGVsXG5cdFx0XHRcdGZ1bmN0aW9uIHJlYWRWaWV3VGV4dCgpIHtcblx0XHRcdFx0XHR2YXIgaHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xuXHRcdFx0XHRcdC8vIFdoZW4gd2UgY2xlYXIgdGhlIGNvbnRlbnQgZWRpdGFibGUgdGhlIGJyb3dzZXIgbGVhdmVzIGEgPGJyPiBiZWhpbmRcblx0XHRcdFx0XHQvLyBJZiBzdHJpcC1iciBhdHRyaWJ1dGUgaXMgcHJvdmlkZWQgdGhlbiB3ZSBzdHJpcCB0aGlzIG91dFxuXHRcdFx0XHRcdGlmIChhdHRycy5zdHJpcEJyICYmIGh0bWwgPT0gJzxicj4nKSB7XG5cdFx0XHRcdFx0XHRodG1sID0gJyc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShodG1sKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZpbGVEcm9wem9uZScsIGZ1bmN0aW9uICh0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG4gICAgICAgIGZpbGU6ICc9JyxcbiAgICAgICAgZmlsZU5hbWU6ICc9J1xuICAgICAgfSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0dmFyIGNoZWNrU2l6ZSwgaXNUeXBlVmFsaWQsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIsIHZhbGlkTWltZVR5cGVzO1xuXHRcdFx0XHRwcm9jZXNzRHJhZ092ZXJPckVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsaWRNaW1lVHlwZXMgPSBhdHRycy5maWxlRHJvcHpvbmU7XG5cdFx0XHRcdGNoZWNrU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG5cdFx0XHRcdFx0dmFyIF9yZWY7XG5cdFx0XHRcdFx0aWYgKCgoX3JlZiA9IGF0dHJzLm1heEZpbGVTaXplKSA9PT0gKHZvaWQgMCkgfHwgX3JlZiA9PT0gJycpIHx8IChzaXplIC8gMTAyNCkgLyAxMDI0IDwgYXR0cnMubWF4RmlsZVNpemUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkZpbGUgbXVzdCBiZSBzbWFsbGVyIHRoYW4gXCIgKyBhdHRycy5tYXhGaWxlU2l6ZSArIFwiIE1CXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aXNUeXBlVmFsaWQgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdFx0XHRcdGlmICgodmFsaWRNaW1lVHlwZXMgPT09ICh2b2lkIDApIHx8IHZhbGlkTWltZVR5cGVzID09PSAnJykgfHwgdmFsaWRNaW1lVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiRmlsZSBtdXN0IGJlIG9uZSBvZiBmb2xsb3dpbmcgdHlwZXMgXCIgKyB2YWxpZE1pbWVUeXBlcywgJ0ludmFsaWQgZmlsZSB0eXBlIScpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdvdmVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ2VudGVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmJpbmQoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSwgbmFtZSwgcmVhZGVyLCBzaXplLCB0eXBlO1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tTaXplKHNpemUpICYmIGlzVHlwZVZhbGlkKHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhzY29wZS5maWxlTmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5maWxlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG5cdFx0XHRcdFx0LypuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsqL1xuXHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0ZpbGVEcm9wem9uZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSGlzdG9yeUN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpe1xuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLnNldERhdGEgPSBzZXREYXRhO1xuXHRcdGFjdGl2YXRlKCk7XG5cdFxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3InLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHQvL3JlcXVpcmU6ICdpdGVtJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMsIGl0ZW1Nb2RlbCApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQvKnNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbU1vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyLCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBbXTtcblx0XHR2bS5kYXRhcHJvdmlkZXJzID0gW107XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gbnVsbDtcblx0XHR2bS5zZWFyY2hUZXh0ID0gbnVsbDtcblx0XHR2bS5zZWFyY2hVbml0ID0gbnVsbDtcblx0XHR2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuXHRcdHZtLnF1ZXJ5VW5pdCA9IHF1ZXJ5VW5pdDtcblxuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uY3JlYXRlUHJvdmlkZXIgPSBjcmVhdGVQcm92aWRlcjtcblx0XHR2bS5jcmVhdGVVbml0ID0gY3JlYXRlVW5pdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHF1ZXJ5VW5pdChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5tZWFzdXJlVHlwZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uZGF0YXByb3ZpZGVycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YXByb3ZpZGVycycpLiRvYmplY3Q7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5tZWFzdXJlVHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lYXN1cmVfdHlwZXMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnKS4kb2JqZWN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50eXBlICYmIHZtLml0ZW0uZGF0YXByb3ZpZGVyICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbCgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gY2hlY2tCYXNlKCkgJiYgdm0uaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZSgpe1xuXHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogSVRTIEEgSEFDSyBUTyBHRVQgSVQgV09SSzogbmctY2xpY2sgdnMgbmctbW91c2Vkb3duXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUHJvdmlkZXIodGV4dCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkUHJvdmlkZXInLCAkc2NvcGUpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVVbml0KHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFVuaXQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdCAgICB2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdCAgfVxuXHRcdH0sdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvck1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGl0ZW06ICc9aXRlbSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvck1lbnVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBjbCA9ICdhY3RpdmUnO1xuXHRcdFx0XHR2YXIgZWwgPSBlbGVtZW50WzBdO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnQoKTtcblx0XHRcdFx0cGFyZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhjbCk7XG5cdFx0XHRcdH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcyhjbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpY2F0b3JNZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5sb2NrZWQgPSBsb2NrZWQ7XG5cdFx0dm0uY2hhbmdlT2ZmaWNpYWwgPSBjaGFuZ2VPZmZpY2lhbDtcblxuXHRcdGZ1bmN0aW9uIGxvY2tlZCgpe1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uaXNfb2ZmaWNpYWwgPyAnbG9ja19vcGVuJyA6ICdsb2NrJztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hhbmdlT2ZmaWNpYWwoKXtcblx0XHRcdHZtLml0ZW0uaXNfb2ZmaWNpYWwgPSAhdm0uaXRlbS5pc19vZmZpY2lhbDtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG5cdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLm1lYXN1cmVfdHlwZV9pZCAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9ycycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvcnMvaW5kaWNhdG9ycy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0/Jyxcblx0XHRcdFx0aW5kaWNhdG9yczogJz1pdGVtcycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRhY3RpdmU6ICc9Pydcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yc0N0cmwnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNlbGVjdEFsbEdyb3VwID0gc2VsZWN0QWxsR3JvdXA7XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtO1xuXHRcdHZtLnRvZ2dsZVNlbGVjdGlvbiA9IHRvZ2dsZVNlbGVjdGlvbjtcblx0XHR2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuXG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0c29ydDondGl0bGUnLFxuXHRcdFx0cmV2ZXJzZTpmYWxzZSxcblx0XHRcdGxpc3Q6IDAsXG5cdFx0XHRwdWJsaXNoZWQ6IGZhbHNlLFxuXHRcdFx0dHlwZXM6IHtcblx0XHRcdFx0dGl0bGU6IHRydWUsXG5cdFx0XHRcdHN0eWxlOiBmYWxzZSxcblx0XHRcdFx0Y2F0ZWdvcmllczogZmFsc2UsXG5cdFx0XHRcdGluZm9ncmFwaGljOiBmYWxzZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGZhbHNlLFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uc2VhcmNoID0ge1xuXHRcdFx0cXVlcnk6ICcnLFxuXHRcdFx0c2hvdzogZmFsc2Vcblx0XHR9O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlTGlzdCA9IHRvZ2dsZUxpc3Q7XG5cblxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGlzdChrZXkpe1xuXHRcdFx0aWYodm0udmlzaWJsZUxpc3QgPT0ga2V5KXtcblx0XHRcdFx0dm0udmlzaWJsZUxpc3QgPSAnJztcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0ga2V5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdGVkSXRlbShpdGVtKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0QWxsKCl7XG5cdFx0XHRpZih2bS5zZWxlY3Rpb24ubGVuZ3RoKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdFx0aWYodm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSkge1xuXHRcdFx0dmFyIGluZGV4ID0gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbEdyb3VwKGdyb3VwKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWxldGVTZWxlY3RlZCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UucmVtb3ZlKCdpbmRpY2F0b3JzJywgaXRlbS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdHZtLmluZGljYXRvcnMuc3BsaWNlKHZtLmluZGljYXRvcnMuaW5kZXhPZihpdGVtKSwxKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvKiRzY29wZS4kd2F0Y2goJ3ZtLnNlYXJjaC5xdWVyeScsIGZ1bmN0aW9uIChxdWVyeSwgb2xkUXVlcnkpIHtcblx0XHRcdGlmKHF1ZXJ5ID09PSBvbGRRdWVyeSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0dm0ucXVlcnkgPSB2bS5maWx0ZXIudHlwZXM7XG5cdFx0XHR2bS5xdWVyeS5xID0gcXVlcnk7XG5cdFx0XHR2bS5pdGVtcyA9IENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh2bS5xdWVyeSk7XG5cdFx0fSk7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpemVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaXplcy9pbmRpemVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGl6ZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGl6ZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cdFx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0XHR2bS5iYXNlT3B0aW9ucyA9IHtcblx0XHRcdGRyYWc6dHJ1ZSxcblx0XHRcdGFsbG93RHJvcDp0cnVlLFxuXHRcdFx0YWxsb3dEcmFnOnRydWUsXG5cdFx0XHRhbGxvd01vdmU6dHJ1ZSxcblx0XHRcdGFsbG93U2F2ZTp0cnVlLFxuXHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdGFsbG93QWRkQ29udGFpbmVyOnRydWUsXG5cdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0ZWRpdGFibGU6dHJ1ZSxcblx0XHRcdGFzc2lnbWVudHM6IHRydWUsXG5cdFx0XHRzYXZlQ2xpY2s6IHNhdmUsXG5cdFx0XHRhZGRDbGljazogdm0ub3B0aW9ucy5pbmRpemVzLmFkZENsaWNrLFxuXHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDb250YWluZXJDbGljayxcblx0XHRcdGRlbGV0ZURyb3A6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVEcm9wLFxuXHRcdFx0ZGVsZXRlQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVDbGlja1xuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmNhdGVnb3JpZXMgPSBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHt0cmVlOnRydWV9KTtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC90eXBlcycpLiRvYmplY3Q7XG5cblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLml0ZW1fdHlwZV9pZCA9IDE7XG5cdFx0XHRcdHZtLml0ZW0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLml0ZW1fdHlwZV9pZCAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UudXBkYXRlSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6dm0uaXRlbS5pZCxuYW1lOnJlc3BvbnNlLm5hbWV9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLml0ZW0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdEYXRhIHN1Y2Nlc3NmdWxseSBzYXZlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UuYWRkSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6cmVzcG9uc2UuaWQsIG5hbWU6cmVzcG9uc2UubmFtZX0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW1zKGV2ZW50LCBpdGVtKXtcblx0XHQvL1x0Y29uc29sZS5sb2codm0uaXRlbSwgaXRlbSk7XG5cblx0XHR9XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uaXRlbScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiAhPSBvKSB7XG5cdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9ICFhbmd1bGFyLmVxdWFscyh2bS5pdGVtLCB2bS5vcmlnaW5hbCk7XG5cdFx0XHR9XG5cdFx0fSx0cnVlKTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtZWRpYW4nLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFt7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdHZhciBtYXggPSAwLFxuXHRcdFx0XHRcdG1pbiA9IDA7XG5cdFx0XHRcdG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChvcHRpb25zLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0b3B0aW9ucy51bmlxdWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMuY29sb3IpIHtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cblxuXHRcdFx0XHR2YXIgZWZmZWN0cyA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gZWZmZWN0cy5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkICsgb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJyk7XG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNoYWRvdyA9IGVmZmVjdHMuYXBwZW5kKFwiZmlsdGVyXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImRyb3Atc2hhZG93XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgXCIxNTAlXCIpO1xuXHRcdFx0XHR2YXIgc2hhZG93SW50ZW5zaXR5ID0gc2hhZG93LmFwcGVuZChcImZlR2F1c3NpYW5CbHVyXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpblwiLCBcIlNvdXJjZUFscGhhXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJzdGREZXZpYXRpb25cIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInJlc3VsdFwiLCBcImJsdXJcIik7XG5cdFx0XHRcdHZhciBzaGFkb3dQb3MgPSBzaGFkb3cuYXBwZW5kKFwiZmVPZmZzZXRcIilcblx0XHRcdFx0XHQuYXR0cihcImluXCIsIFwiYmx1clwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJyZXN1bHRcIiwgXCJvZmZzZXRCbHVyXCIpO1xuXG5cdFx0XHRcdHZhciBmZU1lcmdlID0gc2hhZG93LmFwcGVuZChcImZlTWVyZ2VcIik7XG5cdFx0XHRcdGZlTWVyZ2UuYXBwZW5kKFwiZmVNZXJnZU5vZGVcIilcblx0XHRcdFx0XHQuYXR0cihcImluXCIsIFwib2Zmc2V0Qmx1clwiKVxuXHRcdFx0XHRmZU1lcmdlLmFwcGVuZChcImZlTWVyZ2VOb2RlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpblwiLCBcIlNvdXJjZUdyYXBoaWNcIik7XG5cblx0XHRcdFx0dmFyIGJja2dybmQgPSBzdmcuYXBwZW5kKCdnJyk7XG5cdFx0XHRcdHZhciByZWN0ID0gYmNrZ3JuZC5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgcm91bmRlZF9yZWN0KDAsIDAsIG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0LCBvcHRpb25zLmhlaWdodCAvIDIsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCArIG9wdGlvbnMudW5pcXVlKSArICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KG1pbilcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQgLyAyLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsICdsb3dlclZhbHVlJyk7XG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQvL1RET0RPOiBDSGNraWNrIGlmIG5vIGNvbW1hIHRoZXJlXG5cdFx0XHRcdFx0XHRcdGlmIChtYXggPiAxMDAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpKSArIFwia1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0IC8gMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCAndXBwZXJWYWx1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBzbGlkZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJzbGlkZXJcIik7XG5cdFx0XHRcdGlmIChvcHRpb25zLmhhbmRsaW5nID09IHRydWUpIHtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAncmdiYSgwLDAsMCw4NyknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlQ29udCA9IHNsaWRlci5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLmhlaWdodCAvIDIgKyBcIilcIilcblx0XHRcdFx0XHQub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHNoYWRvd0ludGVuc2l0eS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5hdHRyKCdzdGREZXZpYXRpb24nLCAyKTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRzaGFkb3dJbnRlbnNpdHkudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMCkuYXR0cignc3RkRGV2aWF0aW9uJywgMSk7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbHRlclwiLCBcInVybCgjZHJvcC1zaGFkb3cpXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsICgob3B0aW9ucy5oZWlnaHQgLyAyKSArIG9wdGlvbnMuaGVpZ2h0IC8gMTApKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMuY29sb3IpIHtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCAnI2ZmZicgLypvcHRpb25zLmNvbG9yKi8gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0IC8gMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblx0XHRcdFx0ZnVuY3Rpb24gcm91bmRlZF9yZWN0KHgsIHksIHcsIGgsIHIsIHRsLCB0ciwgYmwsIGJyKSB7XG5cdFx0XHRcdFx0dmFyIHJldHZhbDtcblx0XHRcdFx0XHRyZXR2YWwgPSBcIk1cIiArICh4ICsgcikgKyBcIixcIiArIHk7XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKHcgLSAyICogcik7XG5cdFx0XHRcdFx0aWYgKHRyKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyByICsgXCIsXCIgKyByO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyByO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgKGggLSAyICogcik7XG5cdFx0XHRcdFx0aWYgKGJyKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAoMiAqIHIgLSB3KTtcblx0XHRcdFx0XHRpZiAoYmwpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIC1yICsgXCIsXCIgKyAtcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgLXI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgKDIgKiByIC0gaCk7XG5cdFx0XHRcdFx0aWYgKHRsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyByICsgXCIsXCIgKyAtcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ6XCI7XG5cdFx0XHRcdFx0cmV0dXJuIHJldHZhbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGxhYmVsaW5nKHZhbHVlKSB7XG5cdFx0XHRcdFx0aWYgKHBhcnNlSW50KHZhbHVlKSA+IDEwMDApIHtcblx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KHZhbHVlKSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykpICsgXCJrXCI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChsYWJlbGluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdGZpbmFsID0gbmF0O1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gXHRjb3VudCA9IDAsXG5cdFx0XHRcdFx0Ly8gXHRmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdC8vIHZhciBmaW5hbCA9IFwiXCI7XG5cdFx0XHRcdFx0Ly8gZG8ge1xuXHRcdFx0XHRcdC8vXG5cdFx0XHRcdFx0Ly8gXHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdC8vIFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBcdFx0XHRmaW5hbCA9IG5hdDtcblx0XHRcdFx0XHQvLyBcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0Ly8gXHRcdH1cblx0XHRcdFx0XHQvLyBcdH0pO1xuXHRcdFx0XHRcdC8vIFx0Y291bnQrKztcblx0XHRcdFx0XHQvLyBcdHZhbHVlID0gdmFsdWUgPiA1MCA/IHZhbHVlIC0gMSA6IHZhbHVlICsgMTtcblx0XHRcdFx0XHQvLyB9IHdoaWxlICghZm91bmQgJiYgY291bnQgPCBtYXgpO1xuXHRcdFx0XHRcdC8vXG5cdFx0XHRcdFx0Ly8gbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHQvLyBuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG4uY29sb3I7XG5cdFx0XHRcdFx0Z3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkICsgXCJfXCIgKyBuLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWN0LnN0eWxlKCdmaWxsJywgJ3VybCgjJyArIG9wdGlvbnMuZmllbGQgKyAnXycgKyBuLmNvbG9yICsgJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRpZiAobmdNb2RlbC4kbW9kZWxWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChsYWJlbGluZyhuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KDApKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgoMCkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChsYWJlbGluZyhuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHQvL1x0Y29uc29sZS5sb2cobik7XG5cdFx0XHRcdFx0bWluID0gMDtcblx0XHRcdFx0XHRtYXggPSAwO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24obmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdFx0aWYgKG5hdC5pc28gPT0gbmdNb2RlbC4kbW9kZWxWYWx1ZS5pc28pIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChsYWJlbGluZyhuYXRbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5hdFtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHRcdC5kb21haW4oW21pbiwgbWF4XSlcblx0XHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXHRcdFx0XHRcdGJydXNoLngoeClcblx0XHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0XHQub24oXCJicnVzaGVuZFwiLCBicnVzaGVkKTtcblx0XHRcdFx0XHRsZWdlbmQuc2VsZWN0KCcjbG93ZXJWYWx1ZScpLnRleHQobWluKTtcblx0XHRcdFx0XHRsZWdlbmQyLnNlbGVjdCgnI3VwcGVyVmFsdWUnKS50ZXh0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0aWYgKG1heCA+IDEwMDApIHtcblx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSkgKyBcImtcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlLmlzbykge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KGxhYmVsaW5nKG5hdFtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnTWVkaWFuQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwYXJzZUNvbmZsaWN0Q3N2JywgZnVuY3Rpb24oJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlQ29uZmxpY3RDc3ZDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG5hdGlvbnM6ICc9Jyxcblx0XHRcdFx0c3VtOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblxuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdHNjb3BlLm5hdGlvbnMgPSBbXTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRzdGVwOiBmdW5jdGlvbiAocm93KSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG51bWJlcnMgPSByb3cuZGF0YVswXS5jb25mbGljdHMubWF0Y2goL1swLTldKy9nKS5tYXAoZnVuY3Rpb24obilcblx0XHRcdFx0XHRcdFx0XHR7Ly9qdXN0IGNvZXJjZSB0byBudW1iZXJzXG5cdFx0XHRcdFx0XHRcdFx0ICAgIHJldHVybiArKG4pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLmV2ZW50cyA9IG51bWJlcnM7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuc3VtICs9IG51bWJlcnMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLm5hdGlvbnMucHVzaChyb3cuZGF0YVswXSk7XG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y29tcGxldGU6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZUNvbmZsaWN0Q3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwYXJzZUNvbmZsaWN0RXZlbnRzQ3N2JywgZnVuY3Rpb24oJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlQ29uZmxpY3RFdmVudHNDc3ZDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGV2ZW50czogJz0nLFxuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXHRzY29wZS5ldmVudHMgPSBbXTtcblx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRzdGVwOiBmdW5jdGlvbiAocm93KSB7XG5cdFx0XHRcdFx0XHRcdFx0c3dpdGNoIChyb3cuZGF0YVswXS50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnRlcnN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaW50cmFzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAyO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3N1YnN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDM7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZXJyb3JzLmxlbmd0aCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHNjb3BlLmV2ZW50cy5wdXNoKHJvdy5kYXRhWzBdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJvdyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RFdmVudHNDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdwYXJzZWNzdicsIGZ1bmN0aW9uICgkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIEluZGV4U2VydmljZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlY3N2Q3RybCcsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblxuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhQYXBhKTtcblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR3b3JrZXI6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHQvL0lGIFwic3RlcFwiIGluc3RlYWQgb2YgXCJjaHVua1wiID4gY2h1bmsgPSByb3cgYW5kIGNodW5rLmRhdGEgPSByb3cuZGF0YVswXVxuXHRcdFx0XHRcdFx0XHRjaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNodW5rLmRhdGEsIGZ1bmN0aW9uIChyb3csIGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOnt9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6W11cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIC8qfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBrZXksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ci5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5Lmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJhd0xpc3Rba2V5XS5kYXRhID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCI6IHIgPiByb3cuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHIuZGF0YSA9IHJvdztcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YShyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvL0NoZWNrIGlmIHRoZXJlIGFyZSBwb2ludHMgaW4gdGhlIGhlYWRlcnNcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBjaHVuay5tYXRjaCgvXFxyXFxufFxccnxcXG4vKS5pbmRleDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGVsaW1pdGVyID0gJywnO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoJywnKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPCAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoXCJcXHRcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxpbWl0ZXIgPSAnXFx0Jztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlzSXNvID0gW107XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksICdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkID0gaGVhZGluZ3NbaV0uc3BsaXQoJ18nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBoZWFkLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOYU4oaGVhZFtqXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gJ18nO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9IGhlYWRbal07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldLmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNJc28ucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3MubGVuZ3RoID09IGlzSXNvLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJhd0xpc3RbaGVhZGluZ3NbaV1dID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXSA9IHt9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gaGVhZGluZ3Muam9pbihkZWxpbWl0ZXIpICsgY2h1bmsuc3Vic3RyKGluZGV4KTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChlcnIsIGZpbGUpIHtcblx0XHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0RXJyb3JzKGVycm9ycyk7XG5cblx0XHRcdFx0XHRcdFx0XHQvL1NlZSBpZiB0aGVyZSBpcyBhbiBmaWVsZCBuYW1lIFwiaXNvXCIgaW4gdGhlIGhlYWRpbmdzO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghaXNWZXJ0aWNhbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKEluZGV4U2VydmljZS5nZXRGaXJzdEVudHJ5KCkuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdpc28nKSAhPSAtMSB8fCBrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb2RlJykgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY291bnRyeScpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldENvdW50cnlGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd5ZWFyJykgIT0gLTEgJiYgaXRlbS50b1N0cmluZygpLmxlbmd0aCA9PSA0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFllYXJGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdnZW5kZXInKSAhPSAtMSB8fCBrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdzZXgnKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRHZW5kZXJGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJhd0xpc3QsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9Mb3dlckNhc2UoKSAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNvOiBrZXkudG9VcHBlckNhc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZGF0YSwgZnVuY3Rpb24gKGNvbHVtbiwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0clsnY29sdW1uXycgKyBpXSA9IGNvbHVtbjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihjb2x1bW4pIHx8IGNvbHVtbiA8IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCJOQVwiIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMrKztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogW3JdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzOiBpdGVtLmVycm9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZCgnaXNvJyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHR0b2FzdHIuaW5mbyhJbmRleFNlcnZpY2UuZ2V0RGF0YVNpemUoKSArICcgbGluZXMgaW1wb3J0ZXQhJywgJ0luZm9ybWF0aW9uJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2Vjc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGllY2hhcnQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9waWVjaGFydC9waWVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQaWVjaGFydEN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRkYXRhOiAnPWNoYXJ0RGF0YScsXG5cdFx0XHRcdGFjdGl2ZVR5cGU6ICc9Jyxcblx0XHRcdFx0YWN0aXZlQ29uZmxpY3Q6ICc9Jyxcblx0XHRcdFx0Y2xpY2tJdDonJidcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdCBmdW5jdGlvbiBzZWdDb2xvcihjKXsgcmV0dXJuIHtpbnRlcnN0YXRlOlwiIzgwN2RiYVwiLCBpbnRyYXN0YXRlOlwiI2UwODIxNFwiLHN1YnN0YXRlOlwiIzQxYWI1ZFwifVtjXTsgfVxuXG5cdFx0XHRcdHZhciBwQyA9e30sIHBpZURpbSA9e3c6MTUwLCBoOiAxNTB9O1xuICAgICAgICBwaWVEaW0uciA9IE1hdGgubWluKHBpZURpbS53LCBwaWVEaW0uaCkgLyAyO1xuXG5cdFx0XHRcdHZhciBwaWVzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBpZURpbS53KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgcGllRGltLmgpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnb3V0ZXItcGllJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitwaWVEaW0udy8yK1wiLFwiK3BpZURpbS5oLzIrXCIpXCIpO1xuXHRcdFx0XHR2YXIgcGllc3ZnMiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGllRGltLncpXG5cdFx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdpbm5lci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cbiAgICAgICAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRvIGRyYXcgdGhlIGFyY3Mgb2YgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBhcmMgPSBkMy5zdmdcblx0XHRcdFx0XHQuYXJjKClcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMocGllRGltLnIgLSAxMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMocGllRGltLnIgLSAyMyk7XG4gICAgICAgIHZhciBhcmMyID0gZDMuc3ZnXG5cdFx0XHRcdFx0LmFyYygpXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKHBpZURpbS5yIC0gMjMpXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKDApO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgdGhlIHBpZSBzbGljZSBhbmdsZXMuXG4gICAgICAgIHZhciBwaWUgPSBkMy5sYXlvdXRcblx0XHRcdFx0XHQucGllKClcblx0XHRcdFx0XHQuc29ydChudWxsKVxuXHRcdFx0XHRcdC52YWx1ZShmdW5jdGlvbihkKSB7IHJldHVybiBkLmNvdW50OyB9KTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwaWUgc2xpY2VzLlxuICAgICAgICB2YXIgYzEgPSBwaWVzdmdcblx0XHRcdFx0XHRcdC5kYXR1bShzY29wZS5kYXRhKVxuXHRcdFx0XHRcdFx0LnNlbGVjdEFsbChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5kYXRhKHBpZSlcblx0XHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwicGF0aFwiKS5hdHRyKFwiZFwiLCBhcmMpXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHRoaXMuX2N1cnJlbnQgPSBkOyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIixtb3VzZW92ZXIpLm9uKFwibW91c2VvdXRcIixtb3VzZW91dCk7XG5cdFx0XHRcdHZhciBjMiA9IHBpZXN2ZzJcblx0XHRcdFx0XHRcdC5kYXR1bShzY29wZS5kYXRhKVxuXHRcdFx0XHRcdFx0LnNlbGVjdEFsbChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5kYXRhKHBpZSlcblx0XHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYzIpXG5cdFx0ICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHRoaXMuX2N1cnJlbnQgPSBkOyB9KVxuXHRcdCAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcblx0XHQgICAgICAgIC5vbignY2xpY2snLCBtb3VzZWNsaWNrKTtcbiAgICAgICAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRvIHVwZGF0ZSBwaWUtY2hhcnQuIFRoaXMgd2lsbCBiZSB1c2VkIGJ5IGhpc3RvZ3JhbS5cbiAgICAgICAgcEMudXBkYXRlID0gZnVuY3Rpb24obkQpe1xuICAgICAgICAgICAgcGllc3ZnLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobkQpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgIC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVdGlsaXR5IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBtb3VzZW92ZXIgYSBwaWUgc2xpY2UuXG5cdFx0XHRcdHZhciB0eXBldXMgPSBhbmd1bGFyLmNvcHkoc2NvcGUuYWN0aXZlVHlwZSk7XG5cdFx0XHRcdGZ1bmN0aW9uIG1vdXNlY2xpY2soZCl7XG5cdFx0XHRcdFx0c2NvcGUuY2xpY2tJdCh7dHlwZV9pZDpkLmRhdGEudHlwZV9pZH0pO1xuXHRcdFx0XHR9XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlb3ZlcihkKXtcbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBvZiBoaXN0b2dyYW0gd2l0aCBuZXcgZGF0YS5cblx0XHRcdFx0XHRcdHR5cGV1cyA9IGFuZ3VsYXIuY29weShzY29wZS5hY3RpdmVUeXBlKTtcbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZVR5cGUgPSBbZC5kYXRhLnR5cGVfaWRdO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9VdGlsaXR5IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBtb3VzZW91dCBhIHBpZSBzbGljZS5cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdXQoZCl7XG4gICAgICAgICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gb2YgaGlzdG9ncmFtIHdpdGggYWxsIGRhdGEuXG4gICAgICAgICAgICBzY29wZS5hY3RpdmVUeXBlID0gdHlwZXVzO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQW5pbWF0aW5nIHRoZSBwaWUtc2xpY2UgcmVxdWlyaW5nIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHNwZWNpZmllc1xuICAgICAgICAvLyBob3cgdGhlIGludGVybWVkaWF0ZSBwYXRocyBzaG91bGQgYmUgZHJhd24uXG4gICAgICAgIGZ1bmN0aW9uIGFyY1R3ZWVuKGEpIHtcbiAgICAgICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gaSgwKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiBhcmMoaSh0KSk7ICAgIH07XG4gICAgICAgIH1cblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4yKGEpIHtcbiAgICAgICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gaSgwKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiBhcmMyKGkodCkpOyAgICB9O1xuICAgICAgICB9XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHBpZXN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEocGllKG4pKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2Vlbik7XG5cdFx0XHRcdFx0cGllc3ZnMi5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEocGllKG4pKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbjIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BpZWNoYXJ0Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdyb3VuZGJhcicsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0Ly90ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcm91bmRiYXIvcm91bmRiYXIuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUm91bmRiYXJDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Y2hhcnREYXRhJyxcblx0XHRcdFx0YWN0aXZlVHlwZTogJz0nLFxuXHRcdFx0XHRhY3RpdmVDb25mbGljdDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0dmFyIG1hcmdpbiA9IHtcblx0XHRcdFx0XHRcdHRvcDogNDAsXG5cdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRib3R0b206IDMwLFxuXHRcdFx0XHRcdFx0bGVmdDogNDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHdpZHRoID0gMzAwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gMjAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20sXG5cdFx0XHRcdFx0YmFyV2lkdGggPSAyMCxcblx0XHRcdFx0XHRzcGFjZSA9IDI1O1xuXG5cblx0XHRcdFx0dmFyIHNjYWxlID0ge1xuXHRcdFx0XHRcdHk6IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdH07XG5cdFx0XHRcdHNjYWxlLnkuZG9tYWluKFswLCAyMjBdKTtcblx0XHRcdFx0c2NhbGUueS5yYW5nZShbaGVpZ2h0LCAwXSk7XG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cblx0XHRcdFx0Ly94LmRvbWFpbihzY29wZS5kYXRhLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLmxldHRlcjsgfSkpO1xuXHRcdFx0XHQvL3kuZG9tYWluKFswLCBkMy5tYXgoc2NvcGUuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mcmVxdWVuY3k7IH0pXSk7XG5cdFx0XHRcdHZhciBiYXJzID0gc3ZnLnNlbGVjdEFsbCgnLmJhcnMnKS5kYXRhKHNjb3BlLmRhdGEpLmVudGVyKCkuYXBwZW5kKFwiZ1wiKS5hdHRyKCdjbGFzcycsICdiYXJzJyk7IC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBpICogMjAgKyBcIiwgMClcIjsgfSk7O1xuXG5cdFx0XHRcdHZhciBiYXJzQmcgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgMCwgYmFyV2lkdGgsIChoZWlnaHQpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdiZycpO1xuXHRcdFx0XHR2YXIgdmFsdWVCYXJzID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJvdW5kZWRfcmVjdCgoaSAqIChiYXJXaWR0aCArIHNwYWNlKSksIChzY2FsZS55KGQudmFsdWUpKSwgYmFyV2lkdGgsIChoZWlnaHQgLSBzY2FsZS55KGQudmFsdWUpKSwgYmFyV2lkdGggLyAyLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi5hdHRyKCd4JywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzY2FsZS55KGQudmFsdWUpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KSovXG5cblx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvclxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LyoudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uKDMwMDApXG5cdFx0XHRcdFx0LmVhc2UoXCJxdWFkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSlcblx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdDtcblxuXHRcdFx0XHR2YXIgdmFsdWVUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpO1xuXG5cdFx0XHRcdHZhbHVlVGV4dC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnZhbHVlXG5cdFx0XHRcdFx0fSkuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgLTgpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsJyM0ZmIwZTUnKTtcblxuXHRcdFx0XHR2YXIgbGFiZWxzVGV4dCA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRsYWJlbHNUZXh0LnRleHQoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5sYWJlbFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpICogKGJhcldpZHRoICsgc3BhY2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGhlaWdodCArIDIwKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcldpZHRoXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRmdW5jdGlvbiByb3VuZGVkX3JlY3QoeCwgeSwgdywgaCwgciwgdGwsIHRyLCBibCwgYnIpIHtcblx0XHRcdFx0XHR2YXIgcmV0dmFsO1xuXHRcdFx0XHRcdHJldHZhbCA9IFwiTVwiICsgKHggKyByKSArIFwiLFwiICsgeTtcblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAodyAtIDIgKiByKTtcblx0XHRcdFx0XHRpZiAodHIpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIHIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAoaCAtIDIgKiByKTtcblx0XHRcdFx0XHRpZiAoYnIpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIC1yICsgXCIsXCIgKyByO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyByO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICgyICogciAtIHcpO1xuXHRcdFx0XHRcdGlmIChibCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIC1yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAoMiAqIHIgLSBoKTtcblx0XHRcdFx0XHRpZiAodGwpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIHIgKyBcIixcIiArIC1yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAtcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInpcIjtcblx0XHRcdFx0XHRyZXR1cm4gcmV0dmFsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHQvL3NjYWxlLnkuZG9tYWluKFswLCA1MF0pO1xuXG5cdFx0XHRcdFx0XHR2YWx1ZUJhcnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYm9yZGVycyA9IGJhcldpZHRoIC8gMjtcblx0XHRcdFx0XHRcdFx0XHRpZihzY29wZS5kYXRhW2ldLnZhbHVlIDw9IDEwKXtcblx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlcnMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoc2NvcGUuZGF0YVtpXS52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoc2NvcGUuZGF0YVtpXS52YWx1ZSkpLCBib3JkZXJzLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHZhbHVlVGV4dC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS50d2VlbigndGV4dCcsIGZ1bmN0aW9uIChkLGkpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGQudmFsdWUpLCBwYXJzZUludChzY29wZS5kYXRhW2ldLnZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fSkuZWFjaCgnZW5kJywgZnVuY3Rpb24oZCwgaSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC52YWx1ZSA9IHNjb3BlLmRhdGFbaV0udmFsdWU7XG5cdFx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUm91bmRiYXJDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTaW1wbGVsaW5lY2hhcnRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRkYXRhOic9Jyxcblx0XHRcdFx0c2VsZWN0aW9uOic9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblxuXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGludmVydDpmYWxzZVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2bS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgdm0ub3B0aW9ucyk7XG5cdFx0dm0uY29uZmlnID0ge1xuXHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZXh0ZW5kZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0YXV0b3JlZnJlc2g6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdHJlZnJlc2hEYXRhT25seTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hPcHRpb25zOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWVwV2F0Y2hEYXRhOiB0cnVlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdHZtLmNoYXJ0ID0ge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRjaGFydDoge31cblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBbXVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRzZXRDaGFydCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVDaGFydCgpe1xuXHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC5mb3JjZVkgPSBbdm0ucmFuZ2UubWF4LCB2bS5yYW5nZS5taW5dO1xuXHRcdH1cblx0IFx0ZnVuY3Rpb24gc2V0Q2hhcnQoKSB7XG5cdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0ZHVyYXRpb246MCxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHQvL3Nob3dZQXhpczogZmFsc2UsXG5cblx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdC8vdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdGZvcmNlWTogW3ZtLnJhbmdlLm1heCwgdm0ucmFuZ2UubWluXSxcblx0XHRcdFx0Ly95RG9tYWluOltwYXJzZUludCh2bS5yYW5nZS5taW4pLCB2bS5yYW5nZS5tYXhdLFxuXHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJ1llYXInLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodm0ub3B0aW9ucy5pbnZlcnQgPT0gdHJ1ZSkge1xuXHRcdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdm0uY2hhcnQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWluOiAxMDAwXG5cdFx0XHR9O1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSBNYXRoLm1heCh2bS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IE1hdGgubWluKHZtLnJhbmdlLm1pbiwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnJhbmdlLm1heCsrO1xuXHRcdFx0dm0ucmFuZ2UubWluLS07XG5cdFx0XHR2bS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYgKHZtLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0XHRjYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR1cGRhdGVDaGFydCgpO1xuXG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5zZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdC8vXHR1cGRhdGVDaGFydCgpO1xuXHRcdFx0Ly9jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmFuaW1hdGlvbignLnNsaWRlLXRvZ2dsZXMnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzdHlsZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N0eWxlcy9zdHlsZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3R5bGVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRzdHlsZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N0eWxlc0N0cmwnLCBmdW5jdGlvbiAodG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS50b2dnbGVTdHlsZSA9IHRvZ2dsZVN0eWxlO1xuXHRcdHZtLnNlbGVjdGVkU3R5bGUgPSBzZWxlY3RlZFN0eWxlO1xuXHRcdHZtLnNhdmVTdHlsZSA9IHNhdmVTdHlsZTtcblx0XHR2bS5zdHlsZSA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU3R5bGUoc3R5bGUpIHtcblx0XHRcdGlmICh2bS5pdGVtLnN0eWxlX2lkID09IHN0eWxlLmlkKSB7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGVfaWQgPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IHN0eWxlLmlkXG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBzdHlsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRTdHlsZShpdGVtLCBzdHlsZSkge1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVTdHlsZSgpIHtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ3N0eWxlcycsIHZtLnN0eWxlKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHZtLnN0eWxlcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHR2bS5jcmVhdGVTdHlsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLnN0eWxlID0gW107XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBkYXRhO1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnTmV3IFN0eWxlIGhhcyBiZWVuIHNhdmVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cblx0XHRcdFx0XHQvL3JldHVybiA7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnI2NjYyc7XG5cdFx0XHRcdFx0XHQvKnZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7Ki9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMDAnLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZW1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdUcmVlbWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRpdGVtOic9PycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/J1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdUcmVlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3RyZWV2aWV3JywgZnVuY3Rpb24oUmVjdXJzaW9uSGVscGVyKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRlZGl0V2VpZ2h0OmZhbHNlLFxuXHRcdFx0ZHJhZzogZmFsc2UsXG5cdFx0XHRlZGl0OiBmYWxzZSxcblx0XHRcdGNoaWxkcmVuOidjaGlsZHJlbidcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWV2aWV3L3RyZWV2aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWV2aWV3Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbXM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nLFxuXHRcdFx0XHRvcHRpb25zOic9PycsXG5cdFx0XHRcdGFjdGl2ZTogJz0/Jyxcblx0XHRcdFx0Y2xpY2s6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnNpb25IZWxwZXIuY29tcGlsZShlbGVtZW50LCBmdW5jdGlvbihzY29wZSwgaUVsZW1lbnQsIGlBdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZUZuKXtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmV4dGVuZChvcHRpb25zLCBzY29wZS52bS5vcHRpb25zKVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmluZSB5b3VyIG5vcm1hbCBsaW5rIGZ1bmN0aW9uIGhlcmUuXG4gICAgICAgICAgICAgICAgLy8gQWx0ZXJuYXRpdmU6IGluc3RlYWQgb2YgcGFzc2luZyBhIGZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gYWxzbyBwYXNzIGFuIG9iamVjdCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gYSAncHJlJy0gYW5kICdwb3N0Jy1saW5rIGZ1bmN0aW9uLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVHJlZXZpZXdDdHJsJywgZnVuY3Rpb24oJGZpbHRlcikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW07XG5cdFx0dm0uY2hpbGRTZWxlY3RlZCA9IGNoaWxkU2VsZWN0ZWQ7XG5cdFx0dm0udG9nZ2xlU2VsZWN0aW9uID0gdG9nZ2xlU2VsZWN0aW9uO1xuXHRcdHZtLm9uRHJhZ092ZXIgPSBvbkRyYWdPdmVyO1xuXHRcdHZtLm9uRHJvcENvbXBsZXRlID0gb25Ecm9wQ29tcGxldGU7XG5cdFx0dm0ub25Nb3ZlZENvbXBsZXRlID0gb25Nb3ZlZENvbXBsZXRlO1xuXHRcdHZtLmFkZENoaWxkcmVuID0gYWRkQ2hpbGRyZW47XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5zZWxlY3Rpb24gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQsIGluZGV4LCBleHRlcm5hbCwgdHlwZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ecm9wQ29tcGxldGUoZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gMCl7XG5cdFx0XHRcdFx0dm0uaXRlbXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdmVkQ29tcGxldGUoaW5kZXgsIGRhdGEsIGV2dCkge1xuXHRcdFx0aWYodm0ub3B0aW9ucy5hbGxvd01vdmUpe1xuXHRcdFx0XHRyZXR1cm4gdm0uaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIGluZGV4ID0gLTE7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihzZWxlY3RlZCwgaSl7XG5cdFx0XHRcdGlmKHNlbGVjdGVkLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZihpbmRleCA+IC0xKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiB2bS5vcHRpb25zLnNlbGVjdGlvbkNoYW5nZWQgPT0gJ2Z1bmN0aW9uJyApXG5cdFx0XHRcdHZtLm9wdGlvbnMuc2VsZWN0aW9uQ2hhbmdlZCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBhZGRDaGlsZHJlbihpdGVtKSB7XG5cblx0XHRcdGl0ZW0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdGVkSXRlbShpdGVtKSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKHNlbGVjdGVkKXtcblx0XHRcdFx0aWYoc2VsZWN0ZWQuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHQvKlx0aWYodm0uc2VsZWN0aW9uLmluZGV4T2YoYW5ndWxhci5jb3B5KGl0ZW0pKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7Ki9cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGlsZFNlbGVjdGVkKGl0ZW0pIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcblx0XHRcdFx0aWYodm0uc2VsZWN0aW9uLmluZGV4T2YoY2hpbGQpPiAtMSl7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFmb3VuZCl7XG5cdFx0XHRcdFx0Zm91bmQgPSAgY2hpbGRTZWxlY3RlZChjaGlsZCk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIHRvZ2dsZUl0ZW0oaXRlbSkge1xuXHRcdFx0aWYgKHR5cGVvZiB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9IFtdO1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2UsXG5cdFx0XHRcdGluZGV4ID0gLTE7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLCBmdW5jdGlvbihlbnRyeSwgaSkge1xuXHRcdFx0XHRpZiAoZW50cnkuaWQgPT0gaXRlbS5pZCkge1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRpbmRleCA9IGk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRpbmRleCA9PT0gLTEgPyB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0ucHVzaChpdGVtKSA6IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH0qL1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCd3ZWlnaHQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1dlaWdodEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6IHt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dlaWdodEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ucmFpc2VXZWlnaHQgPSByYWlzZVdlaWdodDtcblx0XHR2bS5sb3dlcldlaWdodCA9IGxvd2VyV2VpZ2h0O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0Y2FsY1N0YXJ0KCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1N0YXJ0KCkge1xuXG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW0ud2VpZ2h0ID09IFwidW5kZWZpbmVkXCIgfHwgIXZtLml0ZW0ud2VpZ2h0KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtcywgZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHRlbnRyeS53ZWlnaHQgPSAxMDAgLyB2bS5pdGVtcy5sZW5ndGg7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1ZhbHVlcygpIHtcblx0XHRcdHZhciBmaXhlZCA9IHZtLml0ZW0ud2VpZ2h0O1xuXHRcdFx0dmFyIHJlc3QgPSAoMTAwIC0gZml4ZWQpIC8gKHZtLml0ZW1zLmxlbmd0aCAtIDEpO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRpZiAoZW50cnkgIT09IHZtLml0ZW0pIHtcblx0XHRcdFx0XHRlbnRyeS53ZWlnaHQgPSByZXN0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJhaXNlV2VpZ2h0KCkge1xuXHRcdFx0aWYodm0uaXRlbS53ZWlnaHQgPj0gOTUpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmICh2bS5pdGVtLndlaWdodCAlIDUgIT0gMCkge1xuXHRcdFx0XHR2bS5pdGVtLndlaWdodCA9IDUgKiBNYXRoLnJvdW5kKHZtLml0ZW0ud2VpZ2h0IC8gNSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLndlaWdodCArPSA1O1xuXHRcdFx0fVxuXHRcdFx0Y2FsY1ZhbHVlcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxvd2VyV2VpZ2h0KCkge1xuXHRcdFx0aWYodm0uaXRlbS53ZWlnaHQgPD0gNSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KSAtIDU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLndlaWdodCAtPSA1O1xuXHRcdFx0fVxuXHRcdFx0Y2FsY1ZhbHVlcygpO1xuXHRcdH1cblxuXG5cdH0pO1xuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
