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
				views: {
					'sidebar@': {
						templateUrl: getView('fullList'),
						controller: 'FullListCtrl',
						controllerAs: 'vm',
						resolve: {
							indicators: ["ContentService", function(ContentService) {
								return ContentService.fetchIndicators({
									page: 1,
									order: 'title',
									limit: 1000,
									dir: 'ASC'
								})
							}],
							indices: ["DataService", function(DataService) {
								return DataService.getAll('index').$object;
							}],
							categories: ["ContentService", function(ContentService){
									return ContentService.fetchCategories('', true);
							}]
						}
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

	angular.module('app.services').factory('ContentService', ["DataService", function(DataService) {
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
			getIndicators: function() {
				if (this.content.indicators.length > 0) {
					return this.content.indicators;
				}
				return this.fetchIndicators();

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
				console.log(entry, item);
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

(function() {
	"use strict";

	angular.module('app.controllers').controller('FullListCtrl', ["categories", "indicators", "indices", function(categories, indicators, indices) {
		//
		var vm = this;
		vm.categories = categories;
		vm.indicators = indicators;
		vm.indices = indices;
		vm.openMenu = openMenu;
		vm.filter = [];
		vm.toggleCatFilter = toggleCatFilter;
		vm.filterExists = filterExists;
		vm.catFilter = catFilter;

		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}
		function toggleCatFilter(id){

			var idx = vm.filter.indexOf(id);
			if(idx > -1) vm.filter.splice(idx, 1);
			else vm.filter.push(id);

		}
		function filterExists(id){
			return vm.filter.indexOf(id) > -1;
		}
		function catFilter(item){

				if(item.categories.length > 0 && vm.filter.length > 0){
					var found = false;
					angular.forEach(item.categories, function(cat){
						if(vm.filter.indexOf(cat.id) > -1){
							found = true;
						}
					});
					return found;s
				}
				return true;
		}
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
		$scope.$watch(function() { return $mdMedia('xs') }, function(small) {
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

(function(){
    "use strict";
    angular.module('app.controllers').controller('IndexinfoCtrl', ["IndizesService", function(IndizesService){
        var vm = this;
        vm.structure = IndizesService.getStructure();
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
			//minZoom = 1;
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

    angular.module('app.controllers').controller('SignupCtrl', function(){
        //
    });

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
				vm.item.parent_id = 0;
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
				if(vm.copy.parent_id && vm.item.parent_id){
					moveItem();
				}
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
						if(data.parent_id != 0 ){
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvY29udGVudC5qcyIsInNlcnZpY2VzL2NvdW50cmllcy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lcnJvckNoZWNrZXIuanMiLCJzZXJ2aWNlcy9pY29ucy5qcyIsInNlcnZpY2VzL2luZGV4LmpzIiwic2VydmljZXMvaW5kaXplcy5qcyIsInNlcnZpY2VzL3JlY3Vyc2lvbmhlbHBlci5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL3ZlY3RvcmxheWVyLmpzIiwiYXBwL2NvbmZsaWN0SW1wb3J0L2NvbmZsaWN0SW1wb3J0LmpzIiwiYXBwL2NvbmZsaWN0ZGV0YWlscy9jb25mbGljdGRldGFpbHMuanMiLCJhcHAvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiYXBwL2NvbmZsaWN0cy9jb25mbGljdHMuanMiLCJhcHAvY29uZmxpY3RuYXRpb24vY29uZmxpY3RuYXRpb24uanMiLCJhcHAvZnVsbExpc3QvZnVsbExpc3QuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9ob21lL2hvbWUuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9pbmRleC9pbmRleC5qcyIsImFwcC9pbmRleC9pbmRleGJhc2UuanMiLCJhcHAvaW5kZXhDaGVjay9pbmRleENoZWNrLmpzIiwiYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWwuanMiLCJhcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5qcyIsImFwcC9pbmRleGNyZWF0b3IvaW5kZXhjcmVhdG9yLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvaW5kZXhlZGl0b3IvY2F0ZWdvcnkuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaXplcy5qcyIsImFwcC9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbG9nby9sb2dvLmpzIiwiYXBwL21hcC9tYXAuanMiLCJhcHAvc2VsZWN0ZWQvc2VsZWN0ZWQuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lkZW1lbnUvc2lkZW1lbnUuanMiLCJhcHAvdG9hc3RzL3RvYXN0cy5qcyIsImFwcC91bnN1cHBvcnRlZF9icm93c2VyL3Vuc3VwcG9ydGVkX2Jyb3dzZXIuanMiLCJhcHAvdXNlci91c2VyLmpzIiwiZGlhbG9ncy9hZGRQcm92aWRlci9hZGRQcm92aWRlci5qcyIsImRpYWxvZ3MvYWRkVW5pdC9hZGRVbml0LmpzIiwiZGlhbG9ncy9hZGRZZWFyL2FkZFllYXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvbmZsaWN0bWV0aG9kZS9jb25mbGljdG1ldGhvZGUuanMiLCJkaWFsb2dzL2NvbmZsaWN0dGV4dC9jb25mbGljdHRleHQuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9hdXRvRm9jdXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYmFycy9iYXJzLmpzIiwiZGlyZWN0aXZlcy9iYXJzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvYnViYmxlcy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3JpZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiZGlyZWN0aXZlcy9jb25mbGljdGl0ZW1zL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbnRlbnRlZGl0YWJsZS9jb250ZW50ZWRpdGFibGUuanMiLCJkaXJlY3RpdmVzL2NvbnRlbnRlZGl0YWJsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2ZpbGVEcm9wem9uZS5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9ycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaXplcy9pbmRpemVzLmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L3BhcnNlQ29uZmxpY3RDc3YuanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZWNzdi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9wYXJzZWNzdi9wYXJzZWNzdi5qcyIsImRpcmVjdGl2ZXMvcGllY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGllY2hhcnQvcGllY2hhcnQuanMiLCJkaXJlY3RpdmVzL3JvdW5kYmFyL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3JvdW5kYmFyL3JvdW5kYmFyLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N0eWxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvc3R5bGVzLmpzIiwiZGlyZWN0aXZlcy9zdWJpbmRleC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3QvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuanMiLCJkaXJlY3RpdmVzL3RyZWVtZW51L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3RyZWVtZW51L3RyZWVtZW51LmpzIiwiZGlyZWN0aXZlcy90cmVldmlldy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVldmlldy90cmVldmlldy5qcyIsImRpcmVjdGl2ZXMvd2VpZ2h0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O0VBSUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxZQUFBLFdBQUEsaUJBQUEsZ0JBQUEsY0FBQSxnQkFBQSxZQUFBLFVBQUEsU0FBQSxhQUFBLGlCQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsdUJBQUEsY0FBQSxjQUFBLG9CQUFBO0VBQ0EsUUFBQSxPQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxnQkFBQSxhQUFBLGFBQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxrQkFBQSxDQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxxRUFBQSxTQUFBLGdCQUFBLG9CQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFVBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxhQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7O0lBR0EsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFNBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLGdDQUFBLFNBQUEsa0JBQUE7TUFDQSxPQUFBLGlCQUFBOzs7OztHQUtBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0tBQ0EsNEJBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQTs7S0FFQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGdCQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxPQUFBO09BQ0EsS0FBQTs7O0tBR0EsMkJBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQTs7S0FFQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGNBQUE7T0FDQSxZQUFBO09BQ0EsTUFBQTs7OztJQUlBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLCtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSx5Q0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLDhDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxhQUFBLGFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsTUFBQSw0QkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOzs7SUFHQSxNQUFBLGlDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLDBDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLElBQUEsYUFBQSxNQUFBLEdBQUEsT0FBQTtNQUNBLE9BQUEsZUFBQSxRQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxxQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLGVBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsK0NBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLGdCQUFBO1NBQ0EsTUFBQTtTQUNBLE9BQUE7U0FDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7OztJQU9BLE1BQUEsaURBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0lBRUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEsd0NBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSw2Q0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxHQUFBLGFBQUEsTUFBQSxNQUFBO1NBQ0EsT0FBQTs7UUFFQSxPQUFBLGVBQUEsWUFBQSxhQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLCtCQUFBLFNBQUEsZ0JBQUE7UUFDQSxPQUFBLGVBQUEsZ0JBQUE7U0FDQSxNQUFBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7U0FDQSxLQUFBOzs7T0FHQSx5QkFBQSxTQUFBLGFBQUE7UUFDQSxPQUFBLFlBQUEsT0FBQSxTQUFBOztPQUVBLCtCQUFBLFNBQUEsZUFBQTtTQUNBLE9BQUEsZUFBQSxnQkFBQSxJQUFBOzs7Ozs7SUFNQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsZUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSw0QkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxpQkFBQSxhQUFBLElBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxVQUFBLGFBQUE7O09BRUEsZ0NBQUEsU0FBQSxrQkFBQTtRQUNBLE9BQUEsaUJBQUE7Ozs7S0FJQSxZQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsdUJBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsMkJBQUE7SUFDQSxLQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBLE1BQUEsbUNBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsZ0JBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLHNCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSx5QkFBQSxTQUFBLGFBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQTs7S0FFQSwyQkFBQSxTQUFBLGFBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0Esd0NBQUEsU0FBQSxhQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQSx1QkFBQSxhQUFBLEtBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsOEJBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLDBDQUFBLFNBQUEsYUFBQSxjQUFBO01BQ0EsT0FBQSxZQUFBLElBQUEsc0JBQUEsYUFBQSxJQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLGVBQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLFVBQUE7O0lBRUEsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsT0FBQTs7Ozs7O0FDamdCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxxSEFBQSxTQUFBLFlBQUEsWUFBQSxVQUFBLE9BQUEsUUFBQSxlQUFBLFNBQUEsYUFBQSxRQUFBO0VBQ0EsV0FBQSxjQUFBO0VBQ0EsV0FBQSxjQUFBLGNBQUEsWUFBQTtFQUNBLFdBQUEsU0FBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFdBQUEsYUFBQSxTQUFBLFFBQUE7R0FDQSxXQUFBLFFBQUE7OztFQUdBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtHQUNBLElBQUEsUUFBQSxRQUFBLENBQUEsTUFBQSxtQkFBQTtJQUNBLE9BQUEsTUFBQSx1Q0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBLE9BQUEsR0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsVUFBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLFdBQUEsUUFBQTtVQUNBO0lBQ0EsV0FBQSxRQUFBOztHQUVBLElBQUEsT0FBQSxRQUFBLFNBQUEsYUFBQTtJQUNBLElBQUEsUUFBQSxNQUFBLGVBQUEsWUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLGFBQUE7V0FDQTtLQUNBLFdBQUEsYUFBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxXQUFBO1dBQ0E7S0FDQSxXQUFBLFdBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxVQUFBO0tBQ0EsV0FBQSxXQUFBO1dBQ0E7S0FDQSxXQUFBLFdBQUE7O1VBRUE7SUFDQSxXQUFBLGFBQUE7SUFDQSxXQUFBLFdBQUE7SUFDQSxXQUFBLFdBQUE7SUFDQSxXQUFBLFdBQUE7O0dBRUEsSUFBQSxRQUFBLEtBQUEsUUFBQSxjQUFBLENBQUEsS0FBQSxRQUFBLFFBQUEsdUJBQUE7SUFDQSxXQUFBLFdBQUE7VUFDQTtJQUNBLFdBQUEsV0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSw2QkFBQTtJQUNBLFdBQUEsWUFBQTtVQUNBO0lBQ0EsV0FBQSxZQUFBOztHQUVBLFdBQUEsZUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxXQUFBLFFBQUE7Ozs7RUFJQSxXQUFBLElBQUEsc0JBQUEsU0FBQSxPQUFBLFNBQUE7Ozs7RUFJQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFNBQUE7R0FDQSxXQUFBLGlCQUFBO0dBQ0EsR0FBQSxNQUFBLGtCQUFBO0tBQ0EsV0FBQSxZQUFBOztHQUVBOzs7RUFHQSxTQUFBLGVBQUE7R0FDQSxTQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLElBQUE7O01BRUE7Ozs7Ozs7Ozs7Ozs7O0FDMUZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUEsZUFBQTs7O0VBR0EsY0FBQSxXQUFBO0lBQ0EsY0FBQSxZQUFBO0lBQ0EsY0FBQSxZQUFBO0VBQ0EsY0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7O0VBRUEsY0FBQSxPQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHdCQUFBLFNBQUEsYUFBQTtRQUNBLGFBQUEsYUFBQTs7Ozs7QUNKQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxVQUFBLHNCQUFBO0VBQ0Esc0JBQUEsaUJBQUE7Ozs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsK0JBQUEsU0FBQSxxQkFBQTtFQUNBO0lBQ0EsV0FBQTtJQUNBLGtCQUFBO0lBQ0EsUUFBQTs7SUFFQSxxQkFBQTtJQUNBLE9BQUE7O0lBRUEsdUJBQUEsU0FBQSxNQUFBLFdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtJQUNBLElBQUE7SUFDQSxnQkFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE1BQUE7S0FDQSxjQUFBLFFBQUEsS0FBQTs7SUFFQSxJQUFBLEtBQUEsVUFBQTtLQUNBLGNBQUEsWUFBQSxLQUFBOztJQUVBLE9BQUE7Ozs7Ozs7Ozs7Ozs7O0FDckJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLG9EQUFBLFNBQUEsbUJBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7R0FFQSxtQkFBQTs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7VUFDQSxZQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFlBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBOztZQUVBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQTs7WUFFQSxPQUFBLE1BQUEsUUFBQSxlQUFBOzs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxjQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7O01BRUEsSUFBQSxTQUFBO0dBQ0EsSUFBQSxJQUFBO0lBQ0EsTUFBQSxNQUFBOztHQUVBLE9BQUEsSUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLGNBQUEsUUFBQSxLQUFBLGlCQUFBLENBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxNQUFBOzs7R0FHQSxPQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE1BQUE7OzthQUdBLE9BQUEsS0FBQSxRQUFBLGNBQUE7Ozs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsaUJBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxLQUFBLElBQUEsYUFBQSxPQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUE7OztHQUdBLE1BQUEsS0FBQSxVQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsSUFBQSxTQUFBLEVBQUE7SUFDQSxPQUFBLElBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsWUFBQTtDQUNBLFNBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLFlBQUEsT0FBQTs7TUFFQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxRQUFBLElBQUE7O1FBRUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxNQUFBLEtBQUEsTUFBQTs7OztHQUlBLE9BQUE7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGtDQUFBLFNBQUEsYUFBQTs7RUFFQSxTQUFBLGNBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLE9BQUEsSUFBQTtJQUNBLElBQUEsT0FBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLE1BQUEsR0FBQTtLQUNBLE9BQUE7O0lBRUEsR0FBQSxLQUFBLFNBQUE7S0FDQSxJQUFBLFlBQUEsY0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxPQUFBOzs7OztHQUtBLE9BQUE7O0VBRUEsT0FBQTtHQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7SUFDQSxjQUFBO0lBQ0EsUUFBQTs7R0FFQSxjQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFVBQUEsWUFBQSxPQUFBLGNBQUE7O0dBRUEsaUJBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxPQUFBLFVBQUEsUUFBQTs7R0FFQSxZQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxhQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGVBQUEsU0FBQSxRQUFBLGFBQUE7SUFDQSxHQUFBLFlBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUEsUUFBQTs7SUFFQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxnQkFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFdBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQTs7O0dBR0EsV0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxPQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxZQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGNBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxTQUFBLEdBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsSUFBQTtPQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLEtBQUEsZUFBQTs7R0FFQSxnQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxZQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOztHQUVBLHVCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGFBQUE7O0dBRUEsa0JBQUEsU0FBQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE1BQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLFdBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsZ0JBQUEsS0FBQTs7R0FFQSxTQUFBLFNBQUEsSUFBQTs7Ozs7S0FLQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxVQUFBOzs7R0FHQSxjQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsS0FBQSxPQUFBLEtBQUE7TUFDQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsY0FBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxPQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxZQUFBLFNBQUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxPQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxHQUFBO01BQ0EsUUFBQTs7S0FFQSxHQUFBLE1BQUEsWUFBQSxNQUFBLFNBQUEsVUFBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLFlBQUEsS0FBQSxZQUFBLElBQUEsTUFBQTtNQUNBLEdBQUEsVUFBQTtPQUNBLFFBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLFNBQUEsU0FBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLFFBQUEsS0FBQTs7R0FFQSxZQUFBLFNBQUEsR0FBQTtJQUNBLEtBQUEsY0FBQSxJQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLFVBQUE7O0dBRUEsWUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsS0FBQSxZQUFBLEtBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxRQUFBLElBQUEsT0FBQTtJQUNBLE9BQUEsUUFBQTs7R0FFQSxhQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQTtLQUNBLE9BQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxRQUFBO1dBQ0E7S0FDQSxPQUFBLEtBQUEsUUFBQSxXQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOzs7R0FHQSxnQkFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxlQUFBOzs7Ozs7OztBQzlKQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxvQ0FBQSxTQUFBLFlBQUE7O1FBRUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxXQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsWUFBQSxZQUFBLE9BQUEsa0JBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxDQUFBLEtBQUEsVUFBQSxPQUFBO2NBQ0EsS0FBQTs7WUFFQSxPQUFBLEtBQUE7Ozs7Ozs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBO0lBQ0EsWUFBQSxVQUFBLENBQUEsY0FBQTs7SUFFQSxTQUFBLFlBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLEtBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTs7O1FBR0EsU0FBQSxPQUFBLE9BQUEsT0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxRQUFBO1lBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLE1BQUEsS0FBQSxZQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLEtBQUEsT0FBQTs7VUFFQSxPQUFBOztRQUVBLFNBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBLElBQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLHFCQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7O0dBSUEsU0FBQSxTQUFBLE9BQUEsU0FBQTtJQUNBLE9BQUEsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7T0FDQSxPQUFBOzs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsd0VBQUEsU0FBQSxhQUFBLGVBQUEsYUFBQTs7UUFFQSxJQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBLE1BQUE7T0FDQSxHQUFBLG1CQUFBO09BQ0EsSUFBQSxHQUFBLEtBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtTQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsT0FBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBO1dBQ0EsSUFBQSxVQUFBLEtBQUEsTUFBQSxNQUFBO1dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBO1lBQ0EsSUFBQSxPQUFBLFVBQUEsT0FBQTthQUNBOzs7O1VBSUEsSUFBQSxTQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7V0FDQSxHQUFBLGlCQUFBLEtBQUE7OztTQUdBLElBQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsR0FBQSxHQUFBLEtBQUEsV0FBQTtXQUNBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7O1VBRUEsY0FBQSxhQUFBLGNBQUE7Ozs7VUFJQSxPQUFBOzs7TUFHQSxTQUFBLGNBQUE7T0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO1FBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxHQUFBO1NBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEsU0FBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtXQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO1dBQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtXQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7UUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxJQUFBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtVQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1VBQ0EsUUFBQSxHQUFBLEtBQUE7VUFDQSxLQUFBOztTQUVBLElBQUEsYUFBQTtTQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1dBQ0EsYUFBQTs7O1NBR0EsSUFBQSxDQUFBLFlBQUE7VUFDQSxJQUFBLE9BQUEsS0FBQTtVQUNBLEdBQUEsV0FBQSxLQUFBOzs7Ozs7TUFNQSxTQUFBLFdBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxLQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsMENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsZUFBQTtRQUNBLE9BQUEsTUFBQSw4Q0FBQTtRQUNBLE9BQUE7O09BRUEsSUFBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsbURBQUE7UUFDQSxPQUFBOzs7T0FHQSxHQUFBLFdBQUE7T0FDQSxJQUFBLFVBQUE7T0FDQSxJQUFBLFdBQUE7T0FDQSxJQUFBLFVBQUE7T0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO1FBQ0EsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTtTQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLElBQUE7O1FBRUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO1VBQ0E7U0FDQTtVQUNBOztRQUVBLFFBQUEsS0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7OztPQUdBLElBQUEsVUFBQSxhQUFBLFFBQUEsU0FBQSxLQUFBLGVBQUE7T0FDQSxhQUFBO09BQ0EsWUFBQSxLQUFBLHdCQUFBO1FBQ0EsTUFBQTtRQUNBLEtBQUE7VUFDQSxLQUFBLFNBQUEsVUFBQTtRQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO1NBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtVQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQTtXQUNBLElBQUEsUUFBQSxLQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsV0FBQTthQUNBLE9BQUE7YUFDQSxTQUFBLFFBQUE7O1lBRUEsYUFBQSxZQUFBO2tCQUNBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxNQUFBLGFBQUE7YUFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7YUFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtjQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7ZUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO2dCQUNBLEdBQUEsV0FBQSxPQUFBLEdBQUE7Z0JBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTtzQkFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO2dCQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQSxXQUFBO2lCQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7aUJBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7O21CQU1BOzthQUVBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsUUFBQSxHQUFBLEtBQUE7O2FBRUEsSUFBQSxhQUFBO2FBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7Y0FDQSxRQUFBLElBQUE7Y0FDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO2VBQ0EsYUFBQTs7O2FBR0EsSUFBQSxDQUFBLFlBQUE7Y0FDQSxhQUFBLFlBQUE7Y0FDQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQTtRQUNBLElBQUEsYUFBQSxjQUFBLFFBQUE7U0FDQSxjQUFBLGFBQUE7O1VBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztRQUlBLE9BQUE7VUFDQSxhQUFBOzs7Ozs7QUNsTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsVUFBQTtRQUNBLElBQUEsV0FBQTtVQUNBLFNBQUE7VUFDQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLGFBQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUE7OztRQUdBLE9BQUE7VUFDQSxZQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsU0FBQTs7VUFFQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7O0FDdEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDJDQUFBLFNBQUEsYUFBQSxPQUFBOztRQUVBLElBQUEsY0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLEtBQUE7Y0FDQSxXQUFBO2NBQ0EsY0FBQTtjQUNBLFdBQUE7Y0FDQSxNQUFBOztZQUVBLFdBQUE7WUFDQSxTQUFBO1dBQ0EsU0FBQSxhQUFBOztRQUVBLElBQUEsQ0FBQSxhQUFBLElBQUEsZUFBQTtVQUNBLGNBQUEsYUFBQSxjQUFBO1lBQ0Esb0JBQUEsS0FBQSxLQUFBO1lBQ0EsZ0JBQUE7WUFDQSxhQUFBOztVQUVBLGNBQUEsWUFBQSxJQUFBOztZQUVBO1VBQ0EsY0FBQSxhQUFBLElBQUE7VUFDQSxVQUFBLFlBQUEsSUFBQTs7UUFFQSxPQUFBO1VBQ0EsTUFBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7O2dCQUVBLFNBQUE7Z0JBQ0EsV0FBQTs7O1VBR0EsUUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxLQUFBOztVQUVBLGNBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxhQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxLQUFBOztVQUVBLGdCQUFBLFNBQUEsS0FBQTtZQUNBLElBQUEsUUFBQSxZQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsUUFBQSxDQUFBLElBQUEsWUFBQSxTQUFBLE9BQUEsT0FBQSxLQUFBOztVQUVBLFNBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLE9BQUE7O1VBRUEsYUFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxZQUFBOztVQUVBLGlCQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLGdCQUFBOztVQUVBLGNBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsYUFBQTs7VUFFQSxXQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBOztVQUVBLG1CQUFBLFVBQUE7O1VBRUEsWUFBQSxJQUFBLGVBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLE9BQUE7O1VBRUEsd0JBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFlBQUEsV0FBQSxLQUFBLGVBQUE7O1VBRUEscUJBQUEsVUFBQTtZQUNBLE9BQUEsY0FBQSxZQUFBLElBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsV0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGlCQUFBLFVBQUE7WUFDQSxPQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBLEVBQUE7O1VBRUEsWUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLE9BQUEsT0FBQSxFQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBOztVQUVBLG1CQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTs7Z0JBRUEsU0FBQTtnQkFDQSxXQUFBOzs7Ozs7OztBQ3BLQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxVQUFBLGFBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0tBQ0EsTUFBQTtLQUNBLFdBQUE7O0lBRUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOzs7R0FHQSxXQUFBLFNBQUEsT0FBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLE9BQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLFlBQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsVUFBQTtJQUNBLE9BQUEsS0FBQTs7R0FFQSxTQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGNBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLEtBQUE7O0dBRUEsZ0JBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7O0dBRUEscUJBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7Ozs7Ozs7QUNqQ0EsQ0FBQSxZQUFBO0VBQ0E7O0VBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0NBQUEsVUFBQSxVQUFBOztJQUVBLE9BQUE7Ozs7Ozs7S0FPQSxTQUFBLFVBQUEsU0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxPQUFBO1FBQ0EsTUFBQTs7Ozs7TUFLQSxJQUFBLFdBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQTtNQUNBLE9BQUE7T0FDQSxLQUFBLENBQUEsUUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBOzs7O09BSUEsTUFBQSxVQUFBLE9BQUEsU0FBQTs7UUFFQSxJQUFBLENBQUEsa0JBQUE7U0FDQSxtQkFBQSxTQUFBOzs7UUFHQSxpQkFBQSxPQUFBLFVBQUEsT0FBQTtTQUNBLFFBQUEsT0FBQTs7OztRQUlBLElBQUEsUUFBQSxLQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxNQUFBOzs7Ozs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxZQUFBOzs7UUFHQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUE7O1VBRUEsV0FBQSxVQUFBOzs7VUFHQSxXQUFBLFVBQUE7Ozs7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG1DQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLFFBQUE7RUFDQSxPQUFBO0dBQ0EsUUFBQTtHQUNBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBO0lBQ0EsT0FBQTs7R0FFQSxVQUFBO0dBQ0EsUUFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLEtBQUEsV0FBQTs7R0FFQSxVQUFBLFNBQUEsR0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFFBQUE7O0dBRUEsVUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsU0FBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsUUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUE7O0dBRUEsY0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLFNBQUEsU0FBQSxjQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLE9BQUEsU0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsV0FBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxTQUFBLGFBQUEsR0FBQTtJQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7SUFDQSxTQUFBLGFBQUEsR0FBQTtJQUNBLEtBQUEsSUFBQSxZQUFBO0lBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O0dBR0EsY0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsV0FBQTs7SUFFQSxLQUFBLFNBQUEsU0FBQSxjQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLE9BQUEsU0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsV0FBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7O0lBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFdBQUEsUUFBQSxJQUFBO0tBQ0EsU0FBQSxhQUFBLEtBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQSxXQUFBOztJQUVBLEtBQUEsSUFBQSxZQUFBO0lBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O0dBR0EsbUJBQUEsU0FBQSxZQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLEtBQUEsWUFBQTs7Ozs7R0FLQSxjQUFBLFNBQUEsZUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFNBQUEsVUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQTs7OztHQUlBLFVBQUEsU0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUE7O0dBRUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLEtBQUEsSUFBQSxRQUFBOztHQUVBLFNBQUEsU0FBQSxNQUFBLE9BQUEsUUFBQTtJQUNBLEtBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxPQUFBLFNBQUEsYUFBQTtLQUNBLEtBQUEsS0FBQSxZQUFBOztJQUVBLElBQUEsQ0FBQSxLQUFBLFFBQUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7V0FFQTtLQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxTQUFBO01BQ0EsS0FBQSxhQUFBLEtBQUEsS0FBQTs7U0FFQTtNQUNBLEtBQUEsa0JBQUEsS0FBQSxLQUFBOzs7SUFHQSxJQUFBLFFBQUE7S0FDQSxLQUFBOzs7R0FHQSxnQkFBQSxTQUFBLEtBQUEsTUFBQTtJQUNBLEdBQUEsT0FBQSxTQUFBLFlBQUE7S0FDQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO09BQ0EsU0FBQTs7OztRQUlBO0tBQ0EsSUFBQSxLQUFBLElBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsU0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLElBQUEsTUFBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO09BQ0EsU0FBQTs7OztJQUlBLE9BQUE7O0dBRUEsaUJBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLElBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTs7R0FFQSxnQkFBQSxTQUFBLE9BQUEsT0FBQSxPQUFBO0lBQ0EsSUFBQSxPQUFBOztJQUVBLFNBQUEsV0FBQTtLQUNBLElBQUEsT0FBQSxTQUFBLGVBQUEsU0FBQSxNQUFBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQTtZQUNBO01BQ0EsS0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLElBQUE7O0tBRUEsSUFBQSxPQUFBLFNBQUEsYUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQTs7S0FFQSxLQUFBLEtBQUEsTUFBQTs7O0dBR0EsZUFBQSxTQUFBLElBQUE7SUFDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUEsVUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxVQUFBLFNBQUEsU0FBQSxJQUFBO01BQ0EsR0FBQSxJQUFBO09BQ0EsR0FBQSxPQUFBO1FBQ0EsUUFBQSxXQUFBOztVQUVBO09BQ0EsUUFBQSxXQUFBOzs7O0tBSUEsS0FBQTs7OztHQUlBLG1CQUFBLFNBQUEsS0FBQSxTQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQTtLQUNBLFFBQUEsSUFBQTs7O1FBR0E7S0FDQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxLQUFBLFdBQUE7Ozs7R0FJQSxPQUFBLFVBQUE7SUFDQSxLQUFBLEtBQUEsTUFBQTs7O0dBR0EsZ0JBQUEsU0FBQSxTQUFBO0lBQ0E7SUFDQSxJQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsU0FBQSxLQUFBLGVBQUE7SUFDQSxJQUFBLFFBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7SUFDQSxRQUFBLFdBQUE7O0lBRUEsUUFBQTtLQUNBLEtBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLEtBQUE7T0FDQSxJQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztPQUVBLElBQUEsWUFBQSxTQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7T0FDQSxRQUFBLElBQUEsVUFBQSxJQUFBO09BQ0EsSUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxNQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7O09BRUEsTUFBQSxXQUFBO1FBQ0EsT0FBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUE7UUFDQSxTQUFBO1NBQ0EsT0FBQTtTQUNBLE1BQUE7Ozs7YUFJQTtPQUNBLE1BQUEsUUFBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O09BSUE7O0lBRUEsT0FBQTs7Ozs7Ozs7QUNoUUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMERBQUEsU0FBQSxhQUFBLFFBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLE1BQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLElBQUEsT0FBQTtJQUNBLFNBQUEsR0FBQTtJQUNBLFFBQUEsR0FBQTs7R0FFQSxZQUFBLElBQUEscUJBQUEsS0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSkFBQSxTQUFBLFVBQUEsUUFBQSxRQUFBLFlBQUEsb0JBQUEsVUFBQSxXQUFBLFNBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGdCQUFBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBOztFQUVBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLHNCQUFBO0VBQ0EsR0FBQSxnQkFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTtHQUNBLGVBQUE7R0FDQSxNQUFBO0dBQ0EsT0FBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBOztHQUVBLFdBQUEsU0FBQTtHQUNBLFFBQUEsVUFBQSxLQUFBLFNBQUEsVUFBQTs7SUFFQSxHQUFBLFlBQUE7SUFDQSxtQkFBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUEsUUFBQTtJQUNBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxhQUFBO0lBQ0EsbUJBQUE7OztJQUdBLFFBQUEsUUFBQSxHQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUE7S0FDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsT0FBQTtLQUNBLElBQUEsS0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFVBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7TUFDQSxtQkFBQSxtQkFBQSxPQUFBLEtBQUE7Ozs7O0lBS0EsbUJBQUEsZUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQkEsU0FBQSxhQUFBLEtBQUEsR0FBQTs7R0FFQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7SUFDQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxXQUFBO0dBQ0EsY0FBQSxhQUFBLGdCQUFBOzs7RUFHQSxTQUFBLGFBQUE7R0FDQSxjQUFBLGFBQUE7OztFQUdBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLHNCQUFBO0dBQ0EsSUFBQSxHQUFBLGVBQUEsT0FBQTtHQUNBLE9BQUE7Ozs7OztBQ3ZJQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFlBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsV0FBQSxnQkFBQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTs7RUFFQSxHQUFBLGFBQUE7O0VBRUEsU0FBQSxXQUFBLE1BQUE7R0FDQSxRQUFBLElBQUEsTUFBQSxXQUFBO0dBQ0EsSUFBQSxJQUFBLFdBQUEsY0FBQSxRQUFBO0dBQ0EsSUFBQSxJQUFBLENBQUEsR0FBQTtJQUNBLFdBQUEsY0FBQSxPQUFBLEdBQUE7VUFDQTtJQUNBLFdBQUEsY0FBQSxLQUFBOzs7R0FHQSxJQUFBLFdBQUEsY0FBQSxVQUFBLEdBQUE7SUFDQSxXQUFBLGdCQUFBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBOzs7R0FHQTs7OztBQzFDQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0SkFBQSxVQUFBLFVBQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxTQUFBLG9CQUFBLGFBQUEsZUFBQSxZQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxHQUFBLGNBQUE7R0FDQSxZQUFBO0dBQ0EsWUFBQTtHQUNBLFVBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUEsQ0FBQSxHQUFBLEdBQUE7O0VBRUEsR0FBQSx1QkFBQTtFQUNBLEdBQUEsaUJBQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBLFdBQUEsU0FBQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsUUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOztHQUVBLFVBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQTtJQUNBLEdBQUEsWUFBQTtJQUNBOzs7Ozs7OztFQVFBLFNBQUEsZUFBQTs7R0FFQSxJQUFBLFdBQUE7SUFDQSxXQUFBOztJQUVBLFdBQUE7Ozs7OztFQU1BLFNBQUEsWUFBQTtHQUNBLEdBQUEsWUFBQTtHQUNBLEdBQUEsc0JBQUE7R0FDQSxHQUFBLHNCQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFVBQUE7O0dBRUEsR0FBQSxZQUFBLENBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBO01BQ0E7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUEsR0FBQSxPQUFBOzs7R0FHQSxHQUFBLGdCQUFBLENBQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBO01BQ0E7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLGNBQUEsYUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxNQUFBOztHQUVBLElBQUEsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0dBQ0EsSUFBQSxJQUFBLENBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLE9BQUEsR0FBQTtVQUNBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQTs7R0FFQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBOztHQUVBOzs7RUFHQSxTQUFBLGFBQUEsVUFBQTtHQUNBLEdBQUE7R0FDQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQTs7O0dBR0EsUUFBQSxTQUFBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFVBQUEsR0FBQTtJQUNBO0dBQ0E7O0dBRUEsYUFBQSxTQUFBOztFQUVBLFNBQUEsYUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBO0tBQ0EsR0FBQSxVQUFBLEtBQUEsSUFBQTs7OztFQUlBLFNBQUEsa0JBQUE7R0FDQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBO0tBQ0EsSUFBQSxHQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLEdBQUE7TUFDQSxhQUFBOztXQUVBO0tBQ0EsYUFBQTs7O0dBR0EsR0FBQSxRQUFBOztHQUVBLG1CQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBO0dBQ0EsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxFQUFBO0lBQ0EsTUFBQSxRQUFBO0lBQ0EsTUFBQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztPQUdBO0lBQ0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztLQUlBOzs7OztHQUtBLE9BQUE7R0FDQTs7Ozs7QUN0UEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0lBQUEsU0FBQSxVQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsb0JBQUEsYUFBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLFdBQUEsU0FBQTtHQUNBLFdBQUEsZUFBQTs7R0FFQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxtQkFBQSxjQUFBLEdBQUEsT0FBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUEsUUFBQTtJQUNBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxhQUFBO0lBQ0EsbUJBQUEsbUJBQUEsR0FBQSxPQUFBLEtBQUE7SUFDQSxXQUFBLGVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFdBQUEsU0FBQSxVQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLFdBQUE7S0FDQSxJQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUEsU0FBQTtNQUNBLEdBQUEsV0FBQTs7S0FFQSxRQUFBLFFBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLEdBQUEsUUFBQSxHQUFBO09BQ0EsR0FBQSxHQUFBLFNBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsU0FBQSxLQUFBO1FBQ0EsV0FBQSxlQUFBLEdBQUE7Ozs7O0tBS0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsT0FBQTtNQUNBLElBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtPQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXVCQSxTQUFBLGFBQUE7R0FDQSxjQUFBLGFBQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTs7SUFFQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsSUFBQSxZQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOztJQUVBLFFBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDM0lBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdEQUFBLFNBQUEsWUFBQSxZQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7RUFFQSxTQUFBLGdCQUFBLEdBQUE7O0dBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLEtBQUE7OztFQUdBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLENBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxLQUFBLEdBQUEsT0FBQSxTQUFBLEVBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxZQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLENBQUEsRUFBQTtPQUNBLFFBQUE7OztLQUdBLE9BQUEsTUFBQTs7SUFFQSxPQUFBOzs7OztBQ3ZDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0SEFBQSxTQUFBLE9BQUEsVUFBQSxhQUFBLE9BQUEsZUFBQSxZQUFBLE9BQUEsUUFBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLFdBQUEsa0JBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7O0VBRUEsR0FBQSxlQUFBLFNBQUEsU0FBQTtHQUNBLE1BQUEsYUFBQTs7O0VBR0EsU0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLFNBQUE7R0FDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxRQUFBOztNQUVBLE1BQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7SUFDQSxNQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxHQUFBOztLQUVBLE9BQUEsUUFBQTtPQUNBLE1BQUEsU0FBQSxTQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsYUFBQSxJQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsU0FBQSxZQUFBO0dBQ0EsV0FBQSxjQUFBLENBQUEsV0FBQTtHQUNBLGNBQUEsV0FBQSxXQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOztFQUVBLFdBQUEsY0FBQTtFQUNBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLHFCQUFBLFNBQUEsRUFBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxXQUFBLEVBQUEsT0FBQSxTQUFBLFNBQUEsU0FBQSxPQUFBO0tBQ0EsR0FBQSxjQUFBOzs7Ozs7O0FDbEVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLFNBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLFlBQUEsT0FBQSxTQUFBLENBQUEsYUFBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOzs7Ozs7O0FDTkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0JBQUEsVUFBQSxXQUFBO0VBQ0EsS0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLFdBQUE7R0FDQSx5QkFBQTtHQUNBLGtCQUFBOzs7RUFHQSxLQUFBLGVBQUEsVUFBQSxNQUFBLElBQUE7R0FDQSxVQUFBLEtBQUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxRQUFBLHdCQUFBLE9BQUE7S0FDQSxHQUFBO0tBQ0EsWUFBQTs7OztJQUlBLEtBQUEsZ0JBQUEsV0FBQTtHQUNBLFVBQUEsS0FBQTs7S0FFQSxhQUFBO1NBQ0Esa0JBQUE7O0tBRUEsS0FBQSxVQUFBLFFBQUE7O09BRUEsWUFBQTs7Ozs7Ozs7O0FDNUJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1MQUFBLFNBQUEsUUFBQSxRQUFBLFlBQUEsWUFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBLG9CQUFBLE1BQUEsV0FBQSxhQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsYUFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGtCQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUEsbUJBQUE7RUFDQSxHQUFBLGtCQUFBLG1CQUFBO0VBQ0EsR0FBQSxzQkFBQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxZQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxHQUFBLFVBQUE7R0FDQSxhQUFBOzs7O0VBSUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLG1CQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBLEdBQUEsWUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsR0FBQSxnQkFBQSxLQUFBLFNBQUEsV0FBQTtJQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFVBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxjQUFBOzs7S0FHQSxhQUFBLEdBQUEsVUFBQSxNQUFBO0tBQ0E7S0FDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBOztLQUVBLElBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTtNQUNBLFdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxlQUFBOzs7TUFHQSxVQUFBLEtBQUEsR0FBQSxRQUFBO01BQ0EsWUFBQSxPQUFBLGtCQUFBLFdBQUEsS0FBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE9BQUE7Ozs7Ozs7O0VBUUEsU0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBOztHQUVBLE9BQUEsR0FBQSwwQkFBQTtJQUNBLEdBQUEsS0FBQTtJQUNBLEtBQUEsS0FBQTtJQUNBLEtBQUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxNQUFBLFNBQUEsU0FBQSxFQUFBO0tBQ0EsY0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsV0FBQSxNQUFBLEdBQUEsY0FBQSxJQUFBO0lBQ0EsR0FBQSxhQUFBO1VBQ0E7SUFDQSxHQUFBLGFBQUE7O0dBRUEsR0FBQSxlQUFBLEdBQUEsYUFBQSxrQkFBQTtHQUNBOztFQUVBLFNBQUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxXQUFBLGVBQUE7R0FDQSxnQkFBQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUEsR0FBQSxhQUFBLE9BQUEsaUJBQUE7OztFQUdBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBOztHQUVBLEdBQUE7O0dBRUEsV0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTs7O0dBR0E7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQTs7R0FFQSxJQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsR0FBQSxVQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtJQUNBLEtBQUEsV0FBQSxXQUFBLEtBQUEsR0FBQSxVQUFBOzs7R0FHQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE1BQUEsY0FBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxNQUFBLEdBQUEsS0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxRQUFBLFNBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUEsS0FBQTtHQUNBLFlBQUEsT0FBQSxXQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQTtJQUNBLGVBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxPQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFVBQUEsU0FBQSxTQUFBO0tBQ0EsUUFBQSxXQUFBOztJQUVBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLENBQUEsR0FBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLDJCQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBOzs7O0dBSUE7O0VBRUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxHQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBLEtBQUE7OztHQUdBLElBQUEsS0FBQSxTQUFBLEdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsbUNBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsV0FBQSxRQUFBLEtBQUE7Ozs7R0FJQSxPQUFBLENBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7OztHQUdBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtHQUNBOzs7RUFHQSxTQUFBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsZUFBQSxHQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsR0FBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsVUFBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLFdBQUEsTUFBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBOzs7O0dBSUEsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGFBQUEsT0FBQTs7R0FFQSxHQUFBLFNBQUEsU0FBQSxjQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUE7R0FDQSxHQUFBLE9BQUEsU0FBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLEdBQUEsSUFBQSxZQUFBO0dBQ0EsR0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUEsR0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7Ozs7RUFLQSxTQUFBLGFBQUEsT0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLEdBQUEsSUFBQSxZQUFBO0dBQ0EsR0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUEsR0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7R0FFQTs7O0VBR0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTs7O0dBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxlQUFBLFNBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxHQUFBOztHQUVBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7SUFDQSxRQUFBLFdBQUE7OztHQUdBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxhQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxPQUFBLFdBQUE7O01BRUEsSUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7O01BRUEsTUFBQSxXQUFBO09BQ0EsT0FBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztNQUdBO1lBQ0E7O01BRUEsTUFBQSxRQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7Ozs7O0dBS0EsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxZQUFBLFNBQUE7SUFDQSxNQUFBLGNBQUEsV0FBQTtLQUNBLElBQUEsUUFBQTtNQUNBLE1BQUEsUUFBQSxXQUFBO01BQ0EsVUFBQSxDQUFBLEtBQUE7TUFDQSxVQUFBOztLQUVBLE9BQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLE9BQUEsY0FBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7OztHQUdBLElBQUEsRUFBQSxLQUFBO0lBQ0EsSUFBQSxFQUFBLEtBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O0lBRUE7SUFDQSxnQkFBQSxFQUFBO0lBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQSw2QkFBQSxPQUFBLFFBQUEsUUFBQSxrQkFBQTtLQUNBLE9BQUEsR0FBQSwyQkFBQTtNQUNBLElBQUEsT0FBQSxPQUFBO01BQ0EsTUFBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEsT0FBQSwwQkFBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxJQUFBO0dBQ0EsSUFBQSxFQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxPQUFBLFdBQUE7S0FDQSxPQUFBLEdBQUEsbUNBQUE7TUFDQSxJQUFBLEVBQUE7TUFDQSxNQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTtNQUNBLFdBQUEsT0FBQSxPQUFBOztXQUVBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsSUFBQSxFQUFBO01BQ0EsTUFBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsSUFBQSxFQUFBO0tBQ0EsTUFBQSxFQUFBOzs7Ozs7O0VBT0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7OztHQVFBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7O0dBRUEsSUFBQSxNQUFBO0lBQ0EsQ0FBQSxHQUFBO0lBQ0EsQ0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsQ0FBQSxHQUFBO0tBQ0EsQ0FBQSxHQUFBOzs7R0FHQSxHQUFBLElBQUEsVUFBQSxRQUFBO0lBQ0EsU0FBQSxJQUFBO0lBQ0EsU0FBQTs7OztFQUlBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQ0EsU0FBQSxnQkFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxXQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsS0FBQSxXQUFBOzs7WUFHQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsTUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxPQUFBLE9BQUEsTUFBQSxXQUFBOzs7OztJQUtBLEdBQUEsVUFBQSxRQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUE7O0tBRUEsSUFBQSxDQUFBLEdBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxXQUFBLFFBQUE7T0FDQSxHQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO2FBQ0E7T0FDQSxPQUFBLE1BQUEsZ0NBQUEsSUFBQSxRQUFBLFdBQUE7O1lBRUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLEdBQUEsbUJBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7Ozs7Ozs7O0FDbG5CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQ0FBQSxVQUFBLE9BQUEsUUFBQTs7SUFFQSxPQUFBLFNBQUE7Ozs7QUNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5R0FBQSxVQUFBLFFBQUEsUUFBQSxTQUFBLFVBQUEsUUFBQSxlQUFBLGNBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtJQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLHNCQUFBOztFQUVBLEdBQUEsVUFBQTtJQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsUUFBQTtHQUNBLFFBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBO0tBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7OztJQUdBLFNBQUEsVUFBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLElBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLElBQUEsU0FBQSxPQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBO01BQ0EsUUFBQTs7O09BR0EsUUFBQSxRQUFBLElBQUEsT0FBQSxTQUFBLE1BQUE7U0FDQSxHQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxLQUFBOztJQUVBLEdBQUEsYUFBQSxHQUFBLE1BQUE7Ozs7O0VBS0EsU0FBQSxPQUFBLFdBQUE7R0FDQSxHQUFBLFNBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztHQUdBOztFQUVBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLFlBQUE7Ozs7Ozs7RUFPQSxTQUFBLGFBQUEsR0FBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtJQUNBLFFBQUEsUUFBQSxLQUFBLE1BQUEsVUFBQSxPQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxFQUFBO09BQ0EsR0FBQSxNQUFBLFVBQUEsSUFBQTtRQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7U0FDQSxhQUFBOztRQUVBLGFBQUE7UUFDQSxHQUFBLEtBQUEsR0FBQSxPQUFBLE9BQUEsR0FBQTs7O01BR0EsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBOzs7O0dBSUEsYUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxVQUFBLE9BQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7TUFDQSxHQUFBO01BQ0EsYUFBQTs7S0FFQSxHQUFBO0tBQ0EsYUFBQTs7SUFFQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxPQUFBOztHQUVBLEdBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxVQUFBLEdBQUE7SUFDQSxHQUFBO0lBQ0EsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxlQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7S0FDQSxHQUFBLFNBQUEsS0FBQTs7Ozs7RUFLQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxTQUFBO0dBQ0EsY0FBQSxhQUFBLFdBQUE7OztFQUdBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQTs7O0VBR0EsU0FBQSxrQkFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxLQUFBLEdBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsSUFBQSxLQUFBLFdBQUEsaUJBQUEsU0FBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLElBQUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsSUFBQSxPQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7Ozs7O0FDM0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNIQUFBLFNBQUEsWUFBQSxRQUFBLFFBQUEsY0FBQSxhQUFBLGVBQUEsUUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxXQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtDQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsUUFBQSxRQUFBLElBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtNQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLHlCQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7T0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLE9BQUEsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTs7OztJQUlBLElBQUEsQ0FBQSxJQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBO01BQ0EsU0FBQTtNQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsS0FBQTtNQUNBLFFBQUEsR0FBQSxLQUFBO01BQ0EsS0FBQTs7S0FFQSxJQUFBLGFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO01BQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLGFBQUE7OztLQUdBLElBQUEsQ0FBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFdBQUEsS0FBQTs7OztHQUlBLGFBQUE7OztFQUdBLFNBQUEsV0FBQTs7R0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsMENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsZUFBQTtJQUNBLE9BQUEsTUFBQSw4Q0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsbURBQUE7SUFDQSxPQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxHQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsSUFBQTs7SUFFQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0E7TUFDQTs7SUFFQSxRQUFBLEtBQUE7S0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7S0FDQSxNQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztHQUdBLElBQUEsVUFBQSxhQUFBLFFBQUEsU0FBQSxLQUFBLGVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQSxLQUFBLHdCQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQTtJQUNBLFdBQUEsaUJBQUE7SUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGdCQUFBO09BQ0EsSUFBQSxRQUFBLEtBQUEsU0FBQSxHQUFBO1FBQ0EsSUFBQSxXQUFBO1NBQ0EsT0FBQTtTQUNBLFNBQUEsUUFBQTs7UUFFQSxhQUFBLFlBQUE7Y0FDQSxHQUFBLFFBQUEsS0FBQSxVQUFBLEVBQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO1NBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO1lBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTtrQkFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBLFdBQUE7YUFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2FBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7O2VBTUE7O1NBRUEsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxRQUFBLEdBQUEsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFFBQUEsSUFBQTtVQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7V0FDQSxhQUFBOzs7U0FHQSxJQUFBLENBQUEsWUFBQTtVQUNBLGFBQUEsWUFBQTtVQUNBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O0lBT0EsR0FBQSxjQUFBO0lBQ0EsYUFBQTtJQUNBLElBQUEsYUFBQSxjQUFBLFFBQUE7S0FDQSxjQUFBLGFBQUE7O01BRUEsU0FBQSxVQUFBO0lBQ0EsV0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7RUFJQSxHQUFBLGFBQUE7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsSUFBQSxhQUFBO0lBQ0EsTUFBQTs7R0FFQSxJQUFBLE9BQUE7SUFDQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtLQUNBLEtBQUEsS0FBQSxHQUFBLE9BQUEsR0FBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO01BQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztLQUVBLFdBQUEsS0FBQSxLQUFBLEtBQUE7V0FDQTtLQUNBLE9BQUEsTUFBQSwrQkFBQTtLQUNBOzs7R0FHQSxRQUFBLElBQUE7R0FDQSxZQUFBLEtBQUEsaUJBQUEsR0FBQSxVQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE1BQUE7S0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUEsYUFBQTtLQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUMzTkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUhBQUEsU0FBQSxRQUFBLFFBQUEsbUJBQUEsU0FBQSxhQUFBLGFBQUEsT0FBQTs7O1FBR0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxRQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsU0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsbUJBQUEsYUFBQTs7O1FBR0EsUUFBQSxJQUFBLEdBQUE7UUFDQTs7UUFFQSxTQUFBLFVBQUE7VUFDQTs7O1FBR0EsU0FBQSxXQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsS0FBQTtZQUNBLE9BQUEsR0FBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEVBQUE7VUFDQSxHQUFBLFlBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLEdBQUEsVUFBQSxNQUFBO1lBQ0EsbUJBQUEsYUFBQSxHQUFBLFVBQUEsTUFBQTs7VUFFQTtZQUNBLGFBQUE7OztRQUdBLE9BQUEsT0FBQSxnQkFBQSxTQUFBLEVBQUEsRUFBQTtVQUNBLEdBQUEsTUFBQSxHQUFBO1VBQ0EsR0FBQSxPQUFBLEVBQUEsWUFBQSxhQUFBO1lBQ0EsR0FBQSxFQUFBLFlBQUEsRUFBQSxTQUFBO2NBQ0EsR0FBQSxFQUFBLE1BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLE1BQUE7O2tCQUVBO2tCQUNBLG1CQUFBLGFBQUE7O2NBRUE7OztjQUdBO1lBQ0EsR0FBQSxPQUFBLEVBQUEsY0FBQSxZQUFBO2NBQ0EsR0FBQSxFQUFBLFdBQUEsT0FBQTtnQkFDQSxtQkFBQSxhQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUE7O2tCQUVBO2dCQUNBLG1CQUFBLGFBQUE7OztZQUdBOztVQUVBLGFBQUEsdUJBQUE7VUFDQSxhQUFBO1VBQ0E7OztRQUdBLFNBQUEsUUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7Y0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBLGNBQUEsR0FBQTs7VUFFQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O1FBRUEsU0FBQSxjQUFBLElBQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2FBQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGNBQUEsSUFBQTtlQUNBLFFBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQTs7O1VBR0EsT0FBQTs7UUFFQSxTQUFBLGVBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7T0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBO09BQ0EsSUFBQSxPQUFBLFFBQUE7O09BRUEsUUFBQTtPQUNBLEtBQUE7O1NBRUEsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7U0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7Y0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7O1NBRUEsTUFBQSxXQUFBO1VBQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxTQUFBO1dBQ0EsT0FBQTtXQUNBLE1BQUE7OztTQUdBOzs7O09BSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxVQUFBLFNBQUE7UUFDQSxNQUFBLGNBQUEsWUFBQTtTQUNBLElBQUEsUUFBQTtVQUNBLE1BQUEsUUFBQSxXQUFBO1VBQ0EsVUFBQSxDQUFBLEtBQUE7VUFDQSxVQUFBOztTQUVBLE9BQUE7OztPQUdBLE9BQUE7O1FBRUEsU0FBQSxjQUFBO1VBQ0EsR0FBQSxVQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBO09BQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxTQUFBLFlBQUE7VUFDQTs7Ozs7Ozs7QUM3SUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0dBQUEsU0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBLGVBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxhQUFBO01BQ0EsR0FBQSxhQUFBLGFBQUE7TUFDQSxHQUFBLG1CQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxXQUFBO01BQ0EsR0FBQSxXQUFBOzs7TUFHQSxTQUFBLGlCQUFBLElBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQSxhQUFBLFFBQUEsWUFBQTtVQUNBLGFBQUEsYUFBQSxJQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7OztRQUdBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQSxhQUFBLGFBQUE7UUFDQSxhQUFBOztNQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsYUFBQSxPQUFBO0tBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxRQUFBLEtBQUEsZ0JBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O0tBRUEsT0FBQTs7SUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGVBQUEsT0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0tBQ0EsT0FBQSxVQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFNBQUEsVUFBQTtVQUNBLEdBQUEsVUFBQSxXQUFBO1lBQ0E7Ozs7UUFJQSxHQUFBLFFBQUEsT0FBQSxLQUFBLEdBQUEsWUFBQSxPQUFBO1VBQ0EsT0FBQTs7UUFFQSxPQUFBOztNQUVBLFNBQUEsV0FBQTs7VUFFQSxHQUFBLENBQUEsR0FBQSxLQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQUEsS0FBQTtZQUNBLGNBQUEsYUFBQSxXQUFBO1lBQ0EsT0FBQTs7TUFFQSxJQUFBLGFBQUE7T0FDQSxNQUFBOztNQUVBLElBQUEsVUFBQTtNQUNBLElBQUEsYUFBQTtPQUNBLFNBQUE7TUFDQSxHQUFBLFVBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztTQUVBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtVQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O1NBR0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO1NBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7WUFFQTtnQkFDQSxHQUFBLEdBQUEsS0FBQSxLQUFBO2tCQUNBLEtBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQTtrQkFDQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7V0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztvQkFFQTttQkFDQSxRQUFBLEtBQUE7Ozs7Ozs7Y0FPQTtRQUNBLE9BQUEsTUFBQSwrQkFBQTtRQUNBOzs7TUFHQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxJQUFBLFdBQUE7UUFDQSxJQUFBLE9BQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxhQUFBO1NBQ0EsV0FBQSxHQUFBLFdBQUEsS0FBQSxNQUFBOztRQUVBLElBQUEsUUFBQTtTQUNBLFVBQUE7U0FDQSxTQUFBLEdBQUEsV0FBQSxLQUFBO1NBQ0EsZUFBQSxHQUFBLFdBQUEsS0FBQTtTQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLEtBQUEsTUFBQTtTQUNBLGFBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQTtTQUNBLFlBQUE7U0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBLE1BQUE7O1FBRUEsSUFBQSxhQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxLQUFBLFlBQUEsVUFBQSxLQUFBO1NBQ0EsV0FBQSxLQUFBLElBQUE7O1FBRUEsTUFBQSxhQUFBO1FBQ0EsT0FBQSxLQUFBOzs7TUFHQSxHQUFBLEtBQUEsU0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUE7OztNQUdBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxPQUFBLE1BQUE7U0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7U0FDQSxhQUFBO1NBQ0EsT0FBQSxHQUFBO1NBQ0EsR0FBQSxPQUFBO1NBQ0EsR0FBQSxPQUFBOztRQUVBLEdBQUEsVUFBQTs7U0FFQSxVQUFBLFVBQUE7T0FDQSxJQUFBLFNBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztPQUdBLEdBQUEsVUFBQTs7OztNQUlBLFNBQUEsY0FBQTs7Ozs7Ozs7OztLQVVBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1FBQ0EsR0FBQSxNQUFBLEVBQUE7UUFDQSxHQUFBLFdBQUEsRUFBQSxlQUFBO1FBQ0E7TUFDQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLElBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxlQUFBLEtBQUEsTUFBQTtRQUNBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBO1VBQ0EsR0FBQSxjQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLGFBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsVUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxnQkFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxZQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTs7VUFFQSxjQUFBLGFBQUEsZ0JBQUE7ZUFDQTs7Ozs7Ozs7Ozs7QUN6S0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0VBQUEsVUFBQSxRQUFBLGNBQUEsYUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7Ozs7R0FJQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsU0FBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsTUFBQTs7SUFFQSxJQUFBLFVBQUE7SUFDQSxJQUFBLGFBQUE7S0FDQSxTQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO09BQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7T0FFQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7UUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztPQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtPQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O1VBRUE7T0FDQSxRQUFBLEtBQUE7Ozs7WUFJQTtNQUNBLE9BQUEsTUFBQSwrQkFBQTtNQUNBOzs7SUFHQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLGVBQUE7TUFDQSxJQUFBLFdBQUE7TUFDQSxJQUFBLE9BQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxhQUFBO09BQ0EsV0FBQSxHQUFBLFdBQUEsS0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQTtPQUNBLFVBQUE7T0FDQSxTQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0EsZUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLEtBQUEsTUFBQTtPQUNBLGFBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQTtPQUNBLFlBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBLE1BQUE7O01BRUEsSUFBQSxhQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxLQUFBLFlBQUEsVUFBQSxLQUFBO09BQ0EsV0FBQSxLQUFBLElBQUE7O01BRUEsTUFBQSxhQUFBO01BQ0EsT0FBQSxLQUFBOzs7SUFHQSxHQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxTQUFBLEVBQUE7S0FDQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsWUFBQTs7O0lBR0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO0tBQ0EsWUFBQSxLQUFBLGlCQUFBLFNBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLE9BQUEsTUFBQTtPQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtPQUNBLGFBQUE7T0FDQSxPQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUE7T0FDQSxHQUFBLE9BQUE7O01BRUEsR0FBQSxVQUFBOztPQUVBLFVBQUEsVUFBQTtLQUNBLElBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O0tBR0EsR0FBQSxVQUFBOzs7Ozs7OztBQ3ZHQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1Q0FBQSxTQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxhQUFBLGFBQUE7TUFDQSxHQUFBLG1CQUFBLE9BQUEsS0FBQSxHQUFBLFlBQUE7Ozs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0NBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1Q0FBQSxTQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7O01BRUEsR0FBQSxPQUFBOztNQUVBOztNQUVBLFNBQUEsVUFBQTtRQUNBLFlBQUEsU0FBQSxLQUFBLFNBQUEsS0FBQTtVQUNBLEdBQUEsT0FBQTtZQUNBOzs7O01BSUEsU0FBQSxhQUFBO1FBQ0EsUUFBQSxJQUFBLEdBQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtZQUNBLEtBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQTs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrS0FBQSxTQUFBLFFBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxhQUFBLGNBQUEsbUJBQUE7Ozs7Ozs7Ozs7Ozs7OztRQWVBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGtCQUFBOztRQUVBLEdBQUEsU0FBQTtRQUNBLEdBQUEsU0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLGNBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxzQkFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHVCQUFBO1FBQ0EsR0FBQSx5QkFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxRQUFBLGFBQUE7O1FBRUEsR0FBQSxPQUFBO1VBQ0EsV0FBQTtVQUNBLGNBQUE7VUFDQSxNQUFBOztRQUVBLEdBQUEsUUFBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFtQkE7O1FBRUEsU0FBQSxVQUFBOztVQUVBLGFBQUE7O1FBRUEsU0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxTQUFBLGdCQUFBLFFBQUE7U0FDQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7U0FHQSxPQUFBOztRQUVBLFNBQUEsVUFBQTtXQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxZQUFBLG1CQUFBO2NBQ0EsU0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQSxTQUFBOzs7Ozs7UUFNQSxTQUFBLHFCQUFBO1VBQ0EsR0FBQSxnQkFBQSxDQUFBLEdBQUE7VUFDQSxHQUFBLEdBQUEsY0FBQTtZQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLFVBQUE7WUFDQSxZQUFBLE9BQUEsZUFBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLEdBQUEsWUFBQTtjQUNBLEdBQUEsb0JBQUEsSUFBQSxHQUFBLGtCQUFBOzs7OztRQUtBLFNBQUEsaUJBQUEsU0FBQTtVQUNBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLFlBQUEsQ0FBQSxJQUFBLE9BQUE7O1FBRUEsU0FBQSxnQkFBQSxVQUFBLEtBQUE7VUFDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTs7Z0JBRUEsR0FBQSxRQUFBLFNBQUE7a0JBQ0EsS0FBQSxPQUFBLEtBQUE7a0JBQ0EsR0FBQSxpQkFBQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxPQUFBO2tCQUNBLEdBQUEsa0JBQUEsT0FBQSxHQUFBLGtCQUFBLFFBQUEsTUFBQTs7O2NBR0EsZ0JBQUEsVUFBQSxLQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGtCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxrQkFBQSxPQUFBLEtBQUE7WUFDQSxnQkFBQSxVQUFBLEdBQUE7O2NBRUE7WUFDQSxHQUFBLGtCQUFBLEtBQUE7WUFDQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtjQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2dCQUVBO2dCQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7UUFNQSxTQUFBLGVBQUEsTUFBQTtVQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsTUFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBLE1BQUE7WUFDQSxlQUFBLE1BQUE7OztRQUdBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxxQkFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGlCQUFBLE9BQUEsS0FBQTs7Y0FFQTtZQUNBLEdBQUEsaUJBQUEsS0FBQTs7O1FBR0EsU0FBQSx1QkFBQSxLQUFBO1VBQ0EsT0FBQSxHQUFBLGlCQUFBLFFBQUEsUUFBQSxDQUFBOztRQUVBLFNBQUEsVUFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7O1VBR0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7WUFDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztlQUVBLEdBQUEsR0FBQSxpQkFBQSxTQUFBLEdBQUE7Y0FDQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtrQkFDQSxTQUFBLE1BQUEsS0FBQTtrQkFDQSxnQkFBQSxNQUFBLEdBQUE7O2NBRUEsR0FBQSxPQUFBLEtBQUE7Y0FDQSxHQUFBLG1CQUFBOztjQUVBO1lBQ0EsR0FBQSxPQUFBLEtBQUE7OztRQUdBLFNBQUEsZ0JBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxRQUFBLEdBQUEsa0JBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxTQUFBLE1BQUEsS0FBQTs7VUFFQSxHQUFBLE9BQUEsS0FBQTtVQUNBLEdBQUEsbUJBQUE7O1FBRUEsU0FBQSxVQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUE7O1FBRUEsU0FBQSxZQUFBLE1BQUEsS0FBQTtZQUNBLGdCQUFBLE1BQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsR0FBQSxHQUFBLGFBQUE7WUFDQTs7VUFFQSxHQUFBLGVBQUE7VUFDQSxHQUFBLE9BQUEsR0FBQSxZQUFBLFlBQUE7WUFDQSxPQUFBLE1BQUEsNkJBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQTs7VUFFQSxHQUFBLENBQUEsR0FBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsNkJBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQTs7VUFFQSxHQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsWUFBQSxLQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0EsT0FBQSxRQUFBLCtCQUFBO1lBQ0EsT0FBQSxHQUFBLGtCQUFBLENBQUEsTUFBQSxTQUFBO1lBQ0EsU0FBQSxTQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0UEEsQ0FBQSxVQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLGVBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsZUFBQTs7OztBQ0pBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlHQUFBLFVBQUEsUUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBLFNBQUEsS0FBQTtJQUNBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkpBQUEsVUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxRQUFBLFlBQUEsWUFBQSxnQkFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGtCQUFBOztFQUVBLEdBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLFdBQUE7Ozs7RUFJQSxHQUFBLFVBQUE7R0FDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQSxTQUFBLElBQUEsS0FBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsSUFBQSxLQUFBOztJQUVBLFNBQUEsVUFBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsR0FBQSxNQUFBOztJQUVBLFlBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsR0FBQTs7T0FFQSxHQUFBLFVBQUEsVUFBQTs7Ozs7O0dBTUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBOztJQUVBLFdBQUEsU0FBQSxJQUFBLEtBQUE7O0tBRUEsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFdBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLGVBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLEdBQUE7O09BRUEsR0FBQSxVQUFBLGFBQUE7Ozs7Ozs7R0FPQSxPQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7OztFQUtBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLFFBQUE7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsR0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUEsZ0NBQUE7U0FDQSxHQUFBLE9BQUEsT0FBQTs7O1VBR0E7UUFDQSxPQUFBLEdBQUE7O0tBRUE7SUFDQSxLQUFBOztLQUVBO0lBQ0E7Ozs7O0VBS0EsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxXQUFBO0lBQ0EsR0FBQSxPQUFBLFNBQUEsTUFBQSxZQUFBO0lBQ0EsR0FBQSxTQUFBOztPQUVBO0lBQ0EsR0FBQSxTQUFBLFNBQUE7O0dBRUEsR0FBQSxRQUFBLEtBQUEsUUFBQSxrQ0FBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLGNBQUE7OztRQUdBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOztRQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsK0JBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOzs7Ozs7O0FDM0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlJQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxXQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBOztFQUVBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsWUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsWUFBQSxTQUFBLElBQUE7S0FDQSxHQUFBLE9BQUEsSUFBQSxTQUFBLFlBQUE7TUFDQSxhQUFBLElBQUEsTUFBQTs7OztRQUlBLEdBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztHQUVBLG1CQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEscUNBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGNBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxVQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsUUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxHQUFBLFdBQUE7O1FBRUE7S0FDQSxHQUFBLFdBQUE7Ozs7RUFJQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQzNHQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1RUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTs7SUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLGFBQUE7Ozs7OztBQ05BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJIQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxPQUFBOztFQUVBLElBQUEsS0FBQTs7SUFFQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLFdBQUE7RUFDQTtJQUNBLEdBQUEsVUFBQTtNQUNBLFFBQUE7UUFDQSxVQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7O0lBRUEsa0JBQUEsVUFBQTtLQUNBLElBQUEsT0FBQTtNQUNBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLFNBQUEsS0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLElBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxHQUFBLE1BQUE7T0FDQSxHQUFBLFdBQUE7Ozs7SUFJQSxZQUFBLFNBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7TUFDQSxXQUFBLEtBQUEsR0FBQSxNQUFBO01BQ0EsR0FBQSxZQUFBOzs7O01BSUEsVUFBQTs7O0VBR0E7OztFQUdBLFNBQUEsUUFBQTs7O0VBR0EsU0FBQSxXQUFBLE1BQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsS0FBQSxPQUFBLEtBQUE7S0FDQSxPQUFBOztJQUVBLEdBQUEsTUFBQSxTQUFBO0tBQ0EsSUFBQSxZQUFBLFdBQUEsTUFBQSxNQUFBO0tBQ0EsR0FBQSxVQUFBO01BQ0EsT0FBQTs7OztHQUlBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQy9KQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw2SUFBQSxTQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsV0FBQSxXQUFBLGdCQUFBLG9CQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxPQUFBO0VBQ0EsR0FBQSxRQUFBO0dBQ0EsSUFBQSxDQUFBO0dBQ0EsSUFBQTs7RUFFQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxtQkFBQSxTQUFBO0dBQ0EsbUJBQUEsYUFBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxVQUFBLE1BQUEsUUFBQSxJQUFBO01BQ0EsR0FBQSxHQUFBLFVBQUEsTUFBQSxHQUFBLFFBQUEsT0FBQSxPQUFBLEtBQUE7T0FDQSxHQUFBLFVBQUE7Ozs7U0FJQSxHQUFBLENBQUEsR0FBQSxPQUFBO0tBQ0EsR0FBQSxTQUFBOzs7Ozs7O0VBT0EsU0FBQSxTQUFBLEtBQUE7R0FDQSxTQUFBLFVBQUE7Ozs7R0FJQTtFQUNBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEsMkJBQUE7S0FDQSxPQUFBLEdBQUEsZ0NBQUEsQ0FBQSxLQUFBLEdBQUE7O09BRUE7SUFDQSxPQUFBLEdBQUEsMkJBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQSxJQUFBLEtBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQSxHQUFBOzs7RUFHQSxTQUFBLFFBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxXQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7OztHQUdBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7RUFFQSxTQUFBLFdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxxQkFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUE7RUFDQSxTQUFBLGFBQUEsSUFBQSxFQUFBO0dBQ0EsSUFBQSxJQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFNBQUEsYUFBQTtJQUNBLEdBQUEsVUFBQTtVQUNBO0lBQ0EsT0FBQSxNQUFBOzs7RUFHQSxTQUFBLFFBQUEsTUFBQTtHQUNBLEdBQUEsT0FBQTtHQUNBLGVBQUEsaUJBQUEsR0FBQSxVQUFBLElBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEsZ0NBQUE7S0FDQSxPQUFBLEdBQUEsZ0NBQUEsQ0FBQSxLQUFBOztTQUVBLEdBQUEsT0FBQSxRQUFBLFFBQUEsMkJBQUE7S0FDQSxPQUFBLEdBQUEsMkJBQUEsQ0FBQSxLQUFBOztRQUVBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBLENBQUEsS0FBQTs7SUFFQSxHQUFBLE9BQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtLQUNBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxPQUFBO0tBQ0EsR0FBQSxHQUFBLFFBQUE7TUFDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsSUFBQTtPQUNBLFdBQUE7Ozs7S0FJQSxHQUFBLE1BQUEsT0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxXQUFBLEtBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxXQUFBLEtBQUE7OztLQUdBLEdBQUEsZ0JBQUE7TUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLGNBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQSxHQUFBLEtBQUE7OztJQUdBO0lBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsRUFBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxNQUFBLEdBQUEsVUFBQSxPQUFBLFlBQUE7Ozs7Ozs7RUFPQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsU0FBQSxtQkFBQSxlQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQSxXQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUE7SUFDQSxHQUFBLEdBQUEsUUFBQSxPQUFBLElBQUE7TUFDQSxRQUFBLFdBQUE7Ozs7OztHQU1BLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxLQUFBOztNQUVBLElBQUEsWUFBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztZQUlBO01BQ0EsTUFBQSxRQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7Ozs7TUFJQTs7R0FFQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxJQUFBO0dBQ0EsU0FBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFdBQUE7SUFDQSxHQUFBLFFBQUEsUUFBQSwyQkFBQTs7Ozs7Ozs7QUMzTEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsVUFBQSxTQUFBLE1BQUE7O0VBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEscUJBQUE7O0lBRUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsUUFBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7R0FHQTs7Ozs7O0FDakJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlEQUFBLFNBQUEsWUFBQSxRQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsZ0JBQUE7O1FBRUEsR0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTs7VUFFQSxHQUFBLE1BQUEsa0JBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7VUFDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQSxhQUFBLE1BQUEsUUFBQSxZQUFBLFdBQUEsYUFBQTthQUNBLE1BQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7Ozs7O0FDaENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0VBQUEsU0FBQSxRQUFBLGFBQUEsa0JBQUEsb0JBQUE7OztFQUdBLElBQUEsT0FBQTtHQUNBLFVBQUE7RUFDQSxJQUFBLE9BQUEsYUFBQSxLQUFBO0dBQ0EsT0FBQTs7O0VBR0EsSUFBQSxLQUFBO0VBQ0EsSUFBQSxTQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFdBQUE7O0dBRUEsU0FBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsWUFBQTtJQUNBLEtBQUE7S0FDQSxNQUFBO0tBQ0EsS0FBQSxzRkFBQTtLQUNBLE1BQUE7S0FDQSxjQUFBO01BQ0EsUUFBQTtNQUNBLGlCQUFBO01BQ0EsY0FBQTs7Ozs7O0VBTUEsR0FBQSxjQUFBLEVBQUEsVUFBQSxtRkFBQSxRQUFBO0dBQ0EsUUFBQTtHQUNBLGlCQUFBO0dBQ0EsTUFBQTtHQUNBLGNBQUE7O0VBRUEsR0FBQSxZQUFBO0dBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFdBQUE7SUFDQSxLQUFBLENBQUE7SUFDQSxLQUFBLENBQUE7OztFQUdBLEdBQUEsV0FBQTtHQUNBLFFBQUE7O0VBRUEsR0FBQSxlQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxPQUFBOzs7O0VBSUEsSUFBQSxZQUFBLEVBQUE7RUFDQSxVQUFBLFlBQUE7RUFDQSxVQUFBLGFBQUEsV0FBQTtHQUNBLEVBQUEsS0FBQSxXQUFBLE1BQUE7O0VBRUEsVUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFlBQUEsRUFBQSxRQUFBLE9BQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxFQUFBLFFBQUEsT0FBQSxLQUFBLGtDQUFBO0dBQ0EsS0FBQSxjQUFBO0dBQ0EsRUFBQSxTQUFBLHdCQUFBO0dBQ0EsRUFBQSxTQUFBLFlBQUEsV0FBQSxTQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLEdBQUE7TUFDQSxHQUFBLFVBQUE7WUFDQTtNQUNBLElBQUEsU0FBQSxHQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBOzs7O0dBSUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQSxhQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLEdBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxHQUFBO0tBQ0EsR0FBQSxVQUFBO1dBQ0E7S0FDQSxJQUFBLFNBQUEsR0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLEdBQUEsVUFBQTs7Ozs7RUFLQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLG1CQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEscUVBQUEsbUJBQUEsWUFBQSwrQ0FBQSxtQkFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxhQUFBO0lBQ0EsaUJBQUEsQ0FBQSxtQkFBQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBLFNBQUEsU0FBQTtLQUNBLE9BQUEsUUFBQSxXQUFBOztJQUVBLFFBQUEsU0FBQSxTQUFBLFNBQUE7O0tBRUEsT0FBQTs7SUFFQSxPQUFBLFNBQUEsU0FBQTtLQUNBLElBQUEsUUFBQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE9BQUE7Ozs7R0FJQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwSUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEVBQUEsU0FBQSxRQUFBLFlBQUEsb0JBQUEsUUFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsSUFBQTs7O1VBR0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO1VBQ0EsR0FBQSxnQkFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztRQUdBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQSxLQUFBOztRQUVBLFNBQUEsWUFBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQTs7TUFFQSxTQUFBLGNBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO09BQ0E7O1FBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQTtZQUNBOzs7WUFHQSxHQUFBLEVBQUEsSUFBQTtjQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O1lBRUE7WUFDQSxnQkFBQSxFQUFBOzs7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4REFBQSxTQUFBLFFBQUEsZUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxhQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxPQUFBLFVBQUE7O1lBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsY0FBQSxLQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQTtjQUNBLGNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDbkJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLGNBQUE7O01BRUEsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFVBQUE7O1VBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLGNBQUE7Ozs7O01BS0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxjQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLFFBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxHQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbURBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnREFBQSxTQUFBLFFBQUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnRUFBQSxVQUFBLFFBQUEsY0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsbUJBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsVUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsV0FBQTtFQUNBLE9BQUEsT0FBQSxZQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLGFBQUE7TUFDQSxhQUFBLGFBQUEsS0FBQTtPQUNBLGFBQUE7T0FDQSxPQUFBOzs7S0FHQSxJQUFBLE9BQUEsYUFBQSxhQUFBO0tBQ0EsSUFBQSxPQUFBLFFBQUEsR0FBQSxhQUFBO01BQ0EsS0FBQSxlQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtNQUNBLEtBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLGNBQUE7TUFDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsS0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7TUFFQSxJQUFBLE9BQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7T0FDQSxLQUFBLFdBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7Ozs7O0dBTUEsY0FBQTtHQUNBLGFBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsWUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtHQUNBLGNBQUE7Ozs7Ozs7QUNwREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsUUFBQTs7WUFFQTtVQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1VBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFlBQUE7WUFDQSxPQUFBLGNBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGNBQUEsT0FBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0RBQUEsU0FBQSxPQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1dBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLEdBQUE7WUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUVBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxNQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7O0VBR0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTtPQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTthQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0tBSUEsR0FBQSxLQUFBLE9BQUEsS0FBQTs7O0dBR0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsY0FBQTs7S0FFQTs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMEJBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxVQUFBO2dCQUNBLFNBQUEsR0FBQTtlQUNBOzs7Ozs7OztBQ1RBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxNQUFBLE1BQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxlQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG9CQUFBLEdBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsb0JBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7S0FDQSxvQkFBQSxLQUFBOzs7O0VBSUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsV0FBQSxVQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsT0FBQSxNQUFBLGlDQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLFNBQUE7R0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBLFNBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUEsS0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxVQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLE1BQUEsWUFBQSxDQUFBLE1BQUE7S0FDQSxJQUFBLFlBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxHQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0dBSUEsT0FBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtPQUNBLFVBQUEsU0FBQSxPQUFBLEVBQUE7Ozs7T0FJQTtJQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxXQUFBLE9BQUEsRUFBQTs7OztHQUlBLEdBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxJQUFBLFlBQUEsVUFBQSxHQUFBLE1BQUEsR0FBQTtJQUNBLFVBQUEsU0FBQSxLQUFBLEdBQUE7OztPQUdBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBLEtBQUE7R0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsYUFBQSxHQUFBLEtBQUEsVUFBQTtJQUNBLEdBQUEsR0FBQSxLQUFBLGFBQUEsR0FBQSxLQUFBLFVBQUE7S0FDQTs7O0dBR0EsT0FBQSxRQUFBLDZCQUFBO0dBQ0EsT0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGdCQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQTs7U0FFQTtNQUNBLFlBQUEsT0FBQSxjQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBOzs7O1FBSUE7S0FDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLEtBQUEsYUFBQSxHQUFBO1NBQ0EsSUFBQSxTQUFBLFVBQUEsTUFBQSxHQUFBO1NBQ0EsR0FBQSxDQUFBLE9BQUEsU0FBQTtVQUNBLE9BQUEsV0FBQTs7U0FFQSxPQUFBLFNBQUEsS0FBQTtTQUNBLE9BQUEsV0FBQTs7VUFFQTtPQUNBLEdBQUEsV0FBQSxLQUFBOztNQUVBLE9BQUEsUUFBQSwrQkFBQTtNQUNBLEdBQUEsUUFBQSxTQUFBOzs7Ozs7Ozs7O0FDbklBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDbEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDRCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7SUFHQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLEtBQUEsSUFBQSxJQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFlBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUE7TUFDQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUE7OztJQUdBLElBQUEsY0FBQSxVQUFBLE9BQUE7TUFDQSxNQUFBO01BQ0EsVUFBQSxJQUFBLEtBQUEsS0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsZUFBQTtNQUNBLE1BQUEsYUFBQSxVQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsZUFBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEVBQUE7TUFDQSxHQUFBLENBQUEsT0FBQSxRQUFBO09BQ0EsT0FBQTtNQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7UUFDQSxTQUFBO1FBQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7O0tBRUEsS0FBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQSxjQUFBO09BQ0EsSUFBQSxPQUFBLEtBQUEsWUFBQSxNQUFBO09BQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUEsS0FBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxjQUFBLFFBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7VUFHQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxJQUFBO09BQ0EsT0FBQSxVQUFBLEdBQUE7UUFDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7Ozs7O0lBT0EsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBOztNQUVBLElBQUEsQ0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsVUFBQSxFQUFBLE9BQUEsUUFBQTs7O0lBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUE7S0FDQSxTQUFBLFlBQUE7T0FDQSxVQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUE7O01BRUE7Ozs7Ozs7O0FDbEpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGlCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGFBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEscUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsaUJBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSx1QkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxtQkFBQSxZQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxTQUFBOzs7SUFHQSxRQUFBLFVBQUEsWUFBQTtLQUNBLFFBQUEsS0FBQSxRQUFBLGNBQUE7Ozs7SUFJQSxRQUFBLEdBQUEscUJBQUEsWUFBQTtLQUNBLE1BQUEsT0FBQTs7Ozs7O0lBTUEsU0FBQSxlQUFBO0tBQ0EsSUFBQSxPQUFBLFFBQUE7OztLQUdBLElBQUEsTUFBQSxXQUFBLFFBQUEsUUFBQTtNQUNBLE9BQUE7O0tBRUEsUUFBQSxjQUFBOzs7Ozs7Ozs7QUM5QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxVQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsV0FBQSxhQUFBLHdCQUFBO0lBQ0EseUJBQUEsVUFBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsYUFBQSxnQkFBQTtLQUNBLE9BQUE7O0lBRUEsaUJBQUEsTUFBQTtJQUNBLFlBQUEsVUFBQSxNQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxrQkFBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsTUFBQSxhQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsTUFBQSwrQkFBQSxNQUFBLGNBQUE7TUFDQSxPQUFBOzs7SUFHQSxjQUFBLFVBQUEsTUFBQTtLQUNBLElBQUEsQ0FBQSxvQkFBQSxLQUFBLE1BQUEsbUJBQUEsT0FBQSxlQUFBLFFBQUEsUUFBQSxDQUFBLEdBQUE7TUFDQSxPQUFBO1lBQ0E7TUFDQSxPQUFBLE1BQUEseUNBQUEsZ0JBQUE7O01BRUEsT0FBQTs7O0lBR0EsUUFBQSxLQUFBLFlBQUE7SUFDQSxRQUFBLEtBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQSxLQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsSUFBQSxNQUFBLE1BQUEsUUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQSxNQUFBOztLQUVBLFNBQUEsSUFBQTtLQUNBLE9BQUEsU0FBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLFVBQUEsU0FBQSxZQUFBLE9BQUE7T0FDQSxPQUFBLE1BQUEsT0FBQSxZQUFBO1FBQ0EsTUFBQSxPQUFBLElBQUEsT0FBQTtRQUNBLElBQUEsUUFBQSxTQUFBLE1BQUEsV0FBQTtTQUNBLE9BQUEsTUFBQSxXQUFBOzs7OztLQUtBLE9BQUEsTUFBQSxhQUFBLE1BQUE7Ozs7O0tBS0EsTUFBQSxPQUFBO0tBQ0EsT0FBQTs7Ozs7Ozs7QUMvREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsb0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFdBQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7S0FDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTs7Ozs7Ozs7QUNuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQSxRQUFBO0VBQ0EsT0FBQSxVQUFBO0VBQ0E7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0lBQ0EsR0FBQSxNQUFBLEVBQUE7S0FDQTs7SUFFQSxPQUFBOzs7RUFHQSxTQUFBLFNBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxhQUFBO0lBQ0EsTUFBQSxDQUFBO0tBQ0EsUUFBQTtNQUNBLEdBQUE7TUFDQSxHQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBOztJQUVBLE9BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQSxPQUFBLFFBQUE7O0tBRUEsT0FBQTtLQUNBLE9BQUEsT0FBQSxRQUFBOzs7Ozs7OztBQ2pDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5SEFBQSxVQUFBLFFBQUEsYUFBQSxnQkFBQSxlQUFBLFNBQUEsUUFBQSxvQkFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxZQUFBOztFQUVBLEdBQUEsT0FBQTs7RUFFQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxhQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsZUFBQSxPQUFBOztFQUVBLFNBQUEsVUFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsR0FBQSxjQUFBLE9BQUE7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsZ0JBQUEsWUFBQSxPQUFBLGlCQUFBO0dBQ0EsR0FBQSxhQUFBLGVBQUEsY0FBQSxDQUFBLEtBQUE7R0FDQSxHQUFBLGVBQUEsWUFBQSxPQUFBLGlCQUFBO0dBQ0EsR0FBQSxTQUFBLFlBQUEsT0FBQSxVQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGFBQUEsT0FBQTtHQUNBLE9BQUEsZUFBQSxHQUFBLEtBQUEsV0FBQSxTQUFBLE9BQUE7O0VBRUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7SUFDQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsOEJBQUE7S0FDQSxHQUFBLEtBQUEsVUFBQTtLQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7Ozs7O0VBTUEsU0FBQSxlQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsZUFBQTs7RUFFQSxTQUFBLFdBQUEsS0FBQTtHQUNBLGNBQUEsYUFBQSxXQUFBOzs7RUFHQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDN0VBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0Esa0JBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsR0FBQSxjQUFBLFNBQUEsRUFBQTtLQUNBLFFBQUEsU0FBQTtPQUNBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFlBQUE7Ozs7Ozs7Ozs7QUN2QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEscUJBQUEsVUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGlCQUFBOztFQUVBLFNBQUEsUUFBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLGNBQUEsY0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsR0FBQSxLQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLEtBQUE7O0VBRUEsU0FBQSxVQUFBLEtBQUE7R0FDQSxJQUFBLEtBQUEsU0FBQSxLQUFBLG1CQUFBLEtBQUEsZ0JBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7Ozs7O0FDckJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGNBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQTtJQUNBLFFBQUE7SUFDQSxRQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ25CQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxrQ0FBQSxTQUFBLFlBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGlCQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQTtHQUNBLFdBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLGFBQUE7OztFQUdBLEdBQUEsU0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBOztFQUVBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTs7OztFQUlBLFNBQUEsV0FBQSxJQUFBO0dBQ0EsR0FBQSxHQUFBLGVBQUEsSUFBQTtJQUNBLEdBQUEsY0FBQTs7T0FFQTtJQUNBLEdBQUEsY0FBQTs7OztFQUlBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsUUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxHQUFBLFlBQUE7O09BRUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsU0FBQSxDQUFBLEVBQUE7TUFDQSxHQUFBLFVBQUEsS0FBQTs7Ozs7O0VBTUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUEsR0FBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUEsT0FBQTtVQUNBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsS0FBQTs7O0VBR0EsU0FBQSxlQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQTs7R0FFQSxHQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7OztFQUlBLFNBQUEsU0FBQSxhQUFBLElBQUE7R0FDQSxZQUFBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsU0FBQSxLQUFBO01BQ0EsWUFBQSxPQUFBLGNBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxTQUFBO09BQ0EsR0FBQSxXQUFBLE9BQUEsR0FBQSxXQUFBLFFBQUEsTUFBQTs7O0lBR0EsR0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7O0FDeEZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTtJQUNBLFVBQUE7O0dBRUEsa0JBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsc0dBQUEsU0FBQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFFBQUEsYUFBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTs7RUFFQSxHQUFBLGNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxrQkFBQTtHQUNBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLFdBQUE7R0FDQSxVQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsbUJBQUEsR0FBQSxRQUFBLFFBQUE7R0FDQSxZQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsYUFBQSxHQUFBLFFBQUEsUUFBQTs7RUFFQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0E7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxTQUFBLFlBQUEsT0FBQSxVQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsT0FBQSxlQUFBOztHQUVBLEdBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLGVBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtLQUNBLEdBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQSw4QkFBQTtNQUNBLEdBQUEsS0FBQSxVQUFBO01BQ0EsR0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBO01BQ0EsZUFBQSxXQUFBO01BQ0EsT0FBQSxHQUFBLGdDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUE7Ozs7T0FJQTtJQUNBLFlBQUEsS0FBQSxTQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtLQUNBLEdBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQSw0QkFBQTtNQUNBLEdBQUEsS0FBQSxVQUFBO01BQ0EsR0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBO01BQ0EsZUFBQSxRQUFBO01BQ0EsT0FBQSxHQUFBLGdDQUFBLENBQUEsR0FBQSxTQUFBLElBQUEsS0FBQSxTQUFBOzs7Ozs7O0VBT0EsU0FBQSxZQUFBLE9BQUEsS0FBQTs7OztFQUlBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsVUFBQSxDQUFBLFFBQUEsT0FBQSxHQUFBLE1BQUEsR0FBQTs7SUFFQTs7Ozs7QUN6RkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsdUJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtLQUNBLE1BQUE7S0FDQSxPQUFBO0tBQ0EsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxFQUFBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTs7OztFQUlBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxNQUFBO0lBQ0EsVUFBQSxRQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7SUFDQSxHQUFBLFFBQUEsTUFBQTtLQUNBLFFBQUEsT0FBQSxHQUFBLFFBQUEsUUFBQTs7SUFFQSxRQUFBLElBQUEsVUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO0tBQ0EsTUFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxRQUFBOzs7SUFHQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEtBQUE7TUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUE7O0lBRUEsSUFBQSxRQUFBLEdBQUEsSUFBQTtNQUNBLEVBQUE7TUFDQSxPQUFBLENBQUEsR0FBQTtNQUNBLEdBQUEsU0FBQTtNQUNBLEdBQUEsWUFBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxXQUFBLElBQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO0lBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7S0FDQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO09BQ0EsS0FBQSxjQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBLE1BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQSxRQUFBLE1BQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxTQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxlQUFBLFFBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7TUFDQSxLQUFBLFNBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTs7S0FFQSxPQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQTtPQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7T0FDQSxLQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQTs7T0FFQSxHQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7T0FFQSxPQUFBOztPQUVBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7T0FDQSxLQUFBLE1BQUE7O0lBRUEsSUFBQSxTQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxZQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7OztJQUdBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxRQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxvQkFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUE7O0lBRUEsSUFBQSxhQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsU0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7TUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxRQUFBLE1BQUEsU0FBQTs7S0FFQSxJQUFBLEdBQUEsTUFBQSxhQUFBO01BQ0EsUUFBQSxFQUFBLE9BQUEsR0FBQSxNQUFBLE1BQUE7TUFDQSxNQUFBLE9BQUEsQ0FBQSxPQUFBOzs7S0FHQSxHQUFBLFNBQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxTQUFBLE1BQUE7TUFDQSxZQUFBLEtBQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O1NBRUE7TUFDQSxZQUFBLEtBQUEsU0FBQTs7S0FFQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7O0tBRUEsSUFBQSxRQUFBLE1BQUEsU0FBQTtNQUNBLFFBQUE7TUFDQSxRQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsR0FBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsSUFBQSxTQUFBLElBQUEsUUFBQSxXQUFBLFNBQUEsUUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQTtNQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsSUFBQSxRQUFBO2NBQ0EsQ0FBQSxTQUFBLFFBQUE7O0tBRUEsUUFBQSxjQUFBO0tBQ0EsUUFBQTs7OztJQUlBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEVBQUE7TUFDQTs7S0FFQSxRQUFBLE9BQUEsR0FBQSxRQUFBLEVBQUE7S0FDQSxXQUFBLElBQUEsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLElBQUEsRUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUE7S0FDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtNQUNBLFNBQUEsT0FBQTtRQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7UUFDQSxLQUFBLGNBQUEsTUFBQTtRQUNBLEtBQUEsZ0JBQUEsTUFBQTs7S0FFQSxLQUFBLE1BQUEsUUFBQSxVQUFBLFFBQUEsUUFBQSxJQUFBLEVBQUEsTUFBQTtLQUNBLE9BQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxHQUFBLFFBQUEsWUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7O1NBRUE7TUFDQSxZQUFBLEtBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsT0FBQSxRQUFBOztLQUVBLFVBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7S0FJQSxPQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtNQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUE7O01BRUEsTUFBQTtNQUNBLE1BQUE7TUFDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsTUFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO09BQ0EsTUFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO09BQ0EsR0FBQSxJQUFBLE9BQUEsUUFBQSxZQUFBLElBQUE7U0FDQSxZQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7U0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLElBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7O01BS0EsSUFBQSxHQUFBLE1BQUE7UUFDQSxPQUFBLENBQUEsS0FBQTtRQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsTUFBQTtNQUNBLE1BQUEsRUFBQTtTQUNBLE9BQUEsQ0FBQSxHQUFBO1NBQ0EsR0FBQSxTQUFBO1NBQ0EsR0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBLGVBQUEsS0FBQTtNQUNBLFFBQUEsT0FBQSxlQUFBLEtBQUEsVUFBQTs7T0FFQSxHQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7T0FFQSxPQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxHQUFBLElBQUEsT0FBQSxRQUFBLFlBQUEsSUFBQTtTQUNBLFlBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtTQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsSUFBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7OztBQzFSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLHFEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxNQUFBLFVBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxVQUFBLElBQUEsS0FBQSxHQUFBLFVBQUEsTUFBQSxXQUFBLElBQUEsU0FBQTtRQUNBO1lBQ0EsT0FBQSxFQUFBOztRQUVBLElBQUEsS0FBQSxHQUFBLFNBQUE7UUFDQSxNQUFBLE9BQUEsUUFBQTtRQUNBLE1BQUEsUUFBQSxLQUFBLElBQUEsS0FBQTs7O09BR0EsU0FBQSxVQUFBO1FBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7QUMvREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsd0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMkRBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBO0NBQ0EsTUFBQSxTQUFBO0tBQ0EsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBLEtBQUEsR0FBQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBOzs7UUFHQSxHQUFBLElBQUEsT0FBQSxVQUFBLEVBQUE7U0FDQSxNQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUE7O1lBRUE7U0FDQSxRQUFBLElBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDeEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLDhCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDZEQUFBLFVBQUEsUUFBQSxVQUFBLFFBQUEsY0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7S0FFQSxTQUFBO0tBQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7S0FDQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFNBQUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxRQUFBLElBQUE7TUFDQSxJQUFBLE9BQUEsTUFBQSxHQUFBLE1BQUEsR0FBQTtNQUNBLElBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUEsSUFBQTtPQUNBLGdCQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxVQUFBOzs7T0FHQSxPQUFBLFVBQUEsT0FBQTtRQUNBLFFBQUEsUUFBQSxNQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1NBRUEsSUFBQSxJQUFBO1VBQ0EsS0FBQTtVQUNBLE9BQUE7O1NBRUEsUUFBQSxRQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7V0FDQSxJQUFBLEtBQUEsV0FBQSxpQkFBQSx5QkFBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO1lBQ0EsSUFBQSxRQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUE7YUFDQSxRQUFBO2FBQ0EsT0FBQTs7WUFFQSxFQUFBLE9BQUEsS0FBQTtZQUNBLE9BQUEsS0FBQTs7OztTQUlBLElBQUEsWUFBQTtVQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsTUFBQSxLQUFBO1dBQ0EsSUFBQSxJQUFBLFVBQUEsR0FBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUEsUUFBQSxhQUFBO2FBQ0EsUUFBQSxLQUFBLE9BQUE7O1lBRUEsUUFBQSxLQUFBLEtBQUEsS0FBQTs7OztnQkFJQTs7VUFFQSxFQUFBLE9BQUE7O1VBRUEsYUFBQSxRQUFBOzs7Ozs7T0FNQSxrQkFBQSxVQUFBLE9BQUE7OztRQUdBLElBQUEsUUFBQSxNQUFBLE1BQUEsY0FBQTtRQUNBLElBQUEsWUFBQTtRQUNBLElBQUEsV0FBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUE7O1FBRUEsSUFBQSxTQUFBLFNBQUEsR0FBQTtTQUNBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxNQUFBO1NBQ0EsWUFBQTs7UUFFQSxJQUFBLFFBQUE7O1FBRUEsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxLQUFBO1NBQ0EsSUFBQSxTQUFBLElBQUE7VUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLFFBQUEsZUFBQSxLQUFBO1VBQ0EsSUFBQSxTQUFBLEdBQUEsUUFBQSxPQUFBLENBQUEsR0FBQTtXQUNBLFNBQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOztVQUVBLElBQUEsT0FBQSxTQUFBLEdBQUEsTUFBQTtVQUNBLElBQUEsS0FBQSxTQUFBLEdBQUE7V0FDQSxTQUFBLEtBQUE7V0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE1BQUEsS0FBQSxLQUFBO2FBQ0EsSUFBQSxJQUFBLEdBQUE7Y0FDQSxTQUFBLE1BQUE7O2FBRUEsU0FBQSxNQUFBLEtBQUE7Ozs7O1VBS0EsSUFBQSxTQUFBLEdBQUEsVUFBQSxHQUFBO1dBQ0EsTUFBQSxLQUFBOzs7O1FBSUEsSUFBQSxTQUFBLFVBQUEsTUFBQSxRQUFBO1NBQ0EsYUFBQTtTQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxhQUFBO1dBQ0EsUUFBQSxTQUFBLE1BQUE7O1VBRUEsUUFBQSxTQUFBLElBQUEsT0FBQTs7OztRQUlBLE9BQUEsU0FBQSxLQUFBLGFBQUEsTUFBQSxPQUFBOztPQUVBLE9BQUEsVUFBQSxLQUFBLE1BQUE7UUFDQSxhQUFBLE1BQUE7O09BRUEsVUFBQSxVQUFBLFNBQUE7O1FBRUEsYUFBQSxVQUFBOzs7UUFHQSxJQUFBLENBQUEsWUFBQTtTQUNBLFFBQUEsUUFBQSxhQUFBLGdCQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxVQUFBLENBQUEsS0FBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsWUFBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLGNBQUEsQ0FBQSxHQUFBO1dBQ0EsYUFBQSxnQkFBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxLQUFBLEtBQUEsV0FBQSxVQUFBLEdBQUE7V0FDQSxhQUFBLGFBQUE7OztlQUdBO1NBQ0EsUUFBQSxRQUFBLFNBQUEsVUFBQSxNQUFBLEtBQUE7VUFDQSxLQUFBLFNBQUE7VUFDQSxJQUFBLEtBQUEsaUJBQUEsZUFBQSxPQUFBLE9BQUEsYUFBQTtXQUNBLElBQUEsSUFBQTtZQUNBLEtBQUEsSUFBQTs7V0FFQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsUUFBQSxHQUFBO1lBQ0EsRUFBQSxZQUFBLEtBQUE7WUFDQSxJQUFBLE1BQUEsV0FBQSxTQUFBLEdBQUE7YUFDQSxJQUFBLE9BQUEsV0FBQSxpQkFBQSxRQUFBLFNBQUEsS0FBQSxPQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsU0FBQTtlQUNBLFFBQUE7O2NBRUE7Ozs7O1dBS0EsYUFBQSxRQUFBO1lBQ0EsTUFBQSxDQUFBO1lBQ0EsUUFBQSxLQUFBOzs7O1NBSUEsYUFBQSxZQUFBOztRQUVBLGFBQUE7UUFDQSxTQUFBLFVBQUE7U0FDQSxPQUFBLEtBQUEsYUFBQSxnQkFBQSxvQkFBQTtTQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xNQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxnQkFBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztLQUVBLFNBQUEsU0FBQSxFQUFBLEVBQUEsT0FBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFVBQUEsU0FBQSxXQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsSUFBQSxLQUFBLElBQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO2FBQ0EsS0FBQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsT0FBQTtPQUNBLEtBQUEsU0FBQTtPQUNBLE9BQUE7YUFDQSxLQUFBLGFBQUEsYUFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBO0lBQ0EsSUFBQSxVQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQSxPQUFBLElBQUE7UUFDQSxJQUFBLE9BQUEsR0FBQTtNQUNBO01BQ0EsWUFBQSxPQUFBLElBQUE7TUFDQSxZQUFBOzs7UUFHQSxJQUFBLE1BQUEsR0FBQTtNQUNBO01BQ0EsS0FBQTtNQUNBLE1BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBOzs7UUFHQSxJQUFBLEtBQUE7T0FDQSxNQUFBLE1BQUE7T0FDQSxVQUFBO09BQ0EsS0FBQTtPQUNBO09BQ0EsT0FBQSxRQUFBLEtBQUEsS0FBQTthQUNBLEtBQUEsU0FBQSxHQUFBLEVBQUEsS0FBQSxXQUFBO2FBQ0EsTUFBQSxRQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO2FBQ0EsR0FBQSxZQUFBLFdBQUEsR0FBQSxXQUFBO0lBQ0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUE7T0FDQSxLQUFBLEtBQUE7V0FDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTtXQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtXQUNBLEdBQUEsU0FBQTs7UUFFQSxHQUFBLFNBQUEsU0FBQSxHQUFBO1lBQ0EsT0FBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUEsYUFBQSxTQUFBO2lCQUNBLFVBQUEsS0FBQTs7O0lBR0EsSUFBQSxTQUFBLFFBQUEsS0FBQSxNQUFBO0lBQ0EsU0FBQSxXQUFBLEVBQUE7S0FDQSxNQUFBLFFBQUEsQ0FBQSxRQUFBLEVBQUEsS0FBQTs7UUFFQSxTQUFBLFVBQUEsRUFBQTs7TUFFQSxTQUFBLFFBQUEsS0FBQSxNQUFBO1lBQ0EsTUFBQSxhQUFBLENBQUEsRUFBQSxLQUFBO01BQ0EsTUFBQTs7O1FBR0EsU0FBQSxTQUFBLEVBQUE7O1lBRUEsTUFBQSxhQUFBO01BQ0EsTUFBQTs7OztRQUlBLFNBQUEsU0FBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxJQUFBLEVBQUE7O0lBRUEsU0FBQSxVQUFBLEdBQUE7WUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxFQUFBO1lBQ0EsT0FBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQTs7O0lBR0EsTUFBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsT0FBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxTQUFBO1FBQ0EsVUFBQSxLQUFBO0tBQ0EsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxTQUFBO1FBQ0EsVUFBQSxLQUFBOzs7Ozs7Ozs7QUNoSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxnQkFBQTs7R0FFQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxTQUFBO01BQ0EsS0FBQTtNQUNBLE9BQUE7TUFDQSxRQUFBO01BQ0EsTUFBQTs7S0FFQSxRQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUE7S0FDQSxTQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsUUFBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsR0FBQSxHQUFBLE1BQUE7O0lBRUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBO0lBQ0EsTUFBQSxFQUFBLE1BQUEsQ0FBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsT0FBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLE9BQUEsTUFBQTs7OztJQUlBLElBQUEsT0FBQSxJQUFBLFVBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxRQUFBLE9BQUEsS0FBQSxLQUFBLFNBQUE7O0lBRUEsSUFBQSxTQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBLFdBQUEsU0FBQSxHQUFBLFdBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7O01BRUEsS0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBLFdBQUEsVUFBQSxNQUFBLEVBQUEsRUFBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsRUFBQSxTQUFBLFdBQUEsR0FBQSxNQUFBLE1BQUEsT0FBQTs7Ozs7Ozs7Ozs7O0tBWUEsTUFBQSxRQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7OztJQVVBLElBQUEsWUFBQTtNQUNBLE9BQUE7O0lBRUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTtRQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxXQUFBOztNQUVBLEtBQUEsS0FBQSxDQUFBO01BQ0EsS0FBQSxTQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxPQUFBOztJQUVBLElBQUEsYUFBQTtNQUNBLE9BQUE7SUFDQSxXQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsT0FBQSxFQUFBOztNQUVBLEtBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxXQUFBOztNQUVBLEtBQUEsS0FBQSxTQUFBO01BQ0EsS0FBQSxTQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxRQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7OztJQUlBLFNBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtLQUNBLElBQUE7S0FDQSxTQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUE7S0FDQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQTtZQUNBO01BQ0EsVUFBQSxNQUFBLENBQUE7TUFDQSxVQUFBLE1BQUEsQ0FBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUE7S0FDQSxPQUFBOztJQUVBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTs7O01BR0EsVUFBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7UUFDQSxJQUFBLFVBQUEsV0FBQTtRQUNBLEdBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxHQUFBO1NBQ0EsVUFBQTs7UUFFQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsV0FBQSxTQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUE7O01BRUEsVUFBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxFQUFBLEdBQUE7UUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsRUFBQSxRQUFBLFNBQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLFVBQUEsR0FBQTtTQUNBLEtBQUEsZUFBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLEtBQUE7OztTQUdBLEtBQUEsT0FBQSxTQUFBLEdBQUEsRUFBQTtRQUNBLEVBQUEsUUFBQSxNQUFBLEtBQUEsR0FBQTs7Ozs7Ozs7Ozs7O0FDOUpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7O0FDaEJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtDQUFBLFVBQUEsUUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLEdBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLGlCQUFBO0dBQ0Esa0JBQUE7R0FDQSxlQUFBO0dBQ0EsaUJBQUE7R0FDQSxVQUFBOztFQUVBLEdBQUEsUUFBQTtHQUNBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE1BQUE7OztFQUdBOztFQUVBLFNBQUEsVUFBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxNQUFBLFFBQUEsTUFBQSxTQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztHQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtLQUNBLEtBQUE7S0FDQSxPQUFBO0tBQ0EsUUFBQTtLQUNBLE1BQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsWUFBQTtJQUNBLFlBQUE7OztJQUdBLG9CQUFBOztJQUVBLFFBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxHQUFBLE1BQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7OztHQUtBLElBQUEsR0FBQSxRQUFBLFVBQUEsTUFBQTtJQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLFFBQUEsSUFBQSxHQUFBO0dBQ0EsT0FBQSxHQUFBOztFQUVBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxHQUFBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7O0dBR0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxHQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxHQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOztHQUVBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsVUFBQSxRQUFBO0lBQ0EsR0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQTtHQUNBO0VBQ0EsT0FBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBO0dBQ0E7OztFQUdBLE9BQUEsT0FBQSxnQkFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7OztBQ2pJQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxrQkFBQSxDQUFBLGVBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsU0FBQTtRQUNBLElBQUEsU0FBQTs7UUFFQSxTQUFBLE1BQUEsSUFBQTtZQUNBLElBQUEsS0FBQSxHQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsQ0FBQSxJQUFBO2dCQUNBLEtBQUEsRUFBQTtnQkFDQSxHQUFBLEdBQUEsYUFBQSxxQkFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLENBQUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUEsTUFBQTs7WUFFQSxPQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQSxPQUFBLFVBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBO2dCQUNBLE1BQUEsWUFBQTtnQkFDQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBLE1BQUEsV0FBQSxRQUFBO3dCQUNBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxNQUFBLFdBQUE7b0JBQ0EsTUFBQTs7Ozs7UUFLQSxPQUFBO1lBQ0EsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBO29CQUNBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQTs4QkFDQSxlQUFBOzZDQUNBOzZDQUNBOzZDQUNBOzZDQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOztZQUVBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTs7b0JBRUEsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBLFNBQUEsZUFBQTswREFDQTswREFDQTswREFDQTswREFDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7Ozs7O0FDdEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDbEJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFVBQUEsUUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxZQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxZQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsV0FBQSxNQUFBO0lBQ0EsR0FBQSxLQUFBLFFBQUE7OztFQUdBLFNBQUEsY0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxZQUFBLE1BQUEsS0FBQSxPQUFBOztFQUVBLFNBQUEsWUFBQTtHQUNBLFlBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQSxLQUFBLFVBQUEsTUFBQTtJQUNBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsR0FBQSxjQUFBO0tBQ0EsR0FBQSxRQUFBO0lBQ0EsR0FBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUEsNEJBQUE7Ozs7Ozs7QUM1QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxZQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFdBQUE7RUFDQSxPQUFBLGlCQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLE9BQUEsYUFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSx1QkFBQSxTQUFBLFNBQUEsU0FBQTtJQUNBLElBQUEsWUFBQSxTQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUE7S0FDQTs7SUFFQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsT0FBQSxPQUFBLENBQUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUEsWUFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O0dBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBO0tBQ0EsT0FBQSxJQUFBOzs7R0FHQSxPQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsS0FBQSxXQUFBOztFQUVBLFNBQUEsV0FBQSxRQUFBO0dBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtLQUNBLE9BQUE7OztHQUdBLE9BQUEsS0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxVQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLE9BQUEsZ0JBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7OztHQUdBLE9BQUEsbUJBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7Ozs7O0VBS0EsU0FBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBOztNQUVBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsWUFBQTtNQUNBLFdBQUE7TUFDQSxvQkFBQTtNQUNBLHlCQUFBO01BQ0EsUUFBQSxDQUFBLEtBQUE7TUFDQSxPQUFBO09BQ0EsV0FBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLG1CQUFBOztNQUVBLFFBQUE7T0FDQSxZQUFBO09BQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBLE9BQUE7T0FDQSxhQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUE7OztJQUdBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTs7Ozs7O0FDdkpBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsWUFBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7S0FFQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGNBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBOzs7SUFHQSxJQUFBLE1BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxXQUFBOzs7Ozs7OztJQVFBLElBQUEsWUFBQSxHQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUE7O01BRUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7O0lBR0EsSUFBQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBOzs7SUFHQSxJQUFBLFFBQUEsVUFBQSxNQUFBLE9BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxLQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxLQUFBLEtBQUE7TUFDQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsV0FBQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxHQUFBLFNBQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFlBQUEsS0FBQSxRQUFBLE9BQUE7TUFDQSxNQUFBLGdCQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQTtPQUNBLE9BQUE7OztPQUdBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxFQUFBOztNQUVBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxTQUFBOztNQUVBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO09BQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtPQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtPQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO09BQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtPQUNBLFNBQUEsQ0FBQTtPQUNBLFNBQUE7T0FDQSxXQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtNQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOztNQUVBLEdBQUEsU0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsSUFBQTs7O0lBR0EsU0FBQSxNQUFBLEdBQUE7O0tBRUEsS0FBQTtPQUNBLFNBQUE7T0FDQSxVQUFBLEtBQUEsU0FBQTs7OztLQUlBLEtBQUEsTUFBQSxjQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsTUFBQSxNQUFBOztPQUVBO09BQ0EsU0FBQTtPQUNBLFVBQUEsZUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLEVBQUE7U0FDQSxPQUFBOzs7U0FHQSxPQUFBOzs7T0FHQSxVQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtTQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO1NBQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtTQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtTQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO1NBQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO1FBQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO1FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtTQUNBLFNBQUEsQ0FBQTtTQUNBLFNBQUE7U0FDQSxXQUFBO2VBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtRQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOzs7T0FHQSxNQUFBLGdCQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsSUFBQTs7T0FFQSxLQUFBLE9BQUEsVUFBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxXQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUE7OztLQUdBLE9BQUE7OztJQUdBLFNBQUEsU0FBQSxHQUFBOzs7S0FHQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLE9BQUE7Ozs7Ozs7Ozs7OztJQVlBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLEdBQUE7O0tBRUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsU0FBQSxLQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7Ozs7Ozs7QUN4UEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTtNQUNBLFlBQUE7T0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTtPQUNBLFlBQUE7T0FDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7O01BR0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsWUFBQTtPQUNBLGdCQUFBO09BQ0EsV0FBQTtPQUNBLGtCQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxhQUFBO09BQ0EsaUJBQUE7O09BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLFVBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFlBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsU0FBQSxLQUFBO0tBQ0EsWUFBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxNQUFBLFFBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBOztJQUVBLFNBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtJQUNBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsU0FBQSxPQUFBLEtBQUEsTUFBQSxjQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUNyRkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsWUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsUUFBQTtJQUNBLEtBQUE7SUFDQSxXQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGdDQUFBLFNBQUEsaUJBQUE7RUFDQSxJQUFBLFVBQUE7R0FDQSxXQUFBO0dBQ0EsTUFBQTtHQUNBLE1BQUE7R0FDQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsUUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBOztHQUVBLFFBQUE7R0FDQSxTQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsZ0JBQUEsUUFBQSxTQUFBLFNBQUEsT0FBQSxVQUFBLFFBQUEsWUFBQSxhQUFBO1FBQ0EsUUFBQSxPQUFBLFNBQUEsTUFBQSxHQUFBOzs7Ozs7Ozs7Ozs7O0FDM0JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBOztFQUVBLFNBQUEsVUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLGFBQUEsWUFBQTtJQUNBLEdBQUEsWUFBQTs7OztFQUlBLFNBQUEsV0FBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxlQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxPQUFBLEtBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsZ0JBQUEsT0FBQSxNQUFBLEtBQUE7R0FDQSxHQUFBLEdBQUEsUUFBQSxVQUFBO0lBQ0EsT0FBQSxHQUFBLE1BQUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLEtBQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsU0FBQSxVQUFBLEVBQUE7SUFDQSxHQUFBLFNBQUEsTUFBQSxLQUFBLEdBQUE7S0FDQSxRQUFBOzs7R0FHQSxHQUFBLFFBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxVQUFBLE9BQUEsT0FBQTs7T0FFQTtJQUNBLEdBQUEsVUFBQSxLQUFBOzs7RUFHQSxTQUFBLFlBQUEsTUFBQTs7R0FFQSxLQUFBLFdBQUE7R0FDQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxTQUFBLFNBQUE7SUFDQSxHQUFBLFNBQUEsTUFBQSxLQUFBLEdBQUE7S0FDQSxRQUFBOzs7R0FHQSxPQUFBOzs7Ozs7O0VBT0EsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7S0FDQSxRQUFBOztJQUVBLEdBQUEsQ0FBQSxNQUFBO0tBQ0EsU0FBQSxjQUFBOzs7O0dBSUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JGQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxPQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7QUNqQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUJBQUEsU0FBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLEtBQUEsVUFBQSxlQUFBLENBQUEsR0FBQSxLQUFBLFFBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtLQUNBLE1BQUEsU0FBQSxNQUFBLEdBQUEsTUFBQTs7Ozs7RUFLQSxTQUFBLGFBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxLQUFBO0dBQ0EsSUFBQSxPQUFBLENBQUEsTUFBQSxVQUFBLEdBQUEsTUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFVBQUEsR0FBQSxNQUFBO0tBQ0EsTUFBQSxTQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBLElBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUE7VUFDQTtJQUNBLEdBQUEsS0FBQSxVQUFBOztHQUVBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUEsS0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7Ozs7Ozs7QUFPQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ0ZCQW5ndWxhcicsJ2RuZExpc3RzJywnYW5ndWxhci5maWx0ZXInLCdhbmd1bGFyTW9tZW50JywnbmdTY3JvbGxiYXInLCdtZENvbG9yUGlja2VyJywnbmdBbmltYXRlJywndWkudHJlZScsJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsnYW5ndWxhci1jYWNoZScsJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAndG9hc3RyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnbmdNYXRlcmlhbCcsJ25nUGFwYVBhcnNlJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXHRcdC8vXHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbih2aWV3TmFtZSkge1xuXHRcdFx0cmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIZWFkZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge30sXG5cdFx0XHRcdFx0J21hcEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWFwJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTWFwQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlbWVudUAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2lkZW1lbnUnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTaWRlbWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaG9tZScsIHtcblx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaG9tZScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXInLCB7XG5cdFx0XHRcdHVybDogJy91c2VyJyxcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWVcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIubG9naW4nLCB7XG5cdFx0XHRcdHVybDogJy9sb2dpbicsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLnByb2ZpbGUnLCB7XG5cdFx0XHRcdHVybDogJy9teS1wcm9maWxlJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygndXNlcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0cHJvZmlsZTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy9teS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNeURhdGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubXlkYXRhLmVudHJ5Jywge1xuXHRcdFx0XHR1cmw6ICcvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhRW50cnlDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2VkaXRvcicsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljZXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHtcblx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdGxpbWl0OiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0eWxlczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRTdHlsZXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNhdGVnb3JpZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHRyZWU6IHRydWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJywge1xuXHRcdFx0XHR1cmw6ICcvaW5kaWNhdG9ycycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMuaW5kaWNhdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JpbmRpY2F0b3IuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JpbmRpY2F0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J2luZm8nOntcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21lbnUnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4ZWRpdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpemVzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy86aWQvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kZXg6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGVQYXJhbXMuaWQgPT0gMCkgcmV0dXJuIHt9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEl0ZW0oJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yaW5kaXplcy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnYWRkaXRpb25hbEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9ycy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluaWRjYXRvcnNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3IuZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzplbnRyeScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3Jvdydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycsIHtcblx0XHRcdFx0dXJsOiAnL2NhdGVnb3JpZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JjYXRlZ29yeS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlUGFyYW1zLmlkID09ICduZXcnKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7fTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3J5KCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUnLCB7XG5cdFx0XHRcdHVybDogJy9jcmVhdGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2ljJyxcblx0XHRcdFx0YXV0aDogdHJ1ZVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNoZWNrJywge1xuXHRcdFx0XHR1cmw6ICcvY2hlY2tpbmcnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleENoZWNrJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhDaGVjay9pbmRleENoZWNrU2lkZWJhci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleENoZWNrU2lkZWJhckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubWV0YScsIHtcblx0XHRcdFx0dXJsOiAnL2FkZGluZy1tZXRhLWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE1ldGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmZpbmFsJywge1xuXHRcdFx0XHR1cmw6ICcvZmluYWwnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleEZpbmFsJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubGlzdCcsIHtcblx0XHRcdFx0dXJsOiAnL2xpc3QnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmdWxsTGlzdCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Z1bGxMaXN0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihEYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4JykuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoQ2F0ZWdvcmllcygnJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3InLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpY2F0b3IvOmlkLzpuYW1lJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGljYXRvcjogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRpY2F0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JTaG93Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInLCB7XG5cdFx0XHRcdHVybDogJy86eWVhcicsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2RldGFpbHMnLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlUGFyYW1zLmlkLCAkc3RhdGVQYXJhbXMueWVhcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRpY2F0b3IvaW5kaWNhdG9yWWVhclRhYmxlLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvclllYXJUYWJsZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdHVybDogJy86aWQvOm5hbWUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9pbmZvLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gSW5kaXplc1NlcnZpY2UuZmV0Y2hEYXRhKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvdW50cmllczogZnVuY3Rpb24oQ291bnRyaWVzU2VydmljZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuaW5mbycsIHtcblx0XHRcdFx0dXJsOiAnL2luZm8nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluZm9DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGluZm8nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdHVybDogJy86aXRlbScsXG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdzZWxlY3RlZCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NlbGVjdGVkJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VsZWN0ZWRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdFx0XHRnZXRDb3VudHJ5OiBmdW5jdGlvbihEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgJHN0YXRlUGFyYW1zLml0ZW0pLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0dXJsOiAnL2NvbXBhcmUvOmNvdW50cmllcydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9jb25mbGljdCcsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXgnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb25zOiBmdW5jdGlvbihSZXN0YW5ndWxhcikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzL25hdGlvbnMnKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbmZsaWN0czogZnVuY3Rpb24oUmVzdGFuZ3VsYXIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NvbmZsaWN0cycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RzJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdsb2dvQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdHVybDogJy9uYXRpb24vOmlzbycsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRuYXRpb246IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvbmF0aW9ucy8nLCAkc3RhdGVQYXJhbXMuaXNvKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0bmF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RuYXRpb24nKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4LmRldGFpbHMnLCB7XG5cdFx0XHRcdHVybDogJy86aWQnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y29uZmxpY3Q6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvZXZlbnRzLycsICRzdGF0ZVBhcmFtcy5pZCkuZ2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGRldGFpbHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdGRldGFpbHMnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J2l0ZW1zLW1lbnVAJzoge30sXG5cdFx0XHRcdFx0J2xvZ29AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ28nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmltcG9ydCcsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0SW1wb3J0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RJbXBvcnQnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmltcG9ydGNzdicsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydGVyJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHBhZ2VOYW1lOiAnSW1wb3J0IENTVidcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2LCAkdGltZW91dCwgJGF1dGgsICRzdGF0ZSwgJGxvY2FsU3RvcmFnZSwgJHdpbmRvdywgbGVhZmxldERhdGEsIHRvYXN0cikge1xuXHRcdCRyb290U2NvcGUuc2lkZWJhck9wZW4gPSB0cnVlO1xuXHRcdCRyb290U2NvcGUubG9vc2VMYXlvdXQgPSAkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3IHx8IGZhbHNlO1xuXHRcdCRyb290U2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbihtZW51SWQpIHtcblx0XHRcdCRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcblx0XHR9XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG5cdFx0XHRpZiAodG9TdGF0ZS5hdXRoICYmICEkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1lvdXIgbm90IGFsbG93ZWQgdG8gZ28gdGhlcmUgYnVkZHkhJywgJ0FjY2VzcyBkZW5pZWQnKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0cmV0dXJuICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubGF5b3V0ID09IFwicm93XCIpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIHRvU3RhdGUudmlld3MgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnbWFpbkAnKSB8fCB0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdhZGRpdGlvbmFsQCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5tYWluVmlldyA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5tYWluVmlldyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdhZGRpdGlvbmFsQCcpKSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnaXRlbXMtbWVudUAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuaXRlbU1lbnUgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuaXRlbU1lbnUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnbG9nb0AnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubG9nb1ZpZXcgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubG9nb1ZpZXcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUuaXRlbU1lbnUgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5sb2dvVmlldyA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLm1haW5WaWV3ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ2NvbmZsaWN0JykgPiAtMSAmJiB0b1N0YXRlLm5hbWUgIT0gXCJhcHAuY29uZmxpY3QuaW1wb3J0XCIpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ub0hlYWRlciA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLm5vSGVhZGVyID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lID09ICdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJykge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnNob3dJdGVtcyA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnNob3dJdGVtcyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS5wcmV2aW91c1BhZ2UgPSB7XG5cdFx0XHRcdHN0YXRlOiBmcm9tU3RhdGUsXG5cdFx0XHRcdHBhcmFtczogZnJvbVBhcmFtc1xuXHRcdFx0fTtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLmNsb3NlKCk7XG5cblxuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKSB7XG5cblx0XHR9KTtcblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSkge1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHRcdCRtZFNpZGVuYXYoJ2xlZnRNZW51JykuY2xvc2UoKTtcblx0XHRcdH1cblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCkge1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0XHRtYXAuaW52YWxpZGF0ZVNpemUoKTtcblx0XHRcdFx0fSlcblx0XHRcdH0sIDEwMDApO1xuXHRcdH1cblx0XHQvKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihldikge1xuICAgIC8vIGF2b2lkcyBzY3JvbGxpbmcgd2hlbiB0aGUgZm9jdXNlZCBlbGVtZW50IGlzIGUuZy4gYW4gaW5wdXRcbiAgICBpZiAoXG4gICAgICAgICFkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHlcbiAgICApIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKHRydWUpO1xuICAgIH1cbn0pOyovXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKSB7XG5cdFx0Ly8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuXHRcdC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG5cdFx0JGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoJztcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9hdXRoL3NpZ251cCc7XG4gICAgJGF1dGhQcm92aWRlci51bmxpbmtVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC91bmxpbmsvJztcblx0XHQkYXV0aFByb3ZpZGVyLmZhY2Vib29rKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2ZhY2Vib29rJyxcblx0XHRcdGNsaWVudElkOiAnNzcxOTYxODMyOTEwMDcyJ1xuXHRcdH0pO1xuXHRcdCRhdXRoUHJvdmlkZXIuZ29vZ2xlKHtcblx0XHRcdHVybDogJy9hcGkvYXV0aGVudGljYXRlL2dvb2dsZScsXG5cdFx0XHRjbGllbnRJZDogJzI3NjYzNDUzNzQ0MC1jZ3R0MTRxajJlOGlucDB2cTVvcTliNDZrNzRqanMzZS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRsb2dQcm92aWRlcil7XG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKHtcblx0XHRcdFx0YWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCJcblx0XHRcdH0pXG5cdFx0XHQuc2V0RGVmYXVsdEh0dHBGaWVsZHMoe1xuXHRcdFx0XHRjYWNoZTogdHJ1ZVxuXHRcdFx0fSlcblx0XHRcdC5hZGRSZXNwb25zZUludGVyY2VwdG9yKGZ1bmN0aW9uKGRhdGEsIG9wZXJhdGlvbiwgd2hhdCwgdXJsLCByZXNwb25zZSwgZGVmZXJyZWQpIHtcblx0XHRcdFx0dmFyIGV4dHJhY3RlZERhdGE7XG5cdFx0XHRcdGV4dHJhY3RlZERhdGEgPSBkYXRhLmRhdGE7XG5cdFx0XHRcdGlmIChkYXRhLm1ldGEpIHtcblx0XHRcdFx0XHRleHRyYWN0ZWREYXRhLl9tZXRhID0gZGF0YS5tZXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkYXRhLmluY2x1ZGVkKSB7XG5cdFx0XHRcdFx0ZXh0cmFjdGVkRGF0YS5faW5jbHVkZWQgPSBkYXRhLmluY2x1ZGVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBleHRyYWN0ZWREYXRhO1xuXHRcdFx0fSk7XG5cdFx0LypcdC5zZXRFcnJvckludGVyY2VwdG9yKGZ1bmN0aW9uKHJlc3BvbnNlLCBkZWZlcnJlZCwgcmVzcG9uc2VIYW5kbGVyKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZXJycm8nKTtcblx0XHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMykge1xuXG4gICAgXHRcdHJldHVybiBmYWxzZTsgLy8gZXJyb3IgaGFuZGxlZFxuICAgIFx0fVxuXG4gICAgXHRyZXR1cm4gdHJ1ZTsgLy8gZXJyb3Igbm90IGhhbmRsZWRcblx0XHR9KTsqL1xuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyLCRtZEdlc3R1cmVQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG4vKlx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdsaWdodC1ibHVlJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnYmx1ZXInKTsqL1xuXHRcdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2luZGlnbycsIHtcblx0XHRcdCc1MDAnOiAnIzAwNmJiOScsXG5cdFx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuXHRcdH0pO1xuXHRcdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnYmx1ZXInKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXG5cdFx0ICRtZEdlc3R1cmVQcm92aWRlci5za2lwQ2xpY2tIaWphY2soKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKHRvYXN0ckNvbmZpZyl7XG4gICAgICAgIC8vXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgIGF1dG9EaXNtaXNzOiB0cnVlLFxuICAgICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgICBtYXhPcGVuZWQ6IDIsXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LWJvdHRvbS1yaWdodCcsXG4gICAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHByZXZlbnRPcGVuRHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgcHJvZ3Jlc3NCYXI6dHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcignZmluZGJ5bmFtZScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBuYW1lLCBmaWVsZCkge1xuXHRcdFx0Ly9cbiAgICAgIHZhciBmb3VuZHMgPSBbXTtcblx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0bGVuID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpbnB1dFtpXVtmaWVsZF0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuXHRcdFx0XHRcdCBmb3VuZHMucHVzaChpbnB1dFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3VuZHM7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICduZXdsaW5lJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB0ZXh0ICl7XG4gICAgICAgICAgICAvL1xuICAgIFxuICAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyhcXFxccik/XFxcXG4vZywgJzxiciAvPjxiciAvPicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ09yZGVyT2JqZWN0QnknLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgYXR0cmlidXRlKSB7XG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG5cblx0XHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgb2JqZWN0S2V5IGluIGlucHV0KSB7XG5cdFx0XHRcdGFycmF5LnB1c2goaW5wdXRbb2JqZWN0S2V5XSk7XG5cdFx0XHR9XG5cblx0XHRcdGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0YSA9IHBhcnNlSW50KGFbYXR0cmlidXRlXSk7XG5cdFx0XHRcdGIgPSBwYXJzZUludChiW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRyZXR1cm4gYSAtIGI7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhcnJheTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdwcm9wZXJ0eScsIHByb3BlcnR5KTtcblx0ZnVuY3Rpb24gcHJvcGVydHkoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChhcnJheSwgeWVhcl9maWVsZCwgdmFsdWUpIHtcblxuICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xuXG4gICAgICAgIGlmKGFycmF5W2ldLmRhdGFbeWVhcl9maWVsZF0gPT0gdmFsdWUpe1xuICAgICAgICAgIGl0ZW1zLnB1c2goYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdDb250ZW50U2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JJdGVtKGxpc3QsaWQpe1xuXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdFx0XHRpZihpdGVtLmlkID09IGlkKXtcblx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gc2VhcmNoRm9ySXRlbShpdGVtLmNoaWxkcmVuLCBpZCk7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29udGVudDoge1xuXHRcdFx0XHRpbmRpY2F0b3JzOiBbXSxcblx0XHRcdFx0aW5kaWNhdG9yOiB7fSxcblx0XHRcdFx0ZGF0YTogW10sXG5cdFx0XHRcdGNhdGVnb3JpZXM6IFtdLFxuXHRcdFx0XHRjYXRlZ29yeToge30sXG5cdFx0XHRcdHN0eWxlczogW10sXG5cdFx0XHRcdGluZm9ncmFwaGljczogW10sXG5cdFx0XHRcdGluZGljZXM6W11cblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2luZGl6ZXMnKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycycsIGZpbHRlcikuJG9iamVjdFxuXHRcdFx0fSxcblx0XHRcdGZldGNoQ2F0ZWdvcmllczogZnVuY3Rpb24oZmlsdGVyLCB3aXRob3V0U2F2ZSkge1xuXHRcdFx0XHRpZih3aXRob3V0U2F2ZSl7XG5cdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldEFsbCgnY2F0ZWdvcmllcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3JpZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2NhdGVnb3JpZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hTdHlsZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljZXM6IGZ1bmN0aW9uKGZpbHRlcil7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNlcyhmaWx0ZXIpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNlcztcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbihmaWx0ZXIsIHdpdGhvdXRTYXZlKSB7XG5cdFx0XHRcdGlmKHdpdGhvdXRTYXZlKXtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaENhdGVnb3JpZXMoZmlsdGVyLCB3aXRob3V0U2F2ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hDYXRlZ29yaWVzKGZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yaWVzO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljYXRvcnMoKTtcblxuXHRcdFx0fSxcblx0XHRcdGdldFN0eWxlczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuc3R5bGVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hTdHlsZXMoZmlsdGVyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LnN0eWxlcztcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9yc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2F0b3IoaWQpO1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvciA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kaWNhdG9ycy8nICsgaWQpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3JQcm9taXNlOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzJyxpZCk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaWQsIHllYXIpIHtcblx0XHRcdFx0aWYgKHllYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhLycgKyB5ZWFyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhJyk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdC8qXHRpZih0aGlzLmNvbnRlbnQuaW5kaWNlcy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHQgdGhpcy5jb250ZW50LmRhdGEgPSBzZWFyY2hGb3JJdGVtKHRoaXMuY29udGVudC5pbmRpY2VzLCBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXsqL1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJywgaWQpXG5cdFx0XHRcdC8vfVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUNvbnRlbnQ6ZnVuY3Rpb24oaWQsIGxpc3Qpe1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcblx0XHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSB0aGF0LnJlbW92ZUNvbnRlbnQoaWQsIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdGZpbmRDb250ZW50OmZ1bmN0aW9uKGlkLCBsaXN0KXtcblx0XHRcdFx0dmFyIGZvdW5kID0gbnVsbDtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaWQpe1xuXHRcdFx0XHRcdFx0Zm91bmQgPSBlbnRyeTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4gJiYgZW50cnkuY2hpbGRyZW4ubGVuZ3RoICYmICFmb3VuZCl7XG5cdFx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gdGhhdC5maW5kQ29udGVudChpZCwgZW50cnkuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdFx0Zm91bmQgPSBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdFx0fSxcblx0XHRcdGFkZEl0ZW06IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR0aGlzLmNvbnRlbnQuaW5kaWNlcy5wdXNoKGl0ZW0pXG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlSXRlbTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNvbnRlbnQoaWQsIHRoaXMuY29udGVudC5pbmRpY2VzKTtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLnJlbW92ZSgnaW5kZXgvJywgaWQpO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUl0ZW06IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2YXIgZW50cnkgPSB0aGlzLmZpbmRDb250ZW50KGl0ZW0uaWQsIHRoaXMuY29udGVudC5pbmRpY2VzKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZW50cnksIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gZW50cnkgPSBpdGVtO1xuXHRcdFx0fSxcblx0XHRcdGdldENhdGVnb3J5OiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmluZENvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3J5ID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdjYXRlZ29yaWVzLycgKyBpZCkuJG9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUNhdGVnb3J5OiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQ29udGVudChpZCwgdGhpcy5jb250ZW50LmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UucmVtb3ZlKCdjYXRlZ29yaWVzLycsIGlkKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdDb3VudHJpZXNTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvdW50cmllczogW10sXG4gICAgICAgICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvaXNvcycpLiRvYmplY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoIXRoaXMuY291bnRyaWVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdEYXRhU2VydmljZScsIERhdGFTZXJ2aWNlKTtcbiAgICBEYXRhU2VydmljZS4kaW5qZWN0ID0gWydSZXN0YW5ndWxhcicsJ3RvYXN0ciddO1xuXG4gICAgZnVuY3Rpb24gRGF0YVNlcnZpY2UoUmVzdGFuZ3VsYXIsIHRvYXN0cil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0QWxsOiBnZXRBbGwsXG4gICAgICAgICAgZ2V0T25lOiBnZXRPbmUsXG4gICAgICAgICAgcG9zdDogcG9zdCxcbiAgICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICByZW1vdmU6IHJlbW92ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbChyb3V0ZSwgZmlsdGVyKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkuZ2V0TGlzdChmaWx0ZXIpO1xuICAgICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLnN0YXR1c1RleHQsICdDb25uZWN0aW9uIEVycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9uZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5nZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwb3N0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucG9zdChkYXRhKTtcbiAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLmRhdGEuZXJyb3IsICdTYXZpbmcgZmFpbGVkJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcHV0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHJvdXRlLCBpZCwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLnB1dChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdFcnJvckNoZWNrZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tNeURhdGEoZGF0YSkge1xuICAgIFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcbiAgICBcdFx0XHRpZiAodm0uZGF0YS5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgXHRcdFx0XHRcdFx0dmFyIGZvdW5kID0gMDtcbiAgICBcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5tZXRhLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuICAgIFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLmNvbHVtbiA9PSBmaWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG4gICAgXHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGZvdW5kID49IHZtLmRhdGFbMF0ubWV0YS5maWVsZHMubGVuZ3RoIC0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcy5wdXNoKGVudHJ5KTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdGlmICh2bS5leHRlbmRpbmdDaG9pY2VzLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5tZXRhLnllYXIgPSB2bS5kYXRhWzBdLmRhdGFbMF1bdm0ubWV0YS55ZWFyX2ZpZWxkXTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9XG4gICAgICAgICAgcmV0dXJuIGV4dGVuZGVkQ2hvaWNlcztcbiAgICBcdFx0fVxuXG4gICAgXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSkge1xuICAgIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrKSB7XG4gICAgXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuICAgIFx0XHRcdFx0XHRcdGlmICggaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVswXVtrXSA9IG51bGw7XG4gICAgXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdGlmICghcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdHZhciBlcnJvciA9IHtcbiAgICBcdFx0XHRcdFx0XHR0eXBlOiBcIjJcIixcbiAgICBcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG4gICAgXHRcdFx0XHRcdFx0dmFsdWU6IHJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcbiAgICBcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkLFxuICAgIFx0XHRcdFx0XHRcdHJvdzoga2V5XG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMikge1xuICAgIFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcbiAgICBcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuXG4gICAgXHRcdGZ1bmN0aW9uIGZldGNoSXNvKCkge1xuICAgIFx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBJU08gZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdGlmICghdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0aWYgKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuXG4gICAgXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcbiAgICBcdFx0XHR2YXIgZW50cmllcyA9IFtdO1xuICAgIFx0XHRcdHZhciBpc29DaGVjayA9IDA7XG4gICAgXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuICAgIFx0XHRcdFx0aWYgKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0c3dpdGNoIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9ICdDYXBlIFZlcmRlJztcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJEZW1vY3JhdGljIFBlb3BsZSdzIFJlcHVibGljIG9mIEtvcmVhXCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkl2b3J5IENvYXN0XCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibGljXCI7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGRlZmF1bHQ6XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuICAgIFx0XHRcdFx0XHRpc286IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgXHRcdFx0XHRcdG5hbWU6IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdXG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHR2YXIgaXNvVHlwZSA9IGlzb0NoZWNrID49IChlbnRyaWVzLmxlbmd0aCAvIDIpID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG4gICAgXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY291bnRyaWVzL2J5SXNvTmFtZXMnLCB7XG4gICAgXHRcdFx0XHRkYXRhOiBlbnRyaWVzLFxuICAgIFx0XHRcdFx0aXNvOiBpc29UeXBlXG4gICAgXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpIHtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5kYXRhLmxlbmd0aCA+IDEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0dmFyIHRvU2VsZWN0ID0ge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuICAgIFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGFbMF0gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2codm0uZGF0YVtrXSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIzXCIsXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkNvdWxkIG5vdCBsb2NhdGUgYSB2YWxpZCBpc28gbmFtZSFcIixcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRJc29FcnJvcihlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHR2bS5pc29fY2hlY2tlZCA9IHRydWU7XG4gICAgXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdzZWxlY3Rpc29mZXRjaGVycycpO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGZpZWxkIHNlbGVjdGlvbnMnLCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuICAgIFx0XHRcdH0pO1xuXG4gICAgXHRcdH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjaGVja015RGF0YTogY2hlY2tNeURhdGFcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSWNvbnNTZXJ2aWNlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHVuaWNvZGVzID0ge1xuICAgICAgICAgICdlbXB0eSc6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhZ3Jhcic6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhbmNob3InOiBcIlxcdWU2MDFcIixcbiAgICAgICAgICAnYnV0dGVyZmx5JzogXCJcXHVlNjAyXCIsXG4gICAgICAgICAgJ2VuZXJneSc6XCJcXHVlNjAzXCIsXG4gICAgICAgICAgJ3NpbmsnOiBcIlxcdWU2MDRcIixcbiAgICAgICAgICAnbWFuJzogXCJcXHVlNjA1XCIsXG4gICAgICAgICAgJ2ZhYnJpYyc6IFwiXFx1ZTYwNlwiLFxuICAgICAgICAgICd0cmVlJzpcIlxcdWU2MDdcIixcbiAgICAgICAgICAnd2F0ZXInOlwiXFx1ZTYwOFwiXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRVbmljb2RlOiBmdW5jdGlvbihpY29uKXtcbiAgICAgICAgICAgIHJldHVybiB1bmljb2Rlc1tpY29uXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExpc3Q6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB1bmljb2RlcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0luZGV4U2VydmljZScsIGZ1bmN0aW9uKENhY2hlRmFjdG9yeSwkc3RhdGUpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgc2VydmljZURhdGEgPSB7XG4gICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHllYXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kaWNhdG9yczp7fSxcbiAgICAgICAgICAgIHRvU2VsZWN0OltdXG4gICAgICAgIH0sIHN0b3JhZ2UsIGltcG9ydENhY2hlLCBpbmRpY2F0b3I7XG5cbiAgICAgICAgaWYgKCFDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpIHtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeSgnaW1wb3J0RGF0YScsIHtcbiAgICAgICAgICAgIGNhY2hlRmx1c2hJbnRlcnZhbDogNjAgKiA2MCAqIDEwMDAsIC8vIFRoaXMgY2FjaGUgd2lsbCBjbGVhciBpdHNlbGYgZXZlcnkgaG91ci5cbiAgICAgICAgICAgIGRlbGV0ZU9uRXhwaXJlOiAnYWdncmVzc2l2ZScsIC8vIEl0ZW1zIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoaXMgY2FjaGUgcmlnaHQgd2hlbiB0aGV5IGV4cGlyZS5cbiAgICAgICAgICAgIHN0b3JhZ2VNb2RlOiAnbG9jYWxTdG9yYWdlJyAvLyBUaGlzIGNhY2hlIHdpbGwgdXNlIGBsb2NhbFN0b3JhZ2VgLlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpO1xuICAgICAgICAgIHN0b3JhZ2UgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xlYXI6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgICAgaWYoQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKXtcbiAgICAgICAgICAgICAgICBpbXBvcnRDYWNoZS5yZW1vdmUoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b1NlbGVjdDpbXSxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOnt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkRGF0YTpmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJbmRpY2F0b3I6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnMucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZFRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSXNvRXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3ZlVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VydmljZURhdGEudG9TZWxlY3QuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA+IC0xID8gc2VydmljZURhdGEudG9TZWxlY3Quc3BsaWNlKGluZGV4LCAxKSA6IGZhbHNlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJc29GaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldENvdW50cnlGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRZZWFyRmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS55ZWFyX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycyA9IGVycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFRvTG9jYWxTdG9yYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZXJ2aWNlRGF0YSk7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUucHV0KCdkYXRhVG9JbXBvcnQnLHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEluZGljYXRvcjogZnVuY3Rpb24oa2V5LCBpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0QWN0aXZlSW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1tpdGVtLmNvbHVtbl9uYW1lXSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGcm9tTG9jYWxTdG9yYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZ1bGxEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldE1ldGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0ZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEVycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Rmlyc3RFbnRyeTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhWzBdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YVNpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjdGl2ZUluZGljYXRvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3I7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldEluZGljYXRvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IG51bGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VJc29FcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VFcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QgPSBbXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0TG9jYWxTdG9yYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKXtcbiAgICAgICAgICAgICAgICBpbXBvcnRDYWNoZS5yZW1vdmUoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgICAgICBpc29fZXJyb3JzOltdLFxuICAgICAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b1NlbGVjdDpbXSxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOnt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0luZGl6ZXNTZXJ2aWNlJywgZnVuY3Rpb24gKERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5kZXg6IHtcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXJlOiBudWxsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHByb21pc2VzOiB7XG5cdFx0XHRcdFx0ZGF0YTogbnVsbCxcblx0XHRcdFx0XHRzdHJ1Y3R1cjogbnVsbFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hEYXRhOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0XHR0aGlzLmluZGV4LnByb21pc2VzLmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4LycgKyBpbmRleCArICcveWVhci9sYXRlc3QnKTtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycgKyBpbmRleCArICcvc3RydWN0dXJlJyk7XG5cdFx0XHRcdHRoaXMuaW5kZXguZGF0YS5kYXRhID0gdGhpcy5pbmRleC5wcm9taXNlcy5kYXRhLiRvYmplY3Q7XG5cdFx0XHRcdHRoaXMuaW5kZXguZGF0YS5zdHJ1Y3R1cmUgPSB0aGlzLmluZGV4LnByb21pc2VzLnN0cnVjdHVyZS4kb2JqZWN0O1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleDtcblx0XHRcdH0sXG5cdFx0XHRnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuZGF0YTtcblx0XHRcdH0sXG5cdFx0XHRnZXRTdHJ1Y3R1cmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXguZGF0YS5zdHJ1Y3R1cmU7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YVByb21pc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YTtcblx0XHRcdH0sXG5cdFx0XHRnZXRTdHJ1Y3R1cmVQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLnN0cnVjdHVyZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdSZWN1cnNpb25IZWxwZXInLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcblx0XHRcdFx0Ly9cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBNYW51YWxseSBjb21waWxlcyB0aGUgZWxlbWVudCwgZml4aW5nIHRoZSByZWN1cnNpb24gbG9vcC5cblx0XHRcdFx0XHQgKiBAcGFyYW0gZWxlbWVudFxuXHRcdFx0XHRcdCAqIEBwYXJhbSBbbGlua10gQSBwb3N0LWxpbmsgZnVuY3Rpb24sIG9yIGFuIG9iamVjdCB3aXRoIGZ1bmN0aW9uKHMpIHJlZ2lzdGVyZWQgdmlhIHByZSBhbmQgcG9zdCBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRcdCAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBsaW5raW5nIGZ1bmN0aW9ucy5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRjb21waWxlOiBmdW5jdGlvbiAoZWxlbWVudCwgbGluaykge1xuXHRcdFx0XHRcdFx0Ly8gTm9ybWFsaXplIHRoZSBsaW5rIHBhcmFtZXRlclxuXHRcdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihsaW5rKSkge1xuXHRcdFx0XHRcdFx0XHRsaW5rID0ge1xuXHRcdFx0XHRcdFx0XHRcdHBvc3Q6IGxpbmtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gQnJlYWsgdGhlIHJlY3Vyc2lvbiBsb29wIGJ5IHJlbW92aW5nIHRoZSBjb250ZW50c1xuXHRcdFx0XHRcdFx0dmFyIGNvbnRlbnRzID0gZWxlbWVudC5jb250ZW50cygpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0dmFyIGNvbXBpbGVkQ29udGVudHM7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRwcmU6IChsaW5rICYmIGxpbmsucHJlKSA/IGxpbmsucHJlIDogbnVsbCxcblx0XHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHRcdCAqIENvbXBpbGVzIGFuZCByZS1hZGRzIHRoZSBjb250ZW50c1xuXHRcdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdFx0cG9zdDogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ29tcGlsZSB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNvbXBpbGVkQ29udGVudHMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbXBpbGVkQ29udGVudHMgPSAkY29tcGlsZShjb250ZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdC8vIFJlLWFkZCB0aGUgY29tcGlsZWQgY29udGVudHMgdG8gdGhlIGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHRjb21waWxlZENvbnRlbnRzKHNjb3BlLCBmdW5jdGlvbiAoY2xvbmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIENhbGwgdGhlIHBvc3QtbGlua2luZyBmdW5jdGlvbiwgaWYgYW55XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxpbmsgJiYgbGluay5wb3N0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsaW5rLnBvc3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0fSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyOntcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteURhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VyLmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG15UHJvZmlsZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlGcmllbmRzOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdWZWN0b3JsYXllclNlcnZpY2UnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHZhciB0aGF0ID0gdGhpcywgX3NlbGYgPSB0aGlzO1xuXHRcdHJldHVybiB7XG5cdFx0XHRjYW52YXM6IGZhbHNlLFxuXHRcdFx0cGFsZXR0ZTogW10sXG5cdFx0XHRjdHg6ICcnLFxuXHRcdFx0a2V5czoge1xuXHRcdFx0XHRtYXpwZW46ICd2ZWN0b3ItdGlsZXMtUTNfT3M1dycsXG5cdFx0XHRcdG1hcGJveDogJ3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJ1xuXHRcdFx0fSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bGF5ZXI6ICcnLFxuXHRcdFx0XHRuYW1lOiAnY291bnRyaWVzX2JpZycsXG5cdFx0XHRcdGJhc2VDb2xvcjogJyMwNmE5OWMnLFxuXHRcdFx0XHRpc28zOiAnYWRtMF9hMycsXG5cdFx0XHRcdGlzbzI6ICdpc29fYTInLFxuXHRcdFx0XHRpc286ICdpc29fYTInLFxuXHRcdFx0XHRmaWVsZHM6IFwiaWQsYWRtaW4sYWRtMF9hMyx3Yl9hMyxzdV9hMyxpc29fYTMsaXNvX2EyLG5hbWUsbmFtZV9sb25nXCIsXG5cdFx0XHRcdGZpZWxkOidzY29yZSdcblx0XHRcdH0sXG5cdFx0XHRtYXA6IHtcblx0XHRcdFx0ZGF0YTogW10sXG5cdFx0XHRcdGN1cnJlbnQ6IFtdLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6IFtdLFxuXHRcdFx0XHRzdHlsZTogW11cblx0XHRcdH0sXG5cdFx0XHRtYXBMYXllcjogbnVsbCxcblx0XHRcdHNldE1hcDogZnVuY3Rpb24obWFwKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFwTGF5ZXIgPSBtYXA7XG5cdFx0XHR9LFxuXHRcdFx0c2V0TGF5ZXI6IGZ1bmN0aW9uKGwpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5sYXllciA9IGw7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TGF5ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmxheWVyO1xuXHRcdFx0fSxcblx0XHRcdGdldE5hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLm5hbWU7XG5cdFx0XHR9LFxuXHRcdFx0ZmllbGRzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5maWVsZHM7XG5cdFx0XHR9LFxuXHRcdFx0aXNvOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5pc287XG5cdFx0XHR9LFxuXHRcdFx0aXNvMzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvMztcblx0XHRcdH0sXG5cdFx0XHRpc28yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5pc28yO1xuXHRcdFx0fSxcblx0XHRcdGNyZWF0ZUNhbnZhczogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSAyODA7XG5cdFx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0XHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHRcdH0sXG5cdFx0XHRjcmVhdGVGaXhlZENhbnZhczogZnVuY3Rpb24oY29sb3JSYW5nZSl7XG5cblx0XHRcdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSAyODA7XG5cdFx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0XHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjb2xvclJhbmdlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSAvIChjb2xvclJhbmdlLmxlbmd0aCAtMSkgKiBpLCBjb2xvclJhbmdlW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVGaXhlZENhbnZhczogZnVuY3Rpb24oY29sb3JSYW5nZSkge1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNvbG9yUmFuZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxIC8gKGNvbG9yUmFuZ2UubGVuZ3RoIC0xKSAqIGksIGNvbG9yUmFuZ2VbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHRcdH0sXG5cdFx0XHRzZXRCYXNlQ29sb3I6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuYmFzZUNvbG9yID0gY29sb3I7XG5cdFx0XHR9LFxuXHRcdC8qXHRzZXRTdHlsZTogZnVuY3Rpb24oc3R5bGUpIHtcblx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLnNldFN0eWxlKHN0eWxlKVxuXHRcdFx0fSwqL1xuXHRcdFx0Y291bnRyeUNsaWNrOiBmdW5jdGlvbihjbGlja0Z1bmN0aW9uKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5vcHRpb25zLm9uQ2xpY2sgPSBjbGlja0Z1bmN0aW9uO1xuXHRcdFx0XHR9KVxuXG5cdFx0XHR9LFxuXHRcdFx0Z2V0Q29sb3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhbGV0dGVbdmFsdWVdO1xuXHRcdFx0fSxcblx0XHRcdHNldFN0eWxlOiBmdW5jdGlvbihzdHlsZSl7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1hcC5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0fSxcblx0XHRcdHNldERhdGE6IGZ1bmN0aW9uKGRhdGEsIGNvbG9yLCBkcmF3SXQpIHtcblx0XHRcdFx0dGhpcy5tYXAuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdGlmICh0eXBlb2YgY29sb3IgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdHRoaXMuZGF0YS5iYXNlQ29sb3IgPSBjb2xvcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXRoaXMuY2FudmFzKSB7XG5cdFx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5iYXNlQ29sb3IgPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRcdFx0dGhpcy5jcmVhdGVDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZUZpeGVkQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmJhc2VDb2xvciA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUNhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRml4ZWRDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkcmF3SXQpIHtcblx0XHRcdFx0XHR0aGlzLnBhaW50Q291bnRyaWVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRnZXROYXRpb25CeUlzbzogZnVuY3Rpb24oaXNvLCBsaXN0KSB7XG5cdFx0XHRcdGlmKHR5cGVvZiBsaXN0ICE9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRpZiAobGlzdC5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0aWYgKHRoaXMubWFwLmRhdGEubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMubWFwLmRhdGEsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdFx0fSxcblx0XHRcdGdldE5hdGlvbkJ5TmFtZTogZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0XHRpZiAodGhpcy5tYXAuZGF0YS5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHBhaW50Q291bnRyaWVzOiBmdW5jdGlvbihzdHlsZSwgY2xpY2ssIG11dGV4KSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHN0eWxlICE9IFwidW5kZWZpbmVkXCIgJiYgc3R5bGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLnNldFN0eWxlKHN0eWxlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLnNldFN0eWxlKHRoYXQubWFwLnN0eWxlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBjbGljayAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIub3B0aW9ucy5vbkNsaWNrID0gY2xpY2tcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRyZXNldFNlbGVjdGVkOiBmdW5jdGlvbihpc28pe1xuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmxheWVyLmxheWVycyAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5kYXRhLmxheWVyLmxheWVyc1t0aGlzLmRhdGEubmFtZSsnX2dlb20nXS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSwga2V5KXtcblx0XHRcdFx0XHRcdGlmKGlzbyl7XG5cdFx0XHRcdFx0XHRcdGlmKGtleSAhPSBpc28pXG5cdFx0XHRcdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9LFxuXHRcdFx0c2V0U2VsZWN0ZWRGZWF0dXJlOmZ1bmN0aW9uKGlzbywgc2VsZWN0ZWQpe1xuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmxheWVyLmxheWVyc1t0aGlzLmRhdGEubmFtZSsnX2dlb20nXS5mZWF0dXJlc1tpc29dID09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhpc28pO1xuXHRcdFx0XHRcdC8vZGVidWdnZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIubGF5ZXJzW3RoaXMuZGF0YS5uYW1lKydfZ2VvbSddLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHR9LFxuXHRcdFx0cmVkcmF3OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoaXMuZGF0YS5sYXllci5yZWRyYXcoKTtcblx0XHRcdH0sXG5cdFx0XHQvL0ZVTEwgVE8gRE9cblx0XHRcdGNvdW50cmllc1N0eWxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdGRlYnVnZ2VyO1xuXHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t0aGF0LmRhdGEuaXNvMl07XG5cdFx0XHRcdHZhciBuYXRpb24gPSB0aGF0LmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHRcdHZhciBmaWVsZCA9IHRoYXQuZGF0YS5maWVsZDtcblx0XHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpb25bZmllbGRdICE9IG51bGwpe1xuXHRcdFx0XHRcdFx0XHR2YXIgbGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLnJhbmdlLm1pbix2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwyNTZdKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSAgcGFyc2VJbnQobGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhjb2xvclBvcywgaXNvLG5hdGlvbik7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0SW1wb3J0Q3RybCcsIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCB0b2FzdHIsICRzdGF0ZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5uYXRpb25zID0gW107XG5cdFx0dm0uZXZlbnRzID0gW107XG5cdFx0dm0uc3VtID0gMDtcblxuXHRcdHZtLnNhdmVUb0RiID0gc2F2ZVRvRGI7XG5cblx0XHRmdW5jdGlvbiBzYXZlVG9EYigpIHtcblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRuYXRpb25zOiB2bS5uYXRpb25zLFxuXHRcdFx0XHRldmVudHM6IHZtLmV2ZW50c1xuXHRcdFx0fTtcblx0XHRcdFJlc3Rhbmd1bGFyLmFsbCgnL2NvbmZsaWN0cy9pbXBvcnQnKS5wb3N0KGRhdGEpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleCcpXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHRpbWVvdXQsICRzdGF0ZSwgJHNjb3BlLCAkcm9vdFNjb3BlLCBWZWN0b3JsYXllclNlcnZpY2UsIGNvbmZsaWN0LCBjb25mbGljdHMsIG5hdGlvbnMsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHR2bS5jb25mbGljdHMgPSBuYXRpb25zO1xuXHRcdHZtLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdCdzZWNlc3Npb24nLFxuXHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0J25hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLnNob3dDb3VudHJpZXMgPSBmYWxzZTtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uY291bnRyaWVzID0gW107XG5cdFx0dm0uc2hvd1RleHQgPSBzaG93VGV4dDtcblx0XHR2bS5zaG93Q291bnRyaWVzQnV0dG9uID0gc2hvd0NvdW50cmllc0J1dHRvbjtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50MjAxNScsXG5cdFx0XHRzaXplOiA1LFxuXHRcdFx0aGlkZU51bWJlcmluZzogdHJ1ZSxcblx0XHRcdHdpZHRoOjY1LFxuXHRcdFx0aGVpZ2h0OjY1XG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdC8vO1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXG5cdFx0XHRcdHZtLmNvbmZsaWN0cyA9IHJlc3BvbnNlO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCgpO1xuXG5cdFx0XHRcdC8vVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZSh2bS5uYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdHZhciBpID0gdm0ucmVsYXRpb25zLmluZGV4T2YobmF0aW9uLmlzbyk7XG5cdFx0XHRcdFx0aWYgKGkgPT0gLTEpIHtcblx0XHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdGlvbi5pc28pXG5cdFx0XHRcdFx0XHR2bS5jb3VudHJpZXMucHVzaChuYXRpb24pO1xuXHRcdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZShuYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVswXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0XHRbNTAsIDUwXVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UubWFwTGF5ZXIuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93VGV4dCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdHRleHQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPT0gdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA8IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInRyZW5kaW5nX2Rvd25cIjtcblxuXHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfdXBcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93Q291bnRyaWVzQnV0dG9uKCkge1xuXHRcdFx0aWYgKHZtLnNob3dDb3VudHJpZXMpIHJldHVybiBcImFycm93X2Ryb3BfdXBcIjtcblx0XHRcdHJldHVybiBcImFycm93X2Ryb3BfZG93blwiO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGl0ZW1zQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2hvd0xpc3QgPSBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdCdzZWNlc3Npb24nLFxuXHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0J25hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHQncmVzb3VyY2VzJyxcblx0XHRcdCdvdGhlcidcblx0XHRdO1xuXHRcdHZtLnRvZ2dsZUl0ZW0gPSB0b2dnbGVJdGVtO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhpdGVtLCAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMpO1xuXHRcdFx0dmFyIGkgPSAkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMuaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcyA9IFtcblx0XHRcdFx0XHQndGVycml0b3J5Jyxcblx0XHRcdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdFx0XHQnYXV0b25vbXknLFxuXHRcdFx0XHRcdCdzeXN0ZW0nLFxuXHRcdFx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHRcdFx0J2ludGVybmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdzdWJuYXRpb25hbF9wcmVkb21pbmFjZScsXG5cdFx0XHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHRcdFx0J290aGVyJ1xuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdHNDdHJsJywgZnVuY3Rpb24gKCR0aW1lb3V0LCAkc3RhdGUsICRyb290U2NvcGUsICRzY29wZSwgY29uZmxpY3RzLCBuYXRpb25zLCBWZWN0b3JsYXllclNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBEaWFsb2dTZXJ2aWNlLCBGdWxsc2NyZWVuKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ucmVhZHkgPSBmYWxzZTtcblx0XHR2bS5yZWxhdGlvbnMgPSBbXTtcblx0XHR2bS5zaG93TWV0aG9kID0gc2hvd01ldGhvZDtcblx0XHR2bS5nb0Z1bGxzY3JlZW4gPSBnb0Z1bGxzY3JlZW47XG5cdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDVdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0dm0uY29sb3JzID0gWycjZDRlYmY3JywgJyM4N2NjZWInLCAnIzM2YThjNicsICcjMjY4Mzk5JywgJyMwZTYzNzcnXTtcblx0XHR2bS50eXBlc0NvbG9ycyA9IHtcblx0XHRcdGludGVyc3RhdGU6ICcjNjlkNGMzJyxcblx0XHRcdGludHJhc3RhdGU6ICcjYjdiN2I3Jyxcblx0XHRcdHN1YnN0YXRlOiAnI2ZmOWQyNydcblx0XHR9O1xuXHRcdHZtLmFjdGl2ZSA9IHtcblx0XHRcdGNvbmZsaWN0OiBbXSxcblx0XHRcdHR5cGU6IFsxLCAyLCAzXVxuXHRcdH07XG5cdFx0dm0udG9nZ2xlQ29uZmxpY3RGaWx0ZXIgPSB0b2dnbGVDb25mbGljdEZpbHRlcjtcblx0XHR2bS5jb25mbGljdEZpbHRlciA9IG51bGw7XG5cblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuY291bnRyeUNsaWNrKGNvdW50cnlDbGljayk7XG5cdFx0XHRuYXRpb25zLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5uYXRpb25zID0gcmVzcG9uc2U7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLm5hdGlvbnMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbmZsaWN0cy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0dm0uY29uZmxpY3RzID0gcmVzcG9uc2U7XG5cdFx0XHRcdGNhbGNJbnRlbnNpdGllcygpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vXHQkdGltZW91dChmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly99KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnb0Z1bGxzY3JlZW4oKSB7XG5cblx0XHQgaWYgKEZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpXG5cdFx0XHRcdEZ1bGxzY3JlZW4uY2FuY2VsKCk7XG5cdFx0IGVsc2Vcblx0XHRcdFx0RnVsbHNjcmVlbi5hbGwoKTtcblxuXHRcdCAvLyBTZXQgRnVsbHNjcmVlbiB0byBhIHNwZWNpZmljIGVsZW1lbnQgKGJhZCBwcmFjdGljZSlcblx0XHQgLy8gRnVsbHNjcmVlbi5lbmFibGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWcnKSApXG5cblx0fVxuXHRcdGZ1bmN0aW9uIHNldFZhbHVlcygpIHtcblx0XHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdFx0dm0uY29uZmxpY3RGaWx0ZXJDb3VudCA9IDA7XG5cdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzID0ge1xuXHRcdFx0XHR2ZXJ5TG93OiAwLFxuXHRcdFx0XHRsb3c6IDAsXG5cdFx0XHRcdG1pZDogMCxcblx0XHRcdFx0aGlnaDogMCxcblx0XHRcdFx0dmVyeUhpZ2g6IDBcblx0XHRcdH07XG5cdFx0XHR2bS5jaGFydERhdGEgPSBbe1xuXHRcdFx0XHRsYWJlbDogMSxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMF1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDIsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzFdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiAzLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1syXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogNCxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbM11cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDUsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzRdXG5cdFx0XHR9XTtcblxuXHRcdFx0dm0uY29uZmxpY3RUeXBlcyA9IFt7XG5cdFx0XHRcdHR5cGU6ICdpbnRlcnN0YXRlJyxcblx0XHRcdFx0dHlwZV9pZDogMSxcblx0XHRcdFx0Y29sb3I6ICcjNjlkNGMzJyxcblx0XHRcdFx0Y291bnQ6IDBcblx0XHRcdH0sIHtcblx0XHRcdFx0dHlwZTogJ2ludHJhc3RhdGUnLFxuXHRcdFx0XHRjb3VudDogMCxcblx0XHRcdFx0dHlwZV9pZDogMixcblx0XHRcdFx0Y29sb3I6ICcjYjdiN2I3J1xuXHRcdFx0fSwge1xuXHRcdFx0XHR0eXBlOiAnc3Vic3RhdGUnLFxuXHRcdFx0XHRjb3VudDogMCxcblx0XHRcdFx0dHlwZV9pZDogMyxcblx0XHRcdFx0Y29sb3I6ICcjZmY5ZDI3J1xuXHRcdFx0fV07XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvbmZsaWN0RmlsdGVyKHR5cGUpIHtcblxuXHRcdFx0dmFyIGkgPSB2bS5hY3RpdmUudHlwZS5pbmRleE9mKHR5cGUpO1xuXHRcdFx0aWYgKGkgPiAtMSkge1xuXHRcdFx0XHR2bS5hY3RpdmUudHlwZS5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5hY3RpdmUudHlwZS5wdXNoKHR5cGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZtLmFjdGl2ZS50eXBlLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlID0gWzEsIDIsIDNdO1xuXHRcdFx0fVxuXHRcdFx0Y2FsY0ludGVuc2l0aWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY0NvbmZsaWN0KGNvbmZsaWN0KSB7XG5cdFx0XHR2bS5jb25mbGljdEZpbHRlckNvdW50Kys7XG5cdFx0XHRzd2l0Y2ggKGNvbmZsaWN0LnR5cGVfaWQpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dm0uY29uZmxpY3RUeXBlc1swXS5jb3VudCsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dm0uY29uZmxpY3RUeXBlc1sxXS5jb3VudCsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0dm0uY29uZmxpY3RUeXBlc1syXS5jb3VudCsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdH1cblx0XHRcdHN3aXRjaCAoY29uZmxpY3QuaW50MjAxNSkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLnZlcnlMb3crKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzBdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmxvdysrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMV0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMubWlkKys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVsyXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5oaWdoKys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVszXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy52ZXJ5SGlnaCsrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbNF0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0fVxuXHRcdFx0YWRkQ291bnRyaWVzKGNvbmZsaWN0Lm5hdGlvbnMpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBhZGRDb3VudHJpZXMobmF0aW9ucyl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobmF0aW9ucywgZnVuY3Rpb24obmF0KXtcblx0XHRcdFx0aWYodm0ucmVsYXRpb25zLmluZGV4T2YobmF0LmlzbykgPT0gLTEpe1xuXHRcdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKG5hdC5pc28pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2FsY0ludGVuc2l0aWVzKCkge1xuXHRcdFx0c2V0VmFsdWVzKCk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29uZmxpY3RzLCBmdW5jdGlvbiAoY29uZmxpY3QpIHtcblx0XHRcdFx0aWYgKHZtLmFjdGl2ZS50eXBlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmICh2bS5hY3RpdmUudHlwZS5pbmRleE9mKGNvbmZsaWN0LnR5cGVfaWQpID4gLTEpIHtcblx0XHRcdFx0XHRcdGNhbGNDb25mbGljdChjb25mbGljdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNhbGNDb25mbGljdChjb25mbGljdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dm0ucmVhZHkgPSB0cnVlO1xuXHRcdFx0Ly9WZWN0b3JsYXllclNlcnZpY2UucmVkcmF3KCk7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LCB0KSB7XG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0aWYodm0ucmVsYXRpb25zLmluZGV4T2YoaXNvKSA9PSAtMSl7XG5cdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpb25bZmllbGRdICE9IG51bGwgJiYgaXNvKSB7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJyxcblx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RuYXRpb25DdHJsJywgZnVuY3Rpb24oJHRpbWVvdXQsICRzdGF0ZSwgJHJvb3RTY29wZSwgbmF0aW9ucywgbmF0aW9uLCBWZWN0b3JsYXllclNlcnZpY2UsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm5hdGlvbiA9IG5hdGlvbjtcblx0XHR2bS5zaG93TWV0aG9kID0gc2hvd01ldGhvZDtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLmZlYXR1cmVkID0gW107XG5cdFx0dm0uY29uZmxpY3QgPSBudWxsO1xuXHRcdHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdGNvbG9yOiAnIzRmYjBlNScsXG5cdFx0XHRmaWVsZDogJ2ludGVuc2l0eScsXG5cdFx0XHRzaXplOiA1LFxuXHRcdFx0aGlkZU51bWJlcmluZzogdHJ1ZSxcblx0XHRcdHdpZHRoOjY1LFxuXHRcdFx0aGVpZ2h0OjY1XG5cdFx0fTtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gW107XG5cblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0dm0uY29uZmxpY3RzID0gcmVzcG9uc2U7XG5cdFx0XHRcdHZtLnJlbGF0aW9ucy5wdXNoKHZtLm5hdGlvbi5pc28pO1xuXHRcdFx0XHR2bS5mZWF0dXJlZCA9IFtdO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucmVzZXRTZWxlY3RlZCh2bS5uYXRpb24uaXNvKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uY29uZmxpY3RzLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZSh2bS5uYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSBbXTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLm5hdGlvbi5jb25mbGljdHMsIGZ1bmN0aW9uKGNvbmZsaWN0KSB7XG5cdFx0XHRcdFx0aWYgKCF2bS5jb25mbGljdCkgdm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHRcdFx0XHRpZiAoY29uZmxpY3QuaW50MjAxNSA+IHZtLmNvbmZsaWN0LmludDIwMTUpIHtcblx0XHRcdFx0XHRcdHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb25mbGljdCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdGlmKGl0ZW0gPT0gMSApe1xuXHRcdFx0XHRcdFx0XHRpZih2bS5mZWF0dXJlZC5pbmRleE9mKGtleSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdHZtLmZlYXR1cmVkLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IHZtLmZlYXR1cmVkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb25mbGljdC5uYXRpb25zLCBmdW5jdGlvbihuYXRpb24pIHtcblx0XHRcdFx0XHRcdHZhciBpID0gdm0ucmVsYXRpb25zLmluZGV4T2YobmF0aW9uLmlzbyk7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PSAtMSAmJiBuYXRpb24uaXNvICE9IHZtLm5hdGlvbi5pc28pIHtcblx0XHRcdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0aW9uLmlzbylcblx0XHRcdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZShuYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVswXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0XHRbNTAsIDUwXVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UubWFwTGF5ZXIuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0fSlcblxuXG5cblx0XHR9XG5cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QgPT0gbnVsbCkgcmV0dXJuIFwicmVtb3ZlXCI7XG5cdFx0XHRpZiAodm0uY29uZmxpY3QuaW50MjAxNSA9PSB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1IDwgdm0uY29uZmxpY3QuaW50MjAxNClcblx0XHRcdFx0cmV0dXJuIFwidHJlbmRpbmdfZG93blwiO1xuXG5cdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ191cFwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblxuXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuXHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5WydpbnRlbnNpdHknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJztcblx0XHRcdHZhciBjb2xvckZ1bGwgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHR2YXIgb3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRzaXplOiAxXG5cdFx0XHR9O1xuXHRcdFx0aWYgKGlzbyA9PSB2bS5uYXRpb24uaXNvKSB7XG5cdFx0XHRcdG91dGxpbmUgPSB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDU0LDU2LDU5LDAuOCknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29sb3IgPSBjb2xvcjtcblx0XHRcdH1cblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IG91dGxpbmVcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Z1bGxMaXN0Q3RybCcsIGZ1bmN0aW9uKGNhdGVnb3JpZXMsIGluZGljYXRvcnMsIGluZGljZXMpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uaW5kaWNlcyA9IGluZGljZXM7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS5maWx0ZXIgPSBbXTtcblx0XHR2bS50b2dnbGVDYXRGaWx0ZXIgPSB0b2dnbGVDYXRGaWx0ZXI7XG5cdFx0dm0uZmlsdGVyRXhpc3RzID0gZmlsdGVyRXhpc3RzO1xuXHRcdHZtLmNhdEZpbHRlciA9IGNhdEZpbHRlcjtcblxuXHRcdGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuXHRcdFx0JG1kT3Blbk1lbnUoZXYpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVDYXRGaWx0ZXIoaWQpe1xuXG5cdFx0XHR2YXIgaWR4ID0gdm0uZmlsdGVyLmluZGV4T2YoaWQpO1xuXHRcdFx0aWYoaWR4ID4gLTEpIHZtLmZpbHRlci5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdGVsc2Ugdm0uZmlsdGVyLnB1c2goaWQpO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGZpbHRlckV4aXN0cyhpZCl7XG5cdFx0XHRyZXR1cm4gdm0uZmlsdGVyLmluZGV4T2YoaWQpID4gLTE7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhdEZpbHRlcihpdGVtKXtcblxuXHRcdFx0XHRpZihpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID4gMCAmJiB2bS5maWx0ZXIubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uY2F0ZWdvcmllcywgZnVuY3Rpb24oY2F0KXtcblx0XHRcdFx0XHRcdGlmKHZtLmZpbHRlci5pbmRleE9mKGNhdC5pZCkgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZm91bmQ7c1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRtZE1lZGlhLCBsZWFmbGV0RGF0YSwgJHN0YXRlLCRsb2NhbFN0b3JhZ2UsICRyb290U2NvcGUsICRhdXRoLCB0b2FzdHIsICR0aW1lb3V0KXtcblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0JHJvb3RTY29wZS5pc0F1dGhlbnRpY2F0ZWQgPSBpc0F1dGhlbnRpY2F0ZWQ7XG5cdFx0dm0uZG9Mb2dpbiA9IGRvTG9naW47XG5cdFx0dm0uZG9Mb2dvdXQgPSBkb0xvZ291dDtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXHRcdHZtLnRvZ2dsZVZpZXcgPSB0b2dnbGVWaWV3O1xuXG5cdFx0dm0uYXV0aGVudGljYXRlID0gZnVuY3Rpb24ocHJvdmlkZXIpe1xuXHRcdFx0JGF1dGguYXV0aGVudGljYXRlKHByb3ZpZGVyKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkKCl7XG5cdFx0XHQgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ2luKCl7XG5cdFx0XHQkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcblx0XHRcdFx0Ly8kc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCcsICdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dvdXQoKXtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0JGF1dGgubG9nb3V0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5hdXRoKXtcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBsb2dnZWQgb3V0Jyk7XG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cbiAgICBmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcbiAgICAgICRtZE9wZW5NZW51KGV2KTtcbiAgICB9O1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZVZpZXcoKXtcblx0XHRcdCRyb290U2NvcGUubG9vc2VMYXlvdXQgPSAhJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdCRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgPSAkcm9vdFNjb3BlLmxvb3NlTGF5b3V0O1xuXHRcdFx0cmVzZXRNYXBTaXplKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlc2V0TWFwU2l6ZSgpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0XHRtYXAuaW52YWxpZGF0ZVNpemUoKTtcblx0XHRcdFx0fSlcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXHRcdCRyb290U2NvcGUuc2lkZWJhck9wZW4gPSB0cnVlO1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZTtcblx0XHR9LCBmdW5jdGlvbihuZXdQYWdlKXtcblx0XHRcdCRzY29wZS5jdXJyZW50X3BhZ2UgPSBuZXdQYWdlIHx8ICdQYWdlIE5hbWUnO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJyRyb290LnNpZGViYXJPcGVuJywgZnVuY3Rpb24obixvKXtcblx0XHRcdGlmKG4gPT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmVzZXRNYXBTaXplKCk7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHsgcmV0dXJuICRtZE1lZGlhKCd4cycpIH0sIGZ1bmN0aW9uKHNtYWxsKSB7XG5cdCAgICB2bS5zbWFsbFNjcmVlbiA9IHNtYWxsO1xuXHQgIH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgnLCB7aXNfb2ZmaWNpYWw6IHRydWV9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICB2bS5pbmRpemVzID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csJG1kU2lkZW5hdiwgJHJvb3RTY29wZSwgJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UsIGRhdGEsIGNvdW50cmllcywgbGVhZmxldERhdGEsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly8gVmFyaWFibGUgZGVmaW5pdGlvbnNcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm1hcCA9IG51bGw7XG5cblx0XHR2bS5kYXRhU2VydmVyID0gZGF0YS5wcm9taXNlcy5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGRhdGEucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tID0gdm0ubXZ0Q291bnRyeUxheWVyICsgXCJfZ2VvbVwiO1xuXHRcdHZtLmlzb19maWVsZCA9IFZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzI7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cdFx0dm0uZ29Ub0luZGV4ID0gZ29Ub0luZGV4O1xuXG5cdFx0dm0uY2FsY1RyZWUgPSBjYWxjVHJlZTtcblxuXHRcdHZtLmlzUHJlbGFzdCA9IGlzUHJlbGFzdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0dm0uc3RydWN0dXJlU2VydmVyLnRoZW4oZnVuY3Rpb24oc3RydWN0dXJlKSB7XG5cdFx0XHRcdHZtLmRhdGFTZXJ2ZXIudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGlmICghdm0uc3RydWN0dXJlLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUuc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRcdCduYW1lJzogJ2RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiAnRGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCdiYXNlX2NvbG9yJzogJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKSdcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcyh2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvcik7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdHZtLnNldFN0YXRlKCRzdGF0ZS5wYXJhbXMuaXRlbSk7XG5cdFx0XHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGdldE5hdGlvbkJ5SXNvKGlzbykpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvL29uc29sZS5sb2codm0uY29tcGFyZS5jb3VudHJpZXMpO1xuXHRcdFx0XHRcdFx0Y291bnRyaWVzLnB1c2godm0uY3VycmVudC5pc28pO1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGNvdW50cmllcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0Ly8gVE9ETzogTU9WRSBUTyBHTE9CQUxcblx0XHRmdW5jdGlvbiBnb0JhY2soKSB7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnb1RvSW5kZXgoaXRlbSl7XG5cblx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLHtcblx0XHRcdFx0aWQ6aXRlbS5pZCxcblx0XHRcdFx0bmFtZTppdGVtLm5hbWUsXG5cdFx0XHRcdGl0ZW06JHN0YXRlLnBhcmFtc1snaXRlbSddXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaXNQcmVsYXN0KCl7XG5cdFx0XHR2YXIgbGV2ZWxzRm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zdHJ1Y3R1cmUuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcblx0XHRcdFx0aWYoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0bGV2ZWxzRm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsZXZlbHNGb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2hvd1RhYkNvbnRlbnQoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQgPT0gJycgJiYgdm0udGFiQ29udGVudCA9PSAnJykge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHR2bS50b2dnbGVCdXR0b24gPSB2bS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGl0ZW0pIHtcblx0XHRcdHZtLnNldEN1cnJlbnQoZ2V0TmF0aW9uQnlJc28oaXRlbSkpO1xuXHRcdFx0ZmV0Y2hOYXRpb25EYXRhKGl0ZW0pO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVPcGVuKCkge1xuXHRcdFx0dm0ubWVudWVPcGVuID0gIXZtLm1lbnVlT3Blbjtcblx0XHRcdHZtLmNsb3NlSWNvbiA9IHZtLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cblx0XHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoaXNvKSB7XG5cdFx0XHRpZiAodm0ubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjYWxjUmFuaygpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHR2YXIga2FjayA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0XHQvL3ZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgJ3Njb3JlJywgJ2lzbycsIHRydWUpO1xuXHRcdFx0cmFuayA9IHZtLmRhdGEuaW5kZXhPZih2bS5jdXJyZW50KSArIDE7XG5cdFx0XHR2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6IHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0ZmllbGQ6IHZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJyxcblx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSkge1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHQvL1RPRE86IFJFTU9WRSwgTk9XIEdPVCBPV04gVVJMXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBQVVQgSU4gVklFV1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZURldGFpbHMoKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGV0YWlscyA9ICF2bS5kZXRhaWxzO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGZldGNoTmF0aW9uRGF0YShpc28pIHtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArICRzdGF0ZS5wYXJhbXMuaWQsIGlzbykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gTUFQIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmICghJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0NvbXBhcmlzb24od2FudCkge1xuXHRcdFx0aWYgKHdhbnQgJiYgIXZtLmNvbXBhcmUuYWN0aXZlIHx8ICF3YW50ICYmIHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb21wYXJpc29uKCkge1xuXHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMgPSBbdm0uY3VycmVudF07XG5cdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9ICF2bS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKG5hdCwga2V5KSB7XG5cdFx0XHRcdGlmIChjb3VudHJ5ID09IG5hdCAmJiBuYXQgIT0gdm0uY3VycmVudCkge1xuXHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goY291bnRyeSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzb3MgPSBbXTtcblx0XHRcdHZhciBjb21wYXJlID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpc29zLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHRpZiAoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdGNvbXBhcmUucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgaXNvcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTogJHN0YXRlLnBhcmFtcy5pdGVtLFxuXHRcdFx0XHRcdGNvdW50cmllczogY29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpKTtcblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTc7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBPV04gRElSRUNUSVZFXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFZJRVdcblx0XHRmdW5jdGlvbiBzZXRUYWIoaSkge1xuXHRcdFx0Ly92bS5hY3RpdmVUYWIgPSBpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChkYXRhKSB7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmNvbHVtbl9uYW1lID09IHZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSkge1xuXHRcdFx0XHRcdHZtLm5vZGVQYXJlbnQgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdldFBhcmVudChpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNUcmVlKCkge1xuXHRcdFx0Z2V0UGFyZW50KHZtLnN0cnVjdHVyZSk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeU5hbWUobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBDT1VOVFJZXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlJc28oaXNvKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhjb2xvcikge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiB1cGRhdGVDYW52YXMoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cblx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblxuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZiAoaXNvICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKGZlYXR1cmUucHJvcGVydGllcy5uYW1lKVxuXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbScpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG4uaXNvKSB7XG5cdFx0XHRcdGlmIChvLmlzbykge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbby5pc29dLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0ZmV0Y2hOYXRpb25EYXRhKG4uaXNvKTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tuLmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnIHx8ICRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93Jykge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IG4uaXNvXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0bmFtZTogJHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmIChuLmNvbG9yKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpZDogbi5pZCxcblx0XHRcdFx0XHRcdG5hbWU6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0XHRcdFx0Y291bnRyaWVzOiAkc3RhdGUucGFyYW1zLmNvdW50cmllc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdFx0bmFtZTogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc29cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHRcdGlkOiBuLmlkLFxuXHRcdFx0XHRcdG5hbWU6IG4ubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Lyp2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXVxuXHRcdFx0XHRdKi9cblx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVsyXVsxXSwgbi5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRbMTAwLCAxMDBdXG5cdFx0XHRdO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHBhZCA9IFtcblx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdG1heFpvb206IDZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLml0ZW0pIHtcblx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24oZXZ0LCB0KSB7XG5cblx0XHRcdFx0XHRpZiAoIXZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLm9wZW4oKTtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnLCBldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdChjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDaGVja0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSkge1xuXG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLnNlbGVjdGVkID0gW107XG4gICAgdm0ueWVhcmZpbHRlciA9ICcnO1xuXHRcdHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuXHRcdHZtLmRlbGV0ZVNlbGVjdGVkID0gZGVsZXRlU2VsZWN0ZWQ7XG5cdFx0dm0uZGVsZXRlQ29sdW1uID0gZGVsZXRlQ29sdW1uO1xuXHRcdHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblx0XHR2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuXHRcdHZtLnNlbGVjdEVycm9ycyA9IHNlbGVjdEVycm9ycztcbiAgICB2bS5zZWFyY2hGb3JFcnJvcnMgPSBzZWFyY2hGb3JFcnJvcnM7XG5cdFx0dm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuXHRcdC8vdm0uZWRpdENvbHVtbkRhdGEgPSBlZGl0Q29sdW1uRGF0YTtcblx0XHR2bS5lZGl0Um93ID0gZWRpdFJvdztcbiAgICB2bS55ZWFycyA9IFtdO1xuXHRcdHZtLnF1ZXJ5ID0ge1xuXHRcdFx0ZmlsdGVyOiAnJyxcblx0XHRcdG9yZGVyOiAnLWVycm9ycycsXG5cdFx0XHRsaW1pdDogMTUsXG5cdFx0XHRwYWdlOiAxXG5cdFx0fTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGNoZWNrRGF0YSgpO1xuICAgIFx0Z2V0WWVhcnMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuICAgIGZ1bmN0aW9uIGdldFllYXJzKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgZGF0ID0gKCRmaWx0ZXIoJ2dyb3VwQnknKSh2bS5kYXRhLCAnZGF0YS4nK3ZtLm1ldGEuY291bnRyeV9maWVsZCApKTtcblx0ICAgICAgdm0ueWVhcnMgPSBbXTtcblx0XHRcdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0XHRcdHZhciBpbmRleCA9IG51bGw7XG5cdFx0XHQgIGFuZ3VsYXIuZm9yRWFjaChkYXQsZnVuY3Rpb24oZW50cnksIGkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5Lmxlbmd0aCA+IGxlbmd0aCl7XG5cdFx0XHRcdFx0XHRpbmRleCA9IGlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHQgICAgICBhbmd1bGFyLmZvckVhY2goZGF0W2luZGV4XSxmdW5jdGlvbihlbnRyeSl7XG5cdCAgICAgICAgdm0ueWVhcnMucHVzaChlbnRyeS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pXG5cdCAgICAgIH0pO1xuXHRcdFx0XHR2bS55ZWFyZmlsdGVyID0gdm0ueWVhcnNbMF07XG5cdFx0XHR9KTtcblxuXG4gICAgfVxuXHRcdGZ1bmN0aW9uIHNlYXJjaChwcmVkaWNhdGUpIHtcblx0XHRcdHZtLmZpbHRlciA9IHByZWRpY2F0ZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuXHRcdFx0cmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcblx0XHRcdC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNoZWNrRm9yRXJyb3JzKGl0ZW0pIHtcblx0XHRcdHJldHVybiBpdGVtLmVycm9ycy5sZW5ndGggPiAwID8gJ21kLXdhcm4nIDogJyc7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuXHRcdCAgdm0udG9FZGl0ID0ga2V5O1xuXHRcdCAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRjb2x1bW4nLCAkc2NvcGUpO1xuXHRcdH0qL1xuXHRcdGZ1bmN0aW9uIGRlbGV0ZUNvbHVtbihlLCBrZXkpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoZmllbGQsIGwpIHtcblx0XHRcdFx0XHRpZiAobCA9PSBrZXkpIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpe1xuXHRcdFx0XHRcdFx0XHRpZihlcnJvci5jb2x1bW4gPT0ga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZXJyb3JzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdGRlbGV0ZSB2bS5kYXRhW2tdLmRhdGFba2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBrKSB7XG5cdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMtLTtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5lcnJvcnMtLTtcblx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0dm0uZGF0YS5zcGxpY2Uodm0uZGF0YS5pbmRleE9mKGl0ZW0pLCAxKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uZGVsZXRlRGF0YSgpO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RFcnJvcnMoKSB7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZWRpdFJvdygpIHtcblx0XHRcdHZtLnJvdyA9IHZtLnNlbGVjdGVkWzBdO1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRyb3cnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlbGV0ZURhdGEoKSB7XG5cdFx0XHR2bS5kYXRhID0gW107XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9yRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChyb3csIGspIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogaXRlbVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpXG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuXHRcdHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdC8vdm0ubXlEYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG5cdFx0XHQvL2NoZWNrTXlEYXRhKCk7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiBjaGVja015RGF0YSgpIHtcblx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSovXG5cblx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmICggaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIi8qIHx8IGl0ZW0gPCAwKi8gfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcblx0XHRcdFx0XHRcdHJvdzoga2V5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG5cblx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcblx0XHRcdHZhciBlbnRyaWVzID0gW107XG5cdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcblx0XHRcdFx0ZGF0YTogZW50cmllcyxcblx0XHRcdFx0aXNvOiBpc29UeXBlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY291bnRyeS5kYXRhLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdG9TZWxlY3QgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmKGNvdW50cnkuZGF0YS5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGEgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjNcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhW2tdLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZElzb0Vycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5pc29fY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdHZtLmV4dGVuZERhdGEgPSBleHRlbmREYXRhO1xuXG5cdFx0ZnVuY3Rpb24gZXh0ZW5kRGF0YSgpIHtcblx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHZhciBtZXRhID0gW10sXG5cdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcblx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Y29uc29sZS5sb2coaW5zZXJ0RGF0YSk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgdm0uYWRkRGF0YVRvLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBWZWN0b3JsYXllclNlcnZpY2UsJHRpbWVvdXQsSW5kZXhTZXJ2aWNlLGxlYWZsZXREYXRhLCB0b2FzdHIpe1xuICAgICAgICAvL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICB2bS5pbmRpY2F0b3JzID0gW107XG4gICAgICAgIHZtLnNjYWxlID0gXCJcIjtcbiAgICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgICB2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKTtcbiAgICAgICAgdm0uY291bnRyaWVzU3R5bGUgPSBjb3VudHJpZXNTdHlsZTtcbiAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuXG5cbiAgICAgICAgY29uc29sZS5sb2codm0uaW5kaWNhdG9yKTtcbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIGNoZWNrRGF0YSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tEYXRhKCl7XG4gICAgICAgICAgaWYoIXZtLmRhdGEpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgICBpZihuID09PSBvKXJldHVybjtcbiAgICAgICAgICB2bS5pbmRpY2F0b3IgPSBuO1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcbiAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXModm0uaW5kaWNhdG9yLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgndm0uaW5kaWNhdG9yJywgZnVuY3Rpb24obixvKXtcbiAgICAgICAgICBpZihuID09PSBvKSByZXR1cm47XG4gICAgICAgICAgaWYodHlwZW9mIG4uc3R5bGVfaWQgIT0gXCJ1bmRlZmluZWRcIiApe1xuICAgICAgICAgICAgaWYobi5zdHlsZV9pZCAhPSBvLnN0eWxlX2lkKXtcbiAgICAgICAgICAgICAgaWYobi5zdHlsZSl7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyhuLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgaWYodHlwZW9mIG4uY2F0ZWdvcmllcyAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgaWYobi5jYXRlZ29yaWVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyhuLmNhdGVnb3JpZXNbMF0uc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldEFjdGl2ZUluZGljYXRvckRhdGEobik7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0sdHJ1ZSk7XG5cblxuICAgICAgICBmdW5jdGlvbiBtaW5NYXgoKXtcbiAgICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICB2bS5taW4gPSBNYXRoLm1pbihpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWluKTtcbiAgICAgICAgICAgICAgdm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV0sIHZtLm1heCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG4gICAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICBpZihpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdID09IGlzbyl7XG4gICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuICAgIFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuICAgIFx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuICAgIFx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG4gICAgXHRcdFx0dmFyIGZpZWxkID0gdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lO1xuICAgIFx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXG4gICAgXHRcdFx0c3dpdGNoICh0eXBlKSB7XG4gICAgXHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXG4gICAgXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KHZtLnNjYWxlKHZhbHVlKSkpICogNDtcbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcbiAgICAgICAgICAgICAgc3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuICAgIFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG4gICAgXHRcdFx0XHRcdFx0b3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuICAgIFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0YnJlYWs7XG5cbiAgICBcdFx0XHR9XG5cbiAgICBcdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpKydfZ2VvbScpIHtcbiAgICBcdFx0XHRcdHN0eWxlLnN0YXRpY0xhYmVsID0gZnVuY3Rpb24gKCkge1xuICAgIFx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgXHRcdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG4gICAgXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcbiAgICBcdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgIFx0XHRcdFx0fTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgIFx0XHR9XG4gICAgICAgIGZ1bmN0aW9uIHNldENvdW50cmllcygpe1xuICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG4gICAgICAgICAgdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG4gICAgICAgICAgbWluTWF4KCk7XG4gICAgXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcbiAgICBcdFx0XHRcdHZtLm1hcCA9IG1hcDtcbiAgICBcdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgIFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIFx0XHRcdFx0XHRcdHNldENvdW50cmllcygpO1xuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TWV0YU1lbnVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgdG9hc3RyLCBEYXRhU2VydmljZSxEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICBJbmRleFNlcnZpY2UucmVzZXRJbmRpY2F0b3IoKTtcbiAgICAgIHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuICAgICAgdm0uc2VsZWN0Rm9yRWRpdGluZyA9IHNlbGVjdEZvckVkaXRpbmc7XG4gICAgICB2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG4gICAgICB2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG4gICAgICB2bS5jaGVja0FsbCA9IGNoZWNrQWxsO1xuICAgICAgdm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcblxuXG4gICAgICBmdW5jdGlvbiBzZWxlY3RGb3JFZGl0aW5nKGtleSl7XG4gICAgICAgIGlmKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldEluZGljYXRvcihrZXkse1xuICAgICAgICAgICAgY29sdW1uX25hbWU6a2V5LFxuICAgICAgICAgICAgdGl0bGU6a2V5XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdm0uZWRpdGluZ0l0ZW0gPSBrZXk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KTtcbiAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS50eXBlICYmIGl0ZW0uZGF0YXByb3ZpZGVyICYmIGl0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcbiAgXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgXHRcdFx0fVxuICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gIFx0XHR9XG4gIFx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoaXRlbSl7XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGl0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdHJldHVybiBjaGVja0Jhc2UoaXRlbSkgJiYgaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbiAgXHRcdH1cbiAgICAgIGZ1bmN0aW9uIGNoZWNrQWxsKCl7XG4gICAgICAgIHZhciBkb25lID0gMDtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGluZGljYXRvcil7XG4gICAgICAgICAgaWYoY2hlY2tCYXNlKGluZGljYXRvcikpe1xuICAgICAgICAgICAgZG9uZSArKztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGRvbmUsIE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aCk7XG4gICAgICAgIGlmKGRvbmUgPT0gT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoKXtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBzYXZlRGF0YSgpIHtcblxuICAgICAgICAgIGlmKCF2bS5tZXRhLnllYXJfZmllbGQgJiYgIXZtLm1ldGEueWVhcil7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkWWVhcicsICRzY29wZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICBcdFx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuICBcdFx0XHRcdFx0ZGF0YTogW11cbiAgXHRcdFx0XHR9O1xuICBcdFx0XHRcdHZhciBub1llYXJzID0gW107XG4gIFx0XHRcdFx0dmFyIGluc2VydE1ldGEgPSBbXSxcbiAgXHRcdFx0XHRcdGZpZWxkcyA9IFtdO1xuICBcdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gIFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcbiAgXHRcdFx0XHRcdFx0aWYoaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pe1xuICBcdFx0XHRcdFx0XHRcdGl0ZW0uZGF0YS55ZWFyID0gaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cbiAgXHRcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG4gIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG4gIFx0XHRcdFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0XHRcdFx0dm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gIFx0XHRcdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHRlbHNle1xuICAgICAgICAgICAgICAgIGlmKHZtLm1ldGEueWVhcil7XG4gICAgICAgICAgICAgICAgICBpdGVtLmRhdGEueWVhciA9IHZtLm1ldGEueWVhcjtcbiAgICAgICAgICAgICAgICAgIHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgIFx0bm9ZZWFycy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gIFx0XHRcdFx0XHRcdH1cblxuXG4gIFx0XHRcdFx0XHR9IGVsc2Uge1xuICBcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuICBcdFx0XHRcdFx0XHRyZXR1cm47XG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgXHRcdFx0XHRcdGlmIChrZXkgIT0gdm0ubWV0YS5pc29fZmllbGQgJiYga2V5ICE9IHZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuICBcdFx0XHRcdFx0XHR2YXIgc3R5bGVfaWQgPSAwO1xuICBcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZtLmluZGljYXRvcnNba2V5XS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gIFx0XHRcdFx0XHRcdFx0c3R5bGVfaWQgPSB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUuaWQ7XG4gIFx0XHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdFx0dmFyIGZpZWxkID0ge1xuICBcdFx0XHRcdFx0XHRcdCdjb2x1bW4nOiBrZXksXG4gIFx0XHRcdFx0XHRcdFx0J3RpdGxlJzogdm0uaW5kaWNhdG9yc1trZXldLnRpdGxlLFxuICBcdFx0XHRcdFx0XHRcdCdkZXNjcmlwdGlvbic6IHZtLmluZGljYXRvcnNba2V5XS5kZXNjcmlwdGlvbixcbiAgXHRcdFx0XHRcdFx0XHQnbWVhc3VyZV90eXBlX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLnR5cGUuaWQgfHwgMCxcbiAgXHRcdFx0XHRcdFx0XHQnaXNfcHVibGljJzogdm0uaW5kaWNhdG9yc1trZXldLmlzX3B1YmxpYyB8fCAwLFxuICBcdFx0XHRcdFx0XHRcdCdzdHlsZV9pZCc6IHN0eWxlX2lkLFxuICBcdFx0XHRcdFx0XHRcdCdkYXRhcHJvdmlkZXJfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0uZGF0YXByb3ZpZGVyLmlkIHx8IDBcbiAgXHRcdFx0XHRcdFx0fTtcbiAgXHRcdFx0XHRcdFx0dmFyIGNhdGVnb3JpZXMgPSBbXTtcbiAgXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnNba2V5XS5jYXRlZ29yaWVzLCBmdW5jdGlvbiAoY2F0KSB7XG4gIFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllcy5wdXNoKGNhdC5pZCk7XG4gIFx0XHRcdFx0XHRcdH0pO1xuICBcdFx0XHRcdFx0XHRmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcbiAgXHRcdFx0XHRcdFx0ZmllbGRzLnB1c2goZmllbGQpO1xuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdH0pO1xuICBcdFx0XHRcdHZtLm1ldGEuZmllbGRzID0gZmllbGRzO1xuICBcdFx0XHRcdGlmKG5vWWVhcnMubGVuZ3RoID4gMCl7XG4gIFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoXCJmb3IgXCIrbm9ZZWFycy5sZW5ndGggKyBcIiBlbnRyaWVzXCIsICdObyB5ZWFyIHZhbHVlIGZvdW5kIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRcdH1cblxuICBcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyByZXNwb25zZS50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgXHRcdFx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG4gIFx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcbiAgXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuY2xlYXIoKTtcbiAgXHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcbiAgXHRcdFx0XHRcdFx0XHR2bS5kYXRhID0gW107XG4gIFx0XHRcdFx0XHRcdFx0dm0uc3RlcCA9IDA7XG4gIFx0XHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuICBcdFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIFx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICBcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG5cbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgXHRcdFx0XHR9KVxuXG4gIFx0XHR9XG4gICAgICBmdW5jdGlvbiBjb3B5VG9PdGhlcnMoKXtcbiAgICAgIC8qICB2bS5wcmVQcm92aWRlciA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uZGF0YXByb3ZpZGVyO1xuICAgICAgICB2bS5wcmVNZWFzdXJlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5tZWFzdXJlX3R5cGVfaWQ7XG4gICAgICAgIHZtLnByZVR5cGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnR5cGU7XG4gICAgICAgIHZtLnByZUNhdGVnb3JpZXMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmNhdGVnb3JpZXM7XG4gICAgICAgIHZtLnByZVB1YmxpYyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uaXNfcHVibGljO1xuICAgICAgICB2bS5wcmVTdHlsZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uc3R5bGU7XG5cbiAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7Ki9cbiAgICAgIH1cbiAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgIHZtLmluZGljYXRvcnNbbi5jb2x1bW5fbmFtZV0gPSBuO1xuICAgICAgfSx0cnVlKTtcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmIChuID09PSBvIHx8IHR5cGVvZiBvID09IFwidW5kZWZpbmVkXCIgfHwgbyA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmKCF2bS5hc2tlZFRvUmVwbGljYXRlKSB7XG4gICAgICAgICAgdm0ucHJlUHJvdmlkZXIgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmRhdGFwcm92aWRlcjtcbiAgICAgICAgICB2bS5wcmVNZWFzdXJlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5tZWFzdXJlX3R5cGVfaWQ7XG4gICAgICAgICAgdm0ucHJlVHlwZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0udHlwZTtcbiAgICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICAgIHZtLnByZVB1YmxpYyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uaXNfcHVibGljO1xuICAgICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcblxuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb3B5cHJvdmlkZXInLCAkc2NvcGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vbi5kYXRhcHJvdmlkZXIgPSB2bS5kb1Byb3ZpZGVycyA/IHZtLnByZVByb3ZpZGVyIDogW107XG4gICAgICAgICAgLy9uLm1lYXN1cmVfdHlwZV9pZCA9IHZtLmRvTWVhc3VyZXMgPyB2bS5wcmVNZWFzdXJlIDogMDtcbiAgICAgICAgICAvL24uY2F0ZWdvcmllcyA9IHZtLmRvQ2F0ZWdvcmllcyA/IHZtLnByZUNhdGVnb3JpZXM6IFtdO1xuICAgICAgICAgIC8vbi5pc19wdWJsaWMgPSB2bS5kb1B1YmxpYyA/IHZtLnByZVB1YmxpYzogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcblx0XHR2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvKmlmICh2bS5tZXRhLnllYXJfZmllbGQpIHtcblx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHR9Ki9cblx0XHRcdGNoZWNrRGF0YSgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrRGF0YSgpIHtcblx0XHRcdGlmICghdm0uZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzYXZlRGF0YSh2YWxpZCkge1xuXHRcdFx0aWYgKHZhbGlkKSB7XG5cdFx0XHRcdHZhciBpbnNlcnREYXRhID0ge1xuXHRcdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBub1llYXJzID0gW107XG5cdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG5cdFx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdFx0aWYoaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF0pe1xuXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdG5vWWVhcnMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZtLmluZGljYXRvcnNba2V5XS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIGZpZWxkID0ge1xuXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdCdkZXNjcmlwdGlvbic6IHZtLmluZGljYXRvcnNba2V5XS5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG5cdFx0XHRcdFx0XHRcdCdzdHlsZV9pZCc6IHN0eWxlX2lkLFxuXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0dmFyIGNhdGVnb3JpZXMgPSBbXTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG5cdFx0XHRcdGlmKG5vWWVhcnMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbE1lbnVDdHJsJywgZnVuY3Rpb24oSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzTGVuZ3RoID0gT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoO1xuXG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhRW50cnlDdHJsJywgZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBVc2VyU2VydmljZS5teURhdGEoKTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YU1lbnVDdHJsJywgZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgdm0uZGF0YSA9IFtdO1xuXG4gICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICBVc2VyU2VydmljZS5teURhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIHZtLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgY29udmVydEluZm8oKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY29udmVydEluZm8oKXtcbiAgICAgICAgY29uc29sZS5sb2codm0uZGF0YSk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIGl0ZW0ubWV0YSA9IEpTT04ucGFyc2UoaXRlbS5tZXRhX2RhdGEpO1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhjcmVhdG9yQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSxEYXRhU2VydmljZSwgJHRpbWVvdXQsJHN0YXRlLCAkZmlsdGVyLCBsZWFmbGV0RGF0YSwgdG9hc3RyLCBJY29uc1NlcnZpY2UsSW5kZXhTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2Upe1xuXG4gICAgICAgIC8vVE9ETzogQ2hlY2sgaWYgdGhlcmUgaXMgZGF0YSBpbiBzdG9yYWdlIHRvIGZpbmlzaFxuICAgICAgLyogIGNvbnNvbGUubG9nKCRzdGF0ZSk7XG4gICAgICAgIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5jcmVhdGUnKXtcbiAgICAgICAgICBpZihJbmRleFNlcnZpY2UuZ2V0RGF0YSgpLmxlbmd0aCl7XG4gICAgICAgICAgICBpZihjb25maXJtKCdFeGlzdGluZyBEYXRhLiBHbyBPbj8nKSl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBJbmRleFNlcnZpY2UuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1hcCA9IG51bGw7XG4gICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgdm0udG9TZWxlY3QgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSb3dzID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID1bXTtcbiAgICAgICAgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG5cbiAgICAgICAgdm0uZ3JvdXBzID0gW107XG4gICAgICAgIHZtLm15RGF0YSA9IFtdO1xuICAgICAgICB2bS5hZGREYXRhVG8gPSB7fTtcbiAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICB2bS5pc29fZXJyb3JzID0gMDtcbiAgICAgICAgdm0uaXNvX2NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHZtLnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgdm0ub3BlbkNsb3NlID0gb3BlbkNsb3NlO1xuICAgICAgICAvL3ZtLnNlYXJjaCA9IHNlYXJjaDtcblxuICAgICAgICB2bS5saXN0UmVzb3VyY2VzID0gbGlzdFJlc291cmNlcztcbiAgICAgICAgdm0udG9nZ2xlTGlzdFJlc291cmNlcyA9IHRvZ2dsZUxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2UgPSBzZWxlY3RlZFJlc291cmNlO1xuICAgICAgICB2bS50b2dnbGVSZXNvdXJjZSA9IHRvZ2dsZVJlc291cmNlO1xuICAgICAgICB2bS5pbmNyZWFzZVBlcmNlbnRhZ2UgPSBpbmNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLmRlY3JlYXNlUGVyY2VudGFnZSA9IGRlY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0udG9nZ2xlR3JvdXBTZWxlY3Rpb24gPSB0b2dnbGVHcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uZXhpc3RzSW5Hcm91cFNlbGVjdGlvbiA9IGV4aXN0c0luR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmFkZEdyb3VwID0gYWRkR3JvdXA7XG4gICAgICAgIHZtLmNsb25lU2VsZWN0aW9uID0gY2xvbmVTZWxlY3Rpb247XG4gICAgICAgIHZtLmVkaXRFbnRyeSA9IGVkaXRFbnRyeTtcbiAgICAgICAgdm0ucmVtb3ZlRW50cnkgPSByZW1vdmVFbnRyeTtcbiAgICAgICAgdm0uc2F2ZUluZGV4ID0gc2F2ZUluZGV4O1xuXG4gICAgICAgIHZtLmljb25zID0gSWNvbnNTZXJ2aWNlLmdldExpc3QoKTtcblxuICAgICAgICB2bS5tZXRhID0ge1xuICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICB9O1xuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcblxuICAgICAgICAvKnZtLnRyZWVPcHRpb25zID0ge1xuICAgICAgICAgIGJlZm9yZURyb3A6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgaWYoZXZlbnQuZGVzdC5ub2Rlc1Njb3BlICE9IGV2ZW50LnNvdXJjZS5ub2Rlc1Njb3BlKXtcbiAgICAgICAgICAgICAgdmFyIGlkeCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbW9kZWxWYWx1ZS5pbmRleE9mKGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICBpZihpZHggPiAtMSl7XG4gICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJCRhcHBseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ09ubHkgb25lIGVsZW1lbnQgb2YgYSBraW5kIHBlciBncm91cCBwb3NzaWJsZSEnLCAnTm90IGFsbG93ZWQhJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZHJvcHBlZDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTsqL1xuXG4gICAgICAgIC8vUnVuIFN0YXJ0dXAtRnVuY2l0b25zXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICAvL2NsZWFyTWFwKCk7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnJlc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb3BlbkNsb3NlKGFjdGl2ZSl7XG4gICAgICAgICAgcmV0dXJuIGFjdGl2ZSA/ICdyZW1vdmUnIDogJ2FkZCc7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJMYXllclN0eWxlKGZlYXR1cmUpe1xuICAgICAgXHRcdFx0dmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICBjb2xvcjoncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgICAgICAgIG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fVxuICAgICAgICAgICAgfTtcbiAgICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhck1hcCgpe1xuICAgICAgICAgIFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICAgICAgdm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNsZWFyTGF5ZXJTdHlsZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIHZtLnNob3dSZXNvdXJjZXMgPSAhdm0uc2hvd1Jlc291cmNlcztcbiAgICAgICAgICBpZih2bS5zaG93UmVzb3VyY2VzKXtcbiAgICAgICAgICAgIHZtLmxpc3RSZXNvdXJjZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIGlmKCF2bS5yZXNvdXJjZXMpe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICB2bS5yZXNvdXJjZXMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPSBbXSwgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgbGlzdCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIC8vaWYodHlwZW9mIGl0ZW0uaXNHcm91cCA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtID09IHJlc291cmNlKXtcbiAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZSh2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YoaXRlbSksMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBpdGVtLm5vZGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgdm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkR3JvdXAoKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonR3JvdXAnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIHZtLnNlbGVjdGVkRm9yR3JvdXApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsb25lU2VsZWN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0Nsb25lZCBFbGVtZW50cycsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdEVudHJ5KGl0ZW0pe1xuICAgICAgICAgIHZtLmVkaXRJdGVtID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVFbnRyeShpdGVtLCBsaXN0KXtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCBsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlSW5kZXgoKXtcbiAgICAgICAgICBpZih2bS5zYXZlRGlzYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmKHR5cGVvZiB2bS5uZXdJbmRleCA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXZtLm5ld0luZGV4LnRpdGxlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5uZXdJbmRleC5kYXRhID0gdm0uZ3JvdXBzO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2luZGV4Jywgdm0ubmV3SW5kZXgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91ciBJbmRleCBoYXMgYmVlbiBjcmVhdGVkJywgJ1N1Y2Nlc3MnKSxcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6cmVzcG9uc2UubmFtZX0pO1xuICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwnVXBwcyEhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyokc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICBpZighdm0uZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RhdGUubmFtZSkge1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJzpcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tNeURhdGEoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSA0O1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yY2F0ZWdvcnlDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgY2F0ZWdvcnksIGNhdGVnb3JpZXMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRnbG9iYWxTYXZlOnRydWUsXG5cdFx0XHRwb3N0RG9uZTpmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6ZGF0YS5pZH0pXG5cdFx0XHR9LFxuXHRcdH1cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0LCRzdGF0ZSwgaW5kaWNhdG9ycywgaW5kaWNlcywgc3R5bGVzLCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uY29tcG9zaXRzID0gaW5kaWNlcztcblx0XHR2bS5zdHlsZXMgPSBzdHlsZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uY2hlY2tUYWJDb250ZW50ID0gY2hlY2tUYWJDb250ZW50O1xuXG5cdFx0dm0uYWN0aXZlID0gMDtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uc2VsZWN0aW9uID0ge1xuXHRcdFx0aW5kaWNlczpbXSxcblx0XHRcdGluZGljYXRvcnM6W10sXG5cdFx0XHRzdHlsZXM6W10sXG5cdFx0XHRjYXRlZ29yaWVzOltdXG5cdFx0fTtcblxuXG5cdFx0dm0ub3B0aW9ucyA9IHtcblx0XHRcdGNvbXBvc2l0czp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J2NvbXBvc2l0cycsXG5cdFx0XHRcdGFsbG93TW92ZTpmYWxzZSxcblx0XHRcdFx0YWxsb3dEcm9wOmZhbHNlLFxuXHRcdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0XHRhbGxvd0RlbGV0ZTp0cnVlLFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOmlkLCBuYW1lOm5hbWV9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZGRDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7aWQ6MCwgbmFtZTogJ25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uaW5kaWNlcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlSXRlbShpdGVtLmlkKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLmluZGljZXMgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNhdGVnb3JpZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjYXRlZ29yaWVzJyxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcy5jYXRlZ29yeScsIHtpZDonbmV3J30pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1DbGljazogZnVuY3Rpb24oaWQsIG5hbWUpe1xuXG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6aWR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlQ2F0ZWdvcnkoaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5jYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHN0eWxlczp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J3N0eWxlcycsXG5cdFx0XHRcdHdpdGhDb2xvcjp0cnVlXG5cdFx0XHR9XG5cdFx0fTtcblxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tUYWJDb250ZW50KGluZGV4KXtcblx0XHRcdHN3aXRjaCAoaW5kZXgpIHtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0aWYodHlwZW9mICRzdGF0ZS5wYXJhbXMuaWQgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse1xuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6JHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG5cdFx0ICBpZih0eXBlb2YgdG9QYXJhbXMuaWQgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5hY3RpdmUgPSB0b1BhcmFtcy5pZDtcblx0XHRcdH1cblx0XHRcdGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMTtcblx0XHRcdFx0Ly9hY3RpdmF0ZSh0b1BhcmFtcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpICE9IC0xKXtcblx0XHRcdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsJHRpbWVvdXQsIFZlY3RvcmxheWVyU2VydmljZSwgbGVhZmxldERhdGEsIENvbnRlbnRTZXJ2aWNlLCBpbmRpY2F0b3IpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLnNjYWxlID0gXCJcIjtcblx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHR2bS5tYXggPSAwO1xuXHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRzZXRBY3RpdmUoKTtcblxuXHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pO1xuXHRcdGZ1bmN0aW9uIHNldEFjdGl2ZSgpe1xuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5pZGNhdG9yc0N0cmwnLCBmdW5jdGlvbiAoaW5kaWNhdG9ycywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cblxuICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kZXgpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgLy92bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG4gICAgdm0uaW5kZXggPSBpbmRleDtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdHNldEFjdGl2ZSgpO1xuICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICBpbmRpemVzOntcbiAgICAgICAgYWRkQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YS5hZGQnKTtcbiAgICAgICAgfSxcblx0XHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaXRlbSA9IHtcblx0XHRcdFx0XHRcdHRpdGxlOiAnSSBhbSBhIGdyb3VwLi4uIG5hbWUgbWUnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2bS5pbmRleC5jaGlsZHJlbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHZtKTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0cmVtb3ZlSXRlbShpdGVtLHZtLmluZGV4LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVEcm9wOiBmdW5jdGlvbihldmVudCxpdGVtLGV4dGVybmFsLHR5cGUpe1xuXHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuICAgICAgfSxcbiAgICAgIHdpdGhTYXZlOiB0cnVlXG4gICAgfVxuXG5cdFx0YWN0aXZlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW0oaXRlbSwgbGlzdCl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSByZW1vdmVJdGVtKGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQvKkNvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pOyovXG5cblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHQvKlx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JTaG93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCR0aW1lb3V0LCBpbmRpY2F0b3IsIGNvdW50cmllcywgQ29udGVudFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmN1cnJlbnQgPSBudWxsO1xuXHRcdHZtLmFjdGl2ZSA9IG51bGw7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cdFx0dm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLmRhdGEgPSBbXTtcblx0XHR2bS5yYW5nZSA9IHtcblx0XHRcdG1heDotMTAwMDAwLFxuXHRcdFx0bWluOjEwMDAwMFxuXHRcdH07XG5cdFx0dm0uZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdvSW5mb1N0YXRlID0gZ29JbmZvU3RhdGU7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy55ZWFyKXtcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm0uaW5kaWNhdG9yLnllYXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdGlmKHZtLmluZGljYXRvci55ZWFyc1tpXS55ZWFyID09ICRzdGF0ZS5wYXJhbXMueWVhcil7XG5cdFx0XHRcdFx0XHRcdHZtLmFjdGl2ZSA9ICBpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCF2bS5hY3RpdmUpe1xuXHRcdFx0XHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRTdGF0ZShpc28pIHtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbykpO1xuXHRcdFx0XHQvL3ZtLmN1cnJlbnQgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdH0pXG5cdFx0fTtcblx0XHRmdW5jdGlvbiBnb0luZm9TdGF0ZSgpe1xuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycse3llYXI6dm0ueWVhcn0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInLHtpZDp2bS5pbmRpY2F0b3IuaWQsIG5hbWU6dm0uaW5kaWNhdG9yLm5hbWUsIHllYXI6dm0ueWVhcn0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpIHtcblx0XHRcdHZhciByYW5rID0gdm0uZGF0YS5pbmRleE9mKGNvdW50cnkpICsgMTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2codm0uZ2V0UmFuayh2bS5jdXJyZW50KSk7XG5cdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE3O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoKSB7XG5cblx0XHRcdC8qXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKS5sYXllcnNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSsnX2dlb20nXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0XHQvKmlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmNvdW50cnknLHsgaXNvOnZtLmN1cnJlbnQuaXNvfSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mby5jb3VudHJ5Jyx7IGlzbzp2bS5jdXJyZW50Lmlzb30pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJHN0YXRlLmN1cnJlbnQubmFtZSx7IGlzbzp2bS5jdXJyZW50Lmlzb30pXG5cdFx0XHRcdH0qL1xuXG5cdFx0fTtcblx0XHRmdW5jdGlvbiBjb3VudHJ5Q2xpY2soZXZ0LHQpe1xuXHRcdFx0dmFyIGMgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXSk7XG5cdFx0XHRpZiAodHlwZW9mIGMuc2NvcmUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHR2bS5jdXJyZW50ID0gYztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXREYXRhKHllYXIpIHtcblx0XHRcdHZtLnllYXIgPSB5ZWFyO1xuXHRcdFx0Q29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSh2bS5pbmRpY2F0b3IuaWQsIHllYXIpLnRoZW4oZnVuY3Rpb24oZGF0KSB7XG5cdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycse3llYXI6eWVhcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInLHt5ZWFyOnllYXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyx7eWVhcjp5ZWFyfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dm0uZGF0YSA9IGRhdDtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGl0ZW0ucmFuayA9IHZtLmRhdGEuaW5kZXhPZihpdGVtKSArMTtcblx0XHRcdFx0XHRpZih2bS5jdXJyZW50KXtcblx0XHRcdFx0XHRcdGlmKGl0ZW0uaXNvID09IHZtLmN1cnJlbnQuaXNvKXtcblx0XHRcdFx0XHRcdFx0c2V0Q3VycmVudChpdGVtKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSAgZDMubWF4KFt2bS5yYW5nZS5tYXgsIHBhcnNlRmxvYXQoaXRlbS5zY29yZSldKTtcblx0XHRcdFx0XHR2bS5yYW5nZS5taW4gPSAgZDMubWluKFt2bS5yYW5nZS5taW4sIHBhcnNlRmxvYXQoaXRlbS5zY29yZSldKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IHZtLmluZGljYXRvci5zdHlsZWQuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdFx0XHRmaWVsZDogJ3JhbmsnLFxuXHRcdFx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdGdldE9mZnNldCgpO1xuXHRcdFx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ucmFuZ2UubWluLHZtLnJhbmdlLm1heF0pLnJhbmdlKFswLDI1Nl0pO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5kYXRhLCB2bS5pbmRpY2F0b3Iuc3R5bGVkLmJhc2VfY29sb3IsIHRydWUpO1xuXHRcdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhjb3VudHJpZXNTdHlsZSwgY291bnRyeUNsaWNrKTtcblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cblx0XHRcdHZhciBmaWVsZCA9ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdGlmKHZtLmN1cnJlbnQpe1xuXHRcdFx0XHRpZih2bS5jdXJyZW50LmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsKXtcblxuXHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gIHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7Ly8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJyxcblx0XHRcdGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcblx0XHRcdFx0aWYodG9TdGF0ZS5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLmRhdGEnKXtcblxuXHRcdFx0XHR9XG5cdFx0fSlcblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yWWVhclRhYmxlQ3RybCcsIGZ1bmN0aW9uICgkZmlsdGVyLCBkYXRhKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmRhdGEgPSBkYXRhO1xuICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuXHRcdHZtLm9uUGFnaW5hdGlvbkNoYW5nZSA9IG9uUGFnaW5hdGlvbkNoYW5nZTtcblxuICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcblx0XHRcdHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG5cdFx0XHQvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuXHRcdH07XG5cblxuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5wcmV2U3RhdGUgPSBudWxsO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICBcbiAgICAgICAgdm0udXNlciA9IHtcbiAgICAgICAgICBlbWFpbDonJyxcbiAgICAgICAgICBwYXNzd29yZDonJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICB2bS5jaGVja0xvZ2dlZEluKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0xvZ2dlZEluKCl7XG5cbiAgICAgICAgICBpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6J2VwaSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9Mb2dpbigpe1xuICAgICAgICAgICRhdXRoLmxvZ2luKHZtLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUucHJldmlvdXNQYWdlKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5zdGF0ZS5uYW1lIHx8ICdhcHAuaG9tZScsICRyb290U2NvcGUucHJldmlvdXNQYWdlLnBhcmFtcyk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dvQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBsZWFmbGV0RGF0YSwgbGVhZmxldE1hcEV2ZW50cywgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB6b29tID0gMyxcblx0XHRcdG1pblpvb20gPSAyO1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCkge1xuXHRcdFx0em9vbSA9IDI7XG5cdFx0XHQvL21pblpvb20gPSAxO1xuXHRcdH1cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBhcGlLZXkgPSBWZWN0b3JsYXllclNlcnZpY2Uua2V5cy5tYXBib3g7XG5cdFx0dm0udG9nZ2xlTGF5ZXJzID0gdG9nZ2xlTGF5ZXJzO1xuXHRcdHZtLmRlZmF1bHRzID0ge1xuXHRcdFx0Ly9zY3JvbGxXaGVlbFpvb206IGZhbHNlLFxuXHRcdFx0bWluWm9vbTogbWluWm9vbVxuXHRcdH07XG5cdFx0dm0uY2VudGVyID0ge1xuXHRcdFx0bGF0OiA0OC4yMDkyMDYsXG5cdFx0XHRsbmc6IDE2LjM3Mjc3OCxcblx0XHRcdHpvb206IHpvb21cblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ091dGRvb3InLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdFx0bGF5ZXJPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZGV0ZWN0UmV0aW5hOiB0cnVlXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLmxhYmVsc0xheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFnbm9sby4wNjAyOWE5Yy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksIHtcblx0XHRcdG5vV3JhcDogdHJ1ZSxcblx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2UsXG5cdFx0XHRuYW1lOiAnbGFiZWxzJyxcblx0XHRcdGRldGVjdFJldGluYTogdHJ1ZVxuXHRcdH0pO1xuXHRcdHZtLm1heGJvdW5kcyA9IHtcblx0XHRcdHNvdXRoV2VzdDoge1xuXHRcdFx0XHRsYXQ6IDkwLFxuXHRcdFx0XHRsbmc6IDE4MFxuXHRcdFx0fSxcblx0XHRcdG5vcnRoRWFzdDoge1xuXHRcdFx0XHRsYXQ6IC05MCxcblx0XHRcdFx0bG5nOiAtMTgwXG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5jb250cm9scyA9IHtcblx0XHRcdGN1c3RvbTogW11cblx0XHR9O1xuXHRcdHZtLmxheWVyY29udHJvbCA9IHtcblx0XHRcdGljb25zOiB7XG5cdFx0XHRcdHVuY2hlY2s6IFwiZmEgZmEtdG9nZ2xlLW9mZlwiLFxuXHRcdFx0XHRjaGVjazogXCJmYSBmYS10b2dnbGUtb25cIlxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBNeUNvbnRyb2wgPSBMLmNvbnRyb2woKTtcblx0XHRNeUNvbnRyb2wuc2V0UG9zaXRpb24oJ3RvcGxlZnQnKTtcblx0XHRNeUNvbnRyb2wuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0TC5VdGlsLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdE15Q29udHJvbC5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhciBsZWFmbGV0LWNvbnRyb2wtem9vbScpO1xuXHRcdFx0dmFyIHNwYW4gPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJ2xlYWZsZXQtY29udHJvbC16b29tLWluIGN1cnNvcicsIGNvbnRhaW5lcik7XG5cdFx0XHRzcGFuLnRleHRDb250ZW50ID0gJ1QnO1xuXHRcdFx0TC5Eb21FdmVudC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbihjb250YWluZXIpO1xuXHRcdFx0TC5Eb21FdmVudC5hZGRMaXN0ZW5lcihjb250YWluZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0aWYgKHZtLm5vTGFiZWwpIHtcblx0XHRcdFx0XHRcdG1hcC5yZW1vdmVMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0XHR2bS5ub0xhYmVsID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHRcdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0XHRcdHZtLm5vTGFiZWwgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb250YWluZXI7XG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiB0b2dnbGVMYXllcnMob3ZlcmxheU5hbWUpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0aWYgKHZtLm5vTGFiZWwpIHtcblx0XHRcdFx0XHRtYXAucmVtb3ZlTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdHZtLm5vTGFiZWwgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdHZtLmxhYmVsc0xheWVyLmJyaW5nVG9Gcm9udCgpO1xuXHRcdFx0XHRcdHZtLm5vTGFiZWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0TWFwKG1hcCk7XG5cdFx0XHR2YXIgdXJsID0gJ2h0dHA6Ly92MjIwMTUwNTI4MzU4MjUzNTgueW91cnZzZXJ2ZXIubmV0OjMwMDEvc2VydmljZXMvcG9zdGdpcy8nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICcvZ2VvbS92ZWN0b3ItdGlsZXMve3p9L3t4fS97eX0ucGJmP2ZpZWxkcz0nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmZpZWxkcygpOyAvL1xuXHRcdFx0dmFyIGxheWVyID0gbmV3IEwuVGlsZUxheWVyLk1WVFNvdXJjZSh7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRkZWJ1ZzogZmFsc2UsXG5cdFx0XHRcdGRldGVjdFJldGluYTp0cnVlLFxuXHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFtWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJ10sXG5cdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdHJldHVybiBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uKGZlYXR1cmUsIGNvbnRleHQpIHtcblxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bWFwLmFkZExheWVyKFZlY3RvcmxheWVyU2VydmljZS5zZXRMYXllcihsYXllcikpO1xuXHRcdFx0bWFwLmFkZENvbnRyb2woTXlDb250cm9sKTtcblx0XHRcdC8qbWFwLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGFsZXJ0KCdoZWxsbycpO1xuXHRcdFx0fSk7XG5cbiAgICAgICAgICAgIHZhciBtYXBFdmVudHMgPSBsZWFmbGV0TWFwRXZlbnRzLmdldEF2YWlsYWJsZU1hcEV2ZW50cygpO1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBtYXBFdmVudHMpe1xuICAgICAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC4nICsgbWFwRXZlbnRzW2tdO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hcEV2ZW50c1trXSlcbiAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblx0XHQvKlx0bWFwLmFkZExheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdHZtLmxhYmVsc0xheWVyLmJyaW5nVG9Gcm9udCgpO1xuXHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTsqL1xuXHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3RlZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGdldENvdW50cnksIFZlY3RvcmxheWVyU2VydmljZSwgJGZpbHRlcil7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnN0cnVjdHVyZSA9ICRzY29wZS4kcGFyZW50LnZtLnN0cnVjdHVyZTtcbiAgICAgICAgdm0uZGlzcGxheSA9ICRzY29wZS4kcGFyZW50LnZtLmRpc3BsYXk7XG4gICAgICAgIHZtLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5kYXRhO1xuICAgICAgICB2bS5jdXJyZW50ID0gZ2V0Q291bnRyeTtcbiAgICAgICAgdm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgICAgIHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuICAgICAgICB2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG4gICAgICAgIHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsY1JhbmsoKSB7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0pO1xuICAgICAgICAgICAgaXRlbVsnc2NvcmUnXSA9IHBhcnNlSW50KGl0ZW1bJ3Njb3JlJ10pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyW2ldLmlzbyA9PSB2bS5jdXJyZW50Lmlzbykge1xuICAgICAgICAgICAgICByYW5rID0gaSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUrJ19yYW5rJ10gPSByYW5rO1xuICAgICAgICAgIHZtLmNpcmNsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGNvbG9yOnZtLnN0cnVjdHVyZS5jb2xvcixcbiAgICAgICAgICAgICAgZmllbGQ6dm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUrJ19yYW5rJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpe1xuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICB2YXIgcmFuayA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGZpbHRlciwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuICAgICAgICAgICAgICByYW5rID0ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByYW5rKzE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuIDA7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTY7XG4gICAgXHRcdH07XG5cbiAgICBcdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG4gICAgXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuIHZtLmN1cnJlbnQucGVyY2VudF9jaGFuZ2UgPiAwID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG4gICAgXHRcdH07XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uIChuLCBvKSB7XG4gICAgICAgICAgaWYgKG4gPT09IG8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG8uaXNvKXtcbiAgICAgICAgICAgICAgdm0ubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbby5pc29dLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxjUmFuaygpO1xuICAgICAgICAgICAgZmV0Y2hOYXRpb25EYXRhKG4uaXNvKTtcblxuXG4gICAgICAgIH0pO1xuICAgICAgICAvKjsqL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZW1lbnVDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkUHJvdmlkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLCBEYXRhU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmRhdGFwcm92aWRlciA9IHt9O1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIudGl0bGUgPSAkc2NvcGUuJHBhcmVudC52bS5zZWFyY2hUZXh0O1xuXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJy9kYXRhcHJvdmlkZXJzJywgdm0uZGF0YXByb3ZpZGVyKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kYXRhcHJvdmlkZXJzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLml0ZW0uZGF0YXByb3ZpZGVyID0gZGF0YTtcbiAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRVbml0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSl7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS51bml0ID0ge307XG4gICAgICB2bS51bml0LnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVW5pdDtcblxuICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy9cbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvbWVhc3VyZV90eXBlcycsIHZtLnVuaXQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZWFzdXJlVHlwZXMucHVzaChkYXRhKTtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLml0ZW0udHlwZSA9IGRhdGE7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfTtcblxuICAgICAgdm0uaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgfTtcblxuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRZZWFyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnZtKTtcbiAgICAgICAgICAgICRzY29wZS52bS5zYXZlRGF0YSgpO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRVc2Vyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcblx0ICAgICAgICAvL2RvIHNvbWV0aGluZyB1c2VmdWxcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RtZXRob2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0dGV4dEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICBcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcHlwcm92aWRlckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5hc2tlZFRvUmVwbGljYXRlID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9TdHlsZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYyA9IHRydWU7XG5cdFx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuJHBhcmVudC52bS5kYXRhWzBdLmRhdGEsIGZ1bmN0aW9uIChkYXRhLCBrZXkpIHtcblx0XHRcdFx0aWYgKGtleSAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LCB7XG5cdFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiBrZXksXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBrZXlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgaXRlbSA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KTtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMpIHtcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YXByb3ZpZGVyID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlUHJvdmlkZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLnR5cGUgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVUeXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVDYXRlZ29yaWVzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMpIHtcblx0XHRcdFx0XHRcdGl0ZW0uaXNfcHVibGljID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlUHVibGljO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9TdHlsZSkge1xuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGU7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uc3R5bGVfaWQgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVTdHlsZS5pZDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXG5cdFx0fTtcblxuXHRcdCRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IGZhbHNlO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRjb2x1bW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSAkc2NvcGUuJHBhcmVudC52bS50b0VkaXQ7XG4gICAgICAgIGlmKHR5cGVvZiAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUpe1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uKXtcbiAgICAgICAgICAgICRzY29wZS5kZXNjcmlwdGlvbiA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSA9ICRzY29wZS50aXRsZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbiA9ICRzY29wZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRyb3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5zZWxlY3RlZFswXTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXh0ZW5kRGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUudm0uZG9FeHRlbmQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnZtLm1ldGEuaXNvX2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5pc29fbmFtZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmNvdW50cnlfZmllbGQgPSAkc2NvcGUudm0uYWRkRGF0YVRvLmNvdW50cnlfbmFtZTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9vc2VkYXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRlbGV0ZURhdGEoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkc2NvcGUudG9TdGF0ZS5uYW1lKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGlzb2ZldGNoZXJzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEluZGV4U2VydmljZSwgRGlhbG9nU2VydmljZSkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIG1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmlzbyA9IG1ldGEuaXNvX2ZpZWxkO1xuXHRcdHZtLmxpc3QgPSBJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKTtcblx0XHR2bS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblxuXHRcdHZtLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmxpc3QnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKG4sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZW50cnkuZGF0YVswXVt2bS5pc29dKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZW50cnkuZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IsIGUpIHtcblx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLmlzbykge1xuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uZW50cnkuZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZtLmxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKHZtLmxpc3QubGVuZ3RoID09IDApIHtcblx0XHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2F1dG9Gb2N1cycsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0cmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBQycsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKF9zY29wZSwgX2VsZW1lbnQpIHtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX2VsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdCYXJzQ3RybCcsIGZ1bmN0aW9uICgpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ud2lkdGggPSB3aWR0aDtcblxuXHRcdGZ1bmN0aW9uIHdpZHRoKGl0ZW0pIHtcblx0XHRcdGlmKCF2bS5kYXRhKSByZXR1cm47XG5cdFx0XHRyZXR1cm4gdm0uZGF0YVtpdGVtLm5hbWVdO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnYmFycycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2JhcnMvYmFycy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdCYXJzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0ZGF0YTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHN0cnVjdHVyZTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0J1YmJsZXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZnVuY3Rpb24gQ3VzdG9tVG9vbHRpcCh0b29sdGlwSWQsIHdpZHRoKSB7XG5cdFx0dmFyIHRvb2x0aXBJZCA9IHRvb2x0aXBJZDtcblx0XHR2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cdFx0aWYoZWxlbSA9PSBudWxsKXtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3Rvb2x0aXAgbWQtd2hpdGVmcmFtZS16MycgaWQ9J1wiICsgdG9vbHRpcElkICsgXCInPjwvZGl2PlwiKTtcblx0XHR9XG5cdFx0aGlkZVRvb2x0aXAoKTtcblx0XHRmdW5jdGlvbiBzaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBldmVudCwgZWxlbWVudCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuaHRtbChjb250ZW50KTtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGRhdGEsIGVsZW1lbnQpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBoaWRlVG9vbHRpcCgpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgdHRpZCA9IFwiI1wiICsgdG9vbHRpcElkO1xuXHRcdFx0dmFyIHhPZmZzZXQgPSAyMDtcblx0XHRcdHZhciB5T2Zmc2V0ID0gMTA7XG5cdFx0XHR2YXIgc3ZnID0gZWxlbWVudC5maW5kKCdzdmcnKVswXTsvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdmdfdmlzJyk7XG5cdFx0XHR2YXIgd3NjclkgPSB3aW5kb3cuc2Nyb2xsWTtcblx0XHRcdHZhciB0dHcgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkub2Zmc2V0V2lkdGg7XG5cdFx0XHR2YXIgdHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR2YXIgdHR0b3AgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZC55IC0gdHRoIC8gMjtcblx0XHRcdHZhciB0dGxlZnQgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGQueCArIGQucmFkaXVzICsgMTI7XG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLmNzcygndG9wJywgdHR0b3AgKyAncHgnKS5jc3MoJ2xlZnQnLCB0dGxlZnQgKyAncHgnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3dUb29sdGlwOiBzaG93VG9vbHRpcCxcblx0XHRcdGhpZGVUb29sdGlwOiBoaWRlVG9vbHRpcCxcblx0XHRcdHVwZGF0ZVBvc2l0aW9uOiB1cGRhdGVQb3NpdGlvblxuXHRcdH1cblx0fVxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2J1YmJsZXMnLCBmdW5jdGlvbiAoJGNvbXBpbGUsIEljb25zU2VydmljZSkge1xuXHRcdHZhciBkZWZhdWx0cztcblx0XHRkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogMzAwLFxuXHRcdFx0XHRsYXlvdXRfZ3Jhdml0eTogMCxcblx0XHRcdFx0c2l6ZWZhY3RvcjozLFxuXHRcdFx0XHR2aXM6IG51bGwsXG5cdFx0XHRcdGZvcmNlOiBudWxsLFxuXHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRjaXJjbGVzOiBudWxsLFxuXHRcdFx0XHRib3JkZXJzOiB0cnVlLFxuXHRcdFx0XHRsYWJlbHM6IHRydWUsXG5cdFx0XHRcdGZpbGxfY29sb3I6IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oW1wiZWhcIiwgXCJldlwiXSkucmFuZ2UoW1wiI2EzMTAzMVwiLCBcIiNiZWNjYWVcIl0pLFxuXHRcdFx0XHRtYXhfYW1vdW50OiAnJyxcblx0XHRcdFx0cmFkaXVzX3NjYWxlOiAnJyxcblx0XHRcdFx0ZHVyYXRpb246IDEwMDAsXG5cdFx0XHRcdHRvb2x0aXA6IEN1c3RvbVRvb2x0aXAoXCJidWJibGVzX3Rvb2x0aXBcIiwgMjQwKVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJz0nLFxuXHRcdFx0XHRncmF2aXR5OiAnPScsXG5cdFx0XHRcdHNpemVmYWN0b3I6ICc9Jyxcblx0XHRcdFx0aW5kZXhlcjogJz0nLFxuXHRcdFx0XHRib3JkZXJzOiAnQCdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgYXR0cnMpO1xuXHRcdFx0XHR2YXIgbm9kZXMgPSBbXSxcblx0XHRcdFx0XHRsaW5rcyA9IFtdLFxuXHRcdFx0XHRcdGxhYmVscyA9IFtdLFxuXHRcdFx0XHRcdGdyb3VwcyA9IFtdO1xuXG5cdFx0XHRcdHZhciBtYXhfYW1vdW50ID0gZDMubWF4KHNjb3BlLmNoYXJ0ZGF0YSwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChkLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vb3B0aW9ucy5oZWlnaHQgPSBvcHRpb25zLndpZHRoICogMS4xO1xuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge307XG5cblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZihzY29wZS5pbmRleGVyLmNoaWxkcmVuLmxlbmd0aCA9PSAyICYmIHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGdyb3VwLCBpbmRleCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbUNvbG9yID0gZ3JvdXAuY29sb3I7XG5cdFx0XHRcdFx0XHRcdGlmKGdyb3VwLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdG1Db2xvciA9IGdyb3VwLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6IGdyb3VwLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBtQ29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogZ3JvdXAuaWNvbixcblx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShncm91cC5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBncm91cCxcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjpncm91cC5jaGlsZHJlblxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yID0gaXRlbS5jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGl0ZW0uc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gaXRlbS5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZihncm91cC5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3IgPSBncm91cC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0ubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfZ3JvdXBzKCk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblxuXHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0bmFtZTogc2NvcGUuaW5kZXhlci50aXRsZSxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0Y29sb3I6IHNjb3BlLmluZGV4ZXIuc3R5bGUuYmFzZV9jb2xvciB8fCBzY29wZS5pbmRleGVyLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRpY29uOiBzY29wZS5pbmRleGVyLmljb24sXG5cdFx0XHRcdFx0XHRcdHVuaWNvZGU6IHNjb3BlLmluZGV4ZXIudW5pY29kZSxcblx0XHRcdFx0XHRcdFx0ZGF0YTogc2NvcGUuaW5kZXhlci5kYXRhLFxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbjogc2NvcGUuaW5kZXhlci5jaGlsZHJlblxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNsZWFyX25vZGVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRub2RlcyA9IFtdO1xuXHRcdFx0XHRcdGxhYmVscyA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBjcmVhdGVfZ3JvdXBzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnNbbm9kZS5ncm91cF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyICsgKDEgLSBrZXkpLFxuXHRcdFx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjcmVhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtKS5odG1sKCcnKTtcblx0XHRcdFx0XHRvcHRpb25zLnZpcyA9IGQzLnNlbGVjdChlbGVtWzBdKS5hcHBlbmQoXCJzdmdcIikuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpLmF0dHIoXCJpZFwiLCBcInN2Z192aXNcIik7XG5cblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuYm9yZGVycykge1xuXHRcdFx0XHRcdFx0dmFyIHBpID0gTWF0aC5QSTtcblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmNUb3AgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTA5KVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMTApXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoLTkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDkwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdHZhciBhcmNCb3R0b20gPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTM0KVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMzUpXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMjcwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNUb3AgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY1RvcClcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbGFiZWxzWzBdLmNvbG9yIHx8IFwiI2JlNWYwMFwiO1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yIC0gb3B0aW9ucy5oZWlnaHQvMTIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNCb3R0b20gPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjQm90dG9tXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1sxXS5jb2xvciB8fCBcIiMwMDZiYjZcIjtcblx0XHRcdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cyhvcHRpb25zLndpZHRoLzMgLSAxKVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cyhvcHRpb25zLndpZHRoLzMpXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgzNjAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGxhYmVsc1swXS5jb2xvcilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0aWYob3B0aW9ucy5sYWJlbHMgPT0gdHJ1ZSAmJiBsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0dmFyIHRleHRMYWJlbHMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ3RleHQubGFiZWxzJykuZGF0YShsYWJlbHMpLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWxzJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8qXHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAncm90YXRlKDkwLCAxMDAsIDEwMCknO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSkqL1xuXHRcdFx0XHRcdFx0XHQuYXR0cigneCcsIFwiNTAlXCIpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgJzEuMmVtJylcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG5cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHRcdC5vbignY2xpY2snLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE1O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuaGVpZ2h0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWU7XG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBcImJ1YmJsZV9cIiArIGQudHlwZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LWZhbWlseScsICdFUEknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlID8gJyNmZmYnIDogZC5jb2xvcjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0aWYoZC51bmljb2RlKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSB8fCAnMSdcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogMS43NSArICdweCc7XG5cdFx0XHRcdFx0fSkuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGQucmFkaXVzID0gZC52YWx1ZSA9IHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIDEuNzUgKyAncHgnXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2hhcmdlID0gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gLU1hdGgucG93KGQucmFkaXVzLCAyLjApIC8gNDtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmZvcmNlID0gZDMubGF5b3V0LmZvcmNlKCkubm9kZXMobm9kZXMpLnNpemUoW29wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0XSkubGlua3MobGlua3MpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ncm91cF9hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuODUpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NlbnRlcihlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ieV9jYXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2F0KGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2VudGVyID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy53aWR0aC8yIC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKjEuMjU7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmhlaWdodC8yIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjI1O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX3RvcCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMuY2VudGVyLnggLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKDIwMCAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NhdCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHR2YXJcdGJhck9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHR0aXRsZWQ6dHJ1ZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0Y29udGVudCA9ICc8bWQtcHJvZ3Jlc3MtbGluZWFyIG1kLW1vZGU9XCJkZXRlcm1pbmF0ZVwiIHZhbHVlPVwiJytkYXRhLnZhbHVlKydcIj48L21kLXByb2dyZXNzLWxpbmVhcj4nXG5cdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVxcXCI+XCIrIGRhdGEubmFtZSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGluZm8pIHtcblx0XHRcdFx0XHRcdGlmKHNjb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdID4gMCApe1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9ICc8ZGl2IGNsYXNzPVwic3ViXCI+Jztcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPG1kLXByb2dyZXNzLWxpbmVhciBtZC1tb2RlPVwiZGV0ZXJtaW5hdGVcIiB2YWx1ZT1cIicrc2NvcGUuY2hhcnRkYXRhW2luZm8ubmFtZV0rJ1wiPjwvbWQtcHJvZ3Jlc3MtbGluZWFyPidcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIrc2NvcGUuY2hhcnRkYXRhW2luZm8ubmFtZV0rJyAtICcgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ICs9ICc8L2Rpdj4nO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly9jb250ZW50ID0gJzxiYXJzIG9wdGlvbnM9XCJiYXJPcHRpb25zXCIgc3RydWN0dXJlPVwiZGF0YS5kYXRhLmNoaWxkcmVuXCIgZGF0YT1cImRhdGFcIj48L2JhcnM+JztcblxuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5jaXJjbGVzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dXBkYXRlX3ZpcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2luZGV4ZXInLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiBuWzBdLmNoaWxkcmVuICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdFx0XHRjbGVhcl9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Ly9kaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkaXJlY3Rpb24nLCBmdW5jdGlvbiAob2xkRCwgbmV3RCkge1xuXHRcdFx0XHRcdGlmIChvbGREID09PSBuZXdEKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvbGREID09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDYXRlZ29yaWVzQ3RybCcsIGZ1bmN0aW9uICgkZmlsdGVyLCB0b2FzdHIsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNhdE9wdGlvbnMgPSB7XG5cdFx0XHRhYm9ydDogZnVuY3Rpb24oKXtcblx0XHRcdFx0dm0uY3JlYXRlQ2F0ZWdvcnkgPSBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRwb3N0RG9uZTpmdW5jdGlvbihjYXRlZ29yeSl7XG5cdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3JpZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDYXRlZ29yaWVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2F0ZWdvcnlDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCB0b2FzdHIsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uc2F2ZUNhdGVnb3J5ID0gc2F2ZUNhdGVnb3J5O1xuXHRcdHZtLnF1ZXJ5U2VhcmNoQ2F0ZWdvcnkgPSBxdWVyeVNlYXJjaENhdGVnb3J5O1xuXHRcdHZtLnBhcmVudENoYW5nZWQgPSBwYXJlbnRDaGFuZ2VkO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5zdHlsZXMgPSBDb250ZW50U2VydmljZS5nZXRTdHlsZXMoKTtcblx0XHR2bS5mbGF0dGVuZWQgPSBbXTtcblx0XHR2bS5jb3B5ID0ge307XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRmbGF0dGVuV2l0aENoaWxkcmVuKHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0aWYodm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHR2bS5wYXJlbnQgPSBnZXRQYXJlbnQodm0uaXRlbSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdHZtLmNvcHkgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGZsYXR0ZW5XaXRoQ2hpbGRyZW4obGlzdCl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHZtLmZsYXR0ZW5lZC5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRpZihpdGVtLmNoaWxkcmVuKXtcblx0XHRcdFx0XHRmbGF0dGVuV2l0aENoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoQ2F0ZWdvcnkocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykoJGZpbHRlcignb3JkZXJCeScpKHZtLmZsYXR0ZW5lZCwgJ3RpdGxlJyksIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHRcdC8vcmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSgkZmlsdGVyKCdmbGF0dGVuJykodm0uY2F0ZWdvcmllcyksIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBwYXJlbnRDaGFuZ2VkKGl0ZW0pe1xuXHRcdFx0aWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLml0ZW0ucGFyZW50X2lkID0gMDtcblx0XHRcdFx0dm0uaXRlbS5wYXJlbnQgPSBudWxsO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihpdGVtLmlkID09IHZtLml0ZW0uaWQpe1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZSBQYXJlbnQgY2Fubm90IGJlIHRoZSBzYW1lJywgJ0ludmFsaWQgc2VsZWN0aW9uJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZtLnBhcmVudCA9IGl0ZW07XG5cdFx0XHR2bS5pdGVtLnBhcmVudF9pZCA9IGl0ZW0uaWQ7XG5cdFx0XHR2bS5pdGVtLnBhcmVudCA9IGl0ZW07XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChpdGVtLGxpc3Qpe1xuXHRcdFx0dmFyIGZvdW5kID0gbnVsbFxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0Zm91bmQgPSBlbnRyeTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbiAmJiAhZm91bmQpe1xuXHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSBnZXRQYXJlbnQoaXRlbSwgZW50cnkuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRmb3VuZCA9IHN1YnJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtb3ZlSXRlbSgpe1xuXHRcdFx0aWYodm0uY29weS5wYXJlbnRfaWQpe1xuXHRcdFx0XHRcdHZhciBvbGRQYXJlbnQgPSBnZXRQYXJlbnQodm0uY29weSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG9sZFBhcmVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKyApe1xuXHRcdFx0XHRcdFx0aWYob2xkUGFyZW50LmNoaWxkcmVuW2ldLmlkID09IHZtLml0ZW0uaWQpe1xuXHRcdFx0XHRcdFx0XHRvbGRQYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGksMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZtLmNhdGVnb3JpZXMubGVuZ3RoOyBpKysgKXtcblx0XHRcdFx0XHRpZih2bS5jYXRlZ29yaWVzW2ldLmlkID09IHZtLml0ZW0uaWQpe1xuXHRcdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5zcGxpY2UoaSwxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0dmFyIG5ld1BhcmVudCA9IGdldFBhcmVudCh2bS5pdGVtLCB2bS5jYXRlZ29yaWVzKTtcblx0XHRcdFx0bmV3UGFyZW50LmNoaWxkcmVuLnB1c2godm0uaXRlbSk7XG5cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLmNhdGVnb3JpZXMucHVzaCh2bS5pdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc3VjY2Vzc0FjdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKHZtLmNvcHkucGFyZW50X2lkLCB2bS5pdGVtLnBhcmVudF9pZCk7XG5cdFx0XHRpZih2bS5jb3B5LnBhcmVudF9pZCAhPSB2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkICYmIHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0XHRtb3ZlSXRlbSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0b2FzdHIuc3VjY2VzcygnQ2F0ZWdvcnkgaGFzIGJlZW4gdXBkYXRlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHQkc2NvcGUuY2F0ZWdvcnlGb3JtLiRzZXRTdWJtaXR0ZWQoKTtcblx0XHRcdHZtLmNvcHkgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVDYXRlZ29yeSh2YWxpZCkge1xuXHRcdFx0aWYodmFsaWQpe1xuXHRcdFx0XHRpZih2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRpZih2bS5pdGVtLnJlc3Rhbmd1bGFyaXplZCl7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKHN1Y2Nlc3NBY3Rpb24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UudXBkYXRlKCdjYXRlZ29yaWVzJywgdm0uaXRlbS5pZCwgdm0uaXRlbSkudGhlbihzdWNjZXNzQWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NhdGVnb3JpZXMnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihkYXRhLnBhcmVudF9pZCAhPSAwICl7XG5cdFx0XHRcdFx0XHRcdFx0IHZhciBwYXJlbnQgPSBnZXRQYXJlbnQoZGF0YSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdFx0XHRcdFx0IGlmKCFwYXJlbnQuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHRcdFx0IHBhcmVudC5jaGlsZHJlbi5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuZXhwYW5kZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBDYXRlZ29yeSBoYXMgYmVlbiBzYXZlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0XHR2bS5vcHRpb25zLnBvc3REb25lKGRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY2F0ZWdvcnknLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yeS9jYXRlZ29yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDYXRlZ29yeUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9PycsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHR2YXIgIM+EID0gMiAqIE1hdGguUEk7XG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCAnMC42Jylcblx0XHRcdFx0XHQuYXR0cignZmlsbCcsICdub25lJyk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gJzFlbSc7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJzEuNWVtJztcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICcwLjM1ZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcwLjM3ZW0nXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblxuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHRoaXMudGV4dENvbnRlbnQuc3BsaXQoJ07CsCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZCksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lyokc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQoJHNjb3BlLml0ZW1bbi5maWVsZF0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnaXRlbScsXHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0Ly9pZihuID09PSBvKSByZXR1cm47XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0blskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyB8fCAhbikgcmV0dXJuO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29tcG9zaXRzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjb21wb3NpdHMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NvbXBvc2l0c0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29uZmxpY3RpdGVtcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdGl0ZW1zQ3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29udGVudGVkaXRhYmxlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY29udGVudGVkaXRhYmxlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdC8vaWYgKCFuZ01vZGVsKSByZXR1cm47XG5cdFx0XHRcdG5nTW9kZWwuJHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRlbGVtZW50Lmh0bWwobmdNb2RlbC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBMaXN0ZW4gZm9yIGNoYW5nZSBldmVudHMgdG8gZW5hYmxlIGJpbmRpbmdcblx0XHRcdFx0ZWxlbWVudC5vbignYmx1ciBrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KHJlYWRWaWV3VGV4dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTm8gbmVlZCB0byBpbml0aWFsaXplLCBBbmd1bGFySlMgd2lsbCBpbml0aWFsaXplIHRoZSB0ZXh0IGJhc2VkIG9uIG5nLW1vZGVsIGF0dHJpYnV0ZVxuXG5cdFx0XHRcdC8vIFdyaXRlIGRhdGEgdG8gdGhlIG1vZGVsXG5cdFx0XHRcdGZ1bmN0aW9uIHJlYWRWaWV3VGV4dCgpIHtcblx0XHRcdFx0XHR2YXIgaHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xuXHRcdFx0XHRcdC8vIFdoZW4gd2UgY2xlYXIgdGhlIGNvbnRlbnQgZWRpdGFibGUgdGhlIGJyb3dzZXIgbGVhdmVzIGEgPGJyPiBiZWhpbmRcblx0XHRcdFx0XHQvLyBJZiBzdHJpcC1iciBhdHRyaWJ1dGUgaXMgcHJvdmlkZWQgdGhlbiB3ZSBzdHJpcCB0aGlzIG91dFxuXHRcdFx0XHRcdGlmIChhdHRycy5zdHJpcEJyICYmIGh0bWwgPT0gJzxicj4nKSB7XG5cdFx0XHRcdFx0XHRodG1sID0gJyc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShodG1sKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZpbGVEcm9wem9uZScsIGZ1bmN0aW9uICh0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG4gICAgICAgIGZpbGU6ICc9JyxcbiAgICAgICAgZmlsZU5hbWU6ICc9J1xuICAgICAgfSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0dmFyIGNoZWNrU2l6ZSwgaXNUeXBlVmFsaWQsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIsIHZhbGlkTWltZVR5cGVzO1xuXHRcdFx0XHRwcm9jZXNzRHJhZ092ZXJPckVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsaWRNaW1lVHlwZXMgPSBhdHRycy5maWxlRHJvcHpvbmU7XG5cdFx0XHRcdGNoZWNrU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG5cdFx0XHRcdFx0dmFyIF9yZWY7XG5cdFx0XHRcdFx0aWYgKCgoX3JlZiA9IGF0dHJzLm1heEZpbGVTaXplKSA9PT0gKHZvaWQgMCkgfHwgX3JlZiA9PT0gJycpIHx8IChzaXplIC8gMTAyNCkgLyAxMDI0IDwgYXR0cnMubWF4RmlsZVNpemUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkZpbGUgbXVzdCBiZSBzbWFsbGVyIHRoYW4gXCIgKyBhdHRycy5tYXhGaWxlU2l6ZSArIFwiIE1CXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aXNUeXBlVmFsaWQgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdFx0XHRcdGlmICgodmFsaWRNaW1lVHlwZXMgPT09ICh2b2lkIDApIHx8IHZhbGlkTWltZVR5cGVzID09PSAnJykgfHwgdmFsaWRNaW1lVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiRmlsZSBtdXN0IGJlIG9uZSBvZiBmb2xsb3dpbmcgdHlwZXMgXCIgKyB2YWxpZE1pbWVUeXBlcywgJ0ludmFsaWQgZmlsZSB0eXBlIScpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdvdmVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ2VudGVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmJpbmQoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSwgbmFtZSwgcmVhZGVyLCBzaXplLCB0eXBlO1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tTaXplKHNpemUpICYmIGlzVHlwZVZhbGlkKHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhzY29wZS5maWxlTmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5maWxlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG5cdFx0XHRcdFx0LypuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsqL1xuXHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0ZpbGVEcm9wem9uZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSGlzdG9yeUN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpe1xuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLnNldERhdGEgPSBzZXREYXRhO1xuXHRcdGFjdGl2YXRlKCk7XG5cdFxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3InLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHQvL3JlcXVpcmU6ICdpdGVtJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMsIGl0ZW1Nb2RlbCApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQvKnNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbU1vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyLCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBbXTtcblx0XHR2bS5kYXRhcHJvdmlkZXJzID0gW107XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gbnVsbDtcblx0XHR2bS5zZWFyY2hUZXh0ID0gbnVsbDtcblx0XHR2bS5zZWFyY2hVbml0ID0gbnVsbDtcblx0XHR2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuXHRcdHZtLnF1ZXJ5VW5pdCA9IHF1ZXJ5VW5pdDtcblxuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uY3JlYXRlUHJvdmlkZXIgPSBjcmVhdGVQcm92aWRlcjtcblx0XHR2bS5jcmVhdGVVbml0ID0gY3JlYXRlVW5pdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHF1ZXJ5VW5pdChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5tZWFzdXJlVHlwZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uZGF0YXByb3ZpZGVycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YXByb3ZpZGVycycpLiRvYmplY3Q7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5tZWFzdXJlVHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lYXN1cmVfdHlwZXMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnKS4kb2JqZWN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50eXBlICYmIHZtLml0ZW0uZGF0YXByb3ZpZGVyICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbCgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gY2hlY2tCYXNlKCkgJiYgdm0uaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZSgpe1xuXHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogSVRTIEEgSEFDSyBUTyBHRVQgSVQgV09SSzogbmctY2xpY2sgdnMgbmctbW91c2Vkb3duXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUHJvdmlkZXIodGV4dCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkUHJvdmlkZXInLCAkc2NvcGUpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVVbml0KHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFVuaXQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdCAgICB2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdCAgfVxuXHRcdH0sdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvck1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGl0ZW06ICc9aXRlbSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvck1lbnVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBjbCA9ICdhY3RpdmUnO1xuXHRcdFx0XHR2YXIgZWwgPSBlbGVtZW50WzBdO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnQoKTtcblx0XHRcdFx0cGFyZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhjbCk7XG5cdFx0XHRcdH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcyhjbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpY2F0b3JNZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5sb2NrZWQgPSBsb2NrZWQ7XG5cdFx0dm0uY2hhbmdlT2ZmaWNpYWwgPSBjaGFuZ2VPZmZpY2lhbDtcblxuXHRcdGZ1bmN0aW9uIGxvY2tlZCgpe1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uaXNfb2ZmaWNpYWwgPyAnbG9ja19vcGVuJyA6ICdsb2NrJztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hhbmdlT2ZmaWNpYWwoKXtcblx0XHRcdHZtLml0ZW0uaXNfb2ZmaWNpYWwgPSAhdm0uaXRlbS5pc19vZmZpY2lhbDtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG5cdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLm1lYXN1cmVfdHlwZV9pZCAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9ycycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvcnMvaW5kaWNhdG9ycy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0/Jyxcblx0XHRcdFx0aW5kaWNhdG9yczogJz1pdGVtcycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRhY3RpdmU6ICc9Pydcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yc0N0cmwnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNlbGVjdEFsbEdyb3VwID0gc2VsZWN0QWxsR3JvdXA7XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtO1xuXHRcdHZtLnRvZ2dsZVNlbGVjdGlvbiA9IHRvZ2dsZVNlbGVjdGlvbjtcblx0XHR2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuXG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0c29ydDondGl0bGUnLFxuXHRcdFx0cmV2ZXJzZTpmYWxzZSxcblx0XHRcdGxpc3Q6IDAsXG5cdFx0XHRwdWJsaXNoZWQ6IGZhbHNlLFxuXHRcdFx0dHlwZXM6IHtcblx0XHRcdFx0dGl0bGU6IHRydWUsXG5cdFx0XHRcdHN0eWxlOiBmYWxzZSxcblx0XHRcdFx0Y2F0ZWdvcmllczogZmFsc2UsXG5cdFx0XHRcdGluZm9ncmFwaGljOiBmYWxzZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGZhbHNlLFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uc2VhcmNoID0ge1xuXHRcdFx0cXVlcnk6ICcnLFxuXHRcdFx0c2hvdzogZmFsc2Vcblx0XHR9O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlTGlzdCA9IHRvZ2dsZUxpc3Q7XG5cblxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGlzdChrZXkpe1xuXHRcdFx0aWYodm0udmlzaWJsZUxpc3QgPT0ga2V5KXtcblx0XHRcdFx0dm0udmlzaWJsZUxpc3QgPSAnJztcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0ga2V5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdGVkSXRlbShpdGVtKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0QWxsKCl7XG5cdFx0XHRpZih2bS5zZWxlY3Rpb24ubGVuZ3RoKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdFx0aWYodm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSkge1xuXHRcdFx0dmFyIGluZGV4ID0gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbEdyb3VwKGdyb3VwKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWxldGVTZWxlY3RlZCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdFx0RGF0YVNlcnZpY2UucmVtb3ZlKCdpbmRpY2F0b3JzJywgaXRlbS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdHZtLmluZGljYXRvcnMuc3BsaWNlKHZtLmluZGljYXRvcnMuaW5kZXhPZihpdGVtKSwxKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvKiRzY29wZS4kd2F0Y2goJ3ZtLnNlYXJjaC5xdWVyeScsIGZ1bmN0aW9uIChxdWVyeSwgb2xkUXVlcnkpIHtcblx0XHRcdGlmKHF1ZXJ5ID09PSBvbGRRdWVyeSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0dm0ucXVlcnkgPSB2bS5maWx0ZXIudHlwZXM7XG5cdFx0XHR2bS5xdWVyeS5xID0gcXVlcnk7XG5cdFx0XHR2bS5pdGVtcyA9IENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh2bS5xdWVyeSk7XG5cdFx0fSk7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpemVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaXplcy9pbmRpemVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGl6ZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGl6ZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRmaWx0ZXIsICR0aW1lb3V0LCB0b2FzdHIsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cdFx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0XHR2bS5iYXNlT3B0aW9ucyA9IHtcblx0XHRcdGRyYWc6dHJ1ZSxcblx0XHRcdGFsbG93RHJvcDp0cnVlLFxuXHRcdFx0YWxsb3dEcmFnOnRydWUsXG5cdFx0XHRhbGxvd01vdmU6dHJ1ZSxcblx0XHRcdGFsbG93U2F2ZTp0cnVlLFxuXHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdGFsbG93QWRkQ29udGFpbmVyOnRydWUsXG5cdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0ZWRpdGFibGU6dHJ1ZSxcblx0XHRcdGFzc2lnbWVudHM6IHRydWUsXG5cdFx0XHRzYXZlQ2xpY2s6IHNhdmUsXG5cdFx0XHRhZGRDbGljazogdm0ub3B0aW9ucy5pbmRpemVzLmFkZENsaWNrLFxuXHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDb250YWluZXJDbGljayxcblx0XHRcdGRlbGV0ZURyb3A6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVEcm9wLFxuXHRcdFx0ZGVsZXRlQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5kZWxldGVDbGlja1xuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmNhdGVnb3JpZXMgPSBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHt0cmVlOnRydWV9KTtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC90eXBlcycpLiRvYmplY3Q7XG5cblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLml0ZW1fdHlwZV9pZCA9IDE7XG5cdFx0XHRcdHZtLml0ZW0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLml0ZW1fdHlwZV9pZCAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UudXBkYXRlSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6dm0uaXRlbS5pZCxuYW1lOnJlc3BvbnNlLm5hbWV9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLml0ZW0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdEYXRhIHN1Y2Nlc3NmdWxseSBzYXZlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UuYWRkSXRlbShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6cmVzcG9uc2UuaWQsIG5hbWU6cmVzcG9uc2UubmFtZX0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW1zKGV2ZW50LCBpdGVtKXtcblx0XHQvL1x0Y29uc29sZS5sb2codm0uaXRlbSwgaXRlbSk7XG5cblx0XHR9XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uaXRlbScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0aWYobiAhPSBvKSB7XG5cdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9ICFhbmd1bGFyLmVxdWFscyh2bS5pdGVtLCB2bS5vcmlnaW5hbCk7XG5cdFx0XHR9XG5cdFx0fSx0cnVlKTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHR2YXIgbWF4ID0gMCwgbWluID0gMDtcblx0XHRcdFx0b3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsICRzY29wZS5vcHRpb25zKTtcblxuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdFx0bWluID0gZDMubWluKFttaW4sIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oW21pbiwgbWF4XSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblxuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChtaW4pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgJ2xvd2VyVmFsdWUnKTtcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0XHRpZihtYXggPiAxMDAwKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludChtYXgpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiIDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWF4XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsICd1cHBlclZhbHVlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHNsaWRlciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKTtcblx0XHRcdFx0aWYob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKXtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHQuYXR0cigneDEnLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICdyZ2JhKDAsMCwwLDg3KScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVDb250ID0gc2xpZGVyLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMuaGVpZ2h0IC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgb3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihwYXJzZUludCh2YWx1ZSkgPiAxMDAwKXtcblx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KHZhbHVlKSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgbWF4KTtcblxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG4uY29sb3I7XG5cdFx0XHRcdFx0Z3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkK1wiX1wiK24uY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWN0LnN0eWxlKCdmaWxsJywgJ3VybCgjJyArIG9wdGlvbnMuZmllbGQgKyAnXycrbi5jb2xvcisnKScpO1xuXHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdGlmKG5nTW9kZWwuJG1vZGVsVmFsdWUpe1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQoMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KDApKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgoMCkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHRcdG1pbiA9IDA7XG5cdFx0XHRcdFx0XHRtYXggPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRcdFx0bWluID0gZDMubWluKFttaW4sIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRcdFx0aWYobmF0LmlzbyA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlLmlzbyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5hdFtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXHRcdFx0XHRcdFx0YnJ1c2gueCh4KVxuXHRcdFx0XHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXHRcdFx0XHRcdFx0bGVnZW5kLnNlbGVjdCgnI2xvd2VyVmFsdWUnKS50ZXh0KG1pbik7XG5cdFx0XHRcdFx0XHRsZWdlbmQyLnNlbGVjdCgnI3VwcGVyVmFsdWUnKS50ZXh0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8vVERPRE86IENIY2tpY2sgaWYgbm8gY29tbWEgdGhlcmVcblx0XHRcdFx0XHRcdFx0aWYobWF4ID4gMTAwMCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1heFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRpZihuYXQuaXNvID09IG5nTW9kZWwuJG1vZGVsVmFsdWUuaXNvKXtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdNZWRpYW5DdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L3BhcnNlQ29uZmxpY3RDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdENzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0bmF0aW9uczogJz0nLFxuXHRcdFx0XHRzdW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0c2NvcGUubmF0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbnVtYmVycyA9IHJvdy5kYXRhWzBdLmNvbmZsaWN0cy5tYXRjaCgvWzAtOV0rL2cpLm1hcChmdW5jdGlvbihuKVxuXHRcdFx0XHRcdFx0XHRcdHsvL2p1c3QgY29lcmNlIHRvIG51bWJlcnNcblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuICsobik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0uZXZlbnRzID0gbnVtYmVycztcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5zdW0gKz0gbnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUubmF0aW9ucy5wdXNoKHJvdy5kYXRhWzBdKTtcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlQ29uZmxpY3RFdmVudHNDc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L3BhcnNlQ29uZmxpY3RFdmVudHNDc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZXZlbnRzOiAnPScsXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cdHNjb3BlLmV2ZW50cyA9IFtdO1xuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHN0ZXA6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHJvdy5kYXRhWzBdLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2ludGVyc3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnRyYXN0YXRlJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmRhdGFbMF0udHlwZV9pZCA9IDI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnc3Vic3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMztcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5lcnJvcnMubGVuZ3RoID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcGUuZXZlbnRzLnB1c2gocm93LmRhdGFbMF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocm93KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2VDb25mbGljdEV2ZW50c0NzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3BhcnNlY3N2JywgZnVuY3Rpb24gKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgSW5kZXhTZXJ2aWNlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2Vjc3ZDdHJsJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCxcblx0XHRcdFx0XHRyb3dDb3VudCA9IDAsXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCA9IDAsXG5cdFx0XHRcdFx0Zmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0aW5wdXQuY3NzKHtcblx0XHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhQYXBhKTtcblx0XHRcdFx0XHRcdHZhciBzaXplID0gaW5wdXRbMF0uZmlsZXNbMF0uc2l6ZTtcblx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLCB7XG5cdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRoZWFkZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGZhc3RNb2RlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHQvL3dvcmtlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Ly9JRiBcInN0ZXBcIiBpbnN0ZWFkIG9mIFwiY2h1bmtcIiA+IGNodW5rID0gcm93IGFuZCBjaHVuay5kYXRhID0gcm93LmRhdGFbMF1cblx0XHRcdFx0XHRcdFx0Y2h1bms6IGZ1bmN0aW9uIChjaHVuaykge1xuXHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjaHVuay5kYXRhLCBmdW5jdGlvbiAocm93LCBpbmRleCkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTp7fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzOltdXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCIjTkFcIiAvKnx8IGl0ZW0gPCAwKi8gfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoga2V5LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogaXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHIuZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNWZXJ0aWNhbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS5sZW5ndGggPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByYXdMaXN0W2tleV0uZGF0YSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YS5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vcmF3TGlzdFtrZXldLmVycm9ycyA9IHJvdy5lcnJvcnM7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL0lGIFwic3RlcFwiIGluc3RlYWQgb2YgXCJjaHVua1wiOiByID4gcm93LmRhdGEgPSByb3cuZGF0YVswXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyLmRhdGEgPSByb3c7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEocik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGJlZm9yZUZpcnN0Q2h1bms6IGZ1bmN0aW9uIChjaHVuaykge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGVyZSBhcmUgcG9pbnRzIGluIHRoZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gY2h1bmsubWF0Y2goL1xcclxcbnxcXHJ8XFxuLykuaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGRlbGltaXRlciA9ICcsJztcblx0XHRcdFx0XHRcdFx0XHR2YXIgaGVhZGluZ3MgPSBjaHVuay5zdWJzdHIoMCwgaW5kZXgpLnNwbGl0KCcsJyk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3MubGVuZ3RoIDwgMikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3MgPSBjaHVuay5zdWJzdHIoMCwgaW5kZXgpLnNwbGl0KFwiXFx0XCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsaW1pdGVyID0gJ1xcdCc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHZhciBpc0lzbyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5nc1tpXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnJlcGxhY2UoL1teYS16MC05XS9naSwgJ18nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0uaW5kZXhPZignLicpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnN1YnN0cigwLCBoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkID0gaGVhZGluZ3NbaV0uc3BsaXQoJ18nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBoZWFkLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOYU4oaGVhZFtqXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gJ18nO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9IGhlYWRbal07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldLmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNJc28ucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3MubGVuZ3RoID09IGlzSXNvLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJhd0xpc3RbaGVhZGluZ3NbaV1dID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXSA9IHt9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gaGVhZGluZ3Muam9pbihkZWxpbWl0ZXIpICsgY2h1bmsuc3Vic3RyKGluZGV4KTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChlcnIsIGZpbGUpIHtcblx0XHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0RXJyb3JzKGVycm9ycyk7XG5cblx0XHRcdFx0XHRcdFx0XHQvL1NlZSBpZiB0aGVyZSBpcyBhbiBmaWVsZCBuYW1lIFwiaXNvXCIgaW4gdGhlIGhlYWRpbmdzO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghaXNWZXJ0aWNhbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKEluZGV4U2VydmljZS5nZXRGaXJzdEVudHJ5KCkuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdpc28nKSAhPSAtMSB8fCBrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb2RlJykgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY291bnRyeScpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldENvdW50cnlGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd5ZWFyJykgIT0gLTEgJiYgaXRlbS50b1N0cmluZygpLmxlbmd0aCA9PSA0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFllYXJGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJhd0xpc3QsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9Mb3dlckNhc2UoKSAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNvOiBrZXkudG9VcHBlckNhc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZGF0YSwgZnVuY3Rpb24gKGNvbHVtbiwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0clsnY29sdW1uXycgKyBpXSA9IGNvbHVtbjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihjb2x1bW4pIHx8IGNvbHVtbiA8IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCJOQVwiIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMrKztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogW3JdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzOiBpdGVtLmVycm9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZCgnaXNvJyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHR0b2FzdHIuaW5mbyhJbmRleFNlcnZpY2UuZ2V0RGF0YVNpemUoKSArICcgbGluZXMgaW1wb3J0ZXQhJywgJ0luZm9ybWF0aW9uJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2Vjc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGllY2hhcnQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9waWVjaGFydC9waWVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQaWVjaGFydEN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRkYXRhOiAnPWNoYXJ0RGF0YScsXG5cdFx0XHRcdGFjdGl2ZVR5cGU6ICc9Jyxcblx0XHRcdFx0YWN0aXZlQ29uZmxpY3Q6ICc9Jyxcblx0XHRcdFx0Y2xpY2tJdDonJidcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdCBmdW5jdGlvbiBzZWdDb2xvcihjKXsgcmV0dXJuIHtpbnRlcnN0YXRlOlwiIzgwN2RiYVwiLCBpbnRyYXN0YXRlOlwiI2UwODIxNFwiLHN1YnN0YXRlOlwiIzQxYWI1ZFwifVtjXTsgfVxuXG5cdFx0XHRcdHZhciBwQyA9e30sIHBpZURpbSA9e3c6MTUwLCBoOiAxNTB9O1xuICAgICAgICBwaWVEaW0uciA9IE1hdGgubWluKHBpZURpbS53LCBwaWVEaW0uaCkgLyAyO1xuXG5cdFx0XHRcdHZhciBwaWVzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBpZURpbS53KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgcGllRGltLmgpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnb3V0ZXItcGllJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitwaWVEaW0udy8yK1wiLFwiK3BpZURpbS5oLzIrXCIpXCIpO1xuXHRcdFx0XHR2YXIgcGllc3ZnMiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGllRGltLncpXG5cdFx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdpbm5lci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cbiAgICAgICAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRvIGRyYXcgdGhlIGFyY3Mgb2YgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBhcmMgPSBkMy5zdmdcblx0XHRcdFx0XHQuYXJjKClcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMocGllRGltLnIgLSAxMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMocGllRGltLnIgLSAyMyk7XG4gICAgICAgIHZhciBhcmMyID0gZDMuc3ZnXG5cdFx0XHRcdFx0LmFyYygpXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKHBpZURpbS5yIC0gMjMpXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKDApO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgdGhlIHBpZSBzbGljZSBhbmdsZXMuXG4gICAgICAgIHZhciBwaWUgPSBkMy5sYXlvdXRcblx0XHRcdFx0XHQucGllKClcblx0XHRcdFx0XHQuc29ydChudWxsKVxuXHRcdFx0XHRcdC52YWx1ZShmdW5jdGlvbihkKSB7IHJldHVybiBkLmNvdW50OyB9KTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwaWUgc2xpY2VzLlxuICAgICAgICB2YXIgYzEgPSBwaWVzdmdcblx0XHRcdFx0XHRcdC5kYXR1bShzY29wZS5kYXRhKVxuXHRcdFx0XHRcdFx0LnNlbGVjdEFsbChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5kYXRhKHBpZSlcblx0XHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwicGF0aFwiKS5hdHRyKFwiZFwiLCBhcmMpXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHRoaXMuX2N1cnJlbnQgPSBkOyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIixtb3VzZW92ZXIpLm9uKFwibW91c2VvdXRcIixtb3VzZW91dCk7XG5cdFx0XHRcdHZhciBjMiA9IHBpZXN2ZzJcblx0XHRcdFx0XHRcdC5kYXR1bShzY29wZS5kYXRhKVxuXHRcdFx0XHRcdFx0LnNlbGVjdEFsbChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5kYXRhKHBpZSlcblx0XHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYzIpXG5cdFx0ICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHRoaXMuX2N1cnJlbnQgPSBkOyB9KVxuXHRcdCAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcblx0XHQgICAgICAgIC5vbignY2xpY2snLCBtb3VzZWNsaWNrKTtcbiAgICAgICAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRvIHVwZGF0ZSBwaWUtY2hhcnQuIFRoaXMgd2lsbCBiZSB1c2VkIGJ5IGhpc3RvZ3JhbS5cbiAgICAgICAgcEMudXBkYXRlID0gZnVuY3Rpb24obkQpe1xuICAgICAgICAgICAgcGllc3ZnLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobkQpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgIC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVdGlsaXR5IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBtb3VzZW92ZXIgYSBwaWUgc2xpY2UuXG5cdFx0XHRcdHZhciB0eXBldXMgPSBhbmd1bGFyLmNvcHkoc2NvcGUuYWN0aXZlVHlwZSk7XG5cdFx0XHRcdGZ1bmN0aW9uIG1vdXNlY2xpY2soZCl7XG5cdFx0XHRcdFx0c2NvcGUuY2xpY2tJdCh7dHlwZV9pZDpkLmRhdGEudHlwZV9pZH0pO1xuXHRcdFx0XHR9XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlb3ZlcihkKXtcbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBvZiBoaXN0b2dyYW0gd2l0aCBuZXcgZGF0YS5cblx0XHRcdFx0XHRcdHR5cGV1cyA9IGFuZ3VsYXIuY29weShzY29wZS5hY3RpdmVUeXBlKTtcbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZVR5cGUgPSBbZC5kYXRhLnR5cGVfaWRdO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9VdGlsaXR5IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBtb3VzZW91dCBhIHBpZSBzbGljZS5cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdXQoZCl7XG4gICAgICAgICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gb2YgaGlzdG9ncmFtIHdpdGggYWxsIGRhdGEuXG4gICAgICAgICAgICBzY29wZS5hY3RpdmVUeXBlID0gdHlwZXVzO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQW5pbWF0aW5nIHRoZSBwaWUtc2xpY2UgcmVxdWlyaW5nIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHNwZWNpZmllc1xuICAgICAgICAvLyBob3cgdGhlIGludGVybWVkaWF0ZSBwYXRocyBzaG91bGQgYmUgZHJhd24uXG4gICAgICAgIGZ1bmN0aW9uIGFyY1R3ZWVuKGEpIHtcbiAgICAgICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gaSgwKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiBhcmMoaSh0KSk7ICAgIH07XG4gICAgICAgIH1cblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4yKGEpIHtcbiAgICAgICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gaSgwKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiBhcmMyKGkodCkpOyAgICB9O1xuICAgICAgICB9XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHBpZXN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEocGllKG4pKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2Vlbik7XG5cdFx0XHRcdFx0cGllc3ZnMi5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEocGllKG4pKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbjIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BpZWNoYXJ0Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdyb3VuZGJhcicsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0Ly90ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcm91bmRiYXIvcm91bmRiYXIuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUm91bmRiYXJDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Y2hhcnREYXRhJyxcblx0XHRcdFx0YWN0aXZlVHlwZTogJz0nLFxuXHRcdFx0XHRhY3RpdmVDb25mbGljdDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0dmFyIG1hcmdpbiA9IHtcblx0XHRcdFx0XHRcdHRvcDogNDAsXG5cdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRib3R0b206IDMwLFxuXHRcdFx0XHRcdFx0bGVmdDogNDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHdpZHRoID0gMzAwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gMjAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20sXG5cdFx0XHRcdFx0YmFyV2lkdGggPSAyMCxcblx0XHRcdFx0XHRzcGFjZSA9IDI1O1xuXG5cblx0XHRcdFx0dmFyIHNjYWxlID0ge1xuXHRcdFx0XHRcdHk6IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdH07XG5cdFx0XHRcdHNjYWxlLnkuZG9tYWluKFswLCAyMjBdKTtcblx0XHRcdFx0c2NhbGUueS5yYW5nZShbaGVpZ2h0LCAwXSk7XG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG5cblx0XHRcdFx0Ly94LmRvbWFpbihzY29wZS5kYXRhLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLmxldHRlcjsgfSkpO1xuXHRcdFx0XHQvL3kuZG9tYWluKFswLCBkMy5tYXgoc2NvcGUuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mcmVxdWVuY3k7IH0pXSk7XG5cdFx0XHRcdHZhciBiYXJzID0gc3ZnLnNlbGVjdEFsbCgnLmJhcnMnKS5kYXRhKHNjb3BlLmRhdGEpLmVudGVyKCkuYXBwZW5kKFwiZ1wiKS5hdHRyKCdjbGFzcycsICdiYXJzJyk7IC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBpICogMjAgKyBcIiwgMClcIjsgfSk7O1xuXG5cdFx0XHRcdHZhciBiYXJzQmcgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgMCwgYmFyV2lkdGgsIChoZWlnaHQpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdiZycpO1xuXHRcdFx0XHR2YXIgdmFsdWVCYXJzID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJvdW5kZWRfcmVjdCgoaSAqIChiYXJXaWR0aCArIHNwYWNlKSksIChzY2FsZS55KGQudmFsdWUpKSwgYmFyV2lkdGgsIChoZWlnaHQgLSBzY2FsZS55KGQudmFsdWUpKSwgYmFyV2lkdGggLyAyLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi5hdHRyKCd4JywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzY2FsZS55KGQudmFsdWUpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KSovXG5cblx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvclxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LyoudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uKDMwMDApXG5cdFx0XHRcdFx0LmVhc2UoXCJxdWFkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSlcblx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdDtcblxuXHRcdFx0XHR2YXIgdmFsdWVUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpO1xuXG5cdFx0XHRcdHZhbHVlVGV4dC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnZhbHVlXG5cdFx0XHRcdFx0fSkuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgLTgpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsJyM0ZmIwZTUnKTtcblxuXHRcdFx0XHR2YXIgbGFiZWxzVGV4dCA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRsYWJlbHNUZXh0LnRleHQoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5sYWJlbFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpICogKGJhcldpZHRoICsgc3BhY2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGhlaWdodCArIDIwKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcldpZHRoXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRmdW5jdGlvbiByb3VuZGVkX3JlY3QoeCwgeSwgdywgaCwgciwgdGwsIHRyLCBibCwgYnIpIHtcblx0XHRcdFx0XHR2YXIgcmV0dmFsO1xuXHRcdFx0XHRcdHJldHZhbCA9IFwiTVwiICsgKHggKyByKSArIFwiLFwiICsgeTtcblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAodyAtIDIgKiByKTtcblx0XHRcdFx0XHRpZiAodHIpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIHIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAoaCAtIDIgKiByKTtcblx0XHRcdFx0XHRpZiAoYnIpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIC1yICsgXCIsXCIgKyByO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyByO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICgyICogciAtIHcpO1xuXHRcdFx0XHRcdGlmIChibCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIC1yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAoMiAqIHIgLSBoKTtcblx0XHRcdFx0XHRpZiAodGwpIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImFcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIDAgMSBcIiArIHIgKyBcIixcIiArIC1yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJ2XCIgKyAtcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInpcIjtcblx0XHRcdFx0XHRyZXR1cm4gcmV0dmFsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHQvL3NjYWxlLnkuZG9tYWluKFswLCA1MF0pO1xuXG5cdFx0XHRcdFx0XHR2YWx1ZUJhcnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYm9yZGVycyA9IGJhcldpZHRoIC8gMjtcblx0XHRcdFx0XHRcdFx0XHRpZihzY29wZS5kYXRhW2ldLnZhbHVlIDw9IDEwKXtcblx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlcnMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoc2NvcGUuZGF0YVtpXS52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoc2NvcGUuZGF0YVtpXS52YWx1ZSkpLCBib3JkZXJzLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHZhbHVlVGV4dC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS50d2VlbigndGV4dCcsIGZ1bmN0aW9uIChkLGkpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGQudmFsdWUpLCBwYXJzZUludChzY29wZS5kYXRhW2ldLnZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fSkuZWFjaCgnZW5kJywgZnVuY3Rpb24oZCwgaSl7XG5cdFx0XHRcdFx0XHRcdFx0ZC52YWx1ZSA9IHNjb3BlLmRhdGFbaV0udmFsdWU7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1JvdW5kYmFyQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzaW1wbGVsaW5lY2hhcnQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU2ltcGxlbGluZWNoYXJ0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0ZGF0YTonPScsXG5cdFx0XHRcdHNlbGVjdGlvbjonPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cblxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2ltcGxlbGluZWNoYXJ0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0dm0ub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIHZtLm9wdGlvbnMpO1xuXHRcdHZtLmNvbmZpZyA9IHtcblx0XHRcdHZpc2libGU6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGV4dGVuZGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGF1dG9yZWZyZXNoOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRyZWZyZXNoRGF0YU9ubHk6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoT3B0aW9uczogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVlcFdhdGNoRGF0YTogdHJ1ZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaENvbmZpZzogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVib3VuY2U6IDEwIC8vIGRlZmF1bHQ6IDEwXG5cdFx0fTtcblx0XHR2bS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRjYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0c2V0Q2hhcnQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlQ2hhcnQoKXtcblx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQuZm9yY2VZID0gW3ZtLnJhbmdlLm1heCwgdm0ucmFuZ2UubWluXTtcblx0XHR9XG5cdCBcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydCA9IHtcblx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdGR1cmF0aW9uOjEwMCxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHQvL3Nob3dZQXhpczogZmFsc2UsXG5cblx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdC8vdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdGZvcmNlWTogW3ZtLnJhbmdlLm1heCwgdm0ucmFuZ2UubWluXSxcblx0XHRcdFx0Ly95RG9tYWluOltwYXJzZUludCh2bS5yYW5nZS5taW4pLCB2bS5yYW5nZS5tYXhdLFxuXHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJ1llYXInLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodm0ub3B0aW9ucy5pbnZlcnQgPT0gdHJ1ZSkge1xuXHRcdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2codm0uY2hhcnQpXG5cdFx0XHRyZXR1cm4gdm0uY2hhcnQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWluOiAxMDAwXG5cdFx0XHR9O1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSBNYXRoLm1heCh2bS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IE1hdGgubWluKHZtLnJhbmdlLm1pbiwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnJhbmdlLm1heCsrO1xuXHRcdFx0dm0ucmFuZ2UubWluLS07XG5cdFx0XHR2bS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYgKHZtLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHR1cGRhdGVDaGFydCgpO1xuXG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uc2VsZWN0aW9uJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHQvL1x0dXBkYXRlQ2hhcnQoKTtcblx0XHRcdC8vY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5hbmltYXRpb24oJy5zbGlkZS10b2dnbGVzJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc3R5bGVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdHlsZXMvc3R5bGVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N0eWxlc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0c3R5bGVzOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdHlsZXNDdHJsJywgZnVuY3Rpb24gKHRvYXN0ciwgRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0udG9nZ2xlU3R5bGUgPSB0b2dnbGVTdHlsZTtcblx0XHR2bS5zZWxlY3RlZFN0eWxlID0gc2VsZWN0ZWRTdHlsZTtcblx0XHR2bS5zYXZlU3R5bGUgPSBzYXZlU3R5bGU7XG5cdFx0dm0uc3R5bGUgPSBbXTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZVN0eWxlKHN0eWxlKSB7XG5cdFx0XHRpZiAodm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCkge1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlX2lkID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGVfaWQgPSBzdHlsZS5pZFxuXHRcdFx0XHR2bS5pdGVtLnN0eWxlID0gc3R5bGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdGVkU3R5bGUoaXRlbSwgc3R5bGUpIHtcblx0XHRcdHJldHVybiB2bS5pdGVtLnN0eWxlX2lkID09IHN0eWxlLmlkID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlU3R5bGUoKSB7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdzdHlsZXMnLCB2bS5zdHlsZSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHR2bS5zdHlsZXMucHVzaChkYXRhKTtcblx0XHRcdFx0dm0uY3JlYXRlU3R5bGUgPSBmYWxzZTtcblx0XHRcdFx0XHR2bS5zdHlsZSA9IFtdO1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlID0gZGF0YTtcblx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBTdHlsZSBoYXMgYmVlbiBzYXZlZCcsICdTdWNjZXNzJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdWJpbmRleCcsIHN1YmluZGV4KTtcblxuXHRzdWJpbmRleC4kaW5qZWN0ID0gWyckdGltZW91dCcsICdzbW9vdGhTY3JvbGwnXTtcblxuXHRmdW5jdGlvbiBzdWJpbmRleCgkdGltZW91dCwgc21vb3RoU2Nyb2xsKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1YmluZGV4Q3RybCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguaHRtbCcsXG5cdFx0XHRsaW5rOiBzdWJpbmRleExpbmtGdW5jdGlvblxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJpbmRleExpbmtGdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdH1cblx0fVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1YmluZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgJHRpbWVvdXQpIHtcblx0XHQkc2NvcGUuaW5mbyA9IGZhbHNlO1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IHNldENoYXJ0O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGNhbGN1bGF0ZUdyYXBoO1xuXHRcdCRzY29wZS5jcmVhdGVJbmRleGVyID0gY3JlYXRlSW5kZXhlcjtcblx0XHQkc2NvcGUuY2FsY1N1YlJhbmsgPSBjYWxjU3ViUmFuaztcblx0XHQkc2NvcGUudG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMgPSBjcmVhdGVPcHRpb25zO1xuXHRcdCRzY29wZS5nZXRTdWJSYW5rID0gZ2V0U3ViUmFuaztcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2Rpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbihuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRcdGlmIChuZXdJdGVtID09PSBvbGRJdGVtKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCkge1xuXHRcdFx0JHNjb3BlLmluZm8gPSAhJHNjb3BlLmluZm87XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNhbGNTdWJSYW5rKCkge1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGl0ZW1bJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZV0gPSBwYXJzZUZsb2F0KGl0ZW1bJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG5cdFx0XHR9KVxuXHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUuZXBpLCBbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZmlsdGVyW2ldLmlzbyA9PSAkc2NvcGUuY3VycmVudC5pc28pIHtcblx0XHRcdFx0XHRyYW5rID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCRzY29wZS5jdXJyZW50WyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRTdWJSYW5rKGNvdW50cnkpe1xuXHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUuZXBpLCBbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcblx0XHRcdFx0XHRyYW5rID0ga2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByYW5rKzE7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUluZGV4ZXIoKSB7XG5cdFx0XHQkc2NvcGUuaW5kZXhlciA9IFskc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmRhdGFdO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMoKSB7XG5cdFx0XHQkc2NvcGUubWVkaWFuT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuY29sb3IsXG5cdFx0XHRcdGZpZWxkOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsXG5cdFx0XHRcdGhhbmRsaW5nOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOntcblx0XHRcdFx0XHRsZWZ0OjEwXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHQkc2NvcGUubWVkaWFuT3B0aW9uc0JpZyA9IHtcblx0XHRcdFx0Y29sb3I6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuY29sb3IsXG5cdFx0XHRcdGZpZWxkOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsXG5cdFx0XHRcdGhhbmRsaW5nOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOntcblx0XHRcdFx0XHRsZWZ0OjIwXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0Q2hhcnQoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdFx0XHQvL2hlaWdodDogMjAwLFxuXHRcdFx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eDogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHk6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRcdFx0Zm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJydcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHRcdGJvdHRvbTogMzBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0XHRcdGludGVycG9sYXRlOiAnY2FyZGluYWwnXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlR3JhcGgoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb3VudHJ5LmVwaSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHg6IGRhdGEueWVhcixcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5jb2x1bW5fbmFtZV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3VuYnVyc3QnLCBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQgbW9kZTogJ3NpemUnXG5cdFx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Ly90ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3VuYnVyc3RDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0dmFyIHdpZHRoID0gNjEwLFxuXHRcdFx0XHRcdGhlaWdodCA9IHdpZHRoLFxuXHRcdFx0XHRcdHJhZGl1cyA9ICh3aWR0aCkgLyAyLFxuXHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCwgMiAqIE1hdGguUEldKSxcblx0XHRcdFx0XHR5ID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMS4zKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMCwgcmFkaXVzXSksXG5cblx0XHRcdFx0XHRwYWRkaW5nID0gMCxcblx0XHRcdFx0XHRkdXJhdGlvbiA9IDEwMDAsXG5cdFx0XHRcdFx0Y2lyY1BhZGRpbmcgPSAxMDtcblxuXHRcdFx0XHR2YXIgZGl2ID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pO1xuXG5cblx0XHRcdFx0dmFyIHZpcyA9IGRpdi5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgcGFkZGluZyAqIDIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgcGFkZGluZyAqIDIpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIFtyYWRpdXMgKyBwYWRkaW5nLCByYWRpdXMgKyBwYWRkaW5nXSArIFwiKVwiKTtcblxuXHRcdFx0XHQvKlxuXHRcdFx0XHRkaXYuYXBwZW5kKFwicFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImludHJvXCIpXG5cdFx0XHRcdFx0XHQudGV4dChcIkNsaWNrIHRvIHpvb20hXCIpO1xuXHRcdFx0XHQqL1xuXG5cdFx0XHRcdHZhciBwYXJ0aXRpb24gPSBkMy5sYXlvdXQucGFydGl0aW9uKClcblx0XHRcdFx0XHQuc29ydChudWxsKVxuXHRcdFx0XHRcdC52YWx1ZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmVuZEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54ICsgZC5keCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIGQueSA/IHkoZC55KSA6IGQueSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCB5KGQueSArIGQuZHkpKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgc3BlY2lhbDEgPSBcIldhc3Rld2F0ZXIgVHJlYXRtZW50XCIsXG5cdFx0XHRcdFx0c3BlY2lhbDIgPSBcIkFpciBQb2xsdXRpb24gUE0yLjUgRXhjZWVkYW5jZVwiLFxuXHRcdFx0XHRcdHNwZWNpYWwzID0gXCJBZ3JpY3VsdHVyYWwgU3Vic2lkaWVzXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDQgPSBcIlBlc3RpY2lkZSBSZWd1bGF0aW9uXCI7XG5cblxuXHRcdFx0XHR2YXIgbm9kZXMgPSBwYXJ0aXRpb24ubm9kZXMoJHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCkpO1xuXG5cdFx0XHRcdHZhciBwYXRoID0gdmlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHBhdGguZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicGF0aC1cIiArIGk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdC5hdHRyKFwiZmlsbC1ydWxlXCIsIFwiZXZlbm9kZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmRlcHRoID8gXCJicmFuY2hcIiA6IFwicm9vdFwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBzZXRDb2xvcilcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBjbGljayk7XG5cblx0XHRcdFx0dmFyIHRleHQgPSB2aXMuc2VsZWN0QWxsKFwidGV4dFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0dmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDEpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcImRlcHRoXCIgKyBkLmRlcHRoO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwic2VjdG9yXCJcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmRlcHRoID8gXCIuMmVtXCIgOiBcIjAuMzVlbVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBjbGljayk7XG5cblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs1XSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKTs7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xpY2soZCkge1xuXHRcdFx0XHRcdC8vIENvbnRyb2wgYXJjIHRyYW5zaXRpb25cblx0XHRcdFx0XHRwYXRoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4oZCkpO1xuXG5cdFx0XHRcdFx0Ly8gU29tZXdoYXQgb2YgYSBoYWNrIGFzIHdlIHJlbHkgb24gYXJjVHdlZW4gdXBkYXRpbmcgdGhlIHNjYWxlcy5cblx0XHRcdFx0XHQvLyBDb250cm9sIHRoZSB0ZXh0IHRyYW5zaXRpb25cblx0XHRcdFx0XHR0ZXh0LnN0eWxlKFwidmlzaWJpbGl0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDI7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IDEgOiAxZS02O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIiwgaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBcImhpZGRlblwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRmdW5jdGlvbiBpc1BhcmVudE9mKHAsIGMpIHtcblx0XHRcdFx0XHRpZiAocCA9PT0gYykgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKHAuY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBwLmNoaWxkcmVuLnNvbWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgYyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gc2V0Q29sb3IoZCkge1xuXG5cdFx0XHRcdFx0Ly9yZXR1cm4gO1xuXHRcdFx0XHRcdGlmIChkLmNvbG9yKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJyNjY2MnO1xuXHRcdFx0XHRcdFx0Lyp2YXIgdGludERlY2F5ID0gMC4yMDtcblx0XHRcdFx0XHRcdC8vIEZpbmQgY2hpbGQgbnVtYmVyXG5cdFx0XHRcdFx0XHR2YXIgeCA9IDA7XG5cdFx0XHRcdFx0XHR3aGlsZSAoZC5wYXJlbnQuY2hpbGRyZW5beF0gIT0gZClcblx0XHRcdFx0XHRcdFx0eCsrO1xuXHRcdFx0XHRcdFx0dmFyIHRpbnRDaGFuZ2UgPSAodGludERlY2F5ICogKHggKyAxKSkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdHJldHVybiBwdXNoZXIuY29sb3IoZC5wYXJlbnQuY29sb3IpLnRpbnQodGludENoYW5nZSkuaHRtbCgnaGV4NicpOyovXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW50ZXJwb2xhdGUgdGhlIHNjYWxlcyFcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4oZCkge1xuXHRcdFx0XHRcdHZhciBteSA9IG1heFkoZCksXG5cdFx0XHRcdFx0XHR4ZCA9IGQzLmludGVycG9sYXRlKHguZG9tYWluKCksIFtkLngsIGQueCArIGQuZHggLSAwLjAwMDldKSxcblx0XHRcdFx0XHRcdHlkID0gZDMuaW50ZXJwb2xhdGUoeS5kb21haW4oKSwgW2QueSwgbXldKSxcblx0XHRcdFx0XHRcdHlyID0gZDMuaW50ZXJwb2xhdGUoeS5yYW5nZSgpLCBbZC55ID8gMjAgOiAwLCByYWRpdXNdKTtcblxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHguZG9tYWluKHhkKHQpKTtcblx0XHRcdFx0XHRcdFx0eS5kb21haW4oeWQodCkpLnJhbmdlKHlyKHQpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG1heFkoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNoaWxkcmVuID8gTWF0aC5tYXguYXBwbHkoTWF0aCwgZC5jaGlsZHJlbi5tYXAobWF4WSkpIDogZC55ICsgZC5keTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1bmJ1cnN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnc3VuYnVyc3QnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA3MDAsXG5cdFx0XHRcdFx0XHRcInN1bmJ1cnN0XCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkaXNwYXRjaFwiOiB7fSxcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcIm1vZGVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogMjA4OCxcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiA1MDAsXG5cdFx0XHRcdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwicmlnaHRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInRvb2x0aXBcIjoge1xuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiZ3Jhdml0eVwiOiBcIndcIixcblx0XHRcdFx0XHRcdFx0XCJkaXN0YW5jZVwiOiAyNSxcblx0XHRcdFx0XHRcdFx0XCJzbmFwRGlzdGFuY2VcIjogMCxcblx0XHRcdFx0XHRcdFx0XCJjbGFzc2VzXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiY2hhcnRDb250YWluZXJcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJmaXhlZFRvcFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImVuYWJsZWRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJoaWRlRGVsYXlcIjogNDAwLFxuXHRcdFx0XHRcdFx0XHRcImhlYWRlckVuYWJsZWRcIjogZmFsc2UsXG5cblx0XHRcdFx0XHRcdFx0XCJvZmZzZXRcIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJoaWRkZW5cIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJkYXRhXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwidG9vbHRpcEVsZW1cIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiBcIm52dG9vbHRpcC05OTM0N1wiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHR2YXIgYnVpbGRUcmVlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHtcblx0XHRcdFx0XHQnbmFtZSc6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0J3NpemUnOiBpdGVtLnNpemUsXG5cdFx0XHRcdFx0J2NvbG9yJzogaXRlbS5jb2xvcixcblx0XHRcdFx0XHQnY2hpbGRyZW4nOiBidWlsZFRyZWUoaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoaXRlbS5jb2xvcil7XG5cdFx0XHRcdFx0Y2hpbGQuY29sb3IgPSBpdGVtLmNvbG9yXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5zaXplKXtcblx0XHRcdFx0XHRjaGlsZC5zaXplID0gaXRlbS5zaXplXG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjaGlsZHJlbjtcblx0XHR9O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSB7XG5cdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUuZGF0YS50aXRsZSxcblx0XHRcdFx0XCJjb2xvclwiOiAkc2NvcGUuZGF0YS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDAwJyxcblx0XHRcdFx0XCJjaGlsZHJlblwiOiBidWlsZFRyZWUoJHNjb3BlLmRhdGEuY2hpbGRyZW4pLFxuXHRcdFx0XHRcInNpemVcIjogMVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3RyZWVtZW51JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvdHJlZW1lbnUvdHJlZW1lbnUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnVHJlZW1lbnVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0aXRlbTonPT8nLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9Pydcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnVHJlZW1lbnVDdHJsJywgZnVuY3Rpb24oKXtcblxuXHR9KVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICd0cmVldmlldycsIGZ1bmN0aW9uKFJlY3Vyc2lvbkhlbHBlcikge1xuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0ZWRpdFdlaWdodDpmYWxzZSxcblx0XHRcdGRyYWc6IGZhbHNlLFxuXHRcdFx0ZWRpdDogZmFsc2UsXG5cdFx0XHRjaGlsZHJlbjonY2hpbGRyZW4nXG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy90cmVldmlldy90cmVldmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdUcmVldmlld0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9PycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRhY3RpdmU6ICc9PycsXG5cdFx0XHRcdGNsaWNrOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRjb21waWxlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gUmVjdXJzaW9uSGVscGVyLmNvbXBpbGUoZWxlbWVudCwgZnVuY3Rpb24oc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMsIGNvbnRyb2xsZXIsIHRyYW5zY2x1ZGVGbil7XG5cdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5leHRlbmQob3B0aW9ucywgc2NvcGUudm0ub3B0aW9ucylcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZpbmUgeW91ciBub3JtYWwgbGluayBmdW5jdGlvbiBoZXJlLlxuICAgICAgICAgICAgICAgIC8vIEFsdGVybmF0aXZlOiBpbnN0ZWFkIG9mIHBhc3NpbmcgYSBmdW5jdGlvbixcbiAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGFsc28gcGFzcyBhbiBvYmplY3Qgd2l0aFxuICAgICAgICAgICAgICAgIC8vIGEgJ3ByZSctIGFuZCAncG9zdCctbGluayBmdW5jdGlvbi5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RyZWV2aWV3Q3RybCcsIGZ1bmN0aW9uKCRmaWx0ZXIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtO1xuXHRcdHZtLmNoaWxkU2VsZWN0ZWQgPSBjaGlsZFNlbGVjdGVkO1xuXHRcdHZtLnRvZ2dsZVNlbGVjdGlvbiA9IHRvZ2dsZVNlbGVjdGlvbjtcblx0XHR2bS5vbkRyYWdPdmVyID0gb25EcmFnT3Zlcjtcblx0XHR2bS5vbkRyb3BDb21wbGV0ZSA9IG9uRHJvcENvbXBsZXRlO1xuXHRcdHZtLm9uTW92ZWRDb21wbGV0ZSA9IG9uTW92ZWRDb21wbGV0ZTtcblx0XHR2bS5hZGRDaGlsZHJlbiA9IGFkZENoaWxkcmVuO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRpZih0eXBlb2Ygdm0uc2VsZWN0aW9uID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbkRyYWdPdmVyKGV2ZW50LCBpbmRleCwgZXh0ZXJuYWwsIHR5cGUpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRHJvcENvbXBsZXRlKGV2ZW50LCBpbmRleCwgaXRlbSwgZXh0ZXJuYWwpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtcywgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IDApe1xuXHRcdFx0XHRcdHZtLml0ZW1zLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Nb3ZlZENvbXBsZXRlKGluZGV4LCBkYXRhLCBldnQpIHtcblx0XHRcdGlmKHZtLm9wdGlvbnMuYWxsb3dNb3ZlKXtcblx0XHRcdFx0cmV0dXJuIHZtLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHRvZ2dsZVNlbGVjdGlvbihpdGVtKXtcblx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oc2VsZWN0ZWQsIGkpe1xuXHRcdFx0XHRpZihzZWxlY3RlZC5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRpbmRleCA9IGk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYoaW5kZXggPiAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENoaWxkcmVuKGl0ZW0pIHtcblxuXHRcdFx0aXRlbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0aXRlbS5leHBhbmRlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbiwgZnVuY3Rpb24oc2VsZWN0ZWQpe1xuXHRcdFx0XHRpZihzZWxlY3RlZC5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdC8qXHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihhbmd1bGFyLmNvcHkoaXRlbSkpID4gLTEpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTsqL1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoaWxkU2VsZWN0ZWQoaXRlbSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihjaGlsZCk+IC0xKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWZvdW5kKXtcblx0XHRcdFx0XHRmb3VuZCA9ICBjaGlsZFNlbGVjdGVkKGNoaWxkKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikgdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID0gW107XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZSxcblx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0sIGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pZCA9PSBpdGVtLmlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5wdXNoKGl0ZW0pIDogdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fSovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbS53ZWlnaHQgPT0gXCJ1bmRlZmluZWRcIiB8fCAhdm0uaXRlbS53ZWlnaHQpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA+PSA5NSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ICs9IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG93ZXJXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA8PSA1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpIC0gNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0IC09IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
