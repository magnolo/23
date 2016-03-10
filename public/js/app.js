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
				url: '/indicator/:id/:name',
				resolve: {
					indicator: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.fetchIndicator($stateParams.id);
					}]
				},
				views: {
					'sidebar@': {
						templateUrl: getView('indicator'),
						controller: 'IndicatorShowCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.indicator.year', {
				url: '/:year',
			})
			.state('app.index.indicator.year.info', {
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
				cache: true
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
				return this.content.indices = DataService.getAll('me/indizes').$object;
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
			getIndicatorData: function(id, year) {
				if (year) {
					return this.content.data = DataService.getAll('indicators/' + id + '/data/' + year);
				}
				return this.content.data = DataService.getAll('indicators/' + id + '/data');
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
                  year_field:''
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
			'subnational_predominace',
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
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
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


        console.log(vm.indicator);
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

	angular.module('app.controllers').controller('IndicatorShowCtrl', ["$scope", "$state", "$filter", "$timeout", "indicator", "countries", "ContentService", "VectorlayerService", "toastr", function($scope, $state, $filter,$timeout, indicator, countries, ContentService, VectorlayerService, toastr) {
		//
		var vm = this;
		vm.current = null;
		vm.active = null;
		vm.countryList = countries;
		vm.indicator = indicator;
		vm.data = [];
		vm.range = {
			max:-100000,
			min:100000
		};
		vm.getData = getData;
		vm.setCurrent = setCurrent;
		vm.getOffset = getOffset;
		vm.getRank = getRank;
		vm.goInfoState = goInfoState;
		activate();

		function activate(){
			VectorlayerService.setStyle(countriesStyle);
			VectorlayerService.countryClick(countryClick);
			$timeout(function(){
				if($state.params.year){
					for(var i = 0; i < vm.indicator.years.length; i++){
						if(vm.indicator.years[i].year == $state.params.year){
							vm.active =  i;
						}
					}
				}
				else if(!vm.active){
					vm.active = 0;
				}
			});


		}

		function setState(iso) {
			$timeout(function(){
				//console.log(VectorlayerService.getNationByIso(iso));
				//vm.current = VectorlayerService.getNationByIso(iso);
			})
		};
		function goInfoState(){
			if($state.current.name == 'app.index.indicator.year'){
					$state.go('app.index.indicator.year.info',{year:vm.year});
			}
			else{
				$state.go('app.index.indicator.year',{id:vm.indicator.id, name:vm.indicator.name, year:vm.year});
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

			/*	$timeout(function() {
					VectorlayerService.getLayer().layers[VectorlayerService.getName()+'_geom'].features[vm.current.iso].selected = true;
				});*/
				/*if($state.current.name == 'app.index.indicator.year'){
					$state.go('app.index.indicator.year.country',{ iso:vm.current.iso})
				}
				else if($state.current.name == 'app.index.indicator.year.info'){
					$state.go('app.index.indicator.year.info.country',{ iso:vm.current.iso})
				}
				else{
					$state.go($state.current.name,{ iso:vm.current.iso})
				}*/

		};
		function countryClick(evt,t){
			var c = VectorlayerService.getNationByIso(evt.feature.properties[VectorlayerService.data.iso2]);
			if (typeof c.score != "undefined") {
				vm.current = c;
			} else {
				toastr.error('No info about this location!');
			}
		}
		function getData(year) {
			vm.year = year;
			ContentService.getIndicatorData(vm.indicator.id, year).then(function(dat) {
				if($state.current.name == 'app.index.indicator.year.info'){
					$state.go('app.index.indicator.year.info',{year:year});
				}
				else if($state.current.name == 'app.index.indicator.year'){
					$state.go('app.index.indicator.year',{year:year});
				}
				else{
					$state.go('app.index.indicator.year',{year:year});
				}
				vm.data = dat;
				angular.forEach(vm.data, function(item){
					item.rank = vm.data.indexOf(item) +1;
					if(vm.current){
						if(item.iso == vm.current.iso){
							setCurrent(item);
						}
					}

					vm.range.max =  d3.max([vm.range.max, parseFloat(item.score)]);
					vm.range.min =  d3.min([vm.range.min, parseFloat(item.score)]);
				});

					vm.circleOptions = {
						color: vm.indicator.styled.base_color || '#00ccaa',
						field: 'rank',
						size: vm.data.length
					};

				getOffset();
				vm.linearScale = d3.scale.linear().domain([vm.range.min,vm.range.max]).range([0,256]);
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
			if(vm.current){
				if(vm.current.iso == iso){
						feature.selected = true;
				}
			}



			switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined" && nation[field] != null){

						var colorPos =  parseInt(vm.linearScale(parseFloat(nation[field]))) * 4;// parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
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

		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){
				if(toState.name == 'app.index.indicator.data'){

				}
		})

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
			minZoom: minZoom
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
						console.log(Papa);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvY29udGVudC5qcyIsInNlcnZpY2VzL2NvdW50cmllcy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lcnJvckNoZWNrZXIuanMiLCJzZXJ2aWNlcy9pY29ucy5qcyIsInNlcnZpY2VzL2luZGV4LmpzIiwic2VydmljZXMvaW5kaXplcy5qcyIsInNlcnZpY2VzL3JlY3Vyc2lvbmhlbHBlci5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL3ZlY3RvcmxheWVyLmpzIiwiYXBwL2NvbmZsaWN0SW1wb3J0L2NvbmZsaWN0SW1wb3J0LmpzIiwiYXBwL2NvbmZsaWN0ZGV0YWlscy9jb25mbGljdGRldGFpbHMuanMiLCJhcHAvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiYXBwL2NvbmZsaWN0bmF0aW9uL2NvbmZsaWN0bmF0aW9uLmpzIiwiYXBwL2NvbmZsaWN0cy9jb25mbGljdHMuanMiLCJhcHAvZnVsbExpc3QvZmlsdGVyLmpzIiwiYXBwL2Z1bGxMaXN0L2Z1bGxMaXN0LmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaG9tZS9ob21lLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVjay5qcyIsImFwcC9pbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbC5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWxNZW51LmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGEuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YU1lbnUuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGEuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFFbnRyeS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuanMiLCJhcHAvaW5kZXhjcmVhdG9yL2luZGV4Y3JlYXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9jYXRlZ29yeS5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpY2F0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9ycy5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpemVzLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImFwcC9pbmRpY2F0b3IvaW5kaWNhdG9yWWVhclRhYmxlLmpzIiwiYXBwL2xvZ2luL2xvZ2luLmpzIiwiYXBwL2xvZ28vbG9nby5qcyIsImFwcC9tYXAvbWFwLmpzIiwiYXBwL3NlbGVjdGVkL3NlbGVjdGVkLmpzIiwiYXBwL3NpZGViYXIvc2lkZWJhci5qcyIsImFwcC9zaWRlbWVudS9zaWRlbWVudS5qcyIsImFwcC9zaWdudXAvc2lnbnVwLmpzIiwiYXBwL3RvYXN0cy90b2FzdHMuanMiLCJhcHAvdW5zdXBwb3J0ZWRfYnJvd3Nlci91bnN1cHBvcnRlZF9icm93c2VyLmpzIiwiYXBwL3VzZXIvdXNlci5qcyIsImRpYWxvZ3MvYWRkUHJvdmlkZXIvYWRkUHJvdmlkZXIuanMiLCJkaWFsb2dzL2FkZFVuaXQvYWRkVW5pdC5qcyIsImRpYWxvZ3MvYWRkWWVhci9hZGRZZWFyLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlhbG9ncy9jb25mbGljdG1ldGhvZGUvY29uZmxpY3RtZXRob2RlLmpzIiwiZGlhbG9ncy9jb25mbGljdHRleHQvY29uZmxpY3R0ZXh0LmpzIiwiZGlhbG9ncy9jb3B5cHJvdmlkZXIvY29weXByb3ZpZGVyLmpzIiwiZGlhbG9ncy9lZGl0Y29sdW1uL2VkaXRjb2x1bW4uanMiLCJkaWFsb2dzL2VkaXRyb3cvZWRpdHJvdy5qcyIsImRpYWxvZ3MvZXh0ZW5kRGF0YS9leHRlbmREYXRhLmpzIiwiZGlhbG9ncy9sb29zZWRhdGEvbG9vc2VkYXRhLmpzIiwiZGlhbG9ncy9zZWxlY3Rpc29mZXRjaGVycy9zZWxlY3Rpc29mZXRjaGVycy5qcyIsImRpcmVjdGl2ZXMvYXV0b0ZvY3VzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2JhcnMvYmFycy5qcyIsImRpcmVjdGl2ZXMvYmFycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2NhdGVnb3J5LmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvY29udGVudGVkaXRhYmxlLmpzIiwiZGlyZWN0aXZlcy9jb250ZW50ZWRpdGFibGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9maWxlRHJvcHpvbmUuanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5LmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2luZGljYXRvck1lbnUuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvcnMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9ycy9pbmRpY2F0b3JzLmpzIiwiZGlyZWN0aXZlcy9pbmRpemVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL3NsaWRlVG9nZ2xlLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuanMiLCJkaXJlY3RpdmVzL3dlaWdodC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsWUFBQSxXQUFBLGlCQUFBLGdCQUFBLGNBQUEsZ0JBQUEsWUFBQSxVQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsZ0JBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEscUVBQUEsU0FBQSxnQkFBQSxvQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsYUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztJQUdBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7O0lBTUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSxrQ0FBQSxTQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUEsWUFBQSxPQUFBLE1BQUE7Ozs7Ozs7SUFPQSxNQUFBLGFBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSxnQ0FBQSxTQUFBLGtCQUFBO01BQ0EsT0FBQSxpQkFBQTs7Ozs7R0FLQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtLQUNBLDRCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxnQkFBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUE7OztLQUdBLDJCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQSxjQUFBO09BQ0EsWUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEseUNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxPQUFBLGVBQUEsYUFBQSxhQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLE1BQUEsNEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7O0lBR0EsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7S0FDQSwwQ0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxJQUFBLGFBQUEsTUFBQSxHQUFBLE9BQUE7TUFDQSxPQUFBLGVBQUEsUUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEscUNBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxlQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLCtDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxnQkFBQTtTQUNBLE1BQUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7SUFPQSxNQUFBLGlEQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBOztJQUVBLE1BQUEsK0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLHdDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsNkNBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsR0FBQSxhQUFBLE1BQUEsTUFBQTtTQUNBLE9BQUE7O1FBRUEsT0FBQSxlQUFBLFlBQUEsYUFBQTs7Ozs7OztJQU9BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGNBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBOzs7S0FHQSw0QkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBOztLQUVBLCtCQUFBLFNBQUEsZUFBQTtPQUNBLE9BQUEsZUFBQSxjQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7OztJQUtBLE1BQUEsd0JBQUE7SUFDQSxJQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EsOENBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsT0FBQSxlQUFBLGVBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsNEJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsaUNBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7S0FDQSx5Q0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsaUJBQUEsYUFBQSxJQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSx5Q0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxPQUFBLGVBQUEsVUFBQSxhQUFBOztPQUVBLGdDQUFBLFNBQUEsa0JBQUE7UUFDQSxPQUFBLGlCQUFBOzs7O0tBSUEsWUFBQTtNQUNBLGFBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDJCQUFBO0lBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQSxNQUFBLG1DQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLGdCQUFBO0lBQ0EsVUFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxzQkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0EseUJBQUEsU0FBQSxhQUFBO01BQ0EsT0FBQSxZQUFBLElBQUE7O0tBRUEsMkJBQUEsU0FBQSxhQUFBO01BQ0EsT0FBQSxZQUFBLElBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsNkJBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLHdDQUFBLFNBQUEsYUFBQSxjQUFBO01BQ0EsT0FBQSxZQUFBLElBQUEsdUJBQUEsYUFBQSxLQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDhCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSwwQ0FBQSxTQUFBLGFBQUEsY0FBQTtNQUNBLE9BQUEsWUFBQSxJQUFBLHNCQUFBLGFBQUEsSUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxlQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsdUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGlCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxVQUFBOztJQUVBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE9BQUE7Ozs7OztBQ2poQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEscUhBQUEsU0FBQSxZQUFBLFlBQUEsVUFBQSxPQUFBLFFBQUEsZUFBQSxTQUFBLGFBQUEsUUFBQTtFQUNBLFdBQUEsY0FBQTtFQUNBLFdBQUEsY0FBQSxjQUFBLFlBQUE7RUFDQSxXQUFBLFNBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQTs7RUFFQSxXQUFBLGFBQUEsU0FBQSxRQUFBO0dBQ0EsV0FBQSxRQUFBOzs7RUFHQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7R0FDQSxJQUFBLFFBQUEsUUFBQSxDQUFBLE1BQUEsbUJBQUE7SUFDQSxPQUFBLE1BQUEsdUNBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQSxPQUFBLEdBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFVBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLE9BQUE7SUFDQSxXQUFBLFFBQUE7VUFDQTtJQUNBLFdBQUEsUUFBQTs7R0FFQSxJQUFBLE9BQUEsUUFBQSxTQUFBLGFBQUE7SUFDQSxJQUFBLFFBQUEsTUFBQSxlQUFBLFlBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLFdBQUE7V0FDQTtLQUNBLFdBQUEsV0FBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxhQUFBO1dBQ0E7S0FDQSxXQUFBLGFBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsVUFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztVQUVBO0lBQ0EsV0FBQSxhQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLElBQUEsUUFBQSxLQUFBLFFBQUEsY0FBQSxDQUFBLEtBQUEsUUFBQSxRQUFBLHVCQUFBO0lBQ0EsV0FBQSxXQUFBO1VBQ0E7SUFDQSxXQUFBLFdBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsNkJBQUE7SUFDQSxXQUFBLFlBQUE7VUFDQTtJQUNBLFdBQUEsWUFBQTs7R0FFQSxXQUFBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTs7R0FFQSxXQUFBLGlCQUFBO0dBQ0EsV0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxTQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBO0dBQ0EsV0FBQSxpQkFBQTtHQUNBLEdBQUEsTUFBQSxrQkFBQTtLQUNBLFdBQUEsWUFBQTs7R0FFQTs7O0VBR0EsU0FBQSxlQUFBO0dBQ0EsU0FBQSxXQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOzs7Ozs7Ozs7Ozs7OztBQzFGQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGVBQUE7OztFQUdBLGNBQUEsV0FBQTtJQUNBLGNBQUEsWUFBQTtJQUNBLGNBQUEsWUFBQTtFQUNBLGNBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxVQUFBOztFQUVBLGNBQUEsT0FBQTtHQUNBLEtBQUE7R0FDQSxVQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx3QkFBQSxTQUFBLGFBQUE7UUFDQSxhQUFBLGFBQUE7Ozs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEscUJBQUE7RUFDQTtJQUNBLFdBQUE7SUFDQSxrQkFBQTtJQUNBLFFBQUE7O0lBRUEscUJBQUE7SUFDQSxPQUFBOztJQUVBLHVCQUFBLFNBQUEsTUFBQSxXQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7SUFDQSxJQUFBO0lBQ0EsZ0JBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBO0tBQ0EsY0FBQSxRQUFBLEtBQUE7O0lBRUEsSUFBQSxLQUFBLFVBQUE7S0FDQSxjQUFBLFlBQUEsS0FBQTs7SUFFQSxPQUFBOzs7Ozs7Ozs7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxvREFBQSxTQUFBLG1CQUFBLG9CQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxJQUFBLFVBQUEsbUJBQUEsY0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLFFBQUE7O0dBRUEsbUJBQUEsY0FBQSxTQUFBOztFQUVBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTtHQUNBLFlBQUE7O0dBRUEsbUJBQUE7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHdCQUFBLFNBQUEsYUFBQTs7UUFFQSxRQUFBLE9BQUEsY0FBQTtVQUNBLGFBQUE7VUFDQSxhQUFBO1VBQ0EsV0FBQTtVQUNBLGFBQUE7VUFDQSxlQUFBO1VBQ0EsbUJBQUE7VUFDQSx1QkFBQTtVQUNBLFFBQUE7VUFDQSxhQUFBO1VBQ0EsWUFBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxZQUFBLFVBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQTs7WUFFQSxLQUFBLENBQUEsT0FBQTtjQUNBLE9BQUE7O1lBRUEsT0FBQSxNQUFBLFFBQUEsZUFBQTs7Ozs7OztBQ1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsY0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUEsS0FBQTtHQUNBLE9BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxNQUFBLFFBQUEsc0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxJQUFBLE9BQUEsR0FBQSxnQkFBQSxJQUFBLE9BQUEsR0FBQTtRQUNBOzs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsY0FBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBLE9BQUEsTUFBQSxPQUFBOztNQUVBLElBQUEsU0FBQTtHQUNBLElBQUEsSUFBQTtJQUNBLE1BQUEsTUFBQTs7R0FFQSxPQUFBLElBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxjQUFBLFFBQUEsS0FBQSxpQkFBQSxDQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsTUFBQTs7O0dBR0EsT0FBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxpQkFBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUEsS0FBQTtHQUNBLEtBQUEsQ0FBQSxLQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLFFBQUEsSUFBQSxNQUFBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQSxNQUFBLEtBQUE7Ozs7QUNaQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFdBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxNQUFBOzs7YUFHQSxPQUFBLEtBQUEsUUFBQSxjQUFBOzs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsS0FBQSxJQUFBLGFBQUEsT0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBOzs7R0FHQSxNQUFBLEtBQUEsVUFBQSxHQUFBLEdBQUE7SUFDQSxJQUFBLFNBQUEsRUFBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsT0FBQSxJQUFBOztHQUVBLE9BQUE7Ozs7OztBQ2pCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFlBQUE7Q0FDQSxTQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxZQUFBLE9BQUE7O01BRUEsSUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsUUFBQSxJQUFBOztRQUVBLEdBQUEsTUFBQSxHQUFBLEtBQUEsZUFBQSxNQUFBO1VBQ0EsTUFBQSxLQUFBLE1BQUE7Ozs7R0FJQSxPQUFBOzs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsc0JBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsYUFBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsTUFBQSxTQUFBLE9BQUE7Z0JBQ0EsUUFBQSxNQUFBLFVBQUEsR0FBQTs7Z0JBRUEsSUFBQSxDQUFBLGFBQUE7b0JBQ0EsSUFBQSxZQUFBLE1BQUEsWUFBQTs7b0JBRUEsSUFBQSxjQUFBLENBQUEsR0FBQTt3QkFDQSxRQUFBLE1BQUEsT0FBQSxHQUFBOzt1QkFFQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsT0FBQSxLQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUEsTUFBQSxTQUFBOzs7Z0JBR0EsT0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7QUMzQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLE9BQUE7Z0JBQ0EsSUFBQSxhQUFBLE1BQUEsTUFBQTtnQkFDQSxJQUFBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsV0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE9BQUE7OztZQUdBLE9BQUE7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxzQkFBQSxVQUFBLE1BQUE7RUFDQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxXQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsTUFBQSxVQUFBOzs7Ozs7QUNSQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2Q0FBQSxTQUFBLGFBQUEsU0FBQTs7RUFFQSxTQUFBLGNBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLE9BQUEsSUFBQTtJQUNBLElBQUEsT0FBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLE1BQUEsR0FBQTtLQUNBLE9BQUE7O0lBRUEsR0FBQSxLQUFBLFNBQUE7S0FDQSxJQUFBLFlBQUEsY0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxPQUFBOzs7OztHQUtBLE9BQUE7O0VBRUEsT0FBQTtHQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7SUFDQSxjQUFBO0lBQ0EsUUFBQTs7R0FFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxVQUFBLFlBQUEsT0FBQSxjQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxpQkFBQSxTQUFBLFFBQUEsYUFBQTtJQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQSxhQUFBLFlBQUEsT0FBQSxjQUFBLFFBQUE7O0dBRUEsYUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsT0FBQSxVQUFBLFFBQUE7O0dBRUEsWUFBQSxTQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsYUFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxLQUFBLGdCQUFBLFFBQUE7O0lBRUEsSUFBQSxLQUFBLFFBQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUE7O0dBRUEsZUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQSxnQkFBQTs7O0dBR0EsV0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxPQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxZQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGNBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxTQUFBLEdBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsSUFBQTtPQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLEtBQUEsZUFBQTs7R0FFQSxnQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxZQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOztHQUVBLHVCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGFBQUE7O0dBRUEsa0JBQUEsU0FBQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE1BQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLFdBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsZ0JBQUEsS0FBQTs7R0FFQSxTQUFBLFNBQUEsSUFBQTs7Ozs7S0FLQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxVQUFBOzs7R0FHQSxjQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsS0FBQSxPQUFBLEtBQUE7TUFDQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsY0FBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxPQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxZQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsUUFBQTs7S0FFQSxHQUFBLE1BQUEsWUFBQSxNQUFBLFNBQUEsVUFBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLFlBQUEsS0FBQSxZQUFBLElBQUEsTUFBQTtNQUNBLEdBQUEsVUFBQTtPQUNBLFFBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLFNBQUEsU0FBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLFFBQUEsS0FBQTs7R0FFQSxZQUFBLFNBQUEsR0FBQTtJQUNBLEtBQUEsY0FBQSxJQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLFVBQUE7O0dBRUEsWUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsS0FBQSxZQUFBLEtBQUEsSUFBQSxLQUFBLFFBQUE7O0lBRUEsT0FBQSxRQUFBOztHQUVBLGFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxRQUFBO0tBQ0EsT0FBQSxLQUFBLFlBQUEsSUFBQSxLQUFBLFFBQUE7V0FDQTtLQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUEsWUFBQSxPQUFBLGdCQUFBLElBQUE7OztHQUdBLGdCQUFBLFNBQUEsR0FBQTtJQUNBLEtBQUEsY0FBQSxJQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGVBQUE7O0dBRUEsWUFBQSxTQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsRUFBQTtLQUNBLEdBQUEsQ0FBQSxLQUFBLE9BQUEsTUFBQTtNQUNBLEtBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUE7O1NBRUE7TUFDQSxLQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLE9BQUEsS0FBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBOztJQUVBLEtBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGFBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxRQUFBO0lBQ0EsS0FBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7QUNuTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsb0NBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsV0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUEsWUFBQSxPQUFBLGtCQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLFVBQUEsT0FBQTtjQUNBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE1BQUE7VUFDQSxLQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7OztRQUdBLFNBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsUUFBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUE7O1VBRUEsT0FBQTs7UUFFQSxTQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLElBQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHdFQUFBLFNBQUEsYUFBQSxlQUFBLGFBQUE7O1FBRUEsSUFBQSxLQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO09BQ0EsR0FBQSxtQkFBQTtPQUNBLElBQUEsR0FBQSxLQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7U0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTtXQUNBLElBQUEsVUFBQSxLQUFBLE1BQUEsTUFBQTtXQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQTtZQUNBLElBQUEsT0FBQSxVQUFBLE9BQUE7YUFDQTs7OztVQUlBLElBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxHQUFBO1dBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7U0FHQSxJQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLEdBQUEsR0FBQSxLQUFBLFdBQUE7V0FDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOztVQUVBLGNBQUEsYUFBQSxjQUFBOzs7O1VBSUEsT0FBQTs7O01BR0EsU0FBQSxjQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtRQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsR0FBQTtTQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7V0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtXQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7V0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O1FBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBO1VBQ0EsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsSUFBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxXQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLDBDQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxPQUFBLE1BQUEsOENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLG1EQUFBO1FBQ0EsT0FBQTs7O09BR0EsR0FBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsSUFBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztRQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0E7VUFDQTs7UUFFQSxRQUFBLEtBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7T0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO09BQ0EsYUFBQTtPQUNBLFlBQUEsS0FBQSx3QkFBQTtRQUNBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsS0FBQSxTQUFBLFVBQUE7UUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7VUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZ0JBQUE7V0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxJQUFBLFdBQUE7YUFDQSxPQUFBO2FBQ0EsU0FBQSxRQUFBOztZQUVBLGFBQUEsWUFBQTtrQkFDQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUEsTUFBQSxhQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTthQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7Y0FDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2VBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO2dCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7c0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTtpQkFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2lCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OzttQkFNQTs7YUFFQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFFBQUEsR0FBQSxLQUFBOzthQUVBLElBQUEsYUFBQTthQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2NBQ0EsUUFBQSxJQUFBO2NBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtlQUNBLGFBQUE7OzthQUdBLElBQUEsQ0FBQSxZQUFBO2NBQ0EsYUFBQSxZQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUE7UUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO1NBQ0EsY0FBQSxhQUFBOztVQUVBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7UUFJQSxPQUFBO1VBQ0EsYUFBQTs7Ozs7O0FDbExBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsTUFBQTs7WUFFQSxXQUFBO1lBQ0EsU0FBQTtXQUNBLFNBQUEsYUFBQTs7UUFFQSxJQUFBLENBQUEsYUFBQSxJQUFBLGVBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTtZQUNBLG9CQUFBLEtBQUEsS0FBQTtZQUNBLGdCQUFBO1lBQ0EsYUFBQTs7VUFFQSxjQUFBLFlBQUEsSUFBQTs7WUFFQTtVQUNBLGNBQUEsYUFBQSxJQUFBO1VBQ0EsVUFBQSxZQUFBLElBQUE7O1FBRUEsT0FBQTtVQUNBLE1BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLEdBQUEsYUFBQSxJQUFBLGNBQUE7Z0JBQ0EsWUFBQSxPQUFBOztZQUVBLE9BQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxLQUFBO2tCQUNBLFdBQUE7a0JBQ0EsY0FBQTtrQkFDQSxXQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLGFBQUE7O1VBRUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUEsU0FBQTs7VUFFQSxtQkFBQSxVQUFBOztVQUVBLFlBQUEsSUFBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxLQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBOztVQUVBLHdCQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUEsS0FBQSxlQUFBOztVQUVBLHFCQUFBLFVBQUE7WUFDQSxPQUFBLGNBQUEsWUFBQSxJQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLFdBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxjQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsWUFBQSxXQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQSxFQUFBOztVQUVBLFlBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUEsRUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQTs7VUFFQSxtQkFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7O2dCQUVBLFNBQUE7Z0JBQ0EsV0FBQTs7Ozs7Ozs7QUNwS0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxPQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxZQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxZQUFBLEtBQUEsTUFBQSxTQUFBLFVBQUE7SUFDQSxPQUFBLEtBQUE7O0dBRUEsU0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxjQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGdCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOztHQUVBLHFCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOzs7Ozs7O0FDakNBLENBQUEsWUFBQTtFQUNBOztFQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdDQUFBLFVBQUEsVUFBQTs7SUFFQSxPQUFBOzs7Ozs7O0tBT0EsU0FBQSxVQUFBLFNBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7O01BS0EsSUFBQSxXQUFBLFFBQUEsV0FBQTtNQUNBLElBQUE7TUFDQSxPQUFBO09BQ0EsS0FBQSxDQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQTs7OztPQUlBLE1BQUEsVUFBQSxPQUFBLFNBQUE7O1FBRUEsSUFBQSxDQUFBLGtCQUFBO1NBQ0EsbUJBQUEsU0FBQTs7O1FBR0EsaUJBQUEsT0FBQSxVQUFBLE9BQUE7U0FDQSxRQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLFFBQUEsS0FBQSxNQUFBO1NBQ0EsS0FBQSxLQUFBLE1BQUEsTUFBQTs7Ozs7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsWUFBQTs7O1FBR0EsT0FBQTtVQUNBLEtBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLE9BQUEsWUFBQSxPQUFBOztVQUVBLFdBQUEsVUFBQTs7O1VBR0EsV0FBQSxVQUFBOzs7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxtQ0FBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBO0VBQ0EsT0FBQTtHQUNBLFFBQUE7R0FDQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTtJQUNBLE9BQUE7O0dBRUEsVUFBQTtHQUNBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxLQUFBLFdBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFNBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFFBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLEtBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxtQkFBQSxTQUFBLFdBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsWUFBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxRQUFBLElBQUE7S0FDQSxTQUFBLGFBQUEsS0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBLFdBQUE7O0lBRUEsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxjQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFlBQUE7Ozs7O0dBS0EsY0FBQSxTQUFBLGVBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLFVBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7Ozs7R0FJQSxVQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxLQUFBLEtBQUEsWUFBQTs7SUFFQSxJQUFBLENBQUEsS0FBQSxRQUFBO0tBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsS0FBQSxLQUFBOztTQUVBO01BQ0EsS0FBQSxrQkFBQSxLQUFBLEtBQUE7O1dBRUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsS0FBQTs7O0dBR0EsZ0JBQUEsU0FBQSxLQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxZQUFBO0tBQ0EsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7UUFJQTtLQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxJQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLGlCQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7O0dBRUEsZ0JBQUEsU0FBQSxPQUFBLE9BQUEsT0FBQTtJQUNBLElBQUEsT0FBQTs7SUFFQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsU0FBQSxlQUFBLFNBQUEsTUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUE7WUFDQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxJQUFBOztLQUVBLElBQUEsT0FBQSxTQUFBLGFBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7O0tBRUEsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGVBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLFVBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsSUFBQTtPQUNBLEdBQUEsT0FBQTtRQUNBLFFBQUEsV0FBQTs7VUFFQTtPQUNBLFFBQUEsV0FBQTs7OztLQUlBLEtBQUE7Ozs7R0FJQSxtQkFBQSxTQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUE7S0FDQSxRQUFBLElBQUE7OztRQUdBO0tBQ0EsS0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxXQUFBOzs7O0dBSUEsT0FBQSxVQUFBO0lBQ0EsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGdCQUFBLFNBQUEsU0FBQTtJQUNBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUEsS0FBQSxlQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0lBQ0EsUUFBQSxXQUFBOztJQUVBLFFBQUE7S0FDQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxLQUFBO09BQ0EsSUFBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7T0FFQSxJQUFBLFlBQUEsU0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO09BQ0EsUUFBQSxJQUFBLFVBQUEsSUFBQTtPQUNBLElBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOztPQUVBLE1BQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO1FBQ0EsU0FBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOzs7O2FBSUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztPQUlBOztJQUVBLE9BQUE7Ozs7Ozs7O0FDaFFBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsYUFBQSxRQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLEdBQUE7SUFDQSxRQUFBLEdBQUE7O0dBRUEsWUFBQSxJQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUNsQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUpBQUEsU0FBQSxVQUFBLFFBQUEsUUFBQSxZQUFBLG9CQUFBLFVBQUEsV0FBQSxTQUFBLGVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxnQkFBQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7RUFDQSxHQUFBLFNBQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxXQUFBLFNBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7O0lBRUEsR0FBQSxZQUFBO0lBQ0EsbUJBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7SUFDQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsYUFBQTtJQUNBLG1CQUFBOzs7SUFHQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxLQUFBO01BQ0EsbUJBQUEsbUJBQUEsT0FBQSxLQUFBOzs7OztJQUtBLG1CQUFBLGVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsYUFBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLGNBQUEsYUFBQSxnQkFBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsU0FBQSxtQkFBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLEdBQUEsWUFBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxzQkFBQTtHQUNBLElBQUEsR0FBQSxlQUFBLE9BQUE7R0FDQSxPQUFBOzs7Ozs7QUN2SUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLFdBQUEsZ0JBQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7O0VBRUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsV0FBQSxNQUFBO0dBQ0EsUUFBQSxJQUFBLE1BQUEsV0FBQTtHQUNBLElBQUEsSUFBQSxXQUFBLGNBQUEsUUFBQTtHQUNBLElBQUEsSUFBQSxDQUFBLEdBQUE7SUFDQSxXQUFBLGNBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxXQUFBLGNBQUEsS0FBQTs7O0dBR0EsSUFBQSxXQUFBLGNBQUEsVUFBQSxHQUFBO0lBQ0EsV0FBQSxnQkFBQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTs7O0dBR0E7Ozs7QUMxQ0EsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0lBQUEsU0FBQSxVQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsb0JBQUEsYUFBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLFdBQUEsU0FBQTtHQUNBLFdBQUEsZUFBQTs7R0FFQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxtQkFBQSxjQUFBLEdBQUEsT0FBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUEsUUFBQTtJQUNBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxhQUFBO0lBQ0EsbUJBQUEsbUJBQUEsR0FBQSxPQUFBLEtBQUE7SUFDQSxXQUFBLGVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFdBQUEsU0FBQSxVQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLFdBQUE7S0FDQSxJQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUEsU0FBQTtNQUNBLEdBQUEsV0FBQTs7S0FFQSxRQUFBLFFBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLEdBQUEsUUFBQSxHQUFBO09BQ0EsR0FBQSxHQUFBLFNBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsU0FBQSxLQUFBO1FBQ0EsV0FBQSxlQUFBLEdBQUE7Ozs7O0tBS0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsT0FBQTtNQUNBLElBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtPQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXVCQSxTQUFBLGFBQUE7R0FDQSxjQUFBLGFBQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTs7SUFFQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsSUFBQSxZQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOztJQUVBLFFBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDM0lBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRKQUFBLFVBQUEsVUFBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLFNBQUEsb0JBQUEsYUFBQSxlQUFBLFlBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtHQUNBLFlBQUE7R0FDQSxZQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQSxDQUFBLEdBQUEsR0FBQTs7RUFFQSxHQUFBLHVCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsV0FBQSxTQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7O0dBRUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxZQUFBO0lBQ0E7Ozs7Ozs7O0VBUUEsU0FBQSxlQUFBOztHQUVBLElBQUEsV0FBQTtJQUNBLFdBQUE7O0lBRUEsV0FBQTs7Ozs7O0VBTUEsU0FBQSxZQUFBO0dBQ0EsR0FBQSxZQUFBO0dBQ0EsR0FBQSxzQkFBQTtHQUNBLEdBQUEsc0JBQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsVUFBQTs7R0FFQSxHQUFBLFlBQUEsQ0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7OztHQUdBLEdBQUEsZ0JBQUEsQ0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7Ozs7O0VBS0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLHFCQUFBLE1BQUE7O0dBRUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7R0FDQSxJQUFBLElBQUEsQ0FBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxHQUFBLE9BQUEsS0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxPQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUE7O0dBRUE7OztFQUdBLFNBQUEsYUFBQSxVQUFBO0dBQ0EsR0FBQTtHQUNBLFFBQUEsU0FBQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBOzs7R0FHQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQTs7R0FFQSxhQUFBLFNBQUE7O0VBRUEsU0FBQSxhQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLElBQUE7SUFDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLElBQUEsUUFBQSxDQUFBLEVBQUE7S0FDQSxHQUFBLFVBQUEsS0FBQSxJQUFBOzs7O0VBSUEsU0FBQSxrQkFBQTtHQUNBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLFVBQUE7SUFDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7S0FDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsR0FBQTtNQUNBLGFBQUE7O1dBRUE7S0FDQSxhQUFBOzs7R0FHQSxHQUFBLFFBQUE7O0dBRUEsbUJBQUE7OztFQUdBLFNBQUEsYUFBQSxLQUFBLEdBQUE7R0FDQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7SUFDQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLFFBQUEsV0FBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7SUFDQSxNQUFBLFFBQUE7SUFDQSxNQUFBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O09BR0E7SUFDQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7WUFJQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O0tBSUE7Ozs7O0dBS0EsT0FBQTtHQUNBOzs7OztBQ3RQQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1REFBQSxTQUFBLFlBQUEsZ0JBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLGFBQUE7O0lBRUEsR0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBO01BQ0EsV0FBQTtRQUNBLGtCQUFBLFVBQUE7VUFDQSxHQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtZQUNBLGVBQUE7O1VBRUEsZUFBQSxXQUFBLGFBQUEsVUFBQSxHQUFBO1VBQ0EsZUFBQSxXQUFBLFVBQUEsVUFBQSxHQUFBOzs7O0lBSUEsU0FBQSxZQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxHQUFBLE9BQUEsQ0FBQSxFQUFBO1FBQ0EsR0FBQSxPQUFBLEtBQUE7OztJQUdBLFNBQUEsZUFBQSxJQUFBO01BQ0EsWUFBQSxJQUFBO01BQ0EsR0FBQSxJQUFBLFNBQUE7UUFDQSxRQUFBLFFBQUEsSUFBQSxVQUFBLFNBQUEsTUFBQTtVQUNBLFlBQUEsTUFBQTtVQUNBLGVBQUE7OztLQUdBO0lBQ0EsU0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxTQUFBLEtBQUEsR0FBQSxPQUFBLFNBQUEsRUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLFlBQUEsU0FBQSxJQUFBO01BQ0EsR0FBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO09BQ0EsUUFBQTs7O0tBR0EsT0FBQTs7SUFFQSxPQUFBOzs7OztBQzdDQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4RkFBQSxTQUFBLE9BQUEsUUFBQSxnQkFBQSxZQUFBLFlBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUE7R0FDQSxNQUFBO0dBQ0EsUUFBQSxVQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxpQkFBQTtLQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLE9BQUE7O1FBRUE7S0FDQSxlQUFBLFlBQUE7S0FDQSxlQUFBLFlBQUE7S0FDQSxPQUFBLEdBQUE7Ozs7O0VBS0EsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLGVBQUEsUUFBQSxhQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUE7R0FDQSxHQUFBLGFBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLGVBQUEsUUFBQSxVQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUE7R0FDQSxHQUFBLFVBQUE7Ozs7O0FDN0JBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRIQUFBLFNBQUEsT0FBQSxVQUFBLGFBQUEsT0FBQSxlQUFBLFlBQUEsT0FBQSxRQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsV0FBQSxrQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQSxHQUFBLGVBQUEsU0FBQSxTQUFBO0dBQ0EsTUFBQSxhQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBOztFQUVBLFNBQUEsU0FBQTtHQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLFFBQUE7O01BRUEsTUFBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsd0NBQUE7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxrQkFBQTtJQUNBLE1BQUEsU0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLEdBQUE7O0tBRUEsT0FBQSxRQUFBO09BQ0EsTUFBQSxTQUFBLFNBQUE7Ozs7OztJQU1BLFNBQUEsU0FBQSxhQUFBLElBQUE7TUFDQSxZQUFBO0tBQ0E7RUFDQSxTQUFBLFlBQUE7R0FDQSxXQUFBLGNBQUEsQ0FBQSxXQUFBO0dBQ0EsY0FBQSxXQUFBLFdBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtLQUNBLElBQUE7O01BRUE7O0VBRUEsV0FBQSxjQUFBO0VBQ0EsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBLE9BQUEscUJBQUEsU0FBQSxFQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLFdBQUEsRUFBQSxPQUFBLFNBQUEsU0FBQSxTQUFBLE9BQUE7S0FDQSxHQUFBLGNBQUE7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsWUFBQSxPQUFBLFNBQUEsQ0FBQSxhQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7Ozs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUxBQUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxZQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUEsb0JBQUEsTUFBQSxXQUFBLGFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE1BQUE7O0VBRUEsR0FBQSxhQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsa0JBQUEsS0FBQSxTQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQSxtQkFBQTtFQUNBLEdBQUEsa0JBQUEsbUJBQUE7RUFDQSxHQUFBLHNCQUFBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLFlBQUEsbUJBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBOztFQUVBLEdBQUEsVUFBQTtHQUNBLGFBQUE7Ozs7RUFJQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsbUJBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsR0FBQSxZQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxHQUFBLGdCQUFBLEtBQUEsU0FBQSxXQUFBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxPQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLGNBQUE7OztLQUdBLGFBQUEsR0FBQSxVQUFBLE1BQUE7S0FDQTtLQUNBLElBQUEsT0FBQSxPQUFBLE1BQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxHQUFBLDBCQUFBO0lBQ0EsR0FBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBO0lBQ0EsS0FBQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsU0FBQSxTQUFBLEVBQUE7S0FDQSxjQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxTQUFBLE1BQUE7R0FDQSxHQUFBLFdBQUEsZUFBQTtHQUNBLGdCQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsWUFBQSxHQUFBLGFBQUEsT0FBQSxpQkFBQTs7O0VBR0EsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7O0dBRUEsR0FBQTs7R0FFQSxXQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLEdBQUEsV0FBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBOzs7R0FHQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7OztHQUdBLE9BQUEsR0FBQSxLQUFBLFFBQUEsR0FBQSxXQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxHQUFBLGdCQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsTUFBQSxjQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQTtJQUNBLE1BQUEsR0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLFFBQUEsU0FBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsWUFBQSxPQUFBLFdBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsUUFBQSxPQUFBO0lBQ0EsZUFBQTs7Ozs7RUFLQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLE9BQUEsV0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxVQUFBLENBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUE7Ozs7RUFJQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBLFFBQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBOztVQUVBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsVUFBQSxTQUFBLFNBQUE7S0FDQSxRQUFBLFdBQUE7O0lBRUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMkJBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBLFFBQUEsR0FBQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUEsS0FBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxtQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxXQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7OztFQUdBLFNBQUEsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxlQUFBLEdBQUEsUUFBQSxZQUFBLE1BQUE7S0FDQSxHQUFBLGFBQUE7O0lBRUEsVUFBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxVQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsYUFBQSxPQUFBOztHQUVBLEdBQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxTQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7OztFQUtBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBOzs7R0FHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsT0FBQSxVQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7O0dBRUEsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7OztNQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTs7TUFFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O01BR0E7WUFDQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7Ozs7R0FLQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFlBQUEsU0FBQTtJQUNBLE1BQUEsY0FBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7O0dBR0EsSUFBQSxFQUFBLEtBQUE7SUFDQSxJQUFBLEVBQUEsS0FBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUE7SUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGtCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBOzs7O0VBSUEsT0FBQSxPQUFBLDBCQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLElBQUE7R0FDQSxJQUFBLEVBQUE7SUFDQSxhQUFBLEVBQUE7UUFDQTtJQUNBLGFBQUE7SUFDQTtHQUNBLEdBQUE7Ozs7Ozs7Ozs7Ozs7R0FhQSxJQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtLQUNBLE9BQUEsR0FBQSxtQ0FBQTtNQUNBLElBQUEsRUFBQTtNQUNBLE1BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7O1dBRUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxJQUFBLEVBQUE7TUFDQSxNQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxJQUFBLEVBQUE7S0FDQSxNQUFBLEVBQUE7Ozs7Ozs7RUFPQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7O0dBUUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEdBQUE7SUFDQSxDQUFBLEtBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEdBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxTQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DQSxTQUFBLGdCQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxXQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxLQUFBLFdBQUE7OztZQUdBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxTQUFBLEtBQUEsR0FBQTs7S0FFQSxJQUFBLENBQUEsR0FBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsUUFBQTtPQUNBLEdBQUEsVUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7WUFFQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxtQkFBQTthQUNBO09BQ0EsT0FBQSxNQUFBLGdDQUFBLElBQUEsUUFBQSxXQUFBOzs7Ozs7Ozs7QUNsbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlHQUFBLFVBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGVBQUEsY0FBQTs7O0VBR0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxlQUFBO0lBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsc0JBQUE7O0VBRUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxRQUFBO0dBQ0EsUUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7S0FDQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7O0lBR0EsU0FBQSxVQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUE7T0FDQSxHQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxTQUFBLE9BQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUE7TUFDQSxRQUFBOzs7T0FHQSxRQUFBLFFBQUEsSUFBQSxPQUFBLFNBQUEsTUFBQTtTQUNBLEdBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEtBQUE7O0lBRUEsR0FBQSxhQUFBLEdBQUEsTUFBQTs7Ozs7RUFLQSxTQUFBLE9BQUEsV0FBQTtHQUNBLEdBQUEsU0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O0dBR0E7O0VBRUEsU0FBQSxlQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsYUFBQSxHQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7T0FDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO1FBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtTQUNBLGFBQUE7O1FBRUEsYUFBQTtRQUNBLEdBQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7TUFHQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUE7Ozs7R0FJQSxhQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtNQUNBLEdBQUE7TUFDQSxhQUFBOztLQUVBLEdBQUE7S0FDQSxhQUFBOztJQUVBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7O0dBRUEsR0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGVBQUE7R0FDQSxHQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtLQUNBLEdBQUEsU0FBQSxLQUFBOzs7OztFQUtBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLFNBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBOzs7RUFHQSxTQUFBLGtCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUEsR0FBQTtJQUNBLFFBQUEsUUFBQSxJQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLEtBQUEsV0FBQSxpQkFBQSxTQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO09BQ0EsSUFBQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7QUMzSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0hBQUEsU0FBQSxZQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsZUFBQSxRQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFdBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0lBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLElBQUEsUUFBQTtNQUNBLE1BQUE7TUFDQSxTQUFBO01BQ0EsT0FBQSxJQUFBLEtBQUEsR0FBQSxLQUFBO01BQ0EsUUFBQSxHQUFBLEtBQUE7TUFDQSxLQUFBOztLQUVBLElBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTs7O0tBR0EsSUFBQSxDQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOzs7O0dBSUEsYUFBQTs7O0VBR0EsU0FBQSxXQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSwwQ0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsT0FBQSxNQUFBLDhDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLEdBQUEsS0FBQSxpQkFBQSxHQUFBLEtBQUEsV0FBQTtJQUNBLE9BQUEsTUFBQSxtREFBQTtJQUNBLE9BQUE7O0dBRUEsV0FBQSxpQkFBQTtHQUNBLEdBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztJQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQTtNQUNBOztJQUVBLFFBQUEsS0FBQTtLQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtLQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O0dBR0EsSUFBQSxVQUFBLGFBQUEsUUFBQSxTQUFBLEtBQUEsZUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBLEtBQUEsd0JBQUE7SUFDQSxNQUFBO0lBQ0EsS0FBQTtNQUNBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsV0FBQSxpQkFBQTtJQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtNQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsZ0JBQUE7T0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFdBQUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxRQUFBOztRQUVBLGFBQUEsWUFBQTtjQUNBLEdBQUEsUUFBQSxLQUFBLFVBQUEsRUFBQTtRQUNBLElBQUEsT0FBQSxRQUFBLFFBQUEsYUFBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUE7WUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBO2tCQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTthQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxLQUFBLE9BQUEsT0FBQSxHQUFBOzs7Ozs7ZUFNQTs7U0FFQSxJQUFBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBOztTQUVBLElBQUEsYUFBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsUUFBQSxJQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsYUFBQSxZQUFBO1VBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7SUFPQSxHQUFBLGNBQUE7SUFDQSxhQUFBO0lBQ0EsSUFBQSxhQUFBLGNBQUEsUUFBQTtLQUNBLGNBQUEsYUFBQTs7TUFFQSxTQUFBLFVBQUE7SUFDQSxXQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztFQUlBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxJQUFBLGFBQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQTtJQUNBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsS0FBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7TUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O0tBRUEsV0FBQSxLQUFBLEtBQUEsS0FBQTtXQUNBO0tBQ0EsT0FBQSxNQUFBLCtCQUFBO0tBQ0E7OztHQUdBLFFBQUEsSUFBQTtHQUNBLFlBQUEsS0FBQSxpQkFBQSxHQUFBLFVBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsTUFBQTtLQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQSxhQUFBO0tBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQzNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRUFBQSxVQUFBLFFBQUEsY0FBQSxhQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLFdBQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTs7OztHQUlBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxNQUFBO0lBQ0EsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxTQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLGFBQUE7S0FDQSxNQUFBOztJQUVBLElBQUEsVUFBQTtJQUNBLElBQUEsYUFBQTtLQUNBLFNBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7T0FDQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztPQUVBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtRQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O09BR0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO09BQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7VUFFQTtPQUNBLFFBQUEsS0FBQTs7OztZQUlBO01BQ0EsT0FBQSxNQUFBLCtCQUFBO01BQ0E7OztJQUdBLFFBQUEsUUFBQSxHQUFBLFlBQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsZUFBQTtNQUNBLElBQUEsV0FBQTtNQUNBLElBQUEsT0FBQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxXQUFBLEdBQUEsV0FBQSxLQUFBLE1BQUE7O01BRUEsSUFBQSxRQUFBO09BQ0EsVUFBQTtPQUNBLFNBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxlQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsS0FBQSxNQUFBO09BQ0EsYUFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBO09BQ0EsWUFBQTtPQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUEsTUFBQTs7TUFFQSxJQUFBLGFBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLEtBQUE7T0FDQSxXQUFBLEtBQUEsSUFBQTs7TUFFQSxNQUFBLGFBQUE7TUFDQSxPQUFBLEtBQUE7OztJQUdBLEdBQUEsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFNBQUEsRUFBQTtLQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxZQUFBOzs7SUFHQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7S0FDQSxZQUFBLEtBQUEsaUJBQUEsU0FBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFVBQUEsS0FBQTtNQUNBLElBQUEsT0FBQSxNQUFBO09BQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO09BQ0EsYUFBQTtPQUNBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQTtPQUNBLEdBQUEsT0FBQTs7TUFFQSxHQUFBLFVBQUE7O09BRUEsVUFBQSxVQUFBO0tBQ0EsSUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7S0FHQSxHQUFBLFVBQUE7Ozs7Ozs7O0FDdkdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUEsT0FBQSxLQUFBLEdBQUEsWUFBQTs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSEFBQSxTQUFBLFFBQUEsUUFBQSxtQkFBQSxTQUFBLGFBQUEsYUFBQSxPQUFBOzs7UUFHQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxTQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxtQkFBQSxhQUFBOzs7UUFHQSxRQUFBLElBQUEsR0FBQTtRQUNBOztRQUVBLFNBQUEsVUFBQTtVQUNBOzs7UUFHQSxTQUFBLFdBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBO1lBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsRUFBQTtVQUNBLEdBQUEsWUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxtQkFBQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztVQUVBO1lBQ0EsYUFBQTs7O1FBR0EsT0FBQSxPQUFBLGdCQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUE7VUFDQSxHQUFBLE9BQUEsRUFBQSxZQUFBLGFBQUE7WUFDQSxHQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUE7Y0FDQSxHQUFBLEVBQUEsTUFBQTtnQkFDQSxtQkFBQSxhQUFBLEVBQUEsTUFBQTs7a0JBRUE7a0JBQ0EsbUJBQUEsYUFBQTs7Y0FFQTs7O2NBR0E7WUFDQSxHQUFBLE9BQUEsRUFBQSxjQUFBLFlBQUE7Y0FDQSxHQUFBLEVBQUEsV0FBQSxPQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxXQUFBLEdBQUEsTUFBQTs7a0JBRUE7Z0JBQ0EsbUJBQUEsYUFBQTs7O1lBR0E7O1VBRUEsYUFBQSx1QkFBQTtVQUNBLGFBQUE7VUFDQTs7O1FBR0EsU0FBQSxRQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtjQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQSxjQUFBLEdBQUE7Y0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBOztVQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7UUFFQSxTQUFBLGNBQUEsSUFBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7YUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsY0FBQSxJQUFBO2VBQ0EsUUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBOzs7VUFHQSxPQUFBOztRQUVBLFNBQUEsZUFBQSxTQUFBO09BQ0EsSUFBQSxRQUFBO09BQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtPQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtPQUNBLElBQUEsUUFBQSxHQUFBLFVBQUE7T0FDQSxJQUFBLE9BQUEsUUFBQTs7T0FFQSxRQUFBO09BQ0EsS0FBQTs7U0FFQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtTQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtjQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7U0FDQSxNQUFBLFVBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7U0FFQSxNQUFBLFdBQUE7VUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtVQUNBLFNBQUE7V0FDQSxPQUFBO1dBQ0EsTUFBQTs7O1NBR0E7Ozs7T0FJQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFVBQUEsU0FBQTtRQUNBLE1BQUEsY0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQSxRQUFBLFdBQUE7VUFDQSxVQUFBLENBQUEsS0FBQTtVQUNBLFVBQUE7O1NBRUEsT0FBQTs7O09BR0EsT0FBQTs7UUFFQSxTQUFBLGNBQUE7VUFDQSxHQUFBLFVBQUEsU0FBQTtVQUNBLEdBQUEsVUFBQTs7UUFFQSxTQUFBLGdCQUFBO1VBQ0E7T0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLFNBQUEsWUFBQTtVQUNBOzs7Ozs7OztBQzdJQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvR0FBQSxTQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUEsZUFBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFdBQUE7TUFDQSxHQUFBLFdBQUE7OztNQUdBLFNBQUEsaUJBQUEsSUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxZQUFBO1VBQ0EsYUFBQSxhQUFBLElBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTs7O1FBR0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUEsYUFBQTtRQUNBLGFBQUE7O01BRUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxhQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsU0FBQSxLQUFBLFFBQUEsS0FBQSxnQkFBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7S0FFQSxPQUFBOztJQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsZUFBQSxPQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7S0FDQSxPQUFBLFVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztNQUVBLFNBQUEsVUFBQTtRQUNBLElBQUEsT0FBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLFlBQUEsU0FBQSxVQUFBO1VBQ0EsR0FBQSxVQUFBLFdBQUE7WUFDQTs7OztRQUlBLEdBQUEsUUFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBLE9BQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7O01BRUEsU0FBQSxXQUFBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsY0FBQSxDQUFBLEdBQUEsS0FBQSxLQUFBO1lBQ0EsY0FBQSxhQUFBLFdBQUE7WUFDQSxPQUFBOztNQUVBLElBQUEsYUFBQTtPQUNBLE1BQUE7O01BRUEsSUFBQSxVQUFBO01BQ0EsSUFBQSxhQUFBO09BQ0EsU0FBQTtNQUNBLEdBQUEsVUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7UUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtTQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O1NBRUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO1VBQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7U0FHQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7U0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztZQUVBO2dCQUNBLEdBQUEsR0FBQSxLQUFBLEtBQUE7a0JBQ0EsS0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBO2tCQUNBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtXQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O29CQUVBO21CQUNBLFFBQUEsS0FBQTs7Ozs7OztjQU9BO1FBQ0EsT0FBQSxNQUFBLCtCQUFBO1FBQ0E7OztNQUdBLFFBQUEsUUFBQSxHQUFBLFlBQUEsVUFBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsZUFBQTtRQUNBLElBQUEsV0FBQTtRQUNBLElBQUEsT0FBQSxHQUFBLFdBQUEsS0FBQSxTQUFBLGFBQUE7U0FDQSxXQUFBLEdBQUEsV0FBQSxLQUFBLE1BQUE7O1FBRUEsSUFBQSxRQUFBO1NBQ0EsVUFBQTtTQUNBLFNBQUEsR0FBQSxXQUFBLEtBQUE7U0FDQSxlQUFBLEdBQUEsV0FBQSxLQUFBO1NBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsS0FBQSxNQUFBO1NBQ0EsYUFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBO1NBQ0EsWUFBQTtTQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUEsTUFBQTs7UUFFQSxJQUFBLGFBQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLEtBQUE7U0FDQSxXQUFBLEtBQUEsSUFBQTs7UUFFQSxNQUFBLGFBQUE7UUFDQSxPQUFBLEtBQUE7OztNQUdBLEdBQUEsS0FBQSxTQUFBO01BQ0EsR0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQTs7O01BR0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLGlCQUFBLFNBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxJQUFBLE9BQUEsTUFBQTtTQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtTQUNBLGFBQUE7U0FDQSxPQUFBLEdBQUE7U0FDQSxHQUFBLE9BQUE7U0FDQSxHQUFBLE9BQUE7O1FBRUEsR0FBQSxVQUFBOztTQUVBLFVBQUEsVUFBQTtPQUNBLElBQUEsU0FBQSxTQUFBO1FBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O09BR0EsR0FBQSxVQUFBOzs7O01BSUEsU0FBQSxjQUFBOzs7Ozs7Ozs7O0tBVUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxHQUFBLE1BQUEsRUFBQTtRQUNBLEdBQUEsV0FBQSxFQUFBLGVBQUE7UUFDQTtNQUNBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1FBQ0EsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsS0FBQSxNQUFBO1FBQ0EsR0FBQSxDQUFBLEdBQUEsa0JBQUE7VUFDQSxHQUFBLGNBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsYUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxVQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLGdCQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFlBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsV0FBQSxHQUFBLFdBQUEsRUFBQSxhQUFBOztVQUVBLGNBQUEsYUFBQSxnQkFBQTtlQUNBOzs7Ozs7Ozs7OztBQ3pLQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxTQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTs7TUFFQSxHQUFBLE9BQUE7O01BRUE7O01BRUEsU0FBQSxVQUFBO1FBQ0EsWUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0EsR0FBQSxPQUFBO1lBQ0E7Ozs7TUFJQSxTQUFBLGFBQUE7UUFDQSxRQUFBLElBQUEsR0FBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsS0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBOzs7Ozs7O0FDcEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtLQUFBLFNBQUEsUUFBQSxjQUFBLGFBQUEsU0FBQSxRQUFBLFNBQUEsYUFBQSxRQUFBLGFBQUEsY0FBQSxtQkFBQTs7Ozs7Ozs7Ozs7Ozs7O1FBZUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsa0JBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHNCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEsdUJBQUE7UUFDQSxHQUFBLHlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQTs7UUFFQSxHQUFBLFFBQUEsYUFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsY0FBQTtVQUNBLE1BQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1CQTs7UUFFQSxTQUFBLFVBQUE7O1VBRUEsYUFBQTs7UUFFQSxTQUFBLFVBQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxXQUFBOztRQUVBLFNBQUEsZ0JBQUEsUUFBQTtTQUNBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztTQUdBLE9BQUE7O1FBRUEsU0FBQSxVQUFBO1dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7Y0FDQSxHQUFBLFlBQUEsbUJBQUE7Y0FDQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztRQU1BLFNBQUEscUJBQUE7VUFDQSxHQUFBLGdCQUFBLENBQUEsR0FBQTtVQUNBLEdBQUEsR0FBQSxjQUFBO1lBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsVUFBQTtZQUNBLFlBQUEsT0FBQSxlQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxZQUFBO2NBQ0EsR0FBQSxvQkFBQSxJQUFBLEdBQUEsa0JBQUE7Ozs7O1FBS0EsU0FBQSxpQkFBQSxTQUFBO1VBQ0EsT0FBQSxHQUFBLGtCQUFBLFFBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTs7UUFFQSxTQUFBLGdCQUFBLFVBQUEsS0FBQTtVQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsTUFBQSxJQUFBOztnQkFFQSxHQUFBLFFBQUEsU0FBQTtrQkFDQSxLQUFBLE9BQUEsS0FBQTtrQkFDQSxHQUFBLGlCQUFBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLE9BQUE7a0JBQ0EsR0FBQSxrQkFBQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxNQUFBOzs7Y0FHQSxnQkFBQSxVQUFBLEtBQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsa0JBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGtCQUFBLE9BQUEsS0FBQTtZQUNBLGdCQUFBLFVBQUEsR0FBQTs7Y0FFQTtZQUNBLEdBQUEsa0JBQUEsS0FBQTtZQUNBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO2NBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7Z0JBRUE7Z0JBQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7OztRQU1BLFNBQUEsZUFBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxNQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQTtZQUNBLGVBQUEsTUFBQTs7O1FBR0EsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLHFCQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsaUJBQUEsT0FBQSxLQUFBOztjQUVBO1lBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7UUFHQSxTQUFBLHVCQUFBLEtBQUE7VUFDQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxRQUFBLENBQUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7VUFHQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtZQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2VBRUEsR0FBQSxHQUFBLGlCQUFBLFNBQUEsR0FBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO2tCQUNBLFNBQUEsTUFBQSxLQUFBO2tCQUNBLGdCQUFBLE1BQUEsR0FBQTs7Y0FFQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEdBQUEsbUJBQUE7O2NBRUE7WUFDQSxHQUFBLE9BQUEsS0FBQTs7O1FBR0EsU0FBQSxnQkFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFNBQUEsTUFBQSxLQUFBOztVQUVBLEdBQUEsT0FBQSxLQUFBO1VBQ0EsR0FBQSxtQkFBQTs7UUFFQSxTQUFBLFVBQUEsS0FBQTtVQUNBLEdBQUEsV0FBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQSxLQUFBO1lBQ0EsZ0JBQUEsTUFBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxHQUFBLEdBQUEsYUFBQTtZQUNBOztVQUVBLEdBQUEsZUFBQTtVQUNBLEdBQUEsT0FBQSxHQUFBLFlBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLFFBQUEsK0JBQUE7WUFDQSxPQUFBLEdBQUEsa0JBQUEsQ0FBQSxNQUFBLFNBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpR0FBQSxVQUFBLFFBQUEsVUFBQSxZQUFBLFlBQUEsZ0JBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQSxTQUFBLEtBQUE7SUFDQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBLEtBQUE7Ozs7OztBQ1ZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJKQUFBLFVBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQSxZQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsZ0JBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxrQkFBQTs7RUFFQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLE9BQUE7R0FDQSxXQUFBOzs7O0VBSUEsR0FBQSxVQUFBO0dBQ0EsVUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFVBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUEsU0FBQSxJQUFBLEtBQUE7S0FDQSxPQUFBLEdBQUEsaUNBQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTs7SUFFQSxTQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsaUNBQUEsQ0FBQSxHQUFBLEdBQUEsTUFBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLEdBQUE7O09BRUEsR0FBQSxVQUFBLFVBQUE7Ozs7OztHQU1BLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQTs7SUFFQSxXQUFBLFNBQUEsSUFBQSxLQUFBOztLQUVBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxXQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxlQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBOztPQUVBLEdBQUEsVUFBQSxhQUFBOzs7Ozs7O0dBT0EsT0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7Ozs7RUFLQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxRQUFBO0lBQ0EsS0FBQTtNQUNBLE9BQUEsR0FBQTtLQUNBO0lBQ0EsS0FBQTtNQUNBLE9BQUEsR0FBQTtLQUNBO0lBQ0EsS0FBQTtNQUNBLEdBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBLGdDQUFBO1NBQ0EsR0FBQSxPQUFBLE9BQUE7OztVQUdBO1FBQ0EsT0FBQSxHQUFBOztLQUVBO0lBQ0EsS0FBQTs7S0FFQTtJQUNBOzs7OztFQUtBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsV0FBQTtJQUNBLEdBQUEsT0FBQSxTQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsU0FBQTs7T0FFQTtJQUNBLEdBQUEsU0FBQSxTQUFBOztHQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOzs7UUFHQSxHQUFBLFFBQUEsS0FBQSxRQUFBLGtDQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7UUFFQSxHQUFBLFFBQUEsS0FBQSxRQUFBLCtCQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7Ozs7OztBQzNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLG9CQUFBLGFBQUEsZ0JBQUEsV0FBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLFdBQUE7RUFDQTs7RUFFQSxlQUFBLGlCQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO0dBQ0EsSUFBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLEdBQUEsVUFBQSxTQUFBLFlBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFlBQUEsU0FBQSxJQUFBO0tBQ0EsR0FBQSxPQUFBLElBQUEsU0FBQSxZQUFBO01BQ0EsYUFBQSxJQUFBLE1BQUE7Ozs7UUFJQSxHQUFBLEdBQUEsVUFBQSxNQUFBO0lBQ0EsYUFBQSxHQUFBLFVBQUEsTUFBQTs7R0FFQSxtQkFBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLHFDQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsU0FBQSxjQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsVUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLFFBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxhQUFBO0tBQ0EsR0FBQSxXQUFBOztRQUVBO0tBQ0EsR0FBQSxXQUFBOzs7O0VBSUEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUMzR0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUVBQUEsVUFBQSxZQUFBLFlBQUEsZ0JBQUE7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxhQUFBOzs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwySEFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLG9CQUFBLGFBQUEsZ0JBQUEsT0FBQTs7RUFFQSxJQUFBLEtBQUE7O0lBRUEsR0FBQSxRQUFBO0VBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0E7SUFDQSxHQUFBLFVBQUE7TUFDQSxRQUFBO1FBQ0EsVUFBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBOztJQUVBLGtCQUFBLFVBQUE7S0FDQSxJQUFBLE9BQUE7TUFDQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxTQUFBLEtBQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxJQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxXQUFBLEtBQUEsR0FBQSxNQUFBO09BQ0EsR0FBQSxXQUFBOzs7O0lBSUEsWUFBQSxTQUFBLE1BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxlQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO01BQ0EsV0FBQSxLQUFBLEdBQUEsTUFBQTtNQUNBLEdBQUEsWUFBQTs7OztNQUlBLFVBQUE7OztFQUdBOzs7RUFHQSxTQUFBLFFBQUE7OztFQUdBLFNBQUEsV0FBQSxNQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLEtBQUEsT0FBQSxLQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLE1BQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxXQUFBLE1BQUEsTUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxTQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUMvSkEsQ0FBQSxVQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLGVBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsZUFBQTs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDZJQUFBLFNBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxXQUFBLFdBQUEsZ0JBQUEsb0JBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFFBQUE7R0FDQSxJQUFBLENBQUE7R0FDQSxJQUFBOztFQUVBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsS0FBQTtLQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFVBQUEsTUFBQSxRQUFBLElBQUE7TUFDQSxHQUFBLEdBQUEsVUFBQSxNQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQTs7OztTQUlBLEdBQUEsQ0FBQSxHQUFBLE9BQUE7S0FDQSxHQUFBLFNBQUE7Ozs7Ozs7RUFPQSxTQUFBLFNBQUEsS0FBQTtHQUNBLFNBQUEsVUFBQTs7OztHQUlBO0VBQ0EsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSwyQkFBQTtLQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEtBQUEsR0FBQTs7T0FFQTtJQUNBLE9BQUEsR0FBQSwyQkFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBLElBQUEsS0FBQSxHQUFBLFVBQUEsTUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsUUFBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOztFQUVBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLHFCQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlQTtFQUNBLFNBQUEsYUFBQSxJQUFBLEVBQUE7R0FDQSxJQUFBLElBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsU0FBQSxhQUFBO0lBQ0EsR0FBQSxVQUFBO1VBQ0E7SUFDQSxPQUFBLE1BQUE7OztFQUdBLFNBQUEsUUFBQSxNQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0EsZUFBQSxpQkFBQSxHQUFBLFVBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxnQ0FBQTtLQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEtBQUE7O1NBRUEsR0FBQSxPQUFBLFFBQUEsUUFBQSwyQkFBQTtLQUNBLE9BQUEsR0FBQSwyQkFBQSxDQUFBLEtBQUE7O1FBRUE7S0FDQSxPQUFBLEdBQUEsMkJBQUEsQ0FBQSxLQUFBOztJQUVBLEdBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0tBQ0EsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7S0FDQSxHQUFBLEdBQUEsUUFBQTtNQUNBLEdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxJQUFBO09BQ0EsV0FBQTs7OztLQUlBLEdBQUEsTUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTtLQUNBLEdBQUEsTUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTs7O0tBR0EsR0FBQSxnQkFBQTtNQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUEsY0FBQTtNQUNBLE9BQUE7TUFDQSxNQUFBLEdBQUEsS0FBQTs7O0lBR0E7SUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLE9BQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsUUFBQTtJQUNBLEdBQUEsR0FBQSxRQUFBLE9BQUEsSUFBQTtNQUNBLFFBQUEsV0FBQTs7Ozs7O0dBTUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLEtBQUE7O01BRUEsSUFBQSxZQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztNQUlBOztHQUVBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLElBQUE7R0FDQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsV0FBQTtJQUNBLEdBQUEsUUFBQSxRQUFBLDJCQUFBOzs7Ozs7OztBQzNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4Q0FBQSxVQUFBLFNBQUEsTUFBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxxQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztHQUdBOzs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseURBQUEsU0FBQSxZQUFBLFFBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxnQkFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLEdBQUEsTUFBQSxrQkFBQTs7OztRQUlBLFNBQUEsU0FBQTtVQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxRQUFBLElBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxXQUFBLGFBQUEsTUFBQSxRQUFBLFlBQUEsV0FBQSxhQUFBO2FBQ0EsTUFBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLE1BQUEsd0NBQUE7Ozs7Ozs7QUNoQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrRUFBQSxTQUFBLFFBQUEsYUFBQSxrQkFBQSxvQkFBQTs7O0VBR0EsSUFBQSxPQUFBO0dBQ0EsVUFBQTtFQUNBLElBQUEsT0FBQSxhQUFBLEtBQUE7R0FDQSxPQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQSxtQkFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxXQUFBOztHQUVBLFNBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLFlBQUE7SUFDQSxLQUFBO0tBQ0EsTUFBQTtLQUNBLEtBQUEsc0ZBQUE7S0FDQSxNQUFBO0tBQ0EsY0FBQTtNQUNBLFFBQUE7TUFDQSxpQkFBQTtNQUNBLGNBQUE7Ozs7O0VBS0EsR0FBQSxjQUFBLEVBQUEsVUFBQSxtRkFBQSxRQUFBO0dBQ0EsUUFBQTtHQUNBLGlCQUFBO0dBQ0EsTUFBQTtHQUNBLGNBQUE7O0VBRUEsR0FBQSxZQUFBO0dBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFdBQUE7SUFDQSxLQUFBLENBQUE7SUFDQSxLQUFBLENBQUE7OztFQUdBLEdBQUEsV0FBQTtHQUNBLFFBQUE7O0VBRUEsR0FBQSxlQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBOzs7O0VBSUEsSUFBQSxZQUFBLEVBQUE7RUFDQSxVQUFBLFlBQUE7RUFDQSxVQUFBLGFBQUEsV0FBQTtHQUNBLEVBQUEsS0FBQSxXQUFBLE1BQUE7O0VBRUEsVUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFlBQUEsRUFBQSxRQUFBLE9BQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFFBQUEsT0FBQSxLQUFBLGtDQUFBO0dBQ0EsS0FBQSxjQUFBO0dBQ0EsRUFBQSxTQUFBLHdCQUFBO0dBQ0EsRUFBQSxTQUFBLFlBQUEsV0FBQSxTQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLEdBQUE7TUFDQSxHQUFBLFVBQUE7WUFDQTtNQUNBLElBQUEsU0FBQSxHQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBOzs7O0dBSUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQSxhQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLEdBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxHQUFBO0tBQ0EsR0FBQSxVQUFBO1dBQ0E7S0FDQSxJQUFBLFNBQUEsR0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLEdBQUEsVUFBQTs7Ozs7RUFLQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLG1CQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEscUVBQUEsbUJBQUEsWUFBQSwrQ0FBQSxtQkFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxhQUFBO0lBQ0EsaUJBQUEsQ0FBQSxtQkFBQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBLFNBQUEsU0FBQTtLQUNBLE9BQUEsUUFBQSxXQUFBOztJQUVBLFFBQUEsU0FBQSxTQUFBLFNBQUE7O0tBRUEsT0FBQTs7SUFFQSxPQUFBLFNBQUEsU0FBQTtLQUNBLElBQUEsUUFBQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE9BQUE7Ozs7R0FJQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsSUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEVBQUEsU0FBQSxRQUFBLFlBQUEsb0JBQUEsUUFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsSUFBQTs7O1VBR0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO1VBQ0EsR0FBQSxnQkFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztRQUdBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQSxLQUFBOztRQUVBLFNBQUEsWUFBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQTs7TUFFQSxTQUFBLGNBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO09BQ0E7O1FBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQTtZQUNBOzs7WUFHQSxHQUFBLEVBQUEsSUFBQTtjQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O1lBRUE7WUFDQSxnQkFBQSxFQUFBOzs7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4REFBQSxTQUFBLFFBQUEsZUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxhQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxPQUFBLFVBQUE7O1lBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsY0FBQSxLQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQTtjQUNBLGNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDbkJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLGNBQUE7O01BRUEsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFVBQUE7O1VBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLGNBQUE7Ozs7O01BS0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxjQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLFFBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbURBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnREFBQSxTQUFBLFFBQUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnRUFBQSxVQUFBLFFBQUEsY0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsbUJBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsVUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsV0FBQTtFQUNBLE9BQUEsT0FBQSxZQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLGFBQUE7TUFDQSxhQUFBLGFBQUEsS0FBQTtPQUNBLGFBQUE7T0FDQSxPQUFBOzs7S0FHQSxJQUFBLE9BQUEsYUFBQSxhQUFBO0tBQ0EsSUFBQSxPQUFBLFFBQUEsR0FBQSxhQUFBO01BQ0EsS0FBQSxlQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtNQUNBLEtBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLGNBQUE7TUFDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsS0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7TUFFQSxJQUFBLE9BQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7T0FDQSxLQUFBLFdBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7Ozs7O0dBTUEsY0FBQTtHQUNBLGFBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsWUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtHQUNBLGNBQUE7Ozs7Ozs7QUNwREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsUUFBQTs7WUFFQTtVQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1VBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFlBQUE7WUFDQSxPQUFBLGNBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGNBQUEsT0FBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0RBQUEsU0FBQSxPQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1dBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLEdBQUE7WUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUVBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxNQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7O0VBR0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTtPQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTthQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0tBSUEsR0FBQSxLQUFBLE9BQUEsS0FBQTs7O0dBR0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsY0FBQTs7S0FFQTs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMEJBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxVQUFBO2dCQUNBLFNBQUEsR0FBQTtlQUNBOzs7Ozs7OztBQ1RBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxNQUFBLE1BQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG9CQUFBLEdBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsb0JBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7S0FDQSxvQkFBQSxLQUFBOzs7O0VBSUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsV0FBQSxVQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsT0FBQSxNQUFBLGlDQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLFNBQUE7R0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBLFNBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUEsS0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxVQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLE1BQUEsWUFBQSxDQUFBLE1BQUE7S0FDQSxJQUFBLFlBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0dBSUEsT0FBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtPQUNBLFVBQUEsU0FBQSxPQUFBLEVBQUE7Ozs7T0FJQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxXQUFBLE9BQUEsRUFBQTs7OztHQUlBLEdBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxJQUFBLFlBQUEsVUFBQSxHQUFBLE1BQUEsR0FBQTtJQUNBLFVBQUEsU0FBQSxLQUFBLEdBQUE7OztPQUdBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBLEtBQUE7R0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsYUFBQSxHQUFBLEtBQUEsVUFBQTs7S0FFQTs7O0dBR0EsT0FBQSxRQUFBLDZCQUFBO0dBQ0EsT0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQTs7U0FFQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBOzs7O1FBSUE7S0FDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLEtBQUEsV0FBQTtTQUNBLElBQUEsU0FBQSxVQUFBLE1BQUEsR0FBQTtTQUNBLEdBQUEsQ0FBQSxPQUFBLFNBQUE7VUFDQSxPQUFBLFdBQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQSxPQUFBLFdBQUE7O1VBRUE7T0FDQSxHQUFBLFdBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUEsK0JBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7OztBQ25JQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxLQUFBLElBQUEsSUFBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7T0FDQSxPQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxNQUFBLGFBQUEsVUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUE7TUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO1FBQ0EsU0FBQTtRQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBOztLQUVBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsY0FBQTtPQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7O1VBR0E7T0FDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsSUFBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7OztJQU9BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBO0tBQ0EsU0FBQSxZQUFBO09BQ0EsVUFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBOztNQUVBOzs7Ozs7OztBQ2xKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsa0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsSUFBQTtHQUNBLEdBQUEsR0FBQSxlQUFBLElBQUE7SUFDQSxHQUFBLGNBQUE7O09BRUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsR0FBQSxZQUFBOztPQUVBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7OztFQUdBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUE7O0dBRUEsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQTtPQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUEsV0FBQSxRQUFBLE1BQUE7OztJQUdBLEdBQUEsWUFBQTs7Ozs7Ozs7Ozs7OztBQ3hGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7O0VBRUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsS0FBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLE9BQUEsZUFBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0dBQ0EsT0FBQSxlQUFBLEdBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsOEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsV0FBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBOzs7O09BSUE7SUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsNEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsUUFBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsU0FBQSxJQUFBLEtBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsWUFBQSxPQUFBLEtBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDekZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsRUFBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsTUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7O0lBR0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxLQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7O0tBRUEsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7T0FFQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7O0tBR0EsR0FBQSxTQUFBLFNBQUEsS0FBQTtNQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsU0FBQSxNQUFBO01BQ0EsWUFBQSxLQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBLFNBQUE7O0tBRUEsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsU0FBQSxVQUFBOztLQUVBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBOztLQUVBLFFBQUEsY0FBQTtLQUNBLFFBQUE7Ozs7SUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsUUFBQSxPQUFBLEdBQUEsUUFBQSxFQUFBO0tBQ0EsV0FBQSxJQUFBLE9BQUE7T0FDQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBO0tBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7TUFDQSxTQUFBLE9BQUE7UUFDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO1FBQ0EsS0FBQSxjQUFBLE1BQUE7UUFDQSxLQUFBLGdCQUFBLE1BQUE7O0tBRUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUEsSUFBQSxFQUFBLE1BQUE7S0FDQSxPQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsR0FBQSxRQUFBLFlBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxVQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsQ0FBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0E7O01BRUEsWUFBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxZQUFBLFVBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTthQUNBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7O0tBSUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7TUFDQSxHQUFBLE1BQUEsR0FBQSxPQUFBOztNQUVBLE1BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLEdBQUEsSUFBQSxPQUFBLFFBQUEsWUFBQSxJQUFBO1NBQ0EsWUFBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO1NBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxJQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7OztNQUtBLElBQUEsR0FBQSxNQUFBO1FBQ0EsT0FBQSxDQUFBLEtBQUE7UUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLE1BQUE7TUFDQSxNQUFBLEVBQUE7U0FDQSxPQUFBLENBQUEsR0FBQTtTQUNBLEdBQUEsU0FBQTtTQUNBLEdBQUEsWUFBQTtNQUNBLE9BQUEsT0FBQSxlQUFBLEtBQUE7TUFDQSxRQUFBLE9BQUEsZUFBQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsR0FBQSxJQUFBLE9BQUEsUUFBQSxZQUFBLElBQUE7U0FDQSxZQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7U0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLElBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7QUMxUkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOztLQUVBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsTUFBQSxVQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsVUFBQSxJQUFBLEtBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUE7UUFDQTtZQUNBLE9BQUEsRUFBQTs7UUFFQSxJQUFBLEtBQUEsR0FBQSxTQUFBO1FBQ0EsTUFBQSxPQUFBLFFBQUE7UUFDQSxNQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDJEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTtDQUNBLE1BQUEsU0FBQTtLQUNBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxLQUFBLEdBQUE7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQTs7O1FBR0EsR0FBQSxJQUFBLE9BQUEsVUFBQSxFQUFBO1NBQ0EsTUFBQSxPQUFBLEtBQUEsSUFBQSxLQUFBOztZQUVBO1NBQ0EsUUFBQSxJQUFBOzs7T0FHQSxTQUFBLFVBQUE7UUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7OztBQ3hFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSw4QkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw2REFBQSxVQUFBLFFBQUEsVUFBQSxRQUFBLGNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7TUFDQSxhQUFBO01BQ0EsUUFBQSxJQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTs7O09BR0EsT0FBQSxVQUFBLE9BQUE7UUFDQSxRQUFBLFFBQUEsTUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBOztTQUVBLElBQUEsSUFBQTtVQUNBLEtBQUE7VUFDQSxPQUFBOztTQUVBLFFBQUEsUUFBQSxLQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtZQUNBLElBQUEsUUFBQTthQUNBLE1BQUE7YUFDQSxTQUFBO2FBQ0EsUUFBQTthQUNBLE9BQUE7O1lBRUEsRUFBQSxPQUFBLEtBQUE7WUFDQSxPQUFBLEtBQUE7Ozs7U0FJQSxJQUFBLFlBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtXQUNBLElBQUEsSUFBQSxVQUFBLEdBQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBLFFBQUEsYUFBQTthQUNBLFFBQUEsS0FBQSxPQUFBOztZQUVBLFFBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7Z0JBSUE7O1VBRUEsRUFBQSxPQUFBOztVQUVBLGFBQUEsUUFBQTs7Ozs7O09BTUEsa0JBQUEsVUFBQSxPQUFBOzs7UUFHQSxJQUFBLFFBQUEsTUFBQSxNQUFBLGNBQUE7UUFDQSxJQUFBLFlBQUE7UUFDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxNQUFBOztRQUVBLElBQUEsU0FBQSxTQUFBLEdBQUE7U0FDQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTtTQUNBLFlBQUE7O1FBRUEsSUFBQSxRQUFBOztRQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsS0FBQTtTQUNBLElBQUEsU0FBQSxJQUFBO1VBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGVBQUEsS0FBQTtVQUNBLElBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEdBQUE7V0FDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7VUFFQSxJQUFBLE9BQUEsU0FBQSxHQUFBLE1BQUE7VUFDQSxJQUFBLEtBQUEsU0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBO1dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsS0FBQTthQUNBLElBQUEsSUFBQSxHQUFBO2NBQ0EsU0FBQSxNQUFBOzthQUVBLFNBQUEsTUFBQSxLQUFBOzs7OztVQUtBLElBQUEsU0FBQSxHQUFBLFVBQUEsR0FBQTtXQUNBLE1BQUEsS0FBQTs7OztRQUlBLElBQUEsU0FBQSxVQUFBLE1BQUEsUUFBQTtTQUNBLGFBQUE7U0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7VUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsYUFBQTtXQUNBLFFBQUEsU0FBQSxNQUFBOztVQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7Ozs7UUFJQSxPQUFBLFNBQUEsS0FBQSxhQUFBLE1BQUEsT0FBQTs7T0FFQSxPQUFBLFVBQUEsS0FBQSxNQUFBO1FBQ0EsYUFBQSxNQUFBOztPQUVBLFVBQUEsVUFBQSxTQUFBOztRQUVBLGFBQUEsVUFBQTs7O1FBR0EsSUFBQSxDQUFBLFlBQUE7U0FDQSxRQUFBLFFBQUEsYUFBQSxnQkFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLFlBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxjQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsZ0JBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsS0FBQSxLQUFBLFdBQUEsVUFBQSxHQUFBO1dBQ0EsYUFBQSxhQUFBOzs7ZUFHQTtTQUNBLFFBQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsS0FBQSxTQUFBO1VBQ0EsSUFBQSxLQUFBLGlCQUFBLGVBQUEsT0FBQSxPQUFBLGFBQUE7V0FDQSxJQUFBLElBQUE7WUFDQSxLQUFBLElBQUE7O1dBRUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLFFBQUEsR0FBQTtZQUNBLEVBQUEsWUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO2FBQ0EsSUFBQSxPQUFBLFdBQUEsaUJBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtjQUNBLEtBQUEsT0FBQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFNBQUE7ZUFDQSxRQUFBOztjQUVBOzs7OztXQUtBLGFBQUEsUUFBQTtZQUNBLE1BQUEsQ0FBQTtZQUNBLFFBQUEsS0FBQTs7OztTQUlBLGFBQUEsWUFBQTs7UUFFQSxhQUFBO1FBQ0EsU0FBQSxVQUFBO1NBQ0EsT0FBQSxLQUFBLGFBQUEsZ0JBQUEsb0JBQUE7U0FDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsTUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7S0FFQSxTQUFBLFNBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsV0FBQTs7SUFFQSxJQUFBLElBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLElBQUEsS0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxTQUFBO09BQ0EsT0FBQTthQUNBLEtBQUEsYUFBQSxhQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLEVBQUE7OztRQUdBLElBQUEsTUFBQSxHQUFBO01BQ0E7TUFDQSxZQUFBLE9BQUEsSUFBQTtNQUNBLFlBQUEsT0FBQSxJQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTs7O1FBR0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUEsUUFBQSxLQUFBLEtBQUE7YUFDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTthQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTthQUNBLEdBQUEsWUFBQSxXQUFBLEdBQUEsV0FBQTtJQUNBLElBQUEsS0FBQTtPQUNBLE1BQUEsTUFBQTtPQUNBLFVBQUE7T0FDQSxLQUFBO09BQ0E7T0FDQSxPQUFBO09BQ0EsS0FBQSxLQUFBO1dBQ0EsS0FBQSxTQUFBLEdBQUEsRUFBQSxLQUFBLFdBQUE7V0FDQSxNQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7T0FDQSxNQUFBLFVBQUE7V0FDQSxHQUFBLFNBQUE7O1FBRUEsR0FBQSxTQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLGFBQUEsU0FBQTtpQkFDQSxVQUFBLEtBQUE7OztJQUdBLElBQUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtJQUNBLFNBQUEsV0FBQSxFQUFBO0tBQ0EsTUFBQSxRQUFBLENBQUEsUUFBQSxFQUFBLEtBQUE7O1FBRUEsU0FBQSxVQUFBLEVBQUE7O01BRUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtZQUNBLE1BQUEsYUFBQSxDQUFBLEVBQUEsS0FBQTtNQUNBLE1BQUE7OztRQUdBLFNBQUEsU0FBQSxFQUFBOztZQUVBLE1BQUEsYUFBQTtNQUNBLE1BQUE7Ozs7UUFJQSxTQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLEVBQUE7WUFDQSxPQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsSUFBQSxFQUFBOztJQUVBLFNBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLEVBQUE7OztJQUdBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTs7Ozs7Ozs7O0FDaEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7O0dBRUEsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLEtBQUE7TUFDQSxPQUFBO01BQ0EsUUFBQTtNQUNBLE1BQUE7O0tBRUEsUUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsU0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFFBQUE7OztJQUdBLElBQUEsUUFBQTtLQUNBLEdBQUEsR0FBQSxNQUFBOztJQUVBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQTtJQUNBLE1BQUEsRUFBQSxNQUFBLENBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxPQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxPQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxTQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQSxXQUFBLFNBQUEsV0FBQSxHQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLEtBQUEsU0FBQTtJQUNBLElBQUEsWUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLFNBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7OztLQVlBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7Ozs7Ozs7SUFVQSxJQUFBLFlBQUE7TUFDQSxPQUFBOztJQUVBLFVBQUEsS0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7UUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsQ0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLGFBQUE7TUFDQSxPQUFBO0lBQ0EsV0FBQSxLQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxTQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7SUFJQSxTQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7S0FDQSxJQUFBO0tBQ0EsU0FBQSxPQUFBLElBQUEsS0FBQSxNQUFBO0tBQ0EsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxDQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxDQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUEsQ0FBQTtNQUNBLFVBQUEsTUFBQTs7S0FFQSxVQUFBO0tBQ0EsT0FBQTs7SUFFQSxNQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUE7OztNQUdBLFVBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO1FBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxHQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsR0FBQTtTQUNBLFVBQUE7O1FBRUEsT0FBQSxjQUFBLEtBQUEsV0FBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLFVBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsRUFBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxVQUFBLEdBQUE7U0FDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7U0FHQSxLQUFBLE9BQUEsU0FBQSxHQUFBLEVBQUE7UUFDQSxFQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUE7Ozs7Ozs7Ozs7OztBQzlKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxHQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQTs7R0FFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE1BQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBOzs7SUFHQSxvQkFBQTs7SUFFQSxRQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxRQUFBO0tBQ0EsWUFBQTs7SUFFQSxPQUFBO0tBQ0EsYUFBQTs7Ozs7R0FLQSxJQUFBLEdBQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxRQUFBLElBQUEsR0FBQTtHQUNBLE9BQUEsR0FBQTs7RUFFQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsR0FBQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7OztHQUdBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxRQUFBLFVBQUEsUUFBQTtJQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUE7R0FDQTtFQUNBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQTtHQUNBOzs7RUFHQSxPQUFBLE9BQUEsZ0JBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7Ozs7QUNqSUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsa0JBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxVQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsTUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBOzs7RUFHQSxTQUFBLGNBQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLEtBQUEsT0FBQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxZQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsS0FBQTtJQUNBLEdBQUEsY0FBQTtLQUNBLEdBQUEsUUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBLDRCQUFBOzs7Ozs7O0FDNUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7O0tBRUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTs7O0tBR0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7SUFZQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDeFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBLE1BQUEsY0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDckZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsV0FBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxnQ0FBQSxTQUFBLGlCQUFBO0VBQ0EsSUFBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLE1BQUE7R0FDQSxNQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsV0FBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTs7R0FFQSxRQUFBO0dBQ0EsU0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFlBQUEsYUFBQTtRQUNBLFFBQUEsT0FBQSxTQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7Ozs7OztBQzNCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxhQUFBLFlBQUE7SUFDQSxHQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsVUFBQSxFQUFBO0lBQ0EsR0FBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsUUFBQTs7O0dBR0EsR0FBQSxRQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLE9BQUE7O09BRUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxRQUFBLG9CQUFBO0lBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxNQUFBOztHQUVBLEtBQUEsV0FBQTtHQUNBLEtBQUEsV0FBQTs7O0VBR0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsU0FBQTtJQUNBLEdBQUEsU0FBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLFFBQUE7OztHQUdBLE9BQUE7Ozs7Ozs7RUFPQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtLQUNBLFFBQUE7O0lBRUEsR0FBQSxDQUFBLE1BQUE7S0FDQSxTQUFBLGNBQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE9BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ2pCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5QkFBQSxTQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxVQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0tBQ0EsTUFBQSxTQUFBLE1BQUEsR0FBQSxNQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsR0FBQSxNQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE1BQUE7S0FDQSxNQUFBLFNBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsSUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsVUFBQTs7R0FFQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnRkJBbmd1bGFyJywnZG5kTGlzdHMnLCdhbmd1bGFyLmZpbHRlcicsJ2FuZ3VsYXJNb21lbnQnLCduZ1Njcm9sbGJhcicsJ21kQ29sb3JQaWNrZXInLCduZ0FuaW1hdGUnLCd1aS50cmVlJywndG9hc3RyJywndWkucm91dGVyJywgJ21kLmRhdGEudGFibGUnLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsICduZ1Nhbml0aXplJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdudmQzJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWydhbmd1bGFyLWNhY2hlJywndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdFx0Ly9cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKSB7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hlYWRlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fSxcblx0XHRcdFx0XHQnbWFwQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXAnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdNYXBDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGVtZW51QCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzaWRlbWVudScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NpZGVtZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5ob21lJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0dmlld3M6IHtcblxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdob21lJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbihEYXRhU2VydmljZSwgJGF1dGgpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdtZScpLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2luZGV4Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGNvdW50cmllczogZnVuY3Rpb24oQ291bnRyaWVzU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YScsIHtcblx0XHRcdFx0dXJsOiAnL215LWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE15RGF0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEuZW50cnknLCB7XG5cdFx0XHRcdHVybDogJy86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFFbnRyeUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3R5bGVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0dHJlZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3JzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGljYXRvci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3I6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycsIHtcblx0XHRcdFx0dXJsOiAnL2luZGl6ZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRleDogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZVBhcmFtcy5pZCA9PSAwKSByZXR1cm4ge307XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SXRlbSgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JpbmRpemVzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yaW5kaXplc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YS5hZGQnLCB7XG5cdFx0XHRcdHVybDogJy9hZGQnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdhZGRpdGlvbmFsQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRpY2F0b3JzLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5pZGNhdG9yc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzLmluZGljYXRvci5kZXRhaWxzJywge1xuXHRcdFx0XHR1cmw6ICcvOmVudHJ5Jyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93J1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJywge1xuXHRcdFx0XHR1cmw6ICcvY2F0ZWdvcmllcycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmNhdGVnb3J5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yY2F0ZWdvcnlDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcnk6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkc3RhdGVQYXJhbXMuaWQgPT0gJ25ldycpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHt9O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcnkoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhjcmVhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhjcmVhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnLCB7XG5cdFx0XHRcdHVybDogJy9iYXNpYycsXG5cdFx0XHRcdGF1dGg6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jaGVjaycsIHtcblx0XHRcdFx0dXJsOiAnL2NoZWNraW5nJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhDaGVjaycpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja1NpZGViYXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNZXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNZXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2ZpbmFsJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhGaW5hbCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4RmluYWxDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbE1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lmxpc3QnLCB7XG5cdFx0XHRcdHVybDogJy9saXN0Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjYXRlZ29yaWVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHRyZWU6IHRydWVcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmdWxsTGlzdCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Z1bGxMaXN0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5saXN0LmZpbHRlcicse1xuXHRcdFx0XHR1cmw6Jy86ZmlsdGVyJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2Z1bGxMaXN0L2ZpbHRlci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGdWxsTGlzdEZpdGxlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2luZGljYXRvci86aWQvOm5hbWUnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kaWNhdG9yOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3IoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGljYXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvclNob3dDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicsIHtcblx0XHRcdFx0dXJsOiAnLzp5ZWFyJyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJywge1xuXHRcdFx0XHR1cmw6ICcvZGV0YWlscycsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSgkc3RhdGVQYXJhbXMuaWQsICRzdGF0ZVBhcmFtcy55ZWFyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppZC86bmFtZScsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oSW5kaXplc1NlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBJbmRpemVzU2VydmljZS5mZXRjaERhdGEoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y291bnRyaWVzOiBmdW5jdGlvbihDb3VudHJpZXNTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXgvc2VsZWN0ZWQuaHRtbCcsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5pbmZvJywge1xuXHRcdFx0XHR1cmw6ICcvaW5mbycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5mb0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4aW5mbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0dXJsOiAnLzppdGVtJyxcblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J3NlbGVjdGVkJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWxlY3RlZEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGdldENvdW50cnk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCAkc3RhdGVQYXJhbXMuaXRlbSkuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS86Y291bnRyaWVzJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2NvbmZsaWN0Jyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleCcsIHtcblx0XHRcdFx0dXJsOiAnL2luZGV4Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdG5hdGlvbnM6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjb25mbGljdHMvbmF0aW9ucycpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y29uZmxpY3RzOiBmdW5jdGlvbihSZXN0YW5ndWxhcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdHMnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicsIHtcblx0XHRcdFx0dXJsOiAnL25hdGlvbi86aXNvJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdG5hdGlvbjogZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnL2NvbmZsaWN0cy9uYXRpb25zLycsICRzdGF0ZVBhcmFtcy5pc28pLmdldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RuYXRpb25DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdG5hdGlvbicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbG9nb0AnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9nbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXguZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRjb25mbGljdDogZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnL2NvbmZsaWN0cy9ldmVudHMvJywgJHN0YXRlUGFyYW1zLmlkKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0ZGV0YWlsc0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NvbmZsaWN0ZGV0YWlscycpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnaXRlbXMtbWVudUAnOiB7fSxcblx0XHRcdFx0XHQnbG9nb0AnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9nbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW1wb3J0Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0Jyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RJbXBvcnRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdEltcG9ydCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRtZFNpZGVuYXYsICR0aW1lb3V0LCAkYXV0aCwgJHN0YXRlLCAkbG9jYWxTdG9yYWdlLCAkd2luZG93LCBsZWFmbGV0RGF0YSwgdG9hc3RyKSB7XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgfHwgZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdCRyb290U2NvcGUudG9nZ2xlTWVudSA9IGZ1bmN0aW9uKG1lbnVJZCkge1xuXHRcdFx0JG1kU2lkZW5hdihtZW51SWQpLnRvZ2dsZSgpO1xuXHRcdH1cblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblx0XHRcdGlmICh0b1N0YXRlLmF1dGggJiYgISRhdXRoLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignWW91ciBub3QgYWxsb3dlZCB0byBnbyB0aGVyZSBidWRkeSEnLCAnQWNjZXNzIGRlbmllZCcpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5sYXlvdXQgPT0gXCJyb3dcIikge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUucm93ZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgdG9TdGF0ZS52aWV3cyAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdtYWluQCcpIHx8IHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2FkZGl0aW9uYWxAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLm1haW5WaWV3ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLm1haW5WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2FkZGl0aW9uYWxAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdpdGVtcy1tZW51QCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdsb2dvQCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5sb2dvVmlldyA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5sb2dvVmlldyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5pdGVtTWVudSA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLm5hbWUuaW5kZXhPZignY29uZmxpY3QnKSA+IC0xICYmIHRvU3RhdGUubmFtZSAhPSBcImFwcC5jb25mbGljdC5pbXBvcnRcIikge1xuXHRcdFx0XHQkcm9vdFNjb3BlLm5vSGVhZGVyID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUubm9IZWFkZXIgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc2hvd0l0ZW1zID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc2hvd0l0ZW1zID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtcblx0XHRcdFx0c3RhdGU6IGZyb21TdGF0ZSxcblx0XHRcdFx0cGFyYW1zOiBmcm9tUGFyYW1zXG5cdFx0XHR9O1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKTtcblxuXG5cdFx0fSk7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpIHtcblxuXHRcdH0pO1xuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKSB7XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdFx0JG1kU2lkZW5hdignbGVmdE1lbnUnKS5jbG9zZSgpO1xuXHRcdFx0fVxuXHRcdFx0cmVzZXRNYXBTaXplKCk7XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKSB7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fVxuXHRcdC8qd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGV2KSB7XG4gICAgLy8gYXZvaWRzIHNjcm9sbGluZyB3aGVuIHRoZSBmb2N1c2VkIGVsZW1lbnQgaXMgZS5nLiBhbiBpbnB1dFxuICAgIGlmIChcbiAgICAgICAgIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keVxuICAgICkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbEludG9WaWV3SWZOZWVkZWQodHJ1ZSk7XG4gICAgfVxufSk7Ki9cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpIHtcblx0XHQvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG5cdFx0Ly8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cblx0XHQkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgnO1xuICAgICRhdXRoUHJvdmlkZXIuc2lnbnVwVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvc2lnbnVwJztcbiAgICAkYXV0aFByb3ZpZGVyLnVubGlua1VybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoL3VubGluay8nO1xuXHRcdCRhdXRoUHJvdmlkZXIuZmFjZWJvb2soe1xuXHRcdFx0dXJsOiAnL2FwaS9hdXRoZW50aWNhdGUvZmFjZWJvb2snLFxuXHRcdFx0Y2xpZW50SWQ6ICc3NzE5NjE4MzI5MTAwNzInXG5cdFx0fSk7XG5cdFx0JGF1dGhQcm92aWRlci5nb29nbGUoe1xuXHRcdFx0dXJsOiAnL2FwaS9hdXRoZW50aWNhdGUvZ29vZ2xlJyxcblx0XHRcdGNsaWVudElkOiAnMjc2NjM0NTM3NDQwLWNndHQxNHFqMmU4aW5wMHZxNW9xOWI0Nms3NGpqczNlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJGxvZ1Byb3ZpZGVyKXtcbiAgICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHRcdC5zZXRCYXNlVXJsKCcvYXBpLycpXG5cdFx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoe1xuXHRcdFx0XHRhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIlxuXHRcdFx0fSlcblx0XHRcdC5zZXREZWZhdWx0SHR0cEZpZWxkcyh7XG5cdFx0XHRcdGNhY2hlOiB0cnVlXG5cdFx0XHR9KVxuXHRcdFx0LmFkZFJlc3BvbnNlSW50ZXJjZXB0b3IoZnVuY3Rpb24oZGF0YSwgb3BlcmF0aW9uLCB3aGF0LCB1cmwsIHJlc3BvbnNlLCBkZWZlcnJlZCkge1xuXHRcdFx0XHR2YXIgZXh0cmFjdGVkRGF0YTtcblx0XHRcdFx0ZXh0cmFjdGVkRGF0YSA9IGRhdGEuZGF0YTtcblx0XHRcdFx0aWYgKGRhdGEubWV0YSkge1xuXHRcdFx0XHRcdGV4dHJhY3RlZERhdGEuX21ldGEgPSBkYXRhLm1ldGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGEuaW5jbHVkZWQpIHtcblx0XHRcdFx0XHRleHRyYWN0ZWREYXRhLl9pbmNsdWRlZCA9IGRhdGEuaW5jbHVkZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGV4dHJhY3RlZERhdGE7XG5cdFx0XHR9KTtcblx0XHQvKlx0LnNldEVycm9ySW50ZXJjZXB0b3IoZnVuY3Rpb24ocmVzcG9uc2UsIGRlZmVycmVkLCByZXNwb25zZUhhbmRsZXIpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJybycpO1xuXHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XG5cbiAgICBcdFx0cmV0dXJuIGZhbHNlOyAvLyBlcnJvciBoYW5kbGVkXG4gICAgXHR9XG5cbiAgICBcdHJldHVybiB0cnVlOyAvLyBlcnJvciBub3QgaGFuZGxlZFxuXHRcdH0pOyovXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIsJG1kR2VzdHVyZVByb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cbi8qXHR2YXIgbmVvblRlYWxNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnMDBjY2FhJ1xuICB9KTtcblx0dmFyIHdoaXRlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJyNmZmYnXG4gIH0pO1xuXHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdibHVlJywge1xuICAgICc1MDAnOiAnIzAwNmJiOScsXG5cdFx0J0EyMDAnOiAnIzAwNmJiOSdcbiAgfSk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCduZW9uVGVhbCcsIG5lb25UZWFsTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ3doaXRlVGVhbCcsIHdoaXRlTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2xpZ2h0LWJsdWUnKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdibHVlcicpOyovXG5cdFx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnaW5kaWdvJywge1xuXHRcdFx0JzUwMCc6ICcjMDA2YmI5Jyxcblx0XHRcdCdBMjAwJzogJyMwMDZiYjknXG5cdFx0fSk7XG5cdFx0XHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblxuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdibHVlcicpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuXHRcdC53YXJuUGFsZXR0ZSgncmVkJyk7XG5cblx0XHQgJG1kR2VzdHVyZVByb3ZpZGVyLnNraXBDbGlja0hpamFjaygpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24odG9hc3RyQ29uZmlnKXtcbiAgICAgICAgLy9cbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgYXV0b0Rpc21pc3M6IHRydWUsXG4gICAgICAgICAgY29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuICAgICAgICAgIG1heE9wZW5lZDogMixcbiAgICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgICBwb3NpdGlvbkNsYXNzOiAndG9hc3QtYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgcHJldmVudE9wZW5EdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBwcm9ncmVzc0Jhcjp0cnVlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdhbHBoYW51bScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBpZiAoICFpbnB1dCApe1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC8oW14wLTlBLVpdKS9nLFwiXCIpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdmaW5kYnluYW1lJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG5hbWUsIGZpZWxkKSB7XG5cdFx0XHQvL1xuICAgICAgdmFyIGZvdW5kcyA9IFtdO1xuXHRcdFx0dmFyIGkgPSAwLFxuXHRcdFx0XHRsZW4gPSBpbnB1dC5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0aWYgKGlucHV0W2ldW2ZpZWxkXS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XG5cdFx0XHRcdFx0IGZvdW5kcy5wdXNoKGlucHV0W2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZvdW5kcztcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ25ld2xpbmUnLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHRleHQgKXtcbiAgICAgICAgICAgIC8vXG4gICAgXG4gICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvKFxcXFxyKT9cXFxcbi9nLCAnPGJyIC8+PGJyIC8+Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcignT3JkZXJPYmplY3RCeScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBhdHRyaWJ1dGUpIHtcblx0XHRcdGlmICghYW5ndWxhci5pc09iamVjdChpbnB1dCkpIHJldHVybiBpbnB1dDtcblxuXHRcdFx0dmFyIGFycmF5ID0gW107XG5cdFx0XHRmb3IgKHZhciBvYmplY3RLZXkgaW4gaW5wdXQpIHtcblx0XHRcdFx0YXJyYXkucHVzaChpbnB1dFtvYmplY3RLZXldKTtcblx0XHRcdH1cblxuXHRcdFx0YXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRhID0gcGFyc2VJbnQoYVthdHRyaWJ1dGVdKTtcblx0XHRcdFx0YiA9IHBhcnNlSW50KGJbYXR0cmlidXRlXSk7XG5cdFx0XHRcdHJldHVybiBhIC0gYjtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGFycmF5O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3Byb3BlcnR5JywgcHJvcGVydHkpO1xuXHRmdW5jdGlvbiBwcm9wZXJ0eSgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGFycmF5LCB5ZWFyX2ZpZWxkLCB2YWx1ZSkge1xuXG4gICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKyl7XG5cbiAgICAgICAgaWYoYXJyYXlbaV0uZGF0YVt5ZWFyX2ZpZWxkXSA9PSB2YWx1ZSl7XG4gICAgICAgICAgaXRlbXMucHVzaChhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblx0fVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBjaGFycywgYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihjaGFycykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhcnMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dC5sZW5ndGggPiBjaGFycykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuICAgICAgICAgICAgICAgIGlmICghYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBsYXN0IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGgtMSkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0ICsgJy4uLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVXb3JkcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgd29yZHMpIHtcbiAgICAgICAgICAgIGlmIChpc05hTih3b3JkcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod29yZHMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dFdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRXb3Jkcy5sZW5ndGggPiB3b3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0V29yZHMuc2xpY2UoMCwgd29yZHMpLmpvaW4oJyAnKSArICcuLi4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NvbnRlbnRTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRmaWx0ZXIpIHtcblx0XHQvL1xuXHRcdGZ1bmN0aW9uIHNlYXJjaEZvckl0ZW0obGlzdCxpZCl7XG5cblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDtpKyspe1xuXHRcdFx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0XHRcdGlmKGl0ZW0uaWQgPT0gaWQpe1xuXHRcdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uY2hpbGRyZW4pe1xuXHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSBzZWFyY2hGb3JJdGVtKGl0ZW0uY2hpbGRyZW4sIGlkKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRjb250ZW50OiB7XG5cdFx0XHRcdGluZGljYXRvcnM6IFtdLFxuXHRcdFx0XHRpbmRpY2F0b3I6IHt9LFxuXHRcdFx0XHRkYXRhOiBbXSxcblx0XHRcdFx0Y2F0ZWdvcmllczogW10sXG5cdFx0XHRcdGNhdGVnb3J5OiB7fSxcblx0XHRcdFx0c3R5bGVzOiBbXSxcblx0XHRcdFx0aW5mb2dyYXBoaWNzOiBbXSxcblx0XHRcdFx0aW5kaWNlczpbXVxuXHRcdFx0fSxcblx0XHRcdGJhY2t1cDp7fSxcblx0XHRcdGZldGNoSW5kaWNlczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvaW5kaXplcycpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3JzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzJywgZmlsdGVyKS4kb2JqZWN0XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hDYXRlZ29yaWVzOiBmdW5jdGlvbihmaWx0ZXIsIHdpdGhvdXRTYXZlKSB7XG5cdFx0XHRcdGlmKHdpdGhvdXRTYXZlKXtcblx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnY2F0ZWdvcmllcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaFN0eWxlczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNlczogZnVuY3Rpb24oZmlsdGVyKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2VzKGZpbHRlcik7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2VzO1xuXHRcdFx0fSxcblx0XHRcdGdldENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlciwgd2l0aG91dFNhdmUpIHtcblx0XHRcdFx0aWYod2l0aG91dFNhdmUpe1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoQ2F0ZWdvcmllcyhmaWx0ZXIsIHdpdGhvdXRTYXZlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaENhdGVnb3JpZXMoZmlsdGVyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3JpZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNhdG9ycyhmaWx0ZXIpO1xuXG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3R5bGVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5zdHlsZXMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaFN0eWxlcyhmaWx0ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc3R5bGVzO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvcjogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnNbaV0uaWQgPT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljYXRvcihpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9yID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzLycgKyBpZCkuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvclByb21pc2U6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGljYXRvcnMnLGlkKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JEYXRhOiBmdW5jdGlvbihpZCwgeWVhcikge1xuXHRcdFx0XHRpZiAoeWVhcikge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEvJyArIHllYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycy8nICsgaWQgKyAnL2RhdGEnKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRJdGVtOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0LypcdGlmKHRoaXMuY29udGVudC5pbmRpY2VzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdCB0aGlzLmNvbnRlbnQuZGF0YSA9IHNlYXJjaEZvckl0ZW0odGhpcy5jb250ZW50LmluZGljZXMsIGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNleyovXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nLCBpZClcblx0XHRcdFx0Ly99XG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlQ29udGVudDpmdW5jdGlvbihpZCwgbGlzdCl7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5LmlkID09IGlkKXtcblx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHRoYXQucmVtb3ZlQ29udGVudChpZCwgZW50cnkuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0ZmluZENvbnRlbnQ6ZnVuY3Rpb24oaWQsIGxpc3Qpe1xuXHRcdFx0XHR2YXIgZm91bmQgPSBudWxsO1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0XHRmb3VuZCA9IGVudHJ5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbiAmJiBlbnRyeS5jaGlsZHJlbi5sZW5ndGggJiYgIWZvdW5kKXtcblx0XHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSB0aGF0LmZpbmRDb250ZW50KGlkLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHN1YnJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0XHR9LFxuXHRcdFx0YWRkSXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHRoaXMuY29udGVudC5pbmRpY2VzLnB1c2goaXRlbSlcblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVJdGVtOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ29udGVudChpZCwgdGhpcy5jb250ZW50LmluZGljZXMpO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UucmVtb3ZlKCdpbmRleC8nLCBpZCk7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlSXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZhciBlbnRyeSA9IHRoaXMuZmluZENvbnRlbnQoaXRlbS5pZCwgdGhpcy5jb250ZW50LmluZGljZXMpO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGVudHJ5LCBpdGVtKTtcblx0XHRcdFx0cmV0dXJuIGVudHJ5ID0gaXRlbTtcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbmRDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yeSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY2F0ZWdvcmllcy8nICsgaWQpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDYXRlZ29yeTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLnJlbW92ZSgnY2F0ZWdvcmllcy8nLCBpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZmlsdGVyTGlzdDogZnVuY3Rpb24odHlwZSwgZmlsdGVyLCBsaXN0KXtcblx0XHRcdFx0aWYobGlzdC5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRpZighdGhpcy5iYWNrdXBbdHlwZV0pe1xuXHRcdFx0XHRcdFx0dGhpcy5iYWNrdXBbdHlwZV0gPSBhbmd1bGFyLmNvcHkodGhpcy5jb250ZW50W3R5cGVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV0gPSAkZmlsdGVyKCdmaWx0ZXInKSh0aGlzLmNvbnRlbnRbdHlwZV0sIGZpbHRlcilcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNvbnRlbnRbdHlwZV0gPSBhbmd1bGFyLmNvcHkodGhpcy5iYWNrdXBbdHlwZV0pO1xuXHRcdFx0XHRkZWxldGUgdGhpcy5iYWNrdXBbdHlwZV07XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV07XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXRGaWx0ZXI6IGZ1bmN0aW9uKHR5cGUpe1xuXHRcdFx0XHRpZighdGhpcy5iYWNrdXBbdHlwZV0pIHJldHVybiB0aGlzLmNvbnRlbnRbdHlwZV07XG5cdFx0XHRcdHRoaXMuY29udGVudFt0eXBlXSA9IGFuZ3VsYXIuY29weSh0aGlzLmJhY2t1cFt0eXBlXSk7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmJhY2t1cFt0eXBlXTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudFt0eXBlXTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ291bnRyaWVzU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb3VudHJpZXM6IFtdLFxuICAgICAgICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcyA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2lzb3MnKS4kb2JqZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvdW50cmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInLCd0b2FzdHInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyLCB0b2FzdHIpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxuICAgICAgICAgIGdldE9uZTogZ2V0T25lLFxuICAgICAgICAgIHBvc3Q6IHBvc3QsXG4gICAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgcmVtb3ZlOiByZW1vdmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUsIGZpbHRlcil7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoZmlsdGVyKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5zdGF0dXNUZXh0LCAnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5kYXRhLmVycm9yLCAnU2F2aW5nIGZhaWxlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1dChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucHV0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShyb3V0ZSwgaWQsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRjb25maXJtOiBmdW5jdGlvbih0aXRsZSwgY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmNvbmZpcm0oKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHRcdFx0LmNhbmNlbCgnQ2FuY2VsJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRXJyb3JDaGVja2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTXlEYXRhKGRhdGEpIHtcbiAgICBcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzID0gW107XG4gICAgXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbXBvcnRzLCBmdW5jdGlvbihlbnRyeSkge1xuICAgIFx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG4gICAgXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2YXIgY29sdW1ucyA9IEpTT04ucGFyc2UoZW50cnkubWV0YV9kYXRhKTtcbiAgICBcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRmb3VuZCsrO1xuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQpe1xuICAgIFx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fVxuICAgICAgICAgIHJldHVybiBleHRlbmRlZENob2ljZXM7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICBcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwgaykge1xuICAgIFx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoIGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSBudWxsO1xuICAgIFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHRpZiAoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG4gICAgXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG4gICAgXHRcdFx0XHRcdFx0bWVzc2FnZTogXCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuICAgIFx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcbiAgICBcdFx0XHRcdFx0XHRyb3c6IGtleVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGtleSkge1xuICAgIFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdHZtLm5vdEZvdW5kID0gW107XG4gICAgXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcbiAgICBcdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuICAgIFx0XHRcdHZhciBpc29UeXBlID0gJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcbiAgICBcdFx0XHRcdGlmIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdGlzb0NoZWNrICs9IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAxIDogMDtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0Y2FzZSAnQ2FibyBWZXJkZSc6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRkZWZhdWx0OlxuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0ZW50cmllcy5wdXNoKHtcbiAgICBcdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgIFx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRJbmRleFNlcnZpY2UucmVzZXRUb1NlbGVjdCgpO1xuICAgIFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuICAgIFx0XHRcdFx0ZGF0YTogZW50cmllcyxcbiAgICBcdFx0XHRcdGlzbzogaXNvVHlwZVxuICAgIFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24oY291bnRyeSwga2V5KSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRcdFx0aWYgKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjb3VudHJ5LmRhdGFcbiAgICBcdFx0XHRcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcbiAgICBcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY291bnRyeS5kYXRhWzBdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuICAgIFx0XHRcdFx0aWYgKEluZGV4U2VydmljZS5nZXRUb1NlbGVjdCgpLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcbiAgICBcdFx0XHR9KTtcblxuICAgIFx0XHR9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2hlY2tNeURhdGE6IGNoZWNrTXlEYXRhXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZGljYXRvcnM6e30sXG4gICAgICAgICAgICB0b1NlbGVjdDpbXVxuICAgICAgICB9LCBzdG9yYWdlLCBpbXBvcnRDYWNoZSwgaW5kaWNhdG9yO1xuXG4gICAgICAgIGlmICghQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKSB7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkoJ2ltcG9ydERhdGEnLCB7XG4gICAgICAgICAgICBjYWNoZUZsdXNoSW50ZXJ2YWw6IDYwICogNjAgKiAxMDAwLCAvLyBUaGlzIGNhY2hlIHdpbGwgY2xlYXIgaXRzZWxmIGV2ZXJ5IGhvdXIuXG4gICAgICAgICAgICBkZWxldGVPbkV4cGlyZTogJ2FnZ3Jlc3NpdmUnLCAvLyBJdGVtcyB3aWxsIGJlIGRlbGV0ZWQgZnJvbSB0aGlzIGNhY2hlIHJpZ2h0IHdoZW4gdGhleSBleHBpcmUuXG4gICAgICAgICAgICBzdG9yYWdlTW9kZTogJ2xvY2FsU3RvcmFnZScgLy8gVGhpcyBjYWNoZSB3aWxsIHVzZSBgbG9jYWxTdG9yYWdlYC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKTtcbiAgICAgICAgICBzdG9yYWdlID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsZWFyOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZERhdGE6ZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSW5kaWNhdG9yOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZElzb0Vycm9yOiBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZVRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHNlcnZpY2VEYXRhLnRvU2VsZWN0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPiAtMSA/IHNlcnZpY2VEYXRhLnRvU2VsZWN0LnNwbGljZShpbmRleCwgMSkgOiBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEgPSBkYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SXNvRmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0WWVhckZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEueWVhcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VydmljZURhdGEpO1xuICAgICAgICAgIGltcG9ydENhY2hlLnB1dCgnZGF0YVRvSW1wb3J0JyxzZXJ2aWNlRGF0YSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSwgaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEFjdGl2ZUluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNbaXRlbS5jb2x1bW5fbmFtZV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnJvbUxvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGdWxsRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRNZXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29GaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvdW50cnlGaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRFcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0Vycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZpcnN0RW50cnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGFTaXplOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY3RpdmVJbmRpY2F0b3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRJbmRpY2F0b3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBudWxsO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlSXNvRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0ID0gW107XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldExvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRpemVzU2VydmljZScsIGZ1bmN0aW9uIChEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4OiB7XG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyZTogbnVsbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcm9taXNlczoge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXI6IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZldGNoRGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnUmVjdXJzaW9uSGVscGVyJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogTWFudWFsbHkgY29tcGlsZXMgdGhlIGVsZW1lbnQsIGZpeGluZyB0aGUgcmVjdXJzaW9uIGxvb3AuXG5cdFx0XHRcdFx0ICogQHBhcmFtIGVsZW1lbnRcblx0XHRcdFx0XHQgKiBAcGFyYW0gW2xpbmtdIEEgcG9zdC1saW5rIGZ1bmN0aW9uLCBvciBhbiBvYmplY3Qgd2l0aCBmdW5jdGlvbihzKSByZWdpc3RlcmVkIHZpYSBwcmUgYW5kIHBvc3QgcHJvcGVydGllcy5cblx0XHRcdFx0XHQgKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbGlua2luZyBmdW5jdGlvbnMuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0Y29tcGlsZTogZnVuY3Rpb24gKGVsZW1lbnQsIGxpbmspIHtcblx0XHRcdFx0XHRcdC8vIE5vcm1hbGl6ZSB0aGUgbGluayBwYXJhbWV0ZXJcblx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24obGluaykpIHtcblx0XHRcdFx0XHRcdFx0bGluayA9IHtcblx0XHRcdFx0XHRcdFx0XHRwb3N0OiBsaW5rXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEJyZWFrIHRoZSByZWN1cnNpb24gbG9vcCBieSByZW1vdmluZyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdHZhciBjb250ZW50cyA9IGVsZW1lbnQuY29udGVudHMoKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHZhciBjb21waWxlZENvbnRlbnRzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0cHJlOiAobGluayAmJiBsaW5rLnByZSkgPyBsaW5rLnByZSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHQgKiBDb21waWxlcyBhbmQgcmUtYWRkcyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdHBvc3Q6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIENvbXBpbGUgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjb21waWxlZENvbnRlbnRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBSZS1hZGQgdGhlIGNvbXBpbGVkIGNvbnRlbnRzIHRvIHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyhzY29wZSwgZnVuY3Rpb24gKGNsb25lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmFwcGVuZChjbG9uZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBDYWxsIHRoZSBwb3N0LWxpbmtpbmcgZnVuY3Rpb24sIGlmIGFueVxuXHRcdFx0XHRcdFx0XHRcdGlmIChsaW5rICYmIGxpbmsucG9zdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGluay5wb3N0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdH0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjp7XG4gICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlci5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBteVByb2ZpbGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RnJpZW5kczogZnVuY3Rpb24oKXtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVmVjdG9ybGF5ZXJTZXJ2aWNlJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXMsIF9zZWxmID0gdGhpcztcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2FudmFzOiBmYWxzZSxcblx0XHRcdHBhbGV0dGU6IFtdLFxuXHRcdFx0Y3R4OiAnJyxcblx0XHRcdGtleXM6IHtcblx0XHRcdFx0bWF6cGVuOiAndmVjdG9yLXRpbGVzLVEzX09zNXcnLFxuXHRcdFx0XHRtYXBib3g6ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSdcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGxheWVyOiAnJyxcblx0XHRcdFx0bmFtZTogJ2NvdW50cmllc19iaWcnLFxuXHRcdFx0XHRiYXNlQ29sb3I6ICcjMDZhOTljJyxcblx0XHRcdFx0aXNvMzogJ2FkbTBfYTMnLFxuXHRcdFx0XHRpc28yOiAnaXNvX2EyJyxcblx0XHRcdFx0aXNvOiAnaXNvX2EyJyxcblx0XHRcdFx0ZmllbGRzOiBcImlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLGlzb19hMixuYW1lLG5hbWVfbG9uZ1wiLFxuXHRcdFx0XHRmaWVsZDonc2NvcmUnXG5cdFx0XHR9LFxuXHRcdFx0bWFwOiB7XG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjdXJyZW50OiBbXSxcblx0XHRcdFx0c3RydWN0dXJlOiBbXSxcblx0XHRcdFx0c3R5bGU6IFtdXG5cdFx0XHR9LFxuXHRcdFx0bWFwTGF5ZXI6IG51bGwsXG5cdFx0XHRzZXRNYXA6IGZ1bmN0aW9uKG1hcCl7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1hcExheWVyID0gbWFwO1xuXHRcdFx0fSxcblx0XHRcdHNldExheWVyOiBmdW5jdGlvbihsKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXIgPSBsO1xuXHRcdFx0fSxcblx0XHRcdGdldExheWVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5sYXllcjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYW1lOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5uYW1lO1xuXHRcdFx0fSxcblx0XHRcdGZpZWxkczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuZmllbGRzO1xuXHRcdFx0fSxcblx0XHRcdGlzbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvO1xuXHRcdFx0fSxcblx0XHRcdGlzbzM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzM7XG5cdFx0XHR9LFxuXHRcdFx0aXNvMjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvMjtcblx0XHRcdH0sXG5cdFx0XHRjcmVhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2Upe1xuXG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2UpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjb2xvclJhbmdlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSAvIChjb2xvclJhbmdlLmxlbmd0aCAtMSkgKiBpLCBjb2xvclJhbmdlW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0QmFzZUNvbG9yOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0fSxcblx0XHQvKlx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKSB7XG5cdFx0XHRcdHRoaXMuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSlcblx0XHRcdH0sKi9cblx0XHRcdGNvdW50cnlDbGljazogZnVuY3Rpb24oY2xpY2tGdW5jdGlvbikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIub3B0aW9ucy5vbkNsaWNrID0gY2xpY2tGdW5jdGlvbjtcblx0XHRcdFx0fSlcblxuXHRcdFx0fSxcblx0XHRcdGdldENvbG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWxldHRlW3ZhbHVlXTtcblx0XHRcdH0sXG5cdFx0XHRzZXRTdHlsZTogZnVuY3Rpb24oc3R5bGUpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXAuc3R5bGUgPSBzdHlsZTtcblx0XHRcdH0sXG5cdFx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhLCBjb2xvciwgZHJhd0l0KSB7XG5cdFx0XHRcdHRoaXMubWFwLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNvbG9yICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHR0aGlzLmRhdGEuYmFzZUNvbG9yID0gY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLmNhbnZhcykge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5jcmVhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5iYXNlQ29sb3IgPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUZpeGVkQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHJhd0l0KSB7XG5cdFx0XHRcdFx0dGhpcy5wYWludENvdW50cmllcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmF0aW9uQnlJc286IGZ1bmN0aW9uKGlzbywgbGlzdCkge1xuXHRcdFx0XHRpZih0eXBlb2YgbGlzdCAhPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdGlmICh0aGlzLm1hcC5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLm1hcC5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYXRpb25CeU5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0aWYgKHRoaXMubWFwLmRhdGEubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRwYWludENvdW50cmllczogZnVuY3Rpb24oc3R5bGUsIGNsaWNrLCBtdXRleCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzdHlsZSAhPSBcInVuZGVmaW5lZFwiICYmIHN0eWxlICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZSh0aGF0Lm1hcC5zdHlsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2xpY2sgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXRTZWxlY3RlZDogZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5sYXllci5sYXllcnMgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXMsIGZ1bmN0aW9uKGZlYXR1cmUsIGtleSl7XG5cdFx0XHRcdFx0XHRpZihpc28pe1xuXHRcdFx0XHRcdFx0XHRpZihrZXkgIT0gaXNvKVxuXHRcdFx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZTpmdW5jdGlvbihpc28sIHNlbGVjdGVkKXtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXNbaXNvXSA9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaXNvKTtcblx0XHRcdFx0XHQvL2RlYnVnZ2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLmxheWVyc1t0aGlzLmRhdGEubmFtZSsnX2dlb20nXS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHJlZHJhdzpmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIucmVkcmF3KCk7XG5cdFx0XHR9LFxuXHRcdFx0Ly9GVUxMIFRPIERPXG5cdFx0XHRjb3VudHJpZXNTdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdGhhdC5kYXRhLmlzbzJdO1xuXHRcdFx0XHR2YXIgbmF0aW9uID0gdGhhdC5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0XHR2YXIgZmllbGQgPSB0aGF0LmRhdGEuZmllbGQ7XG5cdFx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cblx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsKXtcblx0XHRcdFx0XHRcdFx0dmFyIGxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5yYW5nZS5taW4sdm0ucmFuZ2UubWF4XSkucmFuZ2UoWzAsMjU2XSk7XG5cblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gIHBhcnNlSW50KGxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7Ly8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coY29sb3JQb3MsIGlzbyxuYXRpb24pO1xuXHRcdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdEltcG9ydEN0cmwnLCBmdW5jdGlvbihSZXN0YW5ndWxhciwgdG9hc3RyLCAkc3RhdGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9ucyA9IFtdO1xuXHRcdHZtLmV2ZW50cyA9IFtdO1xuXHRcdHZtLnN1bSA9IDA7XG5cblx0XHR2bS5zYXZlVG9EYiA9IHNhdmVUb0RiO1xuXG5cdFx0ZnVuY3Rpb24gc2F2ZVRvRGIoKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0bmF0aW9uczogdm0ubmF0aW9ucyxcblx0XHRcdFx0ZXZlbnRzOiB2bS5ldmVudHNcblx0XHRcdH07XG5cdFx0XHRSZXN0YW5ndWxhci5hbGwoJy9jb25mbGljdHMvaW1wb3J0JykucG9zdChkYXRhKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgnKVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkc3RhdGUsICRzY29wZSwgJHJvb3RTY29wZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBjb25mbGljdCwgY29uZmxpY3RzLCBuYXRpb25zLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG5cdFx0dm0uY29uZmxpY3RzID0gbmF0aW9ucztcblx0XHR2bS5jb25mbGljdEl0ZW1zID0gW1xuXHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdCdhdXRvbm9teScsXG5cdFx0XHQnc3lzdGVtJyxcblx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnaW50ZXJuYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS5zaG93TWV0aG9kID0gc2hvd01ldGhvZDtcblx0XHR2bS5zaG93Q291bnRyaWVzID0gZmFsc2U7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLmNvdW50cmllcyA9IFtdO1xuXHRcdHZtLnNob3dUZXh0ID0gc2hvd1RleHQ7XG5cdFx0dm0uc2hvd0NvdW50cmllc0J1dHRvbiA9IHNob3dDb3VudHJpZXNCdXR0b247XG5cdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdGNvbG9yOiAnIzRmYjBlNScsXG5cdFx0XHRmaWVsZDogJ2ludDIwMTUnLFxuXHRcdFx0c2l6ZTogNSxcblx0XHRcdGhpZGVOdW1iZXJpbmc6IHRydWUsXG5cdFx0XHR3aWR0aDo2NSxcblx0XHRcdGhlaWdodDo2NVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvLztcblx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uY29uZmxpY3RzLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblxuXHRcdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdC5uYXRpb25zLCBmdW5jdGlvbihuYXRpb24pIHtcblx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuXHRcdFx0XHRcdGlmIChpID09IC0xKSB7XG5cdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0dm0uY291bnRyaWVzLnB1c2gobmF0aW9uKTtcblx0XHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUobmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94Jywgdm0ucmVsYXRpb25zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVsyXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFx0WzUwLCA1MF1cblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLm1hcExheWVyLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd1RleHQoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3R0ZXh0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd0NvdW50cmllc0J1dHRvbigpIHtcblx0XHRcdGlmICh2bS5zaG93Q291bnRyaWVzKSByZXR1cm4gXCJhcnJvd19kcm9wX3VwXCI7XG5cdFx0XHRyZXR1cm4gXCJhcnJvd19kcm9wX2Rvd25cIjtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNob3dMaXN0ID0gZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zID0gW1xuXHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdCdhdXRvbm9teScsXG5cdFx0XHQnc3lzdGVtJyxcblx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnaW50ZXJuYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS50b2dnbGVJdGVtID0gdG9nZ2xlSXRlbTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0oaXRlbSkge1xuXHRcdFx0Y29uc29sZS5sb2coaXRlbSwgJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zKTtcblx0XHRcdHZhciBpID0gJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHRcdFx0J3NlY2Vzc2lvbicsXG5cdFx0XHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdFx0XHQnc3lzdGVtJyxcblx0XHRcdFx0XHQnbmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0XHRcdCdyZXNvdXJjZXMnLFxuXHRcdFx0XHRcdCdvdGhlcidcblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdG5hdGlvbkN0cmwnLCBmdW5jdGlvbigkdGltZW91dCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBuYXRpb25zLCBuYXRpb24sIFZlY3RvcmxheWVyU2VydmljZSwgRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9uID0gbmF0aW9uO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uZmVhdHVyZWQgPSBbXTtcblx0XHR2bS5jb25mbGljdCA9IG51bGw7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50ZW5zaXR5Jyxcblx0XHRcdHNpemU6IDUsXG5cdFx0XHRoaWRlTnVtYmVyaW5nOiB0cnVlLFxuXHRcdFx0d2lkdGg6NjUsXG5cdFx0XHRoZWlnaHQ6NjVcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSBbXTtcblxuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2godm0ubmF0aW9uLmlzbyk7XG5cdFx0XHRcdHZtLmZlYXR1cmVkID0gW107XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5yZXNldFNlbGVjdGVkKHZtLm5hdGlvbi5pc28pO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKHZtLm5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IFtdO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubmF0aW9uLmNvbmZsaWN0cywgZnVuY3Rpb24oY29uZmxpY3QpIHtcblx0XHRcdFx0XHRpZiAoIXZtLmNvbmZsaWN0KSB2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdFx0XHRcdGlmIChjb25mbGljdC5pbnQyMDE1ID4gdm0uY29uZmxpY3QuaW50MjAxNSkge1xuXHRcdFx0XHRcdFx0dm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXRlbSA9PSAxICl7XG5cdFx0XHRcdFx0XHRcdGlmKHZtLmZlYXR1cmVkLmluZGV4T2Yoa2V5KSA9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZmVhdHVyZWQucHVzaChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gdm0uZmVhdHVyZWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdFx0dmFyIGkgPSB2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXRpb24uaXNvKTtcblx0XHRcdFx0XHRcdGlmIChpID09IC0xICYmIG5hdGlvbi5pc28gIT0gdm0ubmF0aW9uLmlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKG5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIHZtLnJlbGF0aW9ucykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRcdFs1MCwgNTBdXG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5tYXBMYXllci5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdFx0XHRtYXhab29tOiA0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cdFx0XHR9KVxuXG5cblxuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gc2hvd01ldGhvZCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdG1ldGhvZGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsgLy8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknO1xuXHRcdFx0dmFyIGNvbG9yRnVsbCA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHZhciBvdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdHNpemU6IDFcblx0XHRcdH07XG5cdFx0XHRpZiAoaXNvID09IHZtLm5hdGlvbi5pc28pIHtcblx0XHRcdFx0b3V0bGluZSA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNTQsNTYsNTksMC44KScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb2xvciA9IGNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZTogb3V0bGluZVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0c0N0cmwnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRzdGF0ZSwgJHJvb3RTY29wZSwgJHNjb3BlLCBjb25mbGljdHMsIG5hdGlvbnMsIFZlY3RvcmxheWVyU2VydmljZSwgUmVzdGFuZ3VsYXIsIERpYWxvZ1NlcnZpY2UsIEZ1bGxzY3JlZW4pIHtcblx0XHQvL1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yZWFkeSA9IGZhbHNlO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmdvRnVsbHNjcmVlbiA9IGdvRnVsbHNjcmVlbjtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnR5cGVzQ29sb3JzID0ge1xuXHRcdFx0aW50ZXJzdGF0ZTogJyM2OWQ0YzMnLFxuXHRcdFx0aW50cmFzdGF0ZTogJyNiN2I3YjcnLFxuXHRcdFx0c3Vic3RhdGU6ICcjZmY5ZDI3J1xuXHRcdH07XG5cdFx0dm0uYWN0aXZlID0ge1xuXHRcdFx0Y29uZmxpY3Q6IFtdLFxuXHRcdFx0dHlwZTogWzEsIDIsIDNdXG5cdFx0fTtcblx0XHR2bS50b2dnbGVDb25mbGljdEZpbHRlciA9IHRvZ2dsZUNvbmZsaWN0RmlsdGVyO1xuXHRcdHZtLmNvbmZsaWN0RmlsdGVyID0gbnVsbDtcblxuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLm5hdGlvbnMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0ubmF0aW9ucywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uZmxpY3RzLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0Y2FsY0ludGVuc2l0aWVzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvL30pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvRnVsbHNjcmVlbigpIHtcblxuXHRcdCBpZiAoRnVsbHNjcmVlbi5pc0VuYWJsZWQoKSlcblx0XHRcdFx0RnVsbHNjcmVlbi5jYW5jZWwoKTtcblx0XHQgZWxzZVxuXHRcdFx0XHRGdWxsc2NyZWVuLmFsbCgpO1xuXG5cdFx0IC8vIFNldCBGdWxsc2NyZWVuIHRvIGEgc3BlY2lmaWMgZWxlbWVudCAoYmFkIHByYWN0aWNlKVxuXHRcdCAvLyBGdWxsc2NyZWVuLmVuYWJsZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZycpIClcblxuXHR9XG5cdFx0ZnVuY3Rpb24gc2V0VmFsdWVzKCkge1xuXHRcdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0XHR2bS5jb25mbGljdEZpbHRlckNvdW50ID0gMDtcblx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMgPSB7XG5cdFx0XHRcdHZlcnlMb3c6IDAsXG5cdFx0XHRcdGxvdzogMCxcblx0XHRcdFx0bWlkOiAwLFxuXHRcdFx0XHRoaWdoOiAwLFxuXHRcdFx0XHR2ZXJ5SGlnaDogMFxuXHRcdFx0fTtcblx0XHRcdHZtLmNoYXJ0RGF0YSA9IFt7XG5cdFx0XHRcdGxhYmVsOiAxLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1swXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogMixcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMV1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDMsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzJdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiA0LFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1szXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogNSxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbNF1cblx0XHRcdH1dO1xuXG5cdFx0XHR2bS5jb25mbGljdFR5cGVzID0gW3tcblx0XHRcdFx0dHlwZTogJ2ludGVyc3RhdGUnLFxuXHRcdFx0XHR0eXBlX2lkOiAxLFxuXHRcdFx0XHRjb2xvcjogJyM2OWQ0YzMnLFxuXHRcdFx0XHRjb3VudDogMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR0eXBlOiAnaW50cmFzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAyLFxuXHRcdFx0XHRjb2xvcjogJyNiN2I3YjcnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHR5cGU6ICdzdWJzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAzLFxuXHRcdFx0XHRjb2xvcjogJyNmZjlkMjcnXG5cdFx0XHR9XTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29uZmxpY3RGaWx0ZXIodHlwZSkge1xuXG5cdFx0XHR2YXIgaSA9IHZtLmFjdGl2ZS50eXBlLmluZGV4T2YodHlwZSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnB1c2godHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUgPSBbMSwgMiwgM107XG5cdFx0XHR9XG5cdFx0XHRjYWxjSW50ZW5zaXRpZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjQ29uZmxpY3QoY29uZmxpY3QpIHtcblx0XHRcdHZtLmNvbmZsaWN0RmlsdGVyQ291bnQrKztcblx0XHRcdHN3aXRjaCAoY29uZmxpY3QudHlwZV9pZCkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzBdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzFdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzJdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChjb25mbGljdC5pbnQyMDE1KSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUxvdysrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMF0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMubG93Kys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVsxXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5taWQrKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzJdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmhpZ2grKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzNdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLnZlcnlIaWdoKys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVs0XS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHR9XG5cdFx0XHRhZGRDb3VudHJpZXMoY29uZmxpY3QubmF0aW9ucyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENvdW50cmllcyhuYXRpb25zKXtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuYXRpb25zLCBmdW5jdGlvbihuYXQpe1xuXHRcdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXQuaXNvKSA9PSAtMSl7XG5cdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0Lmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYWxjSW50ZW5zaXRpZXMoKSB7XG5cdFx0XHRzZXRWYWx1ZXMoKTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdHMsIGZ1bmN0aW9uIChjb25mbGljdCkge1xuXHRcdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKHZtLmFjdGl2ZS50eXBlLmluZGV4T2YoY29uZmxpY3QudHlwZV9pZCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR2bS5yZWFkeSA9IHRydWU7XG5cdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5yZWRyYXcoKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihpc28pID09IC0xKXtcblx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCAmJiBpc28pIHtcblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGdWxsTGlzdEZpdGxlckN0cmwnLCBmdW5jdGlvbihjYXRlZ29yaWVzLCBDb250ZW50U2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cbiAgICB2bS5maWx0ZXIgPSBbXTtcbiAgICB2bS5vcHRpb25zID0ge1xuICAgICAgY2F0ZWdvcmllczp7XG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdm0uZmlsdGVyID1bXTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIGxpc3RDYXRlZ29yaWVzKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIENvbnRlbnRTZXJ2aWNlLmZpbHRlckxpc3QoJ2luZGljYXRvcnMnLGNhdEZpbHRlcix2bS5zZWxlY3Rpb24pO1xuICAgICAgICAgIENvbnRlbnRTZXJ2aWNlLmZpbHRlckxpc3QoJ2luZGljZXMnLGNhdEZpbHRlcix2bS5zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBhZGRUb0ZpbHRlcihpZCl7XG4gICAgICB2YXIgaWR4ID0gdm0uZmlsdGVyLmluZGV4T2YoaWQpO1xuICAgICAgaWYoaWR4ID09IC0xKXtcbiAgICAgICAgdm0uZmlsdGVyLnB1c2goaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBsaXN0Q2F0ZWdvcmllcyhjYXQpe1xuICAgICAgYWRkVG9GaWx0ZXIoY2F0LmlkKTtcbiAgICAgIGlmKGNhdC5jaGlsZHJlbil7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjYXQuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICBhZGRUb0ZpbHRlcihjaGlsZC5pZCk7XG4gICAgICAgICAgbGlzdENhdGVnb3JpZXMoY2hpbGQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGNhdEZpbHRlcihpdGVtKXtcblx0XHRcdFx0aWYoaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA+IDAgJiYgdm0uZmlsdGVyLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG5cdFx0XHRcdFx0XHRpZih2bS5maWx0ZXIuaW5kZXhPZihjYXQuaWQpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRnVsbExpc3RDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgQ29udGVudFNlcnZpY2UsIGNhdGVnb3JpZXMsIGluZGljYXRvcnMsIGluZGljZXMpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uaW5kaWNlcyA9IGluZGljZXM7XG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0c29ydDogJ3RpdGxlJyxcblx0XHRcdHRvZ2dsZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4Lmxpc3QnKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5saXN0LmZpbHRlcicse2ZpbHRlcjonY2F0ZWdvcmllcyd9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVzZXRGaWx0ZXIoJ2luZGljYXRvcnMnKTtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZXNldEZpbHRlcignaW5kaWNlcycpO1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lmxpc3QnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmNvbnRlbnQuaW5kaWNhdG9yc30sIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiA9PT0gbyApcmV0dXJuO1xuXHRcdFx0dm0uaW5kaWNhdG9ycyA9IG47XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe3JldHVybiBDb250ZW50U2VydmljZS5jb250ZW50LmluZGljZXN9LCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gPT09IG8gKXJldHVybjtcblx0XHRcdHZtLmluZGljZXMgPSBuO1xuXHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJG1kTWVkaWEsIGxlYWZsZXREYXRhLCAkc3RhdGUsJGxvY2FsU3RvcmFnZSwgJHJvb3RTY29wZSwgJGF1dGgsIHRvYXN0ciwgJHRpbWVvdXQpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHQkcm9vdFNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGlzQXV0aGVudGljYXRlZDtcblx0XHR2bS5kb0xvZ2luID0gZG9Mb2dpbjtcblx0XHR2bS5kb0xvZ291dCA9IGRvTG9nb3V0O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlVmlldyA9IHRvZ2dsZVZpZXc7XG5cblx0XHR2bS5hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihwcm92aWRlcil7XG5cdFx0XHQkYXV0aC5hdXRoZW50aWNhdGUocHJvdmlkZXIpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpc0F1dGhlbnRpY2F0ZWQoKXtcblx0XHRcdCByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9naW4oKXtcblx0XHRcdCRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbicpO1xuXHRcdFx0XHQvLyRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ291dCgpe1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHQkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50LmF1dGgpe1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQnKTtcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuICAgIGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuICAgICAgJG1kT3Blbk1lbnUoZXYpO1xuICAgIH07XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlVmlldygpe1xuXHRcdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICEkcm9vdFNjb3BlLmxvb3NlTGF5b3V0O1xuXHRcdFx0JGxvY2FsU3RvcmFnZS5mdWxsVmlldyA9ICRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRyb290U2NvcGUuY3VycmVudF9wYWdlO1xuXHRcdH0sIGZ1bmN0aW9uKG5ld1BhZ2Upe1xuXHRcdFx0JHNjb3BlLmN1cnJlbnRfcGFnZSA9IG5ld1BhZ2UgfHwgJ1BhZ2UgTmFtZSc7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgnJHJvb3Quc2lkZWJhck9wZW4nLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0aWYobiA9PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyByZXR1cm4gJG1kTWVkaWEoJ3NtJykgfSwgZnVuY3Rpb24oc21hbGwpIHtcblx0ICAgIHZtLnNtYWxsU2NyZWVuID0gc21hbGw7XG5cdCAgfSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcsIHtpc19vZmZpY2lhbDogdHJ1ZX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHZtLmluZGl6ZXMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdywkbWRTaWRlbmF2LCAkcm9vdFNjb3BlLCAkZmlsdGVyLCAkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSwgZGF0YSwgY291bnRyaWVzLCBsZWFmbGV0RGF0YSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvLyBWYXJpYWJsZSBkZWZpbml0aW9uc1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubWFwID0gbnVsbDtcblxuXHRcdHZtLmRhdGFTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLmRhdGE7XG5cdFx0dm0uc3RydWN0dXJlU2VydmVyID0gZGF0YS5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cblx0XHR2bS5zdHJ1Y3R1cmUgPSBcIlwiO1xuXHRcdHZtLm12dFNjb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXIgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpO1xuXHRcdHZtLm12dENvdW50cnlMYXllckdlb20gPSB2bS5tdnRDb3VudHJ5TGF5ZXIgKyBcIl9nZW9tXCI7XG5cdFx0dm0uaXNvX2ZpZWxkID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMjtcblx0XHR2bS5ub2RlUGFyZW50ID0ge307XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdHZtLnRhYkNvbnRlbnQgPSBcIlwiO1xuXHRcdHZtLnRvZ2dsZUJ1dHRvbiA9ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdHZtLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0dm0uaW5mbyA9IGZhbHNlO1xuXHRcdHZtLmNsb3NlSWNvbiA9ICdjbG9zZSc7XG5cdFx0dm0uY29tcGFyZSA9IHtcblx0XHRcdGFjdGl2ZTogZmFsc2UsXG5cdFx0XHRjb3VudHJpZXM6IFtdXG5cdFx0fTtcblx0XHR2bS5kaXNwbGF5ID0ge1xuXHRcdFx0c2VsZWN0ZWRDYXQ6ICcnXG5cdFx0fTtcblxuXHRcdC8vRnVuY3Rpb24gZGVmaW5pdG9uc1xuXHRcdHZtLnNob3dUYWJDb250ZW50ID0gc2hvd1RhYkNvbnRlbnQ7XG5cdFx0dm0uc2V0VGFiID0gc2V0VGFiO1xuXHRcdHZtLnNldFN0YXRlID0gc2V0U3RhdGU7XG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlID0gc2V0U2VsZWN0ZWRGZWF0dXJlO1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG5cdFx0dm0uY2hlY2tDb21wYXJpc29uID0gY2hlY2tDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZU9wZW4gPSB0b2dnbGVPcGVuO1xuXHRcdHZtLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdHZtLnRvZ2dsZURldGFpbHMgPSB0b2dnbGVEZXRhaWxzO1xuXHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24gPSB0b2dnbGVDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdCA9IHRvZ2dsZUNvdW50cmllTGlzdDtcblx0XHR2bS5tYXBHb3RvQ291bnRyeSA9IG1hcEdvdG9Db3VudHJ5O1xuXHRcdHZtLmdvQmFjayA9IGdvQmFjaztcblx0XHR2bS5nb1RvSW5kZXggPSBnb1RvSW5kZXg7XG5cblx0XHR2bS5jYWxjVHJlZSA9IGNhbGNUcmVlO1xuXG5cdFx0dm0uaXNQcmVsYXN0ID0gaXNQcmVsYXN0O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpIHtcblx0XHRcdFx0dm0uZGF0YVNlcnZlci50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmU7XG5cdFx0XHRcdFx0aWYgKCF2bS5zdHJ1Y3R1cmUuc3R5bGUpIHtcblx0XHRcdFx0XHRcdHZtLnN0cnVjdHVyZS5zdHlsZSA9IHtcblx0XHRcdFx0XHRcdFx0J25hbWUnOiAnZGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6ICdEZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0J2Jhc2VfY29sb3InOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJ1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3JlYXRlQ2FudmFzKHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yKTtcblx0XHRcdFx0XHRkcmF3Q291bnRyaWVzKCk7XG5cdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXRlbSkge1xuXHRcdFx0XHRcdFx0dm0uc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaCh2bS5jdXJyZW50KTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vb25zb2xlLmxvZyh2bS5jb21wYXJlLmNvdW50cmllcyk7XG5cdFx0XHRcdFx0XHRjb3VudHJpZXMucHVzaCh2bS5jdXJyZW50Lmlzbyk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgY291bnRyaWVzKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHQvLyBUT0RPOiBNT1ZFIFRPIEdMT0JBTFxuXHRcdGZ1bmN0aW9uIGdvQmFjaygpIHtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdvVG9JbmRleChpdGVtKXtcblxuXHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcse1xuXHRcdFx0XHRpZDppdGVtLmlkLFxuXHRcdFx0XHRuYW1lOml0ZW0ubmFtZSxcblx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zWydpdGVtJ11cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBpc1ByZWxhc3QoKXtcblx0XHRcdHZhciBsZXZlbHNGb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnN0cnVjdHVyZS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZihjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRsZXZlbHNGb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxldmVsc0ZvdW5kO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93VGFiQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiB2bS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSAncmFuayc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZtLnRvZ2dsZUJ1dHRvbiA9IHZtLnRhYkNvbnRlbnQgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblxuXHRcdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5vcGVuKCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZShpc28pIHtcblx0XHRcdGlmICh2bS5tdnRTb3VyY2UpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdHZhciBrYWNrID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCAnc2NvcmUnLCAnaXNvJywgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLm5hbWUgKyAnX3JhbmsnXSA9IHJhbms7XG5cdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogdm0uc3RydWN0dXJlLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMGNjYWEnLFxuXHRcdFx0XHRmaWVsZDogdm0uc3RydWN0dXJlLm5hbWUgKyAnX3JhbmsnLFxuXHRcdFx0XHRzaXplOiB2bS5kYXRhLmxlbmd0aFxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cblx0XHRcdHZhciByYW5rID0gdm0uZGF0YS5pbmRleE9mKGNvdW50cnkpICsgMTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogUkVNT1ZFLCBOT1cgR09UIE9XTiBVUkxcblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCkge1xuXHRcdFx0dm0uaW5mbyA9ICF2bS5pbmZvO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IFBVVCBJTiBWSUVXXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gZmV0Y2hOYXRpb25EYXRhKGlzbykge1xuXHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgJHN0YXRlLnBhcmFtcy5pZCwgaXNvKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0bWFwR290b0NvdW50cnkoaXNvKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogTU9WRSBUTyBNQVAgU0VSVklDRVxuXHRcdGZ1bmN0aW9uIG1hcEdvdG9Db3VudHJ5KGlzbykge1xuXHRcdFx0aWYgKCEkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW2lzb10pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQ29tcGFyaXNvbih3YW50KSB7XG5cdFx0XHRpZiAod2FudCAmJiAhdm0uY29tcGFyZS5hY3RpdmUgfHwgIXdhbnQgJiYgdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0udG9nZ2xlQ29tcGFyaXNvbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvbXBhcmlzb24oKSB7XG5cdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcyA9IFt2bS5jdXJyZW50XTtcblx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gIXZtLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzLCBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lLFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvdW50cmllTGlzdChjb3VudHJ5KSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24obmF0LCBrZXkpIHtcblx0XHRcdFx0aWYgKGNvdW50cnkgPT0gbmF0ICYmIG5hdCAhPSB2bS5jdXJyZW50KSB7XG5cdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICghZm91bmQpIHtcblx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNvcyA9IFtdO1xuXHRcdFx0dmFyIGNvbXBhcmUgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdGlmIChpdGVtW3ZtLnN0cnVjdHVyZS5pc29dICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0Y29tcGFyZS5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoaXNvcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBpc29zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW0sXG5cdFx0XHRcdFx0Y291bnRyaWVzOiBjb21wYXJlLmpvaW4oJy12cy0nKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICFmb3VuZDtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gVklFV1xuXHRcdGZ1bmN0aW9uIHNldFRhYihpKSB7XG5cdFx0XHQvL3ZtLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpIHtcblx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0uY29sdW1uX25hbWUgPT0gdm0uZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKSB7XG5cdFx0XHRcdFx0dm0ubm9kZVBhcmVudCA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1RyZWUoKSB7XG5cdFx0XHRnZXRQYXJlbnQodm0uc3RydWN0dXJlKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgQ09VTlRSWVxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5TmFtZShuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeUlzbyhpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9yKSB7XG5cblx0XHRcdHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0dm0uY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0dm0uY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0dm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcyhjb2xvcikge1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblxuXHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuMyknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGlmIChpc28gIT0gdm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUpXG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcblx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcblx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobi5pc28pIHtcblx0XHRcdFx0aWYgKG8uaXNvKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW24uaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmICgkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcgfHwgJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cnKSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogbi5pc29cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRuYW1lOiAkc3RhdGUucGFyYW1zLmlkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0aWYgKG4uY29sb3IpXG5cdFx0XHRcdHVwZGF0ZUNhbnZhcyhuLmNvbG9yKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVDYW52YXMoJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0fTtcblx0XHRcdHZtLmNhbGNUcmVlKCk7XG5cdFx0XHQvKmlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9Ki9cblxuXHRcdFx0aWYgKHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc28sXG5cdFx0XHRcdFx0XHRjb3VudHJpZXM6ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aWQ6IG4uaWQsXG5cdFx0XHRcdFx0XHRuYW1lOiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50Lmlzb1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aWQ6IG4uaWQsXG5cdFx0XHRcdFx0bmFtZTogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmJib3gnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKnZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVswXVswXV1cblx0XHRcdFx0XSxcblx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMl1bMF1dXG5cdFx0XHRcdF0qL1xuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFsxMDAsIDEwMF1cblx0XHRcdF07XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0cGFkID0gW1xuXHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRbMCwgMF1cblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHRcdHZtLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXG5cdFx0XHQvKmNvbnNvbGUubG9nKCQpXG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3dcIikge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZFwiKSB7XG5cblx0XHRcdFx0aWYodG9QYXJhbXMuaW5kZXggIT0gZnJvbVBhcmFtcy5pbmRleCl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FuZGVycycpXG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2codG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdm0uY3VycmVudC5pc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlXCIpIHtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdC8vJHNjb3BlLmFjdGl2ZVRhYiA9IDI7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdG9QYXJhbXMuaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmNvdW50cnkgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9Ki9cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXRlbSkge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzWyRzdGF0ZS5wYXJhbXMuaXRlbV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbihldnQsIHQpIHtcblxuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHQkbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuXHRcdFx0XHRcdFx0XHR2bS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0KGMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJywgZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGJhc2VDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUpIHtcblx0XHQvL1xuICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGZpbHRlciwgJHRpbWVvdXQsIHRvYXN0ciwgRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKSB7XG5cblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmlzb19lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SXNvRXJyb3JzKCk7XG5cdFx0dm0uc2VsZWN0ZWQgPSBbXTtcbiAgICB2bS55ZWFyZmlsdGVyID0gJyc7XG5cdFx0dm0uZGVsZXRlRGF0YSA9IGRlbGV0ZURhdGE7XG5cdFx0dm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcblx0XHR2bS5kZWxldGVDb2x1bW4gPSBkZWxldGVDb2x1bW47XG5cdFx0dm0ub25PcmRlckNoYW5nZSA9IG9uT3JkZXJDaGFuZ2U7XG5cdFx0dm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuXHRcdHZtLmNoZWNrRm9yRXJyb3JzID0gY2hlY2tGb3JFcnJvcnM7XG5cdFx0dm0uc2VsZWN0RXJyb3JzID0gc2VsZWN0RXJyb3JzO1xuICAgIHZtLnNlYXJjaEZvckVycm9ycyA9IHNlYXJjaEZvckVycm9ycztcblx0XHR2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG5cdFx0Ly92bS5lZGl0Q29sdW1uRGF0YSA9IGVkaXRDb2x1bW5EYXRhO1xuXHRcdHZtLmVkaXRSb3cgPSBlZGl0Um93O1xuICAgIHZtLnllYXJzID0gW107XG5cdFx0dm0ucXVlcnkgPSB7XG5cdFx0XHRmaWx0ZXI6ICcnLFxuXHRcdFx0b3JkZXI6ICctZXJyb3JzJyxcblx0XHRcdGxpbWl0OiAxNSxcblx0XHRcdHBhZ2U6IDFcblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0Y2hlY2tEYXRhKCk7XG4gICAgXHRnZXRZZWFycygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrRGF0YSgpIHtcblx0XHRcdGlmICghdm0uZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG4gICAgZnVuY3Rpb24gZ2V0WWVhcnMoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBkYXQgPSAoJGZpbHRlcignZ3JvdXBCeScpKHZtLmRhdGEsICdkYXRhLicrdm0ubWV0YS5jb3VudHJ5X2ZpZWxkICkpO1xuXHQgICAgICB2bS55ZWFycyA9IFtdO1xuXHRcdFx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHRcdFx0dmFyIGluZGV4ID0gbnVsbDtcblx0XHRcdCAgYW5ndWxhci5mb3JFYWNoKGRhdCxmdW5jdGlvbihlbnRyeSwgaSl7XG5cdFx0XHRcdFx0aWYoZW50cnkubGVuZ3RoID4gbGVuZ3RoKXtcblx0XHRcdFx0XHRcdGluZGV4ID0gaVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdCAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRbaW5kZXhdLGZ1bmN0aW9uKGVudHJ5KXtcblx0ICAgICAgICB2bS55ZWFycy5wdXNoKGVudHJ5LmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSlcblx0ICAgICAgfSk7XG5cdFx0XHRcdHZtLnllYXJmaWx0ZXIgPSB2bS55ZWFyc1swXTtcblx0XHRcdH0pO1xuXG5cbiAgICB9XG5cdFx0ZnVuY3Rpb24gc2VhcmNoKHByZWRpY2F0ZSkge1xuXHRcdFx0dm0uZmlsdGVyID0gcHJlZGljYXRlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcblx0XHRcdC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuXHRcdFx0Ly9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2hlY2tGb3JFcnJvcnMoaXRlbSkge1xuXHRcdFx0cmV0dXJuIGl0ZW0uZXJyb3JzLmxlbmd0aCA+IDAgPyAnbWQtd2FybicgOiAnJztcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGVkaXRDb2x1bW5EYXRhKGUsIGtleSl7XG5cdFx0ICB2bS50b0VkaXQgPSBrZXk7XG5cdFx0ICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG5cdFx0fSovXG5cdFx0ZnVuY3Rpb24gZGVsZXRlQ29sdW1uKGUsIGtleSkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uIChmaWVsZCwgbCkge1xuXHRcdFx0XHRcdGlmIChsID09IGtleSkge1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSl7XG5cdFx0XHRcdFx0XHRcdGlmKGVycm9yLmNvbHVtbiA9PSBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5lcnJvcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmRhdGFba10uZGF0YVtrZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IsIGspIHtcblx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy0tO1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmVycm9ycy0tO1xuXHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRpZiAodm0uZGF0YS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHR2bS5kZWxldGVEYXRhKCk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdEVycm9ycygpIHtcblx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlZGl0Um93KCkge1xuXHRcdFx0dm0ucm93ID0gdm0uc2VsZWN0ZWRbMF07XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlRGF0YSgpIHtcblx0XHRcdHZtLmRhdGEgPSBbXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JFcnJvcnMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKHJvdywgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoga2V5LFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcilcblx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLmNsZWFyRXJyb3JzID0gY2xlYXJFcnJvcnM7XG5cdFx0dm0uZmV0Y2hJc28gPSBmZXRjaElzbztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0Ly92bS5teURhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKTtcblx0XHRcdC8vY2hlY2tNeURhdGEoKTtcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGNoZWNrTXlEYXRhKCkge1xuXHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5tZXRhLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLmNvbHVtbiA9PSBmaWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm91bmQrKztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcblx0XHRcdFx0XHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGlmICh2bS5leHRlbmRpbmdDaG9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkKXtcblx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZXh0ZW5kRGF0YScsICRzY29wZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9Ki9cblxuXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0aWYgKCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiLyogfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmRhdGFba2V5XS5kYXRhW2tdID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKCFyb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcIjJcIixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcblx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0sXG5cdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkLFxuXHRcdFx0XHRcdFx0cm93OiBrZXlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrZXkpIHtcblx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcblx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcblxuXHRcdFx0aWYgKCF2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0XHR2bS5ub3RGb3VuZCA9IFtdO1xuXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcblx0XHRcdHZhciBpc29DaGVjayA9IDA7XG5cdFx0XHR2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHRpc29DaGVjayArPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gMSA6IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdGNhc2UgJ0NhYm8gVmVyZGUnOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVudHJpZXMucHVzaCh7XG5cdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdG5hbWU6IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgaXNvVHlwZSA9IGlzb0NoZWNrID49IChlbnRyaWVzLmxlbmd0aCAvIDIpID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnJlc2V0VG9TZWxlY3QoKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuXHRcdFx0XHRkYXRhOiBlbnRyaWVzLFxuXHRcdFx0XHRpc286IGlzb1R5cGVcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoY291bnRyeS5kYXRhLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvdW50cnkuZGF0YSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcblx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2codm0uZGF0YVtrXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkNvdWxkIG5vdCBsb2NhdGUgYSB2YWxpZCBpc28gbmFtZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmNvdW50cnlfZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdGlmIChJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKS5sZW5ndGgpIHtcblx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGZpZWxkIHNlbGVjdGlvbnMnLCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0dm0uZXh0ZW5kRGF0YSA9IGV4dGVuZERhdGE7XG5cblx0XHRmdW5jdGlvbiBleHRlbmREYXRhKCkge1xuXHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0dmFyIG1ldGEgPSBbXSxcblx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuXHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zb2xlLmxvZyhpbnNlcnREYXRhKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyB2bS5hZGREYXRhVG8udGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbEN0cmwnLCBmdW5jdGlvbiAoJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuXHRcdHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdC8qaWYgKHZtLm1ldGEueWVhcl9maWVsZCkge1xuXHRcdFx0XHR2bS5tZXRhLnllYXIgPSB2bS5kYXRhWzBdLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdH0qL1xuXHRcdFx0Y2hlY2tEYXRhKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tEYXRhKCkge1xuXHRcdFx0aWYgKCF2bS5kYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNhdmVEYXRhKHZhbGlkKSB7XG5cdFx0XHRpZiAodmFsaWQpIHtcblx0XHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG5cdFx0XHRcdFx0ZGF0YTogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG5vWWVhcnMgPSBbXTtcblx0XHRcdFx0dmFyIGluc2VydE1ldGEgPSBbXSxcblx0XHRcdFx0XHRmaWVsZHMgPSBbXTtcblx0XHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRpZihpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSl7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uZGF0YS55ZWFyID0gaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cblx0XHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0bm9ZZWFycy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChrZXkgIT0gdm0ubWV0YS5pc29fZmllbGQgJiYga2V5ICE9IHZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0c3R5bGVfaWQgPSB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG5cdFx0XHRcdFx0XHRcdCdjb2x1bW4nOiBrZXksXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcblx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdFx0XHQnbWVhc3VyZV90eXBlX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLnR5cGUuaWQgfHwgMCxcblx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcblx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG5cdFx0XHRcdFx0XHRcdCdkYXRhcHJvdmlkZXJfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0uZGF0YXByb3ZpZGVyLmlkIHx8IDBcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnNba2V5XS5jYXRlZ29yaWVzLCBmdW5jdGlvbiAoY2F0KSB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcblx0XHRcdFx0aWYobm9ZZWFycy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoXCJmb3IgXCIrbm9ZZWFycy5sZW5ndGggKyBcIiBlbnRyaWVzXCIsICdObyB5ZWFyIHZhbHVlIGZvdW5kIScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyByZXNwb25zZS50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG5cdFx0XHRcdFx0XHRcdHZtLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0dm0uc3RlcCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEZpbmFsTWVudUN0cmwnLCBmdW5jdGlvbihJbmRleFNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgIHZtLmluZGljYXRvcnNMZW5ndGggPSBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGg7XG5cbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFZlY3RvcmxheWVyU2VydmljZSwkdGltZW91dCxJbmRleFNlcnZpY2UsbGVhZmxldERhdGEsIHRvYXN0cil7XG4gICAgICAgIC8vXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgIHZtLmluZGljYXRvcnMgPSBbXTtcbiAgICAgICAgdm0uc2NhbGUgPSBcIlwiO1xuICAgICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICAgIHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpO1xuICAgICAgICB2bS5jb3VudHJpZXNTdHlsZSA9IGNvdW50cmllc1N0eWxlO1xuICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UuY3JlYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG5cblxuICAgICAgICBjb25zb2xlLmxvZyh2bS5pbmRpY2F0b3IpO1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICAgIHZtLmluZGljYXRvciA9IG47XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBpZih2bS5pbmRpY2F0b3Iuc3R5bGUpe1xuICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyh2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5pbmRpY2F0b3InLCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pIHJldHVybjtcbiAgICAgICAgICBpZih0eXBlb2Ygbi5zdHlsZV9pZCAhPSBcInVuZGVmaW5lZFwiICl7XG4gICAgICAgICAgICBpZihuLnN0eWxlX2lkICE9IG8uc3R5bGVfaWQpe1xuICAgICAgICAgICAgICBpZihuLnN0eWxlKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZih0eXBlb2Ygbi5jYXRlZ29yaWVzICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICBpZihuLmNhdGVnb3JpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uY2F0ZWdvcmllc1swXS5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0QWN0aXZlSW5kaWNhdG9yRGF0YShuKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSx0cnVlKTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIG1pbk1heCgpe1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5taW4pO1xuICAgICAgICAgICAgICB2bS5tYXggPSBNYXRoLm1heChpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWF4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgIGlmKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0gPT0gaXNvKXtcbiAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG4gICAgXHRcdFx0dmFyIHN0eWxlID0ge307XG4gICAgXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG4gICAgXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcbiAgICBcdFx0XHR2YXIgZmllbGQgPSB2bS5pbmRpY2F0b3IuY29sdW1uX25hbWU7XG4gICAgXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cbiAgICBcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcbiAgICBcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuICAgIFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG4gICAgXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcbiAgICBcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG4gICAgXHRcdFx0XHRcdFx0XHRzaXplOiAyXG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRicmVhaztcblxuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJykge1xuICAgIFx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcbiAgICBcdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuICAgIFx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdFx0XHR9O1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdH1cbiAgICAgICAgZnVuY3Rpb24gc2V0Q291bnRyaWVzKCl7XG4gICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcbiAgICAgICAgICB2bS5tdnRTb3VyY2UucmVkcmF3KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcbiAgICAgICAgICBtaW5NYXgoKTtcbiAgICBcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgIFx0XHRcdFx0dm0ubWFwID0gbWFwO1xuICAgIFx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdFx0c2V0Q291bnRyaWVzKCk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCB0b2FzdHIsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIEluZGV4U2VydmljZS5yZXNldEluZGljYXRvcigpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgIHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcbiAgICAgIHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcbiAgICAgIHZtLmNoZWNrQWxsID0gY2hlY2tBbGw7XG4gICAgICB2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cbiAgICAgIGZ1bmN0aW9uIHNlbGVjdEZvckVkaXRpbmcoa2V5KXtcbiAgICAgICAgaWYodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSx7XG4gICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICB0aXRsZTprZXlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2bS5lZGl0aW5nSXRlbSA9IGtleTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpO1xuICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNoZWNrQmFzZShpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLnR5cGUgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuICBcdFx0XHRcdHJldHVybiB0cnVlO1xuICBcdFx0XHR9XG4gIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgXHRcdH1cbiAgXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbChpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0cmV0dXJuIGNoZWNrQmFzZShpdGVtKSAmJiBpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY2hlY2tBbGwoKXtcbiAgICAgICAgdmFyIGRvbmUgPSAwO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaW5kaWNhdG9yKXtcbiAgICAgICAgICBpZihjaGVja0Jhc2UoaW5kaWNhdG9yKSl7XG4gICAgICAgICAgICBkb25lICsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZG9uZSwgT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoKTtcbiAgICAgICAgaWYoZG9uZSA9PSBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpe1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHNhdmVEYXRhKCkge1xuXG4gICAgICAgICAgaWYoIXZtLm1ldGEueWVhcl9maWVsZCAmJiAhdm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRZZWFyJywgJHNjb3BlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gIFx0XHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG4gIFx0XHRcdFx0XHRkYXRhOiBbXVxuICBcdFx0XHRcdH07XG4gIFx0XHRcdFx0dmFyIG5vWWVhcnMgPSBbXTtcbiAgXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuICBcdFx0XHRcdFx0ZmllbGRzID0gW107XG4gIFx0XHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG4gIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuICBcdFx0XHRcdFx0XHRpZihpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSl7XG4gIFx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhLnllYXIgPSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblxuICBcdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcbiAgXHRcdFx0XHRcdFx0XHR9XG5cbiAgXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdGVsc2V7XG4gICAgICAgICAgICAgICAgaWYodm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuICAgICAgICAgICAgICAgICAgdm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgXHRub1llYXJzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgXHRcdFx0XHRcdFx0fVxuXG5cbiAgXHRcdFx0XHRcdH0gZWxzZSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gIFx0XHRcdFx0XHRcdHJldHVybjtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG4gIFx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG4gIFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRzdHlsZV9pZCA9IHZtLmluZGljYXRvcnNba2V5XS5zdHlsZS5pZDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG4gIFx0XHRcdFx0XHRcdFx0J2NvbHVtbic6IGtleSxcbiAgXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG4gIFx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuICBcdFx0XHRcdFx0XHRcdCdtZWFzdXJlX3R5cGVfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZS5pZCB8fCAwLFxuICBcdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG4gIFx0XHRcdFx0XHRcdFx0J2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuICBcdFx0XHRcdFx0XHR9O1xuICBcdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuICBcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcbiAgXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcbiAgXHRcdFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0XHRcdGZpZWxkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuICBcdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gIFx0XHRcdFx0aWYobm9ZZWFycy5sZW5ndGggPiAwKXtcbiAgXHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcImZvciBcIitub1llYXJzLmxlbmd0aCArIFwiIGVudHJpZXNcIiwgJ05vIHllYXIgdmFsdWUgZm91bmQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHJlc3BvbnNlLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICBcdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcbiAgXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuICBcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuICBcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuICBcdFx0XHRcdFx0XHRcdHZtLmRhdGEgPSBbXTtcbiAgXHRcdFx0XHRcdFx0XHR2bS5zdGVwID0gMDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCAnT3VjaCEnKTtcblxuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuICBcdFx0XHRcdH0pXG5cbiAgXHRcdH1cbiAgICAgIGZ1bmN0aW9uIGNvcHlUb090aGVycygpe1xuICAgICAgLyogIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgdm0ucHJlVHlwZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0udHlwZTtcbiAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcblxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTsqL1xuICAgICAgfVxuICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZihuID09PSBvKXJldHVybjtcbiAgICAgICAgdm0uaW5kaWNhdG9yc1tuLmNvbHVtbl9uYW1lXSA9IG47XG4gICAgICB9LHRydWUpO1xuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYgKG4gPT09IG8gfHwgdHlwZW9mIG8gPT0gXCJ1bmRlZmluZWRcIiB8fCBvID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYoIXZtLmFza2VkVG9SZXBsaWNhdGUpIHtcbiAgICAgICAgICB2bS5wcmVQcm92aWRlciA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uZGF0YXByb3ZpZGVyO1xuICAgICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICAgIHZtLnByZUNhdGVnb3JpZXMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmNhdGVnb3JpZXM7XG4gICAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9uLmRhdGFwcm92aWRlciA9IHZtLmRvUHJvdmlkZXJzID8gdm0ucHJlUHJvdmlkZXIgOiBbXTtcbiAgICAgICAgICAvL24ubWVhc3VyZV90eXBlX2lkID0gdm0uZG9NZWFzdXJlcyA/IHZtLnByZU1lYXN1cmUgOiAwO1xuICAgICAgICAgIC8vbi5jYXRlZ29yaWVzID0gdm0uZG9DYXRlZ29yaWVzID8gdm0ucHJlQ2F0ZWdvcmllczogW107XG4gICAgICAgICAgLy9uLmlzX3B1YmxpYyA9IHZtLmRvUHVibGljID8gdm0ucHJlUHVibGljOiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFFbnRyeUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IFVzZXJTZXJ2aWNlLm15RGF0YSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhTWVudUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICB2bS5kYXRhID0gW107XG5cbiAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlLm15RGF0YSgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgdm0uZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBjb252ZXJ0SW5mbygpO1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0SW5mbygpe1xuICAgICAgICBjb25zb2xlLmxvZyh2bS5kYXRhKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgaXRlbS5tZXRhID0gSlNPTi5wYXJzZShpdGVtLm1ldGFfZGF0YSk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSxJbmRleFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG5cbiAgICAgICAgLy9UT0RPOiBDaGVjayBpZiB0aGVyZSBpcyBkYXRhIGluIHN0b3JhZ2UgdG8gZmluaXNoXG4gICAgICAvKiAgY29uc29sZS5sb2coJHN0YXRlKTtcbiAgICAgICAgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmNyZWF0ZScpe1xuICAgICAgICAgIGlmKEluZGV4U2VydmljZS5nZXREYXRhKCkubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKGNvbmZpcm0oJ0V4aXN0aW5nIERhdGEuIEdvIE9uPycpKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSovXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWFwID0gbnVsbDtcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPVtdO1xuICAgICAgICB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcblxuICAgICAgICB2bS5ncm91cHMgPSBbXTtcbiAgICAgICAgdm0ubXlEYXRhID0gW107XG4gICAgICAgIHZtLmFkZERhdGFUbyA9IHt9O1xuICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5vcGVuQ2xvc2UgPSBvcGVuQ2xvc2U7XG4gICAgICAgIC8vdm0uc2VhcmNoID0gc2VhcmNoO1xuXG4gICAgICAgIHZtLmxpc3RSZXNvdXJjZXMgPSBsaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS50b2dnbGVMaXN0UmVzb3VyY2VzID0gdG9nZ2xlTGlzdFJlc291cmNlcztcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZSA9IHNlbGVjdGVkUmVzb3VyY2U7XG4gICAgICAgIHZtLnRvZ2dsZVJlc291cmNlID0gdG9nZ2xlUmVzb3VyY2U7XG4gICAgICAgIHZtLmluY3JlYXNlUGVyY2VudGFnZSA9IGluY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0uZGVjcmVhc2VQZXJjZW50YWdlID0gZGVjcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS50b2dnbGVHcm91cFNlbGVjdGlvbiA9IHRvZ2dsZUdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5leGlzdHNJbkdyb3VwU2VsZWN0aW9uID0gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uYWRkR3JvdXAgPSBhZGRHcm91cDtcbiAgICAgICAgdm0uY2xvbmVTZWxlY3Rpb24gPSBjbG9uZVNlbGVjdGlvbjtcbiAgICAgICAgdm0uZWRpdEVudHJ5ID0gZWRpdEVudHJ5O1xuICAgICAgICB2bS5yZW1vdmVFbnRyeSA9IHJlbW92ZUVudHJ5O1xuICAgICAgICB2bS5zYXZlSW5kZXggPSBzYXZlSW5kZXg7XG5cbiAgICAgICAgdm0uaWNvbnMgPSBJY29uc1NlcnZpY2UuZ2V0TGlzdCgpO1xuXG4gICAgICAgIHZtLm1ldGEgPSB7XG4gICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgIH07XG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgb3JkZXI6ICctZXJyb3JzJyxcbiAgICAgICAgICBsaW1pdDogMTUsXG4gICAgICAgICAgcGFnZTogMVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qdm0udHJlZU9wdGlvbnMgPSB7XG4gICAgICAgICAgYmVmb3JlRHJvcDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBpZihldmVudC5kZXN0Lm5vZGVzU2NvcGUgIT0gZXZlbnQuc291cmNlLm5vZGVzU2NvcGUpe1xuICAgICAgICAgICAgICB2YXIgaWR4ID0gZXZlbnQuZGVzdC5ub2Rlc1Njb3BlLiRtb2RlbFZhbHVlLmluZGV4T2YoZXZlbnQuc291cmNlLm5vZGVTY29wZS4kbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICAgIGlmKGlkeCA+IC0xKXtcbiAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLm5vZGVTY29wZS4kJGFwcGx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignT25seSBvbmUgZWxlbWVudCBvZiBhIGtpbmQgcGVyIGdyb3VwIHBvc3NpYmxlIScsICdOb3QgYWxsb3dlZCEnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wcGVkOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9OyovXG5cbiAgICAgICAgLy9SdW4gU3RhcnR1cC1GdW5jaXRvbnNcbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIC8vY2xlYXJNYXAoKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2UucmVzZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvcGVuQ2xvc2UoYWN0aXZlKXtcbiAgICAgICAgICByZXR1cm4gYWN0aXZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckxheWVyU3R5bGUoZmVhdHVyZSl7XG4gICAgICBcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgIGNvbG9yOidyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICAgICAgICAgICAgb3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9XG4gICAgICAgICAgICB9O1xuICAgICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFwKCl7XG4gICAgICAgICAgXHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY2xlYXJMYXllclN0eWxlKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVMaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgdm0uc2hvd1Jlc291cmNlcyA9ICF2bS5zaG93UmVzb3VyY2VzO1xuICAgICAgICAgIGlmKHZtLnNob3dSZXNvdXJjZXMpe1xuICAgICAgICAgICAgdm0ubGlzdFJlc291cmNlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgaWYoIXZtLnJlc291cmNlcyl7XG4gICAgICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGEvdGFibGVzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIHZtLnJlc291cmNlcyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9IFtdLCB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0ZWRSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpID4gLTEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBsaXN0KXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgLy9pZih0eXBlb2YgaXRlbS5pc0dyb3VwID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgIGlmKGl0ZW0gPT0gcmVzb3VyY2Upe1xuICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2Uoa2V5LCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2Uodm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihpdGVtKSwxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGl0ZW0ubm9kZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCB2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL2NhbGNQZXJjZW50YWdlKHZtLnNvcnRlZFJlc291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2FsY1BlcmNlbnRhZ2Uobm9kZXMpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcbiAgICAgICAgICAgIG5vZGVzW2tleV0ud2VpZ2h0ID0gcGFyc2VJbnQoMTAwIC8gbm9kZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKG5vZGVzLm5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGluY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVHcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleGlzdHNJbkdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSkgPiAtMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZGRHcm91cCgpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidHcm91cCcsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID4gMCApe1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgdm0uc2VsZWN0ZWRGb3JHcm91cCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xvbmVTZWxlY3Rpb24oKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonQ2xvbmVkIEVsZW1lbnRzJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0RW50cnkoaXRlbSl7XG4gICAgICAgICAgdm0uZWRpdEl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVudHJ5KGl0ZW0sIGxpc3Qpe1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIGxpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNhdmVJbmRleCgpe1xuICAgICAgICAgIGlmKHZtLnNhdmVEaXNhYmxlZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgaWYodHlwZW9mIHZtLm5ld0luZGV4ID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdm0ubmV3SW5kZXgudGl0bGUpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLm5ld0luZGV4LmRhdGEgPSB2bS5ncm91cHM7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5uZXdJbmRleCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3VyIEluZGV4IGhhcyBiZWVuIGNyZWF0ZWQnLCAnU3VjY2VzcycpLFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDpyZXNwb25zZS5uYW1lfSk7XG4gICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCdVcHBzISEnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgIGlmKCF2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnOlxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codm0uZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjaGVja015RGF0YSgpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDI7XG4gICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUubWV0YSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMztcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uICgkc3RhdGUsIGNhdGVnb3J5LCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uY2F0ZWdvcnkgPSBjYXRlZ29yeTtcblx0XHR2bS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHR2bS5vcHRpb25zID0ge1xuXHRcdFx0Z2xvYmFsU2F2ZTp0cnVlLFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmRhdGEuaWR9KVxuXHRcdFx0fSxcblx0XHR9XG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCwkc3RhdGUsIGluZGljYXRvcnMsIGluZGljZXMsIHN0eWxlcywgY2F0ZWdvcmllcywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLmNvbXBvc2l0cyA9IGluZGljZXM7XG5cdFx0dm0uc3R5bGVzID0gc3R5bGVzO1xuXHRcdHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXHRcdHZtLmNoZWNrVGFiQ29udGVudCA9IGNoZWNrVGFiQ29udGVudDtcblxuXHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLnNlbGVjdGlvbiA9IHtcblx0XHRcdGluZGljZXM6W10sXG5cdFx0XHRpbmRpY2F0b3JzOltdLFxuXHRcdFx0c3R5bGVzOltdLFxuXHRcdFx0Y2F0ZWdvcmllczpbXVxuXHRcdH07XG5cblxuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRjb21wb3NpdHM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjb21wb3NpdHMnLFxuXHRcdFx0XHRhbGxvd01vdmU6ZmFsc2UsXG5cdFx0XHRcdGFsbG93RHJvcDpmYWxzZSxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0aXRlbUNsaWNrOiBmdW5jdGlvbihpZCwgbmFtZSl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtpZDppZCwgbmFtZTpuYW1lfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOjAsIG5hbWU6ICduZXcnfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmluZGljZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5pbmRpY2VzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjYXRlZ29yaWVzOntcblx0XHRcdFx0ZHJhZzpmYWxzZSxcblx0XHRcdFx0dHlwZTonY2F0ZWdvcmllcycsXG5cdFx0XHRcdGFsbG93QWRkOnRydWUsXG5cdFx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRcdGFkZENsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6J25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblxuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmlkfSlcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLmNhdGVnb3JpZXMsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUNhdGVnb3J5KGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRzdHlsZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidzdHlsZXMnLFxuXHRcdFx0XHR3aXRoQ29sb3I6dHJ1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblxuXHRcdGZ1bmN0aW9uIGNoZWNrVGFiQ29udGVudChpbmRleCl7XG5cdFx0XHRzd2l0Y2ggKGluZGV4KSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiAkc3RhdGUucGFyYW1zLmlkICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiRzdGF0ZS5wYXJhbXMuaWRcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuXHRcdCAgaWYodHlwZW9mIHRvUGFyYW1zLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uYWN0aXZlID0gdG9QYXJhbXMuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDE7XG5cdFx0XHRcdC8vYWN0aXZhdGUodG9QYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kaWNhdG9yKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvciA9IGluZGljYXRvcjtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0c2V0QWN0aXZlKCk7XG5cblx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTtcblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWluTWF4KCl7XG5cdFx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHRcdHZtLm1heCA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHR2bS5taW4gPSBNYXRoLm1pbihpdGVtLnNjb3JlLCB2bS5taW4pO1xuXHRcdFx0XHRcdHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uc2NvcmUsIHZtLm1heCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcblx0XHRcdHZhciB2YWx1ZSA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0IGlmKGl0ZW0uaXNvID09IGlzbyl7XG5cdFx0XHRcdFx0IHZhbHVlID0gaXRlbS5zY29yZTtcblx0XHRcdFx0IH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KHZtLnNjYWxlKHZhbHVlKSkpICogNDtcblx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRzZXRBY3RpdmUoKTtcblx0XHR9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGluaWRjYXRvcnNDdHJsJywgZnVuY3Rpb24gKGluZGljYXRvcnMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0Ly9cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXG5cbiAgfSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JpbmRpemVzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwkdGltZW91dCwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgQ29udGVudFNlcnZpY2UsIGluZGV4KSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIC8vdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuICAgIHZtLmluZGV4ID0gaW5kZXg7XG5cdFx0dm0uc2NhbGUgPSBcIlwiO1xuXHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdHZtLm1heCA9IDA7XG5cdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRzZXRBY3RpdmUoKTtcbiAgICB2bS5vcHRpb25zID0ge1xuICAgICAgaW5kaXplczp7XG4gICAgICAgIGFkZENsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJyk7XG4gICAgICAgIH0sXG5cdFx0XHRcdGFkZENvbnRhaW5lckNsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSB7XG5cdFx0XHRcdFx0XHR0aXRsZTogJ0kgYW0gYSBncm91cC4uLiBuYW1lIG1lJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dm0uaW5kZXguY2hpbGRyZW4ucHVzaChpdGVtKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bSk7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGVsZXRlRHJvcDogZnVuY3Rpb24oZXZlbnQsaXRlbSxleHRlcm5hbCx0eXBlKXtcblx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZW1vdmVJdGVtKGl0ZW0sdm0uaW5kZXguY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cbiAgICAgIH0sXG4gICAgICB3aXRoU2F2ZTogdHJ1ZVxuICAgIH1cblxuXHRcdGFjdGl2ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gcmVtb3ZlSXRlbShpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0LypDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZS5wYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgYmFzZV9jb2xvciA9ICcjZmYwMDAwJztcblx0XHRcdGlmKHR5cGVvZiB2bS5pbmRpY2F0b3Iuc3R5bGUgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3IuY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRpZih0eXBlb2YgY2F0LnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0YmFzZV9jb2xvciA9IGNhdC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG5cdFx0XHRcdGJhc2VfY29sb3IgPSB2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdH1cblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoYmFzZV9jb2xvciApO1xuXHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRtaW5NYXgoKTtcblx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHR9KTsqL1xuXG5cdFx0ZnVuY3Rpb24gc2V0QWN0aXZlKCl7XG5cdFx0LypcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZm9ncmFwaGljXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmRpemVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJzdHlsZVwiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDM7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiY2F0ZWdvcmllc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5mb0N0cmwnLCBmdW5jdGlvbihJbmRpemVzU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnN0cnVjdHVyZSA9IEluZGl6ZXNTZXJ2aWNlLmdldFN0cnVjdHVyZSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGljYXRvclNob3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsJHRpbWVvdXQsIGluZGljYXRvciwgY291bnRyaWVzLCBDb250ZW50U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY3VycmVudCA9IG51bGw7XG5cdFx0dm0uYWN0aXZlID0gbnVsbDtcblx0XHR2bS5jb3VudHJ5TGlzdCA9IGNvdW50cmllcztcblx0XHR2bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG5cdFx0dm0uZGF0YSA9IFtdO1xuXHRcdHZtLnJhbmdlID0ge1xuXHRcdFx0bWF4Oi0xMDAwMDAsXG5cdFx0XHRtaW46MTAwMDAwXG5cdFx0fTtcblx0XHR2bS5nZXREYXRhID0gZ2V0RGF0YTtcblx0XHR2bS5zZXRDdXJyZW50ID0gc2V0Q3VycmVudDtcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0UmFuayA9IGdldFJhbms7XG5cdFx0dm0uZ29JbmZvU3RhdGUgPSBnb0luZm9TdGF0ZTtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuY291bnRyeUNsaWNrKGNvdW50cnlDbGljayk7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLnllYXIpe1xuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2bS5pbmRpY2F0b3IueWVhcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0aWYodm0uaW5kaWNhdG9yLnllYXJzW2ldLnllYXIgPT0gJHN0YXRlLnBhcmFtcy55ZWFyKXtcblx0XHRcdFx0XHRcdFx0dm0uYWN0aXZlID0gIGk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIXZtLmFjdGl2ZSl7XG5cdFx0XHRcdFx0dm0uYWN0aXZlID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGlzbykge1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdC8vdm0uY3VycmVudCA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0fSlcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGdvSW5mb1N0YXRlKCl7XG5cdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJyx7eWVhcjp2bS55ZWFyfSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicse2lkOnZtLmluZGljYXRvci5pZCwgbmFtZTp2bS5pbmRpY2F0b3IubmFtZSwgeWVhcjp2bS55ZWFyfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSkge1xuXHRcdFx0dmFyIHJhbmsgPSB2bS5kYXRhLmluZGV4T2YoY291bnRyeSkgKyAxO1xuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpKTtcblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTc7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldEN1cnJlbnQobmF0KSB7XG5cdFx0XHR2bS5jdXJyZW50ID0gbmF0O1xuXHRcdFx0c2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZSgpIHtcblxuXHRcdFx0LypcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpLmxheWVyc1tWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpKydfZ2VvbSddLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH0pOyovXG5cdFx0XHRcdC8qaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuY291bnRyeScseyBpc286dm0uY3VycmVudC5pc299KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvLmNvdW50cnknLHsgaXNvOnZtLmN1cnJlbnQuaXNvfSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygkc3RhdGUuY3VycmVudC5uYW1lLHsgaXNvOnZtLmN1cnJlbnQuaXNvfSlcblx0XHRcdFx0fSovXG5cblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsdCl7XG5cdFx0XHR2YXIgYyA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdKTtcblx0XHRcdGlmICh0eXBlb2YgYy5zY29yZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBjO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldERhdGEoeWVhcikge1xuXHRcdFx0dm0ueWVhciA9IHllYXI7XG5cdFx0XHRDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKHZtLmluZGljYXRvci5pZCwgeWVhcikudGhlbihmdW5jdGlvbihkYXQpIHtcblx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJyx7eWVhcjp5ZWFyfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicse3llYXI6eWVhcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInLHt5ZWFyOnllYXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2bS5kYXRhID0gZGF0O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdFx0aXRlbS5yYW5rID0gdm0uZGF0YS5pbmRleE9mKGl0ZW0pICsxO1xuXHRcdFx0XHRcdGlmKHZtLmN1cnJlbnQpe1xuXHRcdFx0XHRcdFx0aWYoaXRlbS5pc28gPT0gdm0uY3VycmVudC5pc28pe1xuXHRcdFx0XHRcdFx0XHRzZXRDdXJyZW50KGl0ZW0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZtLnJhbmdlLm1heCA9ICBkMy5tYXgoW3ZtLnJhbmdlLm1heCwgcGFyc2VGbG9hdChpdGVtLnNjb3JlKV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9ICBkMy5taW4oW3ZtLnJhbmdlLm1pbiwgcGFyc2VGbG9hdChpdGVtLnNjb3JlKV0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogdm0uaW5kaWNhdG9yLnN0eWxlZC5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0XHRcdGZpZWxkOiAncmFuaycsXG5cdFx0XHRcdFx0XHRzaXplOiB2bS5kYXRhLmxlbmd0aFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0Z2V0T2Zmc2V0KCk7XG5cdFx0XHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5yYW5nZS5taW4sdm0ucmFuZ2UubWF4XSkucmFuZ2UoWzAsMjU2XSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmRhdGEsIHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciwgdHJ1ZSk7XG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGNvdW50cmllc1N0eWxlLCBjb3VudHJ5Q2xpY2spO1xuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0aWYodm0uY3VycmVudCl7XG5cdFx0XHRcdGlmKHZtLmN1cnJlbnQuaXNvID09IGlzbyl7XG5cdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpb25bZmllbGRdICE9IG51bGwpe1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSAgcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLFxuXHRcdFx0ZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuXHRcdFx0XHRpZih0b1N0YXRlLm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IuZGF0YScpe1xuXG5cdFx0XHRcdH1cblx0XHR9KVxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JZZWFyVGFibGVDdHJsJywgZnVuY3Rpb24gKCRmaWx0ZXIsIGRhdGEpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZGF0YSA9IGRhdGE7XG4gICAgdm0ub25PcmRlckNoYW5nZSA9IG9uT3JkZXJDaGFuZ2U7XG5cdFx0dm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuXG4gICAgZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuXHRcdFx0cmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcblx0XHRcdC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG5cdFx0fTtcblxuXG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgJGF1dGgsIHRvYXN0cil7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnByZXZTdGF0ZSA9IG51bGw7XG4gICAgICAgIHZtLmRvTG9naW4gPSBkb0xvZ2luO1xuICAgICAgICB2bS5jaGVja0xvZ2dlZEluID0gY2hlY2tMb2dnZWRJbjtcbiAgICAgIFxuICAgICAgICB2bS51c2VyID0ge1xuICAgICAgICAgIGVtYWlsOicnLFxuICAgICAgICAgIHBhc3N3b3JkOicnXG4gICAgICAgIH07XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDonZXBpJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkb0xvZ2luKCl7XG4gICAgICAgICAgJGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCcsICdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ29DdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hcEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGxlYWZsZXREYXRhLCBsZWFmbGV0TWFwRXZlbnRzLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXG5cdFx0dmFyIHpvb20gPSAzLFxuXHRcdFx0bWluWm9vbSA9IDI7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNjAwKSB7XG5cdFx0XHR6b29tID0gMjtcblx0XHR9XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmtleXMubWFwYm94O1xuXHRcdHZtLnRvZ2dsZUxheWVycyA9IHRvZ2dsZUxheWVycztcblx0XHR2bS5kZWZhdWx0cyA9IHtcblx0XHRcdC8vc2Nyb2xsV2hlZWxab29tOiBmYWxzZSxcblx0XHRcdG1pblpvb206IG1pblpvb21cblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogNDguMjA5MjA2LFxuXHRcdFx0bG5nOiAxNi4zNzI3NzgsXG5cdFx0XHR6b29tOiB6b29tXG5cdFx0fTtcblx0XHR2bS5sYXllcnMgPSB7XG5cdFx0XHRiYXNlbGF5ZXJzOiB7XG5cdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdG5hbWU6ICdPdXRkb29yJyxcblx0XHRcdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L3ZhbGRlcnJhbWEuZDg2MTE0YjYve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LFxuXHRcdFx0XHRcdHR5cGU6ICd4eXonLFxuXHRcdFx0XHRcdGxheWVyT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0Y29udGludW91c1dvcmxkOiBmYWxzZSxcblx0XHRcdFx0XHRcdGRldGVjdFJldGluYTogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0ubGFiZWxzTGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYWdub2xvLjA2MDI5YTljL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSwge1xuXHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0Y29udGludW91c1dvcmxkOiBmYWxzZSxcblx0XHRcdG5hbWU6ICdsYWJlbHMnLFxuXHRcdFx0ZGV0ZWN0UmV0aW5hOiB0cnVlXG5cdFx0fSk7XG5cdFx0dm0ubWF4Ym91bmRzID0ge1xuXHRcdFx0c291dGhXZXN0OiB7XG5cdFx0XHRcdGxhdDogOTAsXG5cdFx0XHRcdGxuZzogMTgwXG5cdFx0XHR9LFxuXHRcdFx0bm9ydGhFYXN0OiB7XG5cdFx0XHRcdGxhdDogLTkwLFxuXHRcdFx0XHRsbmc6IC0xODBcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLmNvbnRyb2xzID0ge1xuXHRcdFx0Y3VzdG9tOiBbXVxuXHRcdH07XG5cdFx0dm0ubGF5ZXJjb250cm9sID0ge1xuXHRcdFx0aWNvbnM6IHtcblx0XHRcdFx0dW5jaGVjazogXCJmYSBmYS10b2dnbGUtb2ZmXCIsXG5cdFx0XHRcdGNoZWNrOiBcImZhIGZhLXRvZ2dsZS1vblwiXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIE15Q29udHJvbCA9IEwuY29udHJvbCgpO1xuXHRcdE15Q29udHJvbC5zZXRQb3NpdGlvbigndG9wbGVmdCcpO1xuXHRcdE15Q29udHJvbC5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRMLlV0aWwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0TXlDb250cm9sLm9uQWRkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtYmFyIGxlYWZsZXQtY29udHJvbC16b29tJyk7XG5cdFx0XHR2YXIgc3BhbiA9IEwuRG9tVXRpbC5jcmVhdGUoJ2EnLCAnbGVhZmxldC1jb250cm9sLXpvb20taW4gY3Vyc29yJywgY29udGFpbmVyKTtcblx0XHRcdHNwYW4udGV4dENvbnRlbnQgPSAnVCc7XG5cdFx0XHRMLkRvbUV2ZW50LmRpc2FibGVDbGlja1Byb3BhZ2F0aW9uKGNvbnRhaW5lcik7XG5cdFx0XHRMLkRvbUV2ZW50LmFkZExpc3RlbmVyKGNvbnRhaW5lciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0XHRpZiAodm0ubm9MYWJlbCkge1xuXHRcdFx0XHRcdFx0bWFwLnJlbW92ZUxheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHRcdHZtLm5vTGFiZWwgPSBmYWxzZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWFwLmFkZExheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHRcdHZtLmxhYmVsc0xheWVyLmJyaW5nVG9Gcm9udCgpO1xuXHRcdFx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNvbnRhaW5lcjtcblx0XHR9XG5cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUxheWVycyhvdmVybGF5TmFtZSkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHRpZiAodm0ubm9MYWJlbCkge1xuXHRcdFx0XHRcdG1hcC5yZW1vdmVMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0dm0ubm9MYWJlbCA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0dm0ubGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRNYXAobWFwKTtcblx0XHRcdHZhciB1cmwgPSAnaHR0cDovL3YyMjAxNTA1MjgzNTgyNTM1OC55b3VydnNlcnZlci5uZXQ6MzAwMS9zZXJ2aWNlcy9wb3N0Z2lzLycgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPScgKyBWZWN0b3JsYXllclNlcnZpY2UuZmllbGRzKCk7IC8vXG5cdFx0XHR2YXIgbGF5ZXIgPSBuZXcgTC5UaWxlTGF5ZXIuTVZUU291cmNlKHtcblx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdFx0ZGV0ZWN0UmV0aW5hOnRydWUsXG5cdFx0XHRcdGNsaWNrYWJsZUxheWVyczogW1ZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnX2dlb20nXSxcblx0XHRcdFx0bXV0ZXhUb2dnbGU6IHRydWUsXG5cdFx0XHRcdGdldElERm9yTGF5ZXJGZWF0dXJlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZpbHRlcjogZnVuY3Rpb24oZmVhdHVyZSwgY29udGV4dCkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN0eWxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdFx0XHRzaXplOiAwXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRtYXAuYWRkTGF5ZXIoVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldExheWVyKGxheWVyKSk7XG5cdFx0XHRtYXAuYWRkQ29udHJvbChNeUNvbnRyb2wpO1xuXHRcdFx0LyptYXAub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0YWxlcnQoJ2hlbGxvJyk7XG5cdFx0XHR9KTtcblxuICAgICAgICAgICAgdmFyIG1hcEV2ZW50cyA9IGxlYWZsZXRNYXBFdmVudHMuZ2V0QXZhaWxhYmxlTWFwRXZlbnRzKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIG1hcEV2ZW50cyl7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLicgKyBtYXBFdmVudHNba107XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWFwRXZlbnRzW2tdKVxuICAgICAgICAgICAgICAgICRzY29wZS4kb24oZXZlbnROYW1lLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50Lm5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXHRcdC8qXHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0dm0ubGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHRcdHZtLm5vTGFiZWwgPSB0cnVlOyovXG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGVkQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0Q291bnRyeSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCAkZmlsdGVyKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gJHNjb3BlLiRwYXJlbnQudm0uc3RydWN0dXJlO1xuICAgICAgICB2bS5kaXNwbGF5ID0gJHNjb3BlLiRwYXJlbnQudm0uZGlzcGxheTtcbiAgICAgICAgdm0uZGF0YSA9ICRzY29wZS4kcGFyZW50LnZtLmRhdGE7XG4gICAgICAgIHZtLmN1cnJlbnQgPSBnZXRDb3VudHJ5O1xuICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgdm0uZ2V0UmFuayA9IGdldFJhbms7XG4gICAgICAgIHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcbiAgICAgICAgdm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuICAgICAgICBmdW5jdGlvbiBjYWxjUmFuaygpIHtcbiAgICAgICAgICB2YXIgcmFuayA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSk7XG4gICAgICAgICAgICBpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJbaV0uaXNvID09IHZtLmN1cnJlbnQuaXNvKSB7XG4gICAgICAgICAgICAgIHJhbmsgPSBpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXSA9IHJhbms7XG4gICAgICAgICAgdm0uY2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgY29sb3I6dm0uc3RydWN0dXJlLmNvbG9yLFxuICAgICAgICAgICAgICBmaWVsZDp2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSl7XG4gICAgICAgICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG4gICAgICAgICAgICAgIHJhbmsgPSBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJhbmsrMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG4gICAgXHRcdFx0XHRyZXR1cm4gMDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNjtcbiAgICBcdFx0fTtcblxuICAgIFx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcbiAgICBcdFx0fTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24gKG4sIG8pIHtcbiAgICAgICAgICBpZiAobiA9PT0gbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoby5pc28pe1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGNSYW5rKCk7XG4gICAgICAgICAgICBmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8qOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZW1lbnVDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZ251cEN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUb2FzdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBUb2FzdFNlcnZpY2Upe1xuXG5cdFx0JHNjb3BlLnRvYXN0U3VjY2VzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2Uuc2hvdygnVXNlciBhZGRlZCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0fTtcblxuXHRcdCRzY29wZS50b2FzdEVycm9yID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignQ29ubmVjdGlvbiBpbnRlcnJ1cHRlZCEnKTtcblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5zdXBwb3J0ZWRCcm93c2VyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVc2VyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRQcm92aWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2UsIERhdGFTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyID0ge307XG4gICAgICAgIHZtLmRhdGFwcm92aWRlci50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFRleHQ7XG5cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL2RhdGFwcm92aWRlcnMnLCB2bS5kYXRhcHJvdmlkZXIpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRhdGFwcm92aWRlcnMucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS5kYXRhcHJvdmlkZXIgPSBkYXRhO1xuICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVuaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhU2VydmljZSxEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLnVuaXQgPSB7fTtcbiAgICAgIHZtLnVuaXQudGl0bGUgPSAkc2NvcGUuJHBhcmVudC52bS5zZWFyY2hVbml0O1xuXG4gICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAvL1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJy9tZWFzdXJlX3R5cGVzJywgdm0udW5pdCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLm1lYXN1cmVUeXBlcy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS50eXBlID0gZGF0YTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9O1xuXG4gICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICB9O1xuXG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFllYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudm0pO1xuICAgICAgICAgICAgJHNjb3BlLnZtLnNhdmVEYXRhKCk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdG1ldGhvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3R0ZXh0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gIFxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29weXByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEluZGV4U2VydmljZSwgRGlhbG9nU2VydmljZSkge1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmFza2VkVG9SZXBsaWNhdGUgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1N0eWxlID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljID0gdHJ1ZTtcblx0XHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS4kcGFyZW50LnZtLmRhdGFbMF0uZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGtleSkge1xuXHRcdFx0XHRpZiAoa2V5ICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEluZGljYXRvcihrZXksIHtcblx0XHRcdFx0XHRcdFx0Y29sdW1uX25hbWU6IGtleSxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IGtleVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBpdGVtID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpO1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycykge1xuXHRcdFx0XHRcdFx0aXRlbS5kYXRhcHJvdmlkZXIgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVQcm92aWRlcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMpIHtcblx0XHRcdFx0XHRcdGl0ZW0udHlwZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVR5cGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMpIHtcblx0XHRcdFx0XHRcdGl0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS4kcGFyZW50LnZtLnByZUNhdGVnb3JpZXM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYykge1xuXHRcdFx0XHRcdFx0aXRlbS5pc19wdWJsaWMgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVQdWJsaWM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb1N0eWxlKSB7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uc3R5bGUgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVTdHlsZTtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZV9pZCA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlLmlkO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cblx0XHR9O1xuXG5cdFx0JHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyA9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gZmFsc2U7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRWRpdGNvbHVtbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUubmFtZSA9ICRzY29wZS4kcGFyZW50LnZtLnRvRWRpdDtcbiAgICAgICAgaWYodHlwZW9mICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSl7XG4gICAgICAgICAgICAkc2NvcGUudGl0bGUgPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24pe1xuICAgICAgICAgICAgJHNjb3BlLmRlc2NyaXB0aW9uID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb247XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlID0gJHNjb3BlLnRpdGxlO1xuICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uID0gJHNjb3BlLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRWRpdHJvd0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuZGF0YSA9ICRzY29wZS4kcGFyZW50LnZtLnNlbGVjdGVkWzBdO1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFeHRlbmREYXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkc3RhdGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS52bS5kb0V4dGVuZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5pc29fZmllbGQgPSAkc2NvcGUudm0uYWRkRGF0YVRvLmlzb19uYW1lO1xuICAgICAgICAgICAgJHNjb3BlLnZtLm1ldGEuY291bnRyeV9maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uY291bnRyeV9uYW1lO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb29zZWRhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAkc2NvcGUudm0uZGVsZXRlRGF0YSgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzY29wZS50b1N0YXRlLm5hbWUpO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0aXNvZmV0Y2hlcnNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgbWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uaXNvID0gbWV0YS5pc29fZmllbGQ7XG5cdFx0dm0ubGlzdCA9IEluZGV4U2VydmljZS5nZXRUb1NlbGVjdCgpO1xuXHRcdHZtLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHR9O1xuXG5cdFx0dm0uaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0ubGlzdCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobiwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lbnRyeS5kYXRhWzBdW3ZtLmlzb10pIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lbnRyeS5lcnJvcnMsIGZ1bmN0aW9uIChlcnJvciwgZSkge1xuXHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uZW50cnkuZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0uaXNvKSB7XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm0ubGlzdC5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAodm0ubGlzdC5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9LCB0cnVlKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnYXV0b0ZvY3VzJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHRyZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0FDJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oX3Njb3BlLCBfZWxlbWVudCkge1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfZWxlbWVudFswXS5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0JhcnNDdHJsJywgZnVuY3Rpb24gKCkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS53aWR0aCA9IHdpZHRoO1xuXG5cdFx0ZnVuY3Rpb24gd2lkdGgoaXRlbSkge1xuXHRcdFx0aWYoIXZtLmRhdGEpIHJldHVybjtcblx0XHRcdHJldHVybiB2bS5kYXRhW2l0ZW0ubmFtZV07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdiYXJzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvYmFycy9iYXJzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0JhcnNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRkYXRhOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c3RydWN0dXJlOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSwgSWNvbnNTZXJ2aWNlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGxhYmVsczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0bGFiZWxzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7fTtcblxuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4ubGVuZ3RoID09IDIgJiYgc2NvcGUuaW5kZXhlci5jaGlsZHJlblswXS5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoZ3JvdXAsIGluZGV4KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtQ29sb3IgPSBncm91cC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0aWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0bUNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZ3JvdXAudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IG1Db2xvcixcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBncm91cC5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGdyb3VwLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdyb3VwLFxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOmdyb3VwLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY29sb3IgPSBpdGVtLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoaXRlbS5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3IgPSBpdGVtLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmKGdyb3VwLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGdyb3VwLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ncm91cHMoKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXG5cdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBzY29wZS5pbmRleGVyLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogc2NvcGUuaW5kZXhlci5zdHlsZS5iYXNlX2NvbG9yIHx8IHNjb3BlLmluZGV4ZXIuY29sb3IsXG5cdFx0XHRcdFx0XHRcdGljb246IHNjb3BlLmluZGV4ZXIuaWNvbixcblx0XHRcdFx0XHRcdFx0dW5pY29kZTogc2NvcGUuaW5kZXhlci51bmljb2RlLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBzY29wZS5pbmRleGVyLmRhdGEsXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuOiBzY29wZS5pbmRleGVyLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0ubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2xlYXJfbm9kZXMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdG5vZGVzID0gW107XG5cdFx0XHRcdFx0bGFiZWxzID0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVyc1tub2RlLmdyb3VwXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDIgKyAoMSAtIGtleSksXG5cdFx0XHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDExMClcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0dmFyIGFyY0JvdHRvbSA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSg5MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMF0uY29sb3IgfHwgXCIjYmU1ZjAwXCI7XG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIgLSBvcHRpb25zLmhlaWdodC8xMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjQm90dG9tKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNCb3R0b21cIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbGFiZWxzWzFdLmNvbG9yIHx8IFwiIzAwNmJiNlwiO1xuXHRcdFx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMyAtIDEpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMylcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDM2MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmMgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgbGFiZWxzWzBdLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRpZihvcHRpb25zLmxhYmVscyA9PSB0cnVlICYmIGxhYmVscy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0XHR2YXIgdGV4dExhYmVscyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgndGV4dC5sYWJlbHMnKS5kYXRhKGxhYmVscykuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYWJlbHMnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LypcdC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuICdyb3RhdGUoOTAsIDEwMCwgMTAwKSc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd4JywgXCI1MCVcIilcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMS4yZW0nKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcblxuXHRcdFx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5oZWlnaHQgLSA2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZTtcblx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ2cubm9kZScpLmRhdGEobm9kZXMpLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLyAyKSArICcsJyArIChvcHRpb25zLmhlaWdodCAvIDIpICsgJyknKS5hdHRyKCdjbGFzcycsICdub2RlJyk7XG5cblx0XHRcdFx0XHQvKm9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShub2RlcywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmlkO1xuXHRcdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDApLmF0dHIoXCJmaWxsXCIsIChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3IgfHwgb3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApO1xuXHRcdFx0XHRcdH0pKS5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5yZ2Iob3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApKS5kYXJrZXIoKTtcblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC50eXBlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgPyAnI2ZmZicgOiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRpZihkLnVuaWNvZGUpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlIHx8ICcxJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogMS43NSArICdweCdcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjaGFyZ2UgPSBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiAtTWF0aC5wb3coZC5yYWRpdXMsIDIuMCkgLyA0O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKS5saW5rcyhsaW5rcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2dyb3VwX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC44NSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLndpZHRoLzIgLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqMS4yNTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuaGVpZ2h0LzIgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMjU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRcdHZhciB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdHZhclx0YmFyT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdHRpdGxlZDp0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRjb250ZW50ID0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK2RhdGEudmFsdWUrJ1wiPjwvbWQtcHJvZ3Jlc3MtbGluZWFyPidcblx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj5cIisgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0aWYoc2NvcGUuY2hhcnRkYXRhW2luZm8ubmFtZV0gPiAwICl7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxkaXYgY2xhc3M9XCJzdWJcIj4nO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9ICc8bWQtcHJvZ3Jlc3MtbGluZWFyIG1kLW1vZGU9XCJkZXRlcm1pbmF0ZVwiIHZhbHVlPVwiJytzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiIHN0eWxlPVxcXCJjb2xvcjpcIiArIChpbmZvLmNvbG9yIHx8IGRhdGEuY29sb3IpICsgXCJcXFwiPiBcIitzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSsnIC0gJyArIChpbmZvLnRpdGxlKSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzwvZGl2Pic7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvL2NvbnRlbnQgPSAnPGJhcnMgb3B0aW9ucz1cImJhck9wdGlvbnNcIiBzdHJ1Y3R1cmU9XCJkYXRhLmRhdGEuY2hpbGRyZW5cIiBkYXRhPVwiZGF0YVwiPjwvYmFycz4nO1xuXG5cdFx0XHRcdFx0JGNvbXBpbGUob3B0aW9ucy50b29sdGlwLnNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGQzLmV2ZW50LCBlbGVtKS5jb250ZW50cygpKShzY29wZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGhpZGVfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnY2hhcnRkYXRhJywgZnVuY3Rpb24gKGRhdGEsIG9sZERhdGEpIHtcblx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnaW5kZXhlcicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIG5bMF0uY2hpbGRyZW4gIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0XHRcdGNsZWFyX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL2Rpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uIChvbGRELCBuZXdEKSB7XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT09IG5ld0QpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NhdGVnb3JpZXNDdHJsJywgZnVuY3Rpb24gKCRmaWx0ZXIsIHRvYXN0ciwgRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2F0T3B0aW9ucyA9IHtcblx0XHRcdGFib3J0OiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHBvc3REb25lOmZ1bmN0aW9uKGNhdGVnb3J5KXtcblx0XHRcdFx0dm0uY3JlYXRlQ2F0ZWdvcnkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY2F0ZWdvcmllcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NhdGVnb3JpZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDYXRlZ29yeUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsIHRvYXN0ciwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5zYXZlQ2F0ZWdvcnkgPSBzYXZlQ2F0ZWdvcnk7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cdFx0dm0ucGFyZW50Q2hhbmdlZCA9IHBhcmVudENoYW5nZWQ7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLnN0eWxlcyA9IENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXHRcdHZtLmZsYXR0ZW5lZCA9IFtdO1xuXHRcdHZtLmNvcHkgPSB7fTtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGZsYXR0ZW5XaXRoQ2hpbGRyZW4odm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRpZih2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdHZtLnBhcmVudCA9IGdldFBhcmVudCh2bS5pdGVtLCB2bS5jYXRlZ29yaWVzKTtcblx0XHRcdFx0dm0uY29weSA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZmxhdHRlbldpdGhDaGlsZHJlbihsaXN0KXtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uZmxhdHRlbmVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdGlmKGl0ZW0uY2hpbGRyZW4pe1xuXHRcdFx0XHRcdGZsYXR0ZW5XaXRoQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2hDYXRlZ29yeShxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSgkZmlsdGVyKCdvcmRlckJ5Jykodm0uZmxhdHRlbmVkLCAndGl0bGUnKSwgcXVlcnksICd0aXRsZScpO1xuXHRcdFx0Ly9yZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKCRmaWx0ZXIoJ2ZsYXR0ZW4nKSh2bS5jYXRlZ29yaWVzKSwgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHBhcmVudENoYW5nZWQoaXRlbSl7XG5cdFx0XHRpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uaXRlbS5wYXJlbnRfaWQgPSBudWxsO1xuXHRcdFx0XHR2bS5pdGVtLnBhcmVudCA9IG51bGw7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKGl0ZW0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlIFBhcmVudCBjYW5ub3QgYmUgdGhlIHNhbWUnLCAnSW52YWxpZCBzZWxlY3Rpb24nKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dm0ucGFyZW50ID0gaXRlbTtcblx0XHRcdHZtLml0ZW0ucGFyZW50X2lkID0gaXRlbS5pZDtcblx0XHRcdHZtLml0ZW0ucGFyZW50ID0gaXRlbTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGl0ZW0sbGlzdCl7XG5cdFx0XHR2YXIgZm91bmQgPSBudWxsXG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0XHRmb3VuZCA9IGVudHJ5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuICYmICFmb3VuZCl7XG5cdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IGdldFBhcmVudChpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdGZvdW5kID0gc3VicmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1vdmVJdGVtKCl7XG5cdFx0XHRpZih2bS5jb3B5LnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0dmFyIG9sZFBhcmVudCA9IGdldFBhcmVudCh2bS5jb3B5LCB2bS5jYXRlZ29yaWVzKTtcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb2xkUGFyZW50LmNoaWxkcmVuLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRcdFx0XHRpZihvbGRQYXJlbnQuY2hpbGRyZW5baV0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHRcdG9sZFBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaSwxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm0uY2F0ZWdvcmllcy5sZW5ndGg7IGkrKyApe1xuXHRcdFx0XHRcdGlmKHZtLmNhdGVnb3JpZXNbaV0uaWQgPT0gdm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0XHR2bS5jYXRlZ29yaWVzLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHR2YXIgbmV3UGFyZW50ID0gZ2V0UGFyZW50KHZtLml0ZW0sIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRuZXdQYXJlbnQuY2hpbGRyZW4ucHVzaCh2bS5pdGVtKTtcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKHZtLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzdWNjZXNzQWN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2codm0uY29weS5wYXJlbnRfaWQsIHZtLml0ZW0ucGFyZW50X2lkKTtcblx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkICE9IHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0Ly9pZih2bS5jb3B5LnBhcmVudF9pZCAmJiB2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0bW92ZUl0ZW0oKTtcblx0XHRcdC8vXHR9XG5cdFx0XHR9XG5cdFx0XHR0b2FzdHIuc3VjY2VzcygnQ2F0ZWdvcnkgaGFzIGJlZW4gdXBkYXRlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHQkc2NvcGUuY2F0ZWdvcnlGb3JtLiRzZXRTdWJtaXR0ZWQoKTtcblx0XHRcdHZtLmNvcHkgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVDYXRlZ29yeSh2YWxpZCkge1xuXHRcdFx0aWYodmFsaWQpe1xuXHRcdFx0XHRpZih2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRpZih2bS5pdGVtLnJlc3Rhbmd1bGFyaXplZCl7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKHN1Y2Nlc3NBY3Rpb24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UudXBkYXRlKCdjYXRlZ29yaWVzJywgdm0uaXRlbS5pZCwgdm0uaXRlbSkudGhlbihzdWNjZXNzQWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NhdGVnb3JpZXMnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihkYXRhLnBhcmVudF9pZCApe1xuXHRcdFx0XHRcdFx0XHRcdCB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGRhdGEsIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdFx0XHRcdCBpZighcGFyZW50LmNoaWxkcmVuKXtcblx0XHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4ucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHQgcGFyZW50LmV4cGFuZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgQ2F0ZWdvcnkgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0dm0ub3B0aW9ucy5wb3N0RG9uZShkYXRhKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3J5JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcnlDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblxuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0dmFyICDPhCA9IDIgKiBNYXRoLlBJO1xuXHRcdFx0XHQvL0NyZWF0aW5nIHRoZSBTY2FsZVxuXHRcdFx0XHR2YXIgcm90YXRlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFsxLCAkc2NvcGUub3B0aW9ucy5zaXplXSlcblx0XHRcdFx0XHQucmFuZ2UoWzEsIDBdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHQvL0NyZWF0aW5nIEVsZW1lbnRzXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKCdzdmcnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsICRzY29wZS5vcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCAkc2NvcGUub3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyICsgJywnICsgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICdOwrAnICsgZDtcblx0XHRcdFx0XHRcdHJldHVybiBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0cmV0dXJuICcxZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcxLjVlbSc7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnMC4zNWVtJztcblx0XHRcdFx0XHRcdHJldHVybiAnMC4zN2VtJ1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKXtcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShwYXJzZUludChkYXRhWzFdKSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGQpLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5hdHRyVHdlZW4oXCJkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qJHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2lyY2xlQmFjay5zdHlsZSgnc3Ryb2tlJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHR0ZXh0LnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtW24uZmllbGRdKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2l0ZW0nLFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdC8vaWYobiA9PT0gbykgcmV0dXJuO1xuXHRcdFx0XHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdFx0XHRcdG5bJHNjb3BlLm9wdGlvbnMuZmllbGRdID0gJHNjb3BlLm9wdGlvbnMuc2l6ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRlSXQoblskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8gfHwgIW4pIHJldHVybjtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdCgkc2NvcGUuaXRlbVskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LHRydWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbXBvc2l0c0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29tcG9zaXRzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb21wb3NpdHNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbmZsaWN0aXRlbXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NvbmZsaWN0aXRlbXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb25mbGljdGl0ZW1zL2NvbmZsaWN0aXRlbXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RpdGVtc0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbnRlbnRlZGl0YWJsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NvbnRlbnRlZGl0YWJsZScsIGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0cmVxdWlyZTogJz9uZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHQvL2lmICghbmdNb2RlbCkgcmV0dXJuO1xuXHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5odG1sKG5nTW9kZWwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gTGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIHRvIGVuYWJsZSBiaW5kaW5nXG5cdFx0XHRcdGVsZW1lbnQub24oJ2JsdXIga2V5dXAgY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNjb3BlLiRhcHBseShyZWFkVmlld1RleHQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIE5vIG5lZWQgdG8gaW5pdGlhbGl6ZSwgQW5ndWxhckpTIHdpbGwgaW5pdGlhbGl6ZSB0aGUgdGV4dCBiYXNlZCBvbiBuZy1tb2RlbCBhdHRyaWJ1dGVcblxuXHRcdFx0XHQvLyBXcml0ZSBkYXRhIHRvIHRoZSBtb2RlbFxuXHRcdFx0XHRmdW5jdGlvbiByZWFkVmlld1RleHQoKSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBlbGVtZW50Lmh0bWwoKTtcblx0XHRcdFx0XHQvLyBXaGVuIHdlIGNsZWFyIHRoZSBjb250ZW50IGVkaXRhYmxlIHRoZSBicm93c2VyIGxlYXZlcyBhIDxicj4gYmVoaW5kXG5cdFx0XHRcdFx0Ly8gSWYgc3RyaXAtYnIgYXR0cmlidXRlIGlzIHByb3ZpZGVkIHRoZW4gd2Ugc3RyaXAgdGhpcyBvdXRcblx0XHRcdFx0XHRpZiAoYXR0cnMuc3RyaXBCciAmJiBodG1sID09ICc8YnI+Jykge1xuXHRcdFx0XHRcdFx0aHRtbCA9ICcnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoaHRtbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmaWxlRHJvcHpvbmUnLCBmdW5jdGlvbiAodG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuICAgICAgICBmaWxlOiAnPScsXG4gICAgICAgIGZpbGVOYW1lOiAnPSdcbiAgICAgIH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdHZhciBjaGVja1NpemUsIGlzVHlwZVZhbGlkLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyLCB2YWxpZE1pbWVUeXBlcztcblx0XHRcdFx0cHJvY2Vzc0RyYWdPdmVyT3JFbnRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdjb3B5Jztcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhbGlkTWltZVR5cGVzID0gYXR0cnMuZmlsZURyb3B6b25lO1xuXHRcdFx0XHRjaGVja1NpemUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuXHRcdFx0XHRcdHZhciBfcmVmO1xuXHRcdFx0XHRcdGlmICgoKF9yZWYgPSBhdHRycy5tYXhGaWxlU2l6ZSkgPT09ICh2b2lkIDApIHx8IF9yZWYgPT09ICcnKSB8fCAoc2l6ZSAvIDEwMjQpIC8gMTAyNCA8IGF0dHJzLm1heEZpbGVTaXplKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJGaWxlIG11c3QgYmUgc21hbGxlciB0aGFuIFwiICsgYXR0cnMubWF4RmlsZVNpemUgKyBcIiBNQlwiKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlzVHlwZVZhbGlkID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdFx0XHRpZiAoKHZhbGlkTWltZVR5cGVzID09PSAodm9pZCAwKSB8fCB2YWxpZE1pbWVUeXBlcyA9PT0gJycpIHx8IHZhbGlkTWltZVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcIkZpbGUgbXVzdCBiZSBvbmUgb2YgZm9sbG93aW5nIHR5cGVzIFwiICsgdmFsaWRNaW1lVHlwZXMsICdJbnZhbGlkIGZpbGUgdHlwZSEnKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0ZWxlbWVudC5iaW5kKCdkcmFnb3ZlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdlbnRlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5iaW5kKCdkcm9wJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0dmFyIGZpbGUsIG5hbWUsIHJlYWRlciwgc2l6ZSwgdHlwZTtcblx0XHRcdFx0XHRpZiAoZXZlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0aWYgKGNoZWNrU2l6ZShzaXplKSAmJiBpc1R5cGVWYWxpZCh0eXBlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5maWxlID0gZXZ0LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcoc2NvcGUuZmlsZU5hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuZmlsZU5hbWUgPSBuYW1lO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzWzBdO1xuXHRcdFx0XHRcdC8qbmFtZSA9IGZpbGUubmFtZTtcblx0XHRcdFx0XHR0eXBlID0gZmlsZS50eXBlO1xuXHRcdFx0XHRcdHNpemUgPSBmaWxlLnNpemU7XG5cdFx0XHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7Ki9cblx0XHRcdFx0XHRzY29wZS5maWxlID0gZmlsZTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdGaWxlRHJvcHpvbmVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Ly9yZXF1aXJlOiAnaXRlbScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpdGVtTW9kZWwgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0LypzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW1Nb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHR9KTsqL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSwgRGlhbG9nU2VydmljZSwgJGZpbHRlciwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblxuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cblx0XHR2bS5jYXRlZ29yaWVzID0gW107XG5cdFx0dm0uZGF0YXByb3ZpZGVycyA9IFtdO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVGV4dCA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVW5pdCA9IG51bGw7XG5cdFx0dm0ucXVlcnlTZWFyY2ggPSBxdWVyeVNlYXJjaDtcblx0XHR2bS5xdWVyeVVuaXQgPSBxdWVyeVVuaXQ7XG5cblx0XHR2bS5zYXZlID0gc2F2ZTtcblxuXHRcdHZtLmNyZWF0ZVByb3ZpZGVyID0gY3JlYXRlUHJvdmlkZXI7XG5cdFx0dm0uY3JlYXRlVW5pdCA9IGNyZWF0ZVVuaXQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2gocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0uZGF0YXByb3ZpZGVycywgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVVuaXQocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0ubWVhc3VyZVR5cGVzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmRhdGFwcm92aWRlcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uY2F0ZWdvcmllcyA9IENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3JpZXMoe3RyZWU6dHJ1ZX0pO1xuXHRcdFx0dm0ubWVhc3VyZVR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZWFzdXJlX3R5cGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0udHlwZSAmJiB2bS5pdGVtLmRhdGFwcm92aWRlciAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IElUUyBBIEhBQ0sgVE8gR0VUIElUIFdPUks6IG5nLWNsaWNrIHZzIG5nLW1vdXNlZG93blxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyKHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFByb3ZpZGVyJywgJHNjb3BlKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlVW5pdCh0ZXh0KXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRVbml0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHQgICAgdm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHQgIH1cblx0XHR9LHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3JNZW51JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRpdGVtOiAnPWl0ZW0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JNZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgY2wgPSAnYWN0aXZlJztcblx0XHRcdFx0dmFyIGVsID0gZWxlbWVudFswXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50KCk7XG5cdFx0XHRcdHBhcmVudC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yTWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0ubG9ja2VkID0gbG9ja2VkO1xuXHRcdHZtLmNoYW5nZU9mZmljaWFsID0gY2hhbmdlT2ZmaWNpYWw7XG5cblx0XHRmdW5jdGlvbiBsb2NrZWQoKXtcblx0XHRcdHJldHVybiB2bS5pdGVtLmlzX29mZmljaWFsID8gJ2xvY2tfb3BlbicgOiAnbG9jayc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoYW5nZU9mZmljaWFsKCl7XG5cdFx0XHR2bS5pdGVtLmlzX29mZmljaWFsID0gIXZtLml0ZW0uaXNfb2ZmaWNpYWw7XG5cdFx0XHR2bS5pdGVtLnNhdmUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS5tZWFzdXJlX3R5cGVfaWQgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9PycsXG5cdFx0XHRcdGluZGljYXRvcnM6ICc9aXRlbXMnLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RBbGxHcm91cCA9IHNlbGVjdEFsbEdyb3VwO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcblxuXHRcdHZtLmZpbHRlciA9IHtcblx0XHRcdHNvcnQ6J3RpdGxlJyxcblx0XHRcdHJldmVyc2U6ZmFsc2UsXG5cdFx0XHRsaXN0OiAwLFxuXHRcdFx0cHVibGlzaGVkOiBmYWxzZSxcblx0XHRcdHR5cGVzOiB7XG5cdFx0XHRcdHRpdGxlOiB0cnVlLFxuXHRcdFx0XHRzdHlsZTogZmFsc2UsXG5cdFx0XHRcdGNhdGVnb3JpZXM6IGZhbHNlLFxuXHRcdFx0XHRpbmZvZ3JhcGhpYzogZmFsc2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBmYWxzZSxcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLnNlYXJjaCA9IHtcblx0XHRcdHF1ZXJ5OiAnJyxcblx0XHRcdHNob3c6IGZhbHNlXG5cdFx0fTtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXHRcdHZtLnRvZ2dsZUxpc3QgPSB0b2dnbGVMaXN0O1xuXG5cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUxpc3Qoa2V5KXtcblx0XHRcdGlmKHZtLnZpc2libGVMaXN0ID09IGtleSl7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS52aXNpYmxlTGlzdCA9IGtleTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09IC0xKXtcblx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pIHtcblx0XHRcdHZhciBpbmRleCA9IHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pO1xuXHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RBbGxHcm91cChncm91cCl7XG5cdFx0XHRpZih2bS5zZWxlY3Rpb24ubGVuZ3RoKXtcblx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cCwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG5cdFx0XHQkbWRPcGVuTWVudShldik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLnJlbW92ZSgnaW5kaWNhdG9ycycsIGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHR2bS5pbmRpY2F0b3JzLnNwbGljZSh2bS5pbmRpY2F0b3JzLmluZGV4T2YoaXRlbSksMSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Lyokc2NvcGUuJHdhdGNoKCd2bS5zZWFyY2gucXVlcnknLCBmdW5jdGlvbiAocXVlcnksIG9sZFF1ZXJ5KSB7XG5cdFx0XHRpZihxdWVyeSA9PT0gb2xkUXVlcnkpIHJldHVybiBmYWxzZTtcblx0XHRcdHZtLnF1ZXJ5ID0gdm0uZmlsdGVyLnR5cGVzO1xuXHRcdFx0dm0ucXVlcnkucSA9IHF1ZXJ5O1xuXHRcdFx0dm0uaXRlbXMgPSBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnModm0ucXVlcnkpO1xuXHRcdH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaXplcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpemVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpemVzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCAkdGltZW91dCwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uYmFzZU9wdGlvbnMgPSB7XG5cdFx0XHRkcmFnOnRydWUsXG5cdFx0XHRhbGxvd0Ryb3A6dHJ1ZSxcblx0XHRcdGFsbG93RHJhZzp0cnVlLFxuXHRcdFx0YWxsb3dNb3ZlOnRydWUsXG5cdFx0XHRhbGxvd1NhdmU6dHJ1ZSxcblx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRhbGxvd0FkZENvbnRhaW5lcjp0cnVlLFxuXHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdGVkaXRhYmxlOnRydWUsXG5cdFx0XHRhc3NpZ21lbnRzOiB0cnVlLFxuXHRcdFx0c2F2ZUNsaWNrOiBzYXZlLFxuXHRcdFx0YWRkQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDbGljayxcblx0XHRcdGFkZENvbnRhaW5lckNsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuYWRkQ29udGFpbmVyQ2xpY2ssXG5cdFx0XHRkZWxldGVEcm9wOiB2bS5vcHRpb25zLmluZGl6ZXMuZGVsZXRlRHJvcCxcblx0XHRcdGRlbGV0ZUNsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuZGVsZXRlQ2xpY2tcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0bG9hZEFsbCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxvYWRBbGwoKSB7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycpLiRvYmplY3Q7XG5cdFx0XHR2bS50eXBlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgvdHlwZXMnKS4kb2JqZWN0O1xuXG5cdFx0XHRpZih0eXBlb2Ygdm0uaXRlbS5pZCA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uaXRlbS5pdGVtX3R5cGVfaWQgPSAxO1xuXHRcdFx0XHR2bS5pdGVtLmNoaWxkcmVuID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS5pdGVtX3R5cGVfaWQgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKCl7XG5cdFx0XHRpZih0eXBlb2Ygdm0uaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdHJldHVybiBjaGVja0Jhc2UoKSAmJiB2bS5pdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlKCl7XG5cdFx0XHRpZih2bS5pdGVtLmlkKXtcblx0XHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0aWYocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnVwZGF0ZUl0ZW0ocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse2lkOnZtLml0ZW0uaWQsbmFtZTpyZXNwb25zZS5uYW1lfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgc2F2ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLmFkZEl0ZW0ocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse2lkOnJlc3BvbnNlLmlkLCBuYW1lOnJlc3BvbnNlLm5hbWV9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtcyhldmVudCwgaXRlbSl7XG5cdFx0Ly9cdGNvbnNvbGUubG9nKHZtLml0ZW0sIGl0ZW0pO1xuXG5cdFx0fVxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdFx0fVxuXHRcdH0sdHJ1ZSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ21lZGlhbicsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiAnZ3JhZGllbnQnLFxuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDQwLFxuXHRcdFx0XHRpbmZvOiB0cnVlLFxuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0aGFuZGxpbmc6IHRydWUsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdGxlZnQ6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHR0b3A6IDEwLFxuXHRcdFx0XHRcdGJvdHRvbTogMTBcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29sb3JzOiBbIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMCxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMTAyLDEwMiwxMDIsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiA1Myxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR9XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0dmFyIG1heCA9IDAsIG1pbiA9IDA7XG5cdFx0XHRcdG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChvcHRpb25zLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0b3B0aW9ucy51bmlxdWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRtYXggPSBkMy5tYXgoW21heCwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdG1pbiA9IGQzLm1pbihbbWluLCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFttaW4sIG1heF0pXG5cdFx0XHRcdFx0LnJhbmdlKFtvcHRpb25zLm1hcmdpbi5sZWZ0LCBvcHRpb25zLndpZHRoIC0gb3B0aW9ucy5tYXJnaW4ubGVmdF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHRcdFx0LngoeClcblx0XHRcdFx0XHQuZXh0ZW50KFswLCAwXSlcblx0XHRcdFx0XHQub24oXCJicnVzaFwiLCBicnVzaClcblx0XHRcdFx0XHQub24oXCJicnVzaGVuZFwiLCBicnVzaGVkKTtcblxuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKTtcblx0XHRcdFx0Ly8uYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5tYXJnaW4udG9wIC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkK29wdGlvbnMudW5pcXVlKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIHJlY3QgPSBzdmcuYXBwZW5kKCdzdmc6cmVjdCcpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywgJ3VybCgjJyArIChvcHRpb25zLmZpZWxkK29wdGlvbnMudW5pcXVlKSsgJyknKTtcblx0XHRcdFx0dmFyIGxlZ2VuZCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdzdGFydExhYmVsJylcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQobWluKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsICdsb3dlclZhbHVlJyk7XG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8vVERPRE86IENIY2tpY2sgaWYgbm8gY29tbWEgdGhlcmVcblx0XHRcdFx0XHRcdFx0aWYobWF4ID4gMTAwMCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1heFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCAndXBwZXJWYWx1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBzbGlkZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJzbGlkZXJcIik7XG5cdFx0XHRcdGlmKG9wdGlvbnMuaGFuZGxpbmcgPT0gdHJ1ZSl7XG5cdFx0XHRcdFx0c2xpZGVyLmNhbGwoYnJ1c2gpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLnNlbGVjdChcIi5iYWNrZ3JvdW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0c2xpZGVyLmFwcGVuZCgnbGluZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgMClcblx0XHRcdFx0XHQuYXR0cigneDInLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTInLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsICczLDMnKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAncmdiYSgwLDAsMCw4NyknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlQ29udCA9IHNsaWRlci5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLmhlaWdodCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBoYW5kbGUgPSBoYW5kbGVDb250LmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJoYW5kbGVcIilcblx0XHRcdFx0XHQuYXR0cihcInJcIiwgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG9wdGlvbnMuY29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUxhYmVsID0gaGFuZGxlQ29udC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKS5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vc2xpZGVyXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXh0ZW50KFswLCAwXSkpXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXZlbnQpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdO1xuXG5cdFx0XHRcdFx0aWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYocGFyc2VJbnQodmFsdWUpID4gMTAwMCl7XG5cdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludCh2YWx1ZSkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dCh2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQodmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgodmFsdWUpICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoZWQoKSB7XG5cblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXSxcblx0XHRcdFx0XHRcdGNvdW50ID0gMCxcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHRkbyB7XG5cblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pID09IHBhcnNlSW50KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdGZpbmFsID0gbmF0O1xuXHRcdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSA+IDUwID8gdmFsdWUgLSAxIDogdmFsdWUgKyAxO1xuXHRcdFx0XHRcdH0gd2hpbGUgKCFmb3VuZCAmJiBjb3VudCA8IG1heCk7XG5cblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZmluYWwpO1xuXHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRpZihuZ01vZGVsLiRtb2RlbFZhbHVlKXtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRcdGlmKG4gPT09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHQvL1x0Y29uc29sZS5sb2cobik7XG5cdFx0XHRcdFx0XHRtaW4gPSAwO1xuXHRcdFx0XHRcdFx0bWF4ID0gMDtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0XHRcdG1pbiA9IGQzLm1pbihbbWluLCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0XHRcdGlmKG5hdC5pc28gPT0gbmdNb2RlbC4kbW9kZWxWYWx1ZS5pc28pe1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuYXRbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0XHRcdC5kb21haW4oW21pbiwgbWF4XSlcblx0XHRcdFx0XHRcdFx0LnJhbmdlKFtvcHRpb25zLm1hcmdpbi5sZWZ0LCBvcHRpb25zLndpZHRoIC0gb3B0aW9ucy5tYXJnaW4ubGVmdF0pXG5cdFx0XHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblx0XHRcdFx0XHRcdGJydXNoLngoeClcblx0XHRcdFx0XHRcdFx0XHQuZXh0ZW50KFswLCAwXSlcblx0XHRcdFx0XHRcdFx0XHQub24oXCJicnVzaFwiLCBicnVzaClcblx0XHRcdFx0XHRcdFx0XHQub24oXCJicnVzaGVuZFwiLCBicnVzaGVkKTtcblx0XHRcdFx0XHRcdGxlZ2VuZC5zZWxlY3QoJyNsb3dlclZhbHVlJykudGV4dChtaW4pO1xuXHRcdFx0XHRcdFx0bGVnZW5kMi5zZWxlY3QoJyN1cHBlclZhbHVlJykudGV4dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHQvL1RET0RPOiBDSGNraWNrIGlmIG5vIGNvbW1hIHRoZXJlXG5cdFx0XHRcdFx0XHRcdGlmKG1heCA+IDEwMDApe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYobmF0LmlzbyA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlLmlzbyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5hdFtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnTWVkaWFuQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwYXJzZUNvbmZsaWN0Q3N2JywgZnVuY3Rpb24oJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlQ29uZmxpY3RDc3ZDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG5hdGlvbnM6ICc9Jyxcblx0XHRcdFx0c3VtOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblxuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdHNjb3BlLm5hdGlvbnMgPSBbXTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRzdGVwOiBmdW5jdGlvbiAocm93KSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG51bWJlcnMgPSByb3cuZGF0YVswXS5jb25mbGljdHMubWF0Y2goL1swLTldKy9nKS5tYXAoZnVuY3Rpb24obilcblx0XHRcdFx0XHRcdFx0XHR7Ly9qdXN0IGNvZXJjZSB0byBudW1iZXJzXG5cdFx0XHRcdFx0XHRcdFx0ICAgIHJldHVybiArKG4pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLmV2ZW50cyA9IG51bWJlcnM7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuc3VtICs9IG51bWJlcnMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLm5hdGlvbnMucHVzaChyb3cuZGF0YVswXSk7XG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y29tcGxldGU6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZUNvbmZsaWN0Q3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwYXJzZUNvbmZsaWN0RXZlbnRzQ3N2JywgZnVuY3Rpb24oJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlQ29uZmxpY3RFdmVudHNDc3ZDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGV2ZW50czogJz0nLFxuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXHRzY29wZS5ldmVudHMgPSBbXTtcblx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRzdGVwOiBmdW5jdGlvbiAocm93KSB7XG5cdFx0XHRcdFx0XHRcdFx0c3dpdGNoIChyb3cuZGF0YVswXS50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnRlcnN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaW50cmFzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAyO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3N1YnN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDM7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZXJyb3JzLmxlbmd0aCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHNjb3BlLmV2ZW50cy5wdXNoKHJvdy5kYXRhWzBdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJvdyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RFdmVudHNDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdwYXJzZWNzdicsIGZ1bmN0aW9uICgkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIEluZGV4U2VydmljZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlY3N2Q3RybCcsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblxuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coUGFwYSk7XG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Ly93b3JrZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCIgPiBjaHVuayA9IHJvdyBhbmQgY2h1bmsuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdGNodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY2h1bmsuZGF0YSwgZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6e30sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yczpbXVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgLyp8fCBpdGVtIDwgMCovIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzVmVydGljYWwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL3Jhd0xpc3Rba2V5XS5lcnJvcnMgPSByb3cuZXJyb3JzO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9JRiBcInN0ZXBcIiBpbnN0ZWFkIG9mIFwiY2h1bmtcIjogciA+IHJvdy5kYXRhID0gcm93LmRhdGFbMF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ci5kYXRhID0gcm93O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vQ2hlY2sgaWYgdGhlcmUgYXJlIHBvaW50cyBpbiB0aGUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKC9cXHJcXG58XFxyfFxcbi8pLmluZGV4O1xuXHRcdFx0XHRcdFx0XHRcdHZhciBkZWxpbWl0ZXIgPSAnLCc7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCgnLCcpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCA8IDIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdChcIlxcdFwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdGRlbGltaXRlciA9ICdcXHQnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YXIgaXNJc28gPSBbXTtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksICdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaGVhZCA9IGhlYWRpbmdzW2ldLnNwbGl0KCdfJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgaGVhZC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGhlYWRbal0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChqID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9ICdfJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSArPSBoZWFkW2pdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5nc1tpXS5sZW5ndGggPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlzSXNvLnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCA9PSBpc0lzby5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlzVmVydGljYWwgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByYXdMaXN0W2hlYWRpbmdzW2ldXSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0gPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGhlYWRpbmdzLmpvaW4oZGVsaW1pdGVyKSArIGNodW5rLnN1YnN0cihpbmRleCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZXJyLCBmaWxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0cykge1xuXG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEVycm9ycyhlcnJvcnMpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly9TZWUgaWYgdGhlcmUgaXMgYW4gZmllbGQgbmFtZSBcImlzb1wiIGluIHRoZSBoZWFkaW5ncztcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWlzVmVydGljYWwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChJbmRleFNlcnZpY2UuZ2V0Rmlyc3RFbnRyeSgpLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaXNvJykgIT0gLTEgfHwga2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY29kZScpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvdW50cnknKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRDb3VudHJ5RmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZigneWVhcicpICE9IC0xICYmIGl0ZW0udG9TdHJpbmcoKS5sZW5ndGggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRZZWFyRmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyYXdMaXN0LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLnRvTG93ZXJDYXNlKCkgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Yga2V5ICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlzbzoga2V5LnRvVXBwZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uIChjb2x1bW4sIGkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJbJ2NvbHVtbl8nICsgaV0gPSBjb2x1bW47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOYU4oY29sdW1uKSB8fCBjb2x1bW4gPCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogaXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IFtyXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yczogaXRlbS5lcnJvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoJ2lzbycpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oSW5kZXhTZXJ2aWNlLmdldERhdGFTaXplKCkgKyAnIGxpbmVzIGltcG9ydGV0IScsICdJbmZvcm1hdGlvbicpO1xuXHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BpZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGllY2hhcnQvcGllY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGllY2hhcnRDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPScsXG5cdFx0XHRcdGNsaWNrSXQ6JyYnXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQgZnVuY3Rpb24gc2VnQ29sb3IoYyl7IHJldHVybiB7aW50ZXJzdGF0ZTpcIiM4MDdkYmFcIiwgaW50cmFzdGF0ZTpcIiNlMDgyMTRcIixzdWJzdGF0ZTpcIiM0MWFiNWRcIn1bY107IH1cblxuXHRcdFx0XHR2YXIgcEMgPXt9LCBwaWVEaW0gPXt3OjE1MCwgaDogMTUwfTtcbiAgICAgICAgcGllRGltLnIgPSBNYXRoLm1pbihwaWVEaW0udywgcGllRGltLmgpIC8gMjtcblxuXHRcdFx0XHR2YXIgcGllc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwaWVEaW0udylcblx0XHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIHBpZURpbS5oKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ291dGVyLXBpZScpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrcGllRGltLncvMitcIixcIitwaWVEaW0uaC8yK1wiKVwiKTtcblx0XHRcdFx0dmFyIHBpZXN2ZzIgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBpZURpbS53KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgcGllRGltLmgpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnaW5uZXItcGllJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitwaWVEaW0udy8yK1wiLFwiK3BpZURpbS5oLzIrXCIpXCIpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBmdW5jdGlvbiB0byBkcmF3IHRoZSBhcmNzIG9mIHRoZSBwaWUgc2xpY2VzLlxuICAgICAgICB2YXIgYXJjID0gZDMuc3ZnXG5cdFx0XHRcdFx0LmFyYygpXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKHBpZURpbS5yIC0gMTApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKHBpZURpbS5yIC0gMjMpO1xuICAgICAgICB2YXIgYXJjMiA9IGQzLnN2Z1xuXHRcdFx0XHRcdC5hcmMoKVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhwaWVEaW0uciAtIDIzKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cygwKTtcblxuICAgICAgICAvLyBjcmVhdGUgYSBmdW5jdGlvbiB0byBjb21wdXRlIHRoZSBwaWUgc2xpY2UgYW5nbGVzLlxuICAgICAgICB2YXIgcGllID0gZDMubGF5b3V0XG5cdFx0XHRcdFx0LnBpZSgpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5jb3VudDsgfSk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcGllIHNsaWNlcy5cbiAgICAgICAgdmFyIGMxID0gcGllc3ZnXG5cdFx0XHRcdFx0XHQuZGF0dW0oc2NvcGUuZGF0YSlcblx0XHRcdFx0XHRcdC5zZWxlY3RBbGwoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuZGF0YShwaWUpXG5cdFx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInBhdGhcIikuYXR0cihcImRcIiwgYXJjKVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyB0aGlzLl9jdXJyZW50ID0gZDsgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5kYXRhLmNvbG9yOyB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsbW91c2VvdmVyKS5vbihcIm1vdXNlb3V0XCIsbW91c2VvdXQpO1xuXHRcdFx0XHR2YXIgYzIgPSBwaWVzdmcyXG5cdFx0XHRcdFx0XHQuZGF0dW0oc2NvcGUuZGF0YSlcblx0XHRcdFx0XHRcdC5zZWxlY3RBbGwoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuZGF0YShwaWUpXG5cdFx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMyKVxuXHRcdCAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyB0aGlzLl9jdXJyZW50ID0gZDsgfSlcblx0XHQgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5kYXRhLmNvbG9yOyB9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG5cdFx0ICAgICAgICAub24oJ2NsaWNrJywgbW91c2VjbGljayk7XG4gICAgICAgIC8vIGNyZWF0ZSBmdW5jdGlvbiB0byB1cGRhdGUgcGllLWNoYXJ0LiBUaGlzIHdpbGwgYmUgdXNlZCBieSBoaXN0b2dyYW0uXG4gICAgICAgIHBDLnVwZGF0ZSA9IGZ1bmN0aW9uKG5EKXtcbiAgICAgICAgICAgIHBpZXN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEocGllKG5EKSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2Vlbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXRpbGl0eSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gbW91c2VvdmVyIGEgcGllIHNsaWNlLlxuXHRcdFx0XHR2YXIgdHlwZXVzID0gYW5ndWxhci5jb3B5KHNjb3BlLmFjdGl2ZVR5cGUpO1xuXHRcdFx0XHRmdW5jdGlvbiBtb3VzZWNsaWNrKGQpe1xuXHRcdFx0XHRcdHNjb3BlLmNsaWNrSXQoe3R5cGVfaWQ6ZC5kYXRhLnR5cGVfaWR9KTtcblx0XHRcdFx0fVxuICAgICAgICBmdW5jdGlvbiBtb3VzZW92ZXIoZCl7XG4gICAgICAgICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gb2YgaGlzdG9ncmFtIHdpdGggbmV3IGRhdGEuXG5cdFx0XHRcdFx0XHR0eXBldXMgPSBhbmd1bGFyLmNvcHkoc2NvcGUuYWN0aXZlVHlwZSk7XG4gICAgICAgICAgICBzY29wZS5hY3RpdmVUeXBlID0gW2QuZGF0YS50eXBlX2lkXTtcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vVXRpbGl0eSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gbW91c2VvdXQgYSBwaWUgc2xpY2UuXG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlb3V0KGQpe1xuICAgICAgICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIG9mIGhpc3RvZ3JhbSB3aXRoIGFsbCBkYXRhLlxuICAgICAgICAgICAgc2NvcGUuYWN0aXZlVHlwZSA9IHR5cGV1cztcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFuaW1hdGluZyB0aGUgcGllLXNsaWNlIHJlcXVpcmluZyBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCBzcGVjaWZpZXNcbiAgICAgICAgLy8gaG93IHRoZSBpbnRlcm1lZGlhdGUgcGF0aHMgc2hvdWxkIGJlIGRyYXduLlxuICAgICAgICBmdW5jdGlvbiBhcmNUd2VlbihhKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkgeyByZXR1cm4gYXJjKGkodCkpOyAgICB9O1xuICAgICAgICB9XG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuMihhKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkgeyByZXR1cm4gYXJjMihpKHQpKTsgICAgfTtcbiAgICAgICAgfVxuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuKSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMClcblx0XHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4pO1xuXHRcdFx0XHRcdHBpZXN2ZzIuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuKSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMClcblx0XHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4yKTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQaWVjaGFydEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgncm91bmRiYXInLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3JvdW5kYmFyL3JvdW5kYmFyLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1JvdW5kYmFyQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPWNoYXJ0RGF0YScsXG5cdFx0XHRcdGFjdGl2ZVR5cGU6ICc9Jyxcblx0XHRcdFx0YWN0aXZlQ29uZmxpY3Q6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG5cdFx0XHRcdHZhciBtYXJnaW4gPSB7XG5cdFx0XHRcdFx0XHR0b3A6IDQwLFxuXHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0Ym90dG9tOiAzMCxcblx0XHRcdFx0XHRcdGxlZnQ6IDQwXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR3aWR0aCA9IDMwMCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0LFxuXHRcdFx0XHRcdGhlaWdodCA9IDIwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tLFxuXHRcdFx0XHRcdGJhcldpZHRoID0gMjAsXG5cdFx0XHRcdFx0c3BhY2UgPSAyNTtcblxuXG5cdFx0XHRcdHZhciBzY2FsZSA9IHtcblx0XHRcdFx0XHR5OiBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRzY2FsZS55LmRvbWFpbihbMCwgMjIwXSk7XG5cdFx0XHRcdHNjYWxlLnkucmFuZ2UoW2hlaWdodCwgMF0pO1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8veC5kb21haW4oc2NvcGUuZGF0YS5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5sZXR0ZXI7IH0pKTtcblx0XHRcdFx0Ly95LmRvbWFpbihbMCwgZDMubWF4KHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZnJlcXVlbmN5OyB9KV0pO1xuXHRcdFx0XHR2YXIgYmFycyA9IHN2Zy5zZWxlY3RBbGwoJy5iYXJzJykuZGF0YShzY29wZS5kYXRhKS5lbnRlcigpLmFwcGVuZChcImdcIikuYXR0cignY2xhc3MnLCAnYmFycycpOyAvLy5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgaSAqIDIwICsgXCIsIDApXCI7IH0pOztcblxuXHRcdFx0XHR2YXIgYmFyc0JnID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJvdW5kZWRfcmVjdCgoaSAqIChiYXJXaWR0aCArIHNwYWNlKSksIDAsIGJhcldpZHRoLCAoaGVpZ2h0KSwgYmFyV2lkdGggLyAyLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnYmcnKTtcblx0XHRcdFx0dmFyIHZhbHVlQmFycyA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAoc2NhbGUueShkLnZhbHVlKSksIGJhcldpZHRoLCAoaGVpZ2h0IC0gc2NhbGUueShkLnZhbHVlKSksIGJhcldpZHRoIC8gMiwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LyouYXR0cigneCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpICogKGJhcldpZHRoICsgc3BhY2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2NhbGUueShkLnZhbHVlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcldpZHRoXG5cdFx0XHRcdFx0fSkqL1xuXG5cdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3Jcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8qLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdC5kdXJhdGlvbigzMDAwKVxuXHRcdFx0XHRcdC5lYXNlKFwicXVhZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoZWlnaHQgLSBzY2FsZS55KGQudmFsdWUpXG5cdFx0XHRcdFx0fSkqL1xuXHRcdFx0XHQ7XG5cblx0XHRcdFx0dmFyIHZhbHVlVGV4dCA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKTtcblxuXHRcdFx0XHR2YWx1ZVRleHQudGV4dChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC52YWx1ZVxuXHRcdFx0XHRcdH0pLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpICogKGJhcldpZHRoICsgc3BhY2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIC04KVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcldpZHRoXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCcjNGZiMGU1Jyk7XG5cblx0XHRcdFx0dmFyIGxhYmVsc1RleHQgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0bGFiZWxzVGV4dC50ZXh0KGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQubGFiZWxcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCBoZWlnaHQgKyAyMClcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvclxuXHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0ZnVuY3Rpb24gcm91bmRlZF9yZWN0KHgsIHksIHcsIGgsIHIsIHRsLCB0ciwgYmwsIGJyKSB7XG5cdFx0XHRcdFx0dmFyIHJldHZhbDtcblx0XHRcdFx0XHRyZXR2YWwgPSBcIk1cIiArICh4ICsgcikgKyBcIixcIiArIHk7XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKHcgLSAyICogcik7XG5cdFx0XHRcdFx0aWYgKHRyKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyByICsgXCIsXCIgKyByO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyByO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgKGggLSAyICogcik7XG5cdFx0XHRcdFx0aWYgKGJyKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAoMiAqIHIgLSB3KTtcblx0XHRcdFx0XHRpZiAoYmwpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIC1yICsgXCIsXCIgKyAtcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgLXI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgKDIgKiByIC0gaCk7XG5cdFx0XHRcdFx0aWYgKHRsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyByICsgXCIsXCIgKyAtcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ6XCI7XG5cdFx0XHRcdFx0cmV0dXJuIHJldHZhbDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Ly9zY2FsZS55LmRvbWFpbihbMCwgNTBdKTtcblxuXHRcdFx0XHRcdFx0dmFsdWVCYXJzLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGJvcmRlcnMgPSBiYXJXaWR0aCAvIDI7XG5cdFx0XHRcdFx0XHRcdFx0aWYoc2NvcGUuZGF0YVtpXS52YWx1ZSA8PSAxMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJzID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJvdW5kZWRfcmVjdCgoaSAqIChiYXJXaWR0aCArIHNwYWNlKSksIChzY2FsZS55KHNjb3BlLmRhdGFbaV0udmFsdWUpKSwgYmFyV2lkdGgsIChoZWlnaHQgLSBzY2FsZS55KHNjb3BlLmRhdGFbaV0udmFsdWUpKSwgYm9yZGVycywgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR2YWx1ZVRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCxpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShwYXJzZUludChkLnZhbHVlKSwgcGFyc2VJbnQoc2NvcGUuZGF0YVtpXS52YWx1ZSkpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9IChNYXRoLnJvdW5kKGkodCkgKiAxKSAvIDEpO1xuXHRcdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdH0pLmVhY2goJ2VuZCcsIGZ1bmN0aW9uKGQsIGkpe1xuXHRcdFx0XHRcdFx0XHRcdGQudmFsdWUgPSBzY29wZS5kYXRhW2ldLnZhbHVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdSb3VuZGJhckN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW52ZXJ0OmZhbHNlXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZtLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCB2bS5vcHRpb25zKTtcblx0XHR2bS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IHRydWUsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHRcdH07XG5cdFx0dm0uY2hhcnQgPSB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdGNoYXJ0OiB7fVxuXHRcdFx0fSxcblx0XHRcdGRhdGE6IFtdXG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0Y2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdHNldENoYXJ0KCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KCl7XG5cdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFt2bS5yYW5nZS5tYXgsIHZtLnJhbmdlLm1pbl07XG5cdFx0fVxuXHQgXHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRkdXJhdGlvbjoxMDAsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0fSxcblx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNob3dMZWdlbmQ6IGZhbHNlLFxuXHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0Ly9zaG93WUF4aXM6IGZhbHNlLFxuXG5cdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHQvL3VzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRmb3JjZVk6IFt2bS5yYW5nZS5tYXgsIHZtLnJhbmdlLm1pbl0sXG5cdFx0XHRcdC8veURvbWFpbjpbcGFyc2VJbnQodm0ucmFuZ2UubWluKSwgdm0ucmFuZ2UubWF4XSxcblx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICdZZWFyJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdGludGVycG9sYXRlOiAnY2FyZGluYWwnXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHZtLm9wdGlvbnMuaW52ZXJ0ID09IHRydWUpIHtcblx0XHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC5mb3JjZVkgPSBbcGFyc2VJbnQodm0ucmFuZ2UubWF4KSwgdm0ucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKHZtLmNoYXJ0KVxuXHRcdFx0cmV0dXJuIHZtLmNoYXJ0O1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdHZtLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0aWQ6IGtleSxcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWF4ID0gTWF0aC5tYXgodm0ucmFuZ2UubWF4LCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0XHR2bS5yYW5nZS5taW4gPSBNYXRoLm1pbih2bS5yYW5nZS5taW4sIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5yYW5nZS5tYXgrKztcblx0XHRcdHZtLnJhbmdlLm1pbi0tO1xuXHRcdFx0dm0uY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICh2bS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIikge1xuXHRcdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQodm0ucmFuZ2UubWF4KSwgdm0ucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0dXBkYXRlQ2hhcnQoKTtcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLnNlbGVjdGlvbicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0Ly9cdHVwZGF0ZUNoYXJ0KCk7XG5cdFx0XHQvL2NhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlcycsIFsnJGFuaW1hdGVDc3MnLCBmdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuXG5cdFx0dmFyIGxhc3RJZCA9IDA7XG4gICAgICAgIHZhciBfY2FjaGUgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRJZChlbCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIik7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgaWQgPSArK2xhc3RJZDtcbiAgICAgICAgICAgICAgICBlbFswXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoaWQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IF9jYWNoZVtpZF07XG4gICAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICBfY2FjaGVbaWRdID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVJ1bm5lcihjbG9zaW5nLCBzdGF0ZSwgYW5pbWF0b3IsIGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSBhbmltYXRvcjtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBkb25lRm47XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RhcnQoKS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2luZyAmJiBzdGF0ZS5kb25lRm4gPT09IGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnU2xpZGVUb2dnbGVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3N0eWxlcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdHlsZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdHN0eWxlczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3R5bGVzQ3RybCcsIGZ1bmN0aW9uICh0b2FzdHIsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnRvZ2dsZVN0eWxlID0gdG9nZ2xlU3R5bGU7XG5cdFx0dm0uc2VsZWN0ZWRTdHlsZSA9IHNlbGVjdGVkU3R5bGU7XG5cdFx0dm0uc2F2ZVN0eWxlID0gc2F2ZVN0eWxlO1xuXHRcdHZtLnN0eWxlID0gW107XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTdHlsZShzdHlsZSkge1xuXHRcdFx0aWYgKHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQpIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlX2lkID0gc3R5bGUuaWRcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RlZFN0eWxlKGl0ZW0sIHN0eWxlKSB7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZVN0eWxlKCkge1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnc3R5bGVzJywgdm0uc3R5bGUpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uc3R5bGVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdHZtLmNyZWF0ZVN0eWxlID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0uc3R5bGUgPSBbXTtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IGRhdGE7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgU3R5bGUgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdWJpbmRleEN0cmwnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4Lmh0bWwnLFxuXHRcdFx0bGluazogc3ViaW5kZXhMaW5rRnVuY3Rpb25cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3ViaW5kZXhMaW5rRnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0KSB7XG5cdFx0JHNjb3BlLmluZm8gPSBmYWxzZTtcblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBzZXRDaGFydDtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBjYWxjdWxhdGVHcmFwaDtcblx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlciA9IGNyZWF0ZUluZGV4ZXI7XG5cdFx0JHNjb3BlLmNhbGNTdWJSYW5rID0gY2FsY1N1YlJhbms7XG5cdFx0JHNjb3BlLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdCRzY29wZS5jcmVhdGVPcHRpb25zID0gY3JlYXRlT3B0aW9ucztcblx0XHQkc2NvcGUuZ2V0U3ViUmFuayA9IGdldFN1YlJhbms7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obmV3SXRlbSwgb2xkSXRlbSkge1xuXHRcdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2N1cnJlbnQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdCRzY29wZS5pbmZvID0gISRzY29wZS5pbmZvO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjYWxjU3ViUmFuaygpIHtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdID0gcGFyc2VGbG9hdChpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlSW50KGl0ZW1bJ3Njb3JlJ10pO1xuXHRcdFx0fSlcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpbHRlcltpXS5pc28gPT0gJHNjb3BlLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0cmFuayA9IGkgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY3VycmVudFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKydfcmFuayddID0gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0U3ViUmFuayhjb3VudHJ5KXtcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGZpbHRlciwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0aWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG5cdFx0XHRcdFx0cmFuayA9IGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmFuaysxO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVJbmRleGVyKCkge1xuXHRcdFx0JHNjb3BlLmluZGV4ZXIgPSBbJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5kYXRhXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVPcHRpb25zKCkge1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnMgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoxMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnNCaWcgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoyMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0Ly9oZWlnaHQ6IDIwMCxcblx0XHRcdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHg6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0XHRib3R0b206IDMwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY291bnRyeS5lcGksIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBkYXRhLnllYXIsXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uY29sdW1uX25hbWVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1bmJ1cnN0JywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0IG1vZGU6ICdzaXplJ1xuXHRcdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1bmJ1cnN0Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdHZhciB3aWR0aCA9IDYxMCxcblx0XHRcdFx0XHRoZWlnaHQgPSB3aWR0aCxcblx0XHRcdFx0XHRyYWRpdXMgPSAod2lkdGgpIC8gMixcblx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzAsIDIgKiBNYXRoLlBJXSksXG5cdFx0XHRcdFx0eSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAxXSkucmFuZ2UoWzAsIHJhZGl1c10pLFxuXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIik7O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsaWNrKGQpIHtcblx0XHRcdFx0XHQvLyBDb250cm9sIGFyYyB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0cGF0aC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKGQpKTtcblxuXHRcdFx0XHRcdC8vIFNvbWV3aGF0IG9mIGEgaGFjayBhcyB3ZSByZWx5IG9uIGFyY1R3ZWVuIHVwZGF0aW5nIHRoZSBzY2FsZXMuXG5cdFx0XHRcdFx0Ly8gQ29udHJvbCB0aGUgdGV4dCB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0dGV4dC5zdHlsZShcInZpc2liaWxpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyAxIDogMWUtNjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuZWFjaChcImVuZFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0ZnVuY3Rpb24gaXNQYXJlbnRPZihwLCBjKSB7XG5cdFx0XHRcdFx0aWYgKHAgPT09IGMpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGlmIChwLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcC5jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHNldENvbG9yKGQpIHtcblxuXHRcdFx0XHRcdC8vcmV0dXJuIDtcblx0XHRcdFx0XHRpZiAoZC5jb2xvcilcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuICcjY2NjJztcblx0XHRcdFx0XHRcdC8qdmFyIHRpbnREZWNheSA9IDAuMjA7XG5cdFx0XHRcdFx0XHQvLyBGaW5kIGNoaWxkIG51bWJlclxuXHRcdFx0XHRcdFx0dmFyIHggPSAwO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGQucGFyZW50LmNoaWxkcmVuW3hdICE9IGQpXG5cdFx0XHRcdFx0XHRcdHgrKztcblx0XHRcdFx0XHRcdHZhciB0aW50Q2hhbmdlID0gKHRpbnREZWNheSAqICh4ICsgMSkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHVzaGVyLmNvbG9yKGQucGFyZW50LmNvbG9yKS50aW50KHRpbnRDaGFuZ2UpLmh0bWwoJ2hleDYnKTsqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEudGl0bGUsXG5cdFx0XHRcdFwiY29sb3JcIjogJHNjb3BlLmRhdGEuc3R5bGUuYmFzZV9jb2xvciB8fCAnIzAwMCcsXG5cdFx0XHRcdFwiY2hpbGRyZW5cIjogYnVpbGRUcmVlKCRzY29wZS5kYXRhLmNoaWxkcmVuKSxcblx0XHRcdFx0XCJzaXplXCI6IDFcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICd0cmVlbWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWVtZW51L3RyZWVtZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWVtZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGl0ZW06Jz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1RyZWVtZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cblx0fSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZXZpZXcnLCBmdW5jdGlvbihSZWN1cnNpb25IZWxwZXIpIHtcblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdGVkaXRXZWlnaHQ6ZmFsc2UsXG5cdFx0XHRkcmFnOiBmYWxzZSxcblx0XHRcdGVkaXQ6IGZhbHNlLFxuXHRcdFx0Y2hpbGRyZW46J2NoaWxkcmVuJ1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnVHJlZXZpZXdDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPT8nLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nLFxuXHRcdFx0XHRjbGljazogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Y29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlY3Vyc2lvbkhlbHBlci5jb21waWxlKGVsZW1lbnQsIGZ1bmN0aW9uKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlRm4pe1xuXHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsIHNjb3BlLnZtLm9wdGlvbnMpXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmaW5lIHlvdXIgbm9ybWFsIGxpbmsgZnVuY3Rpb24gaGVyZS5cbiAgICAgICAgICAgICAgICAvLyBBbHRlcm5hdGl2ZTogaW5zdGVhZCBvZiBwYXNzaW5nIGEgZnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgLy8geW91IGNhbiBhbHNvIHBhc3MgYW4gb2JqZWN0IHdpdGhcbiAgICAgICAgICAgICAgICAvLyBhICdwcmUnLSBhbmQgJ3Bvc3QnLWxpbmsgZnVuY3Rpb24uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUcmVldmlld0N0cmwnLCBmdW5jdGlvbigkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbTtcblx0XHR2bS5jaGlsZFNlbGVjdGVkID0gY2hpbGRTZWxlY3RlZDtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0ub25EcmFnT3ZlciA9IG9uRHJhZ092ZXI7XG5cdFx0dm0ub25Ecm9wQ29tcGxldGUgPSBvbkRyb3BDb21wbGV0ZTtcblx0XHR2bS5vbk1vdmVkQ29tcGxldGUgPSBvbk1vdmVkQ29tcGxldGU7XG5cdFx0dm0uYWRkQ2hpbGRyZW4gPSBhZGRDaGlsZHJlbjtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLnNlbGVjdGlvbiA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25EcmFnT3ZlcihldmVudCwgaW5kZXgsIGV4dGVybmFsLCB0eXBlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbkRyb3BDb21wbGV0ZShldmVudCwgaW5kZXgsIGl0ZW0sIGV4dGVybmFsKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSAwKXtcblx0XHRcdFx0XHR2bS5pdGVtcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uTW92ZWRDb21wbGV0ZShpbmRleCwgZGF0YSwgZXZ0KSB7XG5cdFx0XHRpZih2bS5vcHRpb25zLmFsbG93TW92ZSl7XG5cdFx0XHRcdHJldHVybiB2bS5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKHNlbGVjdGVkLCBpKXtcblx0XHRcdFx0aWYoc2VsZWN0ZWQuaWQgPT0gaXRlbS5pZCl7XG5cdFx0XHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmKGluZGV4ID4gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHZtLm9wdGlvbnMuc2VsZWN0aW9uQ2hhbmdlZCA9PSAnZnVuY3Rpb24nIClcblx0XHRcdFx0dm0ub3B0aW9ucy5zZWxlY3Rpb25DaGFuZ2VkKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENoaWxkcmVuKGl0ZW0pIHtcblxuXHRcdFx0aXRlbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0aXRlbS5leHBhbmRlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oc2VsZWN0ZWQpe1xuXHRcdFx0XHRpZihzZWxlY3RlZC5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdC8qXHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihhbmd1bGFyLmNvcHkoaXRlbSkpID4gLTEpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTsqL1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoaWxkU2VsZWN0ZWQoaXRlbSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihjaGlsZCk+IC0xKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWZvdW5kKXtcblx0XHRcdFx0XHRmb3VuZCA9ICBjaGlsZFNlbGVjdGVkKGNoaWxkKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikgdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID0gW107XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZSxcblx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0sIGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pZCA9PSBpdGVtLmlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5wdXNoKGl0ZW0pIDogdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fSovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbS53ZWlnaHQgPT0gXCJ1bmRlZmluZWRcIiB8fCAhdm0uaXRlbS53ZWlnaHQpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA+PSA5NSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ICs9IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG93ZXJXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA8PSA1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpIC0gNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0IC09IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
