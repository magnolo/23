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


		angular.module('app.routes', ['ui.router', 'ngStorage', 'satellizer']);
		angular.module('app.controllers', ['FBAngular','dndLists','angular.filter','angularMoment','ngScrollbar','mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
		angular.module('app.filters', []);
		angular.module('app.services', ['angular-cache','ui.router', 'ngStorage', 'restangular', 'toastr']);
		angular.module('app.directives', ['ngMaterial','ngPapaParse']);
		angular.module('app.config', []);

})();

(function() {
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
		//	$locationProvider.html5Mode(true);
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
				views: {
					'main@': {
						templateUrl: getView('user'),
						controller: 'UserCtrl',
						controllerAs: 'vm',
						resolve: {
							profile: ["DataService", "$auth", function(DataService, $auth) {
								return DataService.getOne('me').$object;
							}]
						}
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
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorindicator.html',
						controller: 'IndexeditorindicatorCtrl',
						controllerAs: 'vm',
						resolve: {
							indicator: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
								return ContentService.getIndicator($stateParams.id)
							}]
						}
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
				views: {
					'additional@': {
						templateUrl: '/views/app/indexeditor/indicators.html',
						controller: 'IndexinidcatorsCtrl',
						controllerAs: 'vm',
						resolve: {
							indicators: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
								return ContentService.fetchIndicators({
									page: 1,
									order: 'title',
									limit: 1000,
									dir: 'ASC'
								});
							}]
						}
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
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorcategory.html',
						controller: 'IndexeditorcategoryCtrl',
						controllerAs: 'vm',
						resolve: {
							category: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
								if($stateParams.id == 'new'){
									return {};
								}
								return ContentService.getCategory($stateParams.id);
							}]
						}
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
			/*.state('app.index.indicator.year', {
				url: '/:year',
			})
			.state('app.index.indicator.year.gender', {
				url: '/:gender',
			})*/
			.state('app.index.indicator.info', {
				url: '/details',
				layout: 'row',
				resolve: {
					data: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.getIndicatorData($stateParams.id, $stateParams.year);
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
				views: {
					'sidebar@': {
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm',
						resolve: {
							data: ["IndizesService", "$stateParams", function(IndizesService, $stateParams) {
								return IndizesService.fetchData($stateParams.id);
							}],
							countries: ["CountriesService", function(CountriesService) {
								return CountriesService.getData();
							}]
						}
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
				return this.content.indicator = DataService.getOne('indicators/' + id).$object;
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

	angular.module('app.controllers').controller('IndicatorShowCtrl', ["$scope", "$state", "$filter", "$timeout", "indicator", "countries", "ContentService", "VectorlayerService", "toastr", function($scope, $state, $filter, $timeout, indicator, countries, ContentService, VectorlayerService, toastr) {
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
		vm.setCurrent = setCurrent;
		vm.getOffset = getOffset;
		vm.getRank = getRank;
		vm.goInfoState = goInfoState;
		vm.historyData = null;

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
				}
				else if (!vm.activeGender) {
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

		function setState(iso) {
			$timeout(function() {
				//console.log(VectorlayerService.getNationByIso(iso));
				//vm.current = VectorlayerService.getNationByIso(iso);
			})
		};

		function goInfoState() {
			// if ($state.current.name == 'app.index.indicator.year') {
			// 	$state.go('app.index.indicator.info', {
			// 		year: vm.year
			// 	});
			// } else {
			// 	$state.go('app.index.indicator', {
			// 		id: vm.indicator.id,
			// 		name: vm.indicator.name,
			// 		year: vm.year
			// 	});
			// }
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
			getHistory();
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
		function setYear(year){
			vm.year = year;
			$state.go('app.index.indicator', {
				year: year,
			});
		}
		function setGender(gender){
			vm.gender = gender || 'all';
			$state.go('app.index.indicator', {
				gender:vm.gender
			});
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
								setSelectedFeature();
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

(function () {
	"use strict";

	angular.module('app.directives').directive('median', ["$timeout", function ($timeout) {
		var defaults = function () {
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
				colors: [ {
					position: 0,
					color: 'rgba(102,102,102,1)',
					opacity: 1
				}, {
					position: 53,
					color: 'rgba(128, 243, 198,1)',
					opacity: 1
				},{
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
			link: function ($scope, element, $attrs, ngModel) {

				var options = angular.extend(defaults(), $attrs);
				var max = 0, min = 0;
				options = angular.extend(options, $scope.options);

				options.unique = new Date().getTime();
				if(options.color){
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');


				angular.forEach($scope.data, function (nat, key) {
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
				var gradient = svg.append('svg:defs')
					.append("svg:linearGradient")
					.attr('id', options.field+options.unique)
					.attr('x1', '0%')
					.attr('y1', '0%')
					.attr('x2', '100%')
					.attr('y2', '0%')
					.attr('spreadMethod', 'pad')
				angular.forEach(options.colors, function (color) {
					gradient.append('svg:stop')
						.attr('offset', color.position + '%')
						.attr('stop-color', color.color)
						.attr('stop-opacity', color.opacity);
				});
				var rect = svg.append('svg:rect')
					.attr('width', options.width)
					.attr('height', options.height)
					.style('fill', 'url(#' + (options.field+options.unique)+ ')');
				var legend = svg.append('g').attr('transform', 'translate(' + options.height / 2 + ', ' + options.height / 2 + ')')
					.attr('class', 'startLabel')

				if (options.info === true) {

					legend.append('circle')
						.attr('r', options.height / 2);
					legend.append('text')
						.text(min)
						.style('font-size', options.height/2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'lowerValue');
					var legend2 = svg.append('g').attr('transform', 'translate(' + (options.width - (options.height / 2)) + ', ' + options.height / 2 + ')')
						.attr('class', 'endLabel')
					legend2.append('circle')
						.attr('r', options.height / 2)
					legend2.append('text')
						.text(function(){
							//TDODO: CHckick if no comma there
							if(max > 1000){
								var v = (parseInt(max) / 1000).toString();
								return v.substr(0, v.indexOf('.') ) + "k" ;
							}
							return max
						})
						.style('font-size', options.height/2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'upperValue');
				}
				var slider = svg.append("g")
					.attr("class", "slider");
				if(options.handling == true){
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
					.attr("transform", "translate(0," + options.height / 2 + ")");
				var handle = handleCont.append("circle")
					.attr("class", "handle")
					.attr("r", options.height / 2);
					if(options.color){
						handle.style('fill', options.color);
					}
				var handleLabel = handleCont.append('text')
					.text(0)
					.style('font-size', options.height/2.5)
					.attr("text-anchor", "middle").attr('y', '0.35em');

				//slider
				//.call(brush.extent([0, 0]))
				//.call(brush.event);

				function brush() {
					var value = brush.extent()[0];

					if (d3.event.sourceEvent) {
						value = x.invert(d3.mouse(this)[0]);
						brush.extent([value, value]);
					}

					if(parseInt(value) > 1000){
						var v = (parseInt(value) / 1000).toString();
						handleLabel.text(v.substr(0, v.indexOf('.') ) + "k" );
					}
					else{
						handleLabel.text(parseInt(value));
					}
					handleCont.attr("transform", 'translate(' + x(value) + ',' + options.height / 2 + ')');
				}

				function brushed() {

					var value = brush.extent()[0],
						count = 0,
						found = false;
					var final = "";
					do {

						angular.forEach($scope.data, function (nat, key) {
							if (parseInt(nat[options.field]) == parseInt(value)) {
								final = nat;
								found = true;
							}
						});
						count++;
						value = value > 50 ? value - 1 : value + 1;
					} while (!found && count < max);

					ngModel.$setViewValue(final);
					ngModel.$render();
				}


				$scope.$watch('options', function(n,o){
					if(n === o){
						return;
					}
					options.colors[1].color = n.color;
					gradient = svg.append('svg:defs')
						.append("svg:linearGradient")
						.attr('id', options.field+"_"+n.color)
						.attr('x1', '0%')
						.attr('y1', '0%')
						.attr('x2', '100%')
						.attr('y2', '0%')
						.attr('spreadMethod', 'pad')
					angular.forEach(options.colors, function (color) {
						gradient.append('svg:stop')
							.attr('offset', color.position + '%')
							.attr('stop-color', color.color)
							.attr('stop-opacity', color.opacity);
					});
					rect.style('fill', 'url(#' + options.field + '_'+n.color+')');
					handle.style('fill', n.color);
					if(ngModel.$modelValue){
							handleLabel.text(parseInt(ngModel.$modelValue[n.field]));
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue[n.field]) + ',' + options.height / 2 + ')');
					}
					else{
						handleLabel.text(0);
					}
					});
				$scope.$watch(
					function () {
						return ngModel.$modelValue;
					},
					function (newValue, oldValue) {
						if (!newValue) {
							handleLabel.text(parseInt(0));
							handleCont.attr("transform", 'translate(' + x(0) + ',' + options.height / 2 + ')');
							return;
						}
						handleLabel.text(parseInt(newValue[options.field]));
						if (newValue == oldValue) {
							handleCont.attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');
						} else {
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');

						}
					});
					$scope.$watch('data', function(n, o){
						if(n === o) return false;
					//	console.log(n);
						min = 0;
						max = 0;
						angular.forEach($scope.data, function (nat, key) {
							max = d3.max([max, parseInt(nat[options.field])]);
							min = d3.min([min, parseInt(nat[options.field])]);
							if(nat.iso == ngModel.$modelValue.iso){
									handleLabel.text(parseInt(nat[options.field]));
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
						legend2.select('#upperValue').text(function(){
							//TDODO: CHckick if no comma there
							if(max > 1000){
								var v = (parseInt(max) / 1000).toString();
								return v.substr(0, v.indexOf('.') ) + "k" ;
							}
							return max
						});
						angular.forEach($scope.data, function (nat, key) {
							if(nat.iso == ngModel.$modelValue.iso){
									handleLabel.text(parseInt(nat[options.field]));
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
							//worker: true,
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
				duration:100,
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
			console.log(vm.chart)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvY29udGVudC5qcyIsInNlcnZpY2VzL2NvdW50cmllcy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lcnJvckNoZWNrZXIuanMiLCJzZXJ2aWNlcy9pY29ucy5qcyIsInNlcnZpY2VzL2luZGV4LmpzIiwic2VydmljZXMvaW5kaXplcy5qcyIsInNlcnZpY2VzL3JlY3Vyc2lvbmhlbHBlci5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL3ZlY3RvcmxheWVyLmpzIiwiYXBwL0luZGV4Q2hlY2svaW5kZXhDaGVjay5qcyIsImFwcC9JbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2NvbmZsaWN0SW1wb3J0L2NvbmZsaWN0SW1wb3J0LmpzIiwiYXBwL2NvbmZsaWN0ZGV0YWlscy9jb25mbGljdGRldGFpbHMuanMiLCJhcHAvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiYXBwL2NvbmZsaWN0bmF0aW9uL2NvbmZsaWN0bmF0aW9uLmpzIiwiYXBwL2NvbmZsaWN0cy9jb25mbGljdHMuanMiLCJhcHAvZnVsbExpc3QvZmlsdGVyLmpzIiwiYXBwL2Z1bGxMaXN0L2Z1bGxMaXN0LmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaG9tZS9ob21lLmpzIiwiYXBwL2luZGV4L2luZGV4LmpzIiwiYXBwL2luZGV4L2luZGV4YmFzZS5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWwuanMiLCJhcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhLmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhLmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51LmpzIiwiYXBwL2luZGV4Y3JlYXRvci9pbmRleGNyZWF0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvY2F0ZWdvcnkuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaXplcy5qcyIsImFwcC9pbmRleGluZm8vaW5kZXhpbmZvLmpzIiwiYXBwL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJhcHAvaW5kaWNhdG9yL2luZGljYXRvclllYXJUYWJsZS5qcyIsImFwcC9sb2dpbi9sb2dpbi5qcyIsImFwcC9sb2dvL2xvZ28uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lkZW1lbnUvc2lkZW1lbnUuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImRpYWxvZ3MvYWRkUHJvdmlkZXIvYWRkUHJvdmlkZXIuanMiLCJkaWFsb2dzL2FkZFVuaXQvYWRkVW5pdC5qcyIsImRpYWxvZ3MvYWRkWWVhci9hZGRZZWFyLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlhbG9ncy9jb25mbGljdG1ldGhvZGUvY29uZmxpY3RtZXRob2RlLmpzIiwiZGlhbG9ncy9jb25mbGljdHRleHQvY29uZmxpY3R0ZXh0LmpzIiwiZGlhbG9ncy9lZGl0cm93L2VkaXRyb3cuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZXh0ZW5kRGF0YS9leHRlbmREYXRhLmpzIiwiZGlhbG9ncy9sb29zZWRhdGEvbG9vc2VkYXRhLmpzIiwiZGlhbG9ncy9zZWxlY3Rpc29mZXRjaGVycy9zZWxlY3Rpc29mZXRjaGVycy5qcyIsImRpcmVjdGl2ZXMvYXV0b0ZvY3VzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2JhcnMvYmFycy5qcyIsImRpcmVjdGl2ZXMvYmFycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2NhdGVnb3J5LmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvY29udGVudGVkaXRhYmxlLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9maWxlRHJvcHpvbmUuanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5LmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9ycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51LmpzIiwiZGlyZWN0aXZlcy9pbmRpemVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL3NsaWRlVG9nZ2xlLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuanMiLCJkaXJlY3RpdmVzL3dlaWdodC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsWUFBQSxXQUFBLGlCQUFBLGdCQUFBLGNBQUEsZ0JBQUEsWUFBQSxVQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsZ0JBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEscUVBQUEsU0FBQSxnQkFBQSxvQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsYUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztJQUdBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7O0lBTUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSxrQ0FBQSxTQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUEsWUFBQSxPQUFBLE1BQUE7Ozs7Ozs7SUFPQSxNQUFBLGFBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSxnQ0FBQSxTQUFBLGtCQUFBO01BQ0EsT0FBQSxpQkFBQTs7Ozs7R0FLQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtLQUNBLDRCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxnQkFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7OztLQUdBLDJCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxjQUFBO09BQ0EsWUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEseUNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxPQUFBLGVBQUEsYUFBQSxhQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLE1BQUEsNEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7O0lBR0EsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7S0FDQSwwQ0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxJQUFBLGFBQUEsTUFBQSxHQUFBLE9BQUE7TUFDQSxPQUFBLGVBQUEsUUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEscUNBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxlQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLCtDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxnQkFBQTtTQUNBLE1BQUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7SUFPQSxNQUFBLGlEQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBOztJQUVBLE1BQUEsK0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLHdDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsNkNBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsR0FBQSxhQUFBLE1BQUEsTUFBQTtTQUNBLE9BQUE7O1FBRUEsT0FBQSxlQUFBLFlBQUEsYUFBQTs7Ozs7OztJQU9BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGNBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBOzs7S0FHQSw0QkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBOztLQUVBLCtCQUFBLFNBQUEsZUFBQTtPQUNBLE9BQUEsZUFBQSxjQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7OztJQUtBLE1BQUEsd0JBQUE7SUFDQSxJQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsOENBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsT0FBQSxlQUFBLGVBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE9BQUE7S0FDQSxLQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBOztLQUVBLE9BQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7O0tBRUEsSUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTs7Ozs7Ozs7Ozs7SUFXQSxNQUFBLDRCQUFBO0lBQ0EsS0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0tBQ0EseUNBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsT0FBQSxlQUFBLGlCQUFBLGFBQUEsSUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EseUNBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLFVBQUEsYUFBQTs7T0FFQSxnQ0FBQSxTQUFBLGtCQUFBO1FBQ0EsT0FBQSxpQkFBQTs7OztLQUlBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxnQkFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsc0JBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHlCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOztLQUVBLDJCQUFBLFNBQUEsYUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDZCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSx3Q0FBQSxTQUFBLGFBQUEsY0FBQTtNQUNBLE9BQUEsWUFBQSxJQUFBLHVCQUFBLGFBQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw4QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsMENBQUEsU0FBQSxhQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQSxzQkFBQSxhQUFBLElBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsZUFBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7QUN2aUJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFIQUFBLFNBQUEsWUFBQSxZQUFBLFVBQUEsT0FBQSxRQUFBLGVBQUEsU0FBQSxhQUFBLFFBQUE7RUFDQSxXQUFBLGNBQUE7RUFDQSxXQUFBLGNBQUEsY0FBQSxZQUFBO0VBQ0EsV0FBQSxVQUFBO0VBQ0EsV0FBQSxTQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsV0FBQSxhQUFBLFNBQUEsUUFBQTtHQUNBLFdBQUEsUUFBQTs7O0VBR0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBO0dBQ0EsSUFBQSxRQUFBLFFBQUEsQ0FBQSxNQUFBLG1CQUFBO0lBQ0EsT0FBQSxNQUFBLHVDQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUEsT0FBQSxHQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxVQUFBO0lBQ0EsV0FBQSxlQUFBLFFBQUEsS0FBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxPQUFBO0lBQ0EsV0FBQSxRQUFBO1VBQ0E7SUFDQSxXQUFBLFFBQUE7O0dBRUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxhQUFBO0lBQ0EsSUFBQSxRQUFBLE1BQUEsZUFBQSxZQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxXQUFBO1dBQ0E7S0FDQSxXQUFBLFdBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsYUFBQTtXQUNBO0tBQ0EsV0FBQSxhQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLFdBQUE7V0FDQTtLQUNBLFdBQUEsV0FBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLFVBQUE7S0FDQSxXQUFBLFdBQUE7V0FDQTtLQUNBLFdBQUEsV0FBQTs7VUFFQTtJQUNBLFdBQUEsYUFBQTtJQUNBLFdBQUEsV0FBQTtJQUNBLFdBQUEsV0FBQTtJQUNBLFdBQUEsV0FBQTs7R0FFQSxJQUFBLFFBQUEsS0FBQSxRQUFBLGNBQUEsQ0FBQSxLQUFBLFFBQUEsUUFBQSx1QkFBQTtJQUNBLFdBQUEsV0FBQTtVQUNBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLDZCQUFBO0lBQ0EsV0FBQSxZQUFBO1VBQ0E7SUFDQSxXQUFBLFlBQUE7O0dBRUEsV0FBQSxlQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7O0dBRUEsV0FBQSxpQkFBQTtHQUNBLFdBQUEsUUFBQTs7OztFQUlBLFdBQUEsSUFBQSxzQkFBQSxTQUFBLE9BQUEsU0FBQTs7OztFQUlBLFdBQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQTtHQUNBLFdBQUEsaUJBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7S0FDQSxXQUFBLFlBQUE7O0dBRUE7OztFQUdBLFNBQUEsZUFBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMzRkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxlQUFBOzs7RUFHQSxjQUFBLFdBQUE7SUFDQSxjQUFBLFlBQUE7SUFDQSxjQUFBLFlBQUE7RUFDQSxjQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7RUFFQSxjQUFBLE9BQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBO1FBQ0EsYUFBQSxhQUFBOzs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwrQkFBQSxTQUFBLHFCQUFBO0VBQ0E7SUFDQSxXQUFBO0lBQ0Esa0JBQUE7SUFDQSxRQUFBOztJQUVBLHFCQUFBO0lBQ0EsT0FBQTs7SUFFQSx1QkFBQSxTQUFBLE1BQUEsV0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQTtJQUNBLGdCQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQTtLQUNBLGNBQUEsUUFBQSxLQUFBOztJQUVBLElBQUEsS0FBQSxVQUFBO0tBQ0EsY0FBQSxZQUFBLEtBQUE7O0lBRUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDckJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG9EQUFBLFNBQUEsbUJBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7R0FFQSxtQkFBQTs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7VUFDQSxZQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFlBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBOztZQUVBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQTs7WUFFQSxPQUFBLE1BQUEsUUFBQSxlQUFBOzs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxjQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7O01BRUEsSUFBQSxTQUFBO0dBQ0EsSUFBQSxJQUFBO0lBQ0EsTUFBQSxNQUFBOztHQUVBLE9BQUEsSUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLGNBQUEsUUFBQSxLQUFBLGlCQUFBLENBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxNQUFBOzs7R0FHQSxPQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE1BQUE7OzthQUdBLE9BQUEsS0FBQSxRQUFBLGNBQUE7Ozs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsaUJBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxLQUFBLElBQUEsYUFBQSxPQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUE7OztHQUdBLE1BQUEsS0FBQSxVQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsSUFBQSxTQUFBLEVBQUE7SUFDQSxPQUFBLElBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsWUFBQTtDQUNBLFNBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFlBQUEsT0FBQTs7TUFFQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxRQUFBLElBQUE7O1FBRUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxNQUFBLEtBQUEsTUFBQTs7OztHQUlBLE9BQUE7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZDQUFBLFNBQUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsT0FBQSxJQUFBO0lBQ0EsSUFBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsTUFBQSxHQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLEtBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxjQUFBLEtBQUEsVUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7O0dBS0EsT0FBQTs7RUFFQSxPQUFBO0dBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtJQUNBLGNBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFVBQUEsWUFBQSxPQUFBLFNBQUE7O0dBRUEsaUJBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxPQUFBLFVBQUEsUUFBQTs7R0FFQSxZQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxhQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGVBQUEsU0FBQSxRQUFBLGFBQUE7SUFDQSxHQUFBLFlBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUEsUUFBQTs7SUFFQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxnQkFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFFBQUE7O0lBRUEsT0FBQSxLQUFBLGdCQUFBOzs7R0FHQSxXQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxLQUFBLFlBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUE7O0dBRUEsY0FBQSxTQUFBLElBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsV0FBQSxRQUFBLEtBQUE7TUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQTs7OztJQUlBLE9BQUEsS0FBQSxlQUFBOztHQUVBLGdCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFlBQUEsWUFBQSxPQUFBLGdCQUFBLElBQUE7O0dBRUEsdUJBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxZQUFBLE9BQUEsYUFBQTs7R0FFQSxrQkFBQSxTQUFBLElBQUEsTUFBQSxRQUFBOztJQUVBLEdBQUEsUUFBQSxVQUFBLFVBQUEsTUFBQTtLQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUEsV0FBQSxPQUFBLFlBQUE7O1NBRUEsSUFBQSxNQUFBO0tBQ0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsZ0JBQUEsS0FBQSxXQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUE7O0dBRUEscUJBQUEsU0FBQSxJQUFBLEtBQUEsT0FBQTtLQUNBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUEsY0FBQSxLQUFBLENBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsSUFBQTs7Ozs7S0FLQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxVQUFBOzs7R0FHQSxjQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsS0FBQSxPQUFBLEtBQUE7TUFDQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsY0FBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxPQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxZQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsUUFBQTs7S0FFQSxHQUFBLE1BQUEsWUFBQSxNQUFBLFNBQUEsVUFBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLFlBQUEsS0FBQSxZQUFBLElBQUEsTUFBQTtNQUNBLEdBQUEsVUFBQTtPQUNBLFFBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLFNBQUEsU0FBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLFFBQUEsS0FBQTs7R0FFQSxZQUFBLFNBQUEsR0FBQTtJQUNBLEtBQUEsY0FBQSxJQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLFVBQUE7O0dBRUEsWUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsS0FBQSxZQUFBLEtBQUEsSUFBQSxLQUFBLFFBQUE7O0lBRUEsT0FBQSxRQUFBOztHQUVBLGFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxRQUFBO0tBQ0EsT0FBQSxLQUFBLFlBQUEsSUFBQSxLQUFBLFFBQUE7V0FDQTtLQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUEsWUFBQSxPQUFBLGdCQUFBLElBQUE7OztHQUdBLGdCQUFBLFNBQUEsR0FBQTtJQUNBLEtBQUEsY0FBQSxJQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGVBQUE7O0dBRUEsWUFBQSxTQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsRUFBQTtLQUNBLEdBQUEsQ0FBQSxLQUFBLE9BQUEsTUFBQTtNQUNBLEtBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUE7O1NBRUE7TUFDQSxLQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLE9BQUEsS0FBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBOztJQUVBLEtBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGFBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxRQUFBO0lBQ0EsS0FBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7QUMxTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsb0NBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsV0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUEsWUFBQSxPQUFBLGtCQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLFVBQUEsT0FBQTtjQUNBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE1BQUE7VUFDQSxLQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7OztRQUdBLFNBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsUUFBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUE7O1VBRUEsT0FBQTs7UUFFQSxTQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLElBQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHdFQUFBLFNBQUEsYUFBQSxlQUFBLGFBQUE7O1FBRUEsSUFBQSxLQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO09BQ0EsR0FBQSxtQkFBQTtPQUNBLElBQUEsR0FBQSxLQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7U0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTtXQUNBLElBQUEsVUFBQSxLQUFBLE1BQUEsTUFBQTtXQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQTtZQUNBLElBQUEsT0FBQSxVQUFBLE9BQUE7YUFDQTs7OztVQUlBLElBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxHQUFBO1dBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7U0FHQSxJQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLEdBQUEsR0FBQSxLQUFBLFdBQUE7V0FDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOztVQUVBLGNBQUEsYUFBQSxjQUFBOzs7O1VBSUEsT0FBQTs7O01BR0EsU0FBQSxjQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtRQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsR0FBQTtTQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7V0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtXQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7V0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O1FBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBO1VBQ0EsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsSUFBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxXQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLDBDQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxPQUFBLE1BQUEsOENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLG1EQUFBO1FBQ0EsT0FBQTs7O09BR0EsR0FBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsSUFBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztRQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0E7VUFDQTs7UUFFQSxRQUFBLEtBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7T0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO09BQ0EsYUFBQTtPQUNBLFlBQUEsS0FBQSx3QkFBQTtRQUNBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsS0FBQSxTQUFBLFVBQUE7UUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7VUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZ0JBQUE7V0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxJQUFBLFdBQUE7YUFDQSxPQUFBO2FBQ0EsU0FBQSxRQUFBOztZQUVBLGFBQUEsWUFBQTtrQkFDQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUEsTUFBQSxhQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTthQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7Y0FDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2VBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO2dCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7c0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTtpQkFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2lCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OzttQkFNQTs7YUFFQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFFBQUEsR0FBQSxLQUFBOzthQUVBLElBQUEsYUFBQTthQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2NBQ0EsUUFBQSxJQUFBO2NBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtlQUNBLGFBQUE7OzthQUdBLElBQUEsQ0FBQSxZQUFBO2NBQ0EsYUFBQSxZQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUE7UUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO1NBQ0EsY0FBQSxhQUFBOztVQUVBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7UUFJQSxPQUFBO1VBQ0EsYUFBQTs7Ozs7O0FDbExBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsYUFBQTtjQUNBLE1BQUE7O1lBRUEsV0FBQTtZQUNBLFNBQUE7V0FDQSxTQUFBLGFBQUE7O1FBRUEsSUFBQSxDQUFBLGFBQUEsSUFBQSxlQUFBO1VBQ0EsY0FBQSxhQUFBLGNBQUE7WUFDQSxvQkFBQSxLQUFBLEtBQUE7WUFDQSxnQkFBQTtZQUNBLGFBQUE7O1VBRUEsY0FBQSxZQUFBLElBQUE7O1lBRUE7VUFDQSxjQUFBLGFBQUEsSUFBQTtVQUNBLFVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7VUFDQSxNQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTtrQkFDQSxhQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxnQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsYUFBQTs7VUFFQSxXQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBOztVQUVBLG1CQUFBLFVBQUE7O1VBRUEsWUFBQSxJQUFBLGVBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLE9BQUE7O1VBRUEsd0JBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFlBQUEsV0FBQSxLQUFBLGVBQUE7O1VBRUEscUJBQUEsVUFBQTtZQUNBLE9BQUEsY0FBQSxZQUFBLElBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsV0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGlCQUFBLFVBQUE7WUFDQSxPQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBLEVBQUE7O1VBRUEsWUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLE9BQUEsT0FBQSxFQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBOztVQUVBLG1CQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTs7Z0JBRUEsU0FBQTtnQkFDQSxXQUFBOzs7Ozs7OztBQ3pLQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxVQUFBLGFBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0tBQ0EsTUFBQTtLQUNBLFdBQUE7O0lBRUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOzs7R0FHQSxXQUFBLFNBQUEsT0FBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLE9BQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLFlBQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsVUFBQTtJQUNBLE9BQUEsS0FBQTs7R0FFQSxTQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGNBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLEtBQUE7O0dBRUEsZ0JBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7O0dBRUEscUJBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7Ozs7Ozs7QUNqQ0EsQ0FBQSxZQUFBO0VBQ0E7O0VBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0NBQUEsVUFBQSxVQUFBOztJQUVBLE9BQUE7Ozs7Ozs7S0FPQSxTQUFBLFVBQUEsU0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxPQUFBO1FBQ0EsTUFBQTs7Ozs7TUFLQSxJQUFBLFdBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQTtNQUNBLE9BQUE7T0FDQSxLQUFBLENBQUEsUUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBOzs7O09BSUEsTUFBQSxVQUFBLE9BQUEsU0FBQTs7UUFFQSxJQUFBLENBQUEsa0JBQUE7U0FDQSxtQkFBQSxTQUFBOzs7UUFHQSxpQkFBQSxPQUFBLFVBQUEsT0FBQTtTQUNBLFFBQUEsT0FBQTs7OztRQUlBLElBQUEsUUFBQSxLQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxNQUFBOzs7Ozs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxZQUFBOzs7UUFHQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUE7O1VBRUEsV0FBQSxVQUFBOzs7VUFHQSxXQUFBLFVBQUE7Ozs7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG1DQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLFFBQUE7RUFDQSxPQUFBO0dBQ0EsUUFBQTtHQUNBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBO0lBQ0EsT0FBQTs7R0FFQSxVQUFBO0dBQ0EsUUFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLEtBQUEsV0FBQTs7R0FFQSxVQUFBLFNBQUEsR0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFFBQUE7O0dBRUEsVUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsU0FBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsUUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsY0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLFNBQUEsU0FBQSxjQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLE9BQUEsU0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsV0FBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxTQUFBLGFBQUEsR0FBQTtJQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7SUFDQSxTQUFBLGFBQUEsR0FBQTtJQUNBLEtBQUEsSUFBQSxZQUFBO0lBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O0dBR0EsY0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsV0FBQTs7SUFFQSxLQUFBLFNBQUEsU0FBQSxjQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLE9BQUEsU0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsV0FBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7O0lBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFdBQUEsUUFBQSxJQUFBO0tBQ0EsU0FBQSxhQUFBLEtBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQSxXQUFBOztJQUVBLEtBQUEsSUFBQSxZQUFBO0lBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O0dBR0EsbUJBQUEsU0FBQSxZQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUEsWUFBQTs7Ozs7R0FLQSxjQUFBLFNBQUEsZUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFNBQUEsVUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQTs7OztHQUlBLFVBQUEsU0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUE7O0dBRUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLEtBQUEsSUFBQSxRQUFBOztHQUVBLFNBQUEsU0FBQSxNQUFBLE9BQUEsUUFBQTtJQUNBLEtBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxPQUFBLFNBQUEsYUFBQTtLQUNBLEtBQUEsS0FBQSxZQUFBOztJQUVBLElBQUEsQ0FBQSxLQUFBLFFBQUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7V0FFQTtLQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxTQUFBO01BQ0EsS0FBQSxhQUFBLEtBQUEsS0FBQTs7U0FFQTtNQUNBLEtBQUEsa0JBQUEsS0FBQSxLQUFBOzs7SUFHQSxJQUFBLFFBQUE7S0FDQSxLQUFBOzs7R0FHQSxnQkFBQSxTQUFBLEtBQUEsTUFBQTtJQUNBLEdBQUEsT0FBQSxTQUFBLFlBQUE7S0FDQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO09BQ0EsU0FBQTs7OztRQUlBO0tBQ0EsSUFBQSxLQUFBLElBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsU0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLElBQUEsTUFBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO09BQ0EsU0FBQTs7OztJQUlBLE9BQUE7O0dBRUEsaUJBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLElBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTs7R0FFQSxnQkFBQSxTQUFBLE9BQUEsT0FBQSxPQUFBO0lBQ0EsSUFBQSxPQUFBOztJQUVBLFNBQUEsV0FBQTtLQUNBLElBQUEsT0FBQSxTQUFBLGVBQUEsU0FBQSxNQUFBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQTtZQUNBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLElBQUE7O0tBRUEsSUFBQSxPQUFBLFNBQUEsYUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQTs7S0FFQSxLQUFBLEtBQUEsTUFBQTs7O0dBR0EsZUFBQSxTQUFBLElBQUE7SUFDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUEsVUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxVQUFBLFNBQUEsU0FBQSxJQUFBO01BQ0EsR0FBQSxJQUFBO09BQ0EsR0FBQSxPQUFBO1FBQ0EsUUFBQSxXQUFBOztVQUVBO09BQ0EsUUFBQSxXQUFBOzs7O0tBSUEsS0FBQTs7OztHQUlBLG1CQUFBLFNBQUEsS0FBQSxTQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQTtLQUNBLFFBQUEsSUFBQTs7O1FBR0E7S0FDQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxLQUFBLFdBQUE7Ozs7R0FJQSxPQUFBLFVBQUE7SUFDQSxLQUFBLEtBQUEsTUFBQTs7O0dBR0EsZ0JBQUEsU0FBQSxTQUFBO0lBQ0E7SUFDQSxJQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsU0FBQSxLQUFBLGVBQUE7SUFDQSxJQUFBLFFBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7SUFDQSxRQUFBLFdBQUE7O0lBRUEsUUFBQTtLQUNBLEtBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLEtBQUE7T0FDQSxJQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztPQUVBLElBQUEsWUFBQSxTQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7T0FDQSxRQUFBLElBQUEsVUFBQSxJQUFBO09BQ0EsSUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxNQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7O09BRUEsTUFBQSxXQUFBO1FBQ0EsT0FBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUE7UUFDQSxTQUFBO1NBQ0EsT0FBQTtTQUNBLE1BQUE7Ozs7YUFJQTtPQUNBLE1BQUEsUUFBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O09BSUE7O0lBRUEsT0FBQTs7Ozs7Ozs7QUNoUUEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUdBQUEsVUFBQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFFBQUEsZUFBQSxjQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsV0FBQTtJQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7SUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxzQkFBQTs7RUFFQSxHQUFBLFVBQUE7SUFDQSxHQUFBLFFBQUEsSUFBQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTtLQUNBO0dBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7OztJQUdBLFNBQUEsVUFBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLElBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLElBQUEsU0FBQSxPQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBO01BQ0EsUUFBQTs7O09BR0EsUUFBQSxRQUFBLElBQUEsT0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLEdBQUEsTUFBQSxRQUFBLE1BQUEsS0FBQSxHQUFBLEtBQUEsZ0JBQUEsQ0FBQSxFQUFBO1FBQ0EsR0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsS0FBQTs7O0lBR0EsR0FBQSxhQUFBLEdBQUEsTUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUE7T0FDQSxHQUFBLFNBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxTQUFBLE9BQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUE7TUFDQSxRQUFBOzs7T0FHQSxRQUFBLFFBQUEsSUFBQSxPQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUEsS0FBQSxrQkFBQSxDQUFBLEVBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxLQUFBOzs7SUFHQSxHQUFBLGVBQUEsR0FBQSxPQUFBOzs7RUFHQSxTQUFBLE9BQUEsV0FBQTtHQUNBLEdBQUEsU0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O0dBR0E7O0VBRUEsU0FBQSxlQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsYUFBQSxHQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7T0FDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO1FBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtTQUNBLGFBQUE7O1FBRUEsYUFBQTtRQUNBLEdBQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7TUFHQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUE7Ozs7R0FJQSxhQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtNQUNBLEdBQUE7TUFDQSxhQUFBOztLQUVBLEdBQUE7S0FDQSxhQUFBOztJQUVBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7O0dBRUEsR0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGVBQUE7R0FDQSxHQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtLQUNBLEdBQUEsU0FBQSxLQUFBOzs7OztFQUtBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLFNBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBOzs7RUFHQSxTQUFBLGtCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUEsR0FBQTtJQUNBLFFBQUEsUUFBQSxJQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLEtBQUEsV0FBQSxpQkFBQSxTQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO09BQ0EsSUFBQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7QUMvS0EsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0hBQUEsU0FBQSxZQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsZUFBQSxRQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFdBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0lBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLElBQUEsUUFBQTtNQUNBLE1BQUE7TUFDQSxTQUFBO01BQ0EsT0FBQSxJQUFBLEtBQUEsR0FBQSxLQUFBO01BQ0EsUUFBQSxHQUFBLEtBQUE7TUFDQSxLQUFBOztLQUVBLElBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTs7O0tBR0EsSUFBQSxDQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOzs7O0dBSUEsYUFBQTs7O0VBR0EsU0FBQSxXQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSwwQ0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsT0FBQSxNQUFBLDhDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLEdBQUEsS0FBQSxpQkFBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSxtREFBQTtJQUNBLE9BQUE7O0dBRUEsV0FBQSxpQkFBQTtHQUNBLEdBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztJQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQTtNQUNBOztJQUVBLFFBQUEsS0FBQTtLQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O0dBR0EsSUFBQSxVQUFBLGFBQUEsUUFBQSxTQUFBLEtBQUEsZUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBLEtBQUEsd0JBQUE7SUFDQSxNQUFBO0lBQ0EsS0FBQTtNQUNBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsV0FBQSxpQkFBQTtJQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtNQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsZ0JBQUE7T0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFdBQUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxRQUFBOztRQUVBLGFBQUEsWUFBQTtjQUNBLEdBQUEsUUFBQSxLQUFBLFVBQUEsRUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFFBQUEsYUFBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUE7WUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBO2tCQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTthQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBOzs7Ozs7ZUFNQTs7U0FFQSxJQUFBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBOztTQUVBLElBQUEsYUFBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsUUFBQSxJQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsYUFBQSxZQUFBO1VBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7SUFPQSxHQUFBLGNBQUE7SUFDQSxhQUFBO0lBQ0EsSUFBQSxhQUFBLGNBQUEsUUFBQTtLQUNBLGNBQUEsYUFBQTs7TUFFQSxTQUFBLFVBQUE7SUFDQSxXQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztFQUlBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxJQUFBLGFBQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQTtJQUNBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsS0FBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7TUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O0tBRUEsV0FBQSxLQUFBLEtBQUEsS0FBQTtXQUNBO0tBQ0EsT0FBQSxNQUFBLCtCQUFBO0tBQ0E7OztHQUdBLFlBQUEsS0FBQSxpQkFBQSxHQUFBLFVBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsTUFBQTtLQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQSxhQUFBO0tBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQzFOQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwREFBQSxTQUFBLGFBQUEsUUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsU0FBQSxHQUFBO0lBQ0EsUUFBQSxHQUFBOztHQUVBLFlBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDbEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlKQUFBLFNBQUEsVUFBQSxRQUFBLFFBQUEsWUFBQSxvQkFBQSxVQUFBLFdBQUEsU0FBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsc0JBQUE7RUFDQSxHQUFBLGdCQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLE1BQUE7R0FDQSxPQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsV0FBQSxTQUFBO0dBQ0EsUUFBQSxVQUFBLEtBQUEsU0FBQSxVQUFBOztJQUVBLEdBQUEsWUFBQTtJQUNBLG1CQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLFdBQUEsR0FBQSxRQUFBO0lBQ0EsbUJBQUEsU0FBQTtJQUNBLG1CQUFBLGFBQUE7SUFDQSxtQkFBQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLFNBQUEsUUFBQTtLQUNBLElBQUEsSUFBQSxHQUFBLFVBQUEsUUFBQSxPQUFBO0tBQ0EsSUFBQSxLQUFBLENBQUEsR0FBQTtNQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLFVBQUEsS0FBQTtNQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTtJQUNBLE9BQUEsR0FBQSw2QkFBQTtLQUNBLEtBQUEsUUFBQTs7Ozs7RUFLQSxTQUFBLFdBQUE7R0FDQSxjQUFBLGFBQUEsZ0JBQUE7OztFQUdBLFNBQUEsYUFBQTtHQUNBLGNBQUEsYUFBQTs7O0VBR0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsSUFBQSxHQUFBLFlBQUEsTUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFNBQUEsV0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7OztFQUdBLFNBQUEsc0JBQUE7R0FDQSxJQUFBLEdBQUEsZUFBQSxPQUFBO0dBQ0EsT0FBQTs7Ozs7O0FDdklBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxXQUFBLGdCQUFBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBOztFQUVBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLFdBQUEsTUFBQTtHQUNBLFFBQUEsSUFBQSxNQUFBLFdBQUE7R0FDQSxJQUFBLElBQUEsV0FBQSxjQUFBLFFBQUE7R0FDQSxJQUFBLElBQUEsQ0FBQSxHQUFBO0lBQ0EsV0FBQSxjQUFBLE9BQUEsR0FBQTtVQUNBO0lBQ0EsV0FBQSxjQUFBLEtBQUE7OztHQUdBLElBQUEsV0FBQSxjQUFBLFVBQUEsR0FBQTtJQUNBLFdBQUEsZ0JBQUE7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7OztHQUdBOzs7O0FDMUNBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNJQUFBLFNBQUEsVUFBQSxRQUFBLFlBQUEsU0FBQSxRQUFBLG9CQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLE1BQUE7R0FDQSxPQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxXQUFBLFNBQUE7R0FDQSxXQUFBLGVBQUE7O0dBRUEsUUFBQSxVQUFBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsR0FBQSxZQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUEsR0FBQSxPQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsbUJBQUEsY0FBQSxHQUFBLE9BQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7SUFDQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsYUFBQTtJQUNBLG1CQUFBLG1CQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsV0FBQSxlQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxXQUFBLFNBQUEsVUFBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQSxXQUFBO0tBQ0EsSUFBQSxTQUFBLFVBQUEsR0FBQSxTQUFBLFNBQUE7TUFDQSxHQUFBLFdBQUE7O0tBRUEsUUFBQSxRQUFBLFVBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxHQUFBLFFBQUEsR0FBQTtPQUNBLEdBQUEsR0FBQSxTQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7UUFDQSxHQUFBLFNBQUEsS0FBQTtRQUNBLFdBQUEsZUFBQSxHQUFBOzs7OztLQUtBLFFBQUEsUUFBQSxTQUFBLFNBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7TUFDQSxJQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7T0FDQSxtQkFBQSxtQkFBQSxPQUFBLEtBQUE7Ozs7O0lBS0EsbUJBQUEsZUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QkEsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLEdBQUEsWUFBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxhQUFBLEtBQUEsR0FBQTs7R0FFQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7O0lBRUEsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLElBQUEsWUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTtJQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7SUFFQSxRQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBOztHQUVBLE9BQUE7Ozs7OztBQzNJQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0SkFBQSxVQUFBLFVBQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxTQUFBLG9CQUFBLGFBQUEsZUFBQSxZQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLGNBQUE7R0FDQSxZQUFBO0dBQ0EsWUFBQTtHQUNBLFVBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUEsQ0FBQSxHQUFBLEdBQUE7O0VBRUEsR0FBQSx1QkFBQTtFQUNBLEdBQUEsaUJBQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBLFdBQUEsU0FBQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsUUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOztHQUVBLFVBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQTtJQUNBLEdBQUEsWUFBQTtJQUNBOzs7Ozs7OztFQVFBLFNBQUEsZUFBQTs7R0FFQSxJQUFBLFdBQUE7SUFDQSxXQUFBOztJQUVBLFdBQUE7Ozs7OztFQU1BLFNBQUEsWUFBQTtHQUNBLEdBQUEsWUFBQTtHQUNBLEdBQUEsc0JBQUE7R0FDQSxHQUFBLHNCQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFVBQUE7O0dBRUEsR0FBQSxZQUFBLENBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBOzs7R0FHQSxHQUFBLGdCQUFBLENBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLGNBQUEsYUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxNQUFBOztHQUVBLElBQUEsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0dBQ0EsSUFBQSxJQUFBLENBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLE9BQUEsR0FBQTtVQUNBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQTs7R0FFQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGFBQUEsVUFBQTtHQUNBLEdBQUE7R0FDQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQTs7O0dBR0EsUUFBQSxTQUFBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0E7O0dBRUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsYUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBO0tBQ0EsR0FBQSxVQUFBLEtBQUEsSUFBQTs7OztFQUlBLFNBQUEsa0JBQUE7R0FDQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0tBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLEdBQUE7TUFDQSxhQUFBOztXQUVBO0tBQ0EsYUFBQTs7O0dBR0EsR0FBQSxRQUFBOztHQUVBLG1CQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBO0dBQ0EsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxFQUFBO0lBQ0EsTUFBQSxRQUFBO0lBQ0EsTUFBQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztPQUdBO0lBQ0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztLQUlBOzs7OztHQUtBLE9BQUE7R0FDQTs7Ozs7QUN0UEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxZQUFBLGdCQUFBO0lBQ0EsSUFBQSxLQUFBO0lBQ0EsR0FBQSxhQUFBOztJQUVBLEdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQTtNQUNBLFdBQUE7UUFDQSxrQkFBQSxVQUFBO1VBQ0EsR0FBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxTQUFBLEtBQUE7WUFDQSxlQUFBOztVQUVBLGVBQUEsV0FBQSxhQUFBLFVBQUEsR0FBQTtVQUNBLGVBQUEsV0FBQSxVQUFBLFVBQUEsR0FBQTs7OztJQUlBLFNBQUEsWUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBO01BQ0EsR0FBQSxPQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsT0FBQSxLQUFBOzs7SUFHQSxTQUFBLGVBQUEsSUFBQTtNQUNBLFlBQUEsSUFBQTtNQUNBLEdBQUEsSUFBQSxTQUFBO1FBQ0EsUUFBQSxRQUFBLElBQUEsVUFBQSxTQUFBLE1BQUE7VUFDQSxZQUFBLE1BQUE7VUFDQSxlQUFBOzs7S0FHQTtJQUNBLFNBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsU0FBQSxLQUFBLEdBQUEsT0FBQSxTQUFBLEVBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxZQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLENBQUEsRUFBQTtPQUNBLFFBQUE7OztLQUdBLE9BQUE7O0lBRUEsT0FBQTs7Ozs7QUM3Q0EsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOEZBQUEsU0FBQSxPQUFBLFFBQUEsZ0JBQUEsWUFBQSxZQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBO0dBQ0EsTUFBQTtHQUNBLFFBQUEsVUFBQTtJQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEsaUJBQUE7S0FDQSxPQUFBLEdBQUEsd0JBQUEsQ0FBQSxPQUFBOztRQUVBO0tBQ0EsZUFBQSxZQUFBO0tBQ0EsZUFBQSxZQUFBO0tBQ0EsT0FBQSxHQUFBOzs7OztFQUtBLE9BQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxlQUFBLFFBQUEsYUFBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsTUFBQSxHQUFBO0dBQ0EsR0FBQSxhQUFBOztFQUVBLE9BQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxlQUFBLFFBQUEsVUFBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsTUFBQSxHQUFBO0dBQ0EsR0FBQSxVQUFBOzs7OztBQzdCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0SEFBQSxTQUFBLE9BQUEsVUFBQSxhQUFBLE9BQUEsZUFBQSxZQUFBLE9BQUEsUUFBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLFdBQUEsa0JBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7O0VBRUEsR0FBQSxlQUFBLFNBQUEsU0FBQTtHQUNBLE1BQUEsYUFBQTs7O0VBR0EsU0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLFNBQUE7R0FDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxRQUFBOztNQUVBLE1BQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7SUFDQSxNQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxHQUFBOztLQUVBLE9BQUEsUUFBQTtPQUNBLE1BQUEsU0FBQSxTQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsYUFBQSxJQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsU0FBQSxZQUFBO0dBQ0EsV0FBQSxjQUFBLENBQUEsV0FBQTtHQUNBLGNBQUEsV0FBQSxXQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOztFQUVBLFdBQUEsY0FBQTtFQUNBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLHFCQUFBLFNBQUEsRUFBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxXQUFBLEVBQUEsT0FBQSxTQUFBLFNBQUEsU0FBQSxPQUFBO0tBQ0EsR0FBQSxjQUFBOzs7Ozs7O0FDbEVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLFNBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLFlBQUEsT0FBQSxTQUFBLENBQUEsYUFBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOzs7Ozs7O0FDTkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUxBQUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxZQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUEsb0JBQUEsTUFBQSxXQUFBLGFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE1BQUE7O0VBRUEsR0FBQSxhQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsa0JBQUEsS0FBQSxTQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQSxtQkFBQTtFQUNBLEdBQUEsa0JBQUEsbUJBQUE7RUFDQSxHQUFBLHNCQUFBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLFlBQUEsbUJBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBOztFQUVBLEdBQUEsVUFBQTtHQUNBLGFBQUE7Ozs7RUFJQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsbUJBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsR0FBQSxZQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxHQUFBLGdCQUFBLEtBQUEsU0FBQSxXQUFBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxPQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLGNBQUE7OztLQUdBLGFBQUEsR0FBQSxVQUFBLE1BQUE7S0FDQTtLQUNBLElBQUEsT0FBQSxPQUFBLE1BQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxHQUFBLDBCQUFBO0lBQ0EsR0FBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBO0lBQ0EsS0FBQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsU0FBQSxTQUFBLEVBQUE7S0FDQSxjQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxTQUFBLE1BQUE7R0FDQSxHQUFBLFdBQUEsZUFBQTtHQUNBLGdCQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsWUFBQSxHQUFBLGFBQUEsT0FBQSxpQkFBQTs7O0VBR0EsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7O0dBRUEsR0FBQTs7R0FFQSxXQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLEdBQUEsV0FBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBOzs7R0FHQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7OztHQUdBLE9BQUEsR0FBQSxLQUFBLFFBQUEsR0FBQSxXQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxHQUFBLGdCQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsTUFBQSxjQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQTtJQUNBLE1BQUEsR0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLFFBQUEsU0FBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsWUFBQSxPQUFBLFdBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsUUFBQSxPQUFBO0lBQ0EsZUFBQTs7Ozs7RUFLQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLE9BQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxVQUFBLENBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUE7Ozs7RUFJQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBLFFBQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBOztVQUVBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsVUFBQSxTQUFBLFNBQUE7S0FDQSxRQUFBLFdBQUE7O0lBRUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMkJBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBLFFBQUEsR0FBQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUEsS0FBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxtQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxXQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7OztFQUdBLFNBQUEsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxlQUFBLEdBQUEsUUFBQSxZQUFBLE1BQUE7S0FDQSxHQUFBLGFBQUE7O0lBRUEsVUFBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxVQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsYUFBQSxPQUFBOztHQUVBLEdBQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxTQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7OztFQUtBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBOzs7R0FHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsT0FBQSxVQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7O0dBRUEsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7OztNQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTs7TUFFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O01BR0E7WUFDQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7Ozs7R0FLQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFlBQUEsU0FBQTtJQUNBLE1BQUEsY0FBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7O0dBR0EsSUFBQSxFQUFBLEtBQUE7SUFDQSxJQUFBLEVBQUEsS0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUE7SUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGtCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBOzs7O0VBSUEsT0FBQSxPQUFBLDBCQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLElBQUE7R0FDQSxJQUFBLEVBQUE7SUFDQSxhQUFBLEVBQUE7UUFDQTtJQUNBLGFBQUE7SUFDQTtHQUNBLEdBQUE7Ozs7Ozs7Ozs7Ozs7R0FhQSxJQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtLQUNBLE9BQUEsR0FBQSxtQ0FBQTtNQUNBLElBQUEsRUFBQTtNQUNBLE1BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7O1dBRUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxJQUFBLEVBQUE7TUFDQSxNQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLEVBQUE7S0FDQSxNQUFBLEVBQUE7Ozs7Ozs7RUFPQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7O0dBUUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEdBQUE7SUFDQSxDQUFBLEtBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEdBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxTQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DQSxTQUFBLGdCQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxXQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxLQUFBLFdBQUE7OztZQUdBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxTQUFBLEtBQUEsR0FBQTs7S0FFQSxJQUFBLENBQUEsR0FBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsUUFBQTtPQUNBLEdBQUEsVUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7WUFFQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxtQkFBQTthQUNBO09BQ0EsT0FBQSxNQUFBLGdDQUFBLElBQUEsUUFBQSxXQUFBOzs7Ozs7Ozs7QUNsbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNFQUFBLFVBQUEsUUFBQSxjQUFBLGFBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsV0FBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBOzs7O0dBSUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsYUFBQTtLQUNBLE1BQUE7O0lBRUEsSUFBQSxVQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsU0FBQTtJQUNBLEdBQUEsVUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtPQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O09BRUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO1FBQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7T0FHQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7T0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztVQUVBO09BQ0EsUUFBQSxLQUFBOzs7O1lBSUE7TUFDQSxPQUFBLE1BQUEsK0JBQUE7TUFDQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO01BQ0EsSUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUE7T0FDQSxVQUFBO09BQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7T0FDQSxZQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztNQUVBLElBQUEsYUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxJQUFBOztNQUVBLE1BQUEsYUFBQTtNQUNBLE9BQUEsS0FBQTs7O0lBR0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO0tBQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7OztJQUdBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtLQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUE7T0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBO09BQ0EsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBO09BQ0EsR0FBQSxPQUFBOztNQUVBLEdBQUEsVUFBQTs7T0FFQSxVQUFBLFVBQUE7S0FDQSxJQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztLQUdBLEdBQUEsVUFBQTs7Ozs7Ozs7QUN2R0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBOzs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlIQUFBLFNBQUEsUUFBQSxRQUFBLG1CQUFBLFNBQUEsYUFBQSxhQUFBLE9BQUE7OztRQUdBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLG1CQUFBLGFBQUE7O1FBRUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7OztRQUdBLFNBQUEsV0FBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUE7WUFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtVQUNBLEdBQUEsTUFBQSxFQUFBO1VBQ0EsR0FBQSxZQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxHQUFBLFVBQUEsTUFBQTtZQUNBLG1CQUFBLGFBQUEsR0FBQSxVQUFBLE1BQUE7O1VBRUE7WUFDQSxhQUFBOzs7UUFHQSxPQUFBLE9BQUEsZ0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQTtVQUNBLEdBQUEsT0FBQSxFQUFBLFlBQUEsYUFBQTtZQUNBLEdBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQTtjQUNBLEdBQUEsRUFBQSxNQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxNQUFBOztrQkFFQTtrQkFDQSxtQkFBQSxhQUFBOztjQUVBOzs7Y0FHQTtZQUNBLEdBQUEsT0FBQSxFQUFBLGNBQUEsWUFBQTtjQUNBLEdBQUEsRUFBQSxXQUFBLE9BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLFdBQUEsR0FBQSxNQUFBOztrQkFFQTtnQkFDQSxtQkFBQSxhQUFBOzs7WUFHQTs7VUFFQSxhQUFBLHVCQUFBO1VBQ0EsYUFBQTtVQUNBOzs7UUFHQSxTQUFBLFFBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBLGNBQUEsR0FBQTtjQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQSxjQUFBLEdBQUE7O1VBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztRQUVBLFNBQUEsY0FBQSxJQUFBO1VBQ0EsSUFBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTthQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxjQUFBLElBQUE7ZUFDQSxRQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUE7OztVQUdBLE9BQUE7O1FBRUEsU0FBQSxlQUFBLFNBQUE7T0FDQSxJQUFBLFFBQUE7T0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO09BQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQTtPQUNBLElBQUEsT0FBQSxRQUFBOztPQUVBLFFBQUE7T0FDQSxLQUFBOztTQUVBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO1NBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO2NBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUEsVUFBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOztTQUVBLE1BQUEsV0FBQTtVQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1VBQ0EsU0FBQTtXQUNBLE9BQUE7V0FDQSxNQUFBOzs7U0FHQTs7OztPQUlBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsVUFBQSxTQUFBO1FBQ0EsTUFBQSxjQUFBLFlBQUE7U0FDQSxJQUFBLFFBQUE7VUFDQSxNQUFBLFFBQUEsV0FBQTtVQUNBLFVBQUEsQ0FBQSxLQUFBO1VBQ0EsVUFBQTs7U0FFQSxPQUFBOzs7T0FHQSxPQUFBOztRQUVBLFNBQUEsY0FBQTtVQUNBLEdBQUEsVUFBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOztRQUVBLFNBQUEsZ0JBQUE7VUFDQTtPQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsU0FBQSxZQUFBO1VBQ0E7Ozs7Ozs7O0FDM0lBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9HQUFBLFNBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQSxlQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsV0FBQTtNQUNBLEdBQUEsV0FBQTs7O01BR0EsU0FBQSxpQkFBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLFlBQUE7VUFDQSxhQUFBLGFBQUEsSUFBQTtZQUNBLFlBQUE7WUFDQSxNQUFBOzs7UUFHQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQSxhQUFBO1FBQ0EsYUFBQTs7TUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGFBQUEsT0FBQTtLQUNBLElBQUEsS0FBQSxTQUFBLEtBQUEsUUFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztLQUVBLE9BQUE7O0lBRUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxlQUFBLE9BQUEsS0FBQSxjQUFBLGFBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxTQUFBLEtBQUEsV0FBQSxTQUFBLE9BQUE7O01BRUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLFVBQUE7VUFDQSxHQUFBLFVBQUEsV0FBQTtZQUNBOzs7O1FBSUEsR0FBQSxRQUFBLE9BQUEsS0FBQSxHQUFBLFlBQUEsT0FBQTtVQUNBLE9BQUE7O1FBRUEsT0FBQTs7TUFFQSxTQUFBLFdBQUE7O1VBRUEsR0FBQSxDQUFBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBLEtBQUE7WUFDQSxjQUFBLGFBQUEsV0FBQTtZQUNBLE9BQUE7O01BRUEsSUFBQSxhQUFBO09BQ0EsTUFBQTs7TUFFQSxJQUFBLFVBQUE7TUFDQSxJQUFBLGFBQUE7T0FDQSxTQUFBO01BQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7U0FFQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7VUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztTQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O1lBRUE7Z0JBQ0EsR0FBQSxHQUFBLEtBQUEsS0FBQTtrQkFDQSxLQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUE7a0JBQ0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO1dBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7b0JBRUE7bUJBQ0EsUUFBQSxLQUFBOzs7Ozs7O2NBT0E7UUFDQSxPQUFBLE1BQUEsK0JBQUE7UUFDQTs7O01BR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO1FBQ0EsSUFBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtTQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7UUFFQSxJQUFBLFFBQUE7U0FDQSxVQUFBO1NBQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtTQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7U0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7U0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7U0FDQSxZQUFBO1NBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztRQUVBLElBQUEsYUFBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtTQUNBLFdBQUEsS0FBQSxJQUFBOztRQUVBLE1BQUEsYUFBQTtRQUNBLE9BQUEsS0FBQTs7O01BR0EsR0FBQSxLQUFBLFNBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBOzs7TUFHQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsaUJBQUEsU0FBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsT0FBQSxNQUFBO1NBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO1NBQ0EsYUFBQTtTQUNBLE9BQUEsR0FBQTtTQUNBLEdBQUEsT0FBQTtTQUNBLEdBQUEsT0FBQTs7UUFFQSxHQUFBLFVBQUE7O1NBRUEsVUFBQSxVQUFBO09BQ0EsSUFBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7T0FHQSxHQUFBLFVBQUE7Ozs7TUFJQSxTQUFBLGNBQUE7Ozs7Ozs7Ozs7S0FVQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLEdBQUEsTUFBQSxFQUFBO1FBQ0EsR0FBQSxXQUFBLEVBQUEsZUFBQTtRQUNBO01BQ0EsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxLQUFBLE1BQUE7UUFDQSxHQUFBLENBQUEsR0FBQSxrQkFBQTtVQUNBLEdBQUEsY0FBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxhQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFVBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsZ0JBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsWUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxXQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7O1VBRUEsY0FBQSxhQUFBLGdCQUFBO2VBQ0E7Ozs7Ozs7Ozs7O0FDektBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBLEdBQUEsT0FBQTs7TUFFQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxZQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7VUFDQSxHQUFBLE9BQUE7WUFDQTs7OztNQUlBLFNBQUEsYUFBQTtRQUNBLFFBQUEsSUFBQSxHQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0tBQUEsU0FBQSxRQUFBLGNBQUEsYUFBQSxTQUFBLFFBQUEsU0FBQSxhQUFBLFFBQUEsYUFBQSxjQUFBLG1CQUFBOzs7Ozs7Ozs7Ozs7Ozs7UUFlQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxrQkFBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSx1QkFBQTtRQUNBLEdBQUEseUJBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBOztRQUVBLEdBQUEsUUFBQSxhQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxjQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJBOztRQUVBLFNBQUEsVUFBQTs7VUFFQSxhQUFBOztRQUVBLFNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQSxTQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQSxRQUFBO1NBQ0EsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1NBR0EsT0FBQTs7UUFFQSxTQUFBLFVBQUE7V0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsWUFBQSxtQkFBQTtjQUNBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O1FBTUEsU0FBQSxxQkFBQTtVQUNBLEdBQUEsZ0JBQUEsQ0FBQSxHQUFBO1VBQ0EsR0FBQSxHQUFBLGNBQUE7WUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxVQUFBO1lBQ0EsWUFBQSxPQUFBLGVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLFlBQUE7Y0FDQSxHQUFBLG9CQUFBLElBQUEsR0FBQSxrQkFBQTs7Ozs7UUFLQSxTQUFBLGlCQUFBLFNBQUE7VUFDQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxZQUFBLENBQUEsSUFBQSxPQUFBOztRQUVBLFNBQUEsZ0JBQUEsVUFBQSxLQUFBO1VBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7O2dCQUVBLEdBQUEsUUFBQSxTQUFBO2tCQUNBLEtBQUEsT0FBQSxLQUFBO2tCQUNBLEdBQUEsaUJBQUEsT0FBQSxHQUFBLGlCQUFBLFFBQUEsT0FBQTtrQkFDQSxHQUFBLGtCQUFBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLE1BQUE7OztjQUdBLGdCQUFBLFVBQUEsS0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxrQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsa0JBQUEsT0FBQSxLQUFBO1lBQ0EsZ0JBQUEsVUFBQSxHQUFBOztjQUVBO1lBQ0EsR0FBQSxrQkFBQSxLQUFBO1lBQ0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7Y0FDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztnQkFFQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7O1FBTUEsU0FBQSxlQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLE1BQUEsS0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBO1lBQ0EsZUFBQSxNQUFBOzs7UUFHQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEscUJBQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGlCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxpQkFBQSxPQUFBLEtBQUE7O2NBRUE7WUFDQSxHQUFBLGlCQUFBLEtBQUE7OztRQUdBLFNBQUEsdUJBQUEsS0FBQTtVQUNBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLFFBQUEsQ0FBQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7OztVQUdBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO1lBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7ZUFFQSxHQUFBLEdBQUEsaUJBQUEsU0FBQSxHQUFBO2NBQ0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsU0FBQSxNQUFBLElBQUE7a0JBQ0EsU0FBQSxNQUFBLEtBQUE7a0JBQ0EsZ0JBQUEsTUFBQSxHQUFBOztjQUVBLEdBQUEsT0FBQSxLQUFBO2NBQ0EsR0FBQSxtQkFBQTs7Y0FFQTtZQUNBLEdBQUEsT0FBQSxLQUFBOzs7UUFHQSxTQUFBLGdCQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsU0FBQSxNQUFBLEtBQUE7O1VBRUEsR0FBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLG1CQUFBOztRQUVBLFNBQUEsVUFBQSxLQUFBO1VBQ0EsR0FBQSxXQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBLEtBQUE7WUFDQSxnQkFBQSxNQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLEdBQUEsR0FBQSxhQUFBO1lBQ0E7O1VBRUEsR0FBQSxlQUFBO1VBQ0EsR0FBQSxPQUFBLEdBQUEsWUFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFlBQUEsS0FBQSxTQUFBLEdBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsUUFBQSwrQkFBQTtZQUNBLE9BQUEsR0FBQSxrQkFBQSxDQUFBLE1BQUEsU0FBQTtZQUNBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlHQUFBLFVBQUEsUUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBLFNBQUEsS0FBQTtJQUNBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkpBQUEsVUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxRQUFBLFlBQUEsWUFBQSxnQkFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGtCQUFBOztFQUVBLEdBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLFdBQUE7Ozs7RUFJQSxHQUFBLFVBQUE7R0FDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQSxTQUFBLElBQUEsS0FBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsSUFBQSxLQUFBOztJQUVBLFNBQUEsVUFBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsR0FBQSxNQUFBOztJQUVBLFlBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsR0FBQTs7T0FFQSxHQUFBLFVBQUEsVUFBQTs7Ozs7O0dBTUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBOztJQUVBLFdBQUEsU0FBQSxJQUFBLEtBQUE7O0tBRUEsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFdBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLGVBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLEdBQUE7O09BRUEsR0FBQSxVQUFBLGFBQUE7Ozs7Ozs7R0FPQSxPQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7OztFQUtBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLFFBQUE7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsR0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUEsZ0NBQUE7U0FDQSxHQUFBLE9BQUEsT0FBQTs7O1VBR0E7UUFDQSxPQUFBLEdBQUE7O0tBRUE7SUFDQSxLQUFBOztLQUVBO0lBQ0E7Ozs7O0VBS0EsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxXQUFBO0lBQ0EsR0FBQSxPQUFBLFNBQUEsTUFBQSxZQUFBO0lBQ0EsR0FBQSxTQUFBOztPQUVBO0lBQ0EsR0FBQSxTQUFBLFNBQUE7O0dBRUEsR0FBQSxRQUFBLEtBQUEsUUFBQSxrQ0FBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLGNBQUE7OztRQUdBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOztRQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsK0JBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOzs7Ozs7O0FDM0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlJQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxXQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBOztFQUVBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsWUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsWUFBQSxTQUFBLElBQUE7S0FDQSxHQUFBLE9BQUEsSUFBQSxTQUFBLFlBQUE7TUFDQSxhQUFBLElBQUEsTUFBQTs7OztRQUlBLEdBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztHQUVBLG1CQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEscUNBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGNBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxVQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsUUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxHQUFBLFdBQUE7O1FBRUE7S0FDQSxHQUFBLFdBQUE7Ozs7RUFJQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQzNHQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1RUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTs7SUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLGFBQUE7Ozs7OztBQ05BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJIQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxPQUFBOztFQUVBLElBQUEsS0FBQTs7SUFFQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLFdBQUE7RUFDQTtJQUNBLEdBQUEsVUFBQTtNQUNBLFFBQUE7UUFDQSxVQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7O0lBRUEsa0JBQUEsVUFBQTtLQUNBLElBQUEsT0FBQTtNQUNBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLFNBQUEsS0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLElBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxHQUFBLE1BQUE7T0FDQSxHQUFBLFdBQUE7Ozs7SUFJQSxZQUFBLFNBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7TUFDQSxXQUFBLEtBQUEsR0FBQSxNQUFBO01BQ0EsR0FBQSxZQUFBOzs7O01BSUEsVUFBQTs7O0VBR0E7OztFQUdBLFNBQUEsUUFBQTs7O0VBR0EsU0FBQSxXQUFBLE1BQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsS0FBQSxPQUFBLEtBQUE7S0FDQSxPQUFBOztJQUVBLEdBQUEsTUFBQSxTQUFBO0tBQ0EsSUFBQSxZQUFBLFdBQUEsTUFBQSxNQUFBO0tBQ0EsR0FBQSxVQUFBO01BQ0EsT0FBQTs7OztHQUlBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQy9KQSxDQUFBLFVBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsZUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxlQUFBOzs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNklBQUEsU0FBQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFdBQUEsV0FBQSxnQkFBQSxvQkFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQSxNQUFBLEdBQUEsZUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsT0FBQSxNQUFBLEdBQUEsU0FBQTtFQUNBLEdBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQTtHQUNBLEtBQUE7O0VBRUEsR0FBQSxVQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsU0FBQSxXQUFBOzs7O0lBSUEsSUFBQSxPQUFBLE9BQUEsTUFBQTtLQUNBLEdBQUEsT0FBQSxPQUFBLE9BQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxVQUFBLE1BQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxHQUFBLFVBQUEsTUFBQSxHQUFBLFFBQUEsT0FBQSxPQUFBLE1BQUE7T0FDQSxHQUFBLFNBQUE7OztXQUdBLElBQUEsQ0FBQSxHQUFBLFFBQUE7S0FDQSxHQUFBLFNBQUE7OztJQUdBLElBQUEsR0FBQSxVQUFBLFFBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsVUFBQSxPQUFBLFFBQUEsS0FBQTtPQUNBLElBQUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxlQUFBOzs7WUFHQSxJQUFBLENBQUEsR0FBQSxjQUFBO01BQ0EsR0FBQSxlQUFBOzs7U0FHQSxJQUFBLENBQUEsR0FBQSxjQUFBO0tBQ0EsR0FBQSxlQUFBOztJQUVBLFFBQUEsR0FBQSxNQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxHQUFBLFFBQUE7SUFDQSxLQUFBLENBQUE7SUFDQSxLQUFBOzs7O0VBSUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxTQUFBLFdBQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLGNBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0EsU0FBQSxRQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQTs7R0FFQTs7RUFFQSxTQUFBLHFCQUFBO0dBQ0EsT0FBQSxHQUFBLHVCQUFBO0lBQ0EsS0FBQSxHQUFBLFFBQUE7O0dBRUE7R0FDQTs7RUFFQSxTQUFBLGFBQUEsS0FBQSxHQUFBO0dBQ0EsSUFBQSxJQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFNBQUEsYUFBQTtJQUNBLEdBQUEsVUFBQTtJQUNBO1VBQ0E7SUFDQSxPQUFBLE1BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxlQUFBLG9CQUFBLEdBQUEsVUFBQSxJQUFBLEdBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsY0FBQTs7O0VBR0EsU0FBQSxRQUFBLEtBQUE7R0FDQSxHQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsdUJBQUE7SUFDQSxNQUFBOzs7RUFHQSxTQUFBLFVBQUEsT0FBQTtHQUNBLEdBQUEsU0FBQSxVQUFBO0dBQ0EsT0FBQSxHQUFBLHVCQUFBO0lBQ0EsT0FBQSxHQUFBOzs7RUFHQSxTQUFBLFFBQUEsTUFBQSxRQUFBO0dBQ0EsZUFBQSxpQkFBQSxHQUFBLFVBQUEsSUFBQSxHQUFBLE1BQUEsR0FBQSxRQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0E7S0FDQSxHQUFBLE9BQUE7S0FDQSxJQUFBLE1BQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxLQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQSxRQUFBLEtBQUE7T0FDQSxJQUFBLEdBQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUEsR0FBQSxLQUFBO1FBQ0EsTUFBQSxHQUFBLFFBQUE7UUFDQTs7OztLQUlBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO01BQ0EsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLEdBQUEsU0FBQTtPQUNBLElBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO1FBQ0EsV0FBQTs7O01BR0EsR0FBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsV0FBQSxLQUFBO01BQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsV0FBQSxLQUFBOzs7S0FHQSxHQUFBLGdCQUFBO01BQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQSxjQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUEsR0FBQSxLQUFBOzs7S0FHQTtLQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBLE1BQUEsTUFBQSxDQUFBLEdBQUE7S0FDQSxtQkFBQSxRQUFBLEdBQUEsTUFBQSxHQUFBLFVBQUEsT0FBQSxZQUFBOzs7Ozs7O0VBT0EsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLFFBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBO0lBQ0EsSUFBQSxHQUFBLFFBQUEsT0FBQSxLQUFBO0tBQ0EsUUFBQSxXQUFBOzs7Ozs7R0FNQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsTUFBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7O01BRUEsTUFBQSxXQUFBO09BQ0EsT0FBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7WUFJQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O0tBSUE7O0dBRUEsT0FBQTtHQUNBO0VBQ0EsR0FBQSxvQkFBQSxTQUFBLGVBQUEsY0FBQTtHQUNBLFFBQUEsR0FBQSxNQUFBLEdBQUE7Ozs7OztBQzNPQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4Q0FBQSxVQUFBLFNBQUEsTUFBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxxQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztHQUdBOzs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseURBQUEsU0FBQSxZQUFBLFFBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxnQkFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLEdBQUEsTUFBQSxrQkFBQTs7OztRQUlBLFNBQUEsU0FBQTtVQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxRQUFBLElBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxXQUFBLGFBQUEsTUFBQSxRQUFBLFlBQUEsV0FBQSxhQUFBO2FBQ0EsTUFBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLE1BQUEsd0NBQUE7Ozs7Ozs7QUNoQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrRUFBQSxTQUFBLFFBQUEsYUFBQSxrQkFBQSxvQkFBQTs7O0VBR0EsSUFBQSxPQUFBO0dBQ0EsVUFBQTtFQUNBLElBQUEsT0FBQSxhQUFBLEtBQUE7R0FDQSxPQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQSxtQkFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxXQUFBOztHQUVBLFNBQUE7R0FDQSxTQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxZQUFBO0lBQ0EsS0FBQTtLQUNBLE1BQUE7S0FDQSxLQUFBLHNGQUFBO0tBQ0EsTUFBQTtLQUNBLGNBQUE7TUFDQSxRQUFBO01BQ0EsaUJBQUE7TUFDQSxjQUFBOzs7OztFQUtBLEdBQUEsY0FBQSxFQUFBLFVBQUEsbUZBQUEsUUFBQTtHQUNBLFFBQUE7R0FDQSxpQkFBQTtHQUNBLE1BQUE7R0FDQSxjQUFBOztFQUVBLEdBQUEsWUFBQTtHQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7R0FFQSxXQUFBO0lBQ0EsS0FBQSxDQUFBO0lBQ0EsS0FBQSxDQUFBOzs7RUFHQSxHQUFBLFdBQUE7R0FDQSxRQUFBOztFQUVBLEdBQUEsZUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTs7OztFQUlBLElBQUEsWUFBQSxFQUFBO0VBQ0EsVUFBQSxZQUFBO0VBQ0EsVUFBQSxhQUFBLFdBQUE7R0FDQSxFQUFBLEtBQUEsV0FBQSxNQUFBOztFQUVBLFVBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxZQUFBLEVBQUEsUUFBQSxPQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxRQUFBLE9BQUEsS0FBQSxrQ0FBQTtHQUNBLEtBQUEsY0FBQTtHQUNBLEtBQUEsUUFBQTtHQUNBLEVBQUEsU0FBQSx3QkFBQTtHQUNBLEVBQUEsU0FBQSxZQUFBLFdBQUEsU0FBQSxXQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxHQUFBO01BQ0EsR0FBQSxVQUFBO1lBQ0E7TUFDQSxJQUFBLFNBQUEsR0FBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsVUFBQTs7OztHQUlBLE9BQUE7O0VBRUEsSUFBQSxXQUFBLEVBQUE7RUFDQSxTQUFBLFlBQUE7RUFDQSxTQUFBLGFBQUEsV0FBQTtHQUNBLEVBQUEsS0FBQSxXQUFBLE1BQUE7O0VBRUEsU0FBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFlBQUEsRUFBQSxRQUFBLE9BQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFFBQUEsT0FBQSxLQUFBLGtDQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsUUFBQSxPQUFBLFdBQUEsNkJBQUE7R0FDQSxLQUFBLFFBQUE7R0FDQSxLQUFBLGNBQUE7R0FDQSxFQUFBLFNBQUEsd0JBQUE7R0FDQSxFQUFBLFNBQUEsWUFBQSxXQUFBLFNBQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsSUFBQSxRQUFBLENBQUEsV0FBQSxZQUFBOzs7R0FHQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBLGFBQUE7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQSxZQUFBLEdBQUE7S0FDQSxHQUFBLFVBQUE7V0FDQTtLQUNBLElBQUEsU0FBQSxHQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsR0FBQSxVQUFBOzs7OztFQUtBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0dBQ0EsbUJBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxxRUFBQSxtQkFBQSxZQUFBLCtDQUFBLG1CQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsRUFBQSxVQUFBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLGFBQUE7SUFDQSxpQkFBQSxDQUFBLG1CQUFBLFlBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUEsU0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxTQUFBLFNBQUEsU0FBQTs7S0FFQSxPQUFBOztJQUVBLE9BQUEsU0FBQSxTQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsTUFBQSxRQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsT0FBQTs7OztHQUlBLElBQUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hKQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwRUFBQSxTQUFBLFFBQUEsWUFBQSxvQkFBQSxRQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLEtBQUEsR0FBQSxVQUFBLG9CQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxJQUFBOzs7VUFHQSxHQUFBLFFBQUEsR0FBQSxVQUFBLGlCQUFBLFdBQUE7VUFDQSxHQUFBLGdCQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQSxpQkFBQTs7O1FBR0EsU0FBQSxRQUFBLFFBQUE7VUFDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBOztNQUVBLFNBQUEsY0FBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7T0FDQTs7UUFFQSxPQUFBLE9BQUEsY0FBQSxVQUFBLEdBQUEsR0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBO1lBQ0E7OztZQUdBLEdBQUEsRUFBQSxJQUFBO2NBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7WUFFQTtZQUNBLGdCQUFBLEVBQUE7Ozs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLFVBQUEsV0FBQTtFQUNBLEtBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxXQUFBO0dBQ0EseUJBQUE7R0FDQSxrQkFBQTs7O0VBR0EsS0FBQSxlQUFBLFVBQUEsTUFBQSxJQUFBO0dBQ0EsVUFBQSxLQUFBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSx3QkFBQSxPQUFBO0tBQ0EsR0FBQTtLQUNBLFlBQUE7Ozs7SUFJQSxLQUFBLGdCQUFBLFdBQUE7R0FDQSxVQUFBLEtBQUE7O0tBRUEsYUFBQTtTQUNBLGtCQUFBOztLQUVBLEtBQUEsVUFBQSxRQUFBOztPQUVBLFlBQUE7Ozs7Ozs7OztBQzVCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4REFBQSxTQUFBLFFBQUEsZUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxhQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxPQUFBLFVBQUE7O1lBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsY0FBQSxLQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQTtjQUNBLGNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDbkJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLGNBQUE7O01BRUEsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFVBQUE7O1VBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLGNBQUE7Ozs7O01BS0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxjQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLFFBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbURBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnREFBQSxTQUFBLFFBQUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0VBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLG1CQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFdBQUE7RUFDQSxPQUFBLE9BQUEsWUFBQTs7R0FFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTtLQUNBLElBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxhQUFBO01BQ0EsYUFBQSxhQUFBLEtBQUE7T0FDQSxhQUFBO09BQ0EsT0FBQTs7O0tBR0EsSUFBQSxPQUFBLGFBQUEsYUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBLEdBQUEsYUFBQTtNQUNBLEtBQUEsZUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFlBQUE7TUFDQSxLQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxjQUFBO01BQ0EsS0FBQSxhQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsVUFBQTtNQUNBLEtBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7O01BRUEsSUFBQSxPQUFBLEtBQUEsU0FBQSxhQUFBO09BQ0EsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBO09BQ0EsS0FBQSxXQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7Ozs7OztHQU1BLGNBQUE7R0FDQSxhQUFBOzs7O0VBSUEsT0FBQSxPQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7R0FDQSxjQUFBOzs7Ozs7O0FDcERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0RBQUEsU0FBQSxPQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1dBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLEdBQUE7WUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUVBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxNQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7O0VBR0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTtPQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTthQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0tBSUEsR0FBQSxLQUFBLE9BQUEsS0FBQTs7O0dBR0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsY0FBQTs7S0FFQTs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMEJBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxVQUFBO2dCQUNBLFNBQUEsR0FBQTtlQUNBOzs7Ozs7OztBQ1RBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxNQUFBLE1BQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG9CQUFBLEdBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsb0JBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7S0FDQSxvQkFBQSxLQUFBOzs7O0VBSUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsV0FBQSxVQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsT0FBQSxNQUFBLGlDQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLFNBQUE7R0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBLFNBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUEsS0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxVQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLE1BQUEsWUFBQSxDQUFBLE1BQUE7S0FDQSxJQUFBLFlBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0dBSUEsT0FBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtPQUNBLFVBQUEsU0FBQSxPQUFBLEVBQUE7Ozs7T0FJQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxXQUFBLE9BQUEsRUFBQTs7OztHQUlBLEdBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxJQUFBLFlBQUEsVUFBQSxHQUFBLE1BQUEsR0FBQTtJQUNBLFVBQUEsU0FBQSxLQUFBLEdBQUE7OztPQUdBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBLEtBQUE7R0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsYUFBQSxHQUFBLEtBQUEsVUFBQTs7S0FFQTs7O0dBR0EsT0FBQSxRQUFBLDZCQUFBO0dBQ0EsT0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQTs7U0FFQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBOzs7O1FBSUE7S0FDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLEtBQUEsV0FBQTtTQUNBLElBQUEsU0FBQSxVQUFBLE1BQUEsR0FBQTtTQUNBLEdBQUEsQ0FBQSxPQUFBLFNBQUE7VUFDQSxPQUFBLFdBQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQSxPQUFBLFdBQUE7O1VBRUE7T0FDQSxHQUFBLFdBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUEsK0JBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7OztBQ25JQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxLQUFBLElBQUEsSUFBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7T0FDQSxPQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxNQUFBLGFBQUEsVUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUE7TUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO1FBQ0EsU0FBQTtRQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBOztLQUVBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsY0FBQTtPQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7O1VBR0E7T0FDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsSUFBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7OztJQU9BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBO0tBQ0EsU0FBQSxZQUFBO09BQ0EsVUFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBOztNQUVBOzs7Ozs7OztBQ2xKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsa0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsSUFBQTtHQUNBLEdBQUEsR0FBQSxlQUFBLElBQUE7SUFDQSxHQUFBLGNBQUE7O09BRUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsR0FBQSxZQUFBOztPQUVBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7OztFQUdBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUE7O0dBRUEsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQTtPQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUEsV0FBQSxRQUFBLE1BQUE7OztJQUdBLEdBQUEsWUFBQTs7Ozs7Ozs7Ozs7OztBQ3hGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7O0VBRUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsS0FBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLE9BQUEsZUFBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0dBQ0EsT0FBQSxlQUFBLEdBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsOEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsV0FBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBOzs7O09BSUE7SUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsNEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsUUFBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsU0FBQSxJQUFBLEtBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsWUFBQSxPQUFBLEtBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDekZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsRUFBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsTUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7O0lBR0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxLQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7O0tBRUEsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7T0FFQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7O0tBR0EsR0FBQSxTQUFBLFNBQUEsS0FBQTtNQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsU0FBQSxNQUFBO01BQ0EsWUFBQSxLQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBLFNBQUE7O0tBRUEsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsU0FBQSxVQUFBOztLQUVBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBOztLQUVBLFFBQUEsY0FBQTtLQUNBLFFBQUE7Ozs7SUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsUUFBQSxPQUFBLEdBQUEsUUFBQSxFQUFBO0tBQ0EsV0FBQSxJQUFBLE9BQUE7T0FDQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBO0tBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7TUFDQSxTQUFBLE9BQUE7UUFDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO1FBQ0EsS0FBQSxjQUFBLE1BQUE7UUFDQSxLQUFBLGdCQUFBLE1BQUE7O0tBRUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUEsSUFBQSxFQUFBLE1BQUE7S0FDQSxPQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsR0FBQSxRQUFBLFlBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxVQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsQ0FBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0E7O01BRUEsWUFBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxZQUFBLFVBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTthQUNBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7O0tBSUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7TUFDQSxHQUFBLE1BQUEsR0FBQSxPQUFBOztNQUVBLE1BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLEdBQUEsSUFBQSxPQUFBLFFBQUEsWUFBQSxJQUFBO1NBQ0EsWUFBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO1NBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxJQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7OztNQUtBLElBQUEsR0FBQSxNQUFBO1FBQ0EsT0FBQSxDQUFBLEtBQUE7UUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLE1BQUE7TUFDQSxNQUFBLEVBQUE7U0FDQSxPQUFBLENBQUEsR0FBQTtTQUNBLEdBQUEsU0FBQTtTQUNBLEdBQUEsWUFBQTtNQUNBLE9BQUEsT0FBQSxlQUFBLEtBQUE7TUFDQSxRQUFBLE9BQUEsZUFBQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsR0FBQSxJQUFBLE9BQUEsUUFBQSxZQUFBLElBQUE7U0FDQSxZQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7U0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLElBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7QUMxUkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOztLQUVBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsTUFBQSxVQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsVUFBQSxJQUFBLEtBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUE7UUFDQTtZQUNBLE9BQUEsRUFBQTs7UUFFQSxJQUFBLEtBQUEsR0FBQSxTQUFBO1FBQ0EsTUFBQSxPQUFBLFFBQUE7UUFDQSxNQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDJEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTtDQUNBLE1BQUEsU0FBQTtLQUNBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxLQUFBLEdBQUE7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQTs7O1FBR0EsR0FBQSxJQUFBLE9BQUEsVUFBQSxFQUFBO1NBQ0EsTUFBQSxPQUFBLEtBQUEsSUFBQSxLQUFBOztZQUVBO1NBQ0EsUUFBQSxJQUFBOzs7T0FHQSxTQUFBLFVBQUE7UUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7OztBQ3hFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSw4QkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw2REFBQSxVQUFBLFFBQUEsVUFBQSxRQUFBLGNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7TUFDQSxhQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7OztPQUdBLE9BQUEsVUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLE1BQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTs7U0FFQSxJQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsT0FBQTs7U0FFQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsS0FBQSxXQUFBLGlCQUFBLHlCQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7WUFDQSxJQUFBLFFBQUE7YUFDQSxNQUFBO2FBQ0EsU0FBQTthQUNBLFFBQUE7YUFDQSxPQUFBOztZQUVBLEVBQUEsT0FBQSxLQUFBO1lBQ0EsT0FBQSxLQUFBOzs7O1NBSUEsSUFBQSxZQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUE7V0FDQSxJQUFBLElBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxRQUFBLGFBQUE7YUFDQSxRQUFBLEtBQUEsT0FBQTs7WUFFQSxRQUFBLEtBQUEsS0FBQSxLQUFBOzs7O2dCQUlBOztVQUVBLEVBQUEsT0FBQTs7VUFFQSxhQUFBLFFBQUE7Ozs7OztPQU1BLGtCQUFBLFVBQUEsT0FBQTs7O1FBR0EsSUFBQSxRQUFBLE1BQUEsTUFBQSxjQUFBO1FBQ0EsSUFBQSxZQUFBO1FBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTs7UUFFQSxJQUFBLFNBQUEsU0FBQSxHQUFBO1NBQ0EsV0FBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUE7U0FDQSxZQUFBOztRQUVBLElBQUEsUUFBQTs7UUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7U0FDQSxJQUFBLFNBQUEsSUFBQTtVQUNBLFNBQUEsS0FBQSxTQUFBLEdBQUEsUUFBQSxlQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUEsR0FBQSxRQUFBLE9BQUEsQ0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7O1VBRUEsSUFBQSxPQUFBLFNBQUEsR0FBQSxNQUFBO1VBQ0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtXQUNBLFNBQUEsS0FBQTtXQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsTUFBQSxLQUFBLEtBQUE7YUFDQSxJQUFBLElBQUEsR0FBQTtjQUNBLFNBQUEsTUFBQTs7YUFFQSxTQUFBLE1BQUEsS0FBQTs7Ozs7VUFLQSxJQUFBLFNBQUEsR0FBQSxVQUFBLEdBQUE7V0FDQSxNQUFBLEtBQUE7Ozs7UUFJQSxJQUFBLFNBQUEsVUFBQSxNQUFBLFFBQUE7U0FDQSxhQUFBO1NBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLGFBQUE7V0FDQSxRQUFBLFNBQUEsTUFBQTs7VUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBOzs7O1FBSUEsT0FBQSxTQUFBLEtBQUEsYUFBQSxNQUFBLE9BQUE7O09BRUEsT0FBQSxVQUFBLEtBQUEsTUFBQTtRQUNBLGFBQUEsTUFBQTs7T0FFQSxVQUFBLFVBQUEsU0FBQTs7UUFFQSxhQUFBLFVBQUE7OztRQUdBLElBQUEsQ0FBQSxZQUFBO1NBQ0EsUUFBQSxRQUFBLGFBQUEsZ0JBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxLQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxHQUFBO1dBQ0EsYUFBQSxZQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLGdCQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEtBQUEsS0FBQSxXQUFBLFVBQUEsR0FBQTtXQUNBLGFBQUEsYUFBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLGFBQUEsQ0FBQSxLQUFBLElBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxHQUFBO1dBQ0EsYUFBQSxlQUFBOzs7ZUFHQTtTQUNBLFFBQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsS0FBQSxTQUFBO1VBQ0EsSUFBQSxLQUFBLGlCQUFBLGVBQUEsT0FBQSxPQUFBLGFBQUE7V0FDQSxJQUFBLElBQUE7WUFDQSxLQUFBLElBQUE7O1dBRUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLFFBQUEsR0FBQTtZQUNBLEVBQUEsWUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO2FBQ0EsSUFBQSxPQUFBLFdBQUEsaUJBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtjQUNBLEtBQUEsT0FBQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFNBQUE7ZUFDQSxRQUFBOztjQUVBOzs7OztXQUtBLGFBQUEsUUFBQTtZQUNBLE1BQUEsQ0FBQTtZQUNBLFFBQUEsS0FBQTs7OztTQUlBLGFBQUEsWUFBQTs7UUFFQSxhQUFBO1FBQ0EsU0FBQSxVQUFBO1NBQ0EsT0FBQSxLQUFBLGFBQUEsZ0JBQUEsb0JBQUE7U0FDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyTUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7S0FFQSxTQUFBLFNBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsV0FBQTs7SUFFQSxJQUFBLElBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLElBQUEsS0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxTQUFBO09BQ0EsT0FBQTthQUNBLEtBQUEsYUFBQSxhQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLEVBQUE7OztRQUdBLElBQUEsTUFBQSxHQUFBO01BQ0E7TUFDQSxZQUFBLE9BQUEsSUFBQTtNQUNBLFlBQUEsT0FBQSxJQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTs7O1FBR0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUEsUUFBQSxLQUFBLEtBQUE7YUFDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTthQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTthQUNBLEdBQUEsWUFBQSxXQUFBLEdBQUEsV0FBQTtJQUNBLElBQUEsS0FBQTtPQUNBLE1BQUEsTUFBQTtPQUNBLFVBQUE7T0FDQSxLQUFBO09BQ0E7T0FDQSxPQUFBO09BQ0EsS0FBQSxLQUFBO1dBQ0EsS0FBQSxTQUFBLEdBQUEsRUFBQSxLQUFBLFdBQUE7V0FDQSxNQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7T0FDQSxNQUFBLFVBQUE7V0FDQSxHQUFBLFNBQUE7O1FBRUEsR0FBQSxTQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLGFBQUEsU0FBQTtpQkFDQSxVQUFBLEtBQUE7OztJQUdBLElBQUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtJQUNBLFNBQUEsV0FBQSxFQUFBO0tBQ0EsTUFBQSxRQUFBLENBQUEsUUFBQSxFQUFBLEtBQUE7O1FBRUEsU0FBQSxVQUFBLEVBQUE7O01BRUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtZQUNBLE1BQUEsYUFBQSxDQUFBLEVBQUEsS0FBQTtNQUNBLE1BQUE7OztRQUdBLFNBQUEsU0FBQSxFQUFBOztZQUVBLE1BQUEsYUFBQTtNQUNBLE1BQUE7Ozs7UUFJQSxTQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLEVBQUE7WUFDQSxPQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsSUFBQSxFQUFBOztJQUVBLFNBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLEVBQUE7OztJQUdBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTs7Ozs7Ozs7O0FDaEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7O0dBRUEsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLEtBQUE7TUFDQSxPQUFBO01BQ0EsUUFBQTtNQUNBLE1BQUE7O0tBRUEsUUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsU0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFFBQUE7OztJQUdBLElBQUEsUUFBQTtLQUNBLEdBQUEsR0FBQSxNQUFBOztJQUVBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQTtJQUNBLE1BQUEsRUFBQSxNQUFBLENBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxPQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxPQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxTQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQSxXQUFBLFNBQUEsV0FBQSxHQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLEtBQUEsU0FBQTtJQUNBLElBQUEsWUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLFNBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7OztLQVlBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7Ozs7Ozs7SUFVQSxJQUFBLFlBQUE7TUFDQSxPQUFBOztJQUVBLFVBQUEsS0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7UUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsQ0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLGFBQUE7TUFDQSxPQUFBO0lBQ0EsV0FBQSxLQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxTQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7SUFJQSxTQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7S0FDQSxJQUFBO0tBQ0EsU0FBQSxPQUFBLElBQUEsS0FBQSxNQUFBO0tBQ0EsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxDQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxDQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUEsQ0FBQTtNQUNBLFVBQUEsTUFBQTs7S0FFQSxVQUFBO0tBQ0EsT0FBQTs7SUFFQSxNQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUE7OztNQUdBLFVBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO1FBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxHQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsR0FBQTtTQUNBLFVBQUE7O1FBRUEsT0FBQSxjQUFBLEtBQUEsV0FBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLFVBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsRUFBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxVQUFBLEdBQUE7U0FDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7U0FHQSxLQUFBLE9BQUEsU0FBQSxHQUFBLEVBQUE7UUFDQSxFQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUE7Ozs7Ozs7Ozs7OztBQzlKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxHQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQTs7R0FFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE1BQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBOzs7SUFHQSxvQkFBQTs7SUFFQSxRQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxRQUFBO0tBQ0EsWUFBQTs7SUFFQSxPQUFBO0tBQ0EsYUFBQTs7Ozs7R0FLQSxJQUFBLEdBQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxRQUFBLElBQUEsR0FBQTtHQUNBLE9BQUEsR0FBQTs7RUFFQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsR0FBQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7OztHQUdBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxRQUFBLFVBQUEsUUFBQTtJQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUE7R0FDQTtFQUNBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQTtHQUNBOzs7RUFHQSxPQUFBLE9BQUEsZ0JBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7Ozs7QUNqSUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsa0JBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxVQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsTUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBOzs7RUFHQSxTQUFBLGNBQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLEtBQUEsT0FBQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxZQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsS0FBQTtJQUNBLEdBQUEsY0FBQTtLQUNBLEdBQUEsUUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBLDRCQUFBOzs7Ozs7O0FDNUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7O0tBRUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTs7O0tBR0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7SUFZQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDeFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBLE1BQUEsY0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDckZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsV0FBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxnQ0FBQSxTQUFBLGlCQUFBO0VBQ0EsSUFBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLE1BQUE7R0FDQSxNQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsV0FBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTs7R0FFQSxRQUFBO0dBQ0EsU0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFlBQUEsYUFBQTtRQUNBLFFBQUEsT0FBQSxTQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7Ozs7OztBQzNCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxhQUFBLFlBQUE7SUFDQSxHQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsVUFBQSxFQUFBO0lBQ0EsR0FBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsUUFBQTs7O0dBR0EsR0FBQSxRQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLE9BQUE7O09BRUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxRQUFBLG9CQUFBO0lBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxNQUFBOztHQUVBLEtBQUEsV0FBQTtHQUNBLEtBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsU0FBQTtJQUNBLEdBQUEsU0FBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLFFBQUE7OztHQUdBLE9BQUE7Ozs7Ozs7RUFPQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtLQUNBLFFBQUE7O0lBRUEsR0FBQSxDQUFBLE1BQUE7S0FDQSxTQUFBLGNBQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE9BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ2pCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5QkFBQSxTQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxVQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0tBQ0EsTUFBQSxTQUFBLE1BQUEsR0FBQSxNQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsR0FBQSxNQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE1BQUE7S0FDQSxNQUFBLFNBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsSUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsVUFBQTs7R0FFQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnRkJBbmd1bGFyJywnZG5kTGlzdHMnLCdhbmd1bGFyLmZpbHRlcicsJ2FuZ3VsYXJNb21lbnQnLCduZ1Njcm9sbGJhcicsJ21kQ29sb3JQaWNrZXInLCduZ0FuaW1hdGUnLCd1aS50cmVlJywndG9hc3RyJywndWkucm91dGVyJywgJ21kLmRhdGEudGFibGUnLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsICduZ1Nhbml0aXplJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdudmQzJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWydhbmd1bGFyLWNhY2hlJywndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdFx0Ly9cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKSB7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hlYWRlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fSxcblx0XHRcdFx0XHQnbWFwQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXAnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdNYXBDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGVtZW51QCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzaWRlbWVudScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NpZGVtZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5ob21lJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0dmlld3M6IHtcblxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdob21lJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbihEYXRhU2VydmljZSwgJGF1dGgpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdtZScpLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2luZGV4Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGNvdW50cmllczogZnVuY3Rpb24oQ291bnRyaWVzU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YScsIHtcblx0XHRcdFx0dXJsOiAnL215LWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE15RGF0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEuZW50cnknLCB7XG5cdFx0XHRcdHVybDogJy86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFFbnRyeUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3R5bGVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0dHJlZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3JzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGljYXRvci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3I6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycsIHtcblx0XHRcdFx0dXJsOiAnL2luZGl6ZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRleDogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZVBhcmFtcy5pZCA9PSAwKSByZXR1cm4ge307XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SXRlbSgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JpbmRpemVzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yaW5kaXplc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YS5hZGQnLCB7XG5cdFx0XHRcdHVybDogJy9hZGQnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdhZGRpdGlvbmFsQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRpY2F0b3JzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5pZGNhdG9yc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzLmluZGljYXRvci5kZXRhaWxzJywge1xuXHRcdFx0XHR1cmw6ICcvOmVudHJ5Jyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93J1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJywge1xuXHRcdFx0XHR1cmw6ICcvY2F0ZWdvcmllcycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmNhdGVnb3J5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yY2F0ZWdvcnlDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnk6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkc3RhdGVQYXJhbXMuaWQgPT0gJ25ldycpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHt9O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcnkoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhjcmVhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhjcmVhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnLCB7XG5cdFx0XHRcdHVybDogJy9iYXNpYycsXG5cdFx0XHRcdGF1dGg6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jaGVjaycsIHtcblx0XHRcdFx0dXJsOiAnL2NoZWNraW5nJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhDaGVjaycpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja1NpZGViYXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNZXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNZXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2ZpbmFsJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhGaW5hbCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4RmluYWxDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbE1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lmxpc3QnLCB7XG5cdFx0XHRcdHVybDogJy9saXN0Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjYXRlZ29yaWVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHRyZWU6IHRydWVcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmdWxsTGlzdCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Z1bGxMaXN0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5saXN0LmZpbHRlcicse1xuXHRcdFx0XHR1cmw6Jy86ZmlsdGVyJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2Z1bGxMaXN0L2ZpbHRlci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGdWxsTGlzdEZpdGxlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2luZGljYXRvci86aWQvOm5hbWUvOnllYXIvOmdlbmRlci86aXNvJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcjogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRpY2F0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JTaG93Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0cGFyYW1zOntcblx0XHRcdFx0XHR5ZWFyOntcblx0XHRcdFx0XHRcdHNxdWFzaDp0cnVlLFxuXHRcdFx0XHRcdFx0dmFsdWU6bnVsbCxcblx0XHRcdFx0XHRcdGR5bmFtaWM6dHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Z2VuZGVyOntcblx0XHRcdFx0XHRcdHNxdWFzaDp0cnVlLFxuXHRcdFx0XHRcdFx0dmFsdWU6bnVsbCxcblx0XHRcdFx0XHRcdGR5bmFtaWM6dHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aXNvOntcblx0XHRcdFx0XHRcdHNxdWFzaDp0cnVlLFxuXHRcdFx0XHRcdFx0dmFsdWU6bnVsbCxcblx0XHRcdFx0XHRcdGR5bmFtaWM6dHJ1ZVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lyouc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicsIHtcblx0XHRcdFx0dXJsOiAnLzp5ZWFyJyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5nZW5kZXInLCB7XG5cdFx0XHRcdHVybDogJy86Z2VuZGVyJyxcblx0XHRcdH0pKi9cblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvci5pbmZvJywge1xuXHRcdFx0XHR1cmw6ICcvZGV0YWlscycsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSgkc3RhdGVQYXJhbXMuaWQsICRzdGF0ZVBhcmFtcy55ZWFyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oSW5kaXplc1NlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBJbmRpemVzU2VydmljZS5mZXRjaERhdGEoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y291bnRyaWVzOiBmdW5jdGlvbihDb3VudHJpZXNTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXgvc2VsZWN0ZWQuaHRtbCcsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5pbmZvJywge1xuXHRcdFx0XHR1cmw6ICcvaW5mbycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5mb0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4aW5mbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0dXJsOiAnLzppdGVtJyxcblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J3NlbGVjdGVkJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWxlY3RlZEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGdldENvdW50cnk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCAkc3RhdGVQYXJhbXMuaXRlbSkuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS86Y291bnRyaWVzJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2NvbmZsaWN0Jyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleCcsIHtcblx0XHRcdFx0dXJsOiAnL2luZGV4Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdG5hdGlvbnM6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjb25mbGljdHMvbmF0aW9ucycpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y29uZmxpY3RzOiBmdW5jdGlvbihSZXN0YW5ndWxhcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdHMnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0dXJsOiAnL25hdGlvbi86aXNvJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdG5hdGlvbjogZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnL2NvbmZsaWN0cy9uYXRpb25zLycsICRzdGF0ZVBhcmFtcy5pc28pLmdldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RuYXRpb25DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdG5hdGlvbicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbG9nb0AnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9nbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXguZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRjb25mbGljdDogZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnL2NvbmZsaWN0cy9ldmVudHMvJywgJHN0YXRlUGFyYW1zLmlkKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0ZGV0YWlsc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NvbmZsaWN0ZGV0YWlscycpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnaXRlbXMtbWVudUAnOiB7fSxcblx0XHRcdFx0XHQnbG9nb0AnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9nbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW1wb3J0Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0Jyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RJbXBvcnRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdEltcG9ydCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRtZFNpZGVuYXYsICR0aW1lb3V0LCAkYXV0aCwgJHN0YXRlLCAkbG9jYWxTdG9yYWdlLCAkd2luZG93LCBsZWFmbGV0RGF0YSwgdG9hc3RyKSB7XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgfHwgZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5zdGFydGVkID0gdHJ1ZTtcblx0XHQkcm9vdFNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0JHJvb3RTY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24obWVudUlkKSB7XG5cdFx0XHQkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XG5cdFx0fVxuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXHRcdFx0aWYgKHRvU3RhdGUuYXV0aCAmJiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdZb3VyIG5vdCBhbGxvd2VkIHRvIGdvIHRoZXJlIGJ1ZGR5IScsICdBY2Nlc3MgZGVuaWVkJyk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybiAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLmxheW91dCA9PSBcInJvd1wiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUucm93ZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiB0b1N0YXRlLnZpZXdzICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ21haW5AJykgfHwgdG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2l0ZW1zLW1lbnVAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2xvZ29AJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUubG9nb1ZpZXcgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5tYWluVmlldyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZS5pbmRleE9mKCdjb25mbGljdCcpID4gLTEgJiYgdG9TdGF0ZS5uYW1lICE9IFwiYXBwLmNvbmZsaWN0LmltcG9ydFwiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUubm9IZWFkZXIgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ub0hlYWRlciA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSAnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUucHJldmlvdXNQYWdlID0ge1xuXHRcdFx0XHRzdGF0ZTogZnJvbVN0YXRlLFxuXHRcdFx0XHRwYXJhbXM6IGZyb21QYXJhbXNcblx0XHRcdH07XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpO1xuXG5cblx0XHR9KTtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiR2aWV3Q29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSkge1xuXG5cdFx0fSk7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpIHtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0XHQkbWRTaWRlbmF2KCdsZWZ0TWVudScpLmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIHJlc2V0TWFwU2l6ZSgpIHtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cdFx0Lyp3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBhdm9pZHMgc2Nyb2xsaW5nIHdoZW4gdGhlIGZvY3VzZWQgZWxlbWVudCBpcyBlLmcuIGFuIGlucHV0XG4gICAgaWYgKFxuICAgICAgICAhZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5XG4gICAgKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCh0cnVlKTtcbiAgICB9XG59KTsqL1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcikge1xuXHRcdC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcblx0XHQvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuXHRcdCRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIudW5saW5rVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvdW5saW5rLyc7XG5cdFx0JGF1dGhQcm92aWRlci5mYWNlYm9vayh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9mYWNlYm9vaycsXG5cdFx0XHRjbGllbnRJZDogJzc3MTk2MTgzMjkxMDA3Midcblx0XHR9KTtcblx0XHQkYXV0aFByb3ZpZGVyLmdvb2dsZSh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9nb29nbGUnLFxuXHRcdFx0Y2xpZW50SWQ6ICcyNzY2MzQ1Mzc0NDAtY2d0dDE0cWoyZThpbnAwdnE1b3E5YjQ2azc0ampzM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbG9nUHJvdmlkZXIpe1xuICAgICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKGZhbHNlKTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKGNmcExvYWRpbmdCYXJQcm92aWRlcil7XG5cdFx0Y2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XG5cdFx0UmVzdGFuZ3VsYXJQcm92aWRlclxuXHRcdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHRcdC5zZXREZWZhdWx0SGVhZGVycyh7XG5cdFx0XHRcdGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiXG5cdFx0XHR9KVxuXHRcdFx0LnNldERlZmF1bHRIdHRwRmllbGRzKHtcblx0XHRcdFx0Y2FjaGU6IGZhbHNlXG5cdFx0XHR9KVxuXHRcdFx0LmFkZFJlc3BvbnNlSW50ZXJjZXB0b3IoZnVuY3Rpb24oZGF0YSwgb3BlcmF0aW9uLCB3aGF0LCB1cmwsIHJlc3BvbnNlLCBkZWZlcnJlZCkge1xuXHRcdFx0XHR2YXIgZXh0cmFjdGVkRGF0YTtcblx0XHRcdFx0ZXh0cmFjdGVkRGF0YSA9IGRhdGEuZGF0YTtcblx0XHRcdFx0aWYgKGRhdGEubWV0YSkge1xuXHRcdFx0XHRcdGV4dHJhY3RlZERhdGEuX21ldGEgPSBkYXRhLm1ldGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGEuaW5jbHVkZWQpIHtcblx0XHRcdFx0XHRleHRyYWN0ZWREYXRhLl9pbmNsdWRlZCA9IGRhdGEuaW5jbHVkZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGV4dHJhY3RlZERhdGE7XG5cdFx0XHR9KTtcblx0XHQvKlx0LnNldEVycm9ySW50ZXJjZXB0b3IoZnVuY3Rpb24ocmVzcG9uc2UsIGRlZmVycmVkLCByZXNwb25zZUhhbmRsZXIpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJybycpO1xuXHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XG5cbiAgICBcdFx0cmV0dXJuIGZhbHNlOyAvLyBlcnJvciBoYW5kbGVkXG4gICAgXHR9XG5cbiAgICBcdHJldHVybiB0cnVlOyAvLyBlcnJvciBub3QgaGFuZGxlZFxuXHRcdH0pOyovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlciwkbWRHZXN0dXJlUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuLypcdHZhciBuZW9uVGVhbE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcwMGNjYWEnXG4gIH0pO1xuXHR2YXIgd2hpdGVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnI2ZmZidcbiAgfSk7XG5cdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2JsdWUnLCB7XG4gICAgJzUwMCc6ICcjMDA2YmI5Jyxcblx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuICB9KTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25UZWFsJywgbmVvblRlYWxNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnd2hpdGVUZWFsJywgd2hpdGVNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnbGlnaHQtYmx1ZScpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7Ki9cblx0XHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdpbmRpZ28nLCB7XG5cdFx0XHQnNTAwJzogJyMwMDZiYjknLFxuXHRcdFx0J0EyMDAnOiAnIzAwNmJiOSdcblx0XHR9KTtcblx0XHRcdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2JsdWVyJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblxuXHRcdCAkbWRHZXN0dXJlUHJvdmlkZXIuc2tpcENsaWNrSGlqYWNrKCk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbih0b2FzdHJDb25maWcpe1xuICAgICAgICAvL1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICBhdXRvRGlzbWlzczogdHJ1ZSxcbiAgICAgICAgICBjb250YWluZXJJZDogJ3RvYXN0LWNvbnRhaW5lcicsXG4gICAgICAgICAgbWF4T3BlbmVkOiAyLFxuICAgICAgICAgIG5ld2VzdE9uVG9wOiB0cnVlLFxuICAgICAgICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC1ib3R0b20tcmlnaHQnLFxuICAgICAgICAgIHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHRhcmdldDogJ2JvZHknLFxuICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgIHByb2dyZXNzQmFyOnRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2FscGhhbnVtJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGlmICggIWlucHV0ICl7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhbXjAtOUEtWl0pL2csXCJcIik7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYWxsKSB7XG5cdFx0XHRyZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ2ZpbmRieW5hbWUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbmFtZSwgZmllbGQpIHtcblx0XHRcdC8vXG4gICAgICB2YXIgZm91bmRzID0gW107XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAoaW5wdXRbaV1bZmllbGRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcblx0XHRcdFx0XHQgZm91bmRzLnB1c2goaW5wdXRbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm91bmRzO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnbmV3bGluZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggdGV4dCApe1xuICAgICAgICAgICAgLy9cbiAgICBcbiAgICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oXFxcXHIpP1xcXFxuL2csICc8YnIgLz48YnIgLz4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdPcmRlck9iamVjdEJ5JywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKCFhbmd1bGFyLmlzT2JqZWN0KGlucHV0KSkgcmV0dXJuIGlucHV0O1xuXG5cdFx0XHR2YXIgYXJyYXkgPSBbXTtcblx0XHRcdGZvciAodmFyIG9iamVjdEtleSBpbiBpbnB1dCkge1xuXHRcdFx0XHRhcnJheS5wdXNoKGlucHV0W29iamVjdEtleV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdGEgPSBwYXJzZUludChhW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRiID0gcGFyc2VJbnQoYlthdHRyaWJ1dGVdKTtcblx0XHRcdFx0cmV0dXJuIGEgLSBiO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigncHJvcGVydHknLCBwcm9wZXJ0eSk7XG5cdGZ1bmN0aW9uIHByb3BlcnR5KCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoYXJyYXksIHllYXJfZmllbGQsIHZhbHVlKSB7XG5cbiAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcblxuICAgICAgICBpZihhcnJheVtpXS5kYXRhW3llYXJfZmllbGRdID09IHZhbHVlKXtcbiAgICAgICAgICBpdGVtcy5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ29udGVudFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSwgJGZpbHRlcikge1xuXHRcdC8vXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9ySXRlbShsaXN0LGlkKXtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoO2krKyl7XG5cdFx0XHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHRcdFx0aWYoaXRlbS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHNlYXJjaEZvckl0ZW0oaXRlbS5jaGlsZHJlbiwgaWQpO1xuXHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbnRlbnQ6IHtcblx0XHRcdFx0aW5kaWNhdG9yczogW10sXG5cdFx0XHRcdGluZGljYXRvcjoge30sXG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiBbXSxcblx0XHRcdFx0Y2F0ZWdvcnk6IHt9LFxuXHRcdFx0XHRzdHlsZXM6IFtdLFxuXHRcdFx0XHRpbmZvZ3JhcGhpY3M6IFtdLFxuXHRcdFx0XHRpbmRpY2VzOltdXG5cdFx0XHR9LFxuXHRcdFx0YmFja3VwOnt9LFxuXHRcdFx0ZmV0Y2hJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2VzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3JzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzJywgZmlsdGVyKS4kb2JqZWN0XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hDYXRlZ29yaWVzOiBmdW5jdGlvbihmaWx0ZXIsIHdpdGhvdXRTYXZlKSB7XG5cdFx0XHRcdGlmKHdpdGhvdXRTYXZlKXtcblx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnY2F0ZWdvcmllcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaFN0eWxlczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNlczogZnVuY3Rpb24oZmlsdGVyKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2VzKGZpbHRlcik7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2VzO1xuXHRcdFx0fSxcblx0XHRcdGdldENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlciwgd2l0aG91dFNhdmUpIHtcblx0XHRcdFx0aWYod2l0aG91dFNhdmUpe1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoQ2F0ZWdvcmllcyhmaWx0ZXIsIHdpdGhvdXRTYXZlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaENhdGVnb3JpZXMoZmlsdGVyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3JpZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNhdG9ycyhmaWx0ZXIpO1xuXG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3R5bGVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5zdHlsZXMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaFN0eWxlcyhmaWx0ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc3R5bGVzO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvcjogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnNbaV0uaWQgPT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljYXRvcihpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9yID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzLycgKyBpZCkuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvclByb21pc2U6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGljYXRvcnMnLGlkKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JEYXRhOiBmdW5jdGlvbihpZCwgeWVhciwgZ2VuZGVyKSB7XG5cdFx0XG5cdFx0XHRcdGlmKHllYXIgJiYgZ2VuZGVyICYmIGdlbmRlciAhPSAnYWxsJyl7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycgKyBpZCArICcvZGF0YS8nICsgeWVhciArICcvZ2VuZGVyLycgK2dlbmRlciApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHllYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhLycgKyB5ZWFyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhJyk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9ySGlzdG9yeTogZnVuY3Rpb24oaWQsIGlzbywgZ2VuZGVyKXtcblx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycgKyBpZCArICcvaGlzdG9yeS8nICsgaXNvLCB7Z2VuZGVyOiBnZW5kZXJ9KTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJdGVtOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0LypcdGlmKHRoaXMuY29udGVudC5pbmRpY2VzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdCB0aGlzLmNvbnRlbnQuZGF0YSA9IHNlYXJjaEZvckl0ZW0odGhpcy5jb250ZW50LmluZGljZXMsIGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNleyovXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nLCBpZClcblx0XHRcdFx0Ly99XG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlQ29udGVudDpmdW5jdGlvbihpZCwgbGlzdCl7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5LmlkID09IGlkKXtcblx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHRoYXQucmVtb3ZlQ29udGVudChpZCwgZW50cnkuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0ZmluZENvbnRlbnQ6ZnVuY3Rpb24oaWQsIGxpc3Qpe1xuXHRcdFx0XHR2YXIgZm91bmQgPSBudWxsO1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0XHRmb3VuZCA9IGVudHJ5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbiAmJiBlbnRyeS5jaGlsZHJlbi5sZW5ndGggJiYgIWZvdW5kKXtcblx0XHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSB0aGF0LmZpbmRDb250ZW50KGlkLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHN1YnJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0XHR9LFxuXHRcdFx0YWRkSXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHRoaXMuY29udGVudC5pbmRpY2VzLnB1c2goaXRlbSlcblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVJdGVtOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ29udGVudChpZCwgdGhpcy5jb250ZW50LmluZGljZXMpO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UucmVtb3ZlKCdpbmRleC8nLCBpZCk7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlSXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZhciBlbnRyeSA9IHRoaXMuZmluZENvbnRlbnQoaXRlbS5pZCwgdGhpcy5jb250ZW50LmluZGljZXMpO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGVudHJ5LCBpdGVtKTtcblx0XHRcdFx0cmV0dXJuIGVudHJ5ID0gaXRlbTtcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbmRDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yeSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY2F0ZWdvcmllcy8nICsgaWQpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDYXRlZ29yeTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLnJlbW92ZSgnY2F0ZWdvcmllcy8nLCBpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZmlsdGVyTGlzdDogZnVuY3Rpb24odHlwZSwgZmlsdGVyLCBsaXN0KXtcblx0XHRcdFx0aWYobGlzdC5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRpZighdGhpcy5iYWNrdXBbdHlwZV0pe1xuXHRcdFx0XHRcdFx0dGhpcy5iYWNrdXBbdHlwZV0gPSBhbmd1bGFyLmNvcHkodGhpcy5jb250ZW50W3R5cGVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV0gPSAkZmlsdGVyKCdmaWx0ZXInKSh0aGlzLmNvbnRlbnRbdHlwZV0sIGZpbHRlcilcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNvbnRlbnRbdHlwZV0gPSBhbmd1bGFyLmNvcHkodGhpcy5iYWNrdXBbdHlwZV0pO1xuXHRcdFx0XHRkZWxldGUgdGhpcy5iYWNrdXBbdHlwZV07XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV07XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXRGaWx0ZXI6IGZ1bmN0aW9uKHR5cGUpe1xuXHRcdFx0XHRpZighdGhpcy5iYWNrdXBbdHlwZV0pIHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV07XG5cdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmJhY2t1cFt0eXBlXTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ291bnRyaWVzU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb3VudHJpZXM6IFtdLFxuICAgICAgICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcyA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2lzb3MnKS4kb2JqZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvdW50cmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInLCd0b2FzdHInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyLCB0b2FzdHIpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxuICAgICAgICAgIGdldE9uZTogZ2V0T25lLFxuICAgICAgICAgIHBvc3Q6IHBvc3QsXG4gICAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgcmVtb3ZlOiByZW1vdmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUsIGZpbHRlcil7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoZmlsdGVyKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5zdGF0dXNUZXh0LCAnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5kYXRhLmVycm9yLCAnU2F2aW5nIGZhaWxlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1dChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucHV0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShyb3V0ZSwgaWQsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRjb25maXJtOiBmdW5jdGlvbih0aXRsZSwgY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmNvbmZpcm0oKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHRcdFx0LmNhbmNlbCgnQ2FuY2VsJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRXJyb3JDaGVja2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTXlEYXRhKGRhdGEpIHtcbiAgICBcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzID0gW107XG4gICAgXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbXBvcnRzLCBmdW5jdGlvbihlbnRyeSkge1xuICAgIFx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG4gICAgXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2YXIgY29sdW1ucyA9IEpTT04ucGFyc2UoZW50cnkubWV0YV9kYXRhKTtcbiAgICBcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRmb3VuZCsrO1xuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQpe1xuICAgIFx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fVxuICAgICAgICAgIHJldHVybiBleHRlbmRlZENob2ljZXM7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICBcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwgaykge1xuICAgIFx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoIGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSBudWxsO1xuICAgIFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHRpZiAoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG4gICAgXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG4gICAgXHRcdFx0XHRcdFx0bWVzc2FnZTogXCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuICAgIFx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcbiAgICBcdFx0XHRcdFx0XHRyb3c6IGtleVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGtleSkge1xuICAgIFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdHZtLm5vdEZvdW5kID0gW107XG4gICAgXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcbiAgICBcdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuICAgIFx0XHRcdHZhciBpc29UeXBlID0gJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcbiAgICBcdFx0XHRcdGlmIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdGlzb0NoZWNrICs9IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAxIDogMDtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0Y2FzZSAnQ2FibyBWZXJkZSc6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRkZWZhdWx0OlxuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0ZW50cmllcy5wdXNoKHtcbiAgICBcdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgIFx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRJbmRleFNlcnZpY2UucmVzZXRUb1NlbGVjdCgpO1xuICAgIFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuICAgIFx0XHRcdFx0ZGF0YTogZW50cmllcyxcbiAgICBcdFx0XHRcdGlzbzogaXNvVHlwZVxuICAgIFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24oY291bnRyeSwga2V5KSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRcdFx0aWYgKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjb3VudHJ5LmRhdGFcbiAgICBcdFx0XHRcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcbiAgICBcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY291bnRyeS5kYXRhWzBdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuICAgIFx0XHRcdFx0aWYgKEluZGV4U2VydmljZS5nZXRUb1NlbGVjdCgpLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcbiAgICBcdFx0XHR9KTtcblxuICAgIFx0XHR9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2hlY2tNeURhdGE6IGNoZWNrTXlEYXRhXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICBnZW5kZXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kaWNhdG9yczp7fSxcbiAgICAgICAgICAgIHRvU2VsZWN0OltdXG4gICAgICAgIH0sIHN0b3JhZ2UsIGltcG9ydENhY2hlLCBpbmRpY2F0b3I7XG5cbiAgICAgICAgaWYgKCFDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpIHtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeSgnaW1wb3J0RGF0YScsIHtcbiAgICAgICAgICAgIGNhY2hlRmx1c2hJbnRlcnZhbDogNjAgKiA2MCAqIDEwMDAsIC8vIFRoaXMgY2FjaGUgd2lsbCBjbGVhciBpdHNlbGYgZXZlcnkgaG91ci5cbiAgICAgICAgICAgIGRlbGV0ZU9uRXhwaXJlOiAnYWdncmVzc2l2ZScsIC8vIEl0ZW1zIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoaXMgY2FjaGUgcmlnaHQgd2hlbiB0aGV5IGV4cGlyZS5cbiAgICAgICAgICAgIHN0b3JhZ2VNb2RlOiAnbG9jYWxTdG9yYWdlJyAvLyBUaGlzIGNhY2hlIHdpbGwgdXNlIGBsb2NhbFN0b3JhZ2VgLlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpO1xuICAgICAgICAgIHN0b3JhZ2UgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xlYXI6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgICAgaWYoQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKXtcbiAgICAgICAgICAgICAgICBpbXBvcnRDYWNoZS5yZW1vdmUoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgZ2VuZGVyX2ZpZWxkOicnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b1NlbGVjdDpbXSxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOnt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkRGF0YTpmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJbmRpY2F0b3I6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnMucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZFRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSXNvRXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3ZlVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VydmljZURhdGEudG9TZWxlY3QuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA+IC0xID8gc2VydmljZURhdGEudG9TZWxlY3Quc3BsaWNlKGluZGV4LCAxKSA6IGZhbHNlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJc29GaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldENvdW50cnlGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRHZW5kZXJGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmdlbmRlcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFllYXJGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLnllYXJfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycyl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0VG9Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICBpbXBvcnRDYWNoZS5wdXQoJ2RhdGFUb0ltcG9ydCcsc2VydmljZURhdGEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXksIGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRBY3RpdmVJbmRpY2F0b3JEYXRhOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2l0ZW0uY29sdW1uX25hbWVdID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZyb21Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnVsbERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TWV0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29FcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGaXJzdEVudHJ5OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGFbMF07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhU2l6ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLmxlbmd0aDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcjogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWN0aXZlSW5kaWNhdG9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvcjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0SW5kaWNhdG9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUlzb0Vycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUVycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdCA9IFtdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kaXplc1NlcnZpY2UnLCBmdW5jdGlvbiAoRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmRleDoge1xuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0ZGF0YTogbnVsbCxcblx0XHRcdFx0XHRzdHJ1Y3R1cmU6IG51bGxcblx0XHRcdFx0fSxcblx0XHRcdFx0cHJvbWlzZXM6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyOiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmZXRjaERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgvJyArIGluZGV4ICsgJy95ZWFyL2xhdGVzdCcpO1xuXHRcdFx0XHR0aGlzLmluZGV4LnByb21pc2VzLnN0cnVjdHVyZSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArIGluZGV4ICsgJy9zdHJ1Y3R1cmUnKTtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLmRhdGEgPSB0aGlzLmluZGV4LnByb21pc2VzLmRhdGEuJG9iamVjdDtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlLiRvYmplY3Q7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4O1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXguZGF0YS5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZTtcblx0XHRcdH0sXG5cdFx0XHRnZXREYXRhUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZVByb21pc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1JlY3Vyc2lvbkhlbHBlcicsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuXHRcdFx0XHQvL1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIE1hbnVhbGx5IGNvbXBpbGVzIHRoZSBlbGVtZW50LCBmaXhpbmcgdGhlIHJlY3Vyc2lvbiBsb29wLlxuXHRcdFx0XHRcdCAqIEBwYXJhbSBlbGVtZW50XG5cdFx0XHRcdFx0ICogQHBhcmFtIFtsaW5rXSBBIHBvc3QtbGluayBmdW5jdGlvbiwgb3IgYW4gb2JqZWN0IHdpdGggZnVuY3Rpb24ocykgcmVnaXN0ZXJlZCB2aWEgcHJlIGFuZCBwb3N0IHByb3BlcnRpZXMuXG5cdFx0XHRcdFx0ICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGxpbmtpbmcgZnVuY3Rpb25zLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uIChlbGVtZW50LCBsaW5rKSB7XG5cdFx0XHRcdFx0XHQvLyBOb3JtYWxpemUgdGhlIGxpbmsgcGFyYW1ldGVyXG5cdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGxpbmspKSB7XG5cdFx0XHRcdFx0XHRcdGxpbmsgPSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zdDogbGlua1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBCcmVhayB0aGUgcmVjdXJzaW9uIGxvb3AgYnkgcmVtb3ZpbmcgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHR2YXIgY29udGVudHMgPSBlbGVtZW50LmNvbnRlbnRzKCkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR2YXIgY29tcGlsZWRDb250ZW50cztcblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHByZTogKGxpbmsgJiYgbGluay5wcmUpID8gbGluay5wcmUgOiBudWxsLFxuXHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0ICogQ29tcGlsZXMgYW5kIHJlLWFkZHMgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBDb21waWxlIHRoZSBjb250ZW50c1xuXHRcdFx0XHRcdFx0XHRcdGlmICghY29tcGlsZWRDb250ZW50cykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyA9ICRjb21waWxlKGNvbnRlbnRzKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmUtYWRkIHRoZSBjb21waWxlZCBjb250ZW50cyB0byB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBpbGVkQ29udGVudHMoc2NvcGUsIGZ1bmN0aW9uIChjbG9uZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5hcHBlbmQoY2xvbmUpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2FsbCB0aGUgcG9zdC1saW5raW5nIGZ1bmN0aW9uLCBpZiBhbnlcblx0XHRcdFx0XHRcdFx0XHRpZiAobGluayAmJiBsaW5rLnBvc3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxpbmsucG9zdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHR9KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdVc2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6e1xuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXIuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlQcm9maWxlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteUZyaWVuZHM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1ZlY3RvcmxheWVyU2VydmljZScsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzLCBfc2VsZiA9IHRoaXM7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNhbnZhczogZmFsc2UsXG5cdFx0XHRwYWxldHRlOiBbXSxcblx0XHRcdGN0eDogJycsXG5cdFx0XHRrZXlzOiB7XG5cdFx0XHRcdG1henBlbjogJ3ZlY3Rvci10aWxlcy1RM19PczV3Jyxcblx0XHRcdFx0bWFwYm94OiAncGsuZXlKMUlqb2liV0ZuYm05c2J5SXNJbUVpT2lKdVNGZFVZa2c0SW4wLjVIT3lrS2swcE5QMU4zaXNmUFFHVFEnXG5cdFx0XHR9LFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRsYXllcjogJycsXG5cdFx0XHRcdG5hbWU6ICdjb3VudHJpZXNfYmlnJyxcblx0XHRcdFx0YmFzZUNvbG9yOiAnIzA2YTk5YycsXG5cdFx0XHRcdGlzbzM6ICdhZG0wX2EzJyxcblx0XHRcdFx0aXNvMjogJ2lzb19hMicsXG5cdFx0XHRcdGlzbzogJ2lzb19hMicsXG5cdFx0XHRcdGZpZWxkczogXCJpZCxhZG1pbixhZG0wX2EzLGlzb19hMixuYW1lLG5hbWVfbG9uZ1wiLCAvL3N1X2EzLGlzb19hMyx3Yl9hMyxcblx0XHRcdFx0ZmllbGQ6J3Njb3JlJ1xuXHRcdFx0fSxcblx0XHRcdG1hcDoge1xuXHRcdFx0XHRkYXRhOiBbXSxcblx0XHRcdFx0Y3VycmVudDogW10sXG5cdFx0XHRcdHN0cnVjdHVyZTogW10sXG5cdFx0XHRcdHN0eWxlOiBbXVxuXHRcdFx0fSxcblx0XHRcdG1hcExheWVyOiBudWxsLFxuXHRcdFx0c2V0TWFwOiBmdW5jdGlvbihtYXApe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXBMYXllciA9IG1hcDtcblx0XHRcdH0sXG5cdFx0XHRzZXRMYXllcjogZnVuY3Rpb24obCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmxheWVyID0gbDtcblx0XHRcdH0sXG5cdFx0XHRnZXRMYXllcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubmFtZTtcblx0XHRcdH0sXG5cdFx0XHRmaWVsZHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmZpZWxkcztcblx0XHRcdH0sXG5cdFx0XHRpc286IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbztcblx0XHRcdH0sXG5cdFx0XHRpc28zOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5pc28zO1xuXHRcdFx0fSxcblx0XHRcdGlzbzI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzI7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUNhbnZhczogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdGNyZWF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKXtcblxuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNvbG9yUmFuZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxIC8gKGNvbG9yUmFuZ2UubGVuZ3RoIC0xKSAqIGksIGNvbG9yUmFuZ2VbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblxuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKSB7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHNldEJhc2VDb2xvcjogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5iYXNlQ29sb3IgPSBjb2xvcjtcblx0XHRcdH0sXG5cdFx0LypcdHNldFN0eWxlOiBmdW5jdGlvbihzdHlsZSkge1xuXHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpXG5cdFx0XHR9LCovXG5cdFx0XHRjb3VudHJ5Q2xpY2s6IGZ1bmN0aW9uKGNsaWNrRnVuY3Rpb24pIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrRnVuY3Rpb247XG5cdFx0XHRcdH0pXG5cblx0XHRcdH0sXG5cdFx0XHRnZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFsZXR0ZVt2YWx1ZV07XG5cdFx0XHR9LFxuXHRcdFx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFwLnN0eWxlID0gc3R5bGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSwgY29sb3IsIGRyYXdJdCkge1xuXHRcdFx0XHR0aGlzLm1hcC5kYXRhID0gZGF0YTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjb2xvciAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0dGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5jYW52YXMpIHtcblx0XHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmJhc2VDb2xvciA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlRml4ZWRDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRyYXdJdCkge1xuXHRcdFx0XHRcdHRoaXMucGFpbnRDb3VudHJpZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldE5hdGlvbkJ5SXNvOiBmdW5jdGlvbihpc28sIGxpc3QpIHtcblx0XHRcdFx0aWYodHlwZW9mIGxpc3QgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGlmIChsaXN0Lmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRpZiAodGhpcy5tYXAuZGF0YS5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5tYXAuZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmF0aW9uQnlOYW1lOiBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRcdGlmICh0aGlzLm1hcC5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cGFpbnRDb3VudHJpZXM6IGZ1bmN0aW9uKHN0eWxlLCBjbGljaywgbXV0ZXgpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2Ygc3R5bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBzdHlsZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIuc2V0U3R5bGUodGhhdC5tYXAuc3R5bGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZW9mIGNsaWNrICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5vcHRpb25zLm9uQ2xpY2sgPSBjbGlja1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdHJlc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzLCBmdW5jdGlvbihmZWF0dXJlLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXNvKXtcblx0XHRcdFx0XHRcdFx0aWYoa2V5ICE9IGlzbylcblx0XHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmU6ZnVuY3Rpb24oaXNvLCBzZWxlY3RlZCl7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzW2lzb10gPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGlzbyk7XG5cdFx0XHRcdFx0Ly9kZWJ1Z2dlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRyZWRyYXc6ZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLnJlZHJhdygpO1xuXHRcdFx0fSxcblx0XHRcdC8vRlVMTCBUTyBET1xuXHRcdFx0Y291bnRyaWVzU3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0ZGVidWdnZXI7XG5cdFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3RoYXQuZGF0YS5pc28yXTtcblx0XHRcdFx0dmFyIG5hdGlvbiA9IHRoYXQuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdFx0dmFyIGZpZWxkID0gdGhhdC5kYXRhLmZpZWxkO1xuXHRcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCl7XG5cdFx0XHRcdFx0XHRcdHZhciBsaW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLHZtLnJhbmdlLm1heF0pLnJhbmdlKFswLDI1Nl0pO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9ICBwYXJzZUludChsaW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0Oy8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNvbG9yUG9zLCBpc28sbmF0aW9uKTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCAkdGltZW91dCwgdG9hc3RyLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2UpIHtcblxuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuICAgIHZtLnllYXJmaWx0ZXIgPSAnJztcblx0XHR2bS5kZWxldGVEYXRhID0gZGVsZXRlRGF0YTtcblx0XHR2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuXHRcdHZtLmRlbGV0ZUNvbHVtbiA9IGRlbGV0ZUNvbHVtbjtcblx0XHR2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcblx0XHR2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG5cdFx0dm0uY2hlY2tGb3JFcnJvcnMgPSBjaGVja0ZvckVycm9ycztcblx0XHR2bS5zZWxlY3RFcnJvcnMgPSBzZWxlY3RFcnJvcnM7XG4gICAgdm0uc2VhcmNoRm9yRXJyb3JzID0gc2VhcmNoRm9yRXJyb3JzO1xuXHRcdHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcblx0XHQvL3ZtLmVkaXRDb2x1bW5EYXRhID0gZWRpdENvbHVtbkRhdGE7XG5cdFx0dm0uZWRpdFJvdyA9IGVkaXRSb3c7XG4gICAgdm0ueWVhcnMgPSBbXSwgdm0uZ2VuZGVyID0gW107XG5cdFx0dm0ucXVlcnkgPSB7XG5cdFx0XHRmaWx0ZXI6ICcnLFxuXHRcdFx0b3JkZXI6ICctZXJyb3JzJyxcblx0XHRcdGxpbWl0OiAxNSxcblx0XHRcdHBhZ2U6IDFcblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0Y2hlY2tEYXRhKCk7XG4gICAgXHRnZXRZZWFycygpO1xuXHRcdFx0Z2V0R2VuZGVyKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tEYXRhKCkge1xuXHRcdFx0aWYgKCF2bS5kYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cbiAgICBmdW5jdGlvbiBnZXRZZWFycygpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGRhdCA9ICgkZmlsdGVyKCdncm91cEJ5Jykodm0uZGF0YSwgJ2RhdGEuJyt2bS5tZXRhLmNvdW50cnlfZmllbGQgKSk7XG5cdCAgICAgIHZtLnllYXJzID0gW107XG5cdFx0XHRcdHZhciBsZW5ndGggPSAwO1xuXHRcdFx0XHR2YXIgaW5kZXggPSBudWxsO1xuXHRcdFx0ICBhbmd1bGFyLmZvckVhY2goZGF0LGZ1bmN0aW9uKGVudHJ5LCBpKXtcblx0XHRcdFx0XHRpZihlbnRyeS5sZW5ndGggPiBsZW5ndGgpe1xuXHRcdFx0XHRcdFx0aW5kZXggPSBpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0ICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdFtpbmRleF0sZnVuY3Rpb24oZW50cnkpe1xuXHRcdFx0XHRcdGlmKHZtLnllYXJzLmluZGV4T2YoZW50cnkuZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHQgIHZtLnllYXJzLnB1c2goZW50cnkuZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKVxuXHRcdFx0XHRcdH1cblx0ICAgICAgfSk7XG5cdFx0XHRcdHZtLnllYXJmaWx0ZXIgPSB2bS55ZWFyc1swXTtcblx0XHRcdH0pO1xuICAgIH1cblx0XHRmdW5jdGlvbiBnZXRHZW5kZXIoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBkYXQgPSAoJGZpbHRlcignZ3JvdXBCeScpKHZtLmRhdGEsICdkYXRhLicrdm0ubWV0YS5jb3VudHJ5X2ZpZWxkICkpO1xuXHQgICAgICB2bS5nZW5kZXIgPSBbXTtcblx0XHRcdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0XHRcdHZhciBpbmRleCA9IG51bGw7XG5cdFx0XHQgIGFuZ3VsYXIuZm9yRWFjaChkYXQsZnVuY3Rpb24oZW50cnksIGkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5Lmxlbmd0aCA+IGxlbmd0aCl7XG5cdFx0XHRcdFx0XHRpbmRleCA9IGlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHQgICAgICBhbmd1bGFyLmZvckVhY2goZGF0W2luZGV4XSxmdW5jdGlvbihlbnRyeSl7XG5cdFx0XHRcdFx0aWYodm0uZ2VuZGVyLmluZGV4T2YoZW50cnkuZGF0YVt2bS5tZXRhLmdlbmRlcl9maWVsZF0pID09IC0xKXtcblx0XHRcdFx0XHRcdCAgdm0uZ2VuZGVyLnB1c2goZW50cnkuZGF0YVt2bS5tZXRhLmdlbmRlcl9maWVsZF0pXG5cdFx0XHRcdFx0fVxuXHQgICAgICB9KTtcblx0XHRcdFx0dm0uZ2VuZGVyZmlsdGVyID0gdm0uZ2VuZGVyWzBdO1xuXHRcdFx0fSk7XG4gICAgfVxuXHRcdGZ1bmN0aW9uIHNlYXJjaChwcmVkaWNhdGUpIHtcblx0XHRcdHZtLmZpbHRlciA9IHByZWRpY2F0ZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuXHRcdFx0cmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcblx0XHRcdC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNoZWNrRm9yRXJyb3JzKGl0ZW0pIHtcblx0XHRcdHJldHVybiBpdGVtLmVycm9ycy5sZW5ndGggPiAwID8gJ21kLXdhcm4nIDogJyc7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuXHRcdCAgdm0udG9FZGl0ID0ga2V5O1xuXHRcdCAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRjb2x1bW4nLCAkc2NvcGUpO1xuXHRcdH0qL1xuXHRcdGZ1bmN0aW9uIGRlbGV0ZUNvbHVtbihlLCBrZXkpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoZmllbGQsIGwpIHtcblx0XHRcdFx0XHRpZiAobCA9PSBrZXkpIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpe1xuXHRcdFx0XHRcdFx0XHRpZihlcnJvci5jb2x1bW4gPT0ga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZXJyb3JzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdGRlbGV0ZSB2bS5kYXRhW2tdLmRhdGFba2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBrKSB7XG5cdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMtLTtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5lcnJvcnMtLTtcblx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0dm0uZGF0YS5zcGxpY2Uodm0uZGF0YS5pbmRleE9mKGl0ZW0pLCAxKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uZGVsZXRlRGF0YSgpO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RFcnJvcnMoKSB7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZWRpdFJvdygpIHtcblx0XHRcdHZtLnJvdyA9IHZtLnNlbGVjdGVkWzBdO1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRyb3cnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZURhdGEoKSB7XG5cdFx0XHR2bS5kYXRhID0gW107XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9yRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChyb3csIGspIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogaXRlbVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpXG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuXHRcdHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdC8vdm0ubXlEYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG5cdFx0XHQvL2NoZWNrTXlEYXRhKCk7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBjaGVja015RGF0YSgpIHtcblx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSovXG5cblx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmICggaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIi8qIHx8IGl0ZW0gPCAwKi8gfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcblx0XHRcdFx0XHRcdHJvdzoga2V5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG5cblx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcblx0XHRcdHZhciBlbnRyaWVzID0gW107XG5cdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcblx0XHRcdFx0ZGF0YTogZW50cmllcyxcblx0XHRcdFx0aXNvOiBpc29UeXBlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5kYXRhLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdG9TZWxlY3QgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmKGNvdW50cnkuZGF0YS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGEgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjNcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZElzb0Vycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5pc29fY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdHZtLmV4dGVuZERhdGEgPSBleHRlbmREYXRhO1xuXG5cdFx0ZnVuY3Rpb24gZXh0ZW5kRGF0YSgpIHtcblx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHZhciBtZXRhID0gW10sXG5cdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcblx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHZtLmFkZERhdGFUby50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0SW1wb3J0Q3RybCcsIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCB0b2FzdHIsICRzdGF0ZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5uYXRpb25zID0gW107XG5cdFx0dm0uZXZlbnRzID0gW107XG5cdFx0dm0uc3VtID0gMDtcblxuXHRcdHZtLnNhdmVUb0RiID0gc2F2ZVRvRGI7XG5cblx0XHRmdW5jdGlvbiBzYXZlVG9EYigpIHtcblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRuYXRpb25zOiB2bS5uYXRpb25zLFxuXHRcdFx0XHRldmVudHM6IHZtLmV2ZW50c1xuXHRcdFx0fTtcblx0XHRcdFJlc3Rhbmd1bGFyLmFsbCgnL2NvbmZsaWN0cy9pbXBvcnQnKS5wb3N0KGRhdGEpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleCcpXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHRpbWVvdXQsICRzdGF0ZSwgJHNjb3BlLCAkcm9vdFNjb3BlLCBWZWN0b3JsYXllclNlcnZpY2UsIGNvbmZsaWN0LCBjb25mbGljdHMsIG5hdGlvbnMsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHR2bS5jb25mbGljdHMgPSBuYXRpb25zO1xuXHRcdHZtLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdCdzZWNlc3Npb24nLFxuXHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0J25hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFuY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS5zaG93TWV0aG9kID0gc2hvd01ldGhvZDtcblx0XHR2bS5zaG93Q291bnRyaWVzID0gZmFsc2U7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLmNvdW50cmllcyA9IFtdO1xuXHRcdHZtLnNob3dUZXh0ID0gc2hvd1RleHQ7XG5cdFx0dm0uc2hvd0NvdW50cmllc0J1dHRvbiA9IHNob3dDb3VudHJpZXNCdXR0b247XG5cdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdGNvbG9yOiAnIzRmYjBlNScsXG5cdFx0XHRmaWVsZDogJ2ludDIwMTUnLFxuXHRcdFx0c2l6ZTogNSxcblx0XHRcdGhpZGVOdW1iZXJpbmc6IHRydWUsXG5cdFx0XHR3aWR0aDo2NSxcblx0XHRcdGhlaWdodDo2NVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvLztcblx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uY29uZmxpY3RzLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblxuXHRcdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdC5uYXRpb25zLCBmdW5jdGlvbihuYXRpb24pIHtcblx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuXHRcdFx0XHRcdGlmIChpID09IC0xKSB7XG5cdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0dm0uY291bnRyaWVzLnB1c2gobmF0aW9uKTtcblx0XHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUobmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94Jywgdm0ucmVsYXRpb25zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVsyXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFx0WzUwLCA1MF1cblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLm1hcExheWVyLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd1RleHQoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3R0ZXh0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd0NvdW50cmllc0J1dHRvbigpIHtcblx0XHRcdGlmICh2bS5zaG93Q291bnRyaWVzKSByZXR1cm4gXCJhcnJvd19kcm9wX3VwXCI7XG5cdFx0XHRyZXR1cm4gXCJhcnJvd19kcm9wX2Rvd25cIjtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNob3dMaXN0ID0gZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zID0gW1xuXHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdCdhdXRvbm9teScsXG5cdFx0XHQnc3lzdGVtJyxcblx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnaW50ZXJuYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS50b2dnbGVJdGVtID0gdG9nZ2xlSXRlbTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0oaXRlbSkge1xuXHRcdFx0Y29uc29sZS5sb2coaXRlbSwgJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zKTtcblx0XHRcdHZhciBpID0gJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHRcdFx0J3NlY2Vzc2lvbicsXG5cdFx0XHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdFx0XHQnc3lzdGVtJyxcblx0XHRcdFx0XHQnbmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0XHRcdCdyZXNvdXJjZXMnLFxuXHRcdFx0XHRcdCdvdGhlcidcblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdG5hdGlvbkN0cmwnLCBmdW5jdGlvbigkdGltZW91dCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBuYXRpb25zLCBuYXRpb24sIFZlY3RvcmxheWVyU2VydmljZSwgRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9uID0gbmF0aW9uO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uZmVhdHVyZWQgPSBbXTtcblx0XHR2bS5jb25mbGljdCA9IG51bGw7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50ZW5zaXR5Jyxcblx0XHRcdHNpemU6IDUsXG5cdFx0XHRoaWRlTnVtYmVyaW5nOiB0cnVlLFxuXHRcdFx0d2lkdGg6NjUsXG5cdFx0XHRoZWlnaHQ6NjVcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSBbXTtcblxuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2godm0ubmF0aW9uLmlzbyk7XG5cdFx0XHRcdHZtLmZlYXR1cmVkID0gW107XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5yZXNldFNlbGVjdGVkKHZtLm5hdGlvbi5pc28pO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKHZtLm5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IFtdO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubmF0aW9uLmNvbmZsaWN0cywgZnVuY3Rpb24oY29uZmxpY3QpIHtcblx0XHRcdFx0XHRpZiAoIXZtLmNvbmZsaWN0KSB2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdFx0XHRcdGlmIChjb25mbGljdC5pbnQyMDE1ID4gdm0uY29uZmxpY3QuaW50MjAxNSkge1xuXHRcdFx0XHRcdFx0dm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXRlbSA9PSAxICl7XG5cdFx0XHRcdFx0XHRcdGlmKHZtLmZlYXR1cmVkLmluZGV4T2Yoa2V5KSA9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZmVhdHVyZWQucHVzaChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gdm0uZmVhdHVyZWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdFx0dmFyIGkgPSB2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXRpb24uaXNvKTtcblx0XHRcdFx0XHRcdGlmIChpID09IC0xICYmIG5hdGlvbi5pc28gIT0gdm0ubmF0aW9uLmlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKG5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIHZtLnJlbGF0aW9ucykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRcdFs1MCwgNTBdXG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5tYXBMYXllci5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdFx0XHRtYXhab29tOiA0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cdFx0XHR9KVxuXG5cblxuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gc2hvd01ldGhvZCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdG1ldGhvZGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsgLy8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknO1xuXHRcdFx0dmFyIGNvbG9yRnVsbCA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHZhciBvdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdHNpemU6IDFcblx0XHRcdH07XG5cdFx0XHRpZiAoaXNvID09IHZtLm5hdGlvbi5pc28pIHtcblx0XHRcdFx0b3V0bGluZSA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNTQsNTYsNTksMC44KScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb2xvciA9IGNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZTogb3V0bGluZVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0c0N0cmwnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRzdGF0ZSwgJHJvb3RTY29wZSwgJHNjb3BlLCBjb25mbGljdHMsIG5hdGlvbnMsIFZlY3RvcmxheWVyU2VydmljZSwgUmVzdGFuZ3VsYXIsIERpYWxvZ1NlcnZpY2UsIEZ1bGxzY3JlZW4pIHtcblx0XHQvL1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yZWFkeSA9IGZhbHNlO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmdvRnVsbHNjcmVlbiA9IGdvRnVsbHNjcmVlbjtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNhZGQ5ZjAnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzAwNTU3MyddO1xuXHRcdHZtLnR5cGVzQ29sb3JzID0ge1xuXHRcdFx0aW50ZXJzdGF0ZTogJyM2OWQ0YzMnLFxuXHRcdFx0aW50cmFzdGF0ZTogJyNiN2I3YjcnLFxuXHRcdFx0c3Vic3RhdGU6ICcjZmY5ZDI3J1xuXHRcdH07XG5cdFx0dm0uYWN0aXZlID0ge1xuXHRcdFx0Y29uZmxpY3Q6IFtdLFxuXHRcdFx0dHlwZTogWzEsIDIsIDNdXG5cdFx0fTtcblx0XHR2bS50b2dnbGVDb25mbGljdEZpbHRlciA9IHRvZ2dsZUNvbmZsaWN0RmlsdGVyO1xuXHRcdHZtLmNvbmZsaWN0RmlsdGVyID0gbnVsbDtcblxuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLm5hdGlvbnMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0ubmF0aW9ucywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uZmxpY3RzLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0Y2FsY0ludGVuc2l0aWVzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvL30pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvRnVsbHNjcmVlbigpIHtcblxuXHRcdCBpZiAoRnVsbHNjcmVlbi5pc0VuYWJsZWQoKSlcblx0XHRcdFx0RnVsbHNjcmVlbi5jYW5jZWwoKTtcblx0XHQgZWxzZVxuXHRcdFx0XHRGdWxsc2NyZWVuLmFsbCgpO1xuXG5cdFx0IC8vIFNldCBGdWxsc2NyZWVuIHRvIGEgc3BlY2lmaWMgZWxlbWVudCAoYmFkIHByYWN0aWNlKVxuXHRcdCAvLyBGdWxsc2NyZWVuLmVuYWJsZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZycpIClcblxuXHR9XG5cdFx0ZnVuY3Rpb24gc2V0VmFsdWVzKCkge1xuXHRcdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0XHR2bS5jb25mbGljdEZpbHRlckNvdW50ID0gMDtcblx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMgPSB7XG5cdFx0XHRcdHZlcnlMb3c6IDAsXG5cdFx0XHRcdGxvdzogMCxcblx0XHRcdFx0bWlkOiAwLFxuXHRcdFx0XHRoaWdoOiAwLFxuXHRcdFx0XHR2ZXJ5SGlnaDogMFxuXHRcdFx0fTtcblx0XHRcdHZtLmNoYXJ0RGF0YSA9IFt7XG5cdFx0XHRcdGxhYmVsOiAxLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1swXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogMixcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMV1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDMsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzJdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiA0LFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1szXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogNSxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbNF1cblx0XHRcdH1dO1xuXG5cdFx0XHR2bS5jb25mbGljdFR5cGVzID0gW3tcblx0XHRcdFx0dHlwZTogJ2ludGVyc3RhdGUnLFxuXHRcdFx0XHR0eXBlX2lkOiAxLFxuXHRcdFx0XHRjb2xvcjogJyM2OWQ0YzMnLFxuXHRcdFx0XHRjb3VudDogMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR0eXBlOiAnaW50cmFzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAyLFxuXHRcdFx0XHRjb2xvcjogJyNiN2I3YjcnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHR5cGU6ICdzdWJzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAzLFxuXHRcdFx0XHRjb2xvcjogJyNmZjlkMjcnXG5cdFx0XHR9XTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29uZmxpY3RGaWx0ZXIodHlwZSkge1xuXG5cdFx0XHR2YXIgaSA9IHZtLmFjdGl2ZS50eXBlLmluZGV4T2YodHlwZSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnB1c2godHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUgPSBbMSwgMiwgM107XG5cdFx0XHR9XG5cdFx0XHRjYWxjSW50ZW5zaXRpZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjQ29uZmxpY3QoY29uZmxpY3QpIHtcblx0XHRcdHZtLmNvbmZsaWN0RmlsdGVyQ291bnQrKztcblx0XHRcdHN3aXRjaCAoY29uZmxpY3QudHlwZV9pZCkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzBdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzFdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzJdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChjb25mbGljdC5pbnQyMDE1KSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUxvdysrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMF0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMubG93Kys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVsxXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5taWQrKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzJdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmhpZ2grKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzNdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLnZlcnlIaWdoKys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVs0XS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHR9XG5cdFx0XHRhZGRDb3VudHJpZXMoY29uZmxpY3QubmF0aW9ucyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENvdW50cmllcyhuYXRpb25zKXtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuYXRpb25zLCBmdW5jdGlvbihuYXQpe1xuXHRcdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXQuaXNvKSA9PSAtMSl7XG5cdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0Lmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYWxjSW50ZW5zaXRpZXMoKSB7XG5cdFx0XHRzZXRWYWx1ZXMoKTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdHMsIGZ1bmN0aW9uIChjb25mbGljdCkge1xuXHRcdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKHZtLmFjdGl2ZS50eXBlLmluZGV4T2YoY29uZmxpY3QudHlwZV9pZCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR2bS5yZWFkeSA9IHRydWU7XG5cdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5yZWRyYXcoKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihpc28pID09IC0xKXtcblx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCAmJiBpc28pIHtcblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGdWxsTGlzdEZpdGxlckN0cmwnLCBmdW5jdGlvbihjYXRlZ29yaWVzLCBDb250ZW50U2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cbiAgICB2bS5maWx0ZXIgPSBbXTtcbiAgICB2bS5vcHRpb25zID0ge1xuICAgICAgY2F0ZWdvcmllczp7XG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdm0uZmlsdGVyID1bXTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIGxpc3RDYXRlZ29yaWVzKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIENvbnRlbnRTZXJ2aWNlLmZpbHRlckxpc3QoJ2luZGljYXRvcnMnLGNhdEZpbHRlcix2bS5zZWxlY3Rpb24pO1xuICAgICAgICAgIENvbnRlbnRTZXJ2aWNlLmZpbHRlckxpc3QoJ2luZGljZXMnLGNhdEZpbHRlcix2bS5zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBhZGRUb0ZpbHRlcihpZCl7XG4gICAgICB2YXIgaWR4ID0gdm0uZmlsdGVyLmluZGV4T2YoaWQpO1xuICAgICAgaWYoaWR4ID09IC0xKXtcbiAgICAgICAgdm0uZmlsdGVyLnB1c2goaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBsaXN0Q2F0ZWdvcmllcyhjYXQpe1xuICAgICAgYWRkVG9GaWx0ZXIoY2F0LmlkKTtcbiAgICAgIGlmKGNhdC5jaGlsZHJlbil7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjYXQuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICBhZGRUb0ZpbHRlcihjaGlsZC5pZCk7XG4gICAgICAgICAgbGlzdENhdGVnb3JpZXMoY2hpbGQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGNhdEZpbHRlcihpdGVtKXtcblx0XHRcdFx0aWYoaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA+IDAgJiYgdm0uZmlsdGVyLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG5cdFx0XHRcdFx0XHRpZih2bS5maWx0ZXIuaW5kZXhPZihjYXQuaWQpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRnVsbExpc3RDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgQ29udGVudFNlcnZpY2UsIGNhdGVnb3JpZXMsIGluZGljYXRvcnMsIGluZGljZXMpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uaW5kaWNlcyA9IGluZGljZXM7XG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0c29ydDogJ3RpdGxlJyxcblx0XHRcdHRvZ2dsZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4Lmxpc3QnKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5saXN0LmZpbHRlcicse2ZpbHRlcjonY2F0ZWdvcmllcyd9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVzZXRGaWx0ZXIoJ2luZGljYXRvcnMnKTtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZXNldEZpbHRlcignaW5kaWNlcycpO1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lmxpc3QnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmNvbnRlbnQuaW5kaWNhdG9yc30sIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiA9PT0gbyApcmV0dXJuO1xuXHRcdFx0dm0uaW5kaWNhdG9ycyA9IG47XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe3JldHVybiBDb250ZW50U2VydmljZS5jb250ZW50LmluZGljZXN9LCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gPT09IG8gKXJldHVybjtcblx0XHRcdHZtLmluZGljZXMgPSBuO1xuXHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJG1kTWVkaWEsIGxlYWZsZXREYXRhLCAkc3RhdGUsJGxvY2FsU3RvcmFnZSwgJHJvb3RTY29wZSwgJGF1dGgsIHRvYXN0ciwgJHRpbWVvdXQpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHQkcm9vdFNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGlzQXV0aGVudGljYXRlZDtcblx0XHR2bS5kb0xvZ2luID0gZG9Mb2dpbjtcblx0XHR2bS5kb0xvZ291dCA9IGRvTG9nb3V0O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlVmlldyA9IHRvZ2dsZVZpZXc7XG5cblx0XHR2bS5hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihwcm92aWRlcil7XG5cdFx0XHQkYXV0aC5hdXRoZW50aWNhdGUocHJvdmlkZXIpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpc0F1dGhlbnRpY2F0ZWQoKXtcblx0XHRcdCByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9naW4oKXtcblx0XHRcdCRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbicpO1xuXHRcdFx0XHQvLyRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ291dCgpe1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHQkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50LmF1dGgpe1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQnKTtcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuICAgIGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuICAgICAgJG1kT3Blbk1lbnUoZXYpO1xuICAgIH07XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlVmlldygpe1xuXHRcdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICEkcm9vdFNjb3BlLmxvb3NlTGF5b3V0O1xuXHRcdFx0JGxvY2FsU3RvcmFnZS5mdWxsVmlldyA9ICRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRyb290U2NvcGUuY3VycmVudF9wYWdlO1xuXHRcdH0sIGZ1bmN0aW9uKG5ld1BhZ2Upe1xuXHRcdFx0JHNjb3BlLmN1cnJlbnRfcGFnZSA9IG5ld1BhZ2UgfHwgJ1BhZ2UgTmFtZSc7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgnJHJvb3Quc2lkZWJhck9wZW4nLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0aWYobiA9PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyByZXR1cm4gJG1kTWVkaWEoJ3NtJykgfSwgZnVuY3Rpb24oc21hbGwpIHtcblx0ICAgIHZtLnNtYWxsU2NyZWVuID0gc21hbGw7XG5cdCAgfSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcsIHtpc19vZmZpY2lhbDogdHJ1ZX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHZtLmluZGl6ZXMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdywkbWRTaWRlbmF2LCAkcm9vdFNjb3BlLCAkZmlsdGVyLCAkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSwgZGF0YSwgY291bnRyaWVzLCBsZWFmbGV0RGF0YSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvLyBWYXJpYWJsZSBkZWZpbml0aW9uc1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubWFwID0gbnVsbDtcblxuXHRcdHZtLmRhdGFTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLmRhdGE7XG5cdFx0dm0uc3RydWN0dXJlU2VydmVyID0gZGF0YS5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cblx0XHR2bS5zdHJ1Y3R1cmUgPSBcIlwiO1xuXHRcdHZtLm12dFNjb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXIgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpO1xuXHRcdHZtLm12dENvdW50cnlMYXllckdlb20gPSB2bS5tdnRDb3VudHJ5TGF5ZXIgKyBcIl9nZW9tXCI7XG5cdFx0dm0uaXNvX2ZpZWxkID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMjtcblx0XHR2bS5ub2RlUGFyZW50ID0ge307XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdHZtLnRhYkNvbnRlbnQgPSBcIlwiO1xuXHRcdHZtLnRvZ2dsZUJ1dHRvbiA9ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdHZtLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0dm0uaW5mbyA9IGZhbHNlO1xuXHRcdHZtLmNsb3NlSWNvbiA9ICdjbG9zZSc7XG5cdFx0dm0uY29tcGFyZSA9IHtcblx0XHRcdGFjdGl2ZTogZmFsc2UsXG5cdFx0XHRjb3VudHJpZXM6IFtdXG5cdFx0fTtcblx0XHR2bS5kaXNwbGF5ID0ge1xuXHRcdFx0c2VsZWN0ZWRDYXQ6ICcnXG5cdFx0fTtcblxuXHRcdC8vRnVuY3Rpb24gZGVmaW5pdG9uc1xuXHRcdHZtLnNob3dUYWJDb250ZW50ID0gc2hvd1RhYkNvbnRlbnQ7XG5cdFx0dm0uc2V0VGFiID0gc2V0VGFiO1xuXHRcdHZtLnNldFN0YXRlID0gc2V0U3RhdGU7XG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlID0gc2V0U2VsZWN0ZWRGZWF0dXJlO1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG5cdFx0dm0uY2hlY2tDb21wYXJpc29uID0gY2hlY2tDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZU9wZW4gPSB0b2dnbGVPcGVuO1xuXHRcdHZtLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdHZtLnRvZ2dsZURldGFpbHMgPSB0b2dnbGVEZXRhaWxzO1xuXHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24gPSB0b2dnbGVDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdCA9IHRvZ2dsZUNvdW50cmllTGlzdDtcblx0XHR2bS5tYXBHb3RvQ291bnRyeSA9IG1hcEdvdG9Db3VudHJ5O1xuXHRcdHZtLmdvQmFjayA9IGdvQmFjaztcblx0XHR2bS5nb1RvSW5kZXggPSBnb1RvSW5kZXg7XG5cblx0XHR2bS5jYWxjVHJlZSA9IGNhbGNUcmVlO1xuXG5cdFx0dm0uaXNQcmVsYXN0ID0gaXNQcmVsYXN0O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpIHtcblx0XHRcdFx0dm0uZGF0YVNlcnZlci50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmU7XG5cdFx0XHRcdFx0aWYgKCF2bS5zdHJ1Y3R1cmUuc3R5bGUpIHtcblx0XHRcdFx0XHRcdHZtLnN0cnVjdHVyZS5zdHlsZSA9IHtcblx0XHRcdFx0XHRcdFx0J25hbWUnOiAnZGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6ICdEZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0J2Jhc2VfY29sb3InOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJ1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3JlYXRlQ2FudmFzKHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yKTtcblx0XHRcdFx0XHRkcmF3Q291bnRyaWVzKCk7XG5cdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXRlbSkge1xuXHRcdFx0XHRcdFx0dm0uc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaCh2bS5jdXJyZW50KTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vb25zb2xlLmxvZyh2bS5jb21wYXJlLmNvdW50cmllcyk7XG5cdFx0XHRcdFx0XHRjb3VudHJpZXMucHVzaCh2bS5jdXJyZW50Lmlzbyk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgY291bnRyaWVzKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHQvLyBUT0RPOiBNT1ZFIFRPIEdMT0JBTFxuXHRcdGZ1bmN0aW9uIGdvQmFjaygpIHtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdvVG9JbmRleChpdGVtKXtcblxuXHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcse1xuXHRcdFx0XHRpZDppdGVtLmlkLFxuXHRcdFx0XHRuYW1lOml0ZW0ubmFtZSxcblx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zWydpdGVtJ11cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBpc1ByZWxhc3QoKXtcblx0XHRcdHZhciBsZXZlbHNGb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnN0cnVjdHVyZS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZihjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRsZXZlbHNGb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxldmVsc0ZvdW5kO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93VGFiQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiB2bS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSAncmFuayc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZtLnRvZ2dsZUJ1dHRvbiA9IHZtLnRhYkNvbnRlbnQgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblxuXHRcdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5vcGVuKCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZShpc28pIHtcblx0XHRcdGlmICh2bS5tdnRTb3VyY2UpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdHZhciBrYWNrID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCAnc2NvcmUnLCAnaXNvJywgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLm5hbWUgKyAnX3JhbmsnXSA9IHJhbms7XG5cdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogdm0uc3RydWN0dXJlLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMGNjYWEnLFxuXHRcdFx0XHRmaWVsZDogdm0uc3RydWN0dXJlLm5hbWUgKyAnX3JhbmsnLFxuXHRcdFx0XHRzaXplOiB2bS5kYXRhLmxlbmd0aFxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cblx0XHRcdHZhciByYW5rID0gdm0uZGF0YS5pbmRleE9mKGNvdW50cnkpICsgMTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogUkVNT1ZFLCBOT1cgR09UIE9XTiBVUkxcblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCkge1xuXHRcdFx0dm0uaW5mbyA9ICF2bS5pbmZvO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IFBVVCBJTiBWSUVXXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gZmV0Y2hOYXRpb25EYXRhKGlzbykge1xuXHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgJHN0YXRlLnBhcmFtcy5pZCwgaXNvKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0bWFwR290b0NvdW50cnkoaXNvKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogTU9WRSBUTyBNQVAgU0VSVklDRVxuXHRcdGZ1bmN0aW9uIG1hcEdvdG9Db3VudHJ5KGlzbykge1xuXHRcdFx0aWYgKCEkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW2lzb10pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQ29tcGFyaXNvbih3YW50KSB7XG5cdFx0XHRpZiAod2FudCAmJiAhdm0uY29tcGFyZS5hY3RpdmUgfHwgIXdhbnQgJiYgdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0udG9nZ2xlQ29tcGFyaXNvbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvbXBhcmlzb24oKSB7XG5cdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcyA9IFt2bS5jdXJyZW50XTtcblx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gIXZtLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzLCBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lLFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvdW50cmllTGlzdChjb3VudHJ5KSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24obmF0LCBrZXkpIHtcblx0XHRcdFx0aWYgKGNvdW50cnkgPT0gbmF0ICYmIG5hdCAhPSB2bS5jdXJyZW50KSB7XG5cdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICghZm91bmQpIHtcblx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNvcyA9IFtdO1xuXHRcdFx0dmFyIGNvbXBhcmUgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdGlmIChpdGVtW3ZtLnN0cnVjdHVyZS5pc29dICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0Y29tcGFyZS5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoaXNvcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBpc29zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW0sXG5cdFx0XHRcdFx0Y291bnRyaWVzOiBjb21wYXJlLmpvaW4oJy12cy0nKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICFmb3VuZDtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gVklFV1xuXHRcdGZ1bmN0aW9uIHNldFRhYihpKSB7XG5cdFx0XHQvL3ZtLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpIHtcblx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0uY29sdW1uX25hbWUgPT0gdm0uZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKSB7XG5cdFx0XHRcdFx0dm0ubm9kZVBhcmVudCA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1RyZWUoKSB7XG5cdFx0XHRnZXRQYXJlbnQodm0uc3RydWN0dXJlKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgQ09VTlRSWVxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5TmFtZShuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeUlzbyhpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9yKSB7XG5cblx0XHRcdHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0dm0uY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0dm0uY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0dm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcyhjb2xvcikge1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblxuXHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuMyknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGlmIChpc28gIT0gdm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUpXG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcblx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcblx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobi5pc28pIHtcblx0XHRcdFx0aWYgKG8uaXNvKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW24uaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmICgkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcgfHwgJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cnKSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogbi5pc29cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRuYW1lOiAkc3RhdGUucGFyYW1zLmlkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0aWYgKG4uY29sb3IpXG5cdFx0XHRcdHVwZGF0ZUNhbnZhcyhuLmNvbG9yKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVDYW52YXMoJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0fTtcblx0XHRcdHZtLmNhbGNUcmVlKCk7XG5cdFx0XHQvKmlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9Ki9cblxuXHRcdFx0aWYgKHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc28sXG5cdFx0XHRcdFx0XHRjb3VudHJpZXM6ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aWQ6IG4uaWQsXG5cdFx0XHRcdFx0XHRuYW1lOiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50Lmlzb1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aWQ6IG4uaWQsXG5cdFx0XHRcdFx0bmFtZTogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmJib3gnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKnZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVswXVswXV1cblx0XHRcdFx0XSxcblx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMl1bMF1dXG5cdFx0XHRcdF0qL1xuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFsxMDAsIDEwMF1cblx0XHRcdF07XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0cGFkID0gW1xuXHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRbMCwgMF1cblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHRcdHZtLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXG5cdFx0XHQvKmNvbnNvbGUubG9nKCQpXG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3dcIikge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZFwiKSB7XG5cblx0XHRcdFx0aWYodG9QYXJhbXMuaW5kZXggIT0gZnJvbVBhcmFtcy5pbmRleCl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FuZGVycycpXG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2codG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdm0uY3VycmVudC5pc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlXCIpIHtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdC8vJHNjb3BlLmFjdGl2ZVRhYiA9IDI7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdG9QYXJhbXMuaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmNvdW50cnkgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9Ki9cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXRlbSkge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzWyRzdGF0ZS5wYXJhbXMuaXRlbV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbihldnQsIHQpIHtcblxuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHQkbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuXHRcdFx0XHRcdFx0XHR2bS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0KGMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJywgZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGJhc2VDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUpIHtcblx0XHQvL1xuICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEZpbmFsQ3RybCcsIGZ1bmN0aW9uICgkc3RhdGUsIEluZGV4U2VydmljZSwgRGF0YVNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG5cdFx0dm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcblxuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0LyppZiAodm0ubWV0YS55ZWFyX2ZpZWxkKSB7XG5cdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0fSovXG5cdFx0XHRjaGVja0RhdGEoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2F2ZURhdGEodmFsaWQpIHtcblx0XHRcdGlmICh2YWxpZCkge1xuXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbm9ZZWFycyA9IFtdO1xuXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuXHRcdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRcdGlmKGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKXtcblx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhLnllYXIgPSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblxuXHRcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG5cdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRub1llYXJzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGVfaWQgPSAwO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRzdHlsZV9pZCA9IHZtLmluZGljYXRvcnNba2V5XS5zdHlsZS5pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBmaWVsZCA9IHtcblx0XHRcdFx0XHRcdFx0J2NvbHVtbic6IGtleSxcblx0XHRcdFx0XHRcdFx0J3RpdGxlJzogdm0uaW5kaWNhdG9yc1trZXldLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHQnZGVzY3JpcHRpb24nOiB2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0XHRcdCdtZWFzdXJlX3R5cGVfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZS5pZCB8fCAwLFxuXHRcdFx0XHRcdFx0XHQnaXNfcHVibGljJzogdm0uaW5kaWNhdG9yc1trZXldLmlzX3B1YmxpYyB8fCAwLFxuXHRcdFx0XHRcdFx0XHQnc3R5bGVfaWQnOiBzdHlsZV9pZCxcblx0XHRcdFx0XHRcdFx0J2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHZhciBjYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllcy5wdXNoKGNhdC5pZCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGZpZWxkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdFx0XHRcdFx0ZmllbGRzLnB1c2goZmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm1ldGEuZmllbGRzID0gZmllbGRzO1xuXHRcdFx0XHRpZihub1llYXJzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcImZvciBcIitub1llYXJzLmxlbmd0aCArIFwiIGVudHJpZXNcIiwgJ05vIHllYXIgdmFsdWUgZm91bmQhJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHJlc3BvbnNlLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcblx0XHRcdFx0XHRcdFx0dm0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHR2bS5zdGVwID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCAnT3VjaCEnKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxNZW51Q3RybCcsIGZ1bmN0aW9uKEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuICAgICAgdm0uaW5kaWNhdG9yc0xlbmd0aCA9IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aDtcblxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TWV0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCR0aW1lb3V0LEluZGV4U2VydmljZSxsZWFmbGV0RGF0YSwgdG9hc3RyKXtcbiAgICAgICAgLy9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgdm0uaW5kaWNhdG9ycyA9IFtdO1xuICAgICAgICB2bS5zY2FsZSA9IFwiXCI7XG4gICAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgICAgdm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuICAgICAgICB2bS5pbmRpY2F0b3IgPSBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCk7XG4gICAgICAgIHZtLmNvdW50cmllc1N0eWxlID0gY291bnRyaWVzU3R5bGU7XG4gICAgICAgIFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoJyNmZjAwMDAnKTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICAgIHZtLmluZGljYXRvciA9IG47XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBpZih2bS5pbmRpY2F0b3Iuc3R5bGUpe1xuICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyh2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5pbmRpY2F0b3InLCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pIHJldHVybjtcbiAgICAgICAgICBpZih0eXBlb2Ygbi5zdHlsZV9pZCAhPSBcInVuZGVmaW5lZFwiICl7XG4gICAgICAgICAgICBpZihuLnN0eWxlX2lkICE9IG8uc3R5bGVfaWQpe1xuICAgICAgICAgICAgICBpZihuLnN0eWxlKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZih0eXBlb2Ygbi5jYXRlZ29yaWVzICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICBpZihuLmNhdGVnb3JpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uY2F0ZWdvcmllc1swXS5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0QWN0aXZlSW5kaWNhdG9yRGF0YShuKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSx0cnVlKTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIG1pbk1heCgpe1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5taW4pO1xuICAgICAgICAgICAgICB2bS5tYXggPSBNYXRoLm1heChpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWF4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgIGlmKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0gPT0gaXNvKXtcbiAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG4gICAgXHRcdFx0dmFyIHN0eWxlID0ge307XG4gICAgXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG4gICAgXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcbiAgICBcdFx0XHR2YXIgZmllbGQgPSB2bS5pbmRpY2F0b3IuY29sdW1uX25hbWU7XG4gICAgXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cbiAgICBcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcbiAgICBcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuICAgIFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG4gICAgXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcbiAgICBcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG4gICAgXHRcdFx0XHRcdFx0XHRzaXplOiAyXG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRicmVhaztcblxuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJykge1xuICAgIFx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcbiAgICBcdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuICAgIFx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdFx0XHR9O1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdH1cbiAgICAgICAgZnVuY3Rpb24gc2V0Q291bnRyaWVzKCl7XG4gICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcbiAgICAgICAgICB2bS5tdnRTb3VyY2UucmVkcmF3KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcbiAgICAgICAgICBtaW5NYXgoKTtcbiAgICBcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgIFx0XHRcdFx0dm0ubWFwID0gbWFwO1xuICAgIFx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdFx0c2V0Q291bnRyaWVzKCk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCB0b2FzdHIsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIEluZGV4U2VydmljZS5yZXNldEluZGljYXRvcigpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgIHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcbiAgICAgIHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcbiAgICAgIHZtLmNoZWNrQWxsID0gY2hlY2tBbGw7XG4gICAgICB2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cbiAgICAgIGZ1bmN0aW9uIHNlbGVjdEZvckVkaXRpbmcoa2V5KXtcbiAgICAgICAgaWYodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSx7XG4gICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICB0aXRsZTprZXlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2bS5lZGl0aW5nSXRlbSA9IGtleTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpO1xuICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNoZWNrQmFzZShpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLnR5cGUgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuICBcdFx0XHRcdHJldHVybiB0cnVlO1xuICBcdFx0XHR9XG4gIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgXHRcdH1cbiAgXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbChpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0cmV0dXJuIGNoZWNrQmFzZShpdGVtKSAmJiBpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY2hlY2tBbGwoKXtcbiAgICAgICAgdmFyIGRvbmUgPSAwO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaW5kaWNhdG9yKXtcbiAgICAgICAgICBpZihjaGVja0Jhc2UoaW5kaWNhdG9yKSl7XG4gICAgICAgICAgICBkb25lICsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZG9uZSwgT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoKTtcbiAgICAgICAgaWYoZG9uZSA9PSBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpe1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHNhdmVEYXRhKCkge1xuXG4gICAgICAgICAgaWYoIXZtLm1ldGEueWVhcl9maWVsZCAmJiAhdm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRZZWFyJywgJHNjb3BlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gIFx0XHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG4gIFx0XHRcdFx0XHRkYXRhOiBbXVxuICBcdFx0XHRcdH07XG4gIFx0XHRcdFx0dmFyIG5vWWVhcnMgPSBbXTtcbiAgXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuICBcdFx0XHRcdFx0ZmllbGRzID0gW107XG4gIFx0XHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG4gIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuICBcdFx0XHRcdFx0XHRpZihpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSl7XG4gIFx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhLnllYXIgPSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblxuICBcdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcbiAgXHRcdFx0XHRcdFx0XHR9XG5cbiAgXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdGVsc2V7XG4gICAgICAgICAgICAgICAgaWYodm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuICAgICAgICAgICAgICAgICAgdm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgXHRub1llYXJzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgXHRcdFx0XHRcdFx0fVxuXG5cbiAgXHRcdFx0XHRcdH0gZWxzZSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gIFx0XHRcdFx0XHRcdHJldHVybjtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG4gIFx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG4gIFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRzdHlsZV9pZCA9IHZtLmluZGljYXRvcnNba2V5XS5zdHlsZS5pZDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG4gIFx0XHRcdFx0XHRcdFx0J2NvbHVtbic6IGtleSxcbiAgXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG4gIFx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuICBcdFx0XHRcdFx0XHRcdCdtZWFzdXJlX3R5cGVfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZS5pZCB8fCAwLFxuICBcdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG4gIFx0XHRcdFx0XHRcdFx0J2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuICBcdFx0XHRcdFx0XHR9O1xuICBcdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuICBcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcbiAgXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcbiAgXHRcdFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0XHRcdGZpZWxkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuICBcdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gIFx0XHRcdFx0aWYobm9ZZWFycy5sZW5ndGggPiAwKXtcbiAgXHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcImZvciBcIitub1llYXJzLmxlbmd0aCArIFwiIGVudHJpZXNcIiwgJ05vIHllYXIgdmFsdWUgZm91bmQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHJlc3BvbnNlLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICBcdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcbiAgXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuICBcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuICBcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuICBcdFx0XHRcdFx0XHRcdHZtLmRhdGEgPSBbXTtcbiAgXHRcdFx0XHRcdFx0XHR2bS5zdGVwID0gMDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCAnT3VjaCEnKTtcblxuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuICBcdFx0XHRcdH0pXG5cbiAgXHRcdH1cbiAgICAgIGZ1bmN0aW9uIGNvcHlUb090aGVycygpe1xuICAgICAgLyogIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgdm0ucHJlVHlwZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0udHlwZTtcbiAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcblxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTsqL1xuICAgICAgfVxuICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZihuID09PSBvKXJldHVybjtcbiAgICAgICAgdm0uaW5kaWNhdG9yc1tuLmNvbHVtbl9uYW1lXSA9IG47XG4gICAgICB9LHRydWUpO1xuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYgKG4gPT09IG8gfHwgdHlwZW9mIG8gPT0gXCJ1bmRlZmluZWRcIiB8fCBvID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYoIXZtLmFza2VkVG9SZXBsaWNhdGUpIHtcbiAgICAgICAgICB2bS5wcmVQcm92aWRlciA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uZGF0YXByb3ZpZGVyO1xuICAgICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICAgIHZtLnByZUNhdGVnb3JpZXMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmNhdGVnb3JpZXM7XG4gICAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9uLmRhdGFwcm92aWRlciA9IHZtLmRvUHJvdmlkZXJzID8gdm0ucHJlUHJvdmlkZXIgOiBbXTtcbiAgICAgICAgICAvL24ubWVhc3VyZV90eXBlX2lkID0gdm0uZG9NZWFzdXJlcyA/IHZtLnByZU1lYXN1cmUgOiAwO1xuICAgICAgICAgIC8vbi5jYXRlZ29yaWVzID0gdm0uZG9DYXRlZ29yaWVzID8gdm0ucHJlQ2F0ZWdvcmllczogW107XG4gICAgICAgICAgLy9uLmlzX3B1YmxpYyA9IHZtLmRvUHVibGljID8gdm0ucHJlUHVibGljOiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFFbnRyeUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IFVzZXJTZXJ2aWNlLm15RGF0YSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhTWVudUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICB2bS5kYXRhID0gW107XG5cbiAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlLm15RGF0YSgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgdm0uZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBjb252ZXJ0SW5mbygpO1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0SW5mbygpe1xuICAgICAgICBjb25zb2xlLmxvZyh2bS5kYXRhKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgaXRlbS5tZXRhID0gSlNPTi5wYXJzZShpdGVtLm1ldGFfZGF0YSk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSxJbmRleFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG5cbiAgICAgICAgLy9UT0RPOiBDaGVjayBpZiB0aGVyZSBpcyBkYXRhIGluIHN0b3JhZ2UgdG8gZmluaXNoXG4gICAgICAvKiAgY29uc29sZS5sb2coJHN0YXRlKTtcbiAgICAgICAgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmNyZWF0ZScpe1xuICAgICAgICAgIGlmKEluZGV4U2VydmljZS5nZXREYXRhKCkubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKGNvbmZpcm0oJ0V4aXN0aW5nIERhdGEuIEdvIE9uPycpKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSovXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWFwID0gbnVsbDtcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPVtdO1xuICAgICAgICB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcblxuICAgICAgICB2bS5ncm91cHMgPSBbXTtcbiAgICAgICAgdm0ubXlEYXRhID0gW107XG4gICAgICAgIHZtLmFkZERhdGFUbyA9IHt9O1xuICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5vcGVuQ2xvc2UgPSBvcGVuQ2xvc2U7XG4gICAgICAgIC8vdm0uc2VhcmNoID0gc2VhcmNoO1xuXG4gICAgICAgIHZtLmxpc3RSZXNvdXJjZXMgPSBsaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS50b2dnbGVMaXN0UmVzb3VyY2VzID0gdG9nZ2xlTGlzdFJlc291cmNlcztcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZSA9IHNlbGVjdGVkUmVzb3VyY2U7XG4gICAgICAgIHZtLnRvZ2dsZVJlc291cmNlID0gdG9nZ2xlUmVzb3VyY2U7XG4gICAgICAgIHZtLmluY3JlYXNlUGVyY2VudGFnZSA9IGluY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0uZGVjcmVhc2VQZXJjZW50YWdlID0gZGVjcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS50b2dnbGVHcm91cFNlbGVjdGlvbiA9IHRvZ2dsZUdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5leGlzdHNJbkdyb3VwU2VsZWN0aW9uID0gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uYWRkR3JvdXAgPSBhZGRHcm91cDtcbiAgICAgICAgdm0uY2xvbmVTZWxlY3Rpb24gPSBjbG9uZVNlbGVjdGlvbjtcbiAgICAgICAgdm0uZWRpdEVudHJ5ID0gZWRpdEVudHJ5O1xuICAgICAgICB2bS5yZW1vdmVFbnRyeSA9IHJlbW92ZUVudHJ5O1xuICAgICAgICB2bS5zYXZlSW5kZXggPSBzYXZlSW5kZXg7XG5cbiAgICAgICAgdm0uaWNvbnMgPSBJY29uc1NlcnZpY2UuZ2V0TGlzdCgpO1xuXG4gICAgICAgIHZtLm1ldGEgPSB7XG4gICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgIH07XG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgb3JkZXI6ICctZXJyb3JzJyxcbiAgICAgICAgICBsaW1pdDogMTUsXG4gICAgICAgICAgcGFnZTogMVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qdm0udHJlZU9wdGlvbnMgPSB7XG4gICAgICAgICAgYmVmb3JlRHJvcDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBpZihldmVudC5kZXN0Lm5vZGVzU2NvcGUgIT0gZXZlbnQuc291cmNlLm5vZGVzU2NvcGUpe1xuICAgICAgICAgICAgICB2YXIgaWR4ID0gZXZlbnQuZGVzdC5ub2Rlc1Njb3BlLiRtb2RlbFZhbHVlLmluZGV4T2YoZXZlbnQuc291cmNlLm5vZGVTY29wZS4kbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICAgIGlmKGlkeCA+IC0xKXtcbiAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLm5vZGVTY29wZS4kJGFwcGx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignT25seSBvbmUgZWxlbWVudCBvZiBhIGtpbmQgcGVyIGdyb3VwIHBvc3NpYmxlIScsICdOb3QgYWxsb3dlZCEnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wcGVkOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9OyovXG5cbiAgICAgICAgLy9SdW4gU3RhcnR1cC1GdW5jaXRvbnNcbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIC8vY2xlYXJNYXAoKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2UucmVzZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvcGVuQ2xvc2UoYWN0aXZlKXtcbiAgICAgICAgICByZXR1cm4gYWN0aXZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckxheWVyU3R5bGUoZmVhdHVyZSl7XG4gICAgICBcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgIGNvbG9yOidyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICAgICAgICAgICAgb3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9XG4gICAgICAgICAgICB9O1xuICAgICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFwKCl7XG4gICAgICAgICAgXHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY2xlYXJMYXllclN0eWxlKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVMaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgdm0uc2hvd1Jlc291cmNlcyA9ICF2bS5zaG93UmVzb3VyY2VzO1xuICAgICAgICAgIGlmKHZtLnNob3dSZXNvdXJjZXMpe1xuICAgICAgICAgICAgdm0ubGlzdFJlc291cmNlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgaWYoIXZtLnJlc291cmNlcyl7XG4gICAgICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGEvdGFibGVzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIHZtLnJlc291cmNlcyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9IFtdLCB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0ZWRSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpID4gLTEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBsaXN0KXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgLy9pZih0eXBlb2YgaXRlbS5pc0dyb3VwID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgIGlmKGl0ZW0gPT0gcmVzb3VyY2Upe1xuICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2Uoa2V5LCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2Uodm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihpdGVtKSwxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGl0ZW0ubm9kZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCB2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL2NhbGNQZXJjZW50YWdlKHZtLnNvcnRlZFJlc291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2FsY1BlcmNlbnRhZ2Uobm9kZXMpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcbiAgICAgICAgICAgIG5vZGVzW2tleV0ud2VpZ2h0ID0gcGFyc2VJbnQoMTAwIC8gbm9kZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKG5vZGVzLm5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGluY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVHcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleGlzdHNJbkdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSkgPiAtMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZGRHcm91cCgpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidHcm91cCcsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID4gMCApe1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgdm0uc2VsZWN0ZWRGb3JHcm91cCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xvbmVTZWxlY3Rpb24oKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonQ2xvbmVkIEVsZW1lbnRzJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0RW50cnkoaXRlbSl7XG4gICAgICAgICAgdm0uZWRpdEl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVudHJ5KGl0ZW0sIGxpc3Qpe1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIGxpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNhdmVJbmRleCgpe1xuICAgICAgICAgIGlmKHZtLnNhdmVEaXNhYmxlZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgaWYodHlwZW9mIHZtLm5ld0luZGV4ID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdm0ubmV3SW5kZXgudGl0bGUpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLm5ld0luZGV4LmRhdGEgPSB2bS5ncm91cHM7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5uZXdJbmRleCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3VyIEluZGV4IGhhcyBiZWVuIGNyZWF0ZWQnLCAnU3VjY2VzcycpLFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDpyZXNwb25zZS5uYW1lfSk7XG4gICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCdVcHBzISEnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgIGlmKCF2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnOlxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codm0uZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjaGVja015RGF0YSgpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDI7XG4gICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUubWV0YSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMztcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uICgkc3RhdGUsIGNhdGVnb3J5LCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uY2F0ZWdvcnkgPSBjYXRlZ29yeTtcblx0XHR2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHR2bS5vcHRpb25zID0ge1xuXHRcdFx0Z2xvYmFsU2F2ZTp0cnVlLFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmRhdGEuaWR9KVxuXHRcdFx0fSxcblx0XHR9XG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCwkc3RhdGUsIGluZGljYXRvcnMsIGluZGljZXMsIHN0eWxlcywgY2F0ZWdvcmllcywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLmNvbXBvc2l0cyA9IGluZGljZXM7XG5cdFx0dm0uc3R5bGVzID0gc3R5bGVzO1xuXHRcdHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXHRcdHZtLmNoZWNrVGFiQ29udGVudCA9IGNoZWNrVGFiQ29udGVudDtcblxuXHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLnNlbGVjdGlvbiA9IHtcblx0XHRcdGluZGljZXM6W10sXG5cdFx0XHRpbmRpY2F0b3JzOltdLFxuXHRcdFx0c3R5bGVzOltdLFxuXHRcdFx0Y2F0ZWdvcmllczpbXVxuXHRcdH07XG5cblxuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRjb21wb3NpdHM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjb21wb3NpdHMnLFxuXHRcdFx0XHRhbGxvd01vdmU6ZmFsc2UsXG5cdFx0XHRcdGFsbG93RHJvcDpmYWxzZSxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0aXRlbUNsaWNrOiBmdW5jdGlvbihpZCwgbmFtZSl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtpZDppZCwgbmFtZTpuYW1lfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOjAsIG5hbWU6ICduZXcnfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmluZGljZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5pbmRpY2VzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjYXRlZ29yaWVzOntcblx0XHRcdFx0ZHJhZzpmYWxzZSxcblx0XHRcdFx0dHlwZTonY2F0ZWdvcmllcycsXG5cdFx0XHRcdGFsbG93QWRkOnRydWUsXG5cdFx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRcdGFkZENsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6J25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblxuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmlkfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmNhdGVnb3JpZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUNhdGVnb3J5KGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzdHlsZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidzdHlsZXMnLFxuXHRcdFx0XHR3aXRoQ29sb3I6dHJ1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblxuXHRcdGZ1bmN0aW9uIGNoZWNrVGFiQ29udGVudChpbmRleCl7XG5cdFx0XHRzd2l0Y2ggKGluZGV4KSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiAkc3RhdGUucGFyYW1zLmlkICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiRzdGF0ZS5wYXJhbXMuaWRcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuXHRcdCAgaWYodHlwZW9mIHRvUGFyYW1zLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uYWN0aXZlID0gdG9QYXJhbXMuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDE7XG5cdFx0XHRcdC8vYWN0aXZhdGUodG9QYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kaWNhdG9yKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvciA9IGluZGljYXRvcjtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0c2V0QWN0aXZlKCk7XG5cblx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTtcblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWluTWF4KCl7XG5cdFx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHRcdHZtLm1heCA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHR2bS5taW4gPSBNYXRoLm1pbihpdGVtLnNjb3JlLCB2bS5taW4pO1xuXHRcdFx0XHRcdHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uc2NvcmUsIHZtLm1heCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcblx0XHRcdHZhciB2YWx1ZSA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0IGlmKGl0ZW0uaXNvID09IGlzbyl7XG5cdFx0XHRcdFx0IHZhbHVlID0gaXRlbS5zY29yZTtcblx0XHRcdFx0IH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KHZtLnNjYWxlKHZhbHVlKSkpICogNDtcblx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRzZXRBY3RpdmUoKTtcblx0XHR9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGluaWRjYXRvcnNDdHJsJywgZnVuY3Rpb24gKGluZGljYXRvcnMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0Ly9cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXG5cbiAgfSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpemVzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwkdGltZW91dCwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgQ29udGVudFNlcnZpY2UsIGluZGV4KSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIC8vdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuICAgIHZtLmluZGV4ID0gaW5kZXg7XG5cdFx0dm0uc2NhbGUgPSBcIlwiO1xuXHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdHZtLm1heCA9IDA7XG5cdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRzZXRBY3RpdmUoKTtcbiAgICB2bS5vcHRpb25zID0ge1xuICAgICAgaW5kaXplczp7XG4gICAgICAgIGFkZENsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJyk7XG4gICAgICAgIH0sXG5cdFx0XHRcdGFkZENvbnRhaW5lckNsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSB7XG5cdFx0XHRcdFx0XHR0aXRsZTogJ0kgYW0gYSBncm91cC4uLiBuYW1lIG1lJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dm0uaW5kZXguY2hpbGRyZW4ucHVzaChpdGVtKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bSk7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlRHJvcDogZnVuY3Rpb24oZXZlbnQsaXRlbSxleHRlcm5hbCx0eXBlKXtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZW1vdmVJdGVtKGl0ZW0sdm0uaW5kZXguY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cbiAgICAgIH0sXG4gICAgICB3aXRoU2F2ZTogdHJ1ZVxuICAgIH1cblxuXHRcdGFjdGl2ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gcmVtb3ZlSXRlbShpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0LypDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTsqL1xuXG5cdFx0ZnVuY3Rpb24gc2V0QWN0aXZlKCl7XG5cdFx0LypcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5mb0N0cmwnLCBmdW5jdGlvbihJbmRpemVzU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnN0cnVjdHVyZSA9IEluZGl6ZXNTZXJ2aWNlLmdldFN0cnVjdHVyZSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGljYXRvclNob3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCBpbmRpY2F0b3IsIGNvdW50cmllcywgQ29udGVudFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmN1cnJlbnQgPSBudWxsO1xuXHRcdHZtLmFjdGl2ZSA9IG51bGwsIHZtLmFjdGl2ZUdlbmRlciA9IG51bGw7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cdFx0dm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLmRhdGEgPSBbXTtcblx0XHR2bS55ZWFyID0gbnVsbCwgdm0uZ2VuZGVyID0gJ2FsbCc7XG5cdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRtYXg6IC0xMDAwMDAwMDAsXG5cdFx0XHRtaW46IDEwMDAwMDAwMFxuXHRcdH07XG5cdFx0dm0uZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdvSW5mb1N0YXRlID0gZ29JbmZvU3RhdGU7XG5cdFx0dm0uaGlzdG9yeURhdGEgPSBudWxsO1xuXG5cdFx0dm0uc2V0WWVhciA9IHNldFllYXI7XG5cdFx0dm0uc2V0R2VuZGVyID0gc2V0R2VuZGVyO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0cmVzZXRSYW5nZSgpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL1x0dm0ueWVhciA9ICRzdGF0ZS5wYXJhbXMueWVhcjtcblx0XHRcdFx0Ly9cdHZtLmdlbmRlciA9ICRzdGF0ZS5wYXJhbXMuZ2VuZGVyO1xuXHRcdFx0XHRcdC8vZ2V0RGF0YSgkc3RhdGUucGFyYW1zLnllYXIsICRzdGF0ZS5wYXJhbXMuZ2VuZGVyKTtcblx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMueWVhcikge1xuXHRcdFx0XHRcdHZtLnllYXIgPSAkc3RhdGUucGFyYW1zLnllYXI7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bS5pbmRpY2F0b3IueWVhcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh2bS5pbmRpY2F0b3IueWVhcnNbaV0ueWVhciA9PSAkc3RhdGUucGFyYW1zLnllYXIpIHtcblx0XHRcdFx0XHRcdFx0dm0uYWN0aXZlID0gaTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoIXZtLmFjdGl2ZSkge1xuXHRcdFx0XHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodm0uaW5kaWNhdG9yLmdlbmRlcikge1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmdlbmRlciAhPSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHR2bS5nZW5kZXIgPSAkc3RhdGUucGFyYW1zLmdlbmRlcjtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm0uaW5kaWNhdG9yLmdlbmRlci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAodm0uaW5kaWNhdG9yLmdlbmRlcltpXS5nZW5kZXIgPT0gJHN0YXRlLnBhcmFtcy5nZW5kZXIpIHtcblx0XHRcdFx0XHRcdFx0XHR2bS5hY3RpdmVHZW5kZXIgPSBpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghdm0uYWN0aXZlR2VuZGVyKSB7XG5cdFx0XHRcdFx0XHR2bS5hY3RpdmVHZW5kZXIgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICghdm0uYWN0aXZlR2VuZGVyKSB7XG5cdFx0XHRcdCB2bS5hY3RpdmVHZW5kZXIgPSAwO1xuXHRcdFx0IFx0fVxuXHRcdFx0XHRnZXREYXRhKHZtLnllYXIsIHZtLmdlbmRlcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZXNldFJhbmdlKCkge1xuXHRcdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogLTEwMDAwMDAwMCxcblx0XHRcdFx0bWluOiAxMDAwMDAwMDBcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXNvKSB7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdC8vdm0uY3VycmVudCA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0fSlcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ29JbmZvU3RhdGUoKSB7XG5cdFx0XHQvLyBpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJykge1xuXHRcdFx0Ly8gXHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IuaW5mbycsIHtcblx0XHRcdC8vIFx0XHR5ZWFyOiB2bS55ZWFyXG5cdFx0XHQvLyBcdH0pO1xuXHRcdFx0Ly8gfSBlbHNlIHtcblx0XHRcdC8vIFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0Ly8gXHRcdGlkOiB2bS5pbmRpY2F0b3IuaWQsXG5cdFx0XHQvLyBcdFx0bmFtZTogdm0uaW5kaWNhdG9yLm5hbWUsXG5cdFx0XHQvLyBcdFx0eWVhcjogdm0ueWVhclxuXHRcdFx0Ly8gXHR9KTtcblx0XHRcdC8vIH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpIHtcblx0XHRcdHZhciByYW5rID0gdm0uZGF0YS5pbmRleE9mKGNvdW50cnkpICsgMTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2codm0uZ2V0UmFuayh2bS5jdXJyZW50KSk7XG5cdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE3O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZSgpIHtcblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0aXNvOiB2bS5jdXJyZW50Lmlzbyxcblx0XHRcdH0pO1xuXHRcdFx0Z2V0SGlzdG9yeSgpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cdFx0XHR2YXIgYyA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdKTtcblx0XHRcdGlmICh0eXBlb2YgYy5zY29yZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBjO1xuXHRcdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldEhpc3RvcnkoKSB7XG5cdFx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JIaXN0b3J5KHZtLmluZGljYXRvci5pZCwgdm0uY3VycmVudC5pc28sIHZtLmdlbmRlcikudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHZtLmhpc3RvcnlEYXRhID0gZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldFllYXIoeWVhcil7XG5cdFx0XHR2bS55ZWFyID0geWVhcjtcblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0eWVhcjogeWVhcixcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzZXRHZW5kZXIoZ2VuZGVyKXtcblx0XHRcdHZtLmdlbmRlciA9IGdlbmRlciB8fCAnYWxsJztcblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0Z2VuZGVyOnZtLmdlbmRlclxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldERhdGEoeWVhciwgZ2VuZGVyKSB7XG5cdFx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKHZtLmluZGljYXRvci5pZCwgdm0ueWVhciwgdm0uZ2VuZGVyKS50aGVuKGZ1bmN0aW9uKGRhdCkge1xuXHRcdFx0XHRcdHJlc2V0UmFuZ2UoKTtcblx0XHRcdFx0XHR2bS5kYXRhID0gZGF0O1xuXHRcdFx0XHRcdHZhciBpc28gPSBudWxsO1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmlzbykge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bS5kYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh2bS5kYXRhW2ldLmlzbyA9PSAkc3RhdGUucGFyYW1zLmlzbykge1xuXHRcdFx0XHRcdFx0XHRcdHZtLmN1cnJlbnQgPSB2bS5kYXRhW2ldO1xuXHRcdFx0XHRcdFx0XHRcdGlzbyA9IHZtLmN1cnJlbnQuaXNvO1xuXHRcdFx0XHRcdFx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0XHRpdGVtLnJhbmsgPSB2bS5kYXRhLmluZGV4T2YoaXRlbSkgKyAxO1xuXHRcdFx0XHRcdFx0aWYgKHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uaXNvID09IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0Q3VycmVudChpdGVtKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0ucmFuZ2UubWF4ID0gZDMubWF4KFt2bS5yYW5nZS5tYXgsIHBhcnNlRmxvYXQoaXRlbS5zY29yZSldKTtcblx0XHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IGQzLm1pbihbdm0ucmFuZ2UubWluLCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdFx0XHRmaWVsZDogJ3JhbmsnLFxuXHRcdFx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Z2V0T2Zmc2V0KCk7XG5cdFx0XHRcdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLnJhbmdlLm1pbiwgdm0ucmFuZ2UubWF4XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmRhdGEsIHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciwgdHJ1ZSk7XG5cdFx0XHRcdFx0Ly9WZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoY291bnRyaWVzU3R5bGUsIGNvdW50cnlDbGljayk7XG5cdFx0XHR9KTtcblxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXG5cdFx0XHR2YXIgZmllbGQgPSAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZiAodm0uY3VycmVudCkge1xuXHRcdFx0XHRpZiAodm0uY3VycmVudC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblx0XHR2bS51aU9uUGFyYW1zQ2hhbmdlZCA9IGZ1bmN0aW9uKGNoYW5nZWRQYXJhbXMsICR0cmFuc2l0aW9uJCkge1xuXHRcdFx0Z2V0RGF0YSh2bS55ZWFyLCB2bS5nZW5kZXIpO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsIGZ1bmN0aW9uICgkZmlsdGVyLCBkYXRhKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmRhdGEgPSBkYXRhO1xuICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblxuICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcblx0XHRcdHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG5cdFx0XHQvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuXHRcdH07XG5cblxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5wcmV2U3RhdGUgPSBudWxsO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICBcbiAgICAgICAgdm0udXNlciA9IHtcbiAgICAgICAgICBlbWFpbDonJyxcbiAgICAgICAgICBwYXNzd29yZDonJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICB2bS5jaGVja0xvZ2dlZEluKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0xvZ2dlZEluKCl7XG5cbiAgICAgICAgICBpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6J2VwaSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9Mb2dpbigpe1xuICAgICAgICAgICRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUucHJldmlvdXNQYWdlKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dvQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBsZWFmbGV0RGF0YSwgbGVhZmxldE1hcEV2ZW50cywgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB6b29tID0gMyxcblx0XHRcdG1pblpvb20gPSAyO1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCkge1xuXHRcdFx0em9vbSA9IDI7XG5cdFx0fVxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGFwaUtleSA9IFZlY3RvcmxheWVyU2VydmljZS5rZXlzLm1hcGJveDtcblx0XHR2bS50b2dnbGVMYXllcnMgPSB0b2dnbGVMYXllcnM7XG5cdFx0dm0uZGVmYXVsdHMgPSB7XG5cdFx0XHQvL3Njcm9sbFdoZWVsWm9vbTogZmFsc2UsXG5cdFx0XHRtaW5ab29tOiBtaW5ab29tLFxuXHRcdFx0bWF4Wm9vbTogNlxuXHRcdH07XG5cdFx0dm0uY2VudGVyID0ge1xuXHRcdFx0bGF0OiA0OC4yMDkyMDYsXG5cdFx0XHRsbmc6IDE2LjM3Mjc3OCxcblx0XHRcdHpvb206IHpvb21cblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ091dGRvb3InLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdFx0bGF5ZXJPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZGV0ZWN0UmV0aW5hOiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5sYWJlbHNMYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hZ25vbG8uMDYwMjlhOWMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LCB7XG5cdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0bmFtZTogJ2xhYmVscycsXG5cdFx0XHRkZXRlY3RSZXRpbmE6IHRydWVcblx0XHR9KTtcblx0XHR2bS5tYXhib3VuZHMgPSB7XG5cdFx0XHRzb3V0aFdlc3Q6IHtcblx0XHRcdFx0bGF0OiA5MCxcblx0XHRcdFx0bG5nOiAxODBcblx0XHRcdH0sXG5cdFx0XHRub3J0aEVhc3Q6IHtcblx0XHRcdFx0bGF0OiAtOTAsXG5cdFx0XHRcdGxuZzogLTE4MFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uY29udHJvbHMgPSB7XG5cdFx0XHRjdXN0b206IFtdXG5cdFx0fTtcblx0XHR2bS5sYXllcmNvbnRyb2wgPSB7XG5cdFx0XHRpY29uczoge1xuXHRcdFx0XHR1bmNoZWNrOiBcImZhIGZhLXRvZ2dsZS1vZmZcIixcblx0XHRcdFx0Y2hlY2s6IFwiZmEgZmEtdG9nZ2xlLW9uXCJcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgTXlDb250cm9sID0gTC5jb250cm9sKCk7XG5cdFx0TXlDb250cm9sLnNldFBvc2l0aW9uKCd0b3BsZWZ0Jyk7XG5cdFx0TXlDb250cm9sLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRNeUNvbnRyb2wub25BZGQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXIgbGVhZmxldC1jb250cm9sLXpvb20nKTtcblx0XHRcdHZhciBzcGFuID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICdsZWFmbGV0LWNvbnRyb2wtem9vbS1pbiBjdXJzb3InLCBjb250YWluZXIpO1xuXHRcdFx0c3Bhbi50ZXh0Q29udGVudCA9ICdUJztcblx0XHRcdHNwYW4udGl0bGUgPSBcIlRvZ2dsZSBMYWJlbHNcIjtcblx0XHRcdEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24oY29udGFpbmVyKTtcblx0XHRcdEwuRG9tRXZlbnQuYWRkTGlzdGVuZXIoY29udGFpbmVyLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0XHRtYXAucmVtb3ZlTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubm9MYWJlbCA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblx0XHR2YXIgQmFja0hvbWUgPSBMLmNvbnRyb2woKTtcblx0XHRCYWNrSG9tZS5zZXRQb3NpdGlvbigndG9wbGVmdCcpO1xuXHRcdEJhY2tIb21lLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRCYWNrSG9tZS5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhciBsZWFmbGV0LWNvbnRyb2wtem9vbSBsZWFmbGV0LWNvbnRyb2wtaG9tZScpO1xuXHRcdFx0dmFyIHNwYW4gPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJ2xlYWZsZXQtY29udHJvbC16b29tLWluIGN1cnNvcicsIGNvbnRhaW5lcik7XG5cdFx0XHR2YXIgaWNvbiA9IEwuRG9tVXRpbC5jcmVhdGUoJ21kLWljb24nLCAnbWF0ZXJpYWwtaWNvbnMgbWQtcHJpbWFyeScsIHNwYW4pO1xuXHRcdFx0c3Bhbi50aXRsZSA9IFwiQ2VudGVyIE1hcFwiO1xuXHRcdFx0aWNvbi50ZXh0Q29udGVudCA9IFwiaG9tZVwiO1xuXHRcdFx0TC5Eb21FdmVudC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbihjb250YWluZXIpO1xuXHRcdFx0TC5Eb21FdmVudC5hZGRMaXN0ZW5lcihjb250YWluZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0bWFwLnNldFZpZXcoWzQ4LjIwOTIwNiwgMTYuMzcyNzc4XSwgem9vbSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGF5ZXJzKG92ZXJsYXlOYW1lKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0bWFwLnJlbW92ZUxheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWFwLmFkZExheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldE1hcChtYXApO1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRkZXRlY3RSZXRpbmE6dHJ1ZSxcblx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbSddLFxuXHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdG1hcC5hZGRDb250cm9sKE15Q29udHJvbCk7XG5cdFx0XHRtYXAuYWRkQ29udHJvbChCYWNrSG9tZSk7XG5cdFx0XHQvKm1hcC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRhbGVydCgnaGVsbG8nKTtcblx0XHRcdH0pO1xuXG4gICAgICAgICAgICB2YXIgbWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gbWFwRXZlbnRzKXtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuJyArIG1hcEV2ZW50c1trXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtYXBFdmVudHNba10pXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cdFx0LypcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7Ki9cblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWRlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSwgRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIgPSB7fTtcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVGV4dDtcblxuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvZGF0YXByb3ZpZGVycycsIHZtLmRhdGFwcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZGF0YXByb3ZpZGVycy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLmRhdGFwcm92aWRlciA9IGRhdGE7XG4gICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVW5pdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0udW5pdCA9IHt9O1xuICAgICAgdm0udW5pdC50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFVuaXQ7XG5cbiAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vXG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL21lYXN1cmVfdHlwZXMnLCB2bS51bml0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWVhc3VyZVR5cGVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLnR5cGUgPSBkYXRhO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgIH07XG5cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkWWVhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52bSk7XG4gICAgICAgICAgICAkc2NvcGUudm0uc2F2ZURhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bWV0aG9kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdHRleHRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgXG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRyb3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5zZWxlY3RlZFswXTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcHlwcm92aWRlckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5hc2tlZFRvUmVwbGljYXRlID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9TdHlsZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYyA9IHRydWU7XG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuJHBhcmVudC52bS5kYXRhWzBdLmRhdGEsIGZ1bmN0aW9uIChkYXRhLCBrZXkpIHtcblx0XHRcdFx0aWYgKGtleSAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LCB7XG5cdFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiBrZXksXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBrZXlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgaXRlbSA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KTtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMpIHtcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YXByb3ZpZGVyID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlUHJvdmlkZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLnR5cGUgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVUeXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVDYXRlZ29yaWVzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMpIHtcblx0XHRcdFx0XHRcdGl0ZW0uaXNfcHVibGljID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlUHVibGljO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9TdHlsZSkge1xuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGU7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uc3R5bGVfaWQgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVTdHlsZS5pZDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXG5cdFx0fTtcblxuXHRcdCRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IGZhbHNlO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRjb2x1bW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSAkc2NvcGUuJHBhcmVudC52bS50b0VkaXQ7XG4gICAgICAgIGlmKHR5cGVvZiAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUpe1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uKXtcbiAgICAgICAgICAgICRzY29wZS5kZXNjcmlwdGlvbiA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSA9ICRzY29wZS50aXRsZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbiA9ICRzY29wZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQmFyc0N0cmwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLndpZHRoID0gd2lkdGg7XG5cblx0XHRmdW5jdGlvbiB3aWR0aChpdGVtKSB7XG5cdFx0XHRpZighdm0uZGF0YSkgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIHZtLmRhdGFbaXRlbS5uYW1lXTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2JhcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9iYXJzL2JhcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL29wdGlvbnMuaGVpZ2h0ID0gb3B0aW9ucy53aWR0aCAqIDEuMTtcblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHt9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1Db2xvciA9IGdyb3VwLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRpZihncm91cC5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRtQ29sb3IgPSBncm91cC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogbUNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9IGl0ZW0uY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihpdGVtLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGl0ZW0uc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLnN0eWxlLmJhc2VfY29sb3IgfHwgc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLnR5cGU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSA/ICcjZmZmJyA6IGQuY29sb3I7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdGlmKGQudW5pY29kZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHNob3dfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQ7XG5cdFx0XHRcdFx0dmFyXHRiYXJPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0dGl0bGVkOnRydWVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSAnPG1kLXByb2dyZXNzLWxpbmVhciBtZC1tb2RlPVwiZGV0ZXJtaW5hdGVcIiB2YWx1ZT1cIicrZGF0YS52YWx1ZSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRpZihzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSA+IDAgKXtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPGRpdiBjbGFzcz1cInN1YlwiPic7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKydcIj48L21kLXByb2dyZXNzLWxpbmVhcj4nXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKycgLSAnICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPC9kaXY+Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vY29udGVudCA9ICc8YmFycyBvcHRpb25zPVwiYmFyT3B0aW9uc1wiIHN0cnVjdHVyZT1cImRhdGEuZGF0YS5jaGlsZHJlblwiIGRhdGE9XCJkYXRhXCI+PC9iYXJzPic7XG5cblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdpbmRleGVyJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgblswXS5jaGlsZHJlbiAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdFx0Y2xlYXJfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ2F0ZWdvcmllc0N0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRPcHRpb25zID0ge1xuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oY2F0ZWdvcnkpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjYXRlZ29yaWVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcmllc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLnNhdmVDYXRlZ29yeSA9IHNhdmVDYXRlZ29yeTtcblx0XHR2bS5xdWVyeVNlYXJjaENhdGVnb3J5ID0gcXVlcnlTZWFyY2hDYXRlZ29yeTtcblx0XHR2bS5wYXJlbnRDaGFuZ2VkID0gcGFyZW50Q2hhbmdlZDtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uc3R5bGVzID0gQ29udGVudFNlcnZpY2UuZ2V0U3R5bGVzKCk7XG5cdFx0dm0uZmxhdHRlbmVkID0gW107XG5cdFx0dm0uY29weSA9IHt9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbih2bS5jYXRlZ29yaWVzKTtcblx0XHRcdGlmKHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0dm0ucGFyZW50ID0gZ2V0UGFyZW50KHZtLml0ZW0sIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHR2bS5jb3B5ID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBmbGF0dGVuV2l0aENoaWxkcmVuKGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2bS5mbGF0dGVuZWQucHVzaChpdGVtKTtcblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbihpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaENhdGVnb3J5KHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKCRmaWx0ZXIoJ29yZGVyQnknKSh2bS5mbGF0dGVuZWQsICd0aXRsZScpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0XHQvL3JldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykoJGZpbHRlcignZmxhdHRlbicpKHZtLmNhdGVnb3JpZXMpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcGFyZW50Q2hhbmdlZChpdGVtKXtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLnBhcmVudF9pZCA9IG51bGw7XG5cdFx0XHRcdHZtLml0ZW0ucGFyZW50ID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoaXRlbS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGUgUGFyZW50IGNhbm5vdCBiZSB0aGUgc2FtZScsICdJbnZhbGlkIHNlbGVjdGlvbicpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5wYXJlbnQgPSBpdGVtO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnRfaWQgPSBpdGVtLmlkO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnQgPSBpdGVtO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoaXRlbSxsaXN0KXtcblx0XHRcdHZhciBmb3VuZCA9IG51bGxcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4gJiYgIWZvdW5kKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gZ2V0UGFyZW50KGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0Zm91bmQgPSBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbW92ZUl0ZW0oKXtcblx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkKXtcblx0XHRcdFx0XHR2YXIgb2xkUGFyZW50ID0gZ2V0UGFyZW50KHZtLmNvcHksIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvbGRQYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKXtcblx0XHRcdFx0XHRcdGlmKG9sZFBhcmVudC5jaGlsZHJlbltpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0b2xkUGFyZW50LmNoaWxkcmVuLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2bS5jYXRlZ29yaWVzLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRcdFx0aWYodm0uY2F0ZWdvcmllc1tpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMuc3BsaWNlKGksMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdHZhciBuZXdQYXJlbnQgPSBnZXRQYXJlbnQodm0uaXRlbSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdG5ld1BhcmVudC5jaGlsZHJlbi5wdXNoKHZtLml0ZW0pO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5jYXRlZ29yaWVzLnB1c2godm0uaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHN1Y2Nlc3NBY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5jb3B5LnBhcmVudF9pZCwgdm0uaXRlbS5wYXJlbnRfaWQpO1xuXHRcdFx0aWYodm0uY29weS5wYXJlbnRfaWQgIT0gdm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHQvL2lmKHZtLmNvcHkucGFyZW50X2lkICYmIHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0XHRtb3ZlSXRlbSgpO1xuXHRcdFx0Ly9cdH1cblx0XHRcdH1cblx0XHRcdHRvYXN0ci5zdWNjZXNzKCdDYXRlZ29yeSBoYXMgYmVlbiB1cGRhdGVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdCRzY29wZS5jYXRlZ29yeUZvcm0uJHNldFN1Ym1pdHRlZCgpO1xuXHRcdFx0dm0uY29weSA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZUNhdGVnb3J5KHZhbGlkKSB7XG5cdFx0XHRpZih2YWxpZCl7XG5cdFx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHRcdGlmKHZtLml0ZW0ucmVzdGFuZ3VsYXJpemVkKXtcblx0XHRcdFx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oc3VjY2Vzc0FjdGlvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS51cGRhdGUoJ2NhdGVnb3JpZXMnLCB2bS5pdGVtLmlkLCB2bS5pdGVtKS50aGVuKHN1Y2Nlc3NBY3Rpb24pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY2F0ZWdvcmllcycsIHZtLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKGRhdGEucGFyZW50X2lkICl7XG5cdFx0XHRcdFx0XHRcdFx0IHZhciBwYXJlbnQgPSBnZXRQYXJlbnQoZGF0YSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdFx0XHRcdFx0IGlmKCFwYXJlbnQuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbi5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuZXhwYW5kZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBDYXRlZ29yeSBoYXMgYmVlbiBzYXZlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0XHR2bS5vcHRpb25zLnBvc3REb25lKGRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY2F0ZWdvcnknLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yeS9jYXRlZ29yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDYXRlZ29yeUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9PycsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHR2YXIgIM+EID0gMiAqIE1hdGguUEk7XG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCAnMC42Jylcblx0XHRcdFx0XHQuYXR0cignZmlsbCcsICdub25lJyk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gJzFlbSc7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJzEuNWVtJztcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICcwLjM1ZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcwLjM3ZW0nXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblxuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHRoaXMudGV4dENvbnRlbnQuc3BsaXQoJ07CsCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZCksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lyokc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQoJHNjb3BlLml0ZW1bbi5maWVsZF0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnaXRlbScsXHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0Ly9pZihuID09PSBvKSByZXR1cm47XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0blskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyB8fCAhbikgcmV0dXJuO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29tcG9zaXRzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjb21wb3NpdHMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NvbXBvc2l0c0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29uZmxpY3RpdGVtcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGl0ZW1zQ3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29udGVudGVkaXRhYmxlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY29udGVudGVkaXRhYmxlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdC8vaWYgKCFuZ01vZGVsKSByZXR1cm47XG5cdFx0XHRcdG5nTW9kZWwuJHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRlbGVtZW50Lmh0bWwobmdNb2RlbC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBMaXN0ZW4gZm9yIGNoYW5nZSBldmVudHMgdG8gZW5hYmxlIGJpbmRpbmdcblx0XHRcdFx0ZWxlbWVudC5vbignYmx1ciBrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KHJlYWRWaWV3VGV4dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTm8gbmVlZCB0byBpbml0aWFsaXplLCBBbmd1bGFySlMgd2lsbCBpbml0aWFsaXplIHRoZSB0ZXh0IGJhc2VkIG9uIG5nLW1vZGVsIGF0dHJpYnV0ZVxuXG5cdFx0XHRcdC8vIFdyaXRlIGRhdGEgdG8gdGhlIG1vZGVsXG5cdFx0XHRcdGZ1bmN0aW9uIHJlYWRWaWV3VGV4dCgpIHtcblx0XHRcdFx0XHR2YXIgaHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xuXHRcdFx0XHRcdC8vIFdoZW4gd2UgY2xlYXIgdGhlIGNvbnRlbnQgZWRpdGFibGUgdGhlIGJyb3dzZXIgbGVhdmVzIGEgPGJyPiBiZWhpbmRcblx0XHRcdFx0XHQvLyBJZiBzdHJpcC1iciBhdHRyaWJ1dGUgaXMgcHJvdmlkZWQgdGhlbiB3ZSBzdHJpcCB0aGlzIG91dFxuXHRcdFx0XHRcdGlmIChhdHRycy5zdHJpcEJyICYmIGh0bWwgPT0gJzxicj4nKSB7XG5cdFx0XHRcdFx0XHRodG1sID0gJyc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShodG1sKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZpbGVEcm9wem9uZScsIGZ1bmN0aW9uICh0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG4gICAgICAgIGZpbGU6ICc9JyxcbiAgICAgICAgZmlsZU5hbWU6ICc9J1xuICAgICAgfSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0dmFyIGNoZWNrU2l6ZSwgaXNUeXBlVmFsaWQsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIsIHZhbGlkTWltZVR5cGVzO1xuXHRcdFx0XHRwcm9jZXNzRHJhZ092ZXJPckVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsaWRNaW1lVHlwZXMgPSBhdHRycy5maWxlRHJvcHpvbmU7XG5cdFx0XHRcdGNoZWNrU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG5cdFx0XHRcdFx0dmFyIF9yZWY7XG5cdFx0XHRcdFx0aWYgKCgoX3JlZiA9IGF0dHJzLm1heEZpbGVTaXplKSA9PT0gKHZvaWQgMCkgfHwgX3JlZiA9PT0gJycpIHx8IChzaXplIC8gMTAyNCkgLyAxMDI0IDwgYXR0cnMubWF4RmlsZVNpemUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkZpbGUgbXVzdCBiZSBzbWFsbGVyIHRoYW4gXCIgKyBhdHRycy5tYXhGaWxlU2l6ZSArIFwiIE1CXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aXNUeXBlVmFsaWQgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdFx0XHRcdGlmICgodmFsaWRNaW1lVHlwZXMgPT09ICh2b2lkIDApIHx8IHZhbGlkTWltZVR5cGVzID09PSAnJykgfHwgdmFsaWRNaW1lVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiRmlsZSBtdXN0IGJlIG9uZSBvZiBmb2xsb3dpbmcgdHlwZXMgXCIgKyB2YWxpZE1pbWVUeXBlcywgJ0ludmFsaWQgZmlsZSB0eXBlIScpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdvdmVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ2VudGVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmJpbmQoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSwgbmFtZSwgcmVhZGVyLCBzaXplLCB0eXBlO1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tTaXplKHNpemUpICYmIGlzVHlwZVZhbGlkKHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhzY29wZS5maWxlTmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5maWxlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG5cdFx0XHRcdFx0LypuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsqL1xuXHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0ZpbGVEcm9wem9uZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSGlzdG9yeUN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpe1xuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLnNldERhdGEgPSBzZXREYXRhO1xuXHRcdGFjdGl2YXRlKCk7XG5cdFxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3InLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHQvL3JlcXVpcmU6ICdpdGVtJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMsIGl0ZW1Nb2RlbCApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQvKnNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbU1vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyLCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBbXTtcblx0XHR2bS5kYXRhcHJvdmlkZXJzID0gW107XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gbnVsbDtcblx0XHR2bS5zZWFyY2hUZXh0ID0gbnVsbDtcblx0XHR2bS5zZWFyY2hVbml0ID0gbnVsbDtcblx0XHR2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuXHRcdHZtLnF1ZXJ5VW5pdCA9IHF1ZXJ5VW5pdDtcblxuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uY3JlYXRlUHJvdmlkZXIgPSBjcmVhdGVQcm92aWRlcjtcblx0XHR2bS5jcmVhdGVVbml0ID0gY3JlYXRlVW5pdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHF1ZXJ5VW5pdChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5tZWFzdXJlVHlwZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uZGF0YXByb3ZpZGVycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YXByb3ZpZGVycycpLiRvYmplY3Q7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5tZWFzdXJlVHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lYXN1cmVfdHlwZXMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnKS4kb2JqZWN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50eXBlICYmIHZtLml0ZW0uZGF0YXByb3ZpZGVyICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbCgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gY2hlY2tCYXNlKCkgJiYgdm0uaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZSgpe1xuXHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogSVRTIEEgSEFDSyBUTyBHRVQgSVQgV09SSzogbmctY2xpY2sgdnMgbmctbW91c2Vkb3duXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUHJvdmlkZXIodGV4dCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkUHJvdmlkZXInLCAkc2NvcGUpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVVbml0KHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFVuaXQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdCAgICB2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdCAgfVxuXHRcdH0sdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9PycsXG5cdFx0XHRcdGluZGljYXRvcnM6ICc9aXRlbXMnLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RBbGxHcm91cCA9IHNlbGVjdEFsbEdyb3VwO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcblxuXHRcdHZtLmZpbHRlciA9IHtcblx0XHRcdHNvcnQ6J3RpdGxlJyxcblx0XHRcdHJldmVyc2U6ZmFsc2UsXG5cdFx0XHRsaXN0OiAwLFxuXHRcdFx0cHVibGlzaGVkOiBmYWxzZSxcblx0XHRcdHR5cGVzOiB7XG5cdFx0XHRcdHRpdGxlOiB0cnVlLFxuXHRcdFx0XHRzdHlsZTogZmFsc2UsXG5cdFx0XHRcdGNhdGVnb3JpZXM6IGZhbHNlLFxuXHRcdFx0XHRpbmZvZ3JhcGhpYzogZmFsc2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBmYWxzZSxcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLnNlYXJjaCA9IHtcblx0XHRcdHF1ZXJ5OiAnJyxcblx0XHRcdHNob3c6IGZhbHNlXG5cdFx0fTtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXHRcdHZtLnRvZ2dsZUxpc3QgPSB0b2dnbGVMaXN0O1xuXG5cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUxpc3Qoa2V5KXtcblx0XHRcdGlmKHZtLnZpc2libGVMaXN0ID09IGtleSl7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS52aXNpYmxlTGlzdCA9IGtleTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09IC0xKXtcblx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pIHtcblx0XHRcdHZhciBpbmRleCA9IHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pO1xuXHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RBbGxHcm91cChncm91cCl7XG5cdFx0XHRpZih2bS5zZWxlY3Rpb24ubGVuZ3RoKXtcblx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cCwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG5cdFx0XHQkbWRPcGVuTWVudShldik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLnJlbW92ZSgnaW5kaWNhdG9ycycsIGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHR2bS5pbmRpY2F0b3JzLnNwbGljZSh2bS5pbmRpY2F0b3JzLmluZGV4T2YoaXRlbSksMSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Lyokc2NvcGUuJHdhdGNoKCd2bS5zZWFyY2gucXVlcnknLCBmdW5jdGlvbiAocXVlcnksIG9sZFF1ZXJ5KSB7XG5cdFx0XHRpZihxdWVyeSA9PT0gb2xkUXVlcnkpIHJldHVybiBmYWxzZTtcblx0XHRcdHZtLnF1ZXJ5ID0gdm0uZmlsdGVyLnR5cGVzO1xuXHRcdFx0dm0ucXVlcnkucSA9IHF1ZXJ5O1xuXHRcdFx0dm0uaXRlbXMgPSBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnModm0ucXVlcnkpO1xuXHRcdH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yTWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0aXRlbTogJz1pdGVtJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2luZGljYXRvck1lbnUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yTWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGNsID0gJ2FjdGl2ZSc7XG5cdFx0XHRcdHZhciBlbCA9IGVsZW1lbnRbMF07XG5cdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuXHRcdFx0XHRwYXJlbnQub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKGNsKTtcblx0XHRcdFx0fSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKGNsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvck1lbnVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmxvY2tlZCA9IGxvY2tlZDtcblx0XHR2bS5jaGFuZ2VPZmZpY2lhbCA9IGNoYW5nZU9mZmljaWFsO1xuXG5cdFx0ZnVuY3Rpb24gbG9ja2VkKCl7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5pc19vZmZpY2lhbCA/ICdsb2NrX29wZW4nIDogJ2xvY2snO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGFuZ2VPZmZpY2lhbCgpe1xuXHRcdFx0dm0uaXRlbS5pc19vZmZpY2lhbCA9ICF2bS5pdGVtLmlzX29mZmljaWFsO1xuXHRcdFx0dm0uaXRlbS5zYXZlKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZShpdGVtKXtcblx0XHRcdGlmIChpdGVtLnRpdGxlICYmIGl0ZW0ubWVhc3VyZV90eXBlX2lkICYmIGl0ZW0uZGF0YXByb3ZpZGVyICYmIGl0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpemVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaXplcy9pbmRpemVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGl6ZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGl6ZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cdFx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0XHR2bS5iYXNlT3B0aW9ucyA9IHtcblx0XHRcdGRyYWc6dHJ1ZSxcblx0XHRcdGFsbG93RHJvcDp0cnVlLFxuXHRcdFx0YWxsb3dEcmFnOnRydWUsXG5cdFx0XHRhbGxvd01vdmU6dHJ1ZSxcblx0XHRcdGFsbG93U2F2ZTp0cnVlLFxuXHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdGFsbG93QWRkQ29udGFpbmVyOnRydWUsXG5cdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0ZWRpdGFibGU6dHJ1ZSxcblx0XHRcdGFzc2lnbWVudHM6IHRydWUsXG5cdFx0XHRzYXZlQ2xpY2s6IHNhdmUsXG5cdFx0XHRhZGRDbGljazogdm0ub3B0aW9ucy5pbmRpemVzLmFkZENsaWNrLFxuXHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDb250YWluZXJDbGljayxcblx0XHRcdGRlbGV0ZURyb3A6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVEcm9wLFxuXHRcdFx0ZGVsZXRlQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVDbGlja1xuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmNhdGVnb3JpZXMgPSBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHt0cmVlOnRydWV9KTtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC90eXBlcycpLiRvYmplY3Q7XG5cblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLml0ZW1fdHlwZV9pZCA9IDE7XG5cdFx0XHRcdHZtLml0ZW0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLml0ZW1fdHlwZV9pZCAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UudXBkYXRlSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6dm0uaXRlbS5pZCxuYW1lOnJlc3BvbnNlLm5hbWV9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLml0ZW0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdEYXRhIHN1Y2Nlc3NmdWxseSBzYXZlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UuYWRkSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6cmVzcG9uc2UuaWQsIG5hbWU6cmVzcG9uc2UubmFtZX0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW1zKGV2ZW50LCBpdGVtKXtcblx0XHQvL1x0Y29uc29sZS5sb2codm0uaXRlbSwgaXRlbSk7XG5cblx0XHR9XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uaXRlbScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiAhPSBvKSB7XG5cdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9ICFhbmd1bGFyLmVxdWFscyh2bS5pdGVtLCB2bS5vcmlnaW5hbCk7XG5cdFx0XHR9XG5cdFx0fSx0cnVlKTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHR2YXIgbWF4ID0gMCwgbWluID0gMDtcblx0XHRcdFx0b3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsICRzY29wZS5vcHRpb25zKTtcblxuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0bWluID0gZDMubWluKFttaW4sIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oW21pbiwgbWF4XSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblxuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChtaW4pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgJ2xvd2VyVmFsdWUnKTtcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0XHRpZihtYXggPiAxMDAwKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludChtYXgpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiIDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWF4XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsICd1cHBlclZhbHVlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHNsaWRlciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKTtcblx0XHRcdFx0aWYob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKXtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHQuYXR0cigneDEnLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICdyZ2JhKDAsMCwwLDg3KScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVDb250ID0gc2xpZGVyLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMuaGVpZ2h0IC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgb3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihwYXJzZUludCh2YWx1ZSkgPiAxMDAwKXtcblx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KHZhbHVlKSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgbWF4KTtcblxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG4uY29sb3I7XG5cdFx0XHRcdFx0Z3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkK1wiX1wiK24uY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWN0LnN0eWxlKCdmaWxsJywgJ3VybCgjJyArIG9wdGlvbnMuZmllbGQgKyAnXycrbi5jb2xvcisnKScpO1xuXHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdGlmKG5nTW9kZWwuJG1vZGVsVmFsdWUpe1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQoMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KDApKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgoMCkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHRcdG1pbiA9IDA7XG5cdFx0XHRcdFx0XHRtYXggPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRcdFx0bWluID0gZDMubWluKFttaW4sIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRcdFx0aWYobmF0LmlzbyA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlLmlzbyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5hdFtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXHRcdFx0XHRcdFx0YnJ1c2gueCh4KVxuXHRcdFx0XHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXHRcdFx0XHRcdFx0bGVnZW5kLnNlbGVjdCgnI2xvd2VyVmFsdWUnKS50ZXh0KG1pbik7XG5cdFx0XHRcdFx0XHRsZWdlbmQyLnNlbGVjdCgnI3VwcGVyVmFsdWUnKS50ZXh0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8vVERPRE86IENIY2tpY2sgaWYgbm8gY29tbWEgdGhlcmVcblx0XHRcdFx0XHRcdFx0aWYobWF4ID4gMTAwMCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1heFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRpZihuYXQuaXNvID09IG5nTW9kZWwuJG1vZGVsVmFsdWUuaXNvKXtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdNZWRpYW5DdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L3BhcnNlQ29uZmxpY3RDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdENzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0bmF0aW9uczogJz0nLFxuXHRcdFx0XHRzdW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0c2NvcGUubmF0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbnVtYmVycyA9IHJvdy5kYXRhWzBdLmNvbmZsaWN0cy5tYXRjaCgvWzAtOV0rL2cpLm1hcChmdW5jdGlvbihuKVxuXHRcdFx0XHRcdFx0XHRcdHsvL2p1c3QgY29lcmNlIHRvIG51bWJlcnNcblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuICsobik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0uZXZlbnRzID0gbnVtYmVycztcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5zdW0gKz0gbnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUubmF0aW9ucy5wdXNoKHJvdy5kYXRhWzBdKTtcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RFdmVudHNDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L3BhcnNlQ29uZmxpY3RFdmVudHNDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZXZlbnRzOiAnPScsXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cdHNjb3BlLmV2ZW50cyA9IFtdO1xuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHJvdy5kYXRhWzBdLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2ludGVyc3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnRyYXN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnc3Vic3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMztcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5lcnJvcnMubGVuZ3RoID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcGUuZXZlbnRzLnB1c2gocm93LmRhdGFbMF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocm93KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3BhcnNlY3N2JywgZnVuY3Rpb24gKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgSW5kZXhTZXJ2aWNlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2Vjc3ZDdHJsJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFBhcGEpO1xuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vd29ya2VyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHQvL0lGIFwic3RlcFwiIGluc3RlYWQgb2YgXCJjaHVua1wiID4gY2h1bmsgPSByb3cgYW5kIGNodW5rLmRhdGEgPSByb3cuZGF0YVswXVxuXHRcdFx0XHRcdFx0XHRjaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNodW5rLmRhdGEsIGZ1bmN0aW9uIChyb3csIGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOnt9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6W11cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIC8qfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBrZXksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ci5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5Lmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJhd0xpc3Rba2V5XS5kYXRhID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCI6IHIgPiByb3cuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHIuZGF0YSA9IHJvdztcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YShyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvL0NoZWNrIGlmIHRoZXJlIGFyZSBwb2ludHMgaW4gdGhlIGhlYWRlcnNcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBjaHVuay5tYXRjaCgvXFxyXFxufFxccnxcXG4vKS5pbmRleDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGVsaW1pdGVyID0gJywnO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoJywnKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPCAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoXCJcXHRcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxpbWl0ZXIgPSAnXFx0Jztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlzSXNvID0gW107XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0ucmVwbGFjZSgvW15hLXowLTldL2dpLCAnXycpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0uc3Vic3RyKDAsIGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWQgPSBoZWFkaW5nc1tpXS5zcGxpdCgnXycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSAnJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGhlYWQubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihoZWFkW2pdKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaiA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSArPSAnXyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gaGVhZFtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0ubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0lzby5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPT0gaXNJc28ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtoZWFkaW5nc1tpXV0gPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBoZWFkaW5ncy5qb2luKGRlbGltaXRlcikgKyBjaHVuay5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKGVyciwgZmlsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKHJlc3VsdHMpIHtcblxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRFcnJvcnMoZXJyb3JzKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goSW5kZXhTZXJ2aWNlLmdldEZpcnN0RW50cnkoKS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0Q291bnRyeUZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3llYXInKSAhPSAtMSAmJiBpdGVtLnRvU3RyaW5nKCkubGVuZ3RoID09IDQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0WWVhckZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2dlbmRlcicpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3NleCcpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEdlbmRlckZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmF3TGlzdCwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS50b0xvd2VyQ2FzZSgpICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGtleSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc286IGtleS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoY29sdW1uLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyWydjb2x1bW5fJyArIGldID0gY29sdW1uO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGNvbHVtbikgfHwgY29sdW1uIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIk5BXCIgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbcl0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6IGl0ZW0uZXJyb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKCdpc28nKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5pbmZvKEluZGV4U2VydmljZS5nZXREYXRhU2l6ZSgpICsgJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZWNzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwaWVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BpZWNoYXJ0Q3RybCcsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6ICc9Y2hhcnREYXRhJyxcblx0XHRcdFx0YWN0aXZlVHlwZTogJz0nLFxuXHRcdFx0XHRhY3RpdmVDb25mbGljdDogJz0nLFxuXHRcdFx0XHRjbGlja0l0OicmJ1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0IGZ1bmN0aW9uIHNlZ0NvbG9yKGMpeyByZXR1cm4ge2ludGVyc3RhdGU6XCIjODA3ZGJhXCIsIGludHJhc3RhdGU6XCIjZTA4MjE0XCIsc3Vic3RhdGU6XCIjNDFhYjVkXCJ9W2NdOyB9XG5cblx0XHRcdFx0dmFyIHBDID17fSwgcGllRGltID17dzoxNTAsIGg6IDE1MH07XG4gICAgICAgIHBpZURpbS5yID0gTWF0aC5taW4ocGllRGltLncsIHBpZURpbS5oKSAvIDI7XG5cblx0XHRcdFx0dmFyIHBpZXN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGllRGltLncpXG5cdFx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdvdXRlci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cdFx0XHRcdHZhciBwaWVzdmcyID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwaWVEaW0udylcblx0XHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIHBpZURpbS5oKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2lubmVyLXBpZScpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrcGllRGltLncvMitcIixcIitwaWVEaW0uaC8yK1wiKVwiKTtcblxuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gZHJhdyB0aGUgYXJjcyBvZiB0aGUgcGllIHNsaWNlcy5cbiAgICAgICAgdmFyIGFyYyA9IGQzLnN2Z1xuXHRcdFx0XHRcdC5hcmMoKVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhwaWVEaW0uciAtIDEwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhwaWVEaW0uciAtIDIzKTtcbiAgICAgICAgdmFyIGFyYzIgPSBkMy5zdmdcblx0XHRcdFx0XHQuYXJjKClcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMocGllRGltLnIgLSAyMylcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgcGllIHNsaWNlIGFuZ2xlcy5cbiAgICAgICAgdmFyIHBpZSA9IGQzLmxheW91dFxuXHRcdFx0XHRcdC5waWUoKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuY291bnQ7IH0pO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBjMSA9IHBpZXN2Z1xuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpLmF0dHIoXCJkXCIsIGFyYylcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLG1vdXNlb3Zlcikub24oXCJtb3VzZW91dFwiLG1vdXNlb3V0KTtcblx0XHRcdFx0dmFyIGMyID0gcGllc3ZnMlxuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjMilcblx0XHQgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG5cdFx0ICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXHRcdCAgICAgICAgLm9uKCdjbGljaycsIG1vdXNlY2xpY2spO1xuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gdXBkYXRlIHBpZS1jaGFydC4gVGhpcyB3aWxsIGJlIHVzZWQgYnkgaGlzdG9ncmFtLlxuICAgICAgICBwQy51cGRhdGUgPSBmdW5jdGlvbihuRCl7XG4gICAgICAgICAgICBwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuRCkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFV0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3ZlciBhIHBpZSBzbGljZS5cblx0XHRcdFx0dmFyIHR5cGV1cyA9IGFuZ3VsYXIuY29weShzY29wZS5hY3RpdmVUeXBlKTtcblx0XHRcdFx0ZnVuY3Rpb24gbW91c2VjbGljayhkKXtcblx0XHRcdFx0XHRzY29wZS5jbGlja0l0KHt0eXBlX2lkOmQuZGF0YS50eXBlX2lkfSk7XG5cdFx0XHRcdH1cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdmVyKGQpe1xuICAgICAgICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIG9mIGhpc3RvZ3JhbSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0XHRcdFx0dHlwZXVzID0gYW5ndWxhci5jb3B5KHNjb3BlLmFjdGl2ZVR5cGUpO1xuICAgICAgICAgICAgc2NvcGUuYWN0aXZlVHlwZSA9IFtkLmRhdGEudHlwZV9pZF07XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvL1V0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3V0IGEgcGllIHNsaWNlLlxuICAgICAgICBmdW5jdGlvbiBtb3VzZW91dChkKXtcbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBvZiBoaXN0b2dyYW0gd2l0aCBhbGwgZGF0YS5cbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZVR5cGUgPSB0eXBldXM7XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbmltYXRpbmcgdGhlIHBpZS1zbGljZSByZXF1aXJpbmcgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggc3BlY2lmaWVzXG4gICAgICAgIC8vIGhvdyB0aGUgaW50ZXJtZWRpYXRlIHBhdGhzIHNob3VsZCBiZSBkcmF3bi5cbiAgICAgICAgZnVuY3Rpb24gYXJjVHdlZW4oYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYyhpKHQpKTsgICAgfTtcbiAgICAgICAgfVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbjIoYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYzIoaSh0KSk7ICAgIH07XG4gICAgICAgIH1cblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0cGllc3ZnLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKTtcblx0XHRcdFx0XHRwaWVzdmcyLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuMik7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGllY2hhcnRDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3JvdW5kYmFyJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdSb3VuZGJhckN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuXHRcdFx0XHR2YXIgbWFyZ2luID0ge1xuXHRcdFx0XHRcdFx0dG9wOiA0MCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdGJvdHRvbTogMzAsXG5cdFx0XHRcdFx0XHRsZWZ0OiA0MFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0d2lkdGggPSAzMDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcblx0XHRcdFx0XHRoZWlnaHQgPSAyMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcblx0XHRcdFx0XHRiYXJXaWR0aCA9IDIwLFxuXHRcdFx0XHRcdHNwYWNlID0gMjU7XG5cblxuXHRcdFx0XHR2YXIgc2NhbGUgPSB7XG5cdFx0XHRcdFx0eTogZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0fTtcblx0XHRcdFx0c2NhbGUueS5kb21haW4oWzAsIDIyMF0pO1xuXHRcdFx0XHRzY2FsZS55LnJhbmdlKFtoZWlnaHQsIDBdKTtcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcblxuXHRcdFx0XHQvL3guZG9tYWluKHNjb3BlLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGV0dGVyOyB9KSk7XG5cdFx0XHRcdC8veS5kb21haW4oWzAsIGQzLm1heChzY29wZS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZyZXF1ZW5jeTsgfSldKTtcblx0XHRcdFx0dmFyIGJhcnMgPSBzdmcuc2VsZWN0QWxsKCcuYmFycycpLmRhdGEoc2NvcGUuZGF0YSkuZW50ZXIoKS5hcHBlbmQoXCJnXCIpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTsgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGkgKiAyMCArIFwiLCAwKVwiOyB9KTs7XG5cblx0XHRcdFx0dmFyIGJhcnNCZyA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAwLCBiYXJXaWR0aCwgKGhlaWdodCksIGJhcldpZHRoIC8gMiwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2JnJyk7XG5cdFx0XHRcdHZhciB2YWx1ZUJhcnMgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8qLmF0dHIoJ3gnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNjYWxlLnkoZC52YWx1ZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pKi9cblxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi50cmFuc2l0aW9uKClcblx0XHRcdFx0XHQuZHVyYXRpb24oMzAwMClcblx0XHRcdFx0XHQuZWFzZShcInF1YWRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVpZ2h0IC0gc2NhbGUueShkLnZhbHVlKVxuXHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0O1xuXG5cdFx0XHRcdHZhciB2YWx1ZVRleHQgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZChcInRleHRcIik7XG5cblx0XHRcdFx0dmFsdWVUZXh0LnRleHQoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQudmFsdWVcblx0XHRcdFx0XHR9KS5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAtOClcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywnIzRmYjBlNScpO1xuXG5cdFx0XHRcdHZhciBsYWJlbHNUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdGxhYmVsc1RleHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmxhYmVsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgaGVpZ2h0ICsgMjApXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3Jcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdGZ1bmN0aW9uIHJvdW5kZWRfcmVjdCh4LCB5LCB3LCBoLCByLCB0bCwgdHIsIGJsLCBicikge1xuXHRcdFx0XHRcdHZhciByZXR2YWw7XG5cdFx0XHRcdFx0cmV0dmFsID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5O1xuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICh3IC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmICh0cikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIChoIC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmIChicikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKDIgKiByIC0gdyk7XG5cdFx0XHRcdFx0aWYgKGJsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArICgyICogciAtIGgpO1xuXHRcdFx0XHRcdGlmICh0bCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwielwiO1xuXHRcdFx0XHRcdHJldHVybiByZXR2YWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vc2NhbGUueS5kb21haW4oWzAsIDUwXSk7XG5cblx0XHRcdFx0XHRcdHZhbHVlQmFycy50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBib3JkZXJzID0gYmFyV2lkdGggLyAyO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHNjb3BlLmRhdGFbaV0udmFsdWUgPD0gMTApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVycyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAoc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJhcldpZHRoLCAoaGVpZ2h0IC0gc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJvcmRlcnMsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dmFsdWVUZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQsaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZC52YWx1ZSksIHBhcnNlSW50KHNjb3BlLmRhdGFbaV0udmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9KS5lYWNoKCdlbmQnLCBmdW5jdGlvbihkLCBpKXtcblx0XHRcdFx0XHRcdFx0XHRkLnZhbHVlID0gc2NvcGUuZGF0YVtpXS52YWx1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdSb3VuZGJhckN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW52ZXJ0OmZhbHNlXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZtLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCB2bS5vcHRpb25zKTtcblx0XHR2bS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IHRydWUsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHRcdH07XG5cdFx0dm0uY2hhcnQgPSB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdGNoYXJ0OiB7fVxuXHRcdFx0fSxcblx0XHRcdGRhdGE6IFtdXG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0Y2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdHNldENoYXJ0KCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KCl7XG5cdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFt2bS5yYW5nZS5tYXgsIHZtLnJhbmdlLm1pbl07XG5cdFx0fVxuXHQgXHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRkdXJhdGlvbjoxMDAsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0fSxcblx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNob3dMZWdlbmQ6IGZhbHNlLFxuXHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0Ly9zaG93WUF4aXM6IGZhbHNlLFxuXG5cdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHQvL3VzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRmb3JjZVk6IFt2bS5yYW5nZS5tYXgsIHZtLnJhbmdlLm1pbl0sXG5cdFx0XHRcdC8veURvbWFpbjpbcGFyc2VJbnQodm0ucmFuZ2UubWluKSwgdm0ucmFuZ2UubWF4XSxcblx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICdZZWFyJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdGludGVycG9sYXRlOiAnY2FyZGluYWwnXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHZtLm9wdGlvbnMuaW52ZXJ0ID09IHRydWUpIHtcblx0XHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC5mb3JjZVkgPSBbcGFyc2VJbnQodm0ucmFuZ2UubWF4KSwgdm0ucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKHZtLmNoYXJ0KVxuXHRcdFx0cmV0dXJuIHZtLmNoYXJ0O1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdHZtLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0aWQ6IGtleSxcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWF4ID0gTWF0aC5tYXgodm0ucmFuZ2UubWF4LCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0XHR2bS5yYW5nZS5taW4gPSBNYXRoLm1pbih2bS5yYW5nZS5taW4sIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5yYW5nZS5tYXgrKztcblx0XHRcdHZtLnJhbmdlLm1pbi0tO1xuXHRcdFx0dm0uY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICh2bS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIikge1xuXHRcdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQodm0ucmFuZ2UubWF4KSwgdm0ucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0dXBkYXRlQ2hhcnQoKTtcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLnNlbGVjdGlvbicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0Ly9cdHVwZGF0ZUNoYXJ0KCk7XG5cdFx0XHQvL2NhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlcycsIFsnJGFuaW1hdGVDc3MnLCBmdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuXG5cdFx0dmFyIGxhc3RJZCA9IDA7XG4gICAgICAgIHZhciBfY2FjaGUgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRJZChlbCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIik7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgaWQgPSArK2xhc3RJZDtcbiAgICAgICAgICAgICAgICBlbFswXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoaWQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IF9jYWNoZVtpZF07XG4gICAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICBfY2FjaGVbaWRdID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVJ1bm5lcihjbG9zaW5nLCBzdGF0ZSwgYW5pbWF0b3IsIGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSBhbmltYXRvcjtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBkb25lRm47XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RhcnQoKS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2luZyAmJiBzdGF0ZS5kb25lRm4gPT09IGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnU2xpZGVUb2dnbGVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3N0eWxlcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdHlsZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdHN0eWxlczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3R5bGVzQ3RybCcsIGZ1bmN0aW9uICh0b2FzdHIsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnRvZ2dsZVN0eWxlID0gdG9nZ2xlU3R5bGU7XG5cdFx0dm0uc2VsZWN0ZWRTdHlsZSA9IHNlbGVjdGVkU3R5bGU7XG5cdFx0dm0uc2F2ZVN0eWxlID0gc2F2ZVN0eWxlO1xuXHRcdHZtLnN0eWxlID0gW107XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTdHlsZShzdHlsZSkge1xuXHRcdFx0aWYgKHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQpIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlX2lkID0gc3R5bGUuaWRcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RlZFN0eWxlKGl0ZW0sIHN0eWxlKSB7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZVN0eWxlKCkge1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnc3R5bGVzJywgdm0uc3R5bGUpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uc3R5bGVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdHZtLmNyZWF0ZVN0eWxlID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0uc3R5bGUgPSBbXTtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IGRhdGE7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgU3R5bGUgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdWJpbmRleEN0cmwnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4Lmh0bWwnLFxuXHRcdFx0bGluazogc3ViaW5kZXhMaW5rRnVuY3Rpb25cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3ViaW5kZXhMaW5rRnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0KSB7XG5cdFx0JHNjb3BlLmluZm8gPSBmYWxzZTtcblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBzZXRDaGFydDtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBjYWxjdWxhdGVHcmFwaDtcblx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlciA9IGNyZWF0ZUluZGV4ZXI7XG5cdFx0JHNjb3BlLmNhbGNTdWJSYW5rID0gY2FsY1N1YlJhbms7XG5cdFx0JHNjb3BlLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdCRzY29wZS5jcmVhdGVPcHRpb25zID0gY3JlYXRlT3B0aW9ucztcblx0XHQkc2NvcGUuZ2V0U3ViUmFuayA9IGdldFN1YlJhbms7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obmV3SXRlbSwgb2xkSXRlbSkge1xuXHRcdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2N1cnJlbnQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdCRzY29wZS5pbmZvID0gISRzY29wZS5pbmZvO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjYWxjU3ViUmFuaygpIHtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdID0gcGFyc2VGbG9hdChpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlSW50KGl0ZW1bJ3Njb3JlJ10pO1xuXHRcdFx0fSlcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpbHRlcltpXS5pc28gPT0gJHNjb3BlLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0cmFuayA9IGkgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY3VycmVudFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKydfcmFuayddID0gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0U3ViUmFuayhjb3VudHJ5KXtcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGZpbHRlciwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0aWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG5cdFx0XHRcdFx0cmFuayA9IGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmFuaysxO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVJbmRleGVyKCkge1xuXHRcdFx0JHNjb3BlLmluZGV4ZXIgPSBbJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5kYXRhXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVPcHRpb25zKCkge1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnMgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoxMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnNCaWcgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoyMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0Ly9oZWlnaHQ6IDIwMCxcblx0XHRcdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHg6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0XHRib3R0b206IDMwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY291bnRyeS5lcGksIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBkYXRhLnllYXIsXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uY29sdW1uX25hbWVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1bmJ1cnN0JywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0IG1vZGU6ICdzaXplJ1xuXHRcdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1bmJ1cnN0Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdHZhciB3aWR0aCA9IDYxMCxcblx0XHRcdFx0XHRoZWlnaHQgPSB3aWR0aCxcblx0XHRcdFx0XHRyYWRpdXMgPSAod2lkdGgpIC8gMixcblx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzAsIDIgKiBNYXRoLlBJXSksXG5cdFx0XHRcdFx0eSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAxXSkucmFuZ2UoWzAsIHJhZGl1c10pLFxuXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIik7O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsaWNrKGQpIHtcblx0XHRcdFx0XHQvLyBDb250cm9sIGFyYyB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0cGF0aC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKGQpKTtcblxuXHRcdFx0XHRcdC8vIFNvbWV3aGF0IG9mIGEgaGFjayBhcyB3ZSByZWx5IG9uIGFyY1R3ZWVuIHVwZGF0aW5nIHRoZSBzY2FsZXMuXG5cdFx0XHRcdFx0Ly8gQ29udHJvbCB0aGUgdGV4dCB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0dGV4dC5zdHlsZShcInZpc2liaWxpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyAxIDogMWUtNjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuZWFjaChcImVuZFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0ZnVuY3Rpb24gaXNQYXJlbnRPZihwLCBjKSB7XG5cdFx0XHRcdFx0aWYgKHAgPT09IGMpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGlmIChwLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcC5jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHNldENvbG9yKGQpIHtcblxuXHRcdFx0XHRcdC8vcmV0dXJuIDtcblx0XHRcdFx0XHRpZiAoZC5jb2xvcilcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuICcjY2NjJztcblx0XHRcdFx0XHRcdC8qdmFyIHRpbnREZWNheSA9IDAuMjA7XG5cdFx0XHRcdFx0XHQvLyBGaW5kIGNoaWxkIG51bWJlclxuXHRcdFx0XHRcdFx0dmFyIHggPSAwO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGQucGFyZW50LmNoaWxkcmVuW3hdICE9IGQpXG5cdFx0XHRcdFx0XHRcdHgrKztcblx0XHRcdFx0XHRcdHZhciB0aW50Q2hhbmdlID0gKHRpbnREZWNheSAqICh4ICsgMSkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHVzaGVyLmNvbG9yKGQucGFyZW50LmNvbG9yKS50aW50KHRpbnRDaGFuZ2UpLmh0bWwoJ2hleDYnKTsqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEudGl0bGUsXG5cdFx0XHRcdFwiY29sb3JcIjogJHNjb3BlLmRhdGEuc3R5bGUuYmFzZV9jb2xvciB8fCAnIzAwMCcsXG5cdFx0XHRcdFwiY2hpbGRyZW5cIjogYnVpbGRUcmVlKCRzY29wZS5kYXRhLmNoaWxkcmVuKSxcblx0XHRcdFx0XCJzaXplXCI6IDFcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICd0cmVlbWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWVtZW51L3RyZWVtZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWVtZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGl0ZW06Jz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1RyZWVtZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cblx0fSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZXZpZXcnLCBmdW5jdGlvbihSZWN1cnNpb25IZWxwZXIpIHtcblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdGVkaXRXZWlnaHQ6ZmFsc2UsXG5cdFx0XHRkcmFnOiBmYWxzZSxcblx0XHRcdGVkaXQ6IGZhbHNlLFxuXHRcdFx0Y2hpbGRyZW46J2NoaWxkcmVuJ1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnVHJlZXZpZXdDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPT8nLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nLFxuXHRcdFx0XHRjbGljazogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Y29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlY3Vyc2lvbkhlbHBlci5jb21waWxlKGVsZW1lbnQsIGZ1bmN0aW9uKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlRm4pe1xuXHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsIHNjb3BlLnZtLm9wdGlvbnMpXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmaW5lIHlvdXIgbm9ybWFsIGxpbmsgZnVuY3Rpb24gaGVyZS5cbiAgICAgICAgICAgICAgICAvLyBBbHRlcm5hdGl2ZTogaW5zdGVhZCBvZiBwYXNzaW5nIGEgZnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgLy8geW91IGNhbiBhbHNvIHBhc3MgYW4gb2JqZWN0IHdpdGhcbiAgICAgICAgICAgICAgICAvLyBhICdwcmUnLSBhbmQgJ3Bvc3QnLWxpbmsgZnVuY3Rpb24uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUcmVldmlld0N0cmwnLCBmdW5jdGlvbigkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS5jaGlsZFNlbGVjdGVkID0gY2hpbGRTZWxlY3RlZDtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0ub25EcmFnT3ZlciA9IG9uRHJhZ092ZXI7XG5cdFx0dm0ub25Ecm9wQ29tcGxldGUgPSBvbkRyb3BDb21wbGV0ZTtcblx0XHR2bS5vbk1vdmVkQ29tcGxldGUgPSBvbk1vdmVkQ29tcGxldGU7XG5cdFx0dm0uYWRkQ2hpbGRyZW4gPSBhZGRDaGlsZHJlbjtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLnNlbGVjdGlvbiA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25EcmFnT3ZlcihldmVudCwgaW5kZXgsIGV4dGVybmFsLCB0eXBlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbkRyb3BDb21wbGV0ZShldmVudCwgaW5kZXgsIGl0ZW0sIGV4dGVybmFsKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSAwKXtcblx0XHRcdFx0XHR2bS5pdGVtcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uTW92ZWRDb21wbGV0ZShpbmRleCwgZGF0YSwgZXZ0KSB7XG5cdFx0XHRpZih2bS5vcHRpb25zLmFsbG93TW92ZSl7XG5cdFx0XHRcdHJldHVybiB2bS5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKHNlbGVjdGVkLCBpKXtcblx0XHRcdFx0aWYoc2VsZWN0ZWQuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmKGluZGV4ID4gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHZtLm9wdGlvbnMuc2VsZWN0aW9uQ2hhbmdlZCA9PSAnZnVuY3Rpb24nIClcblx0XHRcdFx0dm0ub3B0aW9ucy5zZWxlY3Rpb25DaGFuZ2VkKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENoaWxkcmVuKGl0ZW0pIHtcblxuXHRcdFx0aXRlbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0aXRlbS5leHBhbmRlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oc2VsZWN0ZWQpe1xuXHRcdFx0XHRpZihzZWxlY3RlZC5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdC8qXHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihhbmd1bGFyLmNvcHkoaXRlbSkpID4gLTEpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTsqL1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoaWxkU2VsZWN0ZWQoaXRlbSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihjaGlsZCk+IC0xKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWZvdW5kKXtcblx0XHRcdFx0XHRmb3VuZCA9ICBjaGlsZFNlbGVjdGVkKGNoaWxkKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikgdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID0gW107XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZSxcblx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0sIGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pZCA9PSBpdGVtLmlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5wdXNoKGl0ZW0pIDogdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fSovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbS53ZWlnaHQgPT0gXCJ1bmRlZmluZWRcIiB8fCAhdm0uaXRlbS53ZWlnaHQpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA+PSA5NSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ICs9IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG93ZXJXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA8PSA1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpIC0gNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0IC09IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
