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
			$mdSidenav('leftMenu').close();
		});
		$rootScope.$on("$viewContentLoaded", function(event, toState) {

		});

		$rootScope.$on("$stateChangeSuccess", function(event, toState) {
			$rootScope.stateIsLoading = false;

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

	angular.module( 'app.controllers' ).controller( 'IndicatorsCtrl', ["$scope", function($scope){
		//
		var vm = this;
		vm.selectAllGroup = selectAllGroup;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;


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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbGVhZmxldC5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5qcyIsImNvbmZpZy9yZXN0YW5ndWxhci5qcyIsImNvbmZpZy90aGVtZS5qcyIsImNvbmZpZy90b2FzdHIuanMiLCJmaWx0ZXJzL2FscGhhbnVtLmpzIiwiZmlsdGVycy9jYXBpdGFsaXplLmpzIiwiZmlsdGVycy9maW5kYnluYW1lLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5qcyIsImZpbHRlcnMvbmV3bGluZS5qcyIsImZpbHRlcnMvb3JkZXJPYmplY3RCeS5qcyIsImZpbHRlcnMvcHJvcGVydHkuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvY29udGVudC5qcyIsInNlcnZpY2VzL2NvdW50cmllcy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lcnJvckNoZWNrZXIuanMiLCJzZXJ2aWNlcy9pY29ucy5qcyIsInNlcnZpY2VzL2luZGV4LmpzIiwic2VydmljZXMvaW5kaXplcy5qcyIsInNlcnZpY2VzL3JlY3Vyc2lvbmhlbHBlci5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL3ZlY3RvcmxheWVyLmpzIiwiYXBwL2NvbmZsaWN0SW1wb3J0L2NvbmZsaWN0SW1wb3J0LmpzIiwiYXBwL2NvbmZsaWN0ZGV0YWlscy9jb25mbGljdGRldGFpbHMuanMiLCJhcHAvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiYXBwL2NvbmZsaWN0bmF0aW9uL2NvbmZsaWN0bmF0aW9uLmpzIiwiYXBwL2NvbmZsaWN0cy9jb25mbGljdHMuanMiLCJhcHAvZnVsbExpc3QvZnVsbExpc3QuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9ob21lL2hvbWUuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9pbmRleC9pbmRleC5qcyIsImFwcC9pbmRleC9pbmRleGJhc2UuanMiLCJhcHAvaW5kZXhDaGVjay9pbmRleENoZWNrLmpzIiwiYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuanMiLCJhcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsLmpzIiwiYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5qcyIsImFwcC9pbmRleGNyZWF0b3IvaW5kZXhjcmVhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2NhdGVnb3J5LmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpY2F0b3JzLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGl6ZXMuanMiLCJhcHAvaW5kZXhpbmZvL2luZGV4aW5mby5qcyIsImFwcC9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGljYXRvci9pbmRpY2F0b3JZZWFyVGFibGUuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbG9nby9sb2dvLmpzIiwiYXBwL21hcC9tYXAuanMiLCJhcHAvc2VsZWN0ZWQvc2VsZWN0ZWQuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3NpZGVtZW51L3NpZGVtZW51LmpzIiwiYXBwL3NpZ251cC9zaWdudXAuanMiLCJhcHAvdG9hc3RzL3RvYXN0cy5qcyIsImFwcC91bnN1cHBvcnRlZF9icm93c2VyL3Vuc3VwcG9ydGVkX2Jyb3dzZXIuanMiLCJhcHAvdXNlci91c2VyLmpzIiwiZGlhbG9ncy9hZGRQcm92aWRlci9hZGRQcm92aWRlci5qcyIsImRpYWxvZ3MvYWRkVW5pdC9hZGRVbml0LmpzIiwiZGlhbG9ncy9hZGRZZWFyL2FkZFllYXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvbmZsaWN0bWV0aG9kZS9jb25mbGljdG1ldGhvZGUuanMiLCJkaWFsb2dzL2NvbmZsaWN0dGV4dC9jb25mbGljdHRleHQuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9hdXRvRm9jdXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYmFycy9iYXJzLmpzIiwiZGlyZWN0aXZlcy9iYXJzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvYnViYmxlcy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3JpZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29uZmxpY3RpdGVtcy9jb25mbGljdGl0ZW1zLmpzIiwiZGlyZWN0aXZlcy9jb25mbGljdGl0ZW1zL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NvbnRlbnRlZGl0YWJsZS9jb250ZW50ZWRpdGFibGUuanMiLCJkaXJlY3RpdmVzL2NvbnRlbnRlZGl0YWJsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2ZpbGVEcm9wem9uZS5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9ycy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaXplcy9pbmRpemVzLmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0Q3N2L3BhcnNlQ29uZmxpY3RDc3YuanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZWNzdi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9wYXJzZWNzdi9wYXJzZWNzdi5qcyIsImRpcmVjdGl2ZXMvcGllY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGllY2hhcnQvcGllY2hhcnQuanMiLCJkaXJlY3RpdmVzL3JvdW5kYmFyL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3JvdW5kYmFyL3JvdW5kYmFyLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N0eWxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvc3R5bGVzLmpzIiwiZGlyZWN0aXZlcy9zdWJpbmRleC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3QvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuanMiLCJkaXJlY3RpdmVzL3RyZWVtZW51L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3RyZWVtZW51L3RyZWVtZW51LmpzIiwiZGlyZWN0aXZlcy90cmVldmlldy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVldmlldy90cmVldmlldy5qcyIsImRpcmVjdGl2ZXMvd2VpZ2h0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O0VBSUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxZQUFBLFdBQUEsaUJBQUEsZ0JBQUEsY0FBQSxnQkFBQSxZQUFBLFVBQUEsU0FBQSxhQUFBLGlCQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsdUJBQUEsY0FBQSxjQUFBLG9CQUFBO0VBQ0EsUUFBQSxPQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxnQkFBQSxhQUFBLGFBQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxrQkFBQSxDQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxxRUFBQSxTQUFBLGdCQUFBLG9CQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFVBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxhQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7O0lBR0EsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFNBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLGdDQUFBLFNBQUEsa0JBQUE7TUFDQSxPQUFBLGlCQUFBOzs7OztHQUtBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0tBQ0EsNEJBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQTs7S0FFQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGdCQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxPQUFBO09BQ0EsS0FBQTs7O0tBR0EsMkJBQUEsU0FBQSxnQkFBQTtNQUNBLE9BQUEsZUFBQTs7S0FFQSwrQkFBQSxTQUFBLGdCQUFBO01BQ0EsT0FBQSxlQUFBLGNBQUE7T0FDQSxZQUFBO09BQ0EsTUFBQTs7OztJQUlBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLCtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSx5Q0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLDhDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxhQUFBLGFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsTUFBQSw0QkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOzs7SUFHQSxNQUFBLGlDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLDBDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLElBQUEsYUFBQSxNQUFBLEdBQUEsT0FBQTtNQUNBLE9BQUEsZUFBQSxRQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxxQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLGVBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsK0NBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLGdCQUFBO1NBQ0EsTUFBQTtTQUNBLE9BQUE7U0FDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7OztJQU9BLE1BQUEsaURBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0lBRUEsTUFBQSwrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEsd0NBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSw2Q0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxHQUFBLGFBQUEsTUFBQSxNQUFBO1NBQ0EsT0FBQTs7UUFFQSxPQUFBLGVBQUEsWUFBQSxhQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztJQUVBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLCtCQUFBLFNBQUEsZ0JBQUE7UUFDQSxPQUFBLGVBQUEsZ0JBQUE7U0FDQSxNQUFBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7U0FDQSxLQUFBOzs7T0FHQSx5QkFBQSxTQUFBLGFBQUE7UUFDQSxPQUFBLFlBQUEsT0FBQSxTQUFBOztPQUVBLCtCQUFBLFNBQUEsZUFBQTtTQUNBLE9BQUEsZUFBQSxnQkFBQSxJQUFBOzs7Ozs7SUFNQSxNQUFBLHVCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSw4Q0FBQSxTQUFBLGdCQUFBLGNBQUE7TUFDQSxPQUFBLGVBQUEsZUFBQSxhQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSw0QkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQ0FBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxpQkFBQSxhQUFBLElBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLHlDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxVQUFBLGFBQUE7O09BRUEsZ0NBQUEsU0FBQSxrQkFBQTtRQUNBLE9BQUEsaUJBQUE7Ozs7S0FJQSxZQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsdUJBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsMkJBQUE7SUFDQSxLQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBLE1BQUEsbUNBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsZ0JBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLHNCQUFBO0lBQ0EsS0FBQTtJQUNBLFNBQUE7S0FDQSx5QkFBQSxTQUFBLGFBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQTs7S0FFQSwyQkFBQSxTQUFBLGFBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxTQUFBO0tBQ0Esd0NBQUEsU0FBQSxhQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUEsSUFBQSx1QkFBQSxhQUFBLEtBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsOEJBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLDBDQUFBLFNBQUEsYUFBQSxjQUFBO01BQ0EsT0FBQSxZQUFBLElBQUEsc0JBQUEsYUFBQSxJQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLGVBQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLFVBQUE7O0lBRUEsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsT0FBQTs7Ozs7O0FDamdCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxxSEFBQSxTQUFBLFlBQUEsWUFBQSxVQUFBLE9BQUEsUUFBQSxlQUFBLFNBQUEsYUFBQSxRQUFBO0VBQ0EsV0FBQSxjQUFBO0VBQ0EsV0FBQSxjQUFBLGNBQUEsWUFBQTtFQUNBLFdBQUEsU0FBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFdBQUEsYUFBQSxTQUFBLFFBQUE7R0FDQSxXQUFBLFFBQUE7OztFQUdBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtHQUNBLElBQUEsUUFBQSxRQUFBLENBQUEsTUFBQSxtQkFBQTtJQUNBLE9BQUEsTUFBQSx1Q0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBLE9BQUEsR0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsVUFBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLFdBQUEsUUFBQTtVQUNBO0lBQ0EsV0FBQSxRQUFBOztHQUVBLElBQUEsT0FBQSxRQUFBLFNBQUEsYUFBQTtJQUNBLElBQUEsUUFBQSxNQUFBLGVBQUEsWUFBQSxRQUFBLE1BQUEsZUFBQSxnQkFBQTtLQUNBLFdBQUEsV0FBQTtXQUNBO0tBQ0EsV0FBQSxXQUFBOztJQUVBLElBQUEsUUFBQSxNQUFBLGVBQUEsZ0JBQUE7S0FDQSxXQUFBLGFBQUE7V0FDQTtLQUNBLFdBQUEsYUFBQTs7SUFFQSxJQUFBLFFBQUEsTUFBQSxlQUFBLGdCQUFBO0tBQ0EsV0FBQSxXQUFBO1dBQ0E7S0FDQSxXQUFBLFdBQUE7O0lBRUEsSUFBQSxRQUFBLE1BQUEsZUFBQSxVQUFBO0tBQ0EsV0FBQSxXQUFBO1dBQ0E7S0FDQSxXQUFBLFdBQUE7O1VBRUE7SUFDQSxXQUFBLGFBQUE7SUFDQSxXQUFBLFdBQUE7SUFDQSxXQUFBLFdBQUE7SUFDQSxXQUFBLFdBQUE7O0dBRUEsSUFBQSxRQUFBLEtBQUEsUUFBQSxjQUFBLENBQUEsS0FBQSxRQUFBLFFBQUEsdUJBQUE7SUFDQSxXQUFBLFdBQUE7VUFDQTtJQUNBLFdBQUEsV0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSw2QkFBQTtJQUNBLFdBQUEsWUFBQTtVQUNBO0lBQ0EsV0FBQSxZQUFBOztHQUVBLFdBQUEsZUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxXQUFBLFFBQUE7R0FDQSxXQUFBLFlBQUE7O0VBRUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxTQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBO0dBQ0EsV0FBQSxpQkFBQTs7R0FFQTs7O0VBR0EsU0FBQSxlQUFBO0dBQ0EsU0FBQSxXQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOzs7Ozs7Ozs7Ozs7OztBQ3ZGQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGVBQUE7OztFQUdBLGNBQUEsV0FBQTtJQUNBLGNBQUEsWUFBQTtJQUNBLGNBQUEsWUFBQTtFQUNBLGNBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxVQUFBOztFQUVBLGNBQUEsT0FBQTtHQUNBLEtBQUE7R0FDQSxVQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx3QkFBQSxTQUFBLGFBQUE7UUFDQSxhQUFBLGFBQUE7Ozs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEscUJBQUE7RUFDQTtJQUNBLFdBQUE7SUFDQSxrQkFBQTtJQUNBLFFBQUE7O0lBRUEscUJBQUE7SUFDQSxPQUFBOztJQUVBLHVCQUFBLFNBQUEsTUFBQSxXQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7SUFDQSxJQUFBO0lBQ0EsZ0JBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBO0tBQ0EsY0FBQSxRQUFBLEtBQUE7O0lBRUEsSUFBQSxLQUFBLFVBQUE7S0FDQSxjQUFBLFlBQUEsS0FBQTs7SUFFQSxPQUFBOzs7Ozs7Ozs7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxvREFBQSxTQUFBLG1CQUFBLG9CQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxJQUFBLFVBQUEsbUJBQUEsY0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLFFBQUE7O0dBRUEsbUJBQUEsY0FBQSxTQUFBOztFQUVBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTtHQUNBLFlBQUE7O0dBRUEsbUJBQUE7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHdCQUFBLFNBQUEsYUFBQTs7UUFFQSxRQUFBLE9BQUEsY0FBQTtVQUNBLGFBQUE7VUFDQSxhQUFBO1VBQ0EsV0FBQTtVQUNBLGFBQUE7VUFDQSxlQUFBO1VBQ0EsbUJBQUE7VUFDQSx1QkFBQTtVQUNBLFFBQUE7VUFDQSxhQUFBO1VBQ0EsWUFBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxZQUFBLFVBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQTs7WUFFQSxLQUFBLENBQUEsT0FBQTtjQUNBLE9BQUE7O1lBRUEsT0FBQSxNQUFBLFFBQUEsZUFBQTs7Ozs7OztBQ1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsY0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUEsS0FBQTtHQUNBLE9BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxNQUFBLFFBQUEsc0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxJQUFBLE9BQUEsR0FBQSxnQkFBQSxJQUFBLE9BQUEsR0FBQTtRQUNBOzs7OztBQ1BBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsY0FBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBLE9BQUEsTUFBQSxPQUFBOztNQUVBLElBQUEsU0FBQTtHQUNBLElBQUEsSUFBQTtJQUNBLE1BQUEsTUFBQTs7R0FFQSxPQUFBLElBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxjQUFBLFFBQUEsS0FBQSxpQkFBQSxDQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsTUFBQTs7O0dBR0EsT0FBQTs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxpQkFBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUEsS0FBQTtHQUNBLEtBQUEsQ0FBQSxLQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLFFBQUEsSUFBQSxNQUFBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQSxNQUFBLEtBQUE7Ozs7QUNaQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFdBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxNQUFBOzs7YUFHQSxPQUFBLEtBQUEsUUFBQSxjQUFBOzs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsS0FBQSxJQUFBLGFBQUEsT0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBOzs7R0FHQSxNQUFBLEtBQUEsVUFBQSxHQUFBLEdBQUE7SUFDQSxJQUFBLFNBQUEsRUFBQTtJQUNBLElBQUEsU0FBQSxFQUFBO0lBQ0EsT0FBQSxJQUFBOztHQUVBLE9BQUE7Ozs7OztBQ2pCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFlBQUE7Q0FDQSxTQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxZQUFBLE9BQUE7O01BRUEsSUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsUUFBQSxJQUFBOztRQUVBLEdBQUEsTUFBQSxHQUFBLEtBQUEsZUFBQSxNQUFBO1VBQ0EsTUFBQSxLQUFBLE1BQUE7Ozs7R0FJQSxPQUFBOzs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsc0JBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsYUFBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsTUFBQSxTQUFBLE9BQUE7Z0JBQ0EsUUFBQSxNQUFBLFVBQUEsR0FBQTs7Z0JBRUEsSUFBQSxDQUFBLGFBQUE7b0JBQ0EsSUFBQSxZQUFBLE1BQUEsWUFBQTs7b0JBRUEsSUFBQSxjQUFBLENBQUEsR0FBQTt3QkFDQSxRQUFBLE1BQUEsT0FBQSxHQUFBOzt1QkFFQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsT0FBQSxLQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUEsTUFBQSxTQUFBOzs7Z0JBR0EsT0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7QUMzQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLE9BQUE7Z0JBQ0EsSUFBQSxhQUFBLE1BQUEsTUFBQTtnQkFDQSxJQUFBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsV0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE9BQUE7OztZQUdBLE9BQUE7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxzQkFBQSxVQUFBLE1BQUE7RUFDQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxXQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsTUFBQSxVQUFBOzs7Ozs7QUNSQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxTQUFBLGFBQUE7O0VBRUEsU0FBQSxjQUFBLEtBQUEsR0FBQTs7R0FFQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxPQUFBLElBQUE7SUFDQSxJQUFBLE9BQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxNQUFBLEdBQUE7S0FDQSxPQUFBOztJQUVBLEdBQUEsS0FBQSxTQUFBO0tBQ0EsSUFBQSxZQUFBLGNBQUEsS0FBQSxVQUFBO0tBQ0EsR0FBQSxVQUFBO01BQ0EsT0FBQTs7Ozs7R0FLQSxPQUFBOztFQUVBLE9BQUE7R0FDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0lBQ0EsY0FBQTtJQUNBLFFBQUE7O0dBRUEsY0FBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxVQUFBLFlBQUEsT0FBQSxjQUFBOztHQUVBLGlCQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7R0FFQSxpQkFBQSxTQUFBLFFBQUEsYUFBQTtJQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUEsWUFBQSxPQUFBLGNBQUEsUUFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQSxhQUFBLFlBQUEsT0FBQSxjQUFBLFFBQUE7O0dBRUEsYUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsT0FBQSxVQUFBLFFBQUE7O0dBRUEsWUFBQSxTQUFBLE9BQUE7SUFDQSxPQUFBLEtBQUEsYUFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFNBQUEsUUFBQSxhQUFBO0lBQ0EsR0FBQSxZQUFBO0tBQ0EsT0FBQSxLQUFBLGdCQUFBLFFBQUE7O0lBRUEsSUFBQSxLQUFBLFFBQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEtBQUEsZ0JBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUE7O0dBRUEsZUFBQSxXQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxTQUFBLEdBQUE7S0FDQSxPQUFBLEtBQUEsUUFBQTs7SUFFQSxPQUFBLEtBQUE7OztHQUdBLFdBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsT0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEtBQUEsWUFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxjQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsU0FBQSxHQUFBO0tBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFFBQUEsS0FBQTtNQUNBLElBQUEsS0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxPQUFBLEtBQUEsUUFBQSxXQUFBOzs7O0lBSUEsT0FBQSxLQUFBLGVBQUE7O0dBRUEsZ0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsWUFBQSxZQUFBLE9BQUEsZ0JBQUEsSUFBQTs7R0FFQSx1QkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxhQUFBOztHQUVBLGtCQUFBLFNBQUEsSUFBQSxNQUFBO0lBQ0EsSUFBQSxNQUFBO0tBQ0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsZ0JBQUEsS0FBQSxXQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGdCQUFBLEtBQUE7O0dBRUEsU0FBQSxTQUFBLElBQUE7Ozs7O0tBS0EsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsVUFBQTs7O0dBR0EsY0FBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLEtBQUEsT0FBQSxLQUFBO01BQ0EsT0FBQTs7S0FFQSxHQUFBLE1BQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxLQUFBLGNBQUEsSUFBQSxNQUFBO01BQ0EsR0FBQSxVQUFBO09BQ0EsT0FBQTs7OztJQUlBLE9BQUE7O0dBRUEsWUFBQSxTQUFBLElBQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsR0FBQTtNQUNBLFFBQUE7O0tBRUEsR0FBQSxNQUFBLFlBQUEsTUFBQSxTQUFBLFVBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxZQUFBLEtBQUEsWUFBQSxJQUFBLE1BQUE7TUFDQSxHQUFBLFVBQUE7T0FDQSxRQUFBOzs7O0lBSUEsT0FBQTs7R0FFQSxTQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxRQUFBLEtBQUE7O0dBRUEsWUFBQSxTQUFBLEdBQUE7SUFDQSxLQUFBLGNBQUEsSUFBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFlBQUEsT0FBQSxVQUFBOztHQUVBLFlBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsWUFBQSxLQUFBLElBQUEsS0FBQSxRQUFBO0lBQ0EsUUFBQSxJQUFBLE9BQUE7SUFDQSxPQUFBLFFBQUE7O0dBRUEsYUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFFBQUE7S0FDQSxPQUFBLEtBQUEsWUFBQSxJQUFBLEtBQUEsUUFBQTtXQUNBO0tBQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQSxZQUFBLE9BQUEsZ0JBQUEsSUFBQTs7O0dBR0EsZ0JBQUEsU0FBQSxHQUFBO0lBQ0EsS0FBQSxjQUFBLElBQUEsS0FBQSxRQUFBO0lBQ0EsT0FBQSxZQUFBLE9BQUEsZUFBQTs7Ozs7Ozs7QUM5SkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsb0NBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsV0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUEsWUFBQSxPQUFBLGtCQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLFVBQUEsT0FBQTtjQUNBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE1BQUE7VUFDQSxLQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7OztRQUdBLFNBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsUUFBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUE7O1VBRUEsT0FBQTs7UUFFQSxTQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLElBQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHdFQUFBLFNBQUEsYUFBQSxlQUFBLGFBQUE7O1FBRUEsSUFBQSxLQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO09BQ0EsR0FBQSxtQkFBQTtPQUNBLElBQUEsR0FBQSxLQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7U0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTtXQUNBLElBQUEsVUFBQSxLQUFBLE1BQUEsTUFBQTtXQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQTtZQUNBLElBQUEsT0FBQSxVQUFBLE9BQUE7YUFDQTs7OztVQUlBLElBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxHQUFBO1dBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7U0FHQSxJQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLEdBQUEsR0FBQSxLQUFBLFdBQUE7V0FDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOztVQUVBLGNBQUEsYUFBQSxjQUFBOzs7O1VBSUEsT0FBQTs7O01BR0EsU0FBQSxjQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtRQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsR0FBQTtTQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7V0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtXQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7V0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O1FBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBO1VBQ0EsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsSUFBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxXQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLDBDQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxPQUFBLE1BQUEsOENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLG1EQUFBO1FBQ0EsT0FBQTs7O09BR0EsR0FBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsSUFBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztRQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0E7VUFDQTs7UUFFQSxRQUFBLEtBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7T0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO09BQ0EsYUFBQTtPQUNBLFlBQUEsS0FBQSx3QkFBQTtRQUNBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsS0FBQSxTQUFBLFVBQUE7UUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7VUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZ0JBQUE7V0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxJQUFBLFdBQUE7YUFDQSxPQUFBO2FBQ0EsU0FBQSxRQUFBOztZQUVBLGFBQUEsWUFBQTtrQkFDQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUEsTUFBQSxhQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTthQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7Y0FDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2VBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO2dCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7c0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTtpQkFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2lCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OzttQkFNQTs7YUFFQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFFBQUEsR0FBQSxLQUFBOzthQUVBLElBQUEsYUFBQTthQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2NBQ0EsUUFBQSxJQUFBO2NBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtlQUNBLGFBQUE7OzthQUdBLElBQUEsQ0FBQSxZQUFBO2NBQ0EsYUFBQSxZQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUE7UUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO1NBQ0EsY0FBQSxhQUFBOztVQUVBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7UUFJQSxPQUFBO1VBQ0EsYUFBQTs7Ozs7O0FDbExBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsTUFBQTs7WUFFQSxXQUFBO1lBQ0EsU0FBQTtXQUNBLFNBQUEsYUFBQTs7UUFFQSxJQUFBLENBQUEsYUFBQSxJQUFBLGVBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTtZQUNBLG9CQUFBLEtBQUEsS0FBQTtZQUNBLGdCQUFBO1lBQ0EsYUFBQTs7VUFFQSxjQUFBLFlBQUEsSUFBQTs7WUFFQTtVQUNBLGNBQUEsYUFBQSxJQUFBO1VBQ0EsVUFBQSxZQUFBLElBQUE7O1FBRUEsT0FBQTtVQUNBLE1BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLEdBQUEsYUFBQSxJQUFBLGNBQUE7Z0JBQ0EsWUFBQSxPQUFBOztZQUVBLE9BQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxLQUFBO2tCQUNBLFdBQUE7a0JBQ0EsY0FBQTtrQkFDQSxXQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLGFBQUE7O1VBRUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUEsU0FBQTs7VUFFQSxtQkFBQSxVQUFBOztVQUVBLFlBQUEsSUFBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxLQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBOztVQUVBLHdCQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUEsS0FBQSxlQUFBOztVQUVBLHFCQUFBLFVBQUE7WUFDQSxPQUFBLGNBQUEsWUFBQSxJQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLFdBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxjQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsWUFBQSxXQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQSxFQUFBOztVQUVBLFlBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUEsRUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQTs7VUFFQSxtQkFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7O2dCQUVBLFNBQUE7Z0JBQ0EsV0FBQTs7Ozs7Ozs7QUNwS0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxPQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxZQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxZQUFBLEtBQUEsTUFBQSxTQUFBLFVBQUE7SUFDQSxPQUFBLEtBQUE7O0dBRUEsU0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxjQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGdCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOztHQUVBLHFCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOzs7Ozs7O0FDakNBLENBQUEsWUFBQTtFQUNBOztFQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdDQUFBLFVBQUEsVUFBQTs7SUFFQSxPQUFBOzs7Ozs7O0tBT0EsU0FBQSxVQUFBLFNBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7O01BS0EsSUFBQSxXQUFBLFFBQUEsV0FBQTtNQUNBLElBQUE7TUFDQSxPQUFBO09BQ0EsS0FBQSxDQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQTs7OztPQUlBLE1BQUEsVUFBQSxPQUFBLFNBQUE7O1FBRUEsSUFBQSxDQUFBLGtCQUFBO1NBQ0EsbUJBQUEsU0FBQTs7O1FBR0EsaUJBQUEsT0FBQSxVQUFBLE9BQUE7U0FDQSxRQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLFFBQUEsS0FBQSxNQUFBO1NBQ0EsS0FBQSxLQUFBLE1BQUEsTUFBQTs7Ozs7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsWUFBQTs7O1FBR0EsT0FBQTtVQUNBLEtBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLE9BQUEsWUFBQSxPQUFBOztVQUVBLFdBQUEsVUFBQTs7O1VBR0EsV0FBQSxVQUFBOzs7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxtQ0FBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBO0VBQ0EsT0FBQTtHQUNBLFFBQUE7R0FDQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTtJQUNBLE9BQUE7O0dBRUEsVUFBQTtHQUNBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxLQUFBLFdBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFNBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFFBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLEtBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxtQkFBQSxTQUFBLFdBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsWUFBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxRQUFBLElBQUE7S0FDQSxTQUFBLGFBQUEsS0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBLFdBQUE7O0lBRUEsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxjQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFlBQUE7Ozs7O0dBS0EsY0FBQSxTQUFBLGVBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLFVBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7Ozs7R0FJQSxVQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxLQUFBLEtBQUEsWUFBQTs7SUFFQSxJQUFBLENBQUEsS0FBQSxRQUFBO0tBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsS0FBQSxLQUFBOztTQUVBO01BQ0EsS0FBQSxrQkFBQSxLQUFBLEtBQUE7O1dBRUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsS0FBQTs7O0dBR0EsZ0JBQUEsU0FBQSxLQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxZQUFBO0tBQ0EsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7UUFJQTtLQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxJQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7SUFJQSxPQUFBOztHQUVBLGlCQUFBLFNBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7O0dBRUEsZ0JBQUEsU0FBQSxPQUFBLE9BQUEsT0FBQTtJQUNBLElBQUEsT0FBQTs7SUFFQSxTQUFBLFdBQUE7S0FDQSxJQUFBLE9BQUEsU0FBQSxlQUFBLFNBQUEsTUFBQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUE7WUFDQTtNQUNBLEtBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxJQUFBOztLQUVBLElBQUEsT0FBQSxTQUFBLGFBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7O0tBRUEsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGVBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLFVBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtNQUNBLEdBQUEsSUFBQTtPQUNBLEdBQUEsT0FBQTtRQUNBLFFBQUEsV0FBQTs7VUFFQTtPQUNBLFFBQUEsV0FBQTs7OztLQUlBLEtBQUE7Ozs7R0FJQSxtQkFBQSxTQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUE7S0FDQSxRQUFBLElBQUE7OztRQUdBO0tBQ0EsS0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxXQUFBOzs7O0dBSUEsT0FBQSxVQUFBO0lBQ0EsS0FBQSxLQUFBLE1BQUE7OztHQUdBLGdCQUFBLFNBQUEsU0FBQTtJQUNBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUEsS0FBQSxlQUFBO0lBQ0EsSUFBQSxRQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0lBQ0EsUUFBQSxXQUFBOztJQUVBLFFBQUE7S0FDQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxlQUFBLE9BQUEsVUFBQSxLQUFBO09BQ0EsSUFBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7T0FFQSxJQUFBLFlBQUEsU0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO09BQ0EsUUFBQSxJQUFBLFVBQUEsSUFBQTtPQUNBLElBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsTUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLE1BQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOztPQUVBLE1BQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBO1FBQ0EsU0FBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOzs7O2FBSUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7OztPQUlBOztJQUVBLE9BQUE7Ozs7Ozs7O0FDaFFBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsYUFBQSxRQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLEdBQUE7SUFDQSxRQUFBLEdBQUE7O0dBRUEsWUFBQSxJQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUNsQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUpBQUEsU0FBQSxVQUFBLFFBQUEsUUFBQSxZQUFBLG9CQUFBLFVBQUEsV0FBQSxTQUFBLGVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxnQkFBQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7RUFDQSxHQUFBLFNBQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxzQkFBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxXQUFBLFNBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7O0lBRUEsR0FBQSxZQUFBO0lBQ0EsbUJBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7SUFDQSxtQkFBQSxTQUFBO0lBQ0EsbUJBQUEsYUFBQTtJQUNBLG1CQUFBOzs7SUFHQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxLQUFBO01BQ0EsbUJBQUEsbUJBQUEsT0FBQSxLQUFBOzs7OztJQUtBLG1CQUFBLGVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsYUFBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLGNBQUEsYUFBQSxnQkFBQTs7O0VBR0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsU0FBQSxtQkFBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxJQUFBLEdBQUEsWUFBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7R0FDQSxJQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxzQkFBQTtHQUNBLElBQUEsR0FBQSxlQUFBLE9BQUE7R0FDQSxPQUFBOzs7Ozs7QUN2SUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxZQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLFdBQUEsZ0JBQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7O0VBRUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsV0FBQSxNQUFBO0dBQ0EsUUFBQSxJQUFBLE1BQUEsV0FBQTtHQUNBLElBQUEsSUFBQSxXQUFBLGNBQUEsUUFBQTtHQUNBLElBQUEsSUFBQSxDQUFBLEdBQUE7SUFDQSxXQUFBLGNBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxXQUFBLGNBQUEsS0FBQTs7O0dBR0EsSUFBQSxXQUFBLGNBQUEsVUFBQSxHQUFBO0lBQ0EsV0FBQSxnQkFBQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTtLQUNBO0tBQ0E7S0FDQTs7O0dBR0E7Ozs7QUMxQ0EsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0lBQUEsU0FBQSxVQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsb0JBQUEsYUFBQSxlQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLFdBQUEsU0FBQTtHQUNBLFdBQUEsZUFBQTs7R0FFQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFVBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxtQkFBQSxjQUFBLEdBQUEsT0FBQTtJQUNBLG1CQUFBLFFBQUEsR0FBQSxXQUFBLEdBQUEsUUFBQTtJQUNBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxhQUFBO0lBQ0EsbUJBQUEsbUJBQUEsR0FBQSxPQUFBLEtBQUE7SUFDQSxXQUFBLGVBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFdBQUEsU0FBQSxVQUFBO0tBQ0EsSUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLFdBQUE7S0FDQSxJQUFBLFNBQUEsVUFBQSxHQUFBLFNBQUEsU0FBQTtNQUNBLEdBQUEsV0FBQTs7S0FFQSxRQUFBLFFBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLEdBQUEsUUFBQSxHQUFBO09BQ0EsR0FBQSxHQUFBLFNBQUEsUUFBQSxRQUFBLENBQUEsRUFBQTtRQUNBLEdBQUEsU0FBQSxLQUFBO1FBQ0EsV0FBQSxlQUFBLEdBQUE7Ozs7O0tBS0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsT0FBQTtNQUNBLElBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBLEtBQUEsT0FBQTtPQUNBLG1CQUFBLG1CQUFBLE9BQUEsS0FBQTs7Ozs7SUFLQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXVCQSxTQUFBLGFBQUE7R0FDQSxjQUFBLGFBQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTtHQUNBLElBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTs7SUFFQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsSUFBQSxZQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOztJQUVBLFFBQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsT0FBQTs7Ozs7O0FDM0lBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRKQUFBLFVBQUEsVUFBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLFNBQUEsb0JBQUEsYUFBQSxlQUFBLFlBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtHQUNBLFlBQUE7R0FDQSxZQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQSxDQUFBLEdBQUEsR0FBQTs7RUFFQSxHQUFBLHVCQUFBO0VBQ0EsR0FBQSxpQkFBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsV0FBQSxTQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxRQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUE7SUFDQSxHQUFBLFVBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7O0dBRUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBO0lBQ0EsR0FBQSxZQUFBO0lBQ0E7Ozs7Ozs7O0VBUUEsU0FBQSxlQUFBOztHQUVBLElBQUEsV0FBQTtJQUNBLFdBQUE7O0lBRUEsV0FBQTs7Ozs7O0VBTUEsU0FBQSxZQUFBO0dBQ0EsR0FBQSxZQUFBO0dBQ0EsR0FBQSxzQkFBQTtHQUNBLEdBQUEsc0JBQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsVUFBQTs7R0FFQSxHQUFBLFlBQUEsQ0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7TUFDQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7OztHQUdBLEdBQUEsZ0JBQUEsQ0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7TUFDQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE9BQUE7Ozs7O0VBS0EsU0FBQSxhQUFBO0dBQ0EsY0FBQSxhQUFBOzs7RUFHQSxTQUFBLHFCQUFBLE1BQUE7O0dBRUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7R0FDQSxJQUFBLElBQUEsQ0FBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUEsT0FBQSxHQUFBO1VBQ0E7SUFDQSxHQUFBLE9BQUEsS0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxPQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUE7O0dBRUE7OztFQUdBLFNBQUEsYUFBQSxVQUFBO0dBQ0EsR0FBQTtHQUNBLFFBQUEsU0FBQTtHQUNBLEtBQUE7SUFDQSxHQUFBLGNBQUEsR0FBQTtJQUNBO0dBQ0EsS0FBQTtJQUNBLEdBQUEsY0FBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxjQUFBLEdBQUE7SUFDQTtHQUNBOzs7R0FHQSxRQUFBLFNBQUE7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQSxLQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsVUFBQSxHQUFBO0lBQ0E7R0FDQTs7R0FFQSxhQUFBLFNBQUE7O0VBRUEsU0FBQSxhQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLElBQUE7SUFDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLElBQUEsUUFBQSxDQUFBLEVBQUE7S0FDQSxHQUFBLFVBQUEsS0FBQSxJQUFBOzs7O0VBSUEsU0FBQSxrQkFBQTtHQUNBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLFVBQUE7SUFDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUE7S0FDQSxJQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsR0FBQTtNQUNBLGFBQUE7O1dBRUE7S0FDQSxhQUFBOzs7R0FHQSxHQUFBLFFBQUE7O0dBRUEsbUJBQUE7OztFQUdBLFNBQUEsYUFBQSxLQUFBLEdBQUE7R0FDQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7SUFDQSxPQUFBLEdBQUEsNkJBQUE7S0FDQSxLQUFBLFFBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLFFBQUEsV0FBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7SUFDQSxNQUFBLFFBQUE7SUFDQSxNQUFBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O09BR0E7SUFDQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7WUFJQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O0tBSUE7Ozs7O0dBS0EsT0FBQTtHQUNBOzs7OztBQ3RQQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3REFBQSxTQUFBLFlBQUEsWUFBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsU0FBQSxTQUFBLGFBQUEsSUFBQTtHQUNBLFlBQUE7O0VBRUEsU0FBQSxnQkFBQSxHQUFBOztHQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsTUFBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxLQUFBOzs7RUFHQSxTQUFBLGFBQUEsR0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxDQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxXQUFBLFNBQUEsS0FBQSxHQUFBLE9BQUEsU0FBQSxFQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLElBQUE7TUFDQSxHQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxDQUFBLEVBQUE7T0FDQSxRQUFBOzs7S0FHQSxPQUFBLE1BQUE7O0lBRUEsT0FBQTs7Ozs7QUN2Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEhBQUEsU0FBQSxPQUFBLFVBQUEsYUFBQSxPQUFBLGVBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxXQUFBLGtCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBOztFQUVBLEdBQUEsZUFBQSxTQUFBLFNBQUE7R0FDQSxNQUFBLGFBQUE7OztFQUdBLFNBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxTQUFBO0dBQ0EsTUFBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtJQUNBLE9BQUEsUUFBQTs7TUFFQSxNQUFBLFNBQUEsU0FBQTtJQUNBLE9BQUEsTUFBQSx3Q0FBQTs7O0VBR0EsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLGtCQUFBO0lBQ0EsTUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQTtNQUNBLE9BQUEsR0FBQTs7S0FFQSxPQUFBLFFBQUE7T0FDQSxNQUFBLFNBQUEsU0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLGFBQUEsSUFBQTtNQUNBLFlBQUE7S0FDQTtFQUNBLFNBQUEsWUFBQTtHQUNBLFdBQUEsY0FBQSxDQUFBLFdBQUE7R0FDQSxjQUFBLFdBQUEsV0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7RUFFQSxXQUFBLGNBQUE7RUFDQSxPQUFBLE9BQUEsVUFBQTtHQUNBLE9BQUEsV0FBQTtLQUNBLFNBQUEsUUFBQTtHQUNBLE9BQUEsZUFBQSxXQUFBOztFQUVBLE9BQUEsT0FBQSxxQkFBQSxTQUFBLEVBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLE9BQUEsV0FBQSxFQUFBLE9BQUEsU0FBQSxTQUFBLFNBQUEsT0FBQTtLQUNBLEdBQUEsY0FBQTs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFlBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxZQUFBLE9BQUEsU0FBQSxDQUFBLGFBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtVQUNBLEdBQUEsVUFBQTs7Ozs7OztBQ05BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLFVBQUEsV0FBQTtFQUNBLEtBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxXQUFBO0dBQ0EseUJBQUE7R0FDQSxrQkFBQTs7O0VBR0EsS0FBQSxlQUFBLFVBQUEsTUFBQSxJQUFBO0dBQ0EsVUFBQSxLQUFBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSx3QkFBQSxPQUFBO0tBQ0EsR0FBQTtLQUNBLFlBQUE7Ozs7SUFJQSxLQUFBLGdCQUFBLFdBQUE7R0FDQSxVQUFBLEtBQUE7O0tBRUEsYUFBQTtTQUNBLGtCQUFBOztLQUVBLEtBQUEsVUFBQSxRQUFBOztPQUVBLFlBQUE7Ozs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxtTEFBQSxTQUFBLFFBQUEsUUFBQSxZQUFBLFlBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQSxvQkFBQSxNQUFBLFdBQUEsYUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLGFBQUEsS0FBQSxTQUFBO0VBQ0EsR0FBQSxrQkFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxZQUFBO0VBQ0EsR0FBQSxhQUFBLG1CQUFBO0VBQ0EsR0FBQSxrQkFBQSxtQkFBQTtFQUNBLEdBQUEsc0JBQUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsWUFBQSxtQkFBQSxLQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxPQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxVQUFBO0dBQ0EsUUFBQTtHQUNBLFdBQUE7O0VBRUEsR0FBQSxVQUFBO0dBQ0EsYUFBQTs7OztFQUlBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxtQkFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxZQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQSxHQUFBLFlBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLEdBQUEsZ0JBQUEsS0FBQSxTQUFBLFdBQUE7SUFDQSxHQUFBLFdBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7S0FDQSxHQUFBLFlBQUE7S0FDQSxJQUFBLENBQUEsR0FBQSxVQUFBLE9BQUE7TUFDQSxHQUFBLFVBQUEsUUFBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsY0FBQTs7O0tBR0EsYUFBQSxHQUFBLFVBQUEsTUFBQTtLQUNBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsTUFBQTtNQUNBLEdBQUEsU0FBQSxPQUFBLE9BQUE7TUFDQTs7S0FFQSxJQUFBLE9BQUEsT0FBQSxXQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxHQUFBO01BQ0EsR0FBQSxRQUFBLFNBQUE7TUFDQSxXQUFBLFNBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsS0FBQTtPQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsZUFBQTs7O01BR0EsVUFBQSxLQUFBLEdBQUEsUUFBQTtNQUNBLFlBQUEsT0FBQSxrQkFBQSxXQUFBLEtBQUEsU0FBQSxNQUFBO09BQ0EsR0FBQSxPQUFBOzs7Ozs7OztFQVFBLFNBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQTs7RUFFQSxTQUFBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLEdBQUEsMEJBQUE7SUFDQSxHQUFBLEtBQUE7SUFDQSxLQUFBLEtBQUE7SUFDQSxLQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxVQUFBLFNBQUEsTUFBQTtJQUNBLEdBQUEsTUFBQSxTQUFBLFNBQUEsRUFBQTtLQUNBLGNBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxHQUFBLGNBQUEsSUFBQTtJQUNBLEdBQUEsYUFBQTtVQUNBO0lBQ0EsR0FBQSxhQUFBOztHQUVBLEdBQUEsZUFBQSxHQUFBLGFBQUEsa0JBQUE7R0FDQTs7RUFFQSxTQUFBLFNBQUEsTUFBQTtHQUNBLEdBQUEsV0FBQSxlQUFBO0dBQ0EsZ0JBQUE7R0FDQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxHQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxZQUFBLEdBQUEsYUFBQSxPQUFBLGlCQUFBOzs7RUFHQSxTQUFBLFdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQTs7R0FFQSxHQUFBOztHQUVBLFdBQUEsUUFBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsR0FBQSxXQUFBO0lBQ0EsU0FBQSxXQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7OztHQUdBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0E7O0dBRUEsSUFBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLEdBQUEsVUFBQSxRQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7SUFDQSxLQUFBLFdBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTs7O0dBR0EsT0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLFdBQUE7R0FDQSxHQUFBLFFBQUEsR0FBQSxVQUFBLE9BQUEsV0FBQTtHQUNBLEdBQUEsZ0JBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxNQUFBLGNBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsTUFBQSxHQUFBLEtBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsUUFBQSxTQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxXQUFBO0dBQ0EsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxDQUFBLEdBQUE7R0FDQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLENBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBLEtBQUE7R0FDQSxZQUFBLE9BQUEsV0FBQSxPQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsU0FBQSxNQUFBO0lBQ0EsR0FBQSxRQUFBLE9BQUE7SUFDQSxlQUFBOzs7OztFQUtBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxDQUFBLE9BQUEsT0FBQSxXQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLENBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7Ozs7O0VBTUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUEsR0FBQSxRQUFBLFVBQUEsQ0FBQSxRQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQTs7OztFQUlBLFNBQUEsbUJBQUE7R0FDQSxHQUFBLFFBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUEsUUFBQTtHQUNBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxXQUFBLFNBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7O1VBRUE7SUFDQSxXQUFBLFNBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxVQUFBLFNBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLEdBQUEsUUFBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSwyQkFBQTtLQUNBLElBQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTs7OztHQUlBOztFQUVBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsV0FBQSxPQUFBLE9BQUEsR0FBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFVBQUEsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7O0dBR0EsSUFBQSxDQUFBLE9BQUE7SUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBO0lBQ0E7R0FDQSxJQUFBLE9BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxLQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxHQUFBLFVBQUEsUUFBQSxHQUFBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQSxLQUFBOzs7R0FHQSxJQUFBLEtBQUEsU0FBQSxHQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLG1DQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLFdBQUEsUUFBQSxLQUFBOzs7O0dBSUEsT0FBQSxDQUFBO0dBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7R0FDQTs7O0VBR0EsU0FBQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLGVBQUEsR0FBQSxRQUFBLFlBQUEsTUFBQTtLQUNBLEdBQUEsYUFBQTs7SUFFQSxVQUFBOztHQUVBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLFVBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO0tBQ0EsU0FBQTs7OztHQUlBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxhQUFBLE9BQUE7O0dBRUEsR0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFNBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7Ozs7O0VBS0EsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxHQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7OztHQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsZUFBQSxTQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTs7R0FFQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsUUFBQSxXQUFBOzs7R0FHQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsYUFBQTs7O01BR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsT0FBQSxXQUFBOztNQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7TUFHQTtZQUNBOztNQUVBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7OztHQUtBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsWUFBQSxTQUFBO0lBQ0EsTUFBQSxjQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQTtNQUNBLFVBQUEsQ0FBQSxLQUFBO01BQ0EsVUFBQTs7S0FFQSxPQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLGNBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7R0FHQSxJQUFBLEVBQUEsS0FBQTtJQUNBLElBQUEsRUFBQSxLQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztJQUVBO0lBQ0EsZ0JBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBLFFBQUEsNkJBQUEsT0FBQSxRQUFBLFFBQUEsa0JBQUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxJQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsT0FBQSxPQUFBO01BQ0EsTUFBQSxFQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLElBQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7RUFJQSxPQUFBLE9BQUEsMEJBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLFFBQUEsSUFBQTtHQUNBLElBQUEsRUFBQTtJQUNBLGFBQUEsRUFBQTtRQUNBO0lBQ0EsYUFBQTtJQUNBO0dBQ0EsR0FBQTs7Ozs7Ozs7Ozs7OztHQWFBLElBQUEsR0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxXQUFBO0tBQ0EsT0FBQSxHQUFBLG1DQUFBO01BQ0EsSUFBQSxFQUFBO01BQ0EsTUFBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7TUFDQSxXQUFBLE9BQUEsT0FBQTs7V0FFQTtLQUNBLE9BQUEsR0FBQSwyQkFBQTtNQUNBLElBQUEsRUFBQTtNQUNBLE1BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLElBQUEsRUFBQTtLQUNBLE1BQUEsRUFBQTs7Ozs7OztFQU9BLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7Ozs7Ozs7R0FRQSxJQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxTQUFBLEVBQUEsYUFBQSxXQUFBOztHQUVBLElBQUEsTUFBQTtJQUNBLENBQUEsR0FBQTtJQUNBLENBQUEsS0FBQTs7R0FFQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtLQUNBLENBQUEsR0FBQTtLQUNBLENBQUEsR0FBQTs7O0dBR0EsR0FBQSxJQUFBLFVBQUEsUUFBQTtJQUNBLFNBQUEsSUFBQTtJQUNBLFNBQUE7Ozs7RUFJQSxPQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUNBLFNBQUEsZ0JBQUE7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEtBQUEsV0FBQTs7O1lBR0E7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLElBQUEsT0FBQSxPQUFBLE1BQUE7T0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsT0FBQSxPQUFBLE1BQUEsV0FBQTs7Ozs7SUFLQSxHQUFBLFVBQUEsUUFBQSxVQUFBLFNBQUEsS0FBQSxHQUFBOztLQUVBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsV0FBQSxRQUFBO09BQ0EsR0FBQSxVQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTthQUNBO09BQ0EsT0FBQSxNQUFBLGdDQUFBLElBQUEsUUFBQSxXQUFBOztZQUVBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxHQUFBLG1CQUFBO2FBQ0E7T0FDQSxPQUFBLE1BQUEsZ0NBQUEsSUFBQSxRQUFBLFdBQUE7Ozs7Ozs7OztBQ2xuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0NBQUEsVUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQSxTQUFBOzs7O0FDTEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUdBQUEsVUFBQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFFBQUEsZUFBQSxjQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsV0FBQTtJQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7SUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxzQkFBQTs7RUFFQSxHQUFBLFVBQUE7SUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTtLQUNBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxNQUFBO0lBQ0EsT0FBQSxHQUFBOzs7SUFHQSxTQUFBLFVBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQTtPQUNBLEdBQUEsUUFBQTtJQUNBLElBQUEsU0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFNBQUEsT0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLFNBQUEsT0FBQTtNQUNBLFFBQUE7OztPQUdBLFFBQUEsUUFBQSxJQUFBLE9BQUEsU0FBQSxNQUFBO1NBQ0EsR0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsS0FBQTs7SUFFQSxHQUFBLGFBQUEsR0FBQSxNQUFBOzs7OztFQUtBLFNBQUEsT0FBQSxXQUFBO0dBQ0EsR0FBQSxTQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsUUFBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7R0FHQTs7RUFFQSxTQUFBLGVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxPQUFBLFNBQUEsSUFBQSxZQUFBOzs7Ozs7O0VBT0EsU0FBQSxhQUFBLEdBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7SUFDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsT0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsRUFBQTtPQUNBLEdBQUEsTUFBQSxVQUFBLElBQUE7UUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO1NBQ0EsYUFBQTs7UUFFQSxhQUFBO1FBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUE7OztNQUdBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQTs7OztHQUlBLGFBQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO01BQ0EsR0FBQTtNQUNBLGFBQUE7O0tBRUEsR0FBQTtLQUNBLGFBQUE7O0lBRUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQTs7R0FFQSxHQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsR0FBQTtJQUNBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsZUFBQTtHQUNBLEdBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO0tBQ0EsR0FBQSxTQUFBLEtBQUE7Ozs7O0VBS0EsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsU0FBQTtHQUNBLGNBQUEsYUFBQSxXQUFBOzs7RUFHQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7OztFQUdBLFNBQUEsa0JBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQSxHQUFBO0lBQ0EsUUFBQSxRQUFBLElBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtNQUNBLElBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7Ozs7Ozs7OztBQzNKQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzSEFBQSxTQUFBLFlBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxlQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsV0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQ0EsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtJQUNBLFFBQUEsUUFBQSxJQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxLQUFBLEtBQUEsV0FBQSxpQkFBQSx5QkFBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBO09BQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7SUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQTtNQUNBLFNBQUE7TUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEtBQUE7TUFDQSxRQUFBLEdBQUEsS0FBQTtNQUNBLEtBQUE7O0tBRUEsSUFBQSxhQUFBO0tBQ0EsUUFBQSxRQUFBLElBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtNQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxhQUFBOzs7S0FHQSxJQUFBLENBQUEsWUFBQTtNQUNBLElBQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxXQUFBLEtBQUE7Ozs7R0FJQSxhQUFBOzs7RUFHQSxTQUFBLFdBQUE7O0dBRUEsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLDBDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7SUFDQSxPQUFBLE1BQUEsOENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLG1EQUFBO0lBQ0EsT0FBQTs7R0FFQSxXQUFBLGlCQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO0tBQ0EsWUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLElBQUE7O0lBRUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBO01BQ0E7O0lBRUEsUUFBQSxLQUFBO0tBQ0EsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO0tBQ0EsTUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7R0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUEsS0FBQSx3QkFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUE7SUFDQSxXQUFBLGlCQUFBO0lBQ0EsUUFBQSxRQUFBLFVBQUEsU0FBQSxTQUFBLEtBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxnQkFBQTtPQUNBLElBQUEsUUFBQSxLQUFBLFNBQUEsR0FBQTtRQUNBLElBQUEsV0FBQTtTQUNBLE9BQUE7U0FDQSxTQUFBLFFBQUE7O1FBRUEsYUFBQSxZQUFBO2NBQ0EsR0FBQSxRQUFBLEtBQUEsVUFBQSxFQUFBO1FBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQSxhQUFBO1NBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsYUFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBO1NBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7V0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsR0FBQSxXQUFBLE9BQUEsR0FBQTtZQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7a0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQSxXQUFBO2FBQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTthQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OztlQU1BOztTQUVBLElBQUEsUUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQSxHQUFBLEtBQUE7O1NBRUEsSUFBQSxhQUFBO1NBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxRQUFBLElBQUE7VUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1dBQ0EsYUFBQTs7O1NBR0EsSUFBQSxDQUFBLFlBQUE7VUFDQSxhQUFBLFlBQUE7VUFDQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztJQU9BLEdBQUEsY0FBQTtJQUNBLGFBQUE7SUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO0tBQ0EsY0FBQSxhQUFBOztNQUVBLFNBQUEsVUFBQTtJQUNBLFdBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUEsc0NBQUEsU0FBQSxLQUFBOzs7O0VBSUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsYUFBQTtHQUNBLElBQUEsYUFBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBO0lBQ0EsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7S0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtLQUNBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtNQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7S0FFQSxXQUFBLEtBQUEsS0FBQSxLQUFBO1dBQ0E7S0FDQSxPQUFBLE1BQUEsK0JBQUE7S0FDQTs7O0dBR0EsUUFBQSxJQUFBO0dBQ0EsWUFBQSxLQUFBLGlCQUFBLEdBQUEsVUFBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxNQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBLGFBQUE7S0FDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDM05BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNFQUFBLFVBQUEsUUFBQSxjQUFBLGFBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsV0FBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBOzs7O0dBSUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsT0FBQTtHQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsYUFBQTtLQUNBLE1BQUE7O0lBRUEsSUFBQSxVQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsU0FBQTtJQUNBLEdBQUEsVUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7S0FDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsWUFBQTtPQUNBLEtBQUEsS0FBQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7O09BRUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO1FBQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOzs7T0FHQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7T0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztVQUVBO09BQ0EsUUFBQSxLQUFBOzs7O1lBSUE7TUFDQSxPQUFBLE1BQUEsK0JBQUE7TUFDQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO01BQ0EsSUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUE7T0FDQSxVQUFBO09BQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7T0FDQSxZQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztNQUVBLElBQUEsYUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxJQUFBOztNQUVBLE1BQUEsYUFBQTtNQUNBLE9BQUEsS0FBQTs7O0lBR0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO0tBQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7OztJQUdBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtLQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUE7T0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBO09BQ0EsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBO09BQ0EsR0FBQSxPQUFBOztNQUVBLEdBQUEsVUFBQTs7T0FFQSxVQUFBLFVBQUE7S0FDQSxJQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztLQUdBLEdBQUEsVUFBQTs7Ozs7Ozs7QUN2R0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBOzs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlIQUFBLFNBQUEsUUFBQSxRQUFBLG1CQUFBLFNBQUEsYUFBQSxhQUFBLE9BQUE7OztRQUdBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLG1CQUFBLGFBQUE7OztRQUdBLFFBQUEsSUFBQSxHQUFBO1FBQ0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7OztRQUdBLFNBQUEsV0FBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUE7WUFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtVQUNBLEdBQUEsTUFBQSxFQUFBO1VBQ0EsR0FBQSxZQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxNQUFBO1VBQ0EsR0FBQSxHQUFBLFVBQUEsTUFBQTtZQUNBLG1CQUFBLGFBQUEsR0FBQSxVQUFBLE1BQUE7O1VBRUE7WUFDQSxhQUFBOzs7UUFHQSxPQUFBLE9BQUEsZ0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQTtVQUNBLEdBQUEsT0FBQSxFQUFBLFlBQUEsYUFBQTtZQUNBLEdBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQTtjQUNBLEdBQUEsRUFBQSxNQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxNQUFBOztrQkFFQTtrQkFDQSxtQkFBQSxhQUFBOztjQUVBOzs7Y0FHQTtZQUNBLEdBQUEsT0FBQSxFQUFBLGNBQUEsWUFBQTtjQUNBLEdBQUEsRUFBQSxXQUFBLE9BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLFdBQUEsR0FBQSxNQUFBOztrQkFFQTtnQkFDQSxtQkFBQSxhQUFBOzs7WUFHQTs7VUFFQSxhQUFBLHVCQUFBO1VBQ0EsYUFBQTtVQUNBOzs7UUFHQSxTQUFBLFFBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBLGNBQUEsR0FBQTtjQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQSxjQUFBLEdBQUE7O1VBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztRQUVBLFNBQUEsY0FBQSxJQUFBO1VBQ0EsSUFBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTthQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxjQUFBLElBQUE7ZUFDQSxRQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUE7OztVQUdBLE9BQUE7O1FBRUEsU0FBQSxlQUFBLFNBQUE7T0FDQSxJQUFBLFFBQUE7T0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO09BQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQTtPQUNBLElBQUEsT0FBQSxRQUFBOztPQUVBLFFBQUE7T0FDQSxLQUFBOztTQUVBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO1NBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO2NBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUEsVUFBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOztTQUVBLE1BQUEsV0FBQTtVQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1VBQ0EsU0FBQTtXQUNBLE9BQUE7V0FDQSxNQUFBOzs7U0FHQTs7OztPQUlBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsVUFBQSxTQUFBO1FBQ0EsTUFBQSxjQUFBLFlBQUE7U0FDQSxJQUFBLFFBQUE7VUFDQSxNQUFBLFFBQUEsV0FBQTtVQUNBLFVBQUEsQ0FBQSxLQUFBO1VBQ0EsVUFBQTs7U0FFQSxPQUFBOzs7T0FHQSxPQUFBOztRQUVBLFNBQUEsY0FBQTtVQUNBLEdBQUEsVUFBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOztRQUVBLFNBQUEsZ0JBQUE7VUFDQTtPQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsU0FBQSxZQUFBO1VBQ0E7Ozs7Ozs7O0FDN0lBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9HQUFBLFNBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQSxlQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsV0FBQTtNQUNBLEdBQUEsV0FBQTs7O01BR0EsU0FBQSxpQkFBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLFlBQUE7VUFDQSxhQUFBLGFBQUEsSUFBQTtZQUNBLFlBQUE7WUFDQSxNQUFBOzs7UUFHQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQSxhQUFBO1FBQ0EsYUFBQTs7TUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGFBQUEsT0FBQTtLQUNBLElBQUEsS0FBQSxTQUFBLEtBQUEsUUFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztLQUVBLE9BQUE7O0lBRUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsUUFBQSxlQUFBLE9BQUEsS0FBQSxjQUFBLGFBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxTQUFBLEtBQUEsV0FBQSxTQUFBLE9BQUE7O01BRUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLFVBQUE7VUFDQSxHQUFBLFVBQUEsV0FBQTtZQUNBOzs7O1FBSUEsR0FBQSxRQUFBLE9BQUEsS0FBQSxHQUFBLFlBQUEsT0FBQTtVQUNBLE9BQUE7O1FBRUEsT0FBQTs7TUFFQSxTQUFBLFdBQUE7O1VBRUEsR0FBQSxDQUFBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBLEtBQUE7WUFDQSxjQUFBLGFBQUEsV0FBQTtZQUNBLE9BQUE7O01BRUEsSUFBQSxhQUFBO09BQ0EsTUFBQTs7TUFFQSxJQUFBLFVBQUE7TUFDQSxJQUFBLGFBQUE7T0FDQSxTQUFBO01BQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7U0FFQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7VUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztTQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O1lBRUE7Z0JBQ0EsR0FBQSxHQUFBLEtBQUEsS0FBQTtrQkFDQSxLQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUE7a0JBQ0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO1dBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7b0JBRUE7bUJBQ0EsUUFBQSxLQUFBOzs7Ozs7O2NBT0E7UUFDQSxPQUFBLE1BQUEsK0JBQUE7UUFDQTs7O01BR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO1FBQ0EsSUFBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtTQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7UUFFQSxJQUFBLFFBQUE7U0FDQSxVQUFBO1NBQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtTQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7U0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7U0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7U0FDQSxZQUFBO1NBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztRQUVBLElBQUEsYUFBQTtRQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtTQUNBLFdBQUEsS0FBQSxJQUFBOztRQUVBLE1BQUEsYUFBQTtRQUNBLE9BQUEsS0FBQTs7O01BR0EsR0FBQSxLQUFBLFNBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBOzs7TUFHQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxVQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsaUJBQUEsU0FBQSxhQUFBLFdBQUEsWUFBQSxLQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsT0FBQSxNQUFBO1NBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxTQUFBLHdCQUFBLEdBQUEsS0FBQSxNQUFBO1NBQ0EsYUFBQTtTQUNBLE9BQUEsR0FBQTtTQUNBLEdBQUEsT0FBQTtTQUNBLEdBQUEsT0FBQTs7UUFFQSxHQUFBLFVBQUE7O1NBRUEsVUFBQSxVQUFBO09BQ0EsSUFBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7T0FHQSxHQUFBLFVBQUE7Ozs7TUFJQSxTQUFBLGNBQUE7Ozs7Ozs7Ozs7S0FVQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLEdBQUEsTUFBQSxFQUFBO1FBQ0EsR0FBQSxXQUFBLEVBQUEsZUFBQTtRQUNBO01BQ0EsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxLQUFBLE1BQUE7UUFDQSxHQUFBLENBQUEsR0FBQSxrQkFBQTtVQUNBLEdBQUEsY0FBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxhQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFVBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsZ0JBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsWUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxXQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7O1VBRUEsY0FBQSxhQUFBLGdCQUFBO2VBQ0E7Ozs7Ozs7Ozs7O0FDektBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBLEdBQUEsT0FBQTs7TUFFQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxZQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7VUFDQSxHQUFBLE9BQUE7WUFDQTs7OztNQUlBLFNBQUEsYUFBQTtRQUNBLFFBQUEsSUFBQSxHQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0tBQUEsU0FBQSxRQUFBLGNBQUEsYUFBQSxTQUFBLFFBQUEsU0FBQSxhQUFBLFFBQUEsYUFBQSxjQUFBLG1CQUFBOzs7Ozs7Ozs7Ozs7Ozs7UUFlQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxrQkFBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSx1QkFBQTtRQUNBLEdBQUEseUJBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBOztRQUVBLEdBQUEsUUFBQSxhQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxjQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJBOztRQUVBLFNBQUEsVUFBQTs7VUFFQSxhQUFBOztRQUVBLFNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQSxTQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQSxRQUFBO1NBQ0EsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1NBR0EsT0FBQTs7UUFFQSxTQUFBLFVBQUE7V0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsWUFBQSxtQkFBQTtjQUNBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O1FBTUEsU0FBQSxxQkFBQTtVQUNBLEdBQUEsZ0JBQUEsQ0FBQSxHQUFBO1VBQ0EsR0FBQSxHQUFBLGNBQUE7WUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxVQUFBO1lBQ0EsWUFBQSxPQUFBLGVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLFlBQUE7Y0FDQSxHQUFBLG9CQUFBLElBQUEsR0FBQSxrQkFBQTs7Ozs7UUFLQSxTQUFBLGlCQUFBLFNBQUE7VUFDQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxZQUFBLENBQUEsSUFBQSxPQUFBOztRQUVBLFNBQUEsZ0JBQUEsVUFBQSxLQUFBO1VBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7O2dCQUVBLEdBQUEsUUFBQSxTQUFBO2tCQUNBLEtBQUEsT0FBQSxLQUFBO2tCQUNBLEdBQUEsaUJBQUEsT0FBQSxHQUFBLGlCQUFBLFFBQUEsT0FBQTtrQkFDQSxHQUFBLGtCQUFBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLE1BQUE7OztjQUdBLGdCQUFBLFVBQUEsS0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxrQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsa0JBQUEsT0FBQSxLQUFBO1lBQ0EsZ0JBQUEsVUFBQSxHQUFBOztjQUVBO1lBQ0EsR0FBQSxrQkFBQSxLQUFBO1lBQ0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7Y0FDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztnQkFFQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7O1FBTUEsU0FBQSxlQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLE1BQUEsS0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBO1lBQ0EsZUFBQSxNQUFBOzs7UUFHQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEscUJBQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGlCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxpQkFBQSxPQUFBLEtBQUE7O2NBRUE7WUFDQSxHQUFBLGlCQUFBLEtBQUE7OztRQUdBLFNBQUEsdUJBQUEsS0FBQTtVQUNBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLFFBQUEsQ0FBQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7OztVQUdBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO1lBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7ZUFFQSxHQUFBLEdBQUEsaUJBQUEsU0FBQSxHQUFBO2NBQ0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsU0FBQSxNQUFBLElBQUE7a0JBQ0EsU0FBQSxNQUFBLEtBQUE7a0JBQ0EsZ0JBQUEsTUFBQSxHQUFBOztjQUVBLEdBQUEsT0FBQSxLQUFBO2NBQ0EsR0FBQSxtQkFBQTs7Y0FFQTtZQUNBLEdBQUEsT0FBQSxLQUFBOzs7UUFHQSxTQUFBLGdCQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsU0FBQSxNQUFBLEtBQUE7O1VBRUEsR0FBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLG1CQUFBOztRQUVBLFNBQUEsVUFBQSxLQUFBO1VBQ0EsR0FBQSxXQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBLEtBQUE7WUFDQSxnQkFBQSxNQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLEdBQUEsR0FBQSxhQUFBO1lBQ0E7O1VBRUEsR0FBQSxlQUFBO1VBQ0EsR0FBQSxPQUFBLEdBQUEsWUFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFlBQUEsS0FBQSxTQUFBLEdBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsUUFBQSwrQkFBQTtZQUNBLE9BQUEsR0FBQSxrQkFBQSxDQUFBLE1BQUEsU0FBQTtZQUNBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlHQUFBLFVBQUEsUUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBLFNBQUEsS0FBQTtJQUNBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkpBQUEsVUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxRQUFBLFlBQUEsWUFBQSxnQkFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGtCQUFBOztFQUVBLEdBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLFdBQUE7Ozs7RUFJQSxHQUFBLFVBQUE7R0FDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQSxTQUFBLElBQUEsS0FBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsSUFBQSxLQUFBOztJQUVBLFNBQUEsVUFBQTtLQUNBLE9BQUEsR0FBQSxpQ0FBQSxDQUFBLEdBQUEsR0FBQSxNQUFBOztJQUVBLFlBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtNQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsT0FBQSxNQUFBLEtBQUEsR0FBQTtRQUNBLE9BQUEsR0FBQTs7T0FFQSxHQUFBLFVBQUEsVUFBQTs7Ozs7O0dBTUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsd0NBQUEsQ0FBQSxHQUFBOztJQUVBLFdBQUEsU0FBQSxJQUFBLEtBQUE7O0tBRUEsT0FBQSxHQUFBLHdDQUFBLENBQUEsR0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFdBQUEsU0FBQSxNQUFBLElBQUE7TUFDQSxlQUFBLGVBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLEdBQUE7O09BRUEsR0FBQSxVQUFBLGFBQUE7Ozs7Ozs7R0FPQSxPQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7OztFQUtBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLFFBQUE7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsT0FBQSxHQUFBO0tBQ0E7SUFDQSxLQUFBO01BQ0EsR0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUEsZ0NBQUE7U0FDQSxHQUFBLE9BQUEsT0FBQTs7O1VBR0E7UUFDQSxPQUFBLEdBQUE7O0tBRUE7SUFDQSxLQUFBOztLQUVBO0lBQ0E7Ozs7O0VBS0EsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxXQUFBO0lBQ0EsR0FBQSxPQUFBLFNBQUEsTUFBQSxZQUFBO0lBQ0EsR0FBQSxTQUFBOztPQUVBO0lBQ0EsR0FBQSxTQUFBLFNBQUE7O0dBRUEsR0FBQSxRQUFBLEtBQUEsUUFBQSxrQ0FBQSxDQUFBLEVBQUE7SUFDQSxHQUFBLGNBQUE7OztRQUdBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOztRQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsK0JBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBOzs7Ozs7O0FDM0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlJQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxXQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBOztFQUVBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsWUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsWUFBQSxTQUFBLElBQUE7S0FDQSxHQUFBLE9BQUEsSUFBQSxTQUFBLFlBQUE7TUFDQSxhQUFBLElBQUEsTUFBQTs7OztRQUlBLEdBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztHQUVBLG1CQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEscUNBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGNBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxVQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsUUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxHQUFBLFdBQUE7O1FBRUE7S0FDQSxHQUFBLFdBQUE7Ozs7RUFJQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQzNHQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1RUFBQSxVQUFBLFlBQUEsWUFBQSxnQkFBQTs7SUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLGFBQUE7Ozs7OztBQ05BLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJIQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxPQUFBOztFQUVBLElBQUEsS0FBQTs7SUFFQSxHQUFBLFFBQUE7RUFDQSxHQUFBLFFBQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLE1BQUE7RUFDQSxHQUFBLFdBQUE7RUFDQTtJQUNBLEdBQUEsVUFBQTtNQUNBLFFBQUE7UUFDQSxVQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7O0lBRUEsa0JBQUEsVUFBQTtLQUNBLElBQUEsT0FBQTtNQUNBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLFNBQUEsS0FBQTs7SUFFQSxZQUFBLFVBQUE7S0FDQSxRQUFBLElBQUE7S0FDQSxRQUFBLFFBQUEsR0FBQSxTQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxHQUFBLE1BQUE7T0FDQSxHQUFBLFdBQUE7Ozs7SUFJQSxZQUFBLFNBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLGVBQUEsV0FBQSxLQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7TUFDQSxXQUFBLEtBQUEsR0FBQSxNQUFBO01BQ0EsR0FBQSxZQUFBOzs7O01BSUEsVUFBQTs7O0VBR0E7OztFQUdBLFNBQUEsUUFBQTs7O0VBR0EsU0FBQSxXQUFBLE1BQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsT0FBQSxJQUFBO0lBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsS0FBQSxPQUFBLEtBQUE7S0FDQSxPQUFBOztJQUVBLEdBQUEsTUFBQSxTQUFBO0tBQ0EsSUFBQSxZQUFBLFdBQUEsTUFBQSxNQUFBO0tBQ0EsR0FBQSxVQUFBO01BQ0EsT0FBQTs7OztHQUlBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQy9KQSxDQUFBLFVBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsZUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxlQUFBOzs7O0FDSkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNklBQUEsU0FBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLFdBQUEsV0FBQSxnQkFBQSxvQkFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsUUFBQTtHQUNBLElBQUEsQ0FBQTtHQUNBLElBQUE7O0VBRUEsR0FBQSxVQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0E7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxLQUFBO0tBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsVUFBQSxNQUFBLFFBQUEsSUFBQTtNQUNBLEdBQUEsR0FBQSxVQUFBLE1BQUEsR0FBQSxRQUFBLE9BQUEsT0FBQSxLQUFBO09BQ0EsR0FBQSxVQUFBOzs7O1NBSUEsR0FBQSxDQUFBLEdBQUEsT0FBQTtLQUNBLEdBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsU0FBQSxLQUFBO0dBQ0EsU0FBQSxVQUFBOzs7O0dBSUE7RUFDQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDJCQUFBO0tBQ0EsT0FBQSxHQUFBLGdDQUFBLENBQUEsS0FBQSxHQUFBOztPQUVBO0lBQ0EsT0FBQSxHQUFBLDJCQUFBLENBQUEsR0FBQSxHQUFBLFVBQUEsSUFBQSxLQUFBLEdBQUEsVUFBQSxNQUFBLEtBQUEsR0FBQTs7O0VBR0EsU0FBQSxRQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEscUJBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVBO0VBQ0EsU0FBQSxhQUFBLElBQUEsRUFBQTtHQUNBLElBQUEsSUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxTQUFBLGFBQUE7SUFDQSxHQUFBLFVBQUE7VUFDQTtJQUNBLE9BQUEsTUFBQTs7O0VBR0EsU0FBQSxRQUFBLE1BQUE7R0FDQSxHQUFBLE9BQUE7R0FDQSxlQUFBLGlCQUFBLEdBQUEsVUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLGdDQUFBO0tBQ0EsT0FBQSxHQUFBLGdDQUFBLENBQUEsS0FBQTs7U0FFQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDJCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBLENBQUEsS0FBQTs7UUFFQTtLQUNBLE9BQUEsR0FBQSwyQkFBQSxDQUFBLEtBQUE7O0lBRUEsR0FBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7S0FDQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQTtLQUNBLEdBQUEsR0FBQSxRQUFBO01BQ0EsR0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLElBQUE7T0FDQSxXQUFBOzs7O0tBSUEsR0FBQSxNQUFBLE9BQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsV0FBQSxLQUFBO0tBQ0EsR0FBQSxNQUFBLE9BQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsV0FBQSxLQUFBOzs7S0FHQSxHQUFBLGdCQUFBO01BQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQSxjQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUEsR0FBQSxLQUFBOzs7SUFHQTtJQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxNQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7SUFDQSxtQkFBQSxRQUFBLEdBQUEsTUFBQSxHQUFBLFVBQUEsT0FBQSxZQUFBOzs7Ozs7O0VBT0EsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLFFBQUEsV0FBQTtHQUNBLEdBQUEsR0FBQSxRQUFBO0lBQ0EsR0FBQSxHQUFBLFFBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxXQUFBOzs7Ozs7R0FNQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsS0FBQTs7TUFFQSxJQUFBLFlBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7O01BRUEsTUFBQSxXQUFBO09BQ0EsT0FBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7WUFJQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O01BSUE7O0dBRUEsT0FBQTtHQUNBOztFQUVBLE9BQUEsSUFBQTtHQUNBLFNBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxXQUFBO0lBQ0EsR0FBQSxRQUFBLFFBQUEsMkJBQUE7Ozs7Ozs7O0FDM0xBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFVBQUEsU0FBQSxNQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLHFCQUFBOztJQUVBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O0dBR0E7Ozs7OztBQ2pCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5REFBQSxTQUFBLFlBQUEsUUFBQSxPQUFBLE9BQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGdCQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBOzs7UUFHQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7O1VBRUEsR0FBQSxNQUFBLGtCQUFBOzs7O1FBSUEsU0FBQSxTQUFBO1VBQ0EsTUFBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLFFBQUEsSUFBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLFdBQUEsYUFBQSxNQUFBLFFBQUEsWUFBQSxXQUFBLGFBQUE7YUFDQSxNQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsTUFBQSx3Q0FBQTs7Ozs7OztBQ2hDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtFQUFBLFNBQUEsUUFBQSxhQUFBLGtCQUFBLG9CQUFBOzs7RUFHQSxJQUFBLE9BQUE7R0FDQSxVQUFBO0VBQ0EsSUFBQSxPQUFBLGFBQUEsS0FBQTtHQUNBLE9BQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQSxtQkFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxXQUFBOztHQUVBLFNBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLFlBQUE7SUFDQSxLQUFBO0tBQ0EsTUFBQTtLQUNBLEtBQUEsc0ZBQUE7S0FDQSxNQUFBO0tBQ0EsY0FBQTtNQUNBLFFBQUE7TUFDQSxpQkFBQTtNQUNBLGNBQUE7Ozs7OztFQU1BLEdBQUEsY0FBQSxFQUFBLFVBQUEsbUZBQUEsUUFBQTtHQUNBLFFBQUE7R0FDQSxpQkFBQTtHQUNBLE1BQUE7R0FDQSxjQUFBOztFQUVBLEdBQUEsWUFBQTtHQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7R0FFQSxXQUFBO0lBQ0EsS0FBQSxDQUFBO0lBQ0EsS0FBQSxDQUFBOzs7RUFHQSxHQUFBLFdBQUE7R0FDQSxRQUFBOztFQUVBLEdBQUEsZUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTs7OztFQUlBLElBQUEsWUFBQSxFQUFBO0VBQ0EsVUFBQSxZQUFBO0VBQ0EsVUFBQSxhQUFBLFdBQUE7R0FDQSxFQUFBLEtBQUEsV0FBQSxNQUFBOztFQUVBLFVBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxZQUFBLEVBQUEsUUFBQSxPQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsRUFBQSxRQUFBLE9BQUEsS0FBQSxrQ0FBQTtHQUNBLEtBQUEsY0FBQTtHQUNBLEVBQUEsU0FBQSx3QkFBQTtHQUNBLEVBQUEsU0FBQSxZQUFBLFdBQUEsU0FBQSxXQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxHQUFBO01BQ0EsR0FBQSxVQUFBO1lBQ0E7TUFDQSxJQUFBLFNBQUEsR0FBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsVUFBQTs7OztHQUlBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUEsYUFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxHQUFBLFNBQUE7S0FDQSxJQUFBLFlBQUEsR0FBQTtLQUNBLEdBQUEsVUFBQTtXQUNBO0tBQ0EsSUFBQSxTQUFBLEdBQUE7S0FDQSxHQUFBLFlBQUE7S0FDQSxHQUFBLFVBQUE7Ozs7O0VBS0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxtQkFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLHFFQUFBLG1CQUFBLFlBQUEsK0NBQUEsbUJBQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsYUFBQTtJQUNBLGlCQUFBLENBQUEsbUJBQUEsWUFBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsV0FBQTs7SUFFQSxRQUFBLFNBQUEsU0FBQSxTQUFBOztLQUVBLE9BQUE7O0lBRUEsT0FBQSxTQUFBLFNBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxNQUFBLFFBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxPQUFBOzs7O0dBSUEsSUFBQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcElBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBFQUFBLFNBQUEsUUFBQSxZQUFBLG9CQUFBLFFBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO1lBQ0EsS0FBQSxHQUFBLFVBQUEsb0JBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLElBQUE7OztVQUdBLEdBQUEsUUFBQSxHQUFBLFVBQUEsaUJBQUEsV0FBQTtVQUNBLEdBQUEsZ0JBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBLGlCQUFBOzs7UUFHQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtjQUNBLE9BQUE7OztVQUdBLE9BQUEsS0FBQTs7UUFFQSxTQUFBLFlBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0E7O01BRUEsU0FBQSxjQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtPQUNBOztRQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUE7WUFDQTs7O1lBR0EsR0FBQSxFQUFBLElBQUE7Y0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztZQUVBO1lBQ0EsZ0JBQUEsRUFBQTs7Ozs7Ozs7O0FDbEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsUUFBQSxPQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOERBQUEsU0FBQSxRQUFBLGVBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsYUFBQSxRQUFBLE9BQUEsUUFBQSxHQUFBOztRQUVBLEdBQUEsT0FBQSxVQUFBOztZQUVBLFlBQUEsS0FBQSxrQkFBQSxHQUFBLGNBQUEsS0FBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQSxjQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLGVBQUE7Y0FDQSxjQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ25CQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwREFBQSxTQUFBLFFBQUEsWUFBQSxjQUFBOztNQUVBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBOztNQUVBLEdBQUEsT0FBQSxVQUFBOztVQUVBLFlBQUEsS0FBQSxrQkFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUE7WUFDQSxjQUFBOzs7OztNQUtBLEdBQUEsT0FBQSxVQUFBO1FBQ0EsY0FBQTs7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxRQUFBLElBQUEsT0FBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1EQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0RBQUEsU0FBQSxRQUFBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0VBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLG1CQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLFdBQUE7RUFDQSxPQUFBLE9BQUEsWUFBQTs7R0FFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLE1BQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTtLQUNBLElBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxhQUFBO01BQ0EsYUFBQSxhQUFBLEtBQUE7T0FDQSxhQUFBO09BQ0EsT0FBQTs7O0tBR0EsSUFBQSxPQUFBLGFBQUEsYUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBLEdBQUEsYUFBQTtNQUNBLEtBQUEsZUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFlBQUE7TUFDQSxLQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxjQUFBO01BQ0EsS0FBQSxhQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsVUFBQTtNQUNBLEtBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7O01BRUEsSUFBQSxPQUFBLEtBQUEsU0FBQSxhQUFBO09BQ0EsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBO09BQ0EsS0FBQSxXQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7Ozs7OztHQU1BLGNBQUE7R0FDQSxhQUFBOzs7O0VBSUEsT0FBQSxPQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7R0FDQSxjQUFBOzs7Ozs7O0FDcERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdEQUFBLFNBQUEsT0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsT0FBQSxHQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtXQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxHQUFBO1lBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFFQUFBLFVBQUEsUUFBQSxjQUFBLGVBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsTUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsWUFBQTtHQUNBLGNBQUE7OztFQUdBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7RUFFQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxNQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLGFBQUE7T0FDQSxLQUFBLE1BQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTs7OztLQUlBLEdBQUEsS0FBQSxPQUFBLEtBQUE7OztHQUdBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLGNBQUE7O0tBRUE7Ozs7O0FDdENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDBCQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsVUFBQTtZQUNBLFNBQUEsVUFBQTtnQkFDQSxTQUFBLEdBQUE7ZUFDQTs7Ozs7Ozs7QUNUQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFlBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsTUFBQSxNQUFBO0dBQ0EsR0FBQSxDQUFBLEdBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLEtBQUE7Ozs7OztBQ1ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFFBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3Q0FBQSxVQUFBLFVBQUEsY0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxnQkFBQTtJQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxXQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBOztJQUVBLElBQUEsZUFBQSxZQUFBO0tBQ0EsR0FBQSxNQUFBLFFBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE9BQUEsT0FBQTtPQUNBLElBQUEsU0FBQSxNQUFBO09BQ0EsR0FBQSxNQUFBLFlBQUEsRUFBQTtRQUNBLFNBQUEsTUFBQSxNQUFBOzs7T0FHQSxJQUFBLElBQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQSxNQUFBO1FBQ0EsU0FBQSxhQUFBLFdBQUEsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBLE1BQUE7O09BRUEsT0FBQSxLQUFBO09BQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxVQUFBLE1BQUE7UUFDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7U0FDQSxJQUFBLFFBQUEsS0FBQTtTQUNBLEdBQUEsS0FBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLEtBQUEsTUFBQTs7Y0FFQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1VBQ0EsUUFBQSxNQUFBLE1BQUE7O1NBRUEsSUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxTQUFBLGFBQUEsV0FBQSxLQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7O1NBRUEsTUFBQSxLQUFBOzs7O01BSUE7OztTQUdBOztNQUVBLElBQUEsSUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsY0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFNBQUEsTUFBQSxRQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxVQUFBLE1BQUEsUUFBQTs7TUFFQSxPQUFBLEtBQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFVBQUEsVUFBQSxNQUFBO09BQ0EsSUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBOztRQUVBLElBQUEsT0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFFBQUEsTUFBQSxVQUFBLEtBQUEsUUFBQSxNQUFBO1NBQ0EsT0FBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxPQUFBLE1BQUEsUUFBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxPQUFBLEtBQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxTQUFBLGFBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQTtTQUNBLFNBQUE7O1FBRUEsTUFBQSxLQUFBOzs7OztJQUtBLElBQUEsY0FBQSxVQUFBO0tBQ0EsUUFBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxnQkFBQSxVQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsS0FBQSxTQUFBO1FBQ0EsR0FBQSxRQUFBLFFBQUE7UUFDQSxHQUFBLFFBQUEsU0FBQSxLQUFBLElBQUE7UUFDQSxRQUFBOzs7O0lBSUEsSUFBQSxhQUFBLFlBQUE7S0FDQSxRQUFBLFFBQUEsTUFBQSxLQUFBO0tBQ0EsUUFBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLE9BQUEsS0FBQSxVQUFBLFFBQUEsUUFBQSxLQUFBLE1BQUE7O0tBRUEsSUFBQSxDQUFBLFFBQUEsU0FBQTtNQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLFVBQUEsRUFBQTtPQUNBLElBQUEsU0FBQSxHQUFBLElBQUE7U0FDQSxZQUFBO1NBQ0EsWUFBQTtTQUNBLFdBQUEsQ0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE1BQUEsS0FBQTtPQUNBLElBQUEsWUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBO1NBQ0EsWUFBQTtTQUNBLFdBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7O09BRUEsUUFBQSxTQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsSUFBQSxRQUFBLE9BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsTUFBQTtTQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7U0FDQSxPQUFBLE9BQUEsR0FBQSxTQUFBOztTQUVBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLEdBQUE7O1VBRUE7T0FDQSxJQUFBLE1BQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBO1NBQ0EsV0FBQSxLQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7O09BR0EsUUFBQSxNQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxRQUFBLE9BQUEsR0FBQTtTQUNBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLEdBQUE7Ozs7SUFJQSxHQUFBLFFBQUEsVUFBQSxRQUFBLE9BQUEsVUFBQSxFQUFBO01BQ0EsSUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLGVBQUEsS0FBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUEsU0FBQTtRQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7Ozs7O1FBUUEsS0FBQSxLQUFBO1FBQ0EsTUFBQSxhQUFBO1FBQ0EsTUFBQSxVQUFBOztRQUVBLEtBQUEsU0FBQSxRQUFBO1FBQ0EsS0FBQSxlQUFBO1FBQ0EsR0FBQSxTQUFBLFNBQUEsRUFBQTtRQUNBLFFBQUEsY0FBQSxFQUFBO1FBQ0EsUUFBQTs7UUFFQSxLQUFBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUEsUUFBQTtRQUNBLEdBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQTs7WUFFQTtTQUNBLE9BQUEsUUFBQSxTQUFBOzs7UUFHQSxLQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7OztLQUlBLFFBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxVQUFBLEtBQUEsT0FBQSxRQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZ0JBQUEsUUFBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBLEtBQUEsU0FBQTs7Ozs7O0tBTUEsUUFBQSxVQUFBLFFBQUEsV0FBQSxPQUFBLFVBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLFFBQUEsV0FBQSxFQUFBO1NBQ0EsS0FBQSxnQkFBQSxHQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEdBQUEsSUFBQSxRQUFBLFdBQUEsRUFBQSxRQUFBO1FBQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQTs7TUFFQSxPQUFBLFlBQUEsRUFBQTs7S0FFQSxRQUFBLFFBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLGFBQUEsVUFBQSxHQUFBOzs7T0FHQSxLQUFBLGVBQUE7T0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxFQUFBLFVBQUEsU0FBQSxFQUFBOztPQUVBLE1BQUEsV0FBQSxTQUFBLEVBQUE7T0FDQSxHQUFBLEVBQUEsUUFBQTtRQUNBLE9BQUE7O1dBRUE7UUFDQSxPQUFBOzs7T0FHQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQSxXQUFBOztLQUVBLFFBQUEsTUFBQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7O01BRUEsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7O01BRUEsUUFBQSxjQUFBLEVBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBOztPQUVBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxJQUFBLGFBQUE7TUFDQSxPQUFBOztLQUVBLFVBQUEsb0RBQUEsS0FBQSxNQUFBO0tBQ0EsV0FBQSwwQkFBQSxLQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxNQUFBO01BQ0EsR0FBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLEdBQUE7T0FDQSxXQUFBO09BQ0EsV0FBQSxvREFBQSxNQUFBLFVBQUEsS0FBQSxNQUFBO09BQ0EsV0FBQSx5Q0FBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUE7Ozs7OztLQU1BLFNBQUEsUUFBQSxRQUFBLFlBQUEsU0FBQSxNQUFBLEdBQUEsT0FBQSxNQUFBLFlBQUE7OztJQUdBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUE7OztJQUdBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBOztLQUVBLElBQUEsUUFBQSxXQUFBLE1BQUE7TUFDQTtNQUNBO01BQ0E7WUFDQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7T0FDQTs7U0FFQTtPQUNBOzs7O0lBSUEsTUFBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxFQUFBLEdBQUEsWUFBQSxZQUFBO01BQ0EsUUFBQSxRQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7O01BRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBOzs7VUFHQTs7UUFFQTs7Ozs7SUFLQSxNQUFBLE9BQUEsYUFBQSxVQUFBLE1BQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0E7O0tBRUEsSUFBQSxRQUFBLE9BQUE7TUFDQTtZQUNBO01BQ0E7Ozs7Ozs7O0FDNWNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFVBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxhQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsR0FBQSxpQkFBQTs7R0FFQSxTQUFBLFNBQUEsU0FBQTtJQUNBLEdBQUEsaUJBQUE7Ozs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsY0FBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNsQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsaUZBQUEsU0FBQSxRQUFBLFNBQUEsUUFBQSxhQUFBLGVBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsZUFBQTtFQUNBLEdBQUEsc0JBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxvQkFBQSxHQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsVUFBQTtJQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsTUFBQSxHQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsS0FBQSxHQUFBOzs7RUFHQSxTQUFBLG9CQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxHQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxTQUFBO0tBQ0Esb0JBQUEsS0FBQTs7OztFQUlBLFNBQUEsb0JBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLFFBQUEsV0FBQSxHQUFBLFdBQUEsVUFBQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLGNBQUEsS0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxHQUFBLEtBQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxHQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtJQUNBLE9BQUEsTUFBQSxpQ0FBQTtJQUNBLE9BQUE7O0dBRUEsR0FBQSxTQUFBO0dBQ0EsR0FBQSxLQUFBLFlBQUEsS0FBQTtHQUNBLEdBQUEsS0FBQSxTQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBLEtBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsVUFBQTtLQUNBLFFBQUE7O0lBRUEsR0FBQSxNQUFBLFlBQUEsQ0FBQSxNQUFBO0tBQ0EsSUFBQSxZQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQTs7OztHQUlBLE9BQUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsVUFBQTtLQUNBLElBQUEsWUFBQSxVQUFBLEdBQUEsTUFBQSxHQUFBO0tBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFVBQUEsU0FBQSxRQUFBLEtBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQSxHQUFBLE1BQUEsR0FBQSxLQUFBLEdBQUE7T0FDQSxVQUFBLFNBQUEsT0FBQSxFQUFBOzs7O09BSUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxXQUFBLFFBQUEsS0FBQTtLQUNBLEdBQUEsR0FBQSxXQUFBLEdBQUEsTUFBQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsV0FBQSxPQUFBLEVBQUE7Ozs7R0FJQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0lBQ0EsSUFBQSxZQUFBLFVBQUEsR0FBQSxNQUFBLEdBQUE7SUFDQSxVQUFBLFNBQUEsS0FBQSxHQUFBOzs7T0FHQTtJQUNBLEdBQUEsV0FBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsUUFBQSxJQUFBLEdBQUEsS0FBQSxXQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLGFBQUEsR0FBQSxLQUFBLFVBQUE7SUFDQSxHQUFBLEdBQUEsS0FBQSxhQUFBLEdBQUEsS0FBQSxVQUFBO0tBQ0E7OztHQUdBLE9BQUEsUUFBQSw2QkFBQTtHQUNBLE9BQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxTQUFBLGFBQUEsT0FBQTtHQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsR0FBQSxLQUFBLEdBQUE7S0FDQSxHQUFBLEdBQUEsS0FBQSxnQkFBQTtNQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUE7O1NBRUE7TUFDQSxZQUFBLE9BQUEsY0FBQSxHQUFBLEtBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQTs7OztRQUlBO0tBQ0EsWUFBQSxLQUFBLGNBQUEsR0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO01BQ0EsR0FBQSxLQUFBLGFBQUEsR0FBQTtTQUNBLElBQUEsU0FBQSxVQUFBLE1BQUEsR0FBQTtTQUNBLEdBQUEsQ0FBQSxPQUFBLFNBQUE7VUFDQSxPQUFBLFdBQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQSxPQUFBLFdBQUE7O1VBRUE7T0FDQSxHQUFBLFdBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUEsK0JBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7OztBQ25JQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxLQUFBLElBQUEsSUFBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7T0FDQSxPQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxNQUFBLGFBQUEsVUFBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxFQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUE7TUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO1FBQ0EsU0FBQTtRQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBOztLQUVBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsY0FBQTtPQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7T0FDQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7O1VBR0E7T0FDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsSUFBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7OztJQU9BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBO0tBQ0EsU0FBQSxZQUFBO09BQ0EsVUFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBOztNQUVBOzs7Ozs7OztBQ2xKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGlCQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsNkJBQUEsU0FBQSxPQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLGtCQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsSUFBQTtHQUNBLEdBQUEsR0FBQSxlQUFBLElBQUE7SUFDQSxHQUFBLGNBQUE7O09BRUE7SUFDQSxHQUFBLGNBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsTUFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsVUFBQSxPQUFBO0lBQ0EsR0FBQSxZQUFBOztPQUVBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO01BQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7OztFQUdBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLE9BQUE7O0dBRUEsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7Ozs7Ozs7Ozs7OztBQzlFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLGFBQUEsR0FBQSxRQUFBLFFBQUE7O0VBRUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsS0FBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLE9BQUEsZUFBQTs7R0FFQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsWUFBQTtJQUNBLEdBQUEsS0FBQSxlQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0dBQ0EsT0FBQSxlQUFBLEdBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLE1BQUE7R0FDQSxHQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsOEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsV0FBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBOzs7O09BSUE7SUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxHQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsNEJBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQTtNQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTtNQUNBLGVBQUEsUUFBQTtNQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEdBQUEsU0FBQSxJQUFBLEtBQUEsU0FBQTs7Ozs7OztFQU9BLFNBQUEsWUFBQSxPQUFBLEtBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtHQUNBLEdBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUE7O0lBRUE7Ozs7O0FDekZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsRUFBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsTUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7O0lBR0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxLQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7O0tBRUEsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7T0FFQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7O0tBR0EsR0FBQSxTQUFBLFNBQUEsS0FBQTtNQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsU0FBQSxNQUFBO01BQ0EsWUFBQSxLQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBLFNBQUE7O0tBRUEsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsU0FBQSxVQUFBOztLQUVBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBOztLQUVBLFFBQUEsY0FBQTtLQUNBLFFBQUE7Ozs7SUFJQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsUUFBQSxPQUFBLEdBQUEsUUFBQSxFQUFBO0tBQ0EsV0FBQSxJQUFBLE9BQUE7T0FDQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBO0tBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7TUFDQSxTQUFBLE9BQUE7UUFDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO1FBQ0EsS0FBQSxjQUFBLE1BQUE7UUFDQSxLQUFBLGdCQUFBLE1BQUE7O0tBRUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUEsSUFBQSxFQUFBLE1BQUE7S0FDQSxPQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsR0FBQSxRQUFBLFlBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBOzs7SUFHQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxVQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsQ0FBQSxVQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0E7O01BRUEsWUFBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxZQUFBLFVBQUE7T0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTthQUNBO09BQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7O0tBSUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7TUFDQSxHQUFBLE1BQUEsR0FBQSxPQUFBOztNQUVBLE1BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtPQUNBLEdBQUEsSUFBQSxPQUFBLFFBQUEsWUFBQSxJQUFBO1NBQ0EsWUFBQSxLQUFBLFNBQUEsSUFBQSxRQUFBO1NBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxJQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7OztNQUtBLElBQUEsR0FBQSxNQUFBO1FBQ0EsT0FBQSxDQUFBLEtBQUE7UUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLE1BQUE7TUFDQSxNQUFBLEVBQUE7U0FDQSxPQUFBLENBQUEsR0FBQTtTQUNBLEdBQUEsU0FBQTtTQUNBLEdBQUEsWUFBQTtNQUNBLE9BQUEsT0FBQSxlQUFBLEtBQUE7TUFDQSxRQUFBLE9BQUEsZUFBQSxLQUFBLFVBQUE7O09BRUEsR0FBQSxNQUFBLEtBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsT0FBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsR0FBQSxJQUFBLE9BQUEsUUFBQSxZQUFBLElBQUE7U0FDQSxZQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7U0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLElBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7QUMxUkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLEtBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOztLQUVBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsTUFBQSxVQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLElBQUEsVUFBQSxJQUFBLEtBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUE7UUFDQTtZQUNBLE9BQUEsRUFBQTs7UUFFQSxJQUFBLEtBQUEsR0FBQSxTQUFBO1FBQ0EsTUFBQSxPQUFBLFFBQUE7UUFDQSxNQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUE7OztPQUdBLFNBQUEsVUFBQTtRQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDJEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsYUFBQTtLQUNBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxhQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsTUFBQSxJQUFBO0tBQ0EsU0FBQTs7SUFFQSxPQUFBLEtBQUEsU0FBQSxZQUFBO0tBQ0EsTUFBQSxHQUFBOztJQUVBLE1BQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtLQUNBLGFBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTtDQUNBLE1BQUEsU0FBQTtLQUNBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsU0FBQSxZQUFBOztNQUVBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7T0FDQSxNQUFBLFVBQUEsS0FBQTtRQUNBLFFBQUEsSUFBQSxLQUFBLEdBQUE7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQTs7O1FBR0EsR0FBQSxJQUFBLE9BQUEsVUFBQSxFQUFBO1NBQ0EsTUFBQSxPQUFBLEtBQUEsSUFBQSxLQUFBOztZQUVBO1NBQ0EsUUFBQSxJQUFBOzs7T0FHQSxTQUFBLFVBQUE7UUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7OztBQ3hFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSw4QkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw2REFBQSxVQUFBLFFBQUEsVUFBQSxRQUFBLGNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7TUFDQSxhQUFBO01BQ0EsUUFBQSxJQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTs7O09BR0EsT0FBQSxVQUFBLE9BQUE7UUFDQSxRQUFBLFFBQUEsTUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBOztTQUVBLElBQUEsSUFBQTtVQUNBLEtBQUE7VUFDQSxPQUFBOztTQUVBLFFBQUEsUUFBQSxLQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1dBQ0EsSUFBQSxLQUFBLFdBQUEsaUJBQUEseUJBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtZQUNBLElBQUEsUUFBQTthQUNBLE1BQUE7YUFDQSxTQUFBO2FBQ0EsUUFBQTthQUNBLE9BQUE7O1lBRUEsRUFBQSxPQUFBLEtBQUE7WUFDQSxPQUFBLEtBQUE7Ozs7U0FJQSxJQUFBLFlBQUE7VUFDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtXQUNBLElBQUEsSUFBQSxVQUFBLEdBQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBLFFBQUEsYUFBQTthQUNBLFFBQUEsS0FBQSxPQUFBOztZQUVBLFFBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7Z0JBSUE7O1VBRUEsRUFBQSxPQUFBOztVQUVBLGFBQUEsUUFBQTs7Ozs7O09BTUEsa0JBQUEsVUFBQSxPQUFBOzs7UUFHQSxJQUFBLFFBQUEsTUFBQSxNQUFBLGNBQUE7UUFDQSxJQUFBLFlBQUE7UUFDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxNQUFBOztRQUVBLElBQUEsU0FBQSxTQUFBLEdBQUE7U0FDQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTtTQUNBLFlBQUE7O1FBRUEsSUFBQSxRQUFBOztRQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsS0FBQTtTQUNBLElBQUEsU0FBQSxJQUFBO1VBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGVBQUEsS0FBQTtVQUNBLElBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEdBQUE7V0FDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7VUFFQSxJQUFBLE9BQUEsU0FBQSxHQUFBLE1BQUE7VUFDQSxJQUFBLEtBQUEsU0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBO1dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsS0FBQTthQUNBLElBQUEsSUFBQSxHQUFBO2NBQ0EsU0FBQSxNQUFBOzthQUVBLFNBQUEsTUFBQSxLQUFBOzs7OztVQUtBLElBQUEsU0FBQSxHQUFBLFVBQUEsR0FBQTtXQUNBLE1BQUEsS0FBQTs7OztRQUlBLElBQUEsU0FBQSxVQUFBLE1BQUEsUUFBQTtTQUNBLGFBQUE7U0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7VUFDQSxJQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsYUFBQTtXQUNBLFFBQUEsU0FBQSxNQUFBOztVQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7Ozs7UUFJQSxPQUFBLFNBQUEsS0FBQSxhQUFBLE1BQUEsT0FBQTs7T0FFQSxPQUFBLFVBQUEsS0FBQSxNQUFBO1FBQ0EsYUFBQSxNQUFBOztPQUVBLFVBQUEsVUFBQSxTQUFBOztRQUVBLGFBQUEsVUFBQTs7O1FBR0EsSUFBQSxDQUFBLFlBQUE7U0FDQSxRQUFBLFFBQUEsYUFBQSxnQkFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLFlBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxjQUFBLENBQUEsR0FBQTtXQUNBLGFBQUEsZ0JBQUE7O1VBRUEsSUFBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsS0FBQSxLQUFBLFdBQUEsVUFBQSxHQUFBO1dBQ0EsYUFBQSxhQUFBOzs7ZUFHQTtTQUNBLFFBQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsS0FBQSxTQUFBO1VBQ0EsSUFBQSxLQUFBLGlCQUFBLGVBQUEsT0FBQSxPQUFBLGFBQUE7V0FDQSxJQUFBLElBQUE7WUFDQSxLQUFBLElBQUE7O1dBRUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLFFBQUEsR0FBQTtZQUNBLEVBQUEsWUFBQSxLQUFBO1lBQ0EsSUFBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO2FBQ0EsSUFBQSxPQUFBLFdBQUEsaUJBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtjQUNBLEtBQUEsT0FBQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFNBQUE7ZUFDQSxRQUFBOztjQUVBOzs7OztXQUtBLGFBQUEsUUFBQTtZQUNBLE1BQUEsQ0FBQTtZQUNBLFFBQUEsS0FBQTs7OztTQUlBLGFBQUEsWUFBQTs7UUFFQSxhQUFBO1FBQ0EsU0FBQSxVQUFBO1NBQ0EsT0FBQSxLQUFBLGFBQUEsZ0JBQUEsb0JBQUE7U0FDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsTUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7S0FFQSxTQUFBLFNBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsV0FBQTs7SUFFQSxJQUFBLElBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxLQUFBLEdBQUE7UUFDQSxPQUFBLElBQUEsS0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUE7T0FDQSxLQUFBLFNBQUE7T0FDQSxPQUFBO2FBQ0EsS0FBQSxhQUFBLGFBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxPQUFBLEVBQUEsRUFBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxTQUFBO09BQ0EsT0FBQTthQUNBLEtBQUEsYUFBQSxhQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLEVBQUE7OztRQUdBLElBQUEsTUFBQSxHQUFBO01BQ0E7TUFDQSxZQUFBLE9BQUEsSUFBQTtNQUNBLFlBQUEsT0FBQSxJQUFBO1FBQ0EsSUFBQSxPQUFBLEdBQUE7TUFDQTtNQUNBLFlBQUEsT0FBQSxJQUFBO01BQ0EsWUFBQTs7O1FBR0EsSUFBQSxNQUFBLEdBQUE7TUFDQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTs7O1FBR0EsSUFBQSxLQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsVUFBQTtPQUNBLEtBQUE7T0FDQTtPQUNBLE9BQUEsUUFBQSxLQUFBLEtBQUE7YUFDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTthQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTthQUNBLEdBQUEsWUFBQSxXQUFBLEdBQUEsV0FBQTtJQUNBLElBQUEsS0FBQTtPQUNBLE1BQUEsTUFBQTtPQUNBLFVBQUE7T0FDQSxLQUFBO09BQ0E7T0FDQSxPQUFBO09BQ0EsS0FBQSxLQUFBO1dBQ0EsS0FBQSxTQUFBLEdBQUEsRUFBQSxLQUFBLFdBQUE7V0FDQSxNQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7T0FDQSxNQUFBLFVBQUE7V0FDQSxHQUFBLFNBQUE7O1FBRUEsR0FBQSxTQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLGFBQUEsU0FBQTtpQkFDQSxVQUFBLEtBQUE7OztJQUdBLElBQUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtJQUNBLFNBQUEsV0FBQSxFQUFBO0tBQ0EsTUFBQSxRQUFBLENBQUEsUUFBQSxFQUFBLEtBQUE7O1FBRUEsU0FBQSxVQUFBLEVBQUE7O01BRUEsU0FBQSxRQUFBLEtBQUEsTUFBQTtZQUNBLE1BQUEsYUFBQSxDQUFBLEVBQUEsS0FBQTtNQUNBLE1BQUE7OztRQUdBLFNBQUEsU0FBQSxFQUFBOztZQUVBLE1BQUEsYUFBQTtNQUNBLE1BQUE7Ozs7UUFJQSxTQUFBLFNBQUEsR0FBQTtZQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLEVBQUE7WUFDQSxPQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsSUFBQSxFQUFBOztJQUVBLFNBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLEVBQUE7OztJQUdBLE1BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLE9BQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTtLQUNBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQTtRQUNBLFVBQUEsS0FBQTs7Ozs7Ozs7O0FDaEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsZ0JBQUE7O0dBRUEsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLEtBQUE7TUFDQSxPQUFBO01BQ0EsUUFBQTtNQUNBLE1BQUE7O0tBRUEsUUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsU0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLFFBQUE7OztJQUdBLElBQUEsUUFBQTtLQUNBLEdBQUEsR0FBQSxNQUFBOztJQUVBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQTtJQUNBLE1BQUEsRUFBQSxNQUFBLENBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxPQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxPQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxTQUFBOztJQUVBLElBQUEsU0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQSxXQUFBLFNBQUEsV0FBQSxHQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLEtBQUEsU0FBQTtJQUNBLElBQUEsWUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQSxXQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLFNBQUEsTUFBQSxFQUFBLEVBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7OztLQVlBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7Ozs7Ozs7SUFVQSxJQUFBLFlBQUE7TUFDQSxPQUFBOztJQUVBLFVBQUEsS0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7UUFDQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsQ0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLGFBQUE7TUFDQSxPQUFBO0lBQ0EsV0FBQSxLQUFBLFNBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsV0FBQTs7TUFFQSxLQUFBLEtBQUEsU0FBQTtNQUNBLEtBQUEsU0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxTQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7Ozs7SUFJQSxTQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7S0FDQSxJQUFBO0tBQ0EsU0FBQSxPQUFBLElBQUEsS0FBQSxNQUFBO0tBQ0EsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxDQUFBLElBQUEsTUFBQTtZQUNBO01BQ0EsVUFBQSxNQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLENBQUEsSUFBQSxNQUFBLENBQUE7WUFDQTtNQUNBLFVBQUEsTUFBQSxDQUFBO01BQ0EsVUFBQSxNQUFBLENBQUE7O0tBRUEsVUFBQSxPQUFBLElBQUEsSUFBQTtLQUNBLElBQUEsSUFBQTtNQUNBLFVBQUEsTUFBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxDQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUEsQ0FBQTtNQUNBLFVBQUEsTUFBQTs7S0FFQSxVQUFBO0tBQ0EsT0FBQTs7SUFFQSxNQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtLQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUE7OztNQUdBLFVBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO1FBQ0EsSUFBQSxVQUFBLFdBQUE7UUFDQSxHQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsR0FBQTtTQUNBLFVBQUE7O1FBRUEsT0FBQSxjQUFBLEtBQUEsV0FBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLFdBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBOztNQUVBLFVBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsRUFBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxVQUFBLEdBQUE7U0FDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7U0FHQSxLQUFBLE9BQUEsU0FBQSxHQUFBLEVBQUE7UUFDQSxFQUFBLFFBQUEsTUFBQSxLQUFBLEdBQUE7Ozs7Ozs7Ozs7OztBQzlKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxHQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsR0FBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFVBQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQTs7R0FFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE1BQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBOzs7SUFHQSxvQkFBQTs7SUFFQSxRQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxNQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxRQUFBO0tBQ0EsWUFBQTs7SUFFQSxPQUFBO0tBQ0EsYUFBQTs7Ozs7R0FLQSxJQUFBLEdBQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxRQUFBLElBQUEsR0FBQTtHQUNBLE9BQUEsR0FBQTs7RUFFQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsR0FBQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7OztHQUdBLFFBQUEsUUFBQSxHQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsR0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7R0FFQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxRQUFBLFVBQUEsUUFBQTtJQUNBLEdBQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUE7R0FDQTtFQUNBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQTtHQUNBOzs7RUFHQSxPQUFBLE9BQUEsZ0JBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7Ozs7QUNqSUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsa0JBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxVQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3Q0FBQSxVQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBOztFQUVBLFNBQUEsWUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsTUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBOzs7RUFHQSxTQUFBLGNBQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxNQUFBLEtBQUEsT0FBQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxZQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsS0FBQTtJQUNBLEdBQUEsY0FBQTtLQUNBLEdBQUEsUUFBQTtJQUNBLEdBQUEsS0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBLDRCQUFBOzs7Ozs7O0FDNUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7O0tBRUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTs7O0tBR0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7SUFZQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDeFBBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBLE1BQUEsY0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDckZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsV0FBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxnQ0FBQSxTQUFBLGlCQUFBO0VBQ0EsSUFBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLE1BQUE7R0FDQSxNQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsV0FBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTs7R0FFQSxRQUFBO0dBQ0EsU0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFlBQUEsYUFBQTtRQUNBLFFBQUEsT0FBQSxTQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7Ozs7OztBQzNCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxhQUFBLFlBQUE7SUFDQSxHQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFNBQUEsVUFBQSxFQUFBO0lBQ0EsR0FBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsUUFBQTs7O0dBR0EsR0FBQSxRQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLE9BQUE7O09BRUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7O0VBR0EsU0FBQSxZQUFBLE1BQUE7O0dBRUEsS0FBQSxXQUFBO0dBQ0EsS0FBQSxXQUFBOzs7RUFHQSxTQUFBLGFBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBLE1BQUEsS0FBQSxHQUFBO0tBQ0EsUUFBQTs7O0dBR0EsT0FBQTs7Ozs7OztFQU9BLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxFQUFBO0tBQ0EsUUFBQTs7SUFFQSxHQUFBLENBQUEsTUFBQTtLQUNBLFNBQUEsY0FBQTs7OztHQUlBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyRkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsVUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsT0FBQTtHQUNBLGtCQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7O0FDakJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBLFNBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7OztFQUdBLFNBQUEsWUFBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFVBQUEsZUFBQSxDQUFBLEdBQUEsS0FBQSxRQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUE7S0FDQSxNQUFBLFNBQUEsTUFBQSxHQUFBLE1BQUE7Ozs7O0VBS0EsU0FBQSxhQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsS0FBQTtHQUNBLElBQUEsT0FBQSxDQUFBLE1BQUEsVUFBQSxHQUFBLE1BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxVQUFBLEdBQUEsTUFBQTtLQUNBLE1BQUEsU0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsVUFBQSxJQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxTQUFBLEtBQUEsR0FBQTtJQUNBLEdBQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxTQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsVUFBQTs7R0FFQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsR0FBQSxHQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxTQUFBLEtBQUEsR0FBQTtJQUNBLEdBQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxTQUFBLEtBQUE7VUFDQTtJQUNBLEdBQUEsS0FBQSxVQUFBOztHQUVBOzs7Ozs7O0FBT0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG5cdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0J2FwcC5maWx0ZXJzJyxcblx0XHQnYXBwLnNlcnZpY2VzJyxcblx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdCdhcHAucm91dGVzJyxcblx0XHQnYXBwLmNvbmZpZydcblx0XHRdKTtcblxuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWydGQkFuZ3VsYXInLCdkbmRMaXN0cycsJ2FuZ3VsYXIuZmlsdGVyJywnYW5ndWxhck1vbWVudCcsJ25nU2Nyb2xsYmFyJywnbWRDb2xvclBpY2tlcicsJ25nQW5pbWF0ZScsJ3VpLnRyZWUnLCd0b2FzdHInLCd1aS5yb3V0ZXInLCAnbWQuZGF0YS50YWJsZScsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICduZ01kSWNvbnMnLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICduZ01lc3NhZ2VzJywgJ25nU2FuaXRpemUnLCBcImxlYWZsZXQtZGlyZWN0aXZlXCIsJ252ZDMnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ2FuZ3VsYXItY2FjaGUnLCd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ3RvYXN0ciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ25nTWF0ZXJpYWwnLCduZ1BhcGFQYXJzZSddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblx0XHQvL1x0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZW1lbnVAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NpZGVtZW51JyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2lkZW1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG5cdFx0XHRcdHVybDogJy8nLFxuXHRcdFx0XHR2aWV3czoge1xuXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hvbWUnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyJywge1xuXHRcdFx0XHR1cmw6ICcvdXNlcicsXG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlXG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLmxvZ2luJywge1xuXHRcdFx0XHR1cmw6ICcvbG9naW4nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5wcm9maWxlJywge1xuXHRcdFx0XHR1cmw6ICcvbXktcHJvZmlsZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VzZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdHByb2ZpbGU6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkYXV0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ21lJykuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR1cmw6ICcvaW5kZXgnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y291bnRyaWVzOiBmdW5jdGlvbihDb3VudHJpZXNTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ291bnRyaWVzU2VydmljZS5nZXREYXRhKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuaW5kZXgubXlkYXRhJywge1xuXHRcdFx0XHR1cmw6ICcvbXktZGF0YScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4TXlEYXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YS5lbnRyeScsIHtcblx0XHRcdFx0dXJsOiAnLzpuYW1lJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFFbnRyeS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUVudHJ5Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3InLCB7XG5cdFx0XHRcdHVybDogJy9lZGl0b3InLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kaWNlczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJbmRpY2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdHlsZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0U3R5bGVzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjYXRlZ29yaWVzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3JpZXMoe1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR0cmVlOiB0cnVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4ZWRpdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycycsIHtcblx0XHRcdFx0dXJsOiAnL2luZGljYXRvcnMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzLmluZGljYXRvcicsIHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yaW5kaWNhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcjogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3IoJHN0YXRlUGFyYW1zLmlkKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdpbmZvJzp7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtZW51Jzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJywge1xuXHRcdFx0XHR1cmw6ICcvaW5kaXplcycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkLzpuYW1lJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGluZGV4OiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRpZiAoJHN0YXRlUGFyYW1zLmlkID09IDApIHJldHVybiB7fTtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJdGVtKCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGl6ZXMuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JpbmRpemVzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhLmFkZCcsIHtcblx0XHRcdFx0dXJsOiAnL2FkZCcsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J2FkZGl0aW9uYWxAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhpbmlkY2F0b3JzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdFx0XHRvcmRlcjogJ3RpdGxlJyxcblx0XHRcdFx0XHRcdFx0XHRcdGxpbWl0OiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMuaW5kaWNhdG9yLmRldGFpbHMnLCB7XG5cdFx0XHRcdHVybDogJy86ZW50cnknLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnLCB7XG5cdFx0XHRcdHVybDogJy9jYXRlZ29yaWVzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcy5jYXRlZ29yeScsIHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3JvdycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JjYXRlZ29yeUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRjYXRlZ29yeTogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCRzdGF0ZVBhcmFtcy5pZCA9PSAnbmV3Jyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yeSgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhjcmVhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhjcmVhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnLCB7XG5cdFx0XHRcdHVybDogJy9iYXNpYycsXG5cdFx0XHRcdGF1dGg6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jaGVjaycsIHtcblx0XHRcdFx0dXJsOiAnL2NoZWNraW5nJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhDaGVjaycpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja1NpZGViYXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNZXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNZXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2ZpbmFsJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhGaW5hbCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4RmluYWxDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbE1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lmxpc3QnLCB7XG5cdFx0XHRcdHVybDogJy9saXN0Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZnVsbExpc3QnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdGdWxsTGlzdEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0aW5kaWNlczogZnVuY3Rpb24oRGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcpLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaENhdGVnb3JpZXMoJycsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguaW5kaWNhdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvaW5kaWNhdG9yLzppZC86bmFtZScsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRpbmRpY2F0b3I6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kaWNhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yU2hvd0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJywge1xuXHRcdFx0XHR1cmw6ICcvOnllYXInLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nLCB7XG5cdFx0XHRcdHVybDogJy9kZXRhaWxzJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJbmRpY2F0b3JEYXRhKCRzdGF0ZVBhcmFtcy5pZCwgJHN0YXRlUGFyYW1zLnllYXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kaWNhdG9yL2luZGljYXRvclllYXJUYWJsZS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JZZWFyVGFibGVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHR1cmw6ICcvOmlkLzpuYW1lJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXgvaW5mby5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRkYXRhOiBmdW5jdGlvbihJbmRpemVzU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIEluZGl6ZXNTZXJ2aWNlLmZldGNoRGF0YSgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2UpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ291bnRyaWVzU2VydmljZS5nZXREYXRhKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzZWxlY3RlZCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9zZWxlY3RlZC5odG1sJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LmluZm8nLCB7XG5cdFx0XHRcdHVybDogJy9pbmZvJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhpbmZvQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhpbmZvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHR1cmw6ICcvOml0ZW0nLFxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzZWxlY3RlZCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlbGVjdGVkQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0Z2V0Q291bnRyeTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsICRzdGF0ZVBhcmFtcy5pdGVtKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdHVybDogJy9jb21wYXJlLzpjb3VudHJpZXMnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR1cmw6ICcvY29uZmxpY3QnLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4Jywge1xuXHRcdFx0XHR1cmw6ICcvaW5kZXgnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0bmF0aW9uczogZnVuY3Rpb24oUmVzdGFuZ3VsYXIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NvbmZsaWN0cy9uYXRpb25zJyk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb25mbGljdHM6IGZ1bmN0aW9uKFJlc3Rhbmd1bGFyKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjb25mbGljdHMnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NvbmZsaWN0c0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NvbmZsaWN0cycpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbG9nb0AnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9nbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHR1cmw6ICcvbmF0aW9uLzppc28nLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0bmF0aW9uOiBmdW5jdGlvbihSZXN0YW5ndWxhciwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIub25lKCcvY29uZmxpY3RzL25hdGlvbnMvJywgJHN0YXRlUGFyYW1zLmlzbykuZ2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdG5hdGlvbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NvbmZsaWN0bmF0aW9uJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdsb2dvQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleC5kZXRhaWxzJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGNvbmZsaWN0OiBmdW5jdGlvbihSZXN0YW5ndWxhciwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIub25lKCcvY29uZmxpY3RzL2V2ZW50cy8nLCAkc3RhdGVQYXJhbXMuaWQpLmdldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RkZXRhaWxzQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnY29uZmxpY3RkZXRhaWxzJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdpdGVtcy1tZW51QCc6IHt9LFxuXHRcdFx0XHRcdCdsb2dvQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dvJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbXBvcnQnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnQnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDb25mbGljdEltcG9ydEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NvbmZsaWN0SW1wb3J0Jylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbXBvcnRjc3YnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnRlcicsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwYWdlTmFtZTogJ0ltcG9ydCBDU1YnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2ltcG9ydGNzdicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwJzoge31cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdiwgJHRpbWVvdXQsICRhdXRoLCAkc3RhdGUsICRsb2NhbFN0b3JhZ2UsICR3aW5kb3csIGxlYWZsZXREYXRhLCB0b2FzdHIpIHtcblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gJGxvY2FsU3RvcmFnZS5mdWxsVmlldyB8fCBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0JHJvb3RTY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24obWVudUlkKSB7XG5cdFx0XHQkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XG5cdFx0fVxuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXHRcdFx0aWYgKHRvU3RhdGUuYXV0aCAmJiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdZb3VyIG5vdCBhbGxvd2VkIHRvIGdvIHRoZXJlIGJ1ZGR5IScsICdBY2Nlc3MgZGVuaWVkJyk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybiAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblx0XHRcdGlmICh0b1N0YXRlLmxheW91dCA9PSBcInJvd1wiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUucm93ZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiB0b1N0YXRlLnZpZXdzICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ21haW5AJykgfHwgdG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyb290U2NvcGUubWFpblZpZXcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9TdGF0ZS52aWV3cy5oYXNPd25Qcm9wZXJ0eSgnYWRkaXRpb25hbEAnKSkge1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2l0ZW1zLW1lbnVAJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2xvZ29AJykpIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmxvZ29WaWV3ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IGZhbHNlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUubG9nb1ZpZXcgPSBmYWxzZTtcblx0XHRcdFx0JHJvb3RTY29wZS5tYWluVmlldyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZS5pbmRleE9mKCdjb25mbGljdCcpID4gLTEgJiYgdG9TdGF0ZS5uYW1lICE9IFwiYXBwLmNvbmZsaWN0LmltcG9ydFwiKSB7XG5cdFx0XHRcdCRyb290U2NvcGUubm9IZWFkZXIgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ub0hlYWRlciA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSAnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zaG93SXRlbXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUucHJldmlvdXNQYWdlID0ge1xuXHRcdFx0XHRzdGF0ZTogZnJvbVN0YXRlLFxuXHRcdFx0XHRwYXJhbXM6IGZyb21QYXJhbXNcblx0XHRcdH07XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpO1xuXHRcdFx0JG1kU2lkZW5hdignbGVmdE1lbnUnKS5jbG9zZSgpO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKSB7XG5cblx0XHR9KTtcblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSkge1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRyZXNldE1hcFNpemUoKTtcblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIHJlc2V0TWFwU2l6ZSgpIHtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cdFx0Lyp3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBhdm9pZHMgc2Nyb2xsaW5nIHdoZW4gdGhlIGZvY3VzZWQgZWxlbWVudCBpcyBlLmcuIGFuIGlucHV0XG4gICAgaWYgKFxuICAgICAgICAhZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5XG4gICAgKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCh0cnVlKTtcbiAgICB9XG59KTsqL1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcikge1xuXHRcdC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcblx0XHQvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuXHRcdCRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIudW5saW5rVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvdW5saW5rLyc7XG5cdFx0JGF1dGhQcm92aWRlci5mYWNlYm9vayh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9mYWNlYm9vaycsXG5cdFx0XHRjbGllbnRJZDogJzc3MTk2MTgzMjkxMDA3Midcblx0XHR9KTtcblx0XHQkYXV0aFByb3ZpZGVyLmdvb2dsZSh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9nb29nbGUnLFxuXHRcdFx0Y2xpZW50SWQ6ICcyNzY2MzQ1Mzc0NDAtY2d0dDE0cWoyZThpbnAwdnE1b3E5YjQ2azc0ampzM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbG9nUHJvdmlkZXIpe1xuICAgICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKGZhbHNlKTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKGNmcExvYWRpbmdCYXJQcm92aWRlcil7XG5cdFx0Y2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XG5cdFx0UmVzdGFuZ3VsYXJQcm92aWRlclxuXHRcdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHRcdC5zZXREZWZhdWx0SGVhZGVycyh7XG5cdFx0XHRcdGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiXG5cdFx0XHR9KVxuXHRcdFx0LnNldERlZmF1bHRIdHRwRmllbGRzKHtcblx0XHRcdFx0Y2FjaGU6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuYWRkUmVzcG9uc2VJbnRlcmNlcHRvcihmdW5jdGlvbihkYXRhLCBvcGVyYXRpb24sIHdoYXQsIHVybCwgcmVzcG9uc2UsIGRlZmVycmVkKSB7XG5cdFx0XHRcdHZhciBleHRyYWN0ZWREYXRhO1xuXHRcdFx0XHRleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuXHRcdFx0XHRpZiAoZGF0YS5tZXRhKSB7XG5cdFx0XHRcdFx0ZXh0cmFjdGVkRGF0YS5fbWV0YSA9IGRhdGEubWV0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YS5pbmNsdWRlZCkge1xuXHRcdFx0XHRcdGV4dHJhY3RlZERhdGEuX2luY2x1ZGVkID0gZGF0YS5pbmNsdWRlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZXh0cmFjdGVkRGF0YTtcblx0XHRcdH0pO1xuXHRcdC8qXHQuc2V0RXJyb3JJbnRlcmNlcHRvcihmdW5jdGlvbihyZXNwb25zZSwgZGVmZXJyZWQsIHJlc3BvbnNlSGFuZGxlcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2VycnJvJyk7XG5cdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcblxuICAgIFx0XHRyZXR1cm4gZmFsc2U7IC8vIGVycm9yIGhhbmRsZWRcbiAgICBcdH1cblxuICAgIFx0cmV0dXJuIHRydWU7IC8vIGVycm9yIG5vdCBoYW5kbGVkXG5cdFx0fSk7Ki9cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlciwkbWRHZXN0dXJlUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuLypcdHZhciBuZW9uVGVhbE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcwMGNjYWEnXG4gIH0pO1xuXHR2YXIgd2hpdGVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnI2ZmZidcbiAgfSk7XG5cdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2JsdWUnLCB7XG4gICAgJzUwMCc6ICcjMDA2YmI5Jyxcblx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuICB9KTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25UZWFsJywgbmVvblRlYWxNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnd2hpdGVUZWFsJywgd2hpdGVNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnbGlnaHQtYmx1ZScpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7Ki9cblx0XHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdpbmRpZ28nLCB7XG5cdFx0XHQnNTAwJzogJyMwMDZiYjknLFxuXHRcdFx0J0EyMDAnOiAnIzAwNmJiOSdcblx0XHR9KTtcblx0XHRcdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2JsdWVyJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblxuXHRcdCAkbWRHZXN0dXJlUHJvdmlkZXIuc2tpcENsaWNrSGlqYWNrKCk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbih0b2FzdHJDb25maWcpe1xuICAgICAgICAvL1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICBhdXRvRGlzbWlzczogdHJ1ZSxcbiAgICAgICAgICBjb250YWluZXJJZDogJ3RvYXN0LWNvbnRhaW5lcicsXG4gICAgICAgICAgbWF4T3BlbmVkOiAyLFxuICAgICAgICAgIG5ld2VzdE9uVG9wOiB0cnVlLFxuICAgICAgICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC1ib3R0b20tcmlnaHQnLFxuICAgICAgICAgIHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHRhcmdldDogJ2JvZHknLFxuICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgIHByb2dyZXNzQmFyOnRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2FscGhhbnVtJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGlmICggIWlucHV0ICl7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhbXjAtOUEtWl0pL2csXCJcIik7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYWxsKSB7XG5cdFx0XHRyZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ2ZpbmRieW5hbWUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbmFtZSwgZmllbGQpIHtcblx0XHRcdC8vXG4gICAgICB2YXIgZm91bmRzID0gW107XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAoaW5wdXRbaV1bZmllbGRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcblx0XHRcdFx0XHQgZm91bmRzLnB1c2goaW5wdXRbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm91bmRzO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnbmV3bGluZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggdGV4dCApe1xuICAgICAgICAgICAgLy9cbiAgICBcbiAgICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oXFxcXHIpP1xcXFxuL2csICc8YnIgLz48YnIgLz4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdPcmRlck9iamVjdEJ5JywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKCFhbmd1bGFyLmlzT2JqZWN0KGlucHV0KSkgcmV0dXJuIGlucHV0O1xuXG5cdFx0XHR2YXIgYXJyYXkgPSBbXTtcblx0XHRcdGZvciAodmFyIG9iamVjdEtleSBpbiBpbnB1dCkge1xuXHRcdFx0XHRhcnJheS5wdXNoKGlucHV0W29iamVjdEtleV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdGEgPSBwYXJzZUludChhW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRiID0gcGFyc2VJbnQoYlthdHRyaWJ1dGVdKTtcblx0XHRcdFx0cmV0dXJuIGEgLSBiO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigncHJvcGVydHknLCBwcm9wZXJ0eSk7XG5cdGZ1bmN0aW9uIHByb3BlcnR5KCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoYXJyYXksIHllYXJfZmllbGQsIHZhbHVlKSB7XG5cbiAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcblxuICAgICAgICBpZihhcnJheVtpXS5kYXRhW3llYXJfZmllbGRdID09IHZhbHVlKXtcbiAgICAgICAgICBpdGVtcy5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ29udGVudFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9ySXRlbShsaXN0LGlkKXtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoO2krKyl7XG5cdFx0XHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHRcdFx0aWYoaXRlbS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHNlYXJjaEZvckl0ZW0oaXRlbS5jaGlsZHJlbiwgaWQpO1xuXHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbnRlbnQ6IHtcblx0XHRcdFx0aW5kaWNhdG9yczogW10sXG5cdFx0XHRcdGluZGljYXRvcjoge30sXG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiBbXSxcblx0XHRcdFx0Y2F0ZWdvcnk6IHt9LFxuXHRcdFx0XHRzdHlsZXM6IFtdLFxuXHRcdFx0XHRpbmZvZ3JhcGhpY3M6IFtdLFxuXHRcdFx0XHRpbmRpY2VzOltdXG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2VzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9pbmRpemVzJykuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcnM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMnLCBmaWx0ZXIpLiRvYmplY3Rcblx0XHRcdH0sXG5cdFx0XHRmZXRjaENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlciwgd2l0aG91dFNhdmUpIHtcblx0XHRcdFx0aWYod2l0aG91dFNhdmUpe1xuXHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2NhdGVnb3JpZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yaWVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoU3R5bGVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycsIGZpbHRlcikuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljZXMoZmlsdGVyKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0Q2F0ZWdvcmllczogZnVuY3Rpb24oZmlsdGVyLCB3aXRob3V0U2F2ZSkge1xuXHRcdFx0XHRpZih3aXRob3V0U2F2ZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hDYXRlZ29yaWVzKGZpbHRlciwgd2l0aG91dFNhdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoQ2F0ZWdvcmllcyhmaWx0ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcztcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2F0b3JzKCk7XG5cblx0XHRcdH0sXG5cdFx0XHRnZXRTdHlsZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LnN0eWxlcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZldGNoU3R5bGVzKGZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXM7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9yc1tpXS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNhdG9yKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcjogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3IgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGljYXRvcnMvJyArIGlkKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yUHJvbWlzZTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kaWNhdG9ycycsaWQpO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGlkLCB5ZWFyKSB7XG5cdFx0XHRcdGlmICh5ZWFyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycgKyBpZCArICcvZGF0YS8nICsgeWVhcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycgKyBpZCArICcvZGF0YScpO1xuXHRcdFx0fSxcblx0XHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHQvKlx0aWYodGhpcy5jb250ZW50LmluZGljZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0IHRoaXMuY29udGVudC5kYXRhID0gc2VhcmNoRm9ySXRlbSh0aGlzLmNvbnRlbnQuaW5kaWNlcywgaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7Ki9cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycsIGlkKVxuXHRcdFx0XHQvL31cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDb250ZW50OmZ1bmN0aW9uKGlkLCBsaXN0KXtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaWQpe1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihlbnRyeS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gdGhhdC5yZW1vdmVDb250ZW50KGlkLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRmaW5kQ29udGVudDpmdW5jdGlvbihpZCwgbGlzdCl7XG5cdFx0XHRcdHZhciBmb3VuZCA9IG51bGw7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRcdGlmKGVudHJ5LmlkID09IGlkKXtcblx0XHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuICYmIGVudHJ5LmNoaWxkcmVuLmxlbmd0aCAmJiAhZm91bmQpe1xuXHRcdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHRoYXQuZmluZENvbnRlbnQoaWQsIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gc3VicmVzdWx0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmb3VuZDtcblx0XHRcdH0sXG5cdFx0XHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dGhpcy5jb250ZW50LmluZGljZXMucHVzaChpdGVtKVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0dGhpcy5yZW1vdmVDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5yZW1vdmUoJ2luZGV4LycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVJdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIGVudHJ5ID0gdGhpcy5maW5kQ29udGVudChpdGVtLmlkLCB0aGlzLmNvbnRlbnQuaW5kaWNlcyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVudHJ5LCBpdGVtKTtcblx0XHRcdFx0cmV0dXJuIGVudHJ5ID0gaXRlbTtcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbmRDb250ZW50KGlkLCB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yeSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY2F0ZWdvcmllcy8nICsgaWQpLiRvYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVDYXRlZ29yeTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUNvbnRlbnQoaWQsIHRoaXMuY29udGVudC5jYXRlZ29yaWVzKTtcblx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLnJlbW92ZSgnY2F0ZWdvcmllcy8nLCBpZCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ291bnRyaWVzU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb3VudHJpZXM6IFtdLFxuICAgICAgICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcyA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2lzb3MnKS4kb2JqZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvdW50cmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInLCd0b2FzdHInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyLCB0b2FzdHIpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxuICAgICAgICAgIGdldE9uZTogZ2V0T25lLFxuICAgICAgICAgIHBvc3Q6IHBvc3QsXG4gICAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgcmVtb3ZlOiByZW1vdmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUsIGZpbHRlcil7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoZmlsdGVyKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5zdGF0dXNUZXh0LCAnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5kYXRhLmVycm9yLCAnU2F2aW5nIGZhaWxlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1dChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucHV0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShyb3V0ZSwgaWQsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRjb25maXJtOiBmdW5jdGlvbih0aXRsZSwgY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmNvbmZpcm0oKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHRcdFx0LmNhbmNlbCgnQ2FuY2VsJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRXJyb3JDaGVja2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTXlEYXRhKGRhdGEpIHtcbiAgICBcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzID0gW107XG4gICAgXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbXBvcnRzLCBmdW5jdGlvbihlbnRyeSkge1xuICAgIFx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG4gICAgXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2YXIgY29sdW1ucyA9IEpTT04ucGFyc2UoZW50cnkubWV0YV9kYXRhKTtcbiAgICBcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRmb3VuZCsrO1xuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQpe1xuICAgIFx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fVxuICAgICAgICAgIHJldHVybiBleHRlbmRlZENob2ljZXM7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICBcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwgaykge1xuICAgIFx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoIGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSBudWxsO1xuICAgIFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHRpZiAoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG4gICAgXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG4gICAgXHRcdFx0XHRcdFx0bWVzc2FnZTogXCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuICAgIFx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcbiAgICBcdFx0XHRcdFx0XHRyb3c6IGtleVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGtleSkge1xuICAgIFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdHZtLm5vdEZvdW5kID0gW107XG4gICAgXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcbiAgICBcdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuICAgIFx0XHRcdHZhciBpc29UeXBlID0gJ2lzby0zMTY2LTInO1xuICAgIFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcbiAgICBcdFx0XHRcdGlmIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdGlzb0NoZWNrICs9IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAxIDogMDtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0Y2FzZSAnQ2FibyBWZXJkZSc6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG4gICAgXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgXHRcdFx0XHRcdGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRkZWZhdWx0OlxuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0ZW50cmllcy5wdXNoKHtcbiAgICBcdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgIFx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuICAgIFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRJbmRleFNlcnZpY2UucmVzZXRUb1NlbGVjdCgpO1xuICAgIFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuICAgIFx0XHRcdFx0ZGF0YTogZW50cmllcyxcbiAgICBcdFx0XHRcdGlzbzogaXNvVHlwZVxuICAgIFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24oY291bnRyeSwga2V5KSB7XG4gICAgXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKGNvdW50cnkubmFtZSA9PSBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRcdFx0aWYgKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRlbnRyeTogaXRlbSxcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjb3VudHJ5LmRhdGFcbiAgICBcdFx0XHRcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZFRvU2VsZWN0KHRvU2VsZWN0KTtcbiAgICBcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY291bnRyeS5kYXRhWzBdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmRhdGFba10pO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuICAgIFx0XHRcdFx0aWYgKEluZGV4U2VydmljZS5nZXRUb1NlbGVjdCgpLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBmaWVsZCBzZWxlY3Rpb25zJywgcmVzcG9uc2UuZGF0YS5tZXNzYWdlKTtcbiAgICBcdFx0XHR9KTtcblxuICAgIFx0XHR9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2hlY2tNeURhdGE6IGNoZWNrTXlEYXRhXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZGljYXRvcnM6e30sXG4gICAgICAgICAgICB0b1NlbGVjdDpbXVxuICAgICAgICB9LCBzdG9yYWdlLCBpbXBvcnRDYWNoZSwgaW5kaWNhdG9yO1xuXG4gICAgICAgIGlmICghQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKSB7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkoJ2ltcG9ydERhdGEnLCB7XG4gICAgICAgICAgICBjYWNoZUZsdXNoSW50ZXJ2YWw6IDYwICogNjAgKiAxMDAwLCAvLyBUaGlzIGNhY2hlIHdpbGwgY2xlYXIgaXRzZWxmIGV2ZXJ5IGhvdXIuXG4gICAgICAgICAgICBkZWxldGVPbkV4cGlyZTogJ2FnZ3Jlc3NpdmUnLCAvLyBJdGVtcyB3aWxsIGJlIGRlbGV0ZWQgZnJvbSB0aGlzIGNhY2hlIHJpZ2h0IHdoZW4gdGhleSBleHBpcmUuXG4gICAgICAgICAgICBzdG9yYWdlTW9kZTogJ2xvY2FsU3RvcmFnZScgLy8gVGhpcyBjYWNoZSB3aWxsIHVzZSBgbG9jYWxTdG9yYWdlYC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKTtcbiAgICAgICAgICBzdG9yYWdlID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsZWFyOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZERhdGE6ZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSW5kaWNhdG9yOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZElzb0Vycm9yOiBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZVRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHNlcnZpY2VEYXRhLnRvU2VsZWN0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPiAtMSA/IHNlcnZpY2VEYXRhLnRvU2VsZWN0LnNwbGljZShpbmRleCwgMSkgOiBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEgPSBkYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SXNvRmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0WWVhckZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEueWVhcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VydmljZURhdGEpO1xuICAgICAgICAgIGltcG9ydENhY2hlLnB1dCgnZGF0YVRvSW1wb3J0JyxzZXJ2aWNlRGF0YSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSwgaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEFjdGl2ZUluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNbaXRlbS5jb2x1bW5fbmFtZV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnJvbUxvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGdWxsRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRNZXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29GaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmlzb19maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvdW50cnlGaWVsZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLmNvdW50cnlfZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRFcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0Vycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZpcnN0RW50cnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGFTaXplOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY3RpdmVJbmRpY2F0b3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRJbmRpY2F0b3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBudWxsO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlSXNvRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVkdWNlRXJyb3I6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0ID0gW107XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldExvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRpemVzU2VydmljZScsIGZ1bmN0aW9uIChEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4OiB7XG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyZTogbnVsbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcm9taXNlczoge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXI6IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZldGNoRGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnUmVjdXJzaW9uSGVscGVyJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogTWFudWFsbHkgY29tcGlsZXMgdGhlIGVsZW1lbnQsIGZpeGluZyB0aGUgcmVjdXJzaW9uIGxvb3AuXG5cdFx0XHRcdFx0ICogQHBhcmFtIGVsZW1lbnRcblx0XHRcdFx0XHQgKiBAcGFyYW0gW2xpbmtdIEEgcG9zdC1saW5rIGZ1bmN0aW9uLCBvciBhbiBvYmplY3Qgd2l0aCBmdW5jdGlvbihzKSByZWdpc3RlcmVkIHZpYSBwcmUgYW5kIHBvc3QgcHJvcGVydGllcy5cblx0XHRcdFx0XHQgKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbGlua2luZyBmdW5jdGlvbnMuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0Y29tcGlsZTogZnVuY3Rpb24gKGVsZW1lbnQsIGxpbmspIHtcblx0XHRcdFx0XHRcdC8vIE5vcm1hbGl6ZSB0aGUgbGluayBwYXJhbWV0ZXJcblx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24obGluaykpIHtcblx0XHRcdFx0XHRcdFx0bGluayA9IHtcblx0XHRcdFx0XHRcdFx0XHRwb3N0OiBsaW5rXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEJyZWFrIHRoZSByZWN1cnNpb24gbG9vcCBieSByZW1vdmluZyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdHZhciBjb250ZW50cyA9IGVsZW1lbnQuY29udGVudHMoKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHZhciBjb21waWxlZENvbnRlbnRzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0cHJlOiAobGluayAmJiBsaW5rLnByZSkgPyBsaW5rLnByZSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHQgKiBDb21waWxlcyBhbmQgcmUtYWRkcyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdHBvc3Q6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIENvbXBpbGUgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjb21waWxlZENvbnRlbnRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBSZS1hZGQgdGhlIGNvbXBpbGVkIGNvbnRlbnRzIHRvIHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyhzY29wZSwgZnVuY3Rpb24gKGNsb25lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmFwcGVuZChjbG9uZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBDYWxsIHRoZSBwb3N0LWxpbmtpbmcgZnVuY3Rpb24sIGlmIGFueVxuXHRcdFx0XHRcdFx0XHRcdGlmIChsaW5rICYmIGxpbmsucG9zdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGluay5wb3N0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdH0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjp7XG4gICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlci5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBteVByb2ZpbGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RnJpZW5kczogZnVuY3Rpb24oKXtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVmVjdG9ybGF5ZXJTZXJ2aWNlJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXMsIF9zZWxmID0gdGhpcztcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2FudmFzOiBmYWxzZSxcblx0XHRcdHBhbGV0dGU6IFtdLFxuXHRcdFx0Y3R4OiAnJyxcblx0XHRcdGtleXM6IHtcblx0XHRcdFx0bWF6cGVuOiAndmVjdG9yLXRpbGVzLVEzX09zNXcnLFxuXHRcdFx0XHRtYXBib3g6ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSdcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGxheWVyOiAnJyxcblx0XHRcdFx0bmFtZTogJ2NvdW50cmllc19iaWcnLFxuXHRcdFx0XHRiYXNlQ29sb3I6ICcjMDZhOTljJyxcblx0XHRcdFx0aXNvMzogJ2FkbTBfYTMnLFxuXHRcdFx0XHRpc28yOiAnaXNvX2EyJyxcblx0XHRcdFx0aXNvOiAnaXNvX2EyJyxcblx0XHRcdFx0ZmllbGRzOiBcImlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLGlzb19hMixuYW1lLG5hbWVfbG9uZ1wiLFxuXHRcdFx0XHRmaWVsZDonc2NvcmUnXG5cdFx0XHR9LFxuXHRcdFx0bWFwOiB7XG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjdXJyZW50OiBbXSxcblx0XHRcdFx0c3RydWN0dXJlOiBbXSxcblx0XHRcdFx0c3R5bGU6IFtdXG5cdFx0XHR9LFxuXHRcdFx0bWFwTGF5ZXI6IG51bGwsXG5cdFx0XHRzZXRNYXA6IGZ1bmN0aW9uKG1hcCl7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1hcExheWVyID0gbWFwO1xuXHRcdFx0fSxcblx0XHRcdHNldExheWVyOiBmdW5jdGlvbihsKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXIgPSBsO1xuXHRcdFx0fSxcblx0XHRcdGdldExheWVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5sYXllcjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYW1lOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5uYW1lO1xuXHRcdFx0fSxcblx0XHRcdGZpZWxkczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuZmllbGRzO1xuXHRcdFx0fSxcblx0XHRcdGlzbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvO1xuXHRcdFx0fSxcblx0XHRcdGlzbzM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzM7XG5cdFx0XHR9LFxuXHRcdFx0aXNvMjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEuaXNvMjtcblx0XHRcdH0sXG5cdFx0XHRjcmVhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2Upe1xuXG5cdFx0XHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXG5cdFx0XHR9LFxuXHRcdFx0dXBkYXRlRml4ZWRDYW52YXM6IGZ1bmN0aW9uKGNvbG9yUmFuZ2UpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjb2xvclJhbmdlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSAvIChjb2xvclJhbmdlLmxlbmd0aCAtMSkgKiBpLCBjb2xvclJhbmdlW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0QmFzZUNvbG9yOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0fSxcblx0XHQvKlx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKSB7XG5cdFx0XHRcdHRoaXMuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSlcblx0XHRcdH0sKi9cblx0XHRcdGNvdW50cnlDbGljazogZnVuY3Rpb24oY2xpY2tGdW5jdGlvbikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEubGF5ZXIub3B0aW9ucy5vbkNsaWNrID0gY2xpY2tGdW5jdGlvbjtcblx0XHRcdFx0fSlcblxuXHRcdFx0fSxcblx0XHRcdGdldENvbG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWxldHRlW3ZhbHVlXTtcblx0XHRcdH0sXG5cdFx0XHRzZXRTdHlsZTogZnVuY3Rpb24oc3R5bGUpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXAuc3R5bGUgPSBzdHlsZTtcblx0XHRcdH0sXG5cdFx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhLCBjb2xvciwgZHJhd0l0KSB7XG5cdFx0XHRcdHRoaXMubWFwLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNvbG9yICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHR0aGlzLmRhdGEuYmFzZUNvbG9yID0gY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLmNhbnZhcykge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5jcmVhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5iYXNlQ29sb3IgPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUZpeGVkQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHJhd0l0KSB7XG5cdFx0XHRcdFx0dGhpcy5wYWludENvdW50cmllcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmF0aW9uQnlJc286IGZ1bmN0aW9uKGlzbywgbGlzdCkge1xuXHRcdFx0XHRpZih0eXBlb2YgbGlzdCAhPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdGlmICh0aGlzLm1hcC5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLm1hcC5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYXRpb25CeU5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0aWYgKHRoaXMubWFwLmRhdGEubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRwYWludENvdW50cmllczogZnVuY3Rpb24oc3R5bGUsIGNsaWNrLCBtdXRleCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzdHlsZSAhPSBcInVuZGVmaW5lZFwiICYmIHN0eWxlICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZSh0aGF0Lm1hcC5zdHlsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2xpY2sgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXRTZWxlY3RlZDogZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5sYXllci5sYXllcnMgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXMsIGZ1bmN0aW9uKGZlYXR1cmUsIGtleSl7XG5cdFx0XHRcdFx0XHRpZihpc28pe1xuXHRcdFx0XHRcdFx0XHRpZihrZXkgIT0gaXNvKVxuXHRcdFx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZTpmdW5jdGlvbihpc28sIHNlbGVjdGVkKXtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXNbaXNvXSA9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaXNvKTtcblx0XHRcdFx0XHQvL2RlYnVnZ2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLmxheWVyc1t0aGlzLmRhdGEubmFtZSsnX2dlb20nXS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHJlZHJhdzpmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIucmVkcmF3KCk7XG5cdFx0XHR9LFxuXHRcdFx0Ly9GVUxMIFRPIERPXG5cdFx0XHRjb3VudHJpZXNTdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdGhhdC5kYXRhLmlzbzJdO1xuXHRcdFx0XHR2YXIgbmF0aW9uID0gdGhhdC5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0XHR2YXIgZmllbGQgPSB0aGF0LmRhdGEuZmllbGQ7XG5cdFx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cblx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIgJiYgbmF0aW9uW2ZpZWxkXSAhPSBudWxsKXtcblx0XHRcdFx0XHRcdFx0dmFyIGxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5yYW5nZS5taW4sdm0ucmFuZ2UubWF4XSkucmFuZ2UoWzAsMjU2XSk7XG5cblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gIHBhcnNlSW50KGxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7Ly8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coY29sb3JQb3MsIGlzbyxuYXRpb24pO1xuXHRcdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdEltcG9ydEN0cmwnLCBmdW5jdGlvbihSZXN0YW5ndWxhciwgdG9hc3RyLCAkc3RhdGUpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9ucyA9IFtdO1xuXHRcdHZtLmV2ZW50cyA9IFtdO1xuXHRcdHZtLnN1bSA9IDA7XG5cblx0XHR2bS5zYXZlVG9EYiA9IHNhdmVUb0RiO1xuXG5cdFx0ZnVuY3Rpb24gc2F2ZVRvRGIoKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0bmF0aW9uczogdm0ubmF0aW9ucyxcblx0XHRcdFx0ZXZlbnRzOiB2bS5ldmVudHNcblx0XHRcdH07XG5cdFx0XHRSZXN0YW5ndWxhci5hbGwoJy9jb25mbGljdHMvaW1wb3J0JykucG9zdChkYXRhKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgnKVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkc3RhdGUsICRzY29wZSwgJHJvb3RTY29wZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBjb25mbGljdCwgY29uZmxpY3RzLCBuYXRpb25zLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG5cdFx0dm0uY29uZmxpY3RzID0gbmF0aW9ucztcblx0XHR2bS5jb25mbGljdEl0ZW1zID0gW1xuXHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdCdhdXRvbm9teScsXG5cdFx0XHQnc3lzdGVtJyxcblx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnaW50ZXJuYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS5zaG93TWV0aG9kID0gc2hvd01ldGhvZDtcblx0XHR2bS5zaG93Q291bnRyaWVzID0gZmFsc2U7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLmNvdW50cmllcyA9IFtdO1xuXHRcdHZtLnNob3dUZXh0ID0gc2hvd1RleHQ7XG5cdFx0dm0uc2hvd0NvdW50cmllc0J1dHRvbiA9IHNob3dDb3VudHJpZXNCdXR0b247XG5cdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdGNvbG9yOiAnIzRmYjBlNScsXG5cdFx0XHRmaWVsZDogJ2ludDIwMTUnLFxuXHRcdFx0c2l6ZTogNSxcblx0XHRcdGhpZGVOdW1iZXJpbmc6IHRydWUsXG5cdFx0XHR3aWR0aDo2NSxcblx0XHRcdGhlaWdodDo2NVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQvLztcblx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uY29uZmxpY3RzLCB2bS5jb2xvcnMsIHRydWUpO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoKTtcblxuXHRcdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdC5uYXRpb25zLCBmdW5jdGlvbihuYXRpb24pIHtcblx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuXHRcdFx0XHRcdGlmIChpID09IC0xKSB7XG5cdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0dm0uY291bnRyaWVzLnB1c2gobmF0aW9uKTtcblx0XHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUobmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcyhpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94Jywgdm0ucmVsYXRpb25zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVsyXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFx0WzUwLCA1MF1cblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLm1hcExheWVyLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd1RleHQoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3R0ZXh0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93TWV0aG9kKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvbmZsaWN0bWV0aG9kZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJ2ludGVuc2l0eSc7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2hvd0NvdW50cmllc0J1dHRvbigpIHtcblx0XHRcdGlmICh2bS5zaG93Q291bnRyaWVzKSByZXR1cm4gXCJhcnJvd19kcm9wX3VwXCI7XG5cdFx0XHRyZXR1cm4gXCJhcnJvd19kcm9wX2Rvd25cIjtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RpdGVtc0N0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnNob3dMaXN0ID0gZmFsc2U7XG5cdFx0JHJvb3RTY29wZS5jb25mbGljdEl0ZW1zID0gW1xuXHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHQnc2VjZXNzaW9uJyxcblx0XHRcdCdhdXRvbm9teScsXG5cdFx0XHQnc3lzdGVtJyxcblx0XHRcdCduYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnaW50ZXJuYXRpb25hbF9wb3dlcicsXG5cdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0J3Jlc291cmNlcycsXG5cdFx0XHQnb3RoZXInXG5cdFx0XTtcblx0XHR2bS50b2dnbGVJdGVtID0gdG9nZ2xlSXRlbTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0oaXRlbSkge1xuXHRcdFx0Y29uc29sZS5sb2coaXRlbSwgJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zKTtcblx0XHRcdHZhciBpID0gJHJvb3RTY29wZS5jb25mbGljdEl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCRyb290U2NvcGUuY29uZmxpY3RJdGVtcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmNvbmZsaWN0SXRlbXMgPSBbXG5cdFx0XHRcdFx0J3RlcnJpdG9yeScsXG5cdFx0XHRcdFx0J3NlY2Vzc2lvbicsXG5cdFx0XHRcdFx0J2F1dG9ub215Jyxcblx0XHRcdFx0XHQnc3lzdGVtJyxcblx0XHRcdFx0XHQnbmF0aW9uYWxfcG93ZXInLFxuXHRcdFx0XHRcdCdpbnRlcm5hdGlvbmFsX3Bvd2VyJyxcblx0XHRcdFx0XHQnc3VibmF0aW9uYWxfcHJlZG9taW5hY2UnLFxuXHRcdFx0XHRcdCdyZXNvdXJjZXMnLFxuXHRcdFx0XHRcdCdvdGhlcidcblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdG5hdGlvbkN0cmwnLCBmdW5jdGlvbigkdGltZW91dCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBuYXRpb25zLCBuYXRpb24sIFZlY3RvcmxheWVyU2VydmljZSwgRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9uID0gbmF0aW9uO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuXHRcdHZtLmNvbG9ycyA9IFsnI2Q0ZWJmNycsICcjODdjY2ViJywgJyMzNmE4YzYnLCAnIzI2ODM5OScsICcjMGU2Mzc3J107XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0uZmVhdHVyZWQgPSBbXTtcblx0XHR2bS5jb25mbGljdCA9IG51bGw7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0Y29sb3I6ICcjNGZiMGU1Jyxcblx0XHRcdGZpZWxkOiAnaW50ZW5zaXR5Jyxcblx0XHRcdHNpemU6IDUsXG5cdFx0XHRoaWRlTnVtYmVyaW5nOiB0cnVlLFxuXHRcdFx0d2lkdGg6NjUsXG5cdFx0XHRoZWlnaHQ6NjVcblx0XHR9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0JHJvb3RTY29wZS5mZWF0dXJlSXRlbXMgPSBbXTtcblxuXHRcdFx0bmF0aW9ucy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2godm0ubmF0aW9uLmlzbyk7XG5cdFx0XHRcdHZtLmZlYXR1cmVkID0gW107XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5yZXNldFNlbGVjdGVkKHZtLm5hdGlvbi5pc28pO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0RGF0YSh2bS5jb25mbGljdHMsIHZtLmNvbG9ycywgdHJ1ZSk7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNvdW50cnlDbGljayhjb3VudHJ5Q2xpY2spO1xuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKHZtLm5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmZlYXR1cmVJdGVtcyA9IFtdO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubmF0aW9uLmNvbmZsaWN0cywgZnVuY3Rpb24oY29uZmxpY3QpIHtcblx0XHRcdFx0XHRpZiAoIXZtLmNvbmZsaWN0KSB2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuXHRcdFx0XHRcdGlmIChjb25mbGljdC5pbnQyMDE1ID4gdm0uY29uZmxpY3QuaW50MjAxNSkge1xuXHRcdFx0XHRcdFx0dm0uY29uZmxpY3QgPSBjb25mbGljdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0aWYoaXRlbSA9PSAxICl7XG5cdFx0XHRcdFx0XHRcdGlmKHZtLmZlYXR1cmVkLmluZGV4T2Yoa2V5KSA9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZmVhdHVyZWQucHVzaChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdCRyb290U2NvcGUuZmVhdHVyZUl0ZW1zID0gdm0uZmVhdHVyZWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uKG5hdGlvbikge1xuXHRcdFx0XHRcdFx0dmFyIGkgPSB2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXRpb24uaXNvKTtcblx0XHRcdFx0XHRcdGlmIChpID09IC0xICYmIG5hdGlvbi5pc28gIT0gdm0ubmF0aW9uLmlzbykge1xuXHRcdFx0XHRcdFx0XHR2bS5yZWxhdGlvbnMucHVzaChuYXRpb24uaXNvKVxuXHRcdFx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKG5hdGlvbi5pc28sIHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIHZtLnJlbGF0aW9ucykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRcdFs1MCwgNTBdXG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5tYXBMYXllci5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiBwYWRbMV0sXG5cdFx0XHRcdFx0XHRtYXhab29tOiA0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cdFx0XHR9KVxuXG5cblxuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gc2hvd01ldGhvZCgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb25mbGljdG1ldGhvZGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICh2bS5jb25mbGljdCA9PSBudWxsKSByZXR1cm4gXCJyZW1vdmVcIjtcblx0XHRcdGlmICh2bS5jb25mbGljdC5pbnQyMDE1ID09IHZtLmNvbmZsaWN0LmludDIwMTQpXG5cdFx0XHRcdHJldHVybiBcInJlbW92ZVwiO1xuXHRcdFx0aWYgKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuXHRcdFx0XHRyZXR1cm4gXCJ0cmVuZGluZ19kb3duXCI7XG5cblx0XHRcdHJldHVybiBcInRyZW5kaW5nX3VwXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG5cdFx0XHR2YXIgY291bnRyeSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzWydpc29fYTInXSk7XG5cdFx0XHRpZiAodHlwZW9mIGNvdW50cnlbJ2ludGVuc2l0eSddICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1tWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yXTtcblx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQodm0ubGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsgLy8gcGFyc2VJbnQoMjU2IC8gdm0ucmFuZ2UubWF4ICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknO1xuXHRcdFx0dmFyIGNvbG9yRnVsbCA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHZhciBvdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdHNpemU6IDFcblx0XHRcdH07XG5cdFx0XHRpZiAoaXNvID09IHZtLm5hdGlvbi5pc28pIHtcblx0XHRcdFx0b3V0bGluZSA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNTQsNTYsNTksMC44KScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb2xvciA9IGNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZTogb3V0bGluZVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0c0N0cmwnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRzdGF0ZSwgJHJvb3RTY29wZSwgJHNjb3BlLCBjb25mbGljdHMsIG5hdGlvbnMsIFZlY3RvcmxheWVyU2VydmljZSwgUmVzdGFuZ3VsYXIsIERpYWxvZ1NlcnZpY2UsIEZ1bGxzY3JlZW4pIHtcblx0XHQvL1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yZWFkeSA9IGZhbHNlO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuXHRcdHZtLnNob3dNZXRob2QgPSBzaG93TWV0aG9kO1xuXHRcdHZtLmdvRnVsbHNjcmVlbiA9IGdvRnVsbHNjcmVlbjtcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnR5cGVzQ29sb3JzID0ge1xuXHRcdFx0aW50ZXJzdGF0ZTogJyM2OWQ0YzMnLFxuXHRcdFx0aW50cmFzdGF0ZTogJyNiN2I3YjcnLFxuXHRcdFx0c3Vic3RhdGU6ICcjZmY5ZDI3J1xuXHRcdH07XG5cdFx0dm0uYWN0aXZlID0ge1xuXHRcdFx0Y29uZmxpY3Q6IFtdLFxuXHRcdFx0dHlwZTogWzEsIDIsIDNdXG5cdFx0fTtcblx0XHR2bS50b2dnbGVDb25mbGljdEZpbHRlciA9IHRvZ2dsZUNvbmZsaWN0RmlsdGVyO1xuXHRcdHZtLmNvbmZsaWN0RmlsdGVyID0gbnVsbDtcblxuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdG5hdGlvbnMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZtLm5hdGlvbnMgPSByZXNwb25zZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0ubmF0aW9ucywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uZmxpY3RzLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHR2bS5jb25mbGljdHMgPSByZXNwb25zZTtcblx0XHRcdFx0Y2FsY0ludGVuc2l0aWVzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvL30pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvRnVsbHNjcmVlbigpIHtcblxuXHRcdCBpZiAoRnVsbHNjcmVlbi5pc0VuYWJsZWQoKSlcblx0XHRcdFx0RnVsbHNjcmVlbi5jYW5jZWwoKTtcblx0XHQgZWxzZVxuXHRcdFx0XHRGdWxsc2NyZWVuLmFsbCgpO1xuXG5cdFx0IC8vIFNldCBGdWxsc2NyZWVuIHRvIGEgc3BlY2lmaWMgZWxlbWVudCAoYmFkIHByYWN0aWNlKVxuXHRcdCAvLyBGdWxsc2NyZWVuLmVuYWJsZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZycpIClcblxuXHR9XG5cdFx0ZnVuY3Rpb24gc2V0VmFsdWVzKCkge1xuXHRcdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0XHR2bS5jb25mbGljdEZpbHRlckNvdW50ID0gMDtcblx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMgPSB7XG5cdFx0XHRcdHZlcnlMb3c6IDAsXG5cdFx0XHRcdGxvdzogMCxcblx0XHRcdFx0bWlkOiAwLFxuXHRcdFx0XHRoaWdoOiAwLFxuXHRcdFx0XHR2ZXJ5SGlnaDogMFxuXHRcdFx0fTtcblx0XHRcdHZtLmNoYXJ0RGF0YSA9IFt7XG5cdFx0XHRcdGxhYmVsOiAxLFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1swXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogMixcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMV1cblx0XHRcdH0sIHtcblx0XHRcdFx0bGFiZWw6IDMsXG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRjb2xvcjogdm0uY29sb3JzWzJdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGxhYmVsOiA0LFxuXHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0Y29sb3I6IHZtLmNvbG9yc1szXVxuXHRcdFx0fSwge1xuXHRcdFx0XHRsYWJlbDogNSxcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbNF1cblx0XHRcdH1dO1xuXG5cdFx0XHR2bS5jb25mbGljdFR5cGVzID0gW3tcblx0XHRcdFx0dHlwZTogJ2ludGVyc3RhdGUnLFxuXHRcdFx0XHR0eXBlX2lkOiAxLFxuXHRcdFx0XHRjb2xvcjogJyM2OWQ0YzMnLFxuXHRcdFx0XHRjb3VudDogMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR0eXBlOiAnaW50cmFzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAyLFxuXHRcdFx0XHRjb2xvcjogJyNiN2I3YjcnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHR5cGU6ICdzdWJzdGF0ZScsXG5cdFx0XHRcdGNvdW50OiAwLFxuXHRcdFx0XHR0eXBlX2lkOiAzLFxuXHRcdFx0XHRjb2xvcjogJyNmZjlkMjcnXG5cdFx0XHR9XTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNob3dNZXRob2QoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29uZmxpY3RtZXRob2RlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29uZmxpY3RGaWx0ZXIodHlwZSkge1xuXG5cdFx0XHR2YXIgaSA9IHZtLmFjdGl2ZS50eXBlLmluZGV4T2YodHlwZSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnNwbGljZShpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmFjdGl2ZS50eXBlLnB1c2godHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dm0uYWN0aXZlLnR5cGUgPSBbMSwgMiwgM107XG5cdFx0XHR9XG5cdFx0XHRjYWxjSW50ZW5zaXRpZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjQ29uZmxpY3QoY29uZmxpY3QpIHtcblx0XHRcdHZtLmNvbmZsaWN0RmlsdGVyQ291bnQrKztcblx0XHRcdHN3aXRjaCAoY29uZmxpY3QudHlwZV9pZCkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzBdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzFdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzJdLmNvdW50Kys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChjb25mbGljdC5pbnQyMDE1KSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUxvdysrO1xuXHRcdFx0XHR2bS5jaGFydERhdGFbMF0udmFsdWUrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMubG93Kys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVsxXS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy5taWQrKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzJdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmhpZ2grKztcblx0XHRcdFx0dm0uY2hhcnREYXRhWzNdLnZhbHVlKys7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLnZlcnlIaWdoKys7XG5cdFx0XHRcdHZtLmNoYXJ0RGF0YVs0XS52YWx1ZSsrO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHR9XG5cdFx0XHRhZGRDb3VudHJpZXMoY29uZmxpY3QubmF0aW9ucyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGFkZENvdW50cmllcyhuYXRpb25zKXtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuYXRpb25zLCBmdW5jdGlvbihuYXQpe1xuXHRcdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihuYXQuaXNvKSA9PSAtMSl7XG5cdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0Lmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYWxjSW50ZW5zaXRpZXMoKSB7XG5cdFx0XHRzZXRWYWx1ZXMoKTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb25mbGljdHMsIGZ1bmN0aW9uIChjb25mbGljdCkge1xuXHRcdFx0XHRpZiAodm0uYWN0aXZlLnR5cGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKHZtLmFjdGl2ZS50eXBlLmluZGV4T2YoY29uZmxpY3QudHlwZV9pZCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2FsY0NvbmZsaWN0KGNvbmZsaWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR2bS5yZWFkeSA9IHRydWU7XG5cdFx0XHQvL1ZlY3RvcmxheWVyU2VydmljZS5yZWRyYXcoKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5wYWludENvdW50cmllcygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblx0XHRcdHZhciBjb3VudHJ5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbJ2lzb19hMiddKTtcblx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleC5uYXRpb24nLCB7XG5cdFx0XHRcdFx0aXNvOiBjb3VudHJ5Lmlzb1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZih2bS5yZWxhdGlvbnMuaW5kZXhPZihpc28pID09IC0xKXtcblx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCAmJiBpc28pIHtcblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGdWxsTGlzdEN0cmwnLCBmdW5jdGlvbihjYXRlZ29yaWVzLCBpbmRpY2F0b3JzLCBpbmRpY2VzKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXHRcdHZtLmluZGljZXMgPSBpbmRpY2VzO1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0uZmlsdGVyID0gW107XG5cdFx0dm0udG9nZ2xlQ2F0RmlsdGVyID0gdG9nZ2xlQ2F0RmlsdGVyO1xuXHRcdHZtLmZpbHRlckV4aXN0cyA9IGZpbHRlckV4aXN0cztcblx0XHR2bS5jYXRGaWx0ZXIgPSBjYXRGaWx0ZXI7XG5cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ2F0RmlsdGVyKGlkKXtcblxuXHRcdFx0dmFyIGlkeCA9IHZtLmZpbHRlci5pbmRleE9mKGlkKTtcblx0XHRcdGlmKGlkeCA+IC0xKSB2bS5maWx0ZXIuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRlbHNlIHZtLmZpbHRlci5wdXNoKGlkKTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBmaWx0ZXJFeGlzdHMoaWQpe1xuXHRcdFx0cmV0dXJuIHZtLmZpbHRlci5pbmRleE9mKGlkKSA+IC0xO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjYXRGaWx0ZXIoaXRlbSl7XG5cblx0XHRcdFx0aWYoaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA+IDAgJiYgdm0uZmlsdGVyLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG5cdFx0XHRcdFx0XHRpZih2bS5maWx0ZXIuaW5kZXhPZihjYXQuaWQpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZvdW5kO3Ncblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkbWRNZWRpYSwgbGVhZmxldERhdGEsICRzdGF0ZSwkbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyLCAkdGltZW91dCl7XG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdCRyb290U2NvcGUuaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9naW4gPSBkb0xvZ2luO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVWaWV3ID0gdG9nZ2xlVmlldztcblxuXHRcdHZtLmF1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKHByb3ZpZGVyKXtcblx0XHRcdCRhdXRoLmF1dGhlbnRpY2F0ZShwcm92aWRlcik7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dpbigpe1xuXHRcdFx0JGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9nb3V0KCl7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdCRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHRmdW5jdGlvbiB0b2dnbGVWaWV3KCl7XG5cdFx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gISRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHQkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3ID0gJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCckcm9vdC5zaWRlYmFyT3BlbicsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRpZihuID09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7IHJldHVybiAkbWRNZWRpYSgneHMnKSB9LCBmdW5jdGlvbihzbWFsbCkge1xuXHQgICAgdm0uc21hbGxTY3JlZW4gPSBzbWFsbDtcblx0ICB9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4Jywge2lzX29mZmljaWFsOiB0cnVlfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgdm0uaW5kaXplcyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0ltcG9ydGNzdkN0cmwnLCBmdW5jdGlvbiAoJG1kRGlhbG9nKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IHtcblx0XHRcdHByaW50TGF5b3V0OiB0cnVlLFxuXHRcdFx0c2hvd1J1bGVyOiB0cnVlLFxuXHRcdFx0c2hvd1NwZWxsaW5nU3VnZ2VzdGlvbnM6IHRydWUsXG5cdFx0XHRwcmVzZW50YXRpb25Nb2RlOiAnZWRpdCdcblx0XHR9O1xuXG5cdFx0dGhpcy5zYW1wbGVBY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgZXYpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdC50aXRsZShuYW1lKVxuXHRcdFx0XHQuY29udGVudCgnWW91IHRyaWdnZXJlZCB0aGUgXCInICsgbmFtZSArICdcIiBhY3Rpb24nKVxuXHRcdFx0XHQub2soJ0dyZWF0Jylcblx0XHRcdFx0LnRhcmdldEV2ZW50KGV2KVxuXHRcdFx0KTtcblx0XHR9O1xuXG4gICAgdGhpcy5vcGVuQ3N2VXBsb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Ly9jb250cm9sbGVyOiBEaWFsb2dDb250cm9sbGVyLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbXBvcnRjc3YvY3N2VXBsb2FkRGlhbG9nLmh0bWwnLFxuXHQgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbnN3ZXIpIHtcblxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0fSk7XG5cdFx0fTtcblx0fSlcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCRtZFNpZGVuYXYsICRyb290U2NvcGUsICRmaWx0ZXIsICRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBkYXRhLCBjb3VudHJpZXMsIGxlYWZsZXREYXRhLCBEYXRhU2VydmljZSkge1xuXHRcdC8vIFZhcmlhYmxlIGRlZmluaXRpb25zXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5tYXAgPSBudWxsO1xuXG5cdFx0dm0uZGF0YVNlcnZlciA9IGRhdGEucHJvbWlzZXMuZGF0YTtcblx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLnN0cnVjdHVyZTtcblx0XHR2bS5jb3VudHJ5TGlzdCA9IGNvdW50cmllcztcblxuXHRcdHZtLnN0cnVjdHVyZSA9IFwiXCI7XG5cdFx0dm0ubXZ0U2NvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdHZtLm12dENvdW50cnlMYXllciA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyR2VvbSA9IHZtLm12dENvdW50cnlMYXllciArIFwiX2dlb21cIjtcblx0XHR2bS5pc29fZmllbGQgPSBWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yO1xuXHRcdHZtLm5vZGVQYXJlbnQgPSB7fTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0dm0udGFiQ29udGVudCA9IFwiXCI7XG5cdFx0dm0udG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0dm0ubWVudWVPcGVuID0gdHJ1ZTtcblx0XHR2bS5pbmZvID0gZmFsc2U7XG5cdFx0dm0uY2xvc2VJY29uID0gJ2Nsb3NlJztcblx0XHR2bS5jb21wYXJlID0ge1xuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdGNvdW50cmllczogW11cblx0XHR9O1xuXHRcdHZtLmRpc3BsYXkgPSB7XG5cdFx0XHRzZWxlY3RlZENhdDogJydcblx0XHR9O1xuXG5cdFx0Ly9GdW5jdGlvbiBkZWZpbml0b25zXG5cdFx0dm0uc2hvd1RhYkNvbnRlbnQgPSBzaG93VGFiQ29udGVudDtcblx0XHR2bS5zZXRUYWIgPSBzZXRUYWI7XG5cdFx0dm0uc2V0U3RhdGUgPSBzZXRTdGF0ZTtcblx0XHR2bS5zZXRDdXJyZW50ID0gc2V0Q3VycmVudDtcblx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUgPSBzZXRTZWxlY3RlZEZlYXR1cmU7XG5cdFx0dm0uZ2V0UmFuayA9IGdldFJhbms7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cblx0XHR2bS5jaGVja0NvbXBhcmlzb24gPSBjaGVja0NvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlT3BlbiA9IHRvZ2dsZU9wZW47XG5cdFx0dm0udG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0dm0udG9nZ2xlRGV0YWlscyA9IHRvZ2dsZURldGFpbHM7XG5cdFx0dm0udG9nZ2xlQ29tcGFyaXNvbiA9IHRvZ2dsZUNvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0ID0gdG9nZ2xlQ291bnRyaWVMaXN0O1xuXHRcdHZtLm1hcEdvdG9Db3VudHJ5ID0gbWFwR290b0NvdW50cnk7XG5cdFx0dm0uZ29CYWNrID0gZ29CYWNrO1xuXHRcdHZtLmdvVG9JbmRleCA9IGdvVG9JbmRleDtcblxuXHRcdHZtLmNhbGNUcmVlID0gY2FsY1RyZWU7XG5cblx0XHR2bS5pc1ByZWxhc3QgPSBpc1ByZWxhc3Q7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdHZtLnN0cnVjdHVyZVNlcnZlci50aGVuKGZ1bmN0aW9uKHN0cnVjdHVyZSkge1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdHZtLnN0cnVjdHVyZSA9IHN0cnVjdHVyZTtcblx0XHRcdFx0XHRpZiAoIXZtLnN0cnVjdHVyZS5zdHlsZSkge1xuXHRcdFx0XHRcdFx0dm0uc3RydWN0dXJlLnN0eWxlID0ge1xuXHRcdFx0XHRcdFx0XHQnbmFtZSc6ICdkZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0J3RpdGxlJzogJ0RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQnYmFzZV9jb2xvcic6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjcmVhdGVDYW52YXModm0uc3RydWN0dXJlLnN0eWxlLmJhc2VfY29sb3IpO1xuXHRcdFx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5pdGVtKSB7XG5cdFx0XHRcdFx0XHR2bS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKSB7XG5cdFx0XHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKHZtLmN1cnJlbnQpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pIHtcblx0XHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChnZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Ly9vbnNvbGUubG9nKHZtLmNvbXBhcmUuY291bnRyaWVzKTtcblx0XHRcdFx0XHRcdGNvdW50cmllcy5wdXNoKHZtLmN1cnJlbnQuaXNvKTtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBjb3VudHJpZXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdC8vIFRPRE86IE1PVkUgVE8gR0xPQkFMXG5cdFx0ZnVuY3Rpb24gZ29CYWNrKCkge1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ29Ub0luZGV4KGl0ZW0pe1xuXG5cdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyx7XG5cdFx0XHRcdGlkOml0ZW0uaWQsXG5cdFx0XHRcdG5hbWU6aXRlbS5uYW1lLFxuXHRcdFx0XHRpdGVtOiRzdGF0ZS5wYXJhbXNbJ2l0ZW0nXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGlzUHJlbGFzdCgpe1xuXHRcdFx0dmFyIGxldmVsc0ZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc3RydWN0dXJlLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG5cdFx0XHRcdGlmKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdGxldmVsc0ZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbGV2ZWxzRm91bmQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dUYWJDb250ZW50KGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmIHZtLnRhYkNvbnRlbnQgPT0gJycpIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0dm0udG9nZ2xlQnV0dG9uID0gdm0udGFiQ29udGVudCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTdGF0ZShpdGVtKSB7XG5cdFx0XHR2bS5zZXRDdXJyZW50KGdldE5hdGlvbkJ5SXNvKGl0ZW0pKTtcblx0XHRcdGZldGNoTmF0aW9uRGF0YShpdGVtKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlT3BlbigpIHtcblx0XHRcdHZtLm1lbnVlT3BlbiA9ICF2bS5tZW51ZU9wZW47XG5cdFx0XHR2bS5jbG9zZUljb24gPSB2bS5tZW51ZU9wZW4gPT0gdHJ1ZSA/ICdjaGV2cm9uX2xlZnQnIDogJ2NoZXZyb25fcmlnaHQnO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldEN1cnJlbnQobmF0KSB7XG5cdFx0XHR2bS5jdXJyZW50ID0gbmF0O1xuXG5cdFx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblxuXHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLm9wZW4oKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKGlzbykge1xuXHRcdFx0aWYgKHZtLm12dFNvdXJjZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gY2FsY1JhbmsoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0dmFyIGthY2sgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly92bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsICdzY29yZScsICdpc28nLCB0cnVlKTtcblx0XHRcdHJhbmsgPSB2bS5kYXRhLmluZGV4T2Yodm0uY3VycmVudCkgKyAxO1xuXHRcdFx0dm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUubmFtZSArICdfcmFuayddID0gcmFuaztcblx0XHRcdHZtLmNpcmNsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdGNvbG9yOiB2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdGZpZWxkOiB2bS5zdHJ1Y3R1cmUubmFtZSArICdfcmFuaycsXG5cdFx0XHRcdHNpemU6IHZtLmRhdGEubGVuZ3RoXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpIHtcblxuXHRcdFx0dmFyIHJhbmsgPSB2bS5kYXRhLmluZGV4T2YoY291bnRyeSkgKyAxO1xuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBSRU1PVkUsIE5PVyBHT1QgT1dOIFVSTFxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHR2bS5pbmZvID0gIXZtLmluZm87XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogUFVUIElOIFZJRVdcblx0XHRmdW5jdGlvbiB0b2dnbGVEZXRhaWxzKCkge1xuXHRcdFx0cmV0dXJuIHZtLmRldGFpbHMgPSAhdm0uZGV0YWlscztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBmZXRjaE5hdGlvbkRhdGEoaXNvKSB7XG5cdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycgKyAkc3RhdGUucGFyYW1zLmlkLCBpc28pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRtYXBHb3RvQ291bnRyeShpc28pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE1BUCBTRVJWSUNFXG5cdFx0ZnVuY3Rpb24gbWFwR290b0NvdW50cnkoaXNvKSB7XG5cdFx0XHRpZiAoISRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKSB7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tDb21wYXJpc29uKHdhbnQpIHtcblx0XHRcdGlmICh3YW50ICYmICF2bS5jb21wYXJlLmFjdGl2ZSB8fCAhd2FudCAmJiB2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS50b2dnbGVDb21wYXJpc29uKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29tcGFyaXNvbigpIHtcblx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzID0gW3ZtLmN1cnJlbnRdO1xuXHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSAhdm0uY29tcGFyZS5hY3RpdmU7XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXMsIGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRpZDogJHN0YXRlLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRuYW1lOiAkc3RhdGUucGFyYW1zLm5hbWUsXG5cdFx0XHRcdFx0aXRlbTogJHN0YXRlLnBhcmFtcy5pdGVtXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ291bnRyaWVMaXN0KGNvdW50cnkpIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbihuYXQsIGtleSkge1xuXHRcdFx0XHRpZiAoY291bnRyeSA9PSBuYXQgJiYgbmF0ICE9IHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFmb3VuZCkge1xuXHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGNvdW50cnkpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc29zID0gW107XG5cdFx0XHR2YXIgY29tcGFyZSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aXNvcy5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0aWYgKGl0ZW1bdm0uc3RydWN0dXJlLmlzb10gIT0gdm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0XHRjb21wYXJlLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmIChpc29zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbSxcblx0XHRcdFx0XHRjb3VudHJpZXM6IGNvbXBhcmUuam9pbignLXZzLScpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gIWZvdW5kO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gT1dOIERJUkVDVElWRVxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2codm0uZ2V0UmFuayh2bS5jdXJyZW50KSk7XG5cdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE3O1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gT1dOIERJUkVDVElWRVxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZtLmN1cnJlbnQucGVyY2VudF9jaGFuZ2UgPiAwID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBWSUVXXG5cdFx0ZnVuY3Rpb24gc2V0VGFiKGkpIHtcblx0XHRcdC8vdm0uYWN0aXZlVGFiID0gaTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoZGF0YSkge1xuXHRcdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpZiAoaXRlbS5jb2x1bW5fbmFtZSA9PSB2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUpIHtcblx0XHRcdFx0XHR2bS5ub2RlUGFyZW50ID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRnZXRQYXJlbnQoaXRlbSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVHJlZSgpIHtcblx0XHRcdGdldFBhcmVudCh2bS5zdHJ1Y3R1cmUpO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBDT1VOVFJZXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlOYW1lKG5hbWUpIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgQ09VTlRSWVxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5SXNvKGlzbykge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiBjcmVhdGVDYW52YXMoY29sb3IpIHtcblxuXHRcdFx0dm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHR2bS5jYW52YXMud2lkdGggPSAyODA7XG5cdFx0XHR2bS5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHR2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gdXBkYXRlQ2FudmFzKGNvbG9yKSB7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRSBNQVBcblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXG5cdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogbmF0aW9uW2ZpZWxkXSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblxuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0aWYgKGlzbyAhPSB2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhmZWF0dXJlLnByb3BlcnRpZXMubmFtZSlcblx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnX2dlb20nKSB7XG5cdFx0XHRcdHN0eWxlLnN0YXRpY0xhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuXHRcdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG5cdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuLmlzbykge1xuXHRcdFx0XHRpZiAoby5pc28pIHtcblx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbbi5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyB8fCAkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdycpIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aWQ6ICRzdGF0ZS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0XHRuYW1lOiAkc3RhdGUucGFyYW1zLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiBuLmlzb1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHRcdGlkOiAkc3RhdGUucGFyYW1zLmlkLFxuXHRcdFx0XHRcdG5hbWU6ICRzdGF0ZS5wYXJhbXMuaWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2cobik7XG5cdFx0XHRpZiAobi5jb2xvcilcblx0XHRcdFx0dXBkYXRlQ2FudmFzKG4uY29sb3IpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZUNhbnZhcygncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHR9O1xuXHRcdFx0dm0uY2FsY1RyZWUoKTtcblx0XHRcdC8qaWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0qL1xuXG5cdFx0XHRpZiAodm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHRcdFx0aWQ6IG4uaWQsXG5cdFx0XHRcdFx0XHRuYW1lOiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50Lmlzbyxcblx0XHRcdFx0XHRcdGNvdW50cmllczogJHN0YXRlLnBhcmFtcy5jb3VudHJpZXNcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpZDogbi5pZCxcblx0XHRcdFx0XHRcdG5hbWU6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpZDogbi5pZCxcblx0XHRcdFx0XHRuYW1lOiBuLm5hbWVcblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uYmJveCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8qdmFyIGxhdCA9IFtuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzBdWzBdXVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRsbmcgPSBbbi5jb29yZGluYXRlc1swXVsyXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVsyXVswXV1cblx0XHRcdFx0XSovXG5cdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVswXVsxXSwgbi5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMl1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0WzEwMCwgMTAwXVxuXHRcdFx0XTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRwYWQgPSBbXG5cdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFswLCAwXVxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdFx0dm0ubWFwLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRtYXhab29tOiA2XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdCRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG5cblx0XHRcdC8qY29uc29sZS5sb2coJClcblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvd1wiKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkXCIpIHtcblxuXHRcdFx0XHRpZih0b1BhcmFtcy5pbmRleCAhPSBmcm9tUGFyYW1zLmluZGV4KXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYW5kZXJzJylcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLmxvZyh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdC8vdm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB2bS5jdXJyZW50LmlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmVcIikge1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Ly8kc2NvcGUuYWN0aXZlVGFiID0gMjtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB0b1BhcmFtcy5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0qL1xuXHRcdH0pO1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pIHtcblx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5pdGVtKSB7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbJHN0YXRlLnBhcmFtcy5pdGVtXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMub25DbGljayA9IGZ1bmN0aW9uKGV2dCwgdCkge1xuXG5cdFx0XHRcdFx0aWYgKCF2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5vcGVuKCk7XG5cdFx0XHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJywgZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QoYyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnLCBldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4YmFzZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCRzdGF0ZSkge1xuXHRcdC8vXG4gICAgJHNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCAkdGltZW91dCwgdG9hc3RyLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2UpIHtcblxuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuICAgIHZtLnllYXJmaWx0ZXIgPSAnJztcblx0XHR2bS5kZWxldGVEYXRhID0gZGVsZXRlRGF0YTtcblx0XHR2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuXHRcdHZtLmRlbGV0ZUNvbHVtbiA9IGRlbGV0ZUNvbHVtbjtcblx0XHR2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcblx0XHR2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG5cdFx0dm0uY2hlY2tGb3JFcnJvcnMgPSBjaGVja0ZvckVycm9ycztcblx0XHR2bS5zZWxlY3RFcnJvcnMgPSBzZWxlY3RFcnJvcnM7XG4gICAgdm0uc2VhcmNoRm9yRXJyb3JzID0gc2VhcmNoRm9yRXJyb3JzO1xuXHRcdHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcblx0XHQvL3ZtLmVkaXRDb2x1bW5EYXRhID0gZWRpdENvbHVtbkRhdGE7XG5cdFx0dm0uZWRpdFJvdyA9IGVkaXRSb3c7XG4gICAgdm0ueWVhcnMgPSBbXTtcblx0XHR2bS5xdWVyeSA9IHtcblx0XHRcdGZpbHRlcjogJycsXG5cdFx0XHRvcmRlcjogJy1lcnJvcnMnLFxuXHRcdFx0bGltaXQ6IDE1LFxuXHRcdFx0cGFnZTogMVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjaGVja0RhdGEoKTtcbiAgICBcdGdldFllYXJzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tEYXRhKCkge1xuXHRcdFx0aWYgKCF2bS5kYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cbiAgICBmdW5jdGlvbiBnZXRZZWFycygpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGRhdCA9ICgkZmlsdGVyKCdncm91cEJ5Jykodm0uZGF0YSwgJ2RhdGEuJyt2bS5tZXRhLmNvdW50cnlfZmllbGQgKSk7XG5cdCAgICAgIHZtLnllYXJzID0gW107XG5cdFx0XHRcdHZhciBsZW5ndGggPSAwO1xuXHRcdFx0XHR2YXIgaW5kZXggPSBudWxsO1xuXHRcdFx0ICBhbmd1bGFyLmZvckVhY2goZGF0LGZ1bmN0aW9uKGVudHJ5LCBpKXtcblx0XHRcdFx0XHRpZihlbnRyeS5sZW5ndGggPiBsZW5ndGgpe1xuXHRcdFx0XHRcdFx0aW5kZXggPSBpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0ICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdFtpbmRleF0sZnVuY3Rpb24oZW50cnkpe1xuXHQgICAgICAgIHZtLnllYXJzLnB1c2goZW50cnkuZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKVxuXHQgICAgICB9KTtcblx0XHRcdFx0dm0ueWVhcmZpbHRlciA9IHZtLnllYXJzWzBdO1xuXHRcdFx0fSk7XG5cblxuICAgIH1cblx0XHRmdW5jdGlvbiBzZWFyY2gocHJlZGljYXRlKSB7XG5cdFx0XHR2bS5maWx0ZXIgPSBwcmVkaWNhdGU7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcblx0XHRcdHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG5cdFx0XHQvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjaGVja0ZvckVycm9ycyhpdGVtKSB7XG5cdFx0XHRyZXR1cm4gaXRlbS5lcnJvcnMubGVuZ3RoID4gMCA/ICdtZC13YXJuJyA6ICcnO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gZWRpdENvbHVtbkRhdGEoZSwga2V5KXtcblx0XHQgIHZtLnRvRWRpdCA9IGtleTtcblx0XHQgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0Y29sdW1uJywgJHNjb3BlKTtcblx0XHR9Ki9cblx0XHRmdW5jdGlvbiBkZWxldGVDb2x1bW4oZSwga2V5KSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGspIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZGF0YSwgZnVuY3Rpb24gKGZpZWxkLCBsKSB7XG5cdFx0XHRcdFx0aWYgKGwgPT0ga2V5KSB7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKXtcblx0XHRcdFx0XHRcdFx0aWYoZXJyb3IuY29sdW1uID09IGtleSl7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmVycm9ycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRkZWxldGUgdm0uZGF0YVtrXS5kYXRhW2tleV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWxldGVTZWxlY3RlZCgpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZCwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uIChlcnJvciwgaykge1xuXHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLS07XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dm0uZXJyb3JzLS07XG5cdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUVycm9yKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdHZtLmRhdGEuc3BsaWNlKHZtLmRhdGEuaW5kZXhPZihpdGVtKSwgMSk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdHZtLmRlbGV0ZURhdGEoKTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0RXJyb3JzKCkge1xuXHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZC5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGVkaXRSb3coKSB7XG5cdFx0XHR2bS5yb3cgPSB2bS5zZWxlY3RlZFswXTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0cm93JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWxldGVEYXRhKCkge1xuXHRcdFx0dm0uZGF0YSA9IFtdO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlYXJjaEZvckVycm9ycygpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAocm93LCBrKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBrZXksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGl0ZW1cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKVxuXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDaGVja1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIEluZGV4U2VydmljZSwgRGF0YVNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIHRvYXN0cikge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmlzb19lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SXNvRXJyb3JzKCk7XG5cdFx0dm0uY2xlYXJFcnJvcnMgPSBjbGVhckVycm9ycztcblx0XHR2bS5mZXRjaElzbyA9IGZldGNoSXNvO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHQvL3ZtLm15RGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuXHRcdFx0Ly9jaGVja015RGF0YSgpO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gY2hlY2tNeURhdGEoKSB7XG5cdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzID0gW107XG5cdFx0XHRpZiAodm0uZGF0YS5sZW5ndGgpIHtcblx0XHRcdFx0dm0ubXlEYXRhLnRoZW4oZnVuY3Rpb24oaW1wb3J0cykge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbXBvcnRzLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdFx0dmFyIGZvdW5kID0gMDtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhWzBdLm1ldGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgY29sdW1ucyA9IEpTT04ucGFyc2UoZW50cnkubWV0YV9kYXRhKTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChjb2x1bW4uY29sdW1uID09IGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3VuZCsrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0aWYgKGZvdW5kID49IHZtLmRhdGFbMF0ubWV0YS5maWVsZHMubGVuZ3RoIC0gMykge1xuXHRcdFx0XHRcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzLnB1c2goZW50cnkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0aWYgKHZtLmV4dGVuZGluZ0Nob2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQpe1xuXHRcdFx0XHRcdFx0XHR2bS5tZXRhLnllYXIgPSB2bS5kYXRhWzBdLmRhdGFbMF1bdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0qL1xuXG5cdFx0ZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIvKiB8fCBpdGVtIDwgMCovIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrZXldLmRhdGFba10gPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoIXJvdy5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuXHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiMlwiLFxuXHRcdFx0XHRcdFx0bWVzc2FnZTogXCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHJvdy5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGQsXG5cdFx0XHRcdFx0XHRyb3c6IGtleVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGtleSkge1xuXHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMikge1xuXHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuXHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZldGNoSXNvKCkge1xuXG5cdFx0XHRpZiAoIXZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBJU08gZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBDT1VOVFJZIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodm0ubWV0YS5jb3VudHJ5X2ZpZWxkID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHRcdHZtLm5vdEZvdW5kID0gW107XG5cdFx0XHR2YXIgZW50cmllcyA9IFtdO1xuXHRcdFx0dmFyIGlzb0NoZWNrID0gMDtcblx0XHRcdHZhciBpc29UeXBlID0gJ2lzby0zMTY2LTInO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuXHRcdFx0XHRcdGlzb0NoZWNrICs9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAxIDogMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2ggKGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0Y2FzZSAnQ2FibyBWZXJkZSc6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9ICdDYXBlIFZlcmRlJztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJEZW1vY3JhdGljIFBlb3BsZSdzIFJlcHVibGljIG9mIEtvcmVhXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkl2b3J5IENvYXN0XCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibGljXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZW50cmllcy5wdXNoKHtcblx0XHRcdFx0XHRpc286IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0sXG5cdFx0XHRcdFx0bmFtZTogaXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBpc29UeXBlID0gaXNvQ2hlY2sgPj0gKGVudHJpZXMubGVuZ3RoIC8gMikgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG5cdFx0XHRJbmRleFNlcnZpY2UucmVzZXRUb1NlbGVjdCgpO1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY291bnRyaWVzL2J5SXNvTmFtZXMnLCB7XG5cdFx0XHRcdGRhdGE6IGVudHJpZXMsXG5cdFx0XHRcdGlzbzogaXNvVHlwZVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24oY291bnRyeSwga2V5KSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcblx0XHRcdFx0XHRcdGlmIChjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRvU2VsZWN0ID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW50cnk6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjb3VudHJ5LmRhdGFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRUb1NlbGVjdCh0b1NlbGVjdCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZihjb3VudHJ5LmRhdGEubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY291bnRyeS5kYXRhICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uYWRtaW47XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5kYXRhW2tdKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIzXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ291bGQgbm90IGxvY2F0ZSBhIHZhbGlkIGlzbyBuYW1lIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRJc29FcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0aWYgKEluZGV4U2VydmljZS5nZXRUb1NlbGVjdCgpLmxlbmd0aCkge1xuXHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdzZWxlY3Rpc29mZXRjaGVycycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHR2bS5leHRlbmREYXRhID0gZXh0ZW5kRGF0YTtcblxuXHRcdGZ1bmN0aW9uIGV4dGVuZERhdGEoKSB7XG5cdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHR2YXIgbWV0YSA9IFtdLFxuXHRcdFx0XHRmaWVsZHMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0aXRlbS5kYXRhWzBdLnllYXIgPSB2bS5tZXRhLnllYXI7XG5cdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGNvbnNvbGUubG9nKGluc2VydERhdGEpO1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHZtLmFkZERhdGFUby50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEZpbmFsQ3RybCcsIGZ1bmN0aW9uICgkc3RhdGUsIEluZGV4U2VydmljZSwgRGF0YVNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG5cdFx0dm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcblxuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0LyppZiAodm0ubWV0YS55ZWFyX2ZpZWxkKSB7XG5cdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0fSovXG5cdFx0XHRjaGVja0RhdGEoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2F2ZURhdGEodmFsaWQpIHtcblx0XHRcdGlmICh2YWxpZCkge1xuXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbm9ZZWFycyA9IFtdO1xuXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuXHRcdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRcdGlmKGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKXtcblx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhLnllYXIgPSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblxuXHRcdFx0XHRcdFx0XHRpZih2bS5tZXRhLnllYXJfZmllbGQgJiYgdm0ubWV0YS55ZWFyX2ZpZWxkICE9IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG5cdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRub1llYXJzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGVfaWQgPSAwO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRzdHlsZV9pZCA9IHZtLmluZGljYXRvcnNba2V5XS5zdHlsZS5pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBmaWVsZCA9IHtcblx0XHRcdFx0XHRcdFx0J2NvbHVtbic6IGtleSxcblx0XHRcdFx0XHRcdFx0J3RpdGxlJzogdm0uaW5kaWNhdG9yc1trZXldLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHQnZGVzY3JpcHRpb24nOiB2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0XHRcdCdtZWFzdXJlX3R5cGVfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZS5pZCB8fCAwLFxuXHRcdFx0XHRcdFx0XHQnaXNfcHVibGljJzogdm0uaW5kaWNhdG9yc1trZXldLmlzX3B1YmxpYyB8fCAwLFxuXHRcdFx0XHRcdFx0XHQnc3R5bGVfaWQnOiBzdHlsZV9pZCxcblx0XHRcdFx0XHRcdFx0J2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHZhciBjYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcblx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllcy5wdXNoKGNhdC5pZCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGZpZWxkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdFx0XHRcdFx0ZmllbGRzLnB1c2goZmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm1ldGEuZmllbGRzID0gZmllbGRzO1xuXHRcdFx0XHRpZihub1llYXJzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcImZvciBcIitub1llYXJzLmxlbmd0aCArIFwiIGVudHJpZXNcIiwgJ05vIHllYXIgdmFsdWUgZm91bmQhJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHJlc3BvbnNlLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG5cdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcblx0XHRcdFx0XHRcdFx0dm0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHR2bS5zdGVwID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCAnT3VjaCEnKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxNZW51Q3RybCcsIGZ1bmN0aW9uKEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuICAgICAgdm0uaW5kaWNhdG9yc0xlbmd0aCA9IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aDtcblxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TWV0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCR0aW1lb3V0LEluZGV4U2VydmljZSxsZWFmbGV0RGF0YSwgdG9hc3RyKXtcbiAgICAgICAgLy9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgdm0uaW5kaWNhdG9ycyA9IFtdO1xuICAgICAgICB2bS5zY2FsZSA9IFwiXCI7XG4gICAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgICAgdm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuICAgICAgICB2bS5pbmRpY2F0b3IgPSBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCk7XG4gICAgICAgIHZtLmNvdW50cmllc1N0eWxlID0gY291bnRyaWVzU3R5bGU7XG4gICAgICAgIFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoJyNmZjAwMDAnKTtcblxuXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmluZGljYXRvcik7XG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjaGVja0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRGF0YSgpe1xuICAgICAgICAgIGlmKCF2bS5kYXRhKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgICAgdm0uaW5kaWNhdG9yID0gbjtcbiAgICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICAgIGlmKHZtLmluZGljYXRvci5zdHlsZSl7XG4gICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmluZGljYXRvcicsIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbykgcmV0dXJuO1xuICAgICAgICAgIGlmKHR5cGVvZiBuLnN0eWxlX2lkICE9IFwidW5kZWZpbmVkXCIgKXtcbiAgICAgICAgICAgIGlmKG4uc3R5bGVfaWQgIT0gby5zdHlsZV9pZCl7XG4gICAgICAgICAgICAgIGlmKG4uc3R5bGUpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBuLmNhdGVnb3JpZXMgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIGlmKG4uY2F0ZWdvcmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5jYXRlZ29yaWVzWzBdLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRBY3RpdmVJbmRpY2F0b3JEYXRhKG4pO1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9LHRydWUpO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gbWluTWF4KCl7XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgdm0ubWluID0gTWF0aC5taW4oaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV0sIHZtLm1pbik7XG4gICAgICAgICAgICAgIHZtLm1heCA9IE1hdGgubWF4KGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5tYXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLnNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFt2bS5taW4sdm0ubWF4XSkucmFuZ2UoWzAsMTAwXSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuICAgICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgaWYoaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9PSBpc28pe1xuICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcbiAgICBcdFx0XHR2YXIgc3R5bGUgPSB7fTtcbiAgICBcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcbiAgICBcdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuICAgIFx0XHRcdHZhciBmaWVsZCA9IHZtLmluZGljYXRvci5jb2x1bW5fbmFtZTtcbiAgICBcdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuICAgIFx0XHRcdHN3aXRjaCAodHlwZSkge1xuICAgIFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblxuICAgIFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG4gICAgXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG4gICAgICAgICAgICAgIHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjYpJzsgLy9jb2xvcjtcbiAgICBcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuMyknLFxuICAgIFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcbiAgICBcdFx0XHRcdFx0XHRcdHNpemU6IDJcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdGJyZWFrO1xuXG4gICAgXHRcdFx0fVxuXG4gICAgXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSsnX2dlb20nKSB7XG4gICAgXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuICAgIFx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuICAgIFx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG4gICAgXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0XHRcdH07XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICBcdFx0fVxuICAgICAgICBmdW5jdGlvbiBzZXRDb3VudHJpZXMoKXtcbiAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuICAgICAgICAgIHZtLm12dFNvdXJjZS5yZWRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuICAgICAgICAgIG1pbk1heCgpO1xuICAgIFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG4gICAgXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICBcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRcdFx0XHRzZXRDb3VudHJpZXMoKTtcbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH0pO1xuICAgIFx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkc3RhdGUsIHRvYXN0ciwgRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgSW5kZXhTZXJ2aWNlLnJlc2V0SW5kaWNhdG9yKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgIHZtLnNlbGVjdEZvckVkaXRpbmcgPSBzZWxlY3RGb3JFZGl0aW5nO1xuICAgICAgdm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuICAgICAgdm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuICAgICAgdm0uY2hlY2tBbGwgPSBjaGVja0FsbDtcbiAgICAgIHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuICAgICAgZnVuY3Rpb24gc2VsZWN0Rm9yRWRpdGluZyhrZXkpe1xuICAgICAgICBpZih0eXBlb2YgSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LHtcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOmtleSxcbiAgICAgICAgICAgIHRpdGxlOmtleVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZtLmVkaXRpbmdJdGVtID0ga2V5O1xuICAgICAgICB2bS5pbmRpY2F0b3IgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG4gICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdGlmIChpdGVtLnRpdGxlICYmIGl0ZW0udHlwZSAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG4gIFx0XHRcdFx0cmV0dXJuIHRydWU7XG4gIFx0XHRcdH1cbiAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICBcdFx0fVxuICBcdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKGl0ZW0pe1xuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBpdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRyZXR1cm4gY2hlY2tCYXNlKGl0ZW0pICYmIGl0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gIFx0XHR9XG4gICAgICBmdW5jdGlvbiBjaGVja0FsbCgpe1xuICAgICAgICB2YXIgZG9uZSA9IDA7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbihpbmRpY2F0b3Ipe1xuICAgICAgICAgIGlmKGNoZWNrQmFzZShpbmRpY2F0b3IpKXtcbiAgICAgICAgICAgIGRvbmUgKys7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkb25lLCBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpO1xuICAgICAgICBpZihkb25lID09IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aCl7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gc2F2ZURhdGEoKSB7XG5cbiAgICAgICAgICBpZighdm0ubWV0YS55ZWFyX2ZpZWxkICYmICF2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFllYXInLCAkc2NvcGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcbiAgXHRcdFx0XHRcdGRhdGE6IFtdXG4gIFx0XHRcdFx0fTtcbiAgXHRcdFx0XHR2YXIgbm9ZZWFycyA9IFtdO1xuICBcdFx0XHRcdHZhciBpbnNlcnRNZXRhID0gW10sXG4gIFx0XHRcdFx0XHRmaWVsZHMgPSBbXTtcbiAgXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG4gIFx0XHRcdFx0XHRcdGlmKGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdKXtcbiAgXHRcdFx0XHRcdFx0XHRpdGVtLmRhdGEueWVhciA9IGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXG4gIFx0XHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuICBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVt2bS5tZXRhLnllYXJfZmllbGRdO1xuICBcdFx0XHRcdFx0XHRcdH1cblxuICBcdFx0XHRcdFx0XHRcdHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gIFx0XHRcdFx0XHRcdH1cbiAgXHRcdFx0XHRcdFx0ZWxzZXtcbiAgICAgICAgICAgICAgICBpZih2bS5tZXRhLnllYXIpe1xuICAgICAgICAgICAgICAgICAgaXRlbS5kYXRhLnllYXIgPSB2bS5tZXRhLnllYXI7XG4gICAgICAgICAgICAgICAgICB2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICBcdG5vWWVhcnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICBcdFx0XHRcdFx0XHR9XG5cblxuICBcdFx0XHRcdFx0fSBlbHNlIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcbiAgXHRcdFx0XHRcdFx0cmV0dXJuO1xuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdH0pO1xuICBcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gIFx0XHRcdFx0XHRpZiAoa2V5ICE9IHZtLm1ldGEuaXNvX2ZpZWxkICYmIGtleSAhPSB2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcbiAgXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcbiAgXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuICBcdFx0XHRcdFx0XHRcdHN0eWxlX2lkID0gdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlLmlkO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZhciBmaWVsZCA9IHtcbiAgXHRcdFx0XHRcdFx0XHQnY29sdW1uJzoga2V5LFxuICBcdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcbiAgXHRcdFx0XHRcdFx0XHQnZGVzY3JpcHRpb24nOiB2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG4gIFx0XHRcdFx0XHRcdFx0J21lYXN1cmVfdHlwZV9pZCc6IHZtLmluZGljYXRvcnNba2V5XS50eXBlLmlkIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcbiAgXHRcdFx0XHRcdFx0XHQnc3R5bGVfaWQnOiBzdHlsZV9pZCxcbiAgXHRcdFx0XHRcdFx0XHQnZGF0YXByb3ZpZGVyX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLmRhdGFwcm92aWRlci5pZCB8fCAwXG4gIFx0XHRcdFx0XHRcdH07XG4gIFx0XHRcdFx0XHRcdHZhciBjYXRlZ29yaWVzID0gW107XG4gIFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzW2tleV0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuICBcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuICBcdFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRcdFx0ZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIFx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgXHRcdFx0XHRpZihub1llYXJzLmxlbmd0aCA+IDApe1xuICBcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiZm9yIFwiK25vWWVhcnMubGVuZ3RoICsgXCIgZW50cmllc1wiLCAnTm8geWVhciB2YWx1ZSBmb3VuZCEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0XHR9XG5cbiAgXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIFx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gIFx0XHRcdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuICBcdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGggKyAnIGl0ZW1zIGltcG9ydGV0IHRvICcgKyB2bS5tZXRhLm5hbWUsICdTdWNjZXNzJyk7XG4gIFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gIFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG4gIFx0XHRcdFx0XHRcdFx0dm0uZGF0YSA9IFtdO1xuICBcdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgXHRcdFx0XHRcdH0pO1xuICBcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0fSlcblxuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY29weVRvT3RoZXJzKCl7XG4gICAgICAvKiAgdm0ucHJlUHJvdmlkZXIgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmRhdGFwcm92aWRlcjtcbiAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb3B5cHJvdmlkZXInLCAkc2NvcGUpOyovXG4gICAgICB9XG4gICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICB2bS5pbmRpY2F0b3JzW24uY29sdW1uX25hbWVdID0gbjtcbiAgICAgIH0sdHJ1ZSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZiAobiA9PT0gbyB8fCB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiIHx8IG8gPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZighdm0uYXNrZWRUb1JlcGxpY2F0ZSkge1xuICAgICAgICAgIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgICAgdm0ucHJlTWVhc3VyZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0ubWVhc3VyZV90eXBlX2lkO1xuICAgICAgICAgIHZtLnByZVR5cGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnR5cGU7XG4gICAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgICB2bS5wcmVQdWJsaWMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmlzX3B1YmxpYztcbiAgICAgICAgICB2bS5wcmVTdHlsZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uc3R5bGU7XG5cbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL24uZGF0YXByb3ZpZGVyID0gdm0uZG9Qcm92aWRlcnMgPyB2bS5wcmVQcm92aWRlciA6IFtdO1xuICAgICAgICAgIC8vbi5tZWFzdXJlX3R5cGVfaWQgPSB2bS5kb01lYXN1cmVzID8gdm0ucHJlTWVhc3VyZSA6IDA7XG4gICAgICAgICAgLy9uLmNhdGVnb3JpZXMgPSB2bS5kb0NhdGVnb3JpZXMgPyB2bS5wcmVDYXRlZ29yaWVzOiBbXTtcbiAgICAgICAgICAvL24uaXNfcHVibGljID0gdm0uZG9QdWJsaWMgPyB2bS5wcmVQdWJsaWM6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUVudHJ5Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gVXNlclNlcnZpY2UubXlEYXRhKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFNZW51Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLmRhdGEgPSBbXTtcblxuICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgVXNlclNlcnZpY2UubXlEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB2bS5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnZlcnRJbmZvKCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRJbmZvKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBpdGVtLm1ldGEgPSBKU09OLnBhcnNlKGl0ZW0ubWV0YV9kYXRhKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Y3JlYXRvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2UsRGF0YVNlcnZpY2UsICR0aW1lb3V0LCRzdGF0ZSwgJGZpbHRlciwgbGVhZmxldERhdGEsIHRvYXN0ciwgSWNvbnNTZXJ2aWNlLEluZGV4U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlKXtcblxuICAgICAgICAvL1RPRE86IENoZWNrIGlmIHRoZXJlIGlzIGRhdGEgaW4gc3RvcmFnZSB0byBmaW5pc2hcbiAgICAgIC8qICBjb25zb2xlLmxvZygkc3RhdGUpO1xuICAgICAgICBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguY3JlYXRlJyl7XG4gICAgICAgICAgaWYoSW5kZXhTZXJ2aWNlLmdldERhdGEoKS5sZW5ndGgpe1xuICAgICAgICAgICAgaWYoY29uZmlybSgnRXhpc3RpbmcgRGF0YS4gR28gT24/Jykpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9Ki9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYXAgPSBudWxsO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9W107XG4gICAgICAgIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuXG4gICAgICAgIHZtLmdyb3VwcyA9IFtdO1xuICAgICAgICB2bS5teURhdGEgPSBbXTtcbiAgICAgICAgdm0uYWRkRGF0YVRvID0ge307XG4gICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgdm0uaXNvX2Vycm9ycyA9IDA7XG4gICAgICAgIHZtLmlzb19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgLy92bS5zZWFyY2ggPSBzZWFyY2g7XG5cbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnRvZ2dsZUxpc3RSZXNvdXJjZXMgPSB0b2dnbGVMaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlID0gc2VsZWN0ZWRSZXNvdXJjZTtcbiAgICAgICAgdm0udG9nZ2xlUmVzb3VyY2UgPSB0b2dnbGVSZXNvdXJjZTtcbiAgICAgICAgdm0uaW5jcmVhc2VQZXJjZW50YWdlID0gaW5jcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS5kZWNyZWFzZVBlcmNlbnRhZ2UgPSBkZWNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLnRvZ2dsZUdyb3VwU2VsZWN0aW9uID0gdG9nZ2xlR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmV4aXN0c0luR3JvdXBTZWxlY3Rpb24gPSBleGlzdHNJbkdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5hZGRHcm91cCA9IGFkZEdyb3VwO1xuICAgICAgICB2bS5jbG9uZVNlbGVjdGlvbiA9IGNsb25lU2VsZWN0aW9uO1xuICAgICAgICB2bS5lZGl0RW50cnkgPSBlZGl0RW50cnk7XG4gICAgICAgIHZtLnJlbW92ZUVudHJ5ID0gcmVtb3ZlRW50cnk7XG4gICAgICAgIHZtLnNhdmVJbmRleCA9IHNhdmVJbmRleDtcblxuICAgICAgICB2bS5pY29ucyA9IEljb25zU2VydmljZS5nZXRMaXN0KCk7XG5cbiAgICAgICAgdm0ubWV0YSA9IHtcbiAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgdGFibGU6W11cbiAgICAgICAgfTtcbiAgICAgICAgdm0ucXVlcnkgPSB7XG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBvcmRlcjogJy1lcnJvcnMnLFxuICAgICAgICAgIGxpbWl0OiAxNSxcbiAgICAgICAgICBwYWdlOiAxXG4gICAgICAgIH07XG5cbiAgICAgICAgLyp2bS50cmVlT3B0aW9ucyA9IHtcbiAgICAgICAgICBiZWZvcmVEcm9wOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGlmKGV2ZW50LmRlc3Qubm9kZXNTY29wZSAhPSBldmVudC5zb3VyY2Uubm9kZXNTY29wZSl7XG4gICAgICAgICAgICAgIHZhciBpZHggPSBldmVudC5kZXN0Lm5vZGVzU2NvcGUuJG1vZGVsVmFsdWUuaW5kZXhPZihldmVudC5zb3VyY2Uubm9kZVNjb3BlLiRtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgICAgaWYoaWR4ID4gLTEpe1xuICAgICAgICAgICAgICAgICBldmVudC5zb3VyY2Uubm9kZVNjb3BlLiQkYXBwbHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdPbmx5IG9uZSBlbGVtZW50IG9mIGEga2luZCBwZXIgZ3JvdXAgcG9zc2libGUhJywgJ05vdCBhbGxvd2VkIScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRyb3BwZWQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uodm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07Ki9cblxuICAgICAgICAvL1J1biBTdGFydHVwLUZ1bmNpdG9uc1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgLy9jbGVhck1hcCgpO1xuICAgICAgICAgIEluZGV4U2VydmljZS5yZXNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DbG9zZShhY3RpdmUpe1xuICAgICAgICAgIHJldHVybiBhY3RpdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTGF5ZXJTdHlsZShmZWF0dXJlKXtcbiAgICAgIFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgY29sb3I6J3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgICAgICAgICAgICBvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgIH07XG4gICAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJNYXAoKXtcbiAgICAgICAgICBcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjbGVhckxheWVyU3R5bGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICB2bS5zaG93UmVzb3VyY2VzID0gIXZtLnNob3dSZXNvdXJjZXM7XG4gICAgICAgICAgaWYodm0uc2hvd1Jlc291cmNlcyl7XG4gICAgICAgICAgICB2bS5saXN0UmVzb3VyY2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICBpZighdm0ucmVzb3VyY2VzKXtcbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YS90YWJsZXMnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgdm0ucmVzb3VyY2VzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID0gW10sIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGxpc3Qpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAvL2lmKHR5cGVvZiBpdGVtLmlzR3JvdXAgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PSByZXNvdXJjZSl7XG4gICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShrZXksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2Uodm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZSh2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKGl0ZW0pLDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgaXRlbS5ub2Rlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vY2FsY1BlcmNlbnRhZ2Uodm0uc29ydGVkUmVzb3VyY2VzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjYWxjUGVyY2VudGFnZShub2Rlcyl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuICAgICAgICAgICAgbm9kZXNba2V5XS53ZWlnaHQgPSBwYXJzZUludCgxMDAgLyBub2Rlcy5sZW5ndGgpO1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uobm9kZXMubm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5jcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4aXN0c0luR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSA+IC0xO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFkZEdyb3VwKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0dyb3VwJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCB2bS5zZWxlY3RlZEZvckdyb3VwKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbG9uZVNlbGVjdGlvbigpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidDbG9uZWQgRWxlbWVudHMnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRFbnRyeShpdGVtKXtcbiAgICAgICAgICB2bS5lZGl0SXRlbSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRW50cnkoaXRlbSwgbGlzdCl7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgbGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2F2ZUluZGV4KCl7XG4gICAgICAgICAgaWYodm0uc2F2ZURpc2FibGVkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZih0eXBlb2Ygdm0ubmV3SW5kZXggPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCF2bS5uZXdJbmRleC50aXRsZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0ubmV3SW5kZXguZGF0YSA9IHZtLmdyb3VwcztcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLm5ld0luZGV4KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdXIgSW5kZXggaGFzIGJlZW4gY3JlYXRlZCcsICdTdWNjZXNzJyksXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OnJlc3BvbnNlLm5hbWV9KTtcbiAgICAgICAgICB9LGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsJ1VwcHMhIScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgaWYoIXZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgc3dpdGNoICh0b1N0YXRlLm5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYyc6XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTXlEYXRhKCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5jaGVjayc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMjtcbiAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAzO1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5maW5hbCc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gNDtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTsqL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yY2F0ZWdvcnlDdHJsJywgZnVuY3Rpb24gKCRzdGF0ZSwgY2F0ZWdvcnksIGNhdGVnb3JpZXMsIERhdGFTZXJ2aWNlLENvbnRlbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLm9wdGlvbnMgPSB7XG5cdFx0XHRnbG9iYWxTYXZlOnRydWUsXG5cdFx0XHRwb3N0RG9uZTpmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6ZGF0YS5pZH0pXG5cdFx0XHR9LFxuXHRcdH1cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0LCRzdGF0ZSwgaW5kaWNhdG9ycywgaW5kaWNlcywgc3R5bGVzLCBjYXRlZ29yaWVzLCBEYXRhU2VydmljZSxDb250ZW50U2VydmljZSwgdG9hc3RyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0dm0uY29tcG9zaXRzID0gaW5kaWNlcztcblx0XHR2bS5zdHlsZXMgPSBzdHlsZXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uY2hlY2tUYWJDb250ZW50ID0gY2hlY2tUYWJDb250ZW50O1xuXG5cdFx0dm0uYWN0aXZlID0gMDtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uc2VsZWN0aW9uID0ge1xuXHRcdFx0aW5kaWNlczpbXSxcblx0XHRcdGluZGljYXRvcnM6W10sXG5cdFx0XHRzdHlsZXM6W10sXG5cdFx0XHRjYXRlZ29yaWVzOltdXG5cdFx0fTtcblxuXG5cdFx0dm0ub3B0aW9ucyA9IHtcblx0XHRcdGNvbXBvc2l0czp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J2NvbXBvc2l0cycsXG5cdFx0XHRcdGFsbG93TW92ZTpmYWxzZSxcblx0XHRcdFx0YWxsb3dEcm9wOmZhbHNlLFxuXHRcdFx0XHRhbGxvd0FkZDp0cnVlLFxuXHRcdFx0XHRhbGxvd0RlbGV0ZTp0cnVlLFxuXHRcdFx0XHRpdGVtQ2xpY2s6IGZ1bmN0aW9uKGlkLCBuYW1lKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJywge2lkOmlkLCBuYW1lOm5hbWV9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZGRDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7aWQ6MCwgbmFtZTogJ25ldyd9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uaW5kaWNlcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlSXRlbShpdGVtLmlkKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0aW9uLmluZGljZXMgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNhdGVnb3JpZXM6e1xuXHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHR0eXBlOidjYXRlZ29yaWVzJyxcblx0XHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdFx0YWxsb3dEZWxldGU6dHJ1ZSxcblx0XHRcdFx0YWRkQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcy5jYXRlZ29yeScsIHtpZDonbmV3J30pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1DbGljazogZnVuY3Rpb24oaWQsIG5hbWUpe1xuXG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMuY2F0ZWdvcnknLCB7aWQ6aWR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24uY2F0ZWdvcmllcyxmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0Q29udGVudFNlcnZpY2UucmVtb3ZlQ2F0ZWdvcnkoaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5jYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdHN0eWxlczp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J3N0eWxlcycsXG5cdFx0XHRcdHdpdGhDb2xvcjp0cnVlXG5cdFx0XHR9XG5cdFx0fTtcblxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tUYWJDb250ZW50KGluZGV4KXtcblx0XHRcdHN3aXRjaCAoaW5kZXgpIHtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0aWYodHlwZW9mICRzdGF0ZS5wYXJhbXMuaWQgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScse1xuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6JHN0YXRlLnBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG5cdFx0ICBpZih0eXBlb2YgdG9QYXJhbXMuaWQgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLmFjdGl2ZSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5hY3RpdmUgPSB0b1BhcmFtcy5pZDtcblx0XHRcdH1cblx0XHRcdGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMTtcblx0XHRcdFx0Ly9hY3RpdmF0ZSh0b1BhcmFtcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmNhdGVnb3JpZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcycpICE9IC0xKXtcblx0XHRcdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsJHRpbWVvdXQsIFZlY3RvcmxheWVyU2VydmljZSwgbGVhZmxldERhdGEsIENvbnRlbnRTZXJ2aWNlLCBpbmRpY2F0b3IpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLnNjYWxlID0gXCJcIjtcblx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHR2bS5tYXggPSAwO1xuXHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRzZXRBY3RpdmUoKTtcblxuXHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pO1xuXHRcdGZ1bmN0aW9uIHNldEFjdGl2ZSgpe1xuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5pZGNhdG9yc0N0cmwnLCBmdW5jdGlvbiAoaW5kaWNhdG9ycywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cblxuICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kZXgpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgLy92bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG4gICAgdm0uaW5kZXggPSBpbmRleDtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdHNldEFjdGl2ZSgpO1xuICAgIHZtLm9wdGlvbnMgPSB7XG4gICAgICBpbmRpemVzOntcbiAgICAgICAgYWRkQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YS5hZGQnKTtcbiAgICAgICAgfSxcblx0XHRcdFx0YWRkQ29udGFpbmVyQ2xpY2s6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaXRlbSA9IHtcblx0XHRcdFx0XHRcdHRpdGxlOiAnSSBhbSBhIGdyb3VwLi4uIG5hbWUgbWUnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2bS5pbmRleC5jaGlsZHJlbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHZtKTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0cmVtb3ZlSXRlbShpdGVtLHZtLmluZGV4LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSBbXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkZWxldGVEcm9wOiBmdW5jdGlvbihldmVudCxpdGVtLGV4dGVybmFsLHR5cGUpe1xuXHRcdFx0XHRcdENvbnRlbnRTZXJ2aWNlLnJlbW92ZUl0ZW0oaXRlbS5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5pbmRleC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuICAgICAgfSxcbiAgICAgIHdpdGhTYXZlOiB0cnVlXG4gICAgfVxuXG5cdFx0YWN0aXZlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlbW92ZUl0ZW0oaXRlbSwgbGlzdCl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oZW50cnksIGtleSl7XG5cdFx0XHRcdGlmKGVudHJ5LmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4pe1xuXHRcdFx0XHRcdHZhciBzdWJyZXN1bHQgPSByZW1vdmVJdGVtKGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YnJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQvKkNvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pOyovXG5cblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHQvKlx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yU2hvd0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGZpbHRlciwkdGltZW91dCwgaW5kaWNhdG9yLCBjb3VudHJpZXMsIENvbnRlbnRTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jdXJyZW50ID0gbnVsbDtcblx0XHR2bS5hY3RpdmUgPSBudWxsO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXHRcdHZtLmluZGljYXRvciA9IGluZGljYXRvcjtcblx0XHR2bS5kYXRhID0gW107XG5cdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRtYXg6LTEwMDAwMCxcblx0XHRcdG1pbjoxMDAwMDBcblx0XHR9O1xuXHRcdHZtLmdldERhdGEgPSBnZXREYXRhO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nb0luZm9TdGF0ZSA9IGdvSW5mb1N0YXRlO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMueWVhcil7XG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZtLmluZGljYXRvci55ZWFycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRpZih2bS5pbmRpY2F0b3IueWVhcnNbaV0ueWVhciA9PSAkc3RhdGUucGFyYW1zLnllYXIpe1xuXHRcdFx0XHRcdFx0XHR2bS5hY3RpdmUgPSAgaTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZighdm0uYWN0aXZlKXtcblx0XHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXNvKSB7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0Ly92bS5jdXJyZW50ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR9KVxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gZ29JbmZvU3RhdGUoKXtcblx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nLHt5ZWFyOnZtLnllYXJ9KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyx7aWQ6dm0uaW5kaWNhdG9yLmlkLCBuYW1lOnZtLmluZGljYXRvci5uYW1lLCB5ZWFyOnZtLnllYXJ9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKCkge1xuXG5cdFx0XHQvKlx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCkubGF5ZXJzW1ZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJ10uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdFx0LyppZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5jb3VudHJ5Jyx7IGlzbzp2bS5jdXJyZW50Lmlzb30pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8uY291bnRyeScseyBpc286dm0uY3VycmVudC5pc299KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUseyBpc286dm0uY3VycmVudC5pc299KVxuXHRcdFx0XHR9Ki9cblxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCx0KXtcblx0XHRcdHZhciBjID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl0pO1xuXHRcdFx0aWYgKHR5cGVvZiBjLnNjb3JlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IGM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0RGF0YSh5ZWFyKSB7XG5cdFx0XHR2bS55ZWFyID0geWVhcjtcblx0XHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEodm0uaW5kaWNhdG9yLmlkLCB5ZWFyKS50aGVuKGZ1bmN0aW9uKGRhdCkge1xuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nLHt5ZWFyOnllYXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyx7eWVhcjp5ZWFyfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicse3llYXI6eWVhcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZtLmRhdGEgPSBkYXQ7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpdGVtLnJhbmsgPSB2bS5kYXRhLmluZGV4T2YoaXRlbSkgKzE7XG5cdFx0XHRcdFx0aWYodm0uY3VycmVudCl7XG5cdFx0XHRcdFx0XHRpZihpdGVtLmlzbyA9PSB2bS5jdXJyZW50Lmlzbyl7XG5cdFx0XHRcdFx0XHRcdHNldEN1cnJlbnQoaXRlbSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dm0ucmFuZ2UubWF4ID0gIGQzLm1heChbdm0ucmFuZ2UubWF4LCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWluID0gIGQzLm1pbihbdm0ucmFuZ2UubWluLCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiB2bS5pbmRpY2F0b3Iuc3R5bGVkLmJhc2VfY29sb3IgfHwgJyMwMGNjYWEnLFxuXHRcdFx0XHRcdFx0ZmllbGQ6ICdyYW5rJyxcblx0XHRcdFx0XHRcdHNpemU6IHZtLmRhdGEubGVuZ3RoXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRnZXRPZmZzZXQoKTtcblx0XHRcdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLnJhbmdlLm1pbix2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwyNTZdKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uZGF0YSwgdm0uaW5kaWNhdG9yLnN0eWxlZC5iYXNlX2NvbG9yLCB0cnVlKTtcblx0XHRcdFx0Ly9WZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoY291bnRyaWVzU3R5bGUsIGNvdW50cnlDbGljayk7XG5cdFx0XHR9KTtcblxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXG5cdFx0XHR2YXIgZmllbGQgPSAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZih2bS5jdXJyZW50KXtcblx0XHRcdFx0aWYodm0uY3VycmVudC5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCl7XG5cblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9ICBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0Oy8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXG5cdFx0XHRmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG5cdFx0XHRcdGlmKHRvU3RhdGUubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci5kYXRhJyl7XG5cblx0XHRcdFx0fVxuXHRcdH0pXG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGljYXRvclllYXJUYWJsZUN0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgZGF0YSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcbiAgICB2bS5kYXRhID0gZGF0YTtcbiAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcblx0XHR2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG5cbiAgICBmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcblx0XHRcdC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuXHRcdFx0Ly9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcblx0XHR9O1xuXG5cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucHJldlN0YXRlID0gbnVsbDtcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgXG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9nb0N0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWFwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbGVhZmxldERhdGEsIGxlYWZsZXRNYXBFdmVudHMsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cblx0XHR2YXIgem9vbSA9IDMsXG5cdFx0XHRtaW5ab29tID0gMjtcblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA2MDApIHtcblx0XHRcdHpvb20gPSAyO1xuXHRcdFx0Ly9taW5ab29tID0gMTtcblx0XHR9XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmtleXMubWFwYm94O1xuXHRcdHZtLnRvZ2dsZUxheWVycyA9IHRvZ2dsZUxheWVycztcblx0XHR2bS5kZWZhdWx0cyA9IHtcblx0XHRcdC8vc2Nyb2xsV2hlZWxab29tOiBmYWxzZSxcblx0XHRcdG1pblpvb206IG1pblpvb21cblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogNDguMjA5MjA2LFxuXHRcdFx0bG5nOiAxNi4zNzI3NzgsXG5cdFx0XHR6b29tOiB6b29tXG5cdFx0fTtcblx0XHR2bS5sYXllcnMgPSB7XG5cdFx0XHRiYXNlbGF5ZXJzOiB7XG5cdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdG5hbWU6ICdPdXRkb29yJyxcblx0XHRcdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L3ZhbGRlcnJhbWEuZDg2MTE0YjYve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LFxuXHRcdFx0XHRcdHR5cGU6ICd4eXonLFxuXHRcdFx0XHRcdGxheWVyT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0Y29udGludW91c1dvcmxkOiBmYWxzZSxcblx0XHRcdFx0XHRcdGRldGVjdFJldGluYTogdHJ1ZVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5sYWJlbHNMYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hZ25vbG8uMDYwMjlhOWMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LCB7XG5cdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxuXHRcdFx0bmFtZTogJ2xhYmVscycsXG5cdFx0XHRkZXRlY3RSZXRpbmE6IHRydWVcblx0XHR9KTtcblx0XHR2bS5tYXhib3VuZHMgPSB7XG5cdFx0XHRzb3V0aFdlc3Q6IHtcblx0XHRcdFx0bGF0OiA5MCxcblx0XHRcdFx0bG5nOiAxODBcblx0XHRcdH0sXG5cdFx0XHRub3J0aEVhc3Q6IHtcblx0XHRcdFx0bGF0OiAtOTAsXG5cdFx0XHRcdGxuZzogLTE4MFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uY29udHJvbHMgPSB7XG5cdFx0XHRjdXN0b206IFtdXG5cdFx0fTtcblx0XHR2bS5sYXllcmNvbnRyb2wgPSB7XG5cdFx0XHRpY29uczoge1xuXHRcdFx0XHR1bmNoZWNrOiBcImZhIGZhLXRvZ2dsZS1vZmZcIixcblx0XHRcdFx0Y2hlY2s6IFwiZmEgZmEtdG9nZ2xlLW9uXCJcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgTXlDb250cm9sID0gTC5jb250cm9sKCk7XG5cdFx0TXlDb250cm9sLnNldFBvc2l0aW9uKCd0b3BsZWZ0Jyk7XG5cdFx0TXlDb250cm9sLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRNeUNvbnRyb2wub25BZGQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXIgbGVhZmxldC1jb250cm9sLXpvb20nKTtcblx0XHRcdHZhciBzcGFuID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICdsZWFmbGV0LWNvbnRyb2wtem9vbS1pbiBjdXJzb3InLCBjb250YWluZXIpO1xuXHRcdFx0c3Bhbi50ZXh0Q29udGVudCA9ICdUJztcblx0XHRcdEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24oY29udGFpbmVyKTtcblx0XHRcdEwuRG9tRXZlbnQuYWRkTGlzdGVuZXIoY29udGFpbmVyLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0XHRtYXAucmVtb3ZlTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubm9MYWJlbCA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtYXAuYWRkTGF5ZXIodm0ubGFiZWxzTGF5ZXIpO1xuXHRcdFx0XHRcdFx0dm0ubGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGF5ZXJzKG92ZXJsYXlOYW1lKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdGlmICh2bS5ub0xhYmVsKSB7XG5cdFx0XHRcdFx0bWFwLnJlbW92ZUxheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWFwLmFkZExheWVyKHZtLmxhYmVsc0xheWVyKTtcblx0XHRcdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0XHR2bS5ub0xhYmVsID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldE1hcChtYXApO1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRkZXRlY3RSZXRpbmE6dHJ1ZSxcblx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICdfZ2VvbSddLFxuXHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdG1hcC5hZGRDb250cm9sKE15Q29udHJvbCk7XG5cdFx0XHQvKm1hcC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRhbGVydCgnaGVsbG8nKTtcblx0XHRcdH0pO1xuXG4gICAgICAgICAgICB2YXIgbWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gbWFwRXZlbnRzKXtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuJyArIG1hcEV2ZW50c1trXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtYXBFdmVudHNba10pXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cdFx0LypcdG1hcC5hZGRMYXllcih2bS5sYWJlbHNMYXllcik7XG5cdFx0XHR2bS5sYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHRcdFx0dm0ubm9MYWJlbCA9IHRydWU7Ki9cblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWRlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSwgRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIgPSB7fTtcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVGV4dDtcblxuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvZGF0YXByb3ZpZGVycycsIHZtLmRhdGFwcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZGF0YXByb3ZpZGVycy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLmRhdGFwcm92aWRlciA9IGRhdGE7XG4gICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVW5pdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0udW5pdCA9IHt9O1xuICAgICAgdm0udW5pdC50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFVuaXQ7XG5cbiAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vXG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL21lYXN1cmVfdHlwZXMnLCB2bS51bml0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWVhc3VyZVR5cGVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLnR5cGUgPSBkYXRhO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgIH07XG5cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkWWVhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52bSk7XG4gICAgICAgICAgICAkc2NvcGUudm0uc2F2ZURhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0bWV0aG9kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdHRleHRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgXG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3B5cHJvdmlkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uYXNrZWRUb1JlcGxpY2F0ZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMgPSB0cnVlO1xuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLiRwYXJlbnQudm0uZGF0YVswXS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG5cdFx0XHRcdGlmIChrZXkgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSwge1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZToga2V5LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToga2V5XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFwcm92aWRlciA9ICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcykge1xuXHRcdFx0XHRcdFx0aXRlbS50eXBlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlVHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcykge1xuXHRcdFx0XHRcdFx0aXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlQ2F0ZWdvcmllcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmlzX3B1YmxpYyA9ICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlO1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlX2lkID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblxuXHRcdH07XG5cblx0XHQkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSBmYWxzZTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQmFyc0N0cmwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLndpZHRoID0gd2lkdGg7XG5cblx0XHRmdW5jdGlvbiB3aWR0aChpdGVtKSB7XG5cdFx0XHRpZighdm0uZGF0YSkgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIHZtLmRhdGFbaXRlbS5uYW1lXTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2JhcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9iYXJzL2JhcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL29wdGlvbnMuaGVpZ2h0ID0gb3B0aW9ucy53aWR0aCAqIDEuMTtcblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHt9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1Db2xvciA9IGdyb3VwLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRpZihncm91cC5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRtQ29sb3IgPSBncm91cC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogbUNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9IGl0ZW0uY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihpdGVtLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGl0ZW0uc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLnN0eWxlLmJhc2VfY29sb3IgfHwgc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLnR5cGU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSA/ICcjZmZmJyA6IGQuY29sb3I7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdGlmKGQudW5pY29kZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHNob3dfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQ7XG5cdFx0XHRcdFx0dmFyXHRiYXJPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0dGl0bGVkOnRydWVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSAnPG1kLXByb2dyZXNzLWxpbmVhciBtZC1tb2RlPVwiZGV0ZXJtaW5hdGVcIiB2YWx1ZT1cIicrZGF0YS52YWx1ZSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRpZihzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSA+IDAgKXtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPGRpdiBjbGFzcz1cInN1YlwiPic7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKydcIj48L21kLXByb2dyZXNzLWxpbmVhcj4nXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKycgLSAnICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPC9kaXY+Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vY29udGVudCA9ICc8YmFycyBvcHRpb25zPVwiYmFyT3B0aW9uc1wiIHN0cnVjdHVyZT1cImRhdGEuZGF0YS5jaGlsZHJlblwiIGRhdGE9XCJkYXRhXCI+PC9iYXJzPic7XG5cblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdpbmRleGVyJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgblswXS5jaGlsZHJlbiAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdFx0Y2xlYXJfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ2F0ZWdvcmllc0N0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRPcHRpb25zID0ge1xuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oY2F0ZWdvcnkpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjYXRlZ29yaWVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcmllc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLnNhdmVDYXRlZ29yeSA9IHNhdmVDYXRlZ29yeTtcblx0XHR2bS5xdWVyeVNlYXJjaENhdGVnb3J5ID0gcXVlcnlTZWFyY2hDYXRlZ29yeTtcblx0XHR2bS5wYXJlbnRDaGFuZ2VkID0gcGFyZW50Q2hhbmdlZDtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uc3R5bGVzID0gQ29udGVudFNlcnZpY2UuZ2V0U3R5bGVzKCk7XG5cdFx0dm0uZmxhdHRlbmVkID0gW107XG5cdFx0dm0uY29weSA9IHt9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbih2bS5jYXRlZ29yaWVzKTtcblx0XHRcdGlmKHZtLml0ZW0ucGFyZW50X2lkKXtcblx0XHRcdFx0dm0ucGFyZW50ID0gZ2V0UGFyZW50KHZtLml0ZW0sIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHR2bS5jb3B5ID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBmbGF0dGVuV2l0aENoaWxkcmVuKGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2bS5mbGF0dGVuZWQucHVzaChpdGVtKTtcblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0ZmxhdHRlbldpdGhDaGlsZHJlbihpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaENhdGVnb3J5KHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKCRmaWx0ZXIoJ29yZGVyQnknKSh2bS5mbGF0dGVuZWQsICd0aXRsZScpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0XHQvL3JldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykoJGZpbHRlcignZmxhdHRlbicpKHZtLmNhdGVnb3JpZXMpLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcGFyZW50Q2hhbmdlZChpdGVtKXtcblx0XHRcdGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLnBhcmVudF9pZCA9IDA7XG5cdFx0XHRcdHZtLml0ZW0ucGFyZW50ID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoaXRlbS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGUgUGFyZW50IGNhbm5vdCBiZSB0aGUgc2FtZScsICdJbnZhbGlkIHNlbGVjdGlvbicpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2bS5wYXJlbnQgPSBpdGVtO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnRfaWQgPSBpdGVtLmlkO1xuXHRcdFx0dm0uaXRlbS5wYXJlbnQgPSBpdGVtO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoaXRlbSxsaXN0KXtcblx0XHRcdHZhciBmb3VuZCA9IG51bGxcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHRcdGZvdW5kID0gZW50cnk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZW50cnkuY2hpbGRyZW4gJiYgIWZvdW5kKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gZ2V0UGFyZW50KGl0ZW0sIGVudHJ5LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRpZihzdWJyZXN1bHQpe1xuXHRcdFx0XHRcdFx0Zm91bmQgPSBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbW92ZUl0ZW0oKXtcblx0XHRcdGlmKHZtLmNvcHkucGFyZW50X2lkKXtcblx0XHRcdFx0XHR2YXIgb2xkUGFyZW50ID0gZ2V0UGFyZW50KHZtLmNvcHksIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvbGRQYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKXtcblx0XHRcdFx0XHRcdGlmKG9sZFBhcmVudC5jaGlsZHJlbltpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdFx0b2xkUGFyZW50LmNoaWxkcmVuLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2bS5jYXRlZ29yaWVzLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRcdFx0aWYodm0uY2F0ZWdvcmllc1tpXS5pZCA9PSB2bS5pdGVtLmlkKXtcblx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMuc3BsaWNlKGksMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdHZhciBuZXdQYXJlbnQgPSBnZXRQYXJlbnQodm0uaXRlbSwgdm0uY2F0ZWdvcmllcyk7XG5cdFx0XHRcdG5ld1BhcmVudC5jaGlsZHJlbi5wdXNoKHZtLml0ZW0pO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5jYXRlZ29yaWVzLnB1c2godm0uaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHN1Y2Nlc3NBY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5jb3B5LnBhcmVudF9pZCwgdm0uaXRlbS5wYXJlbnRfaWQpO1xuXHRcdFx0aWYodm0uY29weS5wYXJlbnRfaWQgIT0gdm0uaXRlbS5wYXJlbnRfaWQpe1xuXHRcdFx0XHRpZih2bS5jb3B5LnBhcmVudF9pZCAmJiB2bS5pdGVtLnBhcmVudF9pZCl7XG5cdFx0XHRcdFx0bW92ZUl0ZW0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0NhdGVnb3J5IGhhcyBiZWVuIHVwZGF0ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0JHNjb3BlLmNhdGVnb3J5Rm9ybS4kc2V0U3VibWl0dGVkKCk7XG5cdFx0XHR2bS5jb3B5ID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlQ2F0ZWdvcnkodmFsaWQpIHtcblx0XHRcdGlmKHZhbGlkKXtcblx0XHRcdFx0aWYodm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0aWYodm0uaXRlbS5yZXN0YW5ndWxhcml6ZWQpe1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihzdWNjZXNzQWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLnVwZGF0ZSgnY2F0ZWdvcmllcycsIHZtLml0ZW0uaWQsIHZtLml0ZW0pLnRoZW4oc3VjY2Vzc0FjdGlvbik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjYXRlZ29yaWVzJywgdm0uaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYoZGF0YS5wYXJlbnRfaWQgIT0gMCApe1xuXHRcdFx0XHRcdFx0XHRcdCB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGRhdGEsIHZtLmNhdGVnb3JpZXMpO1xuXHRcdFx0XHRcdFx0XHRcdCBpZighcGFyZW50LmNoaWxkcmVuKXtcblx0XHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdFx0XHRcdCBwYXJlbnQuY2hpbGRyZW4ucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHQgcGFyZW50LmV4cGFuZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZtLmNhdGVnb3JpZXMucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgQ2F0ZWdvcnkgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0dm0ub3B0aW9ucy5wb3N0RG9uZShkYXRhKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3J5JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcnlDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPT8nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblxuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0dmFyICDPhCA9IDIgKiBNYXRoLlBJO1xuXHRcdFx0XHQvL0NyZWF0aW5nIHRoZSBTY2FsZVxuXHRcdFx0XHR2YXIgcm90YXRlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFsxLCAkc2NvcGUub3B0aW9ucy5zaXplXSlcblx0XHRcdFx0XHQucmFuZ2UoWzEsIDBdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHQvL0NyZWF0aW5nIEVsZW1lbnRzXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKCdzdmcnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsICRzY29wZS5vcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCAkc2NvcGUub3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyICsgJywnICsgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICdOwrAnICsgZDtcblx0XHRcdFx0XHRcdHJldHVybiBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0cmV0dXJuICcxZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcxLjVlbSc7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnMC4zNWVtJztcblx0XHRcdFx0XHRcdHJldHVybiAnMC4zN2VtJ1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKXtcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShwYXJzZUludChkYXRhWzFdKSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGQpLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5hdHRyVHdlZW4oXCJkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qJHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2lyY2xlQmFjay5zdHlsZSgnc3Ryb2tlJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHR0ZXh0LnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtW24uZmllbGRdKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2l0ZW0nLFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdC8vaWYobiA9PT0gbykgcmV0dXJuO1xuXHRcdFx0XHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdFx0XHRcdG5bJHNjb3BlLm9wdGlvbnMuZmllbGRdID0gJHNjb3BlLm9wdGlvbnMuc2l6ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRlSXQoblskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8gfHwgIW4pIHJldHVybjtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdCgkc2NvcGUuaXRlbVskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LHRydWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbXBvc2l0c0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnY29tcG9zaXRzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb21wb3NpdHNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtczogJz0nLFxuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbmZsaWN0aXRlbXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NvbmZsaWN0aXRlbXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb25mbGljdGl0ZW1zL2NvbmZsaWN0aXRlbXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RpdGVtc0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NvbnRlbnRlZGl0YWJsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NvbnRlbnRlZGl0YWJsZScsIGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0cmVxdWlyZTogJz9uZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHQvL2lmICghbmdNb2RlbCkgcmV0dXJuO1xuXHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5odG1sKG5nTW9kZWwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gTGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIHRvIGVuYWJsZSBiaW5kaW5nXG5cdFx0XHRcdGVsZW1lbnQub24oJ2JsdXIga2V5dXAgY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNjb3BlLiRhcHBseShyZWFkVmlld1RleHQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIE5vIG5lZWQgdG8gaW5pdGlhbGl6ZSwgQW5ndWxhckpTIHdpbGwgaW5pdGlhbGl6ZSB0aGUgdGV4dCBiYXNlZCBvbiBuZy1tb2RlbCBhdHRyaWJ1dGVcblxuXHRcdFx0XHQvLyBXcml0ZSBkYXRhIHRvIHRoZSBtb2RlbFxuXHRcdFx0XHRmdW5jdGlvbiByZWFkVmlld1RleHQoKSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBlbGVtZW50Lmh0bWwoKTtcblx0XHRcdFx0XHQvLyBXaGVuIHdlIGNsZWFyIHRoZSBjb250ZW50IGVkaXRhYmxlIHRoZSBicm93c2VyIGxlYXZlcyBhIDxicj4gYmVoaW5kXG5cdFx0XHRcdFx0Ly8gSWYgc3RyaXAtYnIgYXR0cmlidXRlIGlzIHByb3ZpZGVkIHRoZW4gd2Ugc3RyaXAgdGhpcyBvdXRcblx0XHRcdFx0XHRpZiAoYXR0cnMuc3RyaXBCciAmJiBodG1sID09ICc8YnI+Jykge1xuXHRcdFx0XHRcdFx0aHRtbCA9ICcnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoaHRtbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmaWxlRHJvcHpvbmUnLCBmdW5jdGlvbiAodG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuICAgICAgICBmaWxlOiAnPScsXG4gICAgICAgIGZpbGVOYW1lOiAnPSdcbiAgICAgIH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdHZhciBjaGVja1NpemUsIGlzVHlwZVZhbGlkLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyLCB2YWxpZE1pbWVUeXBlcztcblx0XHRcdFx0cHJvY2Vzc0RyYWdPdmVyT3JFbnRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdjb3B5Jztcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhbGlkTWltZVR5cGVzID0gYXR0cnMuZmlsZURyb3B6b25lO1xuXHRcdFx0XHRjaGVja1NpemUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuXHRcdFx0XHRcdHZhciBfcmVmO1xuXHRcdFx0XHRcdGlmICgoKF9yZWYgPSBhdHRycy5tYXhGaWxlU2l6ZSkgPT09ICh2b2lkIDApIHx8IF9yZWYgPT09ICcnKSB8fCAoc2l6ZSAvIDEwMjQpIC8gMTAyNCA8IGF0dHJzLm1heEZpbGVTaXplKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJGaWxlIG11c3QgYmUgc21hbGxlciB0aGFuIFwiICsgYXR0cnMubWF4RmlsZVNpemUgKyBcIiBNQlwiKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlzVHlwZVZhbGlkID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdFx0XHRpZiAoKHZhbGlkTWltZVR5cGVzID09PSAodm9pZCAwKSB8fCB2YWxpZE1pbWVUeXBlcyA9PT0gJycpIHx8IHZhbGlkTWltZVR5cGVzLmluZGV4T2YodHlwZSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcIkZpbGUgbXVzdCBiZSBvbmUgb2YgZm9sbG93aW5nIHR5cGVzIFwiICsgdmFsaWRNaW1lVHlwZXMsICdJbnZhbGlkIGZpbGUgdHlwZSEnKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0ZWxlbWVudC5iaW5kKCdkcmFnb3ZlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdlbnRlcicsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIpO1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5iaW5kKCdkcm9wJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0dmFyIGZpbGUsIG5hbWUsIHJlYWRlciwgc2l6ZSwgdHlwZTtcblx0XHRcdFx0XHRpZiAoZXZlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0XHRcdFx0aWYgKGNoZWNrU2l6ZShzaXplKSAmJiBpc1R5cGVWYWxpZCh0eXBlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5maWxlID0gZXZ0LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcoc2NvcGUuZmlsZU5hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuZmlsZU5hbWUgPSBuYW1lO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzWzBdO1xuXHRcdFx0XHRcdC8qbmFtZSA9IGZpbGUubmFtZTtcblx0XHRcdFx0XHR0eXBlID0gZmlsZS50eXBlO1xuXHRcdFx0XHRcdHNpemUgPSBmaWxlLnNpemU7XG5cdFx0XHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7Ki9cblx0XHRcdFx0XHRzY29wZS5maWxlID0gZmlsZTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdGaWxlRHJvcHpvbmVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Ly9yZXF1aXJlOiAnaXRlbScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpdGVtTW9kZWwgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0LypzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW1Nb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHR9KTsqL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFTZXJ2aWNlLCBDb250ZW50U2VydmljZSwgRGlhbG9nU2VydmljZSwgJGZpbHRlciwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblxuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5jaGVja0Z1bGwgPSBjaGVja0Z1bGw7XG5cblx0XHR2bS5jYXRlZ29yaWVzID0gW107XG5cdFx0dm0uZGF0YXByb3ZpZGVycyA9IFtdO1xuXHRcdHZtLnNlbGVjdGVkSXRlbSA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVGV4dCA9IG51bGw7XG5cdFx0dm0uc2VhcmNoVW5pdCA9IG51bGw7XG5cdFx0dm0ucXVlcnlTZWFyY2ggPSBxdWVyeVNlYXJjaDtcblx0XHR2bS5xdWVyeVVuaXQgPSBxdWVyeVVuaXQ7XG5cblx0XHR2bS5zYXZlID0gc2F2ZTtcblxuXHRcdHZtLmNyZWF0ZVByb3ZpZGVyID0gY3JlYXRlUHJvdmlkZXI7XG5cdFx0dm0uY3JlYXRlVW5pdCA9IGNyZWF0ZVVuaXQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2gocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0uZGF0YXByb3ZpZGVycywgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBxdWVyeVVuaXQocXVlcnkpIHtcblx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0ubWVhc3VyZVR5cGVzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmRhdGFwcm92aWRlcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uY2F0ZWdvcmllcyA9IENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3JpZXMoe3RyZWU6dHJ1ZX0pO1xuXHRcdFx0dm0ubWVhc3VyZVR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZWFzdXJlX3R5cGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0udHlwZSAmJiB2bS5pdGVtLmRhdGFwcm92aWRlciAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IElUUyBBIEhBQ0sgVE8gR0VUIElUIFdPUks6IG5nLWNsaWNrIHZzIG5nLW1vdXNlZG93blxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyKHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFByb3ZpZGVyJywgJHNjb3BlKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlVW5pdCh0ZXh0KXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRVbml0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHQgICAgdm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHQgIH1cblx0XHR9LHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3JNZW51JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRpdGVtOiAnPWl0ZW0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JNZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgY2wgPSAnYWN0aXZlJztcblx0XHRcdFx0dmFyIGVsID0gZWxlbWVudFswXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50KCk7XG5cdFx0XHRcdHBhcmVudC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yTWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0ubG9ja2VkID0gbG9ja2VkO1xuXHRcdHZtLmNoYW5nZU9mZmljaWFsID0gY2hhbmdlT2ZmaWNpYWw7XG5cblx0XHRmdW5jdGlvbiBsb2NrZWQoKXtcblx0XHRcdHJldHVybiB2bS5pdGVtLmlzX29mZmljaWFsID8gJ2xvY2tfb3BlbicgOiAnbG9jayc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoYW5nZU9mZmljaWFsKCl7XG5cdFx0XHR2bS5pdGVtLmlzX29mZmljaWFsID0gIXZtLml0ZW0uaXNfb2ZmaWNpYWw7XG5cdFx0XHR2bS5pdGVtLnNhdmUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS5tZWFzdXJlX3R5cGVfaWQgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JzL2luZGljYXRvcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9PycsXG5cdFx0XHRcdGluZGljYXRvcnM6ICc9aXRlbXMnLFxuXHRcdFx0XHRzZWxlY3Rpb246ICc9PycsXG5cdFx0XHRcdG9wdGlvbnM6Jz0/Jyxcblx0XHRcdFx0YWN0aXZlOiAnPT8nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2VsZWN0QWxsR3JvdXAgPSBzZWxlY3RBbGxHcm91cDtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW07XG5cdFx0dm0udG9nZ2xlU2VsZWN0aW9uID0gdG9nZ2xlU2VsZWN0aW9uO1xuXG5cblx0XHR2bS5maWx0ZXIgPSB7XG5cdFx0XHRzb3J0Oid0aXRsZScsXG5cdFx0XHRyZXZlcnNlOmZhbHNlLFxuXHRcdFx0bGlzdDogMCxcblx0XHRcdHB1Ymxpc2hlZDogZmFsc2UsXG5cdFx0XHR0eXBlczoge1xuXHRcdFx0XHR0aXRsZTogdHJ1ZSxcblx0XHRcdFx0c3R5bGU6IGZhbHNlLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiBmYWxzZSxcblx0XHRcdFx0aW5mb2dyYXBoaWM6IGZhbHNlLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZmFsc2UsXG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5zZWFyY2ggPSB7XG5cdFx0XHRxdWVyeTogJycsXG5cdFx0XHRzaG93OiBmYWxzZVxuXHRcdH07XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVMaXN0ID0gdG9nZ2xlTGlzdDtcblxuXG5cblx0XHRmdW5jdGlvbiB0b2dnbGVMaXN0KGtleSl7XG5cdFx0XHRpZih2bS52aXNpYmxlTGlzdCA9PSBrZXkpe1xuXHRcdFx0XHR2bS52aXNpYmxlTGlzdCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0udmlzaWJsZUxpc3QgPSBrZXk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RBbGwoKXtcblx0XHRcdGlmKHZtLnNlbGVjdGlvbi5sZW5ndGgpe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pbmRpY2F0b3JzLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpZih2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZVNlbGVjdGlvbihpdGVtKSB7XG5cdFx0XHR2YXIgaW5kZXggPSB2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0QWxsR3JvdXAoZ3JvdXApe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuXHRcdFx0JG1kT3Blbk1lbnUoZXYpO1xuXHRcdH1cblxuXHRcdC8qJHNjb3BlLiR3YXRjaCgndm0uc2VhcmNoLnF1ZXJ5JywgZnVuY3Rpb24gKHF1ZXJ5LCBvbGRRdWVyeSkge1xuXHRcdFx0aWYocXVlcnkgPT09IG9sZFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG5cdFx0XHR2bS5xdWVyeSA9IHZtLmZpbHRlci50eXBlcztcblx0XHRcdHZtLnF1ZXJ5LnEgPSBxdWVyeTtcblx0XHRcdHZtLml0ZW1zID0gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHZtLnF1ZXJ5KTtcblx0XHR9KTsqL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGl6ZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpemVzL2luZGl6ZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaXplc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaXplc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGZpbHRlciwgJHRpbWVvdXQsIHRvYXN0ciwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcblx0XHR2bS5zYXZlID0gc2F2ZTtcblxuXHRcdHZtLmJhc2VPcHRpb25zID0ge1xuXHRcdFx0ZHJhZzp0cnVlLFxuXHRcdFx0YWxsb3dEcm9wOnRydWUsXG5cdFx0XHRhbGxvd0RyYWc6dHJ1ZSxcblx0XHRcdGFsbG93TW92ZTp0cnVlLFxuXHRcdFx0YWxsb3dTYXZlOnRydWUsXG5cdFx0XHRhbGxvd0RlbGV0ZTp0cnVlLFxuXHRcdFx0YWxsb3dBZGRDb250YWluZXI6dHJ1ZSxcblx0XHRcdGFsbG93QWRkOnRydWUsXG5cdFx0XHRlZGl0YWJsZTp0cnVlLFxuXHRcdFx0YXNzaWdtZW50czogdHJ1ZSxcblx0XHRcdHNhdmVDbGljazogc2F2ZSxcblx0XHRcdGFkZENsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuYWRkQ2xpY2ssXG5cdFx0XHRhZGRDb250YWluZXJDbGljazogdm0ub3B0aW9ucy5pbmRpemVzLmFkZENvbnRhaW5lckNsaWNrLFxuXHRcdFx0ZGVsZXRlRHJvcDogdm0ub3B0aW9ucy5pbmRpemVzLmRlbGV0ZURyb3AsXG5cdFx0XHRkZWxldGVDbGljazogdm0ub3B0aW9ucy5pbmRpemVzLmRlbGV0ZUNsaWNrXG5cdFx0fTtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uY2F0ZWdvcmllcyA9IENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3JpZXMoe3RyZWU6dHJ1ZX0pO1xuXHRcdFx0dm0uc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnKS4kb2JqZWN0O1xuXHRcdFx0dm0udHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4L3R5cGVzJykuJG9iamVjdDtcblxuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uaWQgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLml0ZW0uaXRlbV90eXBlX2lkID0gMTtcblx0XHRcdFx0dm0uaXRlbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoKXtcblx0XHRcdGlmICh2bS5pdGVtLnRpdGxlICYmIHZtLml0ZW0uaXRlbV90eXBlX2lkICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbCgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gY2hlY2tCYXNlKCkgJiYgdm0uaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZSgpe1xuXHRcdFx0aWYodm0uaXRlbS5pZCl7XG5cdFx0XHRcdHZtLml0ZW0uc2F2ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdEYXRhIHN1Y2Nlc3NmdWxseSB1cGRhdGVkIScsICdTdWNjZXNzZnVsbHkgc2F2ZWQnKTtcblx0XHRcdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS51cGRhdGVJdGVtKHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtpZDp2bS5pdGVtLmlkLG5hbWU6cmVzcG9uc2UubmFtZX0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2luZGV4Jywgdm0uaXRlbSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0aWYocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0RhdGEgc3VjY2Vzc2Z1bGx5IHNhdmVkIScsICdTdWNjZXNzZnVsbHkgc2F2ZWQnKTtcblx0XHRcdFx0XHRcdHZtLml0ZW0uaXNEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS5hZGRJdGVtKHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtpZDpyZXNwb25zZS5pZCwgbmFtZTpyZXNwb25zZS5uYW1lfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlSXRlbXMoZXZlbnQsIGl0ZW0pe1xuXHRcdC8vXHRjb25zb2xlLmxvZyh2bS5pdGVtLCBpdGVtKTtcblxuXHRcdH1cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHRcdH1cblx0XHR9LHRydWUpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtZWRpYW4nLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpZDogJ2dyYWRpZW50Jyxcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiA0MCxcblx0XHRcdFx0aW5mbzogdHJ1ZSxcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGhhbmRsaW5nOiB0cnVlLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRsZWZ0OiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0dG9wOiAxMCxcblx0XHRcdFx0XHRib3R0b206IDEwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbG9yczogWyB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMCxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdHZhciBtYXggPSAwLCBtaW4gPSAwO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXG5cdFx0XHRcdG9wdGlvbnMudW5pcXVlID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNzcygnaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQgKyAncHgnKS5jc3MoJ2JvcmRlci1yYWRpdXMnLCBvcHRpb25zLmhlaWdodCAvIDIgKyAncHgnKTtcblxuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSlcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciByZWN0ID0gc3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSkrICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KG1pbilcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCAnbG93ZXJWYWx1ZScpO1xuXHRcdFx0XHRcdHZhciBsZWdlbmQyID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC0gKG9wdGlvbnMuaGVpZ2h0IC8gMikpICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdlbmRMYWJlbCcpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMilcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHQvL1RET0RPOiBDSGNraWNrIGlmIG5vIGNvbW1hIHRoZXJlXG5cdFx0XHRcdFx0XHRcdGlmKG1heCA+IDEwMDApe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgJ3VwcGVyVmFsdWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB4LmludmVydChkMy5tb3VzZSh0aGlzKVswXSk7XG5cdFx0XHRcdFx0XHRicnVzaC5leHRlbnQoW3ZhbHVlLCB2YWx1ZV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHBhcnNlSW50KHZhbHVlKSA+IDEwMDApe1xuXHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQodmFsdWUpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQodi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF0sXG5cdFx0XHRcdFx0XHRjb3VudCA9IDAsXG5cdFx0XHRcdFx0XHRmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdHZhciBmaW5hbCA9IFwiXCI7XG5cdFx0XHRcdFx0ZG8ge1xuXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRmaW5hbCA9IG5hdDtcblx0XHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUgPiA1MCA/IHZhbHVlIC0gMSA6IHZhbHVlICsgMTtcblx0XHRcdFx0XHR9IHdoaWxlICghZm91bmQgJiYgY291bnQgPCBtYXgpO1xuXG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gbi5jb2xvcjtcblx0XHRcdFx0XHRncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrXCJfXCIrbi5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlY3Quc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICdfJytuLmNvbG9yKycpJyk7XG5cdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0aWYobmdNb2RlbC4kbW9kZWxWYWx1ZSl7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dCgwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQoMCkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCgwKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PSBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdFx0bWluID0gMDtcblx0XHRcdFx0XHRcdG1heCA9IDA7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRtYXggPSBkMy5tYXgoW21heCwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdFx0XHRpZihuYXQuaXNvID09IG5nTW9kZWwuJG1vZGVsVmFsdWUuaXNvKXtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdFx0XHQuZG9tYWluKFttaW4sIG1heF0pXG5cdFx0XHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cdFx0XHRcdFx0XHRicnVzaC54KHgpXG5cdFx0XHRcdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cdFx0XHRcdFx0XHRsZWdlbmQuc2VsZWN0KCcjbG93ZXJWYWx1ZScpLnRleHQobWluKTtcblx0XHRcdFx0XHRcdGxlZ2VuZDIuc2VsZWN0KCcjdXBwZXJWYWx1ZScpLnRleHQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0XHRpZihtYXggPiAxMDAwKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludChtYXgpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiIDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWF4XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmKG5hdC5pc28gPT0gbmdNb2RlbC4kbW9kZWxWYWx1ZS5pc28pe1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuYXRbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2VDb25mbGljdENzdicsIGZ1bmN0aW9uKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvcGFyc2VDb25mbGljdENzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZUNvbmZsaWN0Q3N2Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRuYXRpb25zOiAnPScsXG5cdFx0XHRcdHN1bTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cblx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHRzY29wZS5uYXRpb25zID0gW107XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0c3RlcDogZnVuY3Rpb24gKHJvdykge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBudW1iZXJzID0gcm93LmRhdGFbMF0uY29uZmxpY3RzLm1hdGNoKC9bMC05XSsvZykubWFwKGZ1bmN0aW9uKG4pXG5cdFx0XHRcdFx0XHRcdFx0ey8vanVzdCBjb2VyY2UgdG8gbnVtYmVyc1xuXHRcdFx0XHRcdFx0XHRcdCAgICByZXR1cm4gKyhuKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS5ldmVudHMgPSBudW1iZXJzO1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLnN1bSArPSBudW1iZXJzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5uYXRpb25zLnB1c2gocm93LmRhdGFbMF0pO1xuXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2VDb25mbGljdENzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2VDb25mbGljdEV2ZW50c0NzdicsIGZ1bmN0aW9uKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZUNvbmZsaWN0RXZlbnRzQ3N2Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRldmVudHM6ICc9Jyxcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblx0c2NvcGUuZXZlbnRzID0gW107XG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0c3RlcDogZnVuY3Rpb24gKHJvdykge1xuXHRcdFx0XHRcdFx0XHRcdHN3aXRjaCAocm93LmRhdGFbMF0udHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaW50ZXJzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2ludHJhc3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdzdWJzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYocm93LmVycm9ycy5sZW5ndGggPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRzY29wZS5ldmVudHMucHVzaChyb3cuZGF0YVswXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyb3cpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y29tcGxldGU6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZUNvbmZsaWN0RXZlbnRzQ3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgncGFyc2Vjc3YnLCBmdW5jdGlvbiAoJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyLCBJbmRleFNlcnZpY2UpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZWNzdi9wYXJzZWNzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZWNzdkN0cmwnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cblx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFBhcGEpO1xuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBpbnB1dFswXS5maWxlc1swXS5zaXplO1xuXHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0sIHtcblx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZmFzdE1vZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vd29ya2VyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHQvL0lGIFwic3RlcFwiIGluc3RlYWQgb2YgXCJjaHVua1wiID4gY2h1bmsgPSByb3cgYW5kIGNodW5rLmRhdGEgPSByb3cuZGF0YVswXVxuXHRcdFx0XHRcdFx0XHRjaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNodW5rLmRhdGEsIGZ1bmN0aW9uIChyb3csIGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOnt9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6W11cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIC8qfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBrZXksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ci5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5Lmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJhd0xpc3Rba2V5XS5kYXRhID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCI6IHIgPiByb3cuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHIuZGF0YSA9IHJvdztcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YShyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24gKGNodW5rKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvL0NoZWNrIGlmIHRoZXJlIGFyZSBwb2ludHMgaW4gdGhlIGhlYWRlcnNcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBjaHVuay5tYXRjaCgvXFxyXFxufFxccnxcXG4vKS5pbmRleDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgZGVsaW1pdGVyID0gJywnO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoJywnKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPCAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoXCJcXHRcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxpbWl0ZXIgPSAnXFx0Jztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlzSXNvID0gW107XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0ucmVwbGFjZSgvW15hLXowLTldL2dpLCAnXycpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0uc3Vic3RyKDAsIGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWQgPSBoZWFkaW5nc1tpXS5zcGxpdCgnXycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSAnJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGhlYWQubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpc05hTihoZWFkW2pdKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaiA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSArPSAnXyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gaGVhZFtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0ubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0lzby5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5ncy5sZW5ndGggPT0gaXNJc28ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtoZWFkaW5nc1tpXV0gPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBoZWFkaW5ncy5qb2luKGRlbGltaXRlcikgKyBjaHVuay5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKGVyciwgZmlsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKHJlc3VsdHMpIHtcblxuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRFcnJvcnMoZXJyb3JzKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFpc1ZlcnRpY2FsKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goSW5kZXhTZXJ2aWNlLmdldEZpcnN0RW50cnkoKS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0Q291bnRyeUZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3llYXInKSAhPSAtMSAmJiBpdGVtLnRvU3RyaW5nKCkubGVuZ3RoID09IDQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0WWVhckZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmF3TGlzdCwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS50b0xvd2VyQ2FzZSgpICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGtleSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc286IGtleS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbiAoY29sdW1uLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyWydjb2x1bW5fJyArIGldID0gY29sdW1uO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGNvbHVtbikgfHwgY29sdW1uIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIk5BXCIgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogXCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkRGF0YSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbcl0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6IGl0ZW0uZXJyb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKCdpc28nKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5pbmZvKEluZGV4U2VydmljZS5nZXREYXRhU2l6ZSgpICsgJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZWNzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwaWVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BpZWNoYXJ0Q3RybCcsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6ICc9Y2hhcnREYXRhJyxcblx0XHRcdFx0YWN0aXZlVHlwZTogJz0nLFxuXHRcdFx0XHRhY3RpdmVDb25mbGljdDogJz0nLFxuXHRcdFx0XHRjbGlja0l0OicmJ1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0IGZ1bmN0aW9uIHNlZ0NvbG9yKGMpeyByZXR1cm4ge2ludGVyc3RhdGU6XCIjODA3ZGJhXCIsIGludHJhc3RhdGU6XCIjZTA4MjE0XCIsc3Vic3RhdGU6XCIjNDFhYjVkXCJ9W2NdOyB9XG5cblx0XHRcdFx0dmFyIHBDID17fSwgcGllRGltID17dzoxNTAsIGg6IDE1MH07XG4gICAgICAgIHBpZURpbS5yID0gTWF0aC5taW4ocGllRGltLncsIHBpZURpbS5oKSAvIDI7XG5cblx0XHRcdFx0dmFyIHBpZXN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGllRGltLncpXG5cdFx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdvdXRlci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cdFx0XHRcdHZhciBwaWVzdmcyID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwaWVEaW0udylcblx0XHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIHBpZURpbS5oKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2lubmVyLXBpZScpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrcGllRGltLncvMitcIixcIitwaWVEaW0uaC8yK1wiKVwiKTtcblxuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gZHJhdyB0aGUgYXJjcyBvZiB0aGUgcGllIHNsaWNlcy5cbiAgICAgICAgdmFyIGFyYyA9IGQzLnN2Z1xuXHRcdFx0XHRcdC5hcmMoKVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhwaWVEaW0uciAtIDEwKVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhwaWVEaW0uciAtIDIzKTtcbiAgICAgICAgdmFyIGFyYzIgPSBkMy5zdmdcblx0XHRcdFx0XHQuYXJjKClcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMocGllRGltLnIgLSAyMylcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgcGllIHNsaWNlIGFuZ2xlcy5cbiAgICAgICAgdmFyIHBpZSA9IGQzLmxheW91dFxuXHRcdFx0XHRcdC5waWUoKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuY291bnQ7IH0pO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBjMSA9IHBpZXN2Z1xuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpLmF0dHIoXCJkXCIsIGFyYylcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLG1vdXNlb3Zlcikub24oXCJtb3VzZW91dFwiLG1vdXNlb3V0KTtcblx0XHRcdFx0dmFyIGMyID0gcGllc3ZnMlxuXHRcdFx0XHRcdFx0LmRhdHVtKHNjb3BlLmRhdGEpXG5cdFx0XHRcdFx0XHQuc2VsZWN0QWxsKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0LmRhdGEocGllKVxuXHRcdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjMilcblx0XHQgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG5cdFx0ICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0YS5jb2xvcjsgfSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXHRcdCAgICAgICAgLm9uKCdjbGljaycsIG1vdXNlY2xpY2spO1xuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gdXBkYXRlIHBpZS1jaGFydC4gVGhpcyB3aWxsIGJlIHVzZWQgYnkgaGlzdG9ncmFtLlxuICAgICAgICBwQy51cGRhdGUgPSBmdW5jdGlvbihuRCl7XG4gICAgICAgICAgICBwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuRCkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFV0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3ZlciBhIHBpZSBzbGljZS5cblx0XHRcdFx0dmFyIHR5cGV1cyA9IGFuZ3VsYXIuY29weShzY29wZS5hY3RpdmVUeXBlKTtcblx0XHRcdFx0ZnVuY3Rpb24gbW91c2VjbGljayhkKXtcblx0XHRcdFx0XHRzY29wZS5jbGlja0l0KHt0eXBlX2lkOmQuZGF0YS50eXBlX2lkfSk7XG5cdFx0XHRcdH1cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdmVyKGQpe1xuICAgICAgICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIG9mIGhpc3RvZ3JhbSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0XHRcdFx0dHlwZXVzID0gYW5ndWxhci5jb3B5KHNjb3BlLmFjdGl2ZVR5cGUpO1xuICAgICAgICAgICAgc2NvcGUuYWN0aXZlVHlwZSA9IFtkLmRhdGEudHlwZV9pZF07XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvL1V0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3V0IGEgcGllIHNsaWNlLlxuICAgICAgICBmdW5jdGlvbiBtb3VzZW91dChkKXtcbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBvZiBoaXN0b2dyYW0gd2l0aCBhbGwgZGF0YS5cbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZVR5cGUgPSB0eXBldXM7XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbmltYXRpbmcgdGhlIHBpZS1zbGljZSByZXF1aXJpbmcgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggc3BlY2lmaWVzXG4gICAgICAgIC8vIGhvdyB0aGUgaW50ZXJtZWRpYXRlIHBhdGhzIHNob3VsZCBiZSBkcmF3bi5cbiAgICAgICAgZnVuY3Rpb24gYXJjVHdlZW4oYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYyhpKHQpKTsgICAgfTtcbiAgICAgICAgfVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbjIoYSkge1xuICAgICAgICAgICAgdmFyIGkgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBhKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIGFyYzIoaSh0KSk7ICAgIH07XG4gICAgICAgIH1cblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0cGllc3ZnLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKTtcblx0XHRcdFx0XHRwaWVzdmcyLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShwaWUobikpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuMik7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGllY2hhcnRDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3JvdW5kYmFyJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdSb3VuZGJhckN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuXHRcdFx0XHR2YXIgbWFyZ2luID0ge1xuXHRcdFx0XHRcdFx0dG9wOiA0MCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdGJvdHRvbTogMzAsXG5cdFx0XHRcdFx0XHRsZWZ0OiA0MFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0d2lkdGggPSAzMDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcblx0XHRcdFx0XHRoZWlnaHQgPSAyMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcblx0XHRcdFx0XHRiYXJXaWR0aCA9IDIwLFxuXHRcdFx0XHRcdHNwYWNlID0gMjU7XG5cblxuXHRcdFx0XHR2YXIgc2NhbGUgPSB7XG5cdFx0XHRcdFx0eTogZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0fTtcblx0XHRcdFx0c2NhbGUueS5kb21haW4oWzAsIDIyMF0pO1xuXHRcdFx0XHRzY2FsZS55LnJhbmdlKFtoZWlnaHQsIDBdKTtcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcblxuXHRcdFx0XHQvL3guZG9tYWluKHNjb3BlLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGV0dGVyOyB9KSk7XG5cdFx0XHRcdC8veS5kb21haW4oWzAsIGQzLm1heChzY29wZS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZyZXF1ZW5jeTsgfSldKTtcblx0XHRcdFx0dmFyIGJhcnMgPSBzdmcuc2VsZWN0QWxsKCcuYmFycycpLmRhdGEoc2NvcGUuZGF0YSkuZW50ZXIoKS5hcHBlbmQoXCJnXCIpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTsgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGkgKiAyMCArIFwiLCAwKVwiOyB9KTs7XG5cblx0XHRcdFx0dmFyIGJhcnNCZyA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAwLCBiYXJXaWR0aCwgKGhlaWdodCksIGJhcldpZHRoIC8gMiwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2JnJyk7XG5cdFx0XHRcdHZhciB2YWx1ZUJhcnMgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8qLmF0dHIoJ3gnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNjYWxlLnkoZC52YWx1ZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pKi9cblxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi50cmFuc2l0aW9uKClcblx0XHRcdFx0XHQuZHVyYXRpb24oMzAwMClcblx0XHRcdFx0XHQuZWFzZShcInF1YWRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVpZ2h0IC0gc2NhbGUueShkLnZhbHVlKVxuXHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0O1xuXG5cdFx0XHRcdHZhciB2YWx1ZVRleHQgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZChcInRleHRcIik7XG5cblx0XHRcdFx0dmFsdWVUZXh0LnRleHQoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQudmFsdWVcblx0XHRcdFx0XHR9KS5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAtOClcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywnIzRmYjBlNScpO1xuXG5cdFx0XHRcdHZhciBsYWJlbHNUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdGxhYmVsc1RleHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmxhYmVsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgaGVpZ2h0ICsgMjApXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3Jcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdGZ1bmN0aW9uIHJvdW5kZWRfcmVjdCh4LCB5LCB3LCBoLCByLCB0bCwgdHIsIGJsLCBicikge1xuXHRcdFx0XHRcdHZhciByZXR2YWw7XG5cdFx0XHRcdFx0cmV0dmFsID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5O1xuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICh3IC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmICh0cikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIChoIC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmIChicikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKDIgKiByIC0gdyk7XG5cdFx0XHRcdFx0aWYgKGJsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArICgyICogciAtIGgpO1xuXHRcdFx0XHRcdGlmICh0bCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwielwiO1xuXHRcdFx0XHRcdHJldHVybiByZXR2YWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vc2NhbGUueS5kb21haW4oWzAsIDUwXSk7XG5cblx0XHRcdFx0XHRcdHZhbHVlQmFycy50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5hdHRyKCdkJywgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBib3JkZXJzID0gYmFyV2lkdGggLyAyO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHNjb3BlLmRhdGFbaV0udmFsdWUgPD0gMTApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVycyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAoc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJhcldpZHRoLCAoaGVpZ2h0IC0gc2NhbGUueShzY29wZS5kYXRhW2ldLnZhbHVlKSksIGJvcmRlcnMsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dmFsdWVUZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQsaSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZC52YWx1ZSksIHBhcnNlSW50KHNjb3BlLmRhdGFbaV0udmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHR9KS5lYWNoKCdlbmQnLCBmdW5jdGlvbihkLCBpKXtcblx0XHRcdFx0XHRcdFx0XHRkLnZhbHVlID0gc2NvcGUuZGF0YVtpXS52YWx1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUm91bmRiYXJDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTaW1wbGVsaW5lY2hhcnRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRkYXRhOic9Jyxcblx0XHRcdFx0c2VsZWN0aW9uOic9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblxuXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGludmVydDpmYWxzZVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2bS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgdm0ub3B0aW9ucyk7XG5cdFx0dm0uY29uZmlnID0ge1xuXHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZXh0ZW5kZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0YXV0b3JlZnJlc2g6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdHJlZnJlc2hEYXRhT25seTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hPcHRpb25zOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWVwV2F0Y2hEYXRhOiB0cnVlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdHZtLmNoYXJ0ID0ge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRjaGFydDoge31cblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBbXVxuXHRcdH07XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRzZXRDaGFydCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVDaGFydCgpe1xuXHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC5mb3JjZVkgPSBbdm0ucmFuZ2UubWF4LCB2bS5yYW5nZS5taW5dO1xuXHRcdH1cblx0IFx0ZnVuY3Rpb24gc2V0Q2hhcnQoKSB7XG5cdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0ZHVyYXRpb246MTAwLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHg6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0fSxcblx0XHRcdFx0eTogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaG93TGVnZW5kOiBmYWxzZSxcblx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdC8vc2hvd1lBeGlzOiBmYWxzZSxcblxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0Ly91c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0Zm9yY2VZOiBbdm0ucmFuZ2UubWF4LCB2bS5yYW5nZS5taW5dLFxuXHRcdFx0XHQvL3lEb21haW46W3BhcnNlSW50KHZtLnJhbmdlLm1pbiksIHZtLnJhbmdlLm1heF0sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnWWVhcicsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdGlmICh2bS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQuZm9yY2VZID0gW3BhcnNlSW50KHZtLnJhbmdlLm1heCksIHZtLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5jaGFydClcblx0XHRcdHJldHVybiB2bS5jaGFydDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlR3JhcGgoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHR2bS5yYW5nZSA9IHtcblx0XHRcdFx0bWF4OiAwLFxuXHRcdFx0XHRtaW46IDEwMDBcblx0XHRcdH07XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGlkOiBrZXksXG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChkYXRhLCBrKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWQ6IGssXG5cdFx0XHRcdFx0XHR4OiBkYXRhW2l0ZW0uZmllbGRzLnhdLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmZpZWxkcy55XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1heCA9IE1hdGgubWF4KHZtLnJhbmdlLm1heCwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWluID0gTWF0aC5taW4odm0ucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0ucmFuZ2UubWF4Kys7XG5cdFx0XHR2bS5yYW5nZS5taW4tLTtcblx0XHRcdHZtLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRpZiAodm0ub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydC55RG9tYWluID0gW3BhcnNlSW50KHZtLnJhbmdlLm1heCksIHZtLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdHVwZGF0ZUNoYXJ0KCk7XG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5zZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdC8vXHR1cGRhdGVDaGFydCgpO1xuXHRcdFx0Ly9jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmFuaW1hdGlvbignLnNsaWRlLXRvZ2dsZXMnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzdHlsZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N0eWxlcy9zdHlsZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3R5bGVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRzdHlsZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N0eWxlc0N0cmwnLCBmdW5jdGlvbiAodG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS50b2dnbGVTdHlsZSA9IHRvZ2dsZVN0eWxlO1xuXHRcdHZtLnNlbGVjdGVkU3R5bGUgPSBzZWxlY3RlZFN0eWxlO1xuXHRcdHZtLnNhdmVTdHlsZSA9IHNhdmVTdHlsZTtcblx0XHR2bS5zdHlsZSA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU3R5bGUoc3R5bGUpIHtcblx0XHRcdGlmICh2bS5pdGVtLnN0eWxlX2lkID09IHN0eWxlLmlkKSB7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGVfaWQgPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IHN0eWxlLmlkXG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBzdHlsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRTdHlsZShpdGVtLCBzdHlsZSkge1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVTdHlsZSgpIHtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ3N0eWxlcycsIHZtLnN0eWxlKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHZtLnN0eWxlcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHR2bS5jcmVhdGVTdHlsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLnN0eWxlID0gW107XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBkYXRhO1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnTmV3IFN0eWxlIGhhcyBiZWVuIHNhdmVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cblx0XHRcdFx0XHQvL3JldHVybiA7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnI2NjYyc7XG5cdFx0XHRcdFx0XHQvKnZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7Ki9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMDAnLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZW1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdUcmVlbWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRpdGVtOic9PycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/J1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdUcmVlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3RyZWV2aWV3JywgZnVuY3Rpb24oUmVjdXJzaW9uSGVscGVyKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRlZGl0V2VpZ2h0OmZhbHNlLFxuXHRcdFx0ZHJhZzogZmFsc2UsXG5cdFx0XHRlZGl0OiBmYWxzZSxcblx0XHRcdGNoaWxkcmVuOidjaGlsZHJlbidcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWV2aWV3L3RyZWV2aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWV2aWV3Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbXM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nLFxuXHRcdFx0XHRvcHRpb25zOic9PycsXG5cdFx0XHRcdGFjdGl2ZTogJz0/Jyxcblx0XHRcdFx0Y2xpY2s6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnNpb25IZWxwZXIuY29tcGlsZShlbGVtZW50LCBmdW5jdGlvbihzY29wZSwgaUVsZW1lbnQsIGlBdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZUZuKXtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmV4dGVuZChvcHRpb25zLCBzY29wZS52bS5vcHRpb25zKVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmluZSB5b3VyIG5vcm1hbCBsaW5rIGZ1bmN0aW9uIGhlcmUuXG4gICAgICAgICAgICAgICAgLy8gQWx0ZXJuYXRpdmU6IGluc3RlYWQgb2YgcGFzc2luZyBhIGZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gYWxzbyBwYXNzIGFuIG9iamVjdCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gYSAncHJlJy0gYW5kICdwb3N0Jy1saW5rIGZ1bmN0aW9uLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVHJlZXZpZXdDdHJsJywgZnVuY3Rpb24oJGZpbHRlcikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW07XG5cdFx0dm0uY2hpbGRTZWxlY3RlZCA9IGNoaWxkU2VsZWN0ZWQ7XG5cdFx0dm0udG9nZ2xlU2VsZWN0aW9uID0gdG9nZ2xlU2VsZWN0aW9uO1xuXHRcdHZtLm9uRHJhZ092ZXIgPSBvbkRyYWdPdmVyO1xuXHRcdHZtLm9uRHJvcENvbXBsZXRlID0gb25Ecm9wQ29tcGxldGU7XG5cdFx0dm0ub25Nb3ZlZENvbXBsZXRlID0gb25Nb3ZlZENvbXBsZXRlO1xuXHRcdHZtLmFkZENoaWxkcmVuID0gYWRkQ2hpbGRyZW47XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5zZWxlY3Rpb24gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQsIGluZGV4LCBleHRlcm5hbCwgdHlwZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ecm9wQ29tcGxldGUoZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gMCl7XG5cdFx0XHRcdFx0dm0uaXRlbXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdmVkQ29tcGxldGUoaW5kZXgsIGRhdGEsIGV2dCkge1xuXHRcdFx0aWYodm0ub3B0aW9ucy5hbGxvd01vdmUpe1xuXHRcdFx0XHRyZXR1cm4gdm0uaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIGluZGV4ID0gLTE7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihzZWxlY3RlZCwgaSl7XG5cdFx0XHRcdGlmKHNlbGVjdGVkLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZihpbmRleCA+IC0xKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gYWRkQ2hpbGRyZW4oaXRlbSkge1xuXG5cdFx0XHRpdGVtLmNoaWxkcmVuID0gW107XG5cdFx0XHRpdGVtLmV4cGFuZGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbihzZWxlY3RlZCl7XG5cdFx0XHRcdGlmKHNlbGVjdGVkLmlkID09IGl0ZW0uaWQpe1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0LypcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGFuZ3VsYXIuY29weShpdGVtKSkgPiAtMSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlOyovXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hpbGRTZWxlY3RlZChpdGVtKSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG5cdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGNoaWxkKT4gLTEpe1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighZm91bmQpe1xuXHRcdFx0XHRcdGZvdW5kID0gIGNoaWxkU2VsZWN0ZWQoY2hpbGQpO1xuXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0fVxuXG5cdFx0LypmdW5jdGlvbiB0b2dnbGVJdGVtKGl0ZW0pIHtcblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID09PSBcInVuZGVmaW5lZFwiKSB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0gPSBbXTtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlLFxuXHRcdFx0XHRpbmRleCA9IC0xO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSwgZnVuY3Rpb24oZW50cnksIGkpIHtcblx0XHRcdFx0aWYgKGVudHJ5LmlkID09IGl0ZW0uaWQpIHtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0aW5kZXggPT09IC0xID8gdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnB1c2goaXRlbSkgOiB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcblx0XHR9Ki9cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnd2VpZ2h0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvd2VpZ2h0L3dlaWdodC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdXZWlnaHRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOiB7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbXM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXZWlnaHRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLnJhaXNlV2VpZ2h0ID0gcmFpc2VXZWlnaHQ7XG5cdFx0dm0ubG93ZXJXZWlnaHQgPSBsb3dlcldlaWdodDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGNhbGNTdGFydCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNTdGFydCgpIHtcblxuXHRcdFx0aWYgKHR5cGVvZiB2bS5pdGVtLndlaWdodCA9PSBcInVuZGVmaW5lZFwiIHx8ICF2bS5pdGVtLndlaWdodCkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0ZW50cnkud2VpZ2h0ID0gMTAwIC8gdm0uaXRlbXMubGVuZ3RoO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNWYWx1ZXMoKSB7XG5cdFx0XHR2YXIgZml4ZWQgPSB2bS5pdGVtLndlaWdodDtcblx0XHRcdHZhciByZXN0ID0gKDEwMCAtIGZpeGVkKSAvICh2bS5pdGVtcy5sZW5ndGggLSAxKTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtcywgZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0aWYgKGVudHJ5ICE9PSB2bS5pdGVtKSB7XG5cdFx0XHRcdFx0ZW50cnkud2VpZ2h0ID0gcmVzdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByYWlzZVdlaWdodCgpIHtcblx0XHRcdGlmKHZtLml0ZW0ud2VpZ2h0ID49IDk1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgKz0gNTtcblx0XHRcdH1cblx0XHRcdGNhbGNWYWx1ZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb3dlcldlaWdodCgpIHtcblx0XHRcdGlmKHZtLml0ZW0ud2VpZ2h0IDw9IDUpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmICh2bS5pdGVtLndlaWdodCAlIDUgIT0gMCkge1xuXHRcdFx0XHR2bS5pdGVtLndlaWdodCA9IDUgKiBNYXRoLnJvdW5kKHZtLml0ZW0ud2VpZ2h0IC8gNSkgLSA1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgLT0gNTtcblx0XHRcdH1cblx0XHRcdGNhbGNWYWx1ZXMoKTtcblx0XHR9XG5cblxuXHR9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
